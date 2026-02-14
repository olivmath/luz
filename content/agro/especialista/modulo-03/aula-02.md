# Aula 3.2: Credit Enhancement On-Chain

## Abertura

Bem-vindo a aula 3.2 do Modulo 3 — Waterfall e Automacao de Pagamentos. Na aula anterior, implementamos a logica de cascata de pagamentos (waterfall) em smart contracts, com maquina de estados e distribuicao por prioridade. Agora, vamos construir os mecanismos de credit enhancement — as camadas de protecao adicionais que reduzem o risco de credito para os investidores. No mercado tradicional, esses mecanismos existem em documentos juridicos e dependem de agentes humanos para serem executados. On-chain, eles se tornam automaticos, transparentes e autoexecutaveis. Vamos implementar overcollateral com health factor, liquidacao automatica, fundo de reserva e integracao com seguro parametrico — tudo aplicado a securitizacoes de recebiveis do agronegocio.

### Programa da aula:

1. Overcollateral e health factor (ratio entre lastro e emissao via oraculo, liquidacao automatica)
2. Fundo de reserva on-chain (acumulo percentual dos pagamentos, regras de liberacao)
3. Integracao com seguro parametrico (trigger climatico, payout automatico)

---

## 1. Overcollateral e health factor

### O conceito de overcollateral em securitizacoes agro

Overcollateral (sobrecolateralizacao) significa que o valor dos recebiveis que lastreiam a operacao e superior ao valor dos titulos emitidos. Se um CRA emite R$ 100 milhoes em cotas, o lastro em recebiveis pode ser de R$ 130 milhoes, gerando uma sobrecolateralizacao de 30%. Esse excedente funciona como primeira linha de defesa: se parte dos devedores nao pagar, o valor restante dos recebiveis ainda cobre as cotas emitidas.

No mundo DeFi, esse conceito e familiar — protocolos como Aave e Compound exigem overcollateral para emprestimos. A diferenca e que, em securitizacoes agro, o colateral sao recebiveis de CPR financeiras, contratos de fornecimento de graos, duplicatas de insumos agricolas — ativos que precisam ser precificados via oraculos.

### Health factor: monitoramento continuo da saude do colateral

O health factor (fator de saude) e a metrica central que indica se a operacao esta adequadamente colateralizada:

```
Health Factor = (Valor do Lastro via Oraculo) / (Saldo Devedor Total das Cotas)
```

- **HF > 1.5**: operacao saudavel, margem confortavel
- **HF entre 1.0 e 1.5**: zona de alerta, pode exigir reforco de colateral
- **HF < 1.0**: subcolateralizado, aciona liquidacao

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title Interface do oraculo de preco do colateral agro
interface ICollateralOracle {
    /// @notice Retorna o valor total do lastro em unidades da stablecoin (6 decimais)
    function getCollateralValue() external view returns (uint256 value, uint256 timestamp);
}

/// @title CreditEnhancement - Overcollateral e Health Factor
/// @notice Gerencia colateralizacao de securitizacao agro on-chain
contract CreditEnhancement is AccessControl, ReentrancyGuard {

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant LIQUIDATOR_ROLE = keccak256("LIQUIDATOR_ROLE");

    ICollateralOracle public collateralOracle;
    IERC20 public paymentToken;

    // Parametros de colateralizacao (em basis points, 10000 = 100%)
    uint256 public targetCollateralRatioBps;   // Ex: 13000 = 130%
    uint256 public warningThresholdBps;        // Ex: 12000 = 120%
    uint256 public liquidationThresholdBps;    // Ex: 10500 = 105%
    uint256 public liquidationPenaltyBps;      // Ex: 500 = 5% de penalidade

    // Saldo devedor total das cotas emitidas
    uint256 public totalOutstandingDebt;

    // Estado de colateralizacao
    enum CollateralState { HEALTHY, WARNING, LIQUIDATING }
    CollateralState public collateralState;

    // Registro de colateral adicional depositado
    mapping(address => uint256) public additionalCollateral;
    uint256 public totalAdditionalCollateral;

    // Historico de health factor
    struct HealthSnapshot {
        uint256 timestamp;
        uint256 collateralValue;
        uint256 debtValue;
        uint256 healthFactorBps;
    }
    HealthSnapshot[] public healthHistory;

    event HealthFactorUpdated(uint256 healthFactorBps, CollateralState state);
    event CollateralAdded(address indexed depositor, uint256 amount);
    event CollateralWithdrawn(address indexed to, uint256 amount);
    event LiquidationTriggered(uint256 healthFactorBps, uint256 collateralValue, uint256 debtValue);
    event WarningIssued(uint256 healthFactorBps, uint256 period);

    constructor(
        address _oracle,
        address _paymentToken,
        uint256 _targetRatioBps,
        uint256 _warningBps,
        uint256 _liquidationBps,
        uint256 _penaltyBps,
        uint256 _initialDebt,
        address _admin
    ) {
        collateralOracle = ICollateralOracle(_oracle);
        paymentToken = IERC20(_paymentToken);
        targetCollateralRatioBps = _targetRatioBps;
        warningThresholdBps = _warningBps;
        liquidationThresholdBps = _liquidationBps;
        liquidationPenaltyBps = _penaltyBps;
        totalOutstandingDebt = _initialDebt;
        collateralState = CollateralState.HEALTHY;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(OPERATOR_ROLE, _admin);
    }

    /// @notice Calcula o health factor atual
    /// @return healthFactorBps Health factor em basis points (10000 = 1.0)
    function calculateHealthFactor() public view returns (uint256 healthFactorBps) {
        if (totalOutstandingDebt == 0) return type(uint256).max;

        (uint256 collateralValue, ) = collateralOracle.getCollateralValue();
        uint256 totalCollateral = collateralValue + totalAdditionalCollateral;

        healthFactorBps = (totalCollateral * 10000) / totalOutstandingDebt;
    }

    /// @notice Atualiza o estado de colateralizacao com base no health factor
    function updateCollateralState() external onlyRole(OPERATOR_ROLE) {
        uint256 hf = calculateHealthFactor();
        (uint256 collateralValue, ) = collateralOracle.getCollateralValue();

        CollateralState previousState = collateralState;

        if (hf >= warningThresholdBps) {
            collateralState = CollateralState.HEALTHY;
        } else if (hf >= liquidationThresholdBps) {
            collateralState = CollateralState.WARNING;
            emit WarningIssued(hf, block.timestamp);
        } else {
            collateralState = CollateralState.LIQUIDATING;
            emit LiquidationTriggered(hf, collateralValue, totalOutstandingDebt);
        }

        // Registra snapshot
        healthHistory.push(HealthSnapshot({
            timestamp: block.timestamp,
            collateralValue: collateralValue + totalAdditionalCollateral,
            debtValue: totalOutstandingDebt,
            healthFactorBps: hf
        }));

        emit HealthFactorUpdated(hf, collateralState);
    }

    /// @notice Deposita colateral adicional para melhorar health factor
    function addCollateral(uint256 _amount) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        require(
            paymentToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        additionalCollateral[msg.sender] += _amount;
        totalAdditionalCollateral += _amount;
        emit CollateralAdded(msg.sender, _amount);
    }

    /// @notice Retira colateral adicional (somente se HF permanece acima do target)
    function withdrawCollateral(uint256 _amount) external nonReentrant {
        require(additionalCollateral[msg.sender] >= _amount, "Insufficient balance");

        // Simula retirada para verificar HF resultante
        uint256 simulatedAdditional = totalAdditionalCollateral - _amount;
        (uint256 collateralValue, ) = collateralOracle.getCollateralValue();
        uint256 simulatedHF = ((collateralValue + simulatedAdditional) * 10000) / totalOutstandingDebt;

        require(simulatedHF >= targetCollateralRatioBps, "Withdrawal would drop HF below target");

        additionalCollateral[msg.sender] -= _amount;
        totalAdditionalCollateral -= _amount;
        paymentToken.transfer(msg.sender, _amount);
        emit CollateralWithdrawn(msg.sender, _amount);
    }

    /// @notice Executa liquidacao parcial quando HF cai abaixo do threshold
    function executeLiquidation(uint256 _debtToRepay)
        external
        onlyRole(LIQUIDATOR_ROLE)
        nonReentrant
    {
        require(collateralState == CollateralState.LIQUIDATING, "Not in liquidation state");
        require(_debtToRepay > 0 && _debtToRepay <= totalOutstandingDebt, "Invalid amount");

        // Liquidador paga a divida e recebe colateral com bonus
        uint256 collateralReward = (_debtToRepay * (10000 + liquidationPenaltyBps)) / 10000;

        require(
            paymentToken.transferFrom(msg.sender, address(this), _debtToRepay),
            "Payment transfer failed"
        );

        // Reduz divida
        totalOutstandingDebt -= _debtToRepay;

        // Transfere colateral adicional como recompensa ao liquidador
        uint256 transferAmount = collateralReward <= totalAdditionalCollateral
            ? collateralReward
            : totalAdditionalCollateral;

        if (transferAmount > 0) {
            totalAdditionalCollateral -= transferAmount;
            paymentToken.transfer(msg.sender, transferAmount);
        }
    }

    /// @notice Atualiza saldo devedor (chamado pelo WaterfallDistributor apos amortizacao)
    function updateDebt(uint256 _newDebt) external onlyRole(OPERATOR_ROLE) {
        totalOutstandingDebt = _newDebt;
    }

    /// @notice Retorna historico completo de health factor
    function getHealthHistory() external view returns (HealthSnapshot[] memory) {
        return healthHistory;
    }
}
```

- **Exemplo real**: Uma securitizacao de recebiveis de soja do Mato Grosso emite R$ 80 milhoes em cotas. O lastro e composto por 500 CPR financeiras de produtores com entrega prevista para marco. O oraculo Chainlink fornece o preco da soja em CBOT convertido para reais. Em janeiro, com a soja a R$ 150/saca e o lastro equivalendo a 550.000 sacas, o valor do colateral e R$ 82,5 milhoes. O health factor e (82.500.000 / 80.000.000) * 10.000 = 10.312 bps (1.03x) — zona de WARNING. O originador deposita R$ 10 milhoes adicionais em stablecoin como colateral, elevando o HF para 1.15x.

### Oracle de colateral para ativos agro

O oraculo de colateral agro precisa combinar multiplas fontes de dados:

```solidity
/// @title AgroCollateralOracle
/// @notice Oraculo que calcula valor do lastro agro combinando preco e volume
contract AgroCollateralOracle is ICollateralOracle {

    // Chainlink price feeds
    address public soyaPriceFeed;    // Preco da soja em USD
    address public usdBrlPriceFeed;  // Cambio USD/BRL

    // Dados do lastro
    uint256 public totalSacas;          // Volume total de sacas no lastro
    uint256 public performingRatio;     // % dos recebiveis adimplentes (em bps)
    uint256 public lastUpdateTimestamp;

    /// @notice Retorna valor total do lastro em stablecoin (6 decimais)
    function getCollateralValue() external view returns (uint256 value, uint256 timestamp) {
        // Preco da soja em USD (8 decimais do Chainlink)
        uint256 soyaPriceUSD = _getLatestPrice(soyaPriceFeed);
        // Cambio USD/BRL (8 decimais)
        uint256 usdBrl = _getLatestPrice(usdBrlPriceFeed);

        // Preco por saca em BRL (normalizado para 6 decimais)
        uint256 pricePerSacaBRL = (soyaPriceUSD * usdBrl) / 1e10;

        // Valor bruto do lastro
        uint256 grossValue = totalSacas * pricePerSacaBRL;

        // Aplica haircut pela inadimplencia (recebiveis nao performados)
        value = (grossValue * performingRatio) / 10000;
        timestamp = block.timestamp;
    }

    function _getLatestPrice(address _feed) internal view returns (uint256) {
        // Interface Chainlink AggregatorV3
        // (, int256 price, , , ) = AggregatorV3Interface(_feed).latestRoundData();
        // return uint256(price);
        return 0; // Placeholder
    }
}
```

- **Exemplo**: No lastro de um CRA de soja, se 5% dos produtores estao inadimplentes (performingRatio = 9500 bps), o oraculo automaticamente desconta essas CPR do calculo. Se a soja esta cotada a USD 12.50/bushel e o cambio e 5.20 BRL/USD, o preco por saca de 60kg e aproximadamente R$ 155. Com 550.000 sacas e 95% adimplentes, o valor do lastro e 550.000 * 155 * 0.95 = R$ 80.987.500.

---

## 2. Fundo de reserva on-chain

### Mecanismo de acumulo e liberacao

O fundo de reserva e uma conta que acumula um percentual de cada pagamento recebido, criando um colchao de liquidez para periodos de estresse. No mercado tradicional, esse fundo e gerenciado pela securitizadora e fiscalizado pelo agente fiduciario. On-chain, o fundo e um smart contract autonomo com regras transparentes e imutaveis.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title ReserveFund - Fundo de reserva para securitizacao agro
/// @notice Acumula percentual dos pagamentos e libera em situacoes de estresse
contract ReserveFund is AccessControl, ReentrancyGuard {

    bytes32 public constant WATERFALL_ROLE = keccak256("WATERFALL_ROLE");
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant TRUSTEE_ROLE = keccak256("TRUSTEE_ROLE");

    IERC20 public paymentToken;

    // Configuracao do fundo
    uint256 public reserveRateBps;      // % retido de cada pagamento (ex: 200 = 2%)
    uint256 public targetReserveBps;    // Alvo do fundo como % do saldo devedor (ex: 500 = 5%)
    uint256 public maxReserveBps;       // Teto do fundo (ex: 1000 = 10%)
    uint256 public totalOutstandingDebt; // Referencia do saldo devedor

    // Saldo do fundo
    uint256 public reserveBalance;

    // Condicoes de liberacao
    uint256 public minHealthFactorForRelease; // HF minimo para liberar excedente (em bps)

    // Historico
    struct ReserveAction {
        uint256 timestamp;
        bool isDeposit;  // true = deposito, false = saque
        uint256 amount;
        string reason;
    }
    ReserveAction[] public actionHistory;

    event ReserveDeposit(uint256 amount, uint256 newBalance, uint256 period);
    event ReserveRelease(uint256 amount, address indexed to, string reason);
    event ReserveTargetReached(uint256 balance, uint256 targetAmount);
    event ReserveBelowTarget(uint256 balance, uint256 targetAmount);

    constructor(
        address _paymentToken,
        uint256 _reserveRateBps,
        uint256 _targetReserveBps,
        uint256 _maxReserveBps,
        uint256 _initialDebt,
        address _admin
    ) {
        paymentToken = IERC20(_paymentToken);
        reserveRateBps = _reserveRateBps;
        targetReserveBps = _targetReserveBps;
        maxReserveBps = _maxReserveBps;
        totalOutstandingDebt = _initialDebt;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(OPERATOR_ROLE, _admin);
    }

    /// @notice Calcula e retira a parcela de reserva de um pagamento
    /// @param _paymentAmount Valor total do pagamento recebido
    /// @return reserveAmount Valor retido para o fundo
    /// @return netAmount Valor liquido para distribuicao na waterfall
    function calculateReserveDeduction(uint256 _paymentAmount)
        external
        view
        returns (uint256 reserveAmount, uint256 netAmount)
    {
        uint256 maxReserve = (totalOutstandingDebt * maxReserveBps) / 10000;

        if (reserveBalance >= maxReserve) {
            // Fundo ja no teto, nao retira mais
            return (0, _paymentAmount);
        }

        reserveAmount = (_paymentAmount * reserveRateBps) / 10000;

        // Nao ultrapassar o teto
        if (reserveBalance + reserveAmount > maxReserve) {
            reserveAmount = maxReserve - reserveBalance;
        }

        netAmount = _paymentAmount - reserveAmount;
    }

    /// @notice Deposita no fundo de reserva (chamado pelo WaterfallDistributor)
    function deposit(uint256 _amount) external onlyRole(WATERFALL_ROLE) {
        require(_amount > 0, "Amount must be > 0");
        require(
            paymentToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        reserveBalance += _amount;

        uint256 targetAmount = (totalOutstandingDebt * targetReserveBps) / 10000;
        if (reserveBalance >= targetAmount) {
            emit ReserveTargetReached(reserveBalance, targetAmount);
        }

        actionHistory.push(ReserveAction({
            timestamp: block.timestamp,
            isDeposit: true,
            amount: _amount,
            reason: "Periodic retention"
        }));

        emit ReserveDeposit(_amount, reserveBalance, block.timestamp);
    }

    /// @notice Libera fundos da reserva para cobrir deficit na waterfall
    /// @param _amount Valor a liberar
    /// @param _to Endereco destino (geralmente o WaterfallDistributor)
    /// @param _reason Motivo da liberacao
    function releaseForDeficit(
        uint256 _amount,
        address _to,
        string calldata _reason
    ) external onlyRole(TRUSTEE_ROLE) nonReentrant {
        require(_amount <= reserveBalance, "Insufficient reserve balance");
        require(_to != address(0), "Invalid recipient");

        reserveBalance -= _amount;
        paymentToken.transfer(_to, _amount);

        actionHistory.push(ReserveAction({
            timestamp: block.timestamp,
            isDeposit: false,
            amount: _amount,
            reason: _reason
        }));

        uint256 targetAmount = (totalOutstandingDebt * targetReserveBps) / 10000;
        if (reserveBalance < targetAmount) {
            emit ReserveBelowTarget(reserveBalance, targetAmount);
        }

        emit ReserveRelease(_amount, _to, _reason);
    }

    /// @notice Libera excedente acima do teto (retorna ao originador/subordinado)
    function releaseExcess(address _to)
        external
        onlyRole(OPERATOR_ROLE)
        nonReentrant
    {
        uint256 maxReserve = (totalOutstandingDebt * maxReserveBps) / 10000;
        require(reserveBalance > maxReserve, "No excess to release");

        uint256 excess = reserveBalance - maxReserve;
        reserveBalance -= excess;
        paymentToken.transfer(_to, excess);

        actionHistory.push(ReserveAction({
            timestamp: block.timestamp,
            isDeposit: false,
            amount: excess,
            reason: "Excess release"
        }));

        emit ReserveRelease(excess, _to, "Excess above maximum");
    }

    /// @notice Atualiza saldo devedor (afeta calculos de target e max)
    function updateDebt(uint256 _newDebt) external onlyRole(OPERATOR_ROLE) {
        totalOutstandingDebt = _newDebt;
    }

    /// @notice Retorna status completo do fundo
    function getReserveStatus()
        external
        view
        returns (
            uint256 balance,
            uint256 targetAmount,
            uint256 maxAmount,
            bool atTarget,
            bool atMax
        )
    {
        balance = reserveBalance;
        targetAmount = (totalOutstandingDebt * targetReserveBps) / 10000;
        maxAmount = (totalOutstandingDebt * maxReserveBps) / 10000;
        atTarget = balance >= targetAmount;
        atMax = balance >= maxAmount;
    }
}
```

- **Exemplo real**: Em um CRA de recebiveis de cana-de-acucar emitido pela Raizen, o fundo de reserva e configurado com retencao de 2% de cada pagamento (reserveRateBps = 200), alvo de 5% do saldo devedor (targetReserveBps = 500) e teto de 10% (maxReserveBps = 1000). Se o saldo devedor e R$ 100 milhoes, o fundo precisa acumular R$ 5 milhoes (alvo) e nao ultrapassar R$ 10 milhoes (teto). Quando o fundo atinge R$ 10 milhoes, os 2% de retencao param de ser cobrados e vao integralmente para a waterfall. Se uma safra ruim causa deficit de R$ 2 milhoes na coleta mensal, o agente fiduciario (TRUSTEE_ROLE) libera R$ 2 milhoes do fundo para complementar a waterfall, garantindo que a cota senior receba integralmente.

### Integracao do fundo de reserva com a waterfall

O fundo de reserva se conecta ao distribuidor da aula anterior. O fluxo integrado funciona assim:

```
1. Servicer coleta pagamentos dos devedores
2. WaterfallDistributor recebe o pagamento bruto
3. WaterfallDistributor calcula retencao: ReserveFund.calculateReserveDeduction()
4. Parcela de reserva e depositada: ReserveFund.deposit()
5. Valor liquido e distribuido pela waterfall normal
6. Se a waterfall nao consegue pagar a cota senior integralmente:
   - Trustee autoriza liberacao: ReserveFund.releaseForDeficit()
   - Valor liberado entra como pagamento adicional na waterfall
```

```solidity
/// @notice Fluxo integrado: coleta, reserva e distribuicao
/// Funcao no WaterfallDistributor que integra o ReserveFund
function collectAndDistribute(uint256 _grossPayment) external onlyRole(SERVICER_ROLE) {
    // 1. Recebe pagamento bruto
    paymentToken.transferFrom(msg.sender, address(this), _grossPayment);

    // 2. Calcula retencao para reserva
    (uint256 reserveAmount, uint256 netAmount) = reserveFund.calculateReserveDeduction(_grossPayment);

    // 3. Deposita na reserva
    if (reserveAmount > 0) {
        paymentToken.approve(address(reserveFund), reserveAmount);
        reserveFund.deposit(reserveAmount);
    }

    // 4. Distribui o liquido pela waterfall
    collectedThisPeriod = netAmount;
    _executeWaterfall();
}
```

---

## 3. Integracao com seguro parametrico

### Seguro parametrico para risco climatico no agro

O seguro parametrico e um tipo de seguro que paga automaticamente quando um parametro mensuravel atinge um limite predefinido (trigger), sem necessidade de pericia ou ajuste de sinistro. No agronegocio, os triggers mais comuns sao:

- **Precipitacao pluviometrica**: seca ou excesso de chuva
- **Temperatura**: geada, onda de calor
- **Indice de vegetacao (NDVI)**: medido por satelite, indica saude da lavoura
- **Preco de commodity**: queda abaixo de piso

Para securitizacoes agro, o seguro parametrico funciona como credit enhancement adicional: se um evento climatico compromete a capacidade de pagamento dos devedores, o seguro paga automaticamente, injetando liquidez na waterfall.

### Smart contract de seguro parametrico

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Interface do oraculo climatico (ex: Chainlink Functions / API externa)
interface IWeatherOracle {
    /// @notice Retorna precipitacao acumulada em mm para uma regiao e periodo
    function getRainfall(
        bytes32 regionId,
        uint256 periodStart,
        uint256 periodEnd
    ) external view returns (uint256 rainfallMm, uint256 timestamp);

    /// @notice Retorna temperatura minima registrada no periodo
    function getMinTemperature(
        bytes32 regionId,
        uint256 periodStart,
        uint256 periodEnd
    ) external view returns (int256 tempCelsius, uint256 timestamp);
}

/// @title ParametricInsurance - Seguro parametrico para securitizacao agro
/// @notice Paga automaticamente quando trigger climatico e acionado
contract ParametricInsurance is AccessControl, ReentrancyGuard {

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    IERC20 public paymentToken;
    IWeatherOracle public weatherOracle;

    enum TriggerType { DROUGHT, FLOOD, FROST, HEAT_WAVE }
    enum PolicyState { ACTIVE, TRIGGERED, PAID, EXPIRED }

    struct Policy {
        bytes32 regionId;           // Identificador da regiao (ex: keccak256("MT-SORRISO"))
        TriggerType triggerType;
        uint256 triggerThreshold;   // Valor que aciona o seguro
        bool triggerBelow;          // true = aciona se valor < threshold (seca)
        uint256 coverageAmount;     // Valor do payout
        uint256 premium;            // Premio pago
        uint256 periodStart;        // Inicio do periodo coberto
        uint256 periodEnd;          // Fim do periodo coberto
        address beneficiary;        // Quem recebe o payout (WaterfallDistributor)
        PolicyState state;
    }

    Policy[] public policies;
    uint256 public totalPremiumsCollected;
    uint256 public totalPayoutsExecuted;
    uint256 public insurancePool; // Pool de liquidez para pagamentos

    event PolicyCreated(uint256 indexed policyId, bytes32 regionId, TriggerType triggerType);
    event PolicyTriggered(uint256 indexed policyId, uint256 actualValue, uint256 threshold);
    event PayoutExecuted(uint256 indexed policyId, address beneficiary, uint256 amount);
    event PremiumDeposited(uint256 indexed policyId, uint256 amount);

    constructor(
        address _paymentToken,
        address _weatherOracle,
        address _admin
    ) {
        paymentToken = IERC20(_paymentToken);
        weatherOracle = IWeatherOracle(_weatherOracle);

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(OPERATOR_ROLE, _admin);
    }

    /// @notice Cria uma apolice de seguro parametrico
    function createPolicy(
        bytes32 _regionId,
        TriggerType _triggerType,
        uint256 _triggerThreshold,
        bool _triggerBelow,
        uint256 _coverageAmount,
        uint256 _premium,
        uint256 _periodStart,
        uint256 _periodEnd,
        address _beneficiary
    ) external onlyRole(OPERATOR_ROLE) returns (uint256 policyId) {
        require(_periodEnd > _periodStart, "Invalid period");
        require(_beneficiary != address(0), "Invalid beneficiary");
        require(_coverageAmount > 0, "Coverage must be > 0");

        policyId = policies.length;

        policies.push(Policy({
            regionId: _regionId,
            triggerType: _triggerType,
            triggerThreshold: _triggerThreshold,
            triggerBelow: _triggerBelow,
            coverageAmount: _coverageAmount,
            premium: _premium,
            periodStart: _periodStart,
            periodEnd: _periodEnd,
            beneficiary: _beneficiary,
            state: PolicyState.ACTIVE
        }));

        emit PolicyCreated(policyId, _regionId, _triggerType);
    }

    /// @notice Deposita premio da apolice
    function depositPremium(uint256 _policyId) external nonReentrant {
        Policy storage policy = policies[_policyId];
        require(policy.state == PolicyState.ACTIVE, "Policy not active");

        require(
            paymentToken.transferFrom(msg.sender, address(this), policy.premium),
            "Premium transfer failed"
        );

        insurancePool += policy.premium;
        totalPremiumsCollected += policy.premium;

        emit PremiumDeposited(_policyId, policy.premium);
    }

    /// @notice Verifica trigger e executa payout se condicao atingida
    function checkAndExecuteTrigger(uint256 _policyId) external nonReentrant {
        Policy storage policy = policies[_policyId];
        require(policy.state == PolicyState.ACTIVE, "Policy not active");
        require(block.timestamp >= policy.periodStart, "Period not started");

        uint256 actualValue;

        if (policy.triggerType == TriggerType.DROUGHT || policy.triggerType == TriggerType.FLOOD) {
            (uint256 rainfall, ) = weatherOracle.getRainfall(
                policy.regionId,
                policy.periodStart,
                policy.periodEnd > block.timestamp ? block.timestamp : policy.periodEnd
            );
            actualValue = rainfall;
        }
        // Nota: FROST e HEAT_WAVE usariam getMinTemperature (omitido por brevidade)

        bool triggered;
        if (policy.triggerBelow) {
            triggered = actualValue < policy.triggerThreshold;
        } else {
            triggered = actualValue > policy.triggerThreshold;
        }

        if (triggered) {
            policy.state = PolicyState.TRIGGERED;
            emit PolicyTriggered(_policyId, actualValue, policy.triggerThreshold);
            _executePayout(_policyId);
        }
    }

    function _executePayout(uint256 _policyId) internal {
        Policy storage policy = policies[_policyId];
        require(policy.state == PolicyState.TRIGGERED, "Not triggered");
        require(insurancePool >= policy.coverageAmount, "Insufficient pool");

        policy.state = PolicyState.PAID;
        insurancePool -= policy.coverageAmount;
        totalPayoutsExecuted += policy.coverageAmount;

        paymentToken.transfer(policy.beneficiary, policy.coverageAmount);

        emit PayoutExecuted(_policyId, policy.beneficiary, policy.coverageAmount);
    }

    /// @notice Expira apolices cujo periodo terminou sem trigger
    function expirePolicy(uint256 _policyId) external onlyRole(OPERATOR_ROLE) {
        Policy storage policy = policies[_policyId];
        require(policy.state == PolicyState.ACTIVE, "Policy not active");
        require(block.timestamp > policy.periodEnd, "Period not ended");

        policy.state = PolicyState.EXPIRED;
        // Premio permanece no pool para futuras apolices
    }

    /// @notice Adiciona liquidez ao pool de seguro
    function addLiquidity(uint256 _amount) external nonReentrant {
        require(
            paymentToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        insurancePool += _amount;
    }
}
```

- **Exemplo real**: Uma securitizacao de CPR financeiras de milho safrinha em Sorriso-MT contrata seguro parametrico contra seca. A apolice e configurada com trigger de precipitacao abaixo de 150mm no periodo de janeiro a marco (triggerBelow = true, triggerThreshold = 150). O premio e de R$ 500.000 (0,5% do lastro de R$ 100 milhoes) e a cobertura e de R$ 10 milhoes. Se o oraculo climatico (alimentado por estacoes meteorologicas do INMET via Chainlink Functions) reportar 120mm de chuva acumulada, o trigger e acionado automaticamente. O payout de R$ 10 milhoes e enviado ao WaterfallDistributor, complementando os pagamentos dos devedores que foram prejudicados pela seca. Isso protege diretamente os investidores da cota senior.

### Fluxo integrado: waterfall + fundo de reserva + seguro parametrico

A arquitetura completa de credit enhancement combina tres camadas de protecao em sequencia:

```
Pagamento dos devedores (CPR financeiras, contratos de fornecimento)
    |
    v
[1] Retencao do fundo de reserva (2% de cada pagamento)
    |
    v
[2] Waterfall: DESPESAS -> SENIOR -> MEZANINO -> SUBORDINADO
    |
    v
Se deficit na cota senior:
    |
    v
[3] Fundo de reserva libera diferenca (trustee autoriza)
    |
    v
Se deficit persiste:
    |
    v
[4] Seguro parametrico (se trigger climatico atingido, payout automatico)
    |
    v
Se deficit ainda persiste:
    |
    v
[5] Cota subordinada absorve perda (reducao de principal)
    |
    v
Se cota subordinada zerada:
    |
    v
[6] Cota mezanino absorve perda
    |
    v
[7] Cota senior absorve perda (ultimo recurso)
```

- **Exemplo**: Em uma safra ruim no cerrado goiano, um CRA de R$ 120 milhoes lastreado em recebiveis de soja enfrenta inadimplencia de 15% da carteira. A coleta do periodo cai de R$ 8 milhoes para R$ 6,8 milhoes. Primeiro, R$ 136.000 sao retidos para o fundo de reserva (2%). Da waterfall, os R$ 6.664.000 restantes cobrem despesas (R$ 180.000) e grande parte da cota senior (R$ 5.400.000 de R$ 5.500.000 devidos). Faltam R$ 100.000 para completar a senior. O agente fiduciario libera R$ 100.000 do fundo de reserva. Simultaneamente, o seguro parametrico detecta precipitacao abaixo de 200mm na regiao e paga R$ 5 milhoes ao distribuidor, que serao usados no proximo periodo. A cota mezanino recebe R$ 984.000 (parcial). A cota subordinada nao recebe nada neste periodo. A protecao funcionou: a cota senior foi paga integralmente.

---

## Conclusao

Nesta aula, construimos tres mecanismos de credit enhancement on-chain que complementam a waterfall da aula anterior. Implementamos o sistema de overcollateral com health factor, que monitora continuamente a relacao entre lastro e divida via oraculo e aciona liquidacao automatica quando o colateral se torna insuficiente. Desenvolvemos o fundo de reserva, que acumula um percentual de cada pagamento e funciona como colchao de liquidez para periodos de estresse, com regras transparentes de deposito, liberacao e teto. Por fim, integramos o seguro parametrico, que paga automaticamente quando triggers climaticos (seca, geada, excesso de chuva) sao atingidos, sem depender de pericia manual. A combinacao dessas tres camadas com a waterfall cria uma estrutura de protecao robusta e autoexecutavel, superior em transparencia e velocidade ao modelo tradicional de securitizacao.

---

## Licao de Casa

1. Implante o contrato `CreditEnhancement` em uma testnet e simule um cenario de queda de health factor. Configure o oraculo de colateral para retornar valores decrescentes (simulando queda no preco da soja) e observe a transicao de estados HEALTHY -> WARNING -> LIQUIDATING. Execute uma liquidacao parcial e verifique se o health factor retorna a nivel saudavel.

2. Integre o contrato `ReserveFund` com o `WaterfallDistributor` da aula anterior. Implemente a funcao `collectAndDistribute()` que retira 2% para a reserva antes de executar a waterfall. Teste com 5 periodos de pagamento e verifique se o fundo acumula corretamente ate atingir o teto.

3. Projete uma apolice de seguro parametrico para uma securitizacao de recebiveis de cafe no sul de Minas Gerais. Defina: (a) o trigger climatico mais relevante para cafe (dica: geada), (b) o threshold de temperatura, (c) o valor de cobertura como percentual do lastro, (d) o premio justo considerando a frequencia historica de geadas na regiao. Documente suas premissas em um relatorio tecnico.

---

## Questionario

**1. Qual e a formula do health factor em uma securitizacao agro tokenizada?**

a) Health Factor = Saldo Devedor / Valor do Lastro
b) Health Factor = (Valor do Lastro via Oraculo) / (Saldo Devedor Total das Cotas)
c) Health Factor = Taxa de Juros / Taxa de Inadimplencia
d) Health Factor = Premio do Seguro / Valor da Cobertura

**Resposta: b**

---

**2. No contrato ReserveFund, o que acontece quando o fundo de reserva atinge o teto maximo (maxReserveBps)?**

a) O contrato para de funcionar e entra em estado de emergencia
b) A retencao percentual para de ser cobrada e o pagamento vai integralmente para a waterfall
c) O fundo e automaticamente liquidado e distribuido aos investidores
d) A taxa de retencao dobra para acelerar o acumulo

**Resposta: b**

---

**3. O que diferencia o seguro parametrico do seguro tradicional no contexto de securitizacoes agro?**

a) O seguro parametrico e mais caro porque cobre todos os tipos de risco
b) O seguro parametrico paga automaticamente quando um parametro mensuravel atinge um limite predefinido, sem necessidade de pericia ou ajuste de sinistro
c) O seguro parametrico so funciona para operacoes internacionais em dolar
d) O seguro parametrico exige aprovacao manual do agente fiduciario para cada pagamento

**Resposta: b**

---

**4. Na arquitetura integrada de credit enhancement, qual e a ordem correta das camadas de protecao quando ha deficit na waterfall?**

a) Seguro parametrico -> Fundo de reserva -> Cota subordinada -> Cota senior
b) Cota senior -> Cota mezanino -> Cota subordinada -> Fundo de reserva
c) Fundo de reserva -> Seguro parametrico -> Cota subordinada -> Cota mezanino -> Cota senior
d) Cota subordinada -> Seguro parametrico -> Fundo de reserva -> Cota senior

**Resposta: c**

---

**5. Por que o oraculo de colateral agro precisa considerar o "performingRatio" (percentual de recebiveis adimplentes) ao calcular o valor do lastro?**

a) Porque o performingRatio aumenta o valor do lastro para atrair mais investidores
b) Porque recebiveis inadimplentes nao devem ser contabilizados como colateral efetivo, ja que a probabilidade de recuperacao e incerta, e incluir-los inflaria artificialmente o health factor
c) Porque a CVM exige que 100% dos recebiveis estejam adimplentes para manter o registro do CRA
d) Porque o performingRatio e usado apenas para calcular o premio do seguro parametrico

**Resposta: b**

---

## Proxima Aula

Na proxima aula, vamos implementar a automacao completa do lifecycle de uma securitizacao tokenizada — desde a emissao (mint) dos tokens apos verificacao do lastro, passando pela distribuicao de cupons (push vs pull), amortizacao programada, prepayment, ate o vencimento e default. Integraremos keepers (Chainlink Automation) para tornar todo o ciclo autoexecutavel. Ate la!
