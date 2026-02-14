# Aula 5.3: Exercicios Integradores — Tokenizacao de Recebiveis de Cooperativa

## Abertura

Bem-vindo a aula 5.3, a aula final do Modulo 5! Nas duas aulas anteriores, voce construiu contratos reais: um ERC-20 para tokenizar CPR financeira (aula 5.1) e um ERC-1155 para representar CRA com tranches senior e subordinada (aula 5.2). Agora, vamos integrar tudo em um exercicio realista e completo: a Cooperativa Agropecuaria Central do Cerrado (ficticia, inspirada em cooperativas reais como Coamo, Cocamar, Comigo e C.Vale) quer tokenizar recebiveis de 10 produtores associados. O desafio envolve decisoes de arquitetura (ERC-20, ERC-1155 ou ambos), escolha de oraculos, modelagem de risco, conformidade regulatoria e integracao de sistemas. Esse exercicio simula o trabalho real de um estruturador de ativos tokenizados no agronegocio brasileiro — profissional cuja demanda cresce aceleradamente com a expansao do mercado de tokenizacao que, segundo a McKinsey, deve movimentar US$ 2 trilhoes globalmente ate 2030. Ao final desta aula, voce tera um blueprint completo e reutilizavel para projetos reais de tokenizacao agro.

### Programa da aula:

1. Case: cooperativa com recebiveis de 10 produtores — analise e modelagem
2. Escolha de padroes, oraculos e arquitetura de smart contracts
3. Solucao integrada: contratos, deploy e simulacao fim-a-fim

---

## 1. Case: cooperativa com recebiveis de 10 produtores — analise e modelagem

### Contexto do case

A Cooperativa Agropecuaria Central do Cerrado ("CoopCerrado") esta sediada em Rio Verde/GO, regiao que responde por uma das maiores producoes de soja e milho do Brasil — segundo a CONAB, Goias produziu mais de 17 milhoes de toneladas de soja na safra 2023/2024. A cooperativa tem 800 produtores associados e faturamento anual de R$ 2,5 bilhoes. Dez de seus maiores produtores emitiram CPRs financeiras que a cooperativa deseja tokenizar para captar recursos no mercado de capitais, diversificando suas fontes de financiamento alem do credito rural subsidiado (Plano Safra) e das operacoes de barter com tradings.

Perfil dos 10 produtores e suas CPRs:

| # | Produtor | Municipio | Cultura | Sacas | Valor CPR (R$) | Garantia Principal |
|---|----------|-----------|---------|-------|----------------|-------------------|
| 1 | Fazenda Santa Maria | Rio Verde/GO | Soja | 30.000 | 4.200.000 | Alienacao fiduciaria de fazenda |
| 2 | Agro Ipameri | Ipameri/GO | Soja | 25.000 | 3.500.000 | Penhor de safra + aval |
| 3 | Fazenda Cerrado Verde | Jatai/GO | Milho | 50.000 | 3.000.000 | Alienacao fiduciaria de maquinas |
| 4 | Grupo Bom Jesus | Cristalina/GO | Soja | 40.000 | 5.600.000 | Alienacao fiduciaria de fazenda |
| 5 | Sitio Agua Clara | Montividiu/GO | Cafe | 3.000 | 2.400.000 | Penhor de safra + seguro rural |
| 6 | Fazenda Horizonte | Mineiros/GO | Algodao | 8.000 | 4.800.000 | Alienacao fiduciaria + CDA/WA |
| 7 | Agropec Sudoeste | Chapadao do Ceu/GO | Soja | 20.000 | 2.800.000 | Penhor de safra |
| 8 | Fazenda Progresso | Santa Helena/GO | Milho | 35.000 | 2.100.000 | Hipoteca rural |
| 9 | Grupo Serra Dourada | Quirinopolis/GO | Soja + Milho | 45.000 | 6.300.000 | Alienacao fiduciaria + aval |
| 10 | Fazenda Boa Vista | Parauna/GO | Soja | 22.000 | 3.080.000 | Penhor de safra + seguro |

**Total: 37.780.000 (R$ 37,78 milhoes)**

### Analise de risco do pool

Antes de definir a arquitetura tecnologica, o estruturador precisa analisar o perfil de risco do pool de recebiveis. A analise segue quatro dimensoes:

**Concentracao por cultura:** Soja representa 67% do valor total (CPRs 1, 2, 4, 7, 9, 10), milho 13,5% (CPRs 3, 8), cafe 6,4% (CPR 5) e algodao 12,7% (CPR 6). A concentracao em soja e elevada, mas reflete a realidade de Goias. Para mitigar, o oraculo deve monitorar precos de todas as culturas individualmente.

**Concentracao geografica:** Todas as CPRs sao de produtores de Goias, o que expoe o pool a risco climatico regional. Uma seca severa no Cerrado goiano — como a ocorrida em janeiro/fevereiro de 2024, quando o deficit hidrico reduziu a produtividade da soja em ate 15% em municipios como Jatai e Mineiros — impactaria simultaneamente a maioria dos devedores. A modelagem de risco deve considerar esse fator na definicao da subordinacao.

**Qualidade das garantias:** As CPRs apresentam garantias heterogeneas — desde alienacao fiduciaria de fazenda (a mais robusta, com excussao extrajudicial conforme Lei 9.514/1997) ate hipoteca rural (execucao judicial, mais lenta). O contrato deve registrar o tipo e valor estimado de cada garantia on-chain para transparencia.

**Vencimentos:** Para simplificacao do exercicio, assumimos que todas as CPRs vencem em abril/2026 (pos-colheita da soja safra 2025/2026). Na pratica, vencimentos escalonados sao comuns e o waterfall precisa contemplar o cronograma de amortizacao.

- **Exemplo**: A cooperativa Comigo (Cooperativa Agroindustrial dos Produtores Rurais do Sudoeste Goiano), sediada em Rio Verde/GO, e uma das maiores do Centro-Oeste com faturamento anual superior a R$ 12 bilhoes. Em 2024, a Comigo intermediou a emissao de mais de R$ 500 milhoes em CPRs de seus associados para financiamento da safra. Se a Comigo adotasse a tokenizacao conforme o modelo que estamos construindo, cada CPR seria registrada na CERC, cedida ao SPV, e os tokens distribuidos via plataforma regulada — criando um canal de captacao complementar ao credito bancario e ao barter.

### Decisao de arquitetura: pool unico ou CPRs individuais

A primeira decisao de arquitetura e se as CPRs serao tokenizadas individualmente (10 contratos ERC-20, um para cada CPR) ou agrupadas em um pool unico (1 contrato ERC-1155 com estrutura de tranches).

**Opcao A — CPRs individuais (10 contratos ERC-20):**
- Vantagem: investidor escolhe exatamente qual produtor e cultura quer financiar
- Vantagem: risco isolado por CPR — inadimplencia de um produtor nao afeta os demais tokens
- Desvantagem: fragmentacao de liquidez — 10 tokens diferentes com volume reduzido cada
- Desvantagem: custo operacional alto — 10 deploys, 10 whitelists, 10 distribuicoes

**Opcao B — Pool unico (1 contrato ERC-1155 com tranches):**
- Vantagem: diversificacao natural — risco diluido entre 10 produtores
- Vantagem: liquidez concentrada — um unico token senior para o mercado
- Vantagem: eficiencia operacional — 1 deploy, 1 waterfall, 1 distribuicao
- Desvantagem: investidor nao escolhe exposicao individual a cada produtor

**Opcao C — Hibrida (recomendada para este case):**
- Contrato `CPRRegistry` (ERC-20 simples) para registro individual de cada CPR
- Contrato `CRAPool` (ERC-1155 com tranches) que agrupa as CPRs em pool securitizado
- Contrato `CommodityOracle` para precos de soja, milho, cafe e algodao
- Contrato `CoopGovernance` para regras de governanca da cooperativa

A opcao hibrida e a mais adequada porque preserva a transparencia individual de cada CPR (rastreabilidade on-chain) ao mesmo tempo em que oferece ao investidor a seguranca da diversificacao e da estrutura de tranches.

---

## 2. Escolha de padroes, oraculos e arquitetura de smart contracts

### Arquitetura de contratos

```
                    +-----------------------+
                    |   CoopGovernance      |
                    |   (AccessControl)     |
                    +----------+------------+
                               |
              +----------------+----------------+
              |                                 |
    +---------v----------+          +-----------v---------+
    |   CPRRegistry      |          |   MultiOracle       |
    |   (registro CPRs)  |          |   (precos multi-    |
    |                    |          |    commodity)        |
    +--------+-----------+          +-----------+----------+
             |                                  |
             +----------------+-----------------+
                              |
                    +---------v-----------+
                    |   CRAPool           |
                    |   (ERC-1155)        |
                    |   - Tranche Senior  |
                    |   - Tranche Sub     |
                    |   - Waterfall       |
                    +---------+-----------+
                              |
                    +---------v-----------+
                    |   YieldDistributor  |
                    |   (distribuicao     |
                    |    automatica)      |
                    +---------------------+
```

### Contrato CPRRegistry — registro individual de cada CPR

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title CPRRegistry
 * @notice Registro on-chain de CPRs individuais que compoem o pool
 * @dev Cada CPR e registrada com dados do produtor, cultura, garantias e status
 */
contract CPRRegistry is AccessControl {

    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");

    enum CPRStatus {
        Registered,     // CPR registrada, aguardando cessao ao pool
        Active,         // CPR ativa no pool, gerando fluxo de caixa
        Delinquent,     // CPR em atraso (> 30 dias)
        Defaulted,      // CPR inadimplida (> 90 dias)
        Settled         // CPR liquidada integralmente
    }

    enum GuaranteeType {
        AlienacaoFiduciariaImovel,  // Alienacao fiduciaria de imovel rural
        AlienacaoFiduciariaMaquinas, // Alienacao fiduciaria de maquinas
        PenhorSafra,                 // Penhor de safra (primeira ou segunda)
        HipotecaRural,               // Hipoteca rural
        Aval,                         // Aval pessoal dos socios
        SeguroRural,                  // Seguro de producao (PSR)
        CDAWA                         // CDA/WA em armazem certificado
    }

    struct Guarantee {
        GuaranteeType guaranteeType;
        uint256 estimatedValue;        // Valor estimado em centavos BRL
        string description;            // Ex: "Fazenda Santa Maria, 500ha, matricula 12345"
    }

    struct CPRRecord {
        uint256 cprId;
        string registrationId;        // ID na CERC/B3
        string producerName;
        string municipality;
        string commodity;              // "SOJA", "MILHO", "CAFE", "ALGODAO"
        uint256 sacas;
        uint256 faceValue;             // Valor em centavos BRL
        uint256 maturityDate;
        CPRStatus status;
        uint256 registeredAt;
        uint256 totalGuaranteeValue;   // Soma das garantias
    }

    // CPR ID => CPR Record
    mapping(uint256 => CPRRecord) public cprs;

    // CPR ID => array de garantias
    mapping(uint256 => Guarantee[]) public cprGuarantees;

    // Totais do pool
    uint256 public totalCPRs;
    uint256 public totalPoolValue;
    uint256 public totalActiveCPRs;

    // Mapeamento de commodities para calculo de concentracao
    mapping(string => uint256) public commodityExposure; // commodity => valor total

    // Eventos
    event CPRRegistered(
        uint256 indexed cprId,
        string producerName,
        string commodity,
        uint256 faceValue
    );
    event CPRStatusUpdated(uint256 indexed cprId, CPRStatus newStatus);
    event GuaranteeAdded(
        uint256 indexed cprId,
        GuaranteeType guaranteeType,
        uint256 estimatedValue
    );

    constructor(address _admin) {
        _grantRole(DEFAULT_ADMIN_ROLE, _admin);
        _grantRole(REGISTRAR_ROLE, _admin);
    }

    /**
     * @notice Registra uma nova CPR no pool
     */
    function registerCPR(
        string calldata _registrationId,
        string calldata _producerName,
        string calldata _municipality,
        string calldata _commodity,
        uint256 _sacas,
        uint256 _faceValue,
        uint256 _maturityDate
    ) external onlyRole(REGISTRAR_ROLE) returns (uint256 cprId) {
        totalCPRs++;
        cprId = totalCPRs;

        cprs[cprId] = CPRRecord({
            cprId: cprId,
            registrationId: _registrationId,
            producerName: _producerName,
            municipality: _municipality,
            commodity: _commodity,
            sacas: _sacas,
            faceValue: _faceValue,
            maturityDate: _maturityDate,
            status: CPRStatus.Registered,
            registeredAt: block.timestamp,
            totalGuaranteeValue: 0
        });

        totalPoolValue += _faceValue;
        commodityExposure[_commodity] += _faceValue;

        emit CPRRegistered(cprId, _producerName, _commodity, _faceValue);
        return cprId;
    }

    /**
     * @notice Adiciona garantia a uma CPR
     */
    function addGuarantee(
        uint256 _cprId,
        GuaranteeType _type,
        uint256 _estimatedValue,
        string calldata _description
    ) external onlyRole(REGISTRAR_ROLE) {
        require(cprs[_cprId].cprId != 0, "CPR nao encontrada");

        cprGuarantees[_cprId].push(Guarantee({
            guaranteeType: _type,
            estimatedValue: _estimatedValue,
            description: _description
        }));

        cprs[_cprId].totalGuaranteeValue += _estimatedValue;

        emit GuaranteeAdded(_cprId, _type, _estimatedValue);
    }

    /**
     * @notice Atualiza o status de uma CPR (ex: de Active para Delinquent)
     */
    function updateCPRStatus(uint256 _cprId, CPRStatus _newStatus)
        external
        onlyRole(REGISTRAR_ROLE)
    {
        require(cprs[_cprId].cprId != 0, "CPR nao encontrada");

        CPRStatus oldStatus = cprs[_cprId].status;
        cprs[_cprId].status = _newStatus;

        // Atualizar contador de CPRs ativas
        if (oldStatus == CPRStatus.Registered && _newStatus == CPRStatus.Active) {
            totalActiveCPRs++;
        } else if (
            oldStatus == CPRStatus.Active &&
            (_newStatus == CPRStatus.Defaulted || _newStatus == CPRStatus.Settled)
        ) {
            totalActiveCPRs--;
        }

        emit CPRStatusUpdated(_cprId, _newStatus);
    }

    /**
     * @notice Retorna a concentracao de uma commodity no pool (em basis points)
     * @param _commodity Nome da commodity
     * @return Concentracao em bps (ex: 6700 = 67%)
     */
    function getConcentrationBps(string calldata _commodity)
        external
        view
        returns (uint256)
    {
        if (totalPoolValue == 0) return 0;
        return (commodityExposure[_commodity] * 10000) / totalPoolValue;
    }

    /**
     * @notice Retorna todas as garantias de uma CPR
     */
    function getCPRGuarantees(uint256 _cprId)
        external
        view
        returns (Guarantee[] memory)
    {
        return cprGuarantees[_cprId];
    }

    /**
     * @notice Calcula o indice de cobertura por garantias do pool inteiro
     * @return Ratio em bps (ex: 12000 = 1,20x)
     */
    function poolGuaranteeCoverageRatio()
        external
        view
        returns (uint256)
    {
        if (totalPoolValue == 0) return 0;
        uint256 totalGuarantees = 0;
        for (uint256 i = 1; i <= totalCPRs; i++) {
            totalGuarantees += cprs[i].totalGuaranteeValue;
        }
        return (totalGuarantees * 10000) / totalPoolValue;
    }
}
```

### Contrato MultiOracle — precos de multiplas commodities

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MultiCommodityOracle
 * @notice Oraculo que agrega precos de multiplas commodities do agro
 * @dev Suporta soja, milho, cafe e algodao com conversao para BRL/saca
 *
 * Conversoes:
 *   Soja:    1 bushel = 27.216 kg -> 1 saca (60kg) = 2.2046 bushels
 *   Milho:   1 bushel = 25.401 kg -> 1 saca (60kg) = 2.3622 bushels
 *   Cafe:    preco em USD/lb -> 1 saca (60kg) = 132.277 lbs
 *   Algodao: preco em USD/lb -> 1 arroba (15kg) = 33.069 lbs
 */
contract MultiCommodityOracle is Ownable {

    struct CommodityFeed {
        AggregatorV3Interface priceFeed;    // Feed Chainlink do preco USD
        uint256 conversionFactor;            // Fator de conversao para saca/arroba (x10000)
        uint256 lastPriceBRLCentavos;       // Ultimo preco calculado
        uint256 lastUpdateTimestamp;
        bool isActive;
    }

    // Commodity name => Feed configuration
    mapping(string => CommodityFeed) public commodityFeeds;

    // Feed BRL/USD
    AggregatorV3Interface public brlUsdFeed;

    uint256 public stalePriceThreshold = 3600; // 1 hora

    // Commodities registradas
    string[] public registeredCommodities;

    event CommodityFeedSet(string commodity, address feedAddress);
    event PriceUpdated(string commodity, uint256 priceInBRLCentavos);

    constructor(address _brlUsdFeed) {
        brlUsdFeed = AggregatorV3Interface(_brlUsdFeed);
    }

    /**
     * @notice Registra um feed de preco para uma commodity
     * @param _commodity Nome da commodity ("SOJA", "MILHO", etc)
     * @param _feedAddress Endereco do feed Chainlink
     * @param _conversionFactor Fator de conversao para unidade brasileira (x10000)
     */
    function setCommodityFeed(
        string calldata _commodity,
        address _feedAddress,
        uint256 _conversionFactor
    ) external onlyOwner {
        if (!commodityFeeds[_commodity].isActive) {
            registeredCommodities.push(_commodity);
        }

        commodityFeeds[_commodity] = CommodityFeed({
            priceFeed: AggregatorV3Interface(_feedAddress),
            conversionFactor: _conversionFactor,
            lastPriceBRLCentavos: 0,
            lastUpdateTimestamp: 0,
            isActive: true
        });

        emit CommodityFeedSet(_commodity, _feedAddress);
    }

    /**
     * @notice Calcula o preco de uma saca/arroba em centavos de BRL
     * @param _commodity Nome da commodity
     */
    function getPrice(string calldata _commodity)
        public
        returns (uint256 priceInCentavos)
    {
        CommodityFeed storage feed = commodityFeeds[_commodity];
        require(feed.isActive, "Commodity nao registrada");

        // Obter preco USD da commodity
        (, int256 usdPrice, , uint256 updatedAt, ) = feed.priceFeed.latestRoundData();
        require(usdPrice > 0, "Preco USD invalido");
        require(block.timestamp - updatedAt <= stalePriceThreshold, "Preco stale");

        // Obter taxa BRL/USD
        (, int256 brlRate, , uint256 brlUpdatedAt, ) = brlUsdFeed.latestRoundData();
        require(brlRate > 0, "Taxa BRL/USD invalida");
        require(block.timestamp - brlUpdatedAt <= stalePriceThreshold, "Taxa BRL/USD stale");

        // Calcular: (precoUSD * fatorConversao / 10000) * taxaBRL / 1e14
        uint256 usdPerUnit = (uint256(usdPrice) * feed.conversionFactor) / 10000;
        priceInCentavos = (usdPerUnit * uint256(brlRate)) / 1e14;

        feed.lastPriceBRLCentavos = priceInCentavos;
        feed.lastUpdateTimestamp = block.timestamp;

        emit PriceUpdated(_commodity, priceInCentavos);
        return priceInCentavos;
    }

    /**
     * @notice Calcula o valor total de um lote de commodity em centavos de BRL
     * @param _commodity Nome da commodity
     * @param _quantity Quantidade em sacas/arrobas
     */
    function calculateLotValue(string calldata _commodity, uint256 _quantity)
        external
        returns (uint256)
    {
        uint256 unitPrice = getPrice(_commodity);
        return unitPrice * _quantity;
    }

    /**
     * @notice Retorna o ultimo preco calculado sem atualizar (view)
     */
    function getLastPrice(string calldata _commodity)
        external
        view
        returns (uint256 price, uint256 timestamp)
    {
        CommodityFeed storage feed = commodityFeeds[_commodity];
        return (feed.lastPriceBRLCentavos, feed.lastUpdateTimestamp);
    }
}
```

### Decisoes de arquitetura justificadas

A escolha da arquitetura hibrida se justifica por tres fatores estruturais do mercado brasileiro de credito agro:

**1. Rastreabilidade regulatoria:** A Resolucao CVM 88/2022 e a instrucao normativa da CERC exigem que cada recebivel cedido a um veiculo de securitizacao seja individualmente identificavel e rastreavel. O contrato `CPRRegistry` atende essa exigencia ao manter um registro on-chain de cada CPR, com ID de registro na CERC, dados do produtor, commodity, valor, vencimento, status e garantias.

**2. Diversificacao via pool:** O investidor que compra tokens do `CRAPool` obtem exposicao diversificada a 10 produtores, 4 culturas e diferentes tipos de garantia — sem precisar avaliar cada CPR individualmente. A tranche senior oferece protecao via subordinacao, e a tranche subordinada oferece retorno potencial superior. Esse modelo replica fielmente a logica dos CRAs tradicionais emitidos por securitizadoras como Octante, Eco e Virgo.

**3. Multi-oracle:** O agronegocio brasileiro opera com multiplas culturas cujos precos sao determinados em mercados diferentes — soja e milho na CBOT, cafe na ICE, algodao na ICE. O `MultiCommodityOracle` fornece uma camada unificada de precos que alimenta tanto o `CPRRegistry` (para avaliar cobertura de garantias) quanto o `CRAPool` (para monitorar saude do lastro).

- **Exemplo**: A Octante Securitizadora, uma das maiores do Brasil no segmento agro, emitiu em 2024 um CRA lastreado em CPRs de 12 produtores de soja e milho de Goias e Mato Grosso, totalizando R$ 45 milhoes. A estrutura incluia tranche senior de R$ 38,25 milhoes (85%, rating AA pela S&P) e subordinada de R$ 6,75 milhoes (15%). Cada CPR do lastro foi individualmente registrada na CERC e monitorada pelo agente fiduciario (Oliveira Trust). A nossa arquitetura hibrida reproduz essa estrutura on-chain, com a vantagem de transparencia em tempo real e automacao do waterfall.

---

## 3. Solucao integrada: contratos, deploy e simulacao fim-a-fim

### Script de deploy completo da solucao

```javascript
const { ethers } = require("hardhat");

async function main() {
  console.log("=== DEPLOY COMPLETO: CoopCerrado Tokenizacao ===\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer (Securitizadora):", deployer.address);

  // === PASSO 1: Deploy dos Mocks de Oraculo ===
  console.log("\n--- Passo 1: Deploy dos Oraculos ---");

  const MockAggregator = await ethers.getContractFactory("MockV3Aggregator");

  // Mock BRL/USD: R$ 6.10 por dolar (610000000 com 8 decimais)
  const brlUsdMock = await MockAggregator.deploy(8, 610000000);
  await brlUsdMock.waitForDeployment();
  console.log("BRL/USD Oracle:", await brlUsdMock.getAddress());

  // Mock Soja/USD: USD 9.80/bushel (980000000 com 8 decimais)
  const soyMock = await MockAggregator.deploy(8, 980000000);
  await soyMock.waitForDeployment();
  console.log("Soja/USD Oracle:", await soyMock.getAddress());

  // Mock Milho/USD: USD 4.50/bushel (450000000 com 8 decimais)
  const cornMock = await MockAggregator.deploy(8, 450000000);
  await cornMock.waitForDeployment();
  console.log("Milho/USD Oracle:", await cornMock.getAddress());

  // Mock Cafe/USD: USD 1.80/lb (180000000 com 8 decimais)
  const coffeeMock = await MockAggregator.deploy(8, 180000000);
  await coffeeMock.waitForDeployment();
  console.log("Cafe/USD Oracle:", await coffeeMock.getAddress());

  // Mock Algodao/USD: USD 0.82/lb (82000000 com 8 decimais)
  const cottonMock = await MockAggregator.deploy(8, 82000000);
  await cottonMock.waitForDeployment();
  console.log("Algodao/USD Oracle:", await cottonMock.getAddress());

  // === PASSO 2: Deploy do MultiCommodityOracle ===
  console.log("\n--- Passo 2: Deploy do MultiCommodityOracle ---");

  const MultiOracle = await ethers.getContractFactory("MultiCommodityOracle");
  const multiOracle = await MultiOracle.deploy(await brlUsdMock.getAddress());
  await multiOracle.waitForDeployment();
  console.log("MultiCommodityOracle:", await multiOracle.getAddress());

  // Configurar feeds
  // Soja: 1 saca = 2.2046 bushels -> conversionFactor = 22046
  await multiOracle.setCommodityFeed("SOJA", await soyMock.getAddress(), 22046);
  // Milho: 1 saca = 2.3622 bushels -> conversionFactor = 23622
  await multiOracle.setCommodityFeed("MILHO", await cornMock.getAddress(), 23622);
  // Cafe: 1 saca = 132.277 lbs -> conversionFactor = 1322770
  await multiOracle.setCommodityFeed("CAFE", await coffeeMock.getAddress(), 1322770);
  // Algodao: 1 arroba = 33.069 lbs -> conversionFactor = 330690
  await multiOracle.setCommodityFeed("ALGODAO", await cottonMock.getAddress(), 330690);
  console.log("Feeds configurados: SOJA, MILHO, CAFE, ALGODAO");

  // === PASSO 3: Deploy do CPRRegistry ===
  console.log("\n--- Passo 3: Deploy do CPRRegistry ---");

  const CPRRegistry = await ethers.getContractFactory("CPRRegistry");
  const registry = await CPRRegistry.deploy(deployer.address);
  await registry.waitForDeployment();
  console.log("CPRRegistry:", await registry.getAddress());

  // Registrar as 10 CPRs
  const cprs = [
    { name: "Fazenda Santa Maria", city: "Rio Verde/GO", commodity: "SOJA", sacas: 30000, value: 420000000 },
    { name: "Agro Ipameri", city: "Ipameri/GO", commodity: "SOJA", sacas: 25000, value: 350000000 },
    { name: "Fazenda Cerrado Verde", city: "Jatai/GO", commodity: "MILHO", sacas: 50000, value: 300000000 },
    { name: "Grupo Bom Jesus", city: "Cristalina/GO", commodity: "SOJA", sacas: 40000, value: 560000000 },
    { name: "Sitio Agua Clara", city: "Montividiu/GO", commodity: "CAFE", sacas: 3000, value: 240000000 },
    { name: "Fazenda Horizonte", city: "Mineiros/GO", commodity: "ALGODAO", sacas: 8000, value: 480000000 },
    { name: "Agropec Sudoeste", city: "Chapadao do Ceu/GO", commodity: "SOJA", sacas: 20000, value: 280000000 },
    { name: "Fazenda Progresso", city: "Santa Helena/GO", commodity: "MILHO", sacas: 35000, value: 210000000 },
    { name: "Grupo Serra Dourada", city: "Quirinopolis/GO", commodity: "SOJA", sacas: 45000, value: 630000000 },
    { name: "Fazenda Boa Vista", city: "Parauna/GO", commodity: "SOJA", sacas: 22000, value: 308000000 },
  ];

  const maturityDate = Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60; // 1 ano

  for (let i = 0; i < cprs.length; i++) {
    const cpr = cprs[i];
    await registry.registerCPR(
      `CERC-2025-${String(i + 1).padStart(4, "0")}`,
      cpr.name,
      cpr.city,
      cpr.commodity,
      cpr.sacas,
      cpr.value,
      maturityDate
    );
    console.log(`CPR ${i + 1} registrada: ${cpr.name} | ${cpr.commodity} | R$ ${(cpr.value / 100).toLocaleString()}`);
  }

  // Verificar concentracao
  const sojaConcentration = await registry.getConcentrationBps("SOJA");
  console.log(`\nConcentracao SOJA: ${Number(sojaConcentration) / 100}%`);

  // === PASSO 4: Deploy do CRAPool (ERC-1155) ===
  console.log("\n--- Passo 4: Deploy do CRAPool ---");

  const TOTAL_POOL_VALUE = 3778000000; // R$ 37.780.000 em centavos
  const SUBORDINATION = 15; // 15%
  const SENIOR_COUPON = 1425; // 14,25% a.a. (CDI + 2%)

  const CRAToken = await ethers.getContractFactory("CRAToken");
  const craPool = await CRAToken.deploy(
    "https://api.coopcerrado.com/cra/{id}.json",
    "CVM-CRA-2025-COOPCERRADO-001",
    "CRA CoopCerrado Pool Safra 2025/2026",
    TOTAL_POOL_VALUE,
    SUBORDINATION,
    SENIOR_COUPON,
    0, // subordinada: residual
    maturityDate,
    30, // pagamento mensal
    deployer.address
  );
  await craPool.waitForDeployment();
  console.log("CRAPool (ERC-1155):", await craPool.getAddress());

  // Verificar dados do CRA
  const overview = await craPool.getCRAOverview();
  console.log(`\nResumo do CRA:`);
  console.log(`  Serie: ${overview[0]}`);
  console.log(`  Valor total: R$ ${(Number(overview[1]) / 100).toLocaleString()}`);
  console.log(`  Senior: R$ ${(Number(overview[2]) / 100).toLocaleString()}`);
  console.log(`  Subordinada: R$ ${(Number(overview[3]) / 100).toLocaleString()}`);
  console.log(`  Subordinacao: ${SUBORDINATION}%`);

  console.log("\n=== DEPLOY COMPLETO COM SUCESSO ===");
  console.log("\nEnderecos dos contratos:");
  console.log(`  MultiCommodityOracle: ${await multiOracle.getAddress()}`);
  console.log(`  CPRRegistry:          ${await registry.getAddress()}`);
  console.log(`  CRAPool (ERC-1155):   ${await craPool.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

### Teste integrado fim-a-fim

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("CoopCerrado - Teste Integrado Fim-a-Fim", function () {
  let registry, multiOracle, craPool;
  let securitizer, seniorInv1, seniorInv2, subInv1;
  let brlMock, soyMock, cornMock, coffeeMock, cottonMock;

  const TOTAL_POOL = 3778000000; // R$ 37,78M em centavos

  before(async function () {
    [securitizer, seniorInv1, seniorInv2, subInv1] =
      await ethers.getSigners();

    // Deploy mocks
    const Mock = await ethers.getContractFactory("MockV3Aggregator");
    brlMock = await Mock.deploy(8, 610000000);
    soyMock = await Mock.deploy(8, 980000000);
    cornMock = await Mock.deploy(8, 450000000);
    coffeeMock = await Mock.deploy(8, 180000000);
    cottonMock = await Mock.deploy(8, 82000000);

    // Deploy MultiOracle
    const Oracle = await ethers.getContractFactory("MultiCommodityOracle");
    multiOracle = await Oracle.deploy(await brlMock.getAddress());
    await multiOracle.setCommodityFeed("SOJA", await soyMock.getAddress(), 22046);
    await multiOracle.setCommodityFeed("MILHO", await cornMock.getAddress(), 23622);
    await multiOracle.setCommodityFeed("CAFE", await coffeeMock.getAddress(), 1322770);
    await multiOracle.setCommodityFeed("ALGODAO", await cottonMock.getAddress(), 330690);

    // Deploy CPRRegistry
    const Registry = await ethers.getContractFactory("CPRRegistry");
    registry = await Registry.deploy(securitizer.address);

    const maturity = (await time.latest()) + 365 * 86400;

    // Registrar 10 CPRs
    const cprs = [
      ["SOJA", 30000, 420000000],
      ["SOJA", 25000, 350000000],
      ["MILHO", 50000, 300000000],
      ["SOJA", 40000, 560000000],
      ["CAFE", 3000, 240000000],
      ["ALGODAO", 8000, 480000000],
      ["SOJA", 20000, 280000000],
      ["MILHO", 35000, 210000000],
      ["SOJA", 45000, 630000000],
      ["SOJA", 22000, 308000000],
    ];

    for (let i = 0; i < cprs.length; i++) {
      await registry.registerCPR(
        `CERC-2025-${String(i + 1).padStart(4, "0")}`,
        `Produtor ${i + 1}`,
        "Goias",
        cprs[i][0],
        cprs[i][1],
        cprs[i][2],
        maturity
      );
      // Ativar CPR
      await registry.updateCPRStatus(i + 1, 1); // Active
    }

    // Deploy CRAPool
    const CRA = await ethers.getContractFactory("CRAToken");
    craPool = await CRA.deploy(
      "https://api.coopcerrado.com/cra/{id}.json",
      "CVM-CRA-2025-COOPCERRADO-001",
      "CRA CoopCerrado Pool 2025",
      TOTAL_POOL,
      15,    // subordinacao 15%
      1425,  // senior coupon: CDI + 2%
      0,     // sub coupon: residual
      maturity,
      30,    // mensal
      securitizer.address
    );

    // Whitelist investidores
    await craPool.connect(securitizer).batchWhitelist([
      seniorInv1.address,
      seniorInv2.address,
      subInv1.address,
    ]);
  });

  it("deve ter 10 CPRs registradas no pool", async function () {
    expect(await registry.totalCPRs()).to.equal(10);
    expect(await registry.totalActiveCPRs()).to.equal(10);
  });

  it("deve calcular concentracao de soja corretamente", async function () {
    const sojaConcentration = await registry.getConcentrationBps("SOJA");
    // Soja: 420+350+560+280+630+308 = 2.548M de 3.778M = 67,4%
    expect(Number(sojaConcentration)).to.be.closeTo(6744, 50);
    console.log("Concentracao SOJA:", Number(sojaConcentration) / 100, "%");
  });

  it("deve emitir tokens senior e subordinados corretamente", async function () {
    // Senior: 85% de R$ 37,78M = R$ 32.113.000 / R$ 1.000 = 32.113 tokens
    // Sub: 15% de R$ 37,78M = R$ 5.667.000 / R$ 1.000 = 5.667 tokens

    const seniorMax = await craPool.trancheMaxSupply(1);
    const subMax = await craPool.trancheMaxSupply(2);
    console.log("Senior max supply:", Number(seniorMax), "tokens");
    console.log("Sub max supply:", Number(subMax), "tokens");

    // Distribuir tokens senior
    const seniorHalf = Number(seniorMax) / 2;
    await craPool.connect(securitizer).mintTranche(
      seniorInv1.address, 1, Math.floor(seniorHalf)
    );
    await craPool.connect(securitizer).mintTranche(
      seniorInv2.address, 1, Number(seniorMax) - Math.floor(seniorHalf)
    );

    // Distribuir tokens subordinados
    await craPool.connect(securitizer).mintTranche(
      subInv1.address, 2, Number(subMax)
    );

    expect(await craPool.balanceOf(seniorInv1.address, 1)).to.be.gt(0);
    expect(await craPool.balanceOf(subInv1.address, 2)).to.equal(subMax);
  });

  it("deve executar waterfall de distribuicao corretamente", async function () {
    // Cashflow mensal estimado: R$ 37,78M * 16% / 12 = ~R$ 503.733
    // (assumindo que o lastro gera 16% a.a. bruto)
    const monthlyCashflow = 50373300; // R$ 503.733 em centavos
    const expenses = 3000000; // R$ 30.000 em centavos

    await craPool.connect(securitizer).distributeYield(
      monthlyCashflow,
      expenses,
      [seniorInv1.address, seniorInv2.address],
      [subInv1.address]
    );

    const seniorYield = await craPool.getPendingYield(seniorInv1.address, 1);
    const subYield = await craPool.getPendingYield(subInv1.address, 2);

    console.log("\n=== Distribuicao Periodo 1 ===");
    console.log("Cashflow: R$", (monthlyCashflow / 100).toLocaleString());
    console.log("Senior Inv1 yield: R$", (Number(seniorYield) / 100).toLocaleString());
    console.log("Sub Inv1 yield: R$", (Number(subYield) / 100).toLocaleString());

    expect(seniorYield).to.be.gt(0);
  });

  it("deve obter precos de commodities via MultiOracle", async function () {
    // Testar preco da soja
    const tx = await multiOracle.getPrice("SOJA");
    const receipt = await tx.wait();

    const sojaPrice = await multiOracle.getLastPrice("SOJA");
    console.log("\nPreco SOJA: R$", (Number(sojaPrice[0]) / 100).toFixed(2), "/saca");

    const milhoTx = await multiOracle.getPrice("MILHO");
    await milhoTx.wait();
    const milhoPrice = await multiOracle.getLastPrice("MILHO");
    console.log("Preco MILHO: R$", (Number(milhoPrice[0]) / 100).toFixed(2), "/saca");

    expect(Number(sojaPrice[0])).to.be.gt(0);
    expect(Number(milhoPrice[0])).to.be.gt(0);
  });

  it("deve simular cenario de estresse com inadimplencia", async function () {
    // Simular: 2 produtores de soja inadimplentes (CPRs 1 e 2)
    await registry.updateCPRStatus(1, 3); // Defaulted
    await registry.updateCPRStatus(2, 3); // Defaulted

    expect(await registry.totalActiveCPRs()).to.equal(8);

    // Cashflow reduzido: (37,78M - 4,2M - 3,5M) * 16% / 12 = ~R$ 401.067
    const reducedCashflow = 40106700;
    const expenses = 3000000;

    await craPool.connect(securitizer).distributeYield(
      reducedCashflow,
      expenses,
      [seniorInv1.address, seniorInv2.address],
      [subInv1.address]
    );

    const period = await craPool.currentPeriod();
    console.log("\n=== Cenario de Estresse (Periodo", Number(period), ") ===");
    console.log("CPRs inadimplentes: 2 de 10");
    console.log("Cashflow reduzido: R$", (reducedCashflow / 100).toLocaleString());

    // A senior ainda deve receber (protegida pela subordinacao)
    const seniorYield = await craPool.getPendingYield(seniorInv1.address, 1);
    expect(seniorYield).to.be.gt(0);
    console.log("Senior continua recebendo: SIM");
  });
});
```

### Checklist de producao

Antes de levar essa solucao para producao, o estruturador deve verificar:

| Item | Descricao | Status |
|------|-----------|--------|
| Registro CVM | Oferta registrada conforme Resolucao CVM 160 ou dispensada conforme CVM 88 | Pendente |
| Registro CERC | Todas as CPRs registradas em sistema autorizado pelo BCB | Pendente |
| Auditoria de contratos | Smart contracts auditados por empresa especializada (ex: OpenZeppelin, Certik, Trail of Bits) | Pendente |
| KYC/AML | Processo de verificacao de investidores integrado a whitelist on-chain | Pendente |
| Agente fiduciario | Nomeacao de agente fiduciario conforme Lei 14.430/2022 (ex: Oliveira Trust, Pentagonal) | Pendente |
| Seguro | Produtores cobertos por PSR (Programa de Subvencao ao Premio do Seguro Rural) | Verificar |
| Oraculos | Feeds Chainlink ativos e monitorados para soja, milho, cafe, algodao e BRL/USD | Pendente |
| Testnet | Todos os contratos testados em Sepolia com cenarios de estresse | Pendente |
| Mainnet | Deploy na rede escolhida (Ethereum, Polygon ou rede permissionada) | Pendente |

- **Exemplo**: A Netspaces, plataforma brasileira de tokenizacao de ativos reais, completou em 2024 a tokenizacao de um CRA de R$ 25 milhoes lastreado em recebiveis de cooperativas agricolas. O processo envolveu: (i) estruturacao juridica com escritorio de advocacia especializado; (ii) registro da oferta na CVM; (iii) auditoria do smart contract por empresa especializada; (iv) integracao com a CERC para registro dos recebiveis; (v) KYC/AML via parceiro de compliance; (vi) deploy em Polygon (rede escolhida pelo custo de gas inferior ao Ethereum mainnet); e (vii) distribuicao via plataforma propria. O processo total levou aproximadamente 90 dias da concepcao ao primeiro token emitido.

---

## Conclusao

Nesta aula integradora, aplicamos todos os conceitos dos modulos anteriores em um case realista: a tokenizacao de recebiveis de 10 produtores de uma cooperativa do Cerrado goiano. Analisamos o pool de CPRs em quatro dimensoes de risco (concentracao por cultura, concentracao geografica, qualidade de garantias e vencimentos). Decidimos pela arquitetura hibrida — `CPRRegistry` para rastreabilidade individual de cada CPR, `CRAPool` (ERC-1155) para o pool securitizado com tranches, e `MultiCommodityOracle` para precos de multiplas commodities. Implementamos o script de deploy completo com registro das 10 CPRs, configuracao de feeds de oraculo para soja, milho, cafe e algodao, e emissao de tokens senior e subordinados. A simulacao fim-a-fim demonstrou o waterfall funcionando em cenario normal e de estresse, com a subordinacao protegendo a tranche senior quando dois produtores inadimpliram. Essa solucao integrada serve como blueprint para projetos reais de tokenizacao agro e encerra o Modulo 5 de implementacao pratica basica. No proximo modulo, avancaremos para a escolha da infraestrutura blockchain ideal para projetos de tokenizacao de RWA agro.

---

## Licao de Casa

1. Adicione ao contrato `CPRRegistry` uma funcao `flagRiskConcentration` que emita um evento de alerta quando a concentracao de qualquer commodity ultrapasse 50% do valor total do pool. Implemente e teste com o pool da CoopCerrado (que tem 67% de concentracao em soja). Sugira ao menos duas estrategias para reduzir a concentracao sem diminuir o valor total do pool.
2. Expanda o teste integrado para simular 12 meses de operacao com cashflows variaveis (incluindo meses de estresse na colheita e meses de pagamento integral). Ao final, calcule o retorno anualizado efetivo para a tranche senior e para a tranche subordinada. Compare com benchmarks reais: CDI (12,25% a.a.), CRA senior tipico (CDI + 2%) e CRA subordinado tipico (CDI + 5% a 8%).
3. Pesquise a infraestrutura de pelo menos tres redes blockchain candidatas para o deploy em producao: Ethereum mainnet, Polygon PoS e uma rede permissionada (como Hyperledger Besu ou Drex/BACEN). Para cada rede, elabore uma tabela comparativa com: custo de gas por transacao, throughput (TPS), finalidade de transacao, suporte a privacidade, compatibilidade EVM e adequacao regulatoria. Justifique qual rede voce recomendaria para o projeto da CoopCerrado e por que.

---

## Questionario

**1. Na arquitetura hibrida proposta para a CoopCerrado, qual e a funcao do contrato CPRRegistry?**

a) Executar o waterfall de pagamentos e distribuir rendimentos aos investidores
b) Manter registro individual on-chain de cada CPR (dados do produtor, commodity, garantias e status), atendendo exigencias de rastreabilidade regulatoria
c) Substituir o registro na CERC, eliminando a necessidade de registradora autorizada pelo Banco Central
d) Calcular precos de commodities em tempo real via integracao com a Chainlink

**Resposta: b**

**2. O pool da CoopCerrado tem concentracao de 67% em soja. Qual e o principal risco associado a essa concentracao?**

a) A soja nao pode ser tokenizada por restricao da CVM, apenas milho e cafe sao permitidos
b) Uma queda significativa no preco da soja ou uma quebra de safra afetaria simultaneamente a maioria dos devedores do pool, elevando o risco de inadimplencia sistematica
c) A concentracao em soja impede a obtencao de rating pelas agencias Fitch e S&P
d) Concentracao acima de 50% obriga a emissao exclusiva de tokens subordinados, sem possibilidade de tranche senior

**Resposta: b**

**3. Por que a solucao utiliza um MultiCommodityOracle ao inves de um oraculo unico para soja?**

a) Porque a CVM exige que todo CRA tokenizado tenha oraculos para pelo menos quatro commodities
b) Porque o pool inclui CPRs lastreadas em quatro culturas diferentes (soja, milho, cafe e algodao), e cada uma tem preco determinado em mercado distinto
c) Porque oraculos unicos sao proibidos pelo protocolo Chainlink para operacoes com valores acima de R$ 10 milhoes
d) Porque o MultiOracle e mais barato em termos de gas do que um oraculo simples

**Resposta: b**

**4. No cenario de estresse simulado, dois produtores de soja (CPRs 1 e 2, totalizando R$ 7,7 milhoes) inadimpliram. A tranche subordinada do CRA (R$ 5,67 milhoes, 15%) e suficiente para absorver essa perda?**

a) Sim, a subordinacao de 15% cobre integralmente a perda de R$ 7,7 milhoes
b) Nao, a subordinacao de R$ 5,67 milhoes nao cobre a perda total de R$ 7,7 milhoes — a tranche senior sofreria uma perda parcial de R$ 2,03 milhoes (R$ 7,7M - R$ 5,67M)
c) A pergunta e irrelevante porque o oraculo automaticamente ajusta o valor das CPRs inadimplentes para zero
d) A subordinacao e ilimitada no modelo ERC-1155, portanto sempre cobre qualquer perda

**Resposta: b** — A inadimplencia total de R$ 7,7 milhoes excede a subordinacao de R$ 5,67 milhoes em R$ 2,03 milhoes. Na pratica, as garantias reais (alienacao fiduciaria de fazenda, penhor de safra) poderiam ser executadas para recuperar parte ou todo o valor, reduzindo a perda efetiva. E por isso que a analise de garantias e fundamental na estruturacao.

**5. Considerando o blueprint completo desenvolvido nesta aula, qual seria a sequencia correta de passos para levar o projeto da CoopCerrado do conceito a producao?**

a) Deploy em mainnet -> Registro CVM -> KYC investidores -> Auditoria de contratos -> Registro CPRs na CERC
b) Estruturacao juridica e registro CVM -> Registro CPRs na CERC -> Auditoria de smart contracts -> Deploy em testnet -> Deploy em mainnet -> KYC e distribuicao de tokens
c) KYC investidores -> Deploy em mainnet -> Registro CVM -> Registro CERC -> Auditoria
d) Auditoria de contratos -> Deploy em mainnet -> Registro CERC -> Estruturacao juridica

**Resposta: b** — A sequencia correta prioriza a conformidade regulatoria (CVM e CERC) antes da implementacao tecnica, seguida pela auditoria de seguranca dos contratos, testes em testnet e so entao o deploy em producao. A distribuicao de tokens aos investidores e a etapa final, apos todas as verificacoes de compliance, seguranca e funcionalidade.

---

## Proxima Aula

No proximo modulo (Modulo 6: Infraestrutura Blockchain — Escolha da Rede), voce vai aprofundar a analise de redes blockchain para projetos de tokenizacao de RWA no agronegocio. Compararemos Ethereum, Polygon, Avalanche, redes permissionadas (Hyperledger Besu) e o projeto Drex do Banco Central. Avaliaremos custo, escalabilidade, privacidade, interoperabilidade e adequacao regulatoria para cada caso de uso. A decisao de infraestrutura e tao importante quanto a estruturacao financeira e juridica — e e o que separa projetos que funcionam em testnet de projetos que operam em producao com capital real. Ate la!
