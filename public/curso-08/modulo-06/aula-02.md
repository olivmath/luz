# Aula 6.2: Divulgacao seletiva (selective disclosure) e predicados

## Abertura
Bem-vindo a aula 6.2! Na aula anterior, vimos como Zero-Knowledge Proofs permitem provar afirmacoes sem revelar informacoes subjacentes. Agora, aplicamos esse conceito diretamente ao ecossistema de Verifiable Credentials: a divulgacao seletiva permite que o holder revele apenas os atributos necessarios de uma credencial, enquanto predicados permitem provar condicoes sobre atributos sem expor seus valores reais. Essas tecnicas sao a espinha dorsal da privacidade em identidade descentralizada.

### Programa da aula:
1. Divulgacao seletiva: principios e mecanismos (introducao)
2. Tecnicas criptograficas para selective disclosure (base e aprofundamento)
3. Predicados e provas derivadas (Conceito principal da aula)

---

## 1. Divulgacao seletiva: principios e mecanismos
### O problema da sobre-exposicao de dados
Em sistemas tradicionais de identidade, a verificacao de um atributo frequentemente exige a exposicao de todo o documento. Para provar que voce tem mais de 18 anos, voce apresenta um documento que contem nome completo, CPF, endereco, foto e data de nascimento. Isso viola o principio de **minimizacao de dados** (data minimization) previsto no GDPR e na LGPD.

A divulgacao seletiva resolve esse problema permitindo que o holder escolha quais atributos de uma credencial serao revelados em uma apresentacao (Verifiable Presentation). O verifier recebe apenas os campos necessarios, e a prova criptografica garante que esses campos sao autenticos e nao foram adulterados.

- **Exemplo**: Uma credencial de identidade contem: nome, data_nascimento, CPF, endereco, foto. Para acessar um servico que exige apenas confirmacao de maioridade e nome, o holder revela somente esses dois campos — ou, melhor ainda, revela o nome e prova via predicado que idade >= 18.

### Modelos de divulgacao seletiva
Existem dois modelos principais para implementar selective disclosure:

1. **Atomic Credentials**: cada atributo e emitido como uma credencial separada. O holder seleciona quais credenciais apresentar. Simples, mas gera overhead no gerenciamento de multiplas credenciais.

2. **Derivacao criptografica**: uma unica credencial contem todos os atributos, mas mecanismos criptograficos permitem revelar subconjuntos. Mais eficiente e elegante, mas requer criptografia mais sofisticada.

- **Exemplo**: No modelo atomico, o issuer emite uma VC para "nome", outra para "data_nascimento", outra para "endereco". No modelo de derivacao, o issuer emite uma unica VC com todos os campos, e o holder gera uma prova derivada que expoe apenas os campos escolhidos.

---

## 2. Tecnicas criptograficas para selective disclosure
### SD-JWT (Selective Disclosure JWT)
O **SD-JWT** (RFC em desenvolvimento no IETF) e uma extensao do formato JWT que permite divulgacao seletiva sem criptografia avancada. O mecanismo funciona assim:

1. O issuer cria um JWT onde cada atributo seletivo e substituido por um hash (digest) no payload.
2. Os valores reais sao fornecidos como **disclosures** separados — pares (salt, atributo, valor) codificados em Base64.
3. O holder escolhe quais disclosures incluir na apresentacao.
4. O verifier recalcula os hashes dos disclosures recebidos e verifica que correspondem aos digests no JWT assinado.

Estrutura de um SD-JWT:
```
<issuer-signed-JWT>~<disclosure1>~<disclosure2>~<holder-binding-JWT>
```

- **Exemplo**: O JWT contem `{"_sd": ["hash1", "hash2", "hash3"]}`. O holder inclui apenas `disclosure2` (que contem o nome). O verifier verifica que o hash de `disclosure2` corresponde a `hash2` no JWT, confirmando autenticidade sem ver os outros campos.

### Merkle Trees para selective disclosure
Uma abordagem alternativa usa **Merkle Trees**: cada atributo da credencial e uma folha da arvore. O issuer assina a raiz (Merkle root). Para revelar um subconjunto de atributos, o holder fornece os atributos desejados junto com as **Merkle proofs** (caminhos de hashes) que ligam cada atributo a raiz assinada.

Vantagens:
- O verifier pode confirmar que os atributos revelados fazem parte da credencial original.
- Atributos nao revelados permanecem ocultos (o verifier ve apenas hashes intermediarios).

- **Exemplo**: Uma credencial com 8 atributos forma uma Merkle Tree de profundidade 3. Para revelar 2 atributos, o holder fornece os 2 valores e ~3 hashes por atributo como prova de inclusao, totalizando ~8 hashes em vez de 8 atributos.

---

## 3. Predicados e provas derivadas
### O que sao predicados em Verifiable Credentials
Um **predicado** e uma afirmacao booleana sobre um atributo que pode ser provada sem revelar o valor do atributo. Em vez de revelar `data_nascimento = 1990-05-15`, o holder prova que `idade >= 18` ou `ano_nascimento < 2008`. O verifier recebe apenas o resultado booleano (verdadeiro/falso), nao o valor subjacente.

Predicados sao implementados usando Zero-Knowledge Proofs, onde o circuito codifica a logica da comparacao:
- **Range proofs**: provar que um valor esta dentro de um intervalo (ex.: `18 <= idade <= 120`).
- **Set membership proofs**: provar que um valor pertence a um conjunto (ex.: `nacionalidade IN {Brasil, Portugal, Angola}`).
- **Inequality proofs**: provar relacoes de desigualdade (ex.: `renda > 3000`).

- **Exemplo**: Um bar exige prova de maioridade. O holder apresenta uma ZKP que prova: "Eu possuo uma credencial valida emitida pela autoridade X, e o campo data_nascimento desta credencial implica que minha idade e >= 18 na data de hoje". O bar nao ve a data de nascimento, nem o nome, nem qualquer outro campo.

### Implementacao de predicados com Bulletproofs
**Bulletproofs** sao um tipo de ZKP especialmente eficiente para range proofs. Caracteristicas:

- Nao requerem trusted setup.
- O tamanho da prova e logaritmico em relacao ao tamanho do intervalo: O(log(n)) onde n e o numero de bits do valor.
- Podem ser agregados: multiplos range proofs combinados em uma unica prova compacta.

O protocolo funciona decompondo o valor secreto em bits e provando que cada bit e 0 ou 1, e que a recomposicao satisfaz a restricao desejada. Para um range proof de 64 bits, a prova tem aproximadamente 672 bytes.

- **Exemplo**: Para provar `saldo >= 1000` sem revelar o saldo exato, o holder gera um Bulletproof que demonstra que `saldo - 1000` e um numero nao-negativo representavel em 64 bits. O verifier valida a prova em ~1ms.

### Provas derivadas e unlinkability
Uma **prova derivada (derived proof)** e uma nova prova gerada pelo holder a partir da credencial original. A prova derivada e criptograficamente valida mas nao pode ser correlacionada com a credencial original ou com outras provas derivadas da mesma credencial. Isso garante **unlinkability**: o verifier nao consegue determinar se duas apresentacoes vieram do mesmo holder.

O fluxo completo e:
1. Issuer emite credencial com assinatura CL ou BBS+ para o holder.
2. Holder recebe e armazena a credencial.
3. Para cada apresentacao, o holder gera uma prova derivada unica, selecionando atributos a revelar e predicados a provar.
4. Verifier valida a prova derivada contra a chave publica do issuer.

- **Exemplo**: Alice apresenta prova de maioridade no bar A na segunda-feira e no bar B na terca-feira. Mesmo que os bares compartilhem dados, nao conseguem determinar que as duas provas vieram da mesma pessoa, pois cada prova derivada e unica e nao-correlacionavel.

---

## Conclusao
Nesta aula, exploramos como a divulgacao seletiva e os predicados transformam Verifiable Credentials em instrumentos que respeitam a privacidade. Vimos mecanismos como SD-JWT e Merkle Trees para selective disclosure, e Bulletproofs para range proofs. A combinacao dessas tecnicas permite que holders revelem o minimo necessario, provem condicoes sobre seus atributos sem expor valores, e facam tudo isso de forma nao-correlacionavel entre diferentes apresentacoes.

---

## Licao de Casa
1. Implemente um SD-JWT simples em Python ou JavaScript: crie um JWT com 5 atributos seletivos, gere as disclosures e simule uma apresentacao com apenas 2 atributos revelados.
2. Pesquise a especificacao SD-JWT do IETF (draft-ietf-oauth-selective-disclosure-jwt) e documente como o holder binding funciona para prevenir replay attacks.
3. Usando a biblioteca bulletproofs-rs (Rust) ou equivalente, implemente um range proof que prove que um valor secreto esta entre 18 e 120 sem revela-lo.

---

## Proxima Aula
Na proxima aula, vamos mergulhar nas assinaturas BBS+ e no framework AnonCreds do Hyperledger Indy, que combinam divulgacao seletiva, predicados e unlinkability em um sistema completo e amplamente adotado para identidade descentralizada. Ate la!

---

## Questionario

**1. Qual e o principio fundamental que a divulgacao seletiva implementa?**
a) Disponibilidade maxima de dados
b) Minimizacao de dados (data minimization)
c) Redundancia de informacoes
d) Centralizacao de credenciais
**Resposta: b**

**2. No SD-JWT, como os atributos seletivos sao protegidos no payload do JWT?**
a) Sao encriptados com AES-256
b) Sao substituidos por hashes (digests) dos valores reais
c) Sao removidos completamente do JWT
d) Sao codificados em Base58
**Resposta: b**

**3. O que e um predicado no contexto de Verifiable Credentials?**
a) Uma assinatura digital do issuer
b) Uma afirmacao booleana sobre um atributo que pode ser provada sem revelar o valor
c) Um campo obrigatorio em toda credencial
d) Um identificador unico do holder
**Resposta: b**

**4. Qual e a principal vantagem dos Bulletproofs para range proofs?**
a) Requerem trusted setup mas geram provas menores
b) Nao requerem trusted setup e o tamanho da prova e logaritmico
c) Sao mais rapidos que verificacao de assinatura RSA
d) Funcionam apenas com curvas elipticas pos-quanticas
**Resposta: b**

**5. O que garante a propriedade de "unlinkability" em provas derivadas?**
a) O uso de timestamps aleatorios
b) Cada prova derivada e unica e nao pode ser correlacionada com outras provas da mesma credencial
c) O verifier recebe a credencial original encriptada
d) O issuer gera uma nova credencial para cada apresentacao
**Resposta: b**
