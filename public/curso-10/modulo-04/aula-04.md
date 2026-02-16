# Aula 4.4: Verifiable Data Registries (VDRs): Blockchains Publicas/Privadas, DLTs, IPFS, Ceramic, Arweave

## Abertura
Bem-vindo a aula 4.4! Nesta aula, vamos analisar os Verifiable Data Registries (VDRs) — a camada de infraestrutura onde DIDs e seus metadados sao ancorados. A escolha do VDR impacta diretamente a seguranca, escalabilidade, custo e modelo de governanca do sistema de identidade. Exploraremos as principais opcoes disponiveis, desde blockchains publicas ate protocolos de armazenamento descentralizado, comparando suas caracteristicas tecnicas e trade-offs.

### Programa da aula:
1. Fundamentos de VDRs e blockchains (publicas e privadas)
2. Protocolos de armazenamento descentralizado (IPFS, Ceramic, Arweave)
3. Criterios de selecao e arquiteturas hibridas (decisoes de projeto)

---

## 1. Fundamentos de VDRs e Blockchains

### O Papel do VDR
Um Verifiable Data Registry e qualquer sistema capaz de registrar e retornar dados necessarios para a resolucao de DIDs e verificacao de credenciais. Segundo a especificacao W3C, o VDR e agnosto a tecnologia — pode ser uma blockchain, um banco de dados distribuido, um sistema de arquivos ou ate mesmo DNS.

Propriedades essenciais de um VDR:
- **Persistencia**: Os dados devem sobreviver a falhas individuais.
- **Imutabilidade** (ou append-only): Historico verificavel de alteracoes.
- **Disponibilidade**: Alta disponibilidade para leitura (resolucao).
- **Resistencia a censura**: Nenhuma entidade unica pode impedir o registro ou a resolucao.

### Blockchains Publicas
Blockchains publicas como Ethereum e Bitcoin oferecem o mais alto nivel de descentralizacao e resistencia a censura, mas com trade-offs significativos em custo e throughput.

**Ethereum e did:ethr**:
- Utiliza o contrato EthereumDIDRegistry para registrar atributos.
- Custo por operacao: gas fee variavel (pode ser significativo em periodos de alta demanda).
- Suporte a redes L2 para reduzir custos (Polygon, Arbitrum, Base).

- **Exemplo**: Registro de atributo no EthereumDIDRegistry:
```solidity
// Contrato EthereumDIDRegistry
mapping(address => mapping(bytes32 => mapping(address => uint))) public delegates;
mapping(address => mapping(bytes32 => mapping(bytes32 => uint))) public attributes;

function setAttribute(address identity, bytes32 name, bytes value, uint validity)
    public onlyOwner(identity) {
    attributes[identity][name][keccak256(value)] = block.timestamp + validity;
    emit DIDAttributeChanged(identity, name, value, validity, block.number);
}
```

**Bitcoin e did:ion (Sidetree)**:
- Usa Bitcoin apenas para ancoragem de hashes (batch anchoring).
- DID Documents sao armazenados off-chain (IPFS).
- Custo reduzido: uma transacao Bitcoin ancora milhares de operacoes DID.

- **Exemplo**: Estrutura de ancoragem Sidetree no Bitcoin:
```
Transacao Bitcoin:
  OP_RETURN: <hash_do_lote_de_operacoes>
     |
     v
  IPFS CID -> Core Index File -> Provisional Index File -> Chunk Files
                                                            |
                                                            v
                                                    Operacoes DID individuais
```

### Blockchains Privadas e Permissionadas
Para cenarios corporativos e governamentais, blockchains permissionadas oferecem controle sobre participantes e governanca:

**Hyperledger Indy/Besu**:
- Indy: Projetada especificamente para identidade descentralizada.
- Besu: Ethereum permissionado, compativel com did:ethr.
- Governanca definida por consorcio (quem pode escrever, quem pode ler).

- **Exemplo**: Comparativo de throughput e custo:

| Plataforma | Throughput (TPS) | Custo por Op | Descentralizacao |
|-----------|-----------------|-------------|------------------|
| Ethereum L1 | ~15 | $1-50+ | Alta |
| Polygon | ~7000 | <$0.01 | Media |
| Hyperledger Indy | ~100 | Zero (gas) | Consorcio |
| Bitcoin (Sidetree) | ~7 (batch ~10k) | ~$0.001/DID | Alta |

---

## 2. Protocolos de Armazenamento Descentralizado

### IPFS (InterPlanetary File System)
IPFS e um protocolo de armazenamento content-addressed, onde cada arquivo e identificado por seu hash (CID - Content Identifier). E amplamente utilizado como camada de armazenamento para DID Documents.

Caracteristicas relevantes para VDRs:
- **Content addressing**: O CID garante integridade — qualquer alteracao no conteudo produz um CID diferente.
- **Distribuicao**: Conteudo pode ser replicado por multiplos nos (pinning).
- **Volatilidade**: Sem pinning, conteudo pode ser coletado pelo garbage collector.

- **Exemplo**: Fluxo de armazenamento de DID Document no IPFS:
```
1. DID Document JSON -> IPFS -> CID: bafybeigdyrzt5sfp7udm7hu76uh7y26nf3efuylqabf3oclgtqy55fbzdi
2. CID -> Ancorado em blockchain (Bitcoin/Ethereum) via transacao
3. Resolucao: Blockchain -> CID -> IPFS -> DID Document
```

Para uso em producao, e necessario um servico de pinning (Pinata, Infura, nos proprios) para garantir disponibilidade.

### Ceramic Network
Ceramic e um protocolo de streams de dados descentralizado construido sobre IPFS. Cada stream e um log append-only de commits, ideal para documentos que mudam ao longo do tempo — como DID Documents.

Ceramic implementa o metodo `did:3`:
- Cada DID e vinculado a uma conta blockchain (CAIP-10).
- O DID Document e um stream TileDocument no Ceramic.
- Updates sao commits assinados adicionados ao stream.

- **Exemplo**: Estrutura de um stream Ceramic para DID Document:
```
Stream ID: kjzl6cwe1jw148...
  |
  Genesis Commit (estado inicial)
  |
  Signed Commit #1 (adiciona chave)
  |
  Signed Commit #2 (atualiza servico)
  |
  Anchor Commit (ancorado no Ethereum)
```

Vantagens do Ceramic:
- **Mutabilidade controlada**: Suporta atualizacoes mantendo historico completo.
- **Ancoragem periodica**: Commits sao ancorados no Ethereum em lotes, reduzindo custo.
- **Modelo de dados flexivel**: Schemas GraphQL (ComposeDB) para consultas estruturadas.

### Arweave
Arweave e um protocolo de armazenamento permanente com um modelo economico baseado em pagamento unico. Dados armazenados no Arweave sao imutaveis e persistentes por design.

Caracteristicas para VDRs:
- **Permanencia**: Pagamento unico garante armazenamento perpetuo.
- **Imutabilidade nativa**: Nao ha mecanismo de delecao.
- **Custo previsivel**: O custo e calculado no momento do upload.

- **Exemplo**: Armazenamento de DID Document no Arweave:
```javascript
const transaction = await arweave.createTransaction({
  data: JSON.stringify(didDocument)
}, wallet);

transaction.addTag('Content-Type', 'application/did+ld+json');
transaction.addTag('DID-Method', 'ar');
transaction.addTag('DID-Id', 'did:ar:abc123');

await arweave.transactions.sign(transaction, wallet);
await arweave.transactions.post(transaction);
// Transaction ID serve como ancora para o DID Document
```

Limitacao importante: a imutabilidade total dificulta operacoes de update e deactivate. Solucoes incluem usar o Arweave apenas para o log de operacoes, com a resolucao reconstruindo o estado atual a partir do historico.

---

## 3. Criterios de Selecao e Arquiteturas Hibridas

### Matriz de Decisao
A escolha do VDR depende de multiplos fatores. Uma matriz de decisao ajuda a avaliar cada opcao:

| Criterio | Blockchain Publica | Blockchain Privada | IPFS + Ancora | Ceramic | Arweave |
|----------|-------------------|-------------------|--------------|---------|---------|
| Descentralizacao | Alta | Baixa-Media | Alta | Media-Alta | Alta |
| Custo de escrita | Alto (L1) | Baixo | Medio | Baixo | Medio |
| Latencia de escrita | Minutos | Segundos | Segundos+Min | Segundos | Segundos |
| Mutabilidade | Via eventos | Via transacoes | Via novas versoes | Nativa (streams) | Append-only |
| Permanencia | Alta | Depende do consorcio | Requer pinning | Ancora + IPFS | Nativa |

### Arquiteturas Hibridas
Na pratica, muitos sistemas combinam multiplas tecnologias:

- **Exemplo**: Arquitetura hibrida para um sistema de identidade empresarial:
```
Camada de Ancoragem:  Ethereum L2 (Polygon) — registro de hashes
Camada de Dados:      IPFS com Pinning — armazenamento de DID Documents
Camada de Streams:    Ceramic — historico de atualizacoes
Camada de Cache:      Redis/PostgreSQL — resolucao rapida
```

- **Exemplo**: Estrategia por tipo de DID:
```
DIDs de usuarios finais:     did:key (sem VDR, derivado da chave)
DIDs de organizacoes:        did:ethr na Polygon (custo baixo, alta disponibilidade)
DIDs de dispositivos IoT:    did:web (resolucao rapida via DNS/HTTP)
DIDs de credenciais oficiais: did:ion (ancoragem Bitcoin, maxima resistencia a censura)
```

A decisao deve considerar tambem requisitos regulatorios (LGPD, GDPR), volume de operacoes esperado e o perfil tecnico da equipe de operacoes.

---

## Conclusao
Nesta aula, analisamos as principais opcoes de Verifiable Data Registries disponiveis para sistemas de identidade descentralizada. Desde blockchains publicas de alta seguranca ate protocolos especializados como Ceramic e Arweave, cada opcao apresenta trade-offs distintos em descentralizacao, custo, latencia e mutabilidade. Vimos tambem como arquiteturas hibridas combinam o melhor de cada tecnologia para atender requisitos especificos. A escolha do VDR e uma das decisoes arquiteturais mais impactantes em um sistema DID.

---

## Licao de Casa
1. Projete a arquitetura de VDR para um sistema de identidade de uma universidade que emite diplomas como Verifiable Credentials. Justifique cada escolha tecnologica considerando custo, escala e requisitos regulatorios.
2. Implemente o armazenamento e recuperacao de um DID Document no IPFS usando a biblioteca js-ipfs ou kubo, incluindo pinning para garantir persistencia.
3. Compare o custo total de 10.000 operacoes de criacao de DID em Ethereum L1, Polygon e Sidetree/Bitcoin, documentando suas fontes e premissas de calculo.

---

## Proxima Aula
Na proxima aula, vamos explorar estrategias de escalabilidade para sistemas DID, incluindo batching com Sidetree, caching, sidechains e soluoes Layer 2. Ate la!

---

## Questionario

**1. Qual propriedade essencial um VDR deve ter para garantir que o historico de um DID nao seja alterado retroativamente?**
a) Alta disponibilidade
b) Imutabilidade ou append-only
c) Baixa latencia
d) Suporte a smart contracts
**Resposta: b**

**2. Como o protocolo Sidetree (did:ion) reduz o custo de operacoes DID no Bitcoin?**
a) Usando transacoes SegWit que sao mais baratas
b) Ancorando o hash de um lote com milhares de operacoes em uma unica transacao
c) Executando operacoes na Lightning Network
d) Comprimindo os DID Documents antes do registro
**Resposta: b**

**3. Qual e a principal limitacao do IPFS como VDR quando usado sem pinning?**
a) Os CIDs nao sao unicos
b) O conteudo pode ser removido pelo garbage collector e se tornar indisponivel
c) O IPFS nao suporta arquivos JSON
d) A latencia de leitura e sempre superior a 10 segundos
**Resposta: b**

**4. Qual vantagem o Ceramic oferece sobre IPFS puro para armazenar DID Documents?**
a) Custo zero de armazenamento
b) Mutabilidade controlada com historico completo via streams append-only
c) Compatibilidade com todos os metodos DID existentes
d) Armazenamento permanente sem necessidade de ancoragem
**Resposta: b**

**5. Em uma arquitetura hibrida, por que DIDs de usuarios finais frequentemente usam did:key em vez de metodos baseados em blockchain?**
a) Porque did:key oferece maior seguranca criptografica
b) Porque did:key nao requer VDR, sendo derivado diretamente da chave publica, eliminando custo e latencia de registro
c) Porque did:key suporta mais algoritmos criptograficos
d) Porque did:key e o unico metodo compativel com dispositivos moveis
**Resposta: b**
