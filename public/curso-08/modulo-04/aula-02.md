# Aula 4.2: DID URLs e Fragments: Referenciando Chaves e Servicos Especificos

## Abertura
Bem-vindo a aula 4.2! Nesta aula, vamos mergulhar na sintaxe e semantica das DID URLs, incluindo fragments, paths, queries e parametros especiais. DID URLs estendem o identificador DID basico para permitir referenciar recursos especificos dentro de um DID Document — como uma chave publica individual ou um endpoint de servico. Dominar essa sintaxe e fundamental para construir interacoes precisas entre agentes em sistemas de identidade descentralizada.

### Programa da aula:
1. Anatomia de uma DID URL (estrutura e componentes)
2. Fragments e referenciamento interno (chaves e servicos)
3. Parametros de query e dereferencing (resolucao avancada)

---

## 1. Anatomia de uma DID URL

### Estrutura Geral
Uma DID URL segue a estrutura definida na especificacao W3C DID Core e estende a sintaxe generica de URIs (RFC 3986). A forma completa e:

```
did:method:specific-id[/path][?query][#fragment]
```

Cada componente tem uma funcao especifica:

- **DID base**: `did:method:specific-id` — o identificador raiz.
- **Path**: `/path/to/resource` — referencia recursos externos associados ao DID.
- **Query**: `?param=value` — parametros para modificar o comportamento da resolucao.
- **Fragment**: `#key-1` — referencia um componente interno do DID Document.

- **Exemplo**: Decomposicao de uma DID URL completa:
```
did:example:123456/credentials/status?versionTime=2024-01-01T00:00:00Z#key-1
|_________________| |_________________| |________________________________| |____|
     DID base            path                     query                   fragment
```

### Conformidade com RFC 3986
DID URLs sao URIs validas conforme a RFC 3986, o que significa que podem ser usadas em qualquer contexto que aceite URIs — headers HTTP, campos JSON-LD, atributos XML, etc.

Regras importantes de encoding:
- Caracteres reservados no `specific-id` devem ser percent-encoded.
- Fragments sao processados localmente (nao enviados ao servidor/resolver).
- A comparacao de DID URLs e case-sensitive para a maioria dos metodos.

- **Exemplo**: DID URL com caracteres especiais encodados:
```
did:web:example.com%3A3000:user:alice
```
Aqui, `%3A` representa o caractere `:` (porta 3000) no metodo `did:web`.

---

## 2. Fragments e Referenciamento Interno

### Referenciando Chaves de Verificacao
Fragments (iniciados com `#`) sao o mecanismo principal para referenciar elementos especificos dentro de um DID Document. O caso de uso mais comum e referenciar chaves em `verificationMethod`.

Quando um DID Document define multiplas chaves, cada uma recebe um `id` que e uma DID URL com fragment:

```json
{
  "id": "did:example:123",
  "verificationMethod": [
    {
      "id": "did:example:123#key-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:example:123",
      "publicKeyMultibase": "z6Mkf5..."
    },
    {
      "id": "did:example:123#key-2",
      "type": "X25519KeyAgreementKey2020",
      "controller": "did:example:123",
      "publicKeyMultibase": "z6LSb..."
    }
  ],
  "authentication": ["did:example:123#key-1"],
  "keyAgreement": ["did:example:123#key-2"]
}
```

- **Exemplo**: Para verificar uma assinatura, o verificador precisa saber exatamente qual chave usar. O campo `verificationMethod` em uma prova (proof) referencia a chave via DID URL com fragment:
```json
{
  "proof": {
    "type": "Ed25519Signature2020",
    "verificationMethod": "did:example:123#key-1",
    "proofPurpose": "authentication",
    "proofValue": "z3FXQje..."
  }
}
```

### Referenciando Endpoints de Servico
Fragments tambem sao usados para identificar servicos especificos no DID Document. Cada servico tem um `id` unico:

```json
{
  "service": [
    {
      "id": "did:example:123#didcomm",
      "type": "DIDCommMessaging",
      "serviceEndpoint": "https://agent.example.com/didcomm"
    },
    {
      "id": "did:example:123#hub",
      "type": "IdentityHub",
      "serviceEndpoint": "https://hub.example.com/user/123"
    }
  ]
}
```

- **Exemplo**: Para iniciar uma conexao DIDComm com um agente, o sistema resolve `did:example:123#didcomm`, extrai o `serviceEndpoint` e envia a mensagem para o URL indicado.

A convencao de nomes para fragments deve ser descritiva e consistente:
- `#key-1`, `#key-auth`, `#key-agreement` para chaves.
- `#didcomm`, `#hub`, `#linked-domains` para servicos.
- Fragments sao case-sensitive e nao devem conter espacos.

---

## 3. Parametros de Query e Dereferencing

### DID Parameters Padronizados
A especificacao DID Core define parametros de query padronizados que modificam o comportamento da resolucao:

| Parametro | Funcao | Exemplo |
|-----------|--------|---------|
| `service` | Seleciona um servico para dereferencing | `?service=didcomm` |
| `relativeRef` | Referencia relativa ao serviceEndpoint | `?relativeRef=/messages` |
| `versionId` | Resolve uma versao especifica do documento | `?versionId=3` |
| `versionTime` | Resolve o estado do documento em um timestamp | `?versionTime=2024-01-01` |
| `hl` | Hashlink para integridade do recurso | `?hl=zQm...` |

- **Exemplo**: Resolvendo o estado historico de um DID Document:
```
did:ion:EiA...?versionId=2
```
Retorna o DID Document na segunda versao, util para verificar credenciais emitidas quando o documento estava naquele estado.

- **Exemplo**: Combinando `service` e `relativeRef` para dereferencing:
```
did:example:123?service=hub&relativeRef=/collections/credentials
```
O resolver encontra o servico `hub`, extrai o `serviceEndpoint` e concatena com `/collections/credentials`, resultando em:
```
https://hub.example.com/user/123/collections/credentials
```

### DID URL Dereferencing
Dereferencing e o processo de obter o recurso final apontado por uma DID URL. E distinto da resolucao:

- **Resolucao**: DID -> DID Document (documento completo).
- **Dereferencing**: DID URL -> recurso especifico (chave, servico, recurso externo).

O algoritmo de dereferencing:

1. **Resolver o DID base**: Obter o DID Document completo.
2. **Aplicar parametros de query**: Filtrar por versao, servico, etc.
3. **Aplicar fragment**: Localizar o elemento especifico no documento.
4. **Retornar o recurso**: Entregar o recurso final com metadados.

- **Exemplo**: Dereferencing completo de `did:example:123?versionId=2#key-1`:
```
Passo 1: Resolver did:example:123 -> DID Document (versao atual)
Passo 2: Aplicar versionId=2 -> DID Document (versao 2)
Passo 3: Aplicar #key-1 -> Localizar verificationMethod com id "#key-1"
Passo 4: Retornar o objeto verificationMethod correspondente
```

Resultado do dereferencing:
```json
{
  "dereferencingMetadata": { "contentType": "application/did+ld+json" },
  "contentStream": {
    "id": "did:example:123#key-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:example:123",
    "publicKeyMultibase": "z6Mkf5..."
  },
  "contentMetadata": {}
}
```

---

## Conclusao
Nesta aula, exploramos a anatomia completa das DID URLs, incluindo paths, queries e fragments. Vimos como fragments permitem referenciar chaves e servicos especificos dentro de um DID Document, como parametros de query modificam a resolucao, e como o processo de dereferencing transforma uma DID URL em um recurso concreto. Essa granularidade de enderecamento e o que torna o sistema DID poderoso o suficiente para suportar interacoes complexas entre agentes, verificacao de assinaturas e roteamento de mensagens.

---

## Licao de Casa
1. Construa um DID Document completo com pelo menos 3 chaves de verificacao (para authentication, assertionMethod e keyAgreement) e 2 servicos, usando fragments descritivos e consistentes.
2. Implemente uma funcao de parsing de DID URLs que extraia corretamente cada componente (method, specific-id, path, query params, fragment) e valide a conformidade com a sintaxe.
3. Simule o processo de dereferencing para a DID URL `did:web:example.com#key-auth?versionTime=2024-06-01T00:00:00Z`, documentando cada passo e o resultado esperado.

---

## Proxima Aula
Na proxima aula, vamos estudar o Universal Resolver e o Universal Registrar, entendendo como essas ferramentas abstraem a complexidade de multiplos metodos DID em uma interface unificada. Ate la!

---

## Questionario

**1. Qual componente de uma DID URL referencia um elemento interno do DID Document?**
a) Path
b) Query
c) Fragment
d) Scheme
**Resposta: c**

**2. Qual e a diferenca entre resolucao e dereferencing de um DID?**
a) Nao ha diferenca, sao sinonimos
b) Resolucao retorna o DID Document completo; dereferencing retorna um recurso especifico apontado pela DID URL
c) Dereferencing retorna o DID Document; resolucao retorna um recurso especifico
d) Resolucao e feita on-chain; dereferencing e feita off-chain
**Resposta: b**

**3. Qual parametro de query permite resolver um DID Document em um estado historico especifico?**
a) ?timestamp
b) ?history=true
c) ?versionTime
d) ?state
**Resposta: c**

**4. No exemplo `did:example:123?service=hub&relativeRef=/collections`, o que o parametro `relativeRef` faz?**
a) Define o tipo do servico a ser consultado
b) Especifica um caminho relativo que e concatenado ao serviceEndpoint do servico selecionado
c) Indica a versao relativa do DID Document
d) Referencia um fragment relativo dentro do DID Document
**Resposta: b**

**5. Qual e a convencao correta para o `id` de um verificationMethod em um DID Document?**
a) Apenas o fragment, como "#key-1"
b) Uma URL externa como "https://example.com/keys/1"
c) O DID completo com fragment, como "did:example:123#key-1"
d) Um UUID aleatorio
**Resposta: c**
