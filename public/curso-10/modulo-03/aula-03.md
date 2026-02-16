# Aula 3.3: Trade-offs: Custo, Velocidade, Imutabilidade, Privacidade, Escalabilidade

## Abertura
Bem-vindo a aula 3.3! Nas aulas anteriores estudamos a taxonomia e a arquitetura interna dos principais metodos DID. Agora vamos confronta-los diretamente em cinco dimensoes criticas de engenharia: custo, velocidade, imutabilidade, privacidade e escalabilidade. O objetivo e construir um framework analitico que permita avaliar objetivamente os trade-offs de cada metodo e fundamentar decisoes arquiteturais com rigor tecnico.

### Programa da aula:
1. Custo e velocidade operacional (introducao)
2. Imutabilidade e modelos de confianca (base e aprofundamento)
3. Privacidade e escalabilidade (Conceito principal da aula)

---

## 1. Custo e Velocidade Operacional

### 1.1 Modelo de custos por metodo
O custo de operar um metodo DID se decompoe em custos de **criacao**, **resolucao**, **atualizacao** e **infraestrutura**.

**did:ethr (Ethereum mainnet):**
- Criacao: 0 (implicita, sem transacao). Custo real surge na primeira escrita.
- Atualizacao (setAttribute): ~50.000-80.000 gas. A 30 gwei e ETH a $3.000, isso representa $4,50-$7,20 por operacao.
- Resolucao: gratuita (leitura de event logs, nao requer transacao).

**did:ethr (L2 - Polygon, Arbitrum):**
- Mesmas operacoes, mas custos 100-1000x menores. Uma setAttribute em Polygon pode custar $0,001-$0,01.

**did:ion:**
- Criacao: custo amortizado. Uma transacao Bitcoin (~$1-5) ancora milhares de operacoes.
- Custo por operacao individual: < $0,01 em cenarios de batch otimizado.
- Infraestrutura: requer no ION + no Bitcoin + IPFS (custo operacional significativo).

**did:web:**
- Criacao: custo do dominio (~$10-50/ano) + hosting (~$5-50/mes).
- Atualizacao: gratuita (editar arquivo no servidor).
- Resolucao: custo de bandwidth HTTP (desprezivel).

**did:key e did:peer:**
- Criacao: zero (computacao local).
- Resolucao: zero (algoritmica ou local).
- Infraestrutura: zero.

- **Exemplo**: Para um sistema que precisa emitir 1 milhao de credenciais com DIDs unicos, did:key tem custo total proximo a zero, enquanto did:ethr em mainnet custaria milhoes de dolares. Em uma L2, o custo cairia para algumas centenas de dolares.

### 1.2 Velocidade: latencia e throughput
A velocidade de um metodo DID se manifesta em duas dimensoes: **latencia por operacao** e **throughput** (operacoes por segundo).

| Metodo | Latencia de criacao | Latencia de resolucao | Throughput teorico |
|--------|--------------------|-----------------------|-------------------|
| did:ethr (mainnet) | 15-60s (confirmacao de bloco) | 1-5s (query event logs) | ~15 TPS (limitado pela rede) |
| did:ethr (L2) | 2-10s | 500ms-2s | 100-2000 TPS |
| did:ion | Minutos a horas (batch + confirmacao Bitcoin) | 1-10s (query no ION) | Alto (batching) |
| did:web | Imediata (deploy do arquivo) | 100-500ms (HTTP GET) | Ilimitado (escalabilidade web) |
| did:key | <1ms (geracao de chave) | <1ms (decodificacao) | Ilimitado (local) |
| did:peer | <10ms (geracao + troca) | <1ms (cache local) | Ilimitado (local) |

- **Exemplo**: Um sistema de autenticacao em tempo real que precisa resolver DIDs em menos de 100ms descarta did:ion e did:ethr (mainnet) por latencia. did:key ou did:web com cache sao opcoes viaveis.

### 1.3 Custo oculto: infraestrutura de resolucao
Alem dos custos diretos de operacao, cada metodo exige infraestrutura de resolucao:

- **did:ethr**: no Ethereum (ou provedor como Infura/Alchemy). Custo: $50-500/mes para acesso a API.
- **did:ion**: no ION completo (Bitcoin full node + IPFS + servico Sidetree). Custo: hardware dedicado, $100-300/mes em cloud.
- **did:web**: nenhuma infraestrutura especial — cliente HTTP padrao.
- **did:key/did:peer**: nenhuma — resolucao local.

O **Universal Resolver** da DIF abstrai essa complexidade, mas ele proprio requer infraestrutura para hospedar os drivers de cada metodo.

---

## 2. Imutabilidade e Modelos de Confianca

### 2.1 Espectro de imutabilidade
A imutabilidade do historico de operacoes DID e um aspecto critico para auditoria e nao-repudio. Os metodos se posicionam em um espectro:

**Imutabilidade maxima — did:ion:**
- Operacoes ancoradas no Bitcoin, a blockchain mais resistente a reorganizacoes.
- Historico completo e publicamente verificavel.
- Mesmo que o servico ION deixe de existir, as ancoras Bitcoin permanecem.

**Imutabilidade alta — did:ethr:**
- Historico de eventos no Ethereum e imutavel apos finalizacao (~15 minutos em PoS).
- Vulneravel a reorganizacoes em L2s com periodos de challenge mais curtos.
- Historico auditavel via event logs.

**Imutabilidade media — did:sov/did:indy:**
- Ledger permissionado com consenso BFT. Imutavel dentro do consorcio.
- Depende da continuidade do consorcio operador (risco de governanca).

**Imutabilidade baixa — did:web:**
- Nenhum registro imutavel de alteracoes. O operador pode modificar o DID Document sem rastro.
- Pode ser mitigado com signed timestamps ou integracao com Transparency Logs.

**Sem imutabilidade — did:key:**
- Imutavel por natureza (nao pode ser alterado), mas nao ha historico pois nao ha operacoes de atualizacao.

- **Exemplo**: Para um caso de uso regulatorio onde um auditor precisa verificar que uma credencial foi emitida por um DID que existia em uma data especifica, did:ethr e did:ion oferecem provas criptograficas on-chain. did:web nao oferece essa garantia sem mecanismos adicionais.

### 2.2 Resistencia a censura
A resistencia a censura mede a dificuldade de um ator (governamental ou corporativo) impedir operacoes DID:

- **did:ion/did:ethr (mainnet)**: Maxima. Redes publicas permissionless nao podem censurar transacoes individuais com facilidade.
- **did:ethr (L2)**: Alta, mas o sequencer da L2 pode censurar temporariamente. Mecanismos de forced inclusion mitigam (ex: envio direto para L1).
- **did:sov/did:indy**: Media. Nos validadores sao operados por um consorcio que pode recusar transacoes.
- **did:web**: Baixa. O dominio pode ser apreendido por ordem judicial, o provedor de hosting pode suspender o servico.
- **did:key/did:peer**: Total (nao ha infraestrutura para censurar).

### 2.3 Modelo de confianca e pressupostos de seguranca
Cada metodo faz pressupostos implicitos sobre quem e confiavel:

| Metodo | Trust anchor | Pressuposto |
|--------|-------------|-------------|
| did:ethr | Consenso Ethereum | Maioria dos validadores e honesta |
| did:ion | Consenso Bitcoin | Maioria do hashrate e honesta |
| did:sov/did:indy | Consorcio Sovrin | Maioria dos stewards e honesta |
| did:web | DNS + CA + operador | Dominio, CA e operador sao confiaveis |
| did:key | Criptografia | Algoritmo criptografico e seguro |
| did:peer | Criptografia + peer | Peer e criptografia sao confiaveis |

- **Exemplo**: Um sistema onde nenhuma entidade individual deve poder revogar a identidade de um usuario deve evitar did:web (operador controla) e did:sov (consorcio controla), favorecendo did:ethr ou did:ion.

---

## 3. Privacidade e Escalabilidade

### 3.1 Propriedades de privacidade
A privacidade em metodos DID envolve multiplas dimensoes:

**Correlacionabilidade:**
- **did:ethr / did:ion**: DIDs publicos on-chain sao correlacionaveis. Qualquer observador pode rastrear todas as operacoes de um DID.
- **did:web**: O operador do dominio e provedores de rede podem observar resolucoes.
- **did:peer**: Correlacionavel apenas pelas duas partes envolvidas. Uso de DIDs pairwise diferentes para cada relacao impede correlacao entre relacoes.
- **did:key**: Correlacionavel se reutilizado. Privacidade depende de rotacao frequente (gerar novos did:key).

**Selective disclosure e ZKP:**
- **did:sov/did:indy**: Suporte nativo a AnonCreds com provas de conhecimento zero. O holder pode provar atributos sem revelar a credencial completa ou o identificador.
- **Outros metodos**: Selective disclosure possivel com formatos como SD-JWT ou BBS+ Signatures, independente do metodo DID.

- **Exemplo**: Em um sistema de verificacao de idade, did:sov com AnonCreds permite provar "idade >= 18" sem revelar a data de nascimento, o nome ou o DID do holder. Com did:ethr, o DID publico pode ser usado para correlacionar multiplas verificacoes.

### 3.2 Herd privacy e pairwise DIDs
O conceito de **herd privacy** e central para avaliar metodos DID: a capacidade de um individuo se "esconder na multidao".

- **did:peer**: Maximiza herd privacy. Cada relacao usa um DID diferente, impossibilitando correlacao externa.
- **did:key**: Pode oferecer herd privacy se gerado unicamente para cada interacao.
- **Metodos on-chain**: Comprometem herd privacy se o mesmo DID for usado em multiplos contextos. Mitigacao possivel com DIDs derivados ou hierarquicos.

**Padrao arquitetural recomendado:**
- DID publico (did:ethr ou did:web) para a identidade organizacional.
- DIDs pairwise (did:peer) para cada relacao individual.
- DIDs efemeros (did:key) para operacoes descartaveis.

### 3.3 Escalabilidade: operacoes e armazenamento
A escalabilidade de um metodo DID e limitada por:

**Throughput de escritas:**
- **did:ethr (mainnet)**: ~15 TPS compartilhado com todo o ecossistema Ethereum.
- **did:ethr (L2)**: 100-4000 TPS dependendo da L2.
- **did:ion**: Virtualmente ilimitado em termos de criacao (batching), mas a latencia de ancoragem depende de blocos Bitcoin (~10 min).
- **did:web**: Ilimitado (apenas limites do servidor web).
- **did:key/did:peer**: Ilimitado (computacao local).

**Armazenamento por DID:**
- **did:ethr**: Event logs crescem proporcionalmente ao numero de operacoes por DID.
- **did:ion**: Dados no IPFS + ancoras Bitcoin. Armazenamento distribuido.
- **did:sov/did:indy**: Ledger cresce com cada NYM transaction. Nos validadores armazenam historico completo.
- **did:web**: Proporcional ao tamanho do DID Document. Escalabilidade de armazenamento web.
- **did:key**: Zero (gerado algoritmicamente).

### 3.4 Matriz comparativa consolidada
Consolidando todas as dimensoes em uma matriz de decisao:

| Dimensao | did:ethr L2 | did:ion | did:web | did:key | did:peer | did:sov |
|----------|------------|---------|---------|---------|----------|---------|
| Custo operacional | Baixo | Medio* | Baixo | Zero | Zero | Medio |
| Latencia resolucao | Media | Alta | Baixa | Minima | Minima | Media |
| Imutabilidade | Alta | Maxima | Baixa | N/A | N/A | Media |
| Resistencia censura | Alta | Maxima | Baixa | Total | Total | Media |
| Privacidade | Baixa | Baixa | Media | Media** | Alta | Alta*** |
| Escalabilidade | Alta | Alta | Maxima | Maxima | Maxima | Media |

*Custo de infraestrutura ION. **Se gerado por interacao. ***Com AnonCreds.

- **Exemplo**: Nao existe metodo "melhor" universalmente. A escolha depende de quais dimensoes sao prioritarias para o caso de uso especifico.

---

## Conclusao
Nesta aula construimos um framework analitico para comparar metodos DID em cinco dimensoes: custo, velocidade, imutabilidade, privacidade e escalabilidade. Demonstramos que cada metodo faz trade-offs fundamentais entre essas dimensoes, e que a escolha de metodo e uma decisao de engenharia que deve ser guiada pelos requisitos especificos do sistema. A matriz comparativa consolidada serve como ferramenta de referencia para decisoes arquiteturais.

---

## Licao de Casa
1. Escolha um caso de uso real (ex: identidade para supply chain, credenciais de saude, autenticacao IoT) e aplique a matriz comparativa para selecionar o metodo DID mais adequado. Documente os trade-offs aceitos e as mitigacoes propostas.
2. Pesquise o custo medio atual de uma transacao setAttribute em did:ethr na Ethereum mainnet vs Polygon vs Arbitrum. Monte uma tabela comparativa com dados reais das ultimas 30 dias.
3. Implemente uma prova de conceito que demonstre o problema de correlacao em metodos on-chain: crie dois DIDs did:key diferentes para o mesmo usuario e mostre como um observador externo nao consegue correlaciona-los, em contraste com um unico did:ethr usado em multiplos contextos.

---

## Proxima Aula
Na proxima aula, vamos sintetizar todo o conhecimento adquirido neste modulo para definir criterios objetivos de escolha do metodo DID adequado a cada caso de uso. Construiremos uma arvore de decisao pratica e analisaremos estudos de caso reais. Ate la!

---

## Questionario

**1. Qual e o custo aproximado de uma operacao setAttribute em did:ethr na Ethereum mainnet comparado a uma L2 como Polygon?**
a) O custo e identico em ambas as redes, pois o contrato e o mesmo
b) Mainnet custa $4-7 por operacao, enquanto Polygon custa $0,001-$0,01 — uma reducao de 100-1000x
c) Polygon e mais caro devido a taxas adicionais de bridge
d) Ambas as redes oferecem operacoes gratuitas para DIDs
**Resposta: b**

**2. Por que did:ion oferece a maior imutabilidade entre os metodos analisados?**
a) Porque utiliza criptografia pos-quantica que impede alteracoes
b) Porque as operacoes sao ancoradas no Bitcoin, a blockchain mais resistente a reorganizacoes, e mesmo que o servico ION deixe de existir, as ancoras permanecem
c) Porque o protocolo Sidetree armazena dados em multiplos datacenters redundantes
d) Porque o IPFS garante imutabilidade por design via content addressing
**Resposta: b**

**3. Qual propriedade de privacidade o did:peer maximiza que metodos on-chain nao oferecem nativamente?**
a) Criptografia end-to-end das comunicacoes
b) Anonimato total do detentor do DID perante autoridades
c) Herd privacy via DIDs pairwise diferentes para cada relacao, impedindo correlacao externa entre relacoes
d) Protecao contra ataques de forca bruta na chave privada
**Resposta: c**

**4. Qual e o principal custo oculto na operacao de did:ion que nao existe em metodos como did:key?**
a) Taxas de licenciamento do protocolo Sidetree
b) Infraestrutura significativa: no ION completo requer Bitcoin full node, IPFS e servico Sidetree
c) Custos de certificacao junto a W3C
d) Pagamentos recorrentes a Decentralized Identity Foundation
**Resposta: b**

**5. Em um sistema que prioriza resistencia a censura e privacidade simultaneamente, qual combinacao de metodos e mais adequada?**
a) did:web para identidade publica + did:ethr para credenciais
b) did:sov para todas as operacoes, pois o consorcio garante ambas as propriedades
c) did:ethr ou did:ion para ancoragem publica resistente a censura + did:peer para interacoes privadas pairwise
d) did:key exclusivamente, pois nao depende de nenhuma infraestrutura
**Resposta: c**
