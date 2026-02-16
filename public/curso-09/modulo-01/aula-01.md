# Aula 1.1: Padroes W3C: DID Core e Modelo de Dados de Credenciais Verificaveis

## Abertura
Bem-vindo a aula 1.1! Nesta aula, vamos mergulhar nos padroes tecnicos que sustentam a identidade descentralizada. O W3C (World Wide Web Consortium) e a organizacao responsavel por definir as especificacoes que garantem interoperabilidade entre diferentes sistemas de identidade descentralizada. Sem esses padroes, cada implementacao seria uma ilha isolada, incapaz de se comunicar com outras.

### Programa da aula:
1. O papel do W3C na padronizacao da identidade descentralizada (introducao)
2. DID Core: estrutura, metodos e resolucao (base e aprofundamento)
3. Modelo de Dados de Credenciais Verificaveis (Conceito principal da aula)

---

## 1. O papel do W3C na padronizacao da identidade descentralizada
### O que e o W3C e por que ele importa
O World Wide Web Consortium (W3C) e um consorcio internacional que desenvolve padroes abertos para a web. Fundado por Tim Berners-Lee em 1994, o W3C ja produziu especificacoes fundamentais como HTML, CSS e XML. No contexto de identidade descentralizada, o W3C criou dois grupos de trabalho essenciais: o DID Working Group e o Verifiable Credentials Working Group.

A importancia do W3C reside na sua neutralidade. Diferente de uma empresa privada que poderia impor seu proprio formato, o W3C reune membros de diversas organizacoes para construir consenso. Isso garante que os padroes sejam amplamente aceitos e implementaveis por qualquer desenvolvedor ou organizacao.

- **Exemplo**: Assim como o padrao HTML permite que qualquer navegador exiba uma pagina web, o padrao DID Core permite que qualquer sistema resolva e valide um identificador descentralizado, independentemente da tecnologia subjacente.

### Historico da padronizacao
O trabalho formal no W3C comecou em 2019 com a formacao do DID Working Group. Em julho de 2022, a especificacao DID Core atingiu o status de W3C Recommendation, o nivel mais alto de maturidade para um padrao W3C. Ja o modelo de Verifiable Credentials alcancou esse mesmo status em marco de 2022.

- **Exemplo**: O processo de padronizacao do W3C segue etapas rigorosas — Working Draft, Candidate Recommendation, Proposed Recommendation e finalmente W3C Recommendation — cada uma exigindo revisoes tecnicas e consenso da comunidade.

---

## 2. DID Core: estrutura, metodos e resolucao
### Anatomia de um DID
Um DID (Decentralized Identifier) segue uma estrutura sintatica bem definida. O formato basico e: `did:metodo:identificador-especifico`. Cada parte tem uma funcao clara:

- **did**: o esquema URI, sempre fixo como "did"
- **metodo**: indica qual sistema ou rede registra o DID (ex: "web", "key", "ion", "ethr")
- **identificador-especifico**: uma string unica dentro daquele metodo

Por exemplo, `did:web:exemplo.com.br` utiliza o metodo "web" e resolve para um documento hospedado no dominio especificado. Ja `did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK` e um DID autocontido baseado em uma chave publica.

- **Exemplo**: Pense no DID como um numero de telefone universal. O "metodo" seria a operadora (Vivo, Claro, Tim) e o "identificador" seria o numero em si. Qualquer pessoa pode ligar para esse numero, independentemente da operadora.

### DID Document e resolucao
Quando um DID e resolvido, ele retorna um DID Document — um objeto JSON-LD que contem informacoes sobre o sujeito do DID. Os campos principais incluem:

- **id**: o proprio DID
- **verificationMethod**: chaves publicas associadas ao DID, usadas para autenticacao e assinatura
- **authentication**: metodos que o sujeito pode usar para provar controle sobre o DID
- **service**: endpoints de servico, como URLs para troca de mensagens ou acesso a dados

O processo de resolucao funciona assim: dado um DID, um resolvedor (DID Resolver) consulta o registro apropriado (blockchain, rede distribuida, servidor web) e retorna o DID Document correspondente. Existem resolvedores universais que suportam multiplos metodos.

- **Exemplo**: Um DID Document funciona como um cartao de visitas digital. Ele nao contem dados pessoais diretamente, mas indica onde e como voce pode verificar a identidade do portador e se comunicar com ele.

### Metodos DID mais relevantes
Existem dezenas de metodos DID registrados. Os mais utilizados incluem:

- **did:web** — resolve para documentos hospedados em servidores web tradicionais, facil de implementar
- **did:key** — baseado puramente em criptografia, sem necessidade de registro externo
- **did:ion** — utiliza a rede Bitcoin via protocolo Sidetree, desenvolvido pela Microsoft
- **did:ethr** — baseado na blockchain Ethereum
- **did:sov** — utiliza a rede Sovrin, baseada em Hyperledger Indy

---

## 3. Modelo de Dados de Credenciais Verificaveis
### Estrutura de uma Verifiable Credential
Uma Verifiable Credential (VC) e composta por tres partes fundamentais: metadados, claims (declaracoes) e prova. O modelo de dados define como essas partes sao organizadas em um formato padronizado.

Os metadados incluem informacoes como o emissor (issuer), a data de emissao, a data de expiracao e o tipo da credencial. As claims sao pares atributo-valor que representam afirmacoes sobre o sujeito. A prova e uma assinatura digital que garante a integridade e autenticidade da credencial.

- **Exemplo**: Um diploma universitario como VC teria: metadados (emitido pela USP, em 15/03/2025, tipo "DiplomaUniversitario"), claims (nome do aluno, curso "Ciencia da Computacao", data de conclusao) e prova (assinatura digital da universidade).

### O triangulo de confianca
O modelo de Credenciais Verificaveis opera com tres atores principais:

- **Issuer (Emissor)**: a entidade que cria e assina a credencial. Pode ser uma universidade, governo ou empresa.
- **Holder (Portador)**: a pessoa ou entidade que recebe e armazena a credencial em sua carteira digital.
- **Verifier (Verificador)**: quem solicita e valida a credencial apresentada pelo portador.

O fluxo funciona assim: o emissor cria uma VC e a entrega ao portador. O portador armazena em sua wallet. Quando necessario, o portador apresenta a credencial (ou parte dela) ao verificador, que valida a assinatura digital do emissor sem precisar contacta-lo diretamente.

- **Exemplo**: Quando voce apresenta sua carteira de motorista em um bar, o DETRAN e o emissor, voce e o portador e o seguranca e o verificador. Com VCs, o seguranca pode verificar criptograficamente que sua credencial e autentica sem ligar para o DETRAN.

### Verifiable Presentations e divulgacao seletiva
Uma Verifiable Presentation (VP) e um envelope que contem uma ou mais VCs, assinado pelo portador. A VP permite que o portador prove que e o legitimo detentor das credenciais.

A divulgacao seletiva (selective disclosure) e um conceito fundamental: o portador pode revelar apenas os atributos necessarios, sem expor toda a credencial. Tecnologias como BBS+ Signatures e SD-JWT permitem isso nativamente.

- **Exemplo**: Para comprovar que voce tem mais de 18 anos, nao precisa revelar sua data de nascimento exata, nome completo ou endereco. Com divulgacao seletiva, voce apresenta apenas a prova de "maior de 18 anos", derivada da sua credencial de identidade.

---

## Conclusao
Nesta aula, exploramos os dois pilares tecnicos da identidade descentralizada definidos pelo W3C. O padrao DID Core estabelece como identificadores descentralizados sao estruturados, registrados e resolvidos, garantindo que diferentes sistemas possam reconhecer e processar DIDs de forma interoperavel. O Modelo de Dados de Credenciais Verificaveis define como atestados digitais sao criados, apresentados e verificados, formando o triangulo de confianca entre emissores, portadores e verificadores. Juntos, esses padroes formam a base sobre a qual todo o ecossistema de identidade descentralizada e construido.

---

## Licao de Casa
1. Acesse o Universal Resolver (https://dev.uniresolver.io/) e tente resolver pelo menos tres DIDs de metodos diferentes. Anote as diferencas entre os DID Documents retornados.
2. Leia a secao 5 da especificacao DID Core (https://www.w3.org/TR/did-core/) e identifique quais propriedades do DID Document sao obrigatorias e quais sao opcionais.
3. Crie um exemplo ficticio de Verifiable Credential para um cenario real brasileiro (ex: comprovante de vacinacao, diploma, certidao de nascimento) seguindo a estrutura JSON do modelo de dados do W3C.

---

## Proxima Aula
Na proxima aula, vamos conhecer as principais organizacoes que impulsionam o ecossistema de identidade descentralizada: a DIF (Decentralized Identity Foundation), a ToIP (Trust Over IP) e o projeto Hyperledger com seus frameworks Indy e Aries. Voce vai entender como essas organizacoes colaboram para transformar padroes em solucoes praticas. Ate la!

---

## Questionario

**1. Qual e o formato basico de um DID conforme a especificacao DID Core?**
a) identificador:metodo:did
b) did:metodo:identificador-especifico
c) metodo://did/identificador
d) urn:did:metodo:identificador
**Resposta: b**

**2. O que um DID Document contem?**
a) Dados pessoais do usuario, como nome e CPF
b) O historico completo de transacoes do usuario
c) Chaves publicas, metodos de autenticacao e endpoints de servico
d) Senhas criptografadas do usuario
**Resposta: c**

**3. No modelo de Credenciais Verificaveis, quem e responsavel por criar e assinar a credencial?**
a) O Holder (Portador)
b) O Verifier (Verificador)
c) O Issuer (Emissor)
d) O DID Resolver
**Resposta: c**

**4. O que e divulgacao seletiva (selective disclosure)?**
a) A capacidade do emissor de escolher quais credenciais emitir
b) A capacidade do portador de revelar apenas atributos especificos de uma credencial
c) A capacidade do verificador de acessar todos os dados do portador
d) A capacidade do sistema de selecionar automaticamente quais dados compartilhar
**Resposta: b**

**5. Qual metodo DID utiliza a rede Bitcoin como camada de ancoragem?**
a) did:web
b) did:ethr
c) did:ion
d) did:key
**Resposta: c**
