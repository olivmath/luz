# Aula 1.2: ERC-3643 (T-REX) — O Padrao de Fato para Tokens Permissionados

## Abertura

Na aula anterior, voce dominou o ERC-1400 e identificou suas limitacoes: falta de identidade on-chain padronizada, compliance acoplado ao token e ausencia de claims verificaveis. O ERC-3643, tambem conhecido como T-REX (Token for Regulated EXchanges), resolve cada uma dessas limitacoes com uma arquitetura modular de seis componentes que se tornou o padrao de fato para tokens permissionados em producao. Desenvolvido pela Tokeny Solutions e adotado por players como Securitize, o ERC-3643 ja governa mais de US$ 28 bilhoes em ativos tokenizados globalmente (dados de 2025). Nesta aula, vamos dissecar cada componente da arquitetura, reconstruir o fluxo completo de transferencia com validacao de identidade, implementar mecanismos de forced transfer e recovery, e entender a sequencia de deploy com upgradeabilidade UUPS — tudo aplicado ao contexto de tokenizacao de ativos do agronegocio brasileiro.

### Programa da aula:

1. Arquitetura completa do ERC-3643: os seis componentes
2. Fluxo de transferencia com validacao de identidade e claims
3. Mecanismos avancados: forced transfer, recovery e deploy com UUPS

---

## 1. Arquitetura completa do ERC-3643: os seis componentes

### Visao geral: por que seis contratos

O ERC-3643 separa responsabilidades em seis smart contracts independentes que se comunicam entre si. Essa separacao nao e arbitraria — ela reflete a divisao de papeis no mercado financeiro regulado. O emissor do token (securitizadora) cuida do token em si. O registrador de identidades (custodiante ou plataforma KYC) cuida do cadastro de investidores. Os emissores de confianca (auditores, registradoras, CVM) atestam qualificacoes. E o contrato de compliance aplica regras regulatorias. Ao separar essas funcoes, o ERC-3643 permite que cada componente seja atualizado, substituido ou auditado independentemente.

Os seis componentes sao:

1. **Token Contract (T)**: O contrato principal do token, compativel com ERC-20, mas com transferencias condicionais
2. **Identity Registry (IR)**: Mapa entre enderecos Ethereum e identidades ONCHAINID
3. **Identity Registry Storage (IRS)**: Storage separado para persistencia de dados de identidade
4. **Trusted Issuers Registry (TIR)**: Lista de entidades autorizadas a emitir claims sobre investidores
5. **Claim Topics Registry (CTR)**: Lista de topicos de claims exigidos para operar o token
6. **Modular Compliance (MC)**: Contrato que implementa regras regulatorias modulares

### Token Contract: ERC-20 com transferencias condicionais

O Token Contract e um ERC-20 estendido. Todas as funcoes padrao (`transfer`, `transferFrom`, `balanceOf`, `approve`) existem, mas `transfer` e `transferFrom` sao interceptadas por uma verificacao de compliance antes da execucao. Se a verificacao falhar, a transferencia reverte.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract TokenT_REX is ERC20Upgradeable, UUPSUpgradeable {
    IIdentityRegistry public identityRegistry;
    IModularCompliance public compliance;
    address public owner;

    // Transferencia condicional
    function transfer(
        address to,
        uint256 amount
    ) public override returns (bool) {
        require(
            _canTransfer(msg.sender, to, amount),
            "Transfer not compliant"
        );
        bool success = super.transfer(to, amount);
        if (success) {
            compliance.transferred(msg.sender, to, amount);
        }
        return success;
    }

    function _canTransfer(
        address from,
        address to,
        uint256 amount
    ) internal view returns (bool) {
        // 1. Destinatario deve ter identidade registrada
        if (!identityRegistry.isVerified(to)) return false;

        // 2. Compliance modular deve aprovar
        if (!compliance.canTransfer(from, to, amount)) return false;

        return true;
    }

    // Mint: apenas para enderecos verificados
    function mint(address to, uint256 amount) external onlyAgent {
        require(identityRegistry.isVerified(to), "Identity not verified");
        require(
            compliance.canTransfer(address(0), to, amount),
            "Compliance check failed"
        );
        _mint(to, amount);
        compliance.created(to, amount);
    }
}
```

O ponto crucial e que nenhum token pode ser transferido para um endereco que nao esteja verificado no Identity Registry. Isso garante que todo holder de tokens esta identificado e possui os claims exigidos — uma exigencia fundamental para ativos regulados pela CVM.

### Identity Registry e ONCHAINID

O Identity Registry e o mapa que liga enderecos Ethereum a contratos de identidade ONCHAINID. O ONCHAINID e um contrato ERC-734/ERC-735 que pertence ao investidor e armazena claims (atestacoes) emitidas por terceiros de confianca.

```solidity
interface IIdentityRegistry {
    // Registrar identidade de um investidor
    function registerIdentity(
        address userAddress,
        IIdentity identity,
        uint16 investorCountry
    ) external;

    // Verificar se investidor esta compliant
    function isVerified(address userAddress) external view returns (bool);

    // Obter contrato de identidade de um endereco
    function identity(
        address userAddress
    ) external view returns (IIdentity);

    // Obter pais do investidor
    function investorCountry(
        address userAddress
    ) external view returns (uint16);
}
```

A funcao `isVerified` e a mais chamada no fluxo. Ela verifica: (1) se o endereco tem uma identidade ONCHAINID registrada, (2) se essa identidade possui claims validos para todos os topicos exigidos pelo Claim Topics Registry, e (3) se esses claims foram emitidos por emissores listados no Trusted Issuers Registry.

- **Exemplo do agro**: Um investidor pessoa fisica quer comprar tokens de um CRA de algodao tokenizado. Ele faz KYC em uma plataforma autorizada (como a Liqi ou a Vortx). A plataforma cria um contrato ONCHAINID para o investidor e emite um claim do tipo "INVESTIDOR_QUALIFICADO_CVM" (topico 10) assinado digitalmente. Esse claim fica armazenado no ONCHAINID do investidor. Quando ele tenta comprar tokens do CRA, o Token Contract consulta o Identity Registry, que consulta o ONCHAINID do investidor e verifica se existe um claim valido do topico 10 emitido por um issuer confiavel. Se sim, a transferencia e autorizada.

### Trusted Issuers Registry e Claim Topics Registry

O Trusted Issuers Registry (TIR) e o "cartorio de confianca" do ecossistema. Ele lista quais entidades estao autorizadas a emitir claims para quais topicos. Somente o owner do token (tipicamente a securitizadora ou um agente regulatorio) pode adicionar ou remover emissores confiáveis.

```solidity
interface ITrustedIssuersRegistry {
    // Adicionar emissor confiavel com topicos autorizados
    function addTrustedIssuer(
        IClaimIssuer trustedIssuer,
        uint256[] calldata claimTopics
    ) external;

    // Verificar se e emissor confiavel para um topico
    function isTrustedIssuer(
        address issuer
    ) external view returns (bool);

    // Listar topicos autorizados de um emissor
    function getTrustedIssuerClaimTopics(
        IClaimIssuer trustedIssuer
    ) external view returns (uint256[] memory);
}
```

O Claim Topics Registry (CTR) define quais topicos de claims sao obrigatorios para operar o token. Os topicos sao numeros inteiros que representam atestacoes:

```solidity
// Topicos comuns para tokens agro no Brasil
uint256 constant TOPIC_KYC = 1;                    // Know Your Customer basico
uint256 constant TOPIC_AML = 2;                    // Anti Money Laundering
uint256 constant TOPIC_ACCREDITED_INVESTOR = 3;    // Investidor acreditado
uint256 constant TOPIC_QUALIFIED_INVESTOR = 10;    // Investidor qualificado CVM
uint256 constant TOPIC_PROFESSIONAL_INVESTOR = 11; // Investidor profissional CVM
uint256 constant TOPIC_COUNTRY_ALLOWED = 20;       // Pais permitido (FATF)
uint256 constant TOPIC_TAX_RESIDENCY = 30;         // Residencia fiscal
```

Para um CRA de soja destinado a investidores qualificados brasileiros, o CTR exigiria os topicos 1 (KYC), 2 (AML) e 10 (Investidor Qualificado CVM). O TIR listaria como emissores confiaveis: a plataforma de KYC autorizada, um bureau de compliance para AML e a propria securitizadora ou custodiante para a qualificacao CVM.

### Modular Compliance: regras regulatorias como modulos

O Modular Compliance e o componente mais flexivel da arquitetura. Ele aplica regras regulatorias como modulos independentes que podem ser adicionados, removidos ou substituidos sem alterar o Token Contract. Cada modulo implementa uma interface padrao:

```solidity
interface IModule {
    // Verificar se transferencia e permitida
    function moduleTransferAction(
        address from,
        address to,
        uint256 value
    ) external;

    // Verificar pre-transferencia
    function moduleCheck(
        address from,
        address to,
        uint256 value,
        address compliance
    ) external view returns (bool);

    // Chamado apos mint
    function moduleMintAction(address to, uint256 value) external;

    // Chamado apos burn
    function moduleBurnAction(address from, uint256 value) external;
}

// Exemplo: modulo que limita numero maximo de holders
contract MaxHoldersModule is IModule {
    uint256 public maxHolders;
    uint256 public currentHolders;
    mapping(address => bool) public isHolder;

    function moduleCheck(
        address from,
        address to,
        uint256 value,
        address compliance
    ) external view override returns (bool) {
        // Se destinatario ja e holder, ok
        if (isHolder[to]) return true;
        // Se nao, verificar se limite nao foi atingido
        return currentHolders < maxHolders;
    }

    function moduleTransferAction(
        address from,
        address to,
        uint256 value
    ) external override {
        if (!isHolder[to]) {
            isHolder[to] = true;
            currentHolders++;
        }
        // Se from ficou com saldo zero, remover como holder
        if (IERC20(msg.sender).balanceOf(from) == 0) {
            isHolder[from] = false;
            currentHolders--;
        }
    }
}

// Exemplo: modulo de restricao por pais
contract CountryRestrictModule is IModule {
    mapping(uint16 => bool) public blockedCountries;
    IIdentityRegistry public identityRegistry;

    function moduleCheck(
        address from,
        address to,
        uint256 value,
        address compliance
    ) external view override returns (bool) {
        uint16 country = identityRegistry.investorCountry(to);
        return !blockedCountries[country];
    }
}
```

- **Exemplo pratico**: Um CRA de cana-de-acucar tokenizado deve cumprir: (1) maximo de 500 holders para enquadramento como oferta restrita CVM 476, (2) investidores apenas do Brasil e paises nao sancionados pelo GAFI, (3) holding minimo de R$ 50.000 por investidor. Cada regra e um modulo independente adicionado ao Compliance Contract. Se a regulacao mudar — por exemplo, a CVM alterar o limite de holders — basta substituir o modulo `MaxHoldersModule` sem tocar no Token Contract ou no Identity Registry.

---

## 2. Fluxo de transferencia com validacao de identidade e claims

### O fluxo completo passo a passo

Vamos rastrear o fluxo completo quando o Investidor A transfere 1.000 tokens de CRA de soja para o Investidor B:

**Passo 1 — Investidor A chama `transfer(enderecoB, 1000)`**

O Token Contract recebe a chamada e, antes de executar a transferencia ERC-20, inicia a cadeia de verificacao.

**Passo 2 — Token Contract consulta `identityRegistry.isVerified(enderecoB)`**

O Identity Registry executa a seguinte logica:
- Busca o contrato ONCHAINID associado ao enderecoB
- Consulta o Claim Topics Registry para obter a lista de topicos exigidos (ex: [1, 2, 10])
- Para cada topico, verifica se o ONCHAINID do Investidor B possui um claim valido
- Para cada claim encontrado, verifica no Trusted Issuers Registry se o emissor do claim e confiavel para aquele topico
- Se todos os topicos forem satisfeitos, retorna `true`

**Passo 3 — Token Contract consulta `compliance.canTransfer(enderecoA, enderecoB, 1000)`**

O Modular Compliance itera sobre todos os modulos ativos:
- `MaxHoldersModule.moduleCheck()` verifica se o limite de holders nao sera excedido
- `CountryRestrictModule.moduleCheck()` verifica se o pais do Investidor B nao e bloqueado
- `MinHoldingModule.moduleCheck()` verifica se o Investidor B tera saldo minimo apos a transferencia
- Se todos os modulos retornarem `true`, a compliance e aprovada

**Passo 4 — Transferencia executada**

O ERC-20 `_transfer` e executado, movendo 1.000 tokens de A para B. Apos a transferencia, `compliance.transferred(A, B, 1000)` e chamado para atualizar os estados internos dos modulos (ex: contagem de holders).

```
Investidor A                Token Contract              Identity Registry
    |                            |                            |
    |--- transfer(B, 1000) ---->|                            |
    |                            |--- isVerified(B) -------->|
    |                            |                            |--- getONCHAINID(B)
    |                            |                            |--- checkClaimTopics()
    |                            |                            |--- checkTrustedIssuers()
    |                            |<--- true ------------------|
    |                            |                            |
    |                            |         Modular Compliance
    |                            |--- canTransfer(A,B,1000)->|
    |                            |                            |--- maxHolders.check()
    |                            |                            |--- countryRestrict.check()
    |                            |                            |--- minHolding.check()
    |                            |<--- true ------------------|
    |                            |                            |
    |                            |--- _transfer(A, B, 1000)  |
    |                            |--- compliance.transferred()|
    |<--- success ---------------|                            |
```

### O custo de gas e otimizacoes

Esse fluxo completo envolve multiplas chamadas entre contratos, o que eleva o custo de gas. Em Ethereum mainnet, uma transferencia ERC-3643 pode custar entre 150.000 e 300.000 gas (versus ~65.000 de um ERC-20 simples). Por isso, a maioria das implementacoes de tokens agro regulados utiliza redes L2 como Polygon, Arbitrum ou redes permissionadas como a rede Drex do Banco Central.

- **Exemplo**: A Tokeny, criadora do ERC-3643, reportou em 2024 que mais de 70% dos tokens T-REX em producao estao deployados em Polygon, onde o custo de gas de uma transferencia completa com verificacao de identidade fica abaixo de US$ 0,01. Para um CRA tokenizado de soja com milhares de transferencias mensais no mercado secundario, essa economia torna o modelo viavel economicamente. Em Ethereum mainnet, o mesmo fluxo custaria entre US$ 5 e US$ 30 por transferencia, inviabilizando operacoes de varejo.

### Claims com validade temporal

Uma sofisticacao importante do ERC-3643 e que claims podem ter validade temporal. Um claim de KYC emitido em janeiro de 2025 pode ter validade ate janeiro de 2026. Apos o vencimento, o investidor precisa renovar seu KYC para continuar operando. O Identity Registry verifica a validade do claim a cada transferencia.

```solidity
// Estrutura de um claim no ONCHAINID
struct Claim {
    uint256 topic;          // Ex: 10 (Investidor Qualificado)
    uint256 scheme;         // Esquema de assinatura (ECDSA = 1)
    address issuer;         // Endereco do emissor confiavel
    bytes signature;        // Assinatura do emissor sobre os dados
    bytes data;             // Dados adicionais (ex: data de validade)
    string uri;             // URI para documentacao adicional
}

// Verificacao com validade temporal
function isClaimValid(
    IIdentity identity,
    uint256 topic
) public view returns (bool) {
    bytes32 claimId = keccak256(abi.encode(issuer, topic));
    (uint256 _topic, , address _issuer, bytes memory sig, bytes memory data, )
        = identity.getClaim(claimId);

    // Verificar assinatura do emissor
    if (!_verifySignature(_issuer, _topic, data, sig)) return false;

    // Verificar validade temporal
    uint256 expiryDate = abi.decode(data, (uint256));
    if (block.timestamp > expiryDate) return false;

    return true;
}
```

---

## 3. Mecanismos avancados: forced transfer, recovery e deploy com UUPS

### Forced Transfer: quando o regulador precisa agir

O ERC-3643 implementa `forcedTransfer` como funcao restrita a agentes autorizados. Diferente do ERC-1644 do ERC-1400, o forced transfer no T-REX bypassa todas as verificacoes de compliance e identidade — ele move tokens incondicionalmente. Isso e necessario para cumprir ordens judiciais, determinacoes da CVM, bloqueios por lavagem de dinheiro ou resolucoes do Banco Central.

```solidity
function forcedTransfer(
    address from,
    address to,
    uint256 amount
) external onlyAgent returns (bool) {
    // Bypassa compliance e identity checks
    uint256 fromBalance = balanceOf(from);
    require(fromBalance >= amount, "Insufficient balance");

    _transfer(from, to, amount);

    emit ForcedTransfer(from, to, amount, msg.sender);
    return true;
}

// Congelamento de endereco
function setAddressFrozen(
    address addr,
    bool frozen
) external onlyAgent {
    _frozen[addr] = frozen;
    emit AddressFrozen(addr, frozen, msg.sender);
}

// Congelamento parcial de saldo
function freezePartialTokens(
    address addr,
    uint256 amount
) external onlyAgent {
    _frozenTokens[addr] += amount;
    emit TokensFrozen(addr, amount);
}
```

- **Exemplo do agro**: Em 2024, o caso AgroGalaxy — empresa de distribuicao de insumos que entrou em recuperacao judicial com dividas superiores a R$ 4 bilhoes — ilustra a necessidade de forced transfer. Se os CRAs da AgroGalaxy fossem tokenizados via ERC-3643, o agente fiduciario poderia executar `forcedTransfer` para mover tokens de investidores envolvidos em operacoes suspeitas, ou `freezePartialTokens` para bloquear tokens vinculados a creditos em disputa judicial, tudo de forma transparente e auditavel on-chain.

### Recovery: recuperacao de identidade comprometida

O mecanismo de recovery e exclusivo do ERC-3643 e resolve um problema pratico frequente: o investidor perde acesso a sua carteira (chave privada roubada, hardware wallet danificada, etc.). O recovery permite que um agente autorizado transfira todos os tokens de um endereco comprometido para um novo endereco vinculado a mesma identidade ONCHAINID.

```solidity
function recoveryAddress(
    address lostWallet,
    address newWallet,
    address investorOnchainID
) external onlyAgent returns (bool) {
    // Verificar que o novo endereco esta vinculado
    // a mesma identidade ONCHAINID
    require(
        identityRegistry.identity(lostWallet) ==
        IIdentity(investorOnchainID),
        "Identity mismatch"
    );

    // Registrar novo endereco no Identity Registry
    identityRegistry.registerIdentity(
        newWallet,
        IIdentity(investorOnchainID),
        identityRegistry.investorCountry(lostWallet)
    );

    // Transferir todos os tokens
    uint256 balance = balanceOf(lostWallet);
    _transfer(lostWallet, newWallet, balance);

    // Remover endereco antigo do registry
    identityRegistry.deleteIdentity(lostWallet);

    emit RecoverySuccess(lostWallet, newWallet, investorOnchainID);
    return true;
}
```

O ponto critico e que a identidade ONCHAINID do investidor permanece a mesma — apenas o endereco Ethereum muda. Todos os claims (KYC, qualificacao CVM, AML) continuam validos, pois estao vinculados ao contrato ONCHAINID e nao ao endereco Ethereum. Isso e uma vantagem arquitetural significativa sobre o ERC-1400, onde a identidade e vinculada diretamente ao endereco.

### Deploy Sequence com UUPS Proxy

O ERC-3643 prescreve upgradeabilidade via UUPS (Universal Upgradeable Proxy Standard). Cada um dos seis componentes e deployado como um proxy UUPS, permitindo atualizacoes de logica sem alterar enderecos de contrato ou perder estado. A sequencia de deploy e critica — a ordem importa porque os contratos referenciam uns aos outros.

```solidity
// Sequencia de deploy (pseudocodigo)

// 1. Deploy dos contratos de implementacao
TrustedIssuersRegistry tirImpl = new TrustedIssuersRegistry();
ClaimTopicsRegistry ctrImpl = new ClaimTopicsRegistry();
IdentityRegistryStorage irsImpl = new IdentityRegistryStorage();
IdentityRegistry irImpl = new IdentityRegistry();
ModularCompliance mcImpl = new ModularCompliance();
Token tokenImpl = new Token();

// 2. Deploy dos proxies UUPS (na ordem correta)
ERC1967Proxy tirProxy = new ERC1967Proxy(
    address(tirImpl), ""
);
TrustedIssuersRegistry tir = TrustedIssuersRegistry(address(tirProxy));
tir.initialize();

ERC1967Proxy ctrProxy = new ERC1967Proxy(
    address(ctrImpl), ""
);
ClaimTopicsRegistry ctr = ClaimTopicsRegistry(address(ctrProxy));
ctr.initialize();

ERC1967Proxy irsProxy = new ERC1967Proxy(
    address(irsImpl), ""
);
IdentityRegistryStorage irs = IdentityRegistryStorage(address(irsProxy));
irs.initialize();

// 3. Identity Registry depende de TIR, CTR e IRS
ERC1967Proxy irProxy = new ERC1967Proxy(
    address(irImpl), ""
);
IdentityRegistry ir = IdentityRegistry(address(irProxy));
ir.initialize(address(tir), address(ctr), address(irs));

// 4. Modular Compliance (independente inicialmente)
ERC1967Proxy mcProxy = new ERC1967Proxy(
    address(mcImpl), ""
);
ModularCompliance mc = ModularCompliance(address(mcProxy));
mc.initialize();

// 5. Token depende de IR e MC
ERC1967Proxy tokenProxy = new ERC1967Proxy(
    address(tokenImpl), ""
);
Token token = Token(address(tokenProxy));
token.initialize(
    address(ir),    // Identity Registry
    address(mc),    // Modular Compliance
    "CRA Soja Coamo 2025",
    "CRA-SOJA-25",
    18,
    address(0)      // ONCHAINID do token (opcional)
);

// 6. Vincular IRS ao IR e configurar permissoes
irs.bindIdentityRegistry(address(ir));

// 7. Configurar claim topics exigidos
ctr.addClaimTopic(1);   // KYC
ctr.addClaimTopic(2);   // AML
ctr.addClaimTopic(10);  // Investidor Qualificado

// 8. Registrar emissores confiaveis
tir.addTrustedIssuer(
    IClaimIssuer(enderecoKYCProvider),
    [1, 2]   // Autorizado para KYC e AML
);
tir.addTrustedIssuer(
    IClaimIssuer(enderecoSecuritizadora),
    [10]     // Autorizado para qualificacao CVM
);

// 9. Adicionar modulos de compliance
mc.addModule(address(maxHoldersModule));
mc.addModule(address(countryRestrictModule));

// 10. Configurar agentes do token
token.addAgent(enderecoSecuritizadora);
token.addAgent(enderecoCustodiante);
```

- **Exemplo**: Para uma securitizadora que tokeniza CRAs de diferentes cooperativas agro, o deploy sequence e executado uma vez por emissao. Cada CRA tokenizado (Coamo Soja 2025, Copersucar Acucar 2025, C.Vale Milho 2025) tem seu proprio conjunto de seis contratos. Porem, o Trusted Issuers Registry e o Identity Registry Storage podem ser compartilhados entre emissoes, permitindo que um investidor que ja passou por KYC para o CRA da Coamo seja automaticamente reconhecido ao investir no CRA da Copersucar — desde que ambos usem o mesmo TIR e IRS. Essa reutilizacao de identidade e uma das maiores vantagens do ERC-3643 sobre o ERC-1400.

### Upgradeabilidade na pratica

Com UUPS, atualizar a logica de compliance e simples. Se a CVM alterar as regras para investidores qualificados (por exemplo, aumentando o patrimonio minimo de R$ 1 milhao para R$ 2 milhoes), a securitizadora faz deploy de uma nova implementacao do modulo e executa o upgrade no proxy:

```solidity
// Atualizar modulo de compliance
function upgradeModule(address newImplementation) external onlyOwner {
    // O proxy UUPS delega para a nova implementacao
    // O estado (storage) e preservado
    _authorizeUpgrade(newImplementation);
    upgradeTo(newImplementation);
}
```

O endereco do contrato permanece o mesmo, todas as referencias de outros contratos continuam validas e o estado on-chain (saldos, identidades, claims) e preservado. Essa capacidade e essencial para operar em um ambiente regulatorio dinamico como o brasileiro, onde normativos da CVM, BCB e CMN mudam com frequencia.

---

## Conclusao

Nesta aula, voce dominou a arquitetura completa do ERC-3643 (T-REX) com seus seis componentes: Token Contract, Identity Registry, Identity Registry Storage, Trusted Issuers Registry, Claim Topics Registry e Modular Compliance. Entendeu como o fluxo de transferencia encadeia verificacoes de identidade, validacao de claims e compliance modular antes de autorizar qualquer movimentacao de tokens. Aprendeu os mecanismos de forced transfer para compliance regulatorio, recovery para recuperacao de carteiras comprometidas e a sequencia correta de deploy com UUPS proxy para upgradeabilidade. O ERC-3643 resolve as limitacoes do ERC-1400 com identidade descentralizada reutilizavel, compliance modular desacoplado e mecanismos nativos de governanca — tornando-se a base tecnica mais robusta disponivel hoje para tokenizacao de ativos regulados do agronegocio brasileiro.

---

## Licao de Casa

1. Faca o deploy completo de um token ERC-3643 em testnet (Polygon Amoy ou Sepolia) utilizando os contratos de referencia do repositorio oficial (github.com/TokenySolutions/T-REX). Configure o Claim Topics Registry com topicos KYC e Investidor Qualificado, registre pelo menos dois enderecos no Identity Registry e execute transferencias entre eles. Documente cada transacao com hash e screenshots.

2. Projete a arquitetura de claims para um CRA de cafe tokenizado que precisa atender: (a) investidores qualificados CVM no Brasil, (b) investidores acreditados SEC nos EUA, (c) investidores europeus sob MiFID II. Defina os claim topics, os trusted issuers para cada jurisdicao e as regras de compliance modular necessarias. Apresente um diagrama da arquitetura.

3. Compare o custo de gas de uma transferencia ERC-3643 vs ERC-20 em Polygon mainnet. Execute ambas as transferencias em testnet, meça o gas consumido e calcule o custo estimado em USD. Discuta se o overhead de compliance justifica o custo adicional para um CRA com volume medio de 500 transferencias por mes no mercado secundario.

---

## Questionario

**1. Quantos smart contracts compoe a arquitetura completa do ERC-3643 (T-REX) e qual e a razao para essa separacao?**

a) Tres contratos (Token, Identity, Compliance), separados para reduzir o custo de deploy
b) Seis contratos (Token, Identity Registry, IRS, Trusted Issuers Registry, Claim Topics Registry, Modular Compliance), separados para refletir a divisao de papeis no mercado regulado e permitir atualizacao independente
c) Dois contratos (Token e Compliance), pois o ERC-3643 simplifica a arquitetura ao maximo
d) Quatro contratos (Token, Identity, Claims, Compliance), seguindo o modelo do ERC-1400

**Resposta: b**

**2. No fluxo de transferencia ERC-3643, qual e a sequencia correta de verificacoes antes de autorizar a movimentacao de tokens?**

a) Compliance modular primeiro, depois verificacao de saldo, por ultimo identidade
b) Verificacao de saldo primeiro, depois identidade e compliance em paralelo
c) Identity Registry verifica se o destinatario possui ONCHAINID com claims validos emitidos por trusted issuers, depois o Modular Compliance verifica regras regulatorias (max holders, pais, holding minimo)
d) O Token Contract consulta apenas o Modular Compliance, que internamente verifica identidade e regras

**Resposta: c**

**3. Qual e a principal vantagem do mecanismo de recovery do ERC-3643 sobre abordagens tradicionais de recuperacao de acesso?**

a) O recovery cria uma nova identidade ONCHAINID automaticamente para o investidor
b) O recovery transfere tokens para o novo endereco mantendo a mesma identidade ONCHAINID, preservando todos os claims (KYC, qualificacao) sem necessidade de refazer verificacoes
c) O recovery permite que qualquer holder solicite transferencia de tokens sem autorizacao de agente
d) O recovery destroi os tokens no endereco antigo e emite novos tokens no endereco novo

**Resposta: b**

**4. Por que a maioria dos tokens ERC-3643 em producao estao deployados em redes L2 como Polygon, e nao em Ethereum mainnet?**

a) Porque o ERC-3643 nao e compativel com Ethereum mainnet
b) Porque as multiplas chamadas entre contratos (Identity Registry, Compliance, Claims) elevam o custo de gas para 150.000-300.000 gas por transferencia, tornando L2s economicamente viaveis com custos abaixo de US$ 0,01 por transferencia
c) Porque o Ethereum mainnet nao suporta UUPS proxy para upgradeabilidade
d) Porque redes L2 oferecem maior privacidade para dados de identidade dos investidores

**Resposta: b**

**5. Na sequencia de deploy do ERC-3643 com UUPS proxy, por que a ordem de deploy dos contratos e critica?**

a) Porque todos os contratos precisam ser deployados em uma unica transacao atomica
b) Porque o Ethereum exige que proxies sejam deployados antes das implementacoes
c) Porque contratos como o Identity Registry dependem de referencias ao Trusted Issuers Registry, Claim Topics Registry e Identity Registry Storage, que precisam existir antes
d) Porque o UUPS proxy so funciona se todos os contratos forem deployados pelo mesmo endereco

**Resposta: c**

---

## Proxima Aula

Na Aula 1.3, vamos explorar os padroes emergentes que estao sendo propostos para superar limitacoes tanto do ERC-1400 quanto do ERC-3643. Estudaremos o ERC-7518 (DyCIST) com compliance dinamico e suporte multi-chain nativo, o EIP-7943 como interface universal modular que funciona sobre qualquer token existente, e o EIP-7493 com suas primitivas minimas de compliance. Compararemos os tres padroes e analisaremos cenarios de uso especificos para o agronegocio brasileiro — incluindo como essas propostas podem se integrar com o ecossistema Drex do Banco Central.
