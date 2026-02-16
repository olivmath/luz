# Aula 2.1: Zero-Knowledge Proofs (ZKPs): conceitos, zk-SNARKs, zk-STARKs

## Abertura
Bem-vindo a aula 2.1! Neste modulo sobre Criptografia Avancada e Privacidade, comecamos pelo tema mais transformador para identidade descentralizada: as provas de conhecimento zero (Zero-Knowledge Proofs). ZKPs permitem que um provador demonstre a veracidade de uma afirmacao sem revelar qualquer informacao alem da propria veracidade. Essa propriedade e fundamental para sistemas de identidade que respeitam a privacidade do usuario.

### Programa da aula:
1. Fundamentos de Zero-Knowledge Proofs (introducao)
2. zk-SNARKs: teoria e aplicacoes (base e aprofundamento)
3. zk-STARKs: escalabilidade e transparencia (Conceito principal da aula)

---

## 1. Fundamentos de Zero-Knowledge Proofs
### O que sao ZKPs
Uma Zero-Knowledge Proof e um protocolo criptografico entre duas partes — o **Prover** (provador) e o **Verifier** (verificador) — onde o provador convence o verificador de que uma afirmacao e verdadeira sem revelar nenhuma informacao adicional. Para ser considerada uma ZKP valida, o protocolo deve satisfazer tres propriedades fundamentais:

- **Completude (Completeness)**: se a afirmacao e verdadeira, um provador honesto sempre convencera o verificador.
- **Solidez (Soundness)**: se a afirmacao e falsa, nenhum provador desonesto consegue convencer o verificador, exceto com probabilidade negligenciavel.
- **Zero-Knowledge**: o verificador nao aprende nada alem do fato de que a afirmacao e verdadeira.

- **Exemplo**: Alice quer provar que conhece a senha de uma conta sem revelar a senha. Com uma ZKP, ela pode gerar uma prova matematica que demonstra conhecimento da senha, e Bob (verificador) pode validar essa prova sem nunca ver a senha real.

### ZKPs interativas vs. nao-interativas
No modelo classico, ZKPs sao **interativas**: o verificador envia desafios aleatorios ao provador, que responde. Isso requer multiplas rodadas de comunicacao. A transformacao de **Fiat-Shamir** converte protocolos interativos em nao-interativos, substituindo os desafios aleatorios por hashes criptograficos derivados do proprio enunciado e do comprometimento do provador.

- **Exemplo**: Em identidade descentralizada, provas nao-interativas sao essenciais porque a verificacao ocorre off-line ou on-chain, sem necessidade de comunicacao em tempo real entre holder e verifier.

No contexto de DIDs e Verifiable Credentials, o holder gera uma prova nao-interativa a partir de suas credenciais e a apresenta ao verifier, que pode valida-la independentemente usando a chave publica do issuer.

---

## 2. zk-SNARKs: teoria e aplicacoes
### Arquitetura dos zk-SNARKs
**zk-SNARK** significa *Zero-Knowledge Succinct Non-Interactive Argument of Knowledge*. Cada termo e relevante:

- **Succinct**: a prova e extremamente pequena (tipicamente ~200 bytes) e a verificacao e rapida (milissegundos), independentemente da complexidade da computacao original.
- **Non-Interactive**: nao requer comunicacao ida-e-volta entre provador e verificador.
- **Argument of Knowledge**: garante que o provador realmente conhece o "witness" (testemunha) — a informacao secreta que satisfaz a afirmacao.

O pipeline de construcao de um zk-SNARK envolve:
1. **Aritmetizacao**: converter a computacao em um circuito aritmetico (sistema de restricoes R1CS).
2. **Polinomializacao**: transformar R1CS em QAP (Quadratic Arithmetic Program).
3. **Setup de confianca (Trusted Setup)**: gerar parametros publicos (CRS — Common Reference String) a partir de um segredo que deve ser destruido ("toxic waste").
4. **Geracao de prova**: o provador usa o witness e o CRS para gerar a prova.
5. **Verificacao**: o verificador usa a prova, o enunciado publico e o CRS para aceitar ou rejeitar.

- **Exemplo**: Em um sistema de identidade, o circuito aritmetico pode codificar: "Eu possuo uma credencial assinada pelo emissor X, e o campo 'data_nascimento' implica que tenho mais de 18 anos". O zk-SNARK prova isso sem revelar a data de nascimento nem outros campos.

### Trusted Setup e suas implicacoes
O **Trusted Setup** e a principal fraqueza dos zk-SNARKs. Se o segredo usado na geracao do CRS nao for destruido, um atacante pode forjar provas falsas. Para mitigar isso, utilizam-se **cerimonias multi-party computation (MPC)** onde multiplos participantes contribuem com aleatoriedade — basta que um unico participante seja honesto para que o setup seja seguro.

Protocolos como **Groth16** exigem um trusted setup por circuito. Ja sistemas como **PLONK** e **Marlin** usam um **universal trusted setup**: um unico setup serve para qualquer circuito ate um tamanho maximo, reduzindo drasticamente a carga operacional.

- **Exemplo**: O Zcash realizou a "Powers of Tau Ceremony" com centenas de participantes para gerar o CRS de seu protocolo Sapling, garantindo que pelo menos um participante honesto invalidasse o "toxic waste".

---

## 3. zk-STARKs: escalabilidade e transparencia
### Arquitetura dos zk-STARKs
**zk-STARK** significa *Zero-Knowledge Scalable Transparent Argument of Knowledge*. As diferencas fundamentais em relacao aos SNARKs sao:

- **Transparent**: nao requer trusted setup. Os parametros publicos sao derivados de aleatoriedade publica (hashes), eliminando o risco de "toxic waste".
- **Scalable**: o tempo de geracao de prova escala quase linearmente — O(n * log(n)) — com o tamanho da computacao, enquanto SNARKs podem ter complexidade maior.

A construcao de STARKs baseia-se em:
1. **Aritmetizacao via AIR (Algebraic Intermediate Representation)**: a computacao e expressa como uma trace de execucao com restricoes polinomiais.
2. **Compromisso polinomial via FRI (Fast Reed-Solomon Interactive Oracle Proof)**: protocolo que verifica que um polinomio tem grau baixo, usando apenas funcoes hash (sem curvas elipticas).
3. **Transformacao Fiat-Shamir**: torna o protocolo nao-interativo.

- **Exemplo**: STARKs sao a base do StarkNet e do sistema de provas do zkSync Era (que combina STARKs e SNARKs). No contexto de identidade, STARKs podem provar execucoes complexas como "esta credencial foi revogada em um acumulador criptografico e eu provo que a minha NAO foi".

### Comparacao tecnica: SNARKs vs STARKs
| Propriedade | zk-SNARKs | zk-STARKs |
|---|---|---|
| Trusted Setup | Sim (exceto PLONK universal) | Nao |
| Tamanho da prova | ~200 bytes (Groth16) | ~50-200 KB |
| Tempo de verificacao | ~5 ms | ~50-100 ms |
| Premissas criptograficas | Curvas elipticas (pairing) | Funcoes hash (collision-resistant) |
| Resistencia pos-quantica | Nao (vulneravel a Shor) | Sim (baseado em hashes) |
| Escalabilidade do prover | Moderada | Alta (quase linear) |

Para identidade descentralizada, a escolha depende do cenario:
- **SNARKs** sao preferidos quando o tamanho da prova e critico (ex.: armazenamento on-chain, apresentacoes via QR code).
- **STARKs** sao preferidos quando transparencia e resistencia pos-quantica sao prioridades, e o tamanho da prova e toleravel.

- **Exemplo**: Um wallet de identidade movel pode preferir SNARKs pela compactacao da prova. Ja um sistema governamental de longo prazo pode preferir STARKs pela seguranca pos-quantica e ausencia de trusted setup.

---

## Conclusao
Nesta aula, exploramos os fundamentos das Zero-Knowledge Proofs e suas duas principais familias de construcao: zk-SNARKs e zk-STARKs. Vimos que SNARKs oferecem provas extremamente compactas ao custo de um trusted setup e vulnerabilidade quantica, enquanto STARKs eliminam essas limitacoes ao custo de provas maiores. Ambas as tecnologias sao pilares para construir sistemas de identidade descentralizada que respeitam a privacidade, permitindo verificacoes sem exposicao de dados pessoais.

---

## Licao de Casa
1. Implemente um circuito simples em Circom que verifica se um numero secreto esta dentro de um intervalo (ex.: idade >= 18) e gere/verifique uma prova com snarkjs.
2. Compare o tamanho da prova e o tempo de verificacao entre Groth16 e PLONK para o mesmo circuito usando a biblioteca snarkjs.
3. Pesquise a cerimonia "Powers of Tau" do Zcash e documente quantos participantes contribuiram e como a seguranca e garantida mesmo que apenas um seja honesto.

---

## Proxima Aula
Na proxima aula, vamos explorar a divulgacao seletiva (selective disclosure) e predicados, entendendo como um holder pode revelar apenas atributos especificos de uma credencial ou provar condicoes sobre eles (como "maior de idade") sem expor o valor real. Ate la!

---

## Questionario

**1. Quais sao as tres propriedades fundamentais de uma Zero-Knowledge Proof?**
a) Confidencialidade, integridade e disponibilidade
b) Completude, solidez e zero-knowledge
c) Autenticacao, autorizacao e auditoria
d) Encriptacao, assinatura e hash
**Resposta: b**

**2. Qual e a principal desvantagem dos zk-SNARKs em relacao aos zk-STARKs?**
a) SNARKs geram provas maiores
b) SNARKs sao mais lentos na verificacao
c) SNARKs requerem um trusted setup e sao vulneraveis a computacao quantica
d) SNARKs nao suportam provas nao-interativas
**Resposta: c**

**3. O que a transformacao de Fiat-Shamir faz em um protocolo ZKP?**
a) Adiciona uma camada de encriptacao simetrica
b) Converte um protocolo interativo em nao-interativo usando hashes
c) Elimina a necessidade de funcoes hash
d) Aumenta o numero de rodadas de comunicacao
**Resposta: b**

**4. No pipeline de construcao de um zk-SNARK, o que e o "toxic waste"?**
a) Dados residuais da verificacao de provas
b) O segredo usado no trusted setup que deve ser destruido para garantir seguranca
c) Provas invalidas que foram rejeitadas pelo verificador
d) Metadados de identificacao do provador
**Resposta: b**

**5. Por que zk-STARKs sao considerados resistentes a computacao quantica?**
a) Porque usam chaves de 4096 bits
b) Porque sao baseados em funcoes hash (collision-resistant) e nao em curvas elipticas
c) Porque exigem trusted setup com entropia quantica
d) Porque usam algoritmos de encriptacao simetrica pos-quantica
**Resposta: b**
