# Aula 4.3: Eficiencia de Encapsulacao, Liberacao e Estabilidade

## Abertura

Bem-vindo a aula 4.3 do Modulo 4 — Caracterizacao e Controle de Qualidade. Nas aulas anteriores, dominamos a caracterizacao dimensional (DLS, NTA, difracao a laser, potencial zeta) e morfologico-estrutural (TEM, SEM, AFM, DSC, XRD) de nanovetores cosmeticos. Agora, completaremos o tripe da caracterizacao abordando os parametros que conectam a fisico-quimica ao desempenho funcional: quanto ativo esta efetivamente encapsulado? Como ele e liberado ao longo do tempo? A formulacao permanece estavel durante o shelf life? A **eficiencia de encapsulacao** (EE%), a **capacidade de carga** (loading capacity, LC%), o **perfil de liberacao in vitro** e os **ensaios de estabilidade** sao os parametros que determinam se um nanovetor cosmetico e funcionalmente viavel — ou seja, se ele cumpre sua finalidade de transportar, proteger e liberar o ativo de forma controlada na pele. Sem esses dados, toda a caracterizacao fisico-quimica anterior seria meramente academica.

### Programa da aula:

1. Eficiencia de encapsulacao (EE%) e capacidade de carga (LC%) — metodos diretos, indiretos e tecnicas de separacao
2. Liberacao in vitro — celula de Franz, selecao de membranas e modelos cineticos matematicos
3. Estabilidade — protocolos acelerados, de longa duracao, freeze-thaw e determinacao de shelf life

---

## 1. Eficiencia de Encapsulacao (EE%) e Capacidade de Carga (LC%)

### Definicao e significado de EE% e LC%

A **eficiencia de encapsulacao** (EE%, tambem denominada entrapment efficiency) quantifica a fracao do ativo adicionado a formulacao que foi efetivamente incorporada (encapsulada, adsorvida ou dissolvida) no nanovetor. A EE% e expressa pela equacao:

**EE% = (massa de ativo encapsulado / massa total de ativo adicionado) x 100**

A **capacidade de carga** (loading capacity, LC%) quantifica a fracao de ativo em relacao a massa total do nanovetor (nanoparticula seca), indicando a eficiencia de utilizacao do material carreador:

**LC% = (massa de ativo encapsulado / massa total do nanovetor) x 100**

A distincao entre EE% e LC% e fundamental e frequentemente confundida na literatura. Uma formulacao pode ter EE% de 95% (quase todo o ativo adicionado foi encapsulado) mas LC% de apenas 2% (a massa de ativo representa uma fracao pequena da massa total de nanoparticula, que e composta majoritariamente de lipidio ou polimero). Inversamente, uma formulacao com EE% de 40% pode ter LC% de 15% se a proporcao ativo/carreador na receita for alta. Para aplicacoes cosmeticas, valores tipicos de EE% variam de 50% a 99%, dependendo do ativo, do tipo de nanovetor e do metodo de preparo. Para LC%, valores tipicos em nanovetores lipidicos sao de 1-10% e em nanovetores polimericos de 1-30%.

Fatores que influenciam a EE% incluem: (i) **solubilidade do ativo** na matriz do nanovetor — ativos altamente lipofilos (logP > 3) tendem a ter EE% elevada em nanovetores lipidicos; ativos hidrofilos tendem a escapar para a fase aquosa durante o preparo; (ii) **metodo de preparo** — metodos que envolvem etapas de lavagem extensiva ou evaporacao de solvente podem reduzir a EE%; (iii) **proporcao ativo/carreador** — existe um limite de solubilidade do ativo na matriz, acima do qual o excesso precipita ou permanece na fase externa; (iv) **tipo de nanovetor** — nanocapsulas (reservatorio) tendem a ter EE% mais alta para ativos lipofilos que nanoesferas (matricial), pois o nucleo oleoso tem maior capacidade solvente que a matriz polimerica; (v) **parametros de processo** — temperatura, pressao de homogeneizacao, velocidade de agitacao e pH afetam a particao do ativo entre fases.

- **Exemplo**: Uma formulacao de NLC de cera de abelha/oleo de jojoba encapsulando **retinol** (vitamina A, logP = 6,2, altamente lipofilo) apresenta EE% de 92% e LC% de 4,6%. A alta EE% e consistente com a elevada lipofilicidade do retinol, que se particiona preferencialmente na matriz lipidica. O LC% de 4,6% indica que, para cada 100 mg de NLC seca, 4,6 mg sao de retinol — valor adequado para formulacoes cosmeticas topicas, onde concentracoes de retinol de 0,1-1% sao tipicas no produto final. Se a mesma formulacao tentasse encapsular **niacinamida** (vitamina B3, logP = -0,37, hidrofila), a EE% cairia para 15-30%, pois a niacinamida tem afinidade pela fase aquosa e escapa durante a emulsificacao.

### Metodos diretos e indiretos de determinacao da EE%

Existem dois paradigmas para a determinacao experimental da EE%: o **metodo indireto** e o **metodo direto**. No **metodo indireto** (mais comum e mais facil de executar), determina-se a quantidade de ativo **nao encapsulado** (ativo livre na fase aquosa externa) e calcula-se a EE% por diferenca:

**EE% = [(ativo total adicionado - ativo livre) / ativo total adicionado] x 100**

A separacao do ativo livre dos nanovetores e realizada por tecnicas como: (i) **ultracentrifugacao** — a nanodispersao e centrifugada a alta velocidade (tipicamente 50.000-150.000 x g, 30-60 minutos, 4 graus Celsius em ultracentrifuga como Beckman Coulter Optima XPN-100), separando as nanoparticulas (pellet) do sobrenadante contendo o ativo livre; o sobrenadante e analisado por HPLC ou espectrofotometria UV-Vis para quantificar o ativo livre; (ii) **ultrafiltracao/centrifugacao** — a nanodispersao e colocada em dispositivos de ultrafiltracao com membrana de corte molecular (MWCO) definido (tipicamente 10-100 kDa, como Amicon Ultra, Millipore), centrifugados a 3.000-5.000 x g; o filtrado contem o ativo livre, que e quantificado; (iii) **dialise** — a nanodispersao e colocada em saco de dialise (MWCO 10-14 kDa) imerso em meio receptor; o ativo livre difunde atraves da membrana e e quantificado no meio externo; (iv) **cromatografia de exclusao por tamanho** (SEC/gel filtration) — as nanoparticulas eluem no volume morto e o ativo livre elui retardado, permitindo quantificacao separada.

No **metodo direto**, as nanoparticulas sao primeiro separadas (por ultracentrifugacao ou ultrafiltracao), depois o pellet de nanoparticulas e lisado (rompido) com solvente organico apropriado (metanol, acetonitrila, cloroformio, DMSO ou mistura destes) para liberar todo o ativo encapsulado, e a solucao resultante e quantificada por HPLC ou UV-Vis. O metodo direto e mais preciso, mas mais trabalhoso. A escolha entre os metodos depende da natureza do ativo, do tipo de nanovetor e da disponibilidade analitica. Para ativos com alta adsorcao a membranas ou com solubilidade limitada no meio aquoso, o metodo direto e preferivel para evitar subestimativa do ativo livre.

A tecnica analitica de quantificacao mais utilizada e a **cromatografia liquida de alta eficiencia** (HPLC, tipicamente fase reversa C18 com deteccao UV-Vis ou DAD), que oferece especificidade, sensibilidade e linearidade adequadas para a maioria dos ativos cosmeticos. Para ativos com cromoforos fracos ou ausentes, pode-se utilizar HPLC com detector ELSD (Evaporative Light Scattering Detector) ou espectrometria de massas (LC-MS). A espectrofotometria UV-Vis e uma alternativa mais simples e rapida, mas menos especifica (susceptivel a interferencia de excipientes absorventes).

- **Exemplo**: Um pesquisador determina a EE% de **acido alfa-lipoico** encapsulado em lipossomas de DPPC pelo metodo indireto por ultrafiltracao. Ele pipeta 500 microlitros da suspensao liposssomal em dispositivo Amicon Ultra-4 (MWCO 30 kDa), centrifuga a 4000 x g por 30 minutos e coleta o filtrado. O filtrado e analisado por HPLC (coluna C18, fase movel acetonitrila:agua:acido fosforico 50:49:1 v/v, deteccao UV 330 nm). A concentracao de acido alfa-lipoico no filtrado (ativo livre) e 0,18 mg/mL; a concentracao total adicionada foi 2,0 mg/mL. Portanto: EE% = [(2,0 - 0,18) / 2,0] x 100 = 91%. Paralelamente, pelo metodo direto, ele rompe os lipossomas do retentato com Triton X-100 (1% v/v) e quantifica o ativo liberado: 0,91 mg/mL no volume retido equivalente. Os resultados convergem, validando o metodo.

### Armadilhas analiticas e boas praticas

A determinacao da EE% esta sujeita a diversas **armadilhas analiticas** que o pesquisador avancado deve conhecer para evitar resultados falsos. A primeira e a **adsorcao do ativo na membrana de ultrafiltracao**. Ativos lipofilos (como retinol, tocoferol, curcumina) podem adsorver na membrana de celulose regenerada ou PES, reduzindo a concentracao aparente de ativo livre no filtrado e, consequentemente, superestimando a EE%. Para contornar esse problema, recomenda-se saturar previamente a membrana com solucao do ativo (3 passagens) ou utilizar o metodo direto.

A segunda armadilha e a **sedimentacao incompleta** durante a ultracentrifugacao. Nanoparticulas muito pequenas (< 50 nm) ou com densidade proxima a do meio podem nao sedimentar completamente a 100.000 x g, contaminando o sobrenadante com nanoparticulas e gerando superestimativa do ativo livre (e subestimativa da EE%). Nesse caso, aumentar a forca centrifuga (ate 300.000 x g, utilizando ultracentrifuga analitica) ou utilizar ultrafiltracao como alternativa e recomendado.

A terceira armadilha e a **liberacao do ativo durante a separacao**. Se o processo de separacao for demorado (como dialise overnight), o ativo pode ser liberado dos nanovetores durante a propria separacao, inflacionando a quantidade de ativo livre e subestimando a EE%. Para minimizar esse efeito, a separacao deve ser realizada rapidamente (ultracentrifugacao e ultrafiltracao sao preferivies a dialise para determinacao de EE%) e a temperatura deve ser controlada (tipicamente 4 graus Celsius para retardar a liberacao).

Boas praticas incluem: **validacao do metodo de separacao** com controle positivo (solucao do ativo sem nanoparticulas, para verificar recuperacao pela membrana) e controle negativo (nanoparticulas sem ativo, para verificar interferencia de excipientes); **ensaio de balanco de massa** (ativo encapsulado + ativo livre = ativo total adicionado, com tolerancia de 95-105%); e **reportar tanto EE% quanto LC%** em publicacoes e documentos de P&D, pois ambos os parametros sao necessarios para a avaliacao completa da formulacao.

- **Exemplo**: Um grupo de pesquisa reporta EE% de 98% para curcumina em NLS de palmitato de cetila. O revisor do artigo questiona o valor, pois e incomum para curcumina (que tende a se cristalizar na superficie das NLS). Ao investigar, descobre-se que o metodo indireto por ultrafiltracao foi usado, mas a recuperacao de curcumina pela membrana nao foi verificada. O teste de recuperacao (solucao de curcumina livre 0,5 mg/mL filtrada pelo mesmo dispositivo) mostra que apenas 35% da curcumina livre e recuperada no filtrado — os outros 65% adsorvem na membrana de PES. Ou seja, o ativo livre foi subestimado em 65%, e a EE% real e significativamente menor. Apos troca para membrana de celulose regenerada (recuperacao de 92%) e repeticao do ensaio, a EE% real e de 74%, nao 98%. Esse caso real ilustra por que a validacao da recuperacao pela membrana e obrigatoria.

---

## 2. Liberacao In Vitro: Celula de Franz e Modelos Cineticos

### Celula de difusao de Franz: principio e procedimento

O ensaio de **liberacao in vitro** quantifica a taxa e a extensao com que o ativo e liberado do nanovetor ao longo do tempo em condicoes controladas. O sistema experimental mais utilizado para formulacoes topicas e a **celula de difusao de Franz** (Franz diffusion cell), desenvolvida por Thomas J. Franz em 1975 e amplamente adotada em pesquisa e desenvolvimento de cosmeticos e dermofarmaceuticos. A celula de Franz e composta por dois compartimentos separados por uma **membrana**: o **compartimento doador** (superior), onde a formulacao e aplicada, e o **compartimento receptor** (inferior), preenchido com meio receptor sob agitacao magnetica e temperatura controlada (tipicamente 32 ou 37 graus Celsius para simular a superficie cutanea).

A formulacao contendo os nanovetores e aplicada sobre a membrana no compartimento doador (tipicamente 200-500 mg de formulacao semi-solida ou 200-500 microlitros de suspensao). O ativo liberado difunde atraves da membrana e se acumula no meio receptor, que e amostrado em intervalos de tempo pre-definidos (tipicamente 0,5; 1; 2; 4; 6; 8; 12; 24 horas) e reposto com meio receptor fresco para manter condicoes sink (concentracao do ativo no receptor sempre inferior a 10% da sua solubilidade de saturacao, garantindo que a concentracao no receptor nao limite a difusao). As aliquotas coletadas sao analisadas por HPLC ou UV-Vis para quantificar o ativo liberado, e o resultado e expresso como **quantidade acumulada de ativo liberado por unidade de area** (micrograma/cm2) em funcao do tempo.

Os equipamentos de celula de Franz mais utilizados sao sistemas manuais de 6-12 celulas (como os fabricados por **Hanson Research**, **Logan Instruments**, **PermeGear** e **Teledyne Instruments**) e sistemas automatizados como o **Hanson MicroettePlus** e o **Logan HDT-1000**, que realizam amostragem automatica com fracionador. A area de difusao tipica e de 0,64 a 1,77 cm2, e o volume do compartimento receptor e de 5 a 12 mL. A temperatura e mantida por capa de agua termostatizada conectada a banho circulante.

A escolha da **membrana** e critica e depende do objetivo do ensaio. Para ensaios de **liberacao** (quantificar a taxa de saida do ativo do nanovetor, sem componente de permeacao cutanea), utilizam-se membranas sinteticas: **celulose regenerada** (MWCO 12-14 kDa), **policarbonato** (poros de 50-400 nm), **PVDF** (difluoreto de polivinilideno) ou **polissulfona**. A membrana sintetica funciona apenas como barreira fisica para reter os nanovetores no compartimento doador, permitindo a passagem do ativo livre. Para ensaios de **permeacao cutanea** (que serao aprofundados no Modulo 5), utiliza-se **pele humana excisada** (dermatomed skin, 200-500 micrometros de espessura), **pele de porco** (ears/abdomen), **pele de rato sem pelo** ou **membranas biomimeticas** (como Strat-M, Merck Millipore).

- **Exemplo**: Um estudo de liberacao in vitro compara um gel convencional de acido kojico 2% com uma nanoemulsao de acido kojico 2% incorporada no mesmo gel. O ensaio utiliza celula de Franz (area 1,13 cm2, receptor 7 mL, membrana de celulose regenerada 12 kDa, meio receptor tampao fosfato pH 5,5 com 0,5% de Tween 20, 32 graus Celsius). Resultados apos 24 horas: o gel convencional libera 85% do acido kojico em 4 horas (liberacao rapida, tipo burst); a nanoemulsao no gel libera 82% do acido kojico em 24 horas, com perfil sustentado sem burst. A taxa de liberacao nas primeiras 2 horas e 3,5 vezes menor para a nanoemulsao, indicando que o ativo esta efetivamente retido nas goticulas e e liberado gradualmente por difusao. Esse perfil sustentado e desejavel para acido kojico, que causa irritacao cutanea quando liberado em alta concentracao rapidamente.

### Modelos cineticos de liberacao: ordem zero, Higuchi e Korsmeyer-Peppas

Os dados de liberacao in vitro (quantidade acumulada vs. tempo) sao ajustados a **modelos cineticos matematicos** para compreender o mecanismo de liberacao e prever o comportamento em prazos mais longos. Os tres modelos mais utilizados para nanovetores cosmeticos sao:

**Modelo de ordem zero**: Q = Q0 + k0.t, onde Q e a quantidade liberada, Q0 e a quantidade inicial (geralmente zero), k0 e a constante de taxa de ordem zero e t e o tempo. A liberacao de ordem zero e independente da concentracao restante no nanovetor — ou seja, a taxa de liberacao e constante ao longo do tempo. Esse perfil e o mais desejavel para liberacao controlada, pois garante concentracao constante do ativo na pele. E tipico de sistemas reservatorio (nanocapsulas com membrana polimerica espessa, sistemas transdermicos tipo patch) onde a membrana limita a taxa de difusao. O **coeficiente de determinacao** (R2) do ajuste linear de Q vs. t indica a aderencia ao modelo.

**Modelo de Higuchi**: Q = kH.t^0,5, onde kH e a constante de Higuchi. Derivado por Takeru Higuchi em 1961, este modelo descreve a liberacao por difusao fickiana de um ativo disperso em uma matriz homogenea (como uma nanoesfera polimerica ou uma NLS). As premissas incluem: (i) o ativo esta inicialmente distribuido uniformemente na matriz; (ii) a concentracao inicial do ativo e muito superior a sua solubilidade na matriz; (iii) a difusao e unidirecional; (iv) o tamanho da particula nao muda significativamente durante a liberacao. O grafico de Q vs. raiz quadrada do tempo (t^0,5) e linear se o modelo de Higuchi se aplica, e kH e a inclinacao da reta. A linearidade nesse grafico e evidencia de que a difusao fickiana e o mecanismo dominante de liberacao.

**Modelo de Korsmeyer-Peppas** (modelo da lei de potencia): Q/Q_infinito = kKP.t^n, onde Q/Q_infinito e a fracao liberada, kKP e a constante cinetica e n e o **expoente de liberacao** (ou expoente difusional). Este modelo, proposto por Korsmeyer et al. (1983) e Peppas (1985), e o mais informativo mecanisticamente, pois o valor de n indica o mecanismo predominante: **n = 0,43** (para esferas) indica **difusao fickiana** pura (caso I); **n = 0,85** (para esferas) indica **transporte caso II** (relaxacao da cadeia polimerica controla a liberacao); **0,43 < n < 0,85** indica **transporte anomalo** (combinacao de difusao e relaxacao); **n > 0,85** indica **super-caso II**. Para geometrias nao esfericas (cilindros, filmes), os valores limites de n diferem (consultar tabela de Ritger-Peppas). O modelo deve ser aplicado apenas a fracao de liberacao de 0 a 60% (Q/Q_infinito < 0,6) para garantir validade matematica.

Na pratica, os dados experimentais sao ajustados aos tres modelos (e opcionalmente a modelo de primeira ordem: Q = Q_infinito x [1 - e^(-k1.t)]) e os valores de R2 (ou, preferencialmente, R2 ajustado e AIC — Criterio de Informacao de Akaike) sao comparados para selecionar o modelo que melhor descreve o mecanismo. Softwares como **DDSolver** (plugin gratuito para Excel), **KinetDS**, **GraphPad Prism** e **OriginPro** facilitam o ajuste multimodelo.

- **Exemplo**: Nanocapsulas de PLGA (acido poli(lactico-co-glicolico)) encapsulando **alfa-tocoferol** sao submetidas a ensaio de liberacao em celula de Franz (membrana policarbonato 400 nm, meio receptor etanol:agua 30:70 v/v, 37 graus Celsius). Os dados de 0-24 horas sao ajustados aos tres modelos: ordem zero (R2 = 0,923), Higuchi (R2 = 0,987) e Korsmeyer-Peppas (R2 = 0,994, n = 0,51). O modelo de Korsmeyer-Peppas apresenta o melhor ajuste, e o expoente n = 0,51 (entre 0,43 e 0,85 para esferas) indica **transporte anomalo** — a liberacao e controlada por difusao fickiana do tocoferol atraves da matriz de PLGA combinada com relaxacao/erosao das cadeias polimericas. Essa informacao e valiosa para o formulador: se desejar retardar ainda mais a liberacao, pode aumentar a massa molecular do PLGA (reduzindo a contribuicao de erosao) ou aumentar a espessura da parede polimerica.

### Condicoes sink e selecao do meio receptor

A manutencao de **condicoes sink** e um requisito fundamental para a validade do ensaio de liberacao in vitro. Condicao sink significa que a concentracao do ativo no meio receptor nunca ultrapassa 10-30% de sua solubilidade de saturacao naquele meio, garantindo que a forca motriz de difusao nao seja limitada pelo acumulo de ativo no receptor. Para ativos hidrofilos (como niacinamida, acido ascorbico, acido hialuronico de baixo PM), a condicao sink e facilmente mantida com tampao aquoso. Para ativos lipofilos (como retinol, tocoferol, coenzima Q10, curcumina), a solubilidade em meio aquoso e muito baixa, e a condicao sink so e atingida adicionando-se solubilizantes ao meio receptor: **surfactantes** (Tween 20 ou 80 a 0,5-2%, SDS a 0,5-1%), **ciclodextrinas** (beta-ciclodextrina ou HP-beta-CD a 1-5%) ou **co-solventes** (etanol a 20-40%, PEG 400 a 10-20%).

A escolha do meio receptor deve equilibrar: (i) manutencao de condicao sink; (ii) compatibilidade com o metodo analitico (HPLC); (iii) compatibilidade com a membrana (solventes organicos podem danificar membranas de celulose); (iv) ausencia de interacao com os nanovetores (surfactantes no meio receptor podem solubilizar os nanovetores, gerando liberacao artefatual). O **pH** do meio receptor deve simular a superficie cutanea (pH 5,0-5,5) ou o fluido intersticial dermico (pH 7,4), dependendo do objetivo do estudo. Guias como o **SCCS Notes of Guidance** e o **FDA Guidance on SUPAC-SS** fornecem recomendacoes sobre meios receptores para diferentes classes de ativos.

- **Exemplo**: Um pesquisador tenta realizar ensaio de liberacao de curcumina (solubilidade em agua: ~0,0004 mg/mL) de NLC em celula de Franz com tampao fosfato pH 7,4 como meio receptor. Apos 24 horas, a quantidade de curcumina detectada no receptor e insignificante (< LOQ), nao porque a curcumina nao foi liberada, mas porque sua solubilidade no meio aquoso e tao baixa que a condicao sink nunca foi satisfeita — a curcumina liberada precipita na interface da membrana. Ao trocar o meio receptor para tampao fosfato pH 7,4 contendo 2% de Tween 80 (solubilidade da curcumina aumenta para ~0,5 mg/mL), a liberacao acumulada em 24 horas atinge 45% da dose aplicada, com perfil cinetico interpretavel e ajuste adequado ao modelo de Higuchi (R2 = 0,991).

---

## 3. Estabilidade: Protocolos Acelerados, Longa Duracao e Freeze-Thaw

### Estabilidade acelerada (40 graus Celsius / 75% UR)

Os estudos de **estabilidade acelerada** avaliam o comportamento da formulacao sob condicoes de estresse termico e de umidade que aceleram os processos de degradacao, permitindo prever — em semanas ou meses — fenomenos que ocorreriam em anos sob condicoes normais de armazenamento. O protocolo mais difundido segue as diretrizes do **ICH Q1A(R2)** (International Council for Harmonisation), adaptado pela **ANVISA** (RE n. 1/2005 e Guia de Estabilidade de Produtos Cosmeticos, 2004) para produtos cosmeticos. As condicoes padrao para estabilidade acelerada de produtos cosmeticos na zona climatica IV (Brasil) sao:

**Temperatura: 40 +/- 2 graus Celsius**
**Umidade relativa: 75 +/- 5% UR**
**Duracao: 6 meses (com coletas em 0, 1, 2, 3 e 6 meses)**

As amostras sao acondicionadas em embalagens primarias definitivas (ou embalagens simuladas) e armazenadas em camaras climaticas (como Binder KBF 240, Votsch VC 4034, Nova Etica 420-CLD). Os parametros monitorados em cada coleta para nanocosmeticos incluem: **aspecto visual** (cor, odor, separacao de fases, precipitacao); **pH**; **viscosidade**; **tamanho de particula** (z-average e PDI por DLS); **potencial zeta**; **EE%** (para verificar liberacao ou degradacao do ativo durante armazenamento); **teor do ativo** (por HPLC, para verificar degradacao quimica); e **contagem microbiologica** (para verificar eficacia do sistema conservante). Para NLS e NLC, os parametros adicionais incluem **DSC** (para detectar transicao polimorfica) e **XRD** (quando indicado).

Os criterios de aceitacao para estabilidade acelerada variam conforme a empresa e o tipo de produto, mas criterios tipicos incluem: variacao de z-average inferior a 10-15% em relacao ao T0; PDI mantendo-se abaixo de 0,3-0,4; variacao de potencial zeta inferior a 20% em modulo; variacao de teor de ativo inferior a 5-10%; ausencia de separacao de fases macroscopica; pH dentro de +/- 0,5 unidades do T0; e contagem microbiologica dentro dos limites da RDC 481/1999 (ANVISA). Se o produto falha no estudo acelerado, e necessario investigar a causa raiz (degradacao quimica, instabilidade coloidal, crescimento microbiano) e reformular antes de prosseguir para estudos de longa duracao.

- **Exemplo**: Uma nanoemulsao de oleo de pracaxi contendo filtro solar organico (octocrileno 5%) e submetida a estabilidade acelerada (40 graus Celsius / 75% UR, 6 meses). Resultados: no T0, z-average = 155 nm, PDI = 0,18, zeta = -38 mV, teor de octocrileno = 100,2% (referencia). No T3 (3 meses), z-average = 162 nm, PDI = 0,21, zeta = -35 mV, teor = 97,8%. No T6 (6 meses), z-average = 178 nm, PDI = 0,26, zeta = -31 mV, teor = 94,1%. Todos os parametros permanecem dentro dos criterios de aceitacao (z-average variou 14,8%, PDI < 0,30, teor > 90%, sem separacao de fases). A formulacao e considerada aprovada no estudo acelerado e pode prosseguir para estudo de longa duracao com expectativa positiva de shelf life de 24 meses ou mais.

### Estabilidade de longa duracao e ciclo freeze-thaw

O estudo de **estabilidade de longa duracao** (shelf life study, long-term stability) avalia o produto sob condicoes normais de armazenamento por todo o periodo de validade pretendido. As condicoes padrao para a zona climatica IV (Brasil, ICH/ANVISA) sao:

**Temperatura: 30 +/- 2 graus Celsius**
**Umidade relativa: 65 +/- 5% UR (ou 75 +/- 5% UR, conforme a zona)**
**Duracao: igual ou superior ao prazo de validade declarado (tipicamente 24 ou 36 meses)**
**Coletas: 0, 3, 6, 9, 12, 18, 24 (e 36) meses**

O estudo de longa duracao e o estudo definitivo que suporta o prazo de validade declarado na rotulagem. Porem, como exige tempo real de armazenamento, empresas utilizam o estudo acelerado para tomada de decisao provisoria (lancamento do produto) e iniciam o estudo de longa duracao simultaneamente. Se o produto passar no acelerado (6 meses) e no longa duracao (pelo menos 12 meses sem tendencia de degradacao), o prazo de validade provisorio e confirmado.

O ensaio de **ciclo freeze-thaw** (congelamento-descongelamento) avalia a resistencia da formulacao a choques termicos extremos, simulando situacoes de transporte e armazenamento em condicoes adversas. O protocolo tipico envolve ciclos alternados de **-5 graus Celsius (ou -10 graus Celsius) por 24 horas** seguidos de **40 graus Celsius (ou 45 graus Celsius) por 24 horas**, repetidos por **6 ciclos** (12 dias). Para nanovetores cosmeticos, o freeze-thaw e um teste particularmente desafiador, pois o congelamento pode: (i) **romper membranas lipossomais** pela formacao de cristais de gelo intra e extralipossomal; (ii) **desestabilizar nanoemulsoes** por coalescencia das goticulas na interface gelo-oleo; (iii) **agregar nanoparticulas** pela compressao durante a formacao de gelo; (iv) **causar separacao de fases** em sistemas semisolidos (geis, cremes) pela migracao de agua.

Os parametros monitorados apos cada ciclo (ou apos 3 e 6 ciclos) incluem os mesmos do estudo acelerado: aspecto, pH, tamanho, PDI, potencial zeta e teor. Para lipossomas, a EE% apos freeze-thaw e particularmente informativa — uma queda superior a 20% indica perda de integridade da bicamada. A adicao de **crioprotetores** — como **trealose** (5-10% m/v), **sacarose** (5-10% m/v), **glicerol** (5-20% m/v) ou **PEG 400** (5-10% m/v) — pode mitigar os danos do congelamento. A trealose, em particular, e amplamente utilizada para liofilizacao de lipossomas, pois forma uma matriz vitrea ao redor das vesiculas que substitui a agua de hidratacao e preserva a estrutura da bicamada durante a desidratacao e a reidratacao.

- **Exemplo**: Lipossomas unilamelares de fosfatidilcolina de soja encapsulando acido ferulico sao submetidos a 6 ciclos de freeze-thaw (-10 graus Celsius / 45 graus Celsius). Sem crioprotetor: apos 6 ciclos, z-average aumenta de 105 nm para 380 nm (agregacao massiva), PDI sobe para 0,65 e EE% cai de 78% para 31% (ruptura das vesiculas e vazamento do ativo). Com trealose 10% (m/v): apos 6 ciclos, z-average = 118 nm, PDI = 0,22, EE% = 71%. A trealose reduziu a perda de EE% de 47 pontos percentuais para 7 pontos percentuais, demonstrando eficacia criioprotetora notavel. Esse resultado e determinante para a viabilidade comercial do produto em regioes de clima frio ou para transporte aereo (compartimento de carga com temperaturas abaixo de zero).

### Determinacao de shelf life e relacao com estudos de estabilidade

O **shelf life** (prazo de validade) de um nanocosmetico e definido como o periodo durante o qual o produto mantem suas especificacoes de qualidade, seguranca e eficacia quando armazenado nas condicoes declaradas. A determinacao do shelf life baseia-se nos dados dos estudos de estabilidade e segue o principio de que o produto deve permanecer dentro das especificacoes durante todo o prazo declarado. A extrapolacao dos dados de estabilidade acelerada para prever o shelf life em condicoes normais pode ser realizada pela **equacao de Arrhenius** (para degradacao quimica que segue cinetica termica):

**k = A . e^(-Ea/RT)**

onde k e a constante de taxa de degradacao, A e o fator pre-exponencial, Ea e a energia de ativacao, R e a constante dos gases e T e a temperatura absoluta. Medindo-se k em pelo menos tres temperaturas (por exemplo, 30, 40 e 50 graus Celsius), pode-se estimar Ea e extrapolar k para a temperatura de armazenamento (25 ou 30 graus Celsius), prevendo o tempo necessario para atingir o limite de especificacao (tipicamente 90% do teor inicial — criterio t90).

Para nanovetores cosmeticos, porem, a degradacao nao e puramente quimica — processos fisicos como **maturacao de Ostwald** (crescimento das particulas maiores a expensas das menores), **coalescencia**, **floculacao**, **sedimentacao** e **transicao polimorfica** sao frequentemente os fatores limitantes do shelf life, e esses processos nao seguem necessariamente a cinetica de Arrhenius. Nesses casos, a modelagem do crescimento de particulas ao longo do tempo (por exemplo, modelo de Lifshitz-Slyozov-Wagner para maturacao de Ostwald) ou o monitoramento empirico do z-average em funcao do tempo sao abordagens mais adequadas. Na pratica industrial, o shelf life e determinado conservadoramente com base nos dados reais de estabilidade de longa duracao, sendo o estudo acelerado utilizado para decisao preliminar, nao definitiva.

O **PAO** (Period After Opening) — simbolizado pelo icone de pote aberto na rotulagem — indica o prazo de uso apos a primeira abertura da embalagem. Para nanocosmeticos, o PAO pode ser mais restritivo que o shelf life total, pois a exposicao ao ar, a contaminacao microbiologica e a oxidacao sao aceleradas apos a abertura. O PAO e determinado por ensaios de estabilidade em uso (in-use stability), onde o produto e aberto e amostrado repetidamente, simulando o uso pelo consumidor.

- **Exemplo**: Uma empresa determina o shelf life de uma NLC de vitamina C (acido ascorbico palmitato) para serum facial. O estudo acelerado (40 graus Celsius / 75% UR, 6 meses) mostra que o teor de vitamina C cai de 100% (T0) para 91,3% (T6) — dentro da especificacao de 90%. O estudo de longa duracao (30 graus Celsius / 65% UR) mostra: T0 = 100%, T6 = 96,2%, T12 = 93,5%, T18 = 90,8%, T24 = 87,6%. O teor cruza o limite de 90% entre T18 e T24. Pela cinetica de primeira ordem ajustada aos dados, o t90 calculado e de 20,5 meses a 30 graus Celsius. A empresa declara shelf life conservador de 18 meses. O z-average permanece estavel (variacao < 8%) ao longo de 24 meses, confirmando que a instabilidade limitante e quimica (degradacao oxidativa do acido ascorbico), nao fisica (agregacao). Para estender o shelf life, o formulador pode considerar: embalagem a vacuo ou com atmosfera de nitrogenio, adicao de antioxidantes (BHT 0,01%, EDTA 0,05%) ou encapsulacao da propria vitamina C em dupla camada (NLC dentro de lipossoma — nanoparticula-em-lipossoma, NIL).

---

## Conclusao

Nesta aula, completamos o tripe de caracterizacao de nanovetores cosmeticos abordando os parametros que conectam a fisico-quimica ao desempenho funcional. Compreendemos que a EE% e a LC% quantificam a eficiencia do processo de encapsulacao, mas que sua determinacao requer cuidado analitico rigoroso para evitar artefatos — especialmente a adsorcao na membrana de ultrafiltracao e a liberacao durante a separacao. Dominamos o ensaio de liberacao in vitro em celula de Franz, desde a selecao da membrana e do meio receptor ate a manutencao de condicoes sink, e aprendemos a interpretar mecanisticamente os perfis de liberacao pelos modelos de ordem zero, Higuchi e Korsmeyer-Peppas. Finalmente, exploramos os protocolos de estabilidade acelerada, de longa duracao e de freeze-thaw como ferramentas essenciais para prever e documentar o shelf life do produto final. O formulador de nanocosmeticos que integra dados de EE%, liberacao e estabilidade com os dados de tamanho, potencial zeta, morfologia e estado solido (aulas 4.1 e 4.2) possui um dosie analitico completo para tomada de decisao em P&D, escalonamento e registro regulatorio.

---

## Licao de Casa

1. Um pesquisador reporta EE% de 96% para curcumina em NLS de trimiristina, determinada pelo metodo indireto por ultrafiltracao (Amicon Ultra, MWCO 30 kDa, membrana PES). Porem, nao apresenta dados de recuperacao da membrana. Projete um experimento completo de validacao do metodo de determinacao de EE%: inclua o teste de recuperacao da membrana (controle positivo), o controle negativo (interferencia de excipientes), o teste de balanco de massa e um metodo alternativo (direto) para confirmar o resultado. Justifique cada etapa.

2. Os dados de liberacao in vitro de uma nanocapsula de PCL contendo cafeina (celula de Franz, membrana policarbonato 400 nm, PBS pH 7,4, 32 graus Celsius) sao: 0,5h: 8%; 1h: 14%; 2h: 22%; 4h: 35%; 6h: 44%; 8h: 51%; 12h: 62%; 24h: 78%. Ajuste esses dados aos modelos de ordem zero, Higuchi e Korsmeyer-Peppas (utilize Q/Q_infinito ate 0,6, ou seja, ate ~12h). Calcule R2 para cada modelo, determine o expoente n de Korsmeyer-Peppas e interprete o mecanismo de liberacao predominante. Utilize software de sua escolha (DDSolver, Excel, OriginPro).

3. Elabore um protocolo completo de estudo de estabilidade (acelerada + longa duracao + freeze-thaw) para uma nanoemulsao de oleo de rosa mosqueta contendo retinol 0,5% destinada a um serum facial com prazo de validade pretendido de 24 meses. Inclua: condicoes de armazenamento, cronograma de coletas, parametros monitorados, criterios de aceitacao para cada parametro e acoes a serem tomadas em caso de desvio. Justifique a escolha do meio receptor para o ensaio de liberacao in vitro incluido no estudo de estabilidade.

---

## Proxima Aula

Na proxima aula, iniciaremos o Modulo 5 — Permeacao Cutanea e Direcionamento de Ativos — abordando a estrutura da barreira cutanea, as rotas de permeacao (intercelular, transcelular e transfolicular) e como as propriedades dos nanovetores (tamanho, carga, deformabilidade) influenciam a penetracao de ativos na pele. Conectaremos todo o conhecimento de caracterizacao adquirido no Modulo 4 com a funcionalidade real do nanovetor no orgao-alvo — a pele. Ate la!

---

## Links para aprofundamento

1. [Dash, S. et al. (2010). Kinetic modeling on drug release from controlled drug delivery systems. Acta Poloniae Pharmaceutica — Drug Research, 67(3), 217-223](http://www.ptfarm.pl/pub/File/Acta_Poloniae/2010/3/217.pdf)
2. [ANVISA — Guia de Estabilidade de Produtos Cosmeticos (2004)](https://www.gov.br/anvisa/pt-br/centraisdeconteudo/publicacoes/cosmeticos/manuais-e-guias/guia-de-estabilidade-de-cosmeticos.pdf)
3. [ICH Q1A(R2) — Stability Testing of New Drug Substances and Products](https://www.ich.org/page/quality-guidelines)
4. [Franz, T.J. (1975). Percutaneous absorption — On the relevance of in vitro data. Journal of Investigative Dermatology, 64(3), 190-195](https://doi.org/10.1111/1523-1747.ep12533356)
5. [Siepmann, J. & Peppas, N.A. (2011). Higuchi equation: Derivation, applications, use and misuse. International Journal of Pharmaceutics, 418(1), 6-12](https://doi.org/10.1016/j.ijpharm.2011.03.051)

---

## Questionario

**1. Qual e a diferenca fundamental entre eficiencia de encapsulacao (EE%) e capacidade de carga (LC%)?**

a) EE% e LC% sao sinonimos e medem a mesma grandeza — a quantidade de ativo no nanovetor
b) EE% quantifica a fracao do ativo adicionado que foi encapsulada (referencia: ativo total adicionado), enquanto LC% quantifica a fracao de ativo em relacao a massa total do nanovetor seco (referencia: massa do nanovetor)
c) EE% se aplica apenas a nanovetores lipidicos e LC% se aplica apenas a nanovetores polimericos
d) EE% e determinada por metodo direto e LC% e determinada exclusivamente por metodo indireto

**Resposta: b**

**2. Por que a adsorcao do ativo na membrana de ultrafiltracao pode gerar superestimativa da EE% no metodo indireto?**

a) Porque a adsorcao na membrana aumenta a concentracao de ativo no filtrado, inflacionando o valor de ativo livre e reduzindo a EE% calculada
b) Porque a adsorcao na membrana reduz a concentracao aparente de ativo livre no filtrado, fazendo parecer que menos ativo esta livre do que realmente esta, e portanto superestimando a EE% calculada por diferenca
c) Porque a adsorcao na membrana modifica quimicamente o ativo, tornando-o indetectavel por HPLC
d) Porque a adsorcao na membrana rompe as nanoparticulas, liberando ativo adicional no filtrado

**Resposta: b**

**3. No modelo de Korsmeyer-Peppas aplicado a nanoparticulas esfericas, um expoente de liberacao n = 0,65 indica qual mecanismo?**

a) Difusao fickiana pura (caso I), onde a difusao do ativo atraves da matriz e o unico mecanismo de liberacao
b) Transporte caso II, onde a relaxacao da cadeia polimerica controla exclusivamente a taxa de liberacao
c) Transporte anomalo, indicando que tanto a difusao fickiana quanto a relaxacao/erosao da matriz polimerica contribuem simultaneamente para a liberacao
d) Super-caso II, indicando que a erosao superficial e o mecanismo dominante e a difusao e desprezivel

**Resposta: c**

**4. Qual e a principal funcao das condicoes sink no ensaio de liberacao in vitro em celula de Franz?**

a) Garantir que a formulacao no compartimento doador permaneca saturada de ativo durante todo o ensaio
b) Manter a concentracao do ativo no meio receptor sempre abaixo de 10-30% de sua solubilidade de saturacao, garantindo que a taxa de difusao nao seja limitada pelo acumulo de ativo no receptor e que a forca motriz de difusao seja mantida
c) Assegurar que a membrana sintetica permaneca impermeavel durante todo o ensaio
d) Simular as condicoes exatas de pH e temperatura da pele humana in vivo

**Resposta: b**

**5. Um estudo de estabilidade de longa duracao (30 graus Celsius / 65% UR) de uma NLC encapsulando retinol mostra que o z-average permanece estavel (variacao < 5%) ao longo de 24 meses, mas o teor de retinol cai de 100% para 85% no T24. Qual e a interpretacao mais adequada e a implicacao para o shelf life?**

a) A formulacao e completamente instavel e deve ser descartada, pois qualquer perda de teor e inaceitavel
b) A instabilidade limitante e fisica (agregacao das nanoparticulas), e a troca de surfactante resolveria o problema de perda de teor
c) A instabilidade limitante e quimica (degradacao do retinol, provavelmente oxidativa ou fotolitica), nao fisica, e o shelf life baseado no criterio t90 (90% do teor) e inferior a 24 meses; estrategias como embalagem com atmosfera inerte, adicao de antioxidantes ou protecao contra luz devem ser consideradas para estender o prazo
d) O resultado indica que a NLC nao encapsula efetivamente o retinol, e a formulacao deve ser redesenhada com outro tipo de nanovetor

**Resposta: c**
