# Aula 4.5: Escalabilidade: Batching (Sidetree), Caching, Sidechains e L2s

## Abertura
Bem-vindo a aula 4.5! Nesta aula, vamos abordar um dos maiores desafios praticos de sistemas de identidade descentralizada: a escalabilidade. Quando milhoes de DIDs precisam ser criados, resolvidos e atualizados, as limitacoes de throughput e custo das blockchains de base se tornam criticas. Exploraremos as principais estrategias tecnicas para superar essas limitacoes — batching com Sidetree, caching inteligente, sidechains e solucoes Layer 2.

### Programa da aula:
1. Batching com Sidetree (ancoragem em lote)
2. Caching e otimizacao de resolucao (desempenho de leitura)
3. Sidechains e Layer 2s (escala de escrita)

---

## 1. Batching com Sidetree

### Arquitetura do Protocolo Sidetree
Sidetree e um protocolo Layer 2 projetado especificamente para operacoes DID em escala. Ele desacopla o armazenamento de dados da ancoragem, permitindo que milhares de operacoes DID sejam agrupadas em um unico lote ancorado em uma blockchain de base.

Componentes principais do Sidetree:

- **Core Logic**: Processa operacoes DID (create, update, recover, deactivate).
- **Content Addressable Storage (CAS)**: Armazena os dados das operacoes (tipicamente IPFS).
- **Blockchain Adapter**: Interage com a blockchain de base para ancoragem.
- **Observer**: Monitora a blockchain para novas ancoragens e sincroniza o estado.

```
Operacoes DID (milhares)
         |
         v
  +------------------+
  | Sidetree Core    |
  | (agrupa em batch)|
  +------------------+
      |           |
      v           v
   IPFS       Blockchain
 (dados)    (hash ancora)
```

- **Exemplo**: Fluxo de batching no Sidetree:
```
1. Receber N operacoes DID em um intervalo de tempo
2. Agrupar operacoes em Chunk Files (dados das operacoes)
3. Criar Provisional Index File (indice de updates/recovers)
4. Criar Core Index File (indice principal com referencia ao chunk)
5. Calcular hash do Core Index File
6. Submeter transacao na blockchain com OP_RETURN contendo o hash
7. Uma transacao Bitcoin ancora N operacoes (N pode ser > 10.000)
```

### Estrutura de Arquivos Sidetree
O Sidetree organiza as operacoes em uma hierarquia de arquivos armazenados no CAS:

```json
// Core Index File
{
  "coreProofFileUri": "QmX...",
  "provisionalIndexFileUri": "QmY...",
  "operations": {
    "create": [
      { "suffixData": { "deltaHash": "EiA...", "recoveryCommitment": "EiB..." } }
    ],
    "deactivate": [
      { "didSuffix": "EiC...", "revealValue": "EiD..." }
    ]
  }
}
```

- **Exemplo**: Calculo de throughput do Sidetree sobre Bitcoin:
```
- Bitcoin: ~1 bloco a cada 10 minutos
- 1 transacao OP_RETURN por bloco (conservador)
- 1 lote pode conter ~10.000 operacoes DID
- Throughput efetivo: ~10.000 operacoes / 10 min = ~16.7 ops/segundo
- Custo por operacao: ~$0.001 (custo da transacao BTC / 10.000)
```

Esse modelo transforma uma blockchain de ~7 TPS em uma plataforma capaz de processar milhares de operacoes DID por bloco.

### Resolucao no Sidetree
O Observer monitora continuamente a blockchain, detecta novas ancoragens, recupera os arquivos do CAS e reconstroi o estado de cada DID:

```
Observer:
  1. Detecta nova transacao com ancora Sidetree no bloco N
  2. Recupera Core Index File do IPFS via CID
  3. Recupera Chunk Files referenciados
  4. Aplica operacoes na ordem correta (create -> update -> recover -> deactivate)
  5. Atualiza o indice local de DIDs
```

---

## 2. Caching e Otimizacao de Resolucao

### Estrategias de Cache para Resolucao
Em sistemas de producao, a resolucao de DIDs e a operacao mais frequente (leitura >> escrita). Implementar caching eficiente e essencial para atender a demanda com baixa latencia.

Niveis de cache recomendados:

1. **Cache em memoria (L1)**: Cache local no processo do resolver (LRU cache, ~1000 entradas).
2. **Cache distribuido (L2)**: Redis ou Memcached compartilhado entre instancias do resolver.
3. **Cache de CDN (L3)**: Para metodos como did:web, onde o DID Document e servido via HTTP.

- **Exemplo**: Implementacao de cache multi-nivel para um resolver:
```javascript
class CachedResolver {
  constructor(resolver) {
    this.resolver = resolver;
    this.l1Cache = new LRUCache({ max: 1000, ttl: 60_000 });       // 1 min
    this.l2Cache = new RedisCache({ ttl: 300_000 });                 // 5 min
  }

  async resolve(did) {
    // L1: Cache em memoria
    let result = this.l1Cache.get(did);
    if (result) return result;

    // L2: Cache distribuido
    result = await this.l2Cache.get(did);
    if (result) {
      this.l1Cache.set(did, result);
      return result;
    }

    // Miss: Resolver real
    result = await this.resolver.resolve(did);
    this.l1Cache.set(did, result);
    await this.l2Cache.set(did, result);
    return result;
  }
}
```

### Invalidacao de Cache
A invalidacao e o aspecto mais delicado do caching de DIDs. Estrategias incluem:

- **TTL (Time-To-Live)**: Abordagem mais simples. O cache expira apos um periodo fixo.
- **Event-driven**: O resolver monitora eventos na blockchain (ex: eventos do EthereumDIDRegistry) e invalida o cache quando detecta alteracoes.
- **Versionamento**: O cache armazena o `versionId` e compara com o VDR periodicamente.

- **Exemplo**: Invalidacao event-driven para did:ethr:
```javascript
// Monitorar eventos do contrato EthereumDIDRegistry
contract.on('DIDAttributeChanged', (identity, name, value, validTo, block) => {
  const did = `did:ethr:${identity}`;
  cache.invalidate(did);
  logger.info(`Cache invalidado para ${did} no bloco ${block}`);
});
```

Metricas importantes de cache:
- **Hit rate**: Alvo > 90% para sistemas em producao.
- **Stale rate**: Porcentagem de resolucoes que retornam dados desatualizados.
- **Latencia P99**: Tempo de resolucao no percentil 99.

---

## 3. Sidechains e Layer 2s

### Sidechains para Identidade
Sidechains sao blockchains independentes conectadas a uma chain principal via mecanismo de bridge. Para identidade descentralizada, oferecem throughput dedicado sem competir com outras aplicacoes pelo espaco de bloco.

Exemplos de sidechains usadas para DID:
- **Polygon PoS**: Sidechain Ethereum com ~7000 TPS e gas fees minimas.
- **Gnosis Chain (xDai)**: Blockchain EVM com transacoes rapidas e baratas.
- **Redes Hyperledger Besu**: Sidechains permissionadas para consorcios.

- **Exemplo**: Custo comparativo de uma operacao setAttribute em did:ethr:
```
Ethereum L1:  ~$5-50 (depende do gas price)
Polygon PoS:  ~$0.001-0.01
Gnosis Chain: ~$0.0001
```

### Rollups e Layer 2s
Rollups sao solucoes Layer 2 que executam transacoes fora da chain principal mas publicam provas na L1, herdando sua seguranca:

**Optimistic Rollups** (Optimism, Arbitrum, Base):
- Transacoes sao assumidas validas; disputas sao resolvidas via fraud proofs.
- Latencia de finalidade: ~7 dias para saques (mas leitura e rapida).
- Compatibilidade EVM total: contratos did:ethr funcionam sem alteracao.

**ZK-Rollups** (zkSync, StarkNet, Scroll):
- Provas de validade (zero-knowledge proofs) garantem corretude.
- Finalidade mais rapida que optimistic rollups.
- Potencial para provas de identidade com preservacao de privacidade.

- **Exemplo**: Arquitetura de identidade usando rollup:
```
                  +-------------------+
                  |   Ethereum L1     |
                  | (seguranca final) |
                  +-------------------+
                          ^
                          | provas/dados
                  +-------------------+
                  |  Rollup L2 (Base) |
                  | EthereumDIDRegistry|
                  | deployed aqui     |
                  +-------------------+
                    ^       ^       ^
                    |       |       |
              Create DID  Update  Resolve
              (~$0.005)   (~$0.003) (gratuito)
```

### Estrategia Multi-Chain
Para maximizar resiliencia e alcance, alguns sistemas adotam estrategias multi-chain:

- **Exemplo**: Registro do mesmo DID em multiplas redes:
```json
{
  "id": "did:ethr:0xabc...",
  "alsoKnownAs": [
    "did:ethr:polygon:0xabc...",
    "did:ethr:arbitrum:0xabc..."
  ]
}
```

Consideracoes para multi-chain:
- **Consistencia**: Como garantir que o estado do DID e consistente entre chains.
- **Canonical chain**: Definir qual chain e a fonte de verdade (canonical).
- **Bridging de estado**: Mecanismos para sincronizar atualizacoes entre chains.
- **Custo operacional**: Manter nos e monitoramento em multiplas redes.

---

## Conclusao
Nesta aula, exploramos as principais estrategias de escalabilidade para sistemas de identidade descentralizada. O protocolo Sidetree demonstra como batching pode amplificar o throughput de uma blockchain por ordens de grandeza. Caching multi-nivel e essencial para atender a demanda de resolucao em producao. Sidechains e Layer 2s oferecem alternativas com custos drasticamente menores, mantendo diferentes niveis de seguranca herdada. A combinacao dessas estrategias permite construir sistemas de identidade que escalam para milhoes de usuarios sem comprometer os principios de descentralizacao.

---

## Licao de Casa
1. Calcule o custo total e o throughput efetivo de um sistema Sidetree ancorado no Bitcoin para processar 1 milhao de operacoes DID em 30 dias. Documente suas premissas sobre tamanho de lote, frequencia de ancoragem e custo de transacao.
2. Implemente um cache multi-nivel (memoria + Redis) para um resolver DID e meça o impacto no tempo de resposta usando benchmarks com pelo menos 10.000 resolucoes.
3. Deploy o contrato EthereumDIDRegistry em uma testnet L2 (como Base Sepolia ou Arbitrum Sepolia) e compare o custo e latencia das operacoes com Ethereum Sepolia (L1).

---

## Proxima Aula
Na proxima aula, vamos iniciar o Modulo 5 explorando bibliotecas e frameworks para desenvolvimento com identidade descentralizada, incluindo Veramo, Hyperledger Aries e DIDKit. Ate la!

---

## Questionario

**1. Qual e o principal mecanismo do Sidetree para escalar operacoes DID sobre Bitcoin?**
a) Uso de transacoes SegWit para reduzir o tamanho
b) Agrupamento de milhares de operacoes em um unico lote ancorado por uma transacao
c) Uso da Lightning Network para transacoes instantaneas
d) Compressao dos DID Documents antes do armazenamento
**Resposta: b**

**2. Em um sistema de cache multi-nivel para resolucao DID, qual nivel oferece a menor latencia?**
a) Cache de CDN (L3)
b) Cache distribuido Redis (L2)
c) Cache em memoria local (L1)
d) Consulta direta ao VDR
**Resposta: c**

**3. Qual e a principal vantagem de ZK-Rollups sobre Optimistic Rollups para sistemas de identidade?**
a) Menor custo de gas
b) Compatibilidade com mais linguagens de programacao
c) Finalidade mais rapida e potencial para provas de identidade com preservacao de privacidade
d) Maior throughput de transacoes
**Resposta: c**

**4. Por que a invalidacao de cache event-driven e preferivel ao TTL simples para DIDs baseados em blockchain?**
a) Porque e mais simples de implementar
b) Porque reduz o risco de retornar dados desatualizados ao reagir imediatamente a mudancas on-chain
c) Porque consome menos memoria
d) Porque funciona sem conexao com a blockchain
**Resposta: b**

**5. Qual componente do Sidetree e responsavel por monitorar a blockchain e reconstruir o estado dos DIDs?**
a) Core Logic
b) Blockchain Adapter
c) Observer
d) Content Addressable Storage
**Resposta: c**
