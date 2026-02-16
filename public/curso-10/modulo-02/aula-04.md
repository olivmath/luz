# Aula 2.4: Algoritmos de assinatura: ECDSA, EdDSA, ES256K, Schnorr (taproot)

## Abertura
Bem-vindo a aula 2.4! Nesta aula, vamos dissecar os algoritmos de assinatura digital mais utilizados em identidade descentralizada. Enquanto na aula anterior estudamos as curvas elipticas, agora vamos entender como os algoritmos construidos sobre elas funcionam internamente, quais garantias oferecem e onde cada um e aplicado no ecossistema DID.

### Programa da aula:
1. ECDSA: o algoritmo classico e suas vulnerabilidades (introducao)
2. EdDSA e ES256K: assinaturas modernas para DIDs (base e aprofundamento)
3. Schnorr signatures e agregacao: de Taproot a identidade descentralizada (Conceito principal da aula)

---

## 1. ECDSA: o algoritmo classico e suas vulnerabilidades

### Funcionamento interno do ECDSA
O Elliptic Curve Digital Signature Algorithm (ECDSA) e o algoritmo de assinatura mais amplamente implantado em blockchains e sistemas DID legados. Opera sobre curvas Weierstrass (secp256k1, secp256r1).

**Geracao de assinatura `Sign(sk, msg)`:**
```
1. Calcular e = H(msg)                    // hash da mensagem
2. Gerar nonce aleatorio k, 1 <= k < n    // CRITICO: deve ser unico e secreto
3. Calcular ponto R = k * G               // multiplicacao escalar
4. r = R.x mod n                          // coordenada x do ponto
5. s = k^(-1) * (e + r * sk) mod n        // componente s
6. Assinatura = (r, s)
```

**Verificacao `Verify(pk, msg, (r, s))`:**
```
1. Calcular e = H(msg)
2. w = s^(-1) mod n
3. u1 = e * w mod n
4. u2 = r * w mod n
5. Ponto P = u1 * G + u2 * pk
6. Verificar: P.x mod n == r
```

```python
from ecdsa import SigningKey, SECP256k1
import hashlib

# Geracao de chave
sk = SigningKey.generate(curve=SECP256k1)
pk = sk.get_verifying_key()

# Assinatura
message = b"did:ethr:0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
signature = sk.sign(message, hashfunc=hashlib.sha256)
print(f"Assinatura ECDSA ({len(signature)} bytes): {signature.hex()}")

# Verificacao
assert pk.verify(signature, message, hashfunc=hashlib.sha256)
```

- **Exemplo**: Toda transacao Ethereum, incluindo chamadas ao ERC-1056 (EthereumDIDRegistry) para registrar ou atualizar um did:ethr, e assinada com ECDSA sobre secp256k1. A assinatura inclui o parametro `v` (recovery id) que permite recuperar a chave publica a partir da assinatura.

### Vulnerabilidades do ECDSA
O ECDSA tem vulnerabilidades bem documentadas que motivaram o desenvolvimento de alternativas:

**1. Reuso de nonce (k):** Se o mesmo `k` for usado em duas assinaturas diferentes, a chave privada pode ser extraida:
```
Dadas (r, s1) para msg1 e (r, s2) para msg2 com mesmo k:
k = (e1 - e2) * (s1 - s2)^(-1) mod n
sk = (s1 * k - e1) * r^(-1) mod n
```

**2. Nonce com bias:** Mesmo um bias de poucos bits no nonce permite ataques de lattice (ataque de Minerva, 2019).

**3. Side-channel attacks:** A inversao modular `k^(-1)` e a multiplicacao escalar `k*G` podem vazar informacao por timing, cache ou consumo de energia.

- **Exemplo**: Em 2010, hackers extrairam a chave privada da Sony usada para assinar jogos da PlayStation 3 porque a implementacao ECDSA usava um nonce fixo. O mesmo ataque foi usado em 2013 para roubar bitcoins de carteiras com implementacoes defeituosas de geracao de nonce.

---

## 2. EdDSA e ES256K: assinaturas modernas para DIDs

### EdDSA (Ed25519): assinaturas deterministicas
O Edwards-curve Digital Signature Algorithm resolve os problemas fundamentais do ECDSA:

**Geracao de assinatura `Sign(sk, msg)`:**
```
1. Expandir sk: (a, prefix) = H(sk)        // SHA-512 da chave privada
2. Nonce deterministico: r = H(prefix || msg) mod l  // ELIMINA vulnerabilidade de nonce
3. R = r * B                                // ponto da curva (32 bytes comprimidos)
4. S = (r + H(R || pk || msg) * a) mod l    // escalar (32 bytes)
5. Assinatura = (R, S)                      // 64 bytes total
```

**Verificacao `Verify(pk, msg, (R, S))`:**
```
Verificar: S * B == R + H(R || pk || msg) * pk
```

**Diferencas cruciais em relacao ao ECDSA:**
| Aspecto | ECDSA | EdDSA |
|---|---|---|
| Nonce | Aleatorio (perigoso) | Deterministico (seguro) |
| Formula de adicao | Incompleta | Completa (constant-time) |
| Maleabilidade | Sim (s, n-s) | Nao (por design) |
| Hash da mensagem | Pre-hashing | Hash interno (PureEdDSA) |
| Tamanho da assinatura | 64-72 bytes (DER) | 64 bytes (fixo) |

```python
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

sk = Ed25519PrivateKey.generate()

# Assinatura deterministicas: mesma entrada = mesma saida
msg = b"credential-proof-data"
sig1 = sk.sign(msg)
sig2 = sk.sign(msg)
assert sig1 == sig2  # Sempre True! Nao depende de nonce aleatorio
```

- **Exemplo**: A cryptosuite `eddsa-rdfc-2022` do W3C VC Data Integrity usa EdDSA com Ed25519 para assinar Verifiable Credentials. O DID Document do emissor declara `Ed25519VerificationKey2020` no `verificationMethod`.

### ES256K: ECDSA padronizado para secp256k1
ES256K e a designacao JOSE/JWT para ECDSA sobre secp256k1 com SHA-256. Foi padronizado na RFC 8812 para uso em JSON Web Signatures:

```
Algoritmo: ECDSA
Curva: secp256k1
Hash: SHA-256
Identificador JOSE: "ES256K"
```

**Uso em JWT/JWS para Verifiable Credentials:**
```
Header: {"alg": "ES256K", "typ": "JWT"}
Payload: {
  "iss": "did:ethr:0x71C7...",
  "sub": "did:example:holder",
  "vc": { ... }
}
Signature: ECDSA-secp256k1-SHA256(header.payload)
```

ES256K e amplamente utilizado em:
- **did:ethr** e **did:ion**: Ecossistemas baseados em Ethereum e Bitcoin.
- **JWT-based VCs**: Formato JWT para Verifiable Credentials (alternativa ao Data Integrity).
- **Sidetree Protocol**: Operacoes de criacao e atualizacao de DIDs.

Existe tambem o **ES256K-R** (com recovery), que inclui o recovery byte permitindo derivar a chave publica a partir da assinatura — util em contextos blockchain onde se quer economizar espaco.

- **Exemplo**: Um JWT de Verifiable Credential usando ES256K: `eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJkaWQ6ZXRocjoweC4uLiJ9.MEUCIQDx...`. O verificador decodifica o header, identifica `ES256K`, resolve o DID do emissor e verifica a assinatura com a chave publica secp256k1.

---

## 3. Schnorr signatures e agregacao: de Taproot a identidade descentralizada

### Funcionamento das Schnorr signatures
As assinaturas Schnorr sao matematicamente mais simples e elegantes que ECDSA, e possuem uma prova formal de seguranca no modelo de oraculo aleatorio:

**Geracao `Sign(sk, msg)`:**
```
1. Gerar nonce: k (deterministico via RFC 6979 ou similar)
2. R = k * G
3. e = H(R || pk || msg)           // challenge
4. s = k - e * sk mod n            // resposta
5. Assinatura = (R, s)             // ou (e, s) na variante classica
```

**Verificacao `Verify(pk, msg, (R, s))`:**
```
e = H(R || pk || msg)
Verificar: s * G == R - e * pk
Equivalente: s * G + e * pk == R
```

**Propriedade-chave — Linearidade:**
A propriedade fundamental que diferencia Schnorr de ECDSA e a **linearidade**, que permite:
```
Sign(sk1, msg) + Sign(sk2, msg) = Sign(sk1 + sk2, msg)
```

Isso habilita **agregacao de assinaturas**: multiplas assinaturas podem ser combinadas em uma unica assinatura que verifica contra a soma das chaves publicas.

### Schnorr no Bitcoin Taproot (BIP 340)
O Bitcoin ativou Taproot em novembro de 2021, introduzindo Schnorr signatures (BIP 340) com otimizacoes especificas:

```
BIP 340 - Schnorr para secp256k1:
- Chave publica: apenas coordenada x (32 bytes vs 33 bytes comprimido)
- Assinatura: 64 bytes (R.x || s)
- Tagged hashing: H_tag(msg) = SHA256(SHA256(tag) || SHA256(tag) || msg)
- Batch verification: verificar N assinaturas mais rapido que N verificacoes individuais
```

```python
# Verificacao em batch (pseudo-codigo)
# Em vez de N verificacoes individuais:
#   for i in range(N): verify(pk_i, msg_i, sig_i)
#
# Batch verification com um unico multi-scalar multiplication:
#   sum(a_i * s_i) * G == sum(a_i * R_i) + sum(a_i * e_i * pk_i)
# onde a_i sao pesos aleatorios para prevenir ataques
```

### Aplicacoes em identidade descentralizada
Schnorr signatures habilitam cenarios avancados para DIDs:

**1. Multi-party DID control (MuSig2):**
```
Cenario: DID controlado por 3 partes (multisig)
pk_agg = pk_1 + pk_2 + pk_3  (com coeficientes de seguranca)
sig_agg = combinacao das assinaturas parciais
Resultado: Uma unica assinatura de 64 bytes verifica contra pk_agg
Externo: Indistinguivel de uma assinatura individual
```

**2. Threshold DID recovery:**
```
Cenario: Recuperacao de DID com 2-de-3 guardioes
Guardioes (G1, G2, G3) possuem shares da chave
Qualquer par (G1,G2), (G1,G3) ou (G2,G3) pode assinar
A assinatura resultante e indistinguivel de uma assinatura simples
```

**3. Adapter signatures para atomic swaps de credenciais:**
```
Alice quer trocar Credencial_A por Credencial_B de Bob
Adapter signatures permitem que a troca seja atomica:
- Ou ambas as credenciais sao trocadas
- Ou nenhuma e
```

- **Exemplo**: Um DID Document com controle multi-party usando Schnorr: a chave publica agregada `pk_agg` e publicada como um unico `verificationMethod`. Para um verificador externo, nao ha como distinguir se o DID e controlado por uma pessoa ou por um comite de 5. Isso preserva privacidade organizacional.

---

## Conclusao
Nesta aula, comparamos os quatro algoritmos de assinatura mais relevantes para identidade descentralizada. ECDSA, apesar de amplamente implantado, possui vulnerabilidades inerentes relacionadas a geracao de nonces. EdDSA resolve esses problemas com nonces deterministicos e formulas constant-time. ES256K padroniza ECDSA-secp256k1 para o ecossistema JOSE/JWT. Schnorr signatures, com sua propriedade de linearidade, habilitam cenarios avancados como controle multi-party de DIDs e batch verification, representando o estado da arte em assinaturas digitais.

---

## Licao de Casa
1. Implemente a verificacao da equacao Schnorr `s*G + e*pk == R` usando uma biblioteca de curvas elipticas. Demonstre que a equacao se sustenta para uma assinatura valida e falha para uma adulterada.
2. Pesquise o protocolo MuSig2 e descreva como ele resolve o problema de rogue-key attack na agregacao de chaves publicas Schnorr.
3. Compare os tamanhos de assinatura e chave publica entre ECDSA (DER-encoded), EdDSA (Ed25519) e Schnorr (BIP 340). Crie uma tabela com os valores exatos em bytes.

---

## Proxima Aula
Na proxima aula, vamos estudar os esquemas de codificacao Multibase, Multicodec e Multihash, que sao fundamentais para a representacao interoperavel de chaves e hashes em DID Documents e Verifiable Credentials. Ate la!

---

## Questionario

**1. Qual e a vulnerabilidade mais critica do ECDSA que o EdDSA resolve por design?**
a) O tamanho excessivo das assinaturas
b) A dependencia de um nonce aleatorio unico e secreto para cada assinatura
c) A incompatibilidade com curvas elipticas
d) A lentidao na verificacao de assinaturas
**Resposta: b**

**2. O que significa ES256K no contexto de JOSE/JWT?**
a) EdDSA sobre Ed25519 com SHA-256
b) ECDSA sobre secp256k1 com SHA-256
c) Schnorr sobre secp256k1 com SHA-256
d) RSA com chave de 256 bits
**Resposta: b**

**3. Qual propriedade matematica das Schnorr signatures permite a agregacao de assinaturas?**
a) Comutatividade
b) Associatividade
c) Linearidade
d) Idempotencia
**Resposta: c**

**4. No BIP 340 (Taproot), como a chave publica Schnorr e representada?**
a) Como a chave publica completa com ambas coordenadas (64 bytes)
b) Apenas a coordenada x do ponto (32 bytes)
c) Como um hash SHA-256 da chave publica (32 bytes)
d) Em formato DER com metadados ASN.1
**Resposta: b**

**5. Qual vantagem a batch verification de Schnorr oferece para sistemas de identidade descentralizada?**
a) Permite verificar multiplas assinaturas simultaneamente com custo computacional menor que verificacoes individuais
b) Permite criar chaves privadas a partir de chaves publicas
c) Elimina a necessidade de DID Documents
d) Torna as assinaturas menores que 32 bytes
**Resposta: a**
