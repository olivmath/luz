# Aula 5.1: Bibliotecas e Frameworks para Identidade Descentralizada

## Abertura
Bem-vindo a aula 5.1! Nesta aula, vamos explorar as principais bibliotecas e frameworks que permitem construir solucoes de identidade descentralizada na pratica. Conhecer essas ferramentas e essencial para qualquer engenheiro que deseja implementar sistemas baseados em DIDs e Verifiable Credentials sem reinventar a roda. Vamos analisar a arquitetura interna, os trade-offs e os casos de uso ideais de cada uma.

### Programa da aula:
1. Frameworks completos: Veramo e Hyperledger Aries (introducao)
2. Bibliotecas especializadas: DIDKit, @transmute/did e did-jwt (base e aprofundamento)
3. Plataformas e SDKs: SpruceID e Trinsic (Conceito principal da aula)

---

## 1. Frameworks completos: Veramo e Hyperledger Aries
### Veramo: arquitetura modular em TypeScript
O Veramo (anteriormente conhecido como uPort DAF) e um framework TypeScript que adota uma arquitetura baseada em plugins. Seu nucleo e minimalista — o `@veramo/core` fornece apenas o sistema de agentes e a interface de plugins. Toda funcionalidade real (criacao de DIDs, emissao de VCs, resolucao) vem de plugins composiveis.

A estrutura de um agente Veramo segue o padrao de injecao de dependencias:

```typescript
import { createAgent } from '@veramo/core'
import { DIDManager } from '@veramo/did-manager'
import { KeyManager } from '@veramo/key-manager'
import { CredentialPlugin } from '@veramo/credential-w3c'
import { DIDResolverPlugin } from '@veramo/did-resolver'
import { Resolver } from 'did-resolver'
import { getResolver as ethrDidResolver } from 'ethr-did-resolver'

const agent = createAgent({
  plugins: [
    new KeyManager({ store: new MemoryKeyStore(), kms: { local: new KeyManagementSystem(new MemoryPrivateKeyStore()) } }),
    new DIDManager({ store: new MemoryDIDStore(), defaultProvider: 'did:ethr', providers: {} }),
    new CredentialPlugin(),
    new DIDResolverPlugin({ resolver: new Resolver({ ...ethrDidResolver({ infuraProjectId: 'SEU_PROJECT_ID' }) }) }),
  ],
})

// Criar um DID
const did = await agent.didManagerCreate({ alias: 'meu-did', provider: 'did:ethr' })

// Emitir uma Verifiable Credential
const vc = await agent.createVerifiableCredential({
  credential: {
    issuer: { id: did.did },
    credentialSubject: { id: 'did:example:holder', nome: 'Joao Silva', curso: 'Engenharia' },
  },
  proofFormat: 'jwt',
})
```

- **Exemplo**: O Veramo e ideal quando voce precisa suportar multiplos metodos DID no mesmo projeto. Basta trocar ou adicionar plugins sem alterar a logica de negocio.

### Hyperledger Aries: protocolo e interoperabilidade
O Hyperledger Aries e mais do que uma biblioteca — e uma arquitetura de referencia para agentes de identidade descentralizada. Diferente do Veramo, o Aries define protocolos de comunicacao entre agentes (DIDComm), incluindo troca de credenciais, provas e conexoes.

A implementacao principal em Python e o Aries Cloud Agent (ACA-Py), que expoe uma API REST completa:

```bash
# Iniciar o ACA-Py com suporte a Indy
aca-py start \
  --inbound-transport http 0.0.0.0 8000 \
  --outbound-transport http \
  --endpoint http://localhost:8000 \
  --admin 0.0.0.0 8001 \
  --admin-insecure-mode \
  --wallet-type askar \
  --wallet-name minha-wallet \
  --wallet-key chave-secreta \
  --genesis-url https://raw.githubusercontent.com/sovrin-foundation/sovrin/master/sovrin/pool_transactions_sandbox_genesis
```

```python
import requests

# Criar convite de conexao via API do ACA-Py
response = requests.post('http://localhost:8001/connections/create-invitation',
    json={"my_label": "Emissor Universidade"})
invitation = response.json()['invitation']

# Emitir credencial apos conexao estabelecida
credential_offer = requests.post('http://localhost:8001/issue-credential/send-offer',
    json={
        "connection_id": "conn-id-aqui",
        "cred_def_id": "WgWxqztrNooG92RXvxSTWv:3:CL:20:tag",
        "credential_preview": {
            "@type": "issue-credential/1.0/credential-preview",
            "attributes": [{"name": "nome", "value": "Maria Santos"}, {"name": "grau", "value": "Mestrado"}]
        }
    })
```

- **Exemplo**: O Aries e a escolha certa para cenarios que exigem comunicacao bidirecional entre agentes, como emissao de credenciais em tempo real entre universidades e alunos.

---

## 2. Bibliotecas especializadas: DIDKit, @transmute/did e did-jwt
### DIDKit: multi-linguagem via Rust e FFI
O DIDKit, desenvolvido pela SpruceID, e uma biblioteca Rust que oferece bindings para multiplas linguagens via FFI (Foreign Function Interface). Isso permite usar a mesma engine criptografica em TypeScript, Python, Java, Go e ate Flutter.

```rust
// Rust nativo com DIDKit
use didkit::{DIDMethod, Source, JWK, LinkedDataProofOptions};

let jwk = JWK::generate_ed25519().unwrap();
let did = didkit::DID_KEY.generate(&Source::Key(&jwk)).unwrap();

let vc_json = serde_json::json!({
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    "type": ["VerifiableCredential"],
    "issuer": did,
    "issuanceDate": "2025-01-01T00:00:00Z",
    "credentialSubject": { "id": "did:example:aluno123", "aprovado": true }
});

let proof_options = LinkedDataProofOptions::default();
let vc_signed = didkit::credential_issue(&vc_json.to_string(), &proof_options, &jwk).await.unwrap();
```

```typescript
// Usando DIDKit via WASM no Node.js
import * as DIDKit from '@spruceid/didkit-wasm-node';

const jwk = DIDKit.generateEd25519Key();
const did = DIDKit.keyToDID('key', jwk);
const vc = await DIDKit.issueCredential(JSON.stringify(credential), JSON.stringify(proofOptions), jwk);
```

- **Exemplo**: Se voce precisa assinar credenciais tanto no backend (Node.js) quanto em um app mobile (Flutter), o DIDKit garante que a mesma logica criptografica e usada em ambos.

### @transmute/did e did-jwt: ferramentas focadas
O pacote `@transmute/did` foca em operacoes com DID Documents e resolucao, enquanto o `did-jwt` e a biblioteca padrao para trabalhar com JWTs assinados por DIDs.

```typescript
// did-jwt: criar e verificar JWT assinado por DID
import { createJWT, verifyJWT } from 'did-jwt'
import { Resolver } from 'did-resolver'
import { getResolver } from 'ethr-did-resolver'

const signer = ES256KSigner(hexToBytes(privateKeyHex))

const jwt = await createJWT(
  { aud: 'did:ethr:0xVerificador', exp: Math.floor(Date.now() / 1000) + 3600, claims: { role: 'admin' } },
  { issuer: 'did:ethr:0xEmissor', signer },
  { alg: 'ES256K' }
)

const resolver = new Resolver(getResolver({ infuraProjectId: 'PROJECT_ID' }))
const verified = await verifyJWT(jwt, { resolver, audience: 'did:ethr:0xVerificador' })
console.log(verified.payload) // { aud, exp, claims, iss, iat }
```

- **Exemplo**: O `did-jwt` e ideal para autenticacao stateless em APIs REST. O servidor verifica o JWT resolvendo o DID do emissor sem consultar banco de dados.

---

## 3. Plataformas e SDKs: SpruceID e Trinsic
### SpruceID: identidade soberana em producao
A SpruceID oferece um ecossistema completo alem do DIDKit. O SpruceID inclui o Credible (wallet mobile), o Treehouse (armazenamento de dados controlado pelo usuario) e integracao nativa com Sign-In with Ethereum (SIWE).

```typescript
// Sign-In with Ethereum usando SpruceID (SIWE)
import { SiweMessage } from 'siwe'

const message = new SiweMessage({
  domain: 'app.exemplo.com.br',
  address: '0x1234...abcd',
  statement: 'Autenticacao via identidade descentralizada',
  uri: 'https://app.exemplo.com.br/login',
  version: '1',
  chainId: 1,
  nonce: 'nonce-aleatorio-32chars',
})

const preparedMessage = message.prepareMessage()
// Usuario assina com sua wallet Ethereum
const signature = await signer.signMessage(preparedMessage)
// Backend verifica
const verification = await message.verify({ signature })
```

- **Exemplo**: Um marketplace descentralizado pode usar SIWE para autenticar usuarios sem armazenar senhas, vinculando a sessao ao endereco Ethereum do usuario.

### Trinsic: SDK empresarial com abstracoes de alto nivel
O Trinsic oferece SDKs em multiplas linguagens com uma API gRPC que abstrai a complexidade de protocolos como DIDComm e emissao de credenciais. E voltado para integracao rapida em ambientes corporativos.

```typescript
// Trinsic SDK - emissao de credencial verificavel
import { TrinsicService } from '@trinsic/trinsic'

const trinsic = new TrinsicService({ authToken: 'SEU_AUTH_TOKEN' })

// Definir template de credencial
const template = await trinsic.template().create({
  name: 'Diploma Universitario',
  fields: { nome: { type: 'string' }, curso: { type: 'string' }, ano: { type: 'number' } },
})

// Emitir credencial
const credential = await trinsic.credential().issue({
  templateId: template.data?.id,
  valuesJson: JSON.stringify({ nome: 'Ana Souza', curso: 'Ciencia da Computacao', ano: 2025 }),
})

// Verificar credencial
const verification = await trinsic.credential().checkStatus({ credentialStatusId: credential.data?.credentialId })
```

- **Exemplo**: Uma fintech que precisa integrar verificacao de identidade em semanas (nao meses) pode usar o Trinsic como camada de abstracoes, migrando para solucoes mais customizadas posteriormente.

### Comparativo tecnico entre frameworks

| Caracteristica      | Veramo       | Aries (ACA-Py) | DIDKit     | Trinsic    |
|---------------------|-------------|----------------|------------|------------|
| Linguagem principal | TypeScript  | Python         | Rust       | Multi (gRPC)|
| Protocolos DIDComm  | Plugin      | Nativo         | Nao        | Nativo     |
| Metodos DID         | Multiplos   | Indy/Sovrin    | did:key+   | Multiplos  |
| Formato de VC       | JWT/JSON-LD | AnonCreds      | JSON-LD    | JSON-LD    |
| Hospedagem          | Self-hosted | Self-hosted    | Embarcado  | Cloud/Self |

---

## Conclusao
Nesta aula, percorremos o ecossistema de ferramentas para identidade descentralizada. Frameworks completos como Veramo e Hyperledger Aries oferecem arquiteturas extensiveis para cenarios complexos. Bibliotecas especializadas como DIDKit e did-jwt fornecem building blocks precisos para operacoes especificas. Plataformas como SpruceID e Trinsic aceleram o time-to-market com abstracoes de alto nivel. A escolha entre essas ferramentas depende do cenario: prototipacao rapida, producao enterprise ou integracao multi-linguagem.

---

## Licao de Casa
1. Instale o Veramo CLI (`npx @veramo/cli create-config`) e crie um agente local. Gere um DID `did:ethr` e emita uma Verifiable Credential de teste.
2. Suba uma instancia do ACA-Py via Docker e crie uma conexao entre dois agentes usando a API REST. Documente os endpoints utilizados.
3. Compare o tamanho e tempo de verificacao de uma VC emitida com `did-jwt` (formato JWT) versus uma emitida com DIDKit (formato JSON-LD com Linked Data Proof).

---

## Proxima Aula
Na proxima aula, vamos analisar as linguagens de programacao mais utilizadas no ecossistema de identidade descentralizada — TypeScript/JavaScript, Rust, Go e Python — entendendo os pontos fortes de cada uma e quando escolher qual. Ate la!

---

## Questionario

**1. Qual e o principal padrao arquitetural do Veramo?**
a) Monolito com modulos internos
b) Arquitetura baseada em plugins composiveis
c) Microservicos com filas de mensagens
d) Arquitetura serverless com funcoes Lambda
**Resposta: b**

**2. Qual protocolo de comunicacao entre agentes e nativo do Hyperledger Aries?**
a) HTTP REST
b) GraphQL
c) DIDComm
d) gRPC
**Resposta: c**

**3. Como o DIDKit consegue suportar multiplas linguagens de programacao?**
a) Reescrevendo a biblioteca em cada linguagem
b) Usando transpilacao automatica de Rust para outras linguagens
c) Atraves de FFI (Foreign Function Interface) a partir do nucleo em Rust
d) Usando interpretadores embutidos em cada SDK
**Resposta: c**

**4. Qual biblioteca e mais adequada para autenticacao stateless via JWT assinado por DID?**
a) Hyperledger Aries
b) did-jwt
c) Trinsic SDK
d) @transmute/did
**Resposta: b**

**5. Qual e a principal vantagem do Trinsic em relacao ao Veramo para ambientes corporativos?**
a) Suporte a mais metodos DID
b) Melhor performance criptografica
c) Abstracoes de alto nivel e API gRPC que aceleram a integracao
d) Codigo-fonte totalmente aberto
**Resposta: c**
