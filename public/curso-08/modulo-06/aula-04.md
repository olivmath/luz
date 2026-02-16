# Aula 6.4: Criptografia pos-quantica: curvas baseadas em reticulados (Dilithium, Falcon)

## Abertura
Bem-vindo a aula 6.4! Ate agora, estudamos tecnicas criptograficas baseadas em curvas elipticas e grupos bilineares. Porem, a chegada dos computadores quanticos ameaca fundamentalmente esses esquemas: o algoritmo de Shor pode quebrar RSA, ECDSA e pairings em tempo polinomial. Nesta aula, exploramos a criptografia pos-quantica (PQC) — especificamente esquemas baseados em reticulados — e como preparar sistemas de identidade descentralizada para essa transicao inevitavel.

### Programa da aula:
1. A ameaca quantica a criptografia atual (introducao)
2. Criptografia baseada em reticulados: fundamentos (base e aprofundamento)
3. Dilithium e Falcon: assinaturas pos-quanticas para DID/VC (Conceito principal da aula)

---

## 1. A ameaca quantica a criptografia atual
### O algoritmo de Shor e suas implicacoes
O **algoritmo de Shor** (1994) demonstra que um computador quantico suficientemente grande pode resolver dois problemas em tempo polinomial:
- **Fatoracao de inteiros**: quebra RSA.
- **Logaritmo discreto**: quebra ECDSA, EdDSA, Diffie-Hellman, e esquemas baseados em pairings (incluindo BBS+).

Para quebrar RSA-2048, estima-se que sejam necessarios ~4.000 qubits logicos (com correcao de erro). Para ECDSA sobre curvas de 256 bits, ~2.500 qubits logicos. Embora computadores quanticos atuais tenham centenas de qubits ruidosos (nao logicos), a projecao e que maquinas capazes de executar Shor estarao disponiveis entre 2030 e 2040.

- **Exemplo**: Todas as assinaturas DID atuais (Ed25519, secp256k1, BLS12-381) serao quebradas por Shor. Um atacante com computador quantico poderia forjar assinaturas de qualquer issuer, comprometendo todo o ecossistema de Verifiable Credentials.

### A ameaca "Harvest Now, Decrypt Later"
Mesmo antes de computadores quanticos operacionais, adversarios podem executar a estrategia **"Harvest Now, Decrypt Later" (HNDL)**: capturar dados encriptados e assinaturas digitais hoje, e quebra-los quando tiverem acesso a computacao quantica. Para identidade descentralizada, isso significa:

- Verifiable Credentials assinadas hoje com ECDSA podem ser forjadas no futuro.
- Comunicacoes DIDComm encriptadas com ECDH podem ser decifradas retroativamente.
- DIDs registrados em blockchains com assinaturas classicas podem ser comprometidos.

- **Exemplo**: Um governo emite credenciais de identidade hoje usando Ed25519. Em 2035, um adversario com computador quantico pode derivar a chave privada do governo a partir da chave publica registrada no DID Document, e emitir credenciais falsas indistinguiveis das reais.

---

## 2. Criptografia baseada em reticulados: fundamentos
### O que sao reticulados (lattices)
Um **reticulado** e uma estrutura algebrica definida como o conjunto de todas as combinacoes lineares inteiras de um conjunto de vetores base em R^n. Visualmente, em 2D, e uma grade infinita de pontos. Os problemas computacionais sobre reticulados que fundamentam a PQC sao:

- **SVP (Shortest Vector Problem)**: encontrar o vetor mais curto (nao-zero) no reticulado. E NP-hard para aproximacoes exatas.
- **LWE (Learning With Errors)**: dado um sistema linear com erros aleatorios pequenos, recuperar o vetor secreto. E o problema base da maioria dos esquemas PQC.
- **SIS (Short Integer Solution)**: encontrar um vetor curto que satisfaca uma equacao linear modular.

A seguranca vem do fato de que esses problemas permanecem dificeis mesmo para computadores quanticos — nao se conhece algoritmo quantico eficiente para resolve-los.

- **Exemplo**: O problema LWE pode ser descrito assim: dado `A` (matriz publica) e `b = A*s + e` (onde `s` e o segredo e `e` e ruido pequeno), recuperar `s`. A adicao do ruido `e` torna o problema exponencialmente dificil, mesmo quanticamente.

### O processo de padronizacao do NIST
O **NIST** (National Institute of Standards and Technology) conduziu um processo de padronizacao PQC de 2016 a 2024, avaliando dezenas de candidatos. Os esquemas selecionados para assinatura digital foram:

- **ML-DSA (Module-Lattice Digital Signature Algorithm)** — anteriormente CRYSTALS-Dilithium: padrao primario para assinatura digital.
- **FN-DSA (FFT-based Lattice Signature over NTRU)** — anteriormente FALCON: alternativa com assinaturas menores.
- **SLH-DSA (Stateless Hash-based Digital Signature Algorithm)** — anteriormente SPHINCS+: baseado em hashes, nao em reticulados (backup conservador).

Os parametros FIPS 204 (ML-DSA) e FIPS 206 (FN-DSA) definem tres niveis de seguranca:
- **Nivel 1**: equivalente a AES-128.
- **Nivel 3**: equivalente a AES-192.
- **Nivel 5**: equivalente a AES-256.

- **Exemplo**: Para identidade descentralizada, o nivel de seguranca escolhido impacta diretamente o tamanho das chaves e assinaturas armazenadas em DID Documents e Verifiable Credentials. Um DID Document com chave ML-DSA-65 (nivel 3) tera uma chave publica de ~1.952 bytes, versus 32 bytes de Ed25519.

---

## 3. Dilithium e Falcon: assinaturas pos-quanticas para DID/VC
### CRYSTALS-Dilithium (ML-DSA)
**Dilithium** e baseado no problema **Module-LWE** e no **Module-SIS**. O esquema usa reticulados modulares sobre aneis polinomiais `Z_q[X]/(X^n + 1)`, combinando seguranca com eficiencia computacional.

Parametros e tamanhos para os tres niveis:

| Parametro | ML-DSA-44 (Nivel 2) | ML-DSA-65 (Nivel 3) | ML-DSA-87 (Nivel 5) |
|---|---|---|---|
| Chave publica | 1.312 bytes | 1.952 bytes | 2.592 bytes |
| Chave privada | 2.560 bytes | 4.032 bytes | 4.896 bytes |
| Assinatura | 2.420 bytes | 3.309 bytes | 4.627 bytes |
| Seguranca | ~128 bits | ~192 bits | ~256 bits |

Vantagens do Dilithium:
- Implementacao simples e resistente a side-channel attacks.
- Geracao de chaves e assinatura rapidas.
- Verificacao muito rapida (~0.5 ms).
- Sem necessidade de amostragem Gaussiana (usa rejeicao uniforme), evitando timing attacks.

- **Exemplo**: Um DID Document pos-quantico usando ML-DSA-65 teria um `verificationMethod` com chave publica de ~1.9 KB. Comparado a Ed25519 (32 bytes), e 60x maior, mas garante seguranca contra ataques quanticos.

### FALCON (FN-DSA)
**Falcon** e baseado no problema **NTRU** (um tipo especifico de reticulado) e usa a tecnica de **hash-and-sign com amostragem Gaussiana discreta** sobre reticulados NTRU. A principal vantagem e assinaturas significativamente menores que Dilithium:

| Parametro | FN-DSA-512 (Nivel 1) | FN-DSA-1024 (Nivel 5) |
|---|---|---|
| Chave publica | 897 bytes | 1.793 bytes |
| Chave privada | 1.281 bytes | 2.305 bytes |
| Assinatura | ~666 bytes | ~1.280 bytes |

Porem, Falcon tem desvantagens:
- A amostragem Gaussiana discreta e complexa de implementar de forma segura (vulneravel a timing side-channels).
- Requer aritmetica de ponto flutuante de alta precisao.
- A implementacao correta e significativamente mais dificil que Dilithium.

- **Exemplo**: Para um QR code contendo uma Verifiable Presentation pos-quantica, Falcon pode ser preferivel: uma assinatura de ~666 bytes versus ~2.420 bytes do Dilithium reduz significativamente o tamanho do QR code.

### Estrategias de migracao para DID/VC
A transicao para PQC em sistemas de identidade descentralizada envolve desafios unicos:

**1. Abordagem hibrida**: usar assinaturas duplas — uma classica (Ed25519) e uma pos-quantica (ML-DSA) — durante o periodo de transicao. O DID Document lista ambas as chaves. A verificacao aceita qualquer uma, mas clientes atualizados verificam ambas.

**2. Agilidade criptografica**: DID Documents devem suportar multiplos `verificationMethod` com diferentes tipos de chave. A propriedade `type` deve identificar o algoritmo (ex.: `Multikey` com prefixo multicodec para ML-DSA).

**3. Rotacao de chaves**: DIDs com capacidade de key rotation podem migrar gradualmente — adicionar chave PQC, depois remover chave classica.

**4. Impacto em ledgers**: chaves e assinaturas PQC sao 10-100x maiores. Blockchains e registros devem acomodar esse crescimento.

- **Exemplo**: Um DID Document hibrido teria:
```json
{
  "verificationMethod": [
    {"type": "Ed25519VerificationKey2020", "publicKeyMultibase": "z6Mk..."},
    {"type": "ML-DSA-65VerificationKey", "publicKeyMultibase": "zML..."}
  ]
}
```

---

## Conclusao
Nesta aula, exploramos a ameaca quantica a criptografia atual e os esquemas pos-quanticos baseados em reticulados que serao usados para proteger identidade descentralizada no futuro. Dilithium (ML-DSA) oferece implementacao robusta com verificacao rapida, enquanto Falcon (FN-DSA) oferece assinaturas menores ao custo de complexidade de implementacao. A migracao para PQC e inevitavel e deve comecar agora, usando abordagens hibridas e garantindo agilidade criptografica nos sistemas DID/VC.

---

## Licao de Casa
1. Usando a biblioteca `liboqs` (Open Quantum Safe) em Python ou C, gere um par de chaves ML-DSA-65, assine uma mensagem e verifique a assinatura. Compare o tempo e tamanho com Ed25519.
2. Projete um DID Document hibrido que suporte simultaneamente Ed25519 e ML-DSA-65, garantindo que verificadores legados (que nao suportam PQC) ainda consigam validar.
3. Calcule o impacto no armazenamento de uma blockchain de DIDs se todas as chaves migrarem de Ed25519 para ML-DSA-87: considerando 1 milhao de DIDs, qual o aumento total em bytes?

---

## Proxima Aula
Na proxima aula, vamos explorar os desafios de privacidade em sistemas de identidade descentralizada, focando em problemas de correlacionabilidade e rastreamento que persistem mesmo com as tecnicas criptograficas avancadas que estudamos neste modulo. Ate la!

---

## Questionario

**1. Qual algoritmo quantico ameaca diretamente ECDSA e EdDSA?**
a) Algoritmo de Grover
b) Algoritmo de Shor
c) Algoritmo de Deutsch-Jozsa
d) Algoritmo de Bernstein-Vazirani
**Resposta: b**

**2. Qual problema computacional fundamenta a seguranca do Dilithium (ML-DSA)?**
a) Fatoracao de inteiros grandes
b) Logaritmo discreto em curvas elipticas
c) Module-LWE (Learning With Errors sobre reticulados modulares)
d) Fatoracao de polinomios sobre corpos finitos
**Resposta: c**

**3. Qual e a principal vantagem do Falcon (FN-DSA) sobre o Dilithium (ML-DSA)?**
a) Implementacao mais simples e segura
b) Assinaturas significativamente menores
c) Nao requer operacoes de ponto flutuante
d) Resistencia superior a side-channel attacks
**Resposta: b**

**4. O que e a estrategia "Harvest Now, Decrypt Later"?**
a) Encriptar dados com multiplos algoritmos simultaneamente
b) Capturar dados encriptados hoje para quebra-los com computacao quantica futura
c) Migrar imediatamente todos os sistemas para PQC
d) Destruir dados antigos antes da era quantica
**Resposta: b**

**5. Qual abordagem permite migracao gradual de DID Documents para criptografia pos-quantica?**
a) Revogar todos os DIDs e reemitir com PQC
b) Abordagem hibrida com assinaturas duplas (classica + pos-quantica) e rotacao de chaves
c) Usar apenas funcoes hash como mecanismo de assinatura
d) Aumentar o tamanho das chaves Ed25519 para 512 bits
**Resposta: b**
