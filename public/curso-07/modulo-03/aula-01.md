# Aula 3.1: Papeis no Ecossistema: Emissor, Titular, Verificador, Sujeito, Controlador e Guardiao

## Abertura
Bem-vindo a aula 3.1! Agora que voce ja entende os fundamentos da identidade descentralizada, e hora de conhecer os atores que fazem esse ecossistema funcionar. Cada participante tem um papel especifico, com responsabilidades e capacidades distintas. Compreender esses papeis e essencial para projetar sistemas de identidade descentralizada que sejam seguros, eficientes e centrados no usuario.

### Programa da aula:
1. Os tres papeis fundamentais: Emissor, Titular e Verificador (introducao)
2. Papeis complementares: Sujeito, Controlador e Guardiao (base e aprofundamento)
3. Interacoes entre papeis e cenarios do mundo real (Conceito principal da aula)

---

## 1. Os Tres Papeis Fundamentais: Emissor, Titular e Verificador

### O Emissor (Issuer)
O Emissor e a entidade que cria e assina credenciais verificaveis. Ele atesta fatos sobre um sujeito, colocando sua reputacao em jogo ao emitir uma credencial. No mundo fisico, emissores sao organizacoes como governos (que emitem documentos de identidade), universidades (que emitem diplomas) e hospitais (que emitem atestados medicos).

No contexto da identidade descentralizada, o Emissor realiza as seguintes acoes:
- Verifica as informacoes antes de emitir a credencial (processo de due diligence)
- Cria a credencial verificavel com os atributos relevantes
- Assina digitalmente a credencial usando sua chave privada
- Entrega a credencial ao Titular

- **Exemplo**: Uma universidade federal verifica que um aluno concluiu todas as disciplinas do curso de Engenharia, cria uma credencial verificavel contendo o nome do aluno, o curso, a data de conclusao e o numero de registro, assina digitalmente com sua chave institucional e entrega ao graduado.

### O Titular (Holder)
O Titular e quem recebe, armazena e apresenta credenciais verificaveis. Na maioria dos casos, o Titular e o proprio sujeito da credencial, mas nem sempre — como veremos adiante. O Titular tem controle sobre suas credenciais e decide quando, para quem e quais informacoes compartilhar.

As responsabilidades do Titular incluem:
- Armazenar credenciais de forma segura em uma carteira digital
- Selecionar quais credenciais ou atributos apresentar em cada situacao
- Criar apresentacoes verificaveis a partir de suas credenciais
- Manter o controle sobre o compartilhamento de seus dados

- **Exemplo**: Joao recebe seu diploma digital da universidade e o armazena em sua carteira de identidade descentralizada. Quando se candidata a um emprego, Joao seleciona apenas as informacoes relevantes (curso e data de conclusao) e cria uma apresentacao verificavel para enviar ao recrutador, sem precisar revelar suas notas ou outras informacoes pessoais.

### O Verificador (Verifier)
O Verificador e a entidade que recebe e valida apresentacoes verificaveis. Ele precisa confirmar que a credencial e autentica, que nao foi alterada, que nao esta expirada ou revogada, e que foi emitida por um emissor confiavel. O ponto crucial e que o Verificador faz tudo isso sem precisar contactar o Emissor diretamente.

O processo de verificacao envolve:
- Receber a apresentacao verificavel do Titular
- Verificar a assinatura digital do Emissor usando registros publicos (como uma blockchain ou outro registro verificavel)
- Confirmar que a credencial nao foi revogada
- Validar que os atributos apresentados atendem aos requisitos da transacao

- **Exemplo**: Uma empresa de tecnologia recebe a apresentacao verificavel de Joao. O sistema da empresa verifica automaticamente a assinatura digital da universidade consultando o registro descentralizado, confirma que o diploma nao foi revogado e valida que Joao possui a formacao exigida para a vaga — tudo sem precisar ligar para a universidade.

---

## 2. Papeis Complementares: Sujeito, Controlador e Guardiao

### O Sujeito (Subject)
O Sujeito e a entidade sobre a qual a credencial faz afirmacoes. Embora na maioria dos cenarios o Sujeito e o Titular sejam a mesma pessoa, existem situacoes importantes em que isso nao ocorre. O Sujeito pode ser uma pessoa, uma organizacao, um dispositivo IoT ou ate mesmo um objeto fisico.

Cenarios em que Sujeito e Titular divergem:
- Um pai (Titular) que carrega credenciais de vacinacao de seu filho menor de idade (Sujeito)
- Um funcionario (Titular) que porta credenciais de certificacao da empresa (Sujeito)
- Um veterinario (Titular) que armazena o historico de vacinacao de um animal (Sujeito)

- **Exemplo**: Maria e mae de Pedro, de 5 anos. O pediatra emite uma credencial de vacinacao onde Pedro e o Sujeito, mas Maria e a Titular que armazena e apresenta essa credencial quando necessario, por exemplo ao matricular Pedro na escola.

### O Controlador (Controller)
O Controlador e a entidade autorizada a fazer alteracoes em um identificador descentralizado (DID) e seu documento DID associado. O Controlador pode adicionar ou revogar chaves criptograficas, atualizar endpoints de servico e gerenciar as permissoes do DID. Em muitos casos, o Controlador e o proprio Sujeito, mas organizacoes podem ter controladores delegados.

Funcoes do Controlador:
- Gerenciar chaves criptograficas associadas ao DID (rotacao, revogacao, adicao)
- Atualizar metadados do documento DID
- Definir politicas de autenticacao e autorizacao
- Delegar controle a outros agentes quando necessario

- **Exemplo**: Uma empresa possui um DID corporativo. O diretor de TI atua como Controlador, gerenciando as chaves criptograficas e definindo quais departamentos podem usar o DID para emitir credenciais em nome da organizacao. Se o diretor de TI sair da empresa, o controle e transferido para seu sucessor sem que o DID precise ser alterado.

### O Guardiao (Guardian)
O Guardiao e um papel critico para a inclusao digital. Ele atua em nome de individuos que nao podem gerenciar suas proprias identidades digitais de forma autonoma — como criancas, idosos, pessoas com deficiencia cognitiva ou refugiados sem acesso a tecnologia. O Guardiao tem responsabilidade fiduciaria sobre a identidade digital de outra pessoa.

Principios fundamentais da guardiania:
- O Guardiao age no melhor interesse do Sujeito protegido
- A guardiania deve ser temporaria sempre que possivel (ex: ate a crianca atingir a maioridade)
- Deve haver mecanismos de supervisao e prestacao de contas
- A transicao de controle para o Sujeito deve ser planejada e facilitada

- **Exemplo**: Uma ONG atua como Guardia de refugiados que chegam a um novo pais sem documentos. A ONG gerencia DIDs e credenciais em nome dessas pessoas ate que elas adquiram autonomia digital, garantindo acesso a servicos basicos como saude e educacao durante o periodo de transicao.

---

## 3. Interacoes Entre Papeis e Cenarios do Mundo Real

### Como os Papeis se Combinam
Na pratica, uma mesma entidade pode desempenhar multiplos papeis simultaneamente ou em momentos diferentes. Uma universidade pode ser Emissora de diplomas e, ao mesmo tempo, Verificadora de credenciais de identidade de seus alunos. Um governo pode ser Emissor de documentos, Verificador de credenciais de outros paises e Controlador de DIDs institucionais.

Combinacoes comuns de papeis:
- Governos: Emissor + Verificador + Controlador
- Empresas: Emissor (de crachas corporativos) + Verificador (de diplomas) + Titular (de certificacoes)
- Individuos: Titular + Sujeito + Controlador de seus proprios DIDs
- Organizacoes de tutela: Guardiao + Titular + Controlador (em nome de outros)

- **Exemplo**: O Banco Central do Brasil emite credenciais de autorizacao para instituicoes financeiras (papel de Emissor), verifica credenciais de compliance apresentadas por essas instituicoes (papel de Verificador) e controla seu proprio DID institucional (papel de Controlador).

### Fluxo Completo de uma Interacao
Para consolidar o entendimento, vamos acompanhar um fluxo completo envolvendo todos os papeis. Imagine o cenario de Ana, uma medica que precisa comprovar sua habilitacao profissional para atender em um novo hospital.

1. O Conselho Regional de Medicina (Emissor) verifica a formacao de Ana e emite uma credencial verificavel de registro profissional
2. Ana (Titular e Sujeito) armazena a credencial em sua carteira digital
3. Ana (Controladora) gerencia as chaves do seu DID pessoal
4. O hospital (Verificador) solicita prova de registro profissional
5. Ana cria uma apresentacao verificavel e a envia ao hospital
6. O hospital verifica a autenticidade sem contactar o Conselho diretamente

- **Exemplo**: Se Ana tivesse uma filha menor de idade que tambem precisasse de atendimento medico, Ana atuaria como Guardia da identidade digital de sua filha, apresentando credenciais de vacinacao (onde a filha e o Sujeito) em nome dela.

---

## Conclusao
Nesta aula, exploramos os seis papeis fundamentais do ecossistema de identidade descentralizada. O Emissor cria e assina credenciais, o Titular as armazena e apresenta, e o Verificador as valida. Alem disso, o Sujeito e sobre quem a credencial fala, o Controlador gerencia os identificadores descentralizados, e o Guardiao protege quem nao pode gerenciar sua propria identidade digital. Esses papeis se combinam e se sobrepoe em cenarios reais, criando um ecossistema flexivel e poderoso.

---

## Licao de Casa
1. Identifique tres situacoes do seu dia a dia em que voce atua como Titular, Sujeito e Controlador simultaneamente, e descreva quem seria o Emissor e o potencial Verificador em cada caso.
2. Pesquise um exemplo real de guardiania digital (pode ser de projetos como ID2020 ou UNHCR) e descreva como os papeis de Guardiao, Sujeito e Titular se distribuem nesse caso.
3. Desenhe um diagrama mostrando o fluxo de interacao entre todos os papeis em um cenario de sua escolha (ex: abertura de conta bancaria, matricula escolar, ou registro em plataforma de saude).

---

## Proxima Aula
Na proxima aula, vamos explorar o Triangulo da Confianca — o modelo que explica como o Verificador consegue validar uma credencial sem precisar contactar o Emissor diretamente, e por que isso e revolucionario para a privacidade e a escalabilidade. Ate la!

---

## Questionario

**1. Qual e a principal funcao do Emissor (Issuer) no ecossistema de identidade descentralizada?**
a) Armazenar credenciais em nome de terceiros
b) Verificar apresentacoes recebidas de titulares
c) Criar, assinar e entregar credenciais verificaveis atestando fatos sobre um sujeito
d) Gerenciar as chaves criptograficas de todos os participantes
**Resposta: c**

**2. Em qual situacao o Sujeito e o Titular de uma credencial NAO sao a mesma pessoa?**
a) Quando uma pessoa apresenta seu proprio diploma digital
b) Quando um pai carrega a credencial de vacinacao de seu filho menor de idade
c) Quando um funcionario apresenta seu proprio cracha digital
d) Quando uma pessoa faz login com seu DID pessoal
**Resposta: b**

**3. Qual e a diferenca fundamental entre o Controlador e o Guardiao?**
a) O Controlador gerencia chaves e metadados de um DID, enquanto o Guardiao age em nome de pessoas que nao podem gerenciar sua propria identidade
b) O Controlador e sempre uma pessoa fisica, enquanto o Guardiao e sempre uma organizacao
c) O Controlador atua temporariamente, enquanto o Guardiao atua permanentemente
d) Nao ha diferenca; sao termos sinonimos no ecossistema
**Resposta: a**

**4. Por que o Verificador nao precisa contactar o Emissor diretamente para validar uma credencial?**
a) Porque o Titular garante verbalmente a autenticidade
b) Porque o Verificador confia cegamente em qualquer credencial recebida
c) Porque a assinatura digital do Emissor pode ser verificada usando registros publicos descentralizados
d) Porque o governo central valida todas as credenciais automaticamente
**Resposta: c**

**5. Qual combinacao de papeis e mais comum para um cidadao individual no ecossistema de identidade descentralizada?**
a) Emissor + Verificador + Guardiao
b) Titular + Sujeito + Controlador do proprio DID
c) Apenas Sujeito, sem nenhum outro papel
d) Controlador + Emissor + Verificador
**Resposta: b**
