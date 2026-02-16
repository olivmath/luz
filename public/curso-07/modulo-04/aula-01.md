# Aula 4.1: Componentes principais: DIDs, DID Documents, resolvers, registros (VDRs), carteiras (wallets) e agentes

## Abertura
Bem-vindo a aula 4.1! Agora que voce ja compreende os fundamentos conceituais da identidade descentralizada, e hora de mergulhar na arquitetura tecnica que sustenta esse ecossistema. Nesta aula, vamos dissecar cada componente principal, entender sua funcao especifica e como todos se conectam para formar um sistema coeso de identidade auto-soberana.

### Programa da aula:
1. DIDs e DID Documents (a base da identidade descentralizada)
2. Resolvers e Registros Verificaveis de Dados (a infraestrutura de confianca)
3. Carteiras e Agentes (a interface do usuario com o ecossistema)

---

## 1. DIDs e DID Documents

### O que e um DID (Decentralized Identifier)
Um DID e um identificador unico, globalmente resolvivel e controlado pelo proprio sujeito, sem depender de nenhuma autoridade centralizada. Diferente de um email ou CPF, o DID e criado e gerenciado pelo individuo ou organizacao que ele representa.

A estrutura de um DID segue o formato padronizado pela W3C:

```
did:metodo:identificador-especifico
```

Cada parte tem uma funcao clara:
- **did**: o esquema fixo que indica tratar-se de um identificador descentralizado
- **metodo**: especifica qual rede ou sistema e utilizado (ex: `ethr`, `key`, `web`, `ion`)
- **identificador-especifico**: a string unica dentro daquele metodo

- **Exemplo**: `did:ethr:0x1234abcd5678ef90` identifica um sujeito na rede Ethereum. Ja `did:web:empresa.com.br` utiliza a infraestrutura web tradicional como ancora de confianca.

Um ponto fundamental: o DID em si nao contem dados pessoais. Ele e apenas um ponteiro que leva ao DID Document, onde estao as informacoes tecnicas necessarias para interacao.

### O que e um DID Document
O DID Document e o recurso retornado quando um DID e resolvido. Ele contem metadados tecnicos essenciais para que terceiros possam interagir com o sujeito do DID de forma segura.

Um DID Document tipicamente inclui:
- **Chaves publicas**: utilizadas para verificacao de assinaturas e autenticacao
- **Metodos de autenticacao**: quais mecanismos o sujeito aceita para provar identidade
- **Endpoints de servico**: URLs onde o sujeito pode ser contatado ou onde servicos estao disponiveis
- **Delegacoes e controladores**: quem tem permissao para alterar o DID Document

- **Exemplo**: imagine que Alice cria um DID. Seu DID Document contem sua chave publica Ed25519, um endpoint para mensagens DIDComm e uma referencia ao servico de credenciais verificaveis que ela utiliza. Quando Bob quer enviar uma mensagem criptografada para Alice, ele resolve o DID dela, obtem a chave publica do Document e criptografa a mensagem.

O DID Document nao e armazenado de forma centralizada. Dependendo do metodo DID, ele pode estar em uma blockchain, em um servidor web ou ate mesmo ser derivado criptograficamente do proprio DID (como no caso do `did:key`).

---

## 2. Resolvers e Registros Verificaveis de Dados

### DID Resolvers
O resolver e o componente de software responsavel por receber um DID como entrada e retornar o DID Document correspondente. Ele funciona de forma analoga ao DNS na internet tradicional: voce fornece um nome (o DID) e recebe de volta as informacoes necessarias para interagir com o sujeito.

O processo de resolucao segue etapas bem definidas:
1. O resolver recebe o DID e identifica o metodo (ex: `ethr`, `web`, `ion`)
2. Ele aciona o driver especifico para aquele metodo
3. O driver consulta o registro subjacente (blockchain, servidor web, etc.)
4. O DID Document e retornado em formato JSON-LD ou JSON puro

- **Exemplo**: o Universal Resolver e uma implementacao de referencia que agrega multiplos drivers de metodos DID. Ele pode resolver `did:ethr`, `did:web`, `did:ion` e dezenas de outros metodos atraves de uma unica interface HTTP. Organizacoes podem hospedar seu proprio Universal Resolver para nao depender de terceiros.

Os resolvers podem ser locais (executados no dispositivo do usuario), remotos (acessados via API) ou hibridos. A escolha impacta diretamente privacidade e performance.

### Registros Verificaveis de Dados (VDRs)
O Verifiable Data Registry (VDR) e o sistema onde os DIDs sao ancorados e de onde os DID Documents podem ser recuperados. Ele fornece a camada de confianca e persistencia do ecossistema.

Diferentes tipos de VDR existem:
- **Blockchains publicas**: Ethereum, Bitcoin (via ION), Hyperledger Indy. Oferecem imutabilidade e descentralizacao maxima.
- **Redes permissionadas**: Sovrin Network, redes corporativas Hyperledger. Equilibram controle e descentralizacao.
- **Sistemas web**: did:web utiliza servidores web tradicionais. Menor descentralizacao, mas alta praticidade.
- **Redes peer-to-peer**: IPFS, redes DHT. Descentralizacao sem blockchain.

- **Exemplo**: na Sovrin Network, quando um emissor de credenciais registra seu DID, o registro e gravado no ledger publico. Qualquer verificador no mundo pode resolver esse DID e confirmar a autenticidade do emissor sem precisar contatá-lo diretamente.

A escolha do VDR impacta custo, velocidade, privacidade e nivel de descentralizacao. Nao existe uma opcao universalmente superior; cada caso de uso demanda uma analise especifica.

---

## 3. Carteiras (Wallets) e Agentes

### Carteiras de Identidade Digital
A carteira digital (identity wallet) e o componente que o usuario final mais diretamente utiliza. Ela armazena e gerencia chaves privadas, DIDs e credenciais verificaveis de forma segura.

Funcoes principais de uma carteira de identidade:
- **Gerenciamento de chaves**: criacao, armazenamento e rotacao de pares de chaves criptograficas
- **Armazenamento de credenciais**: guarda credenciais verificaveis emitidas por terceiros
- **Apresentacao seletiva**: permite ao usuario compartilhar apenas os atributos necessarios
- **Backup e recuperacao**: mecanismos para nao perder o acesso em caso de perda do dispositivo

- **Exemplo**: a carteira digital de um profissional de saude pode conter seu DID pessoal, uma credencial verificavel emitida pelo conselho de medicina (CRM digital), uma credencial do hospital onde trabalha e uma certificacao de especializacao. Ao atender em um novo hospital, ele apresenta apenas as credenciais relevantes diretamente de sua carteira.

Carteiras podem ser implementadas como aplicativos moveis (ex: Microsoft Authenticator, Trinsic Wallet), extensoes de navegador, dispositivos de hardware (similar a hardware wallets de criptomoedas) ou ate mesmo carteiras custodiadas por terceiros.

### Agentes
O agente e o componente de software que atua em nome do sujeito, gerenciando comunicacoes, processando protocolos e executando operacoes criptograficas. Enquanto a carteira e o cofre, o agente e o assistente que sabe como usar o que esta no cofre.

Tipos de agentes no ecossistema:
- **Edge agents**: executam no dispositivo do usuario (celular, computador). Tem acesso direto as chaves privadas.
- **Cloud agents**: executam em servidores, oferecendo disponibilidade 24/7. Uteis para organizacoes.
- **Mediator agents**: intermediam comunicacoes entre agentes que nao podem se conectar diretamente (ex: quando o celular esta offline).

- **Exemplo**: quando uma empresa quer verificar a credencial de um candidato a emprego, o agente da empresa envia uma requisicao de apresentacao (presentation request) para o agente do candidato. O agente do candidato consulta a carteira, monta a apresentacao verificavel com as credenciais solicitadas e envia de volta ao agente da empresa, que valida tudo automaticamente.

A relacao entre carteira e agente e simbiotica: a carteira cuida do armazenamento seguro, e o agente cuida da logica de interacao. Em muitas implementacoes, ambos sao integrados em um unico aplicativo.

---

## Conclusao
Nesta aula, mapeamos os seis componentes fundamentais da arquitetura de identidade descentralizada. Os DIDs fornecem identificadores unicos e auto-soberanos. Os DID Documents carregam os metadados tecnicos para interacao. Os resolvers fazem a ponte entre um DID e seu Document. Os VDRs fornecem a camada de persistencia e confianca. As carteiras armazenam chaves e credenciais de forma segura. E os agentes executam a logica de comunicacao e verificacao. Juntos, esses componentes formam um ecossistema onde o individuo tem controle real sobre sua identidade digital.

---

## Licao de Casa
1. Pesquise tres metodos DID diferentes (ex: did:ethr, did:web, did:key) e compare suas caracteristicas em termos de descentralizacao, custo e facilidade de implementacao.
2. Acesse o Universal Resolver (https://dev.uniresolver.io) e resolva pelo menos dois DIDs de exemplo. Analise a estrutura dos DID Documents retornados.
3. Compare duas carteiras de identidade digital disponiveis no mercado (ex: Trinsic Wallet, Sphereon Wallet) e liste as funcionalidades que cada uma oferece.

---

## Proxima Aula
Na proxima aula, vamos explorar onde os dados realmente ficam nesse ecossistema, diferenciando o que e armazenado on-chain e o que permanece off-chain, e por que essa separacao e fundamental para privacidade e escalabilidade. Ate la!

---

## Questionario

**1. Qual e a funcao principal de um DID Document?**
a) Armazenar os dados pessoais do usuario de forma criptografada
b) Conter metadados tecnicos como chaves publicas e endpoints de servico para interacao segura
c) Registrar transacoes financeiras associadas ao DID
d) Servir como backup da carteira digital do usuario
**Resposta: b**

**2. O que diferencia um edge agent de um cloud agent?**
a) O edge agent so funciona com blockchain, enquanto o cloud agent funciona com qualquer VDR
b) O edge agent executa no dispositivo do usuario com acesso direto as chaves, enquanto o cloud agent executa em servidores remotos
c) O edge agent e gratuito e o cloud agent e pago
d) O edge agent nao pode armazenar credenciais verificaveis
**Resposta: b**

**3. Qual das seguintes opcoes NAO e um tipo de Verifiable Data Registry (VDR)?**
a) Blockchain publica como Ethereum
b) Servidor web utilizado pelo metodo did:web
c) O aplicativo de carteira digital no celular do usuario
d) Rede permissionada como a Sovrin Network
**Resposta: c**

**4. No formato de um DID (did:metodo:identificador), qual e a funcao do componente "metodo"?**
a) Identificar o nome do usuario dono do DID
b) Especificar qual rede ou sistema e utilizado para resolver o DID
c) Criptografar o identificador para proteger a privacidade
d) Indicar a data de criacao do DID
**Resposta: b**

**5. Qual e a relacao entre carteira (wallet) e agente no ecossistema de identidade descentralizada?**
a) Sao a mesma coisa com nomes diferentes
b) A carteira armazena chaves e credenciais de forma segura, enquanto o agente gerencia comunicacoes e executa a logica de interacao
c) O agente substitui a carteira em implementacoes mais modernas
d) A carteira e usada apenas para criptomoedas e o agente e para identidade
**Resposta: b**
