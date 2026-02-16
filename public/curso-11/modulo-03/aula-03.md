# Aula 3.3: Comunicacao segura: DIDComm v2, CHAPI, DIF Presentation Exchange

## Abertura
Bem-vindo a aula 3.3! Nesta aula, vamos explorar os protocolos de comunicacao segura que conectam os participantes de ecossistemas de identidade descentralizada. Estudaremos o DIDComm v2 como canal de mensagens autenticado e criptografado, o CHAPI como interface de interacao entre aplicacoes e carteiras, e o DIF Presentation Exchange como protocolo padronizado para solicitacao e apresentacao de credenciais verificaveis.

### Programa da aula:
1. DIDComm v2: mensagens seguras entre agentes de identidade (introducao)
2. CHAPI: Credential Handler API e interacao com carteiras (base e aprofundamento)
3. DIF Presentation Exchange: protocolo de solicitacao e apresentacao de credenciais (Conceito principal da aula)

---

## 1. DIDComm v2: mensagens seguras entre agentes de identidade
### 1.1 Arquitetura e modelo de seguranca do DIDComm v2
O DIDComm v2 e um protocolo de comunicacao ponto-a-ponto desenvolvido pela Decentralized Identity Foundation (DIF) que utiliza DIDs como base para autenticacao e criptografia. Diferente de protocolos tradicionais que dependem de certificados TLS emitidos por autoridades centralizadas, o DIDComm v2 deriva suas garantias de seguranca diretamente dos DID Documents dos participantes.

O modelo de seguranca do DIDComm v2 opera em tres camadas. A camada de roteamento determina como mensagens chegam ao destinatario, suportando mediadores que encaminham mensagens sem ter acesso ao conteudo. A camada de criptografia utiliza JWE (JSON Web Encryption) com algoritmos ECDH-ES ou ECDH-1PU para confidencialidade. A camada de assinatura utiliza JWS (JSON Web Signature) para autenticacao e nao-repudio quando necessario.

Uma propriedade fundamental do DIDComm v2 e a criptografia end-to-end com forward secrecy. Mensagens sao criptografadas para a chave publica do destinatario listada em seu DID Document (keyAgreement), garantindo que apenas o destinatario possa descriptografar. Mediadores na rota veem apenas metadados de roteamento em um envelope externo, sem acesso ao conteudo da mensagem.

- **Exemplo**: Alice (did:peer:alice) envia uma mensagem para Bob (did:peer:bob) atraves de um mediador. Alice resolve o DID Document de Bob, extrai a chave keyAgreement (X25519), criptografa a mensagem interna com ECDH-ES+A256KW, empacota em um envelope de roteamento para o mediador e envia. O mediador descriptografa apenas o envelope de roteamento, encaminha para Bob, e Bob descriptografa a mensagem interna com sua chave privada.

### 1.2 Tipos de mensagem e protocolos DIDComm
O DIDComm v2 define uma estrutura de mensagem padronizada com campos como id, type, from, to, created_time e body. O campo type identifica o protocolo e a mensagem especifica, seguindo um esquema de URI como https://didcomm.org/basicmessage/2.0/message.

Protocolos DIDComm sao conjuntos de mensagens que implementam interacoes especificas. O protocolo Trust Ping verifica conectividade entre agentes. O protocolo Discover Features permite que agentes anunciem suas capacidades. O protocolo Issue Credential implementa o fluxo de emissao de credenciais. O protocolo Present Proof implementa a solicitacao e apresentacao de provas.

Cada protocolo define uma maquina de estados que governa a sequencia valida de mensagens. Agentes devem implementar essas maquinas de estados corretamente para evitar vulnerabilidades como replay attacks (reprocessamento de mensagens antigas) e out-of-order attacks (processamento de mensagens fora de sequencia).

- **Exemplo**: O protocolo Issue Credential v3.0 sobre DIDComm v2 segue o fluxo: (1) o emissor envia propose-credential, (2) o titular responde com request-credential incluindo um binding proof, (3) o emissor valida e envia issue-credential com a credencial assinada, (4) o titular confirma com ack. Cada transicao de estado e validada pelo agente receptor.

---

## 2. CHAPI: Credential Handler API e interacao com carteiras
### 2.1 Arquitetura do CHAPI e o problema da mediacao web
O CHAPI (Credential Handler API) e uma especificacao que resolve um problema fundamental na web: como aplicacoes web (relying parties) interagem com carteiras de credenciais do usuario de forma segura e padronizada, sem depender de extensoes de navegador ou redirecionamentos OAuth.

A arquitetura do CHAPI baseia-se no conceito de Credential Handlers registrados no navegador do usuario. Uma carteira de identidade descentralizada registra-se como um handler capaz de armazenar e apresentar credenciais verificaveis. Quando uma aplicacao web solicita uma credencial, o navegador apresenta ao usuario uma interface de selecao de carteira, similar ao seletor de metodo de pagamento da Payment Request API.

O fluxo CHAPI envolve tres partes: a aplicacao solicitante (verifier), o navegador como mediador confiavel, e a carteira do usuario (holder). A aplicacao chama navigator.credentials.get() com um VerifiablePresentation request. O navegador ativa o Credential Handler registrado, que renderiza uma interface de consentimento na carteira. O usuario seleciona as credenciais e autoriza a apresentacao. A carteira retorna a VerifiablePresentation para a aplicacao.

- **Exemplo**: Um portal de emprego solicita prova de certificacao profissional. O site chama navigator.credentials.get() com o tipo VerifiablePresentation. O navegador mostra ao usuario suas carteiras registradas. O usuario seleciona sua carteira, que exibe a credencial de certificacao solicitada. Apos confirmacao, a carteira gera uma VerifiablePresentation assinada e a retorna ao portal, que verifica a assinatura e a validade da credencial.

### 2.2 Seguranca do CHAPI e modelo de confianca
O modelo de seguranca do CHAPI depende do navegador como mediador confiavel entre aplicacao e carteira. O navegador garante que a aplicacao nao acessa diretamente a carteira, que o usuario sempre tem oportunidade de consentir, e que a carteira nao pode exfiltrar dados da aplicacao.

A protecao contra ataques de phishing e implementada atraves da exibicao clara da origem (dominio) da aplicacao solicitante na interface de selecao. O usuario pode verificar se a solicitacao vem do dominio esperado antes de autorizar a apresentacao. Porem, ataques de homoglifo (dominios visualmente similares) continuam sendo um risco.

O CHAPI utiliza polyfills para funcionar em navegadores que ainda nao implementam a API nativamente. O credential-handler-polyfill injeta a funcionalidade via iframe de um dominio confiavel (credential-handler.localhost ou um dominio operado pela comunidade). Isso introduz uma dependencia de confianca adicional no operador do polyfill, que deve ser considerada na analise de seguranca.

- **Exemplo**: Um atacante registra o dominio banco-d1gital.com.br (com "1" no lugar de "i") e cria uma pagina que solicita credenciais via CHAPI. O navegador exibe corretamente o dominio solicitante na interface de selecao, mas um usuario desatento pode nao notar a diferenca e apresentar suas credenciais ao atacante, que as captura para replay em servicos legitimos.

### 2.3 CHAPI vs outras abordagens de interacao
Existem alternativas ao CHAPI para mediacao entre aplicacoes e carteiras. Deep links e custom URL schemes (como openid-credential-offer://) direcionam o usuario para aplicacoes nativas. A OID4VP (OpenID for Verifiable Presentations) utiliza fluxos OAuth 2.0 adaptados. Protocolos baseados em QR code permitem interacao cross-device.

O CHAPI se diferencia por ser uma API nativa do navegador que nao requer redirecionamentos, nao depende de um servidor de autorizacao central e funciona inteiramente no dispositivo do usuario. Porem, sua adocao e limitada pela necessidade de suporte do navegador e pela complexidade do polyfill.

A tendencia atual aponta para uma convergencia entre essas abordagens. A especificacao Digital Credentials API do W3C esta sendo desenvolvida como evolucao do CHAPI com suporte nativo em navegadores Chromium. Essa API integra conceitos do CHAPI com a infraestrutura existente de gerenciamento de credenciais do navegador.

- **Exemplo**: Em um fluxo OID4VP, o verificador gera um authorization request contendo um presentation_definition. O holder e redirecionado para seu authorization server (carteira), seleciona credenciais, gera uma vp_token e e redirecionado de volta com a resposta. No CHAPI equivalente, nao ha redirecionamento: a carteira abre em um popup mediado pelo navegador e retorna o resultado diretamente.

---

## 3. DIF Presentation Exchange: protocolo de solicitacao e apresentacao de credenciais
### 3.1 Presentation Definition: especificando requisitos de credenciais
O DIF Presentation Exchange (PE) e uma especificacao que define um formato padronizado para verificadores expressarem quais credenciais precisam e para holders descreverem quais credenciais possuem. O componente central e a Presentation Definition, um objeto JSON que descreve os requisitos de credenciais de forma declarativa e interoperavel.

Uma Presentation Definition contem um ou mais Input Descriptors, cada um especificando uma credencial ou claim necessario. Cada Input Descriptor define constraints usando JSONPath para apontar campos especificos dentro de credenciais e filter para especificar valores aceitaveis. O campo purpose explica ao usuario por que cada credencial e solicitada.

O sistema de constraints suporta operacoes complexas como: exigir que um campo tenha um valor especifico (pattern), que um campo exista (exists), que um campo esteja dentro de um intervalo (minimum/maximum), e que credenciais venham de emissores especificos (issuer filtering). Isso permite que verificadores expressem requisitos precisos sem ambiguidade.

- **Exemplo**: Um verificador cria uma Presentation Definition que exige: (1) um Input Descriptor para prova de idade com JSONPath $.credentialSubject.dateOfBirth e filtro de que a data seja anterior a 2008-01-01, (2) um Input Descriptor para prova de residencia com JSONPath $.credentialSubject.address.country e filtro pattern: "^BR$". O holder recebe essa definicao e identifica quais credenciais em sua carteira satisfazem ambos os requisitos.

### 3.2 Presentation Submission: respondendo a requisitos
A Presentation Submission e a resposta do holder a uma Presentation Definition. Ela mapeia as credenciais apresentadas para os Input Descriptors solicitados, permitindo que o verificador determine automaticamente qual credencial satisfaz qual requisito.

A Submission contem um descriptor_map, um array que associa cada Input Descriptor (via id) a uma credencial especifica na Verifiable Presentation (via path). O campo format indica o formato da credencial (jwt_vc, ldp_vc, etc.), e o campo path_nested permite apontar para credenciais dentro de estruturas aninhadas.

O mecanismo de Submission Requirements permite que a Presentation Definition especifique logica complexa: regras "all" (todas as credenciais necessarias), "pick" (escolher n de m opcoes), e combinacoes aninhadas. Isso habilita cenarios como "apresente prova de identidade E (prova de emprego OU prova de renda)", dando flexibilidade ao holder.

- **Exemplo**: Uma Presentation Definition exige grupo A (obrigatorio): documento de identidade, e grupo B (pick 1 de 2): comprovante de emprego ou comprovante de renda. O holder possui um passaporte digital e um holerite verificavel. Sua Presentation Submission mapeia o passaporte para o grupo A e o holerite para o grupo B, satisfazendo ambos os requisitos. O verificador processa o descriptor_map e valida cada credencial contra seu Input Descriptor correspondente.

### 3.3 Seguranca e privacidade no Presentation Exchange
O Presentation Exchange introduz consideracoes de seguranca especificas. A Presentation Definition pode ser usada como vetor de fingerprinting: se um verificador solicita combinacoes unicas de credenciais, ele pode identificar usuarios unicamente pela resposta, mesmo sem credenciais nominais. A mitigacao envolve padronizar Presentation Definitions por setor e limitar a granularidade das solicitacoes.

O risco de over-disclosure ocorre quando a Presentation Definition solicita mais informacoes do que o necessario. Carteiras bem implementadas devem alertar o usuario quando uma solicitacao parece excessiva e permitir que ele recuse campos opcionais. A integracao com selective disclosure (via SD-JWT ou BBS+) permite que o holder apresente apenas os claims necessarios de cada credencial.

A autenticidade da Presentation Definition e critica. Se um atacante man-in-the-middle modificar a definicao em transito (por exemplo, adicionando um Input Descriptor extra), o holder pode divulgar informacoes nao solicitadas pelo verificador legitimo. A assinatura da Presentation Definition pelo verificador e a verificacao pelo holder mitigam esse risco.

- **Exemplo**: Um verificador legitimo solicita apenas prova de idade (maior de 18 anos). Um atacante intercepta a comunicacao e modifica a Presentation Definition, adicionando um Input Descriptor para numero de CPF. Se a carteira do holder nao verificar a autenticidade da definicao e o usuario nao ler atentamente a solicitacao, ele pode divulgar seu CPF para o atacante alem da prova de idade.

---

## Conclusao
Nesta aula, estudamos os tres pilares da comunicacao segura em identidade descentralizada. O DIDComm v2 fornece mensagens end-to-end criptografadas com roteamento via mediadores e suporte a multiplos protocolos de interacao. O CHAPI oferece uma interface padronizada entre aplicacoes web e carteiras, mediada pelo navegador como agente confiavel. O DIF Presentation Exchange define um linguagem declarativa para solicitacao e apresentacao de credenciais, habilitando interoperabilidade entre verificadores e holders de diferentes ecossistemas. Juntos, esses protocolos formam a infraestrutura de comunicacao necessaria para sistemas de identidade descentralizada em producao.

---

## Licao de Casa
1. Implemente um agente DIDComm v2 simples utilizando a biblioteca didcomm-rust ou didcomm-js que troque mensagens Trust Ping criptografadas entre dois DIDs did:key, documentando o fluxo de resolucao de chaves e criptografia.
2. Crie uma Presentation Definition para um cenario de verificacao de idade e residencia utilizando o formato DIF PE v2, inclua Submission Requirements com logica condicional e valide-a contra o JSON Schema oficial da especificacao.
3. Analise o modelo de seguranca do CHAPI polyfill e documente pelo menos tres vetores de ataque especificos a implementacao via polyfill que nao existiriam em uma implementacao nativa do navegador.

---

## Proxima Aula
Na proxima aula, vamos estudar armazenamento seguro para identidade descentralizada, incluindo Encrypted Data Vaults (EDV) e Identity Hubs. Veremos como dados pessoais e credenciais sao protegidos em repouso e como controle de acesso granular e implementado nesses sistemas. Ate la!

---

## Questionario

**1. Qual propriedade de seguranca o DIDComm v2 garante atraves de mediadores de roteamento?**
a) O mediador pode ler e validar o conteudo das mensagens para garantir integridade
b) O mediador ve apenas metadados de roteamento, sem acesso ao conteudo criptografado da mensagem interna
c) O mediador armazena copias das mensagens para auditoria regulatoria
d) O mediador gera novas chaves de sessao para cada mensagem
**Resposta: b**

**2. Como o CHAPI protege contra acesso direto da aplicacao a carteira do usuario?**
a) Utilizando criptografia homomorca para processar credenciais sem descriptografar
b) Redirecionando o usuario para um servidor de autorizacao centralizado
c) Mediando a interacao atraves do navegador, que garante consentimento do usuario e isolamento entre aplicacao e carteira
d) Exigindo autenticacao biometrica antes de cada apresentacao
**Resposta: c**

**3. Qual e a funcao do descriptor_map na Presentation Submission?**
a) Definir os requisitos de credenciais que o verificador aceita
b) Mapear cada credencial apresentada para o Input Descriptor correspondente na Presentation Definition, indicando qual credencial satisfaz qual requisito
c) Criptografar as credenciais antes da transmissao ao verificador
d) Gerar provas de conhecimento zero para selective disclosure
**Resposta: b**

**4. Qual risco de privacidade a Presentation Definition pode introduzir se nao for padronizada?**
a) Vazamento de chaves privadas do holder para o verificador
b) Fingerprinting de usuarios atraves de combinacoes unicas de credenciais solicitadas
c) Corrupcao de credenciais armazenadas na carteira do holder
d) Impossibilidade de revogar credenciais apresentadas
**Resposta: b**

**5. Qual algoritmo o DIDComm v2 utiliza para criptografia end-to-end de mensagens?**
a) RSA-OAEP com chaves de 4096 bits
b) AES-256-GCM com chaves derivadas estaticamente
c) ECDH-ES ou ECDH-1PU com JWE para derivacao de chaves e criptografia autenticada
d) ChaCha20-Poly1305 com chaves pre-compartilhadas
**Resposta: c**
