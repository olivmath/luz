# Aula 6.1: Briefing e Design de Arquitetura — Pool de CPRs de Soja Tokenizado como CRA

## Abertura

Bem-vindo a aula 6.1 do modulo final de todo o programa! Nesta aula, voce vai receber o briefing completo do projeto final: a tokenizacao end-to-end de uma operacao agro real. O case e um pool de CPRs de soja emitidas por 20 produtores, totalizando R$ 50 milhoes, que sera transformado em um CRA com 3 tranches (senior, mezanino e subordinada), destinado a investidores brasileiros e europeus, exigindo conformidade simultanea com CVM e MiCA. Voce tomara as decisoes de arquitetura — blockchain, padrao de token, vault, oraculos, bridge e compliance — e documentara tudo em diagramas e estimativas de custos.

### Programa da aula:

1. Briefing do case: pool de CPRs de soja e estruturacao do CRA (introducao)
2. Decisoes de arquitetura: chain, token, vault, oraculos, bridge e compliance (base e aprofundamento)
3. Documentacao: diagramas de arquitetura e estimativa de custos (conceito principal da aula)

---

## 1. Briefing do case: pool de CPRs de soja e estruturacao do CRA

### Contexto da operacao

O projeto final simula uma operacao real de credito agro estruturado com tokenizacao. O cenario e o seguinte: uma securitizadora brasileira agrega CPRs financeiras de 20 produtores de soja localizados em Mato Grosso, Goias e Mato Grosso do Sul. Cada produtor emitiu CPRs no valor medio de R$ 2,5 milhoes, com vencimento em 12 meses, lastreadas na safra 2025/2026 e garantidas por penhor de safra em primeiro grau e alienacao fiduciaria de imovel rural. O valor total do pool e de R$ 50 milhoes.

A securitizadora estrutura um CRA (Certificado de Recebiveis do Agronegocio) lastreado nesse pool de CPRs, dividido em tres tranches:

- **Tranche Senior (70% — R$ 35 milhoes)**: rating alvo AA, cupom CDI + 1,0% ao ano, prioridade absoluta no waterfall de pagamentos.
- **Tranche Mezanino (20% — R$ 10 milhoes)**: rating alvo BBB, cupom CDI + 3,5% ao ano, absorve perdas apos esgotamento da subordinada.
- **Tranche Subordinada (10% — R$ 5 milhoes)**: sem rating, retorno residual, first loss — absorve as primeiras perdas do pool.

A subordinacao total e de 30% (mezanino + subordinada), oferecendo protecao robusta a tranche senior. O ICSD (Indice de Cobertura do Servico da Divida) minimo projetado e de 1,25x.

- **Exemplo**: Em operacoes reais, securitizadoras como Octante e Isec ja emitiram CRAs com estruturas similares. Um CRA da Octante de R$ 60 milhoes, lastreado em CPRs de soja de produtores do Cerrado, utilizou subordinacao de 25% e obteve rating AA pela Fitch para a tranche senior. O diferencial do nosso projeto e a camada de tokenizacao e a distribuicao cross-border.

### Publico investidor: Brasil e Europa (CVM + MiCA)

O CRA tokenizado sera distribuido simultaneamente para investidores brasileiros (sob regulacao da CVM) e investidores europeus (sob regulacao MiCA — Markets in Crypto-Assets Regulation, em vigor desde junho de 2024). Essa decisao de distribuicao cross-border adiciona complexidade significativa ao projeto, mas reflete a tendencia real do mercado.

Para investidores brasileiros, o CRA deve ser registrado como valor mobiliario perante a CVM, seguindo a Resolucao CVM 160 (ofertas publicas) ou a Resolucao CVM 88 (crowdfunding). Investidores pessoa fisica que adquirirem CRA com lastro exclusivamente agropecuario tem isencao de Imposto de Renda sobre os rendimentos (Lei 11.033/2004).

Para investidores europeus, o token deve ser classificado como "Asset-Referenced Token" ou "Security Token" sob MiCA, exigindo: whitepaper regulatorio, registro junto a autoridade competente do pais de emissao (por exemplo, BaFin na Alemanha ou AMF na Franca), e conformidade com regras de AML/KYC europeias (AMLD6). A classificacao exata depende da estrutura do token — se ele distribui rendimentos periodicos e representa direitos sobre recebiveis, sera tratado como security token e ficara sujeito tambem as regras de MiFID II.

- **Exemplo**: A Securitize, plataforma americana de tokenizacao de securities, ja oferece tokens de credito estruturado para investidores europeus e americanos simultaneamente, utilizando estruturas de compliance dual-jurisdiction. No Brasil, a Liqi realizou emissoes de tokens de recebiveis agro sob Resolucao CVM 88, mas ainda sem distribuicao cross-border formal para Europa. O nosso projeto e, portanto, de fronteira — algo que o mercado esta construindo agora.

### Requisitos funcionais do sistema

O sistema tokenizado deve implementar as seguintes funcionalidades:

1. **Emissao de tokens**: representar cada tranche como uma classe de token distinta, com regras de transferencia especificas.
2. **Depositos assincronos**: permitir que investidores solicitem deposito e aguardem aprovacao de compliance antes de receberem tokens.
3. **Waterfall de pagamentos**: distribuir os fluxos de caixa do pool de CPRs respeitando a prioridade das tranches (senior > mezanino > subordinada).
4. **Oraculos**: alimentar on-chain o preco da soja, o status de pagamento das CPRs e o NAV (Net Asset Value) de cada tranche.
5. **Bridge cross-chain**: permitir que tokens emitidos em uma chain sejam acessiveis em outra, para atender investidores europeus que operam em redes diferentes.
6. **Compliance on-chain**: KYC/AML automatizado via identity registry, com restricoes de transferencia por jurisdicao.

- **Exemplo**: O protocolo Centrifuge, que tokeniza credito estruturado real na blockchain, utiliza uma arquitetura semelhante: tokens ERC-20 para cada tranche, um contrato de pool que gerencia o waterfall, oraculos para NAV, e integracoes com provedores de KYC como Shufti Pro e Sumsub. O nosso projeto adapta essa logica para o contexto agro brasileiro.

---

## 2. Decisoes de arquitetura: chain, token, vault, oraculos, bridge e compliance

### Escolha da blockchain: Ethereum L2 vs. alternativas

A escolha da blockchain e a primeira decisao critica. Precisamos de uma rede que ofereca: seguranca, custo acessivel, ecossistema DeFi maduro, e compatibilidade com provedores de compliance e oraculos. As opcoes principais sao:

**Opcao A — Ethereum Mainnet**: maxima seguranca e descentralizacao, mas custo de gas elevado (R$ 20 a R$ 200 por transacao dependendo da congestao). Adequado para emissoes de alto valor, mas inviavel para operacoes frequentes de waterfall.

**Opcao B — Ethereum L2 (Arbitrum, Optimism, Base ou Polygon zkEVM)**: herda a seguranca do Ethereum via provas (fraud proofs ou validity proofs), com custo de gas reduzido a R$ 0,10 a R$ 2,00. Ecossistema DeFi robusto. Compativel com todos os padroes ERC. Esta e a opcao recomendada para o projeto.

**Opcao C — Blockchain permissionada (Hyperledger Besu, Drex)**: controle total sobre participantes, custo zero de gas, mas sem acesso ao ecossistema DeFi publico e sem mercado secundario aberto. Adequado para MVPs internos, mas contrario ao objetivo de liquidez e acesso global.

**Decisao do projeto**: Ethereum L2 (Polygon zkEVM ou Base) para os contratos core, com bridge para Ethereum Mainnet para investidores que preferem custodia em L1.

- **Exemplo**: O protocolo Backed Finance, que tokeniza titulos de renda fixa europeus como security tokens, opera em Polygon e Ethereum simultaneamente. A MakerDAO, que aceita RWA como colateral, opera em Ethereum Mainnet mas utiliza vaults em L2 para reduzir custos. A Centrifuge migrou de sua propria parachain para Ethereum + Base em 2024, reconhecendo que o ecossistema EVM e o padrao de mercado para RWA.

### Padrao de token: ERC-3643 para compliance regulatorio

O padrao de token define como os tokens se comportam: quem pode transferi-los, como sao emitidos, como se integram com o ecossistema DeFi. Para security tokens regulados, as opcoes principais sao:

**ERC-3643 (T-REX)**: padrao especifico para security tokens com compliance on-chain. Inclui Identity Registry (registro de identidade dos investidores), Compliance Contract (regras de transferencia por jurisdicao, limites de concentracao, restricoes de lock-up), e modularidade. E o padrao mais adotado para tokenizacao de titulos regulados, com mais de US$ 28 bilhoes em ativos tokenizados.

**ERC-7518**: padrao mais recente, proposto para ativos regulados com funcionalidades avancadas como restricoes granulares por jurisdicao e integracao nativa com provedores de identidade descentralizada (DID). Ainda em fase de draft no EIP.

**ERC-1400**: padrao de security token anterior, com particoes (tranches). Menos adotado que o ERC-3643 e com ecossistema de ferramentas mais limitado.

**Decisao do projeto**: ERC-3643 para as tres tranches do CRA. Cada tranche sera um token ERC-3643 distinto (SeniorToken, MezzanineToken, SubordinatedToken), com Identity Registry compartilhado e Compliance Contracts especificos por jurisdicao (Brasil e Europa).

- **Exemplo**: A plataforma Tokeny, criadora do ERC-3643, ja tokenizou divida estruturada europeia utilizando o padrao. Cada tranche e um token separado com regras de compliance distintas: a tranche senior pode ser vendida apenas para investidores qualificados, enquanto a tranche subordinada e restrita a investidores profissionais. O Identity Registry garante que apenas carteiras verificadas via KYC possam receber tokens.

### Vault ERC-7540: depositos assincronos para investidores regulados

O padrao ERC-4626 (Tokenized Vault) e amplamente usado em DeFi para representar depositos em pools de rendimento. Porem, ele assume depositos e resgates sincronos — o investidor deposita e recebe shares imediatamente. No contexto de security tokens regulados, isso nao funciona: o investidor precisa passar por KYC antes de receber tokens, e o resgate pode exigir periodo de lock-up ou aprovacao da securitizadora.

O ERC-7540 estende o ERC-4626 com suporte a depositos e resgates assincronos. O fluxo e:

1. Investidor solicita deposito de R$ 100.000 em stablecoin (DREX, USDC ou BRZ).
2. O vault registra a solicitacao como "pending".
3. O sistema de compliance verifica KYC/AML do investidor e aprova (ou rejeita) a solicitacao.
4. Apos aprovacao, o vault executa o deposito e emite os tokens da tranche correspondente.
5. Para resgate, o processo inverso: solicitacao > verificacao > execucao.

**Decisao do projeto**: um contrato Vault ERC-7540 para cada tranche, integrado ao Identity Registry do ERC-3643.

- **Exemplo**: O protocolo Centrifuge utiliza um vault assincrono similar (embora anterior ao ERC-7540) para seus pools de credito estruturado. Investidores solicitam deposito no pool, aguardam a "epoch" (periodo de calculo de NAV), e recebem tokens somente apos a execucao. Esse modelo e essencial para ativos iliquidos como recebiveis agro, onde o NAV precisa ser calculado antes da emissao de novos tokens.

### Oraculos: price feed, proof of reserve e NAV

O sistema precisa de tres tipos de oraculos:

**Price Feed (preco da soja)**: alimenta o preco spot e futuro da soja para calculo de garantias e triggers de credit enhancement. A fonte pode ser Chainlink (feed SOYBEAN/USD) combinada com dados do CEPEA/ESALQ (preco domestico) via oraculo customizado. O basis (diferenca entre preco internacional e preco local) deve ser ajustado no smart contract.

**Proof of Reserve (prova de lastro)**: confirma on-chain que o pool de CPRs continua ativo e adimplente. Pode ser implementado via Chainlink Proof of Reserve com attestation periodica do agente fiduciario ou da registradora (como CERC ou B3). A cada mes, o agente fiduciario publica on-chain o status de cada CPR: adimplente, em atraso ou em default.

**NAV Oracle (valor patrimonial liquido)**: calcula o NAV de cada tranche com base no fluxo de caixa projetado do pool, descontando inadimplencias e custos. O NAV determina o preco justo do token de cada tranche e e essencial para o funcionamento do vault ERC-7540.

**Decisao do projeto**: Chainlink para price feed (soja), oraculo customizado integrado a registradora para Proof of Reserve, e contrato NAV on-chain que calcula o valor de cada tranche diariamente.

- **Exemplo**: O protocolo Maple Finance utiliza oraculos de NAV para seus pools de credito corporativo, com atualizacao diaria baseada em dados fornecidos pelo pool delegate (equivalente ao agente fiduciario no mercado brasileiro). A Centrifuge publica NAV on-chain a cada epoch, permitindo que investidores vejam o valor atualizado de suas posicoes antes de solicitar deposito ou resgate.

### Bridge cross-chain e compliance dual-jurisdiction

Para atender investidores europeus, o sistema precisa de um mecanismo de bridge que permita acesso cross-chain sem quebrar as regras de compliance. As opcoes sao:

**Bridge nativo com compliance**: implementar um bridge customizado que verifica o Identity Registry antes de liberar tokens na chain de destino. O investidor europeu faz KYC na plataforma, recebe aprovacao no Identity Registry, e pode receber tokens tanto na L2 principal quanto em outra rede (por exemplo, Ethereum Mainnet ou outra L2 com presenca europeia).

**Wrapped tokens com compliance**: emitir wrapped versions dos tokens de tranche em outra chain, com o contrato wrapper verificando o Identity Registry antes de mintar.

**Decisao do projeto**: bridge customizado com verificacao de compliance, operando entre a L2 principal e Ethereum Mainnet, utilizando o padrao de mensageria do LayerZero ou Axelar com modulo de verificacao de identidade.

Para compliance dual-jurisdiction, o Compliance Contract do ERC-3643 sera configurado com dois modulos:

- **Modulo CVM**: verifica se o investidor e residente fiscal brasileiro, se e qualificado ou nao qualificado (para definir limites de investimento), e se a operacao esta dentro dos parametros da Resolucao CVM 160 ou 88.
- **Modulo MiCA**: verifica se o investidor europeu passou por KYC conforme AMLD6, se a carteira esta em jurisdicao permitida (exclui paises sancionados), e se o whitepaper regulatorio foi aceito.

- **Exemplo**: A Securitize implementou compliance multi-jurisdicao em sua plataforma, onde um mesmo token de divida americana pode ser negociado por investidores dos EUA (sob Regulation D/S da SEC) e da Europa (sob MiFID II). O Identity Registry mantem registros separados por jurisdicao, e o Compliance Contract aplica regras diferentes dependendo da origem do investidor.

---

## 3. Documentacao: diagramas de arquitetura e estimativa de custos

### Diagrama de arquitetura do sistema

O diagrama de arquitetura do projeto final deve representar cinco camadas:

```
=============================================================
                CAMADA 1: ATIVOS OFF-CHAIN
=============================================================
[20 Produtores] --> [CPRs Financeiras] --> [Pool R$ 50M]
       |                                        |
[Penhor Safra]                          [Cessao Fiduciaria]
[Alienacao Fiduciaria Imovel]           [para Securitizadora]
       |                                        |
[Seguro Rural]                          [Registro CERC/B3]

=============================================================
                CAMADA 2: ESTRUTURACAO (SECURITIZADORA)
=============================================================
[Pool CPRs R$ 50M] --> [CRA - Patrimonio Separado]
       |
       +--> [Senior  70% = R$ 35M | CDI+1.0% | Rating AA]
       +--> [Mezanino 20% = R$ 10M | CDI+3.5% | Rating BBB]
       +--> [Subordinada 10% = R$ 5M | Residual | Sem Rating]
       |
[Agente Fiduciario] -- [Waterfall] -- [Credit Enhancement]

=============================================================
                CAMADA 3: SMART CONTRACTS (ON-CHAIN)
=============================================================
[Identity Registry (ERC-3643)]
       |
       +--> [SeniorToken (ERC-3643)]
       +--> [MezzanineToken (ERC-3643)]
       +--> [SubordinatedToken (ERC-3643)]
       |
[Compliance Contract]
       +--> [Modulo CVM (Brasil)]
       +--> [Modulo MiCA (Europa)]
       |
[Vault Senior (ERC-7540)] -- [Vault Mezz] -- [Vault Sub]
       |
[WaterfallDistributor] -- [Recebe pagamentos] -- [Distribui]
       |
[NAV Calculator] -- [Calcula valor diario por tranche]

=============================================================
                CAMADA 4: ORACULOS E BRIDGES
=============================================================
[Chainlink Price Feed (SOJA/USD)]
[Proof of Reserve Oracle (CERC/B3)]
[NAV Oracle (on-chain)]
       |
[Bridge LayerZero/Axelar] -- [L2 <-> Ethereum Mainnet]
       |
[Compliance Verificator no Bridge]

=============================================================
                CAMADA 5: INTERFACE E INTEGRACAO
=============================================================
[Frontend Web App] -- [Investidor BR e EU]
[API KYC (Sumsub/Shufti Pro)]
[API Registradora (CERC)]
[API Agente Fiduciario]
[Dashboard de Monitoramento]
```

### Estimativa de custos de desenvolvimento e operacao

A estimativa de custos para o projeto completo, considerando desenvolvimento, auditoria, deploy e operacao no primeiro ano:

**Desenvolvimento de Smart Contracts:**

| Componente | Estimativa |
|---|---|
| Tokens ERC-3643 (3 tranches) | R$ 80.000 - R$ 120.000 |
| Identity Registry + Compliance | R$ 60.000 - R$ 90.000 |
| Vaults ERC-7540 (3 tranches) | R$ 50.000 - R$ 80.000 |
| WaterfallDistributor | R$ 40.000 - R$ 60.000 |
| NAV Calculator on-chain | R$ 30.000 - R$ 50.000 |
| Integracao com oraculos | R$ 30.000 - R$ 50.000 |
| Bridge customizado | R$ 60.000 - R$ 100.000 |
| **Subtotal desenvolvimento** | **R$ 350.000 - R$ 550.000** |

**Auditoria de Seguranca:**

| Item | Estimativa |
|---|---|
| Auditoria por firma especializada (OpenZeppelin, Trail of Bits, Consensys Diligence) | R$ 200.000 - R$ 400.000 |
| Bug bounty program (3 meses) | R$ 50.000 - R$ 100.000 |
| **Subtotal auditoria** | **R$ 250.000 - R$ 500.000** |

**Custos operacionais (primeiro ano):**

| Item | Estimativa |
|---|---|
| Gas fees (L2, estimativa 1.000 transacoes/mes) | R$ 12.000 - R$ 24.000 |
| Chainlink oracle subscriptions | R$ 60.000 - R$ 120.000 |
| KYC provider (Sumsub, por verificacao) | R$ 25.000 - R$ 50.000 |
| Infraestrutura (servidores, APIs, monitoramento) | R$ 48.000 - R$ 96.000 |
| **Subtotal operacao** | **R$ 145.000 - R$ 290.000** |

**Custos regulatorios e juridicos:**

| Item | Estimativa |
|---|---|
| Registro CVM (taxa + assessoria juridica) | R$ 100.000 - R$ 200.000 |
| Whitepaper MiCA + registro na Europa | R$ 150.000 - R$ 300.000 |
| Parecer juridico dual-jurisdiction | R$ 80.000 - R$ 150.000 |
| **Subtotal regulatorio** | **R$ 330.000 - R$ 650.000** |

**TOTAL ESTIMADO: R$ 1.075.000 - R$ 1.990.000**

Esse custo representa entre 2,1% e 4,0% do valor da emissao de R$ 50 milhoes, comparavel ao custo de estruturacao de um CRA tradicional (2% a 4%). A diferenca e que, na operacao tokenizada, boa parte desse custo e investimento em infraestrutura reutilizavel: os smart contracts podem ser reaproveitados para emissoes futuras, reduzindo drasticamente o custo marginal de novas operacoes.

- **Exemplo**: A Centrifuge reportou que, apos o investimento inicial de desenvolvimento da plataforma, o custo marginal de lançar um novo pool de credito caiu para menos de US$ 10.000, comparado a US$ 50.000-100.000 da primeira emissao. Para securitizadoras que pretendem realizar multiplas emissoes tokenizadas, o investimento inicial se paga rapidamente.

### Cronograma macro do projeto

| Fase | Duracao | Entregas |
|---|---|---|
| Fase 1: Design e documentacao | 2 semanas | Diagramas, especificacoes, decisoes de arquitetura |
| Fase 2: Smart contracts core | 4 semanas | Tokens, vaults, waterfall, oraculos |
| Fase 3: Testes e auditoria | 3 semanas | Testes unitarios, integracao, auditoria externa |
| Fase 4: Integracao off-chain | 2 semanas | KYC, registradora, agente fiduciario |
| Fase 5: Deploy e simulacao | 1 semana | Deploy testnet, simulacao de lifecycle |
| Fase 6: Apresentacao | 1 semana | Pitch para comite de investimento |
| **Total** | **13 semanas** | |

---

## Conclusao

Nesta aula, recebemos o briefing completo do projeto final: um pool de CPRs de soja de R$ 50 milhoes, estruturado como CRA com 3 tranches, tokenizado para distribuicao a investidores brasileiros e europeus. Tomamos as decisoes de arquitetura fundamentais — Ethereum L2 como blockchain, ERC-3643 para os tokens de tranche, ERC-7540 para os vaults de deposito assincrono, Chainlink e oraculos customizados para dados de mercado e prova de lastro, bridge com compliance para acesso cross-chain, e modulos de compliance dual-jurisdiction para CVM e MiCA. Documentamos a arquitetura em diagramas de cinco camadas e estimamos o custo total do projeto entre R$ 1 milhao e R$ 2 milhoes, comparavel ao custo de uma emissao tradicional. Na proxima aula, vamos implementar os smart contracts core dessa arquitetura.

---

## Licao de Casa

1. Redesenhe o diagrama de arquitetura do projeto adicionando uma camada de "Contingencia e Recuperacao": o que acontece se o oraculo de Proof of Reserve falhar? E se a bridge for comprometida? Documente pelo menos tres cenarios de falha e seus planos de mitigacao.
2. Pesquise o regulamento MiCA (Regulation EU 2023/1114) e identifique os requisitos especificos para emissao de security tokens com distribuicao de rendimentos periodicos. Compare com os requisitos da CVM para oferta publica de CRA (Resolucao CVM 160) e elabore um quadro comparativo de pelo menos cinco criterios.
3. Recalcule a estimativa de custos assumindo que o projeto sera executado em Ethereum Mainnet (sem L2). Estime o impacto no custo de gas para 1.000 transacoes mensais com gas price medio de 30 gwei e compare com o cenario L2. Justifique se a decisao de usar L2 se mantem ou nao.

---

## Questionario

**1. Qual e a estrutura de tranches do CRA no projeto final e qual e a funcao da tranche subordinada?**

a) Duas tranches (senior e junior) com 50% cada, onde a junior recebe pagamentos primeiro
b) Tres tranches (senior 70%, mezanino 20%, subordinada 10%), onde a subordinada absorve as primeiras perdas do pool (first loss), protegendo as demais
c) Uma unica tranche de R$ 50 milhoes sem subordinacao, pois a tokenizacao elimina o risco de credito
d) Quatro tranches com pesos iguais de 25%, sem hierarquia de pagamento

**Resposta: b**

**2. Por que o padrao ERC-3643 foi escolhido em vez do ERC-20 padrao para os tokens de tranche?**

a) Porque o ERC-20 nao funciona em redes Ethereum L2
b) Porque o ERC-3643 inclui Identity Registry e Compliance Contract, permitindo restricoes de transferencia por jurisdicao e verificacao de KYC on-chain, essenciais para security tokens regulados
c) Porque o ERC-20 nao permite fracionamento de tokens
d) Porque o ERC-3643 tem custo de gas menor que o ERC-20

**Resposta: b**

**3. Qual e a vantagem do ERC-7540 sobre o ERC-4626 para o vault de deposito neste projeto?**

a) O ERC-7540 permite depositos maiores que o ERC-4626
b) O ERC-7540 suporta depositos e resgates assincronos, permitindo verificacao de KYC/AML antes da emissao de tokens, enquanto o ERC-4626 assume operacoes sincronas
c) O ERC-7540 nao requer smart contracts, reduzindo custos
d) O ERC-7540 funciona apenas em blockchains permissionadas

**Resposta: b**

**4. No diagrama de arquitetura, quais sao os tres tipos de oraculos necessarios para o funcionamento do sistema?**

a) Oraculo de temperatura, oraculo de umidade e oraculo de vento
b) Price feed (preco da soja), Proof of Reserve (status das CPRs do lastro) e NAV Oracle (valor patrimonial de cada tranche)
c) Oraculo de Bitcoin, oraculo de Ethereum e oraculo de stablecoin
d) Oraculo de rating, oraculo de spread e oraculo de CDI

**Resposta: b**

**5. Qual e o custo total estimado do projeto e como ele se compara ao custo de estruturacao de um CRA tradicional?**

a) R$ 100.000 a R$ 200.000, representando 10x menos que um CRA tradicional
b) R$ 10 milhoes a R$ 20 milhoes, tornando a tokenizacao inviavel economicamente
c) R$ 1 milhao a R$ 2 milhoes (2% a 4% do valor da emissao), comparavel ao custo de um CRA tradicional, porem com infraestrutura reutilizavel para emissoes futuras
d) Custo zero, pois a blockchain elimina todos os custos de intermediacao

**Resposta: c**

---

## Proxima Aula

Na proxima aula (6.2), vamos implementar os smart contracts core do projeto: os tokens ERC-3643 para as tranches, o vault ERC-7540 para depositos assincronos, o contrato de waterfall com subordinacao e os oraculos de price feed, proof of reserve e NAV. Voce vai escrever codigo Solidity completo e executar testes unitarios e de integracao. Ate la!
