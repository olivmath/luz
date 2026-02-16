# Aula 3.4: Armazenamento seguro: Encrypted Data Vaults (EDV) e Identity Hubs

## Abertura
Bem-vindo a aula 3.4! Nesta aula, vamos estudar as arquiteturas de armazenamento seguro para dados de identidade descentralizada. Veremos como Encrypted Data Vaults (EDV) e Identity Hubs resolvem o problema de armazenar credenciais, documentos pessoais e dados sensiiveis de forma criptografada, replicavel e sob controle total do usuario, eliminando a dependencia de provedores centralizados.

### Programa da aula:
1. O problema do armazenamento em identidade descentralizada (introducao)
2. Encrypted Data Vaults (EDV): arquitetura e criptografia (base e aprofundamento)
3. Identity Hubs: armazenamento pessoal descentralizado e controle de acesso (Conceito principal da aula)

---

## 1. O problema do armazenamento em identidade descentralizada
### 1.1 Requisitos de armazenamento para credenciais verificaveis
Credenciais verificaveis, chaves criptograficas e dados pessoais precisam ser armazenados de forma segura, disponivel e portavel. Diferente de sistemas centralizados onde o provedor de identidade armazena todos os dados em seus servidores, em sistemas descentralizados o titular e responsavel por seu proprio armazenamento.

Os requisitos fundamentais sao: confidencialidade (dados criptografados em repouso e em transito), integridade (deteccao de modificacoes nao autorizadas), disponibilidade (acesso aos dados mesmo quando dispositivos individuais estao offline), portabilidade (capacidade de migrar dados entre provedores de armazenamento) e controle de acesso granular (o titular decide quem pode ler ou escrever cada item).

Armazenar credenciais apenas no dispositivo local (smartphone ou laptop) cria um ponto unico de falha. Se o dispositivo for perdido, roubado ou danificado, todas as credenciais sao perdidas. Armazenar em nuvem convencional (Google Drive, iCloud) resolve disponibilidade mas introduz dependencia de provedores centralizados que podem acessar, censurar ou perder os dados.

- **Exemplo**: Um profissional armazena suas credenciais de certificacao, diploma e historico medico em seu smartphone. Ao perder o dispositivo em uma viagem, ele perde acesso a todas as suas credenciais. Sem backup criptografado em um vault descentralizado, a recuperacao requer reemissao individual de cada credencial pelos respectivos emissores, um processo que pode levar semanas.

### 1.2 Modelos de armazenamento descentralizado
Existem tres modelos principais de armazenamento para identidade descentralizada. O modelo edge storage armazena dados exclusivamente no dispositivo do usuario, oferecendo maximo controle mas sem redundancia. O modelo cloud-encrypted utiliza servidores de terceiros para armazenamento, mas todos os dados sao criptografados client-side com chaves que o servidor nunca possui. O modelo peer-to-peer replica dados entre multiplos nos sem servidor central.

O modelo cloud-encrypted e o mais adotado na pratica, implementado por especificacoes como Encrypted Data Vaults e Identity Hubs. O servidor atua como storage burro (dumb storage), armazenando blobs criptografados sem capacidade de ler o conteudo. O titular pode migrar para outro servidor a qualquer momento, pois a criptografia e independente do provedor.

A replicacao entre multiplos provedores de armazenamento aumenta a disponibilidade e reduz o risco de lock-in. O titular pode manter copias de seu vault em dois ou tres provedores simultaneamente, com sincronizacao automatica de alteracoes. Se um provedor ficar indisponivel ou cessar operacoes, os dados permanecem acessiveis nos demais.

- **Exemplo**: Um usuario configura seu Identity Hub com replicacao em tres provedores: um servidor self-hosted em casa, uma instancia na AWS e uma na Hetzner. Todos os dados sao criptografados antes de sair do dispositivo. Se a AWS encerrar o servico, os dados continuam disponiveis nos outros dois nos. O usuario pode adicionar um novo provedor e sincronizar automaticamente.

---

## 2. Encrypted Data Vaults (EDV): arquitetura e criptografia
### 2.1 Especificacao EDV e modelo de dados
A especificacao Encrypted Data Vault, desenvolvida pelo W3C Credentials Community Group, define uma API padronizada para armazenamento criptografado de dados estruturados. O modelo de dados e baseado em documentos criptografados (Encrypted Documents) organizados em vaults, cada um associado a um controlador identificado por DID.

Cada Encrypted Document contem: um id unico, uma sequence number para controle de versao, metadados indexados criptografados (indexed attributes), o JWE (JSON Web Encryption) com o payload criptografado, e uma lista de recipients autorizados. Os metadados indexados sao criptografados com tecnicas de busca sobre dados cifrados, permitindo consultas sem expor o conteudo ao servidor.

A estrutura de um vault inclui configuracao (algoritmos de criptografia, politicas de acesso), documentos criptografados e indices. A API RESTful do EDV define operacoes CRUD: POST para criar documentos, GET para recuperar, PUT para atualizar e DELETE para remover. Todas as operacoes requerem autenticacao via HTTP Signatures ou tokens de capacidade (zcap-ld).

- **Exemplo**: Um vault EDV para credenciais profissionais contem tres documentos: diploma universitario, certificacao AWS e carteira profissional. Cada documento e criptografado com ECDH-ES+A256KW para a chave do titular. Os metadados indexados permitem buscar por tipo de credencial (type: "UniversityDegree") sem que o servidor saiba o conteudo dos documentos.

### 2.2 Criptografia e busca sobre dados cifrados
O desafio tecnico central dos EDVs e permitir busca e indexacao sobre dados criptografados. Se o servidor armazena apenas blobs opacos, o titular precisaria baixar todos os documentos para buscar localmente, o que e inviavel com vaults grandes. A solucao utiliza tecnicas de busca sobre dados cifrados.

A abordagem principal nos EDVs utiliza HMAC-based indexing. O titular computa um HMAC (Hash-based Message Authentication Code) de cada atributo indexavel usando uma chave simetrica que so ele possui. O servidor armazena esses HMACs como indices. Para buscar, o titular computa o HMAC do valor buscado e envia ao servidor, que compara com os indices armazenados. O servidor aprende quais documentos correspondem a busca, mas nao aprende o valor buscado nem os valores dos indices.

Tecnicas mais avancadas incluem Searchable Symmetric Encryption (SSE) e Structured Encryption que permitem consultas de intervalo e consultas por prefixo sobre dados cifrados. Porem, essas tecnicas apresentam trade-offs com leakage: o servidor pode inferir informacoes sobre padroes de acesso e distribuicao de valores ao longo do tempo.

- **Exemplo**: O titular busca credenciais do tipo "ProfessionalCertification" em seu vault. Ele computa HMAC(chave_indice, "ProfessionalCertification") e envia o resultado (um hash de 256 bits) ao servidor. O servidor compara com os HMACs armazenados e retorna os documentos criptografados correspondentes. O servidor sabe que dois documentos corresponderam, mas nao sabe que o criterio era "ProfessionalCertification".

### 2.3 Autorizacao baseada em capacidades (zcap-ld)
O controle de acesso em EDVs utiliza o modelo de capacidades (capabilities) implementado pela especificacao zcap-ld (Authorization Capabilities for Linked Data). Diferente do modelo tradicional de ACLs (Access Control Lists) onde permissoes sao associadas a identidades, capacidades sao tokens transferiveis que conferem permissoes especificas a seu portador.

Uma zcap (capability) e um documento JSON-LD assinado que especifica: o recurso alvo (invocationTarget, por exemplo a URL de um documento no vault), a acao permitida (allowedAction, por exemplo "read" ou "write"), o delegador (controller) e o delegatario (invoker). Capacidades podem ser atenuadas (restringidas) e delegadas: o titular pode emitir uma zcap de leitura para um verificador, e esse verificador pode sub-delegar uma zcap mais restrita para um auditor.

O modelo de capacidades resolve o problema do confused deputy: um servico intermediario que recebe uma capacidade pode executa-la em nome do titular sem ter acesso irrestrito. Cada capacidade e limitada em escopo, acao e duracao, implementando o principio de menor privilegio por design.

- **Exemplo**: Um titular emite uma zcap que permite ao DID de seu medico ler documentos do tipo "MedicalRecord" em seu vault, valida por 30 dias. O medico apresenta essa zcap ao servidor EDV, que verifica a cadeia de delegacao ate o controlador do vault, confirma que a acao (read) e o tipo de documento estao autorizados, e retorna os registros medicos criptografados. O medico descriptografa com sua chave privada (pois o titular criptografou para a chave do medico ao conceder acesso).

---

## 3. Identity Hubs: armazenamento pessoal descentralizado e controle de acesso
### 3.1 Arquitetura do Identity Hub (DWN)
Identity Hubs, formalmente conhecidos como Decentralized Web Nodes (DWN), sao uma especificacao da DIF que define nos de armazenamento pessoal descentralizado. Diferente dos EDVs que focam em armazenamento criptografado generico, DWNs implementam um modelo completo de armazenamento, sincronizacao, protocolos de interacao e controle de acesso para dados de identidade.

A arquitetura de um DWN e baseada em tres interfaces: Records (armazenamento de dados), Protocols (definicao de regras de interacao) e Permissions (controle de acesso). Cada DWN e associado a um DID e opera como um servidor pessoal que o titular controla completamente. Multiplos DWNs podem ser vinculados ao mesmo DID, com sincronizacao automatica entre eles.

O modelo de dados do DWN utiliza Records como unidade fundamental. Cada Record possui um schema (tipo de dado), dataFormat (mime type), data (payload), e metadados como dateCreated e dateModified. Records sao organizados hierarquicamente e podem referenciar outros Records, formando grafos de dados interconectados.

- **Exemplo**: O DWN de um profissional contem Records organizados por schema: credenciais verificaveis (application/vc+jwt), documentos pessoais (application/pdf criptografado), configuracoes de aplicativos (application/json) e mensagens DIDComm (application/didcomm-encrypted+json). Cada categoria e governada por regras de acesso distintas definidas via Protocols.

### 3.2 Protocolos de interacao e sincronizacao
A interface Protocols do DWN define regras declarativas para interacao entre agentes. Um Protocol especifica quais tipos de Records podem ser criados, por quem, em que sequencia e com quais permissoes. Isso permite que aplicacoes descentralizadas definam fluxos de interacao complexos sem logica centralizada.

A definicao de Protocol inclui: protocol URI (identificador unico), types (tipos de Records no protocolo), structure (hierarquia e relacionamentos entre tipos) e rules (regras de acesso por tipo e papel). Quando um agente externo envia um Record para o DWN, o no valida se o Record esta em conformidade com o Protocol referenciado antes de aceita-lo.

A sincronizacao entre multiplos DWNs de um mesmo titular utiliza um protocolo de replicacao baseado em CRDTs (Conflict-free Replicated Data Types) ou resolucao de conflitos por timestamp. Cada operacao (criar, atualizar, deletar) gera um evento que e propagado para todas as replicas. Os DWNs convergem para o mesmo estado independentemente da ordem em que recebem os eventos.

- **Exemplo**: Um Protocol de "job-application" define que: (1) o candidato (role: applicant) pode criar Records do tipo "application" no DWN do empregador, (2) o empregador (role: employer) pode criar Records do tipo "response" vinculados a uma "application", (3) o candidato pode criar Records do tipo "document" dentro de sua "application". O DWN do empregador valida automaticamente que apenas candidatos criam applications e apenas o empregador cria responses.

### 3.3 Controle de acesso e permissoes no DWN
O sistema de permissoes do DWN utiliza um modelo baseado em grants (concessoes). O titular do DWN emite Permission Grants que autorizam agentes externos a realizar operacoes especificas. Cada grant especifica: o grantee (DID autorizado), o scope (tipo de Record, protocolo, ou Record especifico), as actions permitidas (read, write, delete, query) e condicoes (expiracao, limites de uso).

Grants podem ser publicos ou privados. Um grant publico permite que qualquer agente realize a acao especificada, util para cenarios como perfis publicos ou portfolios abertos. Grants privados sao restritos ao grantee especificado e requerem autenticacao via DID para exercicio.

A hierarquia de permissoes segue o modelo: owner (controle total) > grants explicitos > protocol rules > deny by default. Isso significa que, na ausencia de uma concessao explicita ou regra de protocolo, qualquer acesso e negado. O titular pode revogar grants a qualquer momento, e a revogacao e propagada para todas as replicas do DWN.

- **Exemplo**: Um musico configura permissoes em seu DWN: grant publico de leitura para Records do tipo "portfolio" (qualquer pessoa pode ver seus trabalhos), grant privado de leitura para Records do tipo "contract" restrito ao DID de seu advogado (apenas o advogado pode acessar contratos), e regras de Protocol que permitem fas enviar Records do tipo "message" (qualquer fan pode enviar mensagem, mas apenas o musico pode ler e responder).

---

## Conclusao
Nesta aula, exploramos as duas principais especificacoes de armazenamento seguro para identidade descentralizada. Os Encrypted Data Vaults oferecem armazenamento criptografado com busca sobre dados cifrados via HMAC indexing e controle de acesso baseado em capacidades zcap-ld. Os Identity Hubs (DWN) expandem o conceito com interfaces de protocolos declarativos, sincronizacao multi-no e sistema de permissoes granular. Ambas as abordagens compartilham o principio fundamental de que dados pessoais devem ser criptografados client-side, com o servidor atuando como armazenamento opaco sem acesso ao conteudo. Essas tecnologias completam a pilha de seguranca necessaria para sistemas de identidade descentralizada robustos.

---

## Licao de Casa
1. Implemente um prototipo de Encrypted Data Vault local utilizando JWE (jose library) para criptografia de documentos e HMAC-SHA256 para indexacao, demonstrando operacoes de criacao, busca por indice e recuperacao de documentos.
2. Configure uma instancia de DWN utilizando o SDK @web5/api, crie um Protocol personalizado para um caso de uso de sua escolha (saude, educacao ou financas) e teste a interacao entre dois agentes seguindo as regras do protocolo.
3. Compare os modelos de controle de acesso de EDV (zcap-ld) e DWN (permission grants), documentando vantagens e desvantagens de cada abordagem para um cenario de compartilhamento de registros medicos entre paciente, medico e plano de saude.

---

## Proxima Aula
Na proxima aula, vamos iniciar o Modulo 4 com o tema Ponte Web2-Web3: OIDC4VC (OpenID Connect para credenciais verificaveis). Veremos como os protocolos OpenID Connect estao sendo estendidos para suportar emissao e apresentacao de credenciais verificaveis, criando uma ponte entre sistemas de identidade tradicionais e descentralizados. Ate la!

---

## Questionario

**1. Por que o servidor EDV e considerado "armazenamento burro" (dumb storage)?**
a) Porque nao possui capacidade de processamento
b) Porque armazena apenas blobs criptografados client-side, sem possuir as chaves para ler o conteudo dos documentos
c) Porque nao implementa autenticacao de usuarios
d) Porque utiliza protocolos de armazenamento obsoletos
**Resposta: b**

**2. Como a busca por atributos funciona em um EDV sem expor o conteudo ao servidor?**
a) O servidor descriptografa temporariamente os documentos, busca e recriptografa
b) O titular baixa todos os documentos e busca localmente
c) O titular computa o HMAC do valor buscado e envia ao servidor, que compara com indices HMAC armazenados sem conhecer os valores originais
d) O servidor utiliza criptografia homomorca para buscar diretamente nos dados cifrados
**Resposta: c**

**3. Qual e a vantagem do modelo de capacidades (zcap-ld) sobre ACLs tradicionais?**
a) Capacidades sao mais rapidas de verificar que ACLs
b) Capacidades sao tokens transferiveis, atenuaveis e delegaveis que implementam menor privilegio por design, resolvendo o problema do confused deputy
c) Capacidades nao requerem criptografia
d) ACLs nao suportam multiplos usuarios
**Resposta: b**

**4. Como o DWN garante sincronizacao consistente entre multiplas replicas?**
a) Utilizando um servidor central de coordenacao que ordena todas as operacoes
b) Bloqueando escritas concorrentes atraves de locks distribuidos
c) Propagando eventos de operacao entre replicas e utilizando resolucao de conflitos baseada em CRDTs ou timestamps para convergencia
d) Exigindo que o titular confirme manualmente cada sincronizacao
**Resposta: c**

**5. Qual e o comportamento padrao de permissoes em um DWN quando nao existe grant explicito ou regra de protocolo?**
a) Acesso de leitura e permitido, escrita e negada
b) Acesso total e concedido ao primeiro agente que solicitar
c) Todo acesso e negado por padrao (deny by default)
d) O DWN solicita aprovacao em tempo real ao titular
**Resposta: c**
