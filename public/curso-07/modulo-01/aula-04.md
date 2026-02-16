# Aula 1.4: A camada de identidade que faltava na internet

## Abertura
Bem-vindo a aula 1.4! Nesta aula, vamos entender por que a internet foi construida sem uma camada nativa de identidade e como essa ausencia moldou os problemas que enfrentamos hoje. Veremos como protocolos fundamentais da web ignoraram a questao da identidade, as tentativas de correcao ao longo dos anos e por que agora temos as condicoes tecnicas e sociais para finalmente construir essa camada ausente.

### Programa da aula:
1. A arquitetura original da internet e a ausencia de identidade (introducao)
2. Tentativas historicas de resolver o problema (base e aprofundamento)
3. A nova camada de identidade descentralizada (Conceito principal da aula)

---

## 1. A arquitetura original da internet e a ausencia de identidade

### Como a internet foi projetada
A internet nasceu como um projeto academico e militar nos anos 1960 e 1970. O protocolo TCP/IP, que forma a base da internet, foi projetado para resolver um problema especifico: transmitir pacotes de dados de forma confiavel entre computadores. A preocupacao era com a comunicacao entre maquinas, nao entre pessoas.

Os protocolos fundamentais da internet identificam maquinas por enderecos IP, nao pessoas. Quando voce acessa um site, o servidor sabe que uma maquina com determinado IP fez uma requisicao, mas nao sabe nada sobre quem esta por tras daquela maquina.

- **Exemplo**: O famoso cartoon do New Yorker de 1993 dizia "On the Internet, nobody knows you're a dog" ("Na internet, ninguem sabe que voce e um cachorro"). Essa frase captura perfeitamente a ausencia de uma camada de identidade na arquitetura original da rede.

### As sete camadas do modelo OSI e a identidade ausente
O modelo OSI (Open Systems Interconnection) define sete camadas para comunicacao em rede:

1. Fisica (cabos, sinais eletricos)
2. Enlace de dados (frames, MAC address)
3. Rede (pacotes, enderecos IP)
4. Transporte (TCP, UDP)
5. Sessao (controle de conexoes)
6. Apresentacao (criptografia, formatacao)
7. Aplicacao (HTTP, SMTP, FTP)

Nenhuma dessas camadas lida com identidade de pessoas. A camada de sessao gerencia conexoes entre maquinas, nao sessoes de usuarios. A camada de aplicacao oferece protocolos para transferencia de dados, nao para verificacao de quem esta enviando ou recebendo.

- **Exemplo**: O protocolo HTTP, que sustenta toda a web, e "stateless" — sem estado. Cada requisicao e independente. O servidor nao lembra quem voce e entre uma requisicao e outra. Cookies foram inventados como um "remendo" para contornar essa limitacao, nao como uma solucao real de identidade.

### Consequencias da ausencia de identidade nativa
A falta de uma camada de identidade na arquitetura da internet gerou consequencias profundas:

- **Spam e phishing**: Sem verificacao de identidade, qualquer pessoa pode enviar emails fingindo ser outra.
- **Fraude online**: E trivial criar identidades falsas na internet.
- **Silos de dados**: Cada aplicacao precisou criar seu proprio sistema de identidade.
- **Vigilancia**: Para compensar a falta de identidade, governos e empresas recorreram ao rastreamento massivo.

---

## 2. Tentativas historicas de resolver o problema

### Primeiras solucoes: certificados digitais e PKI
Nos anos 1990, a industria tentou resolver o problema da identidade na internet com a Public Key Infrastructure (PKI). A ideia era criar uma hierarquia de autoridades certificadoras que emitiriam certificados digitais para pessoas e organizacoes.

O SSL/TLS, que protege conexoes HTTPS, e um sucesso da PKI para autenticacao de servidores. Porem, a PKI para pessoas nunca decolou. O processo de obter um certificado pessoal era complexo, caro e pouco amigavel.

- **Exemplo**: O e-CPF e o e-CNPJ no Brasil sao exemplos de certificados digitais pessoais baseados em PKI. Apesar de existirem ha mais de 20 anos, seu uso permanece limitado a nichos especificos como assinatura de documentos fiscais e acesso a sistemas governamentais.

### Identidade social e Web 2.0
Com a explosao das redes sociais nos anos 2000, surgiu uma nova abordagem: usar perfis sociais como identidade. Facebook Connect (2008) e depois o protocolo OAuth permitiram que usuarios usassem suas contas de redes sociais para autenticar em outros servicos.

Essa solucao foi amplamente adotada por ser conveniente, mas como vimos na aula 1.1, criou novos problemas de centralizacao, rastreamento e dependencia.

- **Exemplo**: O botao "Login com Facebook" se tornou onipresente na web. Em seu auge, mais de 7 milhoes de sites e aplicativos usavam o Facebook como provedor de identidade. Isso deu ao Facebook um poder extraordinario sobre o ecossistema digital.

### Blockchain e a semente da identidade descentralizada
O surgimento do Bitcoin em 2009 e do Ethereum em 2015 introduziu um conceito revolucionario: registros verificaveis sem autoridade central. Pela primeira vez, era possivel provar a posse de um ativo digital sem depender de um intermediario.

Essa inovacao plantou a semente para a identidade descentralizada. Se podemos provar a posse de bitcoins sem um banco, por que nao podemos provar nossa identidade sem um governo ou corporacao?

- **Exemplo**: No Bitcoin, voce prova que e dono de fundos usando uma chave privada. Ninguem pode confiscar sua chave ou impedir voce de usa-la. Esse mesmo principio pode ser aplicado a identidade: uma chave privada que prova quem voce e, sem depender de terceiros.

---

## 3. A nova camada de identidade descentralizada

### Os componentes tecnologicos da camada de identidade
A nova camada de identidade descentralizada esta sendo construida sobre tres pilares tecnologicos fundamentais:

**1. Identificadores Descentralizados (DIDs)**: Sao identificadores unicos, globais e persistentes que nao dependem de nenhuma autoridade centralizada. Diferente de um email ou CPF, um DID e criado e controlado pelo proprio usuario.

**2. Credenciais Verificaveis (VCs)**: Sao o equivalente digital de documentos como diplomas, carteiras de motorista ou certidoes. Sao emitidas por entidades confiaveis, armazenadas pelo titular e verificaveis criptograficamente por qualquer pessoa.

**3. Carteiras de Identidade Digital**: Sao aplicativos que permitem ao usuario armazenar, gerenciar e apresentar suas credenciais verificaveis. Funcionam como uma carteira fisica, mas com recursos avancados de privacidade e seguranca.

- **Exemplo**: Uma carteira de identidade digital poderia armazenar seu diploma (emitido pela universidade), sua carteira de motorista (emitida pelo Detran), seu comprovante de vacinacao (emitido pelo SUS) e seu historico profissional (emitido por empregadores anteriores) — tudo sob seu controle.

### Como a camada de identidade se encaixa na internet
A camada de identidade descentralizada nao substitui a infraestrutura existente da internet. Ela se adiciona como uma nova camada sobre os protocolos existentes:

- **Camada de rede (TCP/IP)**: Continua gerenciando a comunicacao entre maquinas.
- **Camada de seguranca (TLS)**: Continua protegendo as conexoes.
- **Camada de identidade (DIDs + VCs)**: Nova camada que permite autenticacao e verificacao de pessoas e organizacoes.
- **Camada de aplicacao**: Aplicacoes que utilizam a camada de identidade para oferecer servicos.

Essa abordagem em camadas garante compatibilidade com a internet existente enquanto adiciona a funcionalidade que sempre faltou.

- **Exemplo**: Hoje, quando voce acessa um site bancario via HTTPS, o TLS garante que voce esta conectado ao servidor correto do banco. Mas o banco nao tem como saber quem voce e sem pedir login e senha. Com a camada de identidade, voce poderia apresentar uma credencial verificavel diretamente, sem senhas.

### O ecossistema emergente
Diversas organizacoes e iniciativas estao construindo essa nova camada de identidade:

- **W3C**: Padronizou as especificacoes de DIDs e Credenciais Verificaveis.
- **Decentralized Identity Foundation (DIF)**: Desenvolve protocolos e bibliotecas open-source.
- **Trust over IP Foundation**: Define frameworks de governanca para identidade descentralizada.
- **Uniao Europeia (eIDAS 2.0)**: Regulamentacao que preve carteiras de identidade digital para 450 milhoes de europeus.
- **Governo brasileiro**: O titulo de eleitor digital e a CNH digital sao passos iniciais nessa direcao, embora ainda sigam um modelo centralizado.

A convergencia de padroes tecnicos maduros, regulamentacoes favoraveis e demanda crescente por privacidade cria as condicoes para que a camada de identidade da internet finalmente se torne realidade.

---

## Conclusao
Nesta aula, compreendemos por que a internet foi construida sem uma camada de identidade e como essa ausencia gerou os problemas que enfrentamos hoje. Vimos as tentativas historicas de resolver o problema — desde PKI ate login social — e por que elas foram insuficientes. Finalmente, exploramos os tres pilares da nova camada de identidade descentralizada: DIDs, Credenciais Verificaveis e Carteiras Digitais. Essa camada esta sendo construida agora e representa a peca que faltava para uma internet verdadeiramente segura e centrada no usuario.

---

## Licao de Casa
1. Pesquise o que e um DID (Decentralized Identifier) e escreva com suas palavras como ele difere de um email ou CPF como identificador.
2. Instale uma carteira de identidade digital experimental (como a Trinsic ou a Lissi) e explore suas funcionalidades. Descreva sua experiencia.
3. Imagine como seria o processo de matricula em uma universidade usando Credenciais Verificaveis. Desenhe o fluxo envolvendo emissor, titular e verificador.

---

## Proxima Aula
Na proxima aula, vamos iniciar o Modulo 2, onde estudaremos em detalhes o que e um DID (Decentralized Identifier) — como ele e estruturado, como funciona tecnicamente e por que e o alicerce de toda a identidade descentralizada. Ate la!

---

## Questionario

**1. Por que a internet original nao possui uma camada nativa de identidade?**
a) Porque a tecnologia de criptografia nao existia
b) Porque os protocolos foram projetados para comunicacao entre maquinas, nao entre pessoas
c) Porque os governos proibiram a identificacao online
d) Porque a internet era usada apenas para jogos
**Resposta: b**

**2. Qual tecnologia foi inventada como um "remendo" para contornar a falta de estado (stateless) do protocolo HTTP?**
a) Blockchain
b) SSL/TLS
c) Cookies
d) DNS
**Resposta: c**

**3. Por que a PKI (Public Key Infrastructure) nao resolveu o problema de identidade para pessoas na internet?**
a) Porque a criptografia era muito fraca
b) Porque o processo de obter certificados pessoais era complexo, caro e pouco amigavel
c) Porque os governos nao permitiam seu uso
d) Porque so funcionava em computadores desktop
**Resposta: b**

**4. Quais sao os tres pilares tecnologicos da nova camada de identidade descentralizada?**
a) Bitcoin, Ethereum e blockchain
b) HTTP, TLS e DNS
c) Identificadores Descentralizados (DIDs), Credenciais Verificaveis (VCs) e Carteiras Digitais
d) Email, senha e autenticacao de dois fatores
**Resposta: c**

**5. Qual organizacao padronizou as especificacoes de DIDs e Credenciais Verificaveis?**
a) IEEE
b) IETF
c) W3C
d) ISO
**Resposta: c**
