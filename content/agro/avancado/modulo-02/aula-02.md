# Aula 2.2: ERC-721 — Tokens Nao Fungiveis (NFTs) para Ativos Unicos do Agro

## Abertura

Bem-vindo a aula 2.2 do Modulo 2! Na aula anterior, dominamos o padrao ERC-20 para tokens fungiveis — ativos identicos e intercambiaveis. Agora, vamos explorar o outro extremo do espectro: o padrao ERC-721, que permite representar ativos digitais unicos e irrepettiveis na blockchain. No agronegocio brasileiro, existem ativos que nao podem ser tratados como unidades intercambiaveis: um titulo de propriedade rural com matricula especifica, um Certificado de Deposito Agropecuario (CDA) vinculado a um lote particular de graos em determinado armazem, ou uma CPR fisica com lastro singular em uma producao especifica. O ERC-721 e o padrao que permite tokenizar cada um desses ativos preservando sua unicidade, rastreabilidade e vinculacao a metadados legais detalhados.

### Programa da aula:

1. Anatomia do padrao ERC-721: funcoes essenciais e propriedade unica (introducao)
2. Aplicacoes no agro: CDA, titulo de terra e CPR fisica como NFTs (base e aprofundamento)
3. Metadados e tokenURI: documentos legais, qualidade e geolocalizacao on-chain (conceito principal da aula)

---

## 1. Anatomia do padrao ERC-721: funcoes essenciais e propriedade unica

### O que diferencia um NFT de um token fungivel

Enquanto no ERC-20 cada token e identico a qualquer outro do mesmo contrato, no ERC-721 cada token possui um identificador unico (tokenId) que o distingue de todos os outros. Essa unicidade e o que permite representar ativos do mundo real que possuem caracteristicas individuais e nao podem ser substituidos por outro "equivalente". No direito brasileiro, essa distincao corresponde a diferenca entre bens fungiveis (art. 85 do Codigo Civil — podem ser substituidos por outros da mesma especie, qualidade e quantidade) e bens infungiveis (art. 85, a contrario sensu — possuem qualidades individuais que os tornam insubstituiveis).

O padrao ERC-721 foi formalizado na EIP-721, proposta por William Entriken, Dieter Shirley, Jacob Evans e Nastassia Sachs, e publicada em janeiro de 2018. Embora NFTs tenham se tornado populares no mercado de arte digital e colecionaveis, sua aplicacao mais transformadora esta na representacao de ativos reais (RWA) — e o agronegocio brasileiro, com sua enorme diversidade de titulos e ativos, e um dos setores com maior potencial de adocao.

- **Exemplo**: Imagine dois lotes de cafe armazenados no mesmo armazem em Franca (SP). O lote A contem 500 sacas de cafe arabica tipo 2, bebida mole, altitude acima de 1.100m, com certificacao UTZ, laudo de qualidade datado de 15/03/2025 e nota 85 na escala SCA. O lote B contem 500 sacas do mesmo arabica tipo 2, mas bebida dura, altitude 800m, sem certificacao e nota 78 SCA. Embora ambos sejam "500 sacas de cafe arabica tipo 2", eles tem valores de mercado completamente diferentes — o lote A pode valer R$ 2.800/saca enquanto o lote B vale R$ 1.900/saca. Um token ERC-20 nao consegue capturar essa diferenca. Um NFT ERC-721 sim: cada lote recebe seu proprio tokenId com metadados unicos que descrevem exatamente suas caracteristicas.

### Funcoes obrigatorias do ERC-721

O padrao ERC-721 define um conjunto de funcoes que garantem a gestao de propriedade e transferencia segura de tokens unicos:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC721 {
    // Retorna o numero total de NFTs atribuidos a um endereco
    function balanceOf(address owner) external view returns (uint256);

    // Retorna o endereco do proprietario de um NFT especifico
    function ownerOf(uint256 tokenId) external view returns (address);

    // Transferencia segura com verificacao do destinatario
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    // Transferencia sem verificacao (uso interno)
    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    // Aprova um endereco para gerenciar um NFT especifico
    function approve(address to, uint256 tokenId) external;

    // Retorna o endereco aprovado para um NFT especifico
    function getApproved(uint256 tokenId) external view returns (address);

    // Aprova ou revoga um operador para gerenciar todos os NFTs do owner
    function setApprovalForAll(address operator, bool approved) external;

    // Verifica se um operador esta aprovado para gerenciar todos os NFTs
    function isApprovedForAll(address owner, address operator)
        external view returns (bool);

    // Eventos
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
}
```

A funcao **ownerOf(uint256 tokenId)** e a mais distintiva do ERC-721: dado um tokenId, ela retorna o endereco do proprietario atual. No contexto agro, isso significa que qualquer pessoa pode verificar instantaneamente quem e o titular de um CDA tokenizado, de um titulo de terra digital ou de uma CPR fisica especifica — sem precisar consultar cartorios, registradoras ou custodiantes.

A funcao **safeTransferFrom** e a forma recomendada de transferir NFTs. O prefixo "safe" indica que a funcao verifica se o endereco destinatario e capaz de receber NFTs (implementa a interface IERC721Receiver). Isso previne que tokens sejam enviados para contratos que nao sabem lidar com NFTs, evitando perda permanente de ativos. No agro, onde um unico NFT pode representar um titulo de terra no valor de milhoes de reais, essa verificacao de seguranca e essencial.

- **Exemplo**: Um fundo de investimento em terras agricolas adquire uma fazenda de 5.000 hectares no MATOPIBA por R$ 150 milhoes. O titulo de propriedade e tokenizado como NFT ERC-721 com tokenId #4721. Quando o fundo decide vender a fazenda para outro investidor, a transferencia do NFT via safeTransferFrom automaticamente atualiza o registro de propriedade on-chain. O comprador pode verificar via ownerOf(4721) que ele e o novo proprietario registrado. Esse registro blockchain complementa (e no futuro podera substituir) o registro em cartorio de imoveis.

---

## 2. Aplicacoes no agro: CDA, titulo de terra e CPR fisica como NFTs

### CDA (Certificado de Deposito Agropecuario) como NFT

O Certificado de Deposito Agropecuario (CDA) e um titulo de credito emitido por armazens gerais ou depositarios, representando a propriedade de produtos agropecuarios depositados. Regulado pela Lei 11.076/2004, o CDA e sempre vinculado a um lote especifico de mercadoria, com caracteristicas individuais de qualidade, peso, localizacao e prazo de deposito. Essa natureza intrinsecamente unica torna o CDA um candidato ideal para tokenizacao via ERC-721.

Cada CDA emitido como NFT carregaria em seus metadados: a identificacao do armazem depositario (com CNPJ e codigo CONAB), a descricao detalhada da mercadoria (tipo, qualidade, peso, umidade), a localizacao fisica do armazem (coordenadas GPS), a data de deposito, o prazo de validade do certificado e o numero do warrant (WA) associado. Quando o proprietario de um CDA-NFT decide negocia-lo, a transferencia do token automaticamente transfere todos esses atributos, criando uma cadeia de custodia digital completa.

No Brasil, a CONAB (Companhia Nacional de Abastecimento) registra os armazens credenciados e a B3 opera o sistema de registro eletronico de CDA/WA. A tokenizacao via ERC-721 nao substitui esses sistemas, mas cria uma camada adicional de transparencia e interoperabilidade. Uma trading que recebe um CDA-NFT pode verificar instantaneamente todos os atributos do lote depositado, sem precisar solicitar documentos fisicos ao armazem ou consultar sistemas internos do depositario.

```solidity
// Exemplo simplificado: CDA como NFT
contract CDA_NFT is ERC721, ERC721URIStorage {
    uint256 private _nextTokenId;

    struct DadosCDA {
        string armazem;         // Nome e CNPJ do armazem
        string produto;         // Ex: "Soja em graos"
        uint256 pesoKg;         // Peso em kg
        uint256 umidade;        // Umidade em % (x100)
        string geolocalizacao;  // Coordenadas do armazem
        uint256 dataDeposito;   // Timestamp do deposito
        uint256 prazoValidade;  // Timestamp do vencimento
    }

    mapping(uint256 => DadosCDA) public certificados;

    function emitirCDA(
        address proprietario,
        string memory uri,
        DadosCDA memory dados
    ) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(proprietario, tokenId);
        _setTokenURI(tokenId, uri);
        certificados[tokenId] = dados;
        return tokenId;
    }
}
```

- **Exemplo**: O armazem Cargill em Primavera do Leste (MT) recebe 10.000 toneladas de soja de um produtor e emite um CDA digital. O CDA e tokenizado como NFT ERC-721 com tokenId #8832. Os metadados registram: armazem "Cargill Primavera do Leste - CNPJ XX.XXX.XXX/0001-XX", produto "Soja em graos - padrao ANEC 41c", peso "10.000.000 kg", umidade "13,5%", coordenadas "-15.5489, -54.2958", data deposito "01/04/2025". O produtor decide vender o CDA para uma trading. A transferencia do NFT via safeTransferFrom registra imutavelmente a mudanca de propriedade, e a trading pode verificar instantaneamente todos os dados do lote sem visitar o armazem.

### Titulo de terra e CPR fisica como ativos unicos tokenizados

O titulo de propriedade rural e talvez o ativo mais valioso e complexo do agronegocio brasileiro. O Brasil possui aproximadamente 350 milhoes de hectares de terras agricolas, avaliados em trilhoes de reais. Cada propriedade e unica: possui matricula especifica em cartorio de registro de imoveis, georreferenciamento obrigatorio (Lei 10.267/2001), caracteristicas de solo, topografia, recursos hidricos e infraestrutura que afetam diretamente seu valor.

A tokenizacao de titulos de terra via ERC-721 cria uma representacao digital verificavel de cada propriedade. O NFT nao substitui a matricula no cartorio — a legislacao brasileira ainda exige registro imobiliario para transferencia de propriedade (art. 1.245 do Codigo Civil) —, mas funciona como uma camada digital que facilita negociacao, fracionamento de direitos economicos e acesso a financiamento. Iniciativas como a da Rethink (plataforma brasileira de tokenizacao imobiliaria) ja exploram esse modelo para propriedades urbanas, e a expansao para terras rurais e uma questao de tempo e adequacao regulatoria.

A CPR fisica, por sua vez, compromete a entrega de um produto especifico, em local e prazo determinados. Diferentemente da CPR financeira (que e liquidada em dinheiro e naturalmente fungivel), a CPR fisica esta vinculada a uma producao singular — a safra de uma fazenda especifica, com caracteristicas de qualidade determinadas. Tokenizar uma CPR fisica como NFT ERC-721 permite rastrear nao apenas a titularidade do credito, mas tambem o vinculo com a producao real, incluindo laudos de qualidade, certificados fitossanitarios e comprovantes de seguro.

- **Exemplo**: Uma fazenda de 12.000 hectares em Luis Eduardo Magalhaes (BA), avaliada em R$ 840 milhoes (R$ 70.000/hectare), e tokenizada como NFT ERC-721 para fins de negociacao de participacao societaria. O NFT contem metadados com a matricula do imovel, certificado de georreferenciamento do INCRA, CAR (Cadastro Ambiental Rural) com reserva legal de 20%, analise de solo das 15 glebas, outorga de uso de agua e historico de produtividade (media de 72 sacas/hectare de soja nos ultimos 5 anos). Um fundo de investimento em terras (farmland fund) adquire o NFT e, com ele, o direito economico sobre a propriedade. Todo o historico de negociacao fica registrado imutavelmente na blockchain.

---

## 3. Metadados e tokenURI: documentos legais, qualidade e geolocalizacao on-chain

### A funcao tokenURI e o padrao de metadados

A funcao tokenURI(uint256 tokenId) e a ponte entre o token on-chain e os dados detalhados do ativo que ele representa. Quando chamada com um tokenId especifico, ela retorna uma URI (Uniform Resource Identifier) que aponta para um documento JSON contendo todos os metadados do ativo. Esse JSON segue tipicamente o padrao de metadados estabelecido pelo OpenSea (que se tornou padrao de facto), com campos como name, description, image e attributes.

No contexto do agronegocio, os metadados do tokenURI vao muito alem de nome e imagem. Eles devem conter informacoes legais, tecnicas e logisticas que permitem ao detentor do NFT — e a qualquer auditor ou regulador — verificar completamente o ativo lastrado. Para um CDA tokenizado, por exemplo, o JSON do tokenURI deve incluir:

```json
{
    "name": "CDA #8832 - Soja Primavera do Leste",
    "description": "Certificado de Deposito Agropecuario - 10.000 ton soja",
    "image": "ipfs://QmXyz.../foto_armazem.jpg",
    "external_url": "https://plataforma.exemplo.com/cda/8832",
    "attributes": [
        {
            "trait_type": "Produto",
            "value": "Soja em graos"
        },
        {
            "trait_type": "Padrao Qualidade",
            "value": "ANEC 41c"
        },
        {
            "trait_type": "Peso (kg)",
            "value": 10000000,
            "display_type": "number"
        },
        {
            "trait_type": "Umidade (%)",
            "value": 13.5,
            "display_type": "number"
        },
        {
            "trait_type": "Armazem",
            "value": "Cargill Primavera do Leste - MT"
        },
        {
            "trait_type": "Geolocalizacao",
            "value": "-15.5489, -54.2958"
        },
        {
            "trait_type": "Data Deposito",
            "value": "2025-04-01",
            "display_type": "date"
        },
        {
            "trait_type": "Laudo Qualidade (IPFS)",
            "value": "ipfs://QmAbc.../laudo_qualidade.pdf"
        },
        {
            "trait_type": "Certificado Fitossanitario",
            "value": "ipfs://QmDef.../certificado_fito.pdf"
        }
    ]
}
```

Observe que documentos legais como laudos de qualidade e certificados fitossanitarios sao armazenados no IPFS (InterPlanetary File System) — um sistema de armazenamento descentralizado que garante imutabilidade e disponibilidade dos documentos. O hash IPFS funciona como uma impressao digital do documento: se alguem alterar um unico byte do laudo de qualidade, o hash muda completamente, tornando qualquer adulteracao detectavel.

- **Exemplo**: Um exportador japones deseja comprar 5.000 toneladas de soja brasileira com certificacao de sustentabilidade. Ele acessa a plataforma de negociacao e visualiza o NFT do CDA #8832. Ao consultar o tokenURI, ele verifica instantaneamente: o laudo de qualidade confirmando padrao ANEC 41c, o certificado fitossanitario valido para exportacao, a certificacao de sustentabilidade (RTRS), e as coordenadas do armazem para agendamento logistico. Toda essa informacao esta vinculada imutavelmente ao NFT, eliminando a troca de dezenas de e-mails e documentos em PDF entre compradores, vendedores, corretores e certificadores.

### Geolocalizacao e rastreabilidade de origem

A inclusao de coordenadas geograficas nos metadados de NFTs agro e uma inovacao com impacto direto na rastreabilidade de origem e no compliance ambiental. O georreferenciamento obrigatorio de imoveis rurais no Brasil (Lei 10.267/2001 e Decreto 4.449/2002) ja gera dados de coordenadas precisas para cada propriedade. Ao vincular essas coordenadas ao NFT de um titulo de terra, CDA ou CPR, cria-se uma camada de verificacao geografica que permite:

**Verificacao de desmatamento**: cruzando as coordenadas do NFT com dados do INPE (Instituto Nacional de Pesquisas Espaciais) via sistema PRODES/DETER, e possivel verificar automaticamente se a area de producao sofreu desmatamento ilegal. Essa verificacao e crucial para atender ao Regulamento Europeu Anti-Desmatamento (EUDR), que a partir de 2025 exige rastreabilidade ate a parcela de producao para commodities importadas pela Uniao Europeia, incluindo soja, cafe e carne bovina.

**Verificacao de sobreposicao com terras indigenas e areas protegidas**: cruzando coordenadas com dados da FUNAI e do ICMBio, e possivel verificar se a producao lastrada no NFT vem de areas legitimas, sem sobreposicao com terras indigenas demarcadas ou unidades de conservacao.

**Rastreabilidade de cadeia produtiva**: ao vincular NFTs de diferentes etapas (producao no campo → deposito em armazem → transporte → porto), e possivel rastrear a commodity desde a fazenda ate o consumidor final, atendendo a demandas crescentes de rastreabilidade ESG.

```solidity
// Exemplo: verificacao de geolocalizacao no contrato
contract CPRFisicaNFT is ERC721URIStorage {
    struct Geolocalizacao {
        int256 latitude;   // multiplicado por 10^6
        int256 longitude;  // multiplicado por 10^6
        uint256 areaHectares;
    }

    mapping(uint256 => Geolocalizacao) public localizacoes;

    event OrigemVerificada(
        uint256 indexed tokenId,
        int256 latitude,
        int256 longitude,
        string statusDesmatamento // "CONFORME" ou "ALERTA"
    );

    function registrarOrigem(
        uint256 tokenId,
        int256 lat,
        int256 long,
        uint256 area
    ) external {
        require(ownerOf(tokenId) != address(0), "Token inexistente");
        localizacoes[tokenId] = Geolocalizacao(lat, long, area);
    }
}
```

- **Exemplo**: A Bunge, uma das maiores traders de graos operando no Brasil, precisa comprovar a seus clientes europeus que a soja importada nao provem de areas desmatadas apos 2020, conforme exige o EUDR. Ao adquirir soja representada por NFTs ERC-721 com geolocalizacao embarcada nos metadados, a Bunge pode cruzar automaticamente as coordenadas de cada lote com imagens de satelite do INPE. O sistema gera um certificado digital de conformidade para cada NFT, que e anexado como metadado adicional via atualizacao do tokenURI. O importador europeu recebe o NFT com toda a cadeia de evidencias — coordenadas, imagens de satelite, laudo de conformidade — vinculada imutavelmente ao token. Esse processo, que hoje envolve auditorias presenciais custosas (R$ 50.000 a R$ 200.000 por propriedade), pode ser parcialmente automatizado com NFTs geolocalizados.

---

## Conclusao

Nesta aula, exploramos o padrao ERC-721 e sua capacidade de representar ativos unicos e irrepettiveis do agronegocio brasileiro. Primeiro, entendemos a anatomia do padrao — ownerOf, safeTransferFrom, approve — e como cada NFT possui um tokenId unico que o distingue de todos os demais. Segundo, aplicamos esse padrao a tres ativos fundamentais do agro: o CDA, que representa lotes especificos de mercadoria em armazem; o titulo de terra, que carrega matricula, georreferenciamento e historico produtivo; e a CPR fisica, vinculada a uma producao singular com lastro identificavel. Terceiro, mergulhamos nos metadados via tokenURI — a camada que transforma um simples token numerico em um certificado digital completo, com documentos legais, laudos de qualidade e coordenadas de geolocalizacao que viabilizam compliance ambiental (como o EUDR europeu) e rastreabilidade de origem. Porem, muitos cenarios do agro exigem uma combinacao de tokens fungiveis e nao fungiveis no mesmo contrato. Na proxima aula, veremos como o ERC-1155 resolve essa necessidade com eficiencia.

---

## Licao de Casa

1. Escolha um produto agropecuario brasileiro (cafe especial, algodao, cacau etc.) e elabore um JSON completo de metadados para um NFT ERC-721 representando um CDA desse produto. Inclua pelo menos 10 atributos relevantes (qualidade, peso, certificacoes, geolocalizacao, documentos legais).
2. Pesquise o Regulamento Europeu Anti-Desmatamento (EUDR) e explique em 15 linhas como NFTs ERC-721 com geolocalizacao poderiam ajudar exportadores brasileiros de soja a comprovar conformidade com as exigencias europeias.
3. Compare o fluxo de transferencia de um CDA no sistema tradicional (registro eletronico na B3) com o fluxo de transferencia de um CDA tokenizado como NFT ERC-721. Identifique pelo menos 3 vantagens e 2 limitacoes do modelo tokenizado.

---

## Questionario

**1. Qual funcao do padrao ERC-721 permite verificar quem e o proprietario atual de um ativo unico tokenizado, como um CDA especifico?**

a) balanceOf()
b) ownerOf()
c) totalSupply()
d) getApproved()

**Resposta: b**

**2. Por que a funcao safeTransferFrom e preferivel a transferFrom na transferencia de NFTs representando ativos de alto valor, como titulos de terra?**

a) Porque safeTransferFrom e mais rapida e consome menos gas
b) Porque safeTransferFrom verifica se o destinatario e capaz de receber NFTs, prevenindo perda permanente do ativo
c) Porque safeTransferFrom permite transferir multiplos NFTs simultaneamente
d) Porque safeTransferFrom dispensa a necessidade de aprovacao previa

**Resposta: b**

**3. No contexto da tokenizacao agro, qual e a funcao da URI retornada pela funcao tokenURI()?**

a) Armazenar o valor financeiro do ativo diretamente na blockchain
b) Apontar para um documento JSON com metadados detalhados do ativo, incluindo qualidade, geolocalizacao e documentos legais
c) Definir o preco minimo de venda do NFT em mercado secundario
d) Registrar automaticamente o NFT em cartorio de imoveis

**Resposta: b**

**4. Como a geolocalizacao nos metadados de um NFT de CPR fisica pode auxiliar no compliance com o Regulamento Europeu Anti-Desmatamento (EUDR)?**

a) Eliminando a necessidade de qualquer certificacao ambiental
b) Permitindo o cruzamento automatico das coordenadas de producao com dados de satelite para verificar ausencia de desmatamento ilegal
c) Transferindo a responsabilidade ambiental do produtor para o detentor do NFT
d) Substituindo o Cadastro Ambiental Rural (CAR) por um registro blockchain

**Resposta: b**

**5. Um armazem emite um CDA tokenizado como NFT ERC-721 para 10.000 toneladas de soja. O lote e vendido tres vezes em sequencia: do produtor para uma trading, da trading para um fundo, e do fundo para um exportador. Quantas transacoes Transfer sao registradas na blockchain (incluindo a emissao)?**

a) 1 (apenas a emissao inicial)
b) 2 (emissao e primeira venda)
c) 3 (emissao e duas vendas)
d) 4 (emissao e tres vendas)

**Resposta: d**

---

## Proxima Aula

Na proxima aula, vamos estudar o padrao ERC-1155, que combina o melhor dos mundos fungivel e nao fungivel em um unico contrato inteligente. Veremos como esse padrao multi-token permite representar simultaneamente batches de estoques agropecuarios (como 1.000 sacas de milho fungiveis entre si), tranches de CRA com diferentes perfis de risco, e ativos unicos — tudo com eficiencia de gas muito superior ao uso separado de ERC-20 e ERC-721. Ate la!
