# Aula 2.1: O que e um DID? Definicao formal e estrutura (did:metodo:identificador)

## Abertura
Bem-vindo a aula 2.1! Nesta aula, vamos mergulhar no conceito central da identidade descentralizada: o Decentralized Identifier, ou DID. Voce vai entender o que e um DID, por que ele foi criado e como sua estrutura sintatica funciona na pratica. Esse conhecimento e a base para tudo que vamos construir ao longo deste modulo.

### Programa da aula:
1. Contexto historico e motivacao para os DIDs (introducao)
2. Definicao formal segundo a W3C (base e aprofundamento)
3. Estrutura sintatica: did:metodo:identificador (Conceito principal da aula)

---

## 1. Contexto historico e motivacao para os DIDs

### 1.1 O problema dos identificadores centralizados
Historicamente, identificadores digitais sao emitidos e controlados por entidades centralizadas. Seu endereco de e-mail pertence ao provedor (Google, Microsoft), seu CPF pertence ao governo, e seu nome de usuario em uma rede social pertence a plataforma. Isso significa que, a qualquer momento, a entidade emissora pode revogar, modificar ou censurar seu identificador.

- **Exemplo**: Se o Google desativa sua conta Gmail, voce perde nao apenas o e-mail, mas todos os servicos vinculados a ele — Drive, YouTube, Calendar. Sua identidade digital desaparece junto com a decisao de um terceiro.

Esse modelo cria dependencia e fragilidade. O usuario nao tem soberania real sobre sua propria identidade no mundo digital.

### 1.2 A emergencia da identidade auto-soberana
O movimento de Self-Sovereign Identity (SSI) surgiu para resolver esse problema. A ideia central e que individuos devem ser capazes de criar, controlar e apresentar suas proprias identidades sem depender de intermediarios. Para isso, era necessario um novo tipo de identificador — um que fosse criado pelo proprio usuario, sem permissao de nenhuma autoridade.

- **Exemplo**: Imagine que voce pudesse criar um identificador unico, matematicamente verificavel, sem precisar pedir autorizacao a nenhuma empresa ou governo. Esse e o papel do DID.

O World Wide Web Consortium (W3C) formalizou essa ideia na especificacao DID Core, publicada como recomendacao em 2022.

---

## 2. Definicao formal segundo a W3C

### 2.1 O que diz a especificacao
Segundo a W3C DID Core Specification, um Decentralized Identifier (DID) e "um novo tipo de identificador que permite identidade digital verificavel e descentralizada". Formalmente, um DID e uma URI (Uniform Resource Identifier) que associa um sujeito DID a um DID Document, permitindo interacoes confiaveis associadas a esse sujeito.

Os principios fundamentais de um DID sao:
- **Descentralizacao**: Nao depende de uma autoridade de registro centralizada.
- **Controle pelo sujeito**: O proprio titular controla o identificador por meio de criptografia.
- **Verificabilidade**: Qualquer parte pode verificar a autenticidade do DID e suas provas criptograficas.
- **Interoperabilidade**: A estrutura e padronizada para funcionar em diferentes sistemas e redes.

### 2.2 DID como URI
Um DID e, tecnicamente, uma URI — assim como URLs que voce usa no navegador. Porem, em vez de apontar para um servidor web, um DID aponta para um DID Document armazenado em um sistema descentralizado.

- **Exemplo**: Assim como `https://exemplo.com/pagina` localiza um recurso na web, `did:example:123456` localiza um documento de identidade em uma rede descentralizada.

A diferenca crucial e que ninguem controla o "registro" de DIDs de forma unilateral. O proprio sujeito gera seu DID usando criptografia de chave publica, sem precisar pedir a ninguem.

---

## 3. Estrutura sintatica: did:metodo:identificador

### 3.1 Os tres componentes
Todo DID segue a mesma estrutura sintatica basica, composta por tres partes separadas por dois-pontos:

```
did:metodo:identificador-especifico
```

- **`did`**: O esquema fixo. Assim como URLs comecam com `http` ou `https`, todo DID comeca com o prefixo `did`. Isso identifica a string como um Decentralized Identifier.
- **`metodo`**: Indica qual metodo DID esta sendo usado. O metodo define como o DID e criado, resolvido, atualizado e desativado. Cada metodo tem sua propria especificacao. Exemplos incluem `web`, `key`, `ion`, `ethr`, `sov`.
- **`identificador-especifico`**: Uma string unica dentro do namespace do metodo. Geralmente e derivada de uma chave publica ou de um hash criptografico. O formato exato depende do metodo.

### 3.2 Exemplos praticos de DIDs
Vamos analisar alguns DIDs reais para entender como a estrutura funciona na pratica:

```
did:web:exemplo.com.br
```
Este DID usa o metodo `web`. O identificador e um dominio da internet. O DID Document e hospedado no servidor web do dominio, no caminho `/.well-known/did.json`.

```
did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK
```
Este DID usa o metodo `key`. O identificador e uma representacao codificada da propria chave publica. Nao requer nenhuma blockchain ou servidor — tudo esta contido no proprio DID.

```
did:ethr:0xb9c5714089478a327f09197987f16f9e5d936e8a
```
Este DID usa o metodo `ethr`, baseado na rede Ethereum. O identificador e um endereco Ethereum. O DID Document e resolvido consultando um smart contract na blockchain.

- **Exemplo**: Pense no metodo como o "protocolo" e no identificador como o "endereco". Assim como `https` define as regras de comunicacao e `exemplo.com` define o destino, `did:ethr` define as regras de resolucao e `0xb9c5...` define a identidade especifica.

### 3.3 O papel dos metodos DID
Existem dezenas de metodos DID registrados. Cada um define quatro operacoes fundamentais, conhecidas como operacoes CRUD:
- **Create**: Como gerar um novo DID.
- **Read/Resolve**: Como obter o DID Document a partir do DID.
- **Update**: Como atualizar o DID Document (por exemplo, rotacionar chaves).
- **Deactivate**: Como desativar o DID permanentemente.

A escolha do metodo depende do caso de uso. Metodos baseados em blockchain oferecem maior resistencia a censura, enquanto metodos como `did:web` sao mais simples de implementar, mas dependem de infraestrutura web tradicional.

---

## Conclusao
Nesta aula, voce aprendeu que um DID e um identificador descentralizado padronizado pela W3C, projetado para dar ao usuario controle total sobre sua identidade digital. Vimos que sua estrutura sintatica `did:metodo:identificador` e simples, mas poderosa — permitindo que diferentes redes e protocolos implementem seus proprios metodos de resolucao. O DID e o alicerce sobre o qual todo o ecossistema de identidade descentralizada e construido.

---

## Licao de Casa
1. Acesse o DID Method Registry da W3C (https://www.w3.org/TR/did-spec-registries/) e escolha tres metodos DID diferentes. Para cada um, anote: o nome do metodo, se usa blockchain ou nao, e um exemplo de DID valido.
2. Crie um DID ficticio usando a estrutura `did:metodo:identificador` para um metodo imaginario que voce inventar. Descreva em um paragrafo como seria o processo de resolucao desse DID.
3. Escreva uma comparacao de meia pagina entre a forma como voce obtem um endereco de e-mail e como um DID e gerado. Destaque as diferencas de controle e dependencia.

---

## Proxima Aula
Na proxima aula, vamos explorar as propriedades essenciais que tornam um DID realmente util: persistencia, resolubilidade e controle criptografico. Voce vai entender por que essas tres caracteristicas sao indispensaveis para a identidade descentralizada. Ate la!

---

## Questionario

**1. Qual e a estrutura sintatica basica de um DID?**
a) identificador:metodo:did
b) did:metodo:identificador-especifico
c) uri:did:chave-publica
d) https:did:metodo
**Resposta: b**

**2. Segundo a especificacao W3C DID Core, qual e a funcao principal de um DID?**
a) Substituir senhas em sistemas de login
b) Associar um sujeito a um DID Document, permitindo interacoes confiaveis e descentralizadas
c) Criptografar dados de navegacao na internet
d) Criar tokens de autenticacao temporarios
**Resposta: b**

**3. No DID `did:ethr:0xb9c5714089478a327f09197987f16f9e5d936e8a`, o que representa `ethr`?**
a) O identificador especifico do sujeito
b) O esquema da URI
c) O metodo DID utilizado
d) O endereco do servidor de resolucao
**Resposta: c**

**4. Qual das seguintes afirmacoes sobre DIDs e INCORRETA?**
a) Um DID pode ser criado sem permissao de uma autoridade central
b) O prefixo `did` e obrigatorio em todos os Decentralized Identifiers
c) Todos os metodos DID exigem o uso de blockchain
d) O formato do identificador especifico depende do metodo utilizado
**Resposta: c**

**5. Quais sao as quatro operacoes fundamentais (CRUD) definidas por um metodo DID?**
a) Connect, Register, Upload, Download
b) Create, Read/Resolve, Update, Deactivate
c) Compress, Replicate, Unify, Distribute
d) Certify, Revoke, Update, Deploy
**Resposta: b**
