# Aula 8.2: Recuperacao de chaves: perda da carteira, social recovery, multisig

## Abertura
Bem-vindo a aula 8.2! Nesta aula, vamos enfrentar uma das questoes mais criticas da identidade descentralizada: o que acontece quando voce perde o acesso as suas chaves privadas? Diferente de sistemas tradicionais onde basta clicar em "esqueci minha senha", em sistemas descentralizados a perda de chaves pode significar a perda permanente da identidade. Vamos explorar as solucoes que tornam esse cenario gerenciavel.

### Programa da aula:
1. O problema da perda de chaves em sistemas descentralizados (introducao)
2. Social recovery e guardioes de confianca (base e aprofundamento)
3. Multisig e arquiteturas avancadas de recuperacao (Conceito principal da aula)

---

## 1. O problema da perda de chaves em sistemas descentralizados

### A responsabilidade do titular
Em sistemas de identidade descentralizada, o titular e o unico responsavel por suas chaves privadas. Nao existe um administrador de sistema para resetar credenciais, nao ha um helpdesk para ligar, e nao existe um formulario de recuperacao de conta. Essa e a contrapartida da soberania: com o controle total vem a responsabilidade total.

Estudos do setor de criptomoedas mostram a gravidade desse problema. Estima-se que aproximadamente 20% de todos os bitcoins ja minerados estao em carteiras inacessiveis porque os proprietarios perderam suas chaves. Isso representa bilhoes de dolares em valor permanentemente travado.

- **Exemplo**: James Howells, um engenheiro de TI do Reino Unido, jogou fora um disco rigido contendo as chaves privadas de 8.000 bitcoins em 2013. Desde entao, ele tenta obter permissao da prefeitura para escavar o aterro sanitario local. Ate hoje, os bitcoins permanecem inacessiveis.

### Cenarios de perda no contexto de identidade
No contexto de identidade descentralizada, a perda de chaves pode ocorrer de diversas formas:

- **Perda do dispositivo**: O smartphone onde a carteira de identidade esta instalada e roubado, danificado ou perdido.
- **Falha de hardware**: O dispositivo de armazenamento onde as chaves estao guardadas apresenta defeito.
- **Esquecimento da frase de recuperacao**: A seed phrase de 12 ou 24 palavras que permite restaurar a carteira e esquecida ou extraviada.
- **Morte ou incapacidade**: O titular falece ou fica incapacitado sem ter preparado mecanismos de heranca digital.

As consequencias vao muito alem de perder acesso a uma conta: o titular pode perder diplomas, certificacoes profissionais, historico medico, titulos de propriedade e toda a rede de credenciais construida ao longo de anos.

- **Exemplo**: Um medico que armazena sua credencial de registro no CRM como Verifiable Credential perde o smartphone e nao fez backup da seed phrase. Sem mecanismos de recuperacao, ele precisaria solicitar nova emissao de todas as suas credenciais — um processo que poderia levar semanas ou meses.

---

## 2. Social recovery e guardioes de confianca

### O conceito de social recovery
Social recovery e um mecanismo inspirado na forma como comunidades humanas naturalmente funcionam: quando alguem tem um problema, recorre a pessoas de confianca. Nesse modelo, o titular designa previamente um grupo de "guardioes" — pessoas ou entidades de confianca — que podem, coletivamente, autorizar a recuperacao de uma identidade.

O conceito foi popularizado por Vitalik Buterin em 2021, quando argumentou que social recovery oferece um equilibrio ideal entre seguranca e usabilidade. Diferente de uma seed phrase que pode ser roubada ou perdida, social recovery distribui a confianca entre multiplas partes.

- **Exemplo**: Alice configura cinco guardioes para sua carteira de identidade: sua mae, seu irmao, seu melhor amigo, seu advogado e uma empresa de custodia. Para recuperar a carteira, pelo menos tres dos cinco precisam aprovar. Nenhum guardiao individual pode acessar os dados de Alice.

### Como funciona tecnicamente
O funcionamento tecnico do social recovery envolve esquemas de compartilhamento de segredos (secret sharing), sendo o mais comum o esquema de Shamir (Shamir's Secret Sharing):

1. **Configuracao**: A chave privada do titular e dividida em N fragmentos usando polinomios matematicos. Cada guardiao recebe um fragmento.
2. **Limiar (threshold)**: Define-se um limiar K de N, significando que pelo menos K guardioes devem apresentar seus fragmentos para reconstruir a chave.
3. **Recuperacao**: Quando o titular perde acesso, contacta seus guardioes. Se K deles concordam, os fragmentos sao combinados para regenerar a chave privada.

A elegancia do esquema de Shamir e que K-1 fragmentos nao revelam absolutamente nada sobre a chave original. Mesmo que um atacante comprometa varios guardioes, se nao atingir o limiar, a chave permanece segura.

- **Exemplo**: Um esquema 3-de-5 significa que a chave e dividida em 5 partes e qualquer combinacao de 3 partes e suficiente para reconstruir a chave. Se dois guardioes perderem seus fragmentos, os tres restantes ainda podem realizar a recuperacao.

### Escolha e gestao de guardioes
A escolha dos guardioes e uma decisao critica que determina a seguranca do sistema:

**Criterios para bons guardioes:**
- Diversidade de relacionamentos (familia, amigos, profissionais)
- Diversidade geografica (evitar que todos estejam na mesma regiao)
- Competencia tecnica minima para guardar o fragmento com seguranca
- Baixa probabilidade de conluio entre guardioes

**Riscos a considerar:**
- Guardioes podem mudar de endereco, numero de telefone ou falecer
- Relacionamentos podem se deteriorar ao longo do tempo
- Guardioes podem ser coagidos a entregar seus fragmentos

- **Exemplo**: O protocolo Argent Wallet permite que usuarios designem guardioes que podem aprovar a recuperacao de conta por meio de transacoes na blockchain. Os guardioes podem ser trocados a qualquer momento pelo titular, permitindo atualizacao continua do circulo de confianca.

---

## 3. Multisig e arquiteturas avancadas de recuperacao

### Carteiras multisig para identidade
Multisig (multi-signature) e um mecanismo onde multiplas chaves privadas sao necessarias para autorizar uma operacao. Diferente do social recovery, que e acionado apenas em emergencias, multisig pode ser usado nas operacoes cotidianas, adicionando uma camada extra de seguranca.

Em uma configuracao multisig aplicada a identidade descentralizada, o DID do titular pode ser controlado por multiplas chaves distribuidas entre dispositivos ou partes. Isso significa que comprometer um unico dispositivo nao e suficiente para roubar a identidade.

- **Exemplo**: Um profissional configura um DID com multisig 2-de-3: uma chave no smartphone, uma no laptop e uma em um hardware wallet. Para atualizar o DID Document ou apresentar credenciais sensíveis, pelo menos duas dessas chaves devem assinar. Se o smartphone for roubado, as outras duas chaves permitem revogar a chave comprometida.

### Rotacao de chaves e DID Document
Uma vantagem fundamental dos DIDs sobre enderecos de blockchain tradicionais e a capacidade de rotacao de chaves. O DID permanece o mesmo, mas as chaves criptograficas associadas a ele podem ser atualizadas no DID Document.

Isso permite cenarios de recuperacao elegantes:

1. **Chave de recuperacao pre-configurada**: O titular registra uma chave de recuperacao separada no DID Document com permissao exclusiva para rotacionar as chaves principais.
2. **Atualizacao apos comprometimento**: Se a chave principal e comprometida, a chave de recuperacao e usada para atualizar o DID Document, substituindo a chave comprometida por uma nova.
3. **Continuidade da identidade**: Todas as credenciais vinculadas ao DID continuam validas porque o identificador nao mudou — apenas as chaves subjacentes.

- **Exemplo**: O metodo did:ion suporta multiplas chaves no DID Document, incluindo chaves de recuperacao. Se o titular perder acesso a chave principal, pode usar a chave de recuperacao (armazenada offline em local seguro) para publicar uma atualizacao que substitui a chave perdida por uma nova.

### Modelos hibridos e custodia assistida
Reconhecendo que nem todos os usuarios estao prontos para gerenciar suas proprias chaves, surgiram modelos hibridos que combinam descentralizacao com usabilidade:

**Custodia assistida (assisted custody)**: Uma entidade de confianca guarda uma copia de backup da chave do usuario, criptografada de forma que so pode ser acessada com a autorizacao do titular. Isso oferece uma "rede de seguranca" sem comprometer a soberania.

**MPC (Multi-Party Computation)**: A chave privada nunca existe completa em nenhum local. Em vez disso, fragmentos da chave sao distribuidos entre o dispositivo do usuario e servidores do provedor. As operacoes criptograficas sao realizadas de forma distribuida, sem que nenhuma parte tenha acesso a chave completa.

**Passkeys e WebAuthn**: A integracao com sistemas de autenticacao biometrica do dispositivo (Face ID, impressao digital) cria uma camada de usabilidade familiar ao usuario, enquanto por tras a criptografia de chaves assimetricas e mantida.

- **Exemplo**: A carteira Lit Protocol usa MPC para dividir a chave do usuario entre multiplos nodes. Quando o usuario quer assinar uma transacao, os nodes realizam uma computacao conjunta que produz a assinatura sem que nenhum node individual tenha acesso a chave completa. Se um node for comprometido, a chave permanece segura.

### Planejamento de heranca digital
Um aspecto frequentemente negligenciado e a heranca digital. O que acontece com a identidade descentralizada de uma pessoa apos seu falecimento? Sem planejamento, todas as credenciais e ativos digitais podem ser permanentemente perdidos.

Solucoes emergentes incluem:

- **Dead man's switch**: Mecanismos automaticos que transferem controle apos um periodo de inatividade.
- **Testamento digital**: Documentos legais que incluem instrucoes e fragmentos de recuperacao.
- **Time-locked recovery**: Guardioes podem iniciar recuperacao apos um periodo sem atividade do titular, com um prazo de contestacao.

- **Exemplo**: Um smart contract pode ser configurado para permitir que guardioes designados assumam controle de um DID se o titular nao realizar nenhuma transacao por 12 meses. O titular pode cancelar o processo a qualquer momento durante um periodo de graca de 30 dias.

---

## Conclusao
Nesta aula, enfrentamos um dos maiores desafios praticos da identidade descentralizada: a recuperacao de chaves. Vimos que a perda de chaves e um risco real com consequencias graves, mas que existem solucoes robustas. O social recovery distribui a confianca entre guardioes usando esquemas como Shamir's Secret Sharing. O multisig adiciona seguranca exigindo multiplas assinaturas para operacoes criticas. A rotacao de chaves nos DID Documents permite recuperacao sem perder a identidade. E modelos hibridos como MPC e custodia assistida tornam o sistema acessivel para usuarios menos tecnicos. A chave para a adocao em massa e oferecer seguranca sem sacrificar a usabilidade.

---

## Licao de Casa
1. Configure um esquema de guardioes hipotetico para sua identidade digital: escolha 5 guardioes e defina um limiar. Justifique suas escolhas considerando diversidade, confianca e risco de conluio.
2. Pesquise sobre Shamir's Secret Sharing e explique com suas palavras como e possivel que K-1 fragmentos nao revelem nenhuma informacao sobre o segredo original.
3. Reflita sobre heranca digital: como voce garantiria que seus familiares teriam acesso as suas credenciais digitais em caso de falecimento? Escreva um plano basico.

---

## Proxima Aula
Na proxima aula, vamos analisar as barreiras praticas para a adocao em massa da identidade descentralizada, incluindo desafios de experiencia do usuario (UX), interoperabilidade entre diferentes ecossistemas e custos de operacao. Ate la!

---

## Questionario

**1. Por que a perda de chaves e mais critica em sistemas descentralizados do que em sistemas tradicionais?**
a) Porque as chaves sao mais complexas de memorizar
b) Porque nao existe uma autoridade central capaz de resetar credenciais
c) Porque blockchains nao suportam criptografia de backup
d) Porque dispositivos moveis sao mais frageis que servidores
**Resposta: b**

**2. O que e o esquema de Shamir (Shamir's Secret Sharing)?**
a) Um protocolo para criptografar mensagens entre duas partes
b) Um metodo para dividir um segredo em fragmentos onde um subconjunto minimo e necessario para reconstrui-lo
c) Um algoritmo de compressao de dados para blockchains
d) Um sistema de autenticacao biometrica
**Resposta: b**

**3. Em uma configuracao multisig 2-de-3, quantas chaves sao necessarias para autorizar uma operacao?**
a) Apenas 1 chave
b) Pelo menos 2 das 3 chaves
c) Todas as 3 chaves
d) Nenhuma chave, apenas biometria
**Resposta: b**

**4. Qual e a principal vantagem da rotacao de chaves em DIDs?**
a) Permite mudar o identificador DID sem perder credenciais
b) Permite substituir chaves comprometidas sem perder a identidade, pois o DID permanece o mesmo
c) Acelera a velocidade de transacoes na blockchain
d) Elimina a necessidade de criptografia
**Resposta: b**

**5. O que e MPC (Multi-Party Computation) no contexto de gerenciamento de chaves?**
a) Um protocolo para minerar criptomoedas de forma colaborativa
b) Uma tecnica onde fragmentos da chave sao distribuidos e operacoes criptograficas sao realizadas sem que nenhuma parte tenha a chave completa
c) Um metodo para armazenar chaves em multiplos pen drives
d) Um sistema de votacao para aprovar transacoes
**Resposta: b**