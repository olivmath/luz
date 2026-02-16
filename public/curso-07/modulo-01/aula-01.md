# Aula 1.1: Evolucao da identidade: do papel aos sistemas centralizados e federados

## Abertura
Bem-vindo a aula 1.1! Nesta aula, vamos explorar como a identidade evoluiu ao longo da historia, desde os primeiros registros em papel ate os sistemas digitais centralizados e federados que usamos hoje. Entender essa trajetoria e fundamental para compreender por que precisamos de novos modelos de identidade.

### Programa da aula:
1. Identidade no mundo fisico (introducao)
2. Sistemas centralizados de identidade digital (base e aprofundamento)
3. Modelos federados e suas limitacoes (Conceito principal da aula)

---

## 1. Identidade no mundo fisico

### A origem dos documentos de identidade
Durante seculos, a identidade de uma pessoa era definida pelo reconhecimento direto da comunidade. Em vilas pequenas, todos se conheciam. Com o crescimento das cidades e dos estados nacionais, surgiu a necessidade de registros formais.

Os primeiros documentos de identidade surgiram como certificados emitidos por autoridades locais, igrejas e cartorioss. Esses documentos em papel tinham uma caracteristica importante: eram fisicos e poderiam ser apresentados pessoalmente.

- **Exemplo**: No Brasil, o Registro Civil de nascimento, criado no seculo XIX, e ate hoje a base para emissao de todos os outros documentos. Sem ele, uma pessoa praticamente nao existe para o Estado.

### Caracteristicas da identidade baseada em papel
O modelo de identidade em papel possui algumas propriedades que vale a pena destacar:

- **Portabilidade**: O titular carrega consigo o documento fisico.
- **Verificacao visual**: A autenticidade e conferida por elementos visuais como carimbos, assinaturas e selos.
- **Emissor centralizado**: Apenas uma autoridade reconhecida pode emitir o documento.
- **Fragilidade**: Documentos podem ser perdidos, danificados ou falsificados.

- **Exemplo**: Um passaporte e emitido por um governo, possui elementos de seguranca fisicos e e aceito internacionalmente como prova de identidade e nacionalidade.

---

## 2. Sistemas centralizados de identidade digital

### O surgimento da identidade digital
Com a chegada da internet nos anos 1990, surgiu um problema novo: como provar quem voce e em um ambiente onde ninguem pode te ver? A solucao inicial foi simples — usuario e senha. Cada servico criava seu proprio banco de dados de usuarios.

Esse modelo e chamado de **identidade centralizada** porque uma unica organizacao controla todas as informacoes sobre voce naquele contexto. O provedor do servico e, ao mesmo tempo, o emissor, o armazenador e o verificador da sua identidade.

- **Exemplo**: Quando voce cria uma conta no site de um banco, o banco armazena seus dados, define suas credenciais e decide se voce pode ou nao acessar o sistema. Se o banco decidir encerrar sua conta, voce perde o acesso.

### Problemas da centralizacao
O modelo centralizado trouxe diversos problemas que so se agravaram com o tempo:

- **Multiplicacao de credenciais**: Cada servico exige um cadastro separado. Um usuario medio possui mais de 100 contas online.
- **Honeypots de dados**: Bancos de dados centralizados se tornaram alvos lucrativos para hackers. Um unico vazamento pode expor milhoes de registros.
- **Dependencia do provedor**: Se o servico sair do ar ou encerrar operacoes, voce perde sua identidade naquele contexto.
- **Assimetria de poder**: O provedor sabe tudo sobre voce, mas voce sabe muito pouco sobre como seus dados sao usados.

- **Exemplo**: O vazamento de dados do Yahoo em 2013 afetou 3 bilhoes de contas, expondo nomes, emails, datas de nascimento e senhas. Os usuarios nao tinham nenhum controle sobre a situacao.

---

## 3. Modelos federados e suas limitacoes

### O que e identidade federada
Para resolver o problema de ter centenas de contas, surgiu o modelo de **identidade federada**. A ideia e simples: usar um unico provedor de identidade para acessar varios servicos diferentes. Em vez de criar uma conta nova em cada site, voce usa sua conta Google, Facebook ou Apple para fazer login.

Tecnicamente, isso funciona por meio de protocolos como SAML, OAuth 2.0 e OpenID Connect, que permitem que um servico (chamado de Relying Party) confie na autenticacao feita por outro servico (chamado de Identity Provider).

- **Exemplo**: Quando voce clica em "Entrar com Google" em um site de comercio eletronico, o Google confirma sua identidade para aquele site sem que voce precise criar uma nova conta.

### Avancos e limitacoes do modelo federado
O modelo federado trouxe avancos reais em usabilidade, mas criou novos problemas:

**Avancos:**
- Menos senhas para gerenciar
- Experiencia de login mais rapida
- Padronizacao de protocolos de autenticacao

**Limitacoes:**
- **Concentracao de poder**: Poucos provedores (Google, Facebook, Apple) controlam o acesso de bilhoes de pessoas a servicos de terceiros.
- **Rastreamento cruzado**: O Identity Provider sabe exatamente quais servicos voce usa, quando e com que frequencia.
- **Ponto unico de falha**: Se sua conta Google e comprometida ou suspensa, voce pode perder acesso a dezenas de servicos simultaneamente.
- **Exclusao digital**: Quem nao tem conta em um grande provedor fica de fora do ecossistema.

- **Exemplo**: Em 2021, uma queda dos servicos do Facebook deixou bilhoes de usuarios sem acesso nao apenas ao Facebook, mas tambem a todos os sites e aplicativos onde usavam "Login com Facebook".

### Comparacao entre os modelos

| Caracteristica | Centralizado | Federado |
|---|---|---|
| Controle dos dados | Provedor | Provedor (compartilhado) |
| Numero de contas | Muitas | Poucas |
| Risco de vazamento | Alto (por servico) | Alto (concentrado) |
| Rastreamento | Por servico | Cruzado entre servicos |
| Resiliencia | Baixa | Baixa (ponto unico de falha) |

---

## Conclusao
Nesta aula, percorremos a evolucao da identidade desde os documentos em papel ate os sistemas digitais centralizados e federados. Vimos que cada modelo trouxe avancos, mas tambem novos problemas. Os sistemas centralizados criaram honeypots de dados e dependencia de provedores. Os modelos federados reduziram a fricao, mas concentraram ainda mais poder em poucas empresas. Essa trajetoria nos mostra que precisamos de um novo paradigma — um onde o individuo esteja no centro do controle de sua propria identidade.

---

## Licao de Casa
1. Liste todos os servicos online onde voce usa "Login com Google" ou "Login com Facebook" e reflita: o que aconteceria se essa conta fosse suspensa?
2. Pesquise sobre o vazamento de dados do Yahoo (2013) ou do Facebook (2019) e escreva um paragrafo sobre as consequencias para os usuarios.
3. Compare a experiencia de apresentar um documento fisico (como RG) com a de fazer login em um site. Quais sao as semelhancas e diferencas em termos de controle e privacidade?

---

## Proxima Aula
Na proxima aula, vamos explorar em detalhes as falhas dos modelos tradicionais de identidade digital, incluindo vazamentos massivos de dados, censura e a dependencia critica de intermediarios. Ate la!

---

## Questionario

**1. Qual e a principal caracteristica do modelo de identidade centralizada?**
a) O usuario controla todos os seus dados pessoais
b) Uma unica organizacao controla a emissao, o armazenamento e a verificacao da identidade
c) Varios provedores compartilham a responsabilidade pela identidade
d) A identidade e armazenada em uma blockchain publica
**Resposta: b**

**2. O que significa o termo "honeypot de dados" no contexto de identidade digital?**
a) Um sistema de protecao contra hackers
b) Um banco de dados descentralizado e seguro
c) Um grande repositorio centralizado de dados que se torna alvo atrativo para atacantes
d) Uma tecnica de criptografia avancada
**Resposta: c**

**3. Qual protocolo e comumente usado em sistemas de identidade federada?**
a) HTTP
b) FTP
c) OAuth 2.0
d) SMTP
**Resposta: c**

**4. Qual e uma limitacao importante do modelo de identidade federada?**
a) Exige que o usuario memorize centenas de senhas
b) Nao funciona na internet
c) O Identity Provider pode rastrear o uso de servicos de terceiros pelo usuario
d) Cada servico precisa emitir seu proprio documento fisico
**Resposta: c**

**5. O que aconteceu durante a queda dos servicos do Facebook em 2021 em relacao a identidade digital?**
a) Apenas o Facebook ficou fora do ar
b) Usuarios perderam acesso a todos os servicos que dependiam do "Login com Facebook"
c) Os dados dos usuarios foram permanentemente deletados
d) O modelo federado provou ser mais resiliente que o centralizado
**Resposta: b**
