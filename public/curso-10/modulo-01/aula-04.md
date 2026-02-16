# Aula 1.4: Resolucao deterministica e estrategias de caching

## Abertura
Bem-vindo a aula 1.4! Nesta aula, vamos estudar como a resolucao de DIDs funciona — o processo pelo qual um DID e transformado em seu DID Document correspondente. Vamos explorar a arquitetura de resolvers, o conceito de resolucao deterministica, os metadados retornados e as estrategias de caching que garantem performance sem comprometer a consistencia.

### Programa da aula:
1. Arquitetura de resolucao e a interface DID Resolution (introducao)
2. Resolucao deterministica e metadados (base e aprofundamento)
3. Estrategias de caching e invalidacao (Conceito principal da aula)

---

## 1. Arquitetura de resolucao e a interface DID Resolution

### O que e DID Resolution
DID Resolution e o processo de obter o DID Document associado a um DID. E a operacao "Read" do CRUD de DIDs. A especificacao DID Core define uma interface abstrata para essa operacao, e a DIF (Decentralized Identity Foundation) publicou a especificacao complementar "DID Resolution" com detalhes adicionais.

A funcao abstrata de resolucao e definida como:

```
resolve(did, resolutionOptions) -> (didResolutionMetadata, didDocument, didDocumentMetadata)
```

A funcao recebe um DID e opcoes de resolucao, e retorna tres componentes: metadados sobre a resolucao em si, o DID Document e metadados sobre o documento.

- **Exemplo**: Ao resolver `did:web:example.com`, o resolver faz uma requisicao HTTPS a `https://example.com/.well-known/did.json`, obtendo o DID Document. Os metadados de resolucao incluem informacoes como o content-type retornado e possiveis erros.

### Tipos de resolvers
A arquitetura de resolucao suporta diferentes topologias:

**Local Resolver**: Implementa a logica de resolucao diretamente na aplicacao. Cada DID Method suportado requer um driver especifico.

```python
class LocalResolver:
    def __init__(self):
        self.drivers = {}

    def register_driver(self, method_name: str, driver):
        self.drivers[method_name] = driver

    def resolve(self, did: str, options: dict = None) -> dict:
        parts = did.split(":")
        method_name = parts[1]
        if method_name not in self.drivers:
            return {
                "didResolutionMetadata": {"error": "methodNotSupported"},
                "didDocument": None,
                "didDocumentMetadata": {}
            }
        return self.drivers[method_name].resolve(did, options or {})
```

**Universal Resolver**: Um servico HTTP que agrega multiplos drivers de DID Methods. A DIF mantem uma implementacao de referencia que suporta dezenas de methods.

```http
GET /1.0/identifiers/did:web:example.com HTTP/1.1
Host: resolver.example.com
Accept: application/did+json
```

**Embedded Resolver**: Logica de resolucao embutida em frameworks e SDKs, como as bibliotecas `did-resolver` do ecossistema JavaScript.

```javascript
import { Resolver } from 'did-resolver';
import { getResolver as getWebResolver } from 'web-did-resolver';
import { getResolver as getEthrResolver } from 'ethr-did-resolver';

const resolver = new Resolver({
  ...getWebResolver(),
  ...getEthrResolver({ infuraProjectId: 'YOUR_PROJECT_ID' })
});

const result = await resolver.resolve('did:ethr:0x1234...');
console.log(result.didDocument);
console.log(result.didResolutionMetadata);
console.log(result.didDocumentMetadata);
```

- **Exemplo**: O Universal Resolver da DIF (https://dev.uniresolver.io/) permite resolver DIDs de multiplos methods via uma unica API HTTP. Internamente, cada method e processado por um driver Docker isolado.

### DID URL Dereferencing
Alem de `resolve()`, a especificacao define `dereference()` para DID URLs:

```
dereference(didUrl, dereferenceOptions) -> (dereferencingMetadata, contentStream, contentMetadata)
```

Enquanto `resolve()` retorna o DID Document completo, `dereference()` retorna o recurso especifico apontado pelo DID URL (por exemplo, uma chave especifica ou um service endpoint).

```javascript
// resolve() retorna o documento completo
const { didDocument } = await resolver.resolve('did:example:123');

// dereference() retorna um recurso especifico
// Para did:example:123#key-1, retorna o verification method com id "key-1"
const key = didDocument.verificationMethod.find(
  vm => vm.id === 'did:example:123#key-1'
);
```

- **Exemplo**: Ao verificar uma Verifiable Credential assinada com a chave `did:example:issuer#key-3`, o verificador faz dereference desse DID URL para obter apenas a chave publica necessaria, sem processar o documento inteiro.

---

## 2. Resolucao deterministica e metadados

### O principio da resolucao deterministica
Resolucao deterministica significa que, dado o mesmo DID e as mesmas condicoes (mesmo estado do ledger, mesmo timestamp), o resultado da resolucao deve ser identico independentemente de qual resolver e usado. Isso e fundamental para a confiabilidade do sistema.

Para que a resolucao seja deterministica, cada DID Method deve especificar:

1. **Fonte autoritativa**: Onde o DID Document e armazenado ou derivado (blockchain, servidor web, chave publica, etc.).
2. **Algoritmo de construcao**: Como o DID Document e construido a partir dos dados brutos da fonte.
3. **Regras de versionamento**: Como diferentes versoes do documento sao tratadas.

```
did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK
         |_______________________________________________|
         |  A chave publica esta codificada no proprio DID
         |  O DID Document e derivado deterministicamente
         v
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
  "verificationMethod": [{
    "id": "did:key:z6Mkh...#z6Mkh...",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:key:z6Mkh...",
    "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
  }],
  "authentication": ["did:key:z6Mkh...#z6Mkh..."],
  "assertionMethod": ["did:key:z6Mkh...#z6Mkh..."]
}
```

- **Exemplo**: `did:key` e o caso mais puro de resolucao deterministica: o DID Document e derivado matematicamente da chave publica codificada no DID. Nao ha consulta a nenhum sistema externo, e qualquer resolver produzira o mesmo resultado.

### DID Resolution Metadata
O primeiro componente retornado pela resolucao contem metadados sobre o processo de resolucao em si:

```json
{
  "didResolutionMetadata": {
    "contentType": "application/did+json",
    "duration": 245,
    "did": {
      "didString": "did:web:example.com",
      "methodSpecificId": "example.com",
      "method": "web"
    }
  }
}
```

Em caso de erro, o campo `error` e preenchido com um dos codigos padronizados:

| Codigo de Erro | Descricao |
|---|---|
| `invalidDid` | O DID fornecido nao e sintaticamente valido |
| `notFound` | O DID nao foi encontrado na fonte autoritativa |
| `representationNotSupported` | O media type solicitado nao e suportado |
| `methodNotSupported` | O resolver nao suporta o DID Method solicitado |
| `internalError` | Erro interno no resolver |

- **Exemplo**: Se voce tenta resolver `did:fake:123` em um resolver que nao tem driver para o method `fake`, o retorno sera `{"error": "methodNotSupported"}` no didResolutionMetadata.

### DID Document Metadata
O terceiro componente contem metadados sobre o DID Document retornado:

```json
{
  "didDocumentMetadata": {
    "created": "2023-06-15T10:30:00Z",
    "updated": "2024-01-20T14:00:00Z",
    "deactivated": false,
    "versionId": "3",
    "nextUpdate": "2024-07-20T14:00:00Z",
    "nextVersionId": "4",
    "equivalentId": ["did:example:alt-id-123"],
    "canonicalId": "did:example:123"
  }
}
```

Propriedades importantes:

- **created/updated**: Timestamps de criacao e ultima atualizacao.
- **deactivated**: Booleano indicando se o DID foi desativado.
- **versionId**: Identificador da versao atual do documento.
- **canonicalId**: O DID canonico quando multiplas formas sao equivalentes.
- **equivalentId**: Lista de DIDs alternativos que resolvem para o mesmo documento.

- **Exemplo**: Um DID no metodo `did:ion` pode ter uma forma longa (com o initial state inline) e uma forma curta (apenas o hash). O `canonicalId` indica a forma curta como a forma preferida, e `equivalentId` lista a forma longa.

---

## 3. Estrategias de caching e invalidacao

### Por que cachear DID Documents
A resolucao de DIDs pode envolver operacoes custosas: consultas a blockchains, requisicoes HTTP, processamento de merkle proofs. Em sistemas de producao que verificam credenciais em escala, resolver o mesmo DID repetidamente a cada verificacao e ineficiente.

O caching de DID Documents melhora:

- **Latencia**: Evita round-trips a redes externas.
- **Throughput**: Permite verificar mais credenciais por segundo.
- **Resiliencia**: Continua funcionando mesmo se a fonte autoritativa estiver temporariamente indisponivel.
- **Custo**: Reduz chamadas a APIs pagas (como provedores de blockchain).

### Estrategias de caching por DID Method

Cada DID Method tem caracteristicas diferentes que influenciam a estrategia de caching ideal:

**did:key — Cache infinito:**
Como o DID Document e derivado da chave codificada no DID, o resultado nunca muda. O cache pode ser infinito.

```python
class DIDKeyCache:
    def __init__(self):
        self.cache = {}

    def resolve(self, did: str) -> dict:
        if did in self.cache:
            return self.cache[did]
        doc = self._derive_document(did)
        self.cache[did] = doc  # Cache permanente
        return doc
```

**did:web — Cache com TTL baseado em HTTP headers:**
DID Documents do method `web` sao servidos via HTTPS, portanto podem usar headers HTTP padrao para controle de cache.

```python
import requests
import time

class DIDWebCache:
    def __init__(self):
        self.cache = {}  # {did: (document, expiry_time, etag)}

    def resolve(self, did: str) -> dict:
        if did in self.cache:
            doc, expiry, etag = self.cache[did]
            if time.time() < expiry:
                return doc
            # Cache expirado - revalidar com ETag
            headers = {"If-None-Match": etag} if etag else {}
            response = self._fetch(did, headers)
            if response.status_code == 304:
                # Documento nao mudou - renovar cache
                new_expiry = self._parse_max_age(response.headers)
                self.cache[did] = (doc, new_expiry, etag)
                return doc
            return self._update_cache(did, response)
        return self._fetch_and_cache(did)

    def _parse_max_age(self, headers) -> float:
        cache_control = headers.get("Cache-Control", "")
        # Parse max-age directive
        for directive in cache_control.split(","):
            if "max-age" in directive:
                seconds = int(directive.split("=")[1].strip())
                return time.time() + seconds
        return time.time() + 300  # Default 5 minutos
```

**did:ethr — Cache com monitoramento de eventos:**
DID Documents baseados em blockchain mudam quando transacoes sao executadas. O cache pode ser invalidado monitorando eventos do smart contract.

```javascript
const { ethers } = require('ethers');

class DIDEthrCache {
  constructor(provider, registryAddress) {
    this.cache = new Map();
    this.registry = new ethers.Contract(
      registryAddress, REGISTRY_ABI, provider
    );
    // Monitorar eventos de mudanca
    this.registry.on('DIDAttributeChanged', (identity, name, value, validity) => {
      const did = `did:ethr:${identity}`;
      this.cache.delete(did);  // Invalidar cache
      console.log(`Cache invalidado para ${did}`);
    });
  }

  async resolve(did) {
    if (this.cache.has(did)) {
      return this.cache.get(did);
    }
    const doc = await this._resolveFromChain(did);
    this.cache.set(did, doc);
    return doc;
  }
}
```

- **Exemplo**: Um verificador de credenciais que processa 10.000 verificacoes por minuto, onde 80% referenciam os mesmos 100 issuers, pode reduzir chamadas ao blockchain de 10.000/min para menos de 100/min com caching adequado.

### Cache hierarquico e invalidacao
Para sistemas de alta escala, uma arquitetura de cache em multiplos niveis e recomendada:

```
[Aplicacao] -> [Cache L1: In-Memory, TTL curto]
            -> [Cache L2: Redis/Memcached, TTL medio]
            -> [Cache L3: Disco, TTL longo]
            -> [Resolver: Fonte autoritativa]
```

```python
class HierarchicalDIDCache:
    def __init__(self, l1_ttl=60, l2_ttl=300, l3_ttl=3600):
        self.l1 = {}  # In-memory
        self.l2 = RedisClient()  # Redis
        self.l3 = DiskCache()  # Disco
        self.l1_ttl = l1_ttl
        self.l2_ttl = l2_ttl
        self.l3_ttl = l3_ttl

    def resolve(self, did: str) -> dict:
        # L1: In-memory
        result = self._get_l1(did)
        if result:
            return result

        # L2: Redis
        result = self._get_l2(did)
        if result:
            self._set_l1(did, result)
            return result

        # L3: Disco
        result = self._get_l3(did)
        if result:
            self._set_l2(did, result)
            self._set_l1(did, result)
            return result

        # Resolver
        result = self._resolve_from_source(did)
        self._set_l3(did, result)
        self._set_l2(did, result)
        self._set_l1(did, result)
        return result
```

Estrategias de invalidacao:

| Estrategia | Descricao | Melhor para |
|---|---|---|
| TTL (Time-to-Live) | Expira apos tempo fixo | did:web, cenarios gerais |
| Event-driven | Invalida ao detectar mudanca | did:ethr, methods baseados em blockchain |
| Stale-while-revalidate | Serve cache expirado enquanto revalida em background | Alta disponibilidade |
| Versioned | Usa versionId do metadata para checar mudancas | Methods com versionamento nativo |

- **Exemplo**: A estrategia "stale-while-revalidate" e especialmente util para verificadores de credenciais que nao podem tolerar latencia. O verificador usa o cache mesmo expirado, mas dispara uma resolucao em background para atualizar. Se a chave do issuer foi rotacionada, a proxima verificacao usara o documento atualizado.

---

## Conclusao
Nesta aula, estudamos a fundo o processo de resolucao de DIDs, desde a interface abstrata `resolve()` ate implementacoes concretas de resolvers locais, universais e embedded. Vimos que a resolucao deterministica e um principio fundamental que garante consistencia, e que os metadados de resolucao e de documento fornecem informacoes essenciais para decisoes de confianca. Finalmente, exploramos estrategias de caching adaptadas a cada DID Method — desde cache infinito para `did:key` ate invalidacao por eventos para methods baseados em blockchain. Essas estrategias sao criticas para construir sistemas de identidade descentralizada que funcionem em escala de producao.

---

## Licao de Casa
1. Implemente um resolver local em sua linguagem preferida que suporte pelo menos dois DID Methods (sugestao: `did:key` e `did:web`). O resolver deve retornar os tres componentes da resolucao (didResolutionMetadata, didDocument, didDocumentMetadata).
2. Projete uma estrategia de caching para um sistema que verifica 50.000 Verifiable Credentials por hora, onde 60% dos issuers usam `did:web` e 40% usam `did:ethr`. Documente os TTLs escolhidos, a arquitetura de cache e a estrategia de invalidacao para cada method.
3. Pesquise o Universal Resolver da DIF e resolva pelo menos 3 DIDs diferentes (um `did:web`, um `did:key` e um terceiro method de sua escolha). Documente os metadados retornados e compare as diferencas.

---

## Proxima Aula
Na proxima aula, vamos iniciar o Modulo 2 estudando criptografia assimetrica: pares de chaves e assinaturas digitais, a base criptografica sobre a qual todo o ecossistema de identidade descentralizada e construido. Ate la!

---

## Questionario

**1. Qual e a assinatura da funcao abstrata de resolucao definida na especificacao DID Core?**
a) resolve(did) -> didDocument
b) resolve(did, options) -> (didResolutionMetadata, didDocument, didDocumentMetadata)
c) resolve(did) -> (didDocument, error)
d) resolve(did, method) -> didDocument
**Resposta: b**

**2. Qual codigo de erro e retornado quando o DID fornecido nao e sintaticamente valido?**
a) notFound
b) methodNotSupported
c) invalidDid
d) internalError
**Resposta: c**

**3. Por que did:key permite cache infinito?**
a) Porque o servidor nunca muda o documento
b) Porque o DID Document e derivado matematicamente da chave codificada no DID e nunca muda
c) Porque a blockchain onde esta registrado e imutavel
d) Porque o protocolo HTTP define cache permanente para esse method
**Resposta: b**

**4. Qual e a diferenca entre resolve() e dereference()?**
a) resolve() e mais rapido que dereference()
b) resolve() retorna o DID Document completo, dereference() retorna um recurso especifico apontado pelo DID URL
c) resolve() funciona apenas com JSON, dereference() funciona com qualquer formato
d) Nao ha diferenca, sao sinonimos
**Resposta: b**

**5. Qual estrategia de caching e mais adequada para DID Documents resolvidos via did:ethr?**
a) Cache infinito sem invalidacao
b) TTL fixo de 24 horas
c) Invalidacao por eventos monitorando transacoes no smart contract
d) Sem cache, sempre resolver diretamente
**Resposta: c**
