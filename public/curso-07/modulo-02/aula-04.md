# Aula 2.4: Anatomia basica de um DID Document (chaves publicas, servicos)

## Abertura
Bem-vindo a aula 2.4! Ate aqui, falamos sobre DIDs como identificadores e suas propriedades. Agora, vamos abrir o "documento" que esta por tras de cada DID — o DID Document. E nele que estao registradas as chaves publicas, metodos de verificacao e endpoints de servico que permitem interacoes seguras com o sujeito do DID. Entender a anatomia de um DID Document e essencial para trabalhar com identidade descentralizada na pratica.

### Programa da aula:
1. Visao geral e contexto do DID Document (introducao)
2. Metodos de verificacao e chaves publicas (base e aprofundamento)
3. Endpoints de servico e relacoes entre DIDs (Conceito principal da aula)

---

## 1. Visao geral e contexto do DID Document

### 1.1 O que e um DID Document
Um DID Document e um documento em formato JSON (ou JSON-LD) que contem as informacoes necessarias para interagir criptograficamente com o sujeito de um DID. Ele e o resultado da resolucao de um DID — quando voce resolve `did:example:123`, o que voce obtem de volta e o DID Document correspondente.

O DID Document NAO contem dados pessoais como nome, endereco ou data de nascimento. Ele contem exclusivamente informacoes tecnicas: chaves publicas, metodos de verificacao, endpoints de servico e metadados de controle.

- **Exemplo**: Pense no DID Document como um cartao de visita criptografico. Ele nao diz quem voce e, mas diz como se comunicar com voce de forma segura, como verificar suas assinaturas e onde encontrar seus servicos.

### 1.2 Estrutura basica em JSON
Um DID Document minimo tem a seguinte estrutura:

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "id": "did:example:123456789abcdefghi",
  "authentication": [{
    "id": "did:example:123456789abcdefghi#keys-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:example:123456789abcdefghi",
    "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
  }]
}
```

Vamos analisar cada campo:
- **`@context`**: Define o vocabulario JSON-LD utilizado. Garante que todos os sistemas interpretem os campos da mesma forma.
- **`id`**: O proprio DID que este documento representa. E o identificador do sujeito.
- **`authentication`**: Lista de metodos de verificacao que podem ser usados para autenticar o sujeito.

- **Exemplo**: O campo `@context` funciona como um dicionario compartilhado. Se dois sistemas leem o campo `authentication`, o contexto garante que ambos entendam o significado de forma identica.

---

## 2. Metodos de verificacao e chaves publicas

### 2.1 O bloco verificationMethod
O campo `verificationMethod` e onde as chaves publicas do sujeito sao declaradas. Cada entrada neste array descreve uma chave e seu tipo criptografico:

```json
{
  "verificationMethod": [{
    "id": "did:example:123#key-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:example:123",
    "publicKeyMultibase": "zH3C2AVvLMv6gmMNam3uVAjZpfkcJCwDwnZn6z3wXmqPV"
  }, {
    "id": "did:example:123#key-2",
    "type": "X25519KeyAgreementKey2020",
    "controller": "did:example:123",
    "publicKeyMultibase": "z6LSbysY2xFMRpGMhb7tFTLMpeuPRaqaWM1yECx2AtzE3K"
  }]
}
```

Cada metodo de verificacao possui:
- **`id`**: Um identificador unico para a chave, geralmente o DID seguido de um fragmento (`#key-1`).
- **`type`**: O tipo de chave criptografica (Ed25519 para assinaturas, X25519 para acordo de chaves, etc.).
- **`controller`**: O DID que controla esta chave. Pode ser o proprio sujeito ou um DID diferente (delegacao).
- **`publicKeyMultibase`**: A chave publica codificada em formato multibase.

- **Exemplo**: Um sujeito pode ter uma chave Ed25519 para assinar credenciais e uma chave X25519 para estabelecer canais de comunicacao encriptados. Cada chave tem um proposito especifico.

### 2.2 Relacoes de verificacao
O DID Document define diferentes relacoes entre o sujeito e seus metodos de verificacao. Cada relacao indica o proposito para o qual uma chave pode ser usada:

- **`authentication`**: Chaves usadas para provar que voce e o sujeito do DID. Usada em processos de login e autenticacao.
- **`assertionMethod`**: Chaves usadas para emitir afirmacoes verificaveis, como assinar Verifiable Credentials.
- **`keyAgreement`**: Chaves usadas para estabelecer canais de comunicacao encriptados (por exemplo, Diffie-Hellman).
- **`capabilityInvocation`**: Chaves autorizadas a invocar capacidades criptograficas, como atualizar o proprio DID Document.
- **`capabilityDelegation`**: Chaves autorizadas a delegar capacidades a terceiros.

```json
{
  "authentication": ["did:example:123#key-1"],
  "assertionMethod": ["did:example:123#key-1"],
  "keyAgreement": ["did:example:123#key-2"],
  "capabilityInvocation": ["did:example:123#key-1"],
  "capabilityDelegation": ["did:example:123#key-1"]
}
```

- **Exemplo**: Voce pode ter uma chave usada apenas para autenticacao e outra usada apenas para emitir credenciais. Essa separacao de propositos e uma pratica importante de seguranca — se uma chave for comprometida, apenas as operacoes associadas a ela sao afetadas.

---

## 3. Endpoints de servico e relacoes entre DIDs

### 3.1 O bloco service
O campo `service` lista endpoints que permitem interacao com o sujeito do DID. Esses endpoints podem ser URLs de APIs, caixas de mensagem, repositorios de credenciais ou qualquer outro servico relevante.

```json
{
  "service": [{
    "id": "did:example:123#messaging",
    "type": "DIDCommMessaging",
    "serviceEndpoint": "https://agents.exemplo.com/msg/did:example:123"
  }, {
    "id": "did:example:123#credential-store",
    "type": "CredentialRepository",
    "serviceEndpoint": "https://credenciais.exemplo.com/api/v1"
  }, {
    "id": "did:example:123#linked-domain",
    "type": "LinkedDomains",
    "serviceEndpoint": "https://www.exemplo.com"
  }]
}
```

Cada servico possui:
- **`id`**: Identificador unico do servico dentro do DID Document.
- **`type`**: O tipo de servico, que determina como clientes devem interagir com ele.
- **`serviceEndpoint`**: A URL ou URI onde o servico esta disponivel.

- **Exemplo**: O tipo `DIDCommMessaging` indica um endpoint para troca de mensagens usando o protocolo DIDComm. Um agente de identidade pode usar esse endpoint para enviar credenciais ou solicitacoes de prova diretamente ao sujeito.

### 3.2 O campo controller
O campo `controller` no nivel do DID Document indica quais DIDs tem autoridade para fazer alteracoes no documento. Na maioria dos casos, o controlador e o proprio sujeito:

```json
{
  "id": "did:example:123",
  "controller": "did:example:123"
}
```

Porem, o controlador pode ser um DID diferente, habilitando cenarios de delegacao:

```json
{
  "id": "did:example:subsidiaria",
  "controller": ["did:example:subsidiaria", "did:example:matriz"]
}
```

Neste caso, tanto a subsidiaria quanto a matriz podem atualizar o DID Document da subsidiaria. Isso e util para hierarquias organizacionais, custodia de menores ou cenarios de governanca corporativa.

- **Exemplo**: Uma empresa pode ter um DID organizacional controlado conjuntamente pelo CEO e pelo conselho de administracao. Alteracoes no DID Document requerem autorizacao de ambos, implementando governanca compartilhada sobre a identidade corporativa.

### 3.3 Um DID Document completo
Para consolidar, veja um DID Document completo reunindo todos os elementos:

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://w3id.org/security/suites/ed25519-2020/v1"
  ],
  "id": "did:example:123456789",
  "controller": "did:example:123456789",
  "verificationMethod": [{
    "id": "did:example:123456789#key-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:example:123456789",
    "publicKeyMultibase": "zH3C2AVvLMv6gmMNam..."
  }],
  "authentication": ["did:example:123456789#key-1"],
  "assertionMethod": ["did:example:123456789#key-1"],
  "service": [{
    "id": "did:example:123456789#messaging",
    "type": "DIDCommMessaging",
    "serviceEndpoint": "https://agent.exemplo.com"
  }]
}
```

---

## Conclusao
Nesta aula, voce aprendeu a anatomia completa de um DID Document. Vimos que ele e composto por metadados de contexto, metodos de verificacao (com chaves publicas e suas relacoes de proposito), endpoints de servico e informacoes de controle. O DID Document e o componente que da vida ao DID — sem ele, o identificador seria apenas uma string sem significado. Com ele, qualquer parte pode verificar assinaturas, estabelecer comunicacao segura e interagir com o sujeito de forma autonoma e descentralizada.

---

## Licao de Casa
1. Escreva manualmente um DID Document em JSON para um DID ficticio. Inclua pelo menos duas chaves publicas (uma para autenticacao e outra para key agreement) e um endpoint de servico.
2. Pesquise o protocolo DIDComm e explique em um paragrafo como ele utiliza os endpoints de servico do DID Document para troca de mensagens.
3. Desenhe um diagrama mostrando o fluxo completo: um verificador recebe um DID, resolve o DID Document, extrai a chave publica e verifica uma assinatura digital.

---

## Proxima Aula
Na proxima aula, vamos explorar os conceitos de Verifiable Credentials (VCs) e Verifiable Presentations (VPs) — os documentos digitais verificaveis que dao utilidade pratica aos DIDs. Voce vai entender como credenciais sao emitidas, apresentadas e verificadas no ecossistema de identidade descentralizada. Ate la!

---

## Questionario

**1. O que um DID Document contem?**
a) Dados pessoais como nome, endereco e data de nascimento do sujeito
b) Informacoes tecnicas como chaves publicas, metodos de verificacao e endpoints de servico
c) O historico completo de transacoes do sujeito na blockchain
d) Senhas criptografadas do sujeito para autenticacao em servicos
**Resposta: b**

**2. Qual e a funcao do campo `@context` em um DID Document?**
a) Armazenar o historico de alteracoes do documento
b) Definir o vocabulario JSON-LD para que todos os sistemas interpretem os campos da mesma forma
c) Indicar o endereco IP do servidor onde o documento esta hospedado
d) Listar os servicos de terceiros autorizados a acessar o documento
**Resposta: b**

**3. Qual relacao de verificacao e usada para assinar Verifiable Credentials?**
a) authentication
b) keyAgreement
c) assertionMethod
d) capabilityDelegation
**Resposta: c**

**4. O que o campo `service` descreve em um DID Document?**
a) Os servicos de nuvem onde os dados do sujeito estao armazenados
b) Endpoints que permitem interacao com o sujeito, como APIs de mensagens ou repositorios de credenciais
c) A lista de servicos web que o sujeito utiliza diariamente
d) Os provedores de internet autorizados a resolver o DID
**Resposta: b**

**5. Em qual cenario o campo `controller` de um DID Document conteria um DID diferente do sujeito?**
a) Quando o DID Document e armazenado em uma blockchain publica
b) Quando o sujeito deseja delegar controle, como em hierarquias organizacionais ou custodia
c) Quando o DID utiliza o metodo did:key
d) Quando o sujeito possui mais de uma chave publica
**Resposta: b**
