# Aula 2.1: ERC-20 — Tokens Fungiveis para o Agronegocio

## Abertura

Bem-vindo a aula 2.1 do Modulo 2! Nesta aula, vamos mergulhar no padrao ERC-20, o alicerce de toda a economia de tokens fungiveis na blockchain Ethereum e em redes compativeis com a EVM (Ethereum Virtual Machine). Voce vai entender como funciona cada funcao essencial do padrao — transfer, approve, balanceOf, totalSupply —, como esse padrao se aplica diretamente a tokenizacao de ativos do agronegocio brasileiro, como CPRs financeiras fracionadas, cotas de CRA e stablecoins lastreadas em real, e como os eventos on-chain criam uma camada de auditoria transparente e imutavel que revoluciona a rastreabilidade financeira no agro.

### Programa da aula:

1. O padrao ERC-20: funcoes essenciais e anatomia do contrato (introducao)
2. Aplicacoes no agronegocio: CPR financeira, CRA fracionado e stablecoins (base e aprofundamento)
3. Eventos on-chain e auditoria transparente (conceito principal da aula)

---

## 1. O padrao ERC-20: funcoes essenciais e anatomia do contrato

### O que e um token fungivel e por que o ERC-20 importa

Um token fungivel e um ativo digital em que cada unidade e identica e intercambiavel com qualquer outra unidade do mesmo tipo. Assim como uma nota de R$ 100 e equivalente a qualquer outra nota de R$ 100, um token ERC-20 representando uma cota de CRA e identico a qualquer outra cota do mesmo CRA. Essa propriedade de fungibilidade e fundamental para criar mercados liquidos e eficientes, onde compradores e vendedores nao precisam negociar unidade por unidade.

O padrao ERC-20 foi proposto em novembro de 2015 por Fabian Vogelsteller e Vitalik Buterin na Ethereum Improvement Proposal (EIP) 20. Ele define uma interface minima que qualquer smart contract deve implementar para ser reconhecido como um token fungivel compativel com carteiras, exchanges, protocolos DeFi e qualquer outro contrato inteligente do ecossistema. Hoje, existem mais de 500.000 contratos ERC-20 implantados somente na rede Ethereum, movimentando trilhoes de dolares em valor.

- **Exemplo**: A Agrotoken, empresa argentina com operacoes no Brasil, tokenizou graos como soja, milho e trigo usando contratos baseados no padrao ERC-20. Cada token SOYA representa 1 tonelada de soja depositada em armazem certificado. Como todos os tokens SOYA sao fungiveis entre si, um produtor em Goias pode vender seus tokens a um comprador em Sao Paulo sem que nenhuma das partes precise inspecionar fisicamente os graos — o lastro e garantido pelo armazem e pelo contrato inteligente.

### As funcoes obrigatorias do ERC-20

O padrao ERC-20 define seis funcoes obrigatorias e dois eventos que todo contrato compativel deve implementar. Vamos examinar cada uma com seu significado pratico:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    // Retorna o total de tokens emitidos
    function totalSupply() external view returns (uint256);

    // Retorna o saldo de tokens de um endereco especifico
    function balanceOf(address account) external view returns (uint256);

    // Transfere tokens do chamador para outro endereco
    function transfer(address to, uint256 amount) external returns (bool);

    // Retorna quanto um spender pode gastar em nome do owner
    function allowance(address owner, address spender) external view returns (uint256);

    // Autoriza um spender a gastar ate 'amount' tokens do chamador
    function approve(address spender, uint256 amount) external returns (bool);

    // Transfere tokens em nome de outro endereco (requer approve previo)
    function transferFrom(address from, address to, uint256 amount) external returns (bool);

    // Eventos
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}
```

A funcao **totalSupply()** retorna a quantidade total de tokens em circulacao. Em um cenario de tokenizacao de CPR financeira, se uma cooperativa emitiu uma CPR de R$ 10 milhoes e fracionou em 10.000 tokens de R$ 1.000 cada, o totalSupply retornaria 10.000 (ou 10.000 * 10^18, considerando as casas decimais padrao).

A funcao **balanceOf(address)** permite consultar quantos tokens um endereco especifico possui. Um investidor pode verificar instantaneamente quantas cotas de CRA ele detem, sem depender de extrato bancario ou consulta a custodiante.

A funcao **transfer(address, uint256)** e a operacao mais basica: o detentor envia tokens diretamente para outro endereco. E o equivalente a uma transferencia bancaria, porem executada em segundos e registrada de forma imutavel na blockchain.

O par **approve/transferFrom** e mais sofisticado e habilita o modelo de delegacao. O detentor autoriza um terceiro (por exemplo, uma exchange descentralizada ou um contrato de escrow) a movimentar tokens em seu nome, ate um limite especificado. Isso e essencial para mercados secundarios automatizados.

- **Exemplo**: Um fundo FIAGRO que tokenizou cotas de CRA em formato ERC-20 permite que investidores qualificados negociem suas cotas em uma plataforma autorizada pela CVM. Quando o investidor A deseja vender 50 cotas ao investidor B, ele primeiro chama approve() autorizando o contrato da plataforma a movimentar 50 tokens. Em seguida, a plataforma executa transferFrom() para transferir os tokens do investidor A ao investidor B, simultaneamente movendo o pagamento em stablecoin BRL na direcao oposta — tudo em uma unica transacao atomica.

---

## 2. Aplicacoes no agronegocio: CPR financeira, CRA fracionado e stablecoins

### Tokenizacao de CPR financeira com ERC-20

A Cedula de Produto Rural financeira e um dos ativos mais naturais para tokenizacao via ERC-20 no agronegocio brasileiro. Uma CPR financeira representa uma obrigacao de pagamento em dinheiro, referenciada a um indice de preco de commodity (como ESALQ/CEPEA para soja), com valor determinavel e divisivel. Ao representar essa CPR como tokens ERC-20, o emissor pode fracionar o titulo em unidades menores, ampliando drasticamente a base de investidores potenciais.

Considere o cenario real: uma cooperativa no Mato Grosso emite uma CPR financeira de R$ 50 milhoes, lastreada na safra de soja 2025/2026, com vencimento em maio de 2026. Tradicionalmente, esse titulo seria adquirido integralmente por um unico banco ou fundo. Com tokenizacao ERC-20, a cooperativa pode fracionar a CPR em 50.000 tokens de R$ 1.000 cada, permitindo que investidores menores — inclusive pessoas fisicas qualificadas — participem do financiamento da safra. Cada token carrega proporcionalmente os mesmos direitos e obrigacoes: rendimento previsto, prazo de vencimento e garantia fiduciaria sobre a producao.

A MB Tokens (do grupo Mercado Bitcoin) ja realizou operacoes de tokenizacao de recebiveis do agro utilizando infraestrutura compativel com ERC-20, movimentando mais de R$ 4 bilhoes em ativos tokenizados desde 2019. A Liqi, outra tokenizadora brasileira autorizada pela CVM, tambem tokenizou CPRs e outros recebiveis agricolas com denominacoes a partir de R$ 1.000, democratizando o acesso a investimentos que antes exigiam tiquete minimo de R$ 500.000 ou mais.

```solidity
// Exemplo simplificado: Token de CPR Financeira
contract TokenCPRFinanceira is ERC20 {
    address public emissor;
    uint256 public vencimento;
    uint256 public valorTotalCPR; // em centavos de BRL

    constructor(
        string memory nome,
        string memory simbolo,
        uint256 _totalTokens,
        uint256 _vencimento
    ) ERC20(nome, simbolo) {
        emissor = msg.sender;
        vencimento = _vencimento;
        _mint(msg.sender, _totalTokens * 10**decimals());
    }

    // Funcao para resgate no vencimento
    function resgatar(uint256 quantidade) external {
        require(block.timestamp >= vencimento, "CPR ainda nao venceu");
        _burn(msg.sender, quantidade);
        // Logica de pagamento em stablecoin BRL
    }
}
```

- **Exemplo**: A cooperativa COAMO, uma das maiores do Brasil com faturamento superior a R$ 30 bilhoes, poderia tokenizar uma CPR financeira de R$ 100 milhoes em 100.000 tokens ERC-20 de R$ 1.000 cada. Investidores em uma plataforma autorizada comprariam tokens com stablecoin BRL (como o BRZ da Transfero ou o DREX futuro). No vencimento, o contrato inteligente automaticamente distribui o valor de resgate proporcional a cada detentor de token, eliminando intermediarios e reduzindo custos operacionais de liquidacao.

### Cotas de CRA fracionadas e stablecoins no ecossistema agro

O Certificado de Recebiveis do Agronegocio (CRA) e outro ativo ideal para tokenizacao ERC-20. CRAs sao titulos de credito emitidos por securitizadoras, lastreados em recebiveis do agronegocio, e negociados no mercado de capitais. Segundo dados da ANBIMA, o estoque de CRAs em circulacao ultrapassou R$ 120 bilhoes em 2024. Porem, o tiquete minimo tipico de um CRA e de R$ 1.000 a R$ 10.000 na emissao primaria, e a liquidez no mercado secundario e limitada. A tokenizacao via ERC-20 permite fracionar CRAs em unidades ainda menores e criar mercados secundarios com liquidez 24/7.

As stablecoins — tokens ERC-20 com valor atrelado a moedas fiduciarias — sao a contrapartida monetaria essencial desse ecossistema. No Brasil, as principais stablecoins sao o BRZ (emitido pela Transfero, pareado 1:1 com o real, com mais de R$ 2 bilhoes em circulacao), o USDC (dolar tokenizado da Circle, amplamente utilizado em operacoes internacionais) e o USDT (Tether). O Banco Central do Brasil esta desenvolvendo o DREX (Real Digital), que funcionara como uma CBDC e podera interagir com tokens ERC-20 em redes autorizadas, criando uma ponte direta entre o sistema financeiro tradicional e a economia tokenizada do agro.

A combinacao CPR tokenizada + stablecoin BRL cria um circuito financeiro completo: o investidor compra tokens de CPR pagando em BRZ, recebe rendimento no vencimento em BRZ, e pode converter para reais em conta bancaria via exchange regulada. Todo o fluxo e rastreavel on-chain, auditavel em tempo real e executavel sem intermediarios tradicionais como bancos custodiantes.

- **Exemplo**: A securitizadora Eco Securitizadora emite um CRA de R$ 200 milhoes lastreado em CPRs de produtores de cafe do Cerrado Mineiro. Tradicionalmente, esse CRA seria distribuido para 20 investidores institucionais com tiquete medio de R$ 10 milhoes. Com tokenizacao ERC-20, o CRA e fracionado em 200.000 tokens de R$ 1.000, permitindo que milhares de investidores participem. Um cafeicultor de Patrocinio (MG) com excedente de caixa pode, ele proprio, investir R$ 50.000 em tokens de CRA lastreado na safra de cafe da regiao vizinha — uma circularidade financeira que fortalece toda a cadeia.

---

## 3. Eventos on-chain e auditoria transparente

### O papel dos eventos Transfer e Approval

Os eventos sao um dos recursos mais poderosos do padrao ERC-20 para fins de auditoria e compliance. Quando um evento e emitido por um contrato inteligente, ele e registrado permanentemente no log da transacao na blockchain, indexavel e consultavel por qualquer pessoa ou sistema. Os dois eventos obrigatorios do ERC-20 sao:

**Transfer(address indexed from, address indexed to, uint256 value)**: emitido toda vez que tokens sao movimentados, incluindo emissao (from = endereco zero) e queima (to = endereco zero). Cada movimentacao de cotas de CRA tokenizado, por exemplo, gera um registro Transfer que permite reconstruir todo o historico de propriedade do titulo, desde a emissao ate o resgate.

**Approval(address indexed owner, address indexed spender, uint256 value)**: emitido toda vez que um detentor autoriza ou revoga autorizacao para um terceiro movimentar tokens em seu nome. Esse evento e crucial para auditoria de compliance, pois permite verificar quais autorizacoes estao ativas, quem tem permissao para negociar tokens e quais contratos inteligentes foram habilitados como intermediarios.

A importancia desses eventos vai alem da transparencia tecnica. A CVM, ao regular ofertas de tokens de valores mobiliarios (Parecer de Orientacao CVM 40/2022), reconhece que a rastreabilidade on-chain pode complementar — e em alguns casos substituir — mecanismos tradicionais de registro e custodia, desde que o sistema offereca garantias equivalentes de integridade e auditabilidade.

- **Exemplo**: Um auditor da CVM investiga uma emissao de tokens de CRA para verificar se houve venda a investidores nao qualificados. Utilizando um explorer de blockchain (como Etherscan ou equivalente em rede permissionada), o auditor consulta todos os eventos Transfer emitidos pelo contrato do CRA tokenizado. Em minutos, ele identifica todos os enderecos que receberam tokens, cruza com a lista de investidores qualificados registrada pelo emissor, e verifica se alguma transferencia irregular ocorreu. Esse processo, que no sistema tradicional levaria semanas de analise de extratos e relatorios, e realizado em tempo real com dados imutaveis.

### Auditoria on-chain aplicada ao agro brasileiro

A auditoria on-chain via eventos ERC-20 resolve problemas historicos do mercado de credito agro brasileiro. O primeiro e a duplicidade de garantias: produtores que emitiam CPRs para diferentes credores usando a mesma producao como lastro. Com tokens ERC-20 e eventos Transfer registrados em blockchain, cada movimentacao e publica e verificavel, tornando impossivel a emissao duplicada sem deteccao imediata.

O segundo problema e a falta de transparencia na cadeia de cessao de titulos. Uma CPR pode ser cedida diversas vezes — do produtor ao banco, do banco ao fundo, do fundo a securitizadora — e no sistema tradicional, cada cessao depende de registro manual em cartorio ou em sistemas eletronicos nem sempre interoperaveis. Com ERC-20, cada cessao e uma transacao Transfer registrada automaticamente, criando um historico completo e imutavel de todos os titulares do ativo.

O terceiro problema e o monitoramento em tempo real do portfolio. Gestores de FIAGROs com centenas de CPRs no portfolio precisam monitorar constantemente a situacao de cada titulo. Com eventos on-chain, e possivel construir dashboards automatizados que alertam sobre movimentacoes anomalas, concentracoes de risco e vencimentos proximos, sem depender de relatorios manuais produzidos por custodiantes.

```solidity
// Exemplo: evento customizado para auditoria agro
contract TokenCPRAuditavel is ERC20 {
    event CPRRegistrada(
        uint256 indexed tokenId,
        address indexed emissor,
        uint256 valorBRL,
        string codigoCPR,
        uint256 dataVencimento
    );

    event GarantiaVerificada(
        uint256 indexed tokenId,
        string hashDocumento,
        uint256 timestamp
    );

    // Alem dos eventos padrao Transfer e Approval,
    // eventos customizados ampliam a rastreabilidade
}
```

Empresas como a Parfin (infraestrutura blockchain para instituicoes financeiras no Brasil) e a Vortx QR Tokenizadora ja utilizam eventos on-chain em suas plataformas de tokenizacao de ativos do agro, integrando a rastreabilidade blockchain com os requisitos regulatorios da CVM e do Banco Central. A tendencia e que o DREX (Real Digital) amplifique essa integracao, criando uma infraestrutura unificada onde stablecoins, tokens de ativos agro e registros de garantias coexistam em um ambiente regulado e auditavel.

- **Exemplo**: A Vortx QR Tokenizadora, em parceria com uma securitizadora, emite tokens ERC-20 representando cotas de um CRA de R$ 80 milhoes lastreado em CPRs de produtores de milho do Parana. O contrato inteligente emite eventos customizados para cada CPR registrada como lastro (CPRRegistrada), para cada verificacao de garantia (GarantiaVerificada) e para cada pagamento recebido (PagamentoRecebido). O auditor independente do CRA consulta esses eventos trimestralmente e produz relatorio de conformidade que atende aos requisitos da Instrucao CVM 600 para securitizacao. O custo de auditoria cai 60% em relacao ao processo manual tradicional, e o tempo de producao do relatorio cai de 30 dias para 3 dias.

---

## Conclusao

Nesta aula, construimos o entendimento completo do padrao ERC-20 aplicado ao agronegocio brasileiro. Primeiro, dominamos a anatomia do contrato — totalSupply, balanceOf, transfer, approve, transferFrom — compreendendo que essas seis funcoes formam a base de toda a economia de tokens fungiveis. Segundo, exploramos aplicacoes concretas no agro: tokenizacao de CPRs financeiras que democratizam o acesso ao financiamento da safra, fracionamento de CRAs que amplia a base de investidores, e stablecoins (BRZ, USDC, futuro DREX) que criam o meio de pagamento nativo para esse ecossistema. Terceiro, entendemos como os eventos Transfer e Approval criam uma camada de auditoria on-chain que resolve problemas historicos do credito agro — duplicidade de garantias, falta de rastreabilidade e custos elevados de compliance. O ERC-20 e o padrao fundamental, mas nem todos os ativos do agro sao fungiveis. Na proxima aula, veremos como o ERC-721 representa ativos unicos e irrepettiveis.

---

## Licao de Casa

1. Acesse o Etherscan (etherscan.io) e localize o contrato do token BRZ (stablecoin brasileira). Analise as funcoes do contrato e identifique quais funcoes do padrao ERC-20 estao implementadas. Liste pelo menos 3 eventos Transfer recentes e descreva o que cada um representa.
2. Pesquise no site da CVM o Parecer de Orientacao 40/2022 sobre criptoativos e tokens de valores mobiliarios. Resuma em 15 linhas como a CVM trata a tokenizacao de recebiveis do agronegocio e quais requisitos regulatorios se aplicam.
3. Elabore um diagrama (pode ser em texto) mostrando o fluxo completo de tokenizacao de uma CPR financeira de R$ 10 milhoes em tokens ERC-20: desde a emissao pela cooperativa, passando pelo deploy do contrato, distribuicao aos investidores, ate o resgate no vencimento. Identifique em quais etapas as funcoes transfer, approve e transferFrom sao utilizadas.

---

## Questionario

**1. Qual funcao do padrao ERC-20 permite que um investidor consulte quantos tokens de CPR ele possui em sua carteira?**

a) totalSupply()
b) transfer()
c) balanceOf()
d) approve()

**Resposta: c**

**2. No modelo approve/transferFrom do ERC-20, qual e a funcao pratica da autorizacao (approve) no contexto de negociacao de tokens de CRA em mercado secundario?**

a) Permite que o emissor do CRA cancele a emissao a qualquer momento
b) Autoriza um contrato intermediario (como uma exchange) a movimentar tokens em nome do detentor, ate um limite especificado
c) Transfere automaticamente a propriedade dos tokens para o comprador sem necessidade de confirmacao
d) Bloqueia os tokens para impedir qualquer transferencia ate o vencimento do CRA

**Resposta: b**

**3. Por que a tokenizacao de CPR financeira via ERC-20 e considerada mais eficiente que a distribuicao tradicional para financiamento da safra?**

a) Porque elimina completamente a necessidade de garantias reais sobre a producao
b) Porque permite fracionar o titulo em unidades menores, ampliando a base de investidores e reduzindo custos de intermediacao
c) Porque dispensa o registro em entidades autorizadas pelo Banco Central
d) Porque transfere automaticamente a propriedade da terra ao investidor em caso de inadimplencia

**Resposta: b**

**4. Qual evento do padrao ERC-20 e emitido automaticamente a cada movimentacao de tokens, criando um registro imutavel de todas as transferencias de propriedade?**

a) Approval
b) Mint
c) Transfer
d) Burn

**Resposta: c**

**5. Uma securitizadora tokeniza um CRA de R$ 200 milhoes em 200.000 tokens ERC-20. Um auditor precisa verificar se houve venda irregular a investidores nao qualificados. Qual abordagem on-chain e a mais adequada?**

a) Consultar a funcao totalSupply() para verificar se o volume total foi alterado
b) Analisar todos os eventos Transfer emitidos pelo contrato e cruzar os enderecos destinatarios com a lista de investidores qualificados
c) Verificar o saldo da stablecoin BRL no contrato do CRA
d) Consultar a funcao approve() para identificar investidores com autorizacao pendente

**Resposta: b**

---

## Proxima Aula

Na proxima aula, vamos explorar o padrao ERC-721 para tokens nao fungiveis (NFTs) e suas aplicacoes no agronegocio brasileiro. Veremos como representar ativos unicos — como um CDA especifico, um titulo de terra com matricula propria ou uma CPR fisica com lastro singular — utilizando funcoes como ownerOf e safeTransferFrom, e como metadados via tokenURI permitem vincular documentos legais, laudos de qualidade e coordenadas de geolocalizacao diretamente ao token. Ate la!
