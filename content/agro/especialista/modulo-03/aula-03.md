# Aula 3.3: Automacao do Lifecycle

## Abertura

Bem-vindo a aula 3.3 do Modulo 3 — Waterfall e Automacao de Pagamentos. Nas duas aulas anteriores, construimos a waterfall programatica com maquina de estados e os mecanismos de credit enhancement (overcollateral, fundo de reserva e seguro parametrico). Agora, vamos integrar tudo em um lifecycle completo e automatizado de uma securitizacao agro tokenizada. Cada etapa do ciclo de vida — emissao dos tokens, distribuicao de cupons, amortizacao, prepayment, vencimento e default — sera governada por smart contracts e executada automaticamente por keepers (Chainlink Automation). Ao final, voce tera uma visao completa de como uma securitizacao de recebiveis do agronegocio pode operar de forma autonoma, transparente e autoexecutavel na blockchain.

### Programa da aula:

1. Emissao (mint) apos verificacao de lastro e distribuicao de cupons (push vs pull)
2. Amortizacao programada, prepayment e vencimento
3. Automacao com keepers (Chainlink Automation)

---

## 1. Emissao apos verificacao de lastro e distribuicao de cupons

### Mint condicional: tokens so existem se o lastro existe

Em uma securitizacao tokenizada, os tokens que representam as cotas (senior, mezanino, subordinada) so devem ser emitidos (mintados) apos a verificacao de que o lastro existe e e suficiente. Esse principio fundamental evita a emissao de titulos "vazios" — um dos maiores riscos do mercado tradicional, onde a verificacao do lastro depende de auditorias periodicas que podem demorar semanas.

On-chain, a verificacao e atomica: na mesma transacao em que o investidor deposita capital, o contrato verifica o lastro via oraculo, calcula o health factor e, somente se tudo estiver adequado, emite os tokens.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Interface do oraculo de colateral
interface ICollateralOracle {
    function getCollateralValue() external view returns (uint256 value, uint256 timestamp);
}

/// @title TrancheToken - Token ERC-20 que representa uma cota de securitizacao
contract TrancheToken is ERC20, ERC20Burnable, AccessControl {

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant BURNER_ROLE = keccak256("BURNER_ROLE");

    constructor(
        string memory _name,
        string memory _symbol,
        address _admin
    ) ERC20(_name, _symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
    }

    function mint(address _to, uint256 _amount) external onlyRole(MINTER_ROLE) {
        _mint(_to, _amount);
    }

    function decimals() public pure override returns (uint8) {
        return 6; // Compativel com USDC
    }
}

/// @title SecuritizationLifecycle - Gerenciador do ciclo de vida completo
/// @notice Controla emissao, cupons, amortizacao, prepayment e vencimento
contract SecuritizationLifecycle is AccessControl, ReentrancyGuard {

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant SERVICER_ROLE = keccak256("SERVICER_ROLE");
    bytes32 public constant TRUSTEE_ROLE = keccak256("TRUSTEE_ROLE");
    bytes32 public constant KEEPER_ROLE = keccak256("KEEPER_ROLE");

    // Tokens das cotas
    TrancheToken public seniorToken;
    TrancheToken public mezzanineToken;
    TrancheToken public subordinatedToken;

    // Stablecoin de pagamento
    IERC20 public paymentToken;

    // Oraculo de colateral
    ICollateralOracle public collateralOracle;

    // Estado do lifecycle
    enum LifecycleState {
        FUNDING,        // Periodo de captacao, investidores depositam
        ACTIVE,         // Operacao ativa, pagamentos fluindo
        MATURING,       // Proximo do vencimento, amortizacao final
        MATURED,        // Vencido, aguardando resgate final
        DEFAULTED,      // Inadimplencia declarada
        CLOSED          // Operacao encerrada
    }
    LifecycleState public state;

    // Configuracao da operacao
    struct OperationConfig {
        uint256 totalSeniorCap;       // Capacidade maxima da cota senior
        uint256 totalMezzanineCap;
        uint256 totalSubordinatedCap;
        uint256 seniorRateBps;        // Taxa de juros senior (ex: 150 = 1.5% por periodo)
        uint256 mezzanineRateBps;
        uint256 amortizationBps;      // Taxa de amortizacao por periodo
        uint256 maturityTimestamp;    // Data de vencimento
        uint256 periodDuration;       // Duracao de cada periodo
        uint256 minCollateralRatioBps; // Ratio minimo de colateral (ex: 13000 = 130%)
    }
    OperationConfig public config;

    // Contabilidade
    uint256 public seniorPrincipalOutstanding;
    uint256 public mezzaninePrincipalOutstanding;
    uint256 public subordinatedPrincipalOutstanding;
    uint256 public currentPeriod;
    uint256 public lastPeriodTimestamp;

    // Cupons acumulados por holder (modelo pull)
    mapping(address => uint256) public unclaimedCoupons;
    uint256 public totalUnclaimedCoupons;

    // Eventos
    event TokensMinted(address indexed investor, string tranche, uint256 amount);
    event CouponDistributed(uint256 indexed period, string tranche, uint256 totalAmount);
    event CouponClaimed(address indexed holder, uint256 amount);
    event AmortizationExecuted(uint256 indexed period, uint256 seniorAmort, uint256 mezzAmort);
    event PrepaymentReceived(uint256 amount, uint256 remainingDebt);
    event MaturityReached(uint256 timestamp, uint256 totalRedeemed);
    event DefaultDeclared(uint256 timestamp, uint256 outstandingDebt);
    event OperationClosed(uint256 timestamp);

    modifier inState(LifecycleState _state) {
        require(state == _state, "Invalid state");
        _;
    }

    constructor(
        address _paymentToken,
        address _collateralOracle,
        address _seniorToken,
        address _mezzanineToken,
        address _subordinatedToken,
        OperationConfig memory _config,
        address _admin
    ) {
        paymentToken = IERC20(_paymentToken);
        collateralOracle = ICollateralOracle(_collateralOracle);
        seniorToken = TrancheToken(_seniorToken);
        mezzanineToken = TrancheToken(_mezzanineToken);
        subordinatedToken = TrancheToken(_subordinatedToken);
        config = _config;
        state = LifecycleState.FUNDING;
        currentPeriod = 0;
        lastPeriodTimestamp = block.timestamp;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(OPERATOR_ROLE, _admin);
    }

    // ============================================================
    //                    FASE 1: EMISSAO (FUNDING)
    // ============================================================

    /// @notice Investidor deposita stablecoin e recebe tokens da tranche
    /// @param _tranche 0=senior, 1=mezanino, 2=subordinado
    /// @param _amount Valor em stablecoin
    function invest(uint8 _tranche, uint256 _amount)
        external
        inState(LifecycleState.FUNDING)
        nonReentrant
    {
        require(_amount > 0, "Amount must be > 0");

        // Verifica colateral antes de emitir
        (uint256 collateralValue, ) = collateralOracle.getCollateralValue();
        uint256 totalDebtAfter = seniorPrincipalOutstanding
            + mezzaninePrincipalOutstanding
            + subordinatedPrincipalOutstanding
            + _amount;

        uint256 ratioAfter = (collateralValue * 10000) / totalDebtAfter;
        require(ratioAfter >= config.minCollateralRatioBps, "Insufficient collateral");

        // Recebe stablecoin
        require(
            paymentToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        // Mint tokens conforme tranche
        if (_tranche == 0) {
            require(
                seniorPrincipalOutstanding + _amount <= config.totalSeniorCap,
                "Senior cap exceeded"
            );
            seniorToken.mint(msg.sender, _amount);
            seniorPrincipalOutstanding += _amount;
            emit TokensMinted(msg.sender, "SENIOR", _amount);

        } else if (_tranche == 1) {
            require(
                mezzaninePrincipalOutstanding + _amount <= config.totalMezzanineCap,
                "Mezzanine cap exceeded"
            );
            mezzanineToken.mint(msg.sender, _amount);
            mezzaninePrincipalOutstanding += _amount;
            emit TokensMinted(msg.sender, "MEZZANINE", _amount);

        } else if (_tranche == 2) {
            require(
                subordinatedPrincipalOutstanding + _amount <= config.totalSubordinatedCap,
                "Subordinated cap exceeded"
            );
            subordinatedToken.mint(msg.sender, _amount);
            subordinatedPrincipalOutstanding += _amount;
            emit TokensMinted(msg.sender, "SUBORDINATED", _amount);

        } else {
            revert("Invalid tranche");
        }
    }

    /// @notice Ativa a operacao apos captacao completa
    function activateOperation()
        external
        onlyRole(OPERATOR_ROLE)
        inState(LifecycleState.FUNDING)
    {
        require(seniorPrincipalOutstanding > 0, "No senior investment");
        state = LifecycleState.ACTIVE;
        lastPeriodTimestamp = block.timestamp;
        currentPeriod = 1;
    }

    // ============================================================
    //               FASE 2: CUPONS (PUSH vs PULL)
    // ============================================================

    /// @notice Distribui cupons do periodo (modelo PUSH - operador envia para cada holder)
    /// @dev Cuidado: alto custo de gas se muitos holders. Preferir modelo pull.
    function distributeCouponsPush(
        address[] calldata _seniorHolders,
        uint256[] calldata _seniorBalances
    )
        external
        onlyRole(OPERATOR_ROLE)
        inState(LifecycleState.ACTIVE)
    {
        require(_seniorHolders.length == _seniorBalances.length, "Length mismatch");

        uint256 totalSeniorCoupon = (seniorPrincipalOutstanding * config.seniorRateBps) / 10000;
        uint256 distributed;

        for (uint256 i = 0; i < _seniorHolders.length; i++) {
            uint256 holderShare = (totalSeniorCoupon * _seniorBalances[i]) / seniorPrincipalOutstanding;
            if (holderShare > 0) {
                paymentToken.transfer(_seniorHolders[i], holderShare);
                distributed += holderShare;
            }
        }

        emit CouponDistributed(currentPeriod, "SENIOR", distributed);
    }

    /// @notice Registra cupons para claim (modelo PULL - mais eficiente em gas)
    function registerCoupons()
        external
        onlyRole(OPERATOR_ROLE)
        inState(LifecycleState.ACTIVE)
    {
        require(
            block.timestamp >= lastPeriodTimestamp + config.periodDuration,
            "Period not ended"
        );

        // Nota: em producao, isso seria feito via Merkle tree para eficiencia.
        // Aqui simplificamos para fins didaticos.
        // O operador registra cupons por holder off-chain e publica Merkle root.
        // Holders fazem claim com prova Merkle.

        uint256 totalSeniorCoupon = (seniorPrincipalOutstanding * config.seniorRateBps) / 10000;
        uint256 totalMezzCoupon = (mezzaninePrincipalOutstanding * config.mezzanineRateBps) / 10000;

        totalUnclaimedCoupons += totalSeniorCoupon + totalMezzCoupon;

        emit CouponDistributed(currentPeriod, "SENIOR", totalSeniorCoupon);
        emit CouponDistributed(currentPeriod, "MEZZANINE", totalMezzCoupon);
    }

    /// @notice Holder resgata seus cupons acumulados (modelo PULL)
    function claimCoupons() external nonReentrant {
        uint256 amount = unclaimedCoupons[msg.sender];
        require(amount > 0, "No coupons to claim");

        unclaimedCoupons[msg.sender] = 0;
        totalUnclaimedCoupons -= amount;
        paymentToken.transfer(msg.sender, amount);

        emit CouponClaimed(msg.sender, amount);
    }

    // ============================================================
    //        FASE 3: AMORTIZACAO, PREPAYMENT E VENCIMENTO
    // ============================================================

    /// @notice Executa amortizacao programada do periodo
    function executeAmortization()
        external
        onlyRole(OPERATOR_ROLE)
        inState(LifecycleState.ACTIVE)
    {
        uint256 seniorAmort = (seniorPrincipalOutstanding * config.amortizationBps) / 10000;
        uint256 mezzAmort = (mezzaninePrincipalOutstanding * config.amortizationBps) / 10000;

        // Reduz saldos devedores
        seniorPrincipalOutstanding -= seniorAmort;
        mezzaninePrincipalOutstanding -= mezzAmort;

        // Nota: a amortizacao efetiva para os holders e feita via burn de tokens
        // proporcional e transferencia de stablecoin. Simplificado aqui.

        emit AmortizationExecuted(currentPeriod, seniorAmort, mezzAmort);

        // Verifica se proximo do vencimento
        if (block.timestamp + config.periodDuration >= config.maturityTimestamp) {
            state = LifecycleState.MATURING;
        }

        currentPeriod++;
        lastPeriodTimestamp = block.timestamp;
    }

    /// @notice Prepayment: devedor antecipa pagamentos
    /// @param _amount Valor antecipado
    function receivePrepayment(uint256 _amount)
        external
        onlyRole(SERVICER_ROLE)
        nonReentrant
    {
        require(
            state == LifecycleState.ACTIVE || state == LifecycleState.MATURING,
            "Invalid state for prepayment"
        );
        require(_amount > 0, "Amount must be > 0");

        require(
            paymentToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        // Prepayment segue waterfall: primeiro senior, depois mezanino
        uint256 remaining = _amount;

        // Amortiza senior
        if (remaining > 0 && seniorPrincipalOutstanding > 0) {
            uint256 seniorPay = remaining >= seniorPrincipalOutstanding
                ? seniorPrincipalOutstanding
                : remaining;
            seniorPrincipalOutstanding -= seniorPay;
            remaining -= seniorPay;
        }

        // Amortiza mezanino
        if (remaining > 0 && mezzaninePrincipalOutstanding > 0) {
            uint256 mezzPay = remaining >= mezzaninePrincipalOutstanding
                ? mezzaninePrincipalOutstanding
                : remaining;
            mezzaninePrincipalOutstanding -= mezzPay;
            remaining -= mezzPay;
        }

        // Amortiza subordinado
        if (remaining > 0 && subordinatedPrincipalOutstanding > 0) {
            uint256 subPay = remaining >= subordinatedPrincipalOutstanding
                ? subordinatedPrincipalOutstanding
                : remaining;
            subordinatedPrincipalOutstanding -= subPay;
            remaining -= subPay;
        }

        uint256 totalRemaining = seniorPrincipalOutstanding
            + mezzaninePrincipalOutstanding
            + subordinatedPrincipalOutstanding;

        emit PrepaymentReceived(_amount, totalRemaining);

        // Se toda a divida foi paga, encerra operacao
        if (totalRemaining == 0) {
            state = LifecycleState.MATURED;
        }
    }

    /// @notice Processa vencimento final
    function processMaturity()
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(
            state == LifecycleState.MATURING || block.timestamp >= config.maturityTimestamp,
            "Not yet matured"
        );

        state = LifecycleState.MATURED;

        uint256 totalRedeemed = seniorPrincipalOutstanding
            + mezzaninePrincipalOutstanding
            + subordinatedPrincipalOutstanding;

        emit MaturityReached(block.timestamp, totalRedeemed);
    }

    /// @notice Holders resgatam principal no vencimento (burn tokens, recebe stablecoin)
    function redeemAtMaturity(uint8 _tranche, uint256 _tokenAmount)
        external
        inState(LifecycleState.MATURED)
        nonReentrant
    {
        require(_tokenAmount > 0, "Amount must be > 0");

        uint256 stablecoinAmount;

        if (_tranche == 0) {
            require(seniorToken.balanceOf(msg.sender) >= _tokenAmount, "Insufficient tokens");
            // Calcula valor proporcional de resgate
            stablecoinAmount = _tokenAmount; // 1:1 para senior (simplificado)
            seniorToken.burnFrom(msg.sender, _tokenAmount);

        } else if (_tranche == 1) {
            require(mezzanineToken.balanceOf(msg.sender) >= _tokenAmount, "Insufficient tokens");
            stablecoinAmount = _tokenAmount;
            mezzanineToken.burnFrom(msg.sender, _tokenAmount);

        } else if (_tranche == 2) {
            require(subordinatedToken.balanceOf(msg.sender) >= _tokenAmount, "Insufficient tokens");
            stablecoinAmount = _tokenAmount;
            subordinatedToken.burnFrom(msg.sender, _tokenAmount);

        } else {
            revert("Invalid tranche");
        }

        // Verifica se ha saldo suficiente no contrato
        uint256 contractBalance = paymentToken.balanceOf(address(this));
        if (stablecoinAmount > contractBalance) {
            stablecoinAmount = contractBalance; // Paga o que tiver disponivel
        }

        if (stablecoinAmount > 0) {
            paymentToken.transfer(msg.sender, stablecoinAmount);
        }
    }

    // ============================================================
    //                    DEFAULT E ENCERRAMENTO
    // ============================================================

    /// @notice Agente fiduciario declara default
    function declareDefault()
        external
        onlyRole(TRUSTEE_ROLE)
    {
        require(
            state == LifecycleState.ACTIVE || state == LifecycleState.MATURING,
            "Invalid state for default"
        );

        state = LifecycleState.DEFAULTED;

        uint256 totalDebt = seniorPrincipalOutstanding
            + mezzaninePrincipalOutstanding
            + subordinatedPrincipalOutstanding;

        emit DefaultDeclared(block.timestamp, totalDebt);
    }

    /// @notice Encerra operacao apos liquidacao completa ou vencimento
    function closeOperation()
        external
        onlyRole(OPERATOR_ROLE)
    {
        require(
            state == LifecycleState.MATURED || state == LifecycleState.DEFAULTED,
            "Cannot close in current state"
        );

        state = LifecycleState.CLOSED;
        emit OperationClosed(block.timestamp);
    }

    // ============================================================
    //                    CONSULTAS
    // ============================================================

    function getTotalOutstandingDebt() external view returns (uint256) {
        return seniorPrincipalOutstanding
            + mezzaninePrincipalOutstanding
            + subordinatedPrincipalOutstanding;
    }

    function getOperationStatus()
        external
        view
        returns (
            LifecycleState currentState,
            uint256 period,
            uint256 seniorOutstanding,
            uint256 mezzOutstanding,
            uint256 subOutstanding,
            uint256 maturityDate
        )
    {
        return (
            state,
            currentPeriod,
            seniorPrincipalOutstanding,
            mezzaninePrincipalOutstanding,
            subordinatedPrincipalOutstanding,
            config.maturityTimestamp
        );
    }
}
```

- **Exemplo real**: Uma securitizacao de CPR financeiras de algodao do oeste baiano e estruturada com captacao de R$ 50 milhoes: R$ 30 milhoes em cota senior (CDI + 1,8%), R$ 12 milhoes em mezanino (CDI + 4,2%) e R$ 8 milhoes em subordinada. Durante a fase FUNDING, investidores institucionais depositam USDC no contrato. A cada deposito, o contrato verifica via oraculo se o lastro em recebiveis (800.000 arroba de algodao a R$ 140/arroba = R$ 112 milhoes) mantem o ratio de colateral acima de 130%. So apos a verificacao os tokens SeniorToken, MezzanineToken ou SubordinatedToken sao mintados para o investidor.

### Push vs Pull: escolha estrategica

A distribuicao de cupons pode seguir dois modelos:

**Modelo Push (operador envia)**:
- Vantagem: investidor recebe automaticamente, sem acao
- Desvantagem: alto custo de gas se muitos holders (loop sobre array)
- Uso ideal: operacoes com poucos investidores institucionais (< 50)

**Modelo Pull (holder resgata)**:
- Vantagem: custo de gas distribuido entre holders, escalavel
- Desvantagem: investidor precisa executar transacao para receber
- Uso ideal: operacoes com muitos investidores (> 50), mercado secundario ativo

**Modelo hibrido com Merkle tree**:
- O operador calcula os cupons off-chain e publica um Merkle root on-chain
- Cada holder faz claim apresentando sua prova Merkle
- Combina eficiencia de gas com seguranca criptografica

```solidity
/// @title MerkleCouponDistributor
/// @notice Distribuicao de cupons via Merkle tree (modelo pull eficiente)
contract MerkleCouponDistributor {

    IERC20 public paymentToken;

    // Merkle root por periodo
    mapping(uint256 => bytes32) public periodMerkleRoots;
    // Claims realizados: periodo => holder => claimed
    mapping(uint256 => mapping(address => bool)) public claimed;

    event MerkleRootSet(uint256 indexed period, bytes32 merkleRoot);
    event CouponClaimed(uint256 indexed period, address indexed holder, uint256 amount);

    /// @notice Operador publica Merkle root dos cupons do periodo
    function setMerkleRoot(uint256 _period, bytes32 _merkleRoot) external {
        // onlyRole(OPERATOR_ROLE) omitido por brevidade
        periodMerkleRoots[_period] = _merkleRoot;
        emit MerkleRootSet(_period, _merkleRoot);
    }

    /// @notice Holder resgata cupom com prova Merkle
    function claimCoupon(
        uint256 _period,
        uint256 _amount,
        bytes32[] calldata _merkleProof
    ) external {
        require(!claimed[_period][msg.sender], "Already claimed");
        require(periodMerkleRoots[_period] != bytes32(0), "No root for period");

        // Verifica prova Merkle
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount));
        require(_verifyProof(_merkleProof, periodMerkleRoots[_period], leaf), "Invalid proof");

        claimed[_period][msg.sender] = true;
        paymentToken.transfer(msg.sender, _amount);

        emit CouponClaimed(_period, msg.sender, _amount);
    }

    function _verifyProof(
        bytes32[] calldata _proof,
        bytes32 _root,
        bytes32 _leaf
    ) internal pure returns (bool) {
        bytes32 computedHash = _leaf;
        for (uint256 i = 0; i < _proof.length; i++) {
            if (computedHash <= _proof[i]) {
                computedHash = keccak256(abi.encodePacked(computedHash, _proof[i]));
            } else {
                computedHash = keccak256(abi.encodePacked(_proof[i], computedHash));
            }
        }
        return computedHash == _root;
    }
}
```

- **Exemplo**: Uma plataforma como a LUZ distribui cupons trimestrais de um CRA tokenizado de cafe. Com 200 holders, o modelo push custaria ~200 transacoes de gas ao operador. Com Merkle tree, o operador gasta uma unica transacao para publicar o root, e cada holder paga seu proprio gas ao fazer claim. Se um holder tem 500.000 tokens senior e o cupom total do periodo e 1,5% sobre R$ 30 milhoes (= R$ 450.000), sua parcela proporcional e R$ 7.500.

---

## 2. Amortizacao programada, prepayment e vencimento

### Amortizacao programada (scheduled amortization)

A amortizacao e a devolucao gradual do principal aos investidores ao longo da vida da operacao. Em securitizacoes agro, o cronograma de amortizacao geralmente acompanha a sazonalidade das safras:

- **CRA de soja**: amortizacao concentrada entre marco e junho (periodo de colheita e comercializacao)
- **CRA de cana**: amortizacao distribuida ao longo do ano (safra de abril a novembro)
- **CRA de cafe**: amortizacao entre maio e setembro (colheita e exportacao)

```solidity
/// @title AmortizationSchedule - Cronograma de amortizacao agro
contract AmortizationSchedule {

    struct AmortizationPeriod {
        uint256 timestamp;          // Data alvo da amortizacao
        uint256 amortizationBps;    // % do principal a amortizar (em basis points)
        bool executed;              // Ja executada?
    }

    AmortizationPeriod[] public schedule;

    /// @notice Configura cronograma de amortizacao safra de soja
    /// @dev Exemplo: 6 periodos, amortizacao concentrada na colheita
    function configureSoybeanSchedule(uint256 _startTimestamp) external {
        // Periodo 1 (set): 0% amortizacao (plantio)
        schedule.push(AmortizationPeriod(_startTimestamp + 30 days, 0, false));
        // Periodo 2 (dez): 0% amortizacao (crescimento)
        schedule.push(AmortizationPeriod(_startTimestamp + 90 days, 0, false));
        // Periodo 3 (mar): 25% amortizacao (inicio colheita)
        schedule.push(AmortizationPeriod(_startTimestamp + 180 days, 2500, false));
        // Periodo 4 (abr): 30% amortizacao (pico colheita)
        schedule.push(AmortizationPeriod(_startTimestamp + 210 days, 3000, false));
        // Periodo 5 (mai): 25% amortizacao (comercializacao)
        schedule.push(AmortizationPeriod(_startTimestamp + 240 days, 2500, false));
        // Periodo 6 (jun): 20% amortizacao (liquidacao final)
        schedule.push(AmortizationPeriod(_startTimestamp + 270 days, 2000, false));
    }

    /// @notice Retorna a amortizacao devida no periodo atual
    function getCurrentAmortization(uint256 _principal)
        external
        view
        returns (uint256 amortDue, uint256 periodIndex)
    {
        for (uint256 i = 0; i < schedule.length; i++) {
            if (!schedule[i].executed && block.timestamp >= schedule[i].timestamp) {
                amortDue = (_principal * schedule[i].amortizationBps) / 10000;
                periodIndex = i;
                return (amortDue, periodIndex);
            }
        }
        return (0, 0);
    }
}
```

- **Exemplo real**: Um CRA de R$ 80 milhoes lastreado em CPR de soja do Mato Grosso tem cronograma de amortizacao vinculado a safra 2025/2026. Plantio em setembro/2025, colheita entre fevereiro e abril/2026. A amortizacao e zero nos primeiros 5 meses (os produtores ainda nao venderam a soja). A partir de marco, quando os graos sao entregues e as CPR financeiras vencem, o fluxo de amortizacao comeca: 25% em marco, 30% em abril, 25% em maio e 20% em junho. Ao final de junho, 100% do principal foi amortizado.

### Prepayment (antecipacao de pagamentos)

Prepayment ocorre quando o devedor paga antes do prazo. No agro, isso acontece quando o produtor vende a safra a precos melhores que o esperado e decide liquidar sua CPR antecipadamente. On-chain, o prepayment segue a waterfall:

```solidity
/// @notice Logica detalhada de prepayment com penalidade
function processPrepayment(
    uint256 _grossAmount,
    uint256 _prepaymentPenaltyBps  // Ex: 200 = 2% de multa
) external onlyRole(SERVICER_ROLE) returns (uint256 netPrepayment) {
    // Calcula penalidade
    uint256 penalty = (_grossAmount * _prepaymentPenaltyBps) / 10000;
    netPrepayment = _grossAmount - penalty;

    // Penalidade vai para o fundo de reserva ou para a cota subordinada
    // (como compensacao pela perda de juros futuros)
    // reserveFund.deposit(penalty);

    // Valor liquido amortiza principal seguindo waterfall
    // Senior primeiro, depois mezanino, depois subordinado
    // (mesma logica do receivePrepayment no SecuritizationLifecycle)
}
```

- **Exemplo**: Um grande produtor de algodao que possui CPR financeira de R$ 5 milhoes com vencimento em junho decide antecipar o pagamento em abril, apos vender a producao com premio de 15% sobre o preco esperado. O contrato aplica penalidade de 2% (R$ 100.000), que vai para o fundo de reserva. Os R$ 4.900.000 liquidos amortizam primeiro a cota senior (R$ 3 milhoes), depois a mezanino (R$ 1.900.000). Isso acelera a amortizacao e reduz o risco para os investidores remanescentes.

### Vencimento e encerramento

No vencimento, todo o principal remanescente deve ser pago. O contrato transiciona para MATURED e os holders podem resgatar seus tokens:

```
Fluxo de vencimento:
1. block.timestamp >= config.maturityTimestamp
2. Keeper chama processMaturity() -> state = MATURED
3. Holders chamam redeemAtMaturity(tranche, amount)
4. Contrato queima tokens e transfere stablecoin proporcional
5. Apos todos os resgates, operador chama closeOperation() -> state = CLOSED
```

Se no vencimento nao ha saldo suficiente para pagar todos os holders, a waterfall de prioridade se aplica: senior recebe primeiro, mezanino depois, subordinado por ultimo. Holders da cota subordinada podem receber menos que o valor de face de seus tokens.

---

## 3. Automacao com keepers (Chainlink Automation)

### Por que keepers sao necessarios

Smart contracts nao executam sozinhos — eles precisam de uma transacao externa para acionar suas funcoes. No ciclo de vida de uma securitizacao, diversas acoes precisam ser executadas periodicamente ou quando certas condicoes sao atendidas:

- Iniciar distribuicao quando o periodo de coleta termina
- Executar a waterfall apos coleta
- Processar amortizacao quando a data chega
- Verificar health factor e acionar liquidacao se necessario
- Processar vencimento na data final

Keepers sao servicos descentralizados que monitoram condicoes on-chain e executam transacoes automaticamente quando necessario. O Chainlink Automation (antigo Keepers) e o padrao de mercado.

### Implementacao do keeper para securitizacao agro

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Interface Chainlink Automation (compatible with v2)
interface AutomationCompatibleInterface {
    function checkUpkeep(bytes calldata checkData)
        external
        returns (bool upkeepNeeded, bytes memory performData);

    function performUpkeep(bytes calldata performData) external;
}

/// @title Interfaces dos contratos do lifecycle
interface IWaterfallStateMachine {
    enum State { COLLECTING, DISTRIBUTING, DEFAULTING }
    function currentState() external view returns (State);
    function periodStartTime() external view returns (uint256);
    function periodDuration() external view returns (uint256);
    function collectedThisPeriod() external view returns (uint256);
    function startDistribution() external;
    function executeWaterfall() external;
}

interface ICreditEnhancement {
    enum CollateralState { HEALTHY, WARNING, LIQUIDATING }
    function calculateHealthFactor() external view returns (uint256);
    function updateCollateralState() external;
    function liquidationThresholdBps() external view returns (uint256);
}

interface ISecuritizationLifecycle {
    enum LifecycleState { FUNDING, ACTIVE, MATURING, MATURED, DEFAULTED, CLOSED }
    function state() external view returns (LifecycleState);
    function config() external view returns (
        uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256, uint256
    );
    function executeAmortization() external;
    function processMaturity() external;
}

/// @title SecuritizationKeeper - Automacao completa do lifecycle agro
/// @notice Integra com Chainlink Automation para executar acoes periodicas
contract SecuritizationKeeper is AutomationCompatibleInterface {

    IWaterfallStateMachine public waterfall;
    ICreditEnhancement public creditEnhancement;
    ISecuritizationLifecycle public lifecycle;

    // Tipos de acao que o keeper pode executar
    enum ActionType {
        START_DISTRIBUTION,     // Periodo de coleta encerrado, iniciar distribuicao
        EXECUTE_WATERFALL,      // Distribuir pagamentos
        UPDATE_HEALTH_FACTOR,   // Atualizar estado de colateral
        EXECUTE_AMORTIZATION,   // Processar amortizacao programada
        PROCESS_MATURITY        // Processar vencimento
    }

    // Intervalo minimo entre verificacoes de health factor
    uint256 public healthCheckInterval;
    uint256 public lastHealthCheck;

    event KeeperActionExecuted(ActionType indexed action, uint256 timestamp);

    constructor(
        address _waterfall,
        address _creditEnhancement,
        address _lifecycle,
        uint256 _healthCheckInterval
    ) {
        waterfall = IWaterfallStateMachine(_waterfall);
        creditEnhancement = ICreditEnhancement(_creditEnhancement);
        lifecycle = ISecuritizationLifecycle(_lifecycle);
        healthCheckInterval = _healthCheckInterval;
    }

    /// @notice Chainlink Automation chama esta funcao para verificar se ha acao pendente
    /// @dev Retorna true se alguma acao precisa ser executada
    function checkUpkeep(bytes calldata /* checkData */)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        // Prioridade 1: Verificar se periodo de coleta terminou
        if (_isCollectionPeriodEnded()) {
            return (true, abi.encode(ActionType.START_DISTRIBUTION));
        }

        // Prioridade 2: Verificar se waterfall precisa ser executada
        if (_isReadyForDistribution()) {
            return (true, abi.encode(ActionType.EXECUTE_WATERFALL));
        }

        // Prioridade 3: Verificar health factor periodicamente
        if (_isHealthCheckDue()) {
            return (true, abi.encode(ActionType.UPDATE_HEALTH_FACTOR));
        }

        // Prioridade 4: Verificar se vencimento chegou
        if (_isMaturityReached()) {
            return (true, abi.encode(ActionType.PROCESS_MATURITY));
        }

        return (false, bytes(""));
    }

    /// @notice Chainlink Automation chama esta funcao para executar a acao
    function performUpkeep(bytes calldata performData) external override {
        ActionType action = abi.decode(performData, (ActionType));

        if (action == ActionType.START_DISTRIBUTION) {
            require(_isCollectionPeriodEnded(), "Not ready");
            waterfall.startDistribution();

        } else if (action == ActionType.EXECUTE_WATERFALL) {
            require(_isReadyForDistribution(), "Not ready");
            waterfall.executeWaterfall();

        } else if (action == ActionType.UPDATE_HEALTH_FACTOR) {
            require(_isHealthCheckDue(), "Not due");
            creditEnhancement.updateCollateralState();
            lastHealthCheck = block.timestamp;

        } else if (action == ActionType.PROCESS_MATURITY) {
            require(_isMaturityReached(), "Not matured");
            lifecycle.processMaturity();
        }

        emit KeeperActionExecuted(action, block.timestamp);
    }

    // ============================================================
    //              FUNCOES DE VERIFICACAO INTERNAS
    // ============================================================

    function _isCollectionPeriodEnded() internal view returns (bool) {
        return waterfall.currentState() == IWaterfallStateMachine.State.COLLECTING
            && block.timestamp >= waterfall.periodStartTime() + waterfall.periodDuration();
    }

    function _isReadyForDistribution() internal view returns (bool) {
        return waterfall.currentState() == IWaterfallStateMachine.State.DISTRIBUTING
            && waterfall.collectedThisPeriod() > 0;
    }

    function _isHealthCheckDue() internal view returns (bool) {
        return block.timestamp >= lastHealthCheck + healthCheckInterval;
    }

    function _isMaturityReached() internal view returns (bool) {
        return lifecycle.state() == ISecuritizationLifecycle.LifecycleState.ACTIVE
            || lifecycle.state() == ISecuritizationLifecycle.LifecycleState.MATURING;
        // Nota: verificacao completa do timestamp de vencimento seria feita
        // consultando config().maturityTimestamp, simplificado aqui.
    }
}
```

- **Exemplo real**: Uma securitizacao de recebiveis de acucar da Copersucar, tokenizada na blockchain, registra o contrato `SecuritizationKeeper` no Chainlink Automation. O keeper e configurado para verificar a cada bloco se alguma acao e necessaria. No dia 15 de cada mes (fim do periodo de coleta), o keeper automaticamente chama `startDistribution()` e `executeWaterfall()`, distribuindo os pagamentos para as cotas conforme prioridade. A cada 6 horas, verifica o health factor. Se a cotacao do acucar na ICE (Intercontinental Exchange) cair 20% em uma semana, o oraculo atualiza o valor do colateral e o keeper detecta que o HF caiu abaixo de 105%, acionando a atualizacao de estado para LIQUIDATING. Tudo isso sem intervencao humana.

### Registro no Chainlink Automation

Para registrar o keeper no Chainlink Automation, o operador precisa:

```
1. Deploy do SecuritizationKeeper na rede desejada
2. Garantir que o contrato keeper tem as roles necessarias
   nos contratos waterfall, creditEnhancement e lifecycle
3. Acessar app.chain.link/automation
4. Registrar novo Upkeep do tipo "Custom logic"
5. Informar endereco do SecuritizationKeeper
6. Depositar LINK para gas (ex: 10 LINK para ~6 meses de operacao)
7. Definir gas limit por execucao (ex: 500.000 gas)
```

O custo operacional e minimo: cada execucao do keeper consome entre 200.000 e 500.000 gas, dependendo da complexidade da acao. Em redes como Polygon ou Arbitrum, isso equivale a centavos por execucao. Em uma operacao com periodo mensal e verificacao de health factor a cada 6 horas, o custo total de automacao pode ser inferior a R$ 50 por mes — uma fracao do custo de um agente fiduciario tradicional.

### Diagrama completo do lifecycle automatizado

```
                    +------------+
                    |   FUNDING  |
                    +-----+------+
                          |
                  activateOperation()
                          |
                    +-----v------+
               +--->| COLLECTING |<-----------+
               |    +-----+------+            |
               |          |                   |
               |   startDistribution()        |
               |   (keeper automatico)        |
               |          |                   |
               |    +-----v--------+          |
               |    | DISTRIBUTING |          |
               |    +-----+--------+          |
               |          |                   |
               |   executeWaterfall()         |
               |   (keeper automatico)        |
               |          |                   |
               +----------+                   |
                                              |
          updateCollateralState()             |
          (keeper a cada 6h)                  |
               |                              |
               v                              |
        HF < threshold?---NO--->--------------+
               |
               YES
               |
        +------v------+
        |  DEFAULTING  |
        +------+------+
               |
       triggerAcceleration()
               |
        +------v------+
        |   MATURED   |
        +------+------+
               |
        redeemAtMaturity()
               |
        +------v------+
        |   CLOSED    |
        +-------------+
```

- **Exemplo integrado**: A plataforma LUZ tokeniza um CRA de R$ 200 milhoes lastreado em recebiveis de cooperativas de graos de Goias. O lifecycle completo e automatizado: (1) Na fase FUNDING, investidores compram tokens de cota senior, mezanino e subordinada via interface web. (2) O operador ativa a operacao e o keeper assume. (3) Mensalmente, o keeper inicia a distribuicao, executa a waterfall e processa amortizacao. (4) A cada 6 horas, verifica o health factor. (5) Se um evento de seca aciona o seguro parametrico, o payout e injetado na waterfall automaticamente. (6) No vencimento (18 meses apos emissao), o keeper processa a maturidade e os holders resgatam seus tokens. (7) O operador encerra a operacao. Todo o ciclo, do inicio ao fim, opera com minima intervencao humana.

---

## Conclusao

Nesta aula, completamos a implementacao do lifecycle automatizado de uma securitizacao agro tokenizada. Construimos o mecanismo de emissao condicional (mint apos verificacao de lastro via oraculo), que garante que tokens so existem se o colateral e suficiente. Implementamos dois modelos de distribuicao de cupons — push (direto ao holder) e pull (claim com Merkle tree) — com analise de trade-offs de gas e escalabilidade. Desenvolvemos a logica de amortizacao programada alinhada a sazonalidade das safras brasileiras, prepayment com penalidade e processamento de vencimento com resgate via burn de tokens. Por fim, integramos tudo com Chainlink Automation, criando um keeper que monitora e executa automaticamente cada etapa do ciclo — coleta, distribuicao, verificacao de saude, amortizacao e vencimento. O resultado e uma securitizacao que opera de forma autonoma, transparente e auditavel, com custo operacional dramaticamente inferior ao modelo tradicional.

---

## Licao de Casa

1. Implante o sistema completo em uma testnet: `TrancheToken` (3 instancias), `SecuritizationLifecycle` e `SecuritizationKeeper`. Configure uma operacao com R$ 1 milhao (600k senior, 250k mezanino, 150k subordinado), periodo mensal e vencimento em 6 meses. Simule o lifecycle completo: funding, 3 periodos de pagamento normal, 1 prepayment parcial, e vencimento. Documente cada transacao com screenshots do block explorer.

2. Implemente o `MerkleCouponDistributor` completo, incluindo um script off-chain (em JavaScript/TypeScript com ethers.js) que: (a) consulta os balances de todos os holders dos tokens de tranche, (b) calcula o cupom proporcional de cada um, (c) gera a Merkle tree e (d) publica o root on-chain. Teste com pelo menos 5 enderecos holders diferentes.

3. Analise a viabilidade economica da automacao via Chainlink Keeper para uma securitizacao real de R$ 50 milhoes. Calcule: (a) custo mensal de gas na rede Polygon para todas as operacoes automatizadas (coleta, distribuicao, health check, amortizacao), (b) custo anual em LINK para o upkeep, (c) comparacao com o custo de um agente fiduciario tradicional (tipicamente 0,1% a 0,3% ao ano sobre o volume da operacao). Apresente suas conclusoes em formato de analise de custo-beneficio.

---

## Questionario

**1. No contrato SecuritizationLifecycle, por que a funcao invest() verifica o colateral via oraculo ANTES de mintar os tokens?**

a) Porque o oraculo precisa ser chamado em toda transacao para manter seu preco atualizado
b) Para garantir que tokens de securitizacao so existam quando o lastro e suficiente, evitando emissao de titulos sem colateral adequado
c) Porque a funcao mint do ERC-20 exige aprovacao do oraculo para funcionar
d) Para calcular a taxa de juros que sera aplicada ao investidor

**Resposta: b**

---

**2. Qual e a principal vantagem do modelo pull com Merkle tree para distribuicao de cupons em comparacao ao modelo push?**

a) O modelo pull e mais seguro porque o operador nao tem acesso aos fundos
b) O modelo pull elimina completamente a necessidade de smart contracts
c) O modelo pull distribui o custo de gas entre os holders e escala melhor para operacoes com muitos investidores, enquanto o push concentra todo o custo no operador
d) O modelo pull permite que o operador modifique os valores dos cupons apos a distribuicao

**Resposta: c**

---

**3. Por que o cronograma de amortizacao de um CRA de soja concentra os pagamentos entre marco e junho?**

a) Porque a CVM exige que todas as amortizacoes ocorram no primeiro semestre do ano
b) Porque esse e o periodo em que a soja e colhida, comercializada e as CPR financeiras vencem, gerando o fluxo de caixa necessario para amortizar o principal
c) Porque os precos da soja sao mais altos nesse periodo e o investidor recebe mais
d) Porque o Banco Central suspende operacoes de credito rural no segundo semestre

**Resposta: b**

---

**4. Qual e a funcao do checkUpkeep() no contrato SecuritizationKeeper?**

a) Executar as acoes de automacao diretamente, como distribuir pagamentos e processar amortizacao
b) Verificar se alguma condicao on-chain exige acao (periodo encerrado, health factor baixo, vencimento) e retornar qual acao deve ser executada
c) Registrar o contrato no Chainlink Automation e depositar LINK para gas
d) Atualizar os precos do oraculo de colateral a cada bloco

**Resposta: b**

---

**5. Em um cenario onde um grande produtor antecipa o pagamento de sua CPR (prepayment) de R$ 5 milhoes com penalidade de 2%, qual e o fluxo correto no smart contract?**

a) Os R$ 5 milhoes vao integralmente para a cota subordinada como compensacao pela perda de juros futuros
b) A penalidade de R$ 100.000 e direcionada ao fundo de reserva, e os R$ 4.900.000 liquidos amortizam o principal seguindo a waterfall (senior primeiro, depois mezanino, depois subordinado)
c) O prepayment e rejeitado pelo smart contract porque antecipacoes nao sao permitidas em securitizacoes tokenizadas
d) Os R$ 5 milhoes sao distribuidos igualmente entre todas as tranches, independente da ordem de prioridade

**Resposta: b**

---

## Proxima Aula

No proximo modulo — Modulo 4: Seguranca, Auditoria e Governanca — vamos abordar as praticas essenciais para garantir que os smart contracts de securitizacao agro sejam seguros, auditaveis e governados de forma descentralizada. Estudaremos padroes de seguranca (reentrancy guards, access control, pausability), processos de auditoria (ferramentas automatizadas e auditorias manuais), e modelos de governanca on-chain para decisoes como reestruturacao de operacoes e alteracao de parametros. Ate la!
