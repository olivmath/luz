# Aula 2.3: ERC-1155 — Multi-Token Semi-Fungivel para Operacoes Complexas no Agro

## Abertura

Bem-vindo a aula 2.3 do Modulo 2! Nas duas aulas anteriores, dominamos os dois extremos da tokenizacao: o ERC-20 para ativos totalmente fungiveis (como cotas de CRA ou stablecoins) e o ERC-721 para ativos totalmente unicos (como CDAs especificos ou titulos de terra). Agora, vamos explorar o padrao ERC-1155, que unifica ambos os modelos em um unico contrato inteligente, permitindo gerenciar simultaneamente tokens fungiveis, nao fungiveis e semi-fungiveis com eficiencia de gas drasticamente superior. No agronegocio brasileiro, onde operacoes envolvem batches de estoques homogeneos, tranches de CRA com diferentes perfis de risco e ativos unicos — frequentemente na mesma operacao —, o ERC-1155 e o padrao mais adequado para arquiteturas de tokenizacao escalaveis e economicas.

### Programa da aula:

1. Anatomia do ERC-1155: multi-token e eficiencia de gas (introducao)
2. Aplicacoes no agro: batches de estoques, tranches de CRA e operacoes hibridas (base e aprofundamento)
3. Distincao entre fungivel e nao fungivel no mesmo contrato (conceito principal da aula)

---

## 1. Anatomia do ERC-1155: multi-token e eficiencia de gas

### O problema que o ERC-1155 resolve

Imagine uma securitizadora que opera no mercado agro brasileiro e precisa tokenizar os seguintes ativos em uma unica operacao estruturada: (1) 50.000 cotas senior de um CRA de R$ 500 milhoes, todas identicas entre si (fungiveis); (2) 10.000 cotas mezanino do mesmo CRA, identicas entre si mas diferentes das senior (outro tipo fungivel); (3) 5 CDAs especificos de lotes de soja em armazens diferentes, cada um com caracteristicas unicas (nao fungiveis); e (4) 1 contrato-mae que consolida toda a operacao (unico).

Usando os padroes anteriores, a securitizadora precisaria implantar pelo menos 3 contratos separados: um ERC-20 para as cotas senior, outro ERC-20 para as cotas mezanino, e um ERC-721 para os CDAs e o contrato-mae. Cada contrato custa gas para deploy (entre 0,01 e 0,05 ETH em periodos de congestionamento da rede Ethereum, equivalente a R$ 100 a R$ 500), e cada interacao entre contratos consome gas adicional. Em uma operacao com dezenas de tipos de ativos, esse modelo se torna caro e complexo.

O ERC-1155 resolve esse problema permitindo que um unico contrato gerencie um numero ilimitado de tipos de tokens, cada um identificado por um ID unico. O padrao foi proposto por Witek Radomski (fundador da Enjin) na EIP-1155, publicada em junho de 2018, e rapidamente se tornou o padrao preferido para aplicacoes que exigem multiplos tipos de ativos.

- **Exemplo**: A Liqi, tokenizadora brasileira que ja movimentou mais de R$ 500 milhoes em ativos tokenizados, poderia utilizar um unico contrato ERC-1155 para representar toda uma operacao de CRA agro: as cotas senior (ID 1, supply 50.000), as cotas mezanino (ID 2, supply 10.000), cada CDA de lastro (IDs 3 a 7, supply 1 cada) e o contrato-mae (ID 8, supply 1). Em vez de 3 contratos separados com custo total de deploy de R$ 1.500, um unico deploy de R$ 500.

### Funcoes essenciais do ERC-1155

O ERC-1155 introduz funcoes que suportam operacoes em lote (batch), uma inovacao que reduz dramaticamente o custo de gas para transferencias multiplas:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC1155 {
    // Retorna o saldo de um tipo especifico de token para um endereco
    function balanceOf(address account, uint256 id)
        external view returns (uint256);

    // Retorna saldos de multiplos tipos para multiplos enderecos
    function balanceOfBatch(
        address[] calldata accounts,
        uint256[] calldata ids
    ) external view returns (uint256[] memory);

    // Aprova ou revoga um operador para todos os tokens do chamador
    function setApprovalForAll(address operator, bool approved) external;

    // Verifica se um operador esta aprovado
    function isApprovedForAll(address account, address operator)
        external view returns (bool);

    // Transferencia segura de um tipo de token
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes calldata data
    ) external;

    // Transferencia segura de multiplos tipos em uma unica transacao
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] calldata ids,
        uint256[] calldata amounts,
        bytes calldata data
    ) external;

    // Eventos
    event TransferSingle(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 id,
        uint256 value
    );

    event TransferBatch(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256[] ids,
        uint256[] values
    );

    event URI(string value, uint256 indexed id);
}
```

A funcao **safeBatchTransferFrom** e a grande inovacao do ERC-1155. Ela permite transferir multiplos tipos de tokens em uma unica transacao. No contexto agro, isso significa que um investidor pode receber simultaneamente 100 cotas senior de CRA (ID 1), 20 cotas mezanino (ID 2) e 1 CDA de lastro (ID 5) em uma unica transacao, pagando gas uma unica vez. Comparado a executar 3 transacoes separadas (uma para cada tipo), a economia de gas pode chegar a 50-70%.

A funcao **balanceOfBatch** permite consultar saldos de multiplos tipos de tokens para multiplos enderecos em uma unica chamada. Um gestor de FIAGRO com 500 investidores e 10 tipos de tokens pode consultar todos os saldos em uma unica operacao, em vez de fazer 5.000 chamadas individuais.

O evento **URI(string value, uint256 indexed id)** e emitido quando a URI de metadados de um tipo de token e definida ou atualizada. O ERC-1155 utiliza um padrao de URI com substituicao de ID: a URI base pode ser `https://api.plataforma.com/metadata/{id}.json`, onde `{id}` e substituido pelo ID hexadecimal do token. Isso simplifica a gestao de metadados para milhares de tipos de tokens.

- **Exemplo**: Uma trading que opera no Mato Grosso precisa transferir para uma securitizadora um pacote composto por: 5.000 tokens representando sacas de soja (ID 1), 3.000 tokens representando sacas de milho (ID 2) e 2 CDAs unicos de armazens diferentes (IDs 100 e 101). Com ERC-20/ERC-721, seriam necessarias 4 transacoes separadas em 3 contratos diferentes. Com ERC-1155, uma unica chamada a safeBatchTransferFrom com ids=[1, 2, 100, 101] e amounts=[5000, 3000, 1, 1] resolve tudo em uma transacao, custando aproximadamente R$ 15 em gas em vez de R$ 60.

---

## 2. Aplicacoes no agro: batches de estoques, tranches de CRA e operacoes hibridas

### Batches de estoques agropecuarios

O conceito de "batch" (lote) e natural no agronegocio. Um produtor de milho no Parana colhe e deposita sua safra em armazem, resultando em lotes homogeneos de graos com as mesmas caracteristicas de qualidade. Dentro de um mesmo lote, cada saca de milho e fungivel com qualquer outra — nao faz diferenca qual saca especifica o comprador recebe, desde que atenda ao padrao de qualidade do lote.

O ERC-1155 permite representar esses lotes de forma natural e eficiente. Cada tipo de token (ID) representa um lote especifico, e a quantidade de tokens daquele ID representa o numero de unidades (sacas, toneladas etc.) no lote. Um unico contrato ERC-1155 pode gerenciar simultaneamente:

- ID 1: Milho safrinha 2025, padrao CBOT, armazem Cascavel/PR — 50.000 tokens (1 token = 1 saca de 60 kg)
- ID 2: Milho safrinha 2025, padrao CBOT, armazem Toledo/PR — 30.000 tokens
- ID 3: Soja safra 2025/26, padrao ANEC 41c, armazem Maringa/PR — 80.000 tokens
- ID 4: Trigo safra 2025, tipo 1, armazem Ponta Grossa/PR — 20.000 tokens

Tokens com o mesmo ID sao fungiveis entre si (qualquer saca de milho do lote de Cascavel e equivalente a outra do mesmo lote), mas tokens com IDs diferentes nao sao fungiveis (milho de Cascavel nao e equivalente a soja de Maringa). Essa propriedade de "semi-fungibilidade" e exatamente o que o agro precisa.

```solidity
// Exemplo: Gestao de estoques agro com ERC-1155
contract EstoqueAgro is ERC1155 {
    struct Lote {
        string produto;
        string armazem;
        string padraoQualidade;
        uint256 safra;
        uint256 pesoUnitarioKg;  // peso por token (ex: 60 kg = 1 saca)
        uint256 dataDeposito;
        bool ativo;
    }

    uint256 public proximoLoteId = 1;
    mapping(uint256 => Lote) public lotes;

    constructor() ERC1155("https://api.agro.com/metadata/{id}.json") {}

    function registrarLote(
        address depositante,
        string memory produto,
        string memory armazem,
        string memory padrao,
        uint256 safra,
        uint256 quantidadeTokens
    ) external returns (uint256) {
        uint256 loteId = proximoLoteId++;
        lotes[loteId] = Lote(
            produto, armazem, padrao, safra,
            60, // 60 kg por saca
            block.timestamp,
            true
        );
        _mint(depositante, loteId, quantidadeTokens, "");
        return loteId;
    }

    // Retirada parcial do estoque
    function retirarEstoque(uint256 loteId, uint256 quantidade) external {
        require(balanceOf(msg.sender, loteId) >= quantidade, "Saldo insuficiente");
        _burn(msg.sender, loteId, quantidade);
    }
}
```

- **Exemplo**: A cooperativa C.Vale, com sede em Palotina (PR) e faturamento superior a R$ 30 bilhoes, opera dezenas de armazens no Parana e Mato Grosso do Sul. Com um unico contrato ERC-1155, a cooperativa poderia registrar todos os lotes depositados em seus armazens. Um produtor que deposita 10.000 sacas de soja no armazem de Palotina recebe 10.000 tokens do lote ID 47. Se ele quer vender 3.000 sacas para uma trading, transfere 3.000 tokens via safeTransferFrom. A trading pode entao agrupar tokens de diferentes produtores (todos do mesmo lote ID 47, ja que o padrao de qualidade e identico) e negociar o volume consolidado com um exportador. Todo o historico de movimentacao fica registrado on-chain.

### Tranches de CRA com diferentes perfis de risco

Uma operacao de CRA (Certificado de Recebiveis do Agronegocio) tipicamente e estruturada em tranches (parcelas) com diferentes perfis de risco e retorno. A estrutura mais comum inclui:

- **Tranche senior**: menor risco, menor retorno (ex: CDI + 2% a.a.), primeira a receber pagamentos, ultima a absorver perdas. Tipicamente 70-80% do volume total.
- **Tranche mezanino**: risco intermediario, retorno intermediario (ex: CDI + 5% a.a.), recebe apos a senior, absorve perdas antes dela. Tipicamente 15-20% do volume.
- **Tranche subordinada (equity)**: maior risco, maior retorno potencial, primeira a absorver perdas. Tipicamente 5-10% do volume, frequentemente retida pelo originador como "skin in the game".

No modelo ERC-1155, cada tranche e representada por um ID diferente, e os tokens dentro de cada tranche sao fungiveis entre si. Isso permite que investidores conservadores comprem tokens da tranche senior, investidores arrojados comprem tokens da tranche mezanino, e o originador retenha tokens da tranche subordinada — tudo dentro de um unico contrato.

A securitizadora Opea (antiga RB Capital), uma das maiores emissoras de CRA do Brasil com mais de R$ 15 bilhoes em emissoes, estruturou CRAs agro com ate 4 tranches em operacoes complexas envolvendo portfolios de CPRs de diferentes commodities e regioes. A tokenizacao via ERC-1155 dessas tranches permitiria negociacao granular de cada perfil de risco, com liquidez independente para cada tranche.

- **Exemplo**: A True Securitizadora emite um CRA de R$ 300 milhoes lastreado em 150 CPRs financeiras de produtores de soja, milho e algodao do MATOPIBA. A estrutura: tranche senior (ID 1) = R$ 210 milhoes = 210.000 tokens, rating AAA pela Fitch, rendimento IPCA + 7% a.a.; tranche mezanino (ID 2) = R$ 60 milhoes = 60.000 tokens, rating A, rendimento IPCA + 10% a.a.; tranche subordinada (ID 3) = R$ 30 milhoes = 30.000 tokens, sem rating, retida pelo originador. Um fundo de pensao (como Previ ou Petros) compra 100.000 tokens senior. Um family office compra 20.000 tokens mezanino. O originador retém todos os 30.000 tokens subordinados. Tudo em um unico contrato ERC-1155, com transferencias e consultas de saldo otimizadas.

---

## 3. Distincao entre fungivel e nao fungivel no mesmo contrato

### O conceito de semi-fungibilidade

O ERC-1155 introduz o conceito de semi-fungibilidade, que e particularmente poderoso para o agronegocio. Um token e semi-fungivel quando comeca fungivel (intercambiavel com outros do mesmo tipo) mas pode se tornar nao fungivel ao longo do tempo, ou vice-versa. O exemplo classico: um ingresso para um show e fungivel antes do evento (qualquer ingresso de pista e equivalente a outro de pista) mas torna-se nao fungivel apos o uso (um ingresso usado e um colecionavel unico com historico proprio).

No agro, a semi-fungibilidade aparece naturalmente em varios cenarios:

**Tokens de estoque que se tornam CDAs individuais**: 1.000 tokens representando sacas de soja em armazem sao fungiveis enquanto as sacas estao no silo. Quando o proprietario solicita a emissao de um CDA para um lote especifico de 500 sacas, esses 500 tokens podem ser "convertidos" em um NFT unico (um novo ID com supply 1) que representa o CDA com seus metadados individuais.

**Cotas de CRA que vencem em datas diferentes**: em um CRA com amortizacao mensal, as cotas que vencem em janeiro sao fungiveis entre si, mas nao sao fungiveis com as cotas que vencem em fevereiro. Cada mes de vencimento pode ser representado por um ID diferente no ERC-1155.

**Safras futuras que se tornam producao real**: tokens representando "soja safra 2026 estimada" sao fungiveis entre si antes da colheita. Apos a colheita, cada lote depositado em armazem tem caracteristicas especificas (qualidade, umidade, localizacao) e se torna nao fungivel.

```solidity
// Exemplo: conversao de fungivel para NFT no ERC-1155
contract AgroMultiToken is ERC1155 {
    uint256 public constant SOJA_FUNGIVEL = 1;  // Sacas fungiveis
    uint256 private _nextCDAId = 1000;           // CDAs unicos (IDs >= 1000)

    struct MetadadosCDA {
        uint256 quantidadeSacas;
        string armazem;
        string laudoQualidade;
        uint256 dataEmissao;
    }

    mapping(uint256 => MetadadosCDA) public cdas;

    // Converte sacas fungiveis em CDA unico
    function emitirCDA(
        uint256 quantidadeSacas,
        string memory armazem,
        string memory laudo
    ) external returns (uint256) {
        // Queima tokens fungiveis
        require(
            balanceOf(msg.sender, SOJA_FUNGIVEL) >= quantidadeSacas,
            "Sacas insuficientes"
        );
        _burn(msg.sender, SOJA_FUNGIVEL, quantidadeSacas);

        // Cria NFT unico representando o CDA
        uint256 cdaId = _nextCDAId++;
        cdas[cdaId] = MetadadosCDA(
            quantidadeSacas,
            armazem,
            laudo,
            block.timestamp
        );
        _mint(msg.sender, cdaId, 1, ""); // supply = 1 (NFT)

        return cdaId;
    }

    // Reverte CDA para sacas fungiveis (ex: cancelamento)
    function cancelarCDA(uint256 cdaId) external {
        require(balanceOf(msg.sender, cdaId) == 1, "Nao possui este CDA");
        uint256 sacas = cdas[cdaId].quantidadeSacas;

        _burn(msg.sender, cdaId, 1);
        _mint(msg.sender, SOJA_FUNGIVEL, sacas, "");

        delete cdas[cdaId];
    }
}
```

- **Exemplo**: Um produtor de soja em Rio Verde (GO) colhe 100.000 sacas e deposita em armazem. Ele recebe 100.000 tokens fungiveis (ID 1 - SOJA_FUNGIVEL). Quando precisa negociar parte do estoque, ele emite um CDA para 30.000 sacas: o contrato queima 30.000 tokens do ID 1 e cria 1 token do ID 1000 (o CDA unico), com metadados do armazem, laudo de qualidade e data. A trading que compra esse CDA-NFT tem certeza de que as 30.000 sacas estao "bloqueadas" (os tokens fungiveis foram queimados) e nao podem ser vendidas duas vezes. Se o negocio for cancelado, a funcao cancelarCDA reverte a operacao: queima o NFT e recria os 30.000 tokens fungiveis.

### Arquitetura de um contrato ERC-1155 para operacoes agro integradas

A verdadeira potencia do ERC-1155 no agro aparece quando combinamos todos os conceitos em uma arquitetura integrada. Um unico contrato pode gerenciar toda a cadeia de valor de uma operacao de securitizacao agro:

**Camada 1 — Estoques (fungiveis)**: IDs 1-99 representam diferentes tipos de commodities em diferentes armazens. Soja tipo A no armazem X (ID 1), milho no armazem Y (ID 2), etc. Tokens fungiveis dentro de cada ID.

**Camada 2 — CDAs (nao fungiveis)**: IDs 100-999 representam CDAs emitidos a partir dos estoques. Cada CDA e um NFT (supply = 1) com metadados unicos vinculados via URI.

**Camada 3 — CPRs (nao fungiveis)**: IDs 1000-9999 representam CPRs fisicas ou financeiras lastreadas nos estoques ou na producao futura. Cada CPR e um NFT com dados do emissor, valor, vencimento e garantias.

**Camada 4 — Tranches de CRA (fungiveis por tranche)**: IDs 10000+ representam tranches de CRA lastreados nas CPRs. Senior (ID 10001), mezanino (ID 10002), subordinada (ID 10003). Tokens fungiveis dentro de cada tranche.

Essa arquitetura em camadas permite rastreabilidade completa do lastro: cada token de CRA senior (ID 10001) e lastreado em CPRs especificas (IDs 1000-9999), que por sua vez sao lastreadas em CDAs (IDs 100-999) ou estoques (IDs 1-99). Um auditor pode percorrer a cadeia de IDs e verificar que o lastro e real, suficiente e nao duplicado.

```solidity
// Exemplo: estrutura de IDs para operacao integrada
contract OperacaoCRAAgroIntegrada is ERC1155 {
    // Ranges de IDs
    uint256 constant ESTOQUE_MIN = 1;
    uint256 constant ESTOQUE_MAX = 99;
    uint256 constant CDA_MIN = 100;
    uint256 constant CDA_MAX = 999;
    uint256 constant CPR_MIN = 1000;
    uint256 constant CPR_MAX = 9999;
    uint256 constant TRANCHE_MIN = 10000;

    // Mapeamento de lastro: CRA -> CPRs -> CDAs
    mapping(uint256 => uint256[]) public lastroCRA;    // trancheId => cprIds
    mapping(uint256 => uint256[]) public lastroCPR;    // cprId => cdaIds

    function verificarLastro(uint256 trancheId)
        external view returns (uint256 totalLastro)
    {
        uint256[] memory cprs = lastroCRA[trancheId];
        for (uint i = 0; i < cprs.length; i++) {
            uint256[] memory cdasDaCPR = lastroCPR[cprs[i]];
            for (uint j = 0; j < cdasDaCPR.length; j++) {
                // Soma os valores de cada CDA
                totalLastro += 1; // simplificado
            }
        }
    }
}
```

- **Exemplo**: A Ecoagro, uma das maiores originadoras de credito agro do Brasil com portfolio superior a R$ 10 bilhoes, estrutura uma operacao de CRA de R$ 500 milhoes usando um contrato ERC-1155 integrado. O contrato contem: 15 tipos de estoque (IDs 1-15) em armazens do MT, GO e BA, totalizando 2 milhoes de sacas tokenizadas; 45 CDAs (IDs 100-144) emitidos a partir desses estoques; 120 CPRs financeiras (IDs 1000-1119) de produtores da regiao; e 3 tranches de CRA (IDs 10001-10003) lastreadas nessas CPRs. O trustee (agente fiduciario) do CRA — por exemplo, a Vortx ou a Pentagonal — pode verificar on-chain, em tempo real, que cada tranche esta adequadamente lastreada, sem depender de relatorios mensais do servicer. Quando uma CPR e liquidada (produtor paga), o contrato automaticamente atualiza o status e redistribui os pagamentos proporcionalmente entre as tranches, priorizando a senior.

---

## Conclusao

Nesta aula, fechamos o ciclo dos padroes fundamentais de tokenizacao com o ERC-1155, o padrao mais versatil e eficiente para operacoes complexas no agronegocio brasileiro. Primeiro, entendemos como o multi-token resolve o problema de custo e complexidade de gerenciar multiplos contratos separados, com funcoes de batch (safeBatchTransferFrom, balanceOfBatch) que reduzem custos de gas em ate 70%. Segundo, aplicamos o padrao a cenarios reais do agro: batches de estoques em armazens representados como tokens fungiveis por lote, tranches de CRA com diferentes perfis de risco em um unico contrato, e operacoes hibridas que combinam commodities, CDAs, CPRs e cotas de securitizacao. Terceiro, exploramos o conceito de semi-fungibilidade — a capacidade de converter tokens fungiveis em NFTs e vice-versa — e desenhamos uma arquitetura em camadas que permite rastreabilidade completa do lastro, desde o estoque fisico ate a cota de CRA nas maos do investidor.

Com os tres padroes — ERC-20, ERC-721 e ERC-1155 — voce agora possui o ferramental tecnico para representar qualquer ativo do agronegocio na blockchain. No proximo modulo, vamos aplicar esse conhecimento na arquitetura completa de uma solucao RWA, integrando smart contracts, oracles, compliance on-chain e integracao com o sistema financeiro tradicional.

---

## Licao de Casa

1. Desenhe (em texto ou diagrama) a arquitetura de IDs de um contrato ERC-1155 para uma operacao de CRA de R$ 100 milhoes lastreado em CPRs de cafe especial do Cerrado Mineiro. Defina pelo menos 4 camadas de IDs (estoques, CDAs, CPRs, tranches) e explique quais IDs sao fungiveis e quais sao NFTs.
2. Calcule a economia de gas estimada ao usar ERC-1155 em vez de contratos ERC-20 + ERC-721 separados para uma operacao que envolve: 3 tipos de tokens fungiveis (2 tranches de CRA + 1 stablecoin), 10 CDAs unicos e 50 CPRs individuais. Considere custo medio de deploy de contrato = R$ 500 e custo medio por transacao = R$ 15.
3. Pesquise o conceito de "token-bound accounts" (ERC-6551) e explique em 15 linhas como um NFT ERC-1155 representando um CDA poderia "possuir" outros tokens (como tokens de seguro, certificados de qualidade etc.), criando uma hierarquia de ativos digitais.

---

## Questionario

**1. Qual e a principal vantagem do ERC-1155 sobre o uso combinado de ERC-20 e ERC-721 para operacoes complexas de tokenizacao no agronegocio?**

a) O ERC-1155 permite criar tokens com valor maximo ilimitado
b) O ERC-1155 gerencia multiplos tipos de tokens (fungiveis e nao fungiveis) em um unico contrato, reduzindo custos de gas e complexidade
c) O ERC-1155 elimina a necessidade de metadados para os tokens
d) O ERC-1155 permite apenas tokens fungiveis, mas com eficiencia superior ao ERC-20

**Resposta: b**

**2. Em um contrato ERC-1155 para uma operacao de CRA agro, como sao representadas as tranches senior e mezanino?**

a) Como um unico ID com flag interna distinguindo o tipo de tranche
b) Como IDs diferentes no mesmo contrato, sendo tokens fungiveis dentro de cada ID (cada tranche)
c) Como contratos ERC-20 separados vinculados ao contrato ERC-1155
d) Como metadados do tokenURI, sem distincao no nivel do contrato

**Resposta: b**

**3. O que e a funcao safeBatchTransferFrom do ERC-1155 e qual sua aplicacao pratica no agro?**

a) Uma funcao que transfere apenas NFTs em lote, nao aplicavel a tokens fungiveis
b) Uma funcao que permite transferir multiplos tipos de tokens em uma unica transacao, reduzindo custos de gas — util para transferir simultaneamente cotas de CRA, CDAs e estoques
c) Uma funcao exclusiva para queima de tokens vencidos em lote
d) Uma funcao que verifica a autenticidade de multiplos tokens antes da transferencia

**Resposta: b**

**4. No conceito de semi-fungibilidade aplicado ao agro, como tokens fungiveis de estoque podem se tornar NFTs?**

a) Os tokens fungiveis sao automaticamente convertidos em NFTs apos 30 dias
b) O contrato queima tokens fungiveis do estoque e emite um NFT unico (CDA) com metadados especificos do lote, garantindo que as sacas nao sejam vendidas duas vezes
c) Os tokens fungiveis recebem um carimbo de data que os torna unicos
d) A conversao e feita fora da blockchain, por um sistema centralizado do armazem

**Resposta: b**

**5. Uma securitizadora usa um contrato ERC-1155 com a seguinte estrutura de IDs: estoques (IDs 1-50), CDAs (IDs 100-200), CPRs (IDs 1000-1500), tranches de CRA (IDs 10001-10003). Um auditor precisa verificar se a tranche senior (ID 10001) esta adequadamente lastreada. Qual abordagem on-chain e a mais eficiente?**

a) Consultar o totalSupply do ID 10001 e comparar com o valor total da operacao
b) Percorrer o mapeamento de lastro on-chain (tranche → CPRs → CDAs → estoques) para verificar que cada nivel possui ativos reais e suficientes
c) Verificar o saldo de stablecoin no contrato do CRA
d) Consultar o balanceOf do emissor para verificar se ele ainda possui tokens

**Resposta: b**

---

## Proxima Aula

No proximo modulo — Modulo 3: Arquitetura de uma Solucao RWA e Smart Contracts —, vamos aplicar os padroes ERC-20, ERC-721 e ERC-1155 que dominamos neste modulo para projetar a arquitetura completa de uma solucao de tokenizacao de ativos reais para o agronegocio. Veremos como integrar oracles (como Chainlink) para alimentar precos de commodities on-chain, como implementar compliance automatizado via smart contracts (KYC/AML on-chain), como conectar a solucao ao sistema financeiro tradicional (incluindo o DREX) e como garantir a validade juridica de toda a operacao sob a regulacao brasileira. Ate la!
