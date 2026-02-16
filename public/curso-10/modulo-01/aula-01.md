# Aula 1.1: Sintaxe do DID URI e regras do padrao W3C

## Abertura
Bem-vindo a aula 1.1! Nesta aula, vamos mergulhar na especificacao W3C DID Core, comecando pelo elemento mais fundamental: o DID URI. Entender a sintaxe exata de um Decentralized Identifier e o primeiro passo para construir e integrar sistemas de identidade descentralizada com rigor tecnico.

### Programa da aula:
1. Fundamentos do DID e o padrao W3C (introducao)
2. Anatomia completa do DID URI (base e aprofundamento)
3. Regras de conformidade e validacao (Conceito principal da aula)

---

## 1. Fundamentos do DID e o padrao W3C

### O que e um Decentralized Identifier
Um DID (Decentralized Identifier) e um tipo novo de identificador definido pela W3C que possui tres propriedades fundamentais: e globalmente unico, e resolvivel para um DID Document e nao depende de nenhuma autoridade centralizada para sua criacao ou gerenciamento.

Diferente de identificadores tradicionais como URLs de websites (que dependem do DNS) ou enderecos de email (que dependem de provedores), um DID e controlado exclusivamente pelo seu titular por meio de criptografia.

- **Exemplo**: O identificador `did:example:123456789abcdefghi` e um DID valido. Ele nao depende de nenhum servidor DNS, nenhum provedor de email e nenhuma autoridade certificadora para existir.

### A especificacao W3C DID Core
A W3C publicou a especificacao DID Core (W3C Recommendation) como o documento normativo que define a sintaxe, o modelo de dados e as operacoes fundamentais para DIDs. O documento estabelece regras que todos os DID Methods devem seguir para garantir interoperabilidade.

A especificacao define quatro operacoes CRUD sobre DIDs:

- **Create**: Gerar um novo DID e seu DID Document associado.
- **Read (Resolve)**: Dado um DID, obter o DID Document correspondente.
- **Update**: Modificar o DID Document (por exemplo, rotacionar chaves).
- **Delete (Deactivate)**: Desativar o DID, tornando-o irresolvivel.

- **Exemplo**: Um DID Method como `did:web` implementa essas quatro operacoes usando infraestrutura web convencional, enquanto `did:ethr` usa smart contracts na rede Ethereum.

---

## 2. Anatomia completa do DID URI

### Estrutura basica: scheme, method-name e method-specific-id
Todo DID segue uma estrutura rigida definida pela ABNF (Augmented Backus-Naur Form) na especificacao. A forma basica e:

```
did:method-name:method-specific-id
```

Os tres componentes sao:

- **scheme**: Sempre a string literal `did`. E case-insensitive na especificacao, mas a convencao e usar minusculas.
- **method-name**: Identifica qual DID Method governa este DID. Deve conter apenas caracteres minusculos `[a-z0-9]` e pode incluir colons para namespacing.
- **method-specific-id**: O identificador unico dentro do escopo daquele method. Os caracteres permitidos sao `[a-zA-Z0-9._%-]` alem de colons adicionais para sub-namespacing.

A gramatica ABNF completa e:

```abnf
did                = "did:" method-name ":" method-specific-id
method-name        = 1*method-char
method-char        = %x61-7A / DIGIT  ; a-z / 0-9
method-specific-id = *( *idchar ":" ) 1*idchar
idchar             = ALPHA / DIGIT / "." / "-" / "_" / pct-encoded
pct-encoded        = "%" HEXDIG HEXDIG
```

- **Exemplo**: Em `did:ethr:0x1234abcd...`, o scheme e `did`, o method-name e `ethr` e o method-specific-id e `0x1234abcd...` (um endereco Ethereum).

### DID URL: path, query e fragment
Alem do DID basico, a especificacao define o conceito de DID URL, que estende o DID com componentes adicionais inspirados na sintaxe de URIs genericas (RFC 3986):

```
did:method-name:method-specific-id/path?query#fragment
```

Cada componente adicional tem um proposito especifico:

- **path** (`/path`): Usado para referenciar recursos associados ao DID Document. E separado por `/`.
- **query** (`?query`): Passa parametros para o processo de resolucao. A especificacao define parametros padrao como `?versionId=` e `?versionTime=`.
- **fragment** (`#fragment`): Referencia um componente especifico dentro do DID Document, como uma chave publica ou um service endpoint.

```
did:example:123456789abcdefghi/path/to/resource?versionTime=2023-01-01T00:00:00Z#key-1
|---scheme---|---method---|---specific-id---|-------path-------|--------query--------|--frag--|
```

- **Exemplo**: O DID URL `did:example:123#key-1` referencia a chave de verificacao com id `key-1` dentro do DID Document de `did:example:123`. Isso e fundamental para que terceiros apontem diretamente para uma chave especifica ao verificar assinaturas.

### Parametros de query padronizados
A especificacao DID Core define tres parametros de query com semantica padronizada:

| Parametro | Descricao | Exemplo |
|---|---|---|
| `versionId` | Solicita uma versao especifica do DID Document | `?versionId=3` |
| `versionTime` | Solicita o DID Document valido em um timestamp | `?versionTime=2024-01-01T00:00:00Z` |
| `hl` | Hash link para integridade do recurso | `?hl=zQmWvQxTqb...` |

DID Methods podem definir parametros adicionais, mas devem prefixar com o nome do method para evitar colisoes (ex: `?service=` e padrao, mas `?mymethod:param=` e especifico).

- **Exemplo**: `did:web:example.com?versionTime=2024-06-15T12:00:00Z` solicita ao resolver que retorne o DID Document tal como estava em 15 de junho de 2024 ao meio-dia UTC.

---

## 3. Regras de conformidade e validacao

### Requisitos de conformidade para DIDs
A especificacao W3C DID Core define requisitos normativos usando as palavras-chave RFC 2119 (MUST, SHOULD, MAY). Os principais requisitos para um DID valido sao:

1. **MUST** comecar com a string `did:`.
2. **MUST** conter um method-name que corresponda a um DID Method registrado ou definido.
3. **MUST** conter um method-specific-id que siga as regras de caracteres permitidos.
4. **MUST NOT** conter espacos ou caracteres fora do conjunto permitido pela ABNF.
5. O method-name **MUST** ser composto apenas por letras minusculas e digitos.

Um validador simples em JavaScript pode ser implementado com regex:

```javascript
const DID_REGEX = /^did:[a-z0-9]+:[a-zA-Z0-9._%-]+(:[a-zA-Z0-9._%-]+)*$/;

function isValidDID(did) {
  return DID_REGEX.test(did);
}

// Testes
console.log(isValidDID("did:example:123"));        // true
console.log(isValidDID("did:web:example.com"));     // true
console.log(isValidDID("did:ethr:0x1234abcdef"));   // true
console.log(isValidDID("DID:example:123"));         // false (scheme maiusculo)
console.log(isValidDID("did:Example:123"));         // false (method maiusculo)
console.log(isValidDID("did::123"));                // false (method vazio)
```

- **Exemplo**: O DID `did:MY_METHOD:123` e invalido porque o method-name contem letras maiusculas e underscore, violando a regra ABNF de `method-char`.

### Validacao de DID URLs completos
Para validar DID URLs com path, query e fragment, a regex precisa ser expandida:

```javascript
const DID_URL_REGEX = /^did:[a-z0-9]+:[a-zA-Z0-9._%-]+(:[a-zA-Z0-9._%-]+)*(\/[^?#]*)?(\\?[^#]*)?(#.*)?$/;

function isValidDIDURL(didUrl) {
  return DID_URL_REGEX.test(didUrl);
}

console.log(isValidDIDURL("did:example:123/path?query=value#frag"));  // true
console.log(isValidDIDURL("did:example:123#key-1"));                   // true
console.log(isValidDIDURL("did:example:123?versionId=2"));             // true
```

### Registro de DID Methods na W3C
A W3C mantem um registro de DID Methods (DID Specification Registries) onde metodos podem ser listados. Embora o registro nao implique certificacao ou endorsement, ele serve como ponto central de descoberta. Cada method registrado deve fornecer:

- O method-name unico.
- Um link para a especificacao do method.
- O status da especificacao (rascunho, implementado, etc.).

Alguns methods amplamente utilizados incluem:

| Method | method-name | Substrate |
|---|---|---|
| DID Web | `web` | Infraestrutura web (HTTPS + DNS) |
| DID Ethr | `ethr` | Ethereum blockchain |
| DID Key | `key` | Chave publica autocontida |
| DID ION | `ion` | Bitcoin (via Sidetree) |
| DID Peer | `peer` | Peer-to-peer, sem ledger |

- **Exemplo**: `did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK` e um DID que codifica a chave publica diretamente no method-specific-id. Nao requer nenhum ledger ou servidor para resolucao — a chave publica e extraida diretamente do proprio identificador.

---

## Conclusao
Nesta aula, estudamos a fundo a sintaxe do DID URI conforme a especificacao W3C DID Core. Vimos que todo DID segue a estrutura `did:method-name:method-specific-id`, que DID URLs estendem essa sintaxe com path, query e fragment, e que existem regras rigorosas de conformidade definidas pela gramatica ABNF. Compreender essa sintaxe e essencial porque ela e a base sobre a qual todo o ecossistema de identidade descentralizada e construido — do DID Document ate os protocolos de verificacao.

---

## Licao de Casa
1. Escreva uma funcao em sua linguagem preferida que valide DIDs conforme a ABNF da especificacao e teste com pelo menos 10 exemplos (5 validos e 5 invalidos).
2. Consulte o DID Specification Registries da W3C e liste 5 DID Methods diferentes, descrevendo o substrate de cada um (blockchain, web, peer-to-peer, etc.).
3. Dado o DID URL `did:web:example.com:user:alice?versionTime=2024-01-01T00:00:00Z#key-2`, identifique e descreva cada componente (scheme, method-name, method-specific-id, path, query, fragment).

---

## Proxima Aula
Na proxima aula, vamos explorar a estrutura completa do DID Document, incluindo todos os seus campos: @context, id, verificationMethod, authentication, assertionMethod, keyAgreement, capabilityInvocation, capabilityDelegation, service e alsoKnownAs. Ate la!

---

## Questionario

**1. Qual e a estrutura basica de um DID conforme a especificacao W3C?**
a) method:did:identifier
b) did:method-name:method-specific-id
c) uri:did:method:id
d) did://method/identifier
**Resposta: b**

**2. Quais caracteres sao permitidos no method-name de um DID?**
a) Letras maiusculas e minusculas, digitos e hifens
b) Apenas letras minusculas e digitos
c) Qualquer caractere Unicode
d) Letras minusculas, digitos e underscores
**Resposta: b**

**3. Qual e a funcao do fragmento (#) em um DID URL?**
a) Indicar o protocolo de comunicacao
b) Referenciar um componente especifico dentro do DID Document
c) Definir o DID Method a ser utilizado
d) Codificar a chave privada do titular
**Resposta: b**

**4. O que o parametro de query `versionTime` faz em um DID URL?**
a) Define a data de expiracao do DID
b) Solicita o DID Document valido em um determinado timestamp
c) Indica quando o DID foi criado
d) Especifica o tempo maximo de resolucao
**Resposta: b**

**5. Qual das opcoes abaixo e um DID valido conforme a especificacao W3C?**
a) did:Example:123
b) DID:web:example.com
c) did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK
d) did::empty-method
**Resposta: c**
