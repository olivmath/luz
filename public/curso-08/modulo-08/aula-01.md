# Aula 8.1: Ponte Web2-Web3: OIDC4VC (OpenID Connect para credenciais verificaveis)

## Abertura
Bem-vindo a aula 8.1! Nesta aula, vamos explorar uma das especificacoes mais importantes para a adocao em massa da identidade descentralizada: o OIDC4VC (OpenID for Verifiable Credentials). Esse conjunto de protocolos constroi uma ponte entre o ecossistema OAuth2/OIDC — usado por bilhoes de usuarios hoje — e o mundo das Verifiable Credentials baseadas em DIDs. Vamos entender como essa integracao funciona tecnicamente e por que ela e essencial para a transicao gradual de Web2 para Web3.

### Programa da aula:
1. Fundamentos do OpenID Connect e sua relevancia para SSI (introducao)
2. Arquitetura do OIDC4VC: protocolos OID4VCI e OID4VP (base e aprofundamento)
3. Implementacao tecnica da ponte Web2-Web3 com OIDC4VC (Conceito principal da aula)

---

## 1. Fundamentos do OpenID Connect e sua relevancia para SSI

### O ecossistema OIDC atual
O OpenID Connect (OIDC) e o protocolo de autenticacao dominante na internet moderna. Construido sobre o framework de autorizacao OAuth 2.0, ele adiciona uma camada de identidade que permite a aplicacoes verificar a identidade de usuarios finais. Quando voce clica em "Login com Google" ou "Login com Microsoft", esta usando OIDC. Estima-se que mais de 3 bilhoes de autenticacoes diarias utilizem esse protocolo.

O fluxo basico do OIDC envolve tres partes: o usuario (End-User), o Relying Party (aplicacao que precisa autenticar o usuario) e o OpenID Provider (IdP como Google, Microsoft, Okta). O IdP emite um ID Token — um JWT assinado contendo claims sobre o usuario — que o Relying Party valida criptograficamente.

- **Exemplo**: Ao fazer login em um e-commerce com sua conta Google, o Google (OpenID Provider) emite um ID Token contendo claims como `sub` (identificador unico), `email`, `name` e `email_verified`. O e-commerce valida a assinatura do JWT e confia nos dados porque confia no Google como emissor.

### Por que o OIDC importa para identidade descentralizada
A infraestrutura OIDC esta profundamente enraizada em milhoes de aplicacoes. Qualquer solucao de identidade descentralizada que ignore esse ecossistema tera dificuldade de adocao. O OIDC4VC reconhece essa realidade e propoe uma estrategia de ponte: reutilizar os fluxos, endpoints e mecanismos de confianca que desenvolvedores ja conhecem, mas substituindo tokens opacos por Verifiable Credentials portaveis e controladas pelo usuario.

A OpenID Foundation, em colaboracao com o European Digital Identity Wallet (EUDI), desenvolveu tres especificacoes complementares: OID4VCI (emissao), OID4VP (apresentacao) e SIOPv2 (autenticacao auto-soberana). Juntas, elas formam o stack OIDC4VC.

- **Exemplo**: A Uniao Europeia selecionou o OIDC4VC como protocolo base para o EU Digital Identity Wallet, que sera obrigatorio para todos os estados-membros. Isso significa que centenas de milhoes de europeus interagirao com Verifiable Credentials por meio de fluxos OIDC familiares.

---

## 2. Arquitetura do OIDC4VC: protocolos OID4VCI e OID4VP

### OID4VCI: emissao de credenciais verificaveis
O OpenID for Verifiable Credential Issuance (OID4VCI) define como um Issuer emite Verifiable Credentials para a wallet do titular usando fluxos baseados em OAuth 2.0. O fluxo segue estas etapas:

1. O titular se autentica no Issuer (que atua como Authorization Server)
2. O Issuer emite um Authorization Code ou Pre-Authorized Code
3. A wallet do titular troca o codigo por um Access Token
4. A wallet usa o Access Token para chamar o Credential Endpoint do Issuer
5. O Issuer retorna a Verifiable Credential assinada (em formato JWT, SD-JWT ou LDP)

O OID4VCI suporta dois fluxos principais: o Authorization Code Flow (onde o usuario interage com o Issuer em tempo real) e o Pre-Authorized Code Flow (onde o Issuer gera um codigo antecipadamente, por exemplo via QR code ou deep link).

- **Exemplo**: Uma universidade quer emitir diplomas digitais. Ela configura um Credential Issuer com endpoint `/.well-known/openid-credential-issuer` descrevendo os tipos de credenciais oferecidos. O estudante escaneia um QR code, sua wallet negocia o fluxo OID4VCI, e recebe o diploma como uma VC em formato SD-JWT, armazenada localmente.

### OID4VP: apresentacao de credenciais verificaveis
O OpenID for Verifiable Presentations (OID4VP) define como um titular apresenta Verifiable Credentials a um Verifier (Relying Party). Ele estende o conceito de Authorization Request do OIDC para solicitar Verifiable Presentations em vez de apenas ID Tokens.

O Verifier envia uma Authorization Request contendo um `presentation_definition` — um objeto JSON que descreve quais credenciais e quais atributos sao necessarios. A wallet do titular seleciona as credenciais adequadas, gera uma Verifiable Presentation assinada e a retorna ao Verifier via redirect URI.

O `presentation_definition` usa o formato Presentation Exchange (PE), que permite expressoes sofisticadas como: "preciso de uma credencial de tipo DriverLicense emitida por qualquer autoridade de transito brasileira, contendo pelo menos os campos category e expiry_date".

- **Exemplo**: Um servico de aluguel de carros precisa verificar a CNH digital. Ele envia um OID4VP Authorization Request com `presentation_definition` exigindo `credential_type: DriverLicense` e `fields: [category, expiry_date]`. A wallet do usuario exibe um consentimento mostrando quais dados serao compartilhados e, apos aprovacao, envia a VP assinada.

### SIOPv2: autenticacao auto-soberana
O Self-Issued OpenID Provider v2 (SIOPv2) permite que a propria wallet do usuario atue como OpenID Provider, eliminando a dependencia de IdPs centralizados. Em vez de redirecionar para Google ou Microsoft, a aplicacao redireciona para a wallet local do usuario.

A wallet gera um ID Token auto-emitido, assinado com a chave privada associada ao DID do usuario. O Relying Party resolve o DID, obtem a chave publica do DID Document e valida o ID Token. Esse fluxo e compativel com a infraestrutura OIDC existente — o Relying Party precisa apenas adicionar suporte para o esquema `siopv2://` ou `openid://`.

- **Exemplo**: Um portal governamental que hoje usa "Login com gov.br" via OIDC pode adicionar a opcao "Login com Carteira Digital". Ao clicar, o usuario e redirecionado para sua wallet (via deep link `openid://`), que gera um ID Token auto-emitido vinculado ao seu `did:key`. O portal valida a assinatura e autentica o usuario sem intermediarios.

---

## 3. Implementacao tecnica da ponte Web2-Web3 com OIDC4VC

### Mapeamento de conceitos OIDC para SSI
A genialidade do OIDC4VC esta no mapeamento direto entre conceitos ja consolidados e seus equivalentes descentralizados:

| Conceito OIDC       | Equivalente SSI           |
|---------------------|--------------------------|
| OpenID Provider     | Credential Issuer        |
| ID Token            | Verifiable Credential    |
| UserInfo Endpoint   | Credential Endpoint      |
| Authorization Req.  | Presentation Request     |
| Relying Party       | Verifier                 |
| Subject Identifier  | DID                      |

Essa correspondencia permite que desenvolvedores familiarizados com OAuth2/OIDC implementem fluxos SSI sem precisar reaprender tudo do zero. Bibliotecas como `openid4vc` (Rust/TypeScript), `SphereonSDK` e `walt.id` ja oferecem implementacoes de referencia.

- **Exemplo**: Um backend Node.js que ja usa `passport-openidconnect` pode adicionar suporte a OID4VP com cerca de 200 linhas de codigo adicional, utilizando a biblioteca `@sphereon/oid4vci-client`. Os endpoints existentes permanecem, e um novo middleware valida Verifiable Presentations no mesmo pipeline de autenticacao.

### Fluxo completo de integracao cross-protocol
Um cenario realista de ponte Web2-Web3 envolve um Credential Bridge — um servico que aceita autenticacao OIDC tradicional e emite Verifiable Credentials equivalentes. O fluxo seria:

1. Usuario autentica via OIDC tradicional (ex: Login com Google)
2. O Credential Bridge recebe o ID Token com claims verificados
3. O Bridge emite uma Verifiable Credential contendo as mesmas claims, via OID4VCI
4. A wallet do usuario armazena a VC
5. Em futuras interacoes, o usuario apresenta a VC via OID4VP, sem depender mais do Google

Esse padrao de "bootstrap" permite que usuarios migrem gradualmente de identidades federadas para identidades auto-soberanas, sem ruptura. O Google continua sendo o attestor original dos dados, mas o usuario ganha portabilidade e controle.

- **Exemplo**: O projeto "GAIN" (Global Assured Identity Network) da OpenID Foundation esta implementando exatamente esse modelo. Bancos participantes usam suas credenciais KYC existentes (emitidas via OIDC) para popular wallets de usuarios com VCs equivalentes, permitindo que esses usuarios apresentem provas de identidade verificadas em qualquer contexto sem depender do banco original.

### Desafios tecnicos e consideracoes de seguranca
A implementacao do OIDC4VC traz desafios especificos que engenheiros devem considerar:

**Binding criptografico**: Como garantir que a VC emitida esta vinculada a wallet do titular e nao pode ser transferida? O OID4VCI usa `key_proof` (JWT ou `cwt`) para vincular a credencial a uma chave controlada pelo titular, similar ao DPoP (Demonstrating Proof-of-Possession) do OAuth 2.0.

**Replay attacks**: Verifiable Presentations devem incluir `nonce` e `audience` para evitar que uma apresentacao capturada seja reutilizada em outro contexto.

**Metadata discovery**: Issuers e Verifiers publicam metadados em endpoints `/.well-known/openid-credential-issuer` e `/.well-known/openid-configuration` respectivamente, permitindo descoberta automatica de capacidades e formatos suportados.

- **Exemplo**: Sem key binding adequado, um atacante poderia interceptar uma VC durante a emissao e apresenta-la como propria. O mecanismo de `key_proof` resolve isso: durante a emissao, a wallet envia uma prova de posse da chave privada, e o Issuer vincula a VC a essa chave publica especifica. Na apresentacao, o Verifier exige que a VP seja assinada pela mesma chave.

---

## Conclusao
Nesta aula, vimos como o OIDC4VC constroi uma ponte pragmatica entre o ecossistema OAuth2/OIDC existente e o mundo das Verifiable Credentials. Compreendemos que o OID4VCI permite a emissao de VCs usando fluxos familiares de Authorization Code, que o OID4VP possibilita a apresentacao de credenciais com Presentation Definitions expressivas, e que o SIOPv2 transforma a wallet do usuario em seu proprio OpenID Provider. Essa abordagem evolutiva — e nao revolucionaria — e provavelmente o caminho mais realista para a adocao em massa da identidade descentralizada.

---

## Licao de Casa
1. Acesse a especificacao OID4VCI em openid.net/specs/openid-4-verifiable-credential-issuance e identifique as diferencas entre o Authorization Code Flow e o Pre-Authorized Code Flow. Documente quando cada um e mais apropriado.
2. Desenhe um diagrama de sequencia completo de um fluxo OID4VP onde um usuario apresenta uma credencial de idade a um verificador, incluindo todos os endpoints e payloads envolvidos.
3. Pesquise a implementacao do EU Digital Identity Wallet (EUDI) e identifique quais especificacoes OIDC4VC estao sendo utilizadas e em quais formatos de credenciais (SD-JWT, mdoc, etc.).

---

## Proxima Aula
Na proxima aula, vamos explorar como a identidade descentralizada se integra com outros padroes Web3 emergentes, incluindo SIWE (Sign-In with Ethereum) e ERC-4337 (abstracao de conta). Veremos como esses protocolos complementam os DIDs e criam novas possibilidades de autenticacao e autorizacao descentralizada. Ate la!

---

## Questionario

**1. Qual e o principal objetivo do OIDC4VC?**
a) Substituir completamente o OpenID Connect por um protocolo novo
b) Criar uma ponte entre o ecossistema OIDC existente e Verifiable Credentials
c) Eliminar a necessidade de wallets digitais
d) Centralizar a emissao de credenciais em um unico provedor global
**Resposta: b**

**2. No fluxo OID4VCI, qual elemento a wallet envia para receber a Verifiable Credential do Issuer?**
a) Apenas o email do usuario
b) Um Access Token obtido apos troca do Authorization Code
c) A chave privada do usuario
d) Um cookie de sessao do navegador
**Resposta: b**

**3. O que e o `presentation_definition` no contexto do OID4VP?**
a) Um documento legal que define quais dados o verificador pode acessar
b) Um objeto JSON que descreve quais credenciais e atributos o Verifier necessita
c) Um contrato inteligente que valida credenciais on-chain
d) Um template HTML para exibir credenciais na interface do usuario
**Resposta: b**

**4. Como o SIOPv2 difere do OIDC tradicional?**
a) Usa apenas biometria para autenticacao
b) A propria wallet do usuario atua como OpenID Provider, sem depender de IdPs centralizados
c) Requer que todos os dados sejam armazenados em blockchain
d) Funciona apenas em redes privadas permissionadas
**Resposta: b**

**5. Qual mecanismo do OID4VCI garante que uma Verifiable Credential emitida esta vinculada a wallet do titular?**
a) Criptografia simetrica compartilhada entre Issuer e wallet
b) Registro do hash da credencial em blockchain publica
c) Key proof (prova de posse de chave) similar ao DPoP do OAuth 2.0
d) Verificacao biometrica obrigatoria durante a emissao
**Resposta: c**