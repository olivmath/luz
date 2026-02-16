# Aula 2.2: Algoritmos de hashing e Merkle Trees na verificacao de integridade

## Abertura
Bem-vindo a aula 2.2! Nesta aula, vamos explorar como funcoes de hash criptograficas e Merkle Trees sao utilizadas para garantir integridade de dados em sistemas de identidade descentralizada. Esses mecanismos sao essenciais para verificar que credenciais nao foram adulteradas, para construir registros de revogacao eficientes e para habilitar selective disclosure em Verifiable Credentials.

### Programa da aula:
1. Funcoes de hash criptograficas (introducao)
2. Propriedades, algoritmos e aplicacoes em DIDs (base e aprofundamento)
3. Merkle Trees: estrutura, provas e uso em identidade descentralizada (Conceito principal da aula)

---

## 1. Funcoes de hash criptograficas

### O que e uma funcao de hash
Uma funcao de hash criptografica `H` mapeia uma entrada de tamanho arbitrario para uma saida de tamanho fixo (o digest). Formalmente: `H: {0,1}* -> {0,1}^n`, onde `n` e o tamanho do digest em bits.

Propriedades fundamentais:
- **Deterministica**: A mesma entrada sempre produz a mesma saida.
- **Resistencia a pre-imagem**: Dado `h = H(m)`, e computacionalmente inviavel encontrar `m`.
- **Resistencia a segunda pre-imagem**: Dado `m1`, e inviavel encontrar `m2 != m1` tal que `H(m1) = H(m2)`.
- **Resistencia a colisao**: E inviavel encontrar quaisquer `m1 != m2` tal que `H(m1) = H(m2)`.

```python
import hashlib

msg = b"did:example:123"
digest = hashlib.sha256(msg).hexdigest()
print(f"SHA-256: {digest}")
# SHA-256: 7adb7f6f1b5b9a5e7c3e4d8a2f1b6c9e...

# Alterar um unico byte muda completamente o hash (efeito avalanche)
msg2 = b"did:example:124"
digest2 = hashlib.sha256(msg2).hexdigest()
print(f"SHA-256: {digest2}")
# Saida completamente diferente
```

- **Exemplo**: No ecossistema DID, o metodo `did:key` codifica a chave publica diretamente no identificador. Ja outros metodos como `did:ion` usam hashes do conteudo inicial (Initial State) para criar o identificador, de modo que `did:ion:EiD3a...` e derivado do hash SHA-256 do documento de criacao.

### Efeito avalanche e espaco de colisao
O **efeito avalanche** garante que uma mudanca de 1 bit na entrada altera aproximadamente 50% dos bits da saida. Isso e essencial para integridade: qualquer adulteracao, por menor que seja, e detectavel.

Para SHA-256 com 256 bits de saida, o espaco de colisao tem `2^256` valores possiveis. Pelo paradoxo do aniversario, seriam necessarias aproximadamente `2^128` operacoes para encontrar uma colisao — muito alem da capacidade computacional atual.

- **Exemplo**: Se voce calculasse `10^18` hashes por segundo (um exaflop inteiro dedicado), levaria `10^20` anos para encontrar uma colisao em SHA-256. O universo tem aproximadamente `1.4 * 10^10` anos.

---

## 2. Propriedades, algoritmos e aplicacoes em DIDs

### Principais algoritmos de hash
Diferentes algoritmos sao utilizados em diferentes contextos do ecossistema DID:

| Algoritmo | Digest (bits) | Uso em DIDs | Status |
|---|---|---|---|
| SHA-256 | 256 | did:ion, did:btcr, Bitcoin anchoring | Padrao atual |
| SHA-384 / SHA-512 | 384 / 512 | Suites criptograficas avancadas | Ativo |
| BLAKE2b | 256 / 512 | Substrato/Polkadot DIDs | Ativo |
| BLAKE3 | 256 | Sistemas de nova geracao | Emergente |
| Keccak-256 | 256 | did:ethr, Ethereum | Padrao Ethereum |
| SHA3-256 | 256 | Padroes governamentais (NIST) | Ativo |

```python
import hashlib

data = b"credentialSubject data"

# SHA-256 (mais comum em DIDs)
sha256 = hashlib.sha256(data).hexdigest()

# Keccak-256 (Ethereum / did:ethr)
from Crypto.Hash import keccak
k = keccak.new(digest_bits=256)
k.update(data)
keccak256 = k.hexdigest()

# BLAKE2b (Substrate)
blake2 = hashlib.blake2b(data, digest_size=32).hexdigest()

print(f"SHA-256:    {sha256}")
print(f"Keccak-256: {keccak256}")
print(f"BLAKE2b:    {blake2}")
```

### Hashing na construcao de identificadores DID
Diversos metodos DID usam hashes na construcao do identificador:

**did:ethr** — O endereco Ethereum e derivado dos ultimos 20 bytes do Keccak-256 da chave publica:
```
public_key_bytes = decompress(pk)        # 64 bytes (sem prefixo 0x04)
hash = keccak256(public_key_bytes)        # 32 bytes
address = "0x" + hash[-20:].hex()         # ultimos 20 bytes
did = f"did:ethr:{address}"
```

**did:ion** — Usa SHA-256 duplo sobre o documento de criacao, codificado em Base64url:
```
create_op = canonicalize(initial_state)
suffix = base64url(sha256(sha256(create_op)))
did = f"did:ion:{suffix}"
```

- **Exemplo**: O endereco Ethereum `0x71C7656EC7ab88b098defB751B7401B5f6d8976F` e derivado diretamente do hash Keccak-256 da chave publica ECDSA (secp256k1) do titular, sem nenhuma autoridade central envolvida.

---

## 3. Merkle Trees: estrutura, provas e uso em identidade descentralizada

### Estrutura de uma Merkle Tree
Uma Merkle Tree e uma arvore binaria onde cada folha contem o hash de um bloco de dados e cada no interno contem o hash da concatenacao de seus filhos. A raiz (Merkle Root) e um resumo criptografico de todos os dados.

```
           Root = H(H01 || H23)
          /                      \
    H01 = H(H0 || H1)      H23 = H(H2 || H3)
     /         \              /         \
  H0=H(D0)  H1=H(D1)    H2=H(D2)   H3=H(D3)
    |          |            |           |
   D0         D1           D2          D3
```

Para verificar que `D2` pertence ao conjunto, basta fornecer o **Merkle Proof**: `[H3, H01]`. O verificador calcula:
```
H2 = H(D2)
H23 = H(H2 || H3)
Root' = H(H01 || H23)
Verifica: Root' == Root
```

O tamanho da prova e `O(log n)`, onde `n` e o numero de folhas — extremamente eficiente.

- **Exemplo**: Em uma Merkle Tree com 1 milhao de credenciais revogadas, a prova de que uma credencial especifica esta na lista requer apenas ~20 hashes (log2(1.000.000) ~ 20), em vez de enviar a lista inteira.

### Merkle Trees em Revocation e Status Lists
O W3C define o mecanismo **StatusList2021** para revogacao de credenciais, mas Merkle Trees oferecem uma alternativa mais flexivel:

**Revocation Merkle Tree:**
```
Folhas = [H(vc_id_1), H(vc_id_2), ..., H(vc_id_n)]
Merkle Root publicado no DID Document ou on-chain
```

Para verificar se uma credencial foi revogada:
1. O verificador obtem o Merkle Root do registro publico.
2. Solicita o Merkle Proof ao servico do emissor.
3. Calcula e compara com a raiz.

```python
import hashlib

def hash_pair(a: bytes, b: bytes) -> bytes:
    return hashlib.sha256(a + b).digest()

def build_merkle_root(leaves: list[bytes]) -> bytes:
    if len(leaves) == 1:
        return leaves[0]
    next_level = []
    for i in range(0, len(leaves), 2):
        left = leaves[i]
        right = leaves[i + 1] if i + 1 < len(leaves) else left
        next_level.append(hash_pair(left, right))
    return build_merkle_root(next_level)

# Credenciais revogadas
revoked = [b"vc-001", b"vc-002", b"vc-003", b"vc-004"]
leaves = [hashlib.sha256(vc).digest() for vc in revoked]
root = build_merkle_root(leaves)
print(f"Merkle Root: {root.hex()}")
```

### Selective Disclosure com Merkle Trees
Uma aplicacao avancada e usar Merkle Trees para **selective disclosure**: o titular revela apenas alguns campos de uma credencial, fornecendo Merkle Proofs para os campos revelados, enquanto a raiz cobre todos os campos.

```
Credencial completa:
  nome = "Alice"
  idade = 30
  pais = "Brasil"
  diploma = "Engenharia"

Merkle Tree:
       Root
      /    \
   H01      H23
   / \      / \
 H0   H1  H2   H3
  |    |    |    |
nome idade pais diploma

Alice revela apenas "idade=30" com proof [H0, H23]
Verificador confirma que "idade=30" faz parte da credencial
sem aprender nome, pais ou diploma.
```

- **Exemplo**: No protocolo de ZKP Merkle-based, um portador de credencial pode provar que possui diploma universitario sem revelar o nome da instituicao, data de graduacao ou qualquer outro campo da credencial.

---

## Conclusao
Nesta aula, exploramos como funcoes de hash criptograficas garantem integridade de dados em sistemas de identidade descentralizada, desde a construcao de identificadores DID ate a verificacao de credenciais. Vimos os principais algoritmos (SHA-256, Keccak-256, BLAKE2b) e seus usos em diferentes metodos DID. Merkle Trees se mostraram uma estrutura poderosa para revogacao eficiente e selective disclosure, permitindo provas compactas de `O(log n)` que preservam a privacidade do titular.

---

## Licao de Casa
1. Implemente uma Merkle Tree em sua linguagem preferida que aceite uma lista de strings, construa a arvore e gere um Merkle Proof para um elemento especifico. Valide o proof recalculando a raiz.
2. Calcule o hash SHA-256 e Keccak-256 de uma mesma entrada e compare os resultados. Pesquise por que o Ethereum escolheu Keccak em vez de SHA-3 padronizado pelo NIST.
3. Pesquise o mecanismo StatusList2021 do W3C e compare com uma abordagem baseada em Merkle Tree para revogacao de credenciais. Liste vantagens e desvantagens de cada uma.

---

## Proxima Aula
Na proxima aula, vamos estudar as curvas elipticas mais utilizadas em identidade descentralizada: secp256k1, Ed25519, secp256r1, X25519 e BLS12-381. Vamos entender suas diferencas, trade-offs de seguranca e performance, e em quais contextos cada uma e preferida. Ate la!

---

## Questionario

**1. Qual propriedade de uma funcao de hash garante que e inviavel encontrar duas entradas distintas com o mesmo digest?**
a) Resistencia a pre-imagem
b) Determinismo
c) Resistencia a colisao
d) Efeito avalanche
**Resposta: c**

**2. Qual algoritmo de hash e utilizado no ecossistema Ethereum para derivar enderecos a partir de chaves publicas?**
a) SHA-256
b) SHA-3-256
c) BLAKE2b
d) Keccak-256
**Resposta: d**

**3. Qual e a complexidade do tamanho de um Merkle Proof em funcao do numero de folhas n?**
a) O(n)
b) O(n log n)
c) O(log n)
d) O(1)
**Resposta: c**

**4. No contexto de selective disclosure com Merkle Trees, o que o titular precisa fornecer ao verificador?**
a) Toda a Merkle Tree completa
b) Apenas a raiz da arvore
c) Os campos revelados e os Merkle Proofs correspondentes
d) A chave privada do emissor
**Resposta: c**

**5. Por que o efeito avalanche e importante para a integridade de credenciais verificaveis?**
a) Permite comprimir os dados da credencial
b) Garante que qualquer alteracao, por menor que seja, resulta em um hash completamente diferente, tornando adulteracoes detectaveis
c) Acelera o processo de verificacao de assinaturas
d) Permite que o hash seja revertido para obter os dados originais
**Resposta: b**
