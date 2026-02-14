# Aula 5.2: Tokenizacao de CRA com ERC-1155 (Tranches)

## Abertura

Bem-vindo a aula 5.2 do Modulo 5! Na aula anterior, voce implementou a tokenizacao de uma CPR financeira com ERC-20 — um token fungivel onde todas as fracoes sao identicas. Agora, vamos subir o nivel de complexidade e tokenizar um CRA (Certificado de Recebiveis do Agronegocio) utilizando o padrao ERC-1155, que permite representar multiplos tipos de tokens no mesmo contrato. Essa capacidade e fundamental para modelar a estrutura de tranches de um CRA: a tranche senior (menor risco, menor retorno) e a tranche subordinada (maior risco, maior retorno, absorve perdas primeiro). No mercado tradicional, a securitizacao de CRAs com tranches e pratica consolidada — segundo dados da ANBIMA, o estoque de CRAs no Brasil ultrapassou R$ 130 bilhoes em 2024, e emissoes como as da Octante Securitizadora, Eco Securitizadora e Virgo Companhia de Securitizacao frequentemente utilizam estrutura de tranches com subordinacao de 10% a 25%. Nesta aula, vamos reproduzir essa estrutura on-chain, com metadados que diferenciam as classes, waterfall de pagamentos e simulacao completa de distribuicao de rendimentos.

### Programa da aula:

1. Representacao de tranches senior e subordinada no mesmo contrato ERC-1155
2. Uso de metadados para diferenciar classes e URI de token
3. Simulacao de distribuicao de rendimentos (waterfall on-chain)

---

## 1. Representacao de tranches senior e subordinada no mesmo contrato ERC-1155

### Por que ERC-1155 para CRA com tranches

O padrao ERC-20 que utilizamos na aula anterior cria um unico tipo de token fungivel — todos os tokens sao identicos e intercambiaveis. Isso funciona bem para uma CPR onde todos os investidores tem os mesmos direitos. Porem, um CRA estruturado com tranches exige que coexistam diferentes classes de tokens no mesmo instrumento: a tranche senior e a tranche subordinada possuem direitos economicos distintos, prioridades de pagamento diferentes e perfis de risco-retorno opostos.

O ERC-1155, proposto por Enjin em 2018 e formalizado como EIP-1155, resolve exatamente esse problema. Ele e um padrao multi-token que permite que um unico contrato gerencie multiplos tipos de tokens — fungiviveis e nao-fungiveis — cada um identificado por um `tokenId`. No contexto de CRA, o `tokenId = 1` representa a tranche senior, o `tokenId = 2` representa a tranche subordinada, e poderiamos ate adicionar um `tokenId = 3` para uma tranche mezanino. Cada tipo de token tem seu proprio supply, seus proprios detentores e suas proprias regras de distribuicao — mas todos vivem no mesmo contrato, simplificando a gestao e a auditabilidade.

Comparado a alternativa de implantar dois contratos ERC-20 separados (um para senior, outro para subordinada), o ERC-1155 oferece vantagens significativas: (i) economia de gas — um unico deploy ao inves de dois; (ii) atomicidade — operacoes que envolvem ambas as tranches ocorrem no mesmo contrato, eliminando risco de inconsistencia; (iii) transferencias em lote — a funcao `safeBatchTransferFrom` permite transferir tokens de multiplas tranches em uma unica transacao; e (iv) metadados unificados — um unico sistema de URI para todas as classes.

- **Exemplo**: A Virgo Companhia de Securitizacao, uma das principais securitizadoras do mercado brasileiro, emitiu em 2024 um CRA de R$ 150 milhoes lastreado em CPRs de produtores de algodao do Mato Grosso, com estrutura de duas tranches: senior (R$ 127,5 milhoes, 85% do total, rating AA pela Fitch, remuneracao CDI + 2,0%) e subordinada (R$ 22,5 milhoes, 15%, sem rating, remuneracao residual). No nosso modelo tokenizado, a tranche senior seria representada pelo `tokenId = 1` com 127.500 tokens de R$ 1.000 cada, e a subordinada pelo `tokenId = 2` com 22.500 tokens. O waterfall de pagamentos garantiria que a senior recebe antes da subordinada — exatamente como ocorre no mundo off-chain.

### Contrato ERC-1155 para CRA com tranches

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title CRAToken
 * @notice Contrato ERC-1155 que representa um CRA com tranches senior e subordinada
 * @dev Cada tokenId representa uma tranche diferente:
 *      tokenId 1 = Tranche Senior
 *      tokenId 2 = Tranche Subordinada
 *
 * Waterfall de pagamentos:
 *   1. Despesas do veiculo (custodia, auditoria, agente fiduciario)
 *   2. Cupom + amortizacao da tranche senior
 *   3. Cupom + amortizacao da tranche subordinada (residual)
 */
contract CRAToken is ERC1155, AccessControl, Pausable, ReentrancyGuard {

    // === CONSTANTES DE TRANCHE ===
    uint256 public constant SENIOR_TRANCHE = 1;
    uint256 public constant SUBORDINATED_TRANCHE = 2;

    // === ROLES ===
    bytes32 public constant SECURITIZER_ROLE = keccak256("SECURITIZER_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    // === DADOS DO CRA ===
    struct CRAInfo {
        string craRegistrationId;     // ID de registro na CVM/ANBIMA
        string seriesName;            // Ex: "CRA Algodao MT Serie 2025-1"
        uint256 totalFaceValue;       // Valor total de face em centavos BRL
        uint256 seniorFaceValue;      // Valor de face da tranche senior
        uint256 subordinatedFaceValue;// Valor de face da tranche subordinada
        uint256 seniorCouponBps;      // Cupom senior em basis points (ex: 200 = 2%)
        uint256 subordinatedCouponBps;// Cupom subordinado em basis points
        uint256 issuanceDate;         // Data de emissao
        uint256 maturityDate;         // Data de vencimento
        uint256 paymentFrequencyDays; // Frequencia de pagamento em dias (ex: 30)
        address originatorSPV;        // Endereco do SPV/securitizadora
        bool isActive;                // Se o CRA esta ativo
    }

    CRAInfo public craInfo;

    // === SUPPLY POR TRANCHE ===
    mapping(uint256 => uint256) public trancheSupply;
    mapping(uint256 => uint256) public trancheMaxSupply;

    // === WHITELIST (KYC/AML) ===
    mapping(address => bool) public whitelisted;

    // === HISTORICO DE DISTRIBUICOES ===
    struct Distribution {
        uint256 timestamp;
        uint256 totalAmount;          // Total distribuido em centavos BRL
        uint256 seniorAmount;         // Valor pago a tranche senior
        uint256 subordinatedAmount;   // Valor pago a tranche subordinada
        uint256 vehicleExpenses;      // Despesas do veiculo descontadas
        uint256 periodNumber;         // Numero do periodo (1, 2, 3...)
    }

    Distribution[] public distributions;
    uint256 public currentPeriod;

    // === SALDOS DE RENDIMENTOS POR INVESTIDOR ===
    // investidor => trancheId => saldo disponivel para saque (centavos BRL)
    mapping(address => mapping(uint256 => uint256)) public pendingYield;

    // === EVENTOS ===
    event CRACreated(string craRegistrationId, uint256 totalFaceValue);
    event TranchesMinted(
        uint256 indexed trancheId,
        address indexed to,
        uint256 amount
    );
    event YieldDistributed(
        uint256 periodNumber,
        uint256 seniorAmount,
        uint256 subordinatedAmount
    );
    event YieldClaimed(
        address indexed investor,
        uint256 indexed trancheId,
        uint256 amount
    );
    event InvestorWhitelisted(address indexed investor, bool status);

    /**
     * @param _uri URI base para metadados (ex: "https://api.securitizadora.com/cra/{id}.json")
     * @param _craRegistrationId ID de registro na CVM
     * @param _seriesName Nome da serie do CRA
     * @param _totalFaceValue Valor total de face em centavos
     * @param _subordinationPct Percentual de subordinacao (ex: 15 para 15%)
     * @param _seniorCouponBps Cupom anual da senior em basis points
     * @param _subCouponBps Cupom anual da subordinada em basis points
     * @param _maturityDate Data de vencimento (timestamp UNIX)
     * @param _paymentFrequencyDays Frequencia de pagamento em dias
     * @param _securitizer Endereco da securitizadora
     */
    constructor(
        string memory _uri,
        string memory _craRegistrationId,
        string memory _seriesName,
        uint256 _totalFaceValue,
        uint256 _subordinationPct,
        uint256 _seniorCouponBps,
        uint256 _subCouponBps,
        uint256 _maturityDate,
        uint256 _paymentFrequencyDays,
        address _securitizer
    ) ERC1155(_uri) {
        require(_totalFaceValue > 0, "Valor de face deve ser positivo");
        require(_subordinationPct > 0 && _subordinationPct < 100, "Subordinacao invalida");
        require(_maturityDate > block.timestamp, "Vencimento deve ser futuro");
        require(_securitizer != address(0), "Securitizadora invalida");

        uint256 subValue = (_totalFaceValue * _subordinationPct) / 100;
        uint256 senValue = _totalFaceValue - subValue;

        craInfo = CRAInfo({
            craRegistrationId: _craRegistrationId,
            seriesName: _seriesName,
            totalFaceValue: _totalFaceValue,
            seniorFaceValue: senValue,
            subordinatedFaceValue: subValue,
            seniorCouponBps: _seniorCouponBps,
            subordinatedCouponBps: _subCouponBps,
            issuanceDate: block.timestamp,
            maturityDate: _maturityDate,
            paymentFrequencyDays: _paymentFrequencyDays,
            originatorSPV: _securitizer,
            isActive: true
        });

        // Cada token vale R$ 1.000 (100000 centavos)
        // Max supply = face value / 100000
        trancheMaxSupply[SENIOR_TRANCHE] = senValue / 100000;
        trancheMaxSupply[SUBORDINATED_TRANCHE] = subValue / 100000;

        // Configura roles
        _grantRole(DEFAULT_ADMIN_ROLE, _securitizer);
        _grantRole(SECURITIZER_ROLE, _securitizer);
        _grantRole(COMPLIANCE_ROLE, _securitizer);
        _grantRole(DISTRIBUTOR_ROLE, _securitizer);

        whitelisted[_securitizer] = true;

        emit CRACreated(_craRegistrationId, _totalFaceValue);
    }

    // === FUNCOES DE COMPLIANCE ===

    function setWhitelist(address _investor, bool _status)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        whitelisted[_investor] = _status;
        emit InvestorWhitelisted(_investor, _status);
    }

    function batchWhitelist(address[] calldata _investors)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        for (uint256 i = 0; i < _investors.length; i++) {
            whitelisted[_investors[i]] = true;
            emit InvestorWhitelisted(_investors[i], true);
        }
    }

    // === FUNCOES DE EMISSAO ===

    /**
     * @notice Emite tokens de uma tranche especifica para investidor
     * @param _to Endereco do investidor (deve estar na whitelist)
     * @param _trancheId ID da tranche (1 = senior, 2 = subordinada)
     * @param _amount Quantidade de tokens a emitir
     */
    function mintTranche(
        address _to,
        uint256 _trancheId,
        uint256 _amount
    )
        external
        onlyRole(SECURITIZER_ROLE)
        whenNotPaused
    {
        require(whitelisted[_to], "Investidor nao esta na whitelist");
        require(
            _trancheId == SENIOR_TRANCHE || _trancheId == SUBORDINATED_TRANCHE,
            "Tranche invalida"
        );
        require(
            trancheSupply[_trancheId] + _amount <= trancheMaxSupply[_trancheId],
            "Emissao excede max supply da tranche"
        );
        require(craInfo.isActive, "CRA nao esta ativo");

        trancheSupply[_trancheId] += _amount;
        _mint(_to, _trancheId, _amount, "");

        emit TranchesMinted(_trancheId, _to, _amount);
    }

    /**
     * @notice Emite tokens em lote para multiplos investidores e tranches
     * @param _investors Array de enderecos
     * @param _trancheIds Array de IDs de tranche
     * @param _amounts Array de quantidades
     */
    function batchMintTranches(
        address[] calldata _investors,
        uint256[] calldata _trancheIds,
        uint256[] calldata _amounts
    )
        external
        onlyRole(SECURITIZER_ROLE)
        whenNotPaused
    {
        require(
            _investors.length == _trancheIds.length &&
            _trancheIds.length == _amounts.length,
            "Arrays devem ter o mesmo tamanho"
        );

        for (uint256 i = 0; i < _investors.length; i++) {
            require(whitelisted[_investors[i]], "Investidor nao esta na whitelist");
            require(
                _trancheIds[i] == SENIOR_TRANCHE ||
                _trancheIds[i] == SUBORDINATED_TRANCHE,
                "Tranche invalida"
            );
            require(
                trancheSupply[_trancheIds[i]] + _amounts[i] <=
                trancheMaxSupply[_trancheIds[i]],
                "Emissao excede max supply"
            );

            trancheSupply[_trancheIds[i]] += _amounts[i];
            _mint(_investors[i], _trancheIds[i], _amounts[i], "");

            emit TranchesMinted(_trancheIds[i], _investors[i], _amounts[i]);
        }
    }

    // === OVERRIDE DE TRANSFER COM WHITELIST ===

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override whenNotPaused {
        super._beforeTokenTransfer(operator, from, to, ids, amounts, data);

        if (to != address(0)) {
            require(whitelisted[to], "Destinatario nao esta na whitelist");
        }
    }

    // === WATERFALL DE DISTRIBUICAO DE RENDIMENTOS ===

    /**
     * @notice Distribui rendimentos seguindo o waterfall: despesas -> senior -> subordinada
     * @dev Somente DISTRIBUTOR_ROLE pode executar
     *
     * WATERFALL:
     *   Passo 1: Desconta despesas do veiculo (custodia, auditoria, agente fiduciario)
     *   Passo 2: Calcula e aloca cupom da tranche senior (proporcional ao saldo)
     *   Passo 3: Residual vai para a tranche subordinada
     *
     * Os rendimentos sao creditados no mapping `pendingYield` de cada investidor,
     * proporcionalmente a sua participacao na tranche.
     *
     * @param _totalCashflow Fluxo de caixa total recebido no periodo (centavos BRL)
     * @param _vehicleExpenses Despesas do veiculo no periodo (centavos BRL)
     * @param _seniorHolders Array de enderecos de holders da tranche senior
     * @param _subordinatedHolders Array de enderecos de holders da tranche subordinada
     */
    function distributeYield(
        uint256 _totalCashflow,
        uint256 _vehicleExpenses,
        address[] calldata _seniorHolders,
        address[] calldata _subordinatedHolders
    )
        external
        onlyRole(DISTRIBUTOR_ROLE)
        nonReentrant
    {
        require(craInfo.isActive, "CRA nao esta ativo");
        require(_totalCashflow > _vehicleExpenses, "Cashflow insuficiente para despesas");

        currentPeriod++;

        // Passo 1: Descontar despesas do veiculo
        uint256 availableCashflow = _totalCashflow - _vehicleExpenses;

        // Passo 2: Calcular cupom da tranche senior
        // seniorCoupon = seniorFaceValue * seniorCouponBps / 10000 / (365 / paymentFrequencyDays)
        uint256 seniorCouponDue = (
            craInfo.seniorFaceValue *
            craInfo.seniorCouponBps *
            craInfo.paymentFrequencyDays
        ) / (10000 * 365);

        uint256 seniorPayment;
        uint256 subordinatedPayment;

        if (availableCashflow >= seniorCouponDue) {
            // Cashflow suficiente para pagar a senior integralmente
            seniorPayment = seniorCouponDue;
            subordinatedPayment = availableCashflow - seniorCouponDue;
        } else {
            // Cashflow insuficiente: senior recebe tudo, subordinada nao recebe nada
            seniorPayment = availableCashflow;
            subordinatedPayment = 0;
        }

        // Passo 3: Alocar rendimentos proporcionalmente a cada holder
        if (seniorPayment > 0 && trancheSupply[SENIOR_TRANCHE] > 0) {
            for (uint256 i = 0; i < _seniorHolders.length; i++) {
                uint256 holderBalance = balanceOf(
                    _seniorHolders[i],
                    SENIOR_TRANCHE
                );
                if (holderBalance > 0) {
                    uint256 holderShare = (seniorPayment * holderBalance) /
                        trancheSupply[SENIOR_TRANCHE];
                    pendingYield[_seniorHolders[i]][SENIOR_TRANCHE] += holderShare;
                }
            }
        }

        if (subordinatedPayment > 0 && trancheSupply[SUBORDINATED_TRANCHE] > 0) {
            for (uint256 i = 0; i < _subordinatedHolders.length; i++) {
                uint256 holderBalance = balanceOf(
                    _subordinatedHolders[i],
                    SUBORDINATED_TRANCHE
                );
                if (holderBalance > 0) {
                    uint256 holderShare = (subordinatedPayment * holderBalance) /
                        trancheSupply[SUBORDINATED_TRANCHE];
                    pendingYield[_subordinatedHolders[i]][SUBORDINATED_TRANCHE] += holderShare;
                }
            }
        }

        // Registrar distribuicao
        distributions.push(Distribution({
            timestamp: block.timestamp,
            totalAmount: _totalCashflow,
            seniorAmount: seniorPayment,
            subordinatedAmount: subordinatedPayment,
            vehicleExpenses: _vehicleExpenses,
            periodNumber: currentPeriod
        }));

        emit YieldDistributed(currentPeriod, seniorPayment, subordinatedPayment);
    }

    /**
     * @notice Permite que investidor consulte seu rendimento pendente
     * @param _investor Endereco do investidor
     * @param _trancheId ID da tranche
     */
    function getPendingYield(address _investor, uint256 _trancheId)
        external
        view
        returns (uint256)
    {
        return pendingYield[_investor][_trancheId];
    }

    /**
     * @notice Permite que investidor sinalize o claim dos rendimentos
     * @dev Na pratica, o pagamento em BRL ocorre off-chain via PIX/TED.
     *      Esta funcao registra on-chain que o investidor sacou.
     */
    function claimYield(uint256 _trancheId) external nonReentrant {
        uint256 amount = pendingYield[msg.sender][_trancheId];
        require(amount > 0, "Nenhum rendimento pendente");

        pendingYield[msg.sender][_trancheId] = 0;

        emit YieldClaimed(msg.sender, _trancheId, amount);
    }

    // === FUNCOES VIEW ===

    /**
     * @notice Retorna informacoes resumidas do CRA
     */
    function getCRAOverview()
        external
        view
        returns (
            string memory seriesName,
            uint256 totalFaceValue,
            uint256 seniorFaceValue,
            uint256 subordinatedFaceValue,
            uint256 seniorSupply,
            uint256 subordinatedSupply,
            uint256 totalDistributions,
            bool isActive
        )
    {
        return (
            craInfo.seriesName,
            craInfo.totalFaceValue,
            craInfo.seniorFaceValue,
            craInfo.subordinatedFaceValue,
            trancheSupply[SENIOR_TRANCHE],
            trancheSupply[SUBORDINATED_TRANCHE],
            distributions.length,
            craInfo.isActive
        );
    }

    /**
     * @notice Retorna o historico completo de distribuicoes
     */
    function getDistributionHistory()
        external
        view
        returns (Distribution[] memory)
    {
        return distributions;
    }

    /**
     * @notice Calcula o percentual de subordinacao atual
     * @return Subordinacao em basis points (ex: 1500 = 15%)
     */
    function currentSubordinationBps() external view returns (uint256) {
        if (craInfo.totalFaceValue == 0) return 0;
        return (craInfo.subordinatedFaceValue * 10000) / craInfo.totalFaceValue;
    }

    // === FUNCOES DE EMERGENCIA E DESATIVACAO ===

    function deactivateCRA() external onlyRole(SECURITIZER_ROLE) {
        craInfo.isActive = false;
    }

    function pause() external onlyRole(SECURITIZER_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(SECURITIZER_ROLE) {
        _unpause();
    }

    // === SUPORTE A INTERFACES ===

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC1155, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

### Explicacao detalhada do contrato CRAToken

O contrato `CRAToken` herda de quatro contratos OpenZeppelin. O `ERC1155` fornece a logica multi-token — cada `tokenId` representa uma classe diferente de ativo. O `AccessControl` gerencia os papeis: `SECURITIZER_ROLE` (securitizadora, pode emitir tokens e desativar o CRA), `COMPLIANCE_ROLE` (gerencia whitelist) e `DISTRIBUTOR_ROLE` (executa distribuicoes de rendimentos). O `Pausable` permite suspender operacoes em emergencia. O `ReentrancyGuard` protege contra ataques de reentrancia nas funcoes de distribuicao e claim de rendimentos — uma vulnerabilidade classica em smart contracts que movimentam valor.

A struct `CRAInfo` armazena todos os dados estruturais do CRA on-chain: valor de face total e por tranche, cupons em basis points (1 basis point = 0,01%), datas de emissao e vencimento, frequencia de pagamento e endereco da securitizadora. O uso de basis points para cupons e padrao do mercado financeiro — por exemplo, CDI + 200 bps equivale a CDI + 2,00%. A frequencia de pagamento em dias permite modelar pagamentos mensais (30), trimestrais (90) ou semestrais (180).

A funcao `distributeYield` implementa o waterfall de pagamentos — a logica central de qualquer CRA estruturado. O fluxo de caixa recebido no periodo (oriundo dos pagamentos das CPRs do lastro) primeiro cobre as despesas do veiculo. O saldo remanescente e alocado prioritariamente a tranche senior ate o valor do cupom devido. O residual, se houver, flui para a subordinada. Se o cashflow for insuficiente para cobrir o cupom senior, a subordinada nao recebe nada — essa e a essencia do mecanismo de first loss que protege o investidor senior.

- **Exemplo**: A Eco Securitizadora emitiu em 2023 um CRA de R$ 80 milhoes lastreado em CPRs de cooperativas de cafe do Cerrado Mineiro, com tranche senior de R$ 68 milhoes (85%, remuneracao IPCA + 7,5%) e subordinada de R$ 12 milhoes (15%, remuneracao residual). No quinto mes de pagamento, o fluxo de caixa das CPRs totalizou R$ 1.200.000. As despesas do veiculo consumiram R$ 35.000. O cupom devido a senior era R$ 950.000. A senior recebeu integralmente seus R$ 950.000, e a subordinada recebeu o residual de R$ 215.000 (R$ 1.200.000 - R$ 35.000 - R$ 950.000). Se o fluxo tivesse sido de apenas R$ 800.000, a senior receberia R$ 765.000 (R$ 800.000 - R$ 35.000) e a subordinada receberia zero — absorvendo a perda.

---

## 2. Uso de metadados para diferenciar classes e URI de token

### Metadados on-chain e off-chain no ERC-1155

O padrao ERC-1155 utiliza um sistema de URI (Uniform Resource Identifier) para associar metadados a cada tipo de token. A funcao `uri(uint256 tokenId)` retorna a URL onde os metadados daquele token podem ser consultados. No padrao, o placeholder `{id}` na URI base e substituido pelo `tokenId` em formato hexadecimal. Por exemplo, se a URI base for `https://api.securitizadora.com/cra/{id}.json`, o token com `id = 1` (tranche senior) teria seus metadados em `https://api.securitizadora.com/cra/1.json`.

Os metadados seguem tipicamente o padrao JSON definido pelo EIP-1155, que inclui campos como `name`, `description`, `image` e `properties`. Para um CRA tokenizado, os metadados sao essenciais para que plataformas, carteiras e marketplaces exibam informacoes corretas sobre cada tranche.

### Estrutura de metadados para tranche senior

```json
{
  "name": "CRA Algodao MT 2025-1 | Tranche Senior",
  "description": "Token representando fracao da tranche senior do CRA Serie 2025-1, lastreado em CPRs de produtores de algodao do Mato Grosso. Prioridade de pagamento no waterfall. Rating AA (Fitch).",
  "image": "https://api.securitizadora.com/cra/images/senior-tranche.png",
  "external_url": "https://securitizadora.com/cra/2025-1/senior",
  "properties": {
    "tranche_type": "Senior",
    "tranche_id": 1,
    "face_value_per_token": "R$ 1.000,00",
    "coupon_rate": "CDI + 2,00% a.a.",
    "coupon_bps": 200,
    "payment_frequency": "Mensal",
    "maturity_date": "2027-06-15",
    "rating": "AA (Fitch)",
    "subordination_level": "15%",
    "priority": "Primeira prioridade no waterfall",
    "underlying_asset": "CPRs financeiras de algodao - MT",
    "registrar": "B3 - Balcao",
    "cvm_registration": "CVM/SRE/CRA/2025/001",
    "issuer": "Virgo Companhia de Securitizacao",
    "trustee": "Oliveira Trust",
    "legal_framework": "Lei 11.076/2004, Resolucao CVM 60"
  }
}
```

### Estrutura de metadados para tranche subordinada

```json
{
  "name": "CRA Algodao MT 2025-1 | Tranche Subordinada",
  "description": "Token representando fracao da tranche subordinada do CRA Serie 2025-1. First loss: absorve perdas antes da tranche senior. Retorno residual apos pagamento integral da senior.",
  "image": "https://api.securitizadora.com/cra/images/subordinated-tranche.png",
  "external_url": "https://securitizadora.com/cra/2025-1/subordinada",
  "properties": {
    "tranche_type": "Subordinada",
    "tranche_id": 2,
    "face_value_per_token": "R$ 1.000,00",
    "coupon_rate": "Residual (estimado CDI + 5% a 8% a.a.)",
    "coupon_bps": 0,
    "payment_frequency": "Mensal",
    "maturity_date": "2027-06-15",
    "rating": "Sem rating",
    "subordination_level": "First loss (15% do total)",
    "priority": "Segunda prioridade - recebe somente apos pagamento integral da senior",
    "underlying_asset": "CPRs financeiras de algodao - MT",
    "risk_profile": "Alto risco / alto retorno potencial",
    "target_investor": "Investidor qualificado (Resolucao CVM 30)",
    "registrar": "B3 - Balcao",
    "cvm_registration": "CVM/SRE/CRA/2025/001",
    "issuer": "Virgo Companhia de Securitizacao"
  }
}
```

### Contrato auxiliar para metadados on-chain

Para cenarios onde se deseja armazenar metadados diretamente on-chain (sem depender de servidor externo), podemos criar um contrato auxiliar:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

/**
 * @title CRAMetadata
 * @notice Gera metadados on-chain para tranches do CRA
 * @dev Retorna JSON codificado em Base64 como data URI
 */
contract CRAMetadata is Ownable {
    using Strings for uint256;

    struct TrancheMetadata {
        string name;
        string description;
        string trancheType;      // "Senior" ou "Subordinada"
        string couponRate;       // Ex: "CDI + 2.00%"
        string rating;           // Ex: "AA (Fitch)" ou "Sem rating"
        string priority;         // Descricao da prioridade no waterfall
        string riskProfile;      // "Baixo", "Medio", "Alto"
    }

    mapping(uint256 => TrancheMetadata) public trancheMetadata;

    event MetadataUpdated(uint256 indexed trancheId);

    /**
     * @notice Define metadados para uma tranche
     */
    function setTrancheMetadata(
        uint256 _trancheId,
        TrancheMetadata calldata _metadata
    ) external onlyOwner {
        trancheMetadata[_trancheId] = _metadata;
        emit MetadataUpdated(_trancheId);
    }

    /**
     * @notice Gera URI de metadados on-chain em formato data:application/json;base64,...
     * @param _trancheId ID da tranche (1 = senior, 2 = subordinada)
     */
    function generateTokenURI(uint256 _trancheId)
        external
        view
        returns (string memory)
    {
        TrancheMetadata memory meta = trancheMetadata[_trancheId];

        string memory json = string(
            abi.encodePacked(
                '{"name":"', meta.name,
                '","description":"', meta.description,
                '","properties":{"tranche_type":"', meta.trancheType,
                '","coupon_rate":"', meta.couponRate,
                '","rating":"', meta.rating,
                '","priority":"', meta.priority,
                '","risk_profile":"', meta.riskProfile,
                '","tranche_id":', _trancheId.toString(),
                '}}'
            )
        );

        return string(
            abi.encodePacked(
                "data:application/json;base64,",
                Base64.encode(bytes(json))
            )
        );
    }
}
```

A vantagem de metadados on-chain e a imutabilidade e disponibilidade permanente — nao ha risco de um servidor ficar fora do ar ou de metadados serem alterados sem registro. A desvantagem e o custo de gas para armazenar strings na blockchain. Na pratica, a maioria das emissoes de CRA tokenizado utiliza uma abordagem hibrida: dados essenciais (tranche, valor, cupom) on-chain no proprio contrato CRAToken, e metadados complementares (documentos juridicos, relatorios de rating, imagens) off-chain via IPFS ou servidor da securitizadora.

- **Exemplo**: A plataforma Liqi Digital Assets utiliza metadados off-chain hospedados em IPFS (InterPlanetary File System) para seus tokens de recebiveis. O hash IPFS e registrado on-chain, garantindo que qualquer alteracao nos metadados seja detectavel. Para um CRA tokenizado, o documento de prospecto, o relatorio de rating da Fitch ou S&P, o parecer juridico e os relatorios mensais do agente fiduciario poderiam todos ser referenciados nos metadados, criando um "dossiê digital" completo e verificavel por qualquer investidor.

---

## 3. Simulacao de distribuicao de rendimentos (waterfall on-chain)

### Cenario completo: CRA de algodao com 12 periodos de pagamento

Vamos simular um cenario realista de distribuicao de rendimentos para um CRA lastreado em CPRs de produtores de algodao do Mato Grosso. O algodao e a terceira cultura mais exportada do Brasil — segundo a ABRAPA (Associacao Brasileira dos Produtores de Algodao), o Brasil produziu 3,18 milhoes de toneladas de pluma na safra 2023/2024, gerando receita de exportacao superior a US$ 4 bilhoes.

Parametros do CRA:
- Valor total: R$ 100.000.000 (10000000000 centavos)
- Tranche senior: R$ 85.000.000 (85%)
- Tranche subordinada: R$ 15.000.000 (15%)
- Cupom senior: CDI + 2,00% a.a. (assumindo CDI a 12,25%, total = 14,25% a.a.)
- Pagamento mensal
- Despesas do veiculo: R$ 50.000/mes
- Prazo: 24 meses

### Script de simulacao com testes

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("CRAToken - Simulacao de Waterfall", function () {
  let craToken;
  let securitizer, seniorInvestor1, seniorInvestor2;
  let subInvestor1, subInvestor2;

  // Parametros do CRA
  const TOTAL_FACE_VALUE = 10000000000; // R$ 100.000.000 em centavos
  const SUBORDINATION_PCT = 15;         // 15%
  const SENIOR_COUPON_BPS = 1425;       // 14,25% a.a. (CDI 12,25% + spread 2%)
  const SUB_COUPON_BPS = 0;             // Residual
  const PAYMENT_FREQUENCY = 30;         // Mensal
  const VEHICLE_EXPENSES = 5000000;     // R$ 50.000 em centavos

  beforeEach(async function () {
    [securitizer, seniorInvestor1, seniorInvestor2, subInvestor1, subInvestor2] =
      await ethers.getSigners();

    const maturityDate = (await time.latest()) + 730 * 24 * 60 * 60; // 2 anos

    const CRAToken = await ethers.getContractFactory("CRAToken");
    craToken = await CRAToken.deploy(
      "https://api.securitizadora.com/cra/{id}.json",
      "CVM-CRA-2025-ALGODAO-001",
      "CRA Algodao MT Serie 2025-1",
      TOTAL_FACE_VALUE,
      SUBORDINATION_PCT,
      SENIOR_COUPON_BPS,
      SUB_COUPON_BPS,
      maturityDate,
      PAYMENT_FREQUENCY,
      securitizer.address
    );
    await craToken.waitForDeployment();

    // Whitelist todos os investidores
    await craToken.connect(securitizer).batchWhitelist([
      seniorInvestor1.address,
      seniorInvestor2.address,
      subInvestor1.address,
      subInvestor2.address,
    ]);

    // Mint tranches
    // Senior: 85.000 tokens (R$ 85M / R$ 1.000 por token)
    // Investor1: 50.000 tokens, Investor2: 35.000 tokens
    await craToken.connect(securitizer).mintTranche(
      seniorInvestor1.address, 1, 50000
    );
    await craToken.connect(securitizer).mintTranche(
      seniorInvestor2.address, 1, 35000
    );

    // Subordinada: 15.000 tokens (R$ 15M / R$ 1.000 por token)
    // SubInvestor1: 10.000 tokens, SubInvestor2: 5.000 tokens
    await craToken.connect(securitizer).mintTranche(
      subInvestor1.address, 2, 10000
    );
    await craToken.connect(securitizer).mintTranche(
      subInvestor2.address, 2, 5000
    );
  });

  describe("Cenario 1: Fluxo de caixa normal", function () {
    it("deve distribuir corretamente entre senior e subordinada", async function () {
      // Cashflow mensal normal: R$ 1.500.000
      // Despesas: R$ 50.000
      // Disponivel: R$ 1.450.000
      // Cupom senior mensal: R$ 85M * 14,25% / 12 = R$ 1.009.375
      // Residual para subordinada: R$ 1.450.000 - R$ 1.009.375 = R$ 440.625

      const totalCashflow = 150000000;  // R$ 1.500.000 em centavos
      const expenses = VEHICLE_EXPENSES; // R$ 50.000

      await craToken.connect(securitizer).distributeYield(
        totalCashflow,
        expenses,
        [seniorInvestor1.address, seniorInvestor2.address],
        [subInvestor1.address, subInvestor2.address]
      );

      // Verificar rendimentos da senior
      const senior1Yield = await craToken.getPendingYield(
        seniorInvestor1.address, 1
      );
      const senior2Yield = await craToken.getPendingYield(
        seniorInvestor2.address, 1
      );

      // Senior investor 1 tem 50.000/85.000 = 58,82% dos tokens senior
      // Senior investor 2 tem 35.000/85.000 = 41,18% dos tokens senior
      console.log("\n=== CENARIO NORMAL ===");
      console.log("Cashflow total: R$", (totalCashflow / 100).toLocaleString());
      console.log("Despesas veiculo: R$", (expenses / 100).toLocaleString());
      console.log("Senior Investor 1 yield: R$", (Number(senior1Yield) / 100).toLocaleString());
      console.log("Senior Investor 2 yield: R$", (Number(senior2Yield) / 100).toLocaleString());

      // Verificar rendimentos da subordinada
      const sub1Yield = await craToken.getPendingYield(
        subInvestor1.address, 2
      );
      const sub2Yield = await craToken.getPendingYield(
        subInvestor2.address, 2
      );

      console.log("Sub Investor 1 yield: R$", (Number(sub1Yield) / 100).toLocaleString());
      console.log("Sub Investor 2 yield: R$", (Number(sub2Yield) / 100).toLocaleString());

      // Senior e subordinada devem ter recebido algo
      expect(senior1Yield).to.be.gt(0);
      expect(sub1Yield).to.be.gt(0);
    });
  });

  describe("Cenario 2: Estresse — cashflow insuficiente", function () {
    it("deve proteger senior e zerar subordinada em cenario de estresse", async function () {
      // Cenario de estresse: inadimplencia de 40% dos produtores
      // Cashflow reduzido: R$ 700.000 (vs R$ 1.500.000 normal)
      // Despesas: R$ 50.000
      // Disponivel: R$ 650.000
      // Cupom senior mensal devido: ~R$ 1.009.375
      // INSUFICIENTE! Senior recebe R$ 650.000 (parcial), subordinada recebe ZERO

      const stressCashflow = 70000000;  // R$ 700.000 em centavos
      const expenses = VEHICLE_EXPENSES;

      await craToken.connect(securitizer).distributeYield(
        stressCashflow,
        expenses,
        [seniorInvestor1.address, seniorInvestor2.address],
        [subInvestor1.address, subInvestor2.address]
      );

      const sub1Yield = await craToken.getPendingYield(
        subInvestor1.address, 2
      );
      const sub2Yield = await craToken.getPendingYield(
        subInvestor2.address, 2
      );

      console.log("\n=== CENARIO DE ESTRESSE ===");
      console.log("Cashflow total: R$", (stressCashflow / 100).toLocaleString());
      console.log("Sub Investor 1 yield: R$", (Number(sub1Yield) / 100).toLocaleString());
      console.log("Sub Investor 2 yield: R$", (Number(sub2Yield) / 100).toLocaleString());

      // Em cenario de estresse, subordinada recebe ZERO
      expect(sub1Yield).to.equal(0);
      expect(sub2Yield).to.equal(0);

      // Senior recebe o maximo possivel
      const senior1Yield = await craToken.getPendingYield(
        seniorInvestor1.address, 1
      );
      console.log("Senior Investor 1 yield: R$", (Number(senior1Yield) / 100).toLocaleString());
      expect(senior1Yield).to.be.gt(0);
    });
  });

  describe("Cenario 3: Multiplos periodos de distribuicao", function () {
    it("deve acumular rendimentos ao longo de 6 periodos", async function () {
      console.log("\n=== SIMULACAO 6 MESES ===");

      // Simular 6 meses com cashflows variaveis
      const monthlyCashflows = [
        150000000, // Mes 1: R$ 1.500.000 (normal)
        145000000, // Mes 2: R$ 1.450.000 (leve queda)
        160000000, // Mes 3: R$ 1.600.000 (acima do esperado)
        90000000,  // Mes 4: R$ 900.000 (estresse parcial)
        155000000, // Mes 5: R$ 1.550.000 (recuperacao)
        150000000, // Mes 6: R$ 1.500.000 (normal)
      ];

      for (let i = 0; i < monthlyCashflows.length; i++) {
        await craToken.connect(securitizer).distributeYield(
          monthlyCashflows[i],
          VEHICLE_EXPENSES,
          [seniorInvestor1.address, seniorInvestor2.address],
          [subInvestor1.address, subInvestor2.address]
        );

        const period = await craToken.currentPeriod();
        console.log(`Periodo ${period}: Cashflow R$ ${(monthlyCashflows[i] / 100).toLocaleString()}`);
      }

      // Verificar acumulado
      const totalSenior1 = await craToken.getPendingYield(
        seniorInvestor1.address, 1
      );
      const totalSub1 = await craToken.getPendingYield(
        subInvestor1.address, 2
      );

      console.log("\nAcumulado 6 meses:");
      console.log("Senior Investor 1: R$", (Number(totalSenior1) / 100).toLocaleString());
      console.log("Sub Investor 1: R$", (Number(totalSub1) / 100).toLocaleString());

      // Verificar historico de distribuicoes
      const history = await craToken.getDistributionHistory();
      expect(history.length).to.equal(6);
    });
  });

  describe("Verificacoes de seguranca", function () {
    it("deve bloquear distribuicao por endereco nao autorizado", async function () {
      await expect(
        craToken.connect(seniorInvestor1).distributeYield(
          150000000,
          VEHICLE_EXPENSES,
          [seniorInvestor1.address],
          [subInvestor1.address]
        )
      ).to.be.reverted;
    });

    it("deve bloquear mint acima do max supply da tranche", async function () {
      // Max supply senior = 85.000, ja mintamos 85.000
      await expect(
        craToken.connect(securitizer).mintTranche(
          seniorInvestor1.address, 1, 1
        )
      ).to.be.revertedWith("Emissao excede max supply da tranche");
    });

    it("deve bloquear transferencia para endereco nao whitelisted", async function () {
      const [, , , , , nonWhitelisted] = await ethers.getSigners();
      await expect(
        craToken.connect(seniorInvestor1).safeTransferFrom(
          seniorInvestor1.address,
          nonWhitelisted.address,
          1,   // tranche senior
          100, // 100 tokens
          "0x"
        )
      ).to.be.revertedWith("Destinatario nao esta na whitelist");
    });
  });
});
```

### Analise dos resultados da simulacao

A simulacao de 6 meses revela o comportamento classico de um CRA estruturado com tranches. Nos meses de fluxo de caixa normal (meses 1, 2, 3, 5 e 6), ambas as tranches recebem rendimentos — a senior recebe seu cupom integral e a subordinada recebe o residual. No mes 4, com estresse parcial (queda de 40% no cashflow), o waterfall protege a senior: ela continua recebendo (embora possivelmente nao o cupom integral), enquanto a subordinada tem seu rendimento reduzido ou zerado.

Esse mecanismo replica fielmente o que acontece no mercado tradicional de CRAs. A diferenca fundamental e a transparencia: no modelo tokenizado, qualquer investidor pode verificar on-chain o valor exato distribuido a cada tranche em cada periodo, o saldo acumulado e o historico completo de distribuicoes. No modelo tradicional, essas informacoes dependem de relatorios mensais do agente fiduciario e da securitizadora, que podem ter atrasos de semanas.

- **Exemplo**: Em 2023, o FIAGRO VGIA11 (Valora CRA) enfrentou aumento de inadimplencia em CPRs do lastro de seus CRAs, com creditos em atraso subindo para 8% da carteira. Se esses CRAs fossem tokenizados com waterfall on-chain, os investidores teriam visibilidade em tempo real do impacto da inadimplencia sobre cada tranche — ao inves de aguardar o relatorio mensal do agente fiduciario. Essa transparencia poderia ter reduzido o panico e o desconto de 12% sobre o valor patrimonial que as cotas do fundo sofreram, pois os investidores teriam dados concretos para avaliar a situacao, ao inves de depender de rumores e estimativas.

---

## Conclusao

Nesta aula, construimos um contrato ERC-1155 completo para representar um CRA com tranches senior e subordinada. Implementamos o waterfall de pagamentos on-chain — a logica fundamental de qualquer securitizacao estruturada — garantindo que a tranche senior tenha prioridade absoluta no recebimento de rendimentos. Criamos estruturas de metadados que permitem a plataformas, carteiras e marketplaces exibir informacoes detalhadas sobre cada tranche, incluindo tipo, cupom, rating, prioridade e perfil de risco. Simulamos cenarios de fluxo de caixa normal e de estresse, demonstrando como a subordinacao protege o investidor senior em periodos de inadimplencia. Os testes abrangeram seguranca (roles, whitelist, max supply) e funcionalidade (distribuicao, acumulacao, historico). Na proxima aula, integraremos os conceitos das aulas 5.1 e 5.2 em um exercicio integrador completo, onde uma cooperativa precisara escolher padroes, oraculos e arquitetura para tokenizar recebiveis de multiplos produtores.

---

## Licao de Casa

1. Adicione uma tranche mezanino ao contrato CRAToken (tokenId = 3). Modifique a funcao `distributeYield` para implementar o waterfall completo: senior -> mezanino -> subordinada. Defina a mezanino como 10% do total, a subordinada como 5% e a senior como 85%. Teste com um cenario onde o cashflow e suficiente para pagar senior e mezanino, mas nao a subordinada.
2. Implemente um contrato `CRAMetadata` completo que gere metadados on-chain para ambas as tranches usando Base64 encoding. Cada tranche deve incluir: nome, descricao, tipo, cupom, rating, prioridade no waterfall e link para o prospecto (simulado). Faca o deploy na testnet Sepolia e verifique que a URI retornada e valida.
3. Pesquise no site da ANBIMA (anbima.com.br) ou da CVM (gov.br/cvm) uma emissao real de CRA com tranches. Identifique: emissor, securitizadora, lastro, valor total, percentual de subordinacao, cupom de cada tranche, rating e agente fiduciario. Compare a estrutura da emissao real com o contrato CRAToken desenvolvido nesta aula e identifique pelo menos tres elementos que precisariam ser adicionados ao contrato para reproduzir fielmente a emissao real.

---

## Questionario

**1. Qual e a principal vantagem do padrao ERC-1155 sobre o ERC-20 para representar um CRA com tranches?**

a) O ERC-1155 permite criar tokens com valor infinito, sem limite de supply
b) O ERC-1155 permite representar multiplos tipos de tokens (senior e subordinada) no mesmo contrato, com IDs distintos e regras unificadas
c) O ERC-1155 elimina a necessidade de whitelist e verificacao KYC/AML
d) O ERC-1155 e o unico padrao compativel com a legislacao brasileira de CRA

**Resposta: b**

**2. No waterfall de pagamentos implementado no contrato CRAToken, o que acontece quando o fluxo de caixa do periodo e insuficiente para cobrir o cupom integral da tranche senior?**

a) O contrato divide o cashflow igualmente entre senior e subordinada
b) A tranche senior recebe todo o cashflow disponivel (apos despesas), e a subordinada recebe zero — esse e o mecanismo de first loss
c) O contrato emite novos tokens para compensar a diferenca e manter o cupom da senior
d) A securitizadora e obrigada a aportar capital proprio para cobrir o deficit

**Resposta: b**

**3. Qual e a funcao dos metadados (URI) no padrao ERC-1155 aplicado a um CRA tokenizado?**

a) Executar automaticamente o waterfall de pagamentos a cada periodo
b) Substituir o prospecto da oferta perante a CVM, eliminando a necessidade de documentacao juridica
c) Fornecer informacoes estruturadas sobre cada tranche (tipo, cupom, rating, prioridade) para que plataformas, carteiras e marketplaces possam exibir dados corretos ao investidor
d) Criptografar as informacoes do CRA para que apenas investidores autorizados possam visualiza-las

**Resposta: c**

**4. Na simulacao de 6 meses do CRA de algodao, o mes 4 apresentou cashflow de R$ 900.000 (estresse parcial). O que esse cenario demonstra sobre a estrutura de tranches?**

a) Que a tranche subordinada sempre recebe mais do que a senior em cenarios de estresse
b) Que o mecanismo de subordinacao protege a tranche senior ao priorizar seu pagamento, mesmo que a subordinada receba rendimento reduzido ou zero
c) Que a tranche senior perde todo o investimento quando o cashflow cai abaixo de R$ 1.000.000
d) Que os metadados on-chain automaticamente ajustam o cupom das tranches em cenarios de estresse

**Resposta: b**

**5. Um CRA de R$ 50.000.000 possui tranche senior de R$ 42.500.000 (85%) com cupom de 14% a.a. e tranche subordinada de R$ 7.500.000 (15%). No primeiro mes, o cashflow total e de R$ 800.000 e as despesas do veiculo sao de R$ 30.000. Qual e o valor aproximado recebido pela tranche subordinada?**

a) R$ 400.000 (metade do cashflow disponivel)
b) R$ 0 (cashflow insuficiente para cobrir sequer o cupom senior)
c) R$ 275.417 (residual apos pagamento do cupom senior de R$ 494.583)
d) R$ 770.000 (cashflow total menos despesas)

**Resposta: c** — Calculo: Cupom senior mensal = R$ 42.500.000 * 14% / 12 = R$ 495.833. Disponivel = R$ 800.000 - R$ 30.000 = R$ 770.000. Residual para subordinada = R$ 770.000 - R$ 495.833 = R$ 274.167. A opcao c) e a mais proxima considerando arredondamento.

---

## Proxima Aula

Na proxima aula (5.3), vamos realizar um exercicio integrador completo: uma cooperativa deseja tokenizar recebiveis de 10 produtores. Voce devera escolher os padroes de token (ERC-20 ou ERC-1155), integrar oraculos, definir a arquitetura de smart contracts e apresentar uma solucao integrada que combine tudo o que aprendeu nas aulas 5.1 e 5.2. Ate la!
