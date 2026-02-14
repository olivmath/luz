# Aula 4.1: Riscos Especificos de Protocolos RWA no Agronegocio

## Abertura

Bem-vindo a aula 4.1 do Modulo 4 — Seguranca, Auditoria e Governanca. Nesta aula, vamos mergulhar nos riscos especificos que afetam protocolos de tokenizacao de ativos reais (RWA) aplicados ao agronegocio brasileiro. Diferentemente de protocolos DeFi puramente on-chain — onde os riscos se concentram em vulnerabilidades de smart contracts e liquidez —, protocolos RWA introduzem uma camada adicional de complexidade: a conexao entre o mundo fisico (safras, terras, estoques) e o mundo digital (tokens, oraculos, bridges). Essa ponte entre off-chain e on-chain e exatamente o ponto onde surgem os vetores de ataque mais criticos e menos compreendidos pelo mercado. O profissional que domina esses riscos tem vantagem competitiva na construcao de protocolos resilientes e auditaveis.

### Programa da aula:

1. Vetores de ataque especificos de RWA: manipulacao de oraculo, comprometimento de trusted issuer, bridge exploits e admin key compromise
2. Anatomia de incidentes reais e licoes aprendidas no ecossistema Web3
3. Praticas de mitigacao: multisig, timelock, rate limiting, pause mechanism e defesa em profundidade

---

## 1. Vetores de Ataque Especificos de RWA

### 1.1 Manipulacao de Oraculo

Em protocolos RWA para o agronegocio, oraculos sao o elo critico entre o mundo fisico e o blockchain. Um oraculo pode fornecer dados como: preco de mercado da soja na B3, volume de estoque em armazem certificado, laudo de qualidade de graos, cotacao do dolar para conversao de CPRs denominadas em sacas, ou dados climaticos do INMET para seguros parametricos. Se o oraculo for manipulado, todo o protocolo construido sobre ele se torna vulneravel.

Existem tres categorias principais de manipulacao de oraculo:

**Flash loan oracle manipulation**: O atacante utiliza um flash loan para distorcer momentaneamente o preco de um ativo em uma DEX (como Uniswap ou PancakeSwap), e o oraculo que consulta essa DEX captura o preco manipulado. Em protocolos RWA, esse ataque e menos comum porque os precos de referencia geralmente vem de fontes off-chain (B3, CEPEA, CBOT), mas pode ocorrer quando o protocolo utiliza pools de liquidez on-chain como referencia secundaria.

**Comprometimento de fonte de dados off-chain**: O atacante compromete a API ou o sistema que alimenta o oraculo com dados do mundo real. Por exemplo, se um protocolo de tokenizacao de soja depende de uma API do CEPEA para preco de referencia, e essa API for comprometida, o oraculo publicara precos falsos no blockchain. Esse vetor e especialmente perigoso porque o smart contract nao tem como verificar a autenticidade dos dados off-chain — ele confia cegamente no oraculo.

**Oraculo centralizado com operador malicioso**: Quando o oraculo e operado por uma unica entidade (single oracle operator), essa entidade pode publicar dados falsos deliberadamente. Em protocolos RWA de agro, isso pode ocorrer quando a empresa que tokeniza o ativo tambem opera o oraculo que atesta o lastro.

```solidity
// EXEMPLO: Oraculo vulneravel a manipulacao por operador unico
contract OracleVulneravel {
    address public operator;
    uint256 public precoSoja; // preco em centavos por saca

    // Apenas o operador pode atualizar - ponto unico de falha
    function atualizarPreco(uint256 _novoPreco) external {
        require(msg.sender == operator, "Nao autorizado");
        // SEM VALIDACAO: operador pode colocar qualquer valor
        precoSoja = _novoPreco;
    }
}

// EXEMPLO: Oraculo com protecoes basicas
contract OracleProtegido {
    address public operator;
    uint256 public precoSoja;
    uint256 public ultimaAtualizacao;
    uint256 public constant MAX_DESVIO_PERCENTUAL = 10; // maximo 10% de variacao por atualizacao
    uint256 public constant MIN_INTERVALO = 1 hours;

    event PrecoAtualizado(uint256 precoAnterior, uint256 novoPreco, uint256 timestamp);
    event DesvioExcessivo(uint256 precoAnterior, uint256 precoRejeitado);

    function atualizarPreco(uint256 _novoPreco) external {
        require(msg.sender == operator, "Nao autorizado");
        require(block.timestamp >= ultimaAtualizacao + MIN_INTERVALO, "Atualizacao muito frequente");
        require(_novoPreco > 0, "Preco deve ser positivo");

        // Validacao de desvio maximo
        if (precoSoja > 0) {
            uint256 desvio = _novoPreco > precoSoja
                ? ((_novoPreco - precoSoja) * 100) / precoSoja
                : ((precoSoja - _novoPreco) * 100) / precoSoja;
            if (desvio > MAX_DESVIO_PERCENTUAL) {
                emit DesvioExcessivo(precoSoja, _novoPreco);
                revert("Desvio acima do limite permitido");
            }
        }

        emit PrecoAtualizado(precoSoja, _novoPreco, block.timestamp);
        precoSoja = _novoPreco;
        ultimaAtualizacao = block.timestamp;
    }
}
```

- **Exemplo real**: Em outubro de 2022, o protocolo Mango Markets na Solana sofreu um ataque de manipulacao de oraculo que resultou em perda de US$ 114 milhoes. O atacante inflou artificialmente o preco do token MNGO em mercados de baixa liquidez, usou a posicao inflada como colateral e tomou emprestimos massivos que nunca foram pagos. Embora nao fosse um protocolo RWA, o mecanismo de ataque e identico ao que poderia ocorrer em um protocolo de credito agro tokenizado que use precos de tokens de governanca como colateral.

### 1.2 Comprometimento de Trusted Issuer

Em protocolos RWA, o "trusted issuer" e a entidade autorizada a emitir (mintar) tokens que representam ativos reais. No contexto do agro brasileiro, o trusted issuer pode ser: a securitizadora que emite CRAs tokenizados, a cooperativa que emite CPRs digitais, o armazem que emite warrants tokenizados, ou a gestora de FIAGRO que emite cotas tokenizadas. O comprometimento do trusted issuer e o risco mais grave de um protocolo RWA porque permite a criacao de tokens sem lastro — a versao digital da fraude de duplicata fria.

Os vetores de comprometimento incluem:

**Roubo de chave privada do issuer**: Se a chave privada da carteira autorizada a mintar tokens for roubada (por phishing, malware, engenharia social ou insider malicioso), o atacante pode emitir tokens ilimitados sem lastro real.

**Conluio entre issuer e custodiante**: O issuer emite tokens alegando lastro que nao existe, em conluio com o custodiante que fornece laudos falsos. No agro, isso seria equivalente a uma securitizadora emitindo CRA tokenizado lastreado em CPRs fantasma, com laudo de armazem falsificado.

**Issuer comprometido operacionalmente**: O sistema interno do issuer e hackeado, e transacoes de mintagem sao inseridas sem aprovacao humana. Isso pode ocorrer por vulnerabilidade em sistemas ERP, APIs expostas ou credenciais de servico comprometidas.

- **Exemplo real**: No Brasil, o caso da empresa Agrosoja (2019) ilustra o risco de duplicata fria no agro tradicional: a empresa emitiu CPRs em duplicidade, usando o mesmo estoque de soja como lastro para multiplas operacoes de credito em bancos diferentes, causando prejuizo estimado em R$ 300 milhoes. Em um protocolo RWA on-chain, esse tipo de fraude seria mitigado pela transparencia do blockchain — mas apenas se o oraculo e o sistema de verificacao de lastro forem confiaveis. Se o trusted issuer controlar tanto a emissao de tokens quanto a verificacao de lastro, a fraude continua possivel.

### 1.3 Bridge Exploits

Bridges (pontes entre blockchains) sao componentes criticos em protocolos RWA que operam em multiplas redes. Um token de CRA emitido na Ethereum pode precisar ser transferido para a Polygon para reduzir custos de transacao, ou para uma chain compativel com o Drex (a CBDC brasileira) para liquidacao em moeda digital do Banco Central. Cada bridge introduz um vetor de ataque adicional.

Os principais riscos de bridges incluem:

**Vulnerabilidade no contrato de lock-and-mint**: A maioria das bridges funciona travando tokens na chain de origem e mintando tokens equivalentes na chain de destino. Se o contrato de mintagem na chain de destino for explorado, tokens podem ser criados sem que haja tokens travados na origem — gerando tokens sem lastro.

**Comprometimento de validadores da bridge**: Bridges que usam um conjunto de validadores (multisig ou MPC) para autorizar transferencias sao vulneraveis ao comprometimento desses validadores. Se a maioria dos validadores for comprometida, transferencias fraudulentas podem ser aprovadas.

**Replay attacks**: Transacoes validas em uma chain sao replicadas em outra chain sem autorizacao, potencialmente duplicando tokens.

- **Exemplo real**: O ataque ao Ronin Bridge (marco de 2022) resultou na perda de US$ 625 milhoes. Hackers do grupo Lazarus comprometeram 5 dos 9 validadores da bridge e aprovaram saques fraudulentos. Para protocolos RWA de agro que planejam operar em multiplas chains (por exemplo, Ethereum para emissao primaria e Drex para liquidacao), esse risco e concreto e deve ser mitigado com arquiteturas de bridge mais robustas.

### 1.4 Admin Key Compromise

A maioria dos protocolos RWA possui funcoes administrativas privilegiadas: pausar o contrato, atualizar a logica via proxy, adicionar ou remover enderecos da whitelist de compliance, alterar parametros do oraculo, e ajustar taxas. Essas funcoes sao necessarias para operacao e conformidade regulatoria, mas criam um alvo de alto valor para atacantes.

Os cenarios de admin key compromise incluem:

- Chave privada do owner armazenada em hot wallet comprometida
- Funcionario com acesso administrativo que age de forma maliciosa (insider threat)
- Engenharia social direcionada a membros da equipe com acesso privilegiado
- Comprometimento de hardware wallet por supply chain attack

```solidity
// EXEMPLO: Contrato com concentracao excessiva de poder administrativo
contract TokenRWA_Inseguro {
    address public admin;

    // Admin pode mintar tokens ilimitados
    function mint(address to, uint256 amount) external {
        require(msg.sender == admin);
        _mint(to, amount);
    }

    // Admin pode drenar todos os fundos
    function emergencyWithdraw(address token, uint256 amount) external {
        require(msg.sender == admin);
        IERC20(token).transfer(admin, amount);
    }

    // Admin pode mudar a logica do contrato sem aviso
    function upgradeTo(address newImplementation) external {
        require(msg.sender == admin);
        _upgradeTo(newImplementation);
    }
}
```

- **Exemplo real**: Em marco de 2023, o protocolo Euler Finance perdeu US$ 197 milhoes por uma vulnerabilidade no smart contract, mas o aspecto relevante para RWA e que a recuperacao dos fundos so foi possivel porque o atacante negociou a devolucao. Se as admin keys de um protocolo de FIAGRO tokenizado fossem comprometidas, o atacante poderia pausar o contrato, alterar enderecos de whitelist, drenar reservas e mintar tokens sem lastro — causando prejuizo irrecuperavel para cotistas.

---

## 2. Anatomia de Incidentes Reais e Licoes Aprendidas

### 2.1 Mapeamento de incidentes relevantes para RWA

O ecossistema Web3 acumulou mais de US$ 8 bilhoes em perdas por hacks, exploits e fraudes entre 2020 e 2025. Embora a maioria dos incidentes tenha ocorrido em protocolos DeFi puramente on-chain, as licoes sao diretamente aplicaveis a protocolos RWA. A tabela abaixo resume os incidentes mais relevantes e suas implicacoes para tokenizacao de ativos agro:

| Incidente | Valor Perdido | Vetor de Ataque | Relevancia para RWA Agro |
|-----------|---------------|-----------------|--------------------------|
| Ronin Bridge (2022) | US$ 625M | Comprometimento de validadores | Bridges entre Ethereum e Drex |
| Wormhole (2022) | US$ 320M | Vulnerabilidade no contrato de bridge | Tokens RWA cross-chain |
| Mango Markets (2022) | US$ 114M | Manipulacao de oraculo | Oraculos de preco de commodities |
| Cream Finance (2021) | US$ 130M | Flash loan + oraculo | Protocolos de lending com colateral RWA |
| Poly Network (2021) | US$ 611M | Vulnerabilidade em cross-chain | Interoperabilidade de tokens RWA |

### 2.2 Analise de caso: como um ataque de oraculo afetaria um protocolo de CPR tokenizada

Considere um protocolo hipotetico chamado "AgroDeFi" que tokeniza CPRs de soja. O protocolo funciona assim: (1) produtor deposita CPR fisica em custodiante autorizado, (2) trusted issuer minta tokens CPR-SOJA no blockchain, (3) tokens sao usados como colateral em um pool de lending, (4) oraculo fornece preco da soja via API do CEPEA para calcular o valor do colateral.

**Cenario de ataque**: Um atacante compromete a API do CEPEA que alimenta o oraculo (ou cria uma API falsa e redireciona o DNS). O oraculo publica um preco de soja de R$ 500 por saca (contra o preco real de R$ 130). O colateral de 1.000 tokens CPR-SOJA, que vale R$ 130.000, passa a valer R$ 500.000 no protocolo. O atacante toma emprestimos de R$ 400.000 em stablecoins contra esse colateral inflado. Quando o preco real e restaurado, o colateral vale apenas R$ 130.000, insuficiente para cobrir o emprestimo. O protocolo fica com divida irrecuperavel de R$ 270.000.

**Licoes**: (1) Nunca depender de uma unica fonte de dados para o oraculo. (2) Implementar validacao de desvio maximo (circuit breaker). (3) Usar mediana de multiplas fontes (CEPEA, B3, CBOT convertido). (4) Implementar delay entre atualizacao de oraculo e uso do novo preco em operacoes de lending.

### 2.3 Riscos especificos do contexto regulatorio brasileiro

O ambiente regulatorio brasileiro introduz riscos adicionais para protocolos RWA de agro:

**Risco de nao-conformidade com a CVM**: Se um token RWA for classificado como valor mobiliario pela CVM e o protocolo nao tiver registro adequado, todas as operacoes podem ser consideradas irregulares, gerando risco juridico para emissores e investidores.

**Risco de conflito com registro de recebiveis**: A Lei 13.775/2018 exige o registro de duplicatas e recebiveis em registradoras autorizadas (CERC, TAG, entre outras). Se CPRs tokenizadas nao forem registradas adequadamente, pode haver conflito entre o registro on-chain e o registro no sistema financeiro tradicional, gerando risco de duplicidade de cessao.

**Risco de integracao com o Drex**: O piloto do Drex (Real Digital) do Banco Central ainda esta em fase de testes. Protocolos RWA que se integrem prematuramente a infraestrutura do Drex podem enfrentar mudancas de especificacao, incompatibilidades tecnicas ou restricoes regulatorias imprevistas.

---

## 3. Praticas de Mitigacao: Defesa em Profundidade

### 3.1 Multisig (Carteiras Multi-assinatura)

A multisig e a pratica mais fundamental de seguranca para protocolos RWA. Em vez de uma unica chave privada controlando funcoes criticas, a multisig exige que multiplas partes autorizem cada transacao. Para um protocolo de tokenizacao de agro, a configuracao recomendada e:

- **Mintagem de tokens**: 3 de 5 signatarios (securitizadora, custodiante, auditor, compliance officer, representante de investidores)
- **Pause/unpause do contrato**: 2 de 3 signatarios (equipe tecnica, compliance, conselho)
- **Upgrade de contrato**: 4 de 7 signatarios (incluindo membros independentes)
- **Alteracao de parametros do oraculo**: 2 de 3 signatarios (equipe tecnica, provedor de oraculo, auditor)

```solidity
// EXEMPLO: Mintagem protegida por multisig simplificada
contract TokenRWA_Seguro {
    mapping(bytes32 => uint256) public aprovacoes;
    mapping(bytes32 => mapping(address => bool)) public jaAprovou;
    uint256 public constant APROVACOES_NECESSARIAS = 3;
    mapping(address => bool) public signatarios;

    event MintSolicitado(bytes32 indexed requestId, address to, uint256 amount);
    event MintAprovado(bytes32 indexed requestId, address signatario);
    event MintExecutado(bytes32 indexed requestId, address to, uint256 amount);

    function solicitarMint(address to, uint256 amount) external returns (bytes32) {
        require(signatarios[msg.sender], "Nao e signatario");
        bytes32 requestId = keccak256(abi.encodePacked(to, amount, block.timestamp));
        aprovacoes[requestId] = 1;
        jaAprovou[requestId][msg.sender] = true;
        emit MintSolicitado(requestId, to, amount);
        return requestId;
    }

    function aprovarMint(bytes32 requestId, address to, uint256 amount) external {
        require(signatarios[msg.sender], "Nao e signatario");
        require(!jaAprovou[requestId][msg.sender], "Ja aprovou");
        jaAprovou[requestId][msg.sender] = true;
        aprovacoes[requestId]++;
        emit MintAprovado(requestId, msg.sender);

        if (aprovacoes[requestId] >= APROVACOES_NECESSARIAS) {
            _mint(to, amount);
            emit MintExecutado(requestId, to, amount);
        }
    }
}
```

- **Exemplo pratico**: O protocolo Centrifuge, referencia em tokenizacao de RWA, utiliza multisig Gnosis Safe com configuracao 3/5 para operacoes administrativas e 4/7 para upgrades de contrato. Essa pratica e considerada padrao de mercado e deve ser adotada por qualquer protocolo de tokenizacao de agro que busque credibilidade institucional.

### 3.2 Timelock

O timelock e um mecanismo que impoe um atraso obrigatorio entre a submissao de uma transacao administrativa e sua execucao. Isso permite que a comunidade, investidores e auditores revisem mudancas criticas antes que elas entrem em vigor. Para protocolos RWA de agro, recomenda-se:

- **Upgrade de contrato**: timelock de 48 a 72 horas
- **Alteracao de parametros economicos** (taxas, limites): timelock de 24 horas
- **Adicao de novo trusted issuer**: timelock de 48 horas
- **Alteracao de oraculo**: timelock de 24 horas

```solidity
// EXEMPLO: Timelock para upgrade de contrato
contract TimelockController {
    uint256 public constant DELAY = 48 hours;

    struct Operacao {
        address alvo;
        bytes dados;
        uint256 executavelApos;
        bool executada;
    }

    mapping(bytes32 => Operacao) public operacoes;

    event OperacaoAgendada(bytes32 indexed id, address alvo, uint256 executavelApos);
    event OperacaoExecutada(bytes32 indexed id);
    event OperacaoCancelada(bytes32 indexed id);

    function agendar(address _alvo, bytes calldata _dados) external onlyAdmin returns (bytes32) {
        bytes32 id = keccak256(abi.encodePacked(_alvo, _dados, block.timestamp));
        operacoes[id] = Operacao({
            alvo: _alvo,
            dados: _dados,
            executavelApos: block.timestamp + DELAY,
            executada: false
        });
        emit OperacaoAgendada(id, _alvo, block.timestamp + DELAY);
        return id;
    }

    function executar(bytes32 _id) external onlyAdmin {
        Operacao storage op = operacoes[_id];
        require(block.timestamp >= op.executavelApos, "Timelock: ainda em espera");
        require(!op.executada, "Ja executada");
        op.executada = true;
        (bool sucesso, ) = op.alvo.call(op.dados);
        require(sucesso, "Execucao falhou");
        emit OperacaoExecutada(_id);
    }

    function cancelar(bytes32 _id) external onlyAdmin {
        require(!operacoes[_id].executada, "Ja executada");
        delete operacoes[_id];
        emit OperacaoCancelada(_id);
    }
}
```

### 3.3 Rate Limiting e Pause Mechanism

**Rate limiting** restringe a quantidade de tokens que pode ser mintada ou transferida em um determinado periodo. Isso limita o dano potencial mesmo que um atacante comprometa uma chave autorizada.

**Pause mechanism** permite interromper todas as operacoes do contrato em caso de emergencia. E o equivalente digital do "circuit breaker" do mercado financeiro.

```solidity
// EXEMPLO: Rate limiting para mintagem de tokens RWA
contract TokenRWA_RateLimited {
    uint256 public constant LIMITE_DIARIO = 1_000_000 * 1e18; // 1 milhao de tokens por dia
    uint256 public mintadoHoje;
    uint256 public diaAtual;
    bool public pausado;

    modifier quandoNaoPausado() {
        require(!pausado, "Contrato pausado");
        _;
    }

    modifier dentroDoLimite(uint256 amount) {
        if (block.timestamp / 1 days > diaAtual) {
            diaAtual = block.timestamp / 1 days;
            mintadoHoje = 0;
        }
        require(mintadoHoje + amount <= LIMITE_DIARIO, "Limite diario excedido");
        mintadoHoje += amount;
        _;
    }

    function mint(address to, uint256 amount)
        external
        onlyIssuer
        quandoNaoPausado
        dentroDoLimite(amount)
    {
        _mint(to, amount);
    }

    function pausar() external onlyEmergencyRole {
        pausado = true;
        emit Pausado(msg.sender, block.timestamp);
    }

    function despausar() external onlyAdmin {
        pausado = false;
        emit Despausado(msg.sender, block.timestamp);
    }
}
```

### 3.4 Defesa em profundidade: combinando todas as camadas

A estrategia de defesa em profundidade combina todas as praticas acima em camadas complementares. Para um protocolo de tokenizacao de FIAGRO, a arquitetura de seguranca recomendada seria:

1. **Camada 1 — Controle de acesso**: RBAC (Role-Based Access Control) com roles separados para Owner, Issuer, ComplianceOfficer, OracleUpdater e EmergencyPauser
2. **Camada 2 — Multisig**: Todas as funcoes criticas exigem multiplas assinaturas via Gnosis Safe
3. **Camada 3 — Timelock**: Operacoes de upgrade e alteracao de parametros passam por timelock de 24-72h
4. **Camada 4 — Rate limiting**: Limites diarios de mintagem proporcionais ao lastro verificado
5. **Camada 5 — Pause mechanism**: Circuit breaker acionavel por role de emergencia
6. **Camada 6 — Monitoramento**: Alertas em tempo real via Forta, OpenZeppelin Defender ou Tenderly para transacoes anomalas
7. **Camada 7 — Oraculo resiliente**: Mediana de multiplas fontes, validacao de desvio, heartbeat check

- **Exemplo pratico**: O protocolo Ondo Finance, que tokeniza titulos do Tesouro americano (US Treasuries) como RWA, implementa exatamente essa arquitetura em camadas: multisig Gnosis Safe 3/5 para operacoes, timelock de 24h para mudancas de parametros, pause mechanism para emergencias e monitoramento continuo via Forta. Qualquer protocolo de tokenizacao de agro brasileiro que busque atrair capital institucional deve adotar praticas equivalentes ou superiores.

---

## Conclusao

Nesta aula, mapeamos os quatro vetores de ataque mais criticos para protocolos RWA no agronegocio: manipulacao de oraculo, comprometimento de trusted issuer, bridge exploits e admin key compromise. Vimos que a ponte entre o mundo fisico e o digital — que e a essencia da tokenizacao de RWA — e tambem o ponto de maior vulnerabilidade. Analisamos incidentes reais do ecossistema Web3 que totalizaram bilhoes de dolares em perdas e extraimos licoes diretamente aplicaveis ao contexto de tokenizacao de ativos agro no Brasil. Finalmente, apresentamos as praticas de mitigacao — multisig, timelock, rate limiting, pause mechanism e defesa em profundidade — com exemplos de codigo Solidity e referencias a protocolos de mercado. O profissional que implementa essas praticas desde a concepcao do protocolo reduz drasticamente a superficie de ataque e constroi a base de confianca necessaria para atrair capital institucional ao agro tokenizado. Na proxima aula, veremos como auditar e certificar esses protocolos de forma sistematica.

---

## Licao de Casa

1. Analise o smart contract de um protocolo RWA de sua escolha (por exemplo, Centrifuge, Ondo Finance ou Backed Finance) no Etherscan. Identifique quais funcoes administrativas existem (mint, pause, upgrade, setOracle) e verifique se estao protegidas por multisig e timelock. Documente suas descobertas em um relatorio de 1 pagina.

2. Projete a arquitetura de oraculo para um protocolo de tokenizacao de CPRs de cafe arabica. Defina: quais dados o oraculo deve fornecer (preco, estoque, qualidade), quais fontes serao consultadas (CEPEA, B3, ICE Futures), como sera feita a agregacao (mediana, media ponderada), qual o desvio maximo aceitavel por atualizacao, e qual o heartbeat (intervalo maximo entre atualizacoes). Justifique cada decisao.

3. Escreva um smart contract em Solidity que implemente um sistema de mintagem de tokens RWA com as seguintes protecoes: (a) multisig 2/3 para aprovar mintagens, (b) rate limiting de 500.000 tokens por dia, (c) pause mechanism acionavel por qualquer signatario, e (d) evento emitido para cada operacao. Teste o contrato no Remix ou Foundry.

---

## Questionario

**1. Qual dos seguintes vetores de ataque e MAIS especifico de protocolos RWA em comparacao com protocolos DeFi puramente on-chain?**

a) Reentrancy attack no contrato de staking
b) Comprometimento do trusted issuer que permite mintagem de tokens sem lastro real
c) Front-running de transacoes em mempool publica
d) Ataque de 51% na rede Ethereum

**Resposta: b**

**2. Um protocolo de tokenizacao de soja utiliza um unico oraculo centralizado que consulta a API do CEPEA para preco de referencia. Qual e a vulnerabilidade PRINCIPAL dessa arquitetura?**

a) O CEPEA nao publica precos de soja, apenas de boi gordo
b) Oraculos centralizados sao mais lentos do que oraculos descentralizados
c) Ponto unico de falha: se a API for comprometida ou o operador agir maliciosamente, o protocolo inteiro fica vulneravel a precos falsos
d) Oraculos centralizados consomem mais gas do que oraculos descentralizados

**Resposta: c**

**3. Um protocolo RWA implementa timelock de 48 horas para upgrades de contrato. Qual e o beneficio PRINCIPAL desse mecanismo?**

a) Reduzir o custo de gas das transacoes de upgrade
b) Permitir que a comunidade, investidores e auditores revisem a mudanca antes que ela entre em vigor, possibilitando reacao em caso de upgrade malicioso
c) Garantir que o upgrade sera executado automaticamente apos 48 horas, sem necessidade de intervencao humana
d) Impedir que qualquer upgrade seja feito no contrato, tornando-o imutavel

**Resposta: b**

**4. Em um cenario de defesa em profundidade para um protocolo de FIAGRO tokenizado, qual e a ORDEM CORRETA das camadas de protecao, da mais interna para a mais externa?**

a) Monitoramento > Pause > Timelock > Multisig > RBAC
b) RBAC > Multisig > Timelock > Rate Limiting > Pause > Monitoramento
c) Pause > Rate Limiting > Monitoramento > RBAC > Multisig > Timelock
d) Timelock > RBAC > Pause > Monitoramento > Multisig > Rate Limiting

**Resposta: b**

**5. Um atacante compromete 3 das 5 chaves de uma multisig Gnosis Safe que controla a funcao de mintagem de um token de CRA. O protocolo tem rate limiting de 1 milhao de tokens por dia e timelock de 24 horas para alteracao do limite. Qual e o dano MAXIMO que o atacante pode causar no primeiro dia, e por que as camadas adicionais de seguranca limitam o impacto?**

a) Dano ilimitado, porque a multisig comprometida permite bypass de todas as outras protecoes
b) Dano maximo de 1 milhao de tokens no primeiro dia, porque o rate limiting restringe a mintagem diaria mesmo com multisig comprometida, e o atacante precisaria de mais 24 horas (timelock) para alterar o limite
c) Dano zero, porque o rate limiting impede qualquer mintagem quando a multisig e comprometida
d) Dano maximo de 5 milhoes de tokens, porque o atacante pode usar cada chave comprometida para mintar 1 milhao independentemente

**Resposta: b**

---

## Proxima Aula

Na proxima aula (4.2), vamos aprofundar o processo de auditoria e certificacao de smart contracts para protocolos RWA. Veremos como conduzir uma auditoria completa — do escopo a remediacao —, quais ferramentas utilizar (Slither, Mythril, Foundry fuzzing, Certora), como escrever testes baseados em propriedades (property-based testing) com invariantes especificas de RWA (como totalSupply <= lastro), e como estruturar programas de bug bounty e monitoramento pos-deploy. Ate la!
