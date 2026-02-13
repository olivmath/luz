# Aula 4.1: Tamanho, Distribuicao e Potencial Zeta

## Abertura

Bem-vindo a aula 4.1 do Modulo 4 — Caracterizacao e Controle de Qualidade. Nesta aula, vamos dominar as tecnicas analiticas fundamentais para a determinacao do tamanho de particula, da distribuicao de tamanhos e do potencial zeta de nanovetores cosmeticos. O aluno que concluiu os modulos anteriores ja compreende os principios de formulacao de nanoparticulas lipidicas solidas (NLS), carreadores lipidicos nanoestruturados (NLC), lipossomas e nanocapsulas polimericas. Agora, daremos um passo essencial: aprender a medir, interpretar e validar os parametros fisico-quimicos que determinam se uma formulacao nanoestruturada atende aos criterios de qualidade para P&D e escalonamento industrial. Sem caracterizacao adequada, nenhuma formulacao nanocosmeceutica pode ser reproduzida, otimizada ou regulatoriamente aprovada. As tecnicas que veremos aqui — **DLS**, **NTA** e **difracao a laser** — constituem o nucleo analitico de qualquer laboratorio de nanotecnologia cosmetica.

### Programa da aula:

1. Espalhamento de luz dinamico (DLS) — principio fisico, preparo de amostra e interpretacao do indice de polidispersidade (PDI)
2. Potencial zeta — definicao, mobilidade eletroforetica e correlacao com estabilidade coloidal
3. Analise de rastreamento de nanoparticulas (NTA) e difracao a laser — contagem particula a particula e distribuicao volumetrica

---

## 1. Espalhamento de Luz Dinamico (DLS) e Indice de Polidispersidade (PDI)

### Principio fisico do DLS

O **espalhamento de luz dinamico** (Dynamic Light Scattering, DLS), tambem denominado **espectroscopia de correlacao de fotons** (Photon Correlation Spectroscopy, PCS), e a tecnica mais amplamente empregada para a determinacao do diametro hidrodinamico de nanoparticulas em suspensao. O principio fisico baseia-se no **movimento browniano**: particulas dispersas em um meio liquido movem-se aleatoriamente devido as colisoes com moleculas do solvente, e a velocidade desse movimento e inversamente proporcional ao tamanho da particula. Particulas menores difundem mais rapidamente; particulas maiores, mais lentamente. O DLS ilumina a amostra com um feixe de laser monocromatico (tipicamente He-Ne a 633 nm ou laser de estado solido a 532 nm) e detecta as flutuacoes temporais da intensidade da luz espalhada pelas particulas em movimento. Essas flutuacoes sao analisadas por uma funcao de autocorrelacao, que decai exponencialmente com uma constante de tempo proporcional ao **coeficiente de difusao translacional** (D) das particulas.

A partir do coeficiente de difusao, aplica-se a **equacao de Stokes-Einstein** para calcular o diametro hidrodinamico (dH):

**dH = kBT / (3 pi eta D)**

onde kB e a constante de Boltzmann (1,381 x 10^-23 J/K), T e a temperatura absoluta (K), eta e a viscosidade do meio dispersante (Pa.s) e D e o coeficiente de difusao (m2/s). O diametro obtido pelo DLS nao e o diametro geometrico real da particula, mas sim o diametro de uma esfera hipotetica que teria o mesmo coeficiente de difusao no mesmo meio — ou seja, inclui a camada de solvatacao, surfactantes adsorvidos e quaisquer moleculas ligadas a superficie. Essa distincao e fundamental: uma nanoparticula lipidica de 150 nm com uma coroa de polissorbato 80 pode apresentar dH de 180-200 nm por DLS, enquanto sua dimensao geometrica por microscopia eletronica e significativamente menor.

Os equipamentos de DLS mais utilizados em laboratorios de nanotecnologia cosmetica incluem o **Zetasizer Nano ZS** (Malvern Panalytical), o **Litesizer 500** (Anton Paar), o **NanoBrook Omni** (Brookhaven Instruments) e o **DelsaMax Pro** (Beckman Coulter). O Zetasizer Nano ZS e, de longe, o instrumento mais citado na literatura de nanococsmeticos, operando com detector de retrodifusao a 173 graus (NIBS — Non-Invasive Back-Scatter), o que permite a analise de amostras concentradas sem diluicao excessiva. A faixa tipica de medicao do DLS e de 0,3 nm a 10 micrometros, embora a precisao seja maxima na janela de 10-1000 nm, exatamente a faixa relevante para nanovetores cosmeticos.

- **Exemplo**: Uma formulacao de NLC contendo retinol apresenta, apos preparo por homogeneizacao a alta pressao (1500 bar, 5 ciclos), diametro hidrodinamico medio de 185 nm medido por DLS a 25 graus Celsius em cubeta descartavel DTS0012 (Malvern). A amostra foi diluida 1:100 em agua ultrapura filtrada (0,22 micrometros) e equilibrada por 120 segundos antes da medicao. O resultado reportado — z-average de 185 nm — refere-se a media harmonica ponderada pela intensidade, e nao a media aritmetica das particulas. Esse valor esta dentro da faixa alvo de 100-300 nm para NLCs de uso topico, indicando que a formulacao tem potencial para permeacao cutanea eficiente.

### Preparo de amostra para DLS e erros comuns

O preparo de amostra e o fator que mais influencia a qualidade e a reprodutibilidade das medicoes de DLS. Erros de preparo sao a principal causa de resultados artefatuais na caracterizacao de nanovetores cosmeticos. As boas praticas incluem: (i) **diluicao adequada** — a concentracao da amostra deve ser tal que evite espalhamento multiplo, tipicamente entre 0,01% e 0,1% (m/v) para a maioria dos nanovetores lipidicos, embora equipamentos com detector de retrodifusao tolerem concentracoes maiores; (ii) **filtragem do diluente** — a agua ou o tampao utilizados para diluicao devem ser filtrados com membrana de 0,22 micrometros ou 0,1 micrometro para eliminar contaminantes particulados que geram picos artefatuais; (iii) **ausencia de bolhas** — bolhas de ar na cubeta espalham luz intensamente e geram picos em diametros de micrometros, arruinando a medicao; (iv) **equilibrio termico** — a amostra deve atingir equilibrio termico com o compartimento do equipamento (geralmente 25 graus Celsius) antes da medicao, pois a viscosidade do solvente e fortemente dependente da temperatura e afeta diretamente o calculo pela equacao de Stokes-Einstein; (v) **cubetas limpas** — residuos de amostras anteriores na cubeta de quartzo ou arranhoes em cubetas descartaveis geram espalhamento parasita.

Um erro particularmente comum em laboratorios de cosmeticos e a **diluicao em solvente incompativel**. Por exemplo, nanoparticulas estabilizadas com surfactante nao ionico diluidas em solucao salina concentrada podem flocular, gerando distribuicao bimodal artefatual. Outro erro frequente e a **agregacao induzida por filtragem**: ao filtrar a propria nanodispersao com membrana de 0,22 micrometros, particulas maiores que 220 nm sao retidas, gerando uma distribuicao falsamente estreita e sub-representando a populacao real. A filtragem deve ser aplicada apenas ao diluente, nunca a amostra. Recomenda-se tambem realizar no minimo tres medicoes independentes (cada uma composta de 10-15 corridas automaticas) e reportar media e desvio padrao do z-average e do PDI.

- **Exemplo**: Um pesquisador esta medindo o tamanho de lipossomas de fosfatidilcolina de soja encapsulando vitamina C. Na primeira medicao, obtem z-average de 320 nm e PDI de 0,58. Suspeitando de contaminacao, ele filtra a agua ultrapura utilizada como diluente com membrana de 0,1 micrometro, limpa a cubeta com etanol e ar comprimido, e prepara nova diluicao 1:200. Na segunda medicao, obtem z-average de 142 nm e PDI de 0,18 — valores consistentes com lipossomas extrusados. O primeiro resultado era artefato de poeira no diluente, que gerava um pico espurio em 2-5 micrometros e inflacionava tanto o z-average quanto o PDI.

### Indice de polidispersidade (PDI): significado e valores aceitaveis

O **indice de polidispersidade** (PDI, tambem grafado PdI) e um parametro adimensional derivado da analise cumulante da funcao de autocorrelacao do DLS, que quantifica a largura da distribuicao de tamanhos. Matematicamente, o PDI corresponde ao segundo momento normalizado (mu2/Gamma^2) do ajuste cumulante, onde Gamma e a taxa media de decaimento da funcao de autocorrelacao. O PDI varia de 0 (distribuicao perfeitamente monodispersa, teoricamente impossivel para sistemas coloidais reais) a 1 (distribuicao extremamente larga ou multimodal). Na pratica, valores ate 0,7 sao considerados computaveis pela maioria dos softwares de DLS; acima disso, o resultado e pouco confiavel.

Para nanovetores cosmeticos, a literatura e a pratica industrial estabelecem as seguintes faixas de referencia: **PDI < 0,1** indica distribuicao altamente monodispersa, tipica de nanoesferas de ouro ou particulas de calibracao de poliestireno; **PDI entre 0,1 e 0,25** e considerado aceitavel para a maioria das formulacoes nanoestruturadas (NLS, NLC, nanoemulsoes), indicando distribuicao relativamente estreita; **PDI entre 0,25 e 0,40** indica distribuicao moderadamente larga, aceitavel para lipossomas multilamelares ou nanocapsulas; **PDI > 0,40** sugere populacao heterogenea, potencialmente indicando agregacao, maturacao de Ostwald ou falha no processo de producao. Em contexto regulatorio, a ANVISA e a FDA nao estipulam valores especificos de PDI para nanocosmeticos, mas documentos orientadores da SCCS (Scientific Committee on Consumer Safety) da Uniao Europeia recomendam que formulacoes nanoestruturadas apresentem PDI inferior a 0,3 para serem consideradas suficientemente homogeneas.

A interpretacao do PDI deve sempre ser contextualizada com o correlogramma (grafico da funcao de autocorrelacao). Um PDI de 0,20 com correlogramma de decaimento suave e unimodal e substancialmente diferente de um PDI de 0,20 com correlogramma apresentando inflexoes, que sugere populacoes distintas mascaradas pela media cumulante. O formulador experiente sempre analisa o correlogramma, a distribuicao por intensidade, a distribuicao por volume e a distribuicao por numero simultaneamente. Discrepancias entre essas tres distribuicoes sinalizam presenca de subpopulacoes com tamanhos muito distintos.

- **Exemplo**: Um lote de NLS de acido estearico encapsulando coenzima Q10, produzido por microemulsificacao a quente, apresenta z-average de 210 nm e PDI de 0,32. A distribuicao por intensidade mostra dois picos: um dominante em 180 nm e outro secundario em 1200 nm. A distribuicao por numero, porem, mostra apenas o pico em 180 nm, indicando que o pico em 1200 nm corresponde a uma populacao numericamente insignificante de agregados, mas que domina a intensidade de espalhamento (pela sexta potencia do diametro, segundo a teoria de Rayleigh). O formulador conclui que o lote e aceitavel para estagio de P&D, mas que a presenca de agregados deve ser eliminada (por filtragem em membrana de 0,8 micrometro ou por ajuste do processo) antes do escalonamento.

---

## 2. Potencial Zeta e Estabilidade Coloidal

### Definicao de potencial zeta e dupla camada eletrica

O **potencial zeta** (zeta, simbolizado por z ou zeta) e o potencial eletrico no plano de cisalhamento hidrodinamico de uma particula dispersa em meio liquido. Para compreende-lo, e necessario entender o modelo de **dupla camada eletrica** (modelo de Stern-Gouy-Chapman). Quando uma nanoparticula e dispersa em meio aquoso, sua superficie adquire carga — seja por ionizacao de grupos funcionais superficiais (como carboxilatos em NLS de acido estearico, que se desprotonizam gerando carga negativa), seja por adsorcao preferencial de ions do meio, seja pela presenca de surfactantes ionicos na camada de revestimento. Essa carga superficial atrai contraions do meio, formando uma camada compacta de ions firmemente adsorvidos (camada de Stern) e uma camada difusa de ions com concentracao decrescente (camada de Gouy-Chapman). O potencial eletrico decai desde a superficie da particula (potencial de superficie, psi_0) atraves da camada de Stern (potencial de Stern, psi_d) ate o potencial zero no bulk da solucao.

O **plano de cisalhamento** e a fronteira hidrodinamica onde, quando a particula se move (por exemplo, sob a influencia de um campo eletrico aplicado), a camada de solvatacao se desloca junto com a particula, enquanto o solvente alem desse plano permanece estacionario. O potencial eletrico nesse plano e o potencial zeta. Na pratica, o potencial zeta e sempre menor (em valor absoluto) que o potencial de Stern e que o potencial de superficie, mas e o unico dos tres que pode ser medido experimentalmente de forma direta. A sua importancia reside no fato de que e o potencial zeta — e nao o potencial de superficie — que governa as interacoes eletrostaticas entre particulas em suspensao e, portanto, determina a **estabilidade coloidal** do sistema.

A relacao entre potencial zeta e estabilidade e descrita pela **teoria DLVO** (Derjaguin-Landau-Verwey-Overbeek), que modela a energia total de interacao entre duas particulas como a soma de atracao de van der Waals (sempre presente, favorece agregacao) e repulsao eletrostatica (depende do potencial zeta, favorece dispersao). Quando o potencial zeta e elevado em modulo (tipicamente |zeta| > 30 mV), a barreira eletrostatica e suficiente para prevenir a aproximacao das particulas e a consequente agregacao. Quando |zeta| < 20 mV, a repulsao eletrostatica e fraca, e as forcas de van der Waals predominam, favorecendo floculacao, coalescencia ou maturacao de Ostwald. A faixa entre 20 e 30 mV e considerada zona de estabilidade incipiente.

- **Exemplo**: Uma nanoemulsao O/A de oleo de rosa mosqueta estabilizada com **lecitina de soja** (fosfolipidio anionico) apresenta potencial zeta de -42 mV em pH 7,0 e forca ionica de 10 mM NaCl. Pela teoria DLVO, a barreira energetica de repulsao eletrostatica entre as goticulas e superior a 15 kBT, o que e suficiente para garantir estabilidade cinetica por meses. Se o pH for reduzido para 3,0, a lecitina se protoniza, o potencial zeta cai para -8 mV, e a nanoemulsao flocula em poucas horas. Essa dependencia pH-potencial zeta e critica para formulacoes cosmeticas que contenham acidos (como acido glicolico ou acido salicilico) e nanotransportadores anionicos.

### Medicao por mobilidade eletroforetica e interpretacao

A medicao experimental do potencial zeta e realizada por **microeletroforese a laser** (Laser Doppler Electrophoresis, LDE) ou, mais modernamente, por **Phase Analysis Light Scattering** (PALS). O principio e aplicar um campo eletrico a uma amostra contida em uma celula capilar com eletrodos. As particulas carregadas migram em direcao ao eletrodo de carga oposta com velocidade proporcional a sua carga e inversamente proporcional a friccao viscosa do meio. A velocidade de migracao e medida pela mudanca de frequencia (efeito Doppler) ou pela mudanca de fase da luz espalhada, e expressa como **mobilidade eletroforetica** (mu_E, em unidades de micrometros.cm/V.s).

O potencial zeta e calculado a partir da mobilidade eletroforetica pela **equacao de Henry**:

**zeta = (3 eta mu_E) / (2 epsilon f(kappa.a))**

onde eta e a viscosidade do meio, epsilon e a constante dieletrica, kappa e o inverso do comprimento de Debye (indicador da espessura da dupla camada eletrica), a e o raio da particula e f(kappa.a) e a funcao de Henry. Para nanoparticulas em meio aquoso com forca ionica moderada (kappa.a >> 1), utiliza-se a **aproximacao de Smoluchowski**, onde f(kappa.a) = 1,5. Para nanoparticulas muito pequenas em meios de baixa forca ionica (kappa.a << 1), utiliza-se a **aproximacao de Huckel**, onde f(kappa.a) = 1,0. A maioria dos softwares de equipamentos de potencial zeta aplica automaticamente a aproximacao de Smoluchowski, que e adequada para a maioria dos nanovetores cosmeticos em meio aquoso.

Fatores criticos para a medicao confiavel de potencial zeta incluem: (i) **pH da amostra** — deve ser registrado e, preferencialmente, controlado com tampao, pois o potencial zeta varia fortemente com o pH; (ii) **forca ionica** — concentracoes ionicas elevadas comprimem a dupla camada eletrica e reduzem o potencial zeta, independentemente da carga real da superficie; (iii) **temperatura** — afeta viscosidade e mobilidade ionica; (iv) **tipo de celula** — celulas capilares dobradas (DTS1070, Malvern) minimizam efeitos de eletro-osmose que distorcem a medida. A determinacao do **ponto isoeletrico** (pI) — pH no qual o potencial zeta e zero — e particularmente util para prever a estabilidade da formulacao em diferentes veiculos cosmeticos.

- **Exemplo**: Um pesquisador esta desenvolvendo nanocapsulas de poli(epsilon-caprolactona) (PCL) encapsulando retinaldeido para um serum antienvelhecimento. Ao medir o potencial zeta em funcao do pH (pH 3 a 10), observa que as nanocapsulas apresentam zeta = +15 mV em pH 3, zeta = 0 mV em pH 4,2 (ponto isoeletrico) e zeta = -35 mV em pH 7,0. Como o serum final tera pH 5,5, o potencial zeta esperado e de aproximadamente -22 mV, que esta na zona de estabilidade incipiente. Para aumentar a estabilidade, ele adota uma estrategia de revestimento com quitosana (polimero cationico), que inverte a carga superficial para +38 mV em pH 5,5, garantindo estabilidade eletrostatica robusta e, adicionalmente, bioadesividade a pele.

### Correlacao potencial zeta-estabilidade: regras praticas e limitacoes

A classificacao classica de estabilidade por potencial zeta, amplamente difundida na literatura, e a seguinte: **|zeta| > 60 mV** — excelente estabilidade; **|zeta| de 40 a 60 mV** — boa estabilidade; **|zeta| de 30 a 40 mV** — estabilidade moderada; **|zeta| de 20 a 30 mV** — estabilidade incipiente; **|zeta| < 20 mV** — instavel, tendencia a agregacao. Essa classificacao, embora util como referencia rapida, apresenta limitacoes importantes que o formulador avancado deve conhecer.

A principal limitacao e que a estabilidade coloidal nao depende exclusivamente de repulsao eletrostatica. Nanovetores estabilizados por **surfactantes nao ionicos** (como polissorbato 80, poloxamer 188 ou poloxamer 407) ou por **polimeros adsorvidos** (como PEG ou PVA) podem apresentar potencial zeta proximo de zero e, ainda assim, serem extremamente estaveis. Nesses casos, a estabilidade e **esterica** (nao eletrostatica): as cadeias polimericas na superficie criam uma barreira entropica e osmotica que impede a aproximacao das particulas. A teoria DLVO estendida (xDLVO) incorpora essa contribuicao esterica, mas o potencial zeta isolado nao a captura. Portanto, um potencial zeta de -5 mV para uma NLC estabilizada com poloxamer 407 nao indica instabilidade — indica apenas que a estabilizacao e predominantemente esterica e nao eletrostatica.

Outra limitacao e a dependencia do potencial zeta com a composicao do meio final. O potencial zeta medido em agua ultrapura apos diluicao pode ser muito diferente do potencial na formulacao cosmetica real, que contem eletritos, polimeros, fragrancia e outros excipientes que alteram a forca ionica e o ambiente eletrostatico. Para uma avaliacao mais realista, recomenda-se medir o potencial zeta no veiculo diluido (por exemplo, gel, creme ou locao diluidos 1:100 no proprio veiculo sem nanoparticulas), embora essa abordagem apresente desafios praticos.

- **Exemplo**: Uma NLC estabilizada com **poloxamer 188** (2% m/v) e **lecitina** (0,5% m/v) para encapsulacao de niacinamida apresenta potencial zeta de -12 mV em agua ultrapura pH 6,5. Pela classificacao classica, a formulacao seria considerada instavel. Porem, o estudo de estabilidade acelerada (40 graus Celsius, 90 dias) revela que o z-average varia apenas de 165 nm para 172 nm, e o PDI mantem-se em 0,19. A formulacao e estavell porque o poloxamer 188 cria uma coroa de PEO (poli(oxido de etileno)) de aproximadamente 10 nm na superficie, gerando repulsao esterica que dispensa repulsao eletrostatica significativa. Esse exemplo demonstra que o potencial zeta deve ser interpretado sempre em conjunto com o tipo de estabilizante utilizado.

---

## 3. Analise de Rastreamento de Nanoparticulas (NTA) e Difracao a Laser

### NTA: principio de contagem particula a particula

A **Analise de Rastreamento de Nanoparticulas** (Nanoparticle Tracking Analysis, NTA) e uma tecnica complementar ao DLS que oferece resolucao particula a particula (single-particle tracking). Desenvolvida comercialmente pela NanoSight (atualmente parte da Malvern Panalytical), a NTA ilumina a amostra com um feixe de laser fino (405 nm, 488 nm ou 532 nm) e observa as particulas individuais por meio de um microscopio optico equipado com camera CMOS ou sCMOS de alta sensibilidade. Cada particula e visualizada como um ponto brilhante de luz espalhada (ou fluorescencia, no modo fluorescente), e o software rastreia a trajetoria browniana de cada particula individualmente ao longo de multiplos quadros de video (tipicamente 30 fps por 30-60 segundos).

Para cada particula rastreada, o software calcula o **deslocamento quadratico medio** (Mean Square Displacement, MSD) e, a partir dele, determina o coeficiente de difusao individual, que e convertido em diametro hidrodinamico pela equacao de Stokes-Einstein. Como cada particula e analisada separadamente, a NTA gera uma **distribuicao de tamanho por numero** (nao por intensidade, como o DLS), que e mais representativa da populacao real de particulas. Alem disso, a NTA fornece a **concentracao absoluta** de particulas por mililitro (particulas/mL), informacao que o DLS nao e capaz de oferecer. A faixa tipica de tamanho mensuravel por NTA e de 30-1000 nm, e a concentracao ideal de amostra e de 10^7 a 10^9 particulas/mL.

A principal vantagem da NTA sobre o DLS e a capacidade de **resolver populacoes multimodais** com maior fidelidade. Enquanto o DLS tende a mascarar populacoes menores na presenca de particulas grandes (devido a dominancia da intensidade de espalhamento pela sexta potencia do diametro), a NTA conta cada particula igualmente, revelando a proporacao real entre subpopulacoes. No entanto, a NTA apresenta limitacoes: particulas menores que 30 nm (como micelas de surfactante) sao invissiveis, o operador precisa ajustar manualmente o threshold de deteccao e o foco da camera, e a estatistica exige que pelo menos 1000 particulas sejam rastreadas por medicao para resultados robustos. Equipamentos recentes, como o **NanoSight NS300** e o **NanoSight Pro**, automatizam parte desses ajustes.

- **Exemplo**: Um pesquisador compara a distribuicao de tamanho de lipossomas de fosfatidilcolina de ovo (PC de ovo) medida por DLS e por NTA. O DLS reporta z-average de 195 nm e PDI de 0,28, com distribuicao por intensidade mostrando um unico pico largo. A NTA, analisando 3500 particulas, revela distribuicao bimodal: uma populacao principal centrada em 120 nm (82% das particulas) e uma populacao secundaria em 280 nm (18% das particulas). A media ponderada por intensidade da NTA seria proxima de 195 nm (consistente com o DLS), mas a distribuicao real por numero mostra claramente duas populacoes, informacao crucial para otimizar o processo de extrusao e obter lipossomas mais homogeneos.

### Difracao a laser: principio e aplicacao para faixa submicrimetrica a micrometrica

A **difracao a laser** (Laser Diffraction, LD), tambem chamada de espalhamento de luz estatico de baixo angulo (Low-Angle Laser Light Scattering, LALLS), e uma tecnica de determinacao de tamanho que cobre uma faixa muito mais ampla do que o DLS — tipicamente de 10 nm a 3500 micrometros, dependendo do equipamento. O principio baseia-se na **teoria de Mie**: quando um feixe de laser atinge uma particula, a luz e difratada (espalhada) em angulos que dependem do tamanho da particula. Particulas grandes difratam a luz em angulos pequenos; particulas pequenas difratam em angulos maiores. O equipamento contem um arranjo de detectores fotoeletricos posicionados em diferentes angulos que capturam o padrao de difracao completo da amostra, e um algoritmo matematico (baseado na teoria de Mie ou na aproximacao de Fraunhofer para particulas maiores) deconvolui o padrao em uma distribuicao de tamanho volumetrica.

Equipamentos de difracao a laser amplamente utilizados incluem o **Mastersizer 3000** (Malvern Panalytical), o **Horiba LA-960V2**, o **Beckman Coulter LS 13 320** e o **Cilas 1190**. O Mastersizer 3000, por exemplo, combina difracao frontal (LALLS) com retrodifusao (WALS — Wide-Angle Light Scattering), permitindo a cobertura continua de 10 nm a 3500 micrometros. No contexto de nanovetores cosmeticos, a difracao a laser e particularmente util para: (i) formulacoes que contem populacoes em faixa submicrimetrica e micrometrica simultaneamente (como emulsoes parcialmente nanoestruturadas); (ii) controle de qualidade em linha (in-line) ou em processo (at-line) durante o escalonamento industrial, onde a rapidez e a robustez da medicao sao prioritarias; (iii) deteccao de **cristais** ou **agregados micrometricos** que podem estar presentes como contaminantes em nanodispersoes.

Os resultados de difracao a laser sao tipicamente expressos como **D10**, **D50** (mediana volumetrica) e **D90** — diametros abaixo dos quais se encontram 10%, 50% e 90% do volume das particulas, respectivamente. O **span** — definido como (D90 - D10) / D50 — quantifica a largura da distribuicao e e analogo ao PDI do DLS. Um span inferior a 1,0 indica distribuicao relativamente estreita; span superior a 2,0 indica distribuicao larga. E importante notar que a difracao a laser mede distribuicao por volume (ou por area superficial), enquanto o DLS reporta distribuicao por intensidade. Comparacoes diretas entre os dois metodos requerem conversao entre as bases de ponderacao (intensidade, volume, numero), assumindo modelos de forma (tipicamente esferica) e conhecimento do indice de refracao das particulas.

- **Exemplo**: Uma microemulsao de oleo de argan para creme facial e analisada por difracao a laser (Mastersizer 3000, dispersao em agua, indice de refracao 1,47 para a fase oleosa). Os resultados sao: D10 = 85 nm, D50 = 210 nm, D90 = 580 nm, span = 2,36. A distribuicao revela uma cauda significativa acima de 500 nm, indicando presenca de goticulas micrometricas que nao seriam detectadas adequadamente por DLS (que reportaria apenas o z-average, mascarando a cauda). O formulador decide adicionar um ciclo extra de homogeneizacao a alta pressao para eliminar a fracao grosseira e reduzir o span para menos de 1,5, melhorando a homogeneidade e a sensorialidade do produto final.

### Comparacao e selecao de tecnicas: DLS vs NTA vs difracao a laser

A selecao da tecnica analitica adequada depende do objetivo da medicao, da faixa de tamanho esperada e do estagio de desenvolvimento da formulacao. O **DLS** e a tecnica de triagem rapida por excelencia: medicao em menos de 5 minutos, preparo minimo, baixo custo por analise e adequado para monitoramento de rotina em P&D e controle de qualidade. Porem, o DLS e pouco resolutivo para populacoes multimodais e nao fornece concentracao absoluta. A **NTA** e a tecnica de escolha quando se necessita de resolucao por numero de particulas, deteccao de subpopulacoes e quantificacao de concentracao — informacoes essenciais para estudos de biodistribuicao, toxicologia e liberacao controlada. Porem, a NTA e mais lenta, mais dependente do operador e nao detecta particulas abaixo de 30 nm. A **difracao a laser** e ideal para formulacoes com distribuicao ampla (nanometrica a micrometrica), para controle de qualidade industrial com alta vazao de amostras e para deteccao de contaminantes grosseiros. Porem, a resolucao abaixo de 100 nm e limitada e a tecnica requer conhecimento do indice de refracao da particula.

Na pratica de um laboratorio de P&D de nanovetores cosmeticos, a abordagem recomendada e **ortogonal**: utilizar DLS como triagem primaria (todo lote), NTA como tecnica complementar para estudos de desenvolvimento e caracterizacao detalhada, e difracao a laser para formulacoes com suspeita de populacao micrometrica ou para controle de processo industrial. A convergencia de resultados entre tecnicas independentes aumenta a confiabilidade dos dados e atende a recomendacoes de agencias regulatorias como a FDA (Guidance for Industry: Drug Products, Including Biological Products, that Contain Nanomaterials, 2022) e a ISO 22412:2017 para DLS.

- **Exemplo**: Um laboratorio de P&D de uma empresa de dermocosmeeticos esta desenvolvendo uma nanoemulsao de vitamina E (tocoferol acetato) para um serum anti-oxidante. No estagio inicial de formulacao, utiliza DLS (Zetasizer Nano ZS) para triagem rapida de 20 formulacoes candidatas, selecionando as 5 com menor z-average e PDI. As 5 selecionadas sao analisadas por NTA (NanoSight NS300) para verificar homogeneidade real e determinar concentracao (alvo: 10^12 particulas/mL). As 2 formulacoes finalistas sao analisadas por difracao a laser (Mastersizer 3000) para confirmar ausencia de goticulas grosseiras (D90 < 500 nm). Essa abordagem ortogonal reduz o risco de selecionar uma formulacao com populacao artefatual mascarada pela media do DLS.

---

## Conclusao

Nesta aula, estabelecemos os fundamentos analiticos para a caracterizacao dimensional e eletrocinetica de nanovetores cosmeticos. Compreendemos que o DLS, baseado no movimento browniano e na equacao de Stokes-Einstein, e a tecnica de triagem primaria para diametro hidrodinamico, mas que seus resultados sao ponderados por intensidade e mascarados pela media cumulante, exigindo preparo de amostra rigoroso e interpretacao contextualizada do PDI. Aprendemos que o potencial zeta, medido por microeletroforese a laser, e o parametro central de estabilidade coloidal eletrostatica, governado pela teoria DLVO, mas que sua interpretacao isolada pode ser enganosa para sistemas estabilizados estericamente por polimeros nao ionicos. Finalmente, exploramos a NTA como tecnica de contagem particula a particula que complementa o DLS com distribuicao por numero e concentracao absoluta, e a difracao a laser como ferramenta de ampla faixa para controle de processo industrial. O formulador de nanocosmeticos que domina essas quatro tecnicas complementares tem capacidade de caracterizar completamente qualquer nanossistema e de gerar dados robustos para tomada de decisao em P&D e para documentacao regulatoria.

---

## Licao de Casa

1. Prepare uma tabela comparativa entre DLS, NTA e difracao a laser, incluindo as seguintes colunas: principio fisico, faixa de tamanho mensuravel, tipo de distribuicao reportada (intensidade, volume, numero), informacao de concentracao (sim/nao), resolucao multimodal (baixa/media/alta), tempo tipico de analise, equipamentos representativos e limitacoes principais. Consulte pelo menos duas referencias primarias (artigos cientificos) publicadas nos ultimos 5 anos para cada tecnica.

2. Um lote de NLC de manteiga de karite encapsulando acido hialuronico de baixo peso molecular apresenta os seguintes dados de DLS: z-average = 245 nm, PDI = 0,41, potencial zeta = -18 mV (pH 6,0, agua ultrapura). A distribuicao por intensidade mostra pico principal em 200 nm e pico secundario em 4500 nm. Interprete cada parametro, identifique potenciais problemas e proponha pelo menos tres acoes corretivas para melhorar a qualidade do lote.

3. Pesquise a norma ISO 22412:2017 (Particle size analysis — Dynamic light scattering) e a ISO 13099 (Colloidal systems — Methods for zeta-potential determination). Resuma os requisitos principais de cada norma em relacao a preparo de amostra, numero minimo de replicatas e reportagem de resultados. Discuta como essas normas se aplicam ao controle de qualidade de nanocosmeticos em ambiente industrial.

---

## Proxima Aula

Na proxima aula, vamos explorar as tecnicas de caracterizacao morfologica e estrutural de nanovetores cosmeticos, incluindo microscopia eletronica de transmissao (TEM), microscopia eletronica de varredura (SEM/FEG-SEM), microscopia de forca atomica (AFM), calorimetria diferencial de varredura (DSC) e difracao de raios X (XRD). Essas tecnicas revelam a forma, a topografia superficial, a organizacao interna e o estado fisico dos componentes dos nanovetores — informacoes que o DLS e o potencial zeta nao conseguem fornecer. Ate la!

---

## Links para aprofundamento

1. [ISO 22412:2017 — Particle size analysis — Dynamic light scattering (DLS)](https://www.iso.org/standard/65410.html)
2. [Malvern Panalytical — Zetasizer Nano ZS: principios e aplicacoes de DLS e potencial zeta](https://www.malvernpanalytical.com/en/products/product-range/zetasizer-range/zetasizer-nano-range/zetasizer-nano-zs)
3. [NanoSight — Nanoparticle Tracking Analysis (NTA): principio e aplicacoes](https://www.malvernpanalytical.com/en/products/technology/nanoparticle-tracking-analysis)
4. [Bhattacharjee, S. (2016). DLS and zeta potential — What they are and what they are not. Journal of Controlled Release, 235, 337-351](https://doi.org/10.1016/j.jconrel.2016.06.017)
5. [Danaei, M. et al. (2018). Impact of Particle Size and Polydispersity Index on the Clinical Applications of Lipidic Nanocarrier Systems. Pharmaceutics, 10(2), 57](https://doi.org/10.3390/pharmaceutics10020057)

---

## Questionario

**1. Qual grandeza fisica o DLS mede diretamente para calcular o tamanho de particula?**

a) O diametro geometrico real da particula, medido por diffracao do feixe de laser
b) O coeficiente de difusao translacional, derivado das flutuacoes temporais da intensidade da luz espalhada pelas particulas em movimento browniano
c) A massa molecular da particula, determinada pela intensidade absoluta do espalhamento de luz
d) O indice de refracao da particula, que e convertido em diametro pela lei de Snell

**Resposta: b**

**2. Um formulador mede uma nanoemulsao por DLS e obtem PDI de 0,45 com distribuicao por intensidade bimodal. Qual e a interpretacao mais adequada e a acao recomendada?**

a) O PDI indica distribuicao monodispersa ideal; nenhuma acao e necessaria
b) O PDI indica distribuicao extremamente larga ou multimodal, sugerindo presenca de populacoes com tamanhos distintos; recomenda-se confirmar por NTA e revisar o processo de producao para eliminar a fracao grosseira
c) O PDI de 0,45 e aceitavel para todas as formulacoes nanocosmeticas segundo a SCCS; o formulador pode prosseguir sem ajustes
d) O valor de PDI indica erro de equipamento; a medicao deve ser repetida com outro lote de cubetas

**Resposta: b**

**3. Qual e a principal limitacao da classificacao classica de estabilidade coloidal baseada exclusivamente no potencial zeta?**

a) O potencial zeta nao pode ser medido em meios aquosos, limitando sua aplicabilidade a sistemas nao polares
b) A classificacao nao considera a estabilizacao esterica proporcionada por surfactantes nao ionicos e polimeros adsorvidos, que podem garantir estabilidade mesmo com potencial zeta proximo de zero
c) O potencial zeta e sempre positivo para nanoparticulas lipidicas, impedindo a avaliacao de sistemas anionicos
d) A classificacao e valida apenas para particulas maiores que 1 micrometro, nao se aplicando a nanovetores

**Resposta: b**

**4. Qual tecnica analitica fornece simultaneamente o diametro hidrodinamico individual e a concentracao absoluta (particulas/mL) de nanovetores em suspensao?**

a) DLS (Espalhamento de Luz Dinamico), que calcula a concentracao a partir da intensidade total de espalhamento
b) Difracao a laser, que determina a concentracao pelo volume total de particulas difratadas
c) NTA (Analise de Rastreamento de Nanoparticulas), que rastreia cada particula individualmente por video-microscopia e conta o numero de particulas no volume iluminado
d) Potencial zeta por microeletroforese, que mede a concentracao a partir da condutividade da suspensao

**Resposta: c**

**5. Uma NLS apresenta z-average de 180 nm (DLS), D50 de 150 nm (difracao a laser) e moda de 130 nm (NTA, distribuicao por numero). Qual explicacao e mais coerente para as diferencas entre os valores obtidos pelas tres tecnicas?**

a) Os tres equipamentos estao descalibrados e devem ser enviados para manutencao simultaneamente
b) O DLS reporta media ponderada por intensidade (particulas maiores contribuem desproporcionalmente pela sexta potencia do diametro), a difracao a laser reporta mediana volumetrica (ponderada pela terceira potencia) e a NTA reporta moda da distribuicao por numero (cada particula conta igualmente), gerando valores decrescentes nessa ordem para uma distribuicao com cauda de particulas grandes
c) A difracao a laser e a unica tecnica confiavel; DLS e NTA devem ser descartados por imprecisao intrinseca
d) As diferencas indicam que a amostra sofreu degradacao entre as medicoes e deve ser descartada

**Resposta: b**
