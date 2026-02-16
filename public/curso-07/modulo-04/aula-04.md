# Aula 4.4: Fluxo completo de criacao, resolucao e verificacao de um DID (visao conceitual)

## Abertura
Bem-vindo a aula 4.4! Nas aulas anteriores, estudamos cada componente da arquitetura de identidade descentralizada de forma individual. Agora e hora de conectar tudo em um fluxo unico e coerente. Vamos acompanhar, passo a passo, o ciclo de vida completo de um DID: desde a geracao das chaves criptograficas ate o momento em que um verificador valida uma credencial. Esta visao conceitual integrada consolidara todo o conhecimento deste modulo.

### Programa da aula:
1. Criacao de um DID (geracao de chaves, construcao do DID Document e registro)
2. Resolucao de um DID (como um terceiro obtem o DID Document)
3. Verificacao completa (emissao, apresentacao e validacao de credenciais)

---

## 1. Criacao de um DID

### Geracao do par de chaves criptograficas
Tudo comeca com criptografia. O sujeito (pessoa, organizacao ou dispositivo) precisa gerar um par de chaves assimetricas. A chave privada e o elemento de controle absoluto; quem a possui, controla o DID. A chave publica sera compartilhada no DID Document.

O processo de geracao envolve:
1. **Escolha do algoritmo**: os mais comuns sao Ed25519 (rapido e seguro), secp256k1 (compativel com Ethereum/Bitcoin) e P-256 (amplamente suportado)
2. **Geracao aleatoria**: usando um gerador de numeros aleatorios criptograficamente seguro (CSPRNG)
3. **Armazenamento seguro**: a chave privada e guardada na carteira digital, idealmente em um enclave seguro do dispositivo (TEE/SE)

- **Exemplo**: Alice abre seu aplicativo de carteira digital pela primeira vez. O aplicativo gera automaticamente um par de chaves Ed25519. A chave privada fica armazenada no Secure Enclave do seu iPhone, protegida por biometria. A chave publica sera usada para construir seu DID e DID Document.

A seguranca de todo o ecossistema depende fundamentalmente da protecao da chave privada. Se ela for comprometida, o atacante assume o controle total do DID. Por isso, boas praticas incluem uso de hardware seguro, backups criptografados e mecanismos de rotacao de chaves.

### Construcao do DID Document
Com o par de chaves gerado, o proximo passo e construir o DID Document. Este documento JSON-LD contem todas as informacoes que terceiros precisam para interagir com o sujeito:

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:example:123456789abcdef",
  "authentication": [{
    "id": "did:example:123456789abcdef#keys-1",
    "type": "Ed25519VerificationKey2020",
    "controller": "did:example:123456789abcdef",
    "publicKeyMultibase": "z6Mkf5rGMoatrSj1f..."
  }],
  "service": [{
    "id": "did:example:123456789abcdef#messaging",
    "type": "DIDCommMessaging",
    "serviceEndpoint": "https://agent.alice.example.com"
  }]
}
```

Cada secao tem uma funcao especifica:
- **id**: o proprio DID, identificador unico do sujeito
- **authentication**: metodos que podem ser usados para provar que o sujeito controla este DID
- **service**: endpoints onde o sujeito pode ser contatado

- **Exemplo**: uma clinica medica constroi seu DID Document incluindo duas chaves de autenticacao (uma principal e uma de backup), um endpoint DIDComm para receber solicitacoes de verificacao de credenciais, e um endpoint de servico apontando para seu portal de agendamento. Isso permite que pacientes e outros profissionais interajam com a clinica de forma segura e padronizada.

### Registro (ancoragem) do DID
O ultimo passo da criacao e o registro do DID no Verifiable Data Registry (VDR) escolhido. Esse processo varia conforme o metodo DID:

**Para did:ethr (Ethereum)**:
1. Uma transacao e enviada ao contrato inteligente ERC-1056 na rede Ethereum
2. A transacao associa o endereco Ethereum ao DID Document (ou a um hash dele)
3. A transacao e minerada e confirmada, tornando o registro imutavel

**Para did:web**:
1. O DID Document e salvo como arquivo JSON no servidor web
2. O arquivo e publicado em `/.well-known/did.json`
3. O servidor deve ter HTTPS configurado com certificado valido

**Para did:key**:
1. Nao ha registro externo
2. O DID e a propria chave publica codificada
3. O DID Document e derivado algoritmicamente quando necessario

- **Exemplo**: o Conselho Federal de Medicina decide registrar seu DID institucional. Eles optam por did:ethr para maxima permanencia. Uma transacao e enviada a rede Ethereum registrando o DID e o hash do DID Document. O custo e de poucos dolares em gas, mas o registro sera acessivel globalmente e de forma permanente. Simultaneamente, eles publicam uma versao did:web para facilitar resolucao rapida no dia a dia.

---

## 2. Resolucao de um DID

### O processo de resolucao passo a passo
A resolucao e o processo inverso da criacao: dado um DID, obter o DID Document correspondente. E o equivalente a digitar um dominio no navegador e o DNS retornar o endereco IP.

O fluxo completo de resolucao:

1. **Recebimento do DID**: o resolver recebe uma string como `did:ethr:0x1234...abcd`
2. **Parsing do metodo**: o resolver identifica que o metodo e `ethr`
3. **Selecao do driver**: o resolver ativa o driver especifico para o metodo `ethr`
4. **Consulta ao VDR**: o driver consulta o contrato ERC-1056 na rede Ethereum
5. **Construcao do DID Document**: o driver monta o DID Document a partir dos dados obtidos
6. **Retorno**: o DID Document completo e retornado ao solicitante

- **Exemplo**: Bob recebe um email assinado digitalmente por Alice. O email contem o DID de Alice: `did:web:alice.exemplo.com`. O resolver de Bob acessa `https://alice.exemplo.com/.well-known/did.json`, obtem o DID Document, extrai a chave publica de Alice e verifica a assinatura do email. Todo esse processo acontece em fracao de segundo.

### Resolucao universal vs. resolucao especifica
Existem duas abordagens principais para implementar resolvers:

**Resolver universal**: suporta multiplos metodos DID atraves de uma arquitetura de plugins (drivers). O Universal Resolver da DIF (Decentralized Identity Foundation) e a implementacao de referencia.

Vantagens do resolver universal:
- Um unico ponto de integracao para todos os metodos DID
- Comunidade ativa mantendo drivers atualizados
- Facilita interoperabilidade entre diferentes ecossistemas

**Resolver especifico**: implementado para um unico metodo DID, otimizado para performance e simplicidade.

- **Exemplo**: uma empresa que opera exclusivamente com did:web pode implementar um resolver especifico que simplesmente faz requisicoes HTTPS. Ja uma plataforma governamental que precisa verificar credenciais de multiplos paises e emissores pode optar pelo Universal Resolver para suportar did:ethr, did:web, did:ion e outros metodos simultaneamente.

### Metadados de resolucao
Alem do DID Document, o processo de resolucao retorna metadados importantes:

- **DID Resolution Metadata**: informacoes sobre o processo (tempo de resposta, tipo de conteudo, erros)
- **DID Document Metadata**: informacoes sobre o Document (data de criacao, data de atualizacao, versao, status de desativacao)

Esses metadados sao cruciais para tomar decisoes de confianca. Um DID Document atualizado recentemente pode indicar rotacao de chaves, enquanto um DID desativado sinaliza que nao deve mais ser utilizado.

- **Exemplo**: ao resolver o DID de um hospital, o verificador nota nos metadados que o DID Document foi atualizado ha 2 dias. Consultando o historico, descobre que uma chave foi rotacionada. Isso e normal e esperado como boa pratica de seguranca, mas se o DID Document mostra status "deactivated", o verificador sabe que nao deve confiar em credenciais emitidas por esse DID apos a data de desativacao.

---

## 3. Verificacao Completa

### Fluxo integrado: da emissao a validacao
Agora vamos unir criacao e resolucao em um fluxo completo de uso real: a emissao e verificacao de uma credencial verificavel. Este e o cenario que da sentido pratico a toda a arquitetura.

**Preparacao (pre-requisitos)**:
1. O emissor (ex: universidade) ja criou e registrou seu DID
2. O titular (ex: estudante) ja criou seu DID e tem uma carteira ativa
3. O verificador (ex: empresa contratante) tem um resolver configurado

**Etapa 1 - Emissao da credencial**:
1. O estudante conclui a graduacao
2. A universidade cria uma credencial verificavel (VC) contendo: nome do estudante, curso, data de conclusao, DID do estudante
3. A universidade assina a VC com sua chave privada
4. A VC e transmitida ao estudante via DIDComm ou outro canal seguro
5. O estudante armazena a VC em sua carteira digital

- **Exemplo**: a Universidade de Sao Paulo emite um diploma digital como VC para Maria. A VC contem `"issuer": "did:ethr:0xUSP..."`, `"credentialSubject": {"id": "did:key:z6Mk...Maria", "degree": "Ciencia da Computacao"}`. A USP assina com sua chave privada e envia para a carteira de Maria.

**Etapa 2 - Solicitacao de apresentacao**:
1. Maria se candidata a uma vaga em uma empresa de tecnologia
2. A empresa envia uma presentation request especificando quais credenciais precisa
3. O agente de Maria recebe a solicitacao e notifica Maria
4. Maria seleciona a credencial relevante em sua carteira e autoriza o compartilhamento

**Etapa 3 - Criacao da apresentacao verificavel**:
1. O agente de Maria cria uma Verifiable Presentation (VP) contendo a VC do diploma
2. Maria assina a VP com sua chave privada, provando que ela e a titular
3. A VP e enviada ao agente da empresa

**Etapa 4 - Verificacao pela empresa**:
1. A empresa extrai o DID do emissor (USP) da VC
2. O resolver da empresa resolve `did:ethr:0xUSP...` e obtem o DID Document da USP
3. A empresa extrai a chave publica da USP do DID Document
4. A empresa verifica a assinatura digital da VC usando a chave publica da USP
5. A empresa verifica o status de revogacao consultando o registro on-chain
6. A empresa verifica a assinatura da VP usando o DID de Maria
7. Todas as verificacoes passam: a credencial e valida e autentica

- **Exemplo**: o sistema de RH da empresa executa automaticamente todos os 7 passos em menos de 2 segundos. O resultado e uma confirmacao verde: "Diploma valido, emitido pela USP em 15/12/2024, nao revogado". Maria e contratada sem que a empresa tenha precisado ligar para a USP ou esperar semanas por confirmacao manual.

### Pontos criticos de seguranca no fluxo
Cada etapa do fluxo tem vulnerabilidades potenciais que devem ser consideradas:

- **Comprometimento da chave do emissor**: se a chave privada da universidade for roubada, credenciais fraudulentas podem ser emitidas. Mitigacao: rotacao frequente de chaves e monitoramento.
- **Replay attacks**: um atacante poderia reutilizar uma VP capturada. Mitigacao: uso de nonces e timestamps nas apresentacoes.
- **Correlacao de identidade**: se Maria usa o mesmo DID em todas as interacoes, suas atividades podem ser rastreadas. Mitigacao: uso de DIDs pairwise (diferentes para cada relacao).
- **Verificacao de revogacao offline**: se o verificador nao conseguir acessar o registro de revogacao, pode aceitar uma credencial ja revogada. Mitigacao: politicas de cache e fallback.

---

## Conclusao
Nesta aula, percorremos o ciclo de vida completo de um DID e sua utilizacao pratica. A criacao envolve geracao de chaves, construcao do DID Document e registro no VDR. A resolucao transforma o DID de volta no DID Document, permitindo interacao segura. A verificacao integra todo o ecossistema em um fluxo onde credenciais sao emitidas, apresentadas e validadas sem intermediarios centralizados. Esse fluxo completo demonstra como todos os componentes estudados neste modulo trabalham juntos para criar um sistema de identidade verdadeiramente descentralizado e centrado no usuario.

---

## Licao de Casa
1. Desenhe um diagrama de sequencia (sequence diagram) representando o fluxo completo de emissao e verificacao de uma credencial, incluindo todos os atores (emissor, titular, verificador, VDR) e suas interacoes.
2. Pesquise sobre o conceito de "pairwise DIDs" e explique como eles ajudam a mitigar o problema de correlacao de identidade no fluxo de verificacao.
3. Identifique e descreva tres possiveis ataques ao fluxo de verificacao e suas respectivas mitigacoes, alem dos mencionados na aula.

---

## Proxima Aula
Na proxima aula, vamos iniciar o Modulo 5: Padroes W3C: DID Core e Modelo de Dados de Credenciais Verificaveis. Estudaremos em detalhes as especificacoes tecnicas que padronizam tudo o que vimos ate aqui, garantindo interoperabilidade global entre diferentes implementacoes. Ate la!

---

## Questionario

**1. Qual e o primeiro passo no processo de criacao de um DID?**
a) Registrar o DID na blockchain
b) Publicar o DID Document em um servidor web
c) Gerar um par de chaves criptograficas assimetricas
d) Solicitar aprovacao de uma autoridade certificadora
**Resposta: c**

**2. No processo de resolucao, o que acontece imediatamente apos o resolver identificar o metodo DID?**
a) O resolver retorna o DID Document diretamente de seu cache
b) O resolver ativa o driver especifico para aquele metodo e consulta o VDR correspondente
c) O resolver envia uma notificacao ao sujeito do DID informando que foi resolvido
d) O resolver verifica se o solicitante tem permissao para acessar o DID Document
**Resposta: b**

**3. Na etapa de verificacao de uma credencial, qual informacao o verificador obtem do DID Document do emissor?**
a) Os dados pessoais do titular da credencial
b) A chave privada do emissor para descriptografar a credencial
c) A chave publica do emissor para verificar a assinatura digital da credencial
d) O historico completo de todas as credenciais emitidas por aquele emissor
**Resposta: c**

**4. Por que o uso de DIDs pairwise (diferentes para cada relacao) e recomendado?**
a) Porque cada blockchain exige um DID diferente
b) Porque reduz o custo de armazenamento na carteira
c) Porque evita que diferentes verificadores correlacionem as atividades do titular
d) Porque a especificacao W3C proibe o uso do mesmo DID em multiplas interacoes
**Resposta: c**

**5. Qual e a diferenca fundamental entre a criacao de um did:key e um did:ethr?**
a) O did:key exige mais poder computacional para ser gerado
b) O did:key nao requer registro em nenhum sistema externo, enquanto o did:ethr requer uma transacao na blockchain Ethereum
c) O did:ethr e gratuito enquanto o did:key tem custos de geracao
d) O did:key suporta mais algoritmos criptograficos que o did:ethr
**Resposta: b**
