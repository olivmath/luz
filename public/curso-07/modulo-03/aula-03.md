# Aula 3.3: Trust Frameworks: Como a Confianca Tecnica se Traduz em Confianca Juridica

## Abertura
Bem-vindo a aula 3.3! Nas aulas anteriores, vimos como a criptografia e o Triangulo da Confianca garantem a autenticidade tecnica de uma credencial. Mas uma pergunta fundamental permanece: como fazer com que um diploma digital tenha o mesmo valor legal que um diploma em papel com carimbo e assinatura? E aqui que entram os Trust Frameworks — as pontes que conectam a confianca tecnica a confianca juridica e institucional.

### Programa da aula:
1. O que sao Trust Frameworks e por que sao necessarios (introducao)
2. Componentes e camadas de um Trust Framework (base e aprofundamento)
3. Trust Frameworks na pratica: modelos globais e impacto regulatorio (Conceito principal da aula)

---

## 1. O que Sao Trust Frameworks e Por que Sao Necessarios

### Definicao e Proposito
Um Trust Framework (Estrutura de Confianca) e um conjunto de regras, politicas, padroes tecnicos e acordos legais que definem como os participantes de um ecossistema de identidade devem se comportar para que as interacoes sejam confiaveis. Ele e o "contrato social" do ecossistema descentralizado — estabelece quem pode emitir credenciais, quais padroes devem seguir, como disputas sao resolvidas e qual e a validade legal das credenciais emitidas.

A criptografia responde a pergunta: "Esta credencial foi realmente assinada por esta chave?" Mas nao responde a perguntas igualmente importantes:
- Quem autorizou essa entidade a emitir esse tipo de credencial?
- Essa credencial tem validade legal no Brasil? E em Portugal?
- O que acontece se o Emissor emitir uma credencial fraudulenta?
- Quais padroes de dados e protocolos todos devem seguir?

- **Exemplo**: Uma assinatura digital comprova que a Universidade XYZ assinou um diploma. Mas como o Verificador sabe que a Universidade XYZ e uma instituicao reconhecida pelo MEC? O Trust Framework define que apenas universidades credenciadas pelo MEC podem emitir diplomas digitais validos, criando a ponte entre a verificacao tecnica e a confianca institucional.

### A Lacuna entre Tecnologia e Direito
Sem Trust Frameworks, a identidade descentralizada seria apenas uma curiosidade tecnica sem aplicabilidade real. Imagine um mundo onde qualquer pessoa pode criar um DID e comecar a emitir "diplomas" — tecnicamente validos, mas sem nenhum respaldo institucional. O Trust Framework preenche essa lacuna criando camadas de governanca.

As lacunas que precisam ser preenchidas:
- Lacuna de autorizacao: quem pode emitir quais tipos de credenciais
- Lacuna de responsabilidade: quem responde legalmente por credenciais incorretas
- Lacuna de interoperabilidade: como garantir que credenciais de diferentes emissores funcionem entre si
- Lacuna de reconhecimento: como garantir que credenciais emitidas em um pais sejam aceitas em outro

- **Exemplo**: No Brasil, a ICP-Brasil (Infraestrutura de Chaves Publicas Brasileira) e um exemplo de trust framework para certificados digitais. Ela define quem pode ser Autoridade Certificadora, quais padroes devem seguir, como auditorias sao realizadas e qual e a validade juridica dos certificados emitidos sob sua hierarquia.

---

## 2. Componentes e Camadas de um Trust Framework

### Componentes Essenciais
Um Trust Framework robusto e composto por varios elementos que trabalham em conjunto para criar um ecossistema confiavel. Cada componente aborda um aspecto diferente da confianca, desde regras tecnicas ate mecanismos de resolucao de conflitos.

Os componentes fundamentais sao:
- **Governanca**: define quem toma decisoes sobre o ecossistema, como novas regras sao criadas e como participantes sao admitidos ou removidos
- **Politicas de credenciais**: especificam quais tipos de credenciais existem, quais atributos contem, quais niveis de garantia (assurance levels) oferecem e quais processos de verificacao o emissor deve seguir antes de emitir
- **Padroes tecnicos**: definem formatos de dados (JSON-LD, JWT), protocolos de comunicacao (DIDComm, OpenID4VC), metodos DID aceitos e algoritmos criptograficos permitidos
- **Acordos legais**: contratos entre participantes, termos de uso, politicas de privacidade, conformidade com regulamentacoes (como LGPD no Brasil e GDPR na Europa)
- **Mecanismos de auditoria**: processos de verificacao continua de que os participantes estao cumprindo as regras
- **Resolucao de disputas**: procedimentos para lidar com fraudes, erros e conflitos entre participantes

- **Exemplo**: O Trust Framework da rede Sovrin define quatro niveis de garantia para credenciais: auto-declarado, verificado por terceiros, verificado por governo e verificado por biometria. Uma credencial de auto-declaracao (como um email) tem menor peso juridico que uma credencial verificada biometricamente por um orgao governamental.

### Camadas de Confianca
Trust Frameworks operam em multiplas camadas, desde o nivel tecnico mais baixo ate o nivel regulatorio mais alto. Compreender essas camadas ajuda a projetar sistemas que sao tanto tecnicamente solidos quanto juridicamente validos.

Camada 1 — Confianca tecnica (infraestrutura):
- Protocolos criptograficos e padroes de dados
- Registros verificaveis e metodos DID
- Interoperabilidade entre carteiras e agentes

Camada 2 — Confianca operacional (processos):
- Procedimentos de emissao e verificacao
- Gestao de ciclo de vida de credenciais (emissao, revogacao, expiracao)
- Niveis de garantia e processos de validacao de identidade

Camada 3 — Confianca de governanca (regras):
- Estrutura de governanca e tomada de decisoes
- Admissao e remocao de participantes
- Auditoria e conformidade

Camada 4 — Confianca juridica (leis e regulamentacoes):
- Conformidade com legislacoes nacionais e internacionais
- Reconhecimento legal de credenciais digitais
- Responsabilidade civil e criminal dos participantes

- **Exemplo**: No caso do diploma digital brasileiro, a confianca tecnica garante que a assinatura e valida (camada 1), a confianca operacional garante que a universidade verificou o historico do aluno antes de emitir (camada 2), a confianca de governanca garante que a universidade e credenciada pelo MEC (camada 3), e a confianca juridica garante que o diploma digital tem a mesma validade legal que o diploma em papel, conforme o Decreto 9.235/2017 (camada 4).

---

## 3. Trust Frameworks na Pratica: Modelos Globais e Impacto Regulatorio

### Modelos de Trust Framework ao Redor do Mundo
Diversos paises e organizacoes ja estao implementando Trust Frameworks para identidade descentralizada. Cada modelo reflete as prioridades e o contexto regulatorio de sua regiao, mas todos compartilham os mesmos principios fundamentais.

**eIDAS 2.0 (Uniao Europeia):**
O regulamento eIDAS 2.0, atualizado em 2024, e possivelmente o Trust Framework mais ambicioso do mundo para identidade digital. Ele obriga todos os Estados-membros da UE a oferecer uma carteira de identidade digital (EU Digital Identity Wallet) aos seus cidadaos. O framework define esquemas de credenciais padronizados, niveis de garantia (baixo, substancial, alto), requisitos de interoperabilidade e obrigacoes legais para emissores e verificadores.

**Pan-Canadian Trust Framework (PCTF):**
O Canada desenvolveu um framework que define sete camadas de confianca, desde a verificacao de identidade ate a autorizacao de acesso. Ele e projetado para funcionar tanto no setor publico quanto no privado, com enfase na interoperabilidade entre provincias.

**DIACC (Digital ID and Authentication Council of Canada):**
Trabalha em conjunto com o PCTF para criar padroes de certificacao para provedores de identidade digital, com foco em avaliacao de conformidade e interoperabilidade.

- **Exemplo**: Sob o eIDAS 2.0, um cidadao portugues pode usar sua carteira digital europeia para comprovar sua habilitacao profissional na Alemanha. O Trust Framework garante que a credencial emitida por Portugal e reconhecida pela Alemanha, porque ambos seguem os mesmos padroes e niveis de garantia definidos pelo regulamento.

### Trust Frameworks e o Contexto Brasileiro
O Brasil esta avancando na construcao de frameworks de confianca para identidade digital, com varias iniciativas relevantes que convergem para um ecossistema descentralizado.

Iniciativas brasileiras relevantes:
- **ICP-Brasil**: ja estabelece uma hierarquia de confianca para certificados digitais, que pode ser adaptada para credenciais verificaveis
- **Gov.br**: a plataforma de identidade digital do governo federal, que ja oferece niveis bronze, prata e ouro de verificacao de identidade
- **Registro Civil Digital**: modernizacao dos cartorios com assinatura digital e interoperabilidade
- **LGPD (Lei Geral de Protecao de Dados)**: define requisitos de privacidade e consentimento que qualquer Trust Framework brasileiro deve respeitar
- **Banco Central e Open Finance**: o ecossistema de Open Finance ja implementa modelos de confianca entre instituicoes financeiras que podem ser expandidos para credenciais verificaveis

Para que credenciais verificaveis tenham valor legal no Brasil, um Trust Framework precisaria:
- Definir quais entidades podem emitir quais tipos de credenciais
- Estabelecer niveis de garantia compativeis com a legislacao brasileira
- Garantir conformidade com a LGPD em todos os fluxos de dados
- Criar mecanismos de auditoria e responsabilizacao
- Permitir interoperabilidade com frameworks internacionais como o eIDAS

- **Exemplo**: Imagine que o MEC crie um Trust Framework para diplomas digitais verificaveis. Ele definiria que apenas universidades com credenciamento ativo podem emitir diplomas no formato W3C Verifiable Credentials, usando DIDs registrados em um registro aprovado, seguindo esquemas padronizados e estando sujeitas a auditorias periodicas. Um empregador poderia verificar o diploma instantaneamente, com certeza juridica, sem contactar a universidade.

---

## Conclusao
Trust Frameworks sao a cola que une tecnologia e direito no ecossistema de identidade descentralizada. Sem eles, credenciais verificaveis seriam tecnicamente corretas mas juridicamente vazias. Vimos que um Trust Framework robusto opera em quatro camadas — tecnica, operacional, governanca e juridica — e que modelos como o eIDAS 2.0 na Europa e iniciativas como a ICP-Brasil e a LGPD no contexto brasileiro estao construindo as fundacoes para que credenciais descentralizadas tenham validade legal e reconhecimento institucional.

---

## Licao de Casa
1. Pesquise o regulamento eIDAS 2.0 e identifique tres requisitos especificos que ele impoe aos emissores de credenciais verificaveis. Compare com o que a ICP-Brasil exige das Autoridades Certificadoras.
2. Analise a plataforma Gov.br e seus niveis de verificacao (bronze, prata, ouro). Proponha como esses niveis poderiam ser mapeados para niveis de garantia de um Trust Framework de credenciais verificaveis.
3. Redija uma proposta simplificada de Trust Framework para um caso de uso especifico (ex: diplomas universitarios ou carteiras de vacinacao), definindo pelo menos: tipos de emissores autorizados, niveis de garantia, padroes tecnicos e mecanismos de auditoria.

---

## Proxima Aula
Na proxima aula, vamos analisar exemplos concretos de como governos, universidades e bancos estao atuando como emissores de credenciais verificaveis ao redor do mundo. Voce vai ver projetos reais que ja estao implementando os conceitos que estudamos ate aqui. Ate la!

---

## Questionario

**1. Qual e a principal funcao de um Trust Framework no ecossistema de identidade descentralizada?**
a) Substituir completamente a criptografia na verificacao de credenciais
b) Definir regras, politicas e acordos legais que traduzem confianca tecnica em confianca juridica
c) Centralizar o controle de todas as credenciais em um unico orgao governamental
d) Eliminar a necessidade de registros verificaveis de dados
**Resposta: b**

**2. Qual lacuna um Trust Framework NAO resolve diretamente?**
a) Quem pode emitir quais tipos de credenciais
b) A velocidade de processamento dos algoritmos criptograficos
c) A validade legal de credenciais em diferentes jurisdicoes
d) A responsabilidade por credenciais emitidas de forma incorreta
**Resposta: b**

**3. Qual e a camada mais alta de confianca em um Trust Framework?**
a) Confianca tecnica (protocolos e criptografia)
b) Confianca operacional (processos de emissao)
c) Confianca de governanca (regras e admissao de participantes)
d) Confianca juridica (leis e regulamentacoes)
**Resposta: d**

**4. O que o regulamento eIDAS 2.0 obriga os Estados-membros da Uniao Europeia a fazer?**
a) Abandonar completamente documentos fisicos de identidade
b) Oferecer uma carteira de identidade digital (EU Digital Identity Wallet) aos seus cidadaos
c) Utilizar exclusivamente blockchain publica para registros de identidade
d) Eliminar todos os orgaos de certificacao existentes
**Resposta: b**

**5. No contexto brasileiro, qual legislacao define requisitos de privacidade que qualquer Trust Framework nacional deve respeitar?**
a) Codigo Civil Brasileiro
b) Lei de Acesso a Informacao (LAI)
c) LGPD (Lei Geral de Protecao de Dados)
d) Marco Civil da Internet
**Resposta: c**
