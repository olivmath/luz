# Aula 1.2: Linguagens Suportadas no Ecossistema de Identidade Descentralizada

## Abertura
Bem-vindo a aula 1.2! Nesta aula, vamos analisar as quatro linguagens de programacao mais relevantes para o desenvolvimento de solucoes de identidade descentralizada: TypeScript/JavaScript, Rust, Go e Python. Cada uma ocupa um nicho especifico no ecossistema, e entender seus pontos fortes e limitacoes e fundamental para tomar decisoes arquiteturais corretas.

### Programa da aula:
1. TypeScript/JavaScript: o ecossistema dominante em SSI (introducao)
2. Rust e Go: performance e seguranca em infraestrutura critica (base e aprofundamento)
3. Python: prototipagem, automacao e agentes Aries (Conceito principal da aula)

---

## 1. TypeScript/JavaScript: o ecossistema dominante em SSI
### Por que TypeScript lidera o ecossistema
O TypeScript/JavaScript domina o desenvolvimento de identidade descentralizada por razoes praticas: a maioria dos frameworks (Veramo, did-jwt, @transmute) e escrita nessa linguagem, o ecossistema npm oferece centenas de pacotes relacionados, e a tipagem estatica do TypeScript reduz erros em operacoes criptograficas onde um tipo incorreto pode comprometer a seguranca.

```typescript
// Tipagem forte para operacoes com DID
interface DIDDocument {
  '@context': string | string[]
  id: string
  verificationMethod?: VerificationMethod[]
  authentication?: (string | VerificationMethod)[]
  service?: ServiceEndpoint[]
}

interface VerificationMethod {
  id: string
  type: string
  controller: string
  publicKeyJwk?: JsonWebKey
  publicKeyMultibase?: string
}

// Resolver tipado que garante retorno correto
async function resolveDID(did: string): Promise<DIDDocument> {
  const resolver = new Resolver(getResolver())
  const result = await resolver.resolve(did)
  if (result.didResolutionMetadata.error) {
    throw new Error(`Falha na resolucao: ${result.didResolutionMetadata.error}`)
  }
  return result.didDocument as DIDDocument
}
```

- **Exemplo**: Um erro comum em JavaScript puro e passar uma chave privada como string onde se espera um Uint8Array. O TypeScript captura isso em tempo de compilacao, evitando bugs criptograficos sutis.

### Padroes de projeto em TypeScript para SSI
O padrao Repository combinado com Factory e amplamente usado para abstrair a persistencia de chaves e credenciais:

```typescript
// Factory para criar signers baseados no tipo de chave
class SignerFactory {
  static create(keyType: 'Ed25519' | 'secp256k1' | 'P-256', privateKey: Uint8Array): Signer {
    switch (keyType) {
      case 'Ed25519': return EdDSASigner(privateKey)
      case 'secp256k1': return ES256KSigner(privateKey)
      case 'P-256': return ES256Signer(privateKey)
      default: throw new Error(`Tipo de chave nao suportado: ${keyType}`)
    }
  }
}

// Repository para credenciais com interface generica
interface CredentialRepository {
  store(vc: VerifiableCredential): Promise<string>
  retrieve(id: string): Promise<VerifiableCredential | null>
  list(filter: CredentialFilter): Promise<VerifiableCredential[]>
  revoke(id: string): Promise<void>
}

class CeramicCredentialRepository implements CredentialRepository {
  constructor(private ceramic: CeramicClient) {}

  async store(vc: VerifiableCredential): Promise<string> {
    const doc = await TileDocument.create(this.ceramic, vc, {
      controllers: [vc.issuer.id],
      family: 'verifiable-credentials',
    })
    return doc.id.toString()
  }

  async retrieve(id: string): Promise<VerifiableCredential | null> {
    const doc = await TileDocument.load(this.ceramic, id)
    return doc.content as VerifiableCredential
  }
  // ... demais metodos
}
```

- **Exemplo**: Com essa abstracoes, trocar o armazenamento de Ceramic para IPFS ou banco de dados relacional exige apenas implementar uma nova classe que respeite a interface `CredentialRepository`.

---

## 2. Rust e Go: performance e seguranca em infraestrutura critica
### Rust: seguranca de memoria para criptografia
O Rust e a linguagem preferida para implementacoes criptograficas de baixo nivel no ecossistema SSI. O DIDKit, o `ssi` crate e varias implementacoes de resolvers sao escritos em Rust. A garantia de seguranca de memoria sem garbage collector e essencial quando se manipula chaves privadas.

```rust
use ssi::did::{DIDMethod, Source};
use ssi::jwk::JWK;
use ssi::vc::{Credential, LinkedDataProofOptions, URI};
use ssi::jsonld::ContextLoader;

// Gerar par de chaves Ed25519 com zeragem automatica de memoria
fn create_issuer() -> Result<(JWK, String), Box<dyn std::error::Error>> {
    let jwk = JWK::generate_ed25519()?;
    let did = ssi::did_method::DIDKey.generate(&Source::Key(&jwk))?;
    Ok((jwk, did))
}

// Emissao de credencial com proof JSON-LD
async fn issue_credential(
    issuer_jwk: &JWK,
    issuer_did: &str,
    subject_did: &str,
) -> Result<Credential, Box<dyn std::error::Error>> {
    let mut credential = Credential {
        issuer: Some(ssi::vc::Issuer::URI(URI::String(issuer_did.to_string()))),
        credential_subject: ssi::vc::OneOrMany::One(ssi::vc::CredentialSubject {
            id: Some(URI::String(subject_did.to_string())),
            property_set: Some(serde_json::json!({"aprovado": true, "nota": 9.5}).as_object().unwrap().clone()),
        }),
        ..Default::default()
    };

    let proof_options = LinkedDataProofOptions::default();
    let mut context_loader = ContextLoader::default();
    let proof = credential.generate_proof(issuer_jwk, &proof_options, &DIDKey, &mut context_loader).await?;
    credential.add_proof(proof);
    Ok(credential)
}
```

O Rust tambem e usado para compilar modulos WASM que rodam no navegador, permitindo que operacoes criptograficas pesadas sejam executadas client-side com performance nativa:

```rust
// Compilacao para WASM com wasm-bindgen
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn verify_credential_wasm(vc_json: &str) -> Result<bool, JsValue> {
    let credential: Credential = serde_json::from_str(vc_json)
        .map_err(|e| JsValue::from_str(&format!("Parse error: {}", e)))?;
    // Verificacao sincrona para WASM
    let result = credential.verify_not_expired();
    Ok(result.is_ok())
}
```

- **Exemplo**: Quando uma wallet mobile precisa verificar centenas de credenciais offline, o modulo Rust compilado para WASM ou nativo via FFI oferece performance 10-50x superior ao JavaScript puro.

### Go: resolvers e servicos de infraestrutura
Go e amplamente utilizado para construir resolvers DID, servicos de revogacao e infraestrutura de rede. O Universal Resolver da DIF tem componentes em Go, e o framework TrustBloc usa Go extensivamente.

```go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"

    "github.com/hyperledger/aries-framework-go/pkg/doc/did"
    "github.com/hyperledger/aries-framework-go/pkg/vdr/key"
    "github.com/hyperledger/aries-framework-go/pkg/vdr/web"
)

// Resolver HTTP que suporta multiplos metodos DID
type MultiResolver struct {
    resolvers map[string]VDR
}

func NewMultiResolver() *MultiResolver {
    return &MultiResolver{
        resolvers: map[string]VDR{
            "key": key.New(),
            "web": web.New(),
        },
    }
}

func (mr *MultiResolver) Resolve(didURI string) (*did.DocResolution, error) {
    parsedDID, err := did.Parse(didURI)
    if err != nil {
        return nil, fmt.Errorf("DID invalido: %w", err)
    }
    resolver, ok := mr.resolvers[parsedDID.Method]
    if !ok {
        return nil, fmt.Errorf("metodo nao suportado: %s", parsedDID.Method)
    }
    return resolver.Read(didURI)
}

func handleResolve(w http.ResponseWriter, r *http.Request) {
    didParam := r.URL.Query().Get("did")
    resolver := NewMultiResolver()
    doc, err := resolver.Resolve(didParam)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    json.NewEncoder(w).Encode(doc)
}

func main() {
    http.HandleFunc("/resolve", handleResolve)
    fmt.Println("Resolver rodando em :8080")
    http.ListenAndServe(":8080", nil)
}
```

- **Exemplo**: Um resolver DID em Go consegue lidar com milhares de requisicoes concorrentes gracas as goroutines, tornando-o ideal para servicos de resolucao em producao com alto throughput.

---

## 3. Python: prototipagem, automacao e agentes Aries
### ACA-Py e o ecossistema Python para SSI
O Python e a linguagem principal do Aries Cloud Agent (ACA-Py), o agente de referencia do Hyperledger Aries. Alem disso, Python e amplamente usado para scripts de automacao, testes de integracao e prototipagem rapida de fluxos de credenciais.

```python
# Cliente Python para interagir com ACA-Py
import aiohttp
import asyncio
from dataclasses import dataclass
from typing import Optional

@dataclass
class AriesAgent:
    admin_url: str
    api_key: Optional[str] = None

    @property
    def headers(self):
        h = {"Content-Type": "application/json"}
        if self.api_key:
            h["X-API-Key"] = self.api_key
        return h

    async def create_did(self) -> dict:
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.admin_url}/wallet/did/create",
                headers=self.headers,
                json={"method": "key", "options": {"key_type": "ed25519"}}
            ) as resp:
                return await resp.json()

    async def issue_credential(self, connection_id: str, cred_def_id: str, attributes: dict) -> dict:
        payload = {
            "connection_id": connection_id,
            "cred_def_id": cred_def_id,
            "credential_preview": {
                "@type": "issue-credential/2.0/credential-preview",
                "attributes": [{"name": k, "value": str(v)} for k, v in attributes.items()]
            }
        }
        async with aiohttp.ClientSession() as session:
            async with session.post(
                f"{self.admin_url}/issue-credential-2.0/send-offer",
                headers=self.headers, json=payload
            ) as resp:
                return await resp.json()

async def main():
    agent = AriesAgent(admin_url="http://localhost:8001", api_key="minha-chave")
    did_result = await agent.create_did()
    print(f"DID criado: {did_result['result']['did']}")

asyncio.run(main())
```

- **Exemplo**: Um script Python pode automatizar o fluxo completo de teste: criar agente emissor, criar agente verificador, estabelecer conexao, emitir credencial e verificar — tudo em menos de 50 linhas.

### PyDID e bibliotecas nativas Python
A biblioteca `pydid` oferece modelos Pydantic para DID Documents, facilitando validacao e manipulacao:

```python
from pydid import DIDDocument, VerificationMethod, DIDUrl, Service
from pydid.verification_method import Ed25519VerificationKey2020

# Construir DID Document programaticamente
doc = DIDDocument(
    id="did:example:123456789",
    verification_method=[
        Ed25519VerificationKey2020(
            id=DIDUrl("did:example:123456789#key-1"),
            controller="did:example:123456789",
            public_key_multibase="z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
        )
    ],
    authentication=[DIDUrl("did:example:123456789#key-1")],
    service=[
        Service(
            id=DIDUrl("did:example:123456789#messaging"),
            type="DIDCommMessaging",
            service_endpoint="https://exemplo.com.br/didcomm"
        )
    ]
)

# Serializar para JSON
doc_json = doc.json(indent=2, exclude_none=True)

# Validar documento existente
raw_json = '{"id": "did:example:abc", "verificationMethod": [...]}'
validated_doc = DIDDocument.from_json(raw_json)  # Levanta excecao se invalido
```

- **Exemplo**: O PyDID e util para pipelines de validacao onde documentos DID recebidos de fontes externas precisam ser parseados e validados antes de serem processados.

---

## Conclusao
Nesta aula, analisamos como cada linguagem ocupa um espaco no ecossistema de identidade descentralizada. TypeScript/JavaScript domina o desenvolvimento de aplicacoes e SDKs com o maior numero de bibliotecas disponiveis. Rust oferece seguranca de memoria e performance para operacoes criptograficas e modulos WASM. Go e a escolha natural para servicos de infraestrutura de alta concorrencia como resolvers. Python brilha na prototipagem rapida e como linguagem principal do ACA-Py. Na pratica, projetos maduros frequentemente combinam multiplas linguagens, usando cada uma onde ela e mais forte.

---

## Licao de Casa
1. Implemente um resolver DID minimo em Go que suporte `did:web` e `did:key`, expondo um endpoint HTTP `/resolve?did=...`. Teste com pelo menos 3 DIDs diferentes.
2. Usando o `pydid` em Python, escreva um script que valide uma lista de 10 DID Documents (formato JSON) e gere um relatorio indicando quais sao validos e quais possuem erros.
3. Crie um modulo Rust compilado para WASM que exporte uma funcao `verifySignature(message, signature, publicKey)` e consuma-o em um projeto TypeScript com `@aspect/wasm`.

---

## Proxima Aula
Na proxima aula, vamos explorar as integracoes de armazenamento descentralizado — IPFS, Ceramic, Arweave, Ethereum e Bitcoin — entendendo como cada tecnologia pode ser usada para persistir DIDs, credenciais e dados de revogacao. Ate la!

---

## Questionario

**1. Por que o TypeScript e preferido ao JavaScript puro para desenvolvimento de solucoes SSI?**
a) TypeScript e mais rapido em tempo de execucao
b) A tipagem estatica previne erros em operacoes criptograficas em tempo de compilacao
c) TypeScript tem bibliotecas exclusivas nao disponiveis em JavaScript
d) TypeScript nao precisa de transpilacao
**Resposta: b**

**2. Qual a principal vantagem do Rust para implementacoes criptograficas no ecossistema SSI?**
a) Sintaxe mais simples que C
b) Garbage collector eficiente
c) Seguranca de memoria sem garbage collector, evitando vazamentos de chaves privadas
d) Compilacao mais rapida que Go
**Resposta: c**

**3. Qual linguagem e a principal do Aries Cloud Agent (ACA-Py)?**
a) TypeScript
b) Rust
c) Go
d) Python
**Resposta: d**

**4. Para que cenario o Go e mais indicado no ecossistema de identidade descentralizada?**
a) Desenvolvimento de wallets mobile
b) Servicos de infraestrutura com alta concorrencia, como resolvers DID
c) Prototipagem rapida de fluxos de credenciais
d) Compilacao de modulos WASM para navegadores
**Resposta: b**

**5. O que a biblioteca pydid oferece para desenvolvedores Python?**
a) Um agente DIDComm completo
b) Modelos Pydantic para validacao e manipulacao de DID Documents
c) Bindings FFI para o DIDKit em Rust
d) Uma wallet de credenciais verificaveis
**Resposta: b**
