# Aula 7.2: Boas praticas de seguranca: rotacao de chaves, multisig, assinaturas limiares

## Abertura
Bem-vindo a aula 7.2! Nesta aula, vamos estudar as praticas de seguranca fundamentais para proteger identidades descentralizadas contra os vetores de ataque que analisamos na aula anterior. Abordaremos mecanismos de rotacao de chaves, esquemas de assinatura multisig e assinaturas limiares (threshold signatures), tecnicas que formam a base da resiliencia criptografica em sistemas de identidade descentralizada de producao.

### Programa da aula:
1. Rotacao de chaves e gestao de ciclo de vida criptografico (introducao)
2. Esquemas multisig para governanca de identidade (base e aprofundamento)
3. Assinaturas limiares e compartilhamento de segredos (Conceito principal da aula)

---

## 1. Rotacao de chaves e gestao de ciclo de vida criptografico
### 1.1 Fundamentos da rotacao de chaves em DID Documents
A rotacao de chaves e o processo de substituir chaves criptograficas associadas a um DID por novas chaves, invalidando as anteriores. Em sistemas de identidade descentralizada, essa operacao e critica porque limita a janela de exposicao em caso de comprometimento: mesmo que um atacante obtenha uma chave privada, ela so sera util ate a proxima rotacao.

O mecanismo de rotacao depende do metodo DID utilizado. Em did:ethr, a rotacao envolve uma transacao on-chain que atualiza o atributo de chave publica no registro Ethereum. Em did:ion, uma operacao de update assinada pela update key atual substitui as chaves no DID Document e simultaneamente rotaciona a propria update key. Em did:key, a rotacao nao e possivel pois o DID e deterministica e permanentemente vinculado a chave original.

Um principio fundamental e a pre-rotacao (pre-rotation), introduzida pelo protocolo KERI (Key Event Receipt Infrastructure). Nesse modelo, o hash da proxima chave publica e publicado antes da rotacao ocorrer. Isso garante que mesmo um atacante que comprometa a chave atual nao consiga rotacionar para uma chave sob seu controle, pois a proxima chave valida ja foi comprometida criptograficamente via hash.

- **Exemplo**: No KERI, ao criar um identificador, o titular gera dois pares de chaves: o par ativo (K1) e o proximo par (K2). O hash de K2_pub e incluido no evento de incepcao. Quando a rotacao ocorre, K2 se torna ativa e o hash de K3_pub e publicado. Um atacante que compromete K1 nao pode rotacionar porque nao possui K2, cujo compromisso hash ja foi registrado.

### 1.2 Politicas de rotacao e automacao
Uma politica de rotacao eficaz define frequencia, gatilhos e procedimentos para substituicao de chaves. Politicas baseadas em tempo rotacionam chaves em intervalos fixos (por exemplo, a cada 90 dias). Politicas baseadas em eventos disparam rotacao apos deteccao de anomalias, mudancas de dispositivo ou revogacao de credenciais.

A automacao da rotacao e essencial em ambientes de producao. Agentes de identidade descentralizada devem implementar rotacao automatica com notificacao a pares conectados via DIDComm. O protocolo deve garantir que conexoes existentes sejam atualizadas atomicamente, evitando janelas onde mensagens podem ser perdidas ou rejeitadas.

O desafio principal da rotacao automatica e a coordenacao com credenciais emitidas. Credenciais verificaveis assinadas com a chave antiga devem permanecer verificaveis apos a rotacao. Isso requer que verificadores consultem versoes historicas do DID Document ou que o registro mantenha um log auditavel de chaves anteriores com seus periodos de validade.

- **Exemplo**: Um agente corporativo de identidade implementa rotacao automatica a cada 30 dias. Ao rotacionar, ele publica o novo DID Document, envia uma mensagem DIDComm de notificacao de rotacao a todos os pares conectados e registra a chave antiga com timestamp de desativacao. Credenciais emitidas antes da rotacao continuam verificaveis porque o registro mantem o historico de chaves com periodos de validade.

---

## 2. Esquemas multisig para governanca de identidade
### 2.1 Arquitetura multisig em DID Documents
Esquemas de multiplas assinaturas (multisig) exigem que mais de uma chave privada autorize uma operacao. No contexto de identidade descentralizada, multisig e aplicado para proteger operacoes criticas como atualizacao de DID Documents, emissao de credenciais de alto valor e revogacao de identidades.

A implementacao de multisig em DID Documents utiliza a propriedade verificationMethod para listar multiplas chaves e a propriedade controller para definir quais DIDs tem autoridade sobre o documento. Um esquema m-de-n (m-of-n) requer que pelo menos m de n chaves autorizem a operacao. Por exemplo, um esquema 2-de-3 exige duas assinaturas de tres chaves possiveis.

A especificacao W3C DID Core suporta multiplos controladores atraves do campo controller como array. Cada controlador e um DID que pode autorizar modificacoes. A logica de verificacao multisig pode ser implementada on-chain (em metodos baseados em blockchain) ou no nivel do agente (em metodos off-chain).

- **Exemplo**: Uma organizacao define seu DID Document com controller: ["did:ethr:0xA1...", "did:ethr:0xB2...", "did:ethr:0xC3..."] e uma politica 2-de-3. Para atualizar o DID Document ou emitir uma credencial organizacional, pelo menos dois dos tres controladores devem assinar a operacao. Isso previne que um unico funcionario comprometido altere a identidade corporativa.

### 2.2 Multisig on-chain vs off-chain
A implementacao on-chain de multisig utiliza smart contracts que verificam as assinaturas antes de executar a operacao. No Ethereum, contratos como Gnosis Safe implementam logica multisig robusta com suporte a adicao e remocao de signatarios, alteracao de threshold e execucao de transacoes arbitrarias.

A implementacao off-chain utiliza assinaturas agregadas no nivel do protocolo. Cada signatario produz sua assinatura independentemente, e um coordenador coleta e concatena as assinaturas antes de submeter a operacao. Essa abordagem e mais flexivel e nao depende de uma blockchain especifica, mas requer um protocolo de coordenacao confiavel.

O trade-off principal e entre verificabilidade publica e flexibilidade. Multisig on-chain oferece garantias mais fortes de que a politica foi respeitada, pois a logica e executada de forma deterministica pelo consenso da rede. Multisig off-chain e mais eficiente e interoperavel, mas depende da confianca no coordenador e nos verificadores para validar que o threshold foi atingido.

- **Exemplo**: Uma autoridade certificadora descentralizada utiliza um smart contract Gnosis Safe como controlador de seu did:ethr. Para emitir uma credencial de acreditacao, tres de cinco membros do conselho assinam a transacao no Safe. O contrato verifica as assinaturas, executa a emissao e registra o evento on-chain, criando um log auditavel e imutavel de todas as emissoes.

### 2.3 Recuperacao social com multisig
Multisig habilita mecanismos de recuperacao social, onde um grupo de contatos confiados pode restaurar o acesso a uma identidade caso o titular perca suas chaves. O titular designa n guardioes e define um threshold m para recuperacao. Cada guardiao recebe autoridade parcial sobre a operacao de recovery.

O protocolo de recuperacao social funciona em etapas: o titular solicita recuperacao, cada guardiao verifica a identidade do solicitante por meios fora de banda (telefone, video, encontro presencial), e os guardioes que concordam assinam a operacao de rotacao de chaves. Quando o threshold e atingido, a identidade e restaurada com novas chaves sob controle do titular.

A seguranca da recuperacao social depende da selecao cuidadosa de guardioes. Eles devem ser independentes entre si (para evitar conluio), acessiveis em emergencias e capazes de verificar a identidade do titular. A combinacao de guardioes de diferentes contextos sociais (familia, trabalho, amigos) aumenta a resistencia a ataques coordenados.

- **Exemplo**: Um usuario configura recuperacao social com 5 guardioes e threshold de 3: sua mae, seu melhor amigo, um colega de trabalho, seu advogado e um servico institucional de custodia. Ao perder seu dispositivo, ele contacta seus guardioes, que verificam sua identidade por videochamada. Tres deles assinam a operacao de recuperacao, restaurando a identidade com novas chaves.

---

## 3. Assinaturas limiares e compartilhamento de segredos
### 3.1 Threshold Signatures vs Multisig tradicional
Assinaturas limiares (threshold signatures) representam uma evolucao significativa em relacao ao multisig tradicional. Enquanto multisig requer que cada participante produza uma assinatura completa e independente (resultando em n assinaturas que sao verificadas individualmente), assinaturas limiares produzem uma unica assinatura que e indistinguivel de uma assinatura convencional.

Em um esquema de assinatura limiar t-de-n, n participantes possuem shares (fragmentos) da chave privada. Qualquer subconjunto de t participantes pode colaborar para produzir uma assinatura valida, mas nenhum subconjunto menor que t pode assinar ou reconstruir a chave privada. A chave privada completa nunca existe em um unico ponto, nem mesmo durante a geracao.

A vantagem principal para identidade descentralizada e a compatibilidade: verificadores nao precisam saber que uma assinatura limiar foi utilizada. O DID Document lista uma unica chave publica, e a assinatura produzida e verificavel com algoritmos padrao. Isso simplifica a interoperabilidade e preserva a privacidade do esquema de governanca.

- **Exemplo**: Uma organizacao utiliza um esquema de assinatura limiar 3-de-5 com FROST (Flexible Round-Optimized Schnorr Threshold). O DID Document lista uma unica chave publica agregada. Quando tres membros colaboram para assinar uma credencial, o resultado e uma unica assinatura Schnorr. O verificador valida a assinatura com a chave publica do DID Document sem saber que multiplas partes participaram.

### 3.2 Protocolos de geracao distribuida de chaves (DKG)
A geracao distribuida de chaves (Distributed Key Generation) e o processo pelo qual os participantes de um esquema limiar geram seus shares de forma colaborativa, sem que a chave privada completa jamais exista em um unico local. Protocolos DKG como Pedersen DKG, Gennaro DKG e o protocolo do FROST garantem essa propriedade.

O protocolo Pedersen DKG funciona em tres fases: cada participante gera um polinomio aleatorio de grau t-1, distribui avaliacoes desse polinomio para os outros participantes via canais seguros, e verifica a consistencia dos shares recebidos usando compromissos de Feldman. Ao final, cada participante possui um share consistente, e a chave publica agregada e computavel publicamente.

A seguranca do DKG depende criticamente da comunicacao segura entre participantes e da verificacao de consistencia. Um participante malicioso pode tentar distribuir shares inconsistentes para particionar o grupo ou enviesar a chave resultante. Compromissos verificaveis (Verifiable Secret Sharing) mitigam esse risco ao permitir que cada participante verifique a validade de seus shares sem revelar informacoes sobre os shares de outros.

- **Exemplo**: Cinco departamentos de uma empresa executam um protocolo DKG para gerar o par de chaves do DID corporativo. Cada departamento gera um polinomio aleatorio de grau 2 (para threshold 3), distribui avaliacoes criptografadas para os outros quatro departamentos e publica compromissos de Feldman para verificacao. Ao final, cada departamento possui seu share, a chave publica e computada, e a chave privada nunca existiu em forma completa.

### 3.3 Shamir Secret Sharing e suas limitacoes
O Shamir Secret Sharing (SSS) e um esquema classico de compartilhamento de segredos onde um segredo e dividido em n shares tal que qualquer t shares podem reconstruir o segredo, mas t-1 shares nao revelam nenhuma informacao. Embora amplamente utilizado para backup de seed phrases, SSS apresenta limitacoes importantes para assinatura.

A limitacao principal do SSS para identidade descentralizada e que ele requer reconstrucao da chave privada para assinar. Isso cria um ponto unico de falha momentaneo: durante a assinatura, a chave completa existe na memoria de um dispositivo. Assinaturas limiares verdadeiras (como FROST ou GG20) evitam essa reconstrucao, computando a assinatura de forma distribuida sem jamais materializar a chave.

Outra limitacao e a ausencia de verificabilidade durante a distribuicao. No SSS basico, o distribuidor pode criar shares invalidos ou inconsistentes sem que os receptores detectem. Esquemas de Verifiable Secret Sharing (VSS) adicionam compromissos que permitem verificacao, mas aumentam a complexidade e a comunicacao necessaria.

- **Exemplo**: Um titular utiliza SSS para dividir sua seed phrase de 24 palavras em 5 shares com threshold 3, distribuindo-os para guardioes. Para recuperar a identidade, 3 guardioes enviam seus shares, e a seed e reconstruida em um dispositivo seguro. O risco e que durante a reconstrucao, a seed completa existe na memoria do dispositivo e pode ser capturada por malware residente.

---

## Conclusao
Nesta aula, exploramos as tres pilastras de seguranca para identidades descentralizadas. A rotacao de chaves limita a janela de exposicao e o protocolo KERI introduz pre-rotacao como mecanismo de protecao proativa. Esquemas multisig distribuem a autoridade e habilitam governanca corporativa e recuperacao social. Assinaturas limiares elevam a seguranca ao eliminar pontos unicos de falha, produzindo assinaturas indistinguiveis de assinaturas convencionais. A combinacao dessas tecnicas forma a base de arquiteturas de identidade descentralizada resilientes para ambientes de producao.

---

## Licao de Casa
1. Implemente um prototipo de rotacao de chaves para um DID Document did:key, gerando um novo par de chaves Ed25519 e documentando o processo de migracao de credenciais emitidas com a chave anterior.
2. Configure um esquema multisig 2-de-3 utilizando Gnosis Safe no testnet Sepolia e registre um DID controlado pelo contrato Safe, realizando pelo menos uma operacao de atualizacao de DID Document.
3. Pesquise o protocolo FROST e descreva como um esquema de assinatura limiar 3-de-5 seria aplicado para proteger o DID de uma organizacao autonoma descentralizada (DAO), detalhando o fluxo de DKG e assinatura.

---

## Proxima Aula
Na proxima aula, vamos estudar protocolos de comunicacao segura para identidade descentralizada, incluindo DIDComm v2, CHAPI e DIF Presentation Exchange. Veremos como estabelecer canais autenticados e criptografados entre agentes de identidade. Ate la!

---

## Questionario

**1. Qual e a principal vantagem do mecanismo de pre-rotacao do KERI?**
a) Permite rotacionar chaves sem transacoes on-chain
b) Garante que a proxima chave valida ja esta comprometida via hash antes da rotacao, impedindo que um atacante com a chave atual rotacione para uma chave propria
c) Elimina a necessidade de chaves criptograficas no DID Document
d) Permite que qualquer pessoa rotacione as chaves de um DID
**Resposta: b**

**2. Em um esquema multisig 2-de-3 para controle de DID, qual cenario resulta em incapacidade de operar?**
a) Um dos tres signatarios perde sua chave privada
b) Dois dos tres signatarios estao indisponiveis simultaneamente
c) O DID Document e atualizado com uma nova chave publica
d) Uma credencial emitida pelo DID e revogada
**Resposta: b**

**3. Qual e a diferenca fundamental entre assinaturas limiares e multisig tradicional?**
a) Assinaturas limiares suportam mais signatarios que multisig
b) Multisig produz n assinaturas independentes, enquanto assinaturas limiares produzem uma unica assinatura indistinguivel de uma assinatura convencional
c) Assinaturas limiares so funcionam com curvas secp256k1
d) Multisig e mais seguro porque cada assinatura e verificavel independentemente
**Resposta: b**

**4. Qual e a principal limitacao do Shamir Secret Sharing para assinatura de credenciais?**
a) Nao suporta mais de 5 shares
b) Requer reconstrucao da chave privada completa para assinar, criando um ponto unico de falha momentaneo
c) So funciona com chaves RSA
d) Nao permite definir um threshold minimo
**Resposta: b**

**5. Como a recuperacao social com multisig protege contra perda total de acesso a identidade?**
a) Armazenando copias da chave privada em servidores redundantes
b) Permitindo que um grupo de guardioes pre-designados, atingindo um threshold minimo, autorize a rotacao de chaves para restaurar o controle ao titular
c) Utilizando biometria para gerar novas chaves automaticamente
d) Revertendo transacoes blockchain para o estado anterior a perda
**Resposta: b**
