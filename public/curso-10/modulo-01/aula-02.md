# Aula 1.2: Estrutura completa do DID Document

## Abertura
Bem-vindo a aula 1.2! Nesta aula, vamos dissecar cada campo do DID Document conforme a especificacao W3C DID Core. O DID Document e o artefato central da identidade descentralizada — ele descreve o sujeito do DID, suas chaves publicas, metodos de autenticacao e endpoints de servico. Dominar sua estrutura e essencial para qualquer engenheiro que trabalhe com DIDs.

### Programa da aula:
1. Campos fundamentais: @context, id e verificationMethod (introducao)
2. Relacionamentos de verificacao: authentication, assertionMethod, keyAgreement, capabilityInvocation e capabilityDelegation (base e aprofundamento)
3. Campos complementares: service e alsoKnownAs (Conceito principal da aula)

---

## 1. Campos fundamentais: @context, id e verificationMethod

### O campo @context
O campo `@context` define o vocabulario semantico usado no DID Document. Ele e obrigatorio e deve incluir, no minimo, o contexto base da especificacao DID Core. Quando o DID Document e representado em JSON-LD, o `@context` permite que processadores interpretem corretamente os termos usados no documento.

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/jws-2020/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ]
}
```

O primeiro elemento **MUST** ser `"https://www.w3.org/ns/did/v1"`. Contextos adicionais podem ser incluidos para definir tipos de chaves criptograficas, suites de assinatura ou extensoes especificas do DID Method.

- **Exemplo**: Se voce quer usar chaves do tipo `JsonWebKey2020` no seu DID Document, precisa incluir o contexto `"https://w3id.org/security/suites/jws-2020/v1"` para que o tipo seja reconhecido por processadores JSON-LD.

### O campo id
O campo `id` contem o DID que este documento descreve. Ele e obrigatorio e deve ser um DID valido conforme a sintaxe estudada na aula anterior. Este campo estabelece a ligacao entre o identificador e o documento.

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:example:123456789abcdefghi"
}
```

A especificacao exige que o valor de `id` seja exatamente o DID ao qual o documento corresponde. Nao pode ser um DID URL com fragment ou query — deve ser o DID puro.

- **Exemplo**: Se o DID e `did:web:example.com:users:alice`, o campo `id` deve conter exatamente essa string, sem path, query ou fragment adicionais.

### O campo verificationMethod
O `verificationMethod` e um array que contem as chaves publicas e outros metodos de verificacao associados ao DID. Cada entrada descreve uma chave que pode ser referenciada pelos relacionamentos de verificacao.

```json
{
  "verificationMethod": [
    {
      "id": "did:example:123#key-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:example:123",
      "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
    },
    {
      "id": "did:example:123#key-2",
      "type": "JsonWebKey2020",
      "controller": "did:example:123",
      "publicKeyJwk": {
        "kty": "EC",
        "crv": "P-256",
        "x": "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
        "y": "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0"
      }
    }
  ]
}
```

Cada verification method possui quatro propriedades essenciais:

- **id**: Um DID URL unico (geralmente o DID base + fragment) que identifica esta chave.
- **type**: O tipo do metodo de verificacao (ex: `Ed25519VerificationKey2020`, `JsonWebKey2020`, `EcdsaSecp256k1VerificationKey2019`).
- **controller**: O DID da entidade que controla esta chave. Pode ser o proprio DID do documento ou um DID diferente (delegacao).
- **Material criptografico**: A chave publica em si, representada por `publicKeyMultibase`, `publicKeyJwk` ou outro formato definido pelo tipo.

- **Exemplo**: Um controller diferente do id do documento indica delegacao. Se `did:example:org` e o controller de uma chave em `did:example:alice`, a organizacao tem autoridade sobre essa chave no contexto de Alice.

---

## 2. Relacionamentos de verificacao

### authentication
O campo `authentication` especifica quais verification methods podem ser usados para autenticar o sujeito do DID. Autenticacao aqui significa provar que voce e o titular do DID — por exemplo, ao fazer login em um sistema.

```json
{
  "authentication": [
    "did:example:123#key-1",
    {
      "id": "did:example:123#auth-key-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:example:123",
      "publicKeyMultibase": "z6Mkf5rGMoatrSj1f..."
    }
  ]
}
```

Note que o array pode conter tanto referencias (strings com DID URLs apontando para entries em `verificationMethod`) quanto definicoes inline completas. Usar referencias e a pratica recomendada para evitar duplicacao.

- **Exemplo**: Quando um servico usa DID Auth para login, ele desafia o titular a assinar um nonce com uma chave listada em `authentication`. Se a assinatura e valida, a autenticacao e bem-sucedida.

### assertionMethod
O campo `assertionMethod` define quais verification methods podem ser usados para emitir declaracoes verificaveis (Verifiable Credentials) em nome do sujeito do DID. E o campo que conecta DIDs ao ecossistema de credenciais verificaveis.

```json
{
  "assertionMethod": [
    "did:example:123#key-1"
  ]
}
```

A separacao entre `authentication` e `assertionMethod` e intencional e importante: voce pode querer usar chaves diferentes para login e para emissao de credenciais, seguindo o principio de separacao de responsabilidades.

- **Exemplo**: Uma universidade com DID `did:web:university.edu` usa a chave em `assertionMethod` para assinar diplomas como Verifiable Credentials. A chave em `authentication` e usada apenas para gerenciar o proprio DID Document.

### keyAgreement
O campo `keyAgreement` especifica quais verification methods podem ser usados para estabelecer chaves de sessao por meio de protocolos de troca de chaves (como ECDH — Elliptic Curve Diffie-Hellman). Isso permite comunicacao criptografada entre partes.

```json
{
  "keyAgreement": [
    {
      "id": "did:example:123#key-agree-1",
      "type": "X25519KeyAgreementKey2020",
      "controller": "did:example:123",
      "publicKeyMultibase": "z6LSbysY2xFMRpGMhb7tFTLMpeuPRaqaWM1yECx2AtzE3KCc"
    }
  ]
}
```

Note que o tipo de chave aqui e tipicamente diferente das chaves de assinatura. `X25519` e usado para troca de chaves, enquanto `Ed25519` e usado para assinaturas. Sao curvas matematicamente relacionadas, mas com propositos distintos.

- **Exemplo**: Dois agentes DIDComm usam as chaves em `keyAgreement` de seus respectivos DID Documents para estabelecer um canal criptografado end-to-end antes de trocar mensagens.

### capabilityInvocation e capabilityDelegation
Estes dois campos controlam o gerenciamento do proprio DID Document:

- **capabilityInvocation**: Define quais chaves podem invocar capacidades sobre o DID Document, como atualiza-lo ou desativa-lo. E o campo mais critico em termos de seguranca.
- **capabilityDelegation**: Define quais chaves podem delegar capacidades a terceiros.

```json
{
  "capabilityInvocation": [
    "did:example:123#key-1"
  ],
  "capabilityDelegation": [
    "did:example:123#key-3"
  ]
}
```

A distincao entre invocacao e delegacao segue o modelo de seguranca baseado em capabilities (object capabilities / oCap). Uma chave com `capabilityInvocation` pode realizar acoes diretamente, enquanto uma chave com `capabilityDelegation` pode autorizar outras entidades a realizar acoes.

- **Exemplo**: Uma empresa usa `capabilityInvocation` com uma chave armazenada em HSM (Hardware Security Module) para atualizar seu DID Document. Usa `capabilityDelegation` para autorizar um departamento especifico a emitir sub-delegacoes de acesso.

---

## 3. Campos complementares: service e alsoKnownAs

### O campo service
O campo `service` descreve endpoints de servico associados ao sujeito do DID. Esses endpoints permitem descoberta de servicos — dado um DID, voce pode encontrar como se comunicar com o sujeito ou acessar recursos relacionados.

```json
{
  "service": [
    {
      "id": "did:example:123#messaging",
      "type": "DIDCommMessaging",
      "serviceEndpoint": "https://agent.example.com/didcomm"
    },
    {
      "id": "did:example:123#hub",
      "type": "IdentityHub",
      "serviceEndpoint": {
        "uri": "https://hub.example.com",
        "accept": ["didcomm/v2", "didcomm/aip2;env=rfc587"]
      }
    },
    {
      "id": "did:example:123#linked-domain",
      "type": "LinkedDomains",
      "serviceEndpoint": "https://www.example.com"
    }
  ]
}
```

Cada service entry possui:

- **id**: Um DID URL unico que identifica este servico.
- **type**: O tipo de servico. Tipos comuns incluem `DIDCommMessaging`, `LinkedDomains`, `IdentityHub` e `CredentialRegistry`.
- **serviceEndpoint**: A URI (ou objeto) do endpoint. Pode ser uma URL HTTPS, um endpoint WebSocket ou qualquer URI valida.

- **Exemplo**: O tipo `LinkedDomains` e usado pelo protocolo Well Known DID Configuration para provar a associacao bidirecional entre um DID e um dominio web. O DID Document aponta para o dominio, e o dominio hospeda uma credencial assinada pelo DID.

### O campo alsoKnownAs
O campo `alsoKnownAs` permite declarar que o sujeito do DID tambem e conhecido por outros identificadores. Isso cria ligacoes entre diferentes identidades do mesmo sujeito.

```json
{
  "alsoKnownAs": [
    "https://social.example/users/alice",
    "did:web:alice.example.com"
  ]
}
```

Este campo aceita URIs genericas, nao apenas DIDs. Pode apontar para perfis em redes sociais, paginas pessoais ou outros DIDs do mesmo sujeito em methods diferentes.

- **Exemplo**: Alice tem `did:ethr:0xabc...` e `did:web:alice.dev`. Ambos os DID Documents incluem referencia ao outro em `alsoKnownAs`. Um verificador pode usar isso para confirmar que os dois DIDs pertencem a mesma entidade, desde que ambos os documentos sejam assinados pelas chaves correspondentes.

### DID Document completo de referencia
Aqui esta um DID Document completo que utiliza todos os campos estudados:

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/jws-2020/v1",
    "https://w3id.org/security/suites/x25519-2020/v1"
  ],
  "id": "did:example:123456789abcdefghi",
  "alsoKnownAs": ["https://alice.example.com"],
  "verificationMethod": [
    {
      "id": "did:example:123456789abcdefghi#key-1",
      "type": "JsonWebKey2020",
      "controller": "did:example:123456789abcdefghi",
      "publicKeyJwk": {
        "kty": "OKP",
        "crv": "Ed25519",
        "x": "VCpo2LMLhn6iWku8MKvSLg2ZAoC-nlOyPVQaO3FxVeQ"
      }
    },
    {
      "id": "did:example:123456789abcdefghi#key-agree-1",
      "type": "X25519KeyAgreementKey2020",
      "controller": "did:example:123456789abcdefghi",
      "publicKeyMultibase": "z6LSbysY2xFMRpGMhb7tFTLMpeuPRaqaWM1yECx2AtzE3KCc"
    }
  ],
  "authentication": ["did:example:123456789abcdefghi#key-1"],
  "assertionMethod": ["did:example:123456789abcdefghi#key-1"],
  "keyAgreement": ["did:example:123456789abcdefghi#key-agree-1"],
  "capabilityInvocation": ["did:example:123456789abcdefghi#key-1"],
  "capabilityDelegation": ["did:example:123456789abcdefghi#key-1"],
  "service": [
    {
      "id": "did:example:123456789abcdefghi#messaging",
      "type": "DIDCommMessaging",
      "serviceEndpoint": "https://agent.example.com/didcomm"
    }
  ]
}
```

- **Exemplo**: Este documento declara que `did:example:123456789abcdefghi` usa `key-1` para autenticacao, emissao de credenciais e gerenciamento do documento, `key-agree-1` para troca de chaves criptograficas, e expoe um endpoint DIDComm para mensagens.

---

## Conclusao
Nesta aula, estudamos cada campo do DID Document conforme a especificacao W3C DID Core. Vimos que `@context` define o vocabulario, `id` ancora o documento ao DID, `verificationMethod` contem as chaves publicas, e os cinco relacionamentos de verificacao (authentication, assertionMethod, keyAgreement, capabilityInvocation e capabilityDelegation) controlam como essas chaves podem ser usadas. Os campos `service` e `alsoKnownAs` completam o documento permitindo descoberta de servicos e ligacao entre identidades. Um engenheiro que domina essa estrutura e capaz de projetar, implementar e auditar sistemas de identidade descentralizada com precisao.

---

## Licao de Casa
1. Crie um DID Document completo em JSON para um cenario de sua escolha (pessoa, organizacao ou dispositivo IoT), incluindo pelo menos dois verification methods, tres relacionamentos de verificacao e dois service endpoints.
2. Explique por que a separacao entre `authentication` e `assertionMethod` e importante do ponto de vista de seguranca. De um exemplo pratico de risco caso a mesma chave fosse usada sem distincao.
3. Pesquise o tipo de servico `LinkedDomains` e descreva como o protocolo Well Known DID Configuration funciona para vincular um DID a um dominio web.

---

## Proxima Aula
Na proxima aula, vamos estudar as diferentes representacoes do DID Document — JSON, JSON-LD e CBOR — e como a extensibilidade do modelo de dados permite adaptar o documento para diferentes contextos e necessidades. Ate la!

---

## Questionario

**1. Qual e o valor obrigatorio do primeiro elemento do campo @context em um DID Document?**
a) "https://schema.org"
b) "https://www.w3.org/ns/did/v1"
c) "https://w3id.org/security/v1"
d) "https://www.w3.org/2018/credentials/v1"
**Resposta: b**

**2. Qual campo do DID Document e usado para listar chaves destinadas a troca de chaves criptograficas (key exchange)?**
a) authentication
b) assertionMethod
c) keyAgreement
d) capabilityInvocation
**Resposta: c**

**3. O que o campo `controller` em um verificationMethod indica?**
a) O algoritmo criptografico da chave
b) O DID da entidade que tem autoridade sobre aquela chave
c) O servico onde a chave esta armazenada
d) A data de expiracao da chave
**Resposta: b**

**4. Qual e a diferenca entre capabilityInvocation e capabilityDelegation?**
a) Nao ha diferenca, sao sinonimos
b) capabilityInvocation e para criar DIDs, capabilityDelegation e para destrui-los
c) capabilityInvocation permite realizar acoes diretamente, capabilityDelegation permite autorizar terceiros a realizar acoes
d) capabilityInvocation e para chaves RSA, capabilityDelegation e para chaves ECDSA
**Resposta: c**

**5. Qual campo permite declarar que o sujeito de um DID tambem e conhecido por outros identificadores?**
a) service
b) verificationMethod
c) authentication
d) alsoKnownAs
**Resposta: d**
