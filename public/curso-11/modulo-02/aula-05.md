# Aula 2.5: Desafios de privacidade: correlacionabilidade e rastreamento

## Abertura
Bem-vindo a aula 2.5! Ao longo deste modulo, estudamos tecnicas criptograficas avancadas para proteger a privacidade em identidade descentralizada: ZKPs, divulgacao seletiva, BBS+, AnonCreds e criptografia pos-quantica. Porem, a criptografia sozinha nao resolve todos os problemas de privacidade. Nesta aula, examinamos os desafios que persistem — correlacionabilidade e rastreamento — e as estrategias arquiteturais para mitiga-los. Entender essas vulnerabilidades e essencial para projetar sistemas verdadeiramente privados.

### Programa da aula:
1. Vetores de correlacionabilidade em sistemas DID/VC (introducao)
2. Tecnicas de rastreamento e analise de metadados (base e aprofundamento)
3. Estrategias de mitigacao e design para privacidade (Conceito principal da aula)

---

## 1. Vetores de correlacionabilidade em sistemas DID/VC
### Correlacao por identificadores persistentes
O primeiro e mais obvio vetor de correlacao e o uso de **identificadores persistentes**. Se o holder usa o mesmo DID em multiplas interacoes, qualquer verifier pode correlacionar essas interacoes. Mesmo com divulgacao seletiva perfeita, o DID atua como um pseudonimo estavel que permite construir um perfil do holder.

Tipos de identificadores correlacionaveis:
- **DID do holder**: se o mesmo DID e apresentado a multiplos verifiers, eles podem cruzar dados.
- **DID do issuer**: revela quem emitiu a credencial, potencialmente revelando informacoes sobre o holder (ex.: credencial de hospital X implica que o holder e paciente).
- **Schema ID / Credential Definition ID**: revela o tipo de credencial, permitindo inferencias.
- **Revocation Registry ID**: se unico por credencial, identifica o holder; se compartilhado, revela grupo de pertencimento.

- **Exemplo**: Alice usa o DID `did:example:alice123` para acessar um servico de streaming e um site de noticias. Ambos os servicos compartilham dados com um data broker. Mesmo sem saber o nome de Alice, o broker correlaciona todas as atividades sob o mesmo DID, construindo um perfil detalhado de interesses e habitos.

### Correlacao por atributos revelados
Mesmo sem identificadores persistentes, a **combinacao de atributos revelados** pode identificar unicamente uma pessoa. Isso e conhecido como **quasi-identifiers**: atributos que individualmente nao identificam, mas combinados sim.

Pesquisas demonstram que:
- Data de nascimento + genero + CEP identificam 87% da populacao dos EUA (Sweeney, 2000).
- Combinacoes de 3-4 atributos demograficos frequentemente resultam em unicidade.

No contexto de VCs, mesmo com divulgacao seletiva, revelar `estado = "SP"`, `faixa_etaria = "25-30"`, `profissao = "engenheiro"` pode ser suficiente para identificacao em datasets pequenos.

- **Exemplo**: Um verifier pede nome e cidade para um servico. Outro verifier pede cidade e data de nascimento. Individualmente, nenhum identifica unicamente. Mas se compartilharem dados, a combinacao `cidade + nome + data_nascimento` identifica com alta probabilidade.

---

## 2. Tecnicas de rastreamento e analise de metadados
### Rastreamento por metadados de rede
Mesmo com criptografia perfeita no nivel do protocolo, **metadados de rede** podem revelar informacoes significativas:

- **Endereco IP**: identifica a localizacao e o provedor do holder. Sem protecao (Tor, VPN), cada interacao com um verifier expoe o IP.
- **Timestamps**: o momento exato de uma apresentacao pode ser correlacionado entre verifiers. Se Alice apresenta uma credencial no bar A as 22:03 e no bar B as 23:15, os timestamps reduzem o conjunto de candidatos.
- **User-Agent / Device fingerprint**: informacoes do dispositivo (modelo, sistema operacional, resolucao de tela, plugins do navegador) criam uma impressao digital unica.
- **Padroes de comunicacao**: a frequencia e o volume de interacoes com certos issuers/verifiers revelam padroes comportamentais.

- **Exemplo**: Um wallet de identidade faz uma requisicao HTTP ao resolver o DID do verifier. Mesmo que a credencial use BBS+ com unlinkability perfeita, o servidor DNS e o servidor web do verifier registram o IP do holder, potencialmente correlacionando multiplas visitas.

### Analise de grafos e correlacao temporal
Adversarios sofisticados podem usar **analise de grafos** para correlacionar interacoes aparentemente anonimas:

- **Grafo issuer-holder-verifier**: se o issuer e o verifier colaboram, podem correlacionar o momento da emissao com o momento da apresentacao. Se uma credencial e emitida as 14:00 e apresentada as 14:05, o conjunto de holders possiveis e muito pequeno.
- **Heuristica de co-ocorrencia**: se duas credenciais (de issuers diferentes) sao sempre apresentadas juntas em multiplos verifiers, provavelmente pertencem ao mesmo holder.
- **Analise de acumuladores de revogacao**: se o verifier pode observar atualizacoes no acumulador de revogacao e correlacionar com o momento da apresentacao, pode inferir informacoes sobre o status da credencial.

- **Exemplo**: Um verifier observa que toda segunda-feira as 9:00 recebe uma apresentacao anonima de uma credencial do tipo "funcionario da empresa X". Mesmo sem saber quem e, o padrao temporal pode ser cruzado com camaras de seguranca ou registros de acesso fisico.

### Ataques de linkagem por exclusao
O **ataque por exclusao** explora o fato de que, em grupos pequenos, eliminar candidatos pode identificar o holder:

1. O verifier sabe que o holder pertence a um grupo de N pessoas (ex.: todos os funcionarios de um departamento).
2. Ao longo do tempo, o verifier acumula apresentacoes e correlaciona com informacoes auxiliares.
3. Ao excluir candidatos que nao poderiam ter feito certas apresentacoes (por ausencia, por exemplo), o conjunto diminui ate a identificacao.

- **Exemplo**: Em uma empresa com 10 funcionarios, um sistema de feedback anonimo recebe avaliacoes. Se o gestor sabe que 3 funcionarios estavam de ferias quando uma avaliacao foi submetida, o anonimato efetivo e reduzido de 10 para 7. Com informacoes adicionais, pode cair para 1.

---

## 3. Estrategias de mitigacao e design para privacidade
### DIDs efemeros e pairwise
A principal defesa contra correlacao por identificadores e o uso de **DIDs pairwise (pareados)**:

- Para cada relacao holder-verifier, o holder gera um DID unico.
- Nenhum verifier ve o mesmo DID que outro verifier.
- DIDs efemeros podem ser descartados apos o uso, eliminando qualquer possibilidade de correlacao.

O **did:peer** e um metodo DID projetado para esse caso: DIDs criados localmente, sem registro em ledger, usados apenas entre duas partes. O custo e o gerenciamento de multiplos DIDs pelo wallet do holder.

Complementarmente, a especificacao **DID:key** permite criar DIDs descartaveis a partir de chaves efemeras, sem nenhum estado on-chain.

- **Exemplo**: Alice cria `did:peer:alice-bar-a` para o bar A e `did:peer:alice-bar-b` para o bar B. Mesmo que os bares compartilhem dados, nao conseguem correlacionar as identidades. Cada DID e criptograficamente independente.

### Mixnets e comunicacao anonima
Para proteger metadados de rede, sistemas de identidade descentralizada podem integrar **redes de anonimizacao**:

- **Tor**: roteia trafego por multiplos relays, ocultando o IP de origem. Adiciona latencia de ~1-3 segundos.
- **Mixnets** (ex.: Nym, Loopix): alem de rotear por multiplos nos, adicionam **mixing** — mensagens sao agrupadas, reordenadas e transmitidas em lotes, quebrando correlacao temporal.
- **Oblivious HTTP (OHTTP)**: protocolo que usa um relay intermediario para ocultar o IP do cliente do servidor, com menor overhead que Tor.

Para resolucao de DIDs, pode-se usar **resolvers anonimos**: proxies que resolvem DID Documents em nome do holder sem expor quais DIDs estao sendo resolvidos.

- **Exemplo**: O wallet de Alice usa OHTTP para apresentar credenciais a um verifier. O relay intermediario ve o IP de Alice mas nao o conteudo. O verifier ve o conteudo mas nao o IP. Nenhuma parte tem visao completa.

### Principios de Privacy by Design para DID/VC
Para construir sistemas verdadeiramente privados, engenheiros devem seguir principios arquiteturais:

**1. Minimizacao radical**: nunca solicitar mais atributos do que o estritamente necessario. Preferir predicados a valores. Preferir provas de pertencimento a grupo do que atributos individuais.

**2. Descorrelacao estrutural**: usar DIDs pairwise, credenciais com BBS+/AnonCreds, e comunicacao anonimizada. Cada camada do stack deve ser independentemente nao-correlacionavel.

**3. Efemericidade**: preferir credenciais de curta duracao e DIDs descartaveis. Reduzir o tempo de vida de qualquer identificador.

**4. Transparencia ao usuario**: o wallet deve informar claramente quais informacoes serao reveladas, incluindo metadados implicitos (IP, timestamps, tipo de credencial).

**5. Defesa em profundidade**: assumir que cada camada pode falhar. Combinar criptografia (BBS+), DIDs pairwise, comunicacao anonima e minimizacao de dados. A falha de uma camada nao deve comprometer totalmente a privacidade.

- **Exemplo**: Um sistema de votacao descentralizado combina: credencial de eleitor com BBS+ (unlinkability), DID efemero por sessao, apresentacao via mixnet (anonimato de rede), predicado "e eleitor registrado" sem revelar identidade, e timestamp com granularidade de 1 hora (reduz correlacao temporal).

---

## Conclusao
Nesta aula, vimos que a criptografia avancada e condicao necessaria mas nao suficiente para privacidade em identidade descentralizada. Correlacionabilidade por identificadores, atributos, metadados de rede e analise temporal sao ameacas reais que exigem mitigacoes em multiplas camadas. DIDs pairwise, comunicacao anonima, minimizacao de dados e principios de Privacy by Design devem ser integrados desde a concepcao do sistema. Com isso, concluimos o Modulo 2 sobre Criptografia Avancada e Privacidade.

---

## Licao de Casa
1. Projete uma arquitetura de apresentacao de credenciais que mitigue simultaneamente correlacao por identificadores, atributos e metadados de rede. Documente cada camada de protecao e suas limitacoes.
2. Usando k-anonymity como metrica, calcule o tamanho minimo do grupo de anonimato para uma credencial que revela: estado, faixa etaria (5 anos) e genero. Use dados demograficos do IBGE para estimar.
3. Implemente um prototipo de DID pairwise usando did:peer em Python ou JavaScript, gerando DIDs unicos para 5 verifiers diferentes e demonstrando que nao ha correlacao entre eles.

---

## Proxima Aula
Na proxima aula, iniciamos o Modulo 3 com modelos de ameaca para identidade descentralizada: DID hijacking, ataques a chaves, Sybil e grinding attacks. Vamos entender como adversarios exploram vulnerabilidades especificas de sistemas DID/VC e como construir defesas robustas. Ate la!

---

## Questionario

**1. O que sao quasi-identifiers no contexto de privacidade?**
a) Identificadores criptograficos usados em ZKPs
b) Atributos que individualmente nao identificam, mas combinados podem identificar unicamente uma pessoa
c) DIDs temporarios usados em sessoes efemeras
d) Chaves publicas derivadas de link secrets
**Resposta: b**

**2. Por que DIDs pairwise sao importantes para privacidade?**
a) Porque sao mais rapidos de resolver
b) Porque cada relacao holder-verifier usa um DID unico, impedindo correlacao entre verifiers
c) Porque eliminam a necessidade de Verifiable Credentials
d) Porque sao registrados em blockchain publica
**Resposta: b**

**3. Qual metadado de rede pode comprometer a privacidade mesmo com criptografia perfeita no protocolo?**
a) O tamanho da chave publica do issuer
b) Endereco IP, timestamps e device fingerprints do holder
c) O algoritmo de assinatura usado na credencial
d) O numero de atributos no schema
**Resposta: b**

**4. O que e o ataque "por exclusao" contra anonimato?**
a) Revogar credenciais de todos os membros de um grupo
b) Eliminar candidatos usando informacoes auxiliares ate identificar o holder em um grupo pequeno
c) Excluir DIDs de um registro publico
d) Remover atributos de uma credencial durante a apresentacao
**Resposta: b**

**5. Qual principio de Privacy by Design recomenda preferir predicados a valores reais em apresentacoes?**
a) Transparencia ao usuario
b) Minimizacao radical de dados
c) Defesa em profundidade
d) Efemericidade de credenciais
**Resposta: b**
