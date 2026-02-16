# Aula 3.1: O que e um Metodo DID? Tipos: Baseados em Ledger, Web, Peer-to-Peer, Key-Only

## Abertura
Bem-vindo a aula 3.1! Ate aqui voce ja compreende a estrutura de um DID e de um DID Document. Agora vamos mergulhar em um dos conceitos mais importantes da arquitetura de identidade descentralizada: os **metodos DID**. O metodo DID e o componente que define *como* um identificador e criado, resolvido, atualizado e desativado. Diferentes metodos implicam diferentes garantias de seguranca, modelos de confianca e trade-offs operacionais. Nesta aula vamos construir uma taxonomia solida dos tipos de metodos existentes.

### Programa da aula:
1. Anatomia de um metodo DID (introducao)
2. Taxonomia dos metodos DID (base e aprofundamento)
3. Arquitetura interna de cada categoria (Conceito principal da aula)

---

## 1. Anatomia de um Metodo DID

### 1.1 Definicao formal segundo a W3C
Um metodo DID e uma especificacao que define o conjunto de operacoes CRUD (Create, Read, Resolve, Update, Deactivate) para um determinado namespace DID. Cada metodo e identificado pelo componente `method-name` na sintaxe do DID:

```
did:<method-name>:<method-specific-id>
```

A especificacao de um metodo DID deve descrever com precisao:

- O algoritmo de **criacao** do identificador e do DID Document inicial.
- O mecanismo de **resolucao** (como transformar um DID em um DID Document).
- As regras de **atualizacao** do DID Document (rotacao de chaves, alteracao de endpoints).
- O procedimento de **desativacao** (revogacao permanente ou temporaria).

- **Exemplo**: O metodo `did:ethr` especifica que a criacao deriva de um endereco Ethereum, a resolucao consulta um contrato `EthereumDIDRegistry`, e a atualizacao emite transacoes on-chain com `setAttribute` ou `changeOwner`.

### 1.2 O DID Method Registry
A W3C mantinha um registro informal de metodos DID. Atualmente existem mais de 150 metodos registrados, porem apenas uma fracao possui adocao significativa. Os criterios para avaliar a maturidade de um metodo incluem:

- **Especificacao publicada**: documento formal descrevendo todas as operacoes.
- **Implementacao de referencia**: pelo menos um resolver funcional em producao.
- **Conformidade com DID Core**: aderencia ao data model da W3C DID Core 1.0.
- **Historico de auditoria**: revisao por pares e testes de interoperabilidade.

- **Exemplo**: `did:key` possui especificacao simples e multiplas implementacoes, enquanto metodos proprietarios frequentemente carecem de interoperabilidade real.

### 1.3 Relacao entre metodo e modelo de confianca
O metodo DID determina o **trust anchor** do sistema. Um metodo baseado em blockchain ancora a confianca na imutabilidade do ledger. Um metodo baseado em DNS ancora a confianca na infraestrutura de certificados da web. Esta escolha arquitetural tem implicacoes profundas sobre censura, disponibilidade e soberania do identificador.

- **Exemplo**: `did:web` depende do operador do dominio — se o dominio for apreendido, o DID pode ser comprometido. Ja `did:ion` depende da rede Bitcoin, resistente a censura estatal.

---

## 2. Taxonomia dos Metodos DID

### 2.1 Metodos baseados em Ledger (Blockchain-anchored)
Estes metodos utilizam um ledger distribuido (blockchain ou DLT) como camada de ancoragem. O DID Document (ou um hash dele) e registrado on-chain, garantindo imutabilidade e auditabilidade publica.

**Caracteristicas arquiteturais:**
- Registro publico e verificavel por qualquer no da rede.
- Operacoes de escrita requerem transacoes on-chain (com custos de gas ou taxas).
- Resolucao pode ser feita consultando o ledger diretamente ou via resolver intermediario.
- Historico completo de alteracoes e preservado no ledger.

**Exemplos representativos:**
- `did:ethr` — Ethereum e redes L2 (Polygon, Arbitrum, Optimism).
- `did:ion` — Sidetree protocol sobre Bitcoin.
- `did:sov` / `did:indy` — Hyperledger Indy com rede Sovrin.

- **Exemplo**: Uma organizacao que emite credenciais de compliance regulatorio pode preferir `did:ethr` em uma L2 para garantir auditabilidade publica com custos reduzidos.

### 2.2 Metodos baseados em Web (DNS/HTTPS-anchored)
Utilizam a infraestrutura da web tradicional como camada de ancoragem. O DID Document e hospedado em um servidor web e resolvido via HTTPS.

**Caracteristicas arquiteturais:**
- Resolucao via HTTP GET em URL derivada do DID.
- Dependencia da infraestrutura de DNS e certificados TLS.
- Sem custos de transacao blockchain.
- Modelo de confianca delegado ao operador do dominio.

**Exemplo representativo:** `did:web`

- **Exemplo**: `did:web:empresa.com.br:departamento:rh` resolve para `https://empresa.com.br/departamento/rh/did.json`.

### 2.3 Metodos Peer-to-Peer (Off-ledger, pairwise)
Projetados para interacoes diretas entre duas partes sem necessidade de registro publico. O DID Document e trocado diretamente entre os peers durante o estabelecimento do canal de comunicacao.

**Caracteristicas arquiteturais:**
- Nenhum registro publico — privacidade maxima.
- DID Document compartilhado out-of-band ou via protocolo de pareamento.
- Ideal para relacoes pairwise (1:1) com alta privacidade.
- Atualizacoes propagadas diretamente entre os peers.

**Exemplo representativo:** `did:peer`

- **Exemplo**: Em um protocolo de mensageria como DIDComm, Alice e Bob criam DIDs `did:peer` exclusivos para sua relacao, descartaveis apos o termino da interacao.

### 2.4 Metodos Key-Only (Self-certifying)
O DID e derivado diretamente de material criptografico (chave publica). Nao ha registro externo — o proprio DID *e* a chave. Sao deterministicos e autocertificantes.

**Caracteristicas arquiteturais:**
- DID gerado a partir da codificacao da chave publica (geralmente Multicodec + Multibase).
- DID Document e gerado algoritmicamente a partir do DID — nao e armazenado em lugar nenhum.
- Imutavel: nao suporta rotacao de chaves nem atualizacao.
- Extremamente simples e portavel.

**Exemplo representativo:** `did:key`

- **Exemplo**: `did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK` codifica uma chave Ed25519. O resolver decodifica o DID para reconstruir o DID Document automaticamente.

---

## 3. Arquitetura Interna de Cada Categoria

### 3.1 Modelo de resolucao por categoria
Cada categoria de metodo DID possui um fluxo de resolucao arquiteturalmente distinto:

| Categoria | Fonte de verdade | Resolucao | Latencia tipica |
|-----------|-----------------|-----------|-----------------|
| Ledger-based | Blockchain/DLT | Query ao no ou indexador | 1-30s |
| Web-based | Servidor HTTPS | HTTP GET | 100-500ms |
| Peer-to-peer | Peer local | Cache local / troca direta | <10ms |
| Key-only | O proprio DID | Decodificacao algoritmica | <1ms |

A latencia de resolucao e um fator critico em arquiteturas que exigem verificacao em tempo real, como autenticacao em APIs ou validacao de Verifiable Presentations.

### 3.2 Modelo de persistencia e durabilidade
A durabilidade de um DID — ou seja, a garantia de que ele permanecera resolvivel ao longo do tempo — varia drasticamente:

- **Ledger-based**: Durabilidade maxima enquanto a rede existir. O historico e imutavel.
- **Web-based**: Duravel apenas enquanto o dominio e o servidor estiverem operacionais. Risco de *link rot*.
- **Peer-to-peer**: Efemero por design. Duravel apenas enquanto ambas as partes mantiverem o estado.
- **Key-only**: Teoricamente eterno (o DID e a chave), mas sem mecanismo de recuperacao se a chave privada for perdida.

- **Exemplo**: Um DID de uma credencial academica emitida por uma universidade deve usar um metodo com alta durabilidade (ledger-based), pois a credencial pode ser verificada decadas apos a emissao.

### 3.3 Modelo de governanca e controle
A questao de *quem controla* o DID e central na arquitetura:

- **Ledger-based**: Controlado pelo detentor da chave privada associada ao endereco on-chain. Governanca pode ser delegada via smart contracts (multisig, DAOs).
- **Web-based**: Controlado pelo administrador do dominio DNS. Governanca depende de politicas organizacionais e controle de acesso ao servidor.
- **Peer-to-peer**: Controlado exclusivamente pelas partes envolvidas. Nao ha autoridade externa.
- **Key-only**: Controlado exclusivamente pelo detentor da chave privada. Sem delegacao possivel.

- **Exemplo**: Uma empresa pode usar `did:web` para DIDs organizacionais (controlados pela equipe de TI) e `did:key` para credenciais efemeras de microservicos em pipelines CI/CD.

### 3.4 Combinacao de metodos em arquiteturas hibridas
Na pratica, sistemas de identidade descentralizada maduros utilizam **multiplos metodos DID** simultaneamente. Uma arquitetura hibrida tipica poderia ser:

1. **did:web** para a identidade publica da organizacao (facilidade de descoberta).
2. **did:ethr** (L2) para DIDs de longa duracao associados a emissao de credenciais.
3. **did:peer** para canais de comunicacao privados via DIDComm.
4. **did:key** para operacoes efemeras e testes.

Esta abordagem multi-metodo permite otimizar cada camada do sistema para seus requisitos especificos.

---

## Conclusao
Nesta aula construimos uma taxonomia dos metodos DID organizada em quatro categorias: ledger-based, web-based, peer-to-peer e key-only. Cada categoria possui caracteristicas arquiteturais distintas em termos de resolucao, persistencia, governanca e modelo de confianca. Compreender essas diferencas e fundamental para tomar decisoes informadas ao projetar sistemas de identidade descentralizada. Na proxima aula, faremos um estudo aprofundado dos metodos mais relevantes do ecossistema.

---

## Licao de Casa
1. Consulte o DID Method Registry e selecione tres metodos que voce nao conhecia. Classifique cada um na taxonomia apresentada (ledger, web, peer, key-only) e justifique.
2. Desenhe um diagrama de fluxo de resolucao para um metodo ledger-based e outro para um metodo key-only, destacando as diferencas em numero de etapas e dependencias externas.
3. Projete uma arquitetura hibrida para um sistema de credenciais de saude que precisa de: identidade publica do hospital, credenciais verificaveis de pacientes e canal privado medico-paciente. Justifique a escolha de metodo para cada componente.

---

## Proxima Aula
Na proxima aula, vamos realizar um estudo detalhado dos principais metodos DID do ecossistema: did:ethr, did:ion, did:web, did:key, did:peer e did:sov/did:indy. Analisaremos a arquitetura interna, o modelo de resolucao e as particularidades de implementacao de cada um. Ate la!

---

## Questionario

**1. Qual componente do DID identifica o metodo utilizado?**
a) O method-specific-id
b) O prefixo "did:"
c) O method-name, segundo componente da sintaxe did:<method-name>:<id>
d) O DID Document associado
**Resposta: c**

**2. Qual categoria de metodo DID oferece a menor latencia de resolucao?**
a) Ledger-based, pois a blockchain e otimizada para leituras rapidas
b) Web-based, pois utiliza HTTP cacheavel
c) Peer-to-peer, pois o DID Document esta no cache local
d) Key-only, pois a resolucao e puramente algoritmica sem I/O externo
**Resposta: d**

**3. Qual e o principal risco de durabilidade associado ao metodo did:web?**
a) A chave criptografica pode ser comprometida por computacao quantica
b) O dominio DNS pode expirar, ser apreendido ou o servidor pode sair do ar, tornando o DID irresolvivel
c) A blockchain subjacente pode sofrer um fork que invalida o DID
d) O protocolo HTTP pode ser descontinuado
**Resposta: b**

**4. Em que cenario o uso de did:peer e mais adequado?**
a) Emissao de credenciais academicas de longa duracao
b) Identidade publica de uma organizacao governamental
c) Comunicacao privada e efemera entre duas partes via DIDComm
d) Registro de identidade em um sistema de compliance regulatorio
**Resposta: c**

**5. Por que arquiteturas de identidade descentralizada maduras costumam combinar multiplos metodos DID?**
a) Porque a W3C exige o uso de pelo menos dois metodos em producao
b) Porque cada metodo otimiza diferentes requisitos (privacidade, durabilidade, custo, descoberta) e nenhum metodo isolado atende todos os cenarios
c) Porque metodos individuais possuem limites de uso que exigem balanceamento de carga
d) Porque a interoperabilidade so funciona quando ambas as partes usam metodos diferentes
**Resposta: b**
