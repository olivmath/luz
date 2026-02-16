# Aula 6.3: Assinaturas BBS+ e AnonCreds (Hyperledger Indy)

## Abertura
Bem-vindo a aula 6.3! Nas aulas anteriores, exploramos Zero-Knowledge Proofs e divulgacao seletiva como conceitos fundamentais. Agora, vamos estudar a implementacao pratica mais madura dessas tecnicas no ecossistema de identidade descentralizada: as assinaturas BBS+ e o framework AnonCreds, originalmente desenvolvido no Hyperledger Indy. Juntas, essas tecnologias formam o sistema mais completo para emissao, apresentacao e verificacao de credenciais com privacidade.

### Programa da aula:
1. Assinaturas BBS+: fundamentos matematicos e propriedades (introducao)
2. AnonCreds: arquitetura e fluxos (base e aprofundamento)
3. Implementacao pratica e ecossistema (Conceito principal da aula)

---

## 1. Assinaturas BBS+: fundamentos matematicos e propriedades
### Estrutura matematica das assinaturas BBS+
As assinaturas **BBS+** (Boneh-Boyen-Shacham, com extensao de Au, Susilo e Mu) sao um esquema de assinatura sobre **grupos bilineares** (pairing-based cryptography). A construcao se baseia em tres grupos ciclicos G1, G2 e GT com uma funcao de emparelhamento (pairing) `e: G1 x G2 -> GT`.

O esquema funciona assim:
1. **Key Generation**: o issuer gera uma chave privada `sk` (escalar) e uma chave publica `pk` em G2, alem de geradores `h0, h1, ..., hn` em G1, onde `n` e o numero maximo de mensagens (atributos) assinados simultaneamente.
2. **Signing**: dado um vetor de mensagens `(m1, m2, ..., mn)`, o issuer computa a assinatura como um elemento de G1 que incorpora todos os atributos e o segredo do issuer.
3. **Verification**: o verifier usa o pairing para confirmar que a assinatura e valida para o conjunto de mensagens e a chave publica.

A formula simplificada da assinatura e:
```
A = (g1 * h0^s * h1^m1 * h2^m2 * ... * hn^mn) ^ (1 / (sk + e))
```
onde `s` e um blinding factor e `e` e um nonce.

- **Exemplo**: Um issuer governamental com chave publica `pk` assina uma credencial com atributos `[nome, cpf, data_nascimento, endereco, nacionalidade]`. A assinatura BBS+ e um unico ponto na curva G1 que "compromete" todos os 5 atributos simultaneamente.

### Propriedades criticas para identidade
As assinaturas BBS+ possuem propriedades que as tornam ideais para Verifiable Credentials:

- **Multi-message signing**: uma unica assinatura cobre multiplos atributos, diferente de esquemas tradicionais que assinam um unico bloco de dados.
- **Selective disclosure**: o holder pode gerar uma **prova de conhecimento** (proof of knowledge) que revela apenas um subconjunto dos atributos assinados, sem invalidar a assinatura.
- **Unlinkability**: cada prova derivada e randomizada — duas provas do mesmo holder sao criptograficamente indistinguiveis.
- **Proof of possession**: o holder pode provar que possui a credencial sem revelar a assinatura original.

- **Exemplo**: A partir da assinatura sobre `[nome, cpf, data_nascimento, endereco, nacionalidade]`, o holder gera uma prova que revela apenas `[nome, nacionalidade]` e prova que os demais atributos existem e foram assinados, sem expor seus valores.

---

## 2. AnonCreds: arquitetura e fluxos
### Visao geral do AnonCreds
**AnonCreds** (Anonymous Credentials) e uma especificacao de credenciais anonimas originalmente implementada no **Hyperledger Indy** e agora mantida como especificacao independente pela **AnonCreds Working Group** na Hyperledger/DIF. O sistema combina:

- Assinaturas CL (Camenisch-Lysyanskaya) — na versao original — ou BBS+ — em versoes mais recentes.
- Predicados com ZKP para range proofs.
- Revogacao criptografica via acumuladores.
- Link secrets para binding de credenciais ao holder.

A arquitetura envolve quatro componentes on-ledger (ou em repositorio publico):
1. **Schema**: define os nomes dos atributos (ex.: `["nome", "cpf", "data_nascimento"]`).
2. **Credential Definition (CredDef)**: contem a chave publica do issuer e os parametros criptograficos associados a um schema.
3. **Revocation Registry Definition**: define o acumulador criptografico para revogacao.
4. **Revocation Registry Entry**: atualizacoes do estado do acumulador.

- **Exemplo**: Um governo publica o Schema "Identidade Nacional v2" com 8 atributos. Em seguida, publica um CredDef vinculando sua chave publica a esse schema. Qualquer verifier pode buscar o CredDef para validar credenciais emitidas por esse issuer.

### Fluxo completo de emissao e apresentacao
O ciclo de vida de uma credencial AnonCreds segue estas etapas:

**Emissao:**
1. Holder gera um **link secret** (master secret) — um valor secreto unico que vincula todas as suas credenciais a ele sem revelar sua identidade.
2. Holder envia um **credential request** ao issuer contendo um compromisso criptografico (blinded) do link secret.
3. Issuer cria a credencial assinando os atributos + o link secret blinded com sua chave privada CL/BBS+.
4. Holder recebe e armazena a credencial.

**Apresentacao:**
1. Verifier envia um **proof request** especificando quais atributos quer ver, quais predicados exige, e quais restricoes de issuer/schema aceita.
2. Holder seleciona credenciais que satisfazem o proof request.
3. Holder gera uma **prova derivada** que: revela atributos solicitados, prova predicados via ZKP, prova posse do link secret sem revela-lo, e inclui prova de nao-revogacao.
4. Verifier valida a prova contra o CredDef, Schema e Revocation Registry publicos.

- **Exemplo**: Um verifier pede: "Mostre o nome e prove que idade >= 21, de uma credencial emitida pelo DID did:sov:gov123". O holder gera uma prova que revela `nome = "Joao Silva"`, prova `idade >= 21` via ZKP, e inclui prova de nao-revogacao — tudo em uma unica apresentacao.

---

## 3. Implementacao pratica e ecossistema
### Link Secret e correlacionabilidade
O **link secret** (anteriormente chamado "master secret") e a peca central que conecta o holder as suas credenciais sem revelar sua identidade. Funciona assim:

- O holder gera um unico link secret e o usa em todas as suas credenciais.
- Cada credencial contem um compromisso criptografico (commitment) do link secret.
- Na apresentacao, o holder prova via ZKP que possui o link secret correspondente ao commitment na credencial, sem revela-lo.
- Quando multiplas credenciais sao apresentadas juntas, o holder prova que todas compartilham o mesmo link secret — garantindo que pertencem a mesma pessoa — sem revelar o valor.

Isso resolve o problema de **binding**: como garantir que a credencial pertence a quem a apresenta, sem criar um identificador correlacionavel.

- **Exemplo**: Alice apresenta simultaneamente uma credencial de identidade (emitida pelo governo) e uma credencial de diploma (emitida pela universidade). O verifier confirma via ZKP que ambas pertencem a mesma pessoa (mesmo link secret) sem conseguir identificar Alice ou correlacionar com apresentacoes futuras.

### Revogacao com acumuladores criptograficos
AnonCreds implementa revogacao usando **acumuladores criptograficos** (baseados em RSA ou curvas elipticas). O acumulador e um valor compacto que representa o conjunto de credenciais nao-revogadas. Cada credencial recebe um **witness** de pertencimento ao acumulador.

O fluxo de revogacao:
1. Issuer publica o acumulador inicial contendo todas as credenciais ativas.
2. Para revogar, o issuer atualiza o acumulador removendo a credencial.
3. O holder atualiza seu witness periodicamente (pode ser feito sem contato com o issuer, usando "tails files" publicos).
4. Na apresentacao, o holder prova via ZKP que sua credencial pertence ao acumulador atual.

Vantagens sobre listas de revogacao tradicionais:
- O verifier nao descobre qual credencial especifica esta sendo verificada.
- A verificacao e O(1) — nao depende do tamanho da lista de revogacao.

- **Exemplo**: Um issuer revoga 5 de 10.000 credenciais. O acumulador e atualizado. Holders com credenciais ativas atualizam seus witnesses. Na apresentacao, o verifier confirma pertencimento ao acumulador sem saber o indice da credencial no registro.

### Evolucao: AnonCreds v2 e BBS+
A especificacao **AnonCreds v2** esta migrando das assinaturas CL (baseadas em RSA com modulos de 2048+ bits) para **BBS+** por diversas razoes:

- **Performance**: BBS+ sobre curvas BLS12-381 e significativamente mais rapido que CL com RSA.
- **Tamanho das credenciais**: credenciais BBS+ sao ~10x menores que CL.
- **Interoperabilidade**: BBS+ esta sendo padronizado no W3C/IETF (draft-irtf-cfrg-bbs-signatures), facilitando adocao alem do ecossistema Hyperledger.
- **Compatibilidade W3C VC**: AnonCreds v2 alinha-se ao W3C Verifiable Credentials Data Model, permitindo uso com JSON-LD e Data Integrity Proofs.

- **Exemplo**: Uma credencial CL com 10 atributos ocupa ~15 KB. A mesma credencial com BBS+ ocupa ~1.5 KB. Para wallets moveis com armazenamento e banda limitados, essa reducao e critica.

---

## Conclusao
Nesta aula, exploramos as assinaturas BBS+ como primitiva criptografica e o framework AnonCreds como sistema completo para credenciais anonimas. Vimos como o link secret vincula credenciais ao holder sem identificadores correlacionaveis, como acumuladores criptograficos permitem revogacao privada, e como a evolucao para AnonCreds v2 com BBS+ traz melhorias significativas em performance, tamanho e interoperabilidade. Essas tecnologias representam o estado da arte em identidade descentralizada com privacidade.

---

## Licao de Casa
1. Usando a biblioteca `jsonld-signatures-bbs` (JavaScript) ou `bbs-signatures` (Rust), gere um par de chaves BBS+, assine um conjunto de 5 atributos e gere uma prova derivada revelando apenas 2.
2. Estude a especificacao AnonCreds (anoncreds-spec no GitHub) e desenhe um diagrama de sequencia completo do fluxo de emissao e apresentacao, incluindo as interacoes com o ledger.
3. Compare quantitativamente o tamanho de credenciais e provas entre assinaturas CL e BBS+ para um schema com 10 atributos, usando benchmarks disponveis na documentacao do Hyperledger Aries.

---

## Proxima Aula
Na proxima aula, vamos explorar a criptografia pos-quantica aplicada a identidade descentralizada, estudando esquemas baseados em reticulados como Dilithium e Falcon, e entendendo como preparar sistemas DID/VC para a era dos computadores quanticos. Ate la!

---

## Questionario

**1. Qual estrutura matematica fundamenta as assinaturas BBS+?**
a) Reticulados (lattices) e problemas de shortest vector
b) Grupos bilineares com funcoes de emparelhamento (pairing)
c) Fatoracao de numeros primos grandes (RSA)
d) Funcoes hash resistentes a colisao
**Resposta: b**

**2. No AnonCreds, qual e a funcao do link secret (master secret)?**
a) Encriptar a credencial para armazenamento seguro
b) Vincular todas as credenciais do holder a ele sem criar um identificador correlacionavel
c) Gerar a chave publica do issuer
d) Assinar digitalmente as apresentacoes
**Resposta: b**

**3. Como o AnonCreds implementa revogacao preservando privacidade?**
a) Usando listas de revogacao publicas com IDs de credenciais
b) Usando acumuladores criptograficos onde o holder prova pertencimento via ZKP
c) Usando timestamps de expiracao em cada credencial
d) Usando notificacoes push para wallets revogados
**Resposta: b**

**4. Qual e a principal motivacao para a migracao de assinaturas CL para BBS+ no AnonCreds v2?**
a) CL nao suporta divulgacao seletiva
b) BBS+ oferece melhor performance, credenciais menores e padronizacao W3C/IETF
c) CL foi quebrado por ataques quanticos
d) BBS+ elimina a necessidade de link secret
**Resposta: b**

**5. O que um Credential Definition (CredDef) contem no AnonCreds?**
a) Apenas o nome do issuer e data de criacao
b) A chave publica do issuer e parametros criptograficos associados a um schema
c) A lista completa de credenciais emitidas
d) O link secret de todos os holders
**Resposta: b**
