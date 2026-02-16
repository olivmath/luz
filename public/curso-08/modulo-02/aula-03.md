# Aula 2.3: Curvas elipticas principais: secp256k1, Ed25519, secp256r1, X25519, BLS12-381

## Abertura
Bem-vindo a aula 2.3! Nesta aula, vamos estudar as curvas elipticas mais utilizadas em identidade descentralizada. A escolha da curva impacta diretamente seguranca, performance, tamanho de chaves e assinaturas, e compatibilidade com diferentes ecossistemas. Entender essas diferencas e essencial para arquitetar sistemas DID robustos e interoperaveis.

### Programa da aula:
1. Fundamentos de curvas elipticas em criptografia (introducao)
2. Curvas Weierstrass: secp256k1 e secp256r1 (base e aprofundamento)
3. Curvas modernas: Ed25519, X25519 e BLS12-381 (Conceito principal da aula)

---

## 1. Fundamentos de curvas elipticas em criptografia

### Equacao geral e operacoes
Uma curva eliptica sobre um corpo finito `F_p` e definida pela equacao de Weierstrass: `y^2 = x^3 + ax + b (mod p)`, onde `4a^3 + 27b^2 != 0` (garante que a curva nao tem singularidades).

Os pontos da curva formam um **grupo abeliano** com a operacao de adicao de pontos. A seguranca depende do **problema do logaritmo discreto em curvas elipticas (ECDLP)**: dado `P` e `Q = k*P`, encontrar `k` e computacionalmente inviavel.

```
Operacoes fundamentais:
- Adicao: P + Q = R (geometricamente, reta que liga P e Q intersecta a curva em R')
- Duplicacao: P + P = 2P
- Multiplicacao escalar: k*P = P + P + ... + P (k vezes)
  Implementada eficientemente via double-and-add: O(log k)
```

- **Exemplo**: Para `k` de 256 bits, a multiplicacao escalar requer no maximo 256 duplicacoes e 256 adicoes, totalizando ~512 operacoes de grupo — eficiente computacionalmente mas impossivel de inverter.

### Parametros de uma curva
Cada curva e definida por um conjunto de parametros (domain parameters):
- `p`: O primo que define o corpo finito
- `a, b`: Coeficientes da equacao
- `G`: Ponto gerador (base point)
- `n`: Ordem do grupo (numero de pontos)
- `h`: Cofator (cofactor)

A seguranca depende primariamente de `n` — quanto maior, mais seguro, mas tambem mais lento.

- **Exemplo**: secp256k1 tem `n` de 256 bits, oferecendo ~128 bits de seguranca (pela melhor ataque conhecido, Pollard's rho, que requer `O(sqrt(n))` operacoes).

---

## 2. Curvas Weierstrass: secp256k1 e secp256r1

### secp256k1: a curva do Bitcoin e Ethereum
Definida pelo SECG (Standards for Efficient Cryptography Group), secp256k1 usa parametros especiais que permitem otimizacoes computacionais:

```
Equacao: y^2 = x^3 + 7 (mod p)
a = 0, b = 7
p = 2^256 - 2^32 - 977
n = FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141
```

**Caracteristicas:**
- **Parametros "nao-aleatorios"**: `a=0` e `b=7` permitem otimizacoes de ~30% na multiplicacao escalar.
- **Transparencia**: Os parametros nao foram gerados por um processo opaco, reduzindo suspeitas de backdoor.
- **Ecossistema**: Bitcoin, Ethereum, did:ethr, did:btcr, did:ion.
- **Desvantagem**: Vulneravel a ataques de side-channel se a implementacao nao for constant-time.

```python
# Geracao de chave secp256k1 com coincurve
from coincurve import PrivateKey

sk = PrivateKey()
pk = sk.public_key

print(f"Chave privada: {sk.secret.hex()}")
print(f"Chave publica (comprimida, 33 bytes): {pk.format(compressed=True).hex()}")
print(f"Chave publica (nao-comprimida, 65 bytes): {pk.format(compressed=False).hex()}")
```

- **Exemplo**: No did:ethr, o endereco Ethereum derivado de secp256k1 e usado diretamente como method-specific identifier: `did:ethr:0x71C7656EC7ab88b098defB751B7401B5f6d8976F`.

### secp256r1 (P-256 / prime256v1): a curva do NIST
Definida pelo NIST, P-256 e a curva mais amplamente suportada em hardware e software corporativo:

```
Equacao: y^2 = x^3 - 3x + b (mod p)
a = -3
b = 5AC635D8AA3A93E7B3EBBD55769886BC651D06B0CC53B0F63BCE3C3E27D2604B
p = 2^256 - 2^224 + 2^192 + 2^96 - 1
```

**Caracteristicas:**
- **Suporte em hardware**: WebAuthn/FIDO2, Secure Enclaves (Apple), TPM, HSMs.
- **Padrao governamental**: Exigido por regulacoes como FIPS 140-2.
- **Controversia**: Os parametros `b` foram gerados por um processo nao totalmente transparente (seed SHA-1), gerando suspeitas na comunidade criptografica.
- **Ecossistema DID**: did:webauthn, integracao com passkeys, ambientes corporativos.

| Aspecto | secp256k1 | secp256r1 (P-256) |
|---|---|---|
| Seguranca (bits) | ~128 | ~128 |
| Suporte hardware | Limitado | Amplo (HSM, TPM, SE) |
| Ecossistema | Bitcoin, Ethereum | WebAuthn, corporativo |
| Transparencia | Alta | Controversa |
| Performance (software) | Otimizada | Padrao |

---

## 3. Curvas modernas: Ed25519, X25519 e BLS12-381

### Ed25519: a curva de assinaturas de alta performance
Ed25519 e uma curva Edwards retorcida (twisted Edwards curve) sobre o primo `2^255 - 19`:

```
Equacao Edwards: -x^2 + y^2 = 1 + d*x^2*y^2
d = -121665/121666 (mod p)
p = 2^255 - 19
n = 2^252 + 27742317777372353535851937790883648493
```

**Vantagens tecnicas:**
- **Constant-time por design**: A formula de adicao completa (complete addition formula) elimina branch conditions, prevenindo side-channel attacks.
- **Performance**: Assinaturas ~3x mais rapidas que ECDSA com secp256k1.
- **Assinaturas deterministicas**: Nao requer nonce aleatorio, eliminando uma classe inteira de vulnerabilidades (como o hack da PS3 em 2010).
- **Chaves e assinaturas compactas**: pk = 32 bytes, assinatura = 64 bytes.

```python
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

sk = Ed25519PrivateKey.generate()
pk = sk.public_key()

# Chave publica: 32 bytes
pk_bytes = pk.public_bytes_raw()
print(f"pk ({len(pk_bytes)} bytes): {pk_bytes.hex()}")

# Assinatura: 64 bytes, deterministicamente derivada
sig = sk.sign(b"Hello DID")
print(f"sig ({len(sig)} bytes): {sig.hex()}")
```

- **Exemplo**: O metodo `did:key` com Ed25519 codifica a chave publica diretamente: `did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK`. O prefixo `z6Mk` indica Ed25519 via Multicodec.

### X25519: curva para troca de chaves (key agreement)
X25519 usa a mesma curva subjacente (Curve25519), mas no formato Montgomery para Diffie-Hellman:

```
Uso: Estabelecer segredos compartilhados (shared secrets)
Entrada: sk_alice, pk_bob
Saida: shared_secret = X25519(sk_alice, pk_bob) = X25519(sk_bob, pk_alice)
```

No ecossistema DID, X25519 aparece no `keyAgreement` do DID Document para comunicacao criptografada via DIDComm:

```json
{
  "id": "did:example:123",
  "keyAgreement": [{
    "type": "X25519KeyAgreementKey2020",
    "publicKeyMultibase": "z6LSbysY2xFMRpGMhb7tFTLMpeuPRaqaWM1yECx2AtzE3KCc"
  }]
}
```

### BLS12-381: a curva das pairing-based cryptography
BLS12-381 e uma curva de emparelhamento (pairing-friendly curve) fundamental para criptografia avancada:

```
Emparelhamento bilinear: e: G1 x G2 -> GT
Propriedade: e(a*P, b*Q) = e(P, Q)^(a*b)

G1: pontos de 48 bytes (comprimidos)
G2: pontos de 96 bytes (comprimidos)
Seguranca: ~128 bits
```

**Aplicacoes em identidade descentralizada:**
- **Assinaturas agregaveis (BBS+)**: Permite assinar multiplos atributos e revelar seletivamente um subconjunto com Zero-Knowledge Proof.
- **Threshold signatures**: `t` de `n` participantes podem assinar cooperativamente.
- **Anonymous credentials**: Credenciais verificaveis sem revelar a identidade do titular.

```
BBS+ Selective Disclosure:
1. Emissor assina [nome, idade, pais, diploma] com BLS12-381
2. Titular gera ZKP revelando apenas "idade >= 18"
3. Verificador confirma a prova sem aprender nome, pais ou diploma
```

- **Exemplo**: A especificacao W3C VC Data Integrity BBS Cryptosuite usa BLS12-381 para permitir que um titular de credencial prove seletivamente atributos sem revelar toda a credencial, algo impossivel com Ed25519 ou secp256k1 sem camadas adicionais.

---

## Conclusao
Nesta aula, comparamos as cinco curvas elipticas mais relevantes para identidade descentralizada. secp256k1 domina o ecossistema blockchain (Bitcoin, Ethereum), secp256r1 e essencial para integracao com hardware e WebAuthn, Ed25519 oferece a melhor combinacao de seguranca e performance para assinaturas, X25519 e o padrao para troca de chaves em DIDComm, e BLS12-381 habilita capacidades avancadas como selective disclosure nativo e assinaturas agregaveis. A escolha da curva deve considerar o ecossistema alvo, requisitos de hardware e as primitivas criptograficas necessarias.

---

## Licao de Casa
1. Gere pares de chaves Ed25519 e secp256k1, assine a mesma mensagem com ambos e compare o tamanho das assinaturas e o tempo de geracao/verificacao. Documente os resultados.
2. Pesquise o ataque a chave ECDSA da PlayStation 3 (2010) causado por reuso de nonce. Explique por que Ed25519 e imune a esse tipo de ataque.
3. Leia a especificacao BBS+ Signatures (draft IETF) e descreva em um paragrafo como BLS12-381 habilita selective disclosure sem revelar campos adicionais da credencial.

---

## Proxima Aula
Na proxima aula, vamos estudar os algoritmos de assinatura digital construidos sobre essas curvas: ECDSA, EdDSA, ES256K e Schnorr. Veremos como cada algoritmo funciona internamente, suas garantias de seguranca e em quais padroes DID sao utilizados. Ate la!

---

## Questionario

**1. Qual e a principal vantagem de Ed25519 sobre ECDSA com secp256k1 em relacao a seguranca de implementacao?**
a) Usa chaves maiores
b) Possui formula de adicao completa que e constant-time por design, prevenindo side-channel attacks
c) E baseada em uma curva com parametros gerados pelo NIST
d) Requer nonces aleatorios para cada assinatura
**Resposta: b**

**2. Qual curva e utilizada como base para o mecanismo de keyAgreement em DIDComm?**
a) secp256k1
b) BLS12-381
c) X25519
d) secp256r1
**Resposta: c**

**3. Por que BLS12-381 e essencial para BBS+ signatures em Verifiable Credentials?**
a) Porque e a curva mais rapida disponivel
b) Porque suporta emparelhamentos bilineares que habilitam selective disclosure com Zero-Knowledge Proofs
c) Porque e a unica curva aceita pelo W3C
d) Porque produz as menores assinaturas
**Resposta: b**

**4. Qual curva e preferida para integracoes com hardware como Secure Enclaves, TPMs e WebAuthn/FIDO2?**
a) Ed25519
b) secp256k1
c) BLS12-381
d) secp256r1 (P-256)
**Resposta: d**

**5. O que significa dizer que Ed25519 produz assinaturas "deterministicas"?**
a) Que a mesma mensagem sempre gera a mesma assinatura com a mesma chave, sem depender de nonce aleatorio externo
b) Que a assinatura pode ser calculada sem a chave privada
c) Que a assinatura tem tamanho variavel dependendo da mensagem
d) Que qualquer pessoa pode reproduzir a assinatura
**Resposta: a**
