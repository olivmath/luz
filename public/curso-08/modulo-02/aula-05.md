# Aula 2.5: Esquemas de codificacao: Multibase, Multicodec, Multihash

## Abertura
Bem-vindo a aula 2.5! Nesta aula, vamos estudar os esquemas de codificacao do projeto Multiformats, que sao fundamentais para a interoperabilidade no ecossistema de identidade descentralizada. Quando um DID Document contém uma chave publica codificada como `z6Mkf5rGMoatrSj1f...`, cada parte desse prefixo carrega informacao semantica sobre o tipo de codificacao, o algoritmo e o formato. Vamos entender como essas camadas funcionam.

### Programa da aula:
1. O problema da codificacao e o projeto Multiformats (introducao)
2. Multibase e Multicodec: auto-descricao de dados (base e aprofundamento)
3. Multihash e a composicao completa em DID Documents (Conceito principal da aula)

---

## 1. O problema da codificacao e o projeto Multiformats

### Por que precisamos de codificacao auto-descritiva
Em sistemas descentralizados, nao existe uma autoridade central que define qual algoritmo ou formato usar. Diferentes metodos DID podem usar Ed25519, secp256k1 ou BLS12-381. Os hashes podem ser SHA-256, BLAKE2b ou SHA-3. As codificacoes podem ser Base58, Base64 ou hexadecimal.

Sem um sistema de auto-descricao, o receptor de um dado nao sabe como interpreta-lo:
```
# Isso e uma chave publica ou um hash? Qual algoritmo? Qual codificacao?
"9d61b19deffd5a60ba844af492ec2cc44449c5697b326919703bac031cae7f60"
```

O projeto **Multiformats** resolve isso com tres especificacoes complementares:
- **Multibase**: Descreve a codificacao base (hex, base58, base64, etc.)
- **Multicodec**: Descreve o tipo de dado (Ed25519 public key, secp256k1 key, SHA-256 hash, etc.)
- **Multihash**: Descreve o algoritmo e tamanho do hash

Juntas, elas formam um sistema onde qualquer dado carrega consigo a informacao necessaria para ser interpretado corretamente.

- **Exemplo**: A string `z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK` em um DID Document pode ser decomposta: `z` = Multibase (base58btc), `6Mk` decodificado = `0xed01` = Multicodec (Ed25519 public key), seguido dos 32 bytes da chave.

### Onde Multiformats aparecem no ecossistema DID
Os Multiformats sao utilizados em diversos contextos:

| Contexto | Uso |
|---|---|
| `did:key` | O identificador inteiro e uma chave Multicodec+Multibase |
| DID Documents | `publicKeyMultibase` usa Multibase+Multicodec |
| IPFS/CID | Content identifiers usam Multihash |
| DIDComm | Chaves de criptografia em formato Multibase |
| Verifiable Credentials | Proof values em Multibase |

---

## 2. Multibase e Multicodec: auto-descricao de dados

### Multibase: prefixo de codificacao
Multibase adiciona um unico caractere prefixo que identifica a codificacao base utilizada:

| Prefixo | Codificacao | Alfabeto |
|---|---|---|
| `f` | base16 (hex lowercase) | 0-9a-f |
| `F` | base16 (hex uppercase) | 0-9A-F |
| `z` | base58btc | 123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz |
| `m` | base64 | A-Za-z0-9+/ |
| `u` | base64url | A-Za-z0-9-_ |
| `M` | base64pad | A-Za-z0-9+/= |

```python
import base58
import base64

raw_bytes = bytes.fromhex("ed01" + "d75a980182b10ab7d54bfed3c964073a0ee172f3daa3f4a18446b0b8d183f8e3")

# Multibase base58btc (prefixo 'z')
encoded_b58 = "z" + base58.b58encode(raw_bytes).decode()
print(f"Multibase base58btc: {encoded_b58}")
# z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK

# Multibase base64url (prefixo 'u')
encoded_b64 = "u" + base64.urlsafe_b64encode(raw_bytes).decode().rstrip("=")
print(f"Multibase base64url: {encoded_b64}")

# Decodificacao: primeiro caractere indica o metodo
def decode_multibase(s: str) -> bytes:
    prefix = s[0]
    data = s[1:]
    if prefix == "z":
        return base58.b58decode(data)
    elif prefix == "u":
        padding = 4 - len(data) % 4
        return base64.urlsafe_b64decode(data + "=" * padding)
    elif prefix == "f":
        return bytes.fromhex(data)
    else:
        raise ValueError(f"Multibase prefix desconhecido: {prefix}")
```

- **Exemplo**: O W3C DID Core especifica que o campo `publicKeyMultibase` deve usar codificacao Multibase. Assim, `"publicKeyMultibase": "z6Mkf..."` indica imediatamente que a codificacao e base58btc, sem ambiguidade.

### Multicodec: identificador de tipo de dado
Multicodec e uma tabela de prefixos varint (unsigned variable integer) que identifica o tipo de dado:

| Codigo (varint) | Hex | Tipo |
|---|---|---|
| 0xed | ed01 | Ed25519 public key |
| 0xe7 | e701 | secp256k1 public key |
| 0x1200 | 8024 | P-256 public key |
| 0xec | ec01 | X25519 public key |
| 0xeb | eb01 | BLS12-381 G2 public key |
| 0x1205 | 8524 | Ed25519 private key |
| 0x12 | 12 | SHA2-256 |
| 0x1e | 1e | SHA2-512 |
| 0xb220 | a0e402 | BLAKE2b-256 |

O varint usa codificacao LEB128 (Little Endian Base 128): se o byte mais significativo tem o bit 7 setado, continua lendo o proximo byte.

```python
def encode_varint(value: int) -> bytes:
    """Codifica um inteiro como unsigned varint (LEB128)."""
    result = []
    while value > 0x7F:
        result.append((value & 0x7F) | 0x80)
        value >>= 7
    result.append(value & 0x7F)
    return bytes(result)

def decode_varint(data: bytes) -> tuple[int, int]:
    """Decodifica varint, retorna (valor, bytes_consumidos)."""
    value = 0
    shift = 0
    for i, byte in enumerate(data):
        value |= (byte & 0x7F) << shift
        if not (byte & 0x80):
            return value, i + 1
        shift += 7
    raise ValueError("Varint incompleto")

# Ed25519 public key: 0xed
codec_ed25519 = encode_varint(0xed)
print(f"Multicodec Ed25519: {codec_ed25519.hex()}")  # ed01

# secp256k1 public key: 0xe7
codec_secp256k1 = encode_varint(0xe7)
print(f"Multicodec secp256k1: {codec_secp256k1.hex()}")  # e701
```

- **Exemplo**: Para construir um `did:key` Ed25519, concatenamos o Multicodec `0xed01` com os 32 bytes da chave publica e codificamos em Multibase base58btc: `did:key:z6Mk...`. O prefixo `z6Mk` e sempre o mesmo para Ed25519 porque `base58btc(0xed01)` produz esse padrao reconhecivel.

---

## 3. Multihash e a composicao completa em DID Documents

### Multihash: hashes auto-descritivos
Multihash adiciona dois prefixos varint ao digest: o codigo do algoritmo de hash e o tamanho do digest em bytes:

```
Formato: <hash-func-code><digest-size><digest-value>

Exemplo SHA-256:
  codigo = 0x12 (SHA2-256)
  tamanho = 0x20 (32 bytes)
  digest = sha256(data)
  multihash = 0x12 || 0x20 || digest

Exemplo BLAKE2b-256:
  codigo = 0xb220 (varint: a0e402)
  tamanho = 0x20 (32 bytes)
  digest = blake2b256(data)
  multihash = 0xa0e402 || 0x20 || digest
```

```python
import hashlib

def create_multihash(data: bytes, algo: str = "sha256") -> bytes:
    """Cria um Multihash a partir de dados brutos."""
    if algo == "sha256":
        code = b'\x12'        # 0x12 = SHA2-256
        digest = hashlib.sha256(data).digest()
    elif algo == "blake2b-256":
        code = b'\xa0\xe4\x02'  # varint de 0xb220
        digest = hashlib.blake2b(data, digest_size=32).digest()
    else:
        raise ValueError(f"Algoritmo nao suportado: {algo}")

    length = bytes([len(digest)])
    return code + length + digest

data = b"did:example:123"
mh_sha256 = create_multihash(data, "sha256")
mh_blake2 = create_multihash(data, "blake2b-256")

print(f"Multihash SHA-256:    {mh_sha256.hex()}")
print(f"Multihash BLAKE2b:    {mh_blake2.hex()}")
```

- **Exemplo**: No IPFS, os Content Identifiers (CIDs) usam Multihash para que o mesmo sistema suporte multiplos algoritmos de hash. Um CID v1 tem o formato: `<multibase><version><multicodec><multihash>`. Essa mesma estrutura e usada em metodos DID baseados em content-addressing.

### Composicao completa: do byte bruto ao DID Document
Vamos rastrear a jornada completa de uma chave publica Ed25519 ate sua representacao em um DID Document:

```
1. Chave publica bruta (32 bytes):
   d75a980182b10ab7d54bfed3c964073a0ee172f3daa3f4a18446b0b8d183f8e3

2. Adicionar Multicodec (Ed25519 = 0xed01):
   ed01 d75a980182b10ab7d54bfed3c964073a0ee172f3daa3f4a18446b0b8d183f8e3

3. Codificar em Multibase (base58btc, prefixo 'z'):
   z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK

4. Inserir no DID Document:
   {
     "id": "did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK",
     "verificationMethod": [{
       "id": "did:key:z6Mkh...#z6Mkh...",
       "type": "Ed25519VerificationKey2020",
       "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
     }]
   }
```

**Decodificacao reversa pelo verificador:**
```python
import base58

multibase_key = "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"

# 1. Multibase: prefixo 'z' = base58btc
raw = base58.b58decode(multibase_key[1:])

# 2. Multicodec: primeiros bytes
codec, consumed = decode_varint(raw)
print(f"Multicodec: 0x{codec:x}")  # 0xed = Ed25519 public key

# 3. Chave publica bruta
public_key = raw[consumed:]
print(f"Chave publica ({len(public_key)} bytes): {public_key.hex()}")
```

### Tabela de prefixos reconheciveis em did:key
Devido a combinacao Multicodec + Multibase base58btc, cada tipo de chave produz um prefixo reconhecivel:

| Prefixo did:key | Multicodec | Tipo de chave |
|---|---|---|
| `z6Mk...` | 0xed (ed01) | Ed25519 |
| `zQ3s...` | 0xe7 (e701) | secp256k1 |
| `zDn...` | 0x1200 (8024) | P-256 |
| `z6LS...` | 0xec (ec01) | X25519 |
| `zUC7...` | 0xeb (eb01) | BLS12-381 G2 |

- **Exemplo**: Ao ver `did:key:z6MkhaXgBZD...`, um desenvolvedor experiente reconhece imediatamente pelo prefixo `z6Mk` que se trata de uma chave Ed25519, sem precisar decodificar. Isso acelera debugging e auditoria de DID Documents.

---

## Conclusao
Nesta aula, exploramos os tres pilares do sistema Multiformats: Multibase para codificacao auto-descritiva, Multicodec para identificacao de tipo de dado via prefixos varint, e Multihash para hashes auto-descritivos. Vimos como essas camadas se compoem para criar representacoes interoperaveis de chaves publicas e hashes em DID Documents. Esse sistema permite que diferentes metodos DID usem diferentes algoritmos criptograficos sem perda de interoperabilidade, pois cada dado carrega consigo a informacao necessaria para ser interpretado.

---

## Licao de Casa
1. Implemente uma funcao que recebe uma chave publica bruta e um tipo de curva (Ed25519, secp256k1 ou P-256) e retorna a representacao `publicKeyMultibase` completa. Teste com chaves reais.
2. Decodifique manualmente o `did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK`: extraia o prefixo Multibase, decodifique, identifique o Multicodec e extraia a chave publica bruta em hexadecimal.
3. Pesquise o formato CID v1 do IPFS e descreva como Multibase, Multicodec e Multihash se compoem para formar um Content Identifier completo. Compare com a composicao usada em `did:key`.

---

## Proxima Aula
Na proxima aula, vamos estudar gerenciamento de chaves em identidade descentralizada: rotacao, revogacao, recuperacao e uso de secure enclaves. Veremos como manter a seguranca das chaves ao longo do ciclo de vida de um DID. Ate la!

---

## Questionario

**1. Qual e o papel do caractere prefixo no Multibase?**
a) Indicar o tamanho do dado codificado
b) Identificar o algoritmo de hash utilizado
c) Identificar a codificacao base utilizada para representar os bytes
d) Servir como checksum para deteccao de erros
**Resposta: c**

**2. O que o Multicodec 0xed (varint ed01) representa?**
a) Um hash SHA-256
b) Uma chave publica secp256k1
c) Uma chave publica Ed25519
d) Uma assinatura ECDSA
**Resposta: c**

**3. Qual e a estrutura de um Multihash?**
a) <digest-value> apenas
b) <hash-func-code><digest-size><digest-value>
c) <multibase-prefix><digest-value>
d) <algorithm-name-string><digest-value>
**Resposta: b**

**4. Ao ver um did:key com prefixo `zQ3s...`, qual tipo de chave esta sendo utilizado?**
a) Ed25519
b) X25519
c) secp256k1
d) BLS12-381
**Resposta: c**

**5. Por que o sistema Multiformats e essencial para interoperabilidade em DIDs?**
a) Porque define um unico algoritmo criptografico obrigatorio para todos
b) Porque permite que dados carreguem consigo a informacao sobre seu tipo e codificacao, eliminando ambiguidade entre diferentes implementacoes
c) Porque comprime os dados para economizar espaco de armazenamento
d) Porque substitui a necessidade de DID Documents
**Resposta: b**
