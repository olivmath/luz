# Aula 4.3: Risco de Credito e Contraparte na Cadeia

## Abertura

Bem-vindo a aula 4.3 do Modulo 4 — Gestao de Risco no Agro Estruturado. Nas aulas anteriores, tratamos do risco climatico e do risco de preco — dois fatores exogenos que afetam a capacidade de pagamento do produtor rural. Nesta aula, vamos adentrar o risco que esta no cerne de toda operacao financeira: o risco de credito e de contraparte. Enquanto o clima e o preco sao variaveis de mercado, o risco de credito envolve a avaliacao direta do devedor — sua capacidade e disposicao de honrar compromissos financeiros. No agronegocio, essa analise e particularmente complexa porque a cadeia produtiva e longa, interconectada e sujeita a efeitos cascata. Um produtor pode ser excelente, mas se a trading intermediaria que compra sua producao quebrar, o fluxo de pagamento do CRA que depende dessa cadeia e interrompido. Nesta aula, vamos dominar as ferramentas e metricas para avaliar esse risco com profundidade.

### Programa da aula:

1. Risco do produtor e contraparte (capacidade de pagamento, historico, devedor intermediario)
2. Risco de cadeia e efeito cascata (elo que quebra, impacto montante e jusante)
3. Analise de credito agro (metricas: divida/producao, produtividade historica, cobertura de garantias, concentracao de devedores)

---

## 1. Risco do Produtor e Contraparte

### Capacidade de pagamento e historico crediticio do produtor

A analise de risco de credito no agronegocio comeca pelo produtor rural — o emissor da CPR, o devedor primario da cadeia. Diferentemente de empresas industriais ou de servicos, o produtor rural tem um perfil de fluxo de caixa marcadamente sazonal e concentrado: a receita entra em poucos meses do ano (durante e apos a colheita), enquanto os custos se distribuem ao longo de todo o ciclo produtivo. Essa concentracao temporal cria vulnerabilidade: se algo der errado no momento da comercializacao — queda de preco, problema logistico, atraso na colheita —, o produtor pode nao gerar caixa suficiente para honrar suas dividas no vencimento.

A avaliacao da capacidade de pagamento do produtor envolve tres pilares fundamentais. O primeiro e a analise patrimonial: qual o valor dos ativos do produtor (terras, maquinas, estoques, benfeitorias) em relacao ao seu endividamento total? Produtores com relacao patrimonio/divida superior a 3:1 sao considerados de menor risco, pois possuem "colchao" patrimonial para absorver perdas de safra. O segundo pilar e a analise de geracidade caixa operacional: considerando a produtividade historica da fazenda, os custos de producao e os precos esperados, o produtor gera receita liquida suficiente para cobrir todas as suas obrigacoes financeiras (principal + juros de todos os credores) e ainda manter capital de giro? O terceiro pilar e o historico crediticio: o produtor tem registro de inadimplencia em sistemas como Serasa, SCPC, SCR (Sistema de Informacoes de Credito do Banco Central) ou nos registros de CPRs inadimplidas na B3?

No Brasil, a consulta ao SCR e uma ferramenta essencial para o estruturador de credito agro. O SCR registra todas as operacoes de credito do produtor no sistema financeiro nacional, permitindo verificar o endividamento total, a pontualidade dos pagamentos e a classificacao de risco atribuida por cada instituicao financeira. Produtores classificados como "AA" a "C" sao considerados de risco normal; classificacoes "D" a "H" indicam atraso ou prejuizo. Um produtor com 80% de suas operacoes classificadas como "A" nos ultimos cinco anos transmite confianca; um produtor com classificacao "E" em multiplas instituicoes acende um alerta critico.

- **Exemplo**: Uma originadora de credito agro esta avaliando uma CPR financeira de R$ 3 milhoes proposta por um produtor de algodao no oeste da Bahia. A fazenda possui 2.500 hectares, avaliados em R$ 60 milhoes, e o produtor tem endividamento total de R$ 15 milhoes. A relacao patrimonio/divida e de 4:1 — confortavel. A produtividade media dos ultimos cinco anos e de 280 arrobas por hectare, e o custo de producao e de R$ 8.500 por hectare. A receita esperada a precos correntes e de R$ 14.000 por hectare, gerando margem bruta de R$ 5.500 por hectare. O endividamento por hectare e de R$ 6.000 (R$ 15 milhoes / 2.500 ha), inferior a margem bruta. A consulta ao SCR mostra que o produtor teve todas as operacoes dos ultimos seis anos classificadas como "A" ou "B". A originadora aprova a CPR com taxa de CDI + 3,0%.

### Risco de contraparte e devedor intermediario

No agro estruturado, o risco de contraparte vai muito alem do produtor individual. Em uma cadeia tipica de credito agro, existem varios devedores intermediarios entre o produtor primario e o investidor final. Uma CPR pode ser emitida pelo produtor em favor de uma trading, que por sua vez cede o recebivel a uma securitizadora, que emite um CRA para investidores. Nesse encadeamento, o risco de contraparte se manifesta em cada elo: e se a trading que intermediou a operacao entrar em dificuldade financeira e nao repassar os recursos recebidos do produtor aos investidores? E se a cooperativa que centralizou a comercializacao nao honrar as CPRs que emitiu em nome de seus cooperados?

O caso mais emblematico de risco de contraparte intermediaria no agro brasileiro foi a recuperacao judicial da Agrogalaxy em 2024, uma das maiores redes de revendas de insumos agricolas do pais, com dividas superiores a R$ 4 bilhoes. A Agrogalaxy operava como intermediaria entre fabricantes de insumos, produtores rurais e instituicoes financeiras. Seu colapso afetou simultaneamente fornecedores de insumos que tinham recebiveis a receber, produtores que dependiam dela para comercializacao e fundos de credito agro que possuiam CPRs e CRAs com a empresa como devedora ou avalista. FIAGROs e FIDCs expostos a Agrogalaxy registraram perdas significativas em suas cotas, evidenciando que o risco de contraparte intermediaria pode ser tao destrutivo quanto uma quebra de safra.

Para o estruturador, a mitigacao do risco de contraparte intermediaria envolve varias tecnicas: exigir que os pagamentos do produtor sejam depositados diretamente em conta vinculada (escrow account) controlada pelo agente fiduciario, sem passar pela conta da trading ou da cooperativa; requerer cessao fiduciaria dos recebiveis com notificacao ao devedor original; diversificar as contrapartes intermediarias no pool; e incluir clausulas de vencimento antecipado (eventos de default) acionadas se a contraparte intermediaria sofrer downgrade de rating, pedido de recuperacao judicial ou mudanca relevante de controle societario.

- **Exemplo**: Um FIDC agro possui em carteira R$ 50 milhoes em CPRs originadas pela Cooperativa ABC do Parana, que emite CPRs em nome de seus 200 cooperados e centraliza a comercializacao da producao. A Cooperativa ABC e, portanto, a contraparte intermediaria entre os produtores e o fundo. Se a cooperativa enfrentar crise financeira — por exemplo, por ma gestao de estoques ou perdas em operacoes de hedge malsucedidas —, ela pode nao repassar ao FIDC os recursos recebidos da venda da producao dos cooperados. Para mitigar esse risco, o FIDC exige que 100% dos pagamentos sejam depositados em conta escrow no nome do fundo, que a cooperativa apresente balancetes trimestrais auditados e que o fundo tenha direito de vencimento antecipado caso a cooperativa apresente patrimonio liquido negativo ou atraso superior a 30 dias em qualquer obrigacao financeira.

---

## 2. Risco de Cadeia e Efeito Cascata

### Como a quebra de um elo afeta toda a cadeia

O agronegocio brasileiro opera em cadeias produtivas longas e interconectadas. No caso da soja, por exemplo, a cadeia minima envolve: fornecedor de insumos, produtor rural, transportadora, armazem/silo, trading/cooperativa, industria esmagadora ou exportador e, ao final, o comprador internacional. Em cada elo, existem relacoes de credito: o fornecedor de insumos concede prazo ao produtor (geralmente via barter ou CPR), a transportadora opera a frete a receber, o armazem cobra taxas de armazenagem, a trading antecipa recursos via CPR e financia a exportacao com ACCs (Adiantamentos sobre Contratos de Cambio). Quando um elo dessa cadeia falha, o efeito cascata pode se propagar rapidamente para montante (fornecedores) e jusante (compradores).

O efeito montante ocorre quando a falha de um elo impacta seus fornecedores. Se uma grande trading que comprou soja de centenas de produtores via CPR fisica nao consegue pagar seus fornecedores de logistica e armazenagem, essas empresas perdem receita e podem, por sua vez, deixar de atender outros clientes. O efeito jusante ocorre quando a falha impacta os compradores e investidores. Se a mesma trading cedeu essas CPRs a uma securitizadora para lastrear um CRA, e a trading entra em dificuldade, o fluxo de pagamento do CRA pode ser interrompido — nao porque os produtores nao pagaram, mas porque o intermediario falhou.

O risco de cadeia e particularmente severo quando existe concentracao: se um CRA depende de uma unica trading como contraparte intermediaria para 100% do pool, a falha dessa trading e um evento de default sistemico para toda a estrutura. Por isso, a diversificacao de contrapartes intermediarias e um principio fundamental de gestao de risco em operacoes estruturadas. Prospeccoes de CRA bem estruturados limitam a exposicao a qualquer contraparte intermediaria a 10% ou 15% do valor total do pool, garantindo que a falha de um elo nao comprometa a estrutura inteira.

- **Exemplo**: Em 2016, a trading Ceagro, sediada em Goias, entrou em recuperacao judicial com dividas de aproximadamente R$ 2,5 bilhoes. A Ceagro atuava como intermediaria entre produtores rurais e o mercado financeiro, comprando soja e milho via CPRs fisicas e financeiras e cedendo esses recebiveis a fundos e securitizadoras. Quando a empresa colapsou, centenas de CPRs que haviam sido cedidas a FIDCs e CRAs ficaram comprometidas — nao porque os produtores nao tinham produzido, mas porque a Ceagro, como contraparte intermediaria, nao repassou os recursos. Fundos que tinham mais de 20% de exposicao a Ceagro sofreram perdas severas. Fundos que haviam limitado a exposicao a 5% do patrimonio absorveram o impacto sem danos estruturais. Esse caso tornou-se referencia para as regras de concentracao que hoje sao padrao no mercado.

### Mapeamento de riscos interconectados e devida diligencia de cadeia

O profissional de credito agro estruturado precisa ir alem da analise isolada de cada devedor e realizar o mapeamento dos riscos interconectados de toda a cadeia. Isso significa identificar, para cada operacao, quais sao os elos criticos que, se falharem, comprometem o fluxo de pagamento — independentemente da qualidade do devedor primario. Esse mapeamento envolve responder a perguntas como: por qual caminho o dinheiro flui do comprador final ate o investidor? Quantos intermediarios existem nesse caminho? Qual e a saude financeira de cada intermediario? Ha mecanismos de isolamento (conta escrow, cessao fiduciaria, trava bancaria) que protegem o fluxo em caso de falha de um intermediario?

A devida diligencia de cadeia (chain due diligence) e uma pratica que vai alem da due diligence tradicional de credito (focada no devedor). Ela inclui: verificacao da saude financeira das contrapartes intermediarias (tradings, cooperativas, revendas); analise da dependencia logistica (se toda a producao do pool e escoada por uma unica rota ou operador logistico, o risco de concentracao logistica e elevado); avaliacao da diversificacao geografica (um CRA lastreado em CPRs de produtores de um unico municipio esta mais exposto a eventos climaticos localizados do que um CRA com produtores em cinco estados); e checagem da existencia e eficacia dos mecanismos de isolamento patrimonial.

Grandes gestoras brasileiras, como a Eco Agro, a Vert (atual gestora de diversos FIAGROs) e a Octante, desenvolveram metodologias proprietarias de mapeamento de cadeia que atribuem scores a cada elo, ponderando fatores como solidez financeira, fungibilidade (se o intermediario pode ser facilmente substituido) e criticidade (se a falha do elo interrompe necessariamente o fluxo de pagamento). Operacoes com score de cadeia elevado — ou seja, com multiplos intermediarios saudaveis, fungibilidade alta e mecanismos de isolamento robustos — recebem melhores condicoes de credito.

- **Exemplo**: Uma securitizadora esta estruturando um CRA de R$ 300 milhoes lastreado em CPRs de soja de 200 produtores. A due diligence de cadeia revela que 60% das CPRs foram originadas pela mesma revenda de insumos (que atua como intermediaria de credito), que toda a producao e escoada pelo mesmo terminal portuario em Sao Luis (MA) e que as CPRs nao possuem conta escrow — os pagamentos fluem pela conta corrente da revenda. O mapeamento identifica tres pontos de concentracao criticos: intermediario unico (revenda), logistica unica (terminal) e ausencia de isolamento de fluxo. A securitizadora decide: (i) limitar a exposicao a revenda a 25% do pool e buscar CPRs originadas por outros intermediarios; (ii) incluir clausula de vencimento antecipado caso o terminal portuario sofra embargo ou paralisacao superior a 30 dias; (iii) exigir conta escrow para 100% dos pagamentos. Apos esses ajustes, o CRA recebe rating A+ em vez de BBB, uma melhoria significativa.

---

## 3. Analise de Credito Agro: Metricas Especificas

### Divida sobre producao, produtividade historica e cobertura de garantias

A analise de credito agro utiliza metricas especificas que refletem as particularidades da atividade agropecuaria. Diferentemente da analise de credito corporativo tradicional, que se baseia em demonstracoes financeiras padronizadas (balanco patrimonial, DRE, fluxo de caixa), a analise de credito agro precisa considerar que a maioria dos produtores rurais — especialmente pessoas fisicas — nao possui contabilidade formal auditada. O analista, portanto, trabalha com proxies e indicadores especificos do setor.

A relacao divida/producao e a metrica mais utilizada na originacao de credito agro. Ela expressa o endividamento total do produtor como percentual da receita bruta esperada da safra. Um produtor com R$ 5 milhoes de divida total e receita bruta esperada de R$ 15 milhoes tem relacao divida/producao de 33% — nivel considerado saudavel pela maioria dos credores. Quando essa relacao ultrapassa 60%, o produtor e considerado altamente alavancado, e o risco de inadimplencia em cenarios adversos (queda de preco, perda de produtividade) aumenta exponencialmente. Dados do Banco Central e da CNA indicam que o endividamento medio dos produtores de soja no Centro-Oeste gira em torno de 35% a 45% da receita esperada, com variacao significativa entre produtores grandes (menor alavancagem relativa) e pequenos (maior alavancagem).

A produtividade historica e o segundo indicador fundamental. Ela reflete a capacidade tecnica do produtor e a qualidade de suas terras. Um produtor que entrega produtividade de soja consistentemente acima de 60 sacas por hectare nos ultimos cinco safras demonstra competencia agronomica e terras de boa aptidao. Um produtor com produtividade volatil — variando de 30 a 65 sacas conforme o ano — apresenta risco operacional maior. O analista calcula a produtividade media, o desvio padrao e a pior produtividade do periodo como parametros de estresse.

A cobertura de garantias reais e o terceiro pilar. No agro, as garantias mais comuns sao: alienacao fiduciaria de imoveis rurais, penhor de safra (CPR fisica), alienacao fiduciaria de maquinas e equipamentos e aval de terceiros (cooperativas, tradings). A metrica de cobertura de garantias expressa o valor das garantias como multiplo do valor da divida. O padrao de mercado para operacoes de CRA e FIAGRO exige cobertura minima de 130% a 150% — ou seja, para cada R$ 100 de divida, o produtor oferece pelo menos R$ 130 a R$ 150 em garantias avaliadas. Garantias imobiliarias rurais sao avaliadas com base em laudos periciais que consideram o valor de mercado das terras, descontado um desgaste de liquidacao (haircut) de 20% a 30%, refletindo o tempo e o custo de execucao judicial em caso de inadimplencia.

- **Exemplo**: Uma gestora de FIAGRO esta analisando uma CPR financeira de R$ 4 milhoes de um produtor de soja em Sapezal (MT). O produtor cultiva 3.000 hectares proprios (avaliados em R$ 90 milhoes) e 1.500 hectares arrendados. A produtividade media das ultimas cinco safras e de 58 sacas/hectare, com desvio padrao de 5 sacas e pior safra de 49 sacas (safra 2021/2022, com seca). A receita bruta esperada (4.500 ha x 58 sacas x R$ 125/saca) e de R$ 32,6 milhoes. O endividamento total (incluindo a nova CPR) e de R$ 14 milhoes. Relacao divida/producao: 43% — dentro do limite aceitavel. Garantias oferecidas: alienacao fiduciaria de 1.000 hectares avaliados em R$ 30 milhoes (com haircut de 25%, valor liquido de R$ 22,5 milhoes). Cobertura de garantias: R$ 22,5 milhoes / R$ 4 milhoes = 5,6x — muito confortavel. A gestora aprova a operacao.

### Concentracao de devedores e diversificacao de pool

A ultima metrica critica na analise de credito agro estruturado e a concentracao de devedores no pool de recebiveis. Em operacoes de CRA, FIAGRO e FIDC, o pool e composto por dezenas ou centenas de CPRs de diferentes produtores. Se um unico produtor (ou um pequeno grupo de produtores relacionados) representar uma fatia muito grande do pool, o default desse produtor pode causar perda significativa para toda a estrutura. Esse risco, chamado de risco de concentracao, e uma das principais preocupacoes de agencias de rating e investidores institucionais.

O padrao de mercado estabelece limites de concentracao que variam conforme o tipo de estrutura e o apetite de risco dos investidores. Em CRAs pulverizados (com muitos devedores), o limite tipico e de 3% a 5% do pool por devedor individual. Isso significa que, em um CRA de R$ 200 milhoes, nenhum produtor individual deve representar mais de R$ 6 a R$ 10 milhoes. Em CRAs corporativos (lastreados em poucos devedores de grande porte), a concentracao e naturalmente maior, mas o rating e ajustado para refletir esse risco. Agencias como Fitch e S&P aplicam penalidades de rating a pools concentrados: um pool com os cinco maiores devedores representando 50% do valor total recebe tratamento de risco significativamente pior do que um pool onde os cinco maiores representam 15%.

Alem da concentracao por devedor, o analista deve avaliar a concentracao geografica (produtores de um mesmo municipio ou microrregiao compartilham o mesmo risco climatico), a concentracao por cultura (pools 100% soja sao mais volateis do que pools diversificados entre soja, milho e algodao) e a concentracao por safra (CPRs com vencimento no mesmo mes criam risco de rollover — se todas vencerem simultaneamente e houver problema de mercado, a inadimplencia sera generalizada). O Indice Herfindahl-Hirschman (HHI), comumente utilizado para medir concentracao de mercado, e adaptado pelos analistas de credito agro para medir a concentracao do pool: HHI abaixo de 0,05 indica pool bem diversificado; HHI acima de 0,15 indica concentracao preocupante.

A gestao ativa do pool e uma funcao continua do gestor do fundo ou da securitizadora. Novas CPRs sao adquiridas para manter a diversificacao a medida que CPRs antigas vencem. O gestor monitora mensalmente os indicadores de concentracao e pode rejeitar novas CPRs que piorem o perfil do pool, mesmo que a CPR individual seja de boa qualidade. Essa disciplina de portfolio e o que diferencia uma gestao profissional de uma gestao amadora no credito agro estruturado.

- **Exemplo**: Um FIAGRO com patrimonio de R$ 500 milhoes possui 320 CPRs em carteira. O relatorio mensal de monitoramento mostra que o maior devedor individual representa 2,8% do patrimonio (R$ 14 milhoes), os dez maiores devedores concentram 18% do patrimonio e o HHI do pool e 0,032 — indicando diversificacao saudavel. A concentracao geografica mostra 40% em Mato Grosso, 25% em Goias, 20% em Bahia e 15% em Mato Grosso do Sul. A concentracao por cultura e 65% soja, 20% milho e 15% algodao. A agencia de rating avalia que a diversificacao e adequada, mas recomenda reduzir a exposicao a Mato Grosso para abaixo de 35% nas proximas aquisicoes. O gestor ajusta sua estrategia de originacao para priorizar CPRs de produtores de Minas Gerais e Tocantins, equilibrando o pool. Comparem com um FIAGRO concorrente que tem 65% do patrimonio concentrado em 15 devedores de um unico municipio do Mato Grosso: em uma seca localizada, a perda potencial e catastrofica, e o rating desse fundo sera significativamente inferior.

---

## Conclusao

Nesta aula, aprofundamos a compreensao do risco de credito e contraparte no agronegocio estruturado, reconhecendo que esse risco e multidimensional e vai muito alem da analise isolada do produtor rural. Vimos que a capacidade de pagamento do produtor depende de fatores patrimoniais, operacionais e historicos, e que o SCR do Banco Central e ferramenta indispensavel para essa avaliacao. Compreendemos que o risco de contraparte intermediaria — tradings, cooperativas, revendas — pode ser tao destrutivo quanto a inadimplencia do devedor primario, como demonstrado pelos casos da Agrogalaxy e da Ceagro. Analisamos o efeito cascata que se propaga quando um elo da cadeia falha, afetando fornecedores a montante e investidores a jusante, e entendemos que a diversificacao de contrapartes e os mecanismos de isolamento (conta escrow, cessao fiduciaria) sao defesas essenciais. Finalmente, dominamos as metricas especificas da analise de credito agro — divida/producao, produtividade historica, cobertura de garantias e concentracao de devedores — que permitem ao estruturador avaliar, com rigor quantitativo, a solidez de cada operacao e do pool como um todo. O profissional que integra essas analises — devedor, contraparte, cadeia e portfolio — tem a visao completa necessaria para estruturar e gerir credito agro no mercado de capitais com competencia e seguranca.

---

## Licao de Casa

1. Escolha um caso publico de recuperacao judicial de empresa do agronegocio brasileiro (Agrogalaxy, Ceagro, Grupo Bertin ou outro) e elabore uma analise de duas paginas descrevendo: qual era o papel da empresa na cadeia (devedor primario, intermediario, avalista), quais instrumentos de credito foram afetados (CPRs, CRAs, FIDCs), qual foi o efeito cascata sobre fornecedores e investidores, e quais mecanismos de mitigacao (conta escrow, diversificacao, clausulas de vencimento antecipado) poderiam ter reduzido as perdas. Utilize fontes publicas como materias da Bloomberg Linea, Valor Economico ou InfoMoney.
2. Simule a analise de credito de um produtor rural ficticio. Defina: regiao, cultura, area plantada (propria e arrendada), produtividade media das ultimas cinco safras, custo de producao por hectare, endividamento total, garantias oferecidas e classificacao no SCR. Calcule: relacao divida/producao, margem bruta por hectare, cobertura de garantias e avalie se a operacao seria aprovada por um comite de credito que exige divida/producao inferior a 50% e cobertura de garantias superior a 150%.
3. Construa um pool hipotetico de 20 CPRs para lastrear um CRA de R$ 100 milhoes. Para cada CPR, defina: devedor, regiao, cultura, valor e contraparte intermediaria. Calcule o HHI do pool, a concentracao dos cinco maiores devedores (percentual do total) e a concentracao geografica por estado. Avalie se o pool atende os criterios de diversificacao discutidos na aula (nenhum devedor acima de 5% do pool, cinco maiores abaixo de 20%, HHI abaixo de 0,05) e, caso nao atenda, proponha ajustes.

---

## Proxima Aula

Esta foi a ultima aula do Modulo 4 — Gestao de Risco no Agro Estruturado. No proximo modulo (Modulo 5), vamos explorar os veiculos de investimento e o mercado global do agronegocio, analisando FIAGROs, FIDCs, fundos internacionais e como o capital global acessa o agro brasileiro. Ate la!

---

## Links para aprofundamento

1. [Sistema de Informacoes de Credito (SCR) — Banco Central do Brasil](https://www.bcb.gov.br/estabilidadefinanceira/scr)
2. [Anbima — Guia de Credito Estruturado: CRA e Securitizacao](https://www.anbima.com.br/pt_br/informar/estatisticas/mercado-de-capitais/cra.htm)
3. [Fitch Ratings Brasil — Metodologia de Rating para CRA e Credito Agro](https://www.fitchratings.com/region/brazil)
4. [Confederacao da Agricultura e Pecuaria do Brasil (CNA) — Indicadores do Agro](https://www.cnabrasil.org.br/publicacoes/indicadores-do-agro)
5. [Valor Economico — Agronegocio: Credito e Mercado de Capitais](https://valor.globo.com/agronegocios/)

---

## Questionario

**1. Qual metrica expressa o endividamento total do produtor rural como percentual da receita bruta esperada da safra?**

a) Indice de cobertura do servico da divida (ICSD)
b) Relacao divida/producao
c) Loan-to-value (LTV) do imovel rural
d) Margem EBITDA agropecuaria

**Resposta: b**

**2. Qual e a principal funcao de uma conta escrow (conta vinculada) em operacoes de credito agro estruturado?**

a) Aumentar a rentabilidade do investidor ao aplicar os recursos em titulos publicos durante o periodo de carencia
b) Isolar o fluxo de pagamento do devedor, garantindo que os recursos nao passem pela conta do intermediario e cheguem diretamente ao credor ou agente fiduciario
c) Substituir a necessidade de garantias reais, pois o deposito em escrow equivale a penhor sobre a producao futura
d) Permitir que o produtor renegocie as condicoes da CPR a qualquer momento sem anuencia do credor

**Resposta: b**

**3. Uma securitizadora identifica que 60% das CPRs de um CRA foram originadas pela mesma revenda de insumos, que atua como intermediaria de credito, e que toda a producao do pool e escoada por um unico terminal portuario. Quais riscos de cadeia essa configuracao apresenta?**

a) Risco de concentracao em contraparte intermediaria e risco de concentracao logistica, ambos potencializando o efeito cascata em caso de falha de qualquer um dos elos
b) Apenas risco de preco, pois a concentracao em um intermediario nao afeta a qualidade crediticia dos devedores primarios
c) Risco regulatorio, pois a CVM proibe que mais de 30% do pool seja originado por um unico intermediario
d) Risco de liquidez do CRA no mercado secundario, sem impacto na qualidade crediticia da emissao

**Resposta: a**

**4. Um produtor de soja cultiva 2.000 hectares proprios (avaliados em R$ 50 milhoes) e apresenta endividamento total de R$ 12 milhoes, produtividade media de 55 sacas/hectare e preco esperado de R$ 120/saca. A receita bruta esperada e de R$ 13,2 milhoes. A relacao divida/producao e de aproximadamente 91%. Um comite de credito que exige relacao maxima de 50% aprovaria essa operacao?**

a) Sim, pois a relacao patrimonio/divida e superior a 4:1, o que compensa a alta alavancagem operacional
b) Nao, pois a relacao divida/producao de 91% excede drasticamente o limite de 50%, indicando que o produtor esta altamente alavancado e provavelmente nao gerara caixa suficiente para honrar todas as obrigacoes em cenarios adversos
c) Sim, desde que o produtor contrate seguro rural para 100% da area plantada
d) Nao e possivel avaliar sem conhecer a classificacao do produtor no SCR

**Resposta: b**

**5. Um FIAGRO possui 280 CPRs em carteira. Os cinco maiores devedores concentram 35% do patrimonio, o HHI do pool e 0,12, 70% das CPRs sao de produtores de um unico municipio do Mato Grosso e 95% do pool e composto por soja. Considerando os criterios de diversificacao discutidos na aula, qual e a avaliacao correta desse pool e qual medida prioritaria o gestor deveria adotar?**

a) O pool esta adequadamente diversificado, pois possui 280 CPRs, e nenhuma medida e necessaria
b) O pool apresenta concentracao excessiva em multiplas dimensoes — devedores (cinco maiores acima de 20%), HHI elevado (acima de 0,05), concentracao geografica (70% em um municipio) e concentracao por cultura (95% soja) — e o gestor deveria priorizar a aquisicao de CPRs de novos devedores, em outras regioes e outras culturas, rejeitando novas CPRs de soja do mesmo municipio ate atingir niveis aceitaveis de diversificacao
c) O unico problema e a concentracao por cultura; bastaria incluir 10% de CPRs de milho para resolver todas as deficiencias do pool
d) O HHI de 0,12 e aceitavel para fundos de agronegocio, pois o limite de 0,05 se aplica apenas a FIDCs nao agro

**Resposta: b**
