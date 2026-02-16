# Aula 3.2: Estudo Detalhado dos Principais Metodos DID

## Abertura
Bem-vindo a aula 3.2! Na aula anterior construimos uma taxonomia dos metodos DID. Agora vamos mergulhar na arquitetura interna dos seis metodos mais relevantes do ecossistema: did:ethr, did:ion, did:web, did:key, did:peer e did:sov/did:indy. Para cada metodo, analisaremos o mecanismo de criacao, resolucao, atualizacao e as particularidades de implementacao que impactam decisoes arquiteturais.

### Programa da aula:
1. Metodos baseados em ledger: did:ethr, did:ion, did:sov/did:indy (introducao)
2. Metodo baseado em web: did:web (base e aprofundamento)
3. Metodos autocertificantes e P2P: did:key e did:peer (Conceito principal da aula)

---

## 1. Metodos Baseados em Ledger

### 1.1 did:ethr — Ethereum DID Method
O metodo `did:ethr` utiliza a rede Ethereum (ou qualquer rede EVM-compativel) como camada de ancoragem. A arquitetura gira em torno do contrato inteligente **EthereumDIDRegistry** (ERC-1056).

**Criacao:**
Qualquer endereco Ethereum e automaticamente um DID valido. Nao ha transacao de criacao explicita — o DID existe implicitamente a partir do par de chaves:

```
did:ethr:0xb9c5714089478a327f09197987f16f9e5d936e8a
did:ethr:0x89:0xb9c5714089478a327f09197987f16f9e5d936e8a  (com chainId para L2)
```

**Resolucao:**
O resolver consulta o contrato `EthereumDIDRegistry` e reconstroi o DID Document a partir dos eventos emitidos:
- `DIDOwnerChanged` — indica transferencia de controle.
- `DIDDelegateChanged` — registra delegacoes de autoridade.
- `DIDAttributeChanged` — armazena atributos como service endpoints e chaves adicionais.

- **Exemplo**: O resolver varre os event logs do contrato filtrando pelo endereco do DID, ordena cronologicamente e monta o DID Document resultante.

**Atualizacao:**
Operacoes de escrita no contrato:
- `changeOwner(address)` — transfere o controle do DID.
- `addDelegate(delegateType, delegate, validity)` — adiciona delegado temporario.
- `setAttribute(name, value, validity)` — define atributos com TTL.

**Consideracoes arquiteturais:**
- Custos de gas em mainnet podem ser proibitivos para operacoes frequentes. L2s como Polygon reduzem custos para fracoes de centavo.
- O padrao suporta meta-transactions (EIP-2771), permitindo que terceiros paguem o gas.
- Resolucao depende de acesso a um no Ethereum ou servico de indexacao (The Graph, Infura).

### 1.2 did:ion — Sidetree Protocol sobre Bitcoin
O metodo `did:ion` implementa o **Sidetree protocol**, uma camada de ancoragem em lote sobre o Bitcoin. O ION (Identity Overlay Network) e operado pela Decentralized Identity Foundation (DIF).

**Arquitetura Sidetree:**
O Sidetree nao registra cada operacao individualmente no Bitcoin. Em vez disso:
1. Operacoes DID sao agrupadas em **batches**.
2. Um hash Merkle do batch e ancorado em uma transacao Bitcoin (via OP_RETURN).
3. Os dados completos das operacoes sao armazenados em **IPFS** (Content Addressable Storage).

- **Exemplo**: Uma unica transacao Bitcoin pode ancorar milhares de operacoes DID simultaneamente, amortizando o custo da transacao Bitcoin entre todos os participantes.

**Criacao:**
A criacao envolve gerar um **Create Operation** contendo:
- `suffixData`: hash do documento de patch inicial + recovery commitment.
- `delta`: o patch inicial que define o DID Document.
O DID resultante e derivado do hash do suffixData: `did:ion:EiD3...`

**Resolucao:**
Um no ION:
1. Monitora transacoes Bitcoin com ancoras Sidetree.
2. Recupera os dados de operacao do IPFS/CAS.
3. Aplica as operacoes em ordem cronologica.
4. Retorna o DID Document resultante.

**Modelo de chaves:**
O ION utiliza dois tipos de chaves separadas:
- **Update key**: autoriza atualizacoes ao DID Document.
- **Recovery key**: autoriza operacoes de recuperacao e desativacao (ultima linha de defesa).

### 1.3 did:sov e did:indy — Hyperledger Indy
Os metodos `did:sov` e `did:indy` utilizam a rede **Hyperledger Indy**, uma DLT permissionada projetada especificamente para identidade descentralizada.

**Arquitetura da rede:**
- Ledger permissionado com nos validadores operados por um consorcio (ex: Sovrin Foundation).
- Consenso RBFT (Redundant Byzantine Fault Tolerance), baseado em Plenum.
- Quatro sub-ledgers: Domain, Pool, Config, Audit.

**Criacao:**
A criacao de um DID requer uma transacao `NYM` no ledger:
```json
{
  "type": "NYM",
  "dest": "V4SGRU86Z58d6TV7PBUe6f",
  "verkey": "~CoRER63DVYnWZtK8uAzNbx",
  "role": "ENDORSER"
}
```

- **Exemplo**: Apenas entidades com role ENDORSER ou superior podem escrever NYM transactions. Usuarios comuns precisam de um endorser para criar seus DIDs on-ledger.

**Particularidades:**
- Suporte nativo a **AnonCreds** (credenciais com ZKP para selective disclosure).
- Schema e Credential Definition registrados no ledger.
- O metodo `did:indy` e a evolucao moderna, com suporte a namespaces de multiplas redes: `did:indy:sovrin:staging:V4SGRU86Z58d6TV7PBUe6f`.

---

## 2. Metodo Baseado em Web: did:web

### 2.1 Arquitetura e mecanismo de resolucao
O metodo `did:web` e elegante em sua simplicidade: o DID mapeia diretamente para uma URL HTTPS onde o DID Document esta hospedado como um arquivo JSON.

**Regras de transformacao DID -> URL:**
```
did:web:example.com          -> https://example.com/.well-known/did.json
did:web:example.com:user:123 -> https://example.com/user/123/did.json
did:web:example.com%3A8080   -> https://example.com:8080/.well-known/did.json
```

**Criacao:**
1. Gerar par de chaves criptograficas.
2. Construir o DID Document JSON.
3. Hospedar o arquivo no path correto do servidor web.
4. Configurar HTTPS com certificado TLS valido.

- **Exemplo**: Uma empresa em `empresa.com.br` cria `did:web:empresa.com.br` hospedando o DID Document em `https://empresa.com.br/.well-known/did.json`.

### 2.2 Modelo de confianca e limitacoes
O did:web herda o modelo de confianca da web PKI:

**Dependencias:**
- DNS: resolucao do dominio (vulneravel a DNS hijacking, expiracoes).
- TLS/CA: certificados emitidos por Certificate Authorities (modelo centralizado).
- Hosting: disponibilidade do servidor web.

**Riscos criticos:**
- O administrador do dominio pode alterar o DID Document a qualquer momento sem registro auditavel.
- Nao ha historico imutavel de alteracoes (diferente de metodos ledger-based).
- Apreensao judicial do dominio compromete permanentemente o DID.

### 2.3 did:web em contexto corporativo
Apesar das limitacoes, did:web e amplamente adotado em contextos corporativos por razoes praticas:

- **Baixa barreira de entrada**: nao requer infraestrutura blockchain.
- **Compatibilidade organizacional**: alinha-se com dominios ja existentes.
- **Descoberta facilitada**: o DID e intuitivamente mapeavel a partir do dominio da organizacao.

- **Exemplo**: O European Blockchain Services Infrastructure (EBSI) utiliza `did:web` para identificadores de Trusted Issuers em seus registros de confianca, complementando com outros mecanismos de verificacao.

---

## 3. Metodos Autocertificantes e P2P

### 3.1 did:key — Identidade derivada da chave
O metodo `did:key` e o mais minimalista do ecossistema. O DID **e** a chave publica, codificada usando Multicodec e Multibase.

**Estrutura:**
```
did:key:<multibase(multicodec(public-key-bytes))>
```

**Processo de geracao (Ed25519):**
1. Gerar par de chaves Ed25519.
2. Prefixar os bytes da chave publica com o codigo Multicodec `0xed01` (Ed25519 public key).
3. Codificar com Multibase base58-btc (prefixo `z`).

```
did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK
```

**Resolucao algoritmica:**
O resolver nao consulta nenhuma fonte externa. Ele:
1. Decodifica o Multibase para obter os bytes.
2. Identifica o tipo de chave pelo prefixo Multicodec.
3. Gera o DID Document deterministicamente com base no tipo de chave.

- **Exemplo**: Para uma chave Ed25519, o DID Document gerado inclui automaticamente um `verificationMethod` do tipo `Ed25519VerificationKey2020` e um `keyAgreement` do tipo `X25519KeyAgreementKey2020` (derivado via conversao Ed25519->X25519).

**Curvas suportadas:**
| Multicodec | Tipo de chave | Prefixo hex |
|-----------|---------------|-------------|
| ed25519-pub | Ed25519 | 0xed01 |
| x25519-pub | X25519 | 0xec01 |
| secp256k1-pub | secp256k1 | 0xe701 |
| p256-pub | P-256 | 0x8024 |
| p384-pub | P-384 | 0x8124 |

**Limitacoes fundamentais:**
- Sem rotacao de chaves: se a chave privada for comprometida, o DID deve ser abandonado.
- Sem service endpoints: o DID Document gerado nao inclui endpoints de servico.
- Sem mecanismo de recuperacao.

### 3.2 did:peer — Identidade para relacoes pairwise
O metodo `did:peer` foi projetado para comunicacao direta entre duas partes, sem registro publico. E o metodo padrao para estabelecimento de canais DIDComm.

**Algoritmos (numacgos):**
O did:peer define diferentes "numalgos" (algoritmos de geracao numerados):

- **numalgo 0**: Inception key only. Semelhante a did:key, mas no namespace did:peer.
  ```
  did:peer:0z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK
  ```

- **numalgo 1**: Genesis document. Hash de um documento genesis armazenado off-ledger.

- **numalgo 2**: Multiple inception keys + services. O mais utilizado em producao.
  ```
  did:peer:2.Ez6MkhaXg....Vz6Mkha....SeyJpZCI6...
  ```
  O DID codifica diretamente: chaves de verificacao (`V`), chaves de key agreement (`E`), e service endpoints (`S`).

- **numalgo 4**: Short form + long form. Combina hash curto com documento completo codificado.

- **Exemplo**: No protocolo DIDComm v2, quando Alice quer se comunicar com Bob, ambos geram um `did:peer:2` contendo suas chaves de encriptacao e endpoints de mensageria, trocam esses DIDs out-of-band, e estabelecem o canal seguro.

### 3.3 Comparacao direta: did:key vs did:peer
Embora ambos sejam off-ledger, possuem propositos distintos:

| Aspecto | did:key | did:peer |
|---------|---------|----------|
| Proposito | Identificador efemero/referencia | Relacao pairwise |
| Atualizavel | Nao | Sim (numalgo 2, 4) |
| Service endpoints | Nao | Sim |
| Key agreement | Derivado automaticamente | Explicito no DID |
| Uso tipico | Issuer em credenciais simples, testes | DIDComm, canais privados |

O did:key e ideal quando voce precisa de um identificador simples e descartavel. O did:peer e ideal quando voce precisa de um canal de comunicacao bidirecional com capacidade de evolucao.

---

## Conclusao
Nesta aula analisamos em profundidade os seis metodos DID mais relevantes do ecossistema. Vimos como did:ethr aproveita smart contracts EVM, como did:ion usa o Sidetree para escalar sobre Bitcoin, como did:web mapeia DIDs para URLs HTTPS, como did:key oferece simplicidade autocertificante, como did:peer habilita comunicacao privada, e como did:sov/did:indy fornecem infraestrutura permissionada com suporte nativo a ZKP. Cada metodo possui uma arquitetura interna distinta que reflete seus objetivos de design.

---

## Licao de Casa
1. Implemente um resolver local para did:key em sua linguagem preferida. O resolver deve aceitar um DID did:key com chave Ed25519 e retornar o DID Document completo em JSON. Teste com pelo menos tres DIDs diferentes.
2. Configure um did:web funcional em um servidor local (localhost com HTTPS autoassinado ou ngrok). Hospede o DID Document, resolva-o com um Universal Resolver e documente o processo.
3. Compare o tamanho on-chain (em bytes) de uma operacao did:ethr (setAttribute) versus o custo amortizado de uma operacao did:ion (batch Sidetree). Pesquise dados reais de transacoes na mainnet.

---

## Proxima Aula
Na proxima aula, vamos analisar os trade-offs entre os metodos DID nas dimensoes de custo, velocidade, imutabilidade, privacidade e escalabilidade. Construiremos um framework comparativo que permitira avaliar objetivamente qual metodo e mais adequado para cada cenario. Ate la!

---

## Questionario

**1. No metodo did:ethr, como o DID Document e reconstruido durante a resolucao?**
a) Lendo um arquivo JSON armazenado no IPFS referenciado pelo contrato
b) Consultando diretamente um mapping no contrato que armazena o documento completo
c) Varrendo os event logs (DIDOwnerChanged, DIDDelegateChanged, DIDAttributeChanged) do contrato EthereumDIDRegistry e montando o documento cronologicamente
d) Fazendo uma chamada RPC ao no Ethereum que retorna o documento pronto
**Resposta: c**

**2. Qual e o papel do IPFS na arquitetura do did:ion (Sidetree)?**
a) Armazenar as chaves privadas dos usuarios de forma descentralizada
b) Servir como Content Addressable Storage para os dados completos das operacoes DID, enquanto apenas o hash do batch e ancorado no Bitcoin
c) Substituir o Bitcoin como camada de consenso em periodos de alta congestionamento
d) Hospedar o DID Document final para resolucao rapida
**Resposta: b**

**3. Qual vulnerabilidade fundamental diferencia did:web de metodos ledger-based?**
a) did:web nao suporta chaves criptograficas modernas como Ed25519
b) O administrador do dominio pode alterar o DID Document sem registro auditavel imutavel, e a perda do dominio compromete o DID
c) did:web requer pagamento de taxas mais altas que transacoes blockchain
d) did:web nao permite a inclusao de service endpoints no DID Document
**Resposta: b**

**4. Como o metodo did:key resolve um DID sem consultar nenhuma fonte externa?**
a) O DID Document esta embutido como payload Base64 no proprio DID
b) O resolver usa um cache global distribuido que sincroniza todos os did:key existentes
c) O resolver decodifica o Multibase/Multicodec do DID para extrair a chave publica e gera o DID Document deterministicamente com base no tipo de chave
d) O resolver consulta um registro DNS especial reservado para did:key
**Resposta: c**

**5. Qual numalgo do did:peer e mais utilizado em producao para DIDComm e por que?**
a) numalgo 0, pois e o mais simples e rapido de gerar
b) numalgo 1, pois o genesis document oferece flexibilidade maxima
c) numalgo 2, pois codifica diretamente no DID as chaves de verificacao, key agreement e service endpoints necessarios para comunicacao
d) numalgo 4, pois e o unico que suporta rotacao de chaves
**Resposta: c**
