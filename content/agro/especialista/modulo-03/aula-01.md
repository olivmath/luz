# Aula 3.1: Waterfall Programatica

## Abertura

Bem-vindo a aula 3.1 do Modulo 3 — Waterfall e Automacao de Pagamentos. Nesta aula, vamos implementar a logica de cascata de pagamentos (waterfall) em smart contracts Solidity, reproduzindo on-chain a mesma estrutura de prioridade que securitizadoras tradicionais utilizam para distribuir os fluxos de caixa de um CRA. Nos modulos anteriores, voce compreendeu a arquitetura de tokens de securitizacao e a integracao com oraculos para precificacao de ativos do agronegocio. Agora, vamos transformar a regra de distribuicao — despesas operacionais primeiro, depois cota senior, mezanino e subordinada — em codigo executavel e auditavel. Ao final, voce sera capaz de projetar e implementar um smart contract distribuidor com maquina de estados que gerencia todo o ciclo de pagamentos de uma securitizacao agro tokenizada.

### Programa da aula:

1. Revisao da ordem de prioridade e modelagem da waterfall (despesas, senior, mezanino, subordinado)
2. Smart contract distribuidor: recebe pagamentos e distribui conforme prioridade
3. State machine on-chain: collecting, distributing, defaulting

---

## 1. Revisao da ordem de prioridade e modelagem da waterfall

### O que e uma waterfall de pagamentos

Em uma securitizacao tradicional de recebiveis do agronegocio — como um CRA lastreado em CPR financeiras de soja — os pagamentos recebidos dos devedores nao sao distribuidos igualmente entre todos os investidores. Existe uma ordem rigida de prioridade, chamada waterfall (cascata), que determina quem recebe primeiro e quem recebe por ultimo. Essa estrutura existe para criar camadas de protecao: os investidores de maior prioridade (senior) tem menor risco, enquanto os de menor prioridade (subordinado) absorvem as primeiras perdas.

A waterfall tipica de uma securitizacao agro segue esta ordem:

1. **Despesas operacionais**: taxas da securitizadora, agente fiduciario, custodiante, registradora, auditoria e compliance. Essas despesas tem prioridade absoluta porque, sem o pagamento dos prestadores de servico, a operacao nao funciona.
2. **Cota senior**: investidores com menor risco e menor remuneracao. Recebem juros e amortizacao antes de qualquer outra classe de investidor.
3. **Cota mezanino**: investidores com risco intermediario. So recebem apos a cota senior ter sido integralmente paga no periodo.
4. **Cota subordinada**: investidores com maior risco e maior remuneracao potencial. Recebem o residual — o que sobra apos todas as camadas superiores terem sido satisfeitas.

### Modelagem em estruturas de dados Solidity

Para representar essa waterfall on-chain, precisamos de uma estrutura que capture cada camada (tranche) com seus parametros. Vejamos a modelagem:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title Estruturas de dados para waterfall de securitizacao agro
library WaterfallTypes {

    enum TrancheType {
        EXPENSES,   // Despesas operacionais
        SENIOR,     // Cota senior
        MEZZANINE,  // Cota mezanino
        SUBORDINATED // Cota subordinada
    }

    struct Tranche {
        TrancheType trancheType;
        uint256 targetAmount;      // Valor alvo para o periodo (juros + amortizacao)
        uint256 paidAmount;        // Valor ja pago no periodo atual
        address paymentReceiver;   // Endereco que recebe os pagamentos
        uint256 interestRateBps;   // Taxa de juros em basis points (100 = 1%)
        uint256 principalBalance;  // Saldo devedor de principal
    }

    struct WaterfallConfig {
        Tranche[] tranches;        // Array ordenado por prioridade
        uint256 totalCollected;    // Total coletado no periodo
        uint256 totalDistributed;  // Total distribuido no periodo
        uint256 periodDuration;    // Duracao de cada periodo em segundos
        uint256 currentPeriod;     // Periodo atual
    }
}
```

- **Exemplo real**: Em um CRA de R$ 100 milhoes lastreado em recebiveis de uma cooperativa de cafe em Minas Gerais, a waterfall poderia ser configurada assim: Tranche 0 (EXPENSES) com targetAmount de R$ 200.000 (0,2% ao periodo para custos operacionais), Tranche 1 (SENIOR) com R$ 60 milhoes de principal e taxa de CDI + 1,5%, Tranche 2 (MEZZANINE) com R$ 25 milhoes e CDI + 3,5%, e Tranche 3 (SUBORDINATED) com R$ 15 milhoes recebendo o residual.

### Calculo do target amount por periodo

O calculo do valor alvo de cada tranche em cada periodo de pagamento segue a formula de juros sobre o saldo devedor, acrescido da parcela de amortizacao programada:

```solidity
/// @notice Calcula o valor alvo de uma tranche para o periodo corrente
/// @param principal Saldo devedor de principal da tranche
/// @param rateBps Taxa de juros em basis points (ex: 150 = 1,5%)
/// @param amortizationBps Percentual de amortizacao em basis points
function calculateTargetAmount(
    uint256 principal,
    uint256 rateBps,
    uint256 amortizationBps
) public pure returns (uint256 interestDue, uint256 amortDue, uint256 total) {
    interestDue = (principal * rateBps) / 10000;
    amortDue = (principal * amortizationBps) / 10000;
    total = interestDue + amortDue;
}
```

- **Exemplo**: Se a cota senior tem saldo devedor de 60.000.000 USDC (representando R$ 60 milhoes), taxa de 150 bps (1,5%) por periodo e amortizacao de 500 bps (5%) por periodo, o target amount seria: juros = 900.000 USDC, amortizacao = 3.000.000 USDC, total = 3.900.000 USDC.

---

## 2. Smart contract distribuidor

### Arquitetura do contrato distribuidor

O contrato distribuidor e o coracao da waterfall on-chain. Ele recebe os pagamentos dos devedores (ou de um contrato agregador) e distribui conforme a prioridade definida. A arquitetura segue o padrao de separacao de responsabilidades:

- **PaymentCollector**: recebe e acumula pagamentos
- **WaterfallDistributor**: executa a logica de distribuicao
- **TrancheToken**: tokens ERC-20 que representam cada cota

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title WaterfallDistributor - Distribuidor de pagamentos em cascata
/// @notice Implementa waterfall de securitizacao agro on-chain
contract WaterfallDistributor is AccessControl, ReentrancyGuard {

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant SERVICER_ROLE = keccak256("SERVICER_ROLE");

    IERC20 public paymentToken; // Stablecoin usada para pagamentos (ex: USDC, DREX)

    enum TrancheType { EXPENSES, SENIOR, MEZZANINE, SUBORDINATED }

    struct Tranche {
        TrancheType trancheType;
        uint256 targetAmount;
        uint256 paidAmount;
        address receiver;
        uint256 interestRateBps;
        uint256 amortizationBps;
        uint256 principalBalance;
        bool fullyPaid;
    }

    Tranche[] public tranches;

    uint256 public currentPeriod;
    uint256 public periodStartTime;
    uint256 public periodDuration;
    uint256 public collectedThisPeriod;
    uint256 public distributedThisPeriod;

    event PaymentReceived(address indexed from, uint256 amount, uint256 period);
    event TranchePayment(uint256 indexed trancheIndex, uint256 amount, uint256 period);
    event PeriodClosed(uint256 indexed period, uint256 collected, uint256 distributed);
    event WaterfallExecuted(uint256 indexed period, uint256 totalDistributed);

    constructor(
        address _paymentToken,
        uint256 _periodDuration,
        address _admin
    ) {
        paymentToken = IERC20(_paymentToken);
        periodDuration = _periodDuration;
        periodStartTime = block.timestamp;
        currentPeriod = 1;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(OPERATOR_ROLE, _admin);
    }

    /// @notice Adiciona uma tranche a waterfall (deve ser chamado em ordem de prioridade)
    function addTranche(
        TrancheType _type,
        address _receiver,
        uint256 _interestRateBps,
        uint256 _amortizationBps,
        uint256 _principalBalance
    ) external onlyRole(OPERATOR_ROLE) {
        // Valida ordem: EXPENSES < SENIOR < MEZZANINE < SUBORDINATED
        if (tranches.length > 0) {
            require(
                uint8(_type) >= uint8(tranches[tranches.length - 1].trancheType),
                "Tranches must be added in priority order"
            );
        }

        uint256 target = _calculateTarget(_principalBalance, _interestRateBps, _amortizationBps);

        tranches.push(Tranche({
            trancheType: _type,
            targetAmount: target,
            paidAmount: 0,
            receiver: _receiver,
            interestRateBps: _interestRateBps,
            amortizationBps: _amortizationBps,
            principalBalance: _principalBalance,
            fullyPaid: false
        }));
    }

    /// @notice Recebe pagamento de um devedor ou servicer
    function receivePayment(uint256 _amount) external onlyRole(SERVICER_ROLE) {
        require(_amount > 0, "Amount must be greater than 0");
        require(
            paymentToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );

        collectedThisPeriod += _amount;
        emit PaymentReceived(msg.sender, _amount, currentPeriod);
    }

    /// @notice Executa a waterfall de distribuicao
    function executeWaterfall() external onlyRole(OPERATOR_ROLE) nonReentrant {
        uint256 available = collectedThisPeriod - distributedThisPeriod;
        require(available > 0, "No funds available for distribution");

        for (uint256 i = 0; i < tranches.length && available > 0; i++) {
            Tranche storage tranche = tranches[i];

            if (tranche.fullyPaid) continue;

            uint256 remaining = tranche.targetAmount - tranche.paidAmount;
            uint256 payment = available >= remaining ? remaining : available;

            if (payment > 0) {
                tranche.paidAmount += payment;
                available -= payment;
                distributedThisPeriod += payment;

                require(
                    paymentToken.transfer(tranche.receiver, payment),
                    "Tranche payment transfer failed"
                );

                if (tranche.paidAmount >= tranche.targetAmount) {
                    tranche.fullyPaid = true;
                    // Atualiza saldo devedor apos amortizacao
                    uint256 amortPaid = (tranche.principalBalance * tranche.amortizationBps) / 10000;
                    if (amortPaid <= tranche.principalBalance) {
                        tranche.principalBalance -= amortPaid;
                    } else {
                        tranche.principalBalance = 0;
                    }
                }

                emit TranchePayment(i, payment, currentPeriod);
            }
        }

        emit WaterfallExecuted(currentPeriod, distributedThisPeriod);
    }

    /// @notice Fecha o periodo atual e abre o proximo
    function closePeriod() external onlyRole(OPERATOR_ROLE) {
        require(
            block.timestamp >= periodStartTime + periodDuration,
            "Period not yet ended"
        );

        emit PeriodClosed(currentPeriod, collectedThisPeriod, distributedThisPeriod);

        currentPeriod++;
        periodStartTime = block.timestamp;
        collectedThisPeriod = 0;
        distributedThisPeriod = 0;

        // Reseta pagamentos das tranches para o novo periodo
        for (uint256 i = 0; i < tranches.length; i++) {
            tranches[i].paidAmount = 0;
            tranches[i].fullyPaid = false;
            tranches[i].targetAmount = _calculateTarget(
                tranches[i].principalBalance,
                tranches[i].interestRateBps,
                tranches[i].amortizationBps
            );
        }
    }

    function _calculateTarget(
        uint256 _principal,
        uint256 _rateBps,
        uint256 _amortBps
    ) internal pure returns (uint256) {
        uint256 interest = (_principal * _rateBps) / 10000;
        uint256 amort = (_principal * _amortBps) / 10000;
        return interest + amort;
    }

    /// @notice Consulta status de todas as tranches
    function getTrancheStatus() external view returns (Tranche[] memory) {
        return tranches;
    }

    /// @notice Consulta saldo disponivel para distribuicao
    function getAvailableForDistribution() external view returns (uint256) {
        return collectedThisPeriod - distributedThisPeriod;
    }
}
```

- **Exemplo real**: Imagine uma securitizacao de recebiveis de algodao do oeste baiano. O servicer (agente que faz a cobranca dos produtores) coleta os pagamentos mensais das CPR financeiras e chama `receivePayment()`. Ao final do periodo de coleta, o operador chama `executeWaterfall()`, e o contrato distribui automaticamente: primeiro paga R$ 150.000 de despesas operacionais para a securitizadora, depois paga R$ 2.800.000 de juros e amortizacao da cota senior para o pool de investidores institucionais, em seguida R$ 900.000 para a cota mezanino, e por fim o residual para a cota subordinada (geralmente retida pelo originador como skin in the game).

### Tratamento de insuficiencia de fundos

Quando o valor coletado nao e suficiente para pagar todas as tranches, a waterfall simplesmente para na tranche onde o dinheiro acabou. Esse e o mecanismo central de protecao:

```solidity
// No loop de executeWaterfall():
// Se available = 2.000.000 e:
// - Tranche 0 (EXPENSES) target = 200.000 -> paga 200.000, available = 1.800.000
// - Tranche 1 (SENIOR) target = 3.900.000 -> paga 1.800.000, available = 0
// - Tranche 2 (MEZZANINE) target = 1.200.000 -> paga 0
// - Tranche 3 (SUBORDINATED) target = residual -> paga 0
// A cota senior recebe pagamento parcial, mezanino e subordinado nao recebem nada
```

Esse comportamento e identico ao que acontece no mercado tradicional. Em um CRA da Copersucar lastreado em recebiveis de acucar, se os produtores atrasam os pagamentos e o fluxo do periodo cai de R$ 5 milhoes para R$ 2 milhoes, as cotas senior e mezanino absorvem o impacto em ordem inversa de prioridade.

---

## 3. State machine on-chain

### Estados do ciclo de pagamento

A waterfall nao opera em fluxo continuo — ela segue um ciclo definido por estados. Implementar uma maquina de estados (state machine) no smart contract garante que cada operacao so aconteca no momento correto, evitando distribuicoes duplicadas ou coleta de pagamentos fora de periodo.

Os tres estados fundamentais sao:

1. **COLLECTING**: periodo aberto para recebimento de pagamentos dos devedores. Nenhuma distribuicao pode ocorrer.
2. **DISTRIBUTING**: periodo de coleta encerrado, waterfall sendo executada. Nenhum novo pagamento e aceito.
3. **DEFAULTING**: evento de inadimplencia detectado. Aciona procedimentos especiais (aceleracao, liquidacao).

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title WaterfallStateMachine
/// @notice Waterfall com maquina de estados para securitizacao agro
contract WaterfallStateMachine is AccessControl, ReentrancyGuard {

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
    bytes32 public constant SERVICER_ROLE = keccak256("SERVICER_ROLE");
    bytes32 public constant TRUSTEE_ROLE = keccak256("TRUSTEE_ROLE"); // Agente fiduciario

    enum State { COLLECTING, DISTRIBUTING, DEFAULTING }
    enum TrancheType { EXPENSES, SENIOR, MEZZANINE, SUBORDINATED }

    struct Tranche {
        TrancheType trancheType;
        uint256 targetAmount;
        uint256 paidAmount;
        address receiver;
        uint256 interestRateBps;
        uint256 amortizationBps;
        uint256 principalBalance;
    }

    State public currentState;
    Tranche[] public tranches;
    IERC20 public paymentToken;

    uint256 public currentPeriod;
    uint256 public periodStartTime;
    uint256 public periodDuration;
    uint256 public collectedThisPeriod;
    uint256 public consecutiveMissedPeriods;
    uint256 public maxMissedPeriods; // Ex: 3 periodos sem pagamento = default

    // Threshold minimo: se coleta < threshold, conta como missed
    uint256 public minimumCollectionThreshold;

    event StateChanged(State indexed oldState, State indexed newState, uint256 period);
    event DefaultDeclared(uint256 indexed period, uint256 consecutiveMissed);
    event AccelerationTriggered(uint256 indexed period, uint256 totalOutstanding);

    modifier inState(State _state) {
        require(currentState == _state, "Invalid state for this operation");
        _;
    }

    constructor(
        address _paymentToken,
        uint256 _periodDuration,
        uint256 _maxMissedPeriods,
        uint256 _minCollectionThreshold,
        address _admin
    ) {
        paymentToken = IERC20(_paymentToken);
        periodDuration = _periodDuration;
        maxMissedPeriods = _maxMissedPeriods;
        minimumCollectionThreshold = _minCollectionThreshold;
        currentState = State.COLLECTING;
        currentPeriod = 1;
        periodStartTime = block.timestamp;

        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(OPERATOR_ROLE, _admin);
        _grantRole(TRUSTEE_ROLE, _admin);
    }

    /// @notice Recebe pagamento (somente em estado COLLECTING)
    function receivePayment(uint256 _amount)
        external
        onlyRole(SERVICER_ROLE)
        inState(State.COLLECTING)
    {
        require(
            paymentToken.transferFrom(msg.sender, address(this), _amount),
            "Transfer failed"
        );
        collectedThisPeriod += _amount;
    }

    /// @notice Transicao: COLLECTING -> DISTRIBUTING
    function startDistribution()
        external
        onlyRole(OPERATOR_ROLE)
        inState(State.COLLECTING)
    {
        require(
            block.timestamp >= periodStartTime + periodDuration,
            "Collection period not ended"
        );

        // Verifica se coleta atingiu threshold minimo
        if (collectedThisPeriod < minimumCollectionThreshold) {
            consecutiveMissedPeriods++;

            if (consecutiveMissedPeriods >= maxMissedPeriods) {
                _transitionTo(State.DEFAULTING);
                emit DefaultDeclared(currentPeriod, consecutiveMissedPeriods);
                return;
            }
        } else {
            consecutiveMissedPeriods = 0;
        }

        _transitionTo(State.DISTRIBUTING);
    }

    /// @notice Executa waterfall (somente em estado DISTRIBUTING)
    function executeWaterfall()
        external
        onlyRole(OPERATOR_ROLE)
        inState(State.DISTRIBUTING)
        nonReentrant
    {
        uint256 available = collectedThisPeriod;

        for (uint256 i = 0; i < tranches.length && available > 0; i++) {
            Tranche storage t = tranches[i];
            uint256 due = t.targetAmount - t.paidAmount;
            uint256 payment = available >= due ? due : available;

            if (payment > 0) {
                t.paidAmount += payment;
                available -= payment;
                paymentToken.transfer(t.receiver, payment);

                // Amortiza principal se pagamento completo
                if (t.paidAmount >= t.targetAmount) {
                    uint256 amortPaid = (t.principalBalance * t.amortizationBps) / 10000;
                    t.principalBalance = t.principalBalance > amortPaid
                        ? t.principalBalance - amortPaid
                        : 0;
                }
            }
        }

        // Avanca para proximo periodo
        _startNewPeriod();
        _transitionTo(State.COLLECTING);
    }

    /// @notice Agente fiduciario pode declarar default manualmente
    function declareDefault()
        external
        onlyRole(TRUSTEE_ROLE)
    {
        _transitionTo(State.DEFAULTING);
        emit DefaultDeclared(currentPeriod, consecutiveMissedPeriods);
    }

    /// @notice Aceleracao: antecipa vencimento de todas as tranches
    function triggerAcceleration()
        external
        onlyRole(TRUSTEE_ROLE)
        inState(State.DEFAULTING)
    {
        uint256 totalOutstanding;
        for (uint256 i = 0; i < tranches.length; i++) {
            totalOutstanding += tranches[i].principalBalance;
            tranches[i].targetAmount = tranches[i].principalBalance;
            tranches[i].paidAmount = 0;
        }

        emit AccelerationTriggered(currentPeriod, totalOutstanding);
        // Apos aceleracao, operador pode executar waterfall com saldo disponivel
        currentState = State.DISTRIBUTING;
    }

    function _transitionTo(State _newState) internal {
        State oldState = currentState;
        currentState = _newState;
        emit StateChanged(oldState, _newState, currentPeriod);
    }

    function _startNewPeriod() internal {
        currentPeriod++;
        periodStartTime = block.timestamp;
        collectedThisPeriod = 0;

        for (uint256 i = 0; i < tranches.length; i++) {
            tranches[i].paidAmount = 0;
            tranches[i].targetAmount = _calculateTarget(
                tranches[i].principalBalance,
                tranches[i].interestRateBps,
                tranches[i].amortizationBps
            );
        }
    }

    function _calculateTarget(
        uint256 _principal,
        uint256 _rateBps,
        uint256 _amortBps
    ) internal pure returns (uint256) {
        return (_principal * _rateBps) / 10000 + (_principal * _amortBps) / 10000;
    }

    function addTranche(
        TrancheType _type,
        address _receiver,
        uint256 _interestRateBps,
        uint256 _amortizationBps,
        uint256 _principalBalance
    ) external onlyRole(OPERATOR_ROLE) inState(State.COLLECTING) {
        tranches.push(Tranche({
            trancheType: _type,
            targetAmount: _calculateTarget(_principalBalance, _interestRateBps, _amortizationBps),
            paidAmount: 0,
            receiver: _receiver,
            interestRateBps: _interestRateBps,
            amortizationBps: _amortizationBps,
            principalBalance: _principalBalance
        }));
    }
}
```

### Diagrama de transicao de estados

O fluxo de estados segue esta logica:

```
COLLECTING ---(periodo encerrado, coleta >= threshold)---> DISTRIBUTING
COLLECTING ---(periodo encerrado, coleta < threshold, missed < max)---> DISTRIBUTING
COLLECTING ---(periodo encerrado, coleta < threshold, missed >= max)---> DEFAULTING
DISTRIBUTING ---(waterfall executada)---> COLLECTING (proximo periodo)
DEFAULTING ---(aceleracao pelo trustee)---> DISTRIBUTING (liquidacao)
DEFAULTING ---(resolucao/reestruturacao pelo admin)---> COLLECTING
```

- **Exemplo real**: Em uma securitizacao de recebiveis de milho safrinha no Mato Grosso, o periodo de coleta e mensal. Se o contrato coleta R$ 4 milhoes (acima do threshold de R$ 3 milhoes), transiciona para DISTRIBUTING e executa a waterfall normalmente. Se em marco, apos uma quebra de safra por seca, a coleta cai para R$ 800.000, o contador de missed periods incrementa. Se isso acontece tres meses seguidos (marco, abril, maio), o contrato transiciona para DEFAULTING, e o agente fiduciario on-chain (TRUSTEE_ROLE) pode acionar a aceleracao — antecipando o vencimento de todas as cotas e distribuindo o saldo remanescente conforme a waterfall.

### Eventos e transparencia

Cada transicao de estado, cada pagamento recebido e cada distribuicao emitem eventos on-chain. Isso permite:

- **Auditoria em tempo real**: qualquer investidor pode verificar o historico completo de pagamentos
- **Integracao com dashboards**: front-ends podem monitorar o status da operacao via eventos
- **Compliance regulatorio**: a CVM e o agente fiduciario podem auditar a operacao sem depender de relatorios manuais

```solidity
// Exemplo de consulta de eventos via ethers.js
// const filter = contract.filters.TranchePayment(trancheIndex);
// const events = await contract.queryFilter(filter, fromBlock, toBlock);
// events.forEach(e => console.log(`Periodo ${e.args.period}: ${e.args.amount} USDC`));
```

- **Exemplo**: A plataforma LUZ poderia oferecer um painel onde investidores de um CRA tokenizado de recebiveis de acucar acompanham em tempo real cada pagamento recebido, a transicao de estados do contrato e o percentual de pagamento de cada tranche. Isso substitui o relatorio mensal do agente fiduciario — que no mercado tradicional leva dias para ser publicado — por informacao instantanea e verificavel.

---

## Conclusao

Nesta aula, construimos a base da logica de pagamentos em cascata on-chain. Revisamos a ordem de prioridade da waterfall (despesas, senior, mezanino, subordinado) e sua importancia na protecao dos investidores de securitizacoes agro. Implementamos um smart contract distribuidor completo em Solidity, capaz de receber pagamentos de um servicer e distribuir conforme prioridade estrita, incluindo tratamento de insuficiencia de fundos. Por fim, projetamos uma maquina de estados com tres fases — COLLECTING, DISTRIBUTING, DEFAULTING — que governa o ciclo de vida de cada periodo de pagamento, incluindo deteccao automatica de inadimplencia e aceleracao. Essa arquitetura forma o esqueleto sobre o qual construiremos, nas proximas aulas, os mecanismos de credit enhancement e automacao do lifecycle completo.

---

## Licao de Casa

1. Implante o contrato `WaterfallStateMachine` em uma testnet (Sepolia ou Polygon Amoy) usando um token ERC-20 de teste como stablecoin. Configure 4 tranches simulando uma securitizacao de CPR de soja: despesas de 200 tokens, senior de 60.000 tokens a 150 bps, mezanino de 25.000 tokens a 350 bps, subordinado de 15.000 tokens. Execute ao menos 3 periodos de waterfall com valores de coleta diferentes (um acima do threshold, um abaixo e um no limite).

2. Modifique o contrato para adicionar uma funcao `getWaterfallSummary()` que retorne, em uma unica chamada, o estado atual, o periodo, o total coletado, o total distribuido e o array de saldos devedores de cada tranche. Teste a funcao apos executar a waterfall.

3. Desenhe o diagrama de transicao de estados completo para uma securitizacao agro que inclua, alem dos tres estados basicos (COLLECTING, DISTRIBUTING, DEFAULTING), dois estados adicionais: RESTRUCTURING (reestruturacao apos default parcial) e CLOSED (operacao encerrada apos liquidacao total). Defina quais roles podem acionar cada transicao.

---

## Questionario

**1. Na waterfall de pagamentos de uma securitizacao agro, qual camada tem prioridade absoluta de recebimento?**

a) Cota senior, pois sao os investidores de maior volume
b) Cota subordinada, pois assumem o maior risco
c) Despesas operacionais (securitizadora, agente fiduciario, custodiante)
d) Cota mezanino, pois serve como colchao entre senior e subordinado

**Resposta: c**

---

**2. No smart contract WaterfallDistributor, o que acontece quando o valor coletado no periodo e insuficiente para pagar todas as tranches?**

a) O contrato reverte a transacao e devolve todos os fundos ao servicer
b) Todas as tranches recebem proporcionalmente ao seu target amount
c) O contrato distribui seguindo a ordem de prioridade ate o dinheiro acabar, e tranches de menor prioridade recebem menos ou nada
d) O contrato entra em estado DEFAULTING automaticamente, independente do numero de periodos

**Resposta: c**

---

**3. Qual e a funcao do estado COLLECTING na maquina de estados da waterfall?**

a) Executar a distribuicao dos fundos para cada tranche conforme prioridade
b) Acumular os pagamentos recebidos dos devedores, sem permitir distribuicao
c) Liquidar os ativos do lastro e encerrar a operacao
d) Recalcular as taxas de juros de cada tranche com base no oraculo

**Resposta: b**

---

**4. No contexto da waterfall on-chain, o que significa "aceleracao" (acceleration)?**

a) Aumentar a taxa de juros das tranches para compensar a inadimplencia
b) Antecipar o vencimento de todas as cotas, tornando todo o principal imediatamente exigivel
c) Acelerar o periodo de coleta, reduzindo a duracao de cada ciclo
d) Transferir automaticamente os tokens da cota subordinada para a cota senior

**Resposta: b**

---

**5. Por que a emissao de eventos on-chain (como TranchePayment e StateChanged) e fundamental para uma securitizacao tokenizada de recebiveis do agronegocio?**

a) Porque os eventos sao necessarios para o contrato funcionar internamente e sem eles a waterfall nao executa
b) Porque substituem a necessidade de smart contracts auditados, ja que qualquer erro pode ser rastreado
c) Porque permitem auditoria em tempo real, integracao com dashboards de investidores e compliance regulatorio verificavel, substituindo relatorios manuais do agente fiduciario
d) Porque os eventos sao armazenados no storage do contrato e podem ser modificados pelo operador

**Resposta: c**

---

## Proxima Aula

Na proxima aula, vamos construir os mecanismos de credit enhancement on-chain — overcollateral com health factor, liquidacao automatica, fundo de reserva e integracao com seguro parametrico. Esses mecanismos complementam a waterfall, adicionando camadas de protecao que reduzem o risco para investidores de cotas senior e mezanino. Ate la!
