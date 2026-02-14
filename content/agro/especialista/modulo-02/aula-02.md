# Aula 2.2: ERC-7540 — Vaults Assincronos para Ativos Reais

## Abertura

Bem-vindo a aula 2.2! Na aula anterior, dominamos o ERC-4626 e construimos um vault FIAGRO tokenizado funcional. Porem, identificamos uma limitacao critica: a atomicidade. Operacoes com ativos reais do agronegocio — depositos que envolvem conversao fiat-cripto, resgates que dependem da liquidacao de CPRs, precificacao que exige avaliacao off-chain — simplesmente nao cabem em uma transacao atomica. O ERC-7540 e a resposta direta a esse problema. Ele estende o ERC-4626 com um mecanismo de requisicoes assincronas: o investidor solicita um deposito ou resgate, o vault processa a operacao ao longo do tempo (horas, dias ou semanas), e o investidor reclama o resultado quando estiver pronto. Esse padrao e a peca que faltava para tornar vaults tokenizados compativeis com a realidade do agronegocio brasileiro, onde uma CPR de soja vence em 12 meses e um FIAGRO tem prazo de resgate de D+30.

### Programa da aula:

1. O problema da liquidacao de ativos reais e por que o ERC-4626 sincrono nao funciona
2. Mecanismo request-based: deposit/redeem com pending status e epoch mechanism
3. Integracao com ERC-7575 para multi-asset e implementacao pratica

---

## 1. O problema da liquidacao de ativos reais e por que o ERC-4626 sincrono nao funciona

### O gap temporal entre blockchain e mundo real

No DeFi nativo, tudo acontece em tempo de bloco. Um swap no Uniswap executa em 12 segundos (tempo de bloco do Ethereum). Um deposito em um vault Yearn processa no mesmo bloco. Um flash loan empresta e devolve na mesma transacao. Essa velocidade e possivel porque todos os ativos envolvidos sao tokens on-chain — eles existem inteiramente dentro da maquina virtual e podem ser movidos instantaneamente.

Ativos reais operam em outra dimensao temporal. Uma CPR financeira de cafe, emitida por um produtor do Cerrado Mineiro, tem prazo de vencimento de 12 meses. Quando o gestor de um FIAGRO tokenizado precisa gerar liquidez para honrar resgates, ele tem tres opcoes: (1) esperar o vencimento da CPR, (2) vender a CPR no mercado secundario — processo que pode levar dias a semanas — ou (3) usar uma linha de credito ponte. Nenhuma dessas opcoes acontece em 12 segundos.

- **Exemplo agro**: Um FIAGRO tokenizado tem R$ 50 milhoes em ativos, sendo R$ 5 milhoes em stablecoins (caixa) e R$ 45 milhoes em CPRs de produtores de soja e milho com vencimento entre 3 e 12 meses. Um investidor solicita resgate de R$ 8 milhoes. O vault tem apenas R$ 5 milhoes em caixa. Os R$ 3 milhoes restantes precisam vir da venda de CPRs no mercado secundario. O gestor contata compradores, negocia preco (tipicamente com desconto de 1% a 3%), formaliza a cessao de credito e aguarda a liquidacao financeira. Esse processo leva, no minimo, 5 a 10 dias uteis. Durante todo esse periodo, o status do resgate e "pendente" — um estado que o ERC-4626 simplesmente nao suporta.

### Os tres problemas especificos que o ERC-7540 resolve

**Problema 1 — Timing do deposito (deposit timing mismatch):**
No ERC-4626, `deposit()` transfere assets e emite shares na mesma transacao. A taxa de conversao e calculada naquele exato momento. Mas em um FIAGRO tokenizado, o investidor pode querer "reservar" seu deposito hoje, transferir os fundos via TED amanha, e receber as shares com a taxa de conversao do momento da aceitacao pelo gestor (que pode ser em D+3). O ERC-7540 resolve isso separando a "requisicao de deposito" da "emissao de shares".

**Problema 2 — Liquidez insuficiente para resgate (redemption liquidity gap):**
No ERC-4626, `withdraw()` transfere assets imediatamente. Se o vault nao tem assets liquidos suficientes, a transacao reverte. Em um FIAGRO com 90% dos ativos em CPRs iliquidas, quase todo resgate significativo falharia. O ERC-7540 permite que o investidor solicite o resgate, o vault processe a geracao de liquidez ao longo de dias ou semanas, e o investidor reclame os assets quando estiverem disponiveis.

**Problema 3 — Precificacao periodica (NAV calculation lag):**
No ERC-4626, `totalAssets()` deve retornar o valor atual em tempo real. Mas o valor de um portfolio de CPRs e CRAs nao muda a cada bloco — ele depende de avaliacoes periodicas, marcacao a mercado e eventos de credito. O ERC-7540 permite que depositos e resgates sejam processados em "epocas" (epochs), onde a precificacao e fixada periodicamente pelo gestor, eliminando o problema de front-running baseado em informacao de precificacao.

### O conceito de epoch mechanism

O epoch mechanism e a inovacao central do ERC-7540 para RWA. Em vez de processar cada deposito e resgate individualmente em tempo real, o vault agrupa todas as requisicoes em periodos chamados "epochs" (epocas). No final de cada epoch, o gestor:

1. Calcula o NAV (Net Asset Value) atualizado do portfolio
2. Determina quanta liquidez esta disponivel para resgates
3. Processa todas as requisicoes pendentes usando o NAV do epoch
4. Disponibiliza os resultados para os investidores reivindicarem

```
Epoch 1 (D0-D7)           Epoch 2 (D7-D14)          Epoch 3 (D14-D21)
|                          |                          |
| Requisicoes entram       | Gestor calcula NAV       | Investidores
| - deposit requests       | Processa requisicoes     | reclamam resultados
| - redeem requests        | Define taxa de conversao  | (claim)
|                          |                          |
```

- **Exemplo agro**: Um FIAGRO tokenizado opera com epochs semanais (7 dias). Na segunda-feira, investidores enviam requisicoes de deposito e resgate. Durante a semana, o gestor avalia o portfolio de CPRs, verifica pagamentos recebidos, marca a mercado os ativos e calcula o NAV. Na segunda-feira seguinte, o epoch e fechado: todas as requisicoes sao processadas com o NAV calculado, e os investidores podem reivindicar suas shares (para depositos) ou assets (para resgates). Esse modelo espelha exatamente como FIAGROs tradicionais operam na B3, com cotas calculadas periodicamente e resgates processados em janelas definidas.

---

## 2. Mecanismo request-based: deposit/redeem com pending status

### A interface ERC-7540: requestDeposit e requestRedeem

O ERC-7540 adiciona quatro funcoes principais ao ERC-4626:

```solidity
// === Requisicoes assincronas ===

// Investidor solicita deposito de assets
function requestDeposit(uint256 assets, address controller, address owner) external returns (uint256 requestId);

// Investidor solicita resgate de shares
function requestRedeem(uint256 shares, address controller, address owner) external returns (uint256 requestId);

// === Consulta de status ===

// Quantas shares estao disponiveis para claim apos deposito processado
function pendingDepositRequest(uint256 requestId, address controller) external view returns (uint256 pendingAssets);

// Quantos assets estao disponiveis para claim apos resgate processado
function pendingRedeemRequest(uint256 requestId, address controller) external view returns (uint256 pendingShares);

// Quantas shares o controller pode reivindicar (deposito processado)
function claimableDepositRequest(uint256 requestId, address controller) external view returns (uint256 claimableShares);

// Quantos assets o controller pode reivindicar (resgate processado)
function claimableRedeemRequest(uint256 requestId, address controller) external view returns (uint256 claimableAssets);
```

O fluxo de deposito assincrono funciona assim:

1. **Request**: O investidor chama `requestDeposit(100000 USDC, controller, owner)`. Os USDC sao transferidos para o vault e ficam em estado "pending". Nenhuma share e emitida ainda.
2. **Processing**: O gestor processa a requisicao off-chain — verifica KYC, calcula NAV, confirma liquidez. Esse processo pode levar horas ou dias.
3. **Fulfillment**: O gestor (ou um contrato automatizado) marca a requisicao como "claimable", definindo quantas shares o investidor recebera.
4. **Claim**: O investidor chama `deposit()` ou `mint()` (funcoes do ERC-4626 base) para reivindicar suas shares.

### Implementacao Solidity de um vault assincrono para agro

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title AsyncFIAGROVault
 * @notice Vault ERC-7540 para FIAGRO com depositos e resgates assincronos
 * Implementa epoch-based processing compativel com ciclos do agronegocio
 */
contract AsyncFIAGROVault is ERC4626, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    // === Estruturas de dados ===

    enum RequestStatus { NONE, PENDING, CLAIMABLE, CLAIMED, CANCELLED }

    struct DepositRequest {
        address controller;
        uint256 assets;          // Quantidade de assets depositados
        uint256 shares;          // Shares a receber (definido apos processamento)
        uint256 epochRequested;  // Epoch em que a requisicao foi feita
        uint256 epochFulfilled;  // Epoch em que foi processada
        RequestStatus status;
    }

    struct RedeemRequest {
        address controller;
        uint256 shares;          // Shares a queimar
        uint256 assets;          // Assets a receber (definido apos processamento)
        uint256 epochRequested;
        uint256 epochFulfilled;
        RequestStatus status;
    }

    // === Estado do vault ===

    uint256 public currentEpoch;
    uint256 public epochDuration;      // Duracao do epoch em segundos
    uint256 public lastEpochTimestamp;  // Timestamp do ultimo fechamento de epoch

    uint256 public nextDepositRequestId;
    uint256 public nextRedeemRequestId;

    // Assets pendentes (depositados mas ainda nao convertidos em shares)
    uint256 public pendingDepositAssets;
    // Shares pendentes (marcadas para resgate mas ainda nao convertidas em assets)
    uint256 public pendingRedeemShares;

    mapping(uint256 => DepositRequest) public depositRequests;
    mapping(uint256 => RedeemRequest) public redeemRequests;

    // NAV por epoch (definido pelo gestor no fechamento)
    mapping(uint256 => uint256) public epochNAV;

    // === Eventos ===

    event DepositRequested(uint256 indexed requestId, address indexed controller, uint256 assets, uint256 epoch);
    event RedeemRequested(uint256 indexed requestId, address indexed controller, uint256 shares, uint256 epoch);
    event EpochClosed(uint256 indexed epoch, uint256 nav, uint256 depositsProcessed, uint256 redeemsProcessed);
    event DepositClaimed(uint256 indexed requestId, address indexed controller, uint256 shares);
    event RedeemClaimed(uint256 indexed requestId, address indexed controller, uint256 assets);

    constructor(
        IERC20 _asset,
        string memory _name,
        string memory _symbol,
        uint256 _epochDuration
    ) ERC4626(_asset) ERC20(_name, _symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);

        epochDuration = _epochDuration;
        lastEpochTimestamp = block.timestamp;
        currentEpoch = 1;
    }

    // === Requisicoes assincronas ===

    /**
     * @notice Solicita deposito assincrono
     * Assets sao transferidos imediatamente mas shares so sao emitidas
     * apos o gestor processar a requisicao no fechamento do epoch
     */
    function requestDeposit(
        uint256 assets,
        address controller
    ) external returns (uint256 requestId) {
        require(assets > 0, "AsyncFIAGRO: assets must be > 0");

        // Transfere assets do investidor para o vault
        IERC20(asset()).safeTransferFrom(msg.sender, address(this), assets);

        requestId = nextDepositRequestId++;
        depositRequests[requestId] = DepositRequest({
            controller: controller,
            assets: assets,
            shares: 0,
            epochRequested: currentEpoch,
            epochFulfilled: 0,
            status: RequestStatus.PENDING
        });

        pendingDepositAssets += assets;

        emit DepositRequested(requestId, controller, assets, currentEpoch);
    }

    /**
     * @notice Solicita resgate assincrono
     * Shares sao travadas imediatamente mas assets so sao liberados
     * apos o gestor gerar liquidez e processar no fechamento do epoch
     */
    function requestRedeem(
        uint256 shares,
        address controller
    ) external returns (uint256 requestId) {
        require(shares > 0, "AsyncFIAGRO: shares must be > 0");
        require(balanceOf(msg.sender) >= shares, "AsyncFIAGRO: insufficient shares");

        // Transfere shares do investidor para o vault (trava)
        _transfer(msg.sender, address(this), shares);

        requestId = nextRedeemRequestId++;
        redeemRequests[requestId] = RedeemRequest({
            controller: controller,
            shares: shares,
            assets: 0,
            epochRequested: currentEpoch,
            epochFulfilled: 0,
            status: RequestStatus.PENDING
        });

        pendingRedeemShares += shares;

        emit RedeemRequested(requestId, controller, shares, currentEpoch);
    }

    // === Processamento pelo gestor (fechamento de epoch) ===

    /**
     * @notice Gestor fecha o epoch e processa todas as requisicoes pendentes
     * @param nav O Net Asset Value atualizado do portfolio (em unidades do asset)
     * @param depositRequestIds IDs das requisicoes de deposito a processar
     * @param redeemRequestIds IDs das requisicoes de resgate a processar
     */
    function closeEpoch(
        uint256 nav,
        uint256[] calldata depositRequestIds,
        uint256[] calldata redeemRequestIds
    ) external onlyRole(MANAGER_ROLE) {
        require(
            block.timestamp >= lastEpochTimestamp + epochDuration,
            "AsyncFIAGRO: epoch not elapsed"
        );

        // Registra NAV do epoch
        epochNAV[currentEpoch] = nav;

        // Processa depositos: calcula shares com base no NAV
        uint256 totalNewShares;
        for (uint256 i = 0; i < depositRequestIds.length; i++) {
            DepositRequest storage req = depositRequests[depositRequestIds[i]];
            require(req.status == RequestStatus.PENDING, "AsyncFIAGRO: not pending");

            // shares = assets * totalSupply / NAV
            uint256 sharesToMint;
            if (totalSupply() == 0) {
                sharesToMint = req.assets; // Primeiro deposito: 1:1
            } else {
                sharesToMint = (req.assets * totalSupply()) / nav;
            }

            req.shares = sharesToMint;
            req.epochFulfilled = currentEpoch;
            req.status = RequestStatus.CLAIMABLE;

            totalNewShares += sharesToMint;
            pendingDepositAssets -= req.assets;
        }

        // Processa resgates: calcula assets com base no NAV
        uint256 totalAssetsToRelease;
        for (uint256 i = 0; i < redeemRequestIds.length; i++) {
            RedeemRequest storage req = redeemRequests[redeemRequestIds[i]];
            require(req.status == RequestStatus.PENDING, "AsyncFIAGRO: not pending");

            // assets = shares * NAV / totalSupply
            uint256 assetsToReturn = (req.shares * nav) / totalSupply();

            req.assets = assetsToReturn;
            req.epochFulfilled = currentEpoch;
            req.status = RequestStatus.CLAIMABLE;

            totalAssetsToRelease += assetsToReturn;
            pendingRedeemShares -= req.shares;
        }

        // Mint novas shares para depositos processados
        if (totalNewShares > 0) {
            _mint(address(this), totalNewShares);
        }

        // Burn shares dos resgates processados
        // (shares ja estao no vault desde o requestRedeem)
        if (totalAssetsToRelease > 0) {
            // Burn shares correspondentes
            for (uint256 i = 0; i < redeemRequestIds.length; i++) {
                RedeemRequest storage req = redeemRequests[redeemRequestIds[i]];
                if (req.status == RequestStatus.CLAIMABLE) {
                    _burn(address(this), req.shares);
                }
            }
        }

        emit EpochClosed(currentEpoch, nav, depositRequestIds.length, redeemRequestIds.length);

        // Avanca para proximo epoch
        currentEpoch++;
        lastEpochTimestamp = block.timestamp;
    }

    // === Claim: investidor reivindica resultado ===

    /**
     * @notice Investidor reivindica shares apos deposito processado
     */
    function claimDeposit(uint256 requestId) external returns (uint256 shares) {
        DepositRequest storage req = depositRequests[requestId];
        require(req.status == RequestStatus.CLAIMABLE, "AsyncFIAGRO: not claimable");
        require(
            msg.sender == req.controller,
            "AsyncFIAGRO: not controller"
        );

        shares = req.shares;
        req.status = RequestStatus.CLAIMED;

        // Transfere shares do vault para o investidor
        _transfer(address(this), msg.sender, shares);

        emit DepositClaimed(requestId, msg.sender, shares);
    }

    /**
     * @notice Investidor reivindica assets apos resgate processado
     */
    function claimRedeem(uint256 requestId) external returns (uint256 assets) {
        RedeemRequest storage req = redeemRequests[requestId];
        require(req.status == RequestStatus.CLAIMABLE, "AsyncFIAGRO: not claimable");
        require(
            msg.sender == req.controller,
            "AsyncFIAGRO: not controller"
        );

        assets = req.assets;
        req.status = RequestStatus.CLAIMED;

        // Transfere assets do vault para o investidor
        IERC20(asset()).safeTransfer(msg.sender, assets);

        emit RedeemClaimed(requestId, msg.sender, assets);
    }

    // === View functions ===

    function pendingDepositRequest(uint256 requestId, address controller)
        external view returns (uint256)
    {
        DepositRequest storage req = depositRequests[requestId];
        if (req.controller != controller || req.status != RequestStatus.PENDING) return 0;
        return req.assets;
    }

    function claimableDepositRequest(uint256 requestId, address controller)
        external view returns (uint256)
    {
        DepositRequest storage req = depositRequests[requestId];
        if (req.controller != controller || req.status != RequestStatus.CLAIMABLE) return 0;
        return req.shares;
    }

    function pendingRedeemRequest(uint256 requestId, address controller)
        external view returns (uint256)
    {
        RedeemRequest storage req = redeemRequests[requestId];
        if (req.controller != controller || req.status != RequestStatus.PENDING) return 0;
        return req.shares;
    }

    function claimableRedeemRequest(uint256 requestId, address controller)
        external view returns (uint256)
    {
        RedeemRequest storage req = redeemRequests[requestId];
        if (req.controller != controller || req.status != RequestStatus.CLAIMABLE) return 0;
        return req.assets;
    }
}
```

- **Exemplo agro**: Esse contrato implementa um FIAGRO assincrono com epochs semanais. Na segunda-feira, um investidor chama `requestDeposit(500000 USDC, ...)`. Os USDC sao transferidos imediatamente para o vault, mas nenhuma share e emitida. Durante a semana, o gestor avalia o portfolio de 30 CPRs de produtores de algodao do oeste baiano, calcula o NAV (considerando pagamentos recebidos, inadimplencia e marcacao a mercado), e na segunda-feira seguinte chama `closeEpoch(nav, [...], [...])`. O investidor entao chama `claimDeposit()` e recebe suas shares com base no NAV calculado pelo gestor.

### Status lifecycle: do PENDING ao CLAIMED

O ciclo de vida de uma requisicao no ERC-7540 tem quatro estados:

```
NONE --> PENDING --> CLAIMABLE --> CLAIMED
                |
                +--> CANCELLED (se o investidor cancela antes do processamento)
```

**NONE**: Estado inicial — nenhuma requisicao existe.

**PENDING**: A requisicao foi criada. Para depositos, os assets ja foram transferidos ao vault. Para resgates, as shares ja foram travadas. Mas nenhuma conversao foi feita — o investidor aguarda o processamento.

**CLAIMABLE**: O gestor processou a requisicao. A taxa de conversao foi definida. O investidor pode reivindicar suas shares (deposito) ou assets (resgate) a qualquer momento.

**CLAIMED**: O investidor reivindicou o resultado. A requisicao esta finalizada.

**CANCELLED**: O investidor cancelou a requisicao antes do processamento. Assets ou shares sao devolvidos.

- **Exemplo agro**: Um investidor institucional solicita resgate de R$ 2 milhoes em shares de um FIAGRO tokenizado lastreado em CRAs de cooperativas de cafe. A requisicao entra em status PENDING. O gestor precisa de 15 dias para vender CRAs no mercado secundario e gerar liquidez. Durante esse periodo, o investidor pode consultar `pendingRedeemRequest()` para verificar que sua requisicao esta sendo processada. Quando o gestor fecha o epoch e processa o resgate, o status muda para CLAIMABLE. O investidor chama `claimRedeem()` e recebe seus USDC. Esse fluxo espelha o D+30 de resgates de FIAGROs tradicionais, mas com total transparencia on-chain sobre o status.

---

## 3. Integracao com ERC-7575 para multi-asset e implementacao pratica

### O problema do vault single-asset

O ERC-4626 e o ERC-7540, em suas formas basicas, operam com um unico asset (token de deposito) e um unico token de share. Mas fundos de investimento reais frequentemente precisam de mais flexibilidade:

- Um FIAGRO pode aceitar depositos em USDC e em DREX (Real Digital) simultaneamente
- Um fundo pode emitir cotas senior e cotas subordinadas (junior), com riscos e retornos diferentes
- Um vault pode precisar que o token de share seja um ERC-3643 (com compliance) enquanto o vault em si e um ERC-4626

O ERC-7575 resolve esses problemas ao externalizar o token de share e permitir multiplos pares asset/share para o mesmo vault.

### ERC-7575: a camada de composicao

O ERC-7575 introduz o conceito de "share token externalizado". No ERC-4626, o contrato do vault e simultaneamente o contrato do token de share (ele herda de ERC-20). Isso cria acoplamento: o vault e o token sao a mesma coisa. O ERC-7575 separa essas responsabilidades:

```solidity
// ERC-4626: vault E token sao o mesmo contrato
contract Vault4626 is ERC4626 {
    // O proprio vault e o token de share
    // Nao e possivel usar ERC-3643 como share
}

// ERC-7575: vault aponta para um token externo
interface IERC7575 {
    // Retorna o endereco do token de share (externo ao vault)
    function share() external view returns (address shareTokenAddress);

    // Retorna o endereco do vault para um dado par asset/share
    function vault(address asset) external view returns (address vaultAddress);
}
```

Essa separacao permite:

1. **Share como ERC-3643**: O token de cota pode ser um security token com compliance integrado (identidade, transfer restrictions, paises permitidos), enquanto o vault lida apenas com a logica financeira.

2. **Multi-asset vaults**: O mesmo vault pode aceitar USDC via um "entry point" e DREX via outro, ambos emitindo o mesmo token de share.

3. **Cotas tranched**: Um vault pode emitir dois tokens de share diferentes — cotas senior (baixo risco, retorno fixo) e cotas junior (alto risco, retorno variavel) — usando a mesma base de ativos.

### Arquitetura multi-asset para um FIAGRO com USDC e DREX

```
                    +------------------+
                    |   Share Token    |
                    |   (ERC-3643)     |
                    |  Cotas FIAGRO    |
                    +--------+---------+
                             |
                             | share()
                             |
                    +--------+---------+
                    |   FIAGRO Vault   |
                    |   (ERC-7575)     |
                    |                  |
                    | totalAssets()    |
                    | closeEpoch()    |
                    +---+----------+---+
                        |          |
                vault(USDC)    vault(DREX)
                        |          |
               +--------+--+  +---+--------+
               | USDC Entry |  | DREX Entry |
               | Point      |  | Point      |
               | (ERC-7540) |  | (ERC-7540) |
               +------------+  +------------+
                    |                |
              Investidores     Investidores
              internacionais   brasileiros
              (USDC)           (DREX)
```

- **Exemplo agro**: Um FIAGRO tokenizado de grande porte quer atrair tanto investidores internacionais (que operam com USDC) quanto investidores brasileiros (que usarao DREX quando o Banco Central disponibilizar). Com ERC-7575, o vault principal gerencia o portfolio de CPRs e CRAs. Dois "entry points" ERC-7540 permitem depositos assincronos em USDC e DREX. Ambos emitem o mesmo token de share (um ERC-3643 com compliance que verifica se o investidor e qualificado pela CVM). O gestor fecha epochs semanais, calculando o NAV em BRL e convertendo para cada asset na taxa de cambio do dia.

### Implementacao da interface ERC-7575

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title IShareToken
 * @notice Interface para o token de share externalizado
 */
interface IShareToken {
    function mint(address to, uint256 amount) external;
    function burn(address from, uint256 amount) external;
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
}

/**
 * @title MultiAssetFIAGROVault
 * @notice Vault ERC-7575 que aceita multiplos assets e emite shares externalizadas
 * Combina ERC-7540 (async) + ERC-7575 (multi-asset) + ERC-3643 (compliance)
 */
contract MultiAssetFIAGROVault is AccessControl {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");

    // Token de share externalizado (pode ser ERC-3643)
    IShareToken public immutable shareToken;

    // Assets aceitos pelo vault
    address[] public acceptedAssets;
    mapping(address => bool) public isAcceptedAsset;

    // Entry points (vaults ERC-7540) para cada asset
    mapping(address => address) public entryPoints;

    // NAV total do vault (em unidades base — BRL centavos)
    uint256 public totalNAV;

    // Taxa de cambio por asset (quanto 1 unidade do asset vale em BRL centavos)
    mapping(address => uint256) public assetExchangeRate;

    // Eventos
    event AssetAdded(address indexed asset, address indexed entryPoint);
    event NAVUpdated(uint256 newNAV, uint256 timestamp);
    event ExchangeRateUpdated(address indexed asset, uint256 rate);

    constructor(address _shareToken) {
        shareToken = IShareToken(_shareToken);
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
    }

    // === ERC-7575 interface ===

    function share() external view returns (address) {
        return address(shareToken);
    }

    function vault(address asset) external view returns (address) {
        return entryPoints[asset];
    }

    // === Gestao de assets ===

    function addAsset(
        address asset,
        address entryPoint,
        uint256 exchangeRate
    ) external onlyRole(MANAGER_ROLE) {
        require(!isAcceptedAsset[asset], "Asset already accepted");

        acceptedAssets.push(asset);
        isAcceptedAsset[asset] = true;
        entryPoints[asset] = entryPoint;
        assetExchangeRate[asset] = exchangeRate;

        emit AssetAdded(asset, entryPoint);
    }

    function updateExchangeRate(
        address asset,
        uint256 newRate
    ) external onlyRole(MANAGER_ROLE) {
        require(isAcceptedAsset[asset], "Asset not accepted");
        assetExchangeRate[asset] = newRate;
        emit ExchangeRateUpdated(asset, newRate);
    }

    // === NAV e conversao ===

    function updateNAV(uint256 newNAV) external onlyRole(MANAGER_ROLE) {
        totalNAV = newNAV;
        emit NAVUpdated(newNAV, block.timestamp);
    }

    /**
     * @notice Converte quantidade de um asset em shares
     * @param asset Endereco do token de asset
     * @param assetAmount Quantidade de asset
     * @return shares Quantidade de shares equivalente
     */
    function convertToShares(
        address asset,
        uint256 assetAmount
    ) public view returns (uint256 shares) {
        require(isAcceptedAsset[asset], "Asset not accepted");

        // Converte asset para BRL usando taxa de cambio
        uint256 brlValue = assetAmount * assetExchangeRate[asset] / 1e18;

        // Converte BRL para shares usando NAV
        uint256 supply = shareToken.totalSupply();
        if (supply == 0 || totalNAV == 0) {
            return brlValue; // Primeiro deposito: 1:1 em BRL
        }
        return (brlValue * supply) / totalNAV;
    }

    /**
     * @notice Converte shares em quantidade de um asset
     */
    function convertToAssets(
        address asset,
        uint256 sharesAmount
    ) public view returns (uint256 assets) {
        require(isAcceptedAsset[asset], "Asset not accepted");

        uint256 supply = shareToken.totalSupply();
        if (supply == 0) return 0;

        // Converte shares para BRL
        uint256 brlValue = (sharesAmount * totalNAV) / supply;

        // Converte BRL para asset usando taxa de cambio
        return (brlValue * 1e18) / assetExchangeRate[asset];
    }

    // === Funcoes chamadas pelos entry points ===

    /**
     * @notice Chamado pelo entry point quando um deposito e processado
     * Minta shares para o investidor
     */
    function mintShares(
        address to,
        uint256 shares
    ) external {
        require(entryPoints[msg.sender] != address(0) || hasRole(MANAGER_ROLE, msg.sender),
            "Not authorized");
        shareToken.mint(to, shares);
    }

    /**
     * @notice Chamado pelo entry point quando um resgate e processado
     * Queima shares do investidor
     */
    function burnShares(
        address from,
        uint256 shares
    ) external {
        require(entryPoints[msg.sender] != address(0) || hasRole(MANAGER_ROLE, msg.sender),
            "Not authorized");
        shareToken.burn(from, shares);
    }
}
```

- **Exemplo agro**: Um fundo de credito agro estruturado aceita USDC (para investidores offshore) e DREX (para investidores domesticos). O vault principal mantem o NAV em BRL. Quando um investidor americano deposita 100.000 USDC via entry point USDC, o vault converte para BRL usando a taxa de cambio (ex: 1 USDC = R$ 5,20), calcula as shares equivalentes com base no NAV, e minta shares ERC-3643 para o investidor (apos verificacao de compliance). Quando um investidor brasileiro deposita 520.000 DREX via entry point DREX, recebe exatamente a mesma quantidade de shares — pois ambos depositaram o equivalente a R$ 520 mil. As shares sao fungiveis independente do asset de entrada.

### Cenario completo: FIAGRO com cotas senior e junior

A composicao ERC-7540 + ERC-7575 permite criar estruturas sofisticadas de credito estruturado. Um FIAGRO com tranches senior e junior funciona assim:

**Cotas Senior**: Retorno fixo de CDI + 2% a.a. Primeiro na fila de recebimento. Menor risco. Emitidas como token ERC-3643 "FIAGRO-SR".

**Cotas Junior (subordinadas)**: Retorno residual — recebem o que sobra apos pagar os senior. Maior risco, maior retorno potencial. Emitidas como token ERC-3643 "FIAGRO-JR".

```
Investidor Senior ---> Entry Point Senior (ERC-7540)
                              |
                              v
                    +---------+---------+
                    |  FIAGRO Vault     |
                    |  (ERC-7575)       |
                    |                   |
                    |  Portfolio:       |
                    |  - CPRs soja     |
                    |  - CPRs cafe     |
                    |  - CRAs algodao  |
                    +---------+---------+
                              |
                              v
Investidor Junior ---> Entry Point Junior (ERC-7540)

Distribuicao de rendimentos (waterfall):
1. Paga juros Senior (CDI + 2%)
2. Paga amortizacao Senior
3. Residual vai para Junior
```

- **Exemplo agro**: Um FIAGRO com R$ 100 milhoes em patrimonio: R$ 70 milhoes em cotas senior (CDI + 2%) e R$ 30 milhoes em cotas junior. O portfolio de 50 CPRs de produtores de soja gera retorno bruto de CDI + 5%. Nos primeiros 12 meses, as CPRs pagam rendimento total de R$ 15 milhoes. A waterfall distribui: R$ 8,4 milhoes para senior (CDI + 2% sobre R$ 70 milhoes) e R$ 6,6 milhoes para junior (residual). A cota junior, com apenas R$ 30 milhoes investidos, recebe retorno equivalente a CDI + 12% — quase tres vezes o retorno da cota senior. Porem, se houver inadimplencia de 10% das CPRs (R$ 10 milhoes em perdas), as cotas junior absorvem a perda primeiro, protegendo os senior. Essa estrutura sera detalhada no Modulo 3 sobre Waterfall e Automacao de Pagamentos.

---

## Conclusao

Nesta aula, resolvemos a limitacao fundamental do ERC-4626: a atomicidade. O ERC-7540 introduz o mecanismo de requisicoes assincronas — requestDeposit e requestRedeem — que permite separar a intencao do investidor (solicitar deposito ou resgate) do processamento pelo gestor (calcular NAV, gerar liquidez, verificar compliance). O epoch mechanism agrupa requisicoes em periodos definidos, espelhando como FIAGROs tradicionais operam com cotas calculadas periodicamente e resgates processados em janelas. Tambem exploramos a integracao com o ERC-7575, que externaliza o token de share e habilita vaults multi-asset — fundamentais para aceitar USDC e DREX no mesmo fundo e para emitir cotas tranched (senior/junior) com compliance via ERC-3643.

---

## Licao de Casa

1. Implemente o contrato `AsyncFIAGROVault` em Remix ou Foundry. Crie tres contas de investidores e simule o fluxo completo: requestDeposit com cada investidor, fechamento do epoch pelo gestor com um NAV definido, e claimDeposit por cada investidor. Verifique que as shares emitidas sao proporcionais ao NAV informado. Repita com requestRedeem e verifique que os assets devolvidos correspondem ao NAV do epoch de fechamento.

2. Compare o fluxo de resgate de um FIAGRO tradicional listado na B3 (pesquise o regulamento de qualquer FIAGRO como KNCA11 ou RURA11) com o fluxo assincrono do ERC-7540 implementado nesta aula. Identifique quais etapas do resgate tradicional (solicitacao, prazo D+30, calculo de cota, pagamento) correspondem a quais funcoes e estados do contrato assincrono.

3. Desenhe a arquitetura completa de um vault ERC-7575 multi-asset que aceita USDC e DREX e emite cotas senior e junior como tokens ERC-3643. Defina: (a) quantos contratos sao necessarios, (b) como os entry points se conectam ao vault principal, (c) como a waterfall de pagamento entre senior e junior seria implementada. Nao e necessario codificar — desenhe o diagrama e descreva cada componente.

---

## Questionario

**1. Qual e o problema fundamental que o ERC-7540 resolve em relacao ao ERC-4626?**

a) O ERC-4626 nao suporta tokens ERC-20 como asset
b) O ERC-4626 exige atomicidade (deposito e emissao de shares na mesma transacao), o que e incompativel com ativos reais que exigem tempo para liquidacao, conversao fiat e calculo de NAV
c) O ERC-4626 nao permite compliance KYC/AML
d) O ERC-4626 tem limite maximo de 1.000 shares por vault

**Resposta: b**

**2. No mecanismo de epoch do ERC-7540, o que acontece quando o gestor chama `closeEpoch()`?**

a) Todas as shares do vault sao queimadas e redistribuidas
b) O vault e destruido e um novo vault e criado
c) O gestor define o NAV atualizado, processa todas as requisicoes pendentes usando esse NAV, e muda o status das requisicoes de PENDING para CLAIMABLE
d) Os investidores recebem automaticamente seus assets sem precisar reivindicar

**Resposta: c**

**3. Qual e a sequencia correta do ciclo de vida de uma requisicao de deposito no ERC-7540?**

a) CLAIMABLE -> PENDING -> CLAIMED -> NONE
b) NONE -> PENDING -> CLAIMABLE -> CLAIMED
c) PENDING -> NONE -> CLAIMED -> CLAIMABLE
d) CLAIMED -> PENDING -> CLAIMABLE -> NONE

**Resposta: b**

**4. O que o ERC-7575 adiciona ao ecossistema de vaults que o ERC-4626 e o ERC-7540 sozinhos nao oferecem?**

a) Suporte a NFTs como asset de deposito
b) Externalizacao do token de share (permitindo que seja ERC-3643 com compliance) e suporte a multiplos assets no mesmo vault
c) Eliminacao da necessidade de gestor humano
d) Reducao do custo de gas para zero

**Resposta: b**

**5. Em um FIAGRO tokenizado com cotas senior e junior usando ERC-7575, o que acontece quando ha inadimplencia de 10% das CPRs do portfolio?**

a) As perdas sao divididas igualmente entre cotas senior e junior
b) As cotas senior absorvem todas as perdas primeiro
c) As cotas junior (subordinadas) absorvem as perdas primeiro, protegendo as cotas senior, que so sao afetadas se as perdas excederem o valor total das cotas junior
d) O vault e liquidado automaticamente e todos os investidores perdem igualmente

**Resposta: c**

---

## Proxima Aula

Na proxima aula, vamos aprofundar o ERC-7575 e construir a arquitetura completa de um FIAGRO full on-chain. Voce vai aprender como externalizar o token de share usando ERC-3643, como compor vaults multi-asset que aceitam USDC e DREX simultaneamente, e como implementar a estrutura de cotas senior e subordinada com compliance regulatorio integrado. Essa sera a ponte para o Modulo 3, onde construiremos o mecanismo de waterfall que distribui automaticamente os pagamentos entre as tranches. Ate la!
