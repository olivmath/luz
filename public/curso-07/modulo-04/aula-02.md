# Aula 4.2: Onde os dados ficam? Armazenamento on-chain (DIDs) vs. off-chain (dados pessoais e VCs)

## Abertura
Bem-vindo a aula 4.2! Uma das perguntas mais frequentes quando se estuda identidade descentralizada e: "mas onde exatamente os dados ficam armazenados?". A resposta envolve uma separacao arquitetural intencional entre o que vai para a blockchain (on-chain) e o que permanece fora dela (off-chain). Entender essa divisao e essencial para projetar sistemas que sejam ao mesmo tempo seguros, privados e escalaveis.

### Programa da aula:
1. Armazenamento on-chain: o que vai para a blockchain e por que (ancoragem de DIDs)
2. Armazenamento off-chain: dados pessoais, credenciais verificaveis e suas estrategias
3. Arquitetura hibrida: como on-chain e off-chain trabalham juntos na pratica

---

## 1. Armazenamento On-Chain

### O que e armazenado na blockchain
A blockchain, no contexto de identidade descentralizada, tem um papel muito especifico e deliberadamente limitado. Ela nao e um banco de dados generico; ela serve como ancora de confianca publica. Os dados que tipicamente vao para a blockchain incluem:

- **DIDs e referencias a DID Documents**: o registro do identificador e, em alguns metodos, o proprio DID Document ou um hash dele
- **Schemas de credenciais**: definicoes publicas de quais campos uma credencial contem
- **Definicoes de credenciais (Credential Definitions)**: no caso do Hyperledger Indy, associam um schema a um emissor especifico
- **Registros de revogacao**: informacoes sobre quais credenciais foram revogadas
- **Chaves publicas de emissores**: permitem que qualquer verificador valide credenciais sem contatar o emissor

- **Exemplo**: quando uma universidade decide emitir diplomas como credenciais verificaveis, ela primeiro registra na blockchain seu DID como emissor, o schema do diploma (nome, curso, data de conclusao) e sua credential definition. Esses dados sao publicos e imutaveis, permitindo que qualquer empregador no futuro possa verificar a autenticidade de um diploma sem precisar ligar para a universidade.

### Por que esses dados vao para a blockchain
A decisao de colocar esses dados on-chain nao e arbitraria. Existem razoes tecnicas e estrategicas claras:

**Imutabilidade**: uma vez registrado, o DID de um emissor nao pode ser adulterado. Isso cria uma base de confianca solida.

**Disponibilidade global**: qualquer pessoa no mundo pode resolver um DID e verificar uma credencial sem depender de um servidor especifico estar online.

**Auditabilidade**: o historico de alteracoes em um DID Document (rotacao de chaves, por exemplo) fica registrado de forma transparente.

**Resistencia a censura**: nenhuma entidade individual pode impedir o acesso a esses registros publicos.

- **Exemplo**: se um governo autoritario tentasse invalidar as credenciais profissionais de um dissidente, a natureza descentralizada e imutavel da blockchain impediria essa acao. As credenciais poderiam ser verificadas por qualquer pessoa com acesso a rede, independentemente de pressoes politicas.

E crucial notar que dados pessoais NUNCA devem ir para a blockchain. A imutabilidade que e uma vantagem para registros publicos torna-se um problema grave quando aplicada a dados pessoais, especialmente considerando regulamentacoes como a LGPD e o GDPR que garantem o direito ao esquecimento.

---

## 2. Armazenamento Off-Chain

### Dados pessoais e privacidade
Todos os dados pessoais no ecossistema de identidade descentralizada sao mantidos off-chain, ou seja, fora da blockchain. Isso inclui:

- **Credenciais verificaveis (VCs)**: documentos digitais assinados contendo atributos do sujeito
- **Dados biometricos**: impressoes digitais, reconhecimento facial, etc.
- **Informacoes de contato**: email, telefone, endereco
- **Historico de interacoes**: registros de quais credenciais foram apresentadas e para quem
- **Chaves privadas**: material criptografico que nunca deve ser exposto

O armazenamento off-chain acontece em diferentes locais dependendo da implementacao:

**Carteira local do usuario**: os dados ficam no dispositivo (celular, computador). Maximo controle, mas risco de perda.

**Armazenamento pessoal na nuvem**: servicos como Personal Data Stores (ex: Solid Pods) onde o usuario controla o acesso.

**Agentes em nuvem**: servidores que armazenam dados criptografados em nome do usuario, acessiveis apenas com suas chaves.

- **Exemplo**: Maria recebe uma credencial verificavel do Detran atestando sua habilitacao. Essa VC fica armazenada exclusivamente em seu aplicativo de carteira no celular. O Detran nao mantem uma copia, e a blockchain so contem o DID do Detran e o schema da credencial. Quando Maria precisa provar que tem habilitacao, ela apresenta a VC diretamente de sua carteira para o verificador.

### Credenciais Verificaveis e seu ciclo de vida off-chain
As credenciais verificaveis sao o principal tipo de dado que vive off-chain. Seu ciclo de vida ilustra bem a logica da separacao:

1. **Emissao**: o emissor cria a VC, assina com sua chave privada e entrega ao titular. A VC nao e registrada na blockchain.
2. **Armazenamento**: o titular guarda a VC em sua carteira digital. Ele decide onde e como armazenar.
3. **Apresentacao**: quando solicitado, o titular cria uma apresentacao verificavel (VP) contendo uma ou mais VCs e a envia ao verificador.
4. **Verificacao**: o verificador usa informacoes on-chain (DID do emissor, schema, status de revogacao) para validar a VC recebida.

- **Exemplo**: um banco emite uma credencial de "cliente verificado" (KYC) para Joao. A credencial fica na carteira de Joao. Quando ele quer abrir conta em uma corretora, apresenta essa credencial. A corretora verifica a assinatura do banco consultando o DID do banco na blockchain. Em nenhum momento os dados pessoais de Joao tocam a blockchain.

A beleza desse modelo e que os dados pessoais permanecem sob controle do titular, enquanto a infraestrutura de verificacao publica garante a confiabilidade sem expor informacoes sensiveis.

---

## 3. Arquitetura Hibrida: On-Chain e Off-Chain Juntos

### Como os dois mundos se conectam
A arquitetura de identidade descentralizada e fundamentalmente hibrida. Nenhum dos lados funciona sozinho. A blockchain fornece a ancora de confianca, e o armazenamento off-chain fornece privacidade e escalabilidade.

O fluxo tipico de interacao demonstra essa integracao:

1. Emissor registra DID e schemas **on-chain** (uma vez)
2. Emissor cria e entrega VC ao titular **off-chain** (peer-to-peer)
3. Titular armazena VC em sua carteira **off-chain** (local)
4. Verificador solicita apresentacao **off-chain** (peer-to-peer)
5. Titular cria e envia VP ao verificador **off-chain** (peer-to-peer)
6. Verificador consulta DID e revogacao **on-chain** (leitura publica)
7. Verificador valida assinaturas e atributos **off-chain** (local)

- **Exemplo**: considere um sistema de saude digital. O Ministerio da Saude registra seu DID e o schema de carteira de vacinacao na blockchain (on-chain). Um posto de saude, usando o DID do Ministerio, emite uma VC de vacinacao para o cidadao (off-chain). O cidadao armazena na carteira (off-chain). Ao viajar, apresenta a VC na imigracao (off-chain). A imigracao verifica o DID do Ministerio e o status de revogacao (on-chain) e valida a assinatura (off-chain).

### Estrategias de revogacao
A revogacao de credenciais e um caso interessante da interacao on-chain/off-chain. Existem diferentes abordagens:

**Listas de revogacao on-chain**: o emissor publica na blockchain um registro de credenciais revogadas. Simples, mas pode comprometer privacidade se nao for bem implementado.

**Acumuladores criptograficos**: tecnicas como o acumulador de Merkle permitem verificar se uma credencial foi revogada sem revelar quais outras credenciais existem. Usado no Hyperledger Indy.

**Status lists compactadas**: o W3C define o Bitstring Status List, onde cada credencial corresponde a um bit em uma lista. Eficiente e razoavelmente privado.

- **Exemplo**: usando acumuladores criptograficos, quando o CRM revoga a licenca de um medico, ele atualiza o acumulador na blockchain. Qualquer hospital pode verificar se a credencial do medico ainda e valida consultando o acumulador, mas nao consegue descobrir quais outros medicos tiveram credenciais revogadas. A privacidade dos demais profissionais e preservada.

### Desafios e trade-offs
A arquitetura hibrida nao e perfeita e envolve decisoes de design importantes:

- **Backup e recuperacao**: se o usuario perde o celular, perde suas credenciais off-chain. Solucoes incluem backups criptografados em nuvem e social recovery.
- **Correlacao**: mesmo com dados off-chain, padroes de acesso on-chain podem revelar informacoes sobre o comportamento do usuario.
- **Consistencia**: garantir que o estado off-chain (credencial valida) e o estado on-chain (nao revogada) estejam sincronizados.

---

## Conclusao
A separacao entre armazenamento on-chain e off-chain e uma decisao arquitetural fundamental na identidade descentralizada. On-chain ficam os dados publicos de infraestrutura: DIDs de emissores, schemas, definicoes de credenciais e registros de revogacao. Off-chain ficam todos os dados pessoais: credenciais verificaveis, chaves privadas e informacoes sensiveis. Essa divisao garante que a privacidade do individuo seja preservada enquanto a verificabilidade publica e mantida. Compreender essa arquitetura e essencial para projetar e avaliar qualquer solucao de identidade descentralizada.

---

## Licao de Casa
1. Desenhe um diagrama mostrando o fluxo completo de emissao, armazenamento e verificacao de uma credencial verificavel, indicando claramente quais etapas sao on-chain e quais sao off-chain.
2. Pesquise sobre o conceito de Personal Data Store (ex: Solid Pods do Tim Berners-Lee) e explique como ele se relaciona com o armazenamento off-chain de credenciais verificaveis.
3. Analise como a LGPD (Lei Geral de Protecao de Dados) se aplica a arquitetura hibrida. Quais artigos da lei justificam a decisao de manter dados pessoais fora da blockchain?

---

## Proxima Aula
Na proxima aula, vamos aprofundar o papel da blockchain e de outras tecnologias de ledger distribuido (DLT) na identidade descentralizada, entendendo quando elas sao realmente necessarias e quando podem ser substituidas por alternativas mais simples. Ate la!

---

## Questionario

**1. Por que dados pessoais NAO devem ser armazenados na blockchain?**
a) Porque a blockchain e lenta demais para processar dados pessoais
b) Porque a imutabilidade da blockchain conflita com o direito ao esquecimento e regulamentacoes como LGPD/GDPR
c) Porque a blockchain nao suporta o formato de credenciais verificaveis
d) Porque os mineradores teriam acesso a todos os dados pessoais
**Resposta: b**

**2. Quais dos seguintes dados sao tipicamente armazenados on-chain?**
a) Credenciais verificaveis completas com dados pessoais do titular
b) Chaves privadas dos usuarios e seus backups
c) DIDs de emissores, schemas de credenciais e registros de revogacao
d) Historico de apresentacoes de credenciais entre titular e verificador
**Resposta: c**

**3. O que e um acumulador criptografico no contexto de revogacao de credenciais?**
a) Um dispositivo de hardware que armazena credenciais revogadas
b) Uma tecnica que permite verificar a revogacao de uma credencial sem revelar informacoes sobre outras credenciais
c) Um tipo de blockchain especifico para gerenciar revogacoes
d) Um algoritmo que acumula todas as credenciais emitidas por um emissor
**Resposta: b**

**4. Em qual etapa do fluxo de verificacao de uma credencial o verificador precisa consultar dados on-chain?**
a) Ao receber a apresentacao verificavel do titular
b) Ao descriptografar os dados pessoais contidos na credencial
c) Ao resolver o DID do emissor e verificar o status de revogacao
d) Ao armazenar o resultado da verificacao em seu banco de dados
**Resposta: c**

**5. Qual e o principal risco do armazenamento exclusivamente local (off-chain no dispositivo) de credenciais verificaveis?**
a) As credenciais ficam visiveis para qualquer pessoa com acesso a rede
b) O usuario perde todas as credenciais se perder o dispositivo, a menos que tenha backup
c) As credenciais expiram automaticamente apos 24 horas
d) O emissor pode modificar a credencial remotamente sem consentimento do titular
**Resposta: b**
