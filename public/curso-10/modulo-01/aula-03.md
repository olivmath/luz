# Aula 1.3: Representacoes: JSON, JSON-LD, CBOR e extensibilidade

## Abertura
Bem-vindo a aula 1.3! Nesta aula, vamos estudar como o DID Document pode ser serializado em diferentes formatos — JSON, JSON-LD e CBOR — e como o modelo de dados da especificacao W3C DID Core foi projetado para ser extensivel. Entender as representacoes e fundamental para implementar resolvers, processar documentos em diferentes contextos (web, IoT, mobile) e garantir interoperabilidade entre sistemas.

### Programa da aula:
1. Representacao JSON e producao/consumo de DID Documents (introducao)
2. JSON-LD: semantica, processamento e implicacoes (base e aprofundamento)
3. CBOR, representacoes alternativas e extensibilidade do modelo (Conceito principal da aula)

---

## 1. Representacao JSON e producao/consumo de DID Documents

### O modelo abstrato de dados vs. representacoes concretas
A especificacao W3C DID Core faz uma distincao importante entre o **modelo abstrato de dados** (data model) e as **representacoes concretas** (representations). O modelo de dados define as propriedades e suas semanticas de forma independente de formato. As representacoes definem como serializar esse modelo em bytes.

Isso significa que um DID Document pode ser expresso em diferentes formatos, e todos sao igualmente validos desde que representem fielmente o modelo de dados. A especificacao define regras de producao (serialization) e consumo (deserialization) para cada representacao.

- **Exemplo**: O mesmo DID Document pode ser serializado como JSON para uma API REST, como JSON-LD para um sistema de dados linkados, ou como CBOR para um dispositivo IoT com restricoes de banda. O conteudo semantico e identico.

### Representacao JSON pura
A representacao JSON (application/did+json) e a mais direta. Ela serializa o DID Document como um objeto JSON padrao, sem processamento JSON-LD. As regras principais sao:

1. O media type **MUST** ser `application/did+json`.
2. O campo `@context` **MUST** estar presente (e obrigatorio no modelo de dados).
3. Todos os valores **MUST** seguir os tipos JSON correspondentes (strings, arrays, objects, numbers, booleans).
4. Propriedades desconhecidas **MUST** ser preservadas durante o consumo (nao podem ser descartadas).

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:example:123",
  "verificationMethod": [
    {
      "id": "did:example:123#key-1",
      "type": "Ed25519VerificationKey2020",
      "controller": "did:example:123",
      "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
    }
  ],
  "authentication": ["did:example:123#key-1"]
}
```

Na producao JSON, um produtor simplesmente serializa as propriedades do modelo de dados como pares chave-valor JSON. Nao ha expansao de termos, nao ha resolucao de IRIs e nao ha processamento de grafos.

- **Exemplo**: Um resolver HTTP que retorna `Content-Type: application/did+json` indica ao consumidor que o documento deve ser processado como JSON puro, sem invocar um processador JSON-LD.

### Producao e consumo: responsabilidades
A especificacao define dois papeis:

- **Producer**: Software que serializa o modelo de dados em uma representacao. Deve garantir que a saida e sintaticamente valida e semanticamente fiel ao modelo.
- **Consumer**: Software que desserializa uma representacao de volta ao modelo de dados. Deve respeitar as regras de consumo da representacao e preservar propriedades desconhecidas.

```python
import json

# Producer: modelo de dados -> JSON
def produce_did_document(data_model: dict) -> str:
    """Serializa o modelo de dados como JSON."""
    return json.dumps(data_model, indent=2, ensure_ascii=False)

# Consumer: JSON -> modelo de dados
def consume_did_document(json_str: str) -> dict:
    """Desserializa JSON para o modelo de dados."""
    doc = json.loads(json_str)
    # Validacao minima
    assert "@context" in doc, "@context e obrigatorio"
    assert "id" in doc, "id e obrigatorio"
    assert doc["id"].startswith("did:"), "id deve ser um DID valido"
    return doc
```

- **Exemplo**: Se um consumer encontra uma propriedade `"myExtension": {"foo": "bar"}` que nao reconhece, ele **MUST** preserva-la no modelo de dados. Descartar propriedades desconhecidas violaria a especificacao.

---

## 2. JSON-LD: semantica, processamento e implicacoes

### O que JSON-LD adiciona ao JSON
JSON-LD (JSON for Linking Data) e uma serializacao de RDF (Resource Description Framework) em JSON. Quando um DID Document e representado como JSON-LD (`application/did+ld+json`), cada propriedade e cada valor ganham um IRI (Internationalized Resource Identifier) unico, permitindo que maquinas interpretem o significado de forma inequivoca.

O campo `@context` deixa de ser apenas metadata — ele se torna uma instrucao de processamento que mapeia termos curtos (como `"authentication"`) para IRIs completos (como `"https://w3id.org/security#authenticationMethod"`).

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    {
      "myExtension": "https://example.com/ns/myExtension#"
    }
  ],
  "id": "did:example:456",
  "myExtension:customField": "valor personalizado"
}
```

- **Exemplo**: Um processador JSON-LD expande `"authentication"` para o IRI `"https://w3id.org/security#authenticationMethod"`. Dois documentos que usam termos diferentes mas mapeiam para o mesmo IRI sao semanticamente identicos.

### Processamento JSON-LD: expansao, compactacao e framing
JSON-LD define varios algoritmos de processamento que afetam como DID Documents sao interpretados:

**Expansao** remove o contexto e expressa tudo com IRIs completos:

```json
[
  {
    "https://w3id.org/security#verificationMethod": [
      {
        "@id": "did:example:123#key-1",
        "@type": ["https://w3id.org/security#Ed25519VerificationKey2020"],
        "https://w3id.org/security#controller": [
          {"@id": "did:example:123"}
        ],
        "https://w3id.org/security#publicKeyMultibase": [
          {"@value": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"}
        ]
      }
    ]
  }
]
```

**Compactacao** faz o inverso — aplica um contexto para encurtar IRIs em termos legeis:

```javascript
const jsonld = require('jsonld');

// Expandir documento
const expanded = await jsonld.expand(didDocument);

// Compactar com contexto especifico
const compacted = await jsonld.compact(didDocument, {
  "@context": "https://www.w3.org/ns/did/v1"
});
```

- **Exemplo**: A expansao e util para comparacao canonica: dois documentos com contextos diferentes podem ser expandidos para a mesma forma canonica, provando equivalencia semantica.

### Implicacoes praticas de JSON vs. JSON-LD
A escolha entre JSON e JSON-LD tem consequencias reais para implementacao:

| Aspecto | JSON (`did+json`) | JSON-LD (`did+ld+json`) |
|---|---|---|
| Complexidade de processamento | Baixa | Alta (requer processador JSON-LD) |
| Semantica | Implicita (por convencao) | Explicita (por IRIs) |
| Extensibilidade | Por convencao | Por contexto formal |
| Tamanho | Menor | Maior (contextos remotos) |
| Interoperabilidade semantica | Limitada | Alta |
| Dependencias externas | Nenhuma | Resolucao de contextos remotos |

A especificacao DID Core exige que implementacoes suportem **pelo menos** a producao e consumo de JSON (`application/did+json`). JSON-LD e recomendado mas nao obrigatorio.

- **Exemplo**: Uma carteira mobile pode optar por JSON puro para evitar a latencia de resolver contextos remotos, enquanto um registry empresarial pode preferir JSON-LD para garantir interoperabilidade semantica com outros sistemas de dados linkados.

---

## 3. CBOR, representacoes alternativas e extensibilidade

### Representacao CBOR
CBOR (Concise Binary Object Representation, RFC 8949) e um formato binario que codifica as mesmas estruturas de dados que JSON, mas de forma mais compacta. O media type para DID Documents em CBOR e `application/did+cbor`.

CBOR e especialmente relevante para cenarios com restricoes de banda e processamento, como dispositivos IoT, comunicacao Bluetooth Low Energy e protocolos de transporte compactos.

```python
import cbor2
import json

# DID Document como dicionario Python
did_doc = {
    "@context": "https://www.w3.org/ns/did/v1",
    "id": "did:example:789",
    "verificationMethod": [{
        "id": "did:example:789#key-1",
        "type": "Ed25519VerificationKey2020",
        "controller": "did:example:789",
        "publicKeyMultibase": "z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK"
    }],
    "authentication": ["did:example:789#key-1"]
}

# Serializar para CBOR
cbor_bytes = cbor2.dumps(did_doc)
print(f"JSON: {len(json.dumps(did_doc))} bytes")
print(f"CBOR: {len(cbor_bytes)} bytes")
# JSON: ~350 bytes, CBOR: ~280 bytes (economia de ~20%)

# Desserializar CBOR
recovered = cbor2.loads(cbor_bytes)
assert recovered == did_doc
```

As regras de producao e consumo CBOR sao analogas as de JSON:

1. O media type **MUST** ser `application/did+cbor`.
2. Propriedades do modelo de dados sao mapeadas para CBOR major types correspondentes.
3. Propriedades desconhecidas **MUST** ser preservadas.

- **Exemplo**: Um sensor IoT com DID `did:example:sensor-001` armazena seu DID Document em CBOR na memoria flash, economizando bytes preciosos. Quando consultado via CoAP (Constrained Application Protocol), retorna o documento em CBOR diretamente.

### Negociacao de representacao via content negotiation
Quando um resolver HTTP recebe uma requisicao, o cliente pode indicar qual representacao prefere usando o header `Accept`:

```http
GET /1.0/identifiers/did:example:123 HTTP/1.1
Host: resolver.example.com
Accept: application/did+json

---

GET /1.0/identifiers/did:example:123 HTTP/1.1
Host: resolver.example.com
Accept: application/did+ld+json

---

GET /1.0/identifiers/did:example:123 HTTP/1.1
Host: resolver.example.com
Accept: application/did+cbor
```

O resolver deve respeitar a preferencia do cliente (quando suportada) ou retornar `406 Not Acceptable` se nao puder atender.

- **Exemplo**: Um Universal Resolver como o da DIF (Decentralized Identity Foundation) pode aceitar todos os tres media types e converter internamente entre representacoes, servindo cada cliente no formato mais adequado.

### Extensibilidade do modelo de dados
A especificacao DID Core foi projetada para ser extensivel em duas dimensoes:

**1. Extensao via @context (JSON-LD):**
Novos termos podem ser adicionados incluindo contextos adicionais:

```json
{
  "@context": [
    "https://www.w3.org/ns/did/v1",
    "https://example.com/ns/healthcare/v1"
  ],
  "id": "did:example:hospital-123",
  "healthcare:licenseNumber": "HC-2024-98765",
  "healthcare:jurisdiction": "BR"
}
```

**2. Extensao via propriedades adicionais (JSON):**
Mesmo sem JSON-LD, propriedades adicionais sao permitidas e devem ser preservadas:

```json
{
  "@context": "https://www.w3.org/ns/did/v1",
  "id": "did:example:device-456",
  "verificationMethod": [...],
  "deviceMetadata": {
    "manufacturer": "ExampleCorp",
    "firmwareVersion": "2.1.0",
    "capabilities": ["temperature", "humidity"]
  }
}
```

**3. Extensao via DID Method:**
Cada DID Method pode definir propriedades especificas, como metadados de resolucao, parametros de query customizados e tipos de verification method adicionais.

- **Exemplo**: O DID Method `did:ethr` estende o modelo com metadados especificos da blockchain Ethereum, como o endereco do smart contract registry e o chain ID da rede.

---

## Conclusao
Nesta aula, estudamos as tres representacoes padronizadas do DID Document — JSON, JSON-LD e CBOR — e as regras de producao e consumo de cada uma. Vimos que JSON e o formato mais simples e obrigatorio, JSON-LD adiciona semantica formal via processamento de contextos, e CBOR oferece compactacao binaria para cenarios com restricoes. Tambem exploramos como o modelo de dados e extensivel por meio de contextos, propriedades adicionais e especificacoes de DID Methods. A capacidade de escolher a representacao adequada para cada cenario e uma habilidade essencial para arquitetos de sistemas de identidade descentralizada.

---

## Licao de Casa
1. Pegue o DID Document de referencia da aula anterior e serialize-o em JSON e CBOR (usando Python ou outra linguagem). Compare o tamanho em bytes e documente a diferenca percentual.
2. Usando uma biblioteca JSON-LD (como `jsonld` em JavaScript ou `pyld` em Python), expanda o DID Document de referencia e analise a forma expandida. Identifique os IRIs completos de pelo menos tres propriedades.
3. Projete um cenario de extensibilidade: crie um contexto JSON-LD customizado que adicione duas propriedades novas a um DID Document para um caso de uso especifico (saude, educacao, supply chain, etc.).

---

## Proxima Aula
Na proxima aula, vamos estudar a resolucao deterministica de DIDs e estrategias de caching, entendendo como um resolver transforma um DID em um DID Document de forma confiavel e eficiente. Ate la!

---

## Questionario

**1. Qual e o media type correto para um DID Document em JSON puro?**
a) application/json
b) application/did+json
c) application/ld+json
d) text/json
**Resposta: b**

**2. O que acontece quando um consumer encontra uma propriedade desconhecida em um DID Document?**
a) Deve rejeitar o documento como invalido
b) Deve ignorar a propriedade e remove-la
c) Deve preservar a propriedade no modelo de dados
d) Deve converter a propriedade para um formato padrao
**Resposta: c**

**3. Qual e a principal vantagem do CBOR sobre JSON para DID Documents?**
a) Melhor legibilidade humana
b) Suporte nativo a JSON-LD
c) Representacao binaria mais compacta
d) Maior compatibilidade com navegadores web
**Resposta: c**

**4. O que a operacao de "expansao" faz em um DID Document JSON-LD?**
a) Comprime o documento para reduzir tamanho
b) Remove o @context e expressa todos os termos como IRIs completos
c) Adiciona campos obrigatorios ausentes
d) Converte o documento de JSON para CBOR
**Resposta: b**

**5. A especificacao W3C DID Core exige que implementacoes suportem no minimo qual representacao?**
a) Apenas CBOR
b) Apenas JSON-LD
c) JSON (application/did+json)
d) Todas as tres representacoes igualmente
**Resposta: c**
