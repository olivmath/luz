# Aula 1.1: ERC-1400 — Security Tokens com Particionamento

## Abertura

Bem-vindo ao Curso Especialista — Tokenização de Ativos Agro. Este modulo marca a transicao do entendimento conceitual para a implementacao tecnica de tokens regulados on-chain. Ate aqui, voce estudou como CPRs, CRAs e outros titulos do agronegocio funcionam no mundo financeiro tradicional. Agora, vamos mergulhar nos padroes de smart contracts que permitem representar esses instrumentos em blockchain com compliance embutido. Comecamos pelo ERC-1400, o padrao da familia Polymath que introduziu o conceito de security tokens particionados — uma arquitetura que se encaixa naturalmente na logica de tranches de um CRA ou na segregacao de safras dentro de uma CPR. Entender o ERC-1400 e seus subpadroes e o alicerce para dominar os padroes mais modernos que veremos nas proximas aulas.

### Programa da aula:

1. A familia Polymath e a arquitetura do ERC-1400
2. Aplicacao pratica em CRA com multiplas tranches
3. Comparacao com ERC-3643 e limites do ERC-1400

---

## 1. A familia Polymath e a arquitetura do ERC-1400

### O problema que o ERC-1400 resolve

O padrao ERC-20, que domina o ecossistema Ethereum, foi projetado para tokens fungíveis sem restricoes de transferencia. Qualquer endereco pode enviar tokens para qualquer outro endereco, sem verificacao de identidade, sem limites regulatorios e sem distincao entre classes de tokens dentro do mesmo contrato. Essa liberdade total e incompativel com a realidade de titulos financeiros regulados. Um CRA emitido sob a Resolucao CVM 60, por exemplo, exige que o investidor seja qualificado ou profissional, que a transferencia respeite periodos de lock-up, que diferentes tranches (senior, mezanino, subordinada) tenham regras distintas e que a documentacao legal esteja vinculada ao ativo.

O ERC-1400 foi proposto pelo time da Polymath em 2018 como uma especificacao modular para security tokens. Ele nao e um unico padrao, mas uma familia de interfaces complementares: o ERC-1400 em si define a estrutura geral; o ERC-1410 introduz o conceito de partitions (particoes); o ERC-1594 define as operacoes centrais do token (issuance, redemption, transferencia com dados); o ERC-1643 vincula documentos legais ao contrato; e o ERC-1644 habilita transferencias forcadas por agentes autorizados (como um custodiante ou regulador).

### ERC-1410: Particoes como representacao de tranches

O conceito central do ERC-1400 e a particao (partition). Diferente de um ERC-20 simples onde todos os tokens sao identicos, o ERC-1410 permite que tokens dentro do mesmo contrato pertencam a particoes distintas, cada uma com regras proprias. Uma particao e identificada por um `bytes32` e representa uma classe ou tranche do ativo.

No contexto do agronegocio, as particoes mapeiam diretamente para a estrutura de um CRA securitizado:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Particoes representando tranches de um CRA agro
bytes32 constant TRANCHE_SENIOR = keccak256("TRANCHE_SENIOR");
bytes32 constant TRANCHE_MEZANINO = keccak256("TRANCHE_MEZANINO");
bytes32 constant TRANCHE_SUBORDINADA = keccak256("TRANCHE_SUBORDINADA");

interface IERC1410 {
    // Consultar saldo por particao
    function balanceOfByPartition(
        bytes32 partition,
        address tokenHolder
    ) external view returns (uint256);

    // Transferir tokens de uma particao especifica
    function transferByPartition(
        bytes32 partition,
        address to,
        uint256 value,
        bytes calldata data
    ) external returns (bytes32);

    // Listar particoes de um holder
    function partitionsOf(
        address tokenHolder
    ) external view returns (bytes32[] memory);

    // Emitir tokens em uma particao especifica
    function issueByPartition(
        bytes32 partition,
        address tokenHolder,
        uint256 value,
        bytes calldata data
    ) external;

    // Resgatar tokens de uma particao
    function redeemByPartition(
        bytes32 partition,
        uint256 value,
        bytes calldata data
    ) external;
}
```

A funcao `transferByPartition` e o coracao do padrao. Quando um investidor transfere tokens da tranche senior de um CRA, o contrato pode aplicar regras especificas para aquela tranche — por exemplo, verificar se o destinatario e um investidor qualificado CVM, se o periodo de lock-up ja expirou e se o limite maximo de holders para aquela tranche nao foi excedido. A tranche subordinada pode ter regras ainda mais restritivas, como proibicao total de transferencia ate o vencimento.

### ERC-1643: Documentos legais vinculados on-chain

O ERC-1643 resolve um problema critico para ativos regulados: a vinculacao entre o token digital e a documentacao juridica do ativo. Em um CRA tradicional, documentos como o termo de securitizacao, o parecer juridico, o rating e o regulamento da oferta ficam arquivados na CVM e na registradora. No modelo tokenizado, o ERC-1643 permite que esses documentos sejam referenciados diretamente no smart contract, com hash de integridade e URI para acesso.

```solidity
interface IERC1643 {
    // Vincular documento ao token
    function setDocument(
        bytes32 name,
        string calldata uri,
        bytes32 documentHash
    ) external;

    // Consultar documento
    function getDocument(
        bytes32 name
    ) external view returns (string memory, bytes32, uint256);

    // Listar todos os documentos
    function getAllDocuments() external view returns (bytes32[] memory);

    // Evento emitido quando documento e atualizado
    event DocumentUpdated(
        bytes32 indexed name,
        string uri,
        bytes32 documentHash
    );
}

// Exemplo de uso para CRA agro:
// setDocument(
//     keccak256("TERMO_SECURITIZACAO"),
//     "ipfs://QmXyz.../termo_securitizacao_cra_soja_2025.pdf",
//     0xabc123...  // SHA-256 do documento
// );
//
// setDocument(
//     keccak256("LAUDO_PENHOR_SAFRA"),
//     "ipfs://QmAbc.../laudo_penhor_safra_mt_2025.pdf",
//     0xdef456...
// );
```

Isso garante que qualquer investidor pode verificar on-chain quais documentos estao vinculados ao token, acessar os arquivos via IPFS ou outro storage descentralizado e confirmar que o documento nao foi alterado comparando o hash. Para um CRA lastreado em CPRs de soja do Mato Grosso, os documentos vinculados tipicamente incluiriam: termo de securitizacao, cedulas de produto rural subjacentes, apolice de seguro rural, laudo de avaliacao de penhor de safra e parecer juridico.

### ERC-1644: Transferencias forcadas e mecanismos de recuperacao

O ERC-1644 introduz a capacidade de transferencia forcada por um controller autorizado. Embora contrario ao ethos de descentralizacao maxima, esse mecanismo e obrigatorio para compliance regulatorio. A CVM, o Banco Central e autoridades judiciais podem determinar bloqueio ou transferencia forcada de ativos em casos de fraude, lavagem de dinheiro, ordem judicial ou recuperacao de acesso perdido.

```solidity
interface IERC1644 {
    // Controller pode forcar transferencia
    function controllerTransfer(
        address from,
        address to,
        uint256 value,
        bytes calldata data,
        bytes calldata operatorData
    ) external;

    // Controller pode forcar resgate
    function controllerRedeem(
        address tokenHolder,
        uint256 value,
        bytes calldata data,
        bytes calldata operatorData
    ) external;

    // Verificar se o token e controlavel
    function isControllable() external view returns (bool);
}
```

- **Exemplo**: Imagine que um investidor de um CRA tokenizado de cafe falece sem deixar instrucoes de acesso a carteira. No modelo tradicional, o inventario judicial determina a transferencia dos titulos para os herdeiros via registradora. No modelo ERC-1400, o controller (tipicamente a securitizadora ou custodiante autorizado) executa `controllerTransfer` para mover os tokens para o endereco dos herdeiros, mediante apresentacao de ordem judicial e documentacao comprobatoria. Sem o ERC-1644, esses tokens ficariam permanentemente inacessiveis.

---

## 2. Aplicacao pratica em CRA com multiplas tranches

### Estruturando um CRA de soja tokenizado com ERC-1400

Vamos construir um exemplo completo. A cooperativa Coamo, uma das maiores cooperativas agropecuarias do Brasil com faturamento superior a R$ 30 bilhoes, decide emitir um CRA de R$ 200 milhoes lastreado em CPRs financeiras de seus cooperados produtores de soja no Parana. A estrutura do CRA tem tres tranches:

- **Tranche Senior (70%)**: R$ 140 milhoes, rating AAA, remuneracao CDI + 0,8% a.a., investidores qualificados
- **Tranche Mezanino (20%)**: R$ 40 milhoes, rating A, remuneracao CDI + 2,5% a.a., investidores profissionais
- **Tranche Subordinada (10%)**: R$ 20 milhoes, sem rating, remuneracao residual, retida pela Coamo

No modelo tokenizado com ERC-1400, cada tranche se torna uma particao do mesmo contrato. A securitizadora faz o deploy de um unico contrato `CRA_COAMO_SOJA_2025` que implementa ERC-1400:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CRACoamoSoja2025 {
    // Particoes (tranches)
    bytes32 public constant SENIOR = keccak256("SENIOR");
    bytes32 public constant MEZANINO = keccak256("MEZANINO");
    bytes32 public constant SUBORDINADA = keccak256("SUBORDINADA");

    // Regras por particao
    struct PartitionRules {
        uint256 maxHolders;        // Limite de investidores
        uint256 lockUpEnd;         // Timestamp fim do lock-up
        bool requiresQualified;    // Exige investidor qualificado CVM
        bool requiresProfessional; // Exige investidor profissional CVM
        bool transfersBlocked;     // Bloqueia transferencias totalmente
    }

    mapping(bytes32 => PartitionRules) public rules;
    mapping(bytes32 => uint256) public partitionHolderCount;
    mapping(address => bool) public isQualifiedInvestor;
    mapping(address => bool) public isProfessionalInvestor;

    constructor() {
        // Senior: ate 500 holders, lock-up 90 dias, qualificado
        rules[SENIOR] = PartitionRules({
            maxHolders: 500,
            lockUpEnd: block.timestamp + 90 days,
            requiresQualified: true,
            requiresProfessional: false,
            transfersBlocked: false
        });

        // Mezanino: ate 50 holders, lock-up 180 dias, profissional
        rules[MEZANINO] = PartitionRules({
            maxHolders: 50,
            lockUpEnd: block.timestamp + 180 days,
            requiresQualified: false,
            requiresProfessional: true,
            transfersBlocked: false
        });

        // Subordinada: sem transferencia (retida pela Coamo)
        rules[SUBORDINADA] = PartitionRules({
            maxHolders: 1,
            lockUpEnd: type(uint256).max,
            requiresQualified: false,
            requiresProfessional: false,
            transfersBlocked: true
        });
    }

    function _validateTransfer(
        bytes32 partition,
        address to
    ) internal view returns (bool) {
        PartitionRules memory r = rules[partition];

        if (r.transfersBlocked) return false;
        if (block.timestamp < r.lockUpEnd) return false;
        if (r.requiresQualified && !isQualifiedInvestor[to]) return false;
        if (r.requiresProfessional && !isProfessionalInvestor[to]) return false;
        if (partitionHolderCount[partition] >= r.maxHolders) return false;

        return true;
    }
}
```

### Waterfall de pagamentos on-chain

A logica de waterfall — onde a tranche senior recebe primeiro, depois a mezanino e por ultimo a subordinada — pode ser implementada diretamente no smart contract. Quando os pagamentos das CPRs subjacentes sao recebidos (via stablecoin como DREX ou USDC), o contrato distribui automaticamente seguindo a cascata:

```solidity
function distributePayment(uint256 totalPayment) external onlyController {
    uint256 remaining = totalPayment;

    // 1. Pagar senior primeiro
    uint256 seniorDue = calculateDue(SENIOR);
    uint256 seniorPaid = remaining >= seniorDue ? seniorDue : remaining;
    _distribute(SENIOR, seniorPaid);
    remaining -= seniorPaid;

    // 2. Pagar mezanino
    uint256 mezaninoDue = calculateDue(MEZANINO);
    uint256 mezaninoPaid = remaining >= mezaninoDue ? mezaninoDue : remaining;
    _distribute(MEZANINO, mezaninoPaid);
    remaining -= mezaninoPaid;

    // 3. Residual para subordinada
    if (remaining > 0) {
        _distribute(SUBORDINADA, remaining);
    }

    emit WaterfallExecuted(totalPayment, seniorPaid, mezaninoPaid, remaining);
}
```

- **Exemplo**: Em uma safra com quebra parcial por seca no Parana, as CPRs subjacentes geram R$ 150 milhoes em vez dos R$ 200 milhoes esperados. O waterfall on-chain garante que os R$ 140 milhoes da tranche senior sejam pagos integralmente, os R$ 10 milhoes restantes vao para a tranche mezanino (que deveria receber R$ 40 milhoes), e a tranche subordinada absorve o prejuizo total. Essa logica, que no mercado tradicional depende de agentes fiduciarios e conciliacoes manuais, e executada automaticamente pelo smart contract em uma unica transacao, com total transparencia e auditabilidade on-chain.

### Eventos de credito e gatilhos automaticos

O ERC-1400 permite implementar gatilhos automaticos para eventos de credito comuns no agro. Por exemplo, se o indice de inadimplencia das CPRs subjacentes ultrapassar 15%, o contrato pode automaticamente bloquear transferencias da tranche subordinada e ativar uma reavaliacao. Se um oraculo de precos (como Chainlink para cotacao de soja na CBOT) detectar queda de mais de 30% no preco da commodity, o contrato pode acionar um evento de aceleracao.

```solidity
// Oraculo de inadimplencia integrado
function checkDefaultTrigger() external {
    uint256 defaultRate = oracle.getDefaultRate(address(this));
    if (defaultRate > 1500) { // 15% em basis points
        rules[SUBORDINADA].transfersBlocked = true;
        rules[MEZANINO].transfersBlocked = true;
        emit CreditEvent("DEFAULT_TRIGGER", defaultRate);
    }
}
```

---

## 3. Comparacao com ERC-3643 e limites do ERC-1400

### Onde o ERC-1400 se destaca

O ERC-1400 tem vantagens claras para ativos estruturados com multiplas tranches. O sistema de particoes e nativo e elegante — cada tranche vive dentro do mesmo contrato, compartilhando a mesma base de documentos (ERC-1643), mas com regras de transferencia independentes. Isso reduz a complexidade de deploy e gestao: em vez de tres contratos separados (um para cada tranche), existe um unico contrato com tres particoes.

A Polymath, criadora do padrao, construiu um ecossistema completo ao redor do ERC-1400, incluindo a plataforma Polymesh (uma blockchain especifica para security tokens) e ferramentas de compliance. Embora a Polymesh nao tenha alcancado adocao massiva, o padrao ERC-1400 influenciou profundamente o design de todos os padroes de security tokens subsequentes.

### Onde o ERC-1400 apresenta limitacoes

O ERC-1400 tem limitacoes importantes que levaram ao surgimento de alternativas como o ERC-3643:

1. **Identidade off-chain**: O ERC-1400 nao define um padrao de identidade on-chain. A verificacao de investidor qualificado/profissional depende de um mapping centralizado no contrato (`isQualifiedInvestor`), sem interoperabilidade com outros tokens ou protocolos. Se o investidor ja passou por KYC em outra plataforma, essa verificacao nao e reaproveitavel.

2. **Compliance acoplado**: As regras de compliance estao hardcoded no contrato ou em contratos auxiliares sem interface padronizada. Cada emissor implementa sua propria logica de validacao, dificultando auditoria e padronizacao.

3. **Falta de padrao de claims**: Nao ha mecanismo nativo para atestacoes verificaveis (claims) emitidas por terceiros de confianca. No mundo regulado, um auditor ou registradora precisa atestar que determinado investidor e qualificado — o ERC-1400 nao tem interface padrao para isso.

4. **Upgradeabilidade limitada**: A especificacao original nao prescreve mecanismos de upgrade. Quando regulacoes mudam — como acontece frequentemente no mercado brasileiro — alterar as regras de compliance pode exigir migracoes complexas de tokens.

### Tabela comparativa: ERC-1400 vs ERC-3643

| Caracteristica | ERC-1400 | ERC-3643 |
|---|---|---|
| Particoes/Tranches | Nativo (ERC-1410) | Nao nativo (requer contratos separados) |
| Identidade on-chain | Nao padronizado | ONCHAINID com claims verificaveis |
| Compliance modular | Acoplado ao token | Contrato de compliance separado e modular |
| Documentos legais | ERC-1643 nativo | Nao padronizado (extensivel) |
| Transferencia forcada | ERC-1644 nativo | Nativo (agentTransfer) |
| Trusted Issuers | Nao padronizado | Registry de emissores confiáveis |
| Upgradeabilidade | Nao prescrito | UUPS proxy nativo |
| Adocao em producao | Moderada (Polymesh) | Alta (Tokeny, Securitize) |
| Melhor caso de uso | CRA multi-tranche | Token permissionado com KYC/AML |

- **Exemplo do agro**: Para tokenizar um CRA da Coamo com tres tranches e regras diferentes por tranche, o ERC-1400 e a escolha natural — as particoes mapeiam diretamente para senior/mezanino/subordinada. Porem, se a mesma Coamo quiser que os investidores de seus tokens possam ser verificados automaticamente ao investir em tokens de outras cooperativas (como Copersucar ou C.Vale) sem refazer KYC, o ERC-3643 oferece vantagem com seu sistema de identidade descentralizada e claims reutilizaveis. Na pratica, muitas implementacoes modernas combinam elementos dos dois padroes.

---

## Conclusao

Nesta aula, voce dominou a arquitetura do ERC-1400 e sua familia de subpadroes: o ERC-1410 para particionamento de tokens em tranches, o ERC-1643 para vinculacao de documentos legais on-chain, o ERC-1594 para operacoes centrais e o ERC-1644 para transferencias forcadas. Vimos como essa arquitetura se aplica naturalmente a estrutura de um CRA agro com multiplas tranches, permitindo waterfall automatizado, regras de compliance por tranche e gatilhos de eventos de credito on-chain. Finalmente, identificamos as limitacoes do ERC-1400 — especialmente a falta de identidade on-chain padronizada e compliance modular — que motivaram o surgimento do ERC-3643, tema da proxima aula.

---

## Licao de Casa

1. Implemente em Solidity um contrato ERC-1410 simplificado com tres particoes representando as tranches de um CRA lastreado em CPRs de milho. Cada particao deve ter regras de lock-up diferentes (30, 90 e 180 dias). Teste o deploy em uma testnet (Sepolia ou Amoy).

2. Pesquise a plataforma Polymesh (polymesh.network) e identifique pelo menos um caso de uso de security token em producao. Compare a abordagem da Polymesh (blockchain dedicada) com a abordagem de smart contracts em Ethereum/Polygon para tokenizacao de ativos agro. Elabore um quadro comparativo com vantagens e desvantagens de cada abordagem.

3. Analise o termo de securitizacao de um CRA real (disponivel no site da CVM ou da B3) e identifique quais clausulas poderiam ser implementadas como logica on-chain via ERC-1400 (ex: waterfall, lock-up, gatilhos de credito) e quais necessariamente permanecem off-chain (ex: execucao judicial de garantias). Documente sua analise em um quadro "on-chain vs off-chain".

---

## Questionario

**1. Qual subpadrao da familia ERC-1400 introduz o conceito de particoes (partitions) para segregar tokens em classes distintas dentro do mesmo contrato?**

a) ERC-1643, que define a interface para documentos legais vinculados ao token
b) ERC-1644, que habilita transferencias forcadas por controllers autorizados
c) ERC-1410, que permite que tokens pertencam a particoes distintas com regras proprias
d) ERC-1594, que define as operacoes centrais de emissao e resgate

**Resposta: c**

**2. Em um CRA tokenizado de soja com tres tranches via ERC-1400, como funciona o waterfall de pagamentos on-chain quando a safra gera receita inferior ao esperado?**

a) O prejuizo e dividido igualmente entre as tres tranches, pois o smart contract trata todos os holders de forma identica
b) A tranche senior recebe primeiro, depois a mezanino e por ultimo a subordinada, que absorve o prejuizo residual — executado automaticamente pelo smart contract
c) O smart contract suspende todos os pagamentos ate que a safra seguinte compense o deficit
d) A tranche subordinada recebe primeiro como compensacao pelo maior risco assumido

**Resposta: b**

**3. Qual e a funcao do ERC-1643 na arquitetura do ERC-1400 aplicada a um CRA agro tokenizado?**

a) Definir as regras de transferencia entre particoes diferentes do mesmo token
b) Permitir que o controller force transferencias em caso de ordem judicial
c) Vincular documentos legais (como termo de securitizacao e laudo de penhor de safra) ao smart contract, com hash de integridade e URI para acesso
d) Implementar o sistema de waterfall automatico para distribuicao de pagamentos entre tranches

**Resposta: c**

**4. Qual e uma limitacao estrutural do ERC-1400 que motivou o surgimento do ERC-3643?**

a) O ERC-1400 nao suporta multiplas tranches dentro do mesmo contrato
b) O ERC-1400 nao possui mecanismo de transferencia forcada para compliance regulatorio
c) O ERC-1400 nao define um padrao de identidade on-chain com claims verificaveis e reutilizaveis entre diferentes tokens
d) O ERC-1400 nao permite vinculacao de documentos legais ao smart contract

**Resposta: c**

**5. Em um cenario onde um investidor de CRA tokenizado de cafe falece sem deixar acesso a carteira, qual mecanismo do ERC-1400 permite resolver a situacao?**

a) O ERC-1410 cria automaticamente uma nova particao para os herdeiros
b) O ERC-1643 registra o obito como documento vinculado e libera os tokens
c) O ERC-1644 permite que o controller autorizado execute uma transferencia forcada para o endereco dos herdeiros, mediante ordem judicial
d) O ERC-1400 nao possui mecanismo para essa situacao, exigindo migracoes de contrato

**Resposta: c**

---

## Proxima Aula

Na Aula 1.2, vamos estudar o ERC-3643 (T-REX), o padrao que se tornou referencia de mercado para tokens permissionados. Voce vai entender a arquitetura completa — Token Contract, Identity Registry, Trusted Issuers Registry, Claim Topics, Compliance Contract e ONCHAINID — e como o fluxo de transferencia com validacao de identidade e claims resolve as limitacoes do ERC-1400 que identificamos hoje. Veremos tambem os mecanismos de forced transfer, recovery e a sequencia de deploy com upgradeabilidade via UUPS proxy.
