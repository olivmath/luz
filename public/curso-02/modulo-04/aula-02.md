# Aula 4.2: Risco de Preco e Hedge de Commodities

## Abertura

Bem-vindo a aula 4.2 do Modulo 4 — Gestao de Risco no Agro Estruturado. Na aula anterior, abordamos o risco climatico e os instrumentos para mitiga-lo, desde o ZARC ate derivativos parametricos. Agora, vamos tratar do segundo grande risco que afeta o credito agro estruturado: o risco de preco. A volatilidade dos precos de commodities agropecuarias pode transformar uma operacao aparentemente segura em uma fonte de inadimplencia. Um produtor que plantou dentro da janela do ZARC, contratou seguro rural e colheu uma safra excelente ainda assim pode se tornar inadimplente se o preco da soja cair 30% entre o plantio e a comercializacao. Nesta aula, vamos entender as fontes dessa volatilidade, os instrumentos de hedge disponiveis no mercado brasileiro e internacional, e como a integracao do hedge na estrutura de credito reduz o risco para credores e investidores.

### Programa da aula:

1. Fontes de volatilidade de precos (oferta/demanda global, cambio, logistica, geopolitica)
2. Instrumentos de hedge (futuros B3/CBOT, contratos forward, barter)
3. Integracao do hedge na estrutura de credito (como hedge reduz risco para credor/investidor)

---

## 1. Fontes de Volatilidade de Precos

### Dinamica global de oferta e demanda e o impacto do cambio

Os precos das commodities agropecuarias brasileiras sao determinados por uma interacao complexa entre fatores de oferta e demanda em escala global. O Brasil e o maior exportador mundial de soja, cafe, suco de laranja, acucar, carne bovina e carne de frango. Isso significa que os precos recebidos pelo produtor brasileiro nao sao definidos localmente — sao formados nas bolsas internacionais (CBOT em Chicago, ICE em Nova York e Londres) e convertidos para reais conforme a taxa de cambio vigente. Essa dupla exposicao — ao preco internacional da commodity em dolares e a variacao do cambio USD/BRL — cria uma volatilidade composta que pode ser tanto benefica quanto destrutiva para o produtor.

Do lado da oferta global, fatores como a safra dos Estados Unidos (principal concorrente em soja e milho), a producao da Argentina (terceiro maior produtor de soja), a safra de cafe do Vietna (segundo maior produtor mundial) e eventos climaticos em qualquer grande regiao produtora afetam diretamente os precos internacionais. Do lado da demanda, o apetite da China (que importa mais de 100 milhoes de toneladas de soja por ano), as politicas de estoque e importacao da India (maior consumidora de acucar) e o crescimento da demanda por racao animal no Sudeste Asiatico sao os principais vetores. Em anos de safra americana cheia e demanda chinesa estavel, os precos tendem a cair; em anos de quebra de safra na Argentina e aumento de importacao chinesa, os precos disparam.

O cambio adiciona outra camada de volatilidade. Quando o real desvaloriza frente ao dolar, o produtor brasileiro recebe mais reais por saca exportada, o que compensa parcialmente uma eventual queda do preco internacional. Quando o real se valoriza, ocorre o oposto: mesmo com precos internacionais estaveis, o produtor recebe menos em moeda local. Em 2020, por exemplo, a desvalorizacao do real (que foi de R$ 4,00 para R$ 5,40 por dolar ao longo do ano) compensou a queda dos precos internacionais de soja, e o produtor brasileiro teve receita recorde em reais. Ja em 2023, a valorizacao do real de R$ 5,30 para R$ 4,85 reduziu a receita em reais mesmo com precos internacionais relativamente estaveis.

- **Exemplo**: Em marco de 2022, apos a invasao da Ucrania pela Russia, o preco da soja na CBOT saltou de US$ 13 para US$ 17 por bushel em poucas semanas — um aumento de 30%. Simultaneamente, o dolar variou de R$ 5,10 para R$ 4,75. O produtor brasileiro que vendeu soja nesse periodo recebeu o beneficio do preco internacional mais alto, mas perdeu parte do ganho pela valorizacao do real. O preco efetivo em reais por saca subiu cerca de 20%, nao 30%. Esse exemplo ilustra como o produtor brasileiro vive em um "sanduiche" entre preco internacional e cambio.

### Logistica, sazonalidade e fatores geopoliticos

Alem da dinamica de oferta, demanda e cambio, a volatilidade de precos no agro brasileiro e amplificada por fatores logisticos, sazonais e geopoliticos que frequentemente sao subestimados na analise de credito. O Brasil possui gargalos logisticos estruturais: a distancia entre as regioes produtoras do Centro-Oeste e os portos de exportacao (Santos, Paranagua, Sao Luis) gera custos de frete que variam dramaticamente ao longo do ano. No pico da safra de soja (fevereiro a abril), o frete rodoviario de Sorriso (MT) a Santos (SP) — cerca de 2.000 km — pode subir de R$ 250 para R$ 450 por tonelada, uma variacao de 80%. Esse custo de frete e descontado do preco recebido pelo produtor, criando o chamado "basis" (diferencial entre o preco na bolsa e o preco no interior), que e uma fonte adicional de volatilidade local.

A sazonalidade da colheita tambem pressiona precos. Quando milhares de produtores colhem simultaneamente e precisam vender para pagar suas dividas de custeio, a oferta concentrada pressiona os precos para baixo no curto prazo. Esse fenomeno, conhecido como "pressao de safra", e especialmente relevante para milho safrinha e soja. Produtores com capacidade de armazenagem podem esperar meses para vender a precos melhores, mas a maioria — especialmente pequenos e medios — nao dispoe de silos proprios e e forcada a vender no pico da colheita, aceitando precos deprimidos.

Fatores geopoliticos adicionam volatilidade imprevisivel. A guerra comercial entre Estados Unidos e China (2018-2019) redirecionou fluxos de soja e beneficiou enormemente o Brasil, que ganhou market share na China. A guerra na Ucrania (2022) afetou os mercados de milho, trigo e fertilizantes. Embargos sanitarios — como a suspensao temporaria de exportacoes de carne bovina para a China apos casos de vaca louca atipica — podem causar quedas abruptas de preco. Para o estruturador de credito agro, esses fatores nao sao "ruido" de mercado — sao riscos materiais que afetam a capacidade de pagamento dos devedores.

- **Exemplo**: Em outubro de 2021, o Brasil suspendeu voluntariamente as exportacoes de carne bovina para a China apos a confirmacao de dois casos de vaca louca atipica. A suspensao durou cerca de 100 dias. Durante esse periodo, o preco da arroba do boi gordo no mercado interno caiu de R$ 310 para R$ 260 — uma queda de 16%. Frigorificos que tinham CPRs a vencer com produtores durante esse periodo enfrentaram renegociacoes, e FIDCs com exposicao a pecuaria de corte registraram aumento de inadimplencia temporaria. Esse episodio demonstra como um evento geopolitico/sanitario pode impactar diretamente o fluxo de caixa de operacoes de credito agro estruturado.

---

## 2. Instrumentos de Hedge

### Contratos futuros na B3 e na CBOT

O contrato futuro e o instrumento de hedge mais utilizado globalmente para protecao contra a volatilidade de precos de commodities. No mercado agro brasileiro, os principais contratos futuros sao negociados na B3 (Brasil, Bolsa, Balcao) e na CBOT (Chicago Board of Trade, parte do CME Group). Na B3, os contratos mais liquidos para o agro sao: soja (SFI), milho (CCM), cafe arabica (ICF), boi gordo (BGI), acucar cristal e etanol. Na CBOT, os contratos de soja (ZS), milho (ZC) e farelo de soja (ZM) sao referencias globais.

O mecanismo de um contrato futuro e direto: o produtor (ou a trading, ou o fundo) vende contratos futuros correspondentes ao volume de sua producao esperada, travando o preco de venda para uma data futura. Se o preco cair ate o vencimento, o ganho na posicao vendida no mercado futuro compensa a perda no mercado fisico. Se o preco subir, a perda no mercado futuro e compensada pelo preco melhor obtido na venda fisica. O resultado liquido e a "trava" do preco no nivel desejado. E fundamental compreender que o hedge com futuros nao elimina o risco — ele transforma risco de preco em risco de basis (diferencial local) e em risco de margem (necessidade de depositar garantias diarias na bolsa conforme o mercado se movimenta contra a posicao).

Na B3, o contrato de soja (SFI) tem tamanho de 450 sacas (27 toneladas), cotado em dolares por saca, com liquidacao financeira. O contrato de milho (CCM) tem tamanho de 450 sacas (27 toneladas), cotado em reais por saca, com liquidacao financeira. O contrato de boi gordo (BGI) e cotado em reais por arroba, com tamanho de 330 arrobas, e admite liquidacao financeira ou por entrega. Em 2023, o volume medio diario de contratos futuros de milho negociados na B3 foi superior a 80 mil contratos, evidenciando liquidez robusta. Para o produtor que nao opera diretamente em bolsa, as corretoras e as cooperativas oferecem servicos de mesa de operacoes que executam o hedge sob instrucao do cliente.

- **Exemplo**: Um produtor de milho no Triangulo Mineiro espera colher 50.000 sacas de milho safrinha em julho. Em fevereiro, o contrato futuro de milho na B3 para vencimento em julho esta cotado a R$ 65 por saca. O produtor decide travar 60% da producao (30.000 sacas) vendendo 67 contratos futuros (30.000 / 450 = 66,7, arredondado). Se em julho o preco spot cair para R$ 52 por saca, o produtor recebe R$ 52 no mercado fisico, mas ganha R$ 13 por saca no mercado futuro (R$ 65 - R$ 52), resultando em um preco efetivo de R$ 65 para as 30.000 sacas hedgeadas. As 20.000 sacas restantes sao vendidas a R$ 52, sem protecao. A receita total e: (30.000 x R$ 65) + (20.000 x R$ 52) = R$ 1.950.000 + R$ 1.040.000 = R$ 2.990.000, contra R$ 2.600.000 sem nenhum hedge (50.000 x R$ 52).

### Contratos forward, operacoes de barter e contratos a termo

Enquanto os contratos futuros sao padronizados e negociados em bolsa, os contratos forward (a termo) sao acordos bilaterais privados entre duas partes, sem padronizacao de bolsa e sem ajuste diario de margem. No agro brasileiro, o forward e extremamente comum: o produtor acorda com uma trading ou cooperativa a venda antecipada de sua producao a um preco fixo, com entrega em data futura. A formalizacao juridica geralmente ocorre por meio de uma CPR fisica (compromisso de entrega) ou de um contrato particular de compra e venda.

A grande vantagem do forward e a simplicidade: nao exige conta em corretora, nao exige deposito de margem e pode ser customizado em volume, qualidade, local de entrega e prazo. A desvantagem e o risco de contraparte — se uma das partes nao cumprir o acordo, a outra precisa recorrer a Justica para fazer valer o contrato. Alem disso, o forward nao permite que o produtor se beneficie de uma alta de precos apos a fixacao, pois o preco e travado bilateralmente.

A operacao de barter (troca) e uma variante sofisticada do forward amplamente utilizada no Brasil. No barter, o produtor recebe insumos (sementes, fertilizantes, defensivos) de uma empresa fornecedora e se compromete a pagar com produto fisico apos a colheita. A relacao de troca e fixada no momento da operacao — por exemplo, 10 sacas de soja por tonelada de fertilizante. O barter resolve simultaneamente dois problemas: o financiamento do custeio (o produtor recebe insumos sem desembolso imediato) e o hedge de preco (a relacao de troca trava o custo dos insumos em termos de produto). Empresas como Mosaic, Nutrien, Yara, Bayer e Syngenta sao grandes operadoras de barter no Brasil, movimentando dezenas de bilhoes de reais por safra. Segundo estimativas da Conab e de consultorias especializadas, entre 30% e 40% da soja brasileira e comercializada por meio de operacoes de barter ou forward antes da colheita.

- **Exemplo**: Em setembro, antes do plantio da safra de soja 2024/2025, um produtor no Mato Grosso negocia uma operacao de barter com a Mosaic Fertilizantes. Ele recebe 500 toneladas de MAP (fosfato monoamonico) no valor de R$ 2,5 milhoes e se compromete a entregar 40.000 sacas de soja apos a colheita (relacao de troca de 80 sacas por tonelada de fertilizante). No momento do acordo, a saca de soja vale R$ 125, e 40.000 sacas equivalem a R$ 5 milhoes — mas o produtor so entrega o equivalente ao custo dos insumos. Se na colheita o preco da soja cair para R$ 100, o produtor ainda deve as 40.000 sacas (nao o valor em reais), e o custo efetivo do fertilizante em reais e menor do que se tivesse comprado a vista. Se o preco subir para R$ 150, o produtor "pagou caro" em termos de oportunidade, pois as 40.000 sacas agora valem R$ 6 milhoes. O barter, portanto, funciona como hedge e financiamento simultaneos.

---

## 3. Integracao do Hedge na Estrutura de Credito

### Como o hedge reduz risco para o credor e o investidor

A presenca de hedge na operacao de credito agro tem impacto direto e mensuravel na qualidade crediticia do devedor e, consequentemente, na seguranca da estrutura para credores e investidores. Quando um produtor trava o preco de venda de 70% ou mais de sua producao — seja via futuros, forward ou barter —, ele elimina a principal variavel de incerteza sobre sua receita futura, tornando o fluxo de caixa previsivel. Para o banco ou fundo que concedeu o credito (via CPR, por exemplo), essa previsibilidade significa que a capacidade de pagamento do devedor nao depende mais de cotacoes volateis no momento da comercializacao.

Na analise de credito agro, os estruturadores utilizam a metrica de "percentual de producao hedgeada" como indicador-chave de risco. Uma CPR emitida por um produtor que travou 80% da producao a R$ 130 por saca de soja apresenta risco de preco residual de apenas 20% — o cenario de inadimplencia so se materializa se o preco cair drasticamente E o produtor tiver problemas de produtividade nos 20% nao hedgeados. Ja uma CPR de um produtor sem nenhum hedge esta integralmente exposta a variacao de preco: uma queda de 25% na cotacao pode transformar uma operacao inicialmente saudavel em inadimplencia, mesmo com produtividade normal.

Essa logica se aplica igualmente a operacoes estruturadas no mercado de capitais. Em um CRA lastreado em CPRs de soja, a presenca de hedge no pool de devedores melhora a previsibilidade dos fluxos de caixa que remuneram os investidores. Agencias de rating incorporam o grau de hedge do pool em seus modelos: pools com mais de 70% da producao hedgeada recebem tratamento de risco mais favoravel, refletindo-se em ratings melhores e spreads menores. O Comite de Credito de grandes gestoras como a JGP, a Kinea e a Capitania inclui o nivel de hedge como criterio eliminatorio — operacoes sem hedge minimo definido sao automaticamente rejeitadas, independentemente de outras qualidades da estrutura.

- **Exemplo**: Uma gestora de FIAGRO analisa duas CPRs financeiras de soja, ambas de R$ 5 milhoes, ambas de produtores do Mato Grosso com perfil de credito semelhante. O Produtor "A" travou 75% da producao em futuros na B3 a R$ 128 por saca e 15% em barter. O Produtor "B" nao realizou nenhum hedge e pretende vender 100% da producao no mercado spot apos a colheita. A gestora calcula que, em um cenario de queda de 20% no preco da soja, o Produtor "A" mantem margem de pagamento positiva (receita hedgeada de R$ 128 sobre custo de producao de R$ 95), enquanto o Produtor "B" teria receita de R$ 102,40 por saca e margem de apenas R$ 7,40 — insuficiente para cobrir despesas financeiras e overhead. A gestora aprova a CPR do Produtor "A" a CDI + 3,5% e rejeita a CPR do Produtor "B".

### Hedge como credit enhancement em estruturas securitizadas

Em operacoes de securitizacao de credito agro — CRAs, FIDCs e debentures lastreadas em recebiveis rurais —, o hedge funciona como uma camada de credit enhancement (melhoria de credito) que se soma a outras formas de protecao, como subordinacao de tranches, fundo de reserva, excesso de spread e garantias reais. A integracao do hedge na estrutura de credito pode ocorrer de duas formas principais: hedge do devedor (o produtor realiza o hedge individualmente, e a securitizadora verifica e monitora) ou hedge da estrutura (a propria securitizadora ou o gestor do fundo contrata operacoes de hedge em nome da estrutura, cobrindo o risco de preco do pool de forma agregada).

O hedge da estrutura e uma pratica cada vez mais comum em CRAs de grande porte. A securitizadora emite o CRA lastreado em CPRs de soja, e simultaneamente vende contratos futuros de soja na B3 ou na CBOT equivalentes a um percentual do volume fisico do pool. Se os precos caem e os produtores enfrentam dificuldade de pagamento, o ganho na posicao de futuros da estrutura compensa parcialmente as perdas de credito. Esse mecanismo e formalmente descrito no prospecto do CRA e avaliado pela agencia de rating como fator de melhoria de credito. Em termos de impacto quantitativo, o hedge da estrutura pode reduzir a perda esperada do pool em 30% a 50% em cenarios de estresse de preco, o que se traduz em um a dois degraus de melhoria de rating.

O risco de basis deve ser considerado nessa integracao. O hedge via futuros protege contra a variacao do preco de referencia (bolsa), mas nao contra a variacao do diferencial entre preco de bolsa e preco local. Em regioes com infraestrutura logistica precaria, o basis pode ser amplo e volatil, reduzindo a eficacia do hedge. O estruturador competente calibra o tamanho da posicao de futuros levando em conta o basis historico da regiao dos devedores, o custo de frete e a liquidez do contrato utilizado.

- **Exemplo**: Uma securitizadora emite um CRA de R$ 200 milhoes lastreado em CPRs de soja de 150 produtores do MATOPIBA. O pool total representa 1,2 milhao de sacas de soja. A securitizadora contrata hedge vendendo 1.800 contratos futuros de soja na B3 (equivalente a 810.000 sacas, ou 67% do pool) a R$ 132 por saca. O prospecto do CRA descreve o hedge como mecanismo de protecao. A Fitch avalia que o hedge reduz a perda esperada em cenario de estresse (queda de 25% no preco da soja) de 8,2% para 3,5% do valor do CRA. Com base nessa reducao, a tranche senior recebe rating AAA em vez de AA, permitindo emissao a CDI + 1,8% em vez de CDI + 2,6%. A economia de custo financeiro de 0,8 ponto percentual sobre R$ 160 milhoes (tranche senior) equivale a R$ 1,28 milhao por ano, que mais do que compensa o custo da operacao de hedge (corretagem, margem de garantia e eventuais ajustes diarios).

---

## Conclusao

Nesta aula, compreendemos que o risco de preco e uma ameaca tao relevante quanto o risco climatico para a saude financeira das operacoes de credito agro estruturado. Analisamos as multiplas fontes de volatilidade — oferta e demanda global, cambio, logistica, sazonalidade e geopolitica — e entendemos que o produtor brasileiro vive sob exposicao composta ao preco internacional e a variacao cambial. Estudamos os tres principais instrumentos de hedge disponiveis: contratos futuros em bolsa (B3 e CBOT), contratos forward bilaterais e operacoes de barter, cada um com vantagens e limitacoes especificas. Finalmente, demonstramos que a integracao do hedge na estrutura de credito — seja pelo devedor individualmente, seja pela propria estrutura securitizada — reduz a volatilidade do fluxo de caixa, melhora o rating, diminui o custo de captacao e funciona como credit enhancement mensuravel. O profissional que domina a avaliacao e a integracao do hedge na analise de credito agro possui uma competencia central para atuar em estruturacao, gestao de fundos e originacao de operacoes no mercado de capitais do agronegocio.

---

## Licao de Casa

1. Acesse o site da B3 e identifique os contratos futuros de commodities agropecuarias disponiveis (soja, milho, cafe, boi gordo, acucar, etanol). Para cada contrato, registre: tamanho do contrato, moeda de cotacao, tipo de liquidacao (financeira ou por entrega) e volume medio diario negociado no ultimo mes disponivel. Compare a liquidez dos contratos e discuta quais culturas possuem instrumentos de hedge mais acessiveis.
2. Simule uma operacao de barter para um produtor de soja no Mato Grosso. Defina: volume de insumos recebidos (tipo e quantidade), relacao de troca (sacas de soja por tonelada de insumo), preco de referencia da soja no momento do acordo e cenarios de preco na colheita (alta de 20%, estavel e queda de 20%). Calcule o custo efetivo do insumo em cada cenario e discuta em que situacao o barter foi vantajoso ou desvantajoso para o produtor.
3. Pesquise no site da CVM ou em plataformas de mercado (como Anbima Data ou o site de uma securitizadora) um prospecto de CRA do agronegocio que mencione hedge como mecanismo de protecao. Identifique: qual instrumento de hedge foi utilizado, qual percentual do pool foi coberto, se o hedge foi realizado pelo devedor ou pela estrutura, e como a agencia de rating avaliou o impacto do hedge no rating da emissao.

---

## Proxima Aula

Na proxima aula, vamos abordar o risco de credito e contraparte na cadeia do agronegocio, analisando como avaliar a capacidade de pagamento do produtor, os efeitos cascata quando um elo da cadeia falha, e as metricas especificas de analise de credito agro que todo estruturador precisa dominar. Ate la!

---

## Links para aprofundamento

1. [B3 — Derivativos Agropecuarios: Contratos Futuros e Opcoes](https://www.b3.com.br/pt_br/produtos-e-servicos/negociacao/commodities/)
2. [Companhia Nacional de Abastecimento (Conab) — Acompanhamento de Safra e Precos](https://www.conab.gov.br/info-agro/safras)
3. [Centro de Estudos Avancados em Economia Aplicada (CEPEA/ESALQ/USP) — Indicadores de Precos Agropecuarios](https://www.cepea.esalq.usp.br/br/indicador/soja.aspx)
4. [CME Group — Agricultural Futures and Options (CBOT)](https://www.cmegroup.com/markets/agriculture.html)
5. [Ministerio da Agricultura e Pecuaria — Politica de Garantia de Precos Minimos (PGPM)](https://www.gov.br/agricultura/pt-br/assuntos/politica-agricola/garantia-de-precos-minimos)

---

## Questionario

**1. Qual e a principal razao pela qual o produtor brasileiro de soja esta exposto a uma "volatilidade composta" de preco?**

a) Porque a soja e tributada simultaneamente pelo governo federal e pelos governos estaduais
b) Porque o preco recebido depende tanto da cotacao internacional da commodity em dolares quanto da variacao da taxa de cambio USD/BRL
c) Porque a soja brasileira tem qualidade inferior a americana e sofre desconto automatico nas bolsas
d) Porque o frete rodoviario e fixado pelo governo e nao acompanha o preco da commodity

**Resposta: b**

**2. Qual e a diferenca fundamental entre um contrato futuro negociado em bolsa e um contrato forward bilateral?**

a) O contrato futuro so pode ser utilizado por produtores rurais, enquanto o forward pode ser utilizado por qualquer empresa
b) O contrato futuro e padronizado, negociado em bolsa e possui ajuste diario de margem, enquanto o forward e um acordo bilateral privado sem padronizacao de bolsa
c) O contrato futuro nao exige garantias, enquanto o forward exige deposito integral do valor no momento da contratacao
d) O contrato futuro protege contra risco climatico, enquanto o forward protege apenas contra risco de preco

**Resposta: b**

**3. Em uma operacao de barter, o produtor recebe 300 toneladas de fertilizante a uma relacao de troca de 90 sacas de soja por tonelada, quando a soja esta cotada a R$ 130 por saca. Na colheita, o preco cai para R$ 100 por saca. Qual e o custo efetivo do fertilizante por tonelada para o produtor, considerando o preco de soja na colheita?**

a) R$ 11.700, pois o custo e calculado pelo preco da soja no momento do acordo
b) R$ 9.000, pois o produtor entrega sacas fisicas e o custo efetivo e 90 x R$ 100
c) R$ 13.000, pois o barter inclui juros sobre o periodo entre o acordo e a entrega
d) R$ 10.350, pois o custo e a media entre o preco no momento do acordo e o preco na colheita

**Resposta: b**

**4. Uma securitizadora emite um CRA de R$ 150 milhoes lastreado em CPRs de milho e simultaneamente vende contratos futuros de milho na B3 cobrindo 65% do volume do pool. Qual e a funcao dessa operacao de hedge no contexto da estrutura do CRA?**

a) Garantir que os produtores recebam o preco maximo de mercado no momento da comercializacao
b) Funcionar como credit enhancement que reduz a perda esperada em cenarios de estresse de preco, potencialmente melhorando o rating da emissao e reduzindo o custo de captacao
c) Eliminar integralmente o risco de credito dos devedores do pool, tornando o CRA equivalente a um titulo publico
d) Substituir a necessidade de subordinacao de tranches e fundo de reserva na estrutura do CRA

**Resposta: b**

**5. Um FIAGRO esta analisando duas CPRs financeiras de R$ 8 milhoes cada, ambas de produtores de soja do Mato Grosso com custo de producao de R$ 95 por saca. O Produtor "X" hedgeou 80% da producao a R$ 135 por saca via futuros na B3. O Produtor "Y" nao realizou hedge. Em um cenario de queda do preco spot para R$ 98 por saca, qual e a margem por saca de cada produtor sobre o custo de producao, considerando as sacas hedgeadas e nao hedgeadas proporcionalmente, e qual a implicacao para a decisao de credito do fundo?**

a) Produtor "X" tem margem media de R$ 37,60 por saca e Produtor "Y" tem margem de R$ 3,00 por saca; o fundo deve aprovar ambas as CPRs, pois ambos mantem margem positiva
b) Produtor "X" tem margem media de R$ 34,60 por saca e Produtor "Y" tem margem de R$ 3,00 por saca; o fundo deve aprovar a CPR de "X" e rejeitar ou exigir garantias adicionais de "Y", pois a margem de R$ 3,00 e insuficiente para cobrir despesas financeiras e riscos operacionais
c) Ambos os produtores ficam inadimplentes no cenario de queda, pois R$ 98 por saca e inferior ao custo de producao de R$ 95 acrescido de despesas financeiras
d) O hedge e irrelevante para a decisao de credito, pois o que importa e a garantia real (imovel) oferecida pelo produtor

**Resposta: b**
