# Aula 4.1: Operacoes de Ciclo de Vida: Create, Read/Resolve, Update, Deactivate

## Abertura
Bem-vindo a aula 4.1! Nesta aula, vamos explorar em profundidade as quatro operacoes fundamentais do ciclo de vida de um DID: criacao, resolucao, atualizacao e desativacao. Essas operacoes formam o nucleo de qualquer sistema de identidade descentralizada e sao definidas pela especificacao W3C DID Core. Compreender cada uma delas em nivel tecnico e essencial para projetar e implementar infraestruturas robustas de identidade.

### Programa da aula:
1. Create e Read/Resolve (fundamentos do ciclo de vida)
2. Update (rotacao de chaves e atualizacao de servicos)
3. Deactivate (encerramento seguro e consideracoes de seguranca)

---

## 1. Create e Read/Resolve

### Criacao de um DID (Create)
A operacao de criacao e o ponto de partida do ciclo de vida. Ela envolve gerar um par de chaves criptograficas, derivar o identificador DID a partir da chave publica e registrar o DID Document em um Verifiable Data Registry (VDR).

O fluxo tipico de criacao segue estas etapas:

1. **Geracao de chaves**: O controlador gera um par de chaves (ex: Ed25519, secp256k1).
2. **Derivacao do identificador**: O DID e derivado da chave publica usando o algoritmo especifico do metodo.
3. **Construcao do DID Document**: Um documento JSON-LD e montado com metodos de verificacao e endpoints de servico.
4. **Registro no VDR**: O DID Document e ancorado no registro (blockchain, DLT, etc).

- **Exemplo**: No metodo `did:ethr`, a criacao envolve simplesmente derivar o DID do endereco Ethereum. Nenhuma transacao on-chain e necessaria ate que uma modificacao seja feita:
```
did:ethr:0xb9c5714089478a327f09197987f16f9e5d936e8a
```

- **Exemplo**: No metodo `did:ion` (Sidetree sobre Bitcoin), a criacao envolve gerar um "create operation" com patches iniciais, que e submetida ao no Sidetree e ancorada em batch no Bitcoin:
```json
{
  "type": "create",
  "suffixData": { "deltaHash": "EiA...", "recoveryCommitment": "EiB..." },
  "delta": { "patches": [...], "updateCommitment": "EiC..." }
}
```

### Resolucao de um DID (Read/Resolve)
A resolucao e o processo de transformar um DID string em seu DID Document correspondente. O resolver atua como uma camada de abstracao que conhece os metodos DID suportados e sabe como consultar cada VDR.

O processo de resolucao segue o padrao:

1. **Parsing do DID**: Extrair o metodo (`did:method:specific-id`).
2. **Selecao do driver**: O resolver identifica o driver correspondente ao metodo.
3. **Consulta ao VDR**: O driver consulta o registro apropriado.
4. **Construcao da resposta**: O DID Document e retornado junto com metadados de resolucao.

- **Exemplo**: Uma chamada de resolucao retorna um `DID Resolution Result`:
```json
{
  "didDocument": {
    "id": "did:example:123",
    "verificationMethod": [{ "id": "#key-1", "type": "Ed25519VerificationKey2020" }]
  },
  "didDocumentMetadata": {
    "created": "2024-01-15T10:30:00Z",
    "updated": "2024-06-20T14:00:00Z",
    "versionId": "3"
  },
  "didResolutionMetadata": { "contentType": "application/did+ld+json" }
}
```

A resolucao pode incluir parametros como `versionId` e `versionTime` para consultar estados historicos do documento.

---

## 2. Update

### Rotacao de Chaves
A operacao de update permite modificar o DID Document sem alterar o identificador DID em si. O caso de uso mais critico e a rotacao de chaves, essencial para manter a seguranca ao longo do tempo.

Mecanismos comuns de autorizacao para updates:

- **Chave de update dedicada**: Metodos como Sidetree usam uma chave especifica para autorizar atualizacoes, separada das chaves de autenticacao.
- **Controlador on-chain**: Em `did:ethr`, o proprietario do endereco Ethereum (ou um delegado) pode alterar atributos via smart contract.
- **Pre-rotacao**: Tecnicas como as do KERI, onde o commitment da proxima chave e publicado antecipadamente.

- **Exemplo**: Rotacao de chave em `did:ethr` via transacao no contrato EthereumDIDRegistry:
```solidity
function setAttribute(
    address identity,
    bytes32 name,
    bytes value,
    uint validity
) public onlyOwner(identity) { ... }
```

### Atualizacao de Servicos e Propriedades
Alem de chaves, o update permite modificar endpoints de servico, adicionar novos metodos de verificacao e alterar relacoes de autorizacao (authentication, assertionMethod, keyAgreement, etc).

- **Exemplo**: Adicionando um novo endpoint de servico ao DID Document:
```json
{
  "type": "update",
  "delta": {
    "patches": [{
      "action": "add-services",
      "services": [{
        "id": "#messaging",
        "type": "DIDCommMessaging",
        "serviceEndpoint": "https://agent.example.com/didcomm"
      }]
    }]
  }
}
```

Consideracoes importantes sobre updates:
- Cada update deve ser assinado pela chave autorizada (update key ou controller key).
- O versionId do documento e incrementado a cada operacao.
- Logs de auditoria devem ser mantidos para rastreabilidade.

---

## 3. Deactivate

### Encerramento Seguro de um DID
A desativacao e a operacao final do ciclo de vida. Um DID desativado nao pode mais ser resolvido para um documento funcional — o resolver retorna metadados indicando que o DID foi desativado.

Razoes para desativar um DID:
- Comprometimento de chaves sem possibilidade de recuperacao.
- Fim da entidade ou organizacao representada.
- Migracoes para novos metodos DID.
- Conformidade regulatoria (direito ao esquecimento, quando aplicavel).

- **Exemplo**: Em Sidetree, a desativacao usa a recovery key:
```json
{
  "type": "deactivate",
  "didSuffix": "EiA...",
  "revealValue": "EiB...",
  "signedData": "eyJ..."
}
```

### Consideracoes de Seguranca e Imutabilidade
A desativacao levanta questoes tecnicas importantes:

- **Irreversibilidade**: Na maioria dos metodos, a desativacao e permanente. Uma vez executada, o DID nao pode ser reativado.
- **Tombstoning**: O registro mantem uma entrada "tumulo" indicando que o DID existiu mas foi desativado, prevenindo reutilizacao do identificador.
- **Propagacao**: Em sistemas distribuidos, a desativacao precisa se propagar para todos os nos, o que pode levar tempo.
- **Credenciais emitidas**: VCs emitidas por um DID desativado devem ser tratadas com cautela pelo verificador — a verificacao da assinatura ainda pode ser feita contra o estado historico, mas a confianca e reduzida.

- **Exemplo**: Resposta de resolucao para um DID desativado:
```json
{
  "didDocument": null,
  "didDocumentMetadata": {
    "deactivated": true,
    "updated": "2025-03-01T08:00:00Z"
  },
  "didResolutionMetadata": { "contentType": "application/did+ld+json" }
}
```

Hierarquia de chaves em metodos como Sidetree:
- **Update key**: Autoriza atualizacoes normais (rotacao de chaves, novos servicos).
- **Recovery key**: Autoriza operacoes de recuperacao e desativacao. E a chave de mais alto privilegio.
- Essa separacao permite que, mesmo se a update key for comprometida, a recovery key possa recuperar ou desativar o DID com seguranca.

---

## Conclusao
Nesta aula, cobrimos as quatro operacoes fundamentais do ciclo de vida de um DID: Create, Read/Resolve, Update e Deactivate. Vimos como cada operacao funciona em nivel tecnico, incluindo exemplos concretos em metodos como `did:ethr` e `did:ion`. Compreendemos a importancia da separacao de chaves (update vs recovery), os mecanismos de autorizacao e as implicacoes de seguranca de cada operacao. Esse conhecimento e a base para entender como DIDs sao gerenciados em producao.

---

## Licao de Casa
1. Implemente programaticamente a criacao de um DID usando o metodo `did:key` e inspecione o DID Document gerado. Documente cada campo do documento e sua funcao.
2. Projete um esquema de rotacao de chaves para uma organizacao com multiplos departamentos, definindo politicas de rotacao (frequencia, autorizacao, fallback).
3. Escreva um pseudocodigo que implemente um resolver minimalista capaz de resolver DIDs `did:web` e `did:key`, incluindo tratamento de erros e validacao de formato.

---

## Proxima Aula
Na proxima aula, vamos explorar DID URLs e fragments, aprendendo como referenciar chaves especificas e endpoints de servico dentro de um DID Document. Ate la!

---

## Questionario

**1. Qual e a sequencia correta das etapas na criacao de um DID?**
a) Registro no VDR, geracao de chaves, construcao do DID Document, derivacao do identificador
b) Geracao de chaves, derivacao do identificador, construcao do DID Document, registro no VDR
c) Construcao do DID Document, geracao de chaves, registro no VDR, derivacao do identificador
d) Derivacao do identificador, geracao de chaves, construcao do DID Document, registro no VDR
**Resposta: b**

**2. No metodo did:ethr, o que e necessario para criar um DID inicialmente?**
a) Uma transacao on-chain no contrato EthereumDIDRegistry
b) Apenas derivar o DID do endereco Ethereum, sem transacao on-chain
c) Registrar o DID Document no IPFS e referenciar no Ethereum
d) Submeter uma operacao create ao Universal Registrar
**Resposta: b**

**3. Qual campo dos metadados de resolucao indica que um DID foi desativado?**
a) "status": "inactive"
b) "deactivated": true
c) "active": false
d) "state": "deactivated"
**Resposta: b**

**4. Em metodos baseados em Sidetree, qual chave autoriza a desativacao de um DID?**
a) A chave de autenticacao (authentication key)
b) A chave de update (update key)
c) A chave de recuperacao (recovery key)
d) A chave de acordo de chaves (keyAgreement key)
**Resposta: c**

**5. Qual e a principal diferenca entre a update key e a recovery key no modelo Sidetree?**
a) A update key e usada on-chain e a recovery key off-chain
b) A recovery key autoriza operacoes de maior privilegio, incluindo recuperacao e desativacao
c) A update key e mais segura que a recovery key
d) Nao ha diferenca funcional, ambas podem executar as mesmas operacoes
**Resposta: b**
