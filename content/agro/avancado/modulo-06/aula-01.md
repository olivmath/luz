# Aula 6.1: Ethereum e Layer-2s para Tokenizacao no Agronegocio

## Abertura

Bem-vindo a aula 6.1 do Modulo 6 — Infraestrutura Blockchain: Escolha da Rede. Nos modulos anteriores deste Curso 5 (Avancado), voce aprendeu a estruturar operacoes de tokenizacao de ativos reais (RWA) no agronegocio, dominou smart contracts, oraculos, compliance on-chain e mecanismos de governanca. Agora, chegou o momento de responder a uma pergunta pratica e decisiva: em qual blockchain voce vai deployar sua operacao? Essa escolha impacta diretamente custo, seguranca, liquidez, compatibilidade regulatoria e a experiencia do investidor. Nesta aula, vamos analisar em profundidade o Ethereum e suas solucoes de Layer-2 (L2), que constituem o ecossistema mais maduro e liquido para tokenizacao de RWA no mundo.

### Programa da aula:

1. Ethereum como camada base: seguranca, liquidez e ecossistema DeFi
2. Layer-2s recomendadas: Polygon, Arbitrum e Base
3. Custos reais de deployment e manutencao para operacoes agro

---

## 1. Ethereum como camada base: seguranca, liquidez e ecossistema DeFi

### Por que Ethereum ainda domina a tokenizacao de RWA

Ethereum e, em 2025, a blockchain com maior volume de ativos reais tokenizados (RWA) do mundo. Segundo dados da plataforma RWA.xyz, mais de US$ 8 bilhoes em ativos tokenizados estao deployados no Ethereum e suas Layer-2s, representando mais de 55% do mercado global de RWA on-chain. Essa dominancia nao e acidental — ela resulta de tres pilares fundamentais que o profissional de agro estruturado precisa compreender.

O primeiro pilar e a seguranca. Ethereum opera com o mecanismo de consenso Proof-of-Stake (PoS) desde setembro de 2022 (The Merge), com mais de 900.000 validadores ativos e mais de US$ 110 bilhoes em ETH staked como garantia economica da rede. Isso significa que, para atacar a rede Ethereum e alterar transacoes registradas, um agente malicioso precisaria controlar mais de US$ 36 bilhoes em ETH — um custo proibitivo que torna a rede virtualmente inviolavel para operacoes financeiras. Quando voce tokeniza um CRA de R$ 50 milhoes lastreado em CPRs de soja, a seguranca da rede subjacente nao e um detalhe tecnico — e a fundacao da confianca institucional na operacao.

O segundo pilar e a liquidez. Ethereum concentra a maior parte dos protocolos DeFi (Financas Descentralizadas) do mercado: Uniswap, Aave, Compound, MakerDAO e Centrifuge operam primariamente no Ethereum e suas L2s. Isso significa que um token de CRA emitido no Ethereum pode, potencialmente, ser utilizado como colateral em protocolos de emprestimo (Aave), negociado em exchanges descentralizadas (Uniswap), e integrado a pools de liquidez — funcionalidades que nao existem em blockchains com ecossistema DeFi incipiente. A empresa Ondo Finance, que tokenizou mais de US$ 600 milhoes em titulos do Tesouro americano, escolheu Ethereum precisamente por esse acesso a liquidez DeFi.

O terceiro pilar e o ecossistema de desenvolvedores e ferramentas. Ethereum possui a maior comunidade de desenvolvedores blockchain do mundo — mais de 7.000 desenvolvedores ativos mensais, segundo o relatorio Electric Capital 2024. Isso se traduz em ferramentas maduras de desenvolvimento (Hardhat, Foundry, OpenZeppelin), padroes de tokens amplamente adotados (ERC-20 para tokens fungiveis, ERC-1400 para security tokens com restricoes de transferencia, ERC-3643 para tokens regulados), auditorias de seguranca disponiveis e integracao com carteiras como MetaMask e WalletConnect.

- **Exemplo**: A empresa brasileira Liqi, autorizada pela CVM para operar como plataforma de crowdfunding de investimento (Resolucao CVM 88), utiliza a rede Ethereum e Polygon (Layer-2 do Ethereum) como infraestrutura para seus tokens de recebiveis agro. Em 2024, uma emissao de tokens lastreados em CPRs de produtores de cafe de Minas Gerais utilizou o padrao ERC-20 na Polygon, herdando a seguranca do Ethereum (via checkpoints) e aproveitando os custos reduzidos da L2. A escolha permitiu que investidores utilizassem carteiras MetaMask para adquirir tokens com ticket minimo de R$ 100, e que a operacao fosse auditavel em tempo real no PolygonScan.

### Limitacoes do Ethereum Layer-1: custo e throughput

Apesar das vantagens, o Ethereum Layer-1 (a rede principal) possui limitacoes criticas para operacoes agro de alto volume. A principal e o custo de gas — a taxa paga para executar transacoes e smart contracts na rede. Em periodos de alta demanda, o gas pode chegar a US$ 50 a US$ 200 por transacao, o que inviabiliza operacoes de micro-distribuicao (como distribuir tokens a 5.000 investidores de varejo com ticket de R$ 100). Alem disso, o Ethereum L1 processa aproximadamente 15 a 30 transacoes por segundo (TPS), o que gera congestionamento em momentos de pico.

Para uma emissao de CRA tokenizado de R$ 50 milhoes distribuido a 3.000 investidores, o custo de distribuicao no Ethereum L1 poderia chegar a R$ 300.000 a R$ 600.000 apenas em taxas de gas — um valor que inviabiliza economicamente a operacao para emissoes de medio porte. E precisamente por isso que as Layer-2s se tornaram a solucao padrao para tokenizacao de RWA.

O throughput limitado tambem impacta a experiencia do usuario. Se 500 investidores tentarem comprar tokens simultaneamente no lancamento de uma emissao, a rede L1 pode levar minutos a horas para confirmar todas as transacoes, com custos de gas escalando exponencialmente pela competicao por espaco no bloco. Essa latencia e inaceitavel para operacoes financeiras que exigem previsibilidade e experiencia de usuario profissional.

- **Exemplo**: Em marco de 2024, uma plataforma internacional de tokenizacao de RWA tentou distribuir tokens de um fundo imobiliario diretamente no Ethereum L1. O gas medio no dia era de US$ 85 por transacao. Com 2.500 investidores participando, o custo total de gas para a distribuicao inicial ultrapassou US$ 200.000. A plataforma migrou a operacao para Arbitrum (L2) na emissao seguinte, reduzindo o custo total de distribuicao para menos de US$ 3.000 — uma reducao de 98%.

---

## 2. Layer-2s recomendadas: Polygon, Arbitrum e Base

### Polygon: o padrao de mercado para tokenizacao de RWA

Polygon (anteriormente Matic Network) e, em 2025, a Layer-2 mais utilizada para tokenizacao de ativos reais no mundo. Segundo dados da RWA.xyz, mais de US$ 2 bilhoes em RWA estao deployados na Polygon, incluindo operacoes de empresas como Franklin Templeton (fundo de titulos do Tesouro americano tokenizado com mais de US$ 400 milhoes de AUM), JPMorgan (projeto Onyx, que realizou transacoes de tokenizacao na Polygon), e Hamilton Lane (fundo de private equity tokenizado).

As vantagens da Polygon para operacoes agro sao claras. Primeiro, o custo: uma transacao na Polygon custa entre US$ 0,001 e US$ 0,05 — ou seja, fracoes de centavo. Distribuir tokens a 5.000 investidores custa menos de US$ 250 em gas total. Segundo, a compatibilidade: Polygon e totalmente compativel com Ethereum (EVM-compatible), o que significa que smart contracts escritos para Ethereum funcionam na Polygon sem modificacao. Terceiro, a velocidade: Polygon processa mais de 7.000 TPS com tempo de confirmacao de cerca de 2 segundos. Quarto, a evolucao para ZK: a Polygon esta migrando para Polygon zkEVM e Polygon CDK (Chain Development Kit), que utilizam provas de conhecimento zero (zero-knowledge proofs) para herdar a seguranca completa do Ethereum com custos ainda menores.

No contexto regulatorio brasileiro, a Polygon tem sido a escolha predominante de plataformas como Liqi e MB Tokens para emissao de tokens de recebiveis agro. A compatibilidade com o padrao ERC-3643 (T-REX Protocol) — um protocolo de security tokens que permite restricoes de transferencia on-chain, verificacao de identidade e compliance regulatorio automatizado — torna a Polygon particularmente adequada para operacoes que precisam cumprir requisitos da CVM.

- **Exemplo**: A Liqi emitiu em 2024 uma serie de tokens de recebiveis agro na Polygon com as seguintes caracteristicas tecnicas: smart contract baseado no ERC-20 com funcoes de whitelist (apenas investidores KYC/AML aprovados podem deter tokens), pausabilidade (o emissor pode pausar transferencias em caso de evento regulatorio), e distribuicao automatica de rendimentos via funcao de claim. O custo total de deployment do smart contract foi de US$ 2,30 em gas. O custo de distribuicao a 1.800 investidores foi de US$ 54. Compare com os potenciais R$ 300.000+ no Ethereum L1. Essa economia viabiliza emissoes de menor porte — como CPRs tokenizadas de R$ 2 milhoes a R$ 10 milhoes — que seriam inviaveis economicamente no L1.

### Arbitrum: performance e ecossistema DeFi robusto

Arbitrum e uma Layer-2 do tipo Optimistic Rollup que se consolidou como a principal rede para aplicacoes DeFi avancadas. Em termos de Total Value Locked (TVL), Arbitrum lidera entre as L2s com mais de US$ 18 bilhoes em protocolos como GMX, Aave, Uniswap e Camelot. Para operacoes de tokenizacao agro que pretendem integrar seus tokens ao ecossistema DeFi — por exemplo, permitir que investidores usem tokens de CRA como colateral para emprestimos, ou criar pools de liquidez para negociacao secundaria — Arbitrum oferece o ambiente mais liquido e diversificado.

As especificidades tecnicas de Arbitrum sao relevantes para o estruturador. Arbitrum processa transacoes com custo medio de US$ 0,01 a US$ 0,10, com confirmacao em menos de 1 segundo (soft confirmation) e finalizacao no Ethereum L1 em aproximadamente 7 dias (periodo de desafio do Optimistic Rollup). Essa arquitetura significa que, embora as transacoes sejam rapidas para o usuario, a seguranca final depende do Ethereum L1, com um periodo de latencia para resolucao de disputas.

Para operacoes agro, Arbitrum e particularmente interessante quando o objetivo e criar mercados secundarios liquidos para tokens de CRA ou CPR. O protocolo Camelot DEX, nativo de Arbitrum, oferece pools de liquidez concentrada que permitem criar pares de negociacao com eficiencia de capital superior a exchanges descentralizadas tradicionais. Um emissor de CRA tokenizado poderia criar um par TOKEN_CRA/USDC na Camelot, depositar liquidez inicial e permitir que investidores negociem tokens 24/7 com baixo slippage.

- **Exemplo**: O protocolo Centrifuge, especializado em tokenizacao de credito privado (private credit), opera em multiplas redes incluindo Arbitrum. Em 2024, um pool de credito agro na Centrifuge com lastro em recebiveis de exportacao de soja do Brasil foi deployado em Arbitrum para aproveitar a integracao com Aave — o maior protocolo de emprestimos DeFi. Isso permitiu que investidores institucionais depositassem tokens do pool na Aave como colateral e tomassem emprestimos em USDC, criando alavancagem on-chain sobre o credito agro. O custo de manutencao mensal do smart contract (atualizacoes de oraculo, distribuicao de rendimentos) foi de aproximadamente US$ 15 em gas.

### Base: a aposta institucional da Coinbase

Base e uma Layer-2 lancada pela Coinbase em agosto de 2023, construida sobre o framework OP Stack (mesmo do Optimism). Embora mais recente que Polygon e Arbitrum, Base merece atencao do profissional de agro estruturado por tres razoes estrategicas.

Primeira: distribuicao. A Coinbase tem mais de 110 milhoes de usuarios verificados globalmente. Tokens deployados na Base podem ser acessados diretamente pelo app da Coinbase e pela Coinbase Wallet, o que reduz dramaticamente a friccao de onboarding de investidores que nao sao nativos de cripto. Para uma operacao de CRA tokenizado que visa atingir investidores de varejo brasileiros que ja possuem conta na Coinbase, a Base oferece um canal de distribuicao integrado.

Segunda: custo. Apos a atualizacao Dencun do Ethereum (marco de 2024), que introduziu os blobs (EIP-4844), os custos de transacao na Base cairam para menos de US$ 0,001 — virtualmente zero. Distribuir tokens a 10.000 investidores na Base custa menos de US$ 10 em gas total.

Terceira: conformidade regulatoria. A Coinbase e uma empresa listada na NASDAQ (ticker: COIN), sujeita a regulacao da SEC americana e com compliance rigoroso. A Base herda essa postura regulatoria, o que facilita a adocao por instituicoes financeiras tradicionais que hesitam em operar em redes associadas a projetos anonimos ou descentralizados sem governanca clara.

- **Exemplo**: Em 2025, a BlackRock — maior gestora de ativos do mundo com mais de US$ 10 trilhoes em AUM — lancou o fundo tokenizado BUIDL (BlackRock USD Institutional Digital Liquidity Fund) em multiplas redes, incluindo Ethereum e Base. O BUIDL tokeniza cotas de um fundo de titulos do Tesouro americano com rendimento diario distribuido on-chain. A presenca na Base reflete a confianca institucional na rede. Para o mercado agro brasileiro, esse precedente e relevante: se a BlackRock confia na Base para tokenizar ativos financeiros, uma securitizadora brasileira tem referencia institucional para justificar a mesma escolha perante investidores e reguladores.

---

## 3. Custos reais de deployment e manutencao para operacoes agro

### Custo de deployment: smart contract, auditoria e integracao

O custo total para deployar uma operacao de tokenizacao agro em blockchain vai muito alem do gas de deployment do smart contract. O profissional de agro estruturado precisa considerar o custo completo da stack tecnologica. Vamos decompor cada componente com valores reais de mercado em 2025.

**Desenvolvimento do smart contract**: Um smart contract de security token com funcionalidades de whitelist, compliance (KYC/AML on-chain), distribuicao automatica de rendimentos, pausabilidade e mecanismos de vesting custa entre US$ 15.000 e US$ 60.000 para desenvolvimento, dependendo da complexidade. Se o projeto utilizar frameworks open-source como OpenZeppelin ou o padrao ERC-3643 (T-REX), o custo cai para US$ 8.000 a US$ 25.000, pois a base do codigo ja esta auditada e testada.

**Auditoria de seguranca**: Toda operacao de tokenizacao que envolve valores mobiliarios deve passar por auditoria de seguranca do smart contract. Firmas como CertiK, Trail of Bits, OpenZeppelin e Halborn cobram entre US$ 20.000 e US$ 100.000 por auditoria completa, dependendo da complexidade do contrato e do prazo. Para um smart contract de CRA tokenizado de complexidade media (token ERC-20 com whitelist, distribuicao de rendimentos e funcoes administrativas), o custo tipico de auditoria e de US$ 25.000 a US$ 40.000. Essa auditoria e indispensavel — vulnerabilidades em smart contracts ja causaram perdas superiores a US$ 3 bilhoes no ecossistema DeFi historicamente.

**Custo de gas para deployment**: No Ethereum L1, deployar um smart contract de token complexo custa entre US$ 500 e US$ 5.000 em gas, dependendo do tamanho do contrato e das condicoes da rede. Na Polygon, o mesmo deployment custa US$ 1 a US$ 10. Na Arbitrum, US$ 5 a US$ 50. Na Base, US$ 0,10 a US$ 1,00.

**Integracao com front-end e plataforma de distribuicao**: A interface do investidor (web app ou app mobile) para compra, venda e acompanhamento dos tokens custa entre US$ 30.000 e US$ 100.000 para desenvolvimento, dependendo do nivel de sofisticacao (integracao com KYC/AML, gateway de pagamento em reais, dashboard de rendimentos, etc.). Plataformas white-label como Fireblocks, Securitize e Tokeny oferecem solucoes pre-construidas que reduzem esse custo para US$ 5.000 a US$ 20.000 mensais em licenciamento.

### Custo operacional mensal: manutencao, oraculos e compliance

Apos o deployment, a operacao tem custos recorrentes que o estruturador precisa incorporar ao modelo financeiro.

**Oraculos**: Se o token de CRA precisa de dados externos on-chain — como preco da soja na CBOT para calculo de garantias, ou taxa CDI para remuneracao variavel — o custo de oraculos como Chainlink varia de US$ 500 a US$ 5.000 mensais, dependendo da frequencia de atualizacao e do numero de feeds de dados. Para uma operacao de CRA indexado ao CDI com colateral em soja, o custo tipico e de US$ 1.500 a US$ 3.000 mensais.

**Gas para operacoes recorrentes**: Distribuicao mensal de rendimentos a 3.000 holders na Polygon custa aproximadamente US$ 30 a US$ 90 em gas. Na Arbitrum, US$ 60 a US$ 180. Na Base, US$ 3 a US$ 10. No Ethereum L1, US$ 15.000 a US$ 45.000 — o que reafirma a inviabilidade do L1 para operacoes de distribuicao de rendimentos a grande numero de investidores.

**Monitoramento e seguranca**: Servicos de monitoramento on-chain (como Forta, OpenZeppelin Defender) custam US$ 500 a US$ 2.000 mensais. Esses servicos alertam sobre transacoes anomalas, tentativas de exploits e mudancas inesperadas no estado do smart contract.

**Compliance e KYC/AML on-chain**: Provedores de identidade on-chain como Synaps, Sumsub ou Chainalysis custam entre US$ 0,50 e US$ 3,00 por verificacao de investidor, mais US$ 1.000 a US$ 5.000 mensais em licenciamento da plataforma.

### Tabela comparativa de custos para emissao de CRA tokenizado de R$ 50 milhoes

| Item | Ethereum L1 | Polygon | Arbitrum | Base |
|------|------------|---------|----------|------|
| Deployment smart contract (gas) | US$ 2.000 | US$ 5 | US$ 25 | US$ 0,50 |
| Distribuicao a 3.000 investidores (gas) | US$ 150.000 | US$ 90 | US$ 180 | US$ 9 |
| Rendimento mensal a 3.000 holders (gas) | US$ 30.000 | US$ 60 | US$ 120 | US$ 6 |
| Custo anual de gas operacional | ~US$ 360.000 | ~US$ 720 | ~US$ 1.440 | ~US$ 72 |
| Seguranca herdada do Ethereum | Nativa | Via checkpoints | Via rollup | Via rollup |

Esses numeros demonstram que, para operacoes agro de distribuicao ampla, as Layer-2s nao sao uma opcao — sao uma necessidade economica. O Ethereum L1 permanece relevante como camada de seguranca e liquidacao final, mas a execucao de operacoes de tokenizacao deve ocorrer em L2.

- **Exemplo**: Uma securitizadora brasileira modelou o custo total de uma emissao de CRA tokenizado de R$ 30 milhoes na Polygon, incluindo: desenvolvimento do smart contract (US$ 20.000), auditoria de seguranca (US$ 30.000), integracao com plataforma de distribuicao (US$ 15.000/mes), oraculos Chainlink para CDI e preco de milho (US$ 2.000/mes), gas anual estimado (US$ 720), monitoramento on-chain (US$ 1.000/mes) e compliance KYC/AML (US$ 2.000/mes). O custo total do primeiro ano foi de aproximadamente US$ 290.000 (cerca de R$ 1,5 milhao ao cambio de R$ 5,20). Esse custo representa 0,5% do volume da emissao — comparavel ao custo de estruturacao de um CRA tradicional via securitizadora, que tipicamente cobra entre 0,3% e 1,0% do volume emitido. A viabilidade economica esta confirmada para emissoes a partir de R$ 10 milhoes a R$ 15 milhoes, abaixo do qual os custos fixos de tecnologia comprimem excessivamente a margem.

---

## Conclusao

Nesta aula, analisamos em profundidade o Ethereum e suas Layer-2s como infraestrutura para tokenizacao de ativos agro. Ethereum oferece os tres pilares fundamentais — seguranca (US$ 110 bilhoes em ETH staked), liquidez (maior ecossistema DeFi do mundo) e ecossistema de ferramentas maduro — mas seu custo e throughput no Layer-1 inviabilizam operacoes de distribuicao ampla. As Layer-2s resolvem essa equacao: Polygon e o padrao de mercado para RWA com custos proximos de zero e compatibilidade regulatoria; Arbitrum lidera em DeFi e e ideal para operacoes que buscam integracao com mercados secundarios descentralizados; Base oferece distribuicao via Coinbase e respaldo institucional. Os custos reais de uma operacao tokenizada em L2 sao comparaveis aos de uma emissao tradicional, com viabilidade economica a partir de R$ 10 milhoes a R$ 15 milhoes. O profissional de agro estruturado deve dominar essas opcoes para tomar decisoes fundamentadas sobre qual rede utilizar em cada operacao.

---

## Licao de Casa

1. Pesquise o site RWA.xyz e identifique os cinco maiores protocolos de tokenizacao de RWA por volume, anotando em quais blockchains cada um opera. Analise por que a maioria escolheu Ethereum ou suas Layer-2s e se algum utiliza redes alternativas.
2. Calcule o custo anual estimado de gas para uma operacao de CRA tokenizado de R$ 20 milhoes com 2.000 investidores e distribuicao mensal de rendimentos, comparando Polygon, Arbitrum e Base. Utilize os valores de referencia apresentados na aula e justifique qual rede voce escolheria.
3. Pesquise o padrao ERC-3643 (T-REX Protocol) e descreva em 15 a 20 linhas como ele implementa compliance regulatorio on-chain (whitelist, restricoes de transferencia, verificacao de identidade). Explique por que esse padrao e relevante para tokenizacao de CRA no Brasil sob a regulacao da CVM.

---

## Questionario

**1. Qual e o principal motivo pelo qual o Ethereum Layer-1 e inadequado para distribuicao ampla de tokens de CRA agro a investidores de varejo?**

a) O Ethereum nao suporta smart contracts com funcoes de compliance regulatorio
b) O custo de gas no L1 pode ultrapassar US$ 150.000 para distribuir tokens a 3.000 investidores, inviabilizando economicamente emissoes de medio porte
c) O Ethereum nao e compativel com o padrao ERC-20, exigido para tokens fungiveis
d) O Ethereum foi descontinuado apos a migracao para Proof-of-Stake em 2022

**Resposta: b**

**2. Qual Layer-2 e considerada o padrao de mercado para tokenizacao de RWA em 2025, com mais de US$ 2 bilhoes em ativos reais deployados e adocao por empresas como Franklin Templeton e JPMorgan?**

a) Optimism
b) zkSync
c) Polygon
d) Avalanche

**Resposta: c**

**3. Uma securitizadora brasileira deseja emitir um CRA tokenizado de R$ 50 milhoes com distribuicao a 3.000 investidores e pagamento mensal de rendimentos. Considerando os custos apresentados na aula, qual das seguintes afirmativas e correta?**

a) O Ethereum L1 e a opcao mais economica, pois nao cobra taxas de gas para operacoes de security tokens
b) O custo anual de gas operacional no Ethereum L1 seria de aproximadamente US$ 360.000, enquanto na Polygon seria de aproximadamente US$ 720 — uma diferenca de 500 vezes que torna as L2s uma necessidade economica
c) Todas as Layer-2s possuem o mesmo custo de gas, nao havendo diferenca economica entre Polygon, Arbitrum e Base
d) O custo de auditoria de smart contract e eliminado quando se utiliza uma Layer-2, pois a seguranca e herdada do Ethereum

**Resposta: b**

**4. Por que a Base (Layer-2 da Coinbase) e estrategicamente relevante para operacoes de tokenizacao agro voltadas a investidores de varejo?**

a) Porque a Base e a unica rede que suporta o Real Digital (Drex)
b) Porque oferece distribuicao integrada via Coinbase (110 milhoes de usuarios), custos de gas proximos de zero e respaldo institucional de empresa listada na NASDAQ
c) Porque a Base e a unica Layer-2 aprovada pela CVM para emissao de tokens de valores mobiliarios no Brasil
d) Porque a Base processa 1 milhao de transacoes por segundo, superando todas as outras redes

**Resposta: b**

**5. Considerando o custo total do primeiro ano de uma emissao de CRA tokenizado de R$ 30 milhoes na Polygon (desenvolvimento, auditoria, integracao, oraculos, gas, monitoramento e compliance), qual e o percentual aproximado em relacao ao volume da emissao e qual e o limiar minimo de viabilidade economica?**

a) Aproximadamente 5% do volume, com viabilidade a partir de R$ 100 milhoes
b) Aproximadamente 0,5% do volume (cerca de R$ 1,5 milhao), com viabilidade economica a partir de R$ 10 milhoes a R$ 15 milhoes
c) Aproximadamente 0,01% do volume, viabilizando emissoes de qualquer tamanho, inclusive abaixo de R$ 100 mil
d) Aproximadamente 10% do volume, inviabilizando a tokenizacao frente ao modelo tradicional de securitizacao

**Resposta: b**

---

## Proxima Aula

Na proxima aula (6.2), vamos analisar duas alternativas de alta performance ao ecossistema Ethereum: Solana, com sua capacidade de milhares de transacoes por segundo e custo quase zero, ideal para microtransacoes e operacoes agro de alto volume; e o XRP Ledger (XRPL), que protagonizou um caso real de tokenizacao de CRA no Brasil com volume de US$ 130 milhoes. Voce vai entender quando essas redes sao superiores ao Ethereum e suas L2s, e quando nao sao. Ate la!
