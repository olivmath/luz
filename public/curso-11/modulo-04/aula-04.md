# Aula 4.4: Roadmap tecnico 2026-2028: DID 2.0, zkDIDs, resistencia quantica

## Abertura
Bem-vindo a aula 4.4! Nesta aula, vamos explorar o horizonte tecnico da identidade descentralizada para os proximos anos. O ecossistema DID/VC esta em rapida evolucao, e decisoes arquiteturais que voce toma hoje precisam considerar o que vem pela frente. Vamos analisar tres frentes criticas: a evolucao da especificacao DID Core para a versao 2.0, o surgimento de zkDIDs (identidades baseadas integralmente em provas de conhecimento zero) e a preparacao para a era pos-quantica, quando algoritmos criptograficos atuais podem se tornar vulneraveis.

### Programa da aula:
1. DID Core 2.0: evolucao da especificacao W3C (introducao)
2. zkDIDs: identidade baseada em provas de conhecimento zero (base e aprofundamento)
3. Criptografia pos-quantica e preparacao para resistencia quantica (Conceito principal da aula)

---

## 1. DID Core 2.0: evolucao da especificacao W3C

### Limitacoes do DID Core 1.0
O DID Core 1.0, publicado como W3C Recommendation em julho de 2022, estabeleceu os fundamentos da identidade descentralizada. Porem, a experiencia pratica de implementacao revelou limitacoes que a versao 2.0 busca resolver.

A primeira limitacao e a ambiguidade no modelo de dados. O DID Core 1.0 permite representacoes em JSON e JSON-LD, mas as regras de processamento diferem sutilmente entre os dois formatos, causando problemas de interoperabilidade. Implementacoes que tratam DID Documents como JSON puro podem ignorar semantica definida pelo contexto JSON-LD, e vice-versa.

A segunda limitacao e a falta de padronizacao nos metadados de resolucao. O DID Resolution spec define campos como `deactivated`, `versionId` e `nextUpdate`, mas cada metodo os implementa de forma diferente ou simplesmente os ignora.

- **Exemplo**: Um DID Document contendo `"@context": ["https://www.w3.org/ns/did/v1"]` e processado como JSON-LD por uma implementacao, que expande todas as propriedades para URIs completas. Outra implementacao trata o mesmo documento como JSON puro, ignorando o `@context`. Quando ambas tentam validar a mesma assinatura, podem chegar a resultados diferentes porque a canonicalizacao do documento difere.

### Propostas para DID Core 2.0
O W3C DID Working Group esta desenvolvendo a versao 2.0 com foco em tres areas:

**Simplificacao do modelo de dados**: A proposta e adotar um unico formato de serializacao base (provavelmente JSON com contextos opcionais) e definir regras de processamento nao-ambiguas. Isso elimina a dualidade JSON/JSON-LD que causa confusao e bugs de interoperabilidade.

**Extensibilidade tipada**: O DID Core 2.0 propoe um sistema de tipos mais robusto para verification methods. Em vez de strings como `Ed25519VerificationKey2020`, o sistema usara referencias a specs externas com versionamento explicito, permitindo que novos algoritmos (incluindo pos-quanticos) sejam adicionados sem alterar a spec core.

**DID Traits**: Um conceito proposto que permite a DID Methods declararem formalmente quais capacidades suportam (criacao, atualizacao, desativacao, rotacao de chaves, resolucao offline, etc.). Isso permite que aplicacoes escolham metodos baseados em requisitos funcionais verificaveis, em vez de avaliar documentacao ad-hoc.

- **Exemplo**: Com DID Traits, uma aplicacao que exige rotacao de chaves pode consultar programaticamente quais metodos suportam essa capacidade. O `did:key` declararia `rotation: false` (chave e identidade sao inseparaveis), enquanto `did:ethr` declararia `rotation: true`. Isso automatiza a selecao de metodos em vez de depender de decisoes manuais.

### Verifiable Credentials 2.0
Paralelamente ao DID Core 2.0, a especificacao Verifiable Credentials tambem evolui. O VC Data Model 2.0 (ja em fase avancada de padronizacao) introduz mudancas significativas:

**Securing mechanisms desacoplados**: As provas criptograficas sao separadas do modelo de dados em specs independentes: VC-JOSE-COSE (para JWTs e CBOR tokens) e Data Integrity (para provas embedded em JSON-LD). Isso permite que o mesmo modelo de dados funcione com diferentes mecanismos de seguranca.

**Confidence method**: Um novo campo que permite ao emissor declarar o nivel de confianca na veracidade dos claims. Em vez de apenas assinar, o emissor pode indicar "verifiquei presencialmente" versus "auto-declarado pelo titular".

**Evidence property padronizada**: Permite referenciar evidencias que suportam os claims da credencial, como biometria, documentos escaneados ou resultados de verificacao automatizada.

- **Exemplo**: Uma credencial de vacinacao VC 2.0 poderia incluir: `"confidenceMethod": [{"type": "InPersonVerification", "verifier": "did:web:hospital.example"}]` indicando que a vacinacao foi verificada presencialmente, e `"evidence": [{"type": "DocumentEvidence", "document": "CRM-12345"}]` referenciando o registro medico.

---

## 2. zkDIDs: identidade baseada em provas de conhecimento zero

### O conceito de zkDIDs
zkDIDs representam uma evolucao paradigmatica: em vez de simplesmente usar ZKPs como mecanismo de apresentacao de credenciais, a propria identidade e fundamentada em provas de conhecimento zero. O DID nao revela nenhuma informacao sobre o titular — nem mesmo uma chave publica ou endereco blockchain — ate que o titular decida provar algo especifico.

Em um zkDID, o identificador e derivado de um commitment criptografico (por exemplo, um hash Poseidon de um segredo privado). O titular pode provar que controla o DID gerando uma ZKP sem revelar o segredo. Pode provar que possui credenciais emitidas para esse DID sem revelar quais credenciais. E pode interagir com multiplos verificadores sem que estes possam correlacionar as interacoes.

- **Exemplo**: Alice possui `did:zk:0xCOMMITMENT`. Para provar que tem mais de 18 anos a um bar, ela gera uma prova que atesta: "Eu controlo o DID cujo commitment e 0xCOMMITMENT, e possuo uma credencial de idade emitida por did:web:gov.br para este DID, onde idade >= 18". O bar verifica a prova matematicamente sem aprender nada sobre Alice alem do fato provado.

### Arquiteturas emergentes de zkDIDs
Varios projetos estao explorando zkDIDs com abordagens distintas:

**Semaphore/Worldcoin**: O protocolo Semaphore permite que membros de um grupo gerem sinais anonimos provando pertencimento ao grupo sem revelar qual membro sao. O Worldcoin usa uma variante para prova de humanidade unica. O identity commitment e `hash(identity_nullifier, identity_trapdoor)`, e provas sao geradas usando circuitos Groth16.

**Iden3/Polygon ID**: Usa arvores Merkle esparsas (Sparse Merkle Trees) para armazenar claims de identidade. Cada claim e um no na arvore, e o titular pode gerar provas Merkle seletivas mostrando que certos claims existem em sua arvore de identidade sem revelar outros claims. Circuitos Circom/Groth16 validam as provas on-chain.

**zk-creds (pesquisa academica)**: Propostas academicas como zk-creds e zkLogin (Sui) exploram esquemas onde credenciais sao commitments que podem ser abertos seletivamente usando ZKPs. O titular nunca revela a credencial completa — apenas provas de propriedades especificas.

- **Exemplo**: No Polygon ID, um usuario recebe um claim de cidadania brasileira emitido pelo governo. O claim e inserido na arvore Merkle de identidade do usuario. Para provar cidadania a um servico, o usuario gera uma prova ZKP mostrando: (1) existe um claim na minha arvore, (2) o emissor desse claim e `did:polygonid:gov-br`, (3) o tipo do claim e "citizenship" com valor "BR". O servico verifica a prova sem ver a arvore completa.

### Desafios tecnicos dos zkDIDs
A implementacao de zkDIDs em producao enfrenta obstaculos significativos:

**Custo computacional de provas**: Gerar provas Groth16 para circuitos complexos pode levar segundos em hardware moderno e dezenas de segundos em dispositivos moveis. Provas PLONK e Halo2 reduzem o tempo, mas ainda sao intensivas. Projetos como Nova e HyperNova prometem IVC (Incrementally Verifiable Computation) que pode reduzir drasticamente o custo.

**Trusted setup**: Esquemas como Groth16 exigem uma cerimonia de trusted setup por circuito. Se o toxic waste nao for destruido, provas falsas podem ser geradas. STARKs e esquemas baseados em hashing (como FRI) eliminam essa necessidade, mas geram provas maiores.

**Composabilidade de provas**: Um usuario pode precisar combinar provas de multiplas credenciais em uma unica apresentacao. Proof composition e um problema de pesquisa ativo — como provar propriedades sobre credenciais diferentes sem revelar qual credencial satisfaz qual requisito.

- **Exemplo**: Alice precisa provar simultaneamente: (1) tem mais de 21 anos (credencial de identidade), (2) tem saldo bancario acima de R$10.000 (credencial financeira), (3) nao esta em lista de sancoes (credencial de compliance). Com zkDIDs composiveis, ela geraria uma unica prova agregada que atesta as tres propriedades sem revelar idade exata, saldo ou identidade. A composicao dessas provas e o desafio central.

---

## 3. Criptografia pos-quantica e preparacao para resistencia quantica

### A ameaca quantica a identidade descentralizada
Computadores quanticos suficientemente poderosos (com milhares de qubits logicos corrigidos de erros) poderiam quebrar os algoritmos criptograficos que fundamentam toda a identidade descentralizada atual. O algoritmo de Shor pode fatorar numeros grandes em tempo polinomial, quebrando RSA, e resolver o problema do logaritmo discreto em curvas elipticas, quebrando ECDSA e EdDSA — exatamente os algoritmos usados em DIDs e VCs.

O NIST estimou em 2024 que computadores quanticos criptograficamente relevantes (CRQCs) podem emergir entre 2030 e 2040. Isso parece distante, mas o ataque "harvest now, decrypt later" (HNDL) torna a ameaca imediata: adversarios podem coletar dados cifrados e assinaturas digitais hoje e quebra-los quando tiverem acesso a computadores quanticos.

Para identidade descentralizada, isso significa que credenciais assinadas com ECDSA hoje podem ser forjadas no futuro. Um atacante poderia criar credenciais falsas retroativamente, comprometendo todo o historico de confianca.

- **Exemplo**: Uma credencial de diploma universitario emitida em 2026 com assinatura Ed25519 sera verificavel por decadas. Se em 2035 um computador quantico derivar a chave privada do emissor a partir da chave publica no DID Document, o atacante podera emitir diplomas falsos indistinguiveis dos reais. Pior: todos os diplomas ja emitidos com aquela chave perdem garantia de autenticidade.

### Algoritmos pos-quanticos padronizados pelo NIST
O NIST concluiu em 2024 a padronizacao de tres algoritmos pos-quanticos principais:

**ML-KEM (CRYSTALS-Kyber)**: Para encapsulamento de chaves (key encapsulation). Baseado em problemas de lattices (reticulados), especificamente Module Learning With Errors (MLWE). Oferece tres niveis de seguranca: ML-KEM-512 (nivel 1), ML-KEM-768 (nivel 3), ML-KEM-1024 (nivel 5). Relevante para troca de chaves em canais DIDComm.

**ML-DSA (CRYSTALS-Dilithium)**: Para assinaturas digitais. Tambem baseado em lattices. Chaves publicas de ~1.3KB e assinaturas de ~2.4KB (nivel 3) — significativamente maiores que Ed25519 (32 bytes chave, 64 bytes assinatura). Esse aumento de tamanho impacta DID Documents e VCs.

**SLH-DSA (SPHINCS+)**: Para assinaturas digitais baseadas em hashing. Nao depende de lattices, oferecendo diversidade de pressupostos de seguranca. Assinaturas muito maiores (~17KB no nivel rapido), mas baseadas apenas na seguranca de funcoes hash, consideradas extremamente conservadoras.

- **Exemplo**: Um DID Document pos-quantico usando ML-DSA teria um verification method com chave publica de ~1.3KB em vez de 32 bytes (Ed25519). Isso impacta diretamente o tamanho dos DID Documents, o custo de armazenamento on-chain e o tempo de resolucao. Uma credencial assinada com ML-DSA seria ~37x maior apenas na assinatura.

### Estrategias de migracao para identidade descentralizada
A transicao para criptografia pos-quantica em DIDs/VCs precisa ser gradual e compativel com sistemas existentes:

**Assinaturas hibridas**: A abordagem mais recomendada para o periodo de transicao. Uma credencial e assinada duplamente — com um algoritmo classico (Ed25519) E um pos-quantico (ML-DSA). Verificadores que suportam PQC verificam ambas; verificadores legados verificam apenas a classica. Quando a ameaca quantica se materializar, a assinatura pos-quantica garante a seguranca.

**Rotacao de chaves proativa**: DID Methods que suportam rotacao de chaves (como `did:ethr`, `did:ion`) devem migrar chaves para algoritmos PQC antes que a ameaca se concretize. O DID Document pode listar tanto chaves classicas quanto pos-quanticas durante o periodo de transicao.

**Re-emissao de credenciais**: Credenciais assinadas apenas com algoritmos classicos precisarao ser re-emitidas com assinaturas PQC. Isso exige coordenacao entre emissores e titulares e e provavelmente o aspecto mais desafiador da migracao.

**Hash-based commitments**: Para credenciais de longa duracao, uma alternativa e publicar um commitment baseado em hash (resistente a quanticos) da credencial em um registro imutavel. Mesmo que a assinatura seja quebrada, o commitment prova que a credencial existia antes da era quantica.

- **Exemplo**: Uma autoridade governamental emite certidoes de nascimento digitais que precisam ser validas por 100+ anos. A estrategia: (1) assinar com Ed25519 + ML-DSA (hibrido), (2) publicar hash SHA-3 do documento em blockchain como commitment, (3) planejar re-emissao com algoritmos PQC puros em 2028-2030, (4) rotacionar chaves do DID para ML-DSA quando o ecossistema tiver suporte amplo.

### Impacto no ecossistema DID/VC
A transicao pos-quantica afeta cada camada da stack de identidade descentralizada:

**DID Documents**: Novos tipos de verification methods (`Ml-dsa-44VerificationKey`, `Slh-dsa-shake-128fVerificationKey`) precisam ser padronizados e suportados por resolvers. O tamanho maior dos DID Documents impacta custos de armazenamento on-chain.

**Verifiable Credentials**: Novos securing mechanisms para VC-JOSE-COSE precisam suportar algoritmos PQC. O IETF ja trabalha em extensoes JOSE para ML-DSA e SLH-DSA.

**DIDComm**: O protocolo de comunicacao entre wallets precisa migrar de X25519 (ECDH) para ML-KEM para troca de chaves. O tamanho maior dos ciphertexts KEM impacta a eficiencia de mensagens.

**Wallets**: Dispositivos moveis precisam suportar geracao de chaves e assinaturas PQC. Bibliotecas como `liboqs` (Open Quantum Safe) ja oferecem implementacoes, mas a integracao em wallets de producao ainda e incipiente.

- **Exemplo**: O projeto NIST NCCoE (National Cybersecurity Center of Excellence) publicou um guia de migracao para PKI pos-quantica que se aplica diretamente a DIDs: (1) inventariar todos os algoritmos classicos em uso, (2) priorizar sistemas de longa duracao, (3) implementar agilidade criptografica (capacidade de trocar algoritmos sem redesign), (4) testar algoritmos PQC em ambientes de staging, (5) migrar producao em ondas.

---

## Conclusao
Nesta aula, mapeamos o futuro tecnico da identidade descentralizada em tres horizontes. O DID Core 2.0 e VC 2.0 resolvem ambiguidades e limitacoes praticas da primeira geracao de especificacoes. Os zkDIDs representam uma evolucao paradigmatica onde a propria identidade e fundamentada em provas de conhecimento zero, oferecendo privacidade maxima. E a preparacao para criptografia pos-quantica e uma necessidade urgente, mesmo que a ameaca quantica plena esteja a anos de distancia, devido ao risco de ataques "harvest now, decrypt later". Engenheiros que projetam sistemas de identidade hoje devem incorporar agilidade criptografica como principio de design fundamental.

---

## Licao de Casa
1. Pesquise o estado atual das propostas do W3C DID Working Group para o DID Core 2.0 e identifique tres mudancas concretas em relacao ao 1.0 que impactariam um sistema em producao.
2. Implemente um circuito Circom simples que prove conhecimento de um preimage de hash Poseidon sem revelar o preimage. Documente como esse conceito se aplica a zkDIDs.
3. Compare o tamanho de chaves e assinaturas entre Ed25519, ML-DSA-65 e SLH-DSA-SHAKE-128f. Calcule o impacto no tamanho de um DID Document e de uma Verifiable Credential para cada algoritmo.

---

## Proxima Aula
Na proxima e ultima aula do curso, vamos analisar metricas reais de adocao da identidade descentralizada, estudando casos como ION (com mais de 1 milhao de DIDs), did:ethr em redes L2, e licoes aprendidas de implementacoes em producao. E o momento de conectar toda a teoria e engenharia que estudamos com a realidade do mercado. Ate la!

---

## Questionario

**1. Qual problema principal o DID Core 2.0 busca resolver em relacao ao 1.0?**
a) Adicionar suporte a blockchain Bitcoin
b) Eliminar ambiguidades no modelo de dados e melhorar interoperabilidade entre representacoes JSON e JSON-LD
c) Tornar todos os DIDs gratuitos
d) Substituir criptografia de curvas elipticas por RSA
**Resposta: b**

**2. O que diferencia um zkDID de um DID tradicional com apresentacao ZKP?**
a) zkDIDs sao mais rapidos de resolver
b) No zkDID, a propria identidade e fundamentada em provas de conhecimento zero, nao apenas a apresentacao
c) zkDIDs funcionam apenas em Ethereum
d) zkDIDs nao usam criptografia
**Resposta: b**

**3. Qual ataque torna a ameaca quantica relevante HOJE, mesmo que computadores quanticos potentes ainda nao existam?**
a) Ataque de forca bruta classico
b) Ataque de phishing quantico
c) Harvest now, decrypt later (HNDL) — coletar dados cifrados hoje para quebra-los com computadores quanticos no futuro
d) Ataque de negacao de servico distribuido
**Resposta: c**

**4. Qual e a principal desvantagem pratica dos algoritmos de assinatura pos-quanticos como ML-DSA?**
a) Sao mais lentos que algoritmos classicos para verificacao
b) Chaves publicas e assinaturas sao significativamente maiores que as classicas
c) Nao foram padronizados por nenhuma organizacao
d) Funcionam apenas em hardware especializado
**Resposta: b**

**5. Qual estrategia de transicao permite compatibilidade com verificadores legados E protecao pos-quantica simultaneamente?**
a) Abandonar imediatamente todos os algoritmos classicos
b) Usar apenas algoritmos pos-quanticos e exigir atualizacao de todos os verificadores
c) Assinaturas hibridas: assinar com algoritmo classico E pos-quantico simultaneamente
d) Nao fazer nada ate que computadores quanticos existam de fato
**Resposta: c**