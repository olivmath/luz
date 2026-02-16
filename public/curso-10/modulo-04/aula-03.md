# Aula 4.3: Universal Resolver e Universal Registrar: Arquitetura e Utilizacao

## Abertura
Bem-vindo a aula 4.3! Nesta aula, vamos estudar duas pecas fundamentais da infraestrutura de identidade descentralizada: o Universal Resolver e o Universal Registrar. Essas ferramentas resolvem um problema critico — a fragmentacao causada pela existencia de dezenas de metodos DID, cada um com seu proprio protocolo de resolucao e registro. Veremos como elas funcionam internamente, como sao implantadas e como integra-las em suas aplicacoes.

### Programa da aula:
1. Universal Resolver (arquitetura e drivers)
2. Universal Registrar (registro unificado de DIDs)
3. Implantacao e integracao pratica (deploy, configuracao e uso em producao)

---

## 1. Universal Resolver

### Problema e Motivacao
Com mais de 150 metodos DID registrados no W3C DID Specification Registries, cada aplicacao precisaria implementar a logica de resolucao para cada metodo individualmente. O Universal Resolver resolve isso oferecendo uma unica API HTTP que aceita qualquer DID e delega a resolucao ao driver apropriado.

O projeto e mantido pela Decentralized Identity Foundation (DIF) e esta disponivel em codigo aberto. Sua arquitetura segue o padrao de plugins (drivers), onde cada metodo DID tem seu proprio driver containerizado.

- **Exemplo**: Uma unica chamada HTTP resolve qualquer metodo DID:
```bash
# Resolver did:web
curl https://resolver.example.com/1.0/identifiers/did:web:example.com

# Resolver did:ion
curl https://resolver.example.com/1.0/identifiers/did:ion:EiA...

# Resolver did:key
curl https://resolver.example.com/1.0/identifiers/did:key:z6Mkf...
```

### Arquitetura de Drivers
Cada driver e um container Docker independente que implementa a interface de resolucao para um metodo DID especifico. O Universal Resolver atua como orquestrador:

```
                    +-------------------+
   HTTP Request --> | Universal Resolver|
                    |   (Orquestrador)  |
                    +-------------------+
                      |       |       |
                +-----+  +---+---+  +-----+
                |did:web| |did:ion| |did:ethr|
                |driver | |driver | |driver  |
                +-----+  +---+---+  +-----+
                  |          |          |
               DNS/HTTP   Bitcoin    Ethereum
                          +IPFS      RPC Node
```

Cada driver:
- Roda como um servico independente (container Docker).
- Expoe uma API interna padronizada.
- Gerencia suas proprias conexoes com o VDR subjacente (nos blockchain, APIs, etc).
- Pode ser escalado independentemente conforme a demanda.

- **Exemplo**: Configuracao de drivers no `docker-compose.yml` do Universal Resolver:
```yaml
services:
  uni-resolver-web:
    image: universalresolver/uni-resolver-web:latest
    ports:
      - "8080:8080"
    environment:
      uniresolver_web_drivers: |
        did-web:http://driver-did-web:8080
        did-ion:http://driver-did-ion:8080
        did-ethr:http://driver-did-ethr:8080

  driver-did-web:
    image: universalresolver/driver-did-web:latest

  driver-did-ion:
    image: universalresolver/driver-did-ion:latest
    environment:
      ION_NODE_URL: "http://ion-node:3000"
```

### Formato de Resposta
A resposta segue o padrao DID Resolution definido pela W3C:

```json
{
  "@context": "https://w3id.org/did-resolution/v1",
  "didDocument": {
    "id": "did:web:example.com",
    "verificationMethod": [...],
    "service": [...]
  },
  "didDocumentMetadata": {
    "created": "2024-01-01T00:00:00Z"
  },
  "didResolutionMetadata": {
    "contentType": "application/did+ld+json",
    "duration": 245,
    "did": { "method": "web" }
  }
}
```

---

## 2. Universal Registrar

### Registro Unificado de DIDs
Enquanto o Universal Resolver lida com leitura, o Universal Registrar oferece uma API unificada para criar, atualizar e desativar DIDs em qualquer metodo suportado. Ele abstrai a complexidade de interagir com diferentes VDRs.

A API do Universal Registrar segue o padrao RESTful:

| Operacao | Endpoint | Metodo HTTP |
|----------|----------|-------------|
| Create | `/1.0/create` | POST |
| Update | `/1.0/update` | POST |
| Deactivate | `/1.0/deactivate` | POST |

- **Exemplo**: Criacao de um DID via Universal Registrar:
```bash
curl -X POST https://registrar.example.com/1.0/create \
  -H "Content-Type: application/json" \
  -d '{
    "method": "ion",
    "options": {
      "network": "mainnet"
    },
    "didDocument": {
      "verificationMethod": [{
        "type": "Ed25519VerificationKey2020",
        "publicKeyMultibase": "z6Mkf5..."
      }],
      "service": [{
        "type": "DIDCommMessaging",
        "serviceEndpoint": "https://agent.example.com"
      }]
    }
  }'
```

### Estados e Fluxo Assincrono
Diferente da resolucao, que e sincrona, o registro de DIDs frequentemente envolve operacoes assincronas (transacoes blockchain, ancoragem em lote). O Universal Registrar gerencia isso com um sistema de estados:

```
action    ->    wait    ->    finished
(solicitado)   (processando)   (concluido)
                  |
                  v
                failed
              (erro)
```

- **Exemplo**: Resposta inicial (estado `wait`):
```json
{
  "jobId": "job-abc-123",
  "didState": {
    "state": "wait",
    "wait": "confirm",
    "waitDescription": "Aguardando confirmacao na blockchain"
  }
}
```

- **Exemplo**: Resposta final (estado `finished`):
```json
{
  "jobId": "job-abc-123",
  "didState": {
    "state": "finished",
    "did": "did:ion:EiA...",
    "didDocument": { ... }
  },
  "didRegistrationMetadata": {
    "duration": 62000,
    "method": "ion"
  }
}
```

O cliente pode consultar o status usando o `jobId` via polling ou webhook.

---

## 3. Implantacao e Integracao Pratica

### Deploy Self-Hosted
Para ambientes de producao, e recomendavel executar sua propria instancia do Universal Resolver para garantir disponibilidade, privacidade (nao expor quais DIDs voce resolve) e controle sobre os drivers habilitados.

Requisitos de infraestrutura:
- **Docker e Docker Compose**: Para orquestrar os containers dos drivers.
- **Recursos por driver**: Cada driver consome recursos distintos. Drivers que se conectam a nos blockchain (did:ethr, did:ion) requerem mais memoria e armazenamento.
- **Rede**: Conectividade com os VDRs subjacentes (nos Ethereum, Bitcoin, IPFS, etc).

- **Exemplo**: Script de deploy basico:
```bash
git clone https://github.com/decentralized-identity/universal-resolver
cd universal-resolver
# Selecionar apenas os drivers necessarios
docker compose -f docker-compose.yml up -d \
  uni-resolver-web \
  driver-did-web \
  driver-did-key \
  driver-did-ion
```

### Integracao via SDK e API
A integracao em aplicacoes pode ser feita via chamadas HTTP diretas ou usando SDKs disponiveis:

- **Exemplo**: Integracao em Node.js usando fetch:
```javascript
async function resolveDID(did) {
  const response = await fetch(
    `${RESOLVER_URL}/1.0/identifiers/${encodeURIComponent(did)}`,
    { headers: { 'Accept': 'application/did+ld+json' } }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Resolucao falhou: ${error.didResolutionMetadata.error}`);
  }

  const result = await response.json();

  if (result.didDocumentMetadata.deactivated) {
    console.warn('DID desativado');
  }

  return result;
}
```

### Monitoramento e Observabilidade
Em producao, e essencial monitorar:
- **Latencia de resolucao**: Tempo medio por metodo DID.
- **Taxa de erros**: Falhas de resolucao por driver.
- **Disponibilidade dos drivers**: Health checks individuais.
- **Cache hit rate**: Eficiencia do cache de resolucoes.

- **Exemplo**: Endpoint de health check:
```bash
curl https://resolver.example.com/1.0/properties
# Retorna status de cada driver e metricas basicas
```

---

## Conclusao
Nesta aula, exploramos o Universal Resolver e o Universal Registrar como pecas centrais da infraestrutura de identidade descentralizada. Vimos como a arquitetura baseada em drivers permite suportar dezenas de metodos DID com uma unica interface, como o fluxo assincrono do Registrar gerencia operacoes de escrita em blockchains, e como implantar e integrar essas ferramentas em ambientes de producao. Essas ferramentas sao essenciais para qualquer plataforma que precise interoperar com multiplos ecossistemas DID.

---

## Licao de Casa
1. Instale uma instancia local do Universal Resolver com pelo menos 3 drivers (did:web, did:key e um terceiro de sua escolha) e resolva DIDs reais de cada metodo.
2. Escreva um wrapper em sua linguagem preferida que abstraia as chamadas ao Universal Resolver e ao Universal Registrar, incluindo tratamento de estados assincronos e retry com backoff exponencial.
3. Analise os logs de resolucao e documente as diferencas de latencia entre os metodos DID testados, explicando as razoes tecnicas para essas diferencas.

---

## Proxima Aula
Na proxima aula, vamos estudar os Verifiable Data Registries (VDRs), analisando as diferentes opcoes de infraestrutura — blockchains publicas e privadas, DLTs, IPFS, Ceramic e Arweave — e como escolher o registro mais adequado para cada caso de uso. Ate la!

---

## Questionario

**1. Qual e a principal funcao do Universal Resolver?**
a) Criar DIDs em qualquer metodo via uma unica API
b) Resolver DIDs de qualquer metodo via uma unica API HTTP
c) Validar Verifiable Credentials
d) Gerenciar chaves criptograficas
**Resposta: b**

**2. Como os drivers do Universal Resolver sao executados?**
a) Como bibliotecas linkadas estaticamente ao resolver
b) Como containers Docker independentes, cada um implementando a resolucao para um metodo DID
c) Como funcoes serverless na nuvem
d) Como modulos WebAssembly no navegador
**Resposta: b**

**3. Qual e o estado intermediario retornado pelo Universal Registrar quando uma operacao de criacao esta aguardando confirmacao na blockchain?**
a) "pending"
b) "processing"
c) "wait"
d) "confirming"
**Resposta: c**

**4. Por que e recomendavel executar uma instancia propria do Universal Resolver em producao?**
a) Porque a instancia publica e paga
b) Para garantir disponibilidade, privacidade e controle sobre os drivers habilitados
c) Porque a instancia publica nao suporta did:web
d) Para ter acesso a metricas exclusivas de uso
**Resposta: b**

**5. Qual endpoint da API do Universal Registrar e utilizado para desativar um DID?**
a) POST /1.0/delete
b) DELETE /1.0/identifiers/{did}
c) POST /1.0/deactivate
d) PUT /1.0/update com flag "deactivate"
**Resposta: c**
