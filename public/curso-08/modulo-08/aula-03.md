# Aula 8.3: Resolucao cross-chain e interoperabilidade entre metodos

## Abertura
Bem-vindo a aula 8.3! Nesta aula, vamos enfrentar um dos desafios mais complexos do ecossistema de identidade descentralizada: como resolver DIDs e verificar credenciais de forma consistente atraves de multiplas blockchains, redes e metodos DID. Quando um verificador na Polygon recebe uma credencial emitida por um DID registrado na Ethereum mainnet e assinada com um metodo `did:key`, como ele valida tudo isso? A interoperabilidade cross-chain e cross-method e o que separa demos de producao.

### Programa da aula:
1. O problema da fragmentacao de metodos DID (introducao)
2. Mecanismos de resolucao cross-chain (base e aprofundamento)
3. Interoperabilidade pratica entre metodos e ecossistemas (Conceito principal da aula)

---

## 1. O problema da fragmentacao de metodos DID

### O estado atual dos metodos DID
O W3C DID Core Specification define a estrutura generica de DIDs, mas delega a implementacao concreta para DID Methods — cada um com seu proprio mecanismo de registro, resolucao e atualizacao. Ate o momento, existem mais de 150 DID Methods registrados no W3C DID Method Registry, e cada um faz escolhas arquiteturais diferentes.

Essa diversidade e intencional: diferentes casos de uso demandam diferentes trade-offs. O `did:web` e ideal para organizacoes que querem uma solucao simples baseada em DNS. O `did:ethr` aproveita a infraestrutura Ethereum. O `did:ion` usa Bitcoin para ancoragem de alta seguranca. O `did:key` nao precisa de nenhuma blockchain. Mas essa diversidade cria um problema: como um verificador suporta todos esses metodos?

- **Exemplo**: Uma empresa brasileira emite credenciais de formacao profissional usando `did:web:empresa.com.br`. Um verificador na Europa usa `did:ebsi` (o metodo da infraestrutura blockchain europeia). Um usuario quer apresentar a credencial brasileira ao verificador europeu. O verificador precisa resolver `did:web`, que ele nunca usou, validar a assinatura e confiar no resultado — tudo isso de forma automatizada.

### Dimensoes da fragmentacao
A fragmentacao ocorre em multiplas dimensoes simultaneas:

**Fragmentacao de resolucao**: Cada metodo DID tem seu proprio resolver. Resolver `did:ethr` requer acesso a um node Ethereum ou RPC provider. Resolver `did:ion` requer acesso ao Sidetree node ou API publica. Resolver `did:web` requer uma requisicao HTTPS. Um sistema que precisa suportar multiplos metodos deve manter multiplos resolvers.

**Fragmentacao de formato**: DID Documents podem ser serializados em JSON, JSON-LD ou CBOR. Metodos de verificacao podem usar `Ed25519VerificationKey2020`, `EcdsaSecp256k1VerificationKey2019`, `JsonWebKey2020`, entre outros. Cada combinacao exige logica de parsing diferente.

**Fragmentacao de confianca**: O modelo de confianca varia entre metodos. Em `did:web`, a confianca depende de DNS e TLS. Em `did:ethr`, depende da seguranca da rede Ethereum. Em `did:key`, nao ha registro externo — a confianca e puramente criptografica. Um verificador precisa avaliar o nivel de seguranca de cada metodo.

- **Exemplo**: Um resolver universal recebe `did:ion:EiD3...`. Ele precisa: (1) identificar o metodo como ION, (2) conectar a um node ION ou API, (3) recuperar o DID Document em formato Sidetree, (4) normalizar para JSON-LD, (5) extrair chaves publicas no formato correto, (6) retornar o resultado. Se o mesmo resolver receber `did:key:z6Mk...`, o fluxo e completamente diferente — o DID Document e derivado matematicamente da propria string DID.

---

## 2. Mecanismos de resolucao cross-chain

### Universal Resolver: a abordagem de gateway
O Universal Resolver, mantido pela DIF (Decentralized Identity Foundation), e um servico que agrega multiplos DID method drivers em uma unica API. A interface e simples: `GET /1.0/identifiers/{did}` retorna o DID Document resolvido, independentemente do metodo.

Internamente, o Universal Resolver roteia a requisicao para o driver apropriado baseado no prefixo do metodo. Cada driver e um container Docker isolado que implementa a logica de resolucao especifica. A DIF mantem drivers para mais de 40 metodos, e a comunidade contribui com drivers adicionais.

O deploy pode ser local (para autonomia total), hosted (usando instancias publicas como `dev.uniresolver.io`) ou hibrido. Para ambientes de producao, o deploy local e recomendado para evitar dependencia de terceiros e garantir disponibilidade.

- **Exemplo**: Uma aplicacao de saude precisa verificar credenciais de medicos emitidas por diferentes conselhos regionais, cada um usando um metodo DID diferente. Ela deploya um Universal Resolver local com drivers para `did:web`, `did:ethr`, `did:ion` e `did:ebsi`. Qualquer credencial recebida e resolvida pela mesma API, independentemente da origem.

### Resolucao cross-chain para did:ethr
O metodo `did:ethr` foi projetado nativamente para suporte multi-chain. Um DID `did:ethr:` pode incluir o chain ID para especificar em qual rede o registro esta: `did:ethr:0x89:0xABC...` indica Polygon (chain ID 137 = 0x89), enquanto `did:ethr:0x1:0xABC...` indica Ethereum mainnet.

O ERC-1056 (Ethereum Lightweight Identity) define o contrato `EthereumDIDRegistry` que pode ser deployado em qualquer rede EVM-compativel. O resolver `did:ethr` precisa manter uma lista de RPC endpoints por chain ID e rotear a resolucao para a rede correta. Projetos como `ethr-did-resolver` do Veramo ja suportam configuracao multi-chain.

Porem, um desafio emerge: se um DID e registrado na Polygon mas o verificador so tem acesso a Ethereum mainnet, como resolver? Solucoes incluem bridges de estado (state bridges), oracles que replicam registros entre chains, e resolvers que consultam multiplas redes em paralelo.

- **Exemplo**: Uma credencial e emitida por um Issuer cujo DID `did:ethr:0x89:0xDEF...` esta registrado na Polygon. O verificador, operando na Arbitrum, configura seu `ethr-did-resolver` com RPC endpoints para ambas as redes: `{ "polygon": "https://polygon-rpc.com", "arbitrum": "https://arb1.arbitrum.io/rpc" }`. O resolver identifica o chain ID `0x89` e consulta a Polygon diretamente.

### DID-linked Resources e ancoragem cross-chain
O conceito de DID-linked Resources (DLRs), padronizado pelo cheqd, permite vincular recursos arbitrarios (schemas, listas de revogacao, imagens, documentos legais) diretamente a um DID. Isso e relevante para cross-chain porque um recurso pode estar ancorado em uma chain diferente do DID que o referencia.

O padrao define uma URI estruturada: `did:cheqd:mainnet:abc123/resources/def456` que permite ao resolver localizar o recurso associado. Essa abordagem resolve o problema de "onde esta o schema?" ou "onde esta a lista de revogacao?" de forma DID-nativa, sem depender de URLs HTTP que podem mudar ou ficar indisponiveis.

- **Exemplo**: Um consorcio bancario usa `did:cheqd` para seus DIDs institucionais, mas armazena schemas de credenciais de KYC como DID-linked Resources. Quando um banco emite uma credencial, ela referencia `did:cheqd:mainnet:bank123/resources/kyc-schema-v2`. Qualquer verificador pode resolver esse URI para obter o schema completo e validar a estrutura da credencial.

---

## 3. Interoperabilidade pratica entre metodos e ecossistemas

### Trust Registries: ancorando confianca entre ecossistemas
Resolver um DID e tecnicamente insuficiente — o verificador tambem precisa saber se o emissor e confiavel. Trust Registries sao listas curadas de DIDs autorizados a emitir certos tipos de credenciais em determinados contextos. Eles funcionam como a camada de governanca sobre a camada tecnica.

O Trust over IP Foundation (ToIP) define um modelo de Trust Registry em quatro niveis: Nivel 1 (utilidades publicas como blockchains), Nivel 2 (protocolos DID/VC), Nivel 3 (troca de credenciais) e Nivel 4 (governanca e ecossistema). Trust Registries operam no Nivel 4, definindo quem pode emitir o que.

Para interoperabilidade cross-ecosystem, Trust Registries podem ser federados: o Trust Registry europeu (EBSI) reconhece emissores do Trust Registry brasileiro, e vice-versa. Isso cria uma rede de confianca internacional sem exigir que todos usem o mesmo metodo DID ou a mesma blockchain.

- **Exemplo**: O EBSI (European Blockchain Services Infrastructure) mantem um Trust Registry de universidades europeias autorizadas a emitir diplomas digitais. O MEC brasileiro poderia manter um registro equivalente. Um acordo bilateral permitiria que diplomas emitidos por universidades brasileiras (usando `did:web`) fossem reconhecidos pelo verificador europeu (usando `did:ebsi`), desde que o emissor conste no Trust Registry federado.

### Presentation Exchange como lingua franca
O formato Presentation Exchange (PE), definido pela DIF, serve como protocolo de negociacao interoperavel entre holder e verifier. Independentemente do metodo DID do emissor ou do formato da credencial, o PE define uma linguagem comum para expressar requisitos e respostas.

Um `presentation_definition` pode especificar multiplas alternativas: "aceito credenciais em formato JWT-VC assinadas com ES256, OU em formato LDP-VC assinadas com Ed25519, OU em formato SD-JWT". Isso permite que verificadores aceitem credenciais de diferentes ecossistemas sem exigir uniformidade.

O PE tambem suporta `submission_requirements` com logica booleana: "preciso de (credencial A E credencial B) OU credencial C". Isso permite expressoes sofisticadas de requisitos que transcendem ecossistemas individuais.

- **Exemplo**: Um verificador no setor de aviacao define um `presentation_definition` que aceita: (1) passaporte digital em formato mdoc (ISO 18013-5) emitido por qualquer autoridade no Trust Registry da ICAO, OU (2) credencial de identidade em formato SD-JWT emitida por qualquer governo no TRAIN Trust Registry, OU (3) credencial de identidade em formato JWT-VC emitida por emissores no EBSI. O holder, independentemente do seu ecossistema, pode satisfazer o requisito se possuir qualquer uma dessas credenciais.

### DID Method interoperability via did:peer e did:key
Para comunicacoes ponto-a-ponto onde nenhuma das partes precisa de um DID registrado publicamente, os metodos `did:peer` e `did:key` oferecem interoperabilidade maxima porque nao dependem de nenhuma blockchain.

O `did:key` codifica a chave publica diretamente na string do DID. Qualquer sistema que suporte as primitivas criptograficas pode resolver um `did:key` sem acesso a rede. O `did:peer` vai alem, permitindo DIDs efemeros que existem apenas no contexto de uma conexao especifica entre duas partes (usando o protocolo DIDComm).

Essa abordagem e particularmente util como "minimo denominador comum": quando dois sistemas nao suportam os metodos DID um do outro, podem negociar usando `did:key` para troca de credenciais. A credencial em si pode referenciar o DID registrado do emissor, mas a camada de transporte usa `did:key` para simplicidade.

- **Exemplo**: Um sistema de saude brasileiro (`did:web`) precisa trocar credenciais com um sistema argentino (`did:lac`). Nenhum suporta o metodo do outro. Eles estabelecem um canal DIDComm usando `did:peer`, trocam Verifiable Presentations, e cada lado resolve o DID do emissor da credencial usando seu Universal Resolver local. O `did:peer` serve apenas como canal de transporte seguro.

### Status lists interoperaveis
A verificacao de revogacao e outro ponto critico de interoperabilidade. Diferentes ecossistemas usam diferentes mecanismos: Revocation List 2020 (bitstring comprimido), Status List 2021 (evolucao do anterior), accumulator-based revocation (Hyperledger Indy), e on-chain revocation registries (did:ethr).

O W3C Bitstring Status List padroniza uma abordagem interoperavel: o emissor publica uma URL contendo um bitstring comprimido com gzip, onde cada bit representa o status de uma credencial. O verificador faz download da lista e verifica o bit correspondente ao `credentialIndex` da credencial. Esse formato e independente de blockchain e pode ser hospedado em qualquer servidor HTTP, IPFS ou mesmo como DID-linked Resource.

- **Exemplo**: Um emissor com `did:ethr` na Polygon publica sua Status List em `https://issuer.example.com/status/1`. A credencial contém `"credentialStatus": { "type": "BitstringStatusListEntry", "statusListIndex": "42", "statusListCredential": "https://issuer.example.com/status/1" }`. O verificador, independentemente da sua infraestrutura, faz GET na URL, descomprime o bitstring e verifica se o bit 42 e 0 (valido) ou 1 (revogado).

---

## Conclusao
Nesta aula, mapeamos o problema da fragmentacao no ecossistema de identidade descentralizada e exploramos solucoes praticas para cada dimensao. Vimos que o Universal Resolver agrega drivers de multiplos metodos em uma API unificada, que o `did:ethr` suporta resolucao multi-chain via chain IDs, que Trust Registries federados estabelecem confianca entre ecossistemas, e que formatos como Presentation Exchange e Bitstring Status List criam interfaces comuns que transcendem metodos e blockchains individuais. A interoperabilidade nao e um problema unico — e um conjunto de problemas que requer solucoes em cada camada da stack.

---

## Licao de Casa
1. Deploy uma instancia local do Universal Resolver usando Docker e teste a resolucao de pelo menos 3 metodos DID diferentes (`did:key`, `did:web`, `did:ethr`). Documente as diferencas nos DID Documents retornados.
2. Escreva um `presentation_definition` no formato Presentation Exchange que aceite credenciais de KYC em tres formatos diferentes (JWT-VC, SD-JWT, LDP-VC) e exija pelo menos os campos `name` e `date_of_birth`.
3. Pesquise o mecanismo de Trust Registry do EBSI europeu e compare com a abordagem do TRAIN (Trust Management Infrastructure). Identifique pontos de convergencia e divergencia.

---

## Proxima Aula
Na proxima aula, vamos olhar para o futuro: o roadmap tecnico de identidade descentralizada para 2026-2028, incluindo DID 2.0, zkDIDs (DIDs baseados em provas de conhecimento zero) e preparacao para resistencia quantica. Exploraremos como a proxima geracao de padroes vai resolver limitacoes atuais e quais decisoes tecnicas voce deve tomar hoje pensando no amanha. Ate la!

---

## Questionario

**1. Qual e a funcao principal do Universal Resolver?**
a) Criar novos DIDs em qualquer blockchain automaticamente
b) Agregar multiplos DID method drivers em uma unica API de resolucao
c) Substituir todos os metodos DID por um metodo universal unico
d) Armazenar DID Documents em um banco de dados centralizado
**Resposta: b**

**2. Como o metodo did:ethr suporta resolucao cross-chain?**
a) Replicando todos os registros em todas as redes EVM automaticamente
b) Incluindo o chain ID na string do DID para especificar a rede de registro
c) Usando apenas a Ethereum mainnet como fonte unica de verdade
d) Convertendo todos os DIDs para did:key antes da resolucao
**Resposta: b**

**3. Qual e o papel dos Trust Registries na interoperabilidade entre ecossistemas?**
a) Substituir a verificacao criptografica por verificacao manual
b) Definir quais DIDs estao autorizados a emitir certos tipos de credenciais em determinados contextos
c) Armazenar todas as Verifiable Credentials de forma centralizada
d) Converter credenciais entre diferentes formatos automaticamente
**Resposta: b**

**4. Por que did:key e considerado um "minimo denominador comum" para interoperabilidade?**
a) Porque e o metodo DID mais antigo e todos ja o implementaram
b) Porque armazena dados em todas as blockchains simultaneamente
c) Porque nao depende de nenhuma blockchain e pode ser resolvido por qualquer sistema que suporte as primitivas criptograficas
d) Porque e obrigatorio pela especificacao W3C DID Core
**Resposta: c**

**5. Como a Bitstring Status List padroniza a verificacao de revogacao de forma interoperavel?**
a) Registrando cada revogacao como transacao em blockchain publica
b) Usando um bitstring comprimido hospedado em URL acessivel, onde cada bit representa o status de uma credencial
c) Enviando notificacoes push para todos os verificadores quando uma credencial e revogada
d) Mantendo um banco de dados SQL consultavel por todos os verificadores
**Resposta: b**