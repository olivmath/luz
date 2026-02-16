# Aula 2.1: Criptografia assimetrica: pares de chaves e assinaturas digitais

## Abertura
Bem-vindo a aula 2.1! Nesta aula, vamos mergulhar nos fundamentos da criptografia assimetrica, que e a base de toda a infraestrutura de identidade descentralizada. Sem pares de chaves e assinaturas digitais, seria impossivel provar controle sobre um DID ou emitir credenciais verificaveis. Vamos entender como tudo isso funciona matematicamente e na pratica.

### Programa da aula:
1. Fundamentos da criptografia assimetrica (introducao)
2. Pares de chaves: geracao, propriedades e representacao (base e aprofundamento)
3. Assinaturas digitais: construcao, verificacao e aplicacao em DIDs (Conceito principal da aula)

---

## 1. Fundamentos da criptografia assimetrica

### Criptografia simetrica vs. assimetrica
Na criptografia simetrica, uma unica chave e usada para cifrar e decifrar. O problema fundamental e a distribuicao dessa chave: como dois agentes que nunca se encontraram compartilham um segredo? Em 1976, Diffie e Hellman propuseram a criptografia de chave publica, resolvendo esse dilema.

Na criptografia assimetrica, existem duas chaves matematicamente relacionadas:
- **Chave privada (sk)**: Mantida em segredo pelo titular. E um numero aleatorio grande.
- **Chave publica (pk)**: Derivada da chave privada, pode ser compartilhada livremente.

A relacao matematica entre elas e baseada em **funcoes de mao unica com alçapao (trapdoor functions)**: e computacionalmente facil calcular `pk = f(sk)`, mas e inviavel calcular `sk = f_inv(pk)`.

- **Exemplo**: Em curvas elipticas, a chave privada `sk` e um escalar e a chave publica e `pk = sk * G`, onde `G` e o ponto gerador da curva. A multiplicacao escalar e eficiente, mas o problema do logaritmo discreto em curvas elipticas (ECDLP) torna a operacao inversa computacionalmente inviavel.

### O papel na identidade descentralizada
No contexto de DIDs, a chave publica e publicada no DID Document associado ao identificador. A chave privada permite que o titular assine mensagens, provas e credenciais. Qualquer pessoa com acesso ao DID Document pode verificar essas assinaturas.

```
DID Document (simplificado):
{
  "id": "did:example:123",
  "verificationMethod": [{
    "type": "Ed25519VerificationKey2020",
    "publicKeyMultibase": "z6Mkf5rGMoatrSj1f..."
  }]
}
```

- **Exemplo**: Quando Alice apresenta uma Verifiable Credential, o verificador resolve o DID do emissor, obtem a chave publica do DID Document e verifica a assinatura digital da credencial. Nenhum intermediario centralizado e necessario.

---

## 2. Pares de chaves: geracao, propriedades e representacao

### Geracao segura de chaves
A seguranca de todo o sistema depende da qualidade da entropia usada para gerar a chave privada. Uma chave privada tipica e um numero aleatorio de 256 bits, o que significa que existem `2^256` chaves possiveis — um espaco maior que o numero de atomos no universo observavel (~`10^80`).

```python
import os
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

# Geracao segura usando CSPRNG do sistema operacional
private_key = Ed25519PrivateKey.generate()
public_key = private_key.public_key()

# Chave privada: 32 bytes aleatorios
sk_bytes = private_key.private_bytes_raw()
print(f"sk (hex): {sk_bytes.hex()}")
# sk (hex): 9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60

# Chave publica: derivada da privada
pk_bytes = public_key.public_bytes_raw()
print(f"pk (hex): {pk_bytes.hex()}")
# pk (hex): d75a980182b10ab7d54bfed3c964073a0ee172f3daa3f4a18446b0b8d183f8e3
```

**Requisitos criticos para geracao:**
- Usar um CSPRNG (Cryptographically Secure Pseudo-Random Number Generator), como `/dev/urandom` no Linux ou `CryptGenRandom` no Windows.
- Nunca usar `Math.random()` ou fontes de baixa entropia.
- Nunca reusar seeds entre chaves diferentes.

### Representacao e codificacao de chaves
Chaves podem ser representadas em diversos formatos, cada um com seu caso de uso:

| Formato | Uso | Exemplo |
|---|---|---|
| Raw bytes | Operacoes criptograficas | `0x9d61b19d...` |
| Hex | Debug e logs | `9d61b19deffd5a60...` |
| Base58btc | DID Documents (legado) | `z6Mkf5rGMoatrSj1f...` |
| Multibase | DID Documents (atual) | `z6Mkf5rGMoatrSj1f...` |
| JWK (JSON Web Key) | Ecossistema JOSE | `{"kty":"OKP","crv":"Ed25519",...}` |

- **Exemplo**: A mesma chave publica Ed25519 em formato JWK:
```json
{
  "kty": "OKP",
  "crv": "Ed25519",
  "x": "11qYAYKxCrfVS_7TyWRHOg7hcvPao_ShiEawuNgT-OM"
}
```

---

## 3. Assinaturas digitais: construcao, verificacao e aplicacao em DIDs

### Como funciona uma assinatura digital
Uma assinatura digital e uma prova matematica de que o titular da chave privada aprovou uma determinada mensagem. O processo envolve tres operacoes:

1. **Geracao de chave**: `(sk, pk) = KeyGen()`
2. **Assinatura**: `sigma = Sign(sk, msg)`
3. **Verificacao**: `bool = Verify(pk, msg, sigma)`

Propriedades fundamentais:
- **Autenticidade**: Somente quem possui `sk` pode gerar `sigma` valido para `msg`.
- **Integridade**: Se `msg` for alterada em um unico bit, `Verify` retorna `false`.
- **Nao-repudio**: O signatario nao pode negar ter assinado, pois so ele possui `sk`.

```python
from cryptography.hazmat.primitives.asymmetric.ed25519 import Ed25519PrivateKey

sk = Ed25519PrivateKey.generate()
pk = sk.public_key()

# Assinar uma mensagem
message = b"did:example:123 controla esta credencial"
signature = sk.sign(message)
print(f"Assinatura (hex): {signature.hex()}")
# 64 bytes para Ed25519

# Verificar
try:
    pk.verify(signature, message)
    print("Assinatura valida!")
except Exception:
    print("Assinatura invalida!")
```

### Assinaturas em Verifiable Credentials e DID Auth
No ecossistema DID, assinaturas digitais aparecem em dois contextos principais:

**1. Verifiable Credentials (VCs):** O emissor assina a credencial com sua chave privada. O formato mais moderno usa Data Integrity Proofs:

```json
{
  "@context": ["https://www.w3.org/ns/credentials/v2"],
  "type": ["VerifiableCredential"],
  "issuer": "did:example:issuer123",
  "credentialSubject": {
    "id": "did:example:holder456",
    "degree": "Engenharia de Software"
  },
  "proof": {
    "type": "DataIntegrityProof",
    "cryptosuite": "eddsa-rdfc-2022",
    "verificationMethod": "did:example:issuer123#key-1",
    "proofValue": "z58DAdFfa9SkqZMVPxAQp..."
  }
}
```

**2. DID Authentication:** O titular prova controle sobre o DID assinando um challenge:

```
Verificador -> Titular: nonce = "abc123xyz"
Titular -> Verificador: Sign(sk, nonce) = sigma
Verificador: Verify(pk_from_DID_Document, nonce, sigma) == true
```

- **Exemplo**: Em um fluxo DIDComm, Alice prova que controla `did:peer:2.Ez6Mkf...` assinando o challenge do verificador. O verificador resolve o DID, obtem a chave publica e valida a assinatura sem precisar de nenhuma autoridade central.

---

## Conclusao
Nesta aula, exploramos os fundamentos da criptografia assimetrica que sustentam a identidade descentralizada. Vimos que pares de chaves permitem separar a capacidade de assinar (privada) da capacidade de verificar (publica), eliminando a necessidade de intermediarios. As assinaturas digitais garantem autenticidade, integridade e nao-repudio, sendo o mecanismo central de Verifiable Credentials e DID Authentication. A seguranca de todo o sistema comeca na geracao adequada da chave privada com entropia criptografica de qualidade.

---

## Licao de Casa
1. Implemente em Python (ou outra linguagem) a geracao de um par de chaves Ed25519, assine uma mensagem e verifique a assinatura. Experimente alterar um byte da mensagem e observe o resultado da verificacao.
2. Pesquise a diferenca entre os formatos JWK e Multibase para representacao de chaves publicas e escreva um paragrafo comparando vantagens e desvantagens de cada um.
3. Explique, com suas proprias palavras, por que o problema do logaritmo discreto em curvas elipticas (ECDLP) e fundamental para a seguranca de DIDs.

---

## Proxima Aula
Na proxima aula, vamos explorar algoritmos de hashing e Merkle Trees, entendendo como eles garantem a integridade de dados em sistemas de identidade descentralizada e como sao usados em selective disclosure. Ate la!

---

## Questionario

**1. Qual e a relacao matematica entre chave privada e chave publica em criptografia de curvas elipticas?**
a) A chave publica e uma copia criptografada da chave privada
b) A chave publica e obtida pela multiplicacao escalar da chave privada pelo ponto gerador da curva
c) A chave publica e o hash da chave privada
d) A chave publica e gerada independentemente da chave privada
**Resposta: b**

**2. O que e um CSPRNG e por que e importante na geracao de chaves?**
a) E um algoritmo de compressao usado para reduzir o tamanho das chaves
b) E um gerador de numeros pseudo-aleatorios criptograficamente seguro, essencial para garantir imprevisibilidade da chave privada
c) E um protocolo de rede para distribuir chaves publicas
d) E um formato de codificacao de chaves usado em DID Documents
**Resposta: b**

**3. Qual propriedade da assinatura digital garante que o signatario nao pode negar ter assinado?**
a) Confidencialidade
b) Disponibilidade
c) Nao-repudio
d) Escalabilidade
**Resposta: c**

**4. Em um DID Document, onde a chave publica e tipicamente armazenada?**
a) No campo "service"
b) No campo "authentication" apenas
c) No campo "verificationMethod"
d) No campo "controller"
**Resposta: c**

**5. O que acontece quando a assinatura digital de uma Verifiable Credential e verificada com sucesso?**
a) Prova que a credencial foi emitida pelo emissor identificado e nao foi alterada
b) Prova que a credencial nunca expira
c) Prova que o titular e a unica pessoa que pode ver a credencial
d) Prova que a credencial esta armazenada em uma blockchain
**Resposta: a**
