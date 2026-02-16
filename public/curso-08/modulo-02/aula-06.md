# Aula 2.6: Gerenciamento de chaves: rotacao, revogacao, recuperacao e secure enclave

## Abertura
Bem-vindo a aula 2.6! Nesta aula, vamos abordar um dos desafios mais criticos da identidade descentralizada: o gerenciamento do ciclo de vida das chaves criptograficas. Gerar um par de chaves e trivial; mante-lo seguro, atualiza-lo e recupera-lo ao longo de anos e o verdadeiro desafio de engenharia. Se a chave privada e comprometida ou perdida, o DID e tudo que depende dele pode ser comprometido ou tornado inacessivel.

### Programa da aula:
1. Rotacao de chaves: por que e como atualizar chaves (introducao)
2. Revogacao e modelos de recuperacao de chaves (base e aprofundamento)
3. Secure enclaves, HSMs e custodia de chaves em producao (Conceito principal da aula)

---

## 1. Rotacao de chaves: por que e como atualizar chaves

### A necessidade de rotacao
Em identidade descentralizada, o DID e persistente, mas as chaves nao devem ser. Rotacao de chaves e o processo de substituir uma chave criptografica por uma nova, mantendo o mesmo identificador. Razoes para rotacao:

- **Prevencao**: Limitar a janela de exposicao caso uma chave seja comprometida sem deteccao.
- **Conformidade**: Regulacoes como PCI-DSS e NIST SP 800-57 exigem rotacao periodica.
- **Evolucao criptografica**: Migrar de algoritmos que se tornaram fracos (ex: RSA-1024 para Ed25519).
- **Mudanca de dispositivo**: O usuario troca de smartphone ou hardware wallet.

Uma propriedade fundamental de DIDs e a **separacao entre identificador e chave**. Diferentemente de `did:key` (onde o DID e a propria chave), metodos como `did:ion`, `did:ethr` e `did:web` permitem atualizar as chaves no DID Document sem alterar o DID.

- **Exemplo**: O usuario `did:ethr:0x71C7...` pode chamar `setAttribute` no ERC-1056 para adicionar uma nova chave Ed25519 e revogar a anterior. O DID permanece o mesmo, mas a chave de verificacao muda. Todas as VCs assinadas com a chave antiga continuam verificaveis se o verificador consultar o historico do DID Document.

### Implementacao tecnica de rotacao

**Padrao de rotacao em did:ethr (ERC-1056):**
```solidity
// Contrato EthereumDIDRegistry (simplificado)
function setAttribute(
    address identity,
    bytes32 name,       // "did/pub/Ed25519/veriKey/base64"
    bytes value,        // nova chave publica
    uint validity       // tempo de validade em segundos
) public;

function revokeAttribute(
    address identity,
    bytes32 name,
    bytes value
) public;
```

```javascript
// Rotacao usando ethr-did-resolver
const newKey = generateEd25519KeyPair();

// 1. Adicionar nova chave
await registry.setAttribute(
  did,
  "did/pub/Ed25519/veriKey/base64",
  newKey.publicKey,
  86400 * 365  // validade de 1 ano
);

// 2. Revogar chave antiga
await registry.revokeAttribute(
  did,
  "did/pub/Ed25519/veriKey/base64",
  oldKey.publicKey
);
```

**Rotacao em did:ion (Sidetree):**
```json
{
  "type": "update",
  "didSuffix": "EiD3a...",
  "revealValue": "...",
  "delta": {
    "patches": [
      {
        "action": "remove-public-keys",
        "ids": ["key-1"]
      },
      {
        "action": "add-public-keys",
        "publicKeys": [{
          "id": "key-2",
          "type": "Ed25519VerificationKey2020",
          "publicKeyMultibase": "z6Mkn..."
        }]
      }
    ],
    "updateCommitment": "EiDnewcommitment..."
  }
}
```

- **Exemplo**: No Sidetree (did:ion), cada operacao de update usa um commitment scheme: o DID Document original inclui um `updateCommitment` (hash de uma chave de update futura). Para rotacionar, o titular revela o preimage desse commitment e fornece um novo commitment para a proxima atualizacao. Isso cria uma cadeia de atualizacoes verificavel.

---

## 2. Revogacao e modelos de recuperacao de chaves

### Revogacao de chaves
Revogar uma chave significa declarar publicamente que ela nao deve mais ser aceita para novas operacoes. Diferentes metodos DID implementam revogacao de maneiras distintas:

**1. On-chain (did:ethr):** Evento emitido na blockchain com timestamp imutavel.
```
DIDAttributeChanged(identity, name, value, validTo=0, previousChange)
// validTo=0 indica revogacao
```

**2. Sidetree (did:ion):** Operacao de `deactivate` ou `update` que remove a chave.
```
Operacao de deactivate = revogacao completa do DID
Operacao de update com remove-public-keys = revogacao de chave especifica
```

**3. DID Document timestamp (did:web):** Versionamento do documento no servidor web.
```
Versao 1 (2024-01-01): key-1 ativa
Versao 2 (2024-06-15): key-1 removida, key-2 adicionada
O verificador deve checar a versao vigente na data da assinatura
```

**Problema temporal:** Se uma VC foi assinada com `key-1` em marco de 2024, e `key-1` foi revogada em junho de 2024, a VC ainda e valida? Isso depende da resolucao temporal do DID:
```
Se o resolver suporta versionamento:
  resolve("did:ethr:0x71C7...", {"versionTime": "2024-03-15"})
  -> Retorna DID Document com key-1 ainda ativa -> VC valida

Se nao suporta versionamento:
  resolve("did:ethr:0x71C7...")
  -> Retorna DID Document atual sem key-1 -> VC invalida (falso negativo)
```

- **Exemplo**: O parametro `versionTime` na resolucao DID (DID Core spec, secao 7.1.2) permite ao verificador perguntar "qual era o DID Document neste momento?", resolvendo o problema temporal de revogacao de chaves.

### Modelos de recuperacao
A perda da chave privada e o pesadelo da identidade descentralizada. Diferentes estrategias existem:

**1. Social Recovery (Vitalik Buterin, 2021):**
```
Configuracao: Titular designa N guardioes (amigos, familia, dispositivos)
Threshold: M de N guardioes devem concordar para autorizar nova chave
Processo:
  1. Titular perde acesso a chave
  2. Titular solicita recuperacao aos guardioes
  3. M guardioes assinam autorizacao de nova chave
  4. Contrato inteligente atualiza a chave do DID
```

**2. Pre-rotation (KERI - Key Event Receipt Infrastructure):**
```
Conceito: Ao criar o DID, ja comprometer-se com a proxima chave
Mecanismo:
  1. Gerar (sk1, pk1) e (sk2, pk2)
  2. Publicar pk1 como chave ativa
  3. Publicar H(pk2) como "next key commitment"
  4. Para rotacionar: revelar pk2, publicar H(pk3)
  5. sk2 pode estar em cold storage
```

```python
import hashlib

# Pre-rotation: commitment scheme
def create_key_commitment(public_key: bytes) -> str:
    """Cria commitment para proxima chave (hash da chave publica)."""
    return hashlib.sha256(public_key).hexdigest()

# Gerar duas chaves
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

current_sk = Ed25519PrivateKey.generate()
next_sk = Ed25519PrivateKey.generate()

current_pk = current_sk.public_key().public_bytes_raw()
next_pk = next_sk.public_key().public_bytes_raw()

# Publicar chave atual e commitment da proxima
commitment = create_key_commitment(next_pk)
print(f"Chave ativa: {current_pk.hex()}")
print(f"Next key commitment: {commitment}")
# next_sk fica em cold storage (cofre, hardware wallet offline)
```

**3. Hierarchical Deterministic (HD) Keys com backup:**
```
BIP-32/BIP-39: Derivar multiplas chaves de uma seed mnemonica
Seed -> Master Key -> Child Keys (m/44'/60'/0'/0/0, m/44'/60'/0'/0/1, ...)

Backup: 12 ou 24 palavras mnemonicas armazenadas em local seguro
Recuperacao: Restaurar todas as chaves a partir da seed
```

- **Exemplo**: O protocolo KERI usa pre-rotation como mecanismo primario de recuperacao. Ao criar um KERI identifier, o titular gera um par de chaves de rotacao e publica o hash da chave publica futura. Mesmo que a chave atual seja comprometida, o atacante nao consegue rotacionar porque nao possui a pre-image do commitment.

---

## 3. Secure enclaves, HSMs e custodia de chaves em producao

### Niveis de protecao de chaves
Em producao, chaves privadas precisam de protecao proporcional ao risco:

| Nivel | Mecanismo | Exemplo | Custo |
|---|---|---|---|
| Software | Arquivo criptografado | Keystore JSON (Ethereum) | Baixo |
| OS-level | Keychain/Credential Manager | Apple Keychain, Android Keystore | Baixo |
| TEE | Trusted Execution Environment | ARM TrustZone, Intel SGX | Medio |
| Secure Enclave | Hardware isolado no chip | Apple Secure Enclave (SEP) | Medio |
| HSM | Hardware Security Module dedicado | YubiHSM, AWS CloudHSM | Alto |
| Cold storage | Dispositivo offline | Ledger, Trezor, papel | Variavel |

### Secure Enclave e Trusted Execution Environment
O **Secure Enclave** (Apple) e o **StrongBox** (Android) sao coprocessadores dedicados que:
- Geram chaves internamente (a chave privada nunca sai do chip).
- Executam operacoes de assinatura dentro do enclave.
- Resistem a ataques fisicos (tamper-resistant).
- Suportam autenticacao biometrica (Face ID, fingerprint) como gate para uso da chave.

```swift
// iOS: Geracao de chave no Secure Enclave (secp256r1/P-256)
import CryptoKit

let privateKey = try SecureEnclave.P256.Signing.PrivateKey()
let publicKey = privateKey.publicKey

// A chave privada NUNCA sai do Secure Enclave
// Assinatura executada dentro do enclave
let data = "did:example:123".data(using: .utf8)!
let signature = try privateKey.signature(for: data)

// Verificacao pode ser feita em qualquer lugar com a chave publica
let isValid = publicKey.isValidSignature(signature, for: data)
```

**Limitacao importante**: A maioria dos Secure Enclaves suporta apenas **secp256r1 (P-256)**, nao Ed25519 ou secp256k1. Isso explica por que WebAuthn/FIDO2 usa P-256 como curva padrao.

- **Exemplo**: Quando voce usa uma Passkey (WebAuthn) para autenticar em um site, a chave privada reside no Secure Enclave do seu dispositivo. O DID Document correspondente teria `EcdsaSecp256r1VerificationKey2019` como tipo de chave, refletindo a restricao de hardware.

### HSMs para cenarios corporativos e emissores de credenciais
Hardware Security Modules (HSMs) sao dispositivos certificados (FIPS 140-2 Level 3+) projetados para proteger chaves em ambientes de alta seguranca:

```
Arquitetura de emissor de VCs com HSM:

  [Aplicacao]  --PKCS#11/API-->  [HSM]
      |                            |
  Monta VC                   Assina com sk
  sem acesso                 (nunca exportada)
  a sk                            |
      |                            |
  Recebe VC    <--assinatura--    |
  assinada
```

```python
# Exemplo conceitual: assinatura via HSM usando PKCS#11
# (biblioteca PyKCS11)
from PyKCS11 import PyKCS11Lib

lib = PyKCS11Lib()
lib.load("/usr/lib/softhsm/libsofthsm2.so")

session = lib.openSession(slot=0)
session.login("1234")  # PIN do HSM

# Encontrar chave privada no HSM
private_key = session.findObjects([
    (CKA_CLASS, CKO_PRIVATE_KEY),
    (CKA_LABEL, "did-issuer-key-1")
])[0]

# Assinar dentro do HSM (chave nunca sai)
mechanism = Mechanism(CKM_ECDSA, None)
signature = session.sign(private_key, data_to_sign, mechanism)
```

**Cloud HSMs para escala:**
- **AWS CloudHSM**: HSMs dedicados na nuvem, FIPS 140-2 Level 3.
- **Azure Managed HSM**: Integrado ao Azure Key Vault.
- **GCP Cloud HSM**: HSMs gerenciados pelo Google Cloud.
- **HashiCorp Vault**: Gestao de segredos com backend HSM opcional.

### Arquitetura de referencia para gerenciamento de chaves DID

```
+------------------+     +------------------+     +------------------+
|   Chave Diaria   |     |  Chave de Rotacao|     |  Chave de        |
|   (hot wallet)   |     |  (warm storage)  |     |  Recuperacao     |
|                  |     |                  |     |  (cold storage)  |
|  Secure Enclave  |     |  HSM / YubiKey   |     |  Papel / Cofre   |
|  ou TEE          |     |                  |     |                  |
+--------+---------+     +--------+---------+     +--------+---------+
         |                         |                        |
         v                         v                        v
  Assinaturas            Operacoes de             Social Recovery
  do dia-a-dia           rotacao de chaves        (emergencia)
  (DIDComm, VPs)         (update DID Doc)
```

- **Exemplo**: Uma universidade emissora de diplomas em VC usa um HSM (AWS CloudHSM) para a chave de assinatura, com rotacao semestral automatizada. A chave de recuperacao esta em um cofre fisico, acessivel apenas pelo comite de seguranca da instituicao com quorum de 3 de 5 membros.

---

## Conclusao
Nesta aula, abordamos o ciclo de vida completo das chaves criptograficas em identidade descentralizada. A rotacao de chaves permite atualizar a criptografia sem mudar o identificador DID. A revogacao exige resolucao temporal para evitar falsos negativos em VCs assinadas com chaves antigas. Modelos de recuperacao como social recovery e pre-rotation (KERI) oferecem alternativas robustas a perda de chaves. Em producao, Secure Enclaves protegem chaves em dispositivos moveis, enquanto HSMs sao essenciais para emissores corporativos de credenciais. A arquitetura de chaves deve ser proporcional ao risco e ao contexto de uso.

---

## Licao de Casa
1. Projete uma politica de gerenciamento de chaves para um emissor de credenciais educacionais. Defina: tipo de chave, armazenamento, frequencia de rotacao, mecanismo de revogacao e procedimento de recuperacao.
2. Implemente o conceito de pre-rotation: gere dois pares de chaves, publique a primeira e o commitment (hash) da segunda. Simule uma rotacao verificando que o commitment corresponde a nova chave.
3. Pesquise as limitacoes do Apple Secure Enclave e do Android StrongBox em relacao a curvas elipticas suportadas. Explique como isso impacta a escolha de algoritmos em aplicacoes DID moveis.

---

## Proxima Aula
Na proxima aula, vamos iniciar o Modulo 3 estudando o que e um metodo DID e os diferentes tipos existentes: baseados em ledger, web, peer-to-peer e key-only. Vamos entender como cada tipo resolve o problema de ancoragem e resolucao de identificadores descentralizados. Ate la!

---

## Questionario

**1. Qual e a principal vantagem da separacao entre identificador DID e chaves criptograficas?**
a) Permite usar chaves menores
b) Permite rotacionar chaves sem alterar o identificador, mantendo a continuidade da identidade
c) Elimina a necessidade de criptografia assimetrica
d) Torna o DID Document imutavel
**Resposta: b**

**2. O que e pre-rotation no contexto do protocolo KERI?**
a) Gerar todas as chaves futuras antecipadamente
b) Publicar o hash da proxima chave publica no momento da criacao, permitindo rotacao segura mesmo se a chave atual for comprometida
c) Rotacionar chaves automaticamente a cada hora
d) Armazenar chaves privadas em multiplos locais simultaneamente
**Resposta: b**

**3. Por que WebAuthn/FIDO2 utiliza secp256r1 (P-256) como curva padrao?**
a) Porque e a curva mais rapida em software
b) Porque e a unica curva matematicamente segura
c) Porque e a curva suportada pela maioria dos Secure Enclaves e TPMs em hardware
d) Porque foi a primeira curva inventada
**Resposta: c**

**4. Qual e o risco de nao suportar resolucao temporal (versionTime) ao verificar uma VC cuja chave do emissor foi rotacionada?**
a) A VC sera aceita mesmo se for fraudulenta
b) A verificacao pode falhar incorretamente (falso negativo) porque a chave usada na assinatura nao esta mais no DID Document atual
c) O DID do emissor sera permanentemente invalidado
d) A chave privada do emissor sera exposta
**Resposta: b**

**5. Em uma arquitetura de gerenciamento de chaves para um emissor de VCs, qual componente e mais adequado para armazenar a chave de assinatura de producao?**
a) Variavel de ambiente no servidor
b) Arquivo JSON no disco do servidor
c) HSM (Hardware Security Module) certificado FIPS 140-2
d) Repositorio Git privado
**Resposta: c**
