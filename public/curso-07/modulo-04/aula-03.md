# Aula 4.3: Papel da blockchain/DLT: quando e necessaria e quando e opcional

## Abertura
Bem-vindo a aula 4.3! Existe um equivoco comum de que identidade descentralizada e sinonimo de blockchain. Na realidade, a blockchain e apenas uma das ferramentas disponiveis, e nem sempre e a melhor escolha. Nesta aula, vamos desmistificar essa relacao, entender quando uma DLT (Distributed Ledger Technology) agrega valor real e quando alternativas mais simples sao suficientes ou ate preferíveis.

### Programa da aula:
1. Funcoes da blockchain no ecossistema de identidade (o que ela realmente faz)
2. Quando a blockchain e necessaria (casos de uso que demandam DLT)
3. Quando a blockchain e opcional ou desnecessaria (alternativas e abordagens sem ledger)

---

## 1. Funcoes da Blockchain no Ecossistema de Identidade

### O que a blockchain realmente faz
Para avaliar quando a blockchain e necessaria, precisamos primeiro entender com precisao quais funcoes ela desempenha no ecossistema de identidade descentralizada. A blockchain nao armazena identidades; ela fornece propriedades especificas que sao dificeis de obter de outras formas:

**Registro imutavel e auditavel**: uma vez que um DID ou schema e registrado, o historico de alteracoes fica permanentemente disponivel. Ninguem pode reescrever o passado.

**Consenso descentralizado**: multiplos participantes independentes concordam sobre o estado atual dos registros sem precisar confiar uns nos outros.

**Resistencia a censura**: nenhuma entidade individual pode impedir o registro ou a resolucao de um DID.

**Disponibilidade sem ponto unico de falha**: o registro continua acessivel mesmo se varios nos da rede saiam do ar.

- **Exemplo**: no ecossistema Sovrin, a blockchain Hyperledger Indy garante que o DID de uma universidade registrado em 2020 continue resolvivel em 2030, mesmo que a propria Sovrin Foundation mude de lideranca ou que alguns nos da rede sejam desligados. A confianca nao depende de nenhuma entidade individual.

### Tipos de DLT utilizados
Nem toda blockchain e igual, e a escolha do tipo de DLT impacta significativamente o ecossistema:

**Blockchains publicas sem permissao** (Ethereum, Bitcoin):
- Qualquer pessoa pode participar como no
- Maxima descentralizacao e resistencia a censura
- Custos de transacao (gas fees) e velocidade variavel

**Blockchains publicas permissionadas** (Sovrin/Indy):
- Nos validadores sao selecionados por governanca
- Leitura publica, escrita controlada
- Custos previsíveis e melhor performance

**DLTs privadas/consorciais** (Hyperledger Fabric, Corda):
- Participacao restrita a membros do consorcio
- Alta performance e privacidade
- Menor descentralizacao

- **Exemplo**: o sistema de identidade digital da Catalunha (IdentiCAT) optou por uma blockchain permissionada porque precisava de governanca publica clara e performance previsivel, mas ainda queria os beneficios de descentralizacao e imutabilidade que uma DLT oferece.

---

## 2. Quando a Blockchain e Necessaria

### Cenarios que demandam DLT
Existem situacoes onde as propriedades unicas de uma blockchain sao genuinamente necessarias e dificeis de replicar com outras tecnologias:

**Multi-stakeholder sem confianca mutua**: quando multiplas organizacoes independentes precisam compartilhar um registro de confianca, mas nenhuma confia nas outras para operar esse registro sozinha.

- **Exemplo**: em um consorcio de universidades de diferentes paises que querem reconhecer mutuamente diplomas digitais, nenhuma universidade aceitaria que outra controlasse o registro central. Uma blockchain permissionada onde todas participam como nos validadores resolve esse impasse de confianca.

**Persistencia de longo prazo**: quando os registros precisam sobreviver a mudancas organizacionais, politicas ou economicas por decadas.

- **Exemplo**: credenciais de identidade civil (certidoes de nascimento, cidadania) precisam ser verificaveis por 80+ anos. Nenhuma empresa ou governo garante estabilidade por esse periodo. Uma blockchain publica, mantida por incentivos economicos distribuidos, oferece maior probabilidade de persistencia.

**Resistencia a censura real**: quando existe risco concreto de que uma autoridade tente invalidar ou bloquear identidades de forma ilegitima.

- **Exemplo**: refugiados que perdem documentos ao fugir de conflitos podem ter DIDs ancorados em uma blockchain publica que nenhum governo pode censurar ou invalidar. Organizacoes humanitarias como o ACNUR ja exploram esse tipo de solucao.

**Auditabilidade publica obrigatoria**: quando regulamentacoes ou requisitos de compliance exigem que o historico de alteracoes em registros de identidade seja publicamente verificavel.

### Analise custo-beneficio
Mesmo nos cenarios acima, a decisao de usar blockchain deve passar por uma analise rigorosa:

- **Custo de operacao**: manter nos de blockchain tem custos de infraestrutura, energia e governanca
- **Complexidade tecnica**: integrar com blockchain adiciona camadas de complexidade ao sistema
- **Maturidade**: nem todas as plataformas blockchain tem o mesmo nivel de maturidade e ecossistema de ferramentas
- **Regulamentacao**: algumas jurisdicoes tem restricoes sobre uso de blockchains publicas para dados governamentais

- **Exemplo**: o governo da Estonia usa uma tecnologia chamada KSI (Keyless Signature Infrastructure), que e uma forma de DLT otimizada para integridade de registros governamentais. Eles nao usam uma blockchain generica porque as necessidades especificas do caso exigiam uma solucao mais otimizada.

---

## 3. Quando a Blockchain e Opcional ou Desnecessaria

### Metodos DID que dispensam blockchain
Varios metodos DID funcionam perfeitamente sem nenhuma blockchain, provando que a descentralizacao da identidade nao depende obrigatoriamente de DLT:

**did:key**: o DID e derivado diretamente de uma chave publica. Nao ha registro externo; o DID Document e gerado algoritmicamente a partir do proprio DID. Ideal para interacoes efemeras e testes.

```
did:key:z6MkhaXgBZDvotDkL5257faiztiGiC2QtKLGpbnnEGta2doK
```

- **Exemplo**: dois dispositivos IoT que precisam se autenticar mutuamente em uma rede local podem usar did:key. Nao ha necessidade de blockchain porque a interacao e direta e temporaria.

**did:web**: utiliza a infraestrutura web existente (DNS + HTTPS). O DID Document e hospedado como um arquivo JSON no servidor web do controlador.

```
did:web:empresa.exemplo.com.br
```

O DID Document estaria disponivel em `https://empresa.exemplo.com.br/.well-known/did.json`.

- **Exemplo**: uma empresa que quer emitir credenciais verificaveis para seus funcionarios pode usar did:web sem nenhum custo de blockchain. O DID da empresa e resolvido via HTTPS, e a confianca e baseada na mesma infraestrutura de certificados SSL/TLS ja utilizada na web.

**did:peer**: DIDs criados e resolvidos apenas entre as partes envolvidas na comunicacao. Nao ha registro publico de nenhum tipo.

- **Exemplo**: quando Alice e Bob estabelecem um canal de comunicacao DIDComm, cada um cria um did:peer exclusivo para aquela relacao. Nao ha necessidade de registro publico porque apenas Alice e Bob precisam resolver esses DIDs.

### Quando alternativas sao preferíveis
Em varios cenarios praticos, nao usar blockchain e a decisao correta:

**Ecossistemas com autoridade central aceita**: quando todos os participantes ja confiam em uma entidade central, adicionar blockchain introduz complexidade sem beneficio claro.

- **Exemplo**: dentro de um unico sistema de saude nacional (como o SUS), o Ministerio da Saude pode operar um registro centralizado de DIDs de emissores. Todos os hospitais e postos de saude ja confiam no Ministerio, tornando a blockchain redundante.

**Prototipos e MVPs**: na fase inicial de desenvolvimento, usar did:web ou did:key permite validar conceitos rapidamente sem a complexidade de integrar com blockchain.

**Interacoes efemeras**: comunicacoes temporarias, sessoes de autenticacao e trocas pontuais de dados nao justificam registros permanentes em blockchain.

**Restricoes de latencia**: aplicacoes que exigem resolucao de DID em milissegundos podem sofrer com a latencia de consultas a blockchain. Um servidor web local responde muito mais rapido.

### Abordagens hibridas e progressivas
Uma estrategia inteligente e comecar sem blockchain e migrar quando necessario:

1. **Fase 1**: usar did:web para estabelecer o ecossistema e validar processos
2. **Fase 2**: adicionar ancoragem em blockchain para emissores criticos
3. **Fase 3**: migrar completamente para DLT quando o ecossistema atingir massa critica

- **Exemplo**: o ecossistema europeu EBSI (European Blockchain Services Infrastructure) comecou com pilotos usando infraestrutura web convencional e progressivamente migrou componentes criticos para sua blockchain permissionada, validando cada etapa antes de adicionar complexidade.

Essa abordagem reduz riscos, custos iniciais e permite aprendizado incremental.

---

## Conclusao
A blockchain e uma ferramenta poderosa no ecossistema de identidade descentralizada, mas nao e obrigatoria em todos os cenarios. Ela e genuinamente necessaria quando ha multiplos stakeholders sem confianca mutua, necessidade de persistencia de longo prazo, resistencia a censura real ou auditabilidade publica obrigatoria. Por outro lado, metodos como did:key, did:web e did:peer demonstram que a identidade descentralizada pode funcionar sem nenhuma blockchain. A decisao deve ser baseada em analise tecnica rigorosa dos requisitos, nao em entusiasmo tecnologico. A melhor arquitetura e aquela que usa a ferramenta certa para cada problema.

---

## Licao de Casa
1. Escolha um caso de uso de identidade digital (ex: diploma universitario, identidade de refugiado, login corporativo) e argumente se ele necessita ou nao de blockchain, justificando tecnicamente sua resposta.
2. Configure um did:web basico em um servidor de testes (pode ser localhost) e publique um DID Document seguindo a especificacao. Documente os passos realizados.
3. Compare a latencia de resolucao de um did:web (via HTTPS) com um did:ethr (via Ethereum) e reflita sobre como isso impacta a experiencia do usuario.

---

## Proxima Aula
Na proxima aula, vamos acompanhar o fluxo completo de criacao, resolucao e verificacao de um DID, desde o momento em que o sujeito gera suas chaves ate a validacao por um terceiro. Sera uma visao conceitual passo a passo de todo o ciclo de vida. Ate la!

---

## Questionario

**1. Qual propriedade da blockchain e mais relevante quando multiplas organizacoes independentes precisam compartilhar um registro de confianca?**
a) Velocidade de transacao
b) Consenso descentralizado sem necessidade de confianca mutua
c) Capacidade de armazenar grandes volumes de dados
d) Compatibilidade com sistemas legados
**Resposta: b**

**2. O metodo did:key funciona sem blockchain porque:**
a) Ele usa servidores centralizados da W3C para resolver DIDs
b) O DID Document e derivado algoritmicamente da propria chave publica contida no DID
c) Ele armazena o DID Document na memoria RAM do dispositivo
d) Ele depende de DNS para resolucao, substituindo a blockchain
**Resposta: b**

**3. Em qual cenario a blockchain seria MENOS necessaria para identidade descentralizada?**
a) Consorcio internacional de universidades para reconhecimento mutuo de diplomas
b) Sistema interno de autenticacao de funcionarios em uma unica empresa
c) Identidade digital para refugiados em zonas de conflito
d) Registro civil nacional que precisa sobreviver a mudancas de governo
**Resposta: b**

**4. Qual e a principal vantagem do metodo did:web em comparacao com metodos baseados em blockchain?**
a) Maior descentralizacao e resistencia a censura
b) Imutabilidade garantida dos registros
c) Simplicidade de implementacao e baixo custo, usando infraestrutura web existente
d) Melhor privacidade para o titular do DID
**Resposta: c**

**5. A abordagem progressiva (comecar sem blockchain e migrar depois) e recomendada porque:**
a) Blockchains sao sempre inferiores a solucoes centralizadas
b) Ela reduz riscos e custos iniciais, permitindo validar o ecossistema antes de adicionar complexidade
c) A regulamentacao proibe o uso de blockchain em fases iniciais de projetos
d) Os metodos DID baseados em blockchain ainda nao foram padronizados
**Resposta: b**
