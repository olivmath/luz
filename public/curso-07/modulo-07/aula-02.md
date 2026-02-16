# Aula 7.2: Internet das Coisas (IoT): identificacao de dispositivos e comunicacoes seguras

## Abertura
Bem-vindo a aula 7.2! Nesta aula, vamos mergulhar no universo da Internet das Coisas (IoT) e entender como a identidade descentralizada pode resolver um dos maiores desafios desse ecossistema: a identificacao confiavel de bilhoes de dispositivos conectados e a seguranca das comunicacoes entre eles. Veremos como DIDs e credenciais verificaveis se aplicam a maquinas, sensores e equipamentos inteligentes.

### Programa da aula:
1. O desafio da identidade em ecossistemas IoT (introducao)
2. DIDs para dispositivos: identidade autonoma de maquinas (base e aprofundamento)
3. Comunicacoes seguras e cadeia de confianca em IoT (Conceito principal da aula)

---

## 1. O desafio da identidade em ecossistemas IoT
### 1.1 A escala do problema
A Internet das Coisas conecta bilhoes de dispositivos ao redor do mundo — sensores industriais, cameras de seguranca, medidores inteligentes, veiculos autonomos, dispositivos medicos e eletrodomesticos. Estimativas indicam que ate 2030 teremos mais de 30 bilhoes de dispositivos IoT conectados. Cada um desses dispositivos precisa de uma identidade unica e verificavel para operar de forma segura.

No modelo tradicional, a identidade de dispositivos IoT e gerenciada por servidores centralizados controlados pelos fabricantes. Isso cria pontos unicos de falha: se o servidor do fabricante sai do ar ou a empresa encerra suas operacoes, os dispositivos podem perder funcionalidade ou ficar vulneraveis.

- **Exemplo**: Uma empresa de termostatos inteligentes encerra suas atividades e desliga seus servidores. Milhares de dispositivos vendidos perdem a capacidade de autenticacao e atualizacao, tornando-se inuteis ou vulneraveis a ataques.

### 1.2 Vulnerabilidades do modelo centralizado
O modelo centralizado de identidade IoT apresenta vulnerabilidades criticas. Dispositivos frequentemente utilizam credenciais estaticas (senhas padrao ou certificados fixos) que raramente sao atualizados. Alem disso, a comunicacao entre dispositivos muitas vezes depende de intermediarios centralizados que podem ser comprometidos.

Ataques como o botnet Mirai demonstraram como dispositivos IoT com credenciais fracas podem ser sequestrados em massa para realizar ataques de negacao de servico (DDoS) em escala massiva, derrubando partes significativas da infraestrutura da internet.

- **Exemplo**: O ataque Mirai de 2016 comprometeu mais de 600.000 dispositivos IoT — cameras, roteadores e gravadores de video — usando senhas padrao de fabrica, e utilizou essa rede para derrubar servicos como Twitter, Netflix e Reddit simultaneamente.

---

## 2. DIDs para dispositivos: identidade autonoma de maquinas
### 2.1 Atribuindo DIDs a dispositivos IoT
Assim como pessoas podem ter identificadores descentralizados (DIDs), dispositivos IoT tambem podem receber DIDs que lhes conferem identidade unica, verificavel e independente de qualquer servidor central. O DID de um dispositivo e criado no momento da fabricacao ou no primeiro registro, e e associado a um par de chaves criptograficas armazenado em hardware seguro (como um chip TPM ou enclave seguro).

O documento DID do dispositivo contem suas chaves publicas, endpoints de comunicacao e metadados relevantes. Diferente de certificados tradicionais, o DID nao depende de uma autoridade certificadora centralizada — sua autenticidade pode ser verificada diretamente atraves de um registro descentralizado.

- **Exemplo**: Um sensor de temperatura industrial recebe o DID `did:iot:sensor-temp-9f3a`. Seu documento DID registra a chave publica do sensor, o protocolo de comunicacao suportado (MQTT) e o fabricante. Qualquer sistema que interaja com esse sensor pode verificar sua identidade consultando o registro descentralizado, sem depender do servidor do fabricante.

### 2.2 Credenciais verificaveis para dispositivos
Alem do DID, dispositivos IoT podem receber e apresentar credenciais verificaveis que atestam propriedades importantes: conformidade com padroes de seguranca, certificacoes de calibracao, autorizacoes de operacao e historico de manutencao.

O fabricante pode emitir uma credencial atestando que o dispositivo foi fabricado segundo determinados padroes. Um laboratorio de calibracao pode emitir uma credencial confirmando que o sensor esta dentro das especificacoes. Um administrador de rede pode emitir uma credencial autorizando o dispositivo a operar em determinado ambiente.

- **Exemplo**: Um medidor inteligente de energia recebe tres credenciais verificaveis: uma do fabricante atestando conformidade com a norma IEC 62052, uma do laboratorio de metrologia confirmando calibracao valida ate 2027, e uma da distribuidora de energia autorizando sua operacao na rede local. Qualquer auditoria pode verificar todas essas credenciais instantaneamente.

### 2.3 Ciclo de vida da identidade de dispositivos
A identidade descentralizada permite gerenciar todo o ciclo de vida de um dispositivo IoT de forma transparente e auditavel. Desde a fabricacao, passando pela instalacao, operacao, manutencao e ate o descarte, cada etapa pode ser registrada como credenciais verificaveis associadas ao DID do dispositivo.

Quando um dispositivo troca de proprietario, o novo dono pode receber a transferencia do controle sobre o DID, mantendo todo o historico do equipamento. Quando o dispositivo e descomissionado, seu DID pode ser revogado, impedindo que seja reutilizado de forma maliciosa.

- **Exemplo**: Um veiculo autonomo possui um DID que acumula credenciais ao longo de sua vida util: certificado de fabricacao, inspecoes periodicas, atualizacoes de firmware, trocas de proprietario e registros de manutencao. Ao ser vendido, o novo proprietario recebe acesso a todo esse historico verificavel e assume o controle do DID.

---

## 3. Comunicacoes seguras e cadeia de confianca em IoT
### 3.1 Autenticacao mutua entre dispositivos
Em ecossistemas IoT, dispositivos frequentemente precisam se comunicar diretamente entre si (machine-to-machine ou M2M) sem intervencao humana. A identidade descentralizada permite autenticacao mutua: antes de trocar dados, ambos os dispositivos verificam o DID e as credenciais um do outro, garantindo que estao se comunicando com entidades legitimas.

Esse processo elimina a necessidade de um servidor central de autenticacao como intermediario. Os dispositivos resolvem os DIDs, verificam as assinaturas criptograficas e validam as credenciais diretamente, estabelecendo canais de comunicacao seguros de ponta a ponta.

- **Exemplo**: Um sensor de umidade em uma estufa agricola precisa enviar dados para o sistema de irrigacao automatica. Antes de transmitir, o sensor apresenta seu DID e credencial de autorizacao. O sistema de irrigacao verifica ambos, confirma que o sensor e legitimo e esta autorizado, e so entao aceita os dados para ajustar a irrigacao.

### 3.2 Protocolos DIDComm para IoT
O protocolo DIDComm, originalmente projetado para comunicacao entre agentes de identidade, pode ser adaptado para comunicacoes IoT. O DIDComm oferece mensagens criptografadas, autenticadas e com garantia de integridade, usando os pares de chaves associados aos DIDs dos dispositivos.

Para dispositivos com recursos computacionais limitados, versoes otimizadas do protocolo podem ser implementadas. Dispositivos mais robustos podem atuar como gateways, intermediando comunicacoes para dispositivos mais simples enquanto mantêm as garantias de seguranca.

- **Exemplo**: Em uma fabrica inteligente, robos industriais utilizam DIDComm para coordenar operacoes na linha de montagem. Cada robo autentica suas mensagens com sua chave privada, e os demais verificam a autenticidade antes de executar comandos. Um gateway na rede agrega comunicacoes de sensores mais simples, garantindo a cadeia de confianca.

### 3.3 Cadeias de confianca e ecossistemas IoT
A cadeia de confianca em IoT com identidade descentralizada funciona de forma hierarquica e verificavel. O fabricante emite credenciais de origem. Laboratorios e certificadores emitem credenciais de conformidade. Administradores de rede emitem credenciais de autorizacao. Cada camada pode ser verificada independentemente, criando um ecossistema onde a confianca e construida de forma distribuida e transparente.

Frameworks como o Trust over IP (ToIP) propoem modelos de governanca que definem quais emissores sao confiáveis para quais tipos de credenciais, criando ecossistemas IoT interoperaveis e seguros entre diferentes fabricantes e setores.

- **Exemplo**: Um hospital inteligente implementa uma cadeia de confianca para seus dispositivos medicos. Apenas dispositivos com credencial de fabricante aprovado pela ANVISA, calibracao valida emitida por laboratorio acreditado e autorizacao da engenharia clinica do hospital podem operar na rede. Qualquer dispositivo que nao atenda a todos os criterios e automaticamente bloqueado.

---

## Conclusao
Nesta aula, vimos como a identidade descentralizada resolve desafios criticos da Internet das Coisas. DIDs conferem identidade unica e independente a dispositivos, eliminando dependencia de servidores centralizados. Credenciais verificaveis permitem atestar propriedades importantes ao longo de todo o ciclo de vida do dispositivo. Protocolos como DIDComm habilitam comunicacoes seguras entre maquinas, e cadeias de confianca distribuidas criam ecossistemas IoT mais resilientes e confiáveis.

---

## Licao de Casa
1. Escolha um cenario IoT do seu interesse (casa inteligente, cidade inteligente, industria 4.0 ou saude conectada) e descreva como DIDs e credenciais verificaveis poderiam ser aplicados a pelo menos tres tipos de dispositivos nesse cenario.
2. Pesquise o projeto IOTA Identity ou outra iniciativa de identidade descentralizada para IoT e resuma como ele aborda a identificacao de dispositivos e a escalabilidade para bilhoes de dispositivos.
3. Elabore um modelo de cadeia de confianca para um ecossistema IoT de sua escolha, definindo quais entidades emitem quais tipos de credenciais e quais regras de verificacao devem ser aplicadas.

---

## Proxima Aula
Na proxima aula, vamos explorar como a identidade descentralizada se aplica ao governo e a cidadania, incluindo votacao eletronica segura e identidade digital governamental. Ate la!

---

## Questionario

**1. Qual e o principal risco do modelo centralizado de identidade para dispositivos IoT?**
a) Os dispositivos se tornam mais rapidos
b) A identidade dos dispositivos depende de um ponto unico de falha
c) Os dados transmitidos ficam automaticamente criptografados
d) Os fabricantes perdem o controle sobre os precos dos dispositivos
**Resposta: b**

**2. O que e um DID atribuido a um dispositivo IoT?**
a) Um endereco IP fixo atribuido pelo fabricante
b) Uma senha padrao gravada no firmware do dispositivo
c) Um identificador descentralizado unico que confere identidade verificavel e independente
d) Um numero de serie registrado em um banco de dados centralizado do governo
**Resposta: c**

**3. Como credenciais verificaveis beneficiam o ciclo de vida de um dispositivo IoT?**
a) Substituem a necessidade de manutencao fisica
b) Permitem registrar e verificar propriedades como conformidade, calibracao e autorizacao
c) Aumentam a velocidade de processamento do dispositivo
d) Eliminam a necessidade de atualizacoes de firmware
**Resposta: b**

**4. O que e autenticacao mutua entre dispositivos IoT?**
a) Um processo em que apenas um dispositivo verifica a identidade do outro
b) Um processo em que ambos os dispositivos verificam as identidades um do outro antes de se comunicar
c) Um processo que exige intervencao humana para cada comunicacao
d) Um processo que dispensa qualquer tipo de verificacao de identidade
**Resposta: b**

**5. Qual e o papel de um gateway em comunicacoes IoT com DIDComm?**
a) Eliminar a necessidade de DIDs para dispositivos simples
b) Intermediar comunicacoes de dispositivos com recursos limitados mantendo garantias de seguranca
c) Armazenar todas as chaves privadas de todos os dispositivos da rede
d) Substituir completamente os protocolos de comunicacao existentes
**Resposta: b**
