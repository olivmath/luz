# Aula 2.3: ERC-7575 — Vaults Multi-Asset e Composicao com Compliance

## Abertura

Bem-vindo a aula 2.3, a aula final do Modulo 2! Nas duas aulas anteriores, construimos a base dos vaults tokenizados: o ERC-4626 como padrao sincrono de deposit/share, e o ERC-7540 como extensao assincrona para ativos reais. Agora, vamos fechar o modulo com a peca mais sofisticada da arquitetura: o ERC-7575. Esse padrao permite externalizar o token de share, aceitar multiplos assets no mesmo vault e compor a logica financeira com compliance regulatorio. Nesta aula, voce vai construir a arquitetura completa de um FIAGRO full on-chain — um fundo de credito agro que aceita USDC e DREX, emite cotas senior e subordinada como tokens ERC-3643, processa depositos e resgates de forma assincrona, e esta pronto para receber a camada de waterfall de pagamentos que sera tema do Modulo 3.

### Programa da aula:

1. Externalizacao do token de share: por que separar vault e cota
2. Vault multi-asset com compliance: USDC, DREX e cotas ERC-3643
3. Arquitetura completa de um FIAGRO full on-chain

---

## 1. Externalizacao do token de share: por que separar vault e cota

### O acoplamento do ERC-4626 e seus problemas

No ERC-4626 padrao, o contrato do vault herda de ERC-20. Isso significa que o vault e, simultaneamente, o contrato que gerencia a logica financeira (depositos, resgates, calculo de NAV) e o contrato do token de cota (shares). Essa decisao de design simplifica a implementacao — um unico contrato faz tudo — mas cria problemas serios quando precisamos de funcionalidades avancadas no token de cota.

**Problema 1 — Compliance regulatorio**: Em um FIAGRO regulado pela CVM, as cotas do fundo sao valores mobiliarios. Isso significa que elas precisam de controles de transferencia: apenas investidores com KYC aprovado podem deter cotas, transferencias entre carteiras precisam ser validadas, e o emissor precisa poder congelar ou forcar transferencias em casos regulatorios. O padrao ERC-3643 (Token de Seguranca com Identidade) implementa todos esses controles. Mas se o vault ERC-4626 e o token de share, nao podemos usar ERC-3643 como share — os dois padroes sao incompativeis em heranca.

**Problema 2 — Upgrade e modularidade**: Se precisarmos atualizar a logica financeira do vault (por exemplo, mudar o calculo de taxas), precisamos migrar todo o token de share para um novo contrato. Isso e operacionalmente perigoso e custoso. Com o share externalizado, podemos atualizar o vault sem tocar no token de cota.

**Problema 3 — Multi-vault shares**: Em estruturas mais complexas, o mesmo token de cota pode ser emitido por multiplos vaults. Por exemplo, cotas senior de um FIAGRO podem ser emitidas tanto pelo vault de depositos em USDC quanto pelo vault de depositos em DREX. Com share acoplado ao vault, isso e impossivel.

### A solucao do ERC-7575: share como contrato independente

O ERC-7575 resolve esses problemas com uma abordagem elegante: o token de share se torna um contrato independente, e o vault apenas aponta para ele via a funcao `share()`. O vault recebe permissao para mintar e queimar shares, mas o contrato do token vive separado, com sua propria logica, permissoes e padroes.

```solidity
// ERC-4626: vault = token (acoplado)
contract VaultAcoplado is ERC4626 {
    // Herda ERC-20 — o proprio vault e o token
    // Impossivel usar ERC-3643 como share
}

// ERC-7575: vault aponta para token externo (desacoplado)
contract VaultDesacoplado {
    address public shareToken; // Contrato externo — pode ser ERC-3643

    function share() external view returns (address) {
        return shareToken;
    }
}
```

Essa separacao cria uma arquitetura de tres camadas:

```
Camada 1: Token de Share (ERC-3643)
  - Controle de transferencia (compliance)
  - Identidade de investidores (ONCHAINID)
  - Freeze, force transfer, recovery
  - O vault tem role de AGENT para mint/burn

Camada 2: Vault Principal (ERC-7575)
  - Logica financeira (NAV, conversao, taxas)
  - Gerencia portfolio de ativos
  - Chama mint/burn no token de share

Camada 3: Entry Points (ERC-7540)
  - Depositos e resgates assincronos
  - Um entry point por asset aceito
  - Comunicam com vault principal
```

- **Exemplo agro**: Um FIAGRO tokenizado emite cotas que sao valores mobiliarios sob regulacao da CVM. O token de cota e implementado como ERC-3643 com: (1) identity registry vinculado a ONCHAINID dos investidores, (2) compliance module que verifica se o investidor e qualificado (investidor profissional com patrimonio acima de R$ 10 milhoes para cotas subordinadas), (3) country restrictions que limitam a oferta a investidores brasileiros e de jurisdicoes permitidas. O vault principal tem role de AGENT no token ERC-3643, permitindo mintar cotas quando depositos sao processados e queimar cotas quando resgates sao executados. A logica financeira (NAV, epochs, waterfall) fica isolada no vault, enquanto toda a compliance fica no token.

### Implementacao do share token ERC-3643 para FIAGRO

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title FIAGROShareToken
 * @notice Token de cota do FIAGRO com compliance simplificado (inspirado em ERC-3643)
 * Em producao, usar implementacao completa T-REX da Tokeny
 */
contract FIAGROShareToken is ERC20, AccessControl {
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");

    // === Identity Registry (simplificado) ===

    enum InvestorType { NONE, RETAIL, QUALIFIED, PROFESSIONAL }

    struct InvestorIdentity {
        bool verified;
        InvestorType investorType;
        uint16 country;           // ISO 3166-1 numeric (076 = Brasil)
        uint256 verifiedUntil;    // Timestamp de expiracao do KYC
        uint256 investmentLimit;  // Limite maximo de investimento
    }

    mapping(address => InvestorIdentity) public identityRegistry;
    mapping(uint16 => bool) public allowedCountries;

    // === Compliance Rules ===

    InvestorType public minimumInvestorType;
    uint256 public minimumInvestment;
    uint256 public maximumInvestors;
    uint256 public currentInvestorCount;
    bool public transfersPaused;

    // === Frozen accounts ===
    mapping(address => bool) public frozen;

    // === Eventos ===
    event IdentityRegistered(address indexed investor, InvestorType investorType, uint16 country);
    event IdentityRemoved(address indexed investor);
    event AccountFrozen(address indexed investor);
    event AccountUnfrozen(address indexed investor);
    event ComplianceUpdated(InvestorType minType, uint256 minInvestment);

    constructor(
        string memory name_,
        string memory symbol_,
        InvestorType _minimumInvestorType,
        uint256 _minimumInvestment,
        uint256 _maximumInvestors
    ) ERC20(name_, symbol_) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(COMPLIANCE_ROLE, msg.sender);

        minimumInvestorType = _minimumInvestorType;
        minimumInvestment = _minimumInvestment;
        maximumInvestors = _maximumInvestors;

        // Brasil permitido por padrao
        allowedCountries[76] = true;
    }

    // === Identity Management ===

    function registerIdentity(
        address investor,
        InvestorType investorType,
        uint16 country,
        uint256 validUntil,
        uint256 investmentLimit
    ) external onlyRole(COMPLIANCE_ROLE) {
        identityRegistry[investor] = InvestorIdentity({
            verified: true,
            investorType: investorType,
            country: country,
            verifiedUntil: validUntil,
            investmentLimit: investmentLimit
        });
        emit IdentityRegistered(investor, investorType, country);
    }

    function removeIdentity(address investor) external onlyRole(COMPLIANCE_ROLE) {
        require(balanceOf(investor) == 0, "Investor still holds shares");
        delete identityRegistry[investor];
        emit IdentityRemoved(investor);
    }

    // === Compliance Checks ===

    function isCompliant(address investor, uint256 amount) public view returns (bool) {
        InvestorIdentity memory id = identityRegistry[investor];

        // 1. Identidade verificada e nao expirada
        if (!id.verified || id.verifiedUntil < block.timestamp) return false;

        // 2. Pais permitido
        if (!allowedCountries[id.country]) return false;

        // 3. Tipo de investidor minimo
        if (uint8(id.investorType) < uint8(minimumInvestorType)) return false;

        // 4. Limite de investimento
        if (balanceOf(investor) + amount > id.investmentLimit) return false;

        // 5. Investimento minimo (para novos investidores)
        if (balanceOf(investor) == 0 && amount < minimumInvestment) return false;

        // 6. Conta nao congelada
        if (frozen[investor]) return false;

        return true;
    }

    // === Mint/Burn (apenas AGENT — o vault) ===

    function mint(address to, uint256 amount) external onlyRole(AGENT_ROLE) {
        require(isCompliant(to, amount), "Investor not compliant");

        if (balanceOf(to) == 0) {
            require(currentInvestorCount < maximumInvestors, "Max investors reached");
            currentInvestorCount++;
        }

        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external onlyRole(AGENT_ROLE) {
        _burn(from, amount);

        if (balanceOf(from) == 0) {
            currentInvestorCount--;
        }
    }

    // === Transfer Compliance ===

    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override {
        // Mint e burn (from=0 ou to=0) sao controlados pelas funcoes acima
        if (from != address(0) && to != address(0)) {
            require(!transfersPaused, "Transfers paused");
            require(!frozen[from], "Sender frozen");
            require(!frozen[to], "Receiver frozen");
            require(isCompliant(to, amount), "Receiver not compliant");
        }

        super._update(from, to, amount);
    }

    // === Funcoes regulatorias ===

    function freezeAccount(address investor) external onlyRole(COMPLIANCE_ROLE) {
        frozen[investor] = true;
        emit AccountFrozen(investor);
    }

    function unfreezeAccount(address investor) external onlyRole(COMPLIANCE_ROLE) {
        frozen[investor] = false;
        emit AccountUnfrozen(investor);
    }

    /**
     * @notice Force transfer — funcao regulatoria para compliance com ordens judiciais
     * Permite mover tokens de uma conta congelada para outra
     */
    function forceTransfer(
        address from,
        address to,
        uint256 amount
    ) external onlyRole(COMPLIANCE_ROLE) {
        _transfer(from, to, amount);
    }

    function pauseTransfers() external onlyRole(COMPLIANCE_ROLE) {
        transfersPaused = true;
    }

    function unpauseTransfers() external onlyRole(COMPLIANCE_ROLE) {
        transfersPaused = false;
    }

    function addCountry(uint16 country) external onlyRole(COMPLIANCE_ROLE) {
        allowedCountries[country] = true;
    }

    function removeCountry(uint16 country) external onlyRole(COMPLIANCE_ROLE) {
        allowedCountries[country] = false;
    }
}
```

- **Exemplo agro**: Um FIAGRO de credito agro subordinado exige que investidores sejam "profissionais" (patrimonio acima de R$ 10 milhoes) conforme regulacao da CVM. O token de share e configurado com `minimumInvestorType = PROFESSIONAL` e `minimumInvestment = 100000` (R$ 100 mil em cotas). O compliance officer registra cada investidor com ONCHAINID verificado, tipo de investidor e pais. Quando o vault processa um deposito e tenta mintar shares, o token verifica automaticamente todos os criterios de compliance. Se um investidor de varejo tentar adquirir cotas no mercado secundario, a transferencia e bloqueada pela funcao `_update()`.

---

## 2. Vault multi-asset com compliance: USDC, DREX e cotas ERC-3643

### Por que aceitar multiplos assets

O Real Digital (DREX) esta em fase de testes pelo Banco Central do Brasil. Quando operacional, sera a representacao digital do Real em blockchain, permitindo liquidacao instantanea de operacoes financeiras. Para um FIAGRO tokenizado, aceitar DREX significa integrar diretamente com o sistema financeiro brasileiro — sem necessidade de conversao fiat-cripto via exchanges.

Porem, investidores internacionais operam com USDC, USDT ou outras stablecoins de dolar. Um fundo que aceite apenas DREX exclui capital estrangeiro. Um fundo que aceite apenas USDC adiciona risco cambial e fricao operacional para investidores brasileiros. A solucao: aceitar ambos.

O ERC-7575 habilita isso nativamente. O vault principal gerencia o portfolio e o NAV. Cada asset aceito tem seu proprio "entry point" — um contrato ERC-7540 que lida com depositos e resgates assincronos naquele asset especifico. Todos os entry points emitem o mesmo token de share, garantindo fungibilidade.

### Fluxo completo: deposito DREX em FIAGRO com compliance

Vamos percorrer cada etapa de um deposito de DREX em um FIAGRO tokenizado com compliance ERC-3643:

**Etapa 1 — Pre-requisitos (off-chain):**
O investidor completa KYC com a gestora do fundo. O compliance officer registra a identidade on-chain no contrato FIAGROShareToken (funcao `registerIdentity`). O investidor agora tem ONCHAINID verificado com tipo `QUALIFIED` e pais `076` (Brasil).

**Etapa 2 — Requisicao de deposito (on-chain):**
O investidor aprova o entry point DREX para transferir seus DREX (`DREX.approve(entryPointDREX, 500000e18)`). Em seguida, chama `requestDeposit(500000e18, investorAddress)` no entry point DREX. Os 500.000 DREX sao transferidos para o entry point e ficam em status PENDING.

**Etapa 3 — Processamento pelo gestor (off-chain + on-chain):**
No fechamento do epoch semanal, o gestor: (1) avalia o portfolio de CPRs e CRAs, (2) calcula o NAV em BRL, (3) verifica a taxa de cambio BRL/DREX (1:1, pois DREX e Real Digital), (4) calcula quantas shares o deposito de 500.000 DREX equivale, (5) chama `closeEpoch()` no entry point.

**Etapa 4 — Mint com compliance (on-chain):**
O entry point chama `mintShares(investorAddress, sharesAmount)` no vault principal. O vault chama `shareToken.mint(investorAddress, sharesAmount)`. O contrato FIAGROShareToken verifica compliance automaticamente: identidade verificada? Sim. Pais permitido? Sim (Brasil). Tipo de investidor suficiente? Sim (QUALIFIED >= QUALIFIED). Dentro do limite? Sim. Shares mintadas com sucesso.

**Etapa 5 — Claim (on-chain):**
O investidor chama `claimDeposit(requestId)` no entry point. As shares sao transferidas do vault para a carteira do investidor.

```
Investidor (KYC aprovado, ONCHAINID registrado)
    |
    | 1. approve(DREX, 500k)
    | 2. requestDeposit(500k DREX)
    v
Entry Point DREX (ERC-7540)
    |
    | [PENDING: 500k DREX aguardando processamento]
    | [Epoch fecha apos 7 dias]
    |
    | 3. closeEpoch(NAV, requestIds)
    v
Vault Principal (ERC-7575)
    |
    | 4. shareToken.mint(investidor, shares)
    v
FIAGROShareToken (ERC-3643)
    |
    | [Compliance check: KYC? Pais? Tipo? Limite?]
    | [PASS -> shares mintadas]
    v
Investidor recebe shares FIAGRO
    |
    | 5. claimDeposit(requestId)
    v
Shares na carteira do investidor
```

- **Exemplo agro**: Um investidor qualificado brasileiro deposita R$ 500 mil em DREX em um FIAGRO que investe em CPRs de produtores de algodao. Na mesma semana, um fundo de investimento americano deposita 100.000 USDC no entry point USDC. O gestor fecha o epoch: NAV do fundo e R$ 50 milhoes, com 50 milhoes de shares. O investidor brasileiro recebe 500.000 shares (500k / 50M * 50M). O fundo americano, depositando 100k USDC a taxa de cambio R$ 5,20/USD, equivale a R$ 520 mil, e recebe 520.000 shares. Ambos possuem o mesmo token de cota, fungivel e negociavel no mercado secundario (com compliance ERC-3643 em cada transferencia).

### Tabela comparativa: ERC-4626 vs ERC-7540 vs ERC-7575

| Caracteristica | ERC-4626 | ERC-7540 | ERC-7575 |
|---|---|---|---|
| Deposito | Sincrono (atomico) | Assincrono (request/claim) | Assincrono via entry points |
| Resgate | Sincrono (atomico) | Assincrono (request/claim) | Assincrono via entry points |
| Token de share | Acoplado (vault = token) | Acoplado | Externalizado (contrato separado) |
| Assets aceitos | Um unico asset | Um unico asset | Multiplos assets |
| Compliance | Via override de hooks | Via override de hooks | Via token ERC-3643 externo |
| Tranching | Nao suportado | Nao suportado | Suportado (multiplos share tokens) |
| Caso de uso agro | Pool DeFi simples | FIAGRO com liquidez limitada | FIAGRO regulado multi-moeda |

---

## 3. Arquitetura completa de um FIAGRO full on-chain

### Visao geral: todos os componentes

Um FIAGRO full on-chain combina todos os padroes que estudamos neste modulo em uma arquitetura integrada. Aqui esta o mapa completo de contratos e suas interacoes:

```
+=======================================================================+
|                    FIAGRO FULL ON-CHAIN                               |
+=======================================================================+
|                                                                       |
|  CAMADA DE IDENTIDADE                                                 |
|  +-------------------+  +-------------------+                         |
|  | ONCHAINID         |  | Identity Registry |                         |
|  | (Investidores)    |  | (Claim Issuers)   |                         |
|  +--------+----------+  +--------+----------+                         |
|           |                      |                                    |
|  CAMADA DE COMPLIANCE                                                 |
|  +-------------------+  +-------------------+                         |
|  | FIAGROShareSenior |  | FIAGROShareJunior |                         |
|  | (ERC-3643)        |  | (ERC-3643)        |                         |
|  | Min: QUALIFIED    |  | Min: PROFESSIONAL |                         |
|  +--------+----------+  +--------+----------+                         |
|           |                      |                                    |
|  CAMADA FINANCEIRA (VAULT)                                            |
|  +-------------------------------------------------------+           |
|  | FIAGRO Vault Principal (ERC-7575)                      |           |
|  |                                                        |           |
|  | - totalNAV (valor total do portfolio)                  |           |
|  | - seniorNAV / juniorNAV (valor por tranche)            |           |
|  | - convertToShares(asset, amount, tranche)              |           |
|  | - waterfall logic (distribuicao de rendimentos)        |           |
|  | - portfolio management (CPRs, CRAs tokenizados)       |           |
|  +---+------------------------+---------------------------+           |
|      |                        |                                       |
|  CAMADA DE ENTRY POINTS (DEPOSITOS ASSINCRONOS)                       |
|  +-------------------+  +-------------------+                         |
|  | Entry Point USDC  |  | Entry Point DREX  |                         |
|  | (ERC-7540)        |  | (ERC-7540)        |                         |
|  | Epoch: 7 dias     |  | Epoch: 7 dias     |                         |
|  +--------+----------+  +--------+----------+                         |
|           |                      |                                    |
|  CAMADA DE ATIVOS SUBJACENTES                                         |
|  +-------------------+  +-------------------+  +------------------+   |
|  | CPR Soja Token    |  | CPR Cafe Token    |  | CRA Algodao      |   |
|  | (ERC-3643)        |  | (ERC-3643)        |  | (ERC-3643)       |   |
|  | Venc: 12 meses    |  | Venc: 8 meses     |  | Venc: 36 meses   |   |
|  +-------------------+  +-------------------+  +------------------+   |
|                                                                       |
|  CAMADA DE ORACLE E PRECIFICACAO                                      |
|  +-------------------+  +-------------------+                         |
|  | Price Oracle      |  | Credit Oracle     |                         |
|  | (Chainlink)       |  | (Risco de credito)|                         |
|  | BRL/USD, Soja/USD |  | Rating por CPR    |                         |
|  +-------------------+  +-------------------+                         |
|                                                                       |
+=======================================================================+
```

### Contrato do vault principal com tranching

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

interface IFIAGROShareToken {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title FIAGROFullVault
 * @notice Vault principal do FIAGRO full on-chain
 * Combina ERC-7575 (multi-asset, share externalizado) com tranching senior/junior
 * Preparado para integracao com waterfall de pagamentos (Modulo 3)
 */
contract FIAGROFullVault is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant ENTRY_POINT_ROLE = keccak256("ENTRY_POINT_ROLE");

    // === Share Tokens (externalizados, ERC-3643) ===
    IFIAGROShareToken public seniorShareToken;
    IFIAGROShareToken public juniorShareToken;

    // === NAV por tranche ===
    uint256 public totalNAV;
    uint256 public seniorNAV;
    uint256 public juniorNAV;
    uint256 public lastNAVUpdate;

    // === Parametros do fundo ===
    uint256 public seniorTargetRate;      // Taxa alvo senior (basis points, ex: 1200 = CDI+2%)
    uint256 public performanceFee;         // Taxa de performance sobre junior (basis points)
    uint256 public managementFee;          // Taxa de administracao (basis points anuais)

    // === Assets aceitos ===
    mapping(address => bool) public isAcceptedAsset;
    mapping(address => address) public assetEntryPoints;
    mapping(address => uint256) public assetExchangeRates; // Asset -> BRL (18 decimals)

    // === Portfolio de ativos ===
    struct CreditAsset {
        address tokenAddress;    // Endereco do token da CPR/CRA
        uint256 faceValue;       // Valor de face em BRL
        uint256 currentValue;    // Valor atual (marcacao a mercado)
        uint256 maturityDate;    // Data de vencimento
        uint256 interestRate;    // Taxa de juros (basis points)
        bool isActive;           // Se o ativo esta ativo
        string assetType;        // "CPR_SOJA", "CPR_CAFE", "CRA_ALGODAO"
    }

    uint256 public nextAssetId;
    mapping(uint256 => CreditAsset) public portfolio;
    uint256[] public activeAssetIds;

    // === Metricas do fundo ===
    uint256 public totalDeposited;     // Total depositado historico
    uint256 public totalRedeemed;      // Total resgatado historico
    uint256 public totalYieldPaid;     // Total de rendimentos pagos
    uint256 public totalDefaulted;     // Total de inadimplencia

    // === Eventos ===
    event NAVUpdated(uint256 totalNAV, uint256 seniorNAV, uint256 juniorNAV, uint256 timestamp);
    event AssetAdded(uint256 indexed assetId, string assetType, uint256 faceValue, uint256 maturityDate);
    event AssetMatured(uint256 indexed assetId, uint256 amountReceived);
    event AssetDefaulted(uint256 indexed assetId, uint256 lossAmount);
    event YieldDistributed(uint256 seniorYield, uint256 juniorYield, uint256 timestamp);
    event SharesMinted(address indexed investor, address indexed shareToken, uint256 amount, string tranche);
    event SharesBurned(address indexed investor, address indexed shareToken, uint256 amount, string tranche);

    constructor(
        address _seniorShareToken,
        address _juniorShareToken,
        uint256 _seniorTargetRate,
        uint256 _performanceFee,
        uint256 _managementFee
    ) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);

        seniorShareToken = IFIAGROShareToken(_seniorShareToken);
        juniorShareToken = IFIAGROShareToken(_juniorShareToken);

        seniorTargetRate = _seniorTargetRate;
        performanceFee = _performanceFee;
        managementFee = _managementFee;
    }

    // === ERC-7575: share() retorna token externo ===

    function share(string calldata tranche) external view returns (address) {
        if (keccak256(bytes(tranche)) == keccak256("SENIOR")) {
            return address(seniorShareToken);
        } else if (keccak256(bytes(tranche)) == keccak256("JUNIOR")) {
            return address(juniorShareToken);
        }
        revert("Invalid tranche");
    }

    // === Gestao de Entry Points ===

    function addEntryPoint(
        address asset,
        address entryPoint,
        uint256 exchangeRate
    ) external onlyRole(MANAGER_ROLE) {
        isAcceptedAsset[asset] = true;
        assetEntryPoints[asset] = entryPoint;
        assetExchangeRates[asset] = exchangeRate;

        _grantRole(ENTRY_POINT_ROLE, entryPoint);
    }

    // === Mint/Burn shares (chamado pelos entry points) ===

    function mintSeniorShares(address to, uint256 amount)
        external onlyRole(ENTRY_POINT_ROLE)
    {
        seniorShareToken.mint(to, amount);
        emit SharesMinted(to, address(seniorShareToken), amount, "SENIOR");
    }

    function mintJuniorShares(address to, uint256 amount)
        external onlyRole(ENTRY_POINT_ROLE)
    {
        juniorShareToken.mint(to, amount);
        emit SharesMinted(to, address(juniorShareToken), amount, "JUNIOR");
    }

    function burnSeniorShares(address from, uint256 amount)
        external onlyRole(ENTRY_POINT_ROLE)
    {
        seniorShareToken.burn(from, amount);
        emit SharesBurned(from, address(seniorShareToken), amount, "SENIOR");
    }

    function burnJuniorShares(address from, uint256 amount)
        external onlyRole(ENTRY_POINT_ROLE)
    {
        juniorShareToken.burn(from, amount);
        emit SharesBurned(from, address(juniorShareToken), amount, "JUNIOR");
    }

    // === Conversao shares <-> BRL ===

    function convertToSeniorShares(uint256 brlAmount)
        public view returns (uint256)
    {
        uint256 supply = seniorShareToken.totalSupply();
        if (supply == 0 || seniorNAV == 0) return brlAmount;
        return (brlAmount * supply) / seniorNAV;
    }

    function convertToJuniorShares(uint256 brlAmount)
        public view returns (uint256)
    {
        uint256 supply = juniorShareToken.totalSupply();
        if (supply == 0 || juniorNAV == 0) return brlAmount;
        return (brlAmount * supply) / juniorNAV;
    }

    function convertSeniorToAssets(uint256 shares)
        public view returns (uint256)
    {
        uint256 supply = seniorShareToken.totalSupply();
        if (supply == 0) return 0;
        return (shares * seniorNAV) / supply;
    }

    function convertJuniorToAssets(uint256 shares)
        public view returns (uint256)
    {
        uint256 supply = juniorShareToken.totalSupply();
        if (supply == 0) return 0;
        return (shares * juniorNAV) / supply;
    }

    // === Gestao do Portfolio ===

    function addCreditAsset(
        address tokenAddress,
        uint256 faceValue,
        uint256 maturityDate,
        uint256 interestRate,
        string calldata assetType
    ) external onlyRole(MANAGER_ROLE) returns (uint256 assetId) {
        assetId = nextAssetId++;
        portfolio[assetId] = CreditAsset({
            tokenAddress: tokenAddress,
            faceValue: faceValue,
            currentValue: faceValue,
            maturityDate: maturityDate,
            interestRate: interestRate,
            isActive: true,
            assetType: assetType
        });
        activeAssetIds.push(assetId);

        emit AssetAdded(assetId, assetType, faceValue, maturityDate);
    }

    function markAssetDefaulted(
        uint256 assetId,
        uint256 recoveryAmount
    ) external onlyRole(MANAGER_ROLE) {
        CreditAsset storage asset = portfolio[assetId];
        require(asset.isActive, "Asset not active");

        uint256 lossAmount = asset.currentValue - recoveryAmount;
        asset.currentValue = recoveryAmount;
        asset.isActive = false;
        totalDefaulted += lossAmount;

        emit AssetDefaulted(assetId, lossAmount);
    }

    // === NAV Update e Waterfall Preview ===

    /**
     * @notice Atualiza o NAV do fundo e distribui entre tranches
     * A waterfall completa sera implementada no Modulo 3
     * Aqui implementamos a logica basica: senior first, junior residual
     */
    function updateNAV(
        uint256 newTotalNAV
    ) external onlyRole(MANAGER_ROLE) {
        uint256 seniorSupply = seniorShareToken.totalSupply();
        uint256 juniorSupply = juniorShareToken.totalSupply();

        // Senior NAV: minimo entre o NAV pro-rata e o total disponivel
        // Senior tem prioridade — recebe ate o valor de face + juros acumulados
        uint256 seniorClaim = _calculateSeniorClaim(seniorSupply);

        if (newTotalNAV >= seniorClaim) {
            // Fundo saudavel: senior recebe o valor total, junior recebe o residual
            seniorNAV = seniorClaim;
            juniorNAV = newTotalNAV - seniorClaim;
        } else {
            // Fundo em estresse: senior recebe o que ha, junior perde tudo
            seniorNAV = newTotalNAV;
            juniorNAV = 0;
        }

        totalNAV = newTotalNAV;
        lastNAVUpdate = block.timestamp;

        emit NAVUpdated(totalNAV, seniorNAV, juniorNAV, block.timestamp);
    }

    /**
     * @notice Calcula o valor que a tranche senior tem direito
     * Senior recebe: capital investido + juros acumulados ate a data
     */
    function _calculateSeniorClaim(uint256 seniorSupply)
        internal view returns (uint256)
    {
        if (seniorSupply == 0) return 0;

        // Simplificacao: senior claim = seniorNAV anterior + juros do periodo
        // Em producao, usar calculo preciso com base no tempo decorrido
        uint256 timeElapsed = block.timestamp - lastNAVUpdate;
        uint256 annualYield = (seniorNAV * seniorTargetRate) / 10000;
        uint256 periodYield = (annualYield * timeElapsed) / 365 days;

        return seniorNAV + periodYield;
    }

    // === View functions ===

    function getPortfolioSummary() external view returns (
        uint256 totalFaceValue,
        uint256 totalCurrentValue,
        uint256 activeCount,
        uint256 defaultedCount
    ) {
        for (uint256 i = 0; i < activeAssetIds.length; i++) {
            CreditAsset storage asset = portfolio[activeAssetIds[i]];
            totalFaceValue += asset.faceValue;
            totalCurrentValue += asset.currentValue;
            if (asset.isActive) {
                activeCount++;
            } else {
                defaultedCount++;
            }
        }
    }

    function getSeniorSharePrice() external view returns (uint256) {
        uint256 supply = seniorShareToken.totalSupply();
        if (supply == 0) return 1e18; // 1:1
        return (seniorNAV * 1e18) / supply;
    }

    function getJuniorSharePrice() external view returns (uint256) {
        uint256 supply = juniorShareToken.totalSupply();
        if (supply == 0) return 1e18; // 1:1
        return (juniorNAV * 1e18) / supply;
    }

    function getSubordinationRatio() external view returns (uint256) {
        if (totalNAV == 0) return 0;
        return (juniorNAV * 10000) / totalNAV; // Em basis points
    }
}
```

- **Exemplo agro**: Esse contrato implementa o vault principal de um FIAGRO full on-chain com as seguintes caracteristicas: (1) duas tranches — senior com taxa alvo CDI + 2% e junior residual, (2) portfolio gerenciado de CPRs e CRAs tokenizados, (3) NAV distribuido via waterfall basica — senior primeiro, junior residual, (4) metricas completas de portfolio — valor de face, valor de mercado, inadimplencia, (5) funcoes de conversao share-BRL por tranche.

### Cenario end-to-end: FIAGRO de R$ 100 milhoes

Vamos percorrer o ciclo completo de um FIAGRO full on-chain de R$ 100 milhoes:

**Deploy:**
- FIAGROShareSenior (ERC-3643): minInvestorType = QUALIFIED, minInvestment = 50.000 BRL
- FIAGROShareJunior (ERC-3643): minInvestorType = PROFESSIONAL, minInvestment = 500.000 BRL
- FIAGROFullVault: seniorTargetRate = 1200 (CDI+2%), performanceFee = 2000 (20%), managementFee = 150 (1,5%)
- EntryPointUSDC (ERC-7540): epochDuration = 7 days
- EntryPointDREX (ERC-7540): epochDuration = 7 days

**Captacao (mes 1):**
- 50 investidores qualificados brasileiros depositam total de R$ 70 milhoes em DREX (tranche senior)
- 5 investidores profissionais depositam total de R$ 30 milhoes em DREX (tranche junior)
- Subordinacao: 30% (R$ 30M junior / R$ 100M total) — protecao robusta para senior

**Investimento (mes 1-2):**
- Gestor adquire 40 CPRs de produtores de soja do MT (R$ 50M, venc. 12 meses, CDI+4%)
- Gestor adquire 20 CPRs de produtores de cafe de MG (R$ 30M, venc. 8 meses, CDI+5%)
- Gestor adquire 5 CRAs de cooperativas de algodao da BA (R$ 15M, venc. 36 meses, CDI+3%)
- Caixa: R$ 5M em stablecoins (reserva de liquidez)

**Operacao (mes 6):**
- Portfolio gera rendimento bruto de R$ 6M (juros semestrais)
- Waterfall distribui: R$ 4,2M para senior (CDI+2% sobre R$ 70M), R$ 1,8M para junior
- Taxa de administracao: R$ 750K (1,5% a.a. sobre R$ 100M, semestral)
- Taxa de performance: R$ 360K (20% sobre excesso de retorno junior)
- NAV atualizado: seniorNAV = R$ 74,2M, juniorNAV = R$ 30,69M

**Inadimplencia (mes 9):**
- 2 CPRs de soja entram em default (R$ 2,5M em perdas)
- Junior absorve: juniorNAV = R$ 28,19M (caiu R$ 2,5M)
- Senior intacto: seniorNAV = R$ 76,3M (juros continuam acumulando)
- Subordinacao cai para 27% — ainda saudavel

**Resgate (mes 12):**
- Investidor senior solicita resgate de R$ 5M via requestRedeem
- Gestor espera vencimento de CPRs de cafe (mes 8, ja recebidas)
- Liquidez disponivel: R$ 35M (caixa + CPRs vencidas)
- Resgate processado no epoch seguinte
- Investidor recebe DREX equivalente a R$ 5M + rendimentos proporcionais

- **Exemplo agro**: Esse cenario demonstra como todas as pecas se encaixam. O investidor institucional que depositou R$ 10 milhoes em cotas senior via DREX recebeu shares ERC-3643 que pode negociar no mercado secundario (com compliance automatico). A inadimplencia de dois produtores de soja foi absorvida inteiramente pela tranche junior, protegendo os cotistas senior. O resgate assincrono foi processado em uma semana, usando liquidez gerada pelo vencimento de CPRs de cafe. Todo o processo — deposito, emissao de cotas, distribuicao de rendimentos, absorcao de perdas, resgate — aconteceu on-chain com transparencia total.

### Ponte para o Modulo 3: Waterfall e Automacao de Pagamentos

A funcao `updateNAV()` no contrato acima implementa uma waterfall basica: senior primeiro, junior residual. No Modulo 3, vamos construir um mecanismo de waterfall completo e automatizado que:

1. Recebe pagamentos das CPRs e CRAs automaticamente (via callbacks on-chain)
2. Distribui em cascata: (a) taxas de administracao, (b) juros senior, (c) amortizacao senior, (d) juros junior, (e) amortizacao junior
3. Implementa triggers automaticos: se a inadimplencia ultrapassar X%, novos investimentos sao bloqueados
4. Gera eventos on-chain para cada distribuicao, criando audit trail completo
5. Integra com oracles de preco para marcacao a mercado automatica

---

## Conclusao

Nesta aula, completamos a arquitetura de vaults tokenizados para o agronegocio. O ERC-7575 nos permitiu externalizar o token de share — transformando-o em um ERC-3643 com compliance regulatorio completo — e aceitar multiplos assets (USDC e DREX) no mesmo fundo. Construimos o contrato FIAGROShareToken com identity registry, compliance checks automaticos, congelamento de contas e force transfer regulatorio. Implementamos o vault principal FIAGROFullVault com tranching senior/junior, gestao de portfolio de CPRs e CRAs, e waterfall basica de distribuicao de NAV. Finalmente, percorremos um cenario end-to-end de um FIAGRO de R$ 100 milhoes, desde a captacao ate o resgate, passando por distribuicao de rendimentos e absorcao de inadimplencia. Esse e o alicerce sobre o qual o Modulo 3 construira o mecanismo de waterfall automatizado e a integracao com oracles de precificacao.

---

## Licao de Casa

1. Implemente os contratos FIAGROShareToken e FIAGROFullVault em Foundry. Faca o deploy de ambos, configure o share token como AGENT do vault, registre dois investidores (um QUALIFIED e um PROFESSIONAL), e execute depositos em ambas as tranches. Verifique que: (a) o investidor QUALIFIED so consegue depositar na tranche senior, (b) o investidor PROFESSIONAL consegue depositar em ambas, (c) uma transferencia de shares senior para um endereco sem KYC e bloqueada pelo compliance do ERC-3643.

2. Simule o cenario de inadimplencia descrito no cenario end-to-end. Chame `markAssetDefaulted()` para duas CPRs e em seguida `updateNAV()` com o novo valor total. Verifique que: (a) o seniorNAV permanece intacto, (b) o juniorNAV absorve a perda, (c) o subordination ratio cai conforme esperado. Calcule qual nivel de inadimplencia (em %) seria necessario para que a tranche senior comecasse a sofrer perdas.

3. Pesquise um FIAGRO real listado na B3 que tenha estrutura de cotas senior e subordinada (como o CPTR11 ou similar). Analise o regulamento e identifique: (a) qual e o nivel de subordinacao, (b) qual e a taxa alvo da cota senior, (c) como a waterfall de pagamentos e definida, (d) quais eventos de trigger existem (amortizacao antecipada, bloqueio de novas captacoes). Compare com a arquitetura on-chain implementada nesta aula e identifique gaps e oportunidades.

---

## Questionario

**1. Qual e a principal vantagem de externalizar o token de share conforme proposto pelo ERC-7575?**

a) Reduzir o custo de gas das transacoes
b) Permitir que o token de cota seja implementado como ERC-3643 com compliance regulatorio completo, independente da logica financeira do vault
c) Eliminar a necessidade de KYC para investidores
d) Aumentar a velocidade de processamento dos depositos

**Resposta: b**

**2. Em um FIAGRO multi-asset com entry points para USDC e DREX, como a fungibilidade das shares e garantida?**

a) Cada entry point emite um token de share diferente, sem fungibilidade
b) As shares de USDC valem mais que as shares de DREX
c) Ambos os entry points emitem o mesmo token de share (via vault principal), usando taxas de cambio para converter o valor depositado em BRL antes de calcular as shares
d) A fungibilidade nao e garantida — investidores de USDC e DREX recebem cotas diferentes

**Resposta: c**

**3. No contrato FIAGROShareToken, o que acontece quando um investidor de varejo (tipo RETAIL) tenta comprar cotas senior no mercado secundario, sendo que o minimumInvestorType e QUALIFIED?**

a) A transacao e executada normalmente, pois o mercado secundario nao tem restricoes
b) A funcao `_update()` verifica compliance do receptor e bloqueia a transferencia, pois o investidor nao atende ao tipo minimo exigido
c) O investidor recebe as cotas mas elas ficam congeladas
d) O vault queima as cotas automaticamente

**Resposta: b**

**4. Em um FIAGRO com R$ 70M em cotas senior e R$ 30M em cotas junior, qual o nivel maximo de inadimplencia (em % do portfolio total) que a tranche junior pode absorver antes que a senior sofra perdas?**

a) 10% do portfolio total
b) 20% do portfolio total
c) 30% do portfolio total (equivalente ao valor total da tranche junior)
d) 50% do portfolio total

**Resposta: c**

**5. Qual padrao (ou combinacao de padroes) e necessario para construir um FIAGRO full on-chain que aceite USDC e DREX, emita cotas senior/junior com compliance, e processe depositos/resgates assincronos?**

a) Apenas ERC-4626 e suficiente
b) ERC-4626 + ERC-20 cobrem todas as necessidades
c) ERC-7575 (multi-asset, share externalizado) + ERC-7540 (assincronicidade) + ERC-3643 (compliance no token de share)
d) ERC-721 para as cotas e ERC-1155 para os ativos

**Resposta: c**

---

## Proxima Aula

No proximo modulo — Modulo 3: Waterfall e Automacao de Pagamentos — vamos construir o mecanismo que distribui automaticamente os rendimentos das CPRs e CRAs entre as tranches senior e junior. Voce vai implementar smart contracts que recebem pagamentos, aplicam a cascata de prioridades (taxas, juros senior, amortizacao senior, residual junior), monitoram covenants e triggers, e geram audit trail completo on-chain. A waterfall e o coracao de qualquer estrutura de credito estruturado — e no blockchain, ela opera com transparencia e automacao impossiveis no mundo off-chain. Ate la!
