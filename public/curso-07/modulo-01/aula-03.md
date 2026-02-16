# Aula 1.3: Introducao a Self-Sovereign Identity (SSI): os 10 principios

## Abertura
Bem-vindo a aula 1.3! Nas aulas anteriores, vimos como os modelos tradicionais de identidade digital falham em proteger a privacidade, a autonomia e a seguranca dos usuarios. Agora, vamos conhecer o conceito de Self-Sovereign Identity (SSI) — Identidade Auto-Soberana — e os 10 principios que fundamentam essa nova abordagem. A SSI propoe uma mudanca radical: em vez de depender de intermediarios, o individuo passa a ser o centro de controle da sua propria identidade.

### Programa da aula:
1. O que e Self-Sovereign Identity (introducao)
2. Os 10 principios de Christopher Allen (base e aprofundamento)
3. SSI na pratica: como os principios se aplicam (Conceito principal da aula)

---

## 1. O que e Self-Sovereign Identity

### Definicao e origem do conceito
Self-Sovereign Identity (SSI) e um modelo de identidade digital onde o individuo possui, controla e gerencia sua propria identidade sem depender de uma autoridade centralizada. O termo foi popularizado por Christopher Allen em seu artigo seminal "The Path to Self-Sovereign Identity", publicado em 2016.

A ideia central e simples mas poderosa: assim como voce carrega seus documentos fisicos na carteira e decide quando e para quem mostra-los, no mundo digital voce deveria ter o mesmo nivel de controle sobre suas credenciais e informacoes pessoais.

- **Exemplo**: Imagine que voce tem um diploma universitario digital armazenado em sua carteira digital. Quando um empregador pede para ver seu diploma, voce escolhe compartilha-lo diretamente, sem precisar que a universidade esteja online ou intermedie a verificacao. O empregador pode verificar a autenticidade criptograficamente, sem contatar a universidade.

### A evolucao dos modelos de identidade
Christopher Allen descreveu a evolucao da identidade digital em quatro fases:

1. **Identidade centralizada**: Um unico provedor controla tudo (ex: login em um site).
2. **Identidade federada**: Um provedor autentica para varios servicos (ex: Login com Google).
3. **Identidade centrada no usuario**: O usuario tem mais controle, mas ainda depende de provedores (ex: OpenID).
4. **Identidade auto-soberana**: O usuario e verdadeiramente autonomo no controle de sua identidade.

Cada fase representa um avanco na direcao de dar mais poder ao individuo, com a SSI sendo o estagio mais maduro dessa evolucao.

- **Exemplo**: No modelo federado, o Google sabe que voce fez login no Spotify, no Airbnb e no Trello. No modelo SSI, ninguem alem de voce sabe quais servicos voce utiliza.

---

## 2. Os 10 principios de Christopher Allen

### Principios 1 a 5: Fundamentos de controle e acesso

**1. Existencia**: Os usuarios devem ter uma existencia independente. A identidade digital deve ser uma representacao de uma pessoa que ja existe, nao uma criacao artificial de um provedor. Nenhuma autoridade pode "criar" ou "destruir" sua existencia.

**2. Controle**: Os usuarios devem controlar suas identidades. Isso significa que o individuo deve ser a autoridade maxima sobre sua identidade digital. Ele decide quais informacoes compartilhar, com quem e por quanto tempo.

- **Exemplo**: Em um sistema SSI, voce pode revogar o acesso de uma empresa aos seus dados a qualquer momento, algo impossivel no modelo atual onde seus dados ja foram copiados para os servidores da empresa.

**3. Acesso**: Os usuarios devem ter acesso aos seus proprios dados. Nao deve haver dados ocultos sobre voce que voce nao possa ver. Isso nao significa que voce pode modificar credenciais emitidas por terceiros, mas que voce sempre pode ve-las.

**4. Transparencia**: Os sistemas e algoritmos que gerenciam identidades devem ser transparentes e abertos. O codigo deve ser auditavel, os protocolos devem ser padronizados e as regras devem ser claras.

**5. Persistencia**: As identidades devem ser duradouras. Idealmente, uma identidade deve durar tanto quanto o usuario desejar. Isso nao significa que credenciais nao possam expirar, mas que o identificador base do usuario deve ser persistente.

- **Exemplo**: Diferente de um perfil no Facebook que pode ser deletado pela empresa a qualquer momento, um identificador SSI persiste independentemente de qualquer provedor.

### Principios 6 a 10: Privacidade e interoperabilidade

**6. Portabilidade**: As identidades nao devem ficar presas a um unico provedor. O usuario deve poder transportar sua identidade entre diferentes sistemas, plataformas e jurisdicoes.

**7. Interoperabilidade**: As identidades devem funcionar em diferentes contextos e plataformas. Padroes abertos e protocolos comuns sao essenciais para que credenciais emitidas em um sistema sejam reconhecidas em outro.

- **Exemplo**: Uma carteira de motorista digital emitida no Brasil deveria ser verificavel em Portugal, desde que ambos os paises utilizem padroes compativeis de credenciais verificaveis.

**8. Consentimento**: Os usuarios devem consentir com o uso de sua identidade. O compartilhamento de dados deve ser um ato deliberado e informado, nao uma consequencia automatica de usar um servico.

**9. Minimizacao**: A divulgacao de dados deve ser minimizada. Quando uma verificacao e necessaria, a menor quantidade possivel de dados deve ser revelada. Esse principio esta diretamente ligado ao conceito de "divulgacao seletiva" (selective disclosure).

- **Exemplo**: Para comprovar que voce e maior de idade, um sistema SSI permite provar apenas isso — "sim, tenho mais de 18 anos" — sem revelar sua data de nascimento exata, nome ou qualquer outro dado.

**10. Protecao**: Os direitos dos usuarios devem ser protegidos. Os sistemas de identidade devem ser projetados para proteger o individuo, mesmo quando ha conflito entre os interesses do usuario e os interesses de provedores ou governos.

---

## 3. SSI na pratica: como os principios se aplicam

### O triangulo da confianca
Na arquitetura SSI, existem tres papeis fundamentais que formam o chamado "triangulo da confianca" (trust triangle):

1. **Emissor (Issuer)**: A entidade que emite uma credencial verificavel. Pode ser uma universidade (diploma), um governo (identidade), ou um medico (receita).
2. **Titular (Holder)**: A pessoa que recebe e armazena a credencial em sua carteira digital. E quem decide quando e com quem compartilhar.
3. **Verificador (Verifier)**: A entidade que precisa verificar uma credencial. Pode ser um empregador, uma loja ou um servico online.

O ponto crucial e que o verificador pode confirmar a autenticidade da credencial sem precisar contatar o emissor diretamente. Isso e possivel gracas a criptografia de chave publica e registros verificaveis.

- **Exemplo**: Um hospital (emissor) emite uma credencial de vacinacao para Maria (titular). Quando Maria viaja, a companhia aerea (verificador) pode verificar a autenticidade da credencial sem precisar ligar para o hospital.

### Comparacao pratica: modelo atual vs. SSI

| Cenario | Modelo Atual | Modelo SSI |
|---|---|---|
| Comprovar idade | Mostrar RG completo | Provar apenas "maior de 18" |
| Verificar diploma | Contatar a universidade | Verificar credencial offline |
| Fazer login | Compartilhar email/senha | Apresentar credencial verificavel |
| Perder acesso | Depender do provedor para recuperar | Recuperar via backup pessoal |
| Compartilhar dados medicos | Hospital envia para outro hospital | Paciente compartilha diretamente |

### Desafios atuais da implementacao de SSI
Apesar das vantagens, a SSI ainda enfrenta desafios significativos:

- **Adocao**: Poucos emissores oferecem credenciais verificaveis hoje.
- **Usabilidade**: Carteiras digitais ainda nao sao tao simples quanto "Login com Google".
- **Regulamentacao**: Leis de identidade digital variam enormemente entre paises.
- **Recuperacao**: Se voce perder suas chaves criptograficas, como recuperar sua identidade?
- **Governanca**: Quem define os padroes e quem resolve disputas?

- **Exemplo**: A Uniao Europeia esta desenvolvendo o eIDAS 2.0, um regulamento que preve carteiras de identidade digital para todos os cidadaos europeus, incorporando varios principios de SSI. Essa e uma das maiores iniciativas governamentais nessa direcao.

---

## Conclusao
Nesta aula, conhecemos o conceito de Self-Sovereign Identity e seus 10 principios fundamentais: existencia, controle, acesso, transparencia, persistencia, portabilidade, interoperabilidade, consentimento, minimizacao e protecao. Vimos como esses principios se traduzem na pratica por meio do triangulo da confianca entre emissor, titular e verificador. A SSI representa uma mudanca de paradigma onde o individuo deixa de ser um registro em um banco de dados e passa a ser o protagonista da sua propria identidade digital.

---

## Licao de Casa
1. Leia o artigo original de Christopher Allen, "The Path to Self-Sovereign Identity" (disponivel online em ingles), e identifique qual principio voce considera mais importante e por que.
2. Escolha um cenario do seu dia a dia (ex: ir ao medico, alugar um imovel, abrir uma conta bancaria) e descreva como ele funcionaria com SSI, usando o triangulo da confianca.
3. Pesquise sobre o eIDAS 2.0 da Uniao Europeia e escreva um paragrafo sobre como ele se relaciona com os principios de SSI.

---

## Proxima Aula
Na proxima aula, vamos explorar a camada de identidade que faltava na internet — entendendo por que a web foi construida sem uma camada nativa de identidade e como isso moldou os problemas que enfrentamos hoje. Ate la!

---

## Questionario

**1. O que significa Self-Sovereign Identity (SSI)?**
a) Uma identidade controlada por um governo soberano
b) Um modelo onde o individuo possui, controla e gerencia sua propria identidade digital
c) Uma identidade que so funciona em um unico pais
d) Um sistema de login social mais avancado
**Resposta: b**

**2. Quem popularizou o conceito de SSI e os 10 principios?**
a) Satoshi Nakamoto
b) Tim Berners-Lee
c) Christopher Allen
d) Vitalik Buterin
**Resposta: c**

**3. Qual principio de SSI afirma que apenas a menor quantidade possivel de dados deve ser revelada?**
a) Protecao
b) Consentimento
c) Transparencia
d) Minimizacao
**Resposta: d**

**4. Quais sao os tres papeis no "triangulo da confianca" da SSI?**
a) Governo, empresa e cidadao
b) Emissor, titular e verificador
c) Cliente, servidor e banco de dados
d) Usuario, administrador e auditor
**Resposta: b**

**5. Qual e um dos principais desafios atuais para a adocao da SSI?**
a) A tecnologia de criptografia ainda nao foi inventada
b) Nenhum governo no mundo apoia a ideia
c) Carteiras digitais ainda nao sao tao simples quanto metodos tradicionais de login
d) A SSI exige que todos os dados sejam publicos
**Resposta: c**
