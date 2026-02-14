# Aula 6.2: Alternativas de Alta Performance — Solana e XRPL

## Abertura

Bem-vindo a aula 6.2 do Modulo 6. Na aula anterior, voce dominou o ecossistema Ethereum e suas Layer-2s — a infraestrutura mais madura e liquida para tokenizacao de RWA. Agora, vamos expandir o repertorio tecnico analisando duas blockchains que desafiam o paradigma Ethereum com propostas radicalmente diferentes: Solana, uma rede de alta performance com capacidade de milhares de transacoes por segundo e custo quase zero, e o XRP Ledger (XRPL), que protagonizou um dos maiores casos reais de tokenizacao agro no Brasil. O profissional de agro estruturado precisa conhecer essas alternativas porque nem toda operacao agro se encaixa no modelo Ethereum/L2. Operacoes de alto volume de transacoes, microtransacoes na cadeia produtiva, pagamentos cross-border e tokenizacao de commodities fisicas podem encontrar nessas redes vantagens tecnicas e economicas decisivas.

### Programa da aula:

1. Solana: alta TPS, custo quase zero e aplicacoes para microtransacoes agro
2. XRPL: caso real de tokenizacao de CRA no Brasil (US$ 130 milhoes)
3. Analise comparativa: Ethereum/L2s vs. Solana vs. XRPL para diferentes operacoes agro

---

## 1. Solana: alta TPS, custo quase zero e aplicacoes para microtransacoes agro

### Arquitetura tecnica: por que Solana e tao rapida

Solana e uma blockchain Layer-1 que utiliza uma combinacao unica de mecanismos de consenso — Proof-of-History (PoH) combinado com Tower BFT (uma variacao de Practical Byzantine Fault Tolerance) — para atingir throughput que nenhuma outra rede L1 alcanca. Em condicoes normais de operacao, Solana processa entre 3.000 e 5.000 transacoes por segundo (TPS) reais, com capacidade teorica de ate 65.000 TPS. O tempo de confirmacao de bloco e de aproximadamente 400 milissegundos — menos de meio segundo. E o custo medio por transacao e de US$ 0,00025 (um quarto de milesimo de dolar).

Para contextualizar: enquanto uma transacao na Polygon custa centavos de dolar, na Solana custa fracoes de centavo. Enquanto a Polygon confirma transacoes em 2 segundos, Solana confirma em 0,4 segundo. Essa diferenca de performance, que pode parecer marginal para uma emissao unica de CRA, torna-se critica quando a operacao envolve alto volume de transacoes simultaneas — como rastreabilidade de cadeia produtiva, pagamentos recorrentes a milhares de produtores, ou microtransacoes de comercializacao de commodities.

O ecossistema Solana cresceu significativamente entre 2023 e 2025. O Total Value Locked (TVL) em protocolos DeFi na Solana ultrapassou US$ 8 bilhoes em 2025, com protocolos relevantes como Marinade (staking liquido), Raydium e Orca (DEXs), Kamino e MarginFi (emprestimos), e Jupiter (agregador de liquidez). A rede possui mais de 2.000 desenvolvedores ativos mensais (Electric Capital 2024), e o padrao de token nativo e o SPL Token (equivalente ao ERC-20 no Ethereum).

- **Exemplo**: A Visa, uma das maiores redes de pagamento do mundo, escolheu a Solana em 2023 para expandir sua infraestrutura de liquidacao de stablecoins (USDC). A justificativa publica da Visa foi explicitamente o throughput e o custo: a rede precisava processar milhares de liquidacoes por segundo com custo unitario proximo de zero. Esse caso de uso corporativo de alto volume tem paralelo direto com operacoes agro: uma cooperativa que processa 10.000 pagamentos diarios a produtores via stablecoin encontra na Solana a unica rede capaz de executar esse volume com custo total inferior a US$ 2,50 por dia.

### Solana para microtransacoes e cadeia produtiva agro

O custo quase zero e a alta velocidade de Solana abrem casos de uso no agronegocio que seriam inviaveis em Ethereum ou mesmo em suas Layer-2s. O principal e a rastreabilidade tokenizada da cadeia produtiva com microtransacoes.

Considere uma operacao de barter tokenizada: uma trading fornece insumos (sementes, fertilizantes, defensivos) a 500 produtores de soja em Mato Grosso, e cada produtor se compromete a entregar um volume proporcional de graos na colheita. No modelo tradicional, essa operacao e controlada por planilhas, contratos fisicos e conciliacoes manuais. No modelo tokenizado em Solana, cada entrega de insumo gera um token de debito no endereco do produtor, cada entrega de grao gera um token de credito, e o smart contract concilia automaticamente debitos e creditos em tempo real. Com 500 produtores, 3 a 5 entregas de insumo cada, e multiplas entregas de grao na colheita, a operacao pode gerar 5.000 a 10.000 transacoes. Na Solana, o custo total dessas transacoes seria de US$ 1,25 a US$ 2,50. Na Polygon, US$ 50 a US$ 500. No Ethereum L1, US$ 500.000 a US$ 2.000.000.

Outro caso de uso e o pagamento instantaneo a produtores via stablecoin. Cooperativas como Coamo (maior cooperativa agro do Brasil, com mais de 30.000 cooperados) processam milhares de pagamentos diarios a produtores pela entrega de graos. Integrar esses pagamentos a uma stablecoin na Solana (como USDC ou uma stablecoin lastreada em Real) permitiria liquidacao instantanea, rastreabilidade completa e custo de transacao desprezivel — eliminando a latencia de 1 a 3 dias uteis do sistema bancario tradicional.

A tokenizacao de commodities fisicas tambem encontra na Solana uma infraestrutura adequada. Projetos como a Agrotoken (que tokeniza soja, milho e trigo como meio de pagamento) necessitam processar alto volume de transacoes de pequeno valor — um produtor que paga combustivel com tokens de soja, por exemplo — e a Solana oferece o throughput e o custo necessarios para essa operacao em escala.

- **Exemplo**: A Agrotoken, fundada na Argentina e com operacoes no Brasil, tokeniza commodities agricolas (SOYA, CORA, WHEA) que funcionam como meio de pagamento estavel lastreado em graos. Produtores tokenizam sua producao e utilizam os tokens para pagar insumos, combustivel e servicos na cadeia agro. A plataforma processa milhares de microtransacoes diarias. Embora tenha iniciado operacoes em Ethereum, a Agrotoken avaliou a migracao para redes de maior throughput precisamente pelo custo de gas: com 5.000 transacoes diarias a US$ 0,50 cada no Ethereum (em periodos favoraveis), o custo mensal de gas ultrapassava US$ 75.000. Em Solana, o mesmo volume custaria US$ 37,50 por mes.

### Limitacoes de Solana: estabilidade, descentralizacao e ecossistema RWA

Solana, apesar de suas vantagens de performance, possui limitacoes que o profissional de agro estruturado precisa considerar criticamente.

A primeira limitacao e historica de estabilidade. Entre 2022 e 2024, Solana sofreu multiplas interrupcoes (outages) que paralisaram a rede por horas — em fevereiro de 2023, a rede ficou offline por mais de 18 horas. Embora a equipe de desenvolvimento tenha implementado melhorias significativas de estabilidade (o cliente Firedancer, desenvolvido pela Jump Crypto, visa resolver esses problemas estruturalmente), o historico de outages e um risco real para operacoes financeiras que exigem disponibilidade 24/7. Um CRA tokenizado com vencimento de cupom programado para um dia especifico nao pode tolerar que a rede esteja offline nessa data.

A segunda limitacao e o grau de descentralizacao. Solana opera com aproximadamente 1.900 validadores, mas a concentracao de stake nos top 20 validadores e significativamente maior que no Ethereum. O coeficiente de Nakamoto (numero minimo de validadores que precisam conspirar para comprometer a rede) e estimado entre 19 e 31 para Solana, versus mais de 400 para Ethereum. Para operacoes de tokenizacao de valores mobiliarios que exigem maxima seguranca e resiliencia, essa diferenca e relevante.

A terceira limitacao e o ecossistema de RWA. Enquanto Ethereum e suas L2s concentram mais de US$ 8 bilhoes em RWA tokenizados, Solana ainda possui menos de US$ 500 milhoes. Os padroes de security tokens na Solana (como o padrao Token-2022 com extensoes de transfer hook e confidential transfers) sao mais recentes e menos testados em producao que os equivalentes no Ethereum (ERC-3643, ERC-1400). Firmas de auditoria especializadas em smart contracts Solana (que utilizam Rust/Anchor) sao menos numerosas que as especializadas em Solidity/EVM.

- **Exemplo**: Uma fintech brasileira avaliou em 2024 a emissao de tokens de CPR de algodao na Solana para aproveitar o custo quase zero. A analise tecnica revelou que: (a) nao existia padrao consolidado de security token na Solana equivalente ao ERC-3643 do Ethereum; (b) a auditoria do smart contract em Rust/Anchor custaria 40% mais que a equivalente em Solidity, por menor disponibilidade de auditores; e (c) a integracao com provedores de KYC/AML on-chain era limitada na Solana comparada ao Ethereum. A fintech optou por emitir na Polygon e monitorar a evolucao do ecossistema Solana para futuras emissoes.

---

## 2. XRPL: caso real de tokenizacao de CRA no Brasil (US$ 130 milhoes)

### O que e o XRP Ledger e por que ele importa para o agro brasileiro

O XRP Ledger (XRPL) e uma blockchain criada em 2012 pela empresa Ripple, originalmente desenhada para pagamentos cross-border e liquidacao interbancaria. Diferentemente do Ethereum (que e uma plataforma generica para smart contracts) e da Solana (que busca alta performance para multiplos casos de uso), o XRPL foi otimizado especificamente para transferencias de valor e tokenizacao de ativos com conformidade regulatoria.

As caracteristicas tecnicas do XRPL sao relevantes: tempo de confirmacao de 3 a 5 segundos, custo por transacao de aproximadamente US$ 0,0002, throughput de 1.500 TPS e um mecanismo de consenso unico (Federated Byzantine Agreement) que prioriza seguranca e finalidade de transacao sobre descentralizacao maxima. O XRPL possui funcionalidades nativas de emissao de tokens (sem necessidade de smart contracts complexos), DEX nativa integrada ao protocolo (order book on-chain), e mecanismos de compliance como authorized trust lines (que permitem ao emissor controlar quem pode deter seus tokens).

O que torna o XRPL particularmente relevante para o agro brasileiro e um caso real e de grande escala: a tokenizacao de CRA no valor de US$ 130 milhoes realizada em parceria com a Ripple.

### O caso Mercado Bitcoin e Ripple: US$ 130 milhoes em CRA tokenizado

Em 2023 e 2024, o Mercado Bitcoin (MB) — a maior exchange de criptoativos do Brasil, regulada pelo Banco Central como instituicao de pagamento — realizou, em parceria com a Ripple, a tokenizacao de Certificados de Recebiveis do Agronegocio (CRA) no valor total de US$ 130 milhoes (aproximadamente R$ 650 milhoes) utilizando a infraestrutura XRPL.

Essa operacao e, ate o momento, a maior tokenizacao de ativo agro em blockchain no Brasil e uma das maiores do mundo. Os detalhes da operacao sao instrutivos para o profissional de agro estruturado.

**Estrutura da operacao**: Os CRAs foram emitidos por securitizadoras brasileiras com lastro em recebiveis agro (CPRs de produtores de soja, milho e cafe). O MB atuou como plataforma de distribuicao, tokenizando os CRAs no XRPL e oferecendo os tokens a investidores da sua base de mais de 4 milhoes de usuarios. A Ripple participou como parceira tecnologica e financeira, aportando recursos para viabilizar a operacao e demonstrar o caso de uso do XRPL para tokenizacao de RWA.

**Por que o XRPL foi escolhido**: Segundo declaracoes publicas do Mercado Bitcoin e da Ripple, a escolha do XRPL se baseou em tres fatores: (a) a funcionalidade nativa de tokenizacao do XRPL, que permite emitir tokens representando ativos reais sem necessidade de smart contracts complexos, reduzindo custo de desenvolvimento e risco de vulnerabilidades; (b) o custo operacional quase zero (US$ 0,0002 por transacao), viabilizando distribuicao a dezenas de milhares de investidores de varejo; e (c) a parceria estrategica com a Ripple, que aportou liquidez e suporte institucional a operacao.

**Resultados**: A operacao demonstrou que blockchain pode ser utilizada para distribuicao de titulos de credito agro em escala. Os tokens foram oferecidos com ticket minimo acessivel, permitindo que investidores de varejo acessassem CRAs que tradicionalmente exigiriam investimento minimo de R$ 50.000 a R$ 300.000. A rastreabilidade on-chain permitiu que investidores verificassem em tempo real a titularidade e o fluxo de pagamentos.

- **Exemplo**: Em uma das tranches da operacao, um CRA lastreado em CPRs de produtores de soja de Goias com vencimento em 18 meses e remuneracao de CDI + 4,5% ao ano foi tokenizado no XRPL e distribuido a mais de 8.000 investidores via plataforma do Mercado Bitcoin. O ticket medio foi de R$ 2.500 — valor que estaria completamente fora do alcance desses investidores no mercado tradicional de CRA. O custo total de gas para toda a operacao de distribuicao e pagamentos recorrentes no XRPL foi inferior a US$ 50.

### Limitacoes do XRPL e consideracoes criticas

Apesar do sucesso da operacao MB/Ripple, o profissional de agro estruturado precisa avaliar criticamente o XRPL como infraestrutura para tokenizacao.

**Ecossistema DeFi limitado**: O XRPL possui um ecossistema DeFi significativamente menor que Ethereum e Solana. Nao existem protocolos de emprestimo (como Aave) ou pools de liquidez automatizados (como Uniswap) operando nativamente no XRPL com volume relevante. Isso significa que tokens de CRA emitidos no XRPL tem liquidez secundaria limitada ao order book nativo da rede e a plataforma do emissor. O investidor nao pode usar o token como colateral DeFi ou negocia-lo em DEXs de alto volume.

**Programabilidade limitada**: O XRPL nao possui smart contracts Turing-completos como Ethereum ou Solana. Embora a Ripple tenha lancado hooks (programas customizaveis) e esteja desenvolvendo uma sidechain EVM-compatible, as funcionalidades de automacao do XRPL sao mais restritas. Operacoes complexas — como waterfall automatizado de CRA com multiplas tranches, gatilhos de credit enhancement baseados em oraculos, ou distribuicao condicional de rendimentos — exigem workarounds off-chain ou dependem da evolucao do roadmap tecnico da Ripple.

**Centralizacao e governanca**: A Ripple Labs detem uma parcela significativa do supply total de XRP (a criptomoeda nativa do XRPL) e exerce influencia substancial sobre o desenvolvimento do protocolo. Embora o XRPL seja tecnicamente open-source e operado por validadores independentes, a dependencia da Ripple como principal mantenedora e financiadora do ecossistema e um risco de concentracao. Para operacoes financeiras reguladas, a pergunta relevante e: se a Ripple enfrentar problemas juridicos ou financeiros, qual e o impacto sobre os tokens emitidos na rede?

**Contexto regulatorio da Ripple**: A Ripple enfrentou um longo processo judicial com a SEC americana (2020-2025) sobre a classificacao do XRP como valor mobiliario. Embora tenha obtido decisoes parcialmente favoraveis, a incerteza juridica prolongada afetou a adocao institucional do XRPL em certos mercados. No Brasil, a operacao do MB foi realizada sob o arcabouco regulatorio da CVM (Resolucao CVM 88) e do Banco Central, sem relacao direta com o litigio americano, mas o profissional deve estar ciente desse historico.

- **Exemplo**: Uma gestora de FIAGRO avaliou emitir cotas tokenizadas de um fundo de credito agro no XRPL, inspirada pelo caso MB/Ripple. A analise tecnica concluiu que, embora o custo operacional fosse atrativo, a ausencia de smart contracts robustos no XRPL impedia a automacao do waterfall de pagamentos do fundo (que exigia distribuicao proporcional a tres classes de cotistas com prioridades diferentes) e a integracao com oraculos de preco para calculo de marcacao a mercado dos ativos do lastro. A gestora optou por Polygon (com smart contract ERC-3643) e reservou o XRPL como opcao futura caso a Ripple implemente EVM-compatibility completa.

---

## 3. Analise comparativa: Ethereum/L2s vs. Solana vs. XRPL para diferentes operacoes agro

### Matriz de decisao: qual rede para qual operacao

A escolha da blockchain nao e binaria — depende do tipo de operacao, do perfil dos investidores, da necessidade de integracao DeFi, da complexidade do smart contract e dos requisitos regulatorios. Abaixo, uma matriz de decisao pratica para o profissional de agro estruturado.

**Emissao de CRA tokenizado (R$ 10 milhoes a R$ 100 milhoes, investidores qualificados e varejo)**:
- Recomendacao primaria: Polygon ou Arbitrum
- Justificativa: ecossistema maduro de security tokens (ERC-3643), custos baixos, integracao com DeFi para liquidez secundaria, ampla base de auditores e ferramentas
- Alternativa viavel: XRPL (se a operacao nao exige smart contracts complexos e prioriza custo minimo)

**Rastreabilidade de cadeia produtiva com microtransacoes (barter tokenizado, pagamentos a produtores)**:
- Recomendacao primaria: Solana
- Justificativa: custo quase zero por transacao viabiliza milhares de microtransacoes diarias; throughput de 3.000+ TPS suporta operacoes de cooperativas com dezenas de milhares de produtores
- Alternativa viavel: Polygon (se a prioridade e compatibilidade com EVM e ecossistema Ethereum)

**Tokenizacao de commodity fisica (soja, milho, cafe como meio de pagamento)**:
- Recomendacao primaria: Solana
- Justificativa: alto volume de transacoes de pequeno valor exige custo unitario minimo e confirmacao rapida
- Alternativa viavel: XRPL (funcionalidade nativa de tokenizacao, DEX integrada)

**Operacao cross-border (exportacao de commodity, pagamento internacional, trade finance)**:
- Recomendacao primaria: XRPL
- Justificativa: a Ripple possui a maior rede de parcerias com instituicoes financeiras para pagamentos internacionais (RippleNet, com mais de 300 instituicoes em 55 paises); o XRPL suporta nativamente multi-currency e liquidacao cross-border
- Alternativa viavel: Ethereum/Arbitrum (se a operacao exige integracao com DeFi internacional)

**FIAGRO tokenizado ou fundo de credito agro com waterfall complexo**:
- Recomendacao primaria: Ethereum L2 (Polygon ou Arbitrum)
- Justificativa: smart contracts Turing-completos necessarios para automacao de waterfall, gatilhos de credit enhancement, oraculos e compliance on-chain
- Nao recomendado: XRPL (programabilidade insuficiente para operacoes complexas)

### Tabela comparativa consolidada

| Criterio | Ethereum L1 | Polygon | Arbitrum | Base | Solana | XRPL |
|----------|------------|---------|----------|------|--------|------|
| TPS | 15-30 | 7.000+ | 4.000+ | 4.000+ | 3.000-5.000 | 1.500 |
| Custo/tx | US$ 1-200 | US$ 0,001-0,05 | US$ 0,01-0,10 | US$ 0,001 | US$ 0,00025 | US$ 0,0002 |
| Confirmacao | 12 seg | 2 seg | <1 seg | 2 seg | 0,4 seg | 3-5 seg |
| Smart contracts | Turing-completo | Turing-completo | Turing-completo | Turing-completo | Turing-completo | Limitado |
| Ecossistema DeFi | Maximo | Alto | Muito alto | Crescente | Alto | Baixo |
| RWA deployado | US$ 5B+ | US$ 2B+ | US$ 500M+ | US$ 300M+ | US$ 500M | US$ 200M+ |
| Security tokens | ERC-3643 maduro | ERC-3643 maduro | ERC-3643 maduro | ERC-3643 maduro | Token-2022 | Trust lines |
| Auditores disponiveis | Muitos | Muitos | Muitos | Muitos | Poucos | Poucos |
| Risco de outage | Muito baixo | Baixo | Baixo | Baixo | Medio | Muito baixo |

### Estrategia multi-chain: quando usar mais de uma rede

Uma tendencia crescente no mercado de RWA e a estrategia multi-chain — deployar a mesma operacao em multiplas blockchains para maximizar alcance e liquidez. Protocolos como Centrifuge, Ondo Finance e BlackRock BUIDL ja operam em multiplas redes simultaneamente, utilizando bridges (pontes entre blockchains) e protocolos de interoperabilidade como Chainlink CCIP (Cross-Chain Interoperability Protocol) e LayerZero.

Para uma operacao agro de grande porte — por exemplo, um CRA de R$ 100 milhoes com distribuicao a investidores brasileiros e internacionais — a estrategia multi-chain poderia ser: emitir o token primario na Polygon (ecossistema maduro de security tokens, conformidade regulatoria via ERC-3643), criar uma versao wrapped do token na Solana (para microtransacoes e pagamentos na cadeia produtiva) e disponibilizar liquidez na Arbitrum (para integracao com DeFi e mercado secundario).

O custo adicional de uma estrategia multi-chain e significativo: exige deployment em multiplas redes, auditoria de bridges, monitoramento multi-chain e complexidade operacional. Para emissoes abaixo de R$ 50 milhoes, a recomendacao pratica e escolher uma unica rede e concentrar esforcos.

- **Exemplo**: O protocolo Centrifuge, especializado em tokenizacao de credito privado, opera pools de credito simultaneamente em Ethereum e Arbitrum, utilizando o Chainlink CCIP para transferencia de tokens entre redes. Um pool de trade finance agro com lastro em recebiveis de exportacao de cafe do Brasil foi deployado em Ethereum (para acesso a investidores institucionais via Aave) e em Arbitrum (para negociacao secundaria com custos reduzidos). A estrategia multi-chain aumentou a base de investidores em 40% comparada a emissoes single-chain anteriores, mas o custo de desenvolvimento e manutencao aumentou em 60%.

---

## Conclusao

Nesta aula, expandimos o repertorio de infraestrutura blockchain para alem do ecossistema Ethereum. Solana oferece performance imbativel — 3.000+ TPS, custo de US$ 0,00025 por transacao e confirmacao em 0,4 segundo — tornando-a ideal para microtransacoes na cadeia produtiva agro, pagamentos a produtores e tokenizacao de commodities fisicas. O XRPL protagonizou o maior caso real de tokenizacao agro no Brasil, com US$ 130 milhoes em CRA tokenizado via parceria MB/Ripple, demonstrando que redes especializadas em pagamentos podem ser infraestrutura viavel para distribuicao de titulos de credito agro. Contudo, ambas as redes possuem limitacoes criticas: Solana enfrenta riscos de estabilidade e ecossistema de security tokens imaturo; o XRPL carece de programabilidade para operacoes complexas e ecossistema DeFi relevante. A escolha da rede e uma decisao estrategica que depende do tipo de operacao, e o profissional de agro estruturado deve dominar as vantagens e limitacoes de cada uma para fazer a recomendacao correta.

---

## Licao de Casa

1. Pesquise a operacao de tokenizacao de CRA realizada pelo Mercado Bitcoin em parceria com a Ripple. Identifique o volume total tokenizado, o tipo de lastro (quais culturas agro), o ticket minimo oferecido ao investidor e o arcabouco regulatorio utilizado (CVM 88, CVM 160 ou outro). Elabore um resumo de 20 linhas com analise critica.
2. Calcule o custo total de gas para uma operacao de barter tokenizada envolvendo 800 produtores, com 4 entregas de insumo e 2 entregas de grao por produtor (total de 4.800 transacoes), comparando Solana, Polygon e Ethereum L1. Apresente os resultados em tabela e justifique qual rede voce escolheria.
3. Uma cooperativa de cafe com 5.000 cooperados deseja implementar pagamentos instantaneos via stablecoin aos produtores na entrega de cafe. Estime o volume diario de transacoes (considerando que cada cooperado entrega cafe em media 3 vezes por semana durante a safra de 4 meses), calcule o custo mensal de gas em Solana e Polygon, e recomende a rede mais adequada com justificativa tecnica e economica.

---

## Questionario

**1. Qual e a principal vantagem tecnica de Solana sobre Ethereum e suas Layer-2s para operacoes agro de alto volume de microtransacoes?**

a) Solana possui smart contracts mais seguros que Ethereum, eliminando a necessidade de auditoria
b) Solana processa 3.000-5.000 TPS com custo de US$ 0,00025 por transacao e confirmacao em 0,4 segundo, viabilizando milhares de microtransacoes diarias com custo total desprezivel
c) Solana e a unica blockchain aprovada pelo Banco Central do Brasil para operacoes agro
d) Solana possui o maior ecossistema DeFi do mundo, superando Ethereum em Total Value Locked

**Resposta: b**

**2. Na operacao de tokenizacao de CRA realizada pelo Mercado Bitcoin em parceria com a Ripple, qual foi o volume aproximado tokenizado e qual infraestrutura blockchain foi utilizada?**

a) US$ 10 milhoes no Ethereum Layer-1
b) US$ 130 milhoes no XRP Ledger (XRPL)
c) US$ 500 milhoes na Solana
d) US$ 50 milhoes na Polygon

**Resposta: b**

**3. Uma fintech brasileira deseja tokenizar operacoes de barter (troca de insumos por graos) envolvendo 500 produtores com 5.000 a 10.000 transacoes mensais. Considerando as redes analisadas, qual e a recomendacao mais adequada e por que?**

a) Ethereum L1, pois oferece a maior seguranca para transacoes de alto valor
b) XRPL, pois possui smart contracts Turing-completos ideais para automacao de barter
c) Solana, pois o custo total de 10.000 transacoes seria de US$ 2,50 (versus US$ 50-500 na Polygon e US$ 500.000+ no Ethereum L1), viabilizando economicamente a operacao
d) Base, pois e a unica rede com integracao nativa com sistemas de barter agro

**Resposta: c**

**4. Qual e a principal limitacao do XRPL que impede sua adocao para operacoes complexas como FIAGRO tokenizado com waterfall de pagamentos e multiplas tranches?**

a) O XRPL nao suporta a emissao de tokens de nenhum tipo
b) O XRPL possui custo de transacao excessivo para operacoes financeiras
c) O XRPL nao possui smart contracts Turing-completos, limitando a automacao de waterfall, gatilhos de credit enhancement e integracao com oraculos
d) O XRPL e uma rede privada que nao permite acesso de investidores de varejo

**Resposta: c**

**5. Na matriz de decisao apresentada na aula, qual e a recomendacao de rede para uma operacao de exportacao de commodity com pagamento internacional (trade finance cross-border)?**

a) Ethereum L1, pois e a unica rede aceita por bancos internacionais
b) Solana, pois possui a maior velocidade de transacao
c) XRPL, pois a Ripple possui a maior rede de parcerias com instituicoes financeiras para pagamentos internacionais (RippleNet, com mais de 300 instituicoes em 55 paises)
d) Polygon, pois e a unica rede com suporte a multiplas moedas

**Resposta: c**

---

## Proxima Aula

Na proxima aula (6.3), vamos analisar protocolos especializados e blockchains permissioned — Centrifuge para private credit, Hedera para operacoes enterprise, e Avalanche subnets para redes customizadas. Voce vai entender quando uma blockchain permissioned e superior a uma publica, e vamos encerrar com um exercicio pratico decisivo: para a emissao de R$ 50 milhoes em tokens de soja futura, escolher a stack completa de infraestrutura. Ate la!
