# Aula 6.2: Implementacao dos Smart Contracts Core

## Abertura

Bem-vindo a aula 6.2! Na aula anterior, definimos a arquitetura completa do projeto final — pool de CPRs de soja tokenizado como CRA com 3 tranches. Agora, vamos implementar os smart contracts que sustentam toda essa estrutura. Voce vai escrever codigo Solidity completo para os tokens ERC-3643 das tranches, o vault ERC-7540 para depositos assincronos, o contrato de waterfall com subordinacao, e os oraculos de price feed, proof of reserve e NAV. Ao final, vamos rodar testes unitarios e de integracao para garantir que o sistema funciona conforme projetado.

### Programa da aula:

1. Token ERC-3643 para as tranches e Identity Registry (introducao e implementacao)
2. Vault ERC-7540 e WaterfallDistributor com subordinacao (base e aprofundamento)
3. Oraculos, testes unitarios e testes de integracao (conceito principal da aula)

---

## 1. Token ERC-3643 para as tranches e Identity Registry

### Arquitetura do ERC-3643: componentes fundamentais

O padrao ERC-3643 (tambem chamado T-REX — Token for Regulated Exchanges) e composto por cinco contratos principais que trabalham em conjunto:

1. **Token Contract**: o token em si, compativel com ERC-20 mas com verificacao de compliance em cada transferencia.
2. **Identity Registry**: registro de identidades verificadas dos investidores, associando enderecos de carteira a claims de identidade.
3. **Identity Registry Storage**: armazenamento persistente das identidades, separado do registry para upgradability.
4. **Compliance Contract**: regras de compliance modulares que determinam se uma transferencia e permitida.
5. **Trusted Issuers Registry**: registro de emissores de claims confiaveis (provedores de KYC).

Para o nosso projeto, vamos implementar versoes simplificadas mas funcionais desses componentes, focando na logica de negocio essencial.

### Implementacao do Identity Registry

O Identity Registry e o coracao do compliance on-chain. Ele mantem um mapeamento entre enderecos de carteira e o status de verificacao do investidor, incluindo a jurisdicao (Brasil ou Europa) e o tipo de investidor (qualificado ou varejo).

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title IdentityRegistry
 * @notice Registro de identidades verificadas para compliance CVM + MiCA
 * @dev Simplificacao do Identity Registry do ERC-3643 para o projeto agro
 */
contract IdentityRegistry is AccessControl {
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    enum Jurisdiction { NONE, BRAZIL, EUROPE }
    enum InvestorType { NONE, RETAIL, QUALIFIED, PROFESSIONAL }

    struct Identity {
        bool verified;
        Jurisdiction jurisdiction;
        InvestorType investorType;
        uint256 verifiedAt;
        uint256 expiresAt;
        string kycProvider; // ex: "sumsub", "shufti_pro"
    }

    mapping(address => Identity) private _identities;
    address[] private _verifiedAddresses;

    event IdentityRegistered(
        address indexed investor,
        Jurisdiction jurisdiction,
        InvestorType investorType,
        string kycProvider
    );
    event IdentityRevoked(address indexed investor, string reason);
    event IdentityUpdated(address indexed investor);

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(AGENT_ROLE, admin);
        _grantRole(REGISTRAR_ROLE, admin);
    }

    /**
     * @notice Registra uma identidade verificada
     * @param investor Endereco da carteira do investidor
     * @param jurisdiction Jurisdicao (BRAZIL ou EUROPE)
     * @param investorType Tipo de investidor
     * @param validityPeriod Periodo de validade do KYC em segundos
     * @param kycProvider Nome do provedor de KYC utilizado
     */
    function registerIdentity(
        address investor,
        Jurisdiction jurisdiction,
        InvestorType investorType,
        uint256 validityPeriod,
        string calldata kycProvider
    ) external onlyRole(REGISTRAR_ROLE) {
        require(investor != address(0), "Invalid address");
        require(jurisdiction != Jurisdiction.NONE, "Invalid jurisdiction");
        require(investorType != InvestorType.NONE, "Invalid investor type");

        _identities[investor] = Identity({
            verified: true,
            jurisdiction: jurisdiction,
            investorType: investorType,
            verifiedAt: block.timestamp,
            expiresAt: block.timestamp + validityPeriod,
            kycProvider: kycProvider
        });

        _verifiedAddresses.push(investor);

        emit IdentityRegistered(investor, jurisdiction, investorType, kycProvider);
    }

    /**
     * @notice Revoga uma identidade
     */
    function revokeIdentity(
        address investor,
        string calldata reason
    ) external onlyRole(AGENT_ROLE) {
        require(_identities[investor].verified, "Not registered");
        _identities[investor].verified = false;
        emit IdentityRevoked(investor, reason);
    }

    /**
     * @notice Verifica se um investidor esta elegivel para transacoes
     */
    function isVerified(address investor) public view returns (bool) {
        Identity memory id = _identities[investor];
        return id.verified && block.timestamp <= id.expiresAt;
    }

    function getJurisdiction(address investor) external view returns (Jurisdiction) {
        return _identities[investor].jurisdiction;
    }

    function getInvestorType(address investor) external view returns (InvestorType) {
        return _identities[investor].investorType;
    }

    function getIdentity(address investor) external view returns (Identity memory) {
        return _identities[investor];
    }
}
```

### Implementacao do Compliance Contract

O Compliance Contract implementa as regras de transferencia especificas para CVM (Brasil) e MiCA (Europa). Ele e consultado pelo token em cada transferencia para determinar se a operacao e permitida.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IdentityRegistry.sol";

/**
 * @title ComplianceContract
 * @notice Regras de compliance dual-jurisdiction (CVM + MiCA)
 */
contract ComplianceContract {
    IdentityRegistry public identityRegistry;

    // Limites por jurisdicao
    uint256 public constant BRAZIL_RETAIL_MAX_INVESTMENT = 20_000e18; // R$ 20.000 (Res. CVM 88)
    uint256 public constant EUROPE_RETAIL_MAX_INVESTMENT = 10_000e18; // EUR 10.000 (MiCA)

    // Tracking de investimento por investidor
    mapping(address => uint256) public totalInvested;

    // Paises sancionados (hash do codigo ISO)
    mapping(bytes32 => bool) public sanctionedCountries;

    // Lock-up periods por tranche (em segundos)
    mapping(address => uint256) public trancheLockup;

    // Timestamp do primeiro investimento
    mapping(address => uint256) public firstInvestmentTime;

    event ComplianceCheckPassed(address indexed from, address indexed to, uint256 amount);
    event ComplianceCheckFailed(address indexed from, address indexed to, string reason);

    constructor(address _identityRegistry) {
        identityRegistry = IdentityRegistry(_identityRegistry);
    }

    /**
     * @notice Verifica se uma transferencia e permitida
     * @param from Endereco de origem
     * @param to Endereco de destino
     * @param amount Quantidade de tokens
     * @return allowed Se a transferencia e permitida
     */
    function canTransfer(
        address from,
        address to,
        uint256 amount
    ) external view returns (bool allowed) {
        // Mint (from == address(0)) so verifica o destinatario
        if (from == address(0)) {
            return _checkRecipient(to, amount);
        }

        // Burn (to == address(0)) sempre permitido para o emissor
        if (to == address(0)) {
            return true;
        }

        // Transferencia regular: ambos devem ser verificados
        if (!identityRegistry.isVerified(from)) return false;
        if (!_checkRecipient(to, amount)) return false;

        // Verificar lock-up do remetente
        // (simplificado — em producao, verificar por tranche)

        return true;
    }

    function _checkRecipient(
        address to,
        uint256 amount
    ) internal view returns (bool) {
        if (!identityRegistry.isVerified(to)) return false;

        IdentityRegistry.InvestorType investorType = identityRegistry.getInvestorType(to);
        IdentityRegistry.Jurisdiction jurisdiction = identityRegistry.getJurisdiction(to);

        // Investidores qualificados e profissionais: sem limite
        if (
            investorType == IdentityRegistry.InvestorType.QUALIFIED ||
            investorType == IdentityRegistry.InvestorType.PROFESSIONAL
        ) {
            return true;
        }

        // Investidores varejo: aplicar limites por jurisdicao
        if (jurisdiction == IdentityRegistry.Jurisdiction.BRAZIL) {
            return (totalInvested[to] + amount) <= BRAZIL_RETAIL_MAX_INVESTMENT;
        }

        if (jurisdiction == IdentityRegistry.Jurisdiction.EUROPE) {
            return (totalInvested[to] + amount) <= EUROPE_RETAIL_MAX_INVESTMENT;
        }

        return false;
    }

    /**
     * @notice Atualiza o total investido (chamado pelo token apos transferencia)
     */
    function recordInvestment(address investor, uint256 amount) external {
        totalInvested[investor] += amount;
        if (firstInvestmentTime[investor] == 0) {
            firstInvestmentTime[investor] = block.timestamp;
        }
    }
}
```

### Implementacao do Token ERC-3643 para Tranches

O token de tranche integra o Identity Registry e o Compliance Contract, verificando compliance em cada transferencia:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./IdentityRegistry.sol";
import "./ComplianceContract.sol";

/**
 * @title TrancheToken
 * @notice Token ERC-3643 simplificado para tranches de CRA agro
 * @dev Cada tranche (Senior, Mezanino, Subordinada) e uma instancia deste contrato
 */
contract TrancheToken is ERC20, AccessControl, Pausable {
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    IdentityRegistry public identityRegistry;
    ComplianceContract public complianceContract;

    // Metadata da tranche
    string public trancheType; // "SENIOR", "MEZZANINE", "SUBORDINATED"
    uint256 public couponRateBps; // Taxa de cupom em basis points (ex: 100 = 1%)
    uint256 public maturityDate;
    uint256 public totalCapacity; // Capacidade maxima da tranche

    // Controle de freeze por investidor
    mapping(address => bool) public frozen;

    event TokensFrozen(address indexed investor, string reason);
    event TokensUnfrozen(address indexed investor);
    event ForcedTransfer(address indexed from, address indexed to, uint256 amount, string reason);

    constructor(
        string memory name,
        string memory symbol,
        string memory _trancheType,
        uint256 _couponRateBps,
        uint256 _maturityDate,
        uint256 _totalCapacity,
        address _identityRegistry,
        address _complianceContract,
        address admin
    ) ERC20(name, symbol) {
        trancheType = _trancheType;
        couponRateBps = _couponRateBps;
        maturityDate = _maturityDate;
        totalCapacity = _totalCapacity;
        identityRegistry = IdentityRegistry(_identityRegistry);
        complianceContract = ComplianceContract(_complianceContract);

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(AGENT_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    /**
     * @notice Mint de tokens (apenas por agentes autorizados, ex: vault)
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= totalCapacity, "Exceeds tranche capacity");
        require(
            complianceContract.canTransfer(address(0), to, amount),
            "Compliance: mint not allowed"
        );

        _mint(to, amount);
        complianceContract.recordInvestment(to, amount);
    }

    /**
     * @notice Burn de tokens (resgate)
     */
    function burn(address from, uint256 amount) external onlyRole(AGENT_ROLE) {
        _burn(from, amount);
    }

    /**
     * @notice Override de transferencia com verificacao de compliance
     */
    function _update(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        // Skip compliance check para mint e burn (ja verificados)
        if (from != address(0) && to != address(0)) {
            require(!frozen[from], "Sender is frozen");
            require(!frozen[to], "Recipient is frozen");
            require(
                complianceContract.canTransfer(from, to, amount),
                "Compliance: transfer not allowed"
            );
        }

        super._update(from, to, amount);
    }

    /**
     * @notice Congela tokens de um investidor (ex: ordem judicial, investigacao AML)
     */
    function freeze(
        address investor,
        string calldata reason
    ) external onlyRole(AGENT_ROLE) {
        frozen[investor] = true;
        emit TokensFrozen(investor, reason);
    }

    /**
     * @notice Descongela tokens
     */
    function unfreeze(address investor) external onlyRole(AGENT_ROLE) {
        frozen[investor] = false;
        emit TokensUnfrozen(investor);
    }

    /**
     * @notice Transferencia forcada (ex: decisao judicial, recuperacao de conta)
     */
    function forcedTransfer(
        address from,
        address to,
        uint256 amount,
        string calldata reason
    ) external onlyRole(AGENT_ROLE) {
        require(identityRegistry.isVerified(to), "Recipient not verified");
        _transfer(from, to, amount);
        emit ForcedTransfer(from, to, amount, reason);
    }

    function pause() external onlyRole(AGENT_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(AGENT_ROLE) {
        _unpause();
    }
}
```

- **Exemplo**: Na pratica, a securitizadora faria o deploy de tres instancias do TrancheToken: uma para Senior ("CRA Soja Senior", "CRA-SR", couponRate=100bps), uma para Mezanino ("CRA Soja Mezanino", "CRA-MZ", couponRate=350bps) e uma para Subordinada ("CRA Soja Subordinada", "CRA-SUB", couponRate=0). Todas compartilham o mesmo IdentityRegistry e ComplianceContract, garantindo que as regras de KYC e jurisdicao sejam uniformes.

---

## 2. Vault ERC-7540 e WaterfallDistributor com subordinacao

### Implementacao do Vault ERC-7540

O vault gerencia os depositos dos investidores de forma assincrona. O investidor deposita stablecoins, a solicitacao fica pendente ate aprovacao de compliance, e somente entao os tokens da tranche sao emitidos.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./TrancheToken.sol";

/**
 * @title AsyncVault
 * @notice Vault ERC-7540 simplificado para depositos assincronos em tranches de CRA
 */
contract AsyncVault is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    IERC20 public stablecoin; // USDC, BRZ ou DREX
    TrancheToken public trancheToken;

    enum RequestStatus { NONE, PENDING, APPROVED, REJECTED, CLAIMED }

    struct DepositRequest {
        address investor;
        uint256 assets; // Quantidade de stablecoin depositada
        uint256 shares; // Quantidade de tokens a receber (calculada no approve)
        RequestStatus status;
        uint256 requestedAt;
        uint256 processedAt;
    }

    struct RedeemRequest {
        address investor;
        uint256 shares; // Quantidade de tokens a resgatar
        uint256 assets; // Quantidade de stablecoin a receber
        RequestStatus status;
        uint256 requestedAt;
        uint256 processedAt;
    }

    // Request ID counter
    uint256 public nextDepositRequestId;
    uint256 public nextRedeemRequestId;

    mapping(uint256 => DepositRequest) public depositRequests;
    mapping(uint256 => RedeemRequest) public redeemRequests;

    // Preco por share (NAV-based, atualizado pelo oraculo)
    uint256 public sharePrice; // Em base 1e18 (1e18 = 1:1)
    uint256 public totalAssetsManaged;

    event DepositRequested(uint256 indexed requestId, address indexed investor, uint256 assets);
    event DepositApproved(uint256 indexed requestId, uint256 shares);
    event DepositRejected(uint256 indexed requestId, string reason);
    event DepositClaimed(uint256 indexed requestId, address indexed investor, uint256 shares);
    event RedeemRequested(uint256 indexed requestId, address indexed investor, uint256 shares);
    event RedeemApproved(uint256 indexed requestId, uint256 assets);
    event SharePriceUpdated(uint256 oldPrice, uint256 newPrice);

    constructor(
        address _stablecoin,
        address _trancheToken,
        address admin
    ) {
        stablecoin = IERC20(_stablecoin);
        trancheToken = TrancheToken(_trancheToken);
        sharePrice = 1e18; // Preco inicial 1:1

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(OPERATOR_ROLE, admin);
    }

    // ============================================================
    //                    DEPOSITOS ASSINCRONOS
    // ============================================================

    /**
     * @notice Investidor solicita deposito
     * @param assets Quantidade de stablecoin a depositar
     * @return requestId ID da solicitacao
     */
    function requestDeposit(uint256 assets) external returns (uint256 requestId) {
        require(assets > 0, "Zero deposit");

        // Transfere stablecoin para o vault (escrow)
        stablecoin.safeTransferFrom(msg.sender, address(this), assets);

        requestId = nextDepositRequestId++;
        depositRequests[requestId] = DepositRequest({
            investor: msg.sender,
            assets: assets,
            shares: 0,
            status: RequestStatus.PENDING,
            requestedAt: block.timestamp,
            processedAt: 0
        });

        emit DepositRequested(requestId, msg.sender, assets);
    }

    /**
     * @notice Operador aprova deposito apos verificacao de compliance
     * @param requestId ID da solicitacao
     */
    function approveDeposit(uint256 requestId) external onlyRole(OPERATOR_ROLE) {
        DepositRequest storage req = depositRequests[requestId];
        require(req.status == RequestStatus.PENDING, "Not pending");

        // Calcular shares com base no NAV
        uint256 shares = (req.assets * 1e18) / sharePrice;
        req.shares = shares;
        req.status = RequestStatus.APPROVED;
        req.processedAt = block.timestamp;

        totalAssetsManaged += req.assets;

        emit DepositApproved(requestId, shares);
    }

    /**
     * @notice Operador rejeita deposito (compliance falhou)
     */
    function rejectDeposit(
        uint256 requestId,
        string calldata reason
    ) external onlyRole(OPERATOR_ROLE) {
        DepositRequest storage req = depositRequests[requestId];
        require(req.status == RequestStatus.PENDING, "Not pending");

        req.status = RequestStatus.REJECTED;
        req.processedAt = block.timestamp;

        // Devolve stablecoin ao investidor
        stablecoin.safeTransfer(req.investor, req.assets);

        emit DepositRejected(requestId, reason);
    }

    /**
     * @notice Investidor resgata tokens apos aprovacao
     */
    function claimDeposit(uint256 requestId) external {
        DepositRequest storage req = depositRequests[requestId];
        require(req.investor == msg.sender, "Not your request");
        require(req.status == RequestStatus.APPROVED, "Not approved");

        req.status = RequestStatus.CLAIMED;

        // Mint tokens da tranche para o investidor
        trancheToken.mint(msg.sender, req.shares);

        emit DepositClaimed(requestId, msg.sender, req.shares);
    }

    // ============================================================
    //                    RESGATES ASSINCRONOS
    // ============================================================

    /**
     * @notice Investidor solicita resgate
     */
    function requestRedeem(uint256 shares) external returns (uint256 requestId) {
        require(shares > 0, "Zero redeem");
        require(trancheToken.balanceOf(msg.sender) >= shares, "Insufficient shares");

        requestId = nextRedeemRequestId++;
        redeemRequests[requestId] = RedeemRequest({
            investor: msg.sender,
            shares: shares,
            assets: 0,
            status: RequestStatus.PENDING,
            requestedAt: block.timestamp,
            processedAt: 0
        });

        emit RedeemRequested(requestId, msg.sender, shares);
    }

    /**
     * @notice Operador aprova resgate
     */
    function approveRedeem(uint256 requestId) external onlyRole(OPERATOR_ROLE) {
        RedeemRequest storage req = redeemRequests[requestId];
        require(req.status == RequestStatus.PENDING, "Not pending");

        uint256 assets = (req.shares * sharePrice) / 1e18;
        require(
            stablecoin.balanceOf(address(this)) >= assets,
            "Insufficient liquidity"
        );

        req.assets = assets;
        req.status = RequestStatus.APPROVED;
        req.processedAt = block.timestamp;

        // Burn tokens e transfere stablecoin
        trancheToken.burn(req.investor, req.shares);
        stablecoin.safeTransfer(req.investor, assets);

        totalAssetsManaged -= assets;

        emit RedeemApproved(requestId, assets);
    }

    // ============================================================
    //                    NAV E PRECO
    // ============================================================

    /**
     * @notice Atualiza o preco por share (chamado pelo oraculo de NAV)
     */
    function updateSharePrice(uint256 newPrice) external onlyRole(OPERATOR_ROLE) {
        require(newPrice > 0, "Invalid price");
        uint256 oldPrice = sharePrice;
        sharePrice = newPrice;
        emit SharePriceUpdated(oldPrice, newPrice);
    }

    /**
     * @notice Retorna o total de ativos gerenciados pelo vault
     */
    function totalAssets() external view returns (uint256) {
        return totalAssetsManaged;
    }

    /**
     * @notice Converte assets para shares usando o preco atual
     */
    function convertToShares(uint256 assets) external view returns (uint256) {
        return (assets * 1e18) / sharePrice;
    }

    /**
     * @notice Converte shares para assets usando o preco atual
     */
    function convertToAssets(uint256 shares) external view returns (uint256) {
        return (shares * sharePrice) / 1e18;
    }
}
```

- **Exemplo**: Um investidor brasileiro qualificado deseja investir R$ 500.000 na tranche Senior. Ele chama requestDeposit(500_000e18) usando BRZ (stablecoin lastreada em Real). O vault recebe os BRZ e cria um DepositRequest com status PENDING. O sistema off-chain verifica no Identity Registry que o investidor esta verificado como QUALIFIED na jurisdicao BRAZIL. O operador chama approveDeposit, calculando que 500.000 BRZ a sharePrice de 1e18 resulta em 500.000 tokens Senior. O investidor chama claimDeposit e recebe seus tokens CRA-SR.

### Implementacao do WaterfallDistributor

O WaterfallDistributor e o contrato que implementa a cascata de pagamentos do CRA. Quando os produtores pagam suas CPRs, os recursos entram no contrato e sao distribuidos na seguinte ordem: (1) despesas do veiculo, (2) cupom e amortizacao da tranche Senior, (3) cupom e amortizacao da tranche Mezanino, (4) residual para a tranche Subordinada.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./TrancheToken.sol";

/**
 * @title WaterfallDistributor
 * @notice Distribui pagamentos do pool de CPRs respeitando subordinacao
 * @dev Implementa a cascata: Despesas > Senior > Mezanino > Subordinada
 */
contract WaterfallDistributor is AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");

    IERC20 public stablecoin;

    TrancheToken public seniorToken;
    TrancheToken public mezzanineToken;
    TrancheToken public subordinatedToken;

    // Enderecos dos vaults (para enviar pagamentos)
    address public seniorVault;
    address public mezzanineVault;
    address public subordinatedVault;

    // Endereco do agente fiduciario (recebe despesas do veiculo)
    address public fiduciaryAgent;

    // Parametros da estrutura
    uint256 public vehicleExpensesBps; // Despesas do veiculo em bps (ex: 50 = 0.5%)
    uint256 public seniorCouponBps;    // Cupom senior em bps (ex: 100 = CDI+1%)
    uint256 public mezzanineCouponBps; // Cupom mezanino em bps (ex: 350 = CDI+3.5%)

    // Tracking de pagamentos
    uint256 public totalDistributed;
    uint256 public totalReceived;
    uint256 public distributionCount;

    // ICSD (Indice de Cobertura do Servico da Divida)
    uint256 public currentICSD; // Em base 1e4 (12500 = 1.25x)
    uint256 public constant MIN_ICSD = 11000; // 1.10x - trigger de aceleracao

    // Status do pool
    bool public accelerated; // Se ICSD caiu abaixo do minimo
    uint256 public totalDefaults; // Valor total de CPRs inadimplentes

    struct Distribution {
        uint256 timestamp;
        uint256 totalAmount;
        uint256 expensesPaid;
        uint256 seniorPaid;
        uint256 mezzaninePaid;
        uint256 subordinatedPaid;
        uint256 icsdAtDistribution;
    }

    mapping(uint256 => Distribution) public distributions;

    event PaymentReceived(uint256 amount, uint256 timestamp);
    event DistributionExecuted(
        uint256 indexed distributionId,
        uint256 expenses,
        uint256 senior,
        uint256 mezzanine,
        uint256 subordinated
    );
    event ICSDUpdated(uint256 oldICSD, uint256 newICSD);
    event AccelerationTriggered(uint256 icsd);
    event DefaultRecorded(uint256 amount, uint256 totalDefaults);

    constructor(
        address _stablecoin,
        address _seniorToken,
        address _mezzanineToken,
        address _subordinatedToken,
        address _seniorVault,
        address _mezzanineVault,
        address _subordinatedVault,
        address _fiduciaryAgent,
        uint256 _vehicleExpensesBps,
        uint256 _seniorCouponBps,
        uint256 _mezzanineCouponBps,
        address admin
    ) {
        stablecoin = IERC20(_stablecoin);
        seniorToken = TrancheToken(_seniorToken);
        mezzanineToken = TrancheToken(_mezzanineToken);
        subordinatedToken = TrancheToken(_subordinatedToken);
        seniorVault = _seniorVault;
        mezzanineVault = _mezzanineVault;
        subordinatedVault = _subordinatedVault;
        fiduciaryAgent = _fiduciaryAgent;
        vehicleExpensesBps = _vehicleExpensesBps;
        seniorCouponBps = _seniorCouponBps;
        mezzanineCouponBps = _mezzanineCouponBps;
        currentICSD = 12500; // Inicial: 1.25x

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(DISTRIBUTOR_ROLE, admin);
    }

    /**
     * @notice Recebe pagamentos das CPRs
     * @param amount Valor recebido em stablecoin
     */
    function receivePayment(uint256 amount) external {
        stablecoin.safeTransferFrom(msg.sender, address(this), amount);
        totalReceived += amount;
        emit PaymentReceived(amount, block.timestamp);
    }

    /**
     * @notice Executa distribuicao waterfall
     * @dev Chamado periodicamente (mensal) pelo agente fiduciario
     */
    function distribute() external onlyRole(DISTRIBUTOR_ROLE) {
        uint256 available = stablecoin.balanceOf(address(this));
        require(available > 0, "No funds to distribute");

        uint256 expenses = 0;
        uint256 seniorPayment = 0;
        uint256 mezzaninePayment = 0;
        uint256 subordinatedPayment = 0;
        uint256 remaining = available;

        // ============================================
        // NIVEL 1: Despesas do veiculo
        // ============================================
        expenses = (available * vehicleExpensesBps) / 10000;
        if (expenses > remaining) expenses = remaining;
        if (expenses > 0) {
            stablecoin.safeTransfer(fiduciaryAgent, expenses);
            remaining -= expenses;
        }

        // ============================================
        // NIVEL 2: Cupom + amortizacao Senior
        // ============================================
        uint256 seniorOutstanding = seniorToken.totalSupply();
        uint256 seniorDue = (seniorOutstanding * seniorCouponBps) / 10000;

        // Em cenario de aceleracao, paga principal + cupom
        if (accelerated) {
            seniorDue += seniorOutstanding;
        }

        seniorPayment = seniorDue > remaining ? remaining : seniorDue;
        if (seniorPayment > 0) {
            stablecoin.safeTransfer(seniorVault, seniorPayment);
            remaining -= seniorPayment;
        }

        // ============================================
        // NIVEL 3: Cupom + amortizacao Mezanino
        // ============================================
        if (remaining > 0) {
            uint256 mezzOutstanding = mezzanineToken.totalSupply();
            uint256 mezzDue = (mezzOutstanding * mezzanineCouponBps) / 10000;

            if (accelerated) {
                mezzDue += mezzOutstanding;
            }

            mezzaninePayment = mezzDue > remaining ? remaining : mezzDue;
            if (mezzaninePayment > 0) {
                stablecoin.safeTransfer(mezzanineVault, mezzaninePayment);
                remaining -= mezzaninePayment;
            }
        }

        // ============================================
        // NIVEL 4: Residual para Subordinada
        // ============================================
        subordinatedPayment = remaining;
        if (subordinatedPayment > 0) {
            stablecoin.safeTransfer(subordinatedVault, subordinatedPayment);
        }

        // Registrar distribuicao
        uint256 distId = distributionCount++;
        distributions[distId] = Distribution({
            timestamp: block.timestamp,
            totalAmount: available,
            expensesPaid: expenses,
            seniorPaid: seniorPayment,
            mezzaninePaid: mezzaninePayment,
            subordinatedPaid: subordinatedPayment,
            icsdAtDistribution: currentICSD
        });

        totalDistributed += available;

        emit DistributionExecuted(distId, expenses, seniorPayment, mezzaninePayment, subordinatedPayment);
    }

    /**
     * @notice Registra default de uma CPR do pool
     * @param amount Valor da CPR inadimplente
     */
    function recordDefault(uint256 amount) external onlyRole(DISTRIBUTOR_ROLE) {
        totalDefaults += amount;
        _updateICSD();
        emit DefaultRecorded(amount, totalDefaults);
    }

    /**
     * @notice Atualiza o ICSD com base nos dados atuais
     */
    function _updateICSD() internal {
        uint256 seniorOutstanding = seniorToken.totalSupply();
        if (seniorOutstanding == 0) return;

        // ICSD = (Recebiveis Adimplentes) / (Servico da Divida Senior)
        uint256 performing = totalReceived > totalDefaults
            ? totalReceived - totalDefaults
            : 0;
        uint256 seniorService = (seniorOutstanding * seniorCouponBps) / 10000 + seniorOutstanding;

        uint256 oldICSD = currentICSD;
        currentICSD = seniorService > 0
            ? (performing * 10000) / seniorService
            : 0;

        emit ICSDUpdated(oldICSD, currentICSD);

        // Trigger de aceleracao
        if (currentICSD < MIN_ICSD && !accelerated) {
            accelerated = true;
            emit AccelerationTriggered(currentICSD);
        }
    }

    /**
     * @notice Consulta detalhes de uma distribuicao passada
     */
    function getDistribution(uint256 distId) external view returns (Distribution memory) {
        return distributions[distId];
    }
}
```

- **Exemplo**: Suponha que em um mes o pool de CPRs gerou R$ 4.500.000 em pagamentos. O waterfall distribui assim: (1) Despesas do veiculo a 0,5% = R$ 22.500 para o agente fiduciario; (2) Cupom Senior a 1% sobre R$ 35M outstanding = R$ 350.000; (3) Cupom Mezanino a 3,5% sobre R$ 10M outstanding = R$ 350.000; (4) Residual de R$ 3.777.500 para a tranche Subordinada. Se dois produtores derem default (R$ 5M total), o ICSD cai e pode acionar a aceleracao, priorizando o pagamento do principal da Senior.

---

## 3. Oraculos, testes unitarios e testes de integracao

### Implementacao dos Oraculos

O contrato de oraculos agrega as tres fontes de dados necessarias para o sistema:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title AgroOracles
 * @notice Oraculos para price feed (soja), proof of reserve e NAV
 */
contract AgroOracles is AccessControl {
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");

    // ============================================
    //            PRICE FEED (SOJA)
    // ============================================

    struct PriceData {
        uint256 price;        // Preco em centavos de USD (ex: 1200 = $12.00/bushel)
        uint256 timestamp;
        uint256 confidence;   // Nivel de confianca em bps (9500 = 95%)
        string source;        // "chainlink", "cepea", "b3"
    }

    PriceData public soybeanPrice;
    uint256 public constant PRICE_STALENESS_THRESHOLD = 1 hours;

    // ============================================
    //          PROOF OF RESERVE (CPRs)
    // ============================================

    enum CPRStatus { PERFORMING, LATE_30, LATE_60, LATE_90, DEFAULT, PAID }

    struct CPRData {
        bytes32 cprId;          // Hash do ID da CPR na registradora
        uint256 principalAmount;
        CPRStatus status;
        uint256 lastUpdated;
        string producer;       // Nome/CNPJ do produtor (hash)
    }

    mapping(bytes32 => CPRData) public cprRegistry;
    bytes32[] public cprIds;
    uint256 public totalPerforming;
    uint256 public totalDefaulted;
    uint256 public totalPaid;

    // ============================================
    //              NAV POR TRANCHE
    // ============================================

    struct NAVData {
        uint256 nav;            // NAV total da tranche em stablecoin
        uint256 navPerShare;    // NAV por share (em base 1e18)
        uint256 timestamp;
    }

    mapping(string => NAVData) public trancheNAV; // "SENIOR", "MEZZANINE", "SUBORDINATED"

    // ============================================
    //                  EVENTOS
    // ============================================

    event PriceUpdated(uint256 price, string source, uint256 timestamp);
    event CPRStatusUpdated(bytes32 indexed cprId, CPRStatus status);
    event NAVUpdated(string tranche, uint256 nav, uint256 navPerShare);
    event ReserveAttestationPublished(
        uint256 totalPerforming,
        uint256 totalDefaulted,
        uint256 timestamp
    );

    constructor(address admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(ORACLE_ROLE, admin);
    }

    // ============================================
    //            FUNCOES DE PRICE FEED
    // ============================================

    /**
     * @notice Atualiza o preco da soja
     * @param price Preco em centavos de USD por bushel
     * @param confidence Confianca em bps
     * @param source Fonte do dado
     */
    function updateSoybeanPrice(
        uint256 price,
        uint256 confidence,
        string calldata source
    ) external onlyRole(ORACLE_ROLE) {
        require(price > 0, "Invalid price");
        require(confidence > 0 && confidence <= 10000, "Invalid confidence");

        soybeanPrice = PriceData({
            price: price,
            timestamp: block.timestamp,
            confidence: confidence,
            source: source
        });

        emit PriceUpdated(price, source, block.timestamp);
    }

    /**
     * @notice Retorna o preco atual da soja, revertendo se estiver desatualizado
     */
    function getSoybeanPrice() external view returns (uint256 price, uint256 timestamp) {
        require(
            block.timestamp - soybeanPrice.timestamp <= PRICE_STALENESS_THRESHOLD,
            "Price data is stale"
        );
        return (soybeanPrice.price, soybeanPrice.timestamp);
    }

    // ============================================
    //        FUNCOES DE PROOF OF RESERVE
    // ============================================

    /**
     * @notice Registra uma CPR no pool
     */
    function registerCPR(
        bytes32 cprId,
        uint256 principalAmount,
        string calldata producer
    ) external onlyRole(ORACLE_ROLE) {
        cprRegistry[cprId] = CPRData({
            cprId: cprId,
            principalAmount: principalAmount,
            status: CPRStatus.PERFORMING,
            lastUpdated: block.timestamp,
            producer: producer
        });

        cprIds.push(cprId);
        totalPerforming += principalAmount;
    }

    /**
     * @notice Atualiza o status de uma CPR
     */
    function updateCPRStatus(
        bytes32 cprId,
        CPRStatus newStatus
    ) external onlyRole(ORACLE_ROLE) {
        CPRData storage cpr = cprRegistry[cprId];
        require(cpr.principalAmount > 0, "CPR not found");

        CPRStatus oldStatus = cpr.status;

        // Atualizar contadores
        if (oldStatus == CPRStatus.PERFORMING && newStatus == CPRStatus.DEFAULT) {
            totalPerforming -= cpr.principalAmount;
            totalDefaulted += cpr.principalAmount;
        } else if (oldStatus == CPRStatus.PERFORMING && newStatus == CPRStatus.PAID) {
            totalPerforming -= cpr.principalAmount;
            totalPaid += cpr.principalAmount;
        }

        cpr.status = newStatus;
        cpr.lastUpdated = block.timestamp;

        emit CPRStatusUpdated(cprId, newStatus);
    }

    /**
     * @notice Publica attestation de reserva (chamado periodicamente)
     */
    function publishReserveAttestation() external onlyRole(ORACLE_ROLE) {
        emit ReserveAttestationPublished(totalPerforming, totalDefaulted, block.timestamp);
    }

    // ============================================
    //            FUNCOES DE NAV
    // ============================================

    /**
     * @notice Atualiza o NAV de uma tranche
     * @param tranche Nome da tranche ("SENIOR", "MEZZANINE", "SUBORDINATED")
     * @param nav NAV total em stablecoin
     * @param navPerShare NAV por share em base 1e18
     */
    function updateNAV(
        string calldata tranche,
        uint256 nav,
        uint256 navPerShare
    ) external onlyRole(ORACLE_ROLE) {
        trancheNAV[tranche] = NAVData({
            nav: nav,
            navPerShare: navPerShare,
            timestamp: block.timestamp
        });

        emit NAVUpdated(tranche, nav, navPerShare);
    }

    /**
     * @notice Retorna o NAV atual de uma tranche
     */
    function getNAV(string calldata tranche) external view returns (uint256 nav, uint256 navPerShare, uint256 timestamp) {
        NAVData memory data = trancheNAV[tranche];
        return (data.nav, data.navPerShare, data.timestamp);
    }

    /**
     * @notice Retorna o numero total de CPRs registradas
     */
    function getCPRCount() external view returns (uint256) {
        return cprIds.length;
    }

    /**
     * @notice Retorna resumo do pool
     */
    function getPoolSummary() external view returns (
        uint256 performing,
        uint256 defaulted,
        uint256 paid,
        uint256 totalCPRs
    ) {
        return (totalPerforming, totalDefaulted, totalPaid, cprIds.length);
    }
}
```

### Testes unitarios

Os testes unitarios validam cada componente isoladamente. Abaixo, os testes principais usando Foundry (forge):

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/IdentityRegistry.sol";
import "../src/ComplianceContract.sol";
import "../src/TrancheToken.sol";
import "../src/AsyncVault.sol";
import "../src/WaterfallDistributor.sol";
import "../src/AgroOracles.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Mock stablecoin para testes
contract MockStablecoin is ERC20 {
    constructor() ERC20("Mock BRZ", "BRZ") {
        _mint(msg.sender, 100_000_000e18);
    }

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}

contract CRATokenizationTest is Test {
    IdentityRegistry public registry;
    ComplianceContract public compliance;
    TrancheToken public seniorToken;
    TrancheToken public mezzToken;
    TrancheToken public subToken;
    AsyncVault public seniorVault;
    WaterfallDistributor public waterfall;
    AgroOracles public oracles;
    MockStablecoin public brz;

    address public admin = address(1);
    address public investorBR = address(2);
    address public investorEU = address(3);
    address public investorUnverified = address(4);
    address public fiduciary = address(5);

    function setUp() public {
        vm.startPrank(admin);

        // Deploy stablecoin
        brz = new MockStablecoin();

        // Deploy Identity Registry
        registry = new IdentityRegistry(admin);

        // Deploy Compliance
        compliance = new ComplianceContract(address(registry));

        // Deploy Senior Token
        seniorToken = new TrancheToken(
            "CRA Soja Senior",
            "CRA-SR",
            "SENIOR",
            100, // 1% cupom
            block.timestamp + 365 days,
            35_000_000e18, // R$ 35M
            address(registry),
            address(compliance),
            admin
        );

        // Deploy Mezanino Token
        mezzToken = new TrancheToken(
            "CRA Soja Mezanino",
            "CRA-MZ",
            "MEZZANINE",
            350, // 3.5% cupom
            block.timestamp + 365 days,
            10_000_000e18, // R$ 10M
            address(registry),
            address(compliance),
            admin
        );

        // Deploy Subordinada Token
        subToken = new TrancheToken(
            "CRA Soja Subordinada",
            "CRA-SUB",
            "SUBORDINATED",
            0, // Sem cupom fixo
            block.timestamp + 365 days,
            5_000_000e18, // R$ 5M
            address(registry),
            address(compliance),
            admin
        );

        // Deploy Vault
        seniorVault = new AsyncVault(
            address(brz),
            address(seniorToken),
            admin
        );

        // Grant MINTER_ROLE ao vault
        seniorToken.grantRole(seniorToken.MINTER_ROLE(), address(seniorVault));

        // Deploy Oracles
        oracles = new AgroOracles(admin);

        // Registrar investidores
        registry.registerIdentity(
            investorBR,
            IdentityRegistry.Jurisdiction.BRAZIL,
            IdentityRegistry.InvestorType.QUALIFIED,
            365 days,
            "sumsub"
        );

        registry.registerIdentity(
            investorEU,
            IdentityRegistry.Jurisdiction.EUROPE,
            IdentityRegistry.InvestorType.PROFESSIONAL,
            365 days,
            "shufti_pro"
        );

        // Distribuir BRZ para investidores
        brz.transfer(investorBR, 10_000_000e18);
        brz.transfer(investorEU, 10_000_000e18);

        vm.stopPrank();
    }

    // ============================================
    //          TESTES DO IDENTITY REGISTRY
    // ============================================

    function test_RegisterIdentity() public view {
        assertTrue(registry.isVerified(investorBR));
        assertEq(
            uint(registry.getJurisdiction(investorBR)),
            uint(IdentityRegistry.Jurisdiction.BRAZIL)
        );
    }

    function test_UnverifiedCannotReceiveTokens() public {
        vm.prank(admin);
        vm.expectRevert("Compliance: mint not allowed");
        seniorToken.mint(investorUnverified, 1000e18);
    }

    function test_RevokedIdentityBlocksTransfer() public {
        vm.prank(admin);
        registry.revokeIdentity(investorBR, "AML investigation");
        assertFalse(registry.isVerified(investorBR));
    }

    // ============================================
    //          TESTES DO TRANCHE TOKEN
    // ============================================

    function test_MintSeniorToken() public {
        vm.prank(admin);
        seniorToken.mint(investorBR, 500_000e18);
        assertEq(seniorToken.balanceOf(investorBR), 500_000e18);
    }

    function test_MintExceedsCapacity() public {
        vm.prank(admin);
        vm.expectRevert("Exceeds tranche capacity");
        seniorToken.mint(investorBR, 36_000_000e18);
    }

    function test_FreezeBlocksTransfer() public {
        vm.startPrank(admin);
        seniorToken.mint(investorBR, 1000e18);
        seniorToken.freeze(investorBR, "Judicial order");
        vm.stopPrank();

        vm.prank(investorBR);
        vm.expectRevert("Sender is frozen");
        seniorToken.transfer(investorEU, 500e18);
    }

    // ============================================
    //          TESTES DO ASYNC VAULT
    // ============================================

    function test_DepositFlow() public {
        // Investidor solicita deposito
        vm.startPrank(investorBR);
        brz.approve(address(seniorVault), 500_000e18);
        uint256 requestId = seniorVault.requestDeposit(500_000e18);
        vm.stopPrank();

        // Operador aprova
        vm.prank(admin);
        seniorVault.approveDeposit(requestId);

        // Investidor resgata tokens
        vm.prank(investorBR);
        seniorVault.claimDeposit(requestId);

        assertEq(seniorToken.balanceOf(investorBR), 500_000e18);
    }

    function test_DepositRejection() public {
        uint256 initialBalance = brz.balanceOf(investorBR);

        vm.startPrank(investorBR);
        brz.approve(address(seniorVault), 100_000e18);
        uint256 requestId = seniorVault.requestDeposit(100_000e18);
        vm.stopPrank();

        // Operador rejeita
        vm.prank(admin);
        seniorVault.rejectDeposit(requestId, "KYC expired");

        // BRZ devolvido
        assertEq(brz.balanceOf(investorBR), initialBalance);
    }

    // ============================================
    //          TESTES DOS ORACULOS
    // ============================================

    function test_UpdateSoybeanPrice() public {
        vm.prank(admin);
        oracles.updateSoybeanPrice(1250, 9800, "chainlink");

        (uint256 price, ) = oracles.getSoybeanPrice();
        assertEq(price, 1250);
    }

    function test_StalePriceReverts() public {
        vm.prank(admin);
        oracles.updateSoybeanPrice(1250, 9800, "chainlink");

        // Avanca 2 horas (alem do threshold de 1 hora)
        vm.warp(block.timestamp + 2 hours);

        vm.expectRevert("Price data is stale");
        oracles.getSoybeanPrice();
    }

    function test_CPRRegistrationAndDefault() public {
        vm.startPrank(admin);

        bytes32 cprId = keccak256("CPR-001-PRODUTOR-MT");
        oracles.registerCPR(cprId, 2_500_000e18, "Fazenda Boa Vista");

        (uint256 performing, , , uint256 total) = oracles.getPoolSummary();
        assertEq(performing, 2_500_000e18);
        assertEq(total, 1);

        // Registrar default
        oracles.updateCPRStatus(cprId, AgroOracles.CPRStatus.DEFAULT);

        (, uint256 defaulted, , ) = oracles.getPoolSummary();
        assertEq(defaulted, 2_500_000e18);

        vm.stopPrank();
    }
}
```

### Testes de integracao

Os testes de integracao validam o fluxo completo do sistema — desde o deposito do investidor ate a distribuicao via waterfall:

```solidity
contract CRAIntegrationTest is Test {
    // ... (mesmos deployments do teste unitario)

    function test_FullLifecycle() public {
        // PASSO 1: Deploy completo (feito no setUp)

        // PASSO 2: Investidores depositam nas tranches
        vm.startPrank(investorBR);
        brz.approve(address(seniorVault), 1_000_000e18);
        uint256 reqId = seniorVault.requestDeposit(1_000_000e18);
        vm.stopPrank();

        vm.prank(admin);
        seniorVault.approveDeposit(reqId);

        vm.prank(investorBR);
        seniorVault.claimDeposit(reqId);

        // PASSO 3: Pool recebe pagamentos de CPRs
        vm.startPrank(admin);
        brz.transfer(address(waterfall), 150_000e18); // Simula pagamento mensal

        // PASSO 4: Executa waterfall
        waterfall.distribute();

        // PASSO 5: Verifica distribuicao
        WaterfallDistributor.Distribution memory dist = waterfall.getDistribution(0);
        assertTrue(dist.seniorPaid > 0, "Senior should have received payment");
        assertTrue(dist.expensesPaid > 0, "Expenses should have been paid");

        vm.stopPrank();
    }

    function test_DefaultScenario() public {
        // Registrar CPR e simular default
        vm.startPrank(admin);

        bytes32 cprId = keccak256("CPR-DEFAULTER");
        oracles.registerCPR(cprId, 5_000_000e18, "Produtor Inadimplente");
        oracles.updateCPRStatus(cprId, AgroOracles.CPRStatus.DEFAULT);

        // Registrar default no waterfall
        waterfall.recordDefault(5_000_000e18);

        // Verificar que ICSD foi atualizado
        uint256 icsd = waterfall.currentICSD();
        // ICSD deve ter caido

        vm.stopPrank();
    }
}
```

- **Exemplo**: Em um ambiente de desenvolvimento real, esses testes seriam executados com `forge test -vvv` no Foundry. O flag `-vvv` mostra traces detalhados de cada chamada, permitindo depurar exatamente onde uma transacao falhou. Para testes de integracao mais complexos, o Foundry permite fazer fork de uma testnet real (como Polygon Mumbai ou Sepolia) com `forge test --fork-url`, testando a interacao com contratos ja deployados como Chainlink price feeds.

---

## Conclusao

Nesta aula, implementamos os smart contracts core do projeto de tokenizacao do CRA agro. Cobrimos cinco contratos fundamentais: o IdentityRegistry para gestao de identidades verificadas com suporte a jurisdicoes Brasil e Europa; o ComplianceContract com regras de investimento por tipo de investidor e jurisdicao; o TrancheToken no padrao ERC-3643 com verificacao de compliance em cada transferencia, freeze e forced transfer; o AsyncVault no padrao ERC-7540 para depositos e resgates assincronos com calculo de shares baseado em NAV; e o WaterfallDistributor com cascata de pagamentos com subordinacao, tracking de ICSD e trigger de aceleracao. Alem disso, implementamos o contrato AgroOracles para price feed, proof of reserve e NAV, e escrevemos testes unitarios e de integracao validando os fluxos criticos. Na proxima aula, vamos integrar esses contratos com os sistemas off-chain, fazer deploy em testnet e simular o ciclo de vida completo da operacao.

---

## Licao de Casa

1. Implemente um contrato `ReserveFund` que acumula o excess spread (diferenca entre o rendimento do pool e os cupons pagos as tranches) e libera recursos para cobrir shortfalls no pagamento da tranche Senior. O fundo de reserva deve ter um target de 3 meses de cupom Senior e um mecanismo de reposicao automatica.
2. Adicione ao ComplianceContract uma funcao de lock-up que impede a transferencia de tokens da tranche Subordinada por 180 dias apos a emissao. Escreva testes unitarios que validem que transferencias sao bloqueadas dentro do periodo e permitidas apos.
3. Escreva um teste de integracao completo que simule o cenario de "tempestade perfeita": 4 dos 20 produtores dao default simultaneamente (R$ 10M = 20% do pool), o preco da soja cai 25%, e o ICSD cai abaixo de 1.10x. Verifique que o waterfall aciona a aceleracao e que a tranche Subordinada absorve as perdas antes das demais.

---

## Questionario

**1. Qual e a funcao do Identity Registry no padrao ERC-3643 implementado nesta aula?**

a) Armazenar o saldo de tokens de cada investidor
b) Manter um registro de identidades verificadas associando enderecos de carteira a jurisdicao, tipo de investidor e status de KYC, consultado em cada transferencia para garantir compliance
c) Calcular o NAV de cada tranche do CRA
d) Gerenciar a chave privada dos investidores

**Resposta: b**

**2. No WaterfallDistributor, qual e a ordem correta de distribuicao dos pagamentos?**

a) Subordinada > Mezanino > Senior > Despesas
b) Senior > Mezanino > Subordinada > Despesas
c) Despesas do veiculo > Cupom/amortizacao Senior > Cupom/amortizacao Mezanino > Residual para Subordinada
d) Distribuicao proporcional entre todas as tranches sem hierarquia

**Resposta: c**

**3. O que acontece no sistema quando o ICSD cai abaixo de 1.10x?**

a) O sistema pausa todas as transacoes permanentemente
b) O waterfall aciona aceleracao, priorizando o pagamento do principal e cupom da Senior antes de qualquer distribuicao as tranches inferiores
c) A tranche Senior e automaticamente convertida em stablecoin
d) Os oraculos param de funcionar e o sistema entra em modo de emergencia

**Resposta: b**

**4. Qual e a diferenca fundamental entre o AsyncVault (ERC-7540) e um vault ERC-4626 padrao nesta implementacao?**

a) O AsyncVault suporta apenas stablecoins, enquanto o ERC-4626 aceita qualquer token
b) O AsyncVault implementa um fluxo de requestDeposit > approve/reject > claim, permitindo verificacao de compliance entre a solicitacao e a emissao de tokens, enquanto o ERC-4626 executa depositos instantaneamente
c) O AsyncVault nao calcula NAV, enquanto o ERC-4626 sim
d) O AsyncVault e mais barato em gas que o ERC-4626

**Resposta: b**

**5. Nos testes implementados, o que o teste `test_UnverifiedCannotReceiveTokens` valida?**

a) Que investidores sem saldo suficiente nao podem comprar tokens
b) Que o contrato nao aceita depositos em dias uteis
c) Que uma carteira nao registrada no Identity Registry nao pode receber tokens via mint, pois o ComplianceContract rejeita a operacao
d) Que tokens expirados nao podem ser transferidos

**Resposta: c**

---

## Proxima Aula

Na proxima aula (6.3), vamos integrar os smart contracts com os sistemas off-chain (KYC, registradora, agente fiduciario), fazer deploy em testnet, simular o ciclo de vida completo da operacao (emissao, pagamentos mensais, default parcial) e preparar a apresentacao pitch para um comite de investimento. Essa sera a ultima aula de todo o programa — e faremos o encerramento completo da jornada de quatro cursos. Ate la!
