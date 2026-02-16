# Aula 3.4: Criterios para Escolha do Metodo DID Adequado a Cada Caso de Uso

## Abertura
Bem-vindo a aula 3.4! Ao longo deste modulo estudamos a taxonomia, a arquitetura interna e os trade-offs dos principais metodos DID. Nesta aula final do modulo, vamos sintetizar todo esse conhecimento em um framework de decisao pratico. O objetivo e fornecer criterios objetivos e uma metodologia sistematica para selecionar o metodo DID mais adequado a cada caso de uso, considerando requisitos tecnicos, organizacionais e regulatorios.

### Programa da aula:
1. Requisitos de sistema e classificacao de cenarios (introducao)
2. Framework de decisao e arvore de escolha (base e aprofundamento)
3. Estudos de caso aplicados (Conceito principal da aula)

---

## 1. Requisitos de Sistema e Classificacao de Cenarios

### 1.1 Levantamento de requisitos para escolha de metodo DID
Antes de selecionar um metodo DID, e necessario levantar requisitos em seis eixos fundamentais:

**Eixo 1 — Durabilidade do identificador:**
- O DID precisa ser resolvivel por quanto tempo? Dias, anos, decadas?
- Credenciais academicas ou profissionais exigem durabilidade de decadas.
- Sessoes de autenticacao exigem durabilidade de minutos a horas.

**Eixo 2 — Modelo de confianca aceitavel:**
- Quais pressupostos de confianca sao aceitaveis? Confianca em blockchain publica, consorcio, operador de dominio?
- Ambientes regulados podem exigir (ou proibir) dependencia de blockchain.
- Ambientes de alta soberania exigem que nenhuma entidade individual controle o DID.

**Eixo 3 — Requisitos de privacidade:**
- As interacoes precisam ser nao-correlacionaveis?
- Existem requisitos de LGPD/GDPR que restringem dados on-chain?
- Selective disclosure e necessario?

**Eixo 4 — Escala e performance:**
- Quantos DIDs serao criados? Centenas, milhoes, bilhoes?
- Qual a latencia maxima aceitavel para resolucao?
- Qual o throughput necessario de operacoes por segundo?

**Eixo 5 — Custo operacional:**
- Qual o orcamento para infraestrutura de identidade?
- Custos por operacao sao aceitaveis ou o modelo deve ser flat-rate?
- Ha equipe tecnica para operar infraestrutura blockchain?

**Eixo 6 — Conformidade e interoperabilidade:**
- O sistema precisa interoperar com ecossistemas existentes (EBSI, Gaia-X, mDL)?
- Ha requisitos regulatorios sobre o tipo de infraestrutura permitida?
- Quais carteiras e resolvers o sistema precisa suportar?

- **Exemplo**: Um sistema de identidade para IoT industrial pode ter requisitos de alta escala (milhoes de dispositivos), baixa latencia (resolucao em milissegundos), e baixo custo por unidade, favorecendo did:key ou did:peer.

### 1.2 Classificacao de cenarios tipicos
Podemos classificar os cenarios de uso em categorias arquetipicas:

**Cenario A — Identidade organizacional publica:**
Organizacoes que precisam de um identificador descobrivel, estavel e associavel a sua marca. Durabilidade alta, privacidade baixa, escala baixa (poucos DIDs).

**Cenario B — Emissao massiva de credenciais:**
Emissores que criam milhares a milhoes de credenciais. Escala alta, custo por unidade critico, durabilidade media a alta.

**Cenario C — Comunicacao privada entre partes:**
Canais seguros de comunicacao bidirecional. Privacidade maxima, durabilidade efemera, escala media.

**Cenario D — Identidade de usuarios finais (holder):**
Pessoas fisicas portando credenciais em wallets. Privacidade alta, durabilidade alta, custo zero para o usuario.

**Cenario E — Dispositivos IoT e maquinas:**
Identificadores para dispositivos autonomos. Escala massiva, baixa latencia, custo por unidade minimo.

- **Exemplo**: Uma universidade emitindo diplomas digitais se enquadra no Cenario B (emissao massiva), enquanto a identidade publica da propria universidade se enquadra no Cenario A.

### 1.3 Restricoes tecnicas e organizacionais
Alem dos requisitos funcionais, restricoes praticas influenciam a escolha:

- **Maturidade da equipe**: operar nos Ethereum ou Bitcoin requer expertise especifica.
- **Infraestrutura existente**: organizacoes com dominio web consolidado podem preferir did:web pela simplicidade.
- **Ecossistema de parceiros**: se parceiros ja utilizam um metodo especifico, interoperabilidade e prioridade.
- **Regulacao setorial**: setores como saude e financeiro podem ter restricoes sobre uso de blockchains publicas para dados de identidade.

---

## 2. Framework de Decisao e Arvore de Escolha

### 2.1 Arvore de decisao por cenario
A seguinte arvore de decisao sistematiza a escolha do metodo DID:

```
[1] O DID precisa ser publicamente descobrivel?
    |
    +-- NAO --> [2] E uma relacao pairwise entre duas partes?
    |               |
    |               +-- SIM --> did:peer (numalgo 2 ou 4)
    |               |
    |               +-- NAO --> [3] Precisa de rotacao de chaves?
    |                               |
    |                               +-- NAO --> did:key
    |                               |
    |                               +-- SIM --> did:peer (numalgo 2)
    |
    +-- SIM --> [4] Ha infraestrutura blockchain disponivel?
                    |
                    +-- NAO --> did:web
                    |
                    +-- SIM --> [5] Imutabilidade e critica?
                                    |
                                    +-- SIM --> [6] Custo e restrito?
                                    |               |
                                    |               +-- SIM --> did:ion (batching)
                                    |               |                   ou did:ethr (L2)
                                    |               +-- NAO --> did:ethr (mainnet)
                                    |                           ou did:ion
                                    |
                                    +-- NAO --> did:ethr (L2) ou did:web
```

- **Exemplo**: Um governo implementando carteira de identidade digital: DID deve ser publicamente descobrivel (SIM) -> ha infraestrutura blockchain (SIM) -> imutabilidade e critica (SIM) -> custo e restrito para milhoes de cidadaos (SIM) -> did:ion com batching ou did:ethr em L2.

### 2.2 Matriz de adequacao por cenario
Mapeando os cenarios da secao 1.2 para metodos recomendados:

| Cenario | Metodo primario | Metodo secundario | Justificativa |
|---------|----------------|-------------------|---------------|
| A: Identidade org. publica | did:web | did:ethr (L2) | Descoberta facil + ancoragem opcional |
| B: Emissao massiva | did:key (issuer efemero) | did:ethr (L2) para issuer principal | Custo zero por credencial |
| C: Comunicacao privada | did:peer | - | Privacidade maxima |
| D: Identidade de holders | did:key + did:peer | did:ethr (L2) para identidade longa duracao | Flexibilidade + privacidade |
| E: Dispositivos IoT | did:key | did:peer (device-to-gateway) | Escala e simplicidade |

### 2.3 Padrao arquitetural multi-metodo
Na pratica, sistemas robustos adotam um **padrao multi-metodo** com separacao de funcoes:

**Camada 1 — Identidade publica (discovery layer):**
- did:web ou did:ethr para a identidade organizacional.
- Objetivo: permitir que terceiros descubram e verifiquem o emissor.

**Camada 2 — Identidade de longa duracao (anchor layer):**
- did:ethr (L2) ou did:ion para DIDs que precisam de durabilidade e auditabilidade.
- Objetivo: ancoragem imutavel para credenciais de longo prazo.

**Camada 3 — Identidade relacional (communication layer):**
- did:peer para canais DIDComm entre agentes.
- Objetivo: privacidade e eficiencia na comunicacao.

**Camada 4 — Identidade efemera (utility layer):**
- did:key para operacoes descartaveis, testes, e referencia em credenciais simples.
- Objetivo: simplicidade maxima sem overhead.

- **Exemplo**: Um ecossistema de credenciais de saude pode usar did:web para a identidade do Ministerio da Saude (Camada 1), did:ethr em Polygon para DIDs de hospitais e profissionais emissores (Camada 2), did:peer para comunicacao medico-paciente (Camada 3), e did:key para tokens de sessao temporarios (Camada 4).

---

## 3. Estudos de Caso Aplicados

### 3.1 Estudo de caso: credenciais academicas
**Contexto**: Uma universidade com 50.000 alunos emite diplomas digitais como Verifiable Credentials.

**Requisitos levantados:**
- Durabilidade: 50+ anos (vida profissional do graduado).
- Verificabilidade publica: empregadores precisam verificar sem contatar a universidade.
- Escala: ~10.000 credenciais/ano.
- Custo: orcamento limitado.

**Decisao arquitetural:**
- **DID da universidade**: `did:web:universidade.edu.br` — descoberta facil, alinhado com dominio institucional. Complementado com ancoragem em `did:ethr:<polygon-chain-id>:<address>` para durabilidade.
- **DID dos diplomas/issuer key**: did:key referenciado no DID Document da universidade — sem custo adicional por emissao.
- **Rotacao de chaves do issuer**: via atualizacao do DID Document did:web e transacao did:ethr para registrar nova chave.

- **Exemplo**: O empregador resolve `did:web:universidade.edu.br`, obtem as chaves publicas de verificacao, e valida a assinatura do diploma. Para verificacao de longo prazo, consulta a ancoragem did:ethr que prova que a chave existia no momento da emissao.

### 3.2 Estudo de caso: identidade para supply chain
**Contexto**: Consorcio de 200 empresas rastreando produtos da manufatura ao varejo.

**Requisitos levantados:**
- Auditabilidade: reguladores precisam verificar historico completo.
- Interoperabilidade: empresas usam sistemas diferentes.
- Imutabilidade: registros nao podem ser alterados retroativamente.
- Escala: milhoes de eventos por dia.

**Decisao arquitetural:**
- **DID das empresas**: `did:ethr:<polygon>:<address>` — identidade auditavel on-chain com custos baixos em L2.
- **DID dos produtos**: did:key derivado de identificadores unicos do produto (serial number) — sem custo, alta escala.
- **Comunicacao inter-empresa**: did:peer para canais DIDComm privados entre parceiros comerciais.

### 3.3 Estudo de caso: carteira de identidade digital governamental
**Contexto**: Governo nacional implementando identidade digital para 200 milhoes de cidadaos.

**Requisitos levantados:**
- Escala extrema: centenas de milhoes de identidades.
- Privacidade: LGPD compliance, dados pessoais nao podem ficar on-chain.
- Inclusao: cidadaos nao devem pagar custos de blockchain.
- Soberania: governo deve manter controle da infraestrutura.
- Longevidade: sistema deve funcionar por decadas.

**Decisao arquitetural:**
- **DID do governo e orgaos emissores**: `did:web:<orgao>.gov.br` com ancoragem em did:ethr (rede governamental L2 ou rede publica).
- **DID dos cidadaos (holder)**: did:key armazenado na carteira digital do cidadao — sem custo, sem dado on-chain.
- **Interacoes cidadao-servico**: did:peer para cada relacao cidadao-orgao publico — privacidade entre relacoes.
- **Credenciais com ZKP**: formato AnonCreds ou BBS+ para selective disclosure (independente do metodo DID).

- **Exemplo**: Quando o cidadao apresenta sua carteira digital em um servico publico, a verificacao usa did:key (efemero, privado) para a identidade do cidadao e did:web do orgao emissor para validar a credencial. Nenhum dado do cidadao fica registrado em blockchain.

### 3.4 Anti-padroes e erros comuns
Erros frequentes na escolha de metodo DID:

1. **Usar did:ethr mainnet para identidade de milhoes de usuarios**: custo proibitivo. Use L2 ou did:key.
2. **Usar did:web como unica ancora para credenciais de longa duracao**: risco de link rot. Complemente com ancoragem blockchain.
3. **Usar um unico DID on-chain para todas as interacoes de um holder**: destruicao de privacidade por correlacao. Use did:peer pairwise.
4. **Ignorar a necessidade de rotacao de chaves ao escolher did:key**: se a chave for comprometida, nao ha recuperacao. Planeje o ciclo de vida.
5. **Escolher metodo baseado em hype e nao em requisitos**: a decisao deve ser guiada pelos seis eixos de requisitos, nao por preferencia tecnologica.

---

## Conclusao
Nesta aula construimos um framework completo para escolha de metodos DID: definimos seis eixos de requisitos, classificamos cenarios tipicos, apresentamos uma arvore de decisao, validamos com tres estudos de caso detalhados e identificamos anti-padroes comuns. A mensagem central e que a escolha de metodo DID e uma decisao de engenharia de sistemas que deve ser fundamentada em requisitos concretos, e que sistemas maduros quase sempre utilizam multiplos metodos em combinacao.

---

## Licao de Casa
1. Escolha uma organizacao real (sua empresa, universidade, ou orgao publico) e realize o levantamento completo dos seis eixos de requisitos. Aplique a arvore de decisao e proponha a arquitetura multi-metodo mais adequada. Documente os trade-offs aceitos.
2. Implemente um Proof of Concept que demonstre o padrao multi-metodo: crie um DID did:web para um emissor, um did:key para o holder, e estabeleca um canal did:peer entre eles. Use o Universal Resolver para resolver cada DID e valide que o DID Document retornado esta correto.
3. Analise um dos anti-padroes listados na secao 3.4 e projete uma arquitetura corretiva. Documente o problema, a solucao proposta e os custos de migracao estimados.

---

## Proxima Aula
Na proxima aula, iniciamos o Modulo 4, onde vamos explorar em profundidade as operacoes de ciclo de vida dos DIDs: Create, Read/Resolve, Update e Deactivate. Entenderemos como cada operacao funciona internamente nos metodos que estudamos e quais sao as implicacoes de seguranca de cada uma. Ate la!

---

## Questionario

**1. Qual dos seis eixos de requisitos e mais critico para decidir entre did:key e did:ethr para identidade de holders?**
a) Conformidade e interoperabilidade, pois did:key nao e padronizado
b) Custo operacional e privacidade: did:key tem custo zero e nao expoe dados on-chain, enquanto did:ethr tem custo por operacao e historico publico
c) Durabilidade, pois did:ethr dura mais por estar registrado on-chain
d) Escala e performance, pois did:ethr tem throughput superior
**Resposta: b**

**2. Na arvore de decisao, qual metodo e recomendado quando o DID NAO precisa ser publicamente descobrivel e a relacao e pairwise?**
a) did:key, pois e o mais simples
b) did:web, pois pode ser configurado como privado
c) did:peer, pois foi projetado especificamente para relacoes pairwise privadas
d) did:ethr, pois oferece mais flexibilidade
**Resposta: c**

**3. No estudo de caso de credenciais academicas, por que a universidade usa did:web complementado com did:ethr?**
a) Porque a W3C exige dois metodos para conformidade
b) Porque did:web oferece descoberta facil alinhada ao dominio institucional, enquanto did:ethr em L2 fornece ancoragem imutavel para verificacao de longo prazo
c) Porque did:web e mais rapido para emissao e did:ethr e mais rapido para verificacao
d) Porque did:web funciona offline e did:ethr funciona online
**Resposta: b**

**4. Qual anti-padrao e mais prejudicial a privacidade dos holders de credenciais?**
a) Usar did:ethr mainnet para identidade de milhoes de usuarios
b) Usar did:web como unica ancora para credenciais de longa duracao
c) Usar um unico DID on-chain para todas as interacoes de um holder, permitindo correlacao total entre contextos
d) Escolher metodo baseado em hype e nao em requisitos
**Resposta: c**

**5. No padrao multi-metodo de quatro camadas, qual camada e responsavel pela comunicacao privada entre agentes?**
a) Camada 1 (discovery layer) com did:web
b) Camada 2 (anchor layer) com did:ethr
c) Camada 3 (communication layer) com did:peer
d) Camada 4 (utility layer) com did:key
**Resposta: c**
