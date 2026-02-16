# Aula 3.1: Modelos de ameaca: DID hijacking, ataques a chaves, Sybil, grinding attacks

## Abertura
Bem-vindo a aula 3.1! Nesta aula, vamos mergulhar nos modelos de ameaca que afetam sistemas de identidade descentralizada. Compreender como atacantes exploram vulnerabilidades em DIDs, chaves criptograficas e protocolos de registro e essencial para projetar arquiteturas resilientes. Vamos analisar vetores de ataque reais, entender suas mecanicas e discutir estrategias de mitigacao fundamentadas em criptografia aplicada.

### Programa da aula:
1. DID hijacking e comprometimento de identidade (introducao)
2. Ataques a chaves criptograficas e infraestrutura de assinatura (base e aprofundamento)
3. Ataques Sybil e grinding em redes de identidade descentralizada (Conceito principal da aula)

---

## 1. DID hijacking e comprometimento de identidade
### 1.1 Anatomia do DID hijacking
DID hijacking ocorre quando um atacante assume o controle de um identificador descentralizado, substituindo as chaves publicas associadas no DID Document por chaves sob seu controle. O resultado e que o atacante passa a ser reconhecido como o sujeito legitimo daquele DID, podendo emitir assinaturas, autenticar-se em servicos e revogar credenciais existentes.

O vetor de ataque depende do metodo DID utilizado. Em metodos baseados em blockchain como did:ethr, o atacante precisa obter acesso a chave privada que controla o smart contract do registro ou explorar uma vulnerabilidade no contrato. Em metodos baseados em DNS como did:web, basta comprometer o servidor web ou o registro DNS para alterar o DID Document servido.

A gravidade do hijacking e amplificada pelo fato de que DIDs funcionam como raiz de confianca. Uma vez comprometido o DID, todas as credenciais verificaveis emitidas por aquele sujeito e todas as conexoes DIDComm estabelecidas ficam sob controle do atacante.

- **Exemplo**: Um atacante que compromete o dominio de uma universidade pode alterar o DID Document de did:web:universidade.edu.br, substituindo a chave publica. A partir desse momento, o atacante pode emitir diplomas falsos que serao verificados como autenticos por qualquer verificador que resolva aquele DID.

### 1.2 Vetores de ataque em diferentes metodos DID
Cada metodo DID possui superficies de ataque distintas. Em did:key e did:pkh, o DID e derivado diretamente da chave publica, o que significa que nao existe hijacking no sentido classico, pois nao ha registro mutavel. Porem, o comprometimento da chave privada correspondente e equivalente ao hijacking.

Em did:ion e did:sidetree, o modelo DPKI (Decentralized Public Key Infrastructure) utiliza operacoes ancoradas em blockchain. O hijacking requer acesso a recovery key, que tem precedencia sobre a update key na hierarquia de controle. Isso cria um modelo de seguranca em camadas onde a recovery key deve ser armazenada com o mais alto nivel de protecao.

Para did:peer, usado em comunicacoes ponto-a-ponto, o hijacking e limitado ao escopo da relacao bilateral. No entanto, um ataque man-in-the-middle durante o estabelecimento inicial da conexao pode resultar em hijacking permanente daquela relacao.

- **Exemplo**: No metodo did:ion, um DID Document e controlado por duas chaves hierarquicas: update key e recovery key. Se um atacante obtem a update key, ele pode modificar o documento. Porem, o titular legitimo pode usar a recovery key para reverter as alteracoes. Se o atacante obtem a recovery key, o controle e total e irreversivel.

---

## 2. Ataques a chaves criptograficas e infraestrutura de assinatura
### 2.1 Comprometimento de chaves privadas
O comprometimento de chaves privadas e o vetor de ataque mais direto e devastador em sistemas de identidade descentralizada. Diferente de sistemas centralizados onde uma autoridade pode revogar e reemitir credenciais, em sistemas descentralizados a chave privada e frequentemente a unica prova de controle sobre a identidade.

Os metodos de comprometimento incluem: extracao de memoria via cold boot attacks, side-channel attacks em implementacoes criptograficas defeituosas, keyloggers e malware direcionado, engenharia social para obtencao de seed phrases, e ataques a geradores de numeros aleatorios (RNG) fracos.

Um problema particularmente grave e o uso de entropia insuficiente na geracao de chaves. Se o espaco de entropia for pequeno o suficiente, um atacante pode enumerar todas as chaves possiveis e verificar quais correspondem a DIDs registrados com saldo ou credenciais valiosas.

- **Exemplo**: Em 2023, uma vulnerabilidade em uma biblioteca JavaScript de geracao de carteiras foi descoberta onde o PRNG (Pseudo-Random Number Generator) utilizava apenas 32 bits de entropia em vez de 256. Isso reduziu o espaco de chaves de 2^256 para 2^32, permitindo que atacantes gerassem todas as chaves possiveis em poucas horas e drenassem fundos de carteiras afetadas.

### 2.2 Ataques a esquemas de assinatura
Alem do comprometimento direto de chaves, existem ataques sofisticados aos proprios esquemas de assinatura utilizados em credenciais verificaveis. Ataques de reutilizacao de assinatura (signature malleability) permitem que um atacante modifique uma assinatura valida sem invalidar sua verificacao, potencialmente alterando o conteudo assinado.

Em esquemas baseados em BBS+ (usados para selective disclosure e zero-knowledge proofs em credenciais), ataques especificos incluem: linking attacks que correlacionam apresentacoes supostamente nao-vinculaveis, e ataques ao protocolo de prova que exploram implementacoes incorretas do compromisso de Pedersen.

Para assinaturas EdDSA (Ed25519), comumente usadas em DID Documents, o risco principal e o reuso de nonce. Se o mesmo nonce for utilizado para assinar duas mensagens diferentes com a mesma chave privada, um atacante pode derivar a chave privada algebricamente. Implementacoes deterministicas de EdDSA (RFC 8032) mitigam esse risco, mas implementacoes customizadas podem reintroduzir a vulnerabilidade.

- **Exemplo**: Um verificador malicioso recebe uma credencial verificavel com assinatura BBS+ e selective disclosure. Se a implementacao do holder nao randomizar adequadamente os blinding factors durante a geracao da prova, o verificador pode correlacionar multiplas apresentacoes da mesma credencial, quebrando a propriedade de unlinkability que deveria proteger a privacidade do titular.

### 2.3 Ataques a derivacao de chaves e HD wallets
Carteiras de identidade descentralizada frequentemente utilizam derivacao hierarquica de chaves (BIP-32/BIP-44) para gerar multiplas chaves a partir de uma unica seed. Ataques a esse mecanismo incluem: comprometimento da master seed (que expoe todas as chaves derivadas), ataques a funcao de derivacao (HMAC-SHA512), e exploracao de caminhos de derivacao previsiveis.

Um risco especifico em carteiras de identidade e a correlacao de chaves. Se um atacante consegue determinar que duas chaves publicas foram derivadas da mesma seed, ele pode vincular identidades que deveriam ser independentes, comprometendo a privacidade do usuario mesmo sem obter a chave privada.

- **Exemplo**: Uma carteira de identidade utiliza o caminho de derivacao m/44'/0'/0'/0/n para DIDs e m/44'/0'/0'/1/n para chaves de autenticacao. Se um atacante observa padroes temporais nas transacoes on-chain de ambas as chaves, ele pode aplicar analise de heuristicas para determinar que pertencem ao mesmo usuario, correlacionando identidades supostamente independentes.

---

## 3. Ataques Sybil e grinding em redes de identidade descentralizada
### 3.1 Ataques Sybil em sistemas de reputacao e confianca
O ataque Sybil consiste na criacao de multiplas identidades falsas por um unico agente para obter influencia desproporcional em um sistema. Em redes de identidade descentralizada, onde a criacao de DIDs e tipicamente gratuita e sem permissao, esse ataque e particularmente relevante.

Em sistemas de reputacao descentralizada, um atacante Sybil pode criar centenas de DIDs, emitir credenciais de reputacao cruzada entre eles e inflar artificialmente a confiabilidade de uma identidade principal. Isso compromete qualquer mecanismo de web-of-trust que dependa de atestacoes entre pares.

A mitigacao classica envolve Proof of Personhood (prova de humanidade unica), que pode ser implementada via biometria descentralizada, verificacao social (vouching com penalidades), ou mecanismos economicos como staking. Cada abordagem apresenta trade-offs entre resistencia a Sybil, privacidade e acessibilidade.

- **Exemplo**: Em uma rede de credenciais profissionais descentralizada, um atacante cria 500 DIDs simulando empregadores ficticios. Cada DID emite credenciais de experiencia profissional para o DID principal do atacante. Um recrutador que verifica essas credenciais ve centenas de atestacoes independentes, sem perceber que todas foram geradas pelo mesmo agente.

### 3.2 Grinding attacks em registros de identidade
Grinding attacks exploram processos computacionais em registros de identidade para obter vantagens especificas. Em sistemas onde o DID e derivado de um hash ou onde existe alguma propriedade desejavel no identificador resultante, o atacante pode gerar milhares de DIDs ate encontrar um com a propriedade desejada.

Em blockchains com proof-of-work para registro de DIDs, o grinding pode ser usado para encontrar colisoes parciais ou DIDs que se assemelham visualmente a DIDs legitimos (ataque de homoglifo). Em sistemas como did:ion, onde operacoes sao agrupadas em batches ancorados em Bitcoin, um atacante pode tentar manipular a ordenacao temporal das operacoes.

Um caso particularmente perigoso e o pre-image grinding em sistemas que utilizam hashes curtos para referencia de credenciais. Se o hash e truncado para facilitar uso humano (por exemplo, primeiros 8 caracteres hexadecimais), o espaco de busca para colisoes cai drasticamente, e o atacante pode criar uma credencial falsa com o mesmo hash curto de uma credencial legitima.

- **Exemplo**: Um sistema de verificacao exibe apenas os primeiros 16 caracteres do hash de uma credencial para conferencia visual. Um atacante gera aproximadamente 2^32 credenciais falsas ate encontrar uma cujo hash coincide nos primeiros 16 caracteres com uma credencial legitima, explorando o paradoxo do aniversario para tornar o ataque computacionalmente viavel.

### 3.3 Ataques de enumeracao e correlacao
Ataques de enumeracao visam descobrir quais DIDs existem em um registro e mapear suas atividades. Em registros baseados em blockchain, todos os DIDs e suas operacoes sao publicamente visiveis, permitindo que atacantes construam grafos de relacionamento entre identidades.

A correlacao temporal e um vetor poderoso: se um DID e criado e imediatamente utilizado para receber uma credencial de uma instituicao especifica, um observador pode inferir a identidade do titular. Ataques de intersecao combinam multiplas observacoes para reduzir progressivamente o conjunto de anonimato.

Metodos DID que operam off-chain (como did:peer e did:key) sao naturalmente resistentes a enumeracao, pois nao deixam rastros publicos. Porem, quando utilizados em conjunto com registros on-chain para ancoragem de revogacao, a protecao parcial pode ser comprometida.

- **Exemplo**: Um atacante monitora o registro publico de um sistema did:ion e observa que um novo DID foi criado as 14:32 de uma segunda-feira. Simultaneamente, ele sabe que a empresa X anunciou a integracao de identidade descentralizada naquele dia. Cruzando dados temporais e contextuais, o atacante pode correlacionar o DID anonimo com a empresa X.

---

## Conclusao
Nesta aula, analisamos os principais modelos de ameaca que afetam sistemas de identidade descentralizada. Vimos como DID hijacking pode comprometer toda a cadeia de confianca de uma identidade, como ataques a chaves criptograficas exploram desde entropia fraca ate vulnerabilidades em esquemas de assinatura, e como ataques Sybil e grinding minam a integridade de redes de reputacao e registros de identidade. A compreensao desses vetores de ataque e pre-requisito para a implementacao de contramedidas eficazes, que exploraremos na proxima aula.

---

## Licao de Casa
1. Analise o DID Document de um metodo DID de sua escolha e identifique pelo menos tres vetores de ataque especificos a estrutura daquele documento, classificando cada um por severidade (critico, alto, medio, baixo).
2. Implemente um script que demonstre o ataque de recuperacao de chave privada Ed25519 a partir de reuso de nonce, utilizando duas assinaturas sobre mensagens distintas com o mesmo nonce e a mesma chave.
3. Projete um mecanismo de resistencia a Sybil para uma rede de credenciais profissionais descentralizada que equilibre privacidade, acessibilidade e seguranca. Documente os trade-offs da sua abordagem.

---

## Proxima Aula
Na proxima aula, vamos explorar as boas praticas de seguranca para proteger identidades descentralizadas, incluindo rotacao de chaves, esquemas multisig e assinaturas limiares. Veremos como essas tecnicas mitigam os ataques que estudamos hoje. Ate la!

---

## Questionario

**1. Qual e a consequencia principal de um DID hijacking bem-sucedido?**
a) O atacante obtem acesso ao saldo da carteira do usuario
b) O atacante assume o controle total da identidade, podendo assinar, autenticar e revogar credenciais em nome do titular
c) O atacante consegue ler mensagens criptografadas anteriores
d) O atacante pode criar novos metodos DID no registro
**Resposta: b**

**2. Em um sistema did:ion, qual chave tem precedencia para recuperacao de controle de um DID comprometido?**
a) A update key, pois e a chave de uso mais frequente
b) A authentication key listada no DID Document
c) A recovery key, que tem precedencia hierarquica sobre a update key
d) A chave publica do minerador que ancorou a transacao
**Resposta: c**

**3. Como um atacante pode derivar a chave privada Ed25519 de um titular?**
a) Aplicando forca bruta sobre o espaco de chaves de 256 bits
b) Explorando o reuso de nonce em duas assinaturas diferentes com a mesma chave
c) Revertendo a funcao hash SHA-256 utilizada na derivacao
d) Interceptando a comunicacao TLS entre holder e verificador
**Resposta: b**

**4. Qual e a principal vulnerabilidade que ataques Sybil exploram em redes de identidade descentralizada?**
a) A ausencia de criptografia nas comunicacoes entre nos
b) A possibilidade de criar multiplas identidades sem custo, inflando artificialmente reputacao e influencia
c) A lentidao das transacoes em blockchain
d) A falta de interoperabilidade entre metodos DID
**Resposta: b**

**5. Por que hashes truncados para referencia de credenciais representam um risco de seguranca?**
a) Porque hashes truncados nao podem ser verificados por smart contracts
b) Porque reduzem drasticamente o espaco de busca para colisoes, viabilizando grinding attacks via paradoxo do aniversario
c) Porque hashes truncados invalidam assinaturas BBS+
d) Porque navegadores nao suportam hashes com menos de 256 bits
**Resposta: b**
