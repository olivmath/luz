# Aula 4.3: Governanca de Protocolos RWA no Agronegocio

## Abertura

Bem-vindo a aula 4.3 do Modulo 4 — Seguranca, Auditoria e Governanca. Nas aulas anteriores, mapeamos os riscos especificos de protocolos RWA (aula 4.1) e aprendemos a auditar e certificar smart contracts (aula 4.2). Agora, vamos abordar a peca final do tripé de confiabilidade: a governanca. Em protocolos RWA aplicados ao agronegocio brasileiro, a governanca enfrenta um desafio unico — equilibrar a necessidade de controle centralizado (exigido pela regulacao da CVM, Banco Central e registradoras) com a transparencia e a descentralizacao que sao a promessa fundamental da Web3. Um FIAGRO tokenizado, por exemplo, precisa de um gestor autorizado pela CVM para tomar decisoes operacionais, mas tambem pode dar aos cotistas poder de voto on-chain para decisoes estrategicas. Nesta aula, vamos construir esse modelo hibrido passo a passo, com codigo Solidity, exemplos reais e procedimentos de emergencia.

### Programa da aula:

1. Modelo hibrido de governanca: centralizado para operacoes, descentralizado para decisoes estrategicas
2. RBAC avancado, timelock e multisig para protocolos RWA
3. DAO para FIAGRO, votacao por cotas e procedimentos de emergencia

---

## 1. Modelo Hibrido de Governanca

### 1.1 Por que protocolos RWA nao podem ser totalmente descentralizados

A narrativa predominante em DeFi e a descentralizacao total: protocolos sem permissao, sem admin keys, governados exclusivamente por token holders via DAO. Essa abordagem funciona para protocolos puramente on-chain (como Uniswap ou Aave), onde todos os ativos e regras existem no blockchain. Porem, protocolos RWA — especialmente os aplicados ao agronegocio brasileiro — operam em um contexto fundamentalmente diferente:

**Exigencias regulatorias**: A CVM exige que fundos de investimento (incluindo FIAGROs) tenham gestor e administrador registrados, com responsabilidades legais definidas. O Banco Central exige que operacoes com titulos do agronegocio (CPR, CRA, CDCA) sejam registradas em registradoras autorizadas. Essas exigencias pressupoe a existencia de entidades juridicas identificaveis com poder de decisao — algo incompativel com governanca puramente descentralizada e anonima.

**Dependencia de atores off-chain**: O lastro de tokens RWA depende de ativos fisicos (safras, terras, estoques em armazens). A verificacao desses ativos requer custodiantes, auditores independentes, peritos agronomos e registradoras — todos atores do mundo tradicional que operam sob contratos juridicos, nao sob smart contracts.

**Responsabilidade legal**: Em caso de fraude, perda de lastro ou inadimplencia, investidores precisam de entidades juridicas contra as quais possam exercer seus direitos. Uma DAO anonima nao oferece essa protecao juridica no ordenamento brasileiro atual.

**Velocidade de resposta**: Operacoes de agro exigem decisoes rapidas — aprovacao de novas CPRs, ajuste de limites de credito, resposta a eventos climaticos. A governanca por votacao DAO, com periodos de deliberacao de dias ou semanas, pode ser lenta demais para decisoes operacionais.

### 1.2 Arquitetura hibrida: o melhor dos dois mundos

A arquitetura de governanca recomendada para protocolos RWA de agro separa decisoes em duas categorias:

**Decisoes operacionais (centralizadas)**: Executadas pelo gestor, administrador ou equipe tecnica, com controles de seguranca (multisig, timelock, rate limiting). Incluem:
- Mintagem e burn de tokens (emissao e resgate)
- Atualizacao de oraculos e dados de lastro
- Aprovacao de KYC/AML para novos investidores
- Distribuicao de rendimentos
- Pause de emergencia
- Atualizacoes tecnicas de smart contracts (bug fixes)

**Decisoes estrategicas (descentralizadas)**: Votadas pelos holders do token (cotistas), com quorum e periodos de deliberacao definidos. Incluem:
- Alteracao da politica de investimento do FIAGRO
- Aprovacao de novas classes de ativos no pool
- Alteracao de taxas de administracao e performance
- Substituicao do gestor ou administrador
- Encerramento antecipado do fundo
- Upgrade de versao major do protocolo

```
ARQUITETURA HIBRIDA DE GOVERNANCA - FIAGRO TOKENIZADO

+-------------------------------------------------------------------+
|                    GOVERNANCA ESTRATEGICA (DAO)                    |
|  Votacao por cotas | Quorum 30% | Periodo 7 dias | Timelock 48h   |
|  Decisoes: politica de investimento, taxas, substituicao gestor   |
+-------------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------------+
|                   GOVERNANCA OPERACIONAL (RBAC)                   |
|  Multisig 3/5 | Timelock 24h | Rate Limiting | Monitoramento     |
|  Roles: Owner, Agent, ComplianceOfficer, OracleUpdater, Pauser   |
+-------------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------------+
|                     SMART CONTRACTS (On-Chain)                    |
|  Token ERC-3643 | Compliance Module | Oracle | Distribution      |
+-------------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------------+
|                    ATIVOS REAIS (Off-Chain)                       |
|  CPRs | CRAs | Estoques | Terras | Custodiante | Registradora    |
+-------------------------------------------------------------------+
```

- **Exemplo real**: O protocolo Centrifuge, referencia global em tokenizacao de RWA, adota exatamente esse modelo hibrido. O gestor de cada pool (Asset Originator) tem poderes operacionais — aprovar emprestimos, ajustar parametros de risco, atualizar dados de lastro. Porem, mudancas estruturais no protocolo (upgrades, alteracao de fees, parametros globais) passam por governanca on-chain com o token CFG. Esse modelo equilibra eficiencia operacional com transparencia e accountability.

### 1.3 Progressao de descentralizacao

Protocolos RWA devem adotar uma estrategia de descentralizacao progressiva (progressive decentralization), onde o controle centralizado e gradualmente reduzido conforme o protocolo amadurece e a comunidade se capacita:

**Fase 1 — Lancamento (0-6 meses)**: Governanca totalmente centralizada. Equipe fundadora controla todas as funcoes via multisig. Foco em estabilidade e correcao de bugs. Investidores confiam na reputacao do gestor e na auditoria.

**Fase 2 — Maturacao (6-18 meses)**: Introducao de governanca consultiva. Cotistas podem propor e votar em polls nao-vinculantes (Snapshot). Equipe mantem poder de veto e decisao final. Timelock e rate limiting implementados.

**Fase 3 — Descentralizacao parcial (18-36 meses)**: Governanca on-chain vinculante para decisoes estrategicas. Cotistas votam com poder real sobre politica de investimento, taxas e substituicao de gestor. Operacoes diarias permanecem centralizadas.

**Fase 4 — Descentralizacao avancada (36+ meses)**: Governanca minimizada. Funcoes administrativas sao progressivamente removidas ou transferidas para a DAO. Contratos tornam-se cada vez mais imutaveis. Gestao operacional e feita por agentes especializados eleitos pela DAO.

---

## 2. RBAC Avancado, Timelock e Multisig

### 2.1 Role-Based Access Control (RBAC) para protocolos RWA

RBAC e o padrao de controle de acesso onde permissoes sao atribuidas a roles (papeis), e enderecos sao atribuidos a roles. Diferentemente do modelo simplista `onlyOwner` (onde uma unica conta controla tudo), o RBAC permite separacao granular de poderes — principio fundamental de seguranca chamado "least privilege" (minimo privilegio).

Para um protocolo de FIAGRO tokenizado, os roles recomendados sao:

| Role | Responsabilidades | Controle |
|------|-------------------|----------|
| **DEFAULT_ADMIN_ROLE** | Atribuir e revogar roles | Multisig 4/7 + Timelock 72h |
| **ISSUER_ROLE** | Mintar e queimar tokens | Multisig 3/5 + Rate Limiting |
| **COMPLIANCE_ROLE** | Gerenciar whitelist/blacklist KYC | Multisig 2/3 |
| **ORACLE_ROLE** | Atualizar dados de lastro e preco | Multisig 2/3 + Desvio maximo |
| **DISTRIBUTOR_ROLE** | Distribuir rendimentos | Multisig 2/3 |
| **PAUSER_ROLE** | Pausar contrato em emergencia | Qualquer signatario (1/N) |
| **UPGRADER_ROLE** | Upgrade de contrato | Multisig 4/7 + Timelock 48h |

```solidity
// EXEMPLO: RBAC completo para token RWA de FIAGRO
// Baseado em OpenZeppelin AccessControl + extensoes customizadas

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract TokenFIAGRO is
    ERC20Upgradeable,
    AccessControlUpgradeable,
    PausableUpgradeable,
    UUPSUpgradeable
{
    // Definicao de roles
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");
    bytes32 public constant ORACLE_ROLE = keccak256("ORACLE_ROLE");
    bytes32 public constant DISTRIBUTOR_ROLE = keccak256("DISTRIBUTOR_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant UPGRADER_ROLE = keccak256("UPGRADER_ROLE");

    // Estado do protocolo
    uint256 public lastroVerificado;
    uint256 public ultimaAtualizacaoLastro;
    uint256 public mintadoHoje;
    uint256 public diaAtual;

    // Constantes de seguranca
    uint256 public constant LIMITE_DIARIO_MINT = 1_000_000 * 1e18;
    uint256 public constant HEARTBEAT_ORACULO = 24 hours;
    uint256 public constant MAX_DESVIO_LASTRO = 20; // 20%

    // Compliance
    mapping(address => bool) public kycAprovado;
    mapping(address => bool) public bloqueado;

    // Eventos
    event LastroAtualizado(uint256 valorAnterior, uint256 novoValor, address atualizador);
    event KYCAprovado(address indexed conta, address aprovador);
    event KYCRevogado(address indexed conta, address revogador);
    event ContaBloqueada(address indexed conta, address bloqueador);
    event MintExecutado(address indexed para, uint256 quantidade, address emissor);
    event BurnExecutado(address indexed de, uint256 quantidade, address emissor);

    function initialize(
        string memory nome,
        string memory simbolo,
        address admin
    ) public initializer {
        __ERC20_init(nome, simbolo);
        __AccessControl_init();
        __Pausable_init();
        __UUPSUpgradeable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(PAUSER_ROLE, admin);
    }

    // === FUNCOES DO ISSUER ===

    function mint(address para, uint256 quantidade)
        external
        onlyRole(ISSUER_ROLE)
        whenNotPaused
    {
        // Rate limiting
        if (block.timestamp / 1 days > diaAtual) {
            diaAtual = block.timestamp / 1 days;
            mintadoHoje = 0;
        }
        require(mintadoHoje + quantidade <= LIMITE_DIARIO_MINT, "Limite diario excedido");

        // Verificacao de lastro
        require(
            totalSupply() + quantidade <= lastroVerificado,
            "Mintagem excederia lastro verificado"
        );

        // Verificacao de compliance
        require(kycAprovado[para], "Destinatario sem KYC");
        require(!bloqueado[para], "Destinatario bloqueado");

        mintadoHoje += quantidade;
        _mint(para, quantidade);
        emit MintExecutado(para, quantidade, msg.sender);
    }

    function burn(address de, uint256 quantidade)
        external
        onlyRole(ISSUER_ROLE)
        whenNotPaused
    {
        _burn(de, quantidade);
        emit BurnExecutado(de, quantidade, msg.sender);
    }

    // === FUNCOES DE COMPLIANCE ===

    function aprovarKYC(address conta) external onlyRole(COMPLIANCE_ROLE) {
        require(!bloqueado[conta], "Conta esta bloqueada");
        kycAprovado[conta] = true;
        emit KYCAprovado(conta, msg.sender);
    }

    function revogarKYC(address conta) external onlyRole(COMPLIANCE_ROLE) {
        kycAprovado[conta] = false;
        emit KYCRevogado(conta, msg.sender);
    }

    function bloquearConta(address conta) external onlyRole(COMPLIANCE_ROLE) {
        bloqueado[conta] = true;
        kycAprovado[conta] = false;
        emit ContaBloqueada(conta, msg.sender);
    }

    // === FUNCOES DO ORACULO ===

    function atualizarLastro(uint256 novoValor) external onlyRole(ORACLE_ROLE) {
        // Validacao de desvio
        if (lastroVerificado > 0) {
            uint256 desvio = novoValor > lastroVerificado
                ? ((novoValor - lastroVerificado) * 100) / lastroVerificado
                : ((lastroVerificado - novoValor) * 100) / lastroVerificado;
            require(desvio <= MAX_DESVIO_LASTRO, "Desvio de lastro acima do limite");
        }

        emit LastroAtualizado(lastroVerificado, novoValor, msg.sender);
        lastroVerificado = novoValor;
        ultimaAtualizacaoLastro = block.timestamp;
    }

    // === FUNCOES DE EMERGENCIA ===

    function pausar() external onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function despausar() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    // === OVERRIDE DE TRANSFERENCIA COM COMPLIANCE ===

    function _beforeTokenTransfer(
        address de,
        address para,
        uint256 quantidade
    ) internal virtual override {
        super._beforeTokenTransfer(de, para, quantidade);

        // Mint (de == address(0)) ja verificado na funcao mint
        if (de != address(0) && para != address(0)) {
            require(kycAprovado[de], "Remetente sem KYC");
            require(kycAprovado[para], "Destinatario sem KYC");
            require(!bloqueado[de], "Remetente bloqueado");
            require(!bloqueado[para], "Destinatario bloqueado");
        }
    }

    // === UPGRADE ===

    function _authorizeUpgrade(address novaImplementacao)
        internal
        override
        onlyRole(UPGRADER_ROLE)
    {}
}
```

### 2.2 Timelock avancado com OpenZeppelin TimelockController

O OpenZeppelin TimelockController e o padrao de mercado para implementar timelocks em protocolos. Ele funciona como um intermediario: em vez de o admin executar operacoes diretamente no contrato, ele agenda a operacao no timelock, espera o periodo de delay, e entao executa. Qualquer pessoa pode monitorar as operacoes agendadas e reagir (alertar a comunidade, propor cancelamento) antes da execucao.

```solidity
// EXEMPLO: Configuracao de TimelockController para protocolo RWA
// O timelock se torna o DEFAULT_ADMIN_ROLE do TokenFIAGRO

import "@openzeppelin/contracts/governance/TimelockController.sol";

// Deploy do timelock
// proposers: multisig que pode agendar operacoes
// executors: multisig que pode executar apos o delay
// admin: address(0) significa que o timelock se auto-administra

address[] memory proposers = new address[](1);
proposers[0] = MULTISIG_OPERACIONAL; // Gnosis Safe 3/5

address[] memory executors = new address[](1);
executors[0] = MULTISIG_OPERACIONAL;

TimelockController timelock = new TimelockController(
    48 hours,    // delay minimo para operacoes
    proposers,   // quem pode propor
    executors,   // quem pode executar
    address(0)   // sem admin externo
);

// Configurar o timelock como admin do token
tokenFIAGRO.grantRole(DEFAULT_ADMIN_ROLE, address(timelock));
tokenFIAGRO.grantRole(UPGRADER_ROLE, address(timelock));

// Para executar um upgrade, o fluxo seria:
// 1. Multisig agenda no timelock: timelock.schedule(...)
// 2. 48 horas se passam (comunidade pode monitorar)
// 3. Multisig executa: timelock.execute(...)
```

### 2.3 Multisig com Gnosis Safe: configuracao para protocolo RWA

Gnosis Safe (agora Safe) e o padrao de mercado para carteiras multisig em protocolos DeFi e RWA. Para um protocolo de FIAGRO tokenizado, a configuracao recomendada utiliza multiplos Safes com diferentes limiares:

**Safe Operacional (3/5)**: Gestora, administradora, custodiante, auditor independente, representante dos cotistas. Usado para: mintagem, burn, atualizacao de oraculo, distribuicao de rendimentos.

**Safe Estrategico (4/7)**: Os 5 anteriores + 2 membros independentes (conselheiro juridico, especialista em seguranca). Usado para: upgrades, alteracao de roles, mudancas de parametros criticos.

**Safe de Emergencia (1/3)**: Qualquer dos 3 membros do comite de emergencia pode acionar individualmente. Usado exclusivamente para: pausar o contrato. A funcao de despausar requer o Safe Operacional (3/5) para evitar abuso.

- **Exemplo pratico**: Considere um FIAGRO tokenizado que gestiona R$ 500 milhoes em CPRs de soja. A mintagem de novos tokens (emissao de novas cotas) requer: (1) laudo do custodiante confirmando o lastro, (2) aprovacao do compliance officer no sistema, (3) submissao da transacao de mint ao Safe Operacional, (4) tres dos cinco signatarios confirmam a transacao, (5) a transacao e executada no smart contract com rate limiting diario de R$ 10 milhoes. Esse fluxo previne tanto o erro humano quanto o insider malicioso.

---

## 3. DAO para FIAGRO, Votacao por Cotas e Procedimentos de Emergencia

### 3.1 Governanca DAO aplicada a FIAGRO

A aplicacao de governanca DAO a FIAGROs tokenizados e uma inovacao que permite aos cotistas exercerem seus direitos de voto de forma transparente e verificavel on-chain. No modelo tradicional, assembleias de cotistas de FIAGROs sao conduzidas por procuracao, com baixa participacao e pouca transparencia. Com governanca DAO, cada cota tokenizada confere poder de voto proporcional, e as decisoes sao registradas imutavelmente no blockchain.

**Adaptacao necessaria para o contexto regulatorio brasileiro:**

A CVM, por meio da Resolucao CVM 175 (que substituiu a Instrucao CVM 555), estabelece regras para assembleias de cotistas de fundos de investimento. Para que a votacao DAO seja valida juridicamente, ela deve atender aos seguintes requisitos:

- Convocacao com antecedencia minima (geralmente 10 dias uteis)
- Informacao adequada aos cotistas sobre as materias em votacao
- Quorum minimo de instalacao (geralmente 25% das cotas)
- Quorum qualificado para materias especificas (substituicao de gestor: 50%+1; alteracao de regulamento: maioria qualificada)
- Registro da ata da assembleia

A governanca DAO on-chain pode atender todos esses requisitos, adicionando transparencia e auditabilidade:

```solidity
// EXEMPLO: Governanca DAO para FIAGRO tokenizado
// Baseado em OpenZeppelin Governor + adaptacoes regulatorias brasileiras

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorSettings.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorCountingSimple.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract GovernancaFIAGRO is
    Governor,
    GovernorSettings,
    GovernorCountingSimple,
    GovernorVotes,
    GovernorTimelockControl
{
    // Quoruns regulatorios (em basis points, 10000 = 100%)
    uint256 public constant QUORUM_PADRAO = 2500;           // 25% para materias ordinarias
    uint256 public constant QUORUM_SUBSTITUICAO_GESTOR = 5001; // 50%+1 para substituicao
    uint256 public constant QUORUM_ALTERACAO_REGULAMENTO = 6667; // 2/3 para alteracao de regulamento

    // Categorias de proposta
    enum CategoriaProposta {
        ORDINARIA,
        SUBSTITUICAO_GESTOR,
        ALTERACAO_REGULAMENTO,
        ENCERRAMENTO_FUNDO,
        ALTERACAO_TAXA
    }

    mapping(uint256 => CategoriaProposta) public categoriaDaProposta;

    constructor(
        IVotes _token,
        TimelockController _timelock
    )
        Governor("Governanca FIAGRO Agro Digital")
        GovernorSettings(
            14400,   // votingDelay: ~2 dias em blocos (equivale a 10 dias uteis com ajuste)
            50400,   // votingPeriod: ~7 dias em blocos
            100e18   // proposalThreshold: minimo 100 cotas para propor
        )
        GovernorVotes(_token)
        GovernorTimelockControl(_timelock)
    {}

    // Override de quorum baseado na categoria da proposta
    function quorum(uint256 proposalId) public view override returns (uint256) {
        CategoriaProposta categoria = categoriaDaProposta[proposalId];
        uint256 totalCotas = token().getPastTotalSupply(proposalSnapshot(proposalId));

        if (categoria == CategoriaProposta.SUBSTITUICAO_GESTOR) {
            return (totalCotas * QUORUM_SUBSTITUICAO_GESTOR) / 10000;
        } else if (categoria == CategoriaProposta.ALTERACAO_REGULAMENTO) {
            return (totalCotas * QUORUM_ALTERACAO_REGULAMENTO) / 10000;
        } else if (categoria == CategoriaProposta.ENCERRAMENTO_FUNDO) {
            return (totalCotas * QUORUM_ALTERACAO_REGULAMENTO) / 10000;
        } else {
            return (totalCotas * QUORUM_PADRAO) / 10000;
        }
    }

    // Funcao para criar proposta com categoria
    function proporComCategoria(
        address[] memory alvos,
        uint256[] memory valores,
        bytes[] memory calldatas,
        string memory descricao,
        CategoriaProposta categoria
    ) external returns (uint256) {
        uint256 proposalId = propose(alvos, valores, calldatas, descricao);
        categoriaDaProposta[proposalId] = categoria;
        return proposalId;
    }

    // Resolucao de conflitos entre extensoes do Governor
    function votingDelay() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingDelay();
    }

    function votingPeriod() public view override(IGovernor, GovernorSettings) returns (uint256) {
        return super.votingPeriod();
    }

    function proposalThreshold() public view override(Governor, GovernorSettings) returns (uint256) {
        return super.proposalThreshold();
    }

    function state(uint256 proposalId)
        public view override(Governor, GovernorTimelockControl) returns (ProposalState)
    {
        return super.state(proposalId);
    }

    function _execute(
        uint256 proposalId,
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) {
        super._execute(proposalId, targets, values, calldatas, descriptionHash);
    }

    function _cancel(
        address[] memory targets,
        uint256[] memory values,
        bytes[] memory calldatas,
        bytes32 descriptionHash
    ) internal override(Governor, GovernorTimelockControl) returns (uint256) {
        return super._cancel(targets, values, calldatas, descriptionHash);
    }

    function _executor()
        internal view override(Governor, GovernorTimelockControl) returns (address)
    {
        return super._executor();
    }

    function supportsInterface(bytes4 interfaceId)
        public view override(Governor, GovernorTimelockControl) returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

### 3.2 Votacao por cotas: mecanica e exemplos

No modelo de governanca DAO para FIAGRO, o poder de voto e diretamente proporcional a quantidade de cotas tokenizadas que o investidor possui. Isso replica o modelo tradicional de assembleia de cotistas, mas com execucao on-chain.

**Fluxo completo de uma proposta:**

1. **Criacao**: Um cotista com minimo de 100 cotas (proposalThreshold) cria uma proposta on-chain descrevendo a materia e a acao a ser executada
2. **Periodo de convocacao** (votingDelay): 2 dias para que todos os cotistas tomem conhecimento da proposta (equivalente a convocacao de assembleia)
3. **Periodo de votacao** (votingPeriod): 7 dias para que os cotistas votem (For, Against, Abstain)
4. **Apuracao**: Se o quorum minimo for atingido e a maioria votar a favor, a proposta e aprovada
5. **Timelock**: A proposta aprovada e agendada no timelock com delay de 48 horas
6. **Execucao**: Apos o delay, a proposta e executada automaticamente no smart contract

**Exemplo de votacao para alteracao de taxa de administracao:**

Imagine um FIAGRO tokenizado com 10.000 cotas distribuidas entre 200 cotistas. O gestor atual cobra taxa de administracao de 1,5% ao ano. Um grupo de cotistas propoe reduzir para 1,0%.

- **Proposta criada**: "Reduzir taxa de administracao de 1,5% para 1,0% a.a."
- **Categoria**: ALTERACAO_TAXA (quorum ordinario: 25%)
- **Votacao apos 2 dias**: 4.500 cotas votam A FAVOR (45%), 1.200 cotas votam CONTRA (12%), 800 cotas se ABSTEM (8%). Total participacao: 6.500 cotas (65%).
- **Resultado**: Quorum atingido (65% > 25%). Maioria a favor (4.500 > 1.200). Proposta APROVADA.
- **Execucao**: Apos timelock de 48h, o smart contract automaticamente atualiza a taxa de administracao para 1,0%.
- **Registro**: Toda a votacao esta registrada imutavelmente no blockchain, com transparencia total sobre quem votou e como votou.

### 3.3 Procedimentos de Emergencia

Procedimentos de emergencia sao planos predefinidos para responder a incidentes de seguranca — comprometimento de chaves, exploracao de vulnerabilidade, manipulacao de oraculo, ou eventos externos (como decisao judicial que afete o lastro). A existencia e o teste regular desses procedimentos sao o que separa protocolos profissionais de protocolos amadores.

**Procedimento de Emergencia Nivel 1 — Anomalia Detectada**

Trigger: Alerta do sistema de monitoramento (OpenZeppelin Defender, Forta) indica atividade suspeita.

Acoes:
1. Equipe de seguranca avalia o alerta em ate 15 minutos
2. Se confirmada anomalia, escala para Nivel 2
3. Se falso positivo, documenta e ajusta parametros de monitoramento

**Procedimento de Emergencia Nivel 2 — Ameaca Confirmada**

Trigger: Anomalia confirmada como potencial ataque ou vulnerabilidade ativa.

Acoes:
1. Qualquer membro do comite de emergencia (1/3) aciona PAUSE no contrato
2. Equipe tecnica investiga a causa raiz em ate 2 horas
3. Comunicacao aos cotistas via canal oficial em ate 4 horas
4. Se necessario, aciona firma de seguranca externa (Trail of Bits, Seal 911)

**Procedimento de Emergencia Nivel 3 — Incidente Critico**

Trigger: Perda confirmada de fundos, comprometimento de chave admin, ou vulnerabilidade com exploit ativo.

Acoes:
1. Contrato permanece pausado ate resolucao completa
2. Equipe juridica notifica CVM, Banco Central e registradoras conforme aplicavel
3. Postmortem detalhado em ate 72 horas
4. Plano de remediacao submetido ao Safe Estrategico (4/7)
5. Comunicacao publica com timeline de resolucao
6. Se necessario, proposta de governanca DAO para decisoes extraordinarias

```solidity
// EXEMPLO: Contrato de procedimentos de emergencia
contract EmergencyProcedures {
    // Niveis de emergencia
    enum NivelEmergencia { NORMAL, ANOMALIA, AMEACA, CRITICO }

    NivelEmergencia public nivelAtual;
    uint256 public emergenciaDeclaradaEm;
    address public declaradoPor;
    string public descricaoIncidente;

    // Comite de emergencia
    mapping(address => bool) public comiteEmergencia;
    uint256 public membrosComite;

    // Contrato do token que sera pausado
    ITokenFIAGRO public token;

    // Eventos para auditabilidade total
    event EmergenciaDeclarada(NivelEmergencia nivel, address declaradoPor, string descricao);
    event EmergenciaResolvida(NivelEmergencia nivelAnterior, address resolvidoPor);
    event AcaoEmergencialExecutada(string acao, address executadoPor);

    modifier apenasComiteEmergencia() {
        require(comiteEmergencia[msg.sender], "Nao e membro do comite");
        _;
    }

    // Qualquer membro do comite pode declarar emergencia e pausar
    function declararEmergencia(
        NivelEmergencia _nivel,
        string calldata _descricao
    ) external apenasComiteEmergencia {
        require(_nivel > NivelEmergencia.NORMAL, "Nivel invalido");
        require(uint8(_nivel) > uint8(nivelAtual), "So pode escalar nivel");

        nivelAtual = _nivel;
        emergenciaDeclaradaEm = block.timestamp;
        declaradoPor = msg.sender;
        descricaoIncidente = _descricao;

        // Nivel 2 ou superior: pausa automatica do contrato
        if (_nivel >= NivelEmergencia.AMEACA) {
            token.pausar();
            emit AcaoEmergencialExecutada("CONTRATO PAUSADO", msg.sender);
        }

        emit EmergenciaDeclarada(_nivel, msg.sender, _descricao);
    }

    // Resolucao requer multisig operacional (via Safe)
    function resolverEmergencia() external onlyRole(DEFAULT_ADMIN_ROLE) {
        NivelEmergencia nivelAnterior = nivelAtual;
        nivelAtual = NivelEmergencia.NORMAL;
        emit EmergenciaResolvida(nivelAnterior, msg.sender);
    }

    // Consulta: ha quanto tempo estamos em emergencia
    function tempoEmEmergencia() external view returns (uint256) {
        if (nivelAtual == NivelEmergencia.NORMAL) return 0;
        return block.timestamp - emergenciaDeclaradaEm;
    }
}
```

### 3.4 War games: simulacao de incidentes

War games sao exercicios periodicos onde a equipe simula cenarios de crise para testar os procedimentos de emergencia. Recomenda-se realizar war games trimestralmente, com os seguintes cenarios:

**Cenario 1 — Comprometimento de chave de issuer**: Simular que uma das 5 chaves do Safe Operacional foi comprometida. A equipe deve: (1) identificar a chave comprometida, (2) pausar o contrato via Safe de Emergencia, (3) substituir a chave no Safe usando as 4 chaves restantes, (4) verificar que nenhuma transacao fraudulenta foi executada, (5) despausar o contrato.

**Cenario 2 — Manipulacao de oraculo**: Simular que o oraculo publicou um valor de lastro 10x superior ao real. A equipe deve: (1) detectar a anomalia via monitoramento, (2) pausar o contrato, (3) investigar se houve mintagem baseada no valor falso, (4) reverter mintagens fraudulentas (se possivel via burn), (5) corrigir o oraculo, (6) despausar.

**Cenario 3 — Vulnerabilidade zero-day**: Simular que uma vulnerabilidade critica foi descoberta no contrato por um pesquisador de bug bounty. A equipe deve: (1) avaliar a severidade, (2) pausar se necessario, (3) desenvolver e testar o fix, (4) submeter para re-auditoria express, (5) agendar upgrade via timelock, (6) comunicar cotistas.

- **Exemplo real**: A MakerDAO conduz war games regulares chamados "Emergency Shutdown Drills", onde a equipe simula o acionamento do mecanismo de emergency shutdown do protocolo — que congela todas as operacoes e inicia o processo de liquidacao ordenada. Esses exercicios revelaram, em ocasioes anteriores, gaps no processo (como falta de documentacao atualizada e duvidas sobre sequencia de acoes), que foram corrigidos antes de qualquer incidente real. Para protocolos de FIAGRO tokenizado, esse nivel de disciplina operacional e essencial.

---

## Conclusao

Nesta aula, construimos o framework completo de governanca para protocolos RWA no agronegocio brasileiro. Entendemos por que a descentralizacao total nao e viavel para protocolos que operam sob regulacao da CVM e do Banco Central, e projetamos um modelo hibrido que combina eficiencia operacional centralizada com transparencia e accountability descentralizada. Implementamos RBAC avancado com seis roles especificos (Issuer, Compliance, Oracle, Distributor, Pauser, Upgrader), cada um com controles proporcionais ao seu nivel de risco. Integramos timelock e multisig como camadas de protecao para todas as operacoes criticas. Construimos um sistema de governanca DAO para FIAGRO com votacao por cotas, quoruns diferenciados por tipo de materia (conforme regulacao CVM) e execucao on-chain vinculante. Finalmente, definimos procedimentos de emergencia em tres niveis e a pratica de war games para garantir prontidao operacional. O profissional que domina esse framework esta preparado para projetar e operar protocolos RWA que inspirem confianca tanto de reguladores quanto de investidores institucionais. No proximo modulo, veremos como integrar esses protocolos com o sistema financeiro tradicional — Drex, registradoras, custodiantes e o ecossistema bancario brasileiro.

---

## Licao de Casa

1. Projete a estrutura completa de RBAC para um protocolo de tokenizacao de CRAs de cafe. Defina: quais roles existem, quais funcoes cada role pode executar, qual configuracao de multisig cada role utiliza, e qual timelock se aplica a cada tipo de operacao. Apresente em formato de tabela e justifique cada decisao com base nos riscos identificados na aula 4.1.

2. Implemente o contrato GovernancaFIAGRO (apresentado nesta aula) em um ambiente de teste (Foundry ou Hardhat). Crie uma proposta de alteracao de taxa de administracao, simule votacao com pelo menos 5 enderecos diferentes (com quantidades variadas de cotas), verifique que o quorum e atingido, e execute a proposta apos o timelock. Documente todo o fluxo com screenshots ou logs de transacao.

3. Elabore um plano de procedimentos de emergencia completo para um FIAGRO tokenizado de R$ 200 milhoes. O plano deve incluir: (a) definicao dos tres niveis de emergencia com triggers especificos, (b) acoes detalhadas para cada nivel com responsaveis e prazos, (c) templates de comunicacao para cotistas em cada nivel, (d) cronograma de war games trimestrais com cenarios, e (e) criterios de postmortem e melhoria continua.

---

## Questionario

**1. Qual e a razao PRINCIPAL pela qual protocolos RWA de agro nao podem adotar governanca totalmente descentralizada como protocolos DeFi puramente on-chain?**

a) Protocolos RWA sao tecnicamente mais simples e nao precisam de governanca sofisticada
b) A regulacao brasileira (CVM, Banco Central) exige entidades juridicas identificaveis com responsabilidades legais, e os ativos dependem de verificacao off-chain por atores do mundo tradicional
c) A governanca descentralizada e mais cara em termos de gas do que a governanca centralizada
d) Investidores de agro nao tem conhecimento tecnico para participar de votacoes DAO

**Resposta: b**

**2. Em um protocolo de FIAGRO tokenizado com RBAC, qual configuracao de controle e a MAIS ADEQUADA para a funcao de pause de emergencia?**

a) Multisig 4/7 com timelock de 48 horas, pois pause e uma funcao critica que precisa de deliberacao
b) Apenas o DEFAULT_ADMIN_ROLE pode pausar, com timelock de 24 horas
c) Qualquer membro do comite de emergencia (1/N) pode acionar individualmente, sem timelock, pois a velocidade de resposta e critica em emergencias
d) Apenas o oraculo pode acionar a pausa automaticamente, sem intervencao humana

**Resposta: c**

**3. Uma proposta de substituicao de gestor de um FIAGRO tokenizado e submetida a votacao DAO. O FIAGRO possui 10.000 cotas. 4.800 cotas votam A FAVOR, 200 cotas votam CONTRA, e 5.000 cotas nao votam. Considerando quorum de 50%+1 para substituicao de gestor, qual e o resultado?**

a) Proposta APROVADA, pois 4.800 votos a favor representam maioria absoluta entre os que votaram
b) Proposta REJEITADA, pois o quorum de 50%+1 (5.001 cotas) nao foi atingido — apenas 5.000 cotas (4.800 + 200) participaram da votacao
c) Proposta APROVADA, pois 4.800 votos a favor excedem os 200 votos contra
d) Proposta INVALIDA, pois substituicao de gestor nao pode ser decidida por votacao DAO

**Resposta: b**

**4. Durante um war game trimestral, a equipe simula o cenario de comprometimento de uma chave do Safe Operacional (3/5). Qual e a SEQUENCIA CORRETA de acoes?**

a) Substituir a chave > Pausar contrato > Investigar transacoes > Despausar
b) Investigar transacoes > Despausar > Substituir chave > Pausar contrato
c) Pausar contrato via Safe de Emergencia > Identificar chave comprometida > Substituir chave no Safe com 4 chaves restantes > Verificar transacoes > Despausar
d) Notificar CVM > Pausar contrato > Encerrar o fundo > Distribuir ativos

**Resposta: c**

**5. Um protocolo de FIAGRO tokenizado adota o modelo de descentralizacao progressiva. Na Fase 2 (Maturacao, 6-18 meses), os cotistas podem votar em polls via Snapshot, mas a equipe mantem poder de veto. Um grupo de cotistas representando 60% das cotas vota pela reducao da taxa de performance de 20% para 10%. A equipe discorda e exerce o veto. Qual e a implicacao dessa situacao para a evolucao da governanca, e por que o veto e aceitavel nesta fase?**

a) O veto e inaceitavel em qualquer fase e configura abuso de poder pela equipe
b) O veto e aceitavel nesta fase porque a governanca consultiva (nao-vinculante) e explicita, e serve como teste para a Fase 3 quando a votacao se tornara vinculante; porem, a equipe deve documentar publicamente a justificativa do veto para manter a confianca dos cotistas
c) O veto e aceitavel porque a equipe sempre tem poder absoluto sobre o protocolo, independentemente da fase
d) O veto e automaticamente invalidado quando mais de 50% das cotas votam a favor

**Resposta: b**

---

## Proxima Aula

No proximo modulo (Modulo 5 — Integracao com o Sistema Financeiro Tradicional), vamos explorar como conectar protocolos RWA de agro tokenizado com a infraestrutura financeira brasileira. Veremos a integracao com o Drex (Real Digital do Banco Central), o papel das registradoras (CERC, TAG) na validacao on-chain de recebiveis, a interoperabilidade com custodiantes e instituicoes financeiras tradicionais, e como construir pontes seguras entre o mundo DeFi e o sistema bancario. Ate la!
