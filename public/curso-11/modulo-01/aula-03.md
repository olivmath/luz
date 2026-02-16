# Aula 1.3: Integracoes de Armazenamento Descentralizado para Identidade

## Abertura
Bem-vindo a aula 1.3! Nesta aula, vamos explorar como diferentes tecnologias de armazenamento — IPFS, Ceramic, Arweave, Ethereum e Bitcoin — sao utilizadas para persistir dados de identidade descentralizada. Cada tecnologia oferece garantias distintas de disponibilidade, imutabilidade e custo. Escolher a combinacao correta e uma decisao arquitetural critica que impacta diretamente a seguranca e a escalabilidade do sistema.

### Programa da aula:
1. IPFS e Ceramic: armazenamento enderecavel por conteudo (introducao)
2. Arweave: persistencia permanente para credenciais (base e aprofundamento)
3. Ethereum e Bitcoin: ancoragem de DIDs em blockchains (Conceito principal da aula)

---

## 1. IPFS e Ceramic: armazenamento enderecavel por conteudo
### IPFS como camada de armazenamento para VCs
O IPFS (InterPlanetary File System) utiliza enderecamento por conteudo (content-addressing), onde cada dado e identificado pelo seu hash criptografico (CID). Isso garante integridade automatica: se o conteudo mudar, o CID muda. Para identidade descentralizada, o IPFS e usado para armazenar DID Documents, schemas de credenciais e credenciais publicas.

```typescript
import { create } from 'ipfs-http-client'

const ipfs = create({ url: 'http://localhost:5001/api/v0' })

// Armazenar um DID Document no IPFS
async function storeDIDDocument(didDocument: object): Promise<string> {
  const data = JSON.stringify(didDocument)
  const result = await ipfs.add(data, { pin: true })
  return result.cid.toString()  // ex: bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
}

// Recuperar DID Document pelo CID
async function retrieveDIDDocument(cid: string): Promise<object> {
  const chunks: Uint8Array[] = []
  for await (const chunk of ipfs.cat(cid)) {
    chunks.push(chunk)
  }
  const data = Buffer.concat(chunks).toString('utf-8')
  return JSON.parse(data)
}

// Vincular CID ao DID Document via service endpoint
const didDocument = {
  id: 'did:example:123',
  service: [{
    id: 'did:example:123#credential-storage',
    type: 'CredentialRepository',
    serviceEndpoint: `ipfs://bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi`
  }]
}
```

- **Exemplo**: Um emissor pode publicar o schema de suas credenciais no IPFS e referenciar o CID no DID Document. Qualquer verificador pode baixar o schema e validar credenciais offline, sem depender de servidores centralizados.

### Ceramic: streams mutaveis sobre IPFS
O Ceramic Network resolve a principal limitacao do IPFS para identidade: a imutabilidade. O Ceramic cria streams (documentos mutaveis) cujo historico de alteracoes e ancorado no IPFS e em blockchains. Isso permite atualizar DID Documents e listas de revogacao sem perder o historico.

```typescript
import { CeramicClient } from '@ceramicnetwork/http-client'
import { TileDocument } from '@ceramicnetwork/stream-tile'
import { DID } from 'dids'
import { Ed25519Provider } from 'key-did-provider-ed25519'
import { getResolver } from 'key-did-resolver'

// Configurar cliente Ceramic com autenticacao DID
const ceramic = new CeramicClient('http://localhost:7007')
const seed = new Uint8Array(32) // Em producao, use seed seguro
crypto.getRandomValues(seed)
const provider = new Ed25519Provider(seed)
const did = new DID({ provider, resolver: getResolver() })
await did.authenticate()
ceramic.did = did

// Criar stream para lista de revogacao
const revocationList = await TileDocument.create(ceramic, {
  type: 'RevocationList2021',
  issuer: did.id,
  revokedCredentials: [],
  lastUpdated: new Date().toISOString(),
}, {
  controllers: [did.id],
  family: 'revocation-lists',
  tags: ['ssi', 'revocation'],
})

console.log(`Stream ID: ${revocationList.id.toString()}`)
// ceramic://kjzl6cwe1jw1...

// Revogar uma credencial (atualizar o stream)
await revocationList.update({
  ...revocationList.content,
  revokedCredentials: [
    ...revocationList.content.revokedCredentials,
    { credentialId: 'urn:uuid:abc-123', revokedAt: new Date().toISOString(), reason: 'Fraude detectada' }
  ],
  lastUpdated: new Date().toISOString(),
})
```

- **Exemplo**: Uma universidade pode manter uma lista de revogacao em um stream Ceramic. Quando um diploma e invalidado, a lista e atualizada e qualquer verificador que consulte o stream obtem a versao mais recente automaticamente.

---

## 2. Arweave: persistencia permanente para credenciais
### Armazenamento permanente e o modelo economico
O Arweave oferece armazenamento permanente com pagamento unico. Diferente do IPFS, onde dados podem desaparecer se ninguem os "pinnar", dados no Arweave sao garantidos por um modelo economico que incentiva mineradores a mantê-los indefinidamente. Para identidade descentralizada, isso e valioso para credenciais que precisam ser verificaveis por decadas (diplomas, certidoes).

```typescript
import Arweave from 'arweave'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
})

// Armazenar credencial verificavel permanentemente
async function storeCredentialPermanently(
  wallet: any,
  credential: object
): Promise<string> {
  const data = JSON.stringify(credential)

  const transaction = await arweave.createTransaction({ data }, wallet)
  transaction.addTag('Content-Type', 'application/json')
  transaction.addTag('App-Name', 'SSI-Credential-Store')
  transaction.addTag('Credential-Type', 'VerifiableCredential')
  transaction.addTag('Issuer-DID', credential['issuer'])
  transaction.addTag('Schema-Version', '1.0')

  await arweave.transactions.sign(transaction, wallet)
  const response = await arweave.transactions.post(transaction)

  if (response.status === 200) {
    return transaction.id  // ID permanente da transacao
  }
  throw new Error(`Falha no upload: ${response.status}`)
}

// Consultar credenciais por emissor usando GraphQL (ArQL)
async function queryCredentialsByIssuer(issuerDID: string): Promise<string[]> {
  const query = `{
    transactions(
      tags: [
        { name: "App-Name", values: ["SSI-Credential-Store"] },
        { name: "Issuer-DID", values: ["${issuerDID}"] }
      ]
      first: 100
    ) {
      edges {
        node { id }
      }
    }
  }`

  const response = await arweave.api.post('graphql', { query })
  return response.data.data.transactions.edges.map((e: any) => e.node.id)
}
```

- **Exemplo**: Uma credencial de nascimento armazenada no Arweave sera verificavel daqui a 50 anos sem depender de nenhum servidor especifico estar online. O custo e pago uma unica vez no momento da gravacao.

### Bundlr: otimizando uploads para Arweave
O Bundlr (agora Irys) permite uploads instantaneos para o Arweave com confirmacao imediata, resolvendo o problema de latencia de confirmacao da rede:

```typescript
import Irys from '@irys/sdk'

const irys = new Irys({
  url: 'https://node2.irys.xyz',
  token: 'ethereum',
  key: process.env.PRIVATE_KEY,
})

// Upload com confirmacao instantanea
async function uploadWithReceipt(credential: object): Promise<{ id: string; timestamp: number }> {
  const data = JSON.stringify(credential)
  const tags = [
    { name: 'Content-Type', value: 'application/json' },
    { name: 'Type', value: 'VerifiableCredential' },
  ]

  const receipt = await irys.upload(data, { tags })
  return { id: receipt.id, timestamp: receipt.timestamp }
}
```

- **Exemplo**: Um sistema de emissao de diplomas em tempo real pode usar o Irys para gravar credenciais no Arweave durante a cerimonia de formatura, com confirmacao instantanea para o aluno.

---

## 3. Ethereum e Bitcoin: ancoragem de DIDs em blockchains
### Ethereum: did:ethr e smart contracts para revogacao
O Ethereum e a blockchain mais utilizada para identidade descentralizada gracas ao metodo `did:ethr` e a possibilidade de implementar logica de revogacao via smart contracts. O ERC-1056 define o registro de identidades on-chain.

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/// @title Registro de Revogacao de Credenciais
/// @notice Contrato para gerenciar revogacao on-chain de Verifiable Credentials
contract CredentialRegistry {
    struct RevocationEntry {
        bool revoked;
        uint256 timestamp;
        string reason;
    }

    // issuerDID => credentialHash => RevocationEntry
    mapping(address => mapping(bytes32 => RevocationEntry)) public revocations;

    event CredentialRevoked(address indexed issuer, bytes32 indexed credentialHash, string reason);
    event CredentialReinstated(address indexed issuer, bytes32 indexed credentialHash);

    function revokeCredential(bytes32 credentialHash, string calldata reason) external {
        require(!revocations[msg.sender][credentialHash].revoked, "Ja revogada");
        revocations[msg.sender][credentialHash] = RevocationEntry({
            revoked: true,
            timestamp: block.timestamp,
            reason: reason
        });
        emit CredentialRevoked(msg.sender, credentialHash, reason);
    }

    function isRevoked(address issuer, bytes32 credentialHash) external view returns (bool) {
        return revocations[issuer][credentialHash].revoked;
    }
}
```

```typescript
import { ethers } from 'ethers'

// Interagir com o contrato de revogacao
const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/PROJECT_ID')
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
const registry = new ethers.Contract(REGISTRY_ADDRESS, REGISTRY_ABI, wallet)

// Revogar credencial
const credentialHash = ethers.keccak256(ethers.toUtf8Bytes(JSON.stringify(credential)))
const tx = await registry.revokeCredential(credentialHash, 'Dados incorretos')
await tx.wait()

// Verificar status de revogacao (leitura gratuita)
const issuerAddress = '0x1234...'
const isRevoked = await registry.isRevoked(issuerAddress, credentialHash)
console.log(`Credencial revogada: ${isRevoked}`)
```

- **Exemplo**: Um verificador pode checar o status de revogacao de uma credencial fazendo uma chamada `view` ao smart contract — operacao gratuita e instantanea que nao requer transacao.

### Bitcoin: did:ion e ancoragem via Sidetree
O ION (Identity Overlay Network) utiliza o protocolo Sidetree para ancorar operacoes de DID na blockchain Bitcoin. Diferente do Ethereum, o Bitcoin nao suporta smart contracts, entao o Sidetree agrupa multiplas operacoes DID em uma unica transacao Bitcoin.

```typescript
import { IonDid, IonDocumentModel, IonPublicKeyPurpose } from '@decentralized-identity/ion-tools'

// Criar um DID ION (ancorado no Bitcoin)
const authnKeys = await IonDid.generateEs256kOperationKeyPair()
const updateKeys = await IonDid.generateEs256kOperationKeyPair()
const recoveryKeys = await IonDid.generateEs256kOperationKeyPair()

const document: IonDocumentModel = {
  publicKeys: [{
    id: 'auth-key-1',
    type: 'EcdsaSecp256k1VerificationKey2019',
    publicKeyJwk: authnKeys[0],
    purposes: [IonPublicKeyPurpose.Authentication, IonPublicKeyPurpose.AssertionMethod],
  }],
  services: [{
    id: 'credential-service',
    type: 'CredentialRepository',
    serviceEndpoint: 'https://exemplo.com.br/credentials',
  }],
}

// Gerar DID (long-form, funciona imediatamente sem ancoragem)
const longFormDid = IonDid.createLongFormDid({
  recoveryKey: recoveryKeys[0],
  updateKey: updateKeys[0],
  document,
})

console.log(longFormDid)
// did:ion:EiDyOQ...muito-longo...dados-inline

// Publicar na rede ION (ancora no Bitcoin)
const createRequest = IonDid.createCreateRequest({
  recoveryKey: recoveryKeys[0],
  updateKey: updateKeys[0],
  document,
})
// Enviar createRequest para um node ION via API REST
```

- **Exemplo**: O formato long-form do did:ion permite uso imediato sem esperar confirmacao no Bitcoin. O DID e auto-resolvivel porque carrega os dados inline. Apos ancoragem, o formato short-form e suficiente.

### Comparativo de armazenamento

| Tecnologia | Mutabilidade | Custo          | Latencia      | Garantia de persistencia |
|-----------|-------------|----------------|---------------|--------------------------|
| IPFS      | Imutavel (CID) | Infra propria  | Segundos     | Depende de pinning       |
| Ceramic   | Mutavel (streams) | Infra propria  | Segundos     | Depende de nodes         |
| Arweave   | Imutavel    | Pagamento unico | Minutos      | Permanente (economico)   |
| Ethereum  | Imutavel (tx) | Gas por tx     | 12-15 seg    | Permanente (consenso)    |
| Bitcoin   | Imutavel (tx) | Fee por tx     | ~10 min      | Permanente (PoW)         |

---

## Conclusao
Nesta aula, exploramos como cada tecnologia de armazenamento serve a propositos distintos no ecossistema de identidade descentralizada. O IPFS fornece armazenamento enderecavel por conteudo ideal para dados estaticos como schemas. O Ceramic adiciona mutabilidade com historico auditavel, perfeito para listas de revogacao. O Arweave garante persistencia permanente para credenciais de longa duracao. O Ethereum oferece logica programavel via smart contracts para revogacao on-chain. O Bitcoin fornece a ancoragem mais segura via Sidetree/ION. Na pratica, arquiteturas robustas combinam multiplas camadas para atender diferentes requisitos.

---

## Licao de Casa
1. Implemente um servico que armazena Verifiable Credentials no IPFS e registra o CID resultante em um smart contract Ethereum (pode usar testnet Sepolia). O contrato deve mapear `issuerAddress => CID[]`.
2. Configure um node Ceramic local e crie um stream para manter uma lista de revogacao. Escreva um script que adiciona e remove entradas, verificando o historico de commits do stream.
3. Calcule o custo em USD para armazenar 10.000 credenciais (media de 2KB cada) no Arweave versus Ethereum (como calldata). Documente as premissas de preco utilizadas.

---

## Proxima Aula
Na proxima aula, vamos abordar DevOps para identidade descentralizada — dockerizacao de resolvers universais, monitoramento de servicos SSI com Prometheus e estrategias de deploy em producao. Ate la!

---

## Questionario

**1. Qual a principal vantagem do enderecamento por conteudo (content-addressing) do IPFS para identidade descentralizada?**
a) Permite atualizar dados sem alterar o identificador
b) Garante integridade automatica — qualquer alteracao muda o CID
c) Reduz o custo de armazenamento em relacao a blockchains
d) Permite buscas por metadados nos arquivos armazenados
**Resposta: b**

**2. Como o Ceramic resolve a limitacao de imutabilidade do IPFS?**
a) Usando um banco de dados relacional como cache
b) Criando streams mutaveis cujo historico e ancorado no IPFS e blockchains
c) Substituindo o IPFS por armazenamento proprio
d) Permitindo sobrescrever CIDs existentes no IPFS
**Resposta: b**

**3. Qual a principal vantagem do Arweave em relacao ao IPFS para credenciais de longa duracao?**
a) Maior velocidade de leitura
b) Suporte a smart contracts
c) Persistencia permanente com pagamento unico, sem necessidade de pinning
d) Melhor suporte a consultas GraphQL
**Resposta: c**

**4. No contexto de did:ion, o que e o formato "long-form" de um DID?**
a) Um DID que inclui o historico completo de transacoes
b) Um DID auto-resolvivel que carrega os dados inline, funcional antes da ancoragem no Bitcoin
c) Um DID que usa chaves criptograficas maiores para maior seguranca
d) Um DID que referencia multiplos DID Documents simultaneamente
**Resposta: b**

**5. Por que verificar revogacao via chamada `view` em um smart contract Ethereum e vantajoso?**
a) Porque altera o estado do contrato para registrar a consulta
b) Porque e uma operacao de leitura gratuita e instantanea, sem necessidade de transacao
c) Porque envia uma notificacao automatica ao emissor
d) Porque funciona apenas em redes de teste
**Resposta: b**
