# Aula 1.4: DevOps para Identidade Descentralizada

## Abertura
Bem-vindo a aula 1.4! Nesta aula, vamos tratar de um aspecto frequentemente negligenciado em projetos de identidade descentralizada: a operacao em producao. Dockerizar resolvers, monitorar agentes Aries, configurar alertas e garantir disponibilidade sao desafios reais que separam prototipos de sistemas prontos para producao. Vamos mergulhar nas praticas de DevOps especificas para infraestrutura SSI.

### Programa da aula:
1. Dockerizacao de resolvers e agentes SSI (introducao)
2. Monitoramento com Prometheus e Grafana (base e aprofundamento)
3. Estrategias de deploy, escalabilidade e observabilidade (Conceito principal da aula)

---

## 1. Dockerizacao de resolvers e agentes SSI
### Universal Resolver em containers
O Universal Resolver da DIF e composto por multiplos drivers, cada um resolvendo um metodo DID especifico. A arquitetura e nativamente baseada em Docker, onde cada driver roda em seu proprio container. Configurar um resolver customizado exige compor esses containers adequadamente.

```dockerfile
# Dockerfile para resolver customizado com metodos selecionados
FROM universalresolver/uni-resolver-web:latest

# Configuracao de drivers via variavel de ambiente
ENV uniresolver_driver_did_web_url=http://driver-did-web:8080
ENV uniresolver_driver_did_key_url=http://driver-did-key:8080
ENV uniresolver_driver_did_ethr_url=http://driver-did-ethr:8080
ENV uniresolver_driver_did_ion_url=http://driver-did-ion:8080

EXPOSE 8080
```

```yaml
# docker-compose.yml para Universal Resolver com 4 metodos
version: '3.8'

services:
  uni-resolver:
    image: universalresolver/uni-resolver-web:latest
    ports:
      - "8080:8080"
    environment:
      uniresolver_driver_did_web_url: "http://driver-did-web:8080"
      uniresolver_driver_did_key_url: "http://driver-did-key:8080"
      uniresolver_driver_did_ethr_url: "http://driver-did-ethr:8080"
      uniresolver_driver_did_ion_url: "http://driver-did-ion:8080"
    depends_on:
      - driver-did-web
      - driver-did-key
      - driver-did-ethr
    networks:
      - resolver-net
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/1.0/identifiers/did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"]
      interval: 30s
      timeout: 10s
      retries: 3

  driver-did-web:
    image: universalresolver/driver-did-web:latest
    networks:
      - resolver-net

  driver-did-key:
    image: universalresolver/driver-did-key:latest
    networks:
      - resolver-net

  driver-did-ethr:
    image: universalresolver/driver-did-ethr:latest
    environment:
      uniresolver_driver_did_ethr_network_mainnet_rpcUrl: "https://mainnet.infura.io/v3/${INFURA_PROJECT_ID}"
    networks:
      - resolver-net

networks:
  resolver-net:
    driver: bridge
```

- **Exemplo**: Com essa configuracao, uma unica chamada `curl http://localhost:8080/1.0/identifiers/did:web:exemplo.com.br` roteia automaticamente para o driver correto baseado no metodo DID.

### Dockerizando o ACA-Py para producao
O Aries Cloud Agent requer configuracao cuidadosa para producao, incluindo wallet persistente, TLS e integracao com ledger:

```dockerfile
# Dockerfile para ACA-Py em producao
FROM bcgovimages/aries-cloudagent:py3.9-0.10.4

# Instalar plugins adicionais
RUN pip install aries-cloudagent-plugin-redis-events aries-cloudagent-plugin-multitenant

COPY ./configs/default.yml /home/aries/configs/default.yml
COPY ./plugins/ /home/aries/plugins/

EXPOSE 8000 8001

ENTRYPOINT ["aca-py", "start"]
CMD ["--arg-file", "/home/aries/configs/default.yml"]
```

```yaml
# configs/default.yml - configuracao ACA-Py para producao
inbound-transport:
  - [http, 0.0.0.0, 8000]

outbound-transport: http

endpoint: https://agent.exemplo.com.br

admin: [0.0.0.0, 8001]
admin-api-key: ${ADMIN_API_KEY}

wallet-type: askar
wallet-name: producao-wallet
wallet-key: ${WALLET_KEY}
wallet-storage-type: postgres_storage
wallet-storage-config: '{"url":"postgres:5432","wallet_scheme":"MultiWalletSingleTable"}'
wallet-storage-creds: '{"account":"${PG_USER}","password":"${PG_PASS}","admin_account":"${PG_ADMIN}","admin_password":"${PG_ADMIN_PASS}"}'

genesis-url: https://raw.githubusercontent.com/sovrin-foundation/sovrin/master/sovrin/pool_transactions_builder_genesis

log-level: WARNING
auto-provision: true
multitenant: true
multitenant-admin: true
jwt-secret: ${JWT_SECRET}
```

```yaml
# docker-compose.yml para stack ACA-Py completa
version: '3.8'

services:
  aca-py:
    build: .
    ports:
      - "8000:8000"
      - "8001:8001"
    env_file: .env
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: '0.5'

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: ${PG_USER}
      POSTGRES_PASSWORD: ${PG_PASS}
      POSTGRES_DB: wallet_db
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${PG_USER}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  pg_data:
```

- **Exemplo**: O uso de `wallet-storage-type: postgres_storage` garante que chaves e credenciais sobrevivam a reinicializacoes do container, diferente do armazenamento em memoria padrao.

---

## 2. Monitoramento com Prometheus e Grafana
### Instrumentacao de metricas para servicos SSI
Servicos de identidade descentralizada possuem metricas especificas que vao alem do monitoramento HTTP padrao. E necessario rastrear resolucoes de DID, emissoes de credenciais, verificacoes e latencias por metodo DID.

```typescript
// Instrumentacao Prometheus para um resolver DID em Node.js
import express from 'express'
import { Registry, Counter, Histogram, Gauge } from 'prom-client'

const register = new Registry()

// Metricas especificas para SSI
const didResolutionTotal = new Counter({
  name: 'did_resolution_total',
  help: 'Total de resolucoes DID',
  labelNames: ['method', 'status'],
  registers: [register],
})

const didResolutionDuration = new Histogram({
  name: 'did_resolution_duration_seconds',
  help: 'Latencia de resolucao DID em segundos',
  labelNames: ['method'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5, 10],
  registers: [register],
})

const vcIssuanceTotal = new Counter({
  name: 'vc_issuance_total',
  help: 'Total de credenciais emitidas',
  labelNames: ['type', 'proof_format'],
  registers: [register],
})

const vcVerificationTotal = new Counter({
  name: 'vc_verification_total',
  help: 'Total de verificacoes de credenciais',
  labelNames: ['result'],  // 'valid', 'invalid', 'expired', 'revoked'
  registers: [register],
})

const activeConnections = new Gauge({
  name: 'didcomm_active_connections',
  help: 'Numero de conexoes DIDComm ativas',
  registers: [register],
})

// Middleware para instrumentar resolucao
async function resolveWithMetrics(did: string) {
  const method = did.split(':')[1]
  const end = didResolutionDuration.startTimer({ method })

  try {
    const result = await resolver.resolve(did)
    didResolutionTotal.inc({ method, status: 'success' })
    return result
  } catch (error) {
    didResolutionTotal.inc({ method, status: 'error' })
    throw error
  } finally {
    end()
  }
}

const app = express()
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType)
  res.end(await register.metrics())
})

app.get('/resolve/:did', async (req, res) => {
  const result = await resolveWithMetrics(req.params.did)
  res.json(result)
})

app.listen(3000)
```

- **Exemplo**: Com essas metricas, voce pode detectar que resolucoes `did:web` levam 50ms em media, mas `did:ion` levam 3 segundos, indicando a necessidade de cache para o metodo ION.

### Configuracao Prometheus e alertas
```yaml
# prometheus.yml - configuracao para stack SSI
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "ssi_alerts.yml"

scrape_configs:
  - job_name: 'did-resolver'
    static_configs:
      - targets: ['resolver:3000']
    metrics_path: /metrics

  - job_name: 'aca-py'
    static_configs:
      - targets: ['aca-py:8001']
    metrics_path: /status/metrics

  - job_name: 'credential-service'
    static_configs:
      - targets: ['credential-svc:3001']

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']
```

```yaml
# ssi_alerts.yml - regras de alerta para servicos SSI
groups:
  - name: ssi_alerts
    rules:
      - alert: DIDResolutionHighLatency
        expr: histogram_quantile(0.95, rate(did_resolution_duration_seconds_bucket[5m])) > 5
        for: 2m
        labels:
          severity: warning
        annotations:
          summary: "Latencia de resolucao DID acima de 5s (p95)"
          description: "O percentil 95 da latencia de resolucao esta em {{ $value }}s"

      - alert: DIDResolutionHighErrorRate
        expr: rate(did_resolution_total{status="error"}[5m]) / rate(did_resolution_total[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Taxa de erro de resolucao DID acima de 5%"

      - alert: VCVerificationFailureSpike
        expr: rate(vc_verification_total{result="invalid"}[10m]) > rate(vc_verification_total{result="invalid"}[1h] offset 1d) * 3
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Pico anomalo de verificacoes invalidas - possivel ataque"
```

- **Exemplo**: O alerta `VCVerificationFailureSpike` compara a taxa atual de verificacoes invalidas com a taxa do mesmo horario no dia anterior. Um aumento de 3x pode indicar tentativas de fraude com credenciais forjadas.

---

## 3. Estrategias de deploy, escalabilidade e observabilidade
### Cache de resolucao DID
A resolucao de DIDs e a operacao mais frequente em sistemas SSI. Implementar cache com TTL adequado por metodo e essencial para performance:

```typescript
import Redis from 'ioredis'

interface CacheConfig {
  [method: string]: { ttlSeconds: number }
}

const cacheConfig: CacheConfig = {
  'key': { ttlSeconds: 86400 },     // did:key e imutavel, cache longo
  'web': { ttlSeconds: 300 },       // did:web pode mudar, cache curto
  'ethr': { ttlSeconds: 3600 },     // did:ethr muda pouco
  'ion': { ttlSeconds: 7200 },      // did:ion e ancorado, cache medio-longo
}

class CachedResolver {
  constructor(
    private resolver: Resolver,
    private redis: Redis,
  ) {}

  async resolve(did: string): Promise<DIDResolutionResult> {
    const cacheKey = `did:resolve:${did}`
    const cached = await this.redis.get(cacheKey)

    if (cached) {
      didResolutionTotal.inc({ method: did.split(':')[1], status: 'cache_hit' })
      return JSON.parse(cached)
    }

    const result = await this.resolver.resolve(did)
    const method = did.split(':')[1]
    const ttl = cacheConfig[method]?.ttlSeconds || 600

    await this.redis.setex(cacheKey, ttl, JSON.stringify(result))
    didResolutionTotal.inc({ method, status: 'cache_miss' })

    return result
  }

  async invalidate(did: string): Promise<void> {
    await this.redis.del(`did:resolve:${did}`)
  }
}
```

- **Exemplo**: Um `did:key` nunca muda (e derivado da chave publica), entao o cache pode ser de 24 horas. Um `did:web` depende de um servidor DNS e pode mudar a qualquer momento, exigindo cache de 5 minutos.

### Kubernetes: deploy escalavel de servicos SSI
```yaml
# k8s/resolver-deployment.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: did-resolver
  labels:
    app: did-resolver
spec:
  replicas: 3
  selector:
    matchLabels:
      app: did-resolver
  template:
    metadata:
      labels:
        app: did-resolver
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "3000"
        prometheus.io/path: "/metrics"
    spec:
      containers:
        - name: resolver
          image: registry.exemplo.com.br/did-resolver:v1.2.0
          ports:
            - containerPort: 3000
          resources:
            requests:
              memory: "128Mi"
              cpu: "100m"
            limits:
              memory: "256Mi"
              cpu: "500m"
          readinessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 5
            periodSeconds: 10
          livenessProbe:
            httpGet:
              path: /health
              port: 3000
            initialDelaySeconds: 15
            periodSeconds: 20
          env:
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: ssi-secrets
                  key: redis-url
            - name: INFURA_PROJECT_ID
              valueFrom:
                secretKeyRef:
                  name: ssi-secrets
                  key: infura-project-id
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: did-resolver-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: did-resolver
  minReplicas: 3
  maxReplicas: 10
  metrics:
    - type: Pods
      pods:
        metric:
          name: did_resolution_duration_seconds
        target:
          type: AverageValue
          averageValue: "2"
```

- **Exemplo**: O HPA (Horizontal Pod Autoscaler) escala os pods do resolver baseado na latencia media de resolucao. Se a latencia sobe acima de 2 segundos, novos pods sao adicionados automaticamente.

### Logging estruturado para auditoria
```typescript
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  serializers: {
    did: (did: string) => did,
    credentialType: (type: string) => type,
  },
})

// Logs estruturados para operacoes SSI
function logResolution(did: string, duration: number, success: boolean) {
  logger.info({
    event: 'did_resolution',
    did,
    method: did.split(':')[1],
    duration_ms: duration,
    success,
    timestamp: new Date().toISOString(),
  })
}

function logIssuance(issuerDid: string, subjectDid: string, credentialType: string) {
  logger.info({
    event: 'vc_issuance',
    issuer: issuerDid,
    subject: subjectDid,
    credentialType,
    timestamp: new Date().toISOString(),
  })
}

function logVerification(credentialHash: string, result: string, verifierDid: string) {
  logger.info({
    event: 'vc_verification',
    credentialHash,
    result,  // 'valid' | 'invalid' | 'expired' | 'revoked'
    verifier: verifierDid,
    timestamp: new Date().toISOString(),
  })
}
```

- **Exemplo**: Logs estruturados em formato JSON permitem consultas no Elasticsearch como "todas as verificacoes invalidas do emissor X nos ultimos 7 dias", essenciais para auditoria de seguranca.

---

## Conclusao
Nesta aula, cobrimos os aspectos operacionais de infraestrutura SSI em producao. A dockerizacao de resolvers e agentes permite deploys reproduziveis e isolados. O monitoramento com Prometheus e alertas especificos para SSI garante visibilidade sobre resolucoes, emissoes e verificacoes. Estrategias de cache por metodo DID, escalabilidade com Kubernetes e logging estruturado completam o toolkit necessario para operar sistemas de identidade descentralizada com confiabilidade em producao.

---

## Licao de Casa
1. Suba o Universal Resolver com Docker Compose suportando pelo menos 3 metodos DID. Adicione um healthcheck customizado que verifica a resolucao de um DID de cada metodo a cada 60 segundos.
2. Instrumente um servico de resolucao DID com Prometheus e crie um dashboard no Grafana com paineis para: taxa de resolucao por metodo, latencia p50/p95/p99 e taxa de erros. Exporte o dashboard como JSON.
3. Implemente o `CachedResolver` com Redis e faca um benchmark comparando a latencia com e sem cache para 1000 resolucoes de `did:web` e `did:ion`. Documente os resultados.

---

## Proxima Aula
Na proxima aula, vamos entrar no mundo das Zero-Knowledge Proofs (ZKPs), explorando os conceitos fundamentais, as diferencas entre zk-SNARKs e zk-STARKs, e como essas tecnicas criptograficas permitem provar atributos de identidade sem revelar dados subjacentes. Ate la!

---

## Questionario

**1. Qual a principal vantagem de rodar cada driver do Universal Resolver em um container Docker separado?**
a) Reduzir o consumo de memoria total
b) Isolamento de falhas — um driver com problema nao derruba os outros metodos
c) Acelerar a resolucao por paralelismo automatico
d) Permitir que todos os drivers compartilhem a mesma configuracao
**Resposta: b**

**2. Qual metrica e mais importante para detectar degradacao de performance em um resolver DID?**
a) Uso de CPU do container
b) Numero total de requisicoes HTTP
c) Histograma de latencia de resolucao por metodo DID (percentis p95/p99)
d) Numero de containers em execucao
**Resposta: c**

**3. Por que o TTL de cache deve ser diferente para cada metodo DID?**
a) Porque cada metodo usa um protocolo de rede diferente
b) Porque metodos como did:key sao imutaveis (cache longo) enquanto did:web pode mudar frequentemente (cache curto)
c) Porque o Redis tem limitacoes de armazenamento por tipo de dado
d) Porque o Prometheus exige metricas separadas por TTL
**Resposta: b**

**4. Qual configuracao do ACA-Py garante que chaves e credenciais sobrevivam a reinicializacoes do container?**
a) auto-provision: true
b) multitenant: true
c) wallet-storage-type: postgres_storage com volume persistente
d) log-level: WARNING
**Resposta: c**

**5. O que o alerta VCVerificationFailureSpike detecta?**
a) Queda na taxa total de verificacoes
b) Aumento anomalo na taxa de verificacoes invalidas comparado ao historico, indicando possivel ataque
c) Falha na conexao com o banco de dados de revogacao
d) Expiracao de certificados TLS do servidor
**Resposta: b**
