# Aula 1.3: Regulamentacao brasileira atualizada

## Abertura

Bem-vindo a aula 1.3! Vamos mergulhar no arcabouco regulatorio brasileiro para tokenizacao de ativos reais, com foco nas normas que impactam diretamente o agronegocio. Voce vai entender as resolucoes da CVM que regulam ofertas de tokens, as novas regras do Banco Central para prestadores de servicos de ativos virtuais (VASPs), a integracao com a Lei do Agro e o papel transformador do DREX na infraestrutura de tokenizacao do pais.

### Programa da aula:

1. CVM: resolucoes e pareceres para tokens de RWA (introducao)
2. Banco Central: regulacao de VASPs e Lei do Agro (base e aprofundamento)
3. DREX: a infraestrutura de tokenizacao do Brasil (conceito principal da aula)

---

## 1. CVM: resolucoes e pareceres para tokens de RWA

### Resolucao CVM 88 e sua evolucao para a Resolucao 160

A Resolucao CVM 88, publicada em abril de 2022, foi o marco regulatorio que permitiu a realizacao de ofertas publicas de valores mobiliarios por meio de plataformas eletronicas de investimento participativo (crowdfunding). Essa resolucao e fundamental para a tokenizacao de RWA no Brasil porque ela autoriza explicitamente o uso de registros distribuidos (blockchain) para a emissao, o controle e a transferencia de valores mobiliarios ofertados nessas plataformas.

A Resolucao 88 estabeleceu limites claros: empresas de pequeno porte com receita bruta anual de ate R$ 40 milhoes podem captar ate R$ 15 milhoes por oferta (esse limite foi posteriormente ampliado). Investidores nao qualificados podem investir ate R$ 20.000 por ano nessas plataformas. Investidores qualificados (com mais de R$ 1 milhao em investimentos) e investidores profissionais nao possuem esse limite. A plataforma deve ser registrada na CVM, manter controles de PLD/FT (prevencao a lavagem de dinheiro e financiamento ao terrorismo) e garantir transparencia sobre os riscos da oferta.

A Resolucao CVM 160, publicada em julho de 2022, consolidou e atualizou as regras de ofertas publicas de valores mobiliarios de forma mais ampla, substituindo a antiga Instrucao CVM 400 (ofertas registradas) e a Instrucao CVM 476 (ofertas restritas). A Resolucao 160 nao trata especificamente de tokens, mas impacta o mercado de RWA ao definir o regime de ofertas para CRAs, debentures e outros titulos que podem ser tokenizados. Na pratica, emissoes de CRA tokenizado de grande porte (acima dos limites da Resolucao 88) devem seguir o rito da Resolucao 160, com registro na CVM, prospecto e distribuicao por instituicoes intermediarias autorizadas.

- **Exemplo**: A plataforma Liqi, registrada na CVM como plataforma de crowdfunding sob a Resolucao 88, emitiu em 2023 e 2024 dezenas de tokens de recebiveis agro, incluindo tokens lastreados em CPRs de cafe, soja e milho. Cada emissao respeitou o limite de captacao da resolucao e incluiu documentacao completa sobre o emissor, o lastro, os riscos e as condicoes de pagamento. Os tokens foram emitidos em blockchain (Ethereum e Polygon), mas o registro regulatorio junto a CVM seguiu os mesmos procedimentos de uma oferta de crowdfunding tradicional. A Resolucao 88 criou, portanto, uma "porta de entrada" regulada para a tokenizacao de ativos do agro no varejo.

### Parecer de Orientacao CVM 40/2022: classificacao de criptoativos

O Parecer de Orientacao CVM 40, publicado em outubro de 2022, e o documento mais importante da CVM para quem trabalha com tokenizacao de RWA. Nele, a CVM estabelece os criterios para determinar quando um criptoativo e considerado valor mobiliario e, portanto, sujeito a regulacao da autarquia. O parecer adota o conceito de "substancia economica sobre a forma": nao importa se o ativo e chamado de "token de utilidade", "NFT" ou "criptoativo" — o que importa e se ele representa um contrato de investimento coletivo, confere direito de participacao em resultados ou constitui um titulo de divida.

O Parecer 40 utiliza como referencia o Howey Test americano, adaptado ao contexto brasileiro. Um token e considerado valor mobiliario se: (i) ha investimento de recursos financeiros; (ii) em um empreendimento coletivo; (iii) com expectativa de lucro; (iv) derivado do esforco de terceiros. Se os quatro criterios forem atendidos, o token e valor mobiliario e deve ser ofertado sob as regras da CVM (Resolucao 88 ou 160). Tokens de utilidade pura (que conferem acesso a um servico sem expectativa de retorno financeiro) e criptomoedas de pagamento (como Bitcoin) nao se enquadram nessa definicao.

Para o agronegocio, a implicacao e direta: tokens lastreados em recebiveis de CPR, frações de CRA, cotas de FIAGRO ou direitos sobre renda de arrendamento de terras sao, quase certamente, valores mobiliarios sob o Parecer 40. Isso significa que sua emissao e distribuicao devem seguir as regras da CVM, com todas as obrigacoes de disclosure, compliance e registro aplicaveis.

- **Exemplo**: Em 2023, a CVM emitiu um stop order contra uma plataforma que oferecia "tokens de cafe" sem registro. A plataforma argumentou que os tokens eram "tokens de utilidade" que conferiam direito a receber cafe fisico. A CVM entendeu que, na pratica, os investidores compravam os tokens com expectativa de valorizacao e revenda, configurando um contrato de investimento coletivo — portanto, valor mobiliario. O caso ilustra que a CVM aplica o principio da substancia sobre a forma e que rotular um ativo como "utilidade" nao o isenta de regulacao se sua essencia economica for de investimento.

### Agenda regulatoria da CVM para 2025-2026

A CVM incluiu em sua agenda regulatoria para 2025-2026 varios temas diretamente relacionados a tokenizacao de RWA. Entre os principais: regulamentacao especifica para tokenizadoras de valores mobiliarios (empresas que emitem e gerenciam tokens regulados), atualizacao das regras de crowdfunding para ampliar limites de captacao, normas para mercados secundarios de tokens (ambientes de negociacao regulados para tokens de valores mobiliarios) e tratamento regulatorio de DeFi (financas descentralizadas) no contexto de ofertas de ativos tokenizados.

Um tema particularmente relevante e a criacao de um regime regulatorio para "infraestruturas de mercado baseadas em DLT" (Distributed Ledger Technology). A CVM estuda a possibilidade de autorizar plataformas que combinem as funcoes de emissao, registro, custodia e negociacao de tokens em uma unica infraestrutura baseada em blockchain — algo que hoje requer multiplos intermediarios separados (escriturador, custodiante, registrador, bolsa). Essa simplificacao poderia reduzir drasticamente os custos de emissao e negociacao de titulos agro tokenizados.

- **Exemplo**: Atualmente, emitir um CRA tradicional na B3 envolve custos com coordenador lider (0,5% a 1,5% do volume), agencia de rating (R$ 150 mil a R$ 500 mil), escriturador e custodiante (0,05% a 0,1% ao ano), e registro na B3 (taxas fixas e variaveis). Para uma emissao de R$ 50 milhoes, esses custos podem somar R$ 1 milhao a R$ 2 milhoes. Se a CVM autorizar infraestruturas integradas de tokenizacao, esses custos podem cair para R$ 100 mil a R$ 300 mil, tornando viavel a emissao de titulos agro tokenizados de menor porte — por exemplo, R$ 5 milhoes para uma cooperativa regional de leite, algo inviavel no mercado de CRA tradicional devido aos custos fixos.

---

## 2. Banco Central: regulacao de VASPs e Lei do Agro

### Resolucoes 519, 520 e 521 de 2025: o marco regulatorio de VASPs

Em dezembro de 2024 e janeiro de 2025, o Banco Central do Brasil publicou as Resolucoes BCB 519, 520 e 521, que regulamentam a Lei 14.478/2022 (conhecida como Marco Legal dos Criptoativos). Essas resolucoes estabelecem as regras para autorizacao e funcionamento de Prestadoras de Servicos de Ativos Virtuais (VASPs) no Brasil, com vigencia a partir de fevereiro de 2026.

A Resolucao 519 define os requisitos para autorizacao de VASPs: capital minimo, estrutura de governanca, controles internos, politicas de PLD/FT e segregacao patrimonial de ativos dos clientes. A Resolucao 520 trata da conduta e transparencia das VASPs, incluindo obrigacoes de disclosure, tratamento de conflitos de interesse e regras de publicidade. A Resolucao 521 aborda a supervisao prudencial, estabelecendo metricas de liquidez, solvencia e limites operacionais.

Para o ecossistema de tokenizacao agro, essas resolucoes sao relevantes porque definem quem pode intermediar a compra e venda de tokens: exchanges de criptomoedas, plataformas de tokenizacao e marketplaces de ativos digitais precisarao de autorizacao do Banco Central para operar legalmente no Brasil. Empresas como Mercado Bitcoin, Foxbit, Liqi e outras que oferecem tokens de recebiveis agro deverao se enquadrar nesse novo regime.

- **Exemplo**: O Mercado Bitcoin, que ja operava sob registro na CVM como plataforma de crowdfunding e tambem como exchange de criptomoedas, devera obter autorizacao do Banco Central como VASP ate fevereiro de 2026. A empresa precisara demonstrar capital minimo adequado, segregacao dos ativos dos clientes em contas separadas, e sistemas de PLD/FT compativeis com as exigencias do COAF. A dupla regulacao (CVM para tokens que sao valores mobiliarios, Banco Central para tokens que sao ativos virtuais) cria um regime hibrido que reflete a natureza dual de muitos tokens de RWA — que sao simultaneamente ativos digitais e valores mobiliarios.

### A divisao regulatoria: CVM vs. Banco Central

A regulacao de tokens no Brasil segue uma logica de divisao de competencias: a CVM regula tokens que sao valores mobiliarios (recebiveis tokenizados, cotas de fundos, titulos de divida); o Banco Central regula tokens que sao ativos virtuais de pagamento ou utilidade e supervisiona as infraestruturas (exchanges, custodias, processadores de pagamento). Quando um token e simultaneamente valor mobiliario e ativo virtual — como um token de CRA negociado em uma exchange — ambos os reguladores atuam, cada um em sua esfera de competencia.

Essa divisao pode gerar complexidade, mas tambem oferece clareza juridica. O emissor de um token de recebiveis de CPR sabe que precisa seguir as regras da CVM para a oferta (Resolucao 88 ou 160) e que a exchange onde o token sera negociado precisa ser autorizada pelo Banco Central. O investidor sabe que o token e regulado e que existe um arcabouco de protecao ao investidor aplicavel.

- **Exemplo**: Uma cooperativa de credito no Parana deseja tokenizar R$ 10 milhoes em CDCAs (Certificados de Direitos Creditorios do Agronegocio) lastreados em recebiveis de produtores de frango. A emissao do token segue as regras da CVM (Resolucao 88, se via crowdfunding, ou Resolucao 160, se via oferta publica registrada). A distribuicao e negociacao secundaria dos tokens em uma exchange digital segue as regras do Banco Central (Resolucoes 519-521). A cooperativa precisa de assessoria juridica que compreenda ambos os regimes para estruturar a operacao de forma compliant.

### Lei do Agro e integracao com CPR digital

A Lei 13.986/2020 (conhecida como Lei do Agro) trouxe avancos significativos para a modernizacao do credito rural brasileiro, varios dos quais facilitam a tokenizacao. A lei criou a CPR financeira com liquidacao pela camara de compensacao (B3), permitiu o registro eletronico de CPRs, e autorizou o uso de sistemas eletronicos para emissao, registro e controle de titulos do agronegocio. Embora a lei nao mencione explicitamente "blockchain" ou "tokenizacao", seus dispositivos sobre registro eletronico e desmaterializacao de titulos criam a base legal para que CPRs, CDAs e WAs sejam representados como tokens digitais.

O artigo 11 da Lei do Agro estabelece que a CPR pode ser emitida sob a forma escritural, registrada em sistema de registro e liquidacao financeira de ativos autorizado pelo Banco Central ou pela CVM. Esse dispositivo permite que uma CPR seja emitida diretamente em formato digital, sem necessidade de documento fisico, e registrada em uma infraestrutura que pode incluir blockchain — desde que autorizada pelos reguladores. Na pratica, isso significa que a CPR tokenizada nao e uma "gambiarra" legal: ela e uma CPR escritural registrada em sistema autorizado, cuja infraestrutura de registro acontece ser uma blockchain.

A integracao entre a Lei do Agro e os regimes da CVM e do Banco Central para tokens cria um arcabouco juridico robusto para a tokenizacao de credito rural. O produtor pode emitir uma CPR financeira escritural, tokeniza-la em uma plataforma autorizada pela CVM, e oferece-la a investidores que a negociam em uma exchange autorizada pelo Banco Central. Todo o ciclo — emissao, distribuicao, negociacao e liquidacao — possui base legal.

- **Exemplo**: O Banco Central opera o sistema de registro de CPRs via SNCR (Sistema Nacional de Credito Rural), onde mais de 2 milhoes de CPRs sao registradas anualmente. A Lei do Agro permite que esses registros migrem para sistemas eletronicos mais modernos. Em um cenario de tokenizacao, o produtor emitiria a CPR em uma plataforma de tokenizacao autorizada, o registro seria feito simultaneamente no SNCR (para fins de compliance regulatorio) e na blockchain (para fins de negociacao e transparencia). Essa dualidade de registro — "espelho" entre sistema legado e blockchain — e a abordagem mais provavel durante o periodo de transicao, ate que a blockchain seja aceita como sistema de registro primario.

---

## 3. DREX: a infraestrutura de tokenizacao do Brasil

### O que e o DREX e como funciona

O DREX (originalmente chamado de Real Digital) e a moeda digital de banco central (CBDC) do Brasil, desenvolvida pelo Banco Central desde 2023. Diferentemente do Pix, que e um sistema de pagamentos instantaneos, o DREX e uma infraestrutura de liquidacao baseada em DLT (Distributed Ledger Technology) que permite a tokenizacao e a transferencia de ativos financeiros com liquidacao atomica — ou seja, a troca simultanea e garantida de ativo por pagamento, sem risco de contraparte.

O DREX opera em uma rede Hyperledger Besu (compativel com Ethereum) permissionada, onde apenas instituicoes autorizadas pelo Banco Central (bancos, cooperativas, instituicoes de pagamento) operam nos validadores. O modelo tem tres camadas: (i) atacado, onde o Banco Central emite o DREX (Real tokenizado) para instituicoes financeiras; (ii) depositos tokenizados, onde bancos emitem representacoes tokenizadas dos depositos de seus clientes; e (iii) ativos tokenizados, onde titulos publicos, titulos privados e outros ativos sao representados como tokens na mesma rede.

A grande inovacao do DREX e a possibilidade de realizar DvP atomico (Delivery versus Payment): a transferencia do ativo e a transferencia do pagamento ocorrem na mesma transacao, de forma indivisivel. Se uma das pernas falhar, a outra tambem falha automaticamente. Isso elimina o risco de liquidacao que existe no mercado tradicional, onde o comprador pode transferir o dinheiro e nao receber o ativo, ou vice-versa.

- **Exemplo**: No mercado de CRA tradicional, a liquidacao de uma negociacao na B3 ocorre em D+1 ou D+2 (um ou dois dias uteis apos a negociacao). Durante esse periodo, existe risco de contraparte: o comprador pode se tornar insolvente entre o dia da negociacao e o dia da liquidacao. Com o DREX, a liquidacao de um CRA tokenizado e atomica: no momento em que o comprador transfere o DREX (Real Digital) para o vendedor, o token do CRA e automaticamente transferido para o comprador, na mesma transacao, no mesmo bloco da blockchain. O risco de liquidacao cai a zero.

### DREX e o agronegocio: casos de uso concretos

O Banco Central incluiu ativos do agronegocio nos casos de uso prioritarios do DREX. Em particular, tres aplicacoes sao diretamente relevantes para o setor:

Primeira: tokenizacao de titulos publicos do agronegocio. Titulos do Tesouro Nacional utilizados como lastro de operacoes de credito rural (como as LCAs) podem ser tokenizados na rede DREX, permitindo liquidacao atomica e reducao de custos operacionais. Em um piloto realizado em 2024, o Tesouro Nacional e a B3 demonstraram a tokenizacao de titulos publicos federais com liquidacao DvP atomica na rede DREX.

Segunda: tokenizacao de recebiveis agro (CPR, CDA, WA, CDCA). Produtores e cooperativas podem emitir CPRs tokenizadas na rede DREX, com registro simultaneo no SNCR e na blockchain. Investidores podem adquirir esses tokens pagando com depositos tokenizados (via seus bancos), com liquidacao instantanea e atomica. A rastreabilidade on-chain permite ao regulador monitorar em tempo real o estoque de credito rural e identificar concentracoes de risco.

Terceira: trade finance agro. Operacoes de comercio internacional de commodities — que hoje envolvem cartas de credito, conhecimentos de embarque e dezenas de intermediarios — podem ser simplificadas com o DREX. O pagamento em Real Digital (ou em moeda digital de outro pais, via acordos bilaterais) pode ser condicionado a confirmacao on-chain de embarque da mercadoria, reduzindo fraudes documentais e acelerando o fluxo de caixa do exportador.

- **Exemplo**: O piloto do DREX em 2024 incluiu um consorcio liderado pelo Banco do Brasil que testou a tokenizacao de credito rural. No teste, um produtor emitiu uma CPR financeira tokenizada no valor de R$ 1 milhao, com vencimento em 180 dias. Um investidor institucional adquiriu o token pagando com depositos tokenizados via o Banco do Brasil. A liquidacao foi atomica: o token da CPR e o deposito tokenizado trocaram de maos na mesma transacao. O Banco Central monitorou a operacao em tempo real via no da rede DREX. O teste demonstrou reducao de 90% no tempo de liquidacao e eliminacao total do risco de contraparte.

### Cronograma e desafios do DREX

O Banco Central divulgou um cronograma gradual para o DREX. A fase 1 (2023-2024) focou em testes de infraestrutura e casos de uso basicos com instituicoes financeiras participantes. A fase 2 (2025) ampliou os testes para incluir ativos tokenizados, smart contracts mais complexos e interacao com sistemas legados (como o STR e a B3). A fase 3 (2026-2027) preve o lancamento do DREX para o publico em geral, com acesso via aplicativos bancarios e integracao com o ecossistema de pagamentos brasileiro.

Para o agronegocio, os desafios especificos incluem: integracao do DREX com os sistemas de registro de credito rural do Banco Central (SNCR, Sicor), definicao do tratamento regulatorio de tokens agro na rede DREX (se serao tratados como depositos, valores mobiliarios ou ativos virtuais), e a necessidade de privacidade — produtores rurais nao querem que seus concorrentes vejam o volume e as condicoes de seus financiamentos em uma blockchain transparente. O Banco Central esta testando tecnologias de privacidade (como ZK-proofs e canais privados no Hyperledger Besu) para resolver essa questao.

O Banco Central tambem esta explorando a interoperabilidade do DREX com CBDCs de outros paises, via projetos como o mBridge (liderado pelo BIS com participacao da China, Tailandia, Emirados Arabes e Hong Kong). Se o DREX se tornar interoperavel com moedas digitais de banco central de paises compradores de commodities brasileiras — como a China, que absorve mais de 30% das exportacoes agro do Brasil — o impacto no trade finance agro seria revolucionario: pagamentos de exportacao de soja e carne poderiam ser liquidados em minutos, versus os 3 a 5 dias uteis atuais.

- **Exemplo**: Em um cenario futuro com DREX operacional, uma trading brasileira exporta 50.000 toneladas de soja para a China. Hoje, a operacao envolve carta de credito emitida por banco chines, conhecimento de embarque emitido pelo armador, documentos fitossanitarios do MAPA, e pagamento via SWIFT com liquidacao em D+3 a D+5. Com DREX interoperavel com o e-CNY (yuan digital chines), o pagamento poderia ser condicionado a confirmacao on-chain de embarque: assim que o navio zarpasse e o conhecimento de embarque tokenizado fosse registrado na blockchain, o smart contract liberaria automaticamente o pagamento em e-CNY, convertido em DREX e creditado na conta da trading em minutos. Os custos de intermediacao bancaria (que hoje somam 0,5% a 1,5% do valor da operacao) seriam drasticamente reduzidos.

---

## Conclusao

Nesta aula, percorremos o arcabouco regulatorio brasileiro que sustenta a tokenizacao de RWA no agronegocio. Entendemos como a CVM regula ofertas de tokens via Resolucoes 88 e 160, e como o Parecer 40 classifica tokens como valores mobiliarios. Vimos as novas Resolucoes 519-521 do Banco Central que regulamentam VASPs a partir de fevereiro de 2026, e como a Lei do Agro cria a base legal para CPRs digitais e escriturais que podem ser tokenizadas. Finalmente, mergulhamos no DREX — a CBDC brasileira que promete revolucionar a infraestrutura de liquidacao e tokenizacao de ativos, com aplicacoes diretas para o agro: CPRs tokenizadas com DvP atomico, trade finance simplificado e interoperabilidade com CBDCs internacionais. O arcabouco regulatorio brasileiro, embora ainda em construcao, e um dos mais avancados do mundo para tokenizacao de RWA, e o agronegocio esta no centro dessa transformacao.

---

## Licao de Casa

1. Acesse o site da CVM e leia o Parecer de Orientacao 40/2022. Identifique os quatro criterios utilizados para classificar um token como valor mobiliario e aplique-os a um token hipotetico lastreado em recebiveis de CPR de soja. O token seria classificado como valor mobiliario? Justifique.
2. Pesquise as Resolucoes BCB 519, 520 e 521 no site do Banco Central. Identifique os requisitos de capital minimo e segregacao patrimonial exigidos para VASPs e analise como esses requisitos impactam plataformas brasileiras que oferecem tokens de ativos agro (como Mercado Bitcoin e Liqi).
3. Acompanhe as noticias sobre o DREX no site do Banco Central (bcb.gov.br/drex). Identifique quais instituicoes financeiras estao participando dos pilotos e se alguma delas esta testando casos de uso especificos para o agronegocio. Discuta quais titulos do agro (CPR, CDA, WA, CRA) se beneficiariam mais da liquidacao atomica do DREX.

---

## Questionario

**1. Qual resolucao da CVM criou o marco regulatorio para plataformas de crowdfunding de investimento que podem utilizar blockchain para emissao de tokens?**

a) Resolucao CVM 160
b) Resolucao CVM 88
c) Instrucao CVM 400
d) Parecer de Orientacao CVM 40

**Resposta: b**

**2. Segundo o Parecer de Orientacao CVM 40/2022, quando um token e considerado valor mobiliario?**

a) Sempre que for emitido em uma blockchain publica como Ethereum
b) Quando ha investimento de recursos financeiros em empreendimento coletivo, com expectativa de lucro derivado do esforco de terceiros
c) Apenas quando o token representar acoes de empresas listadas na B3
d) Quando o token for denominado em moeda estrangeira

**Resposta: b**

**3. As Resolucoes BCB 519, 520 e 521 regulamentam qual tipo de entidade, com vigencia a partir de fevereiro de 2026?**

a) Bancos digitais e fintechs de credito
b) Cooperativas de credito rural
c) Prestadoras de Servicos de Ativos Virtuais (VASPs)
d) Securitizadoras de recebiveis do agronegocio

**Resposta: c**

**4. O que e DvP atomico no contexto do DREX e por que ele e relevante para a tokenizacao de ativos agro?**

a) E um tipo de criptomoeda especifica para o agronegocio emitida pelo Banco Central
b) E a transferencia simultanea e indivisivel de ativo e pagamento na mesma transacao, eliminando o risco de liquidacao que existe no mercado tradicional
c) E um mecanismo de subsidio governamental para reducao de taxas de juros no credito rural
d) E um protocolo DeFi para emprestimos descentralizados entre produtores rurais

**Resposta: b**

**5. Qual dispositivo da Lei do Agro (Lei 13.986/2020) cria a base legal para a tokenizacao de CPRs?**

a) A obrigatoriedade de emissao de CPR em papel timbrado com reconhecimento de firma
b) A autorizacao para emissao de CPR sob forma escritural, registrada em sistema eletronico autorizado pelo Banco Central ou CVM, permitindo desmaterializacao e registro em blockchain
c) A proibicao de CPRs digitais para proteger produtores sem acesso a internet
d) A criacao de um imposto especifico sobre transacoes com CPRs tokenizadas

**Resposta: b**

---

## Proxima Aula

Na proxima aula, iniciamos o Modulo 2: Padroes de Tokenizacao Basicos, onde vamos estudar os padroes ERC-20, ERC-721 e ERC-1155 — as fundacoes tecnicas sobre as quais tokens de ativos reais sao construidos. Voce vai entender quando usar cada padrao, suas vantagens e limitacoes, e como eles se aplicam a tokenizacao de commodities, recebiveis e terras no agronegocio. Ate la!
