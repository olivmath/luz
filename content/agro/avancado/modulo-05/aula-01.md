# Aula 5.1: Tokenizacao de CPR com ERC-20

## Abertura

Bem-vindo a aula 5.1 do Modulo 5! Ate aqui, voce construiu uma base solida sobre Web3, tokenizacao de RWA, marcos regulatorios e arquitetura de smart contracts aplicados ao agronegocio. Agora, chegou o momento de colocar a mao na massa e implementar, passo a passo, a tokenizacao de uma Cedula de Produto Rural (CPR) utilizando o padrao ERC-20 na blockchain Ethereum. A CPR e o instrumento juridico mais fundamental do credito agro brasileiro — criada pela Lei 8.929/1994 e modernizada pela Lei 13.986/2020 (Lei do Agro) — e sua versao tokenizada representa uma das aplicacoes mais promissoras da tecnologia blockchain no financiamento do agronegocio. Empresas como Agrotoken (Argentina/Brasil), Liqi Digital Assets e MB Tokens ja operam com tokenizacao de recebiveis agro no mercado real. Nesta aula, vamos construir um contrato ERC-20 completo para representar uma CPR financeira tokenizada, integrar um oraculo de preco para atualizar o valor do ativo subjacente e realizar testes basicos com deploy em testnet.

### Programa da aula:

1. Fluxo de tokenizacao: originador, SPV, contrato ERC-20 e distribuicao
2. Integracao com oraculo de preco (Chainlink)
3. Testes basicos e deploy em testnet

---

## 1. Fluxo de tokenizacao: originador, SPV, contrato ERC-20 e distribuicao

### Visao geral da arquitetura de tokenizacao de CPR

A tokenizacao de uma CPR segue um fluxo estruturado que conecta o mundo juridico-financeiro tradicional a infraestrutura blockchain. Esse fluxo envolve quatro etapas fundamentais: (i) o originador emite a CPR e a cede a um veiculo juridico; (ii) o SPV (Special Purpose Vehicle) ou a securitizadora recebe a CPR e a registra como lastro; (iii) um smart contract ERC-20 e implantado na blockchain para representar fracoes do valor da CPR; e (iv) os tokens sao distribuidos aos investidores via plataforma regulada.

O originador e tipicamente o produtor rural, a cooperativa ou a trading agricola que emite a CPR. No Brasil, a CPR pode ser fisica (com entrega de produto) ou financeira (com liquidacao em dinheiro). Para fins de tokenizacao, a CPR financeira e a mais adequada, pois sua liquidacao e em moeda corrente, facilitando a correspondencia com o valor do token. A CPR deve estar registrada em sistema de registro autorizado pelo Banco Central — como a B3, a CERC ou a TAG — conforme exigencia da Lei 13.986/2020. Esse registro confere ao titulo validade juridica, publicidade e oponibilidade perante terceiros.

O SPV (Sociedade de Proposito Especifico) ou a securitizadora funciona como um intermediario fiduciario que isola o risco do originador do risco do investidor. No modelo brasileiro, a securitizadora (regulada pela CVM conforme Resolucao CVM 60) constitui um patrimonio separado vinculado a emissao, garantindo que os ativos do lastro nao se confundam com os ativos proprios da securitizadora. Esse isolamento patrimonial e fundamental para proteger o investidor em caso de falencia do originador ou da propria securitizadora.

- **Exemplo**: A Agrotoken, fundada na Argentina e com operacao no Brasil desde 2022, tokeniza graos (soja, milho, trigo) utilizando um modelo onde o produtor deposita a commodity em um armazem certificado, recebe um token que representa aquele grao, e pode usar esse token como meio de pagamento ou colateral. No modelo que construiremos nesta aula, o fluxo e similar porem aplicado a uma CPR financeira: o produtor emite uma CPR de R$ 1.000.000 lastreada em 5.000 sacas de soja a R$ 200/saca, registra na CERC, cede a um SPV, que entao emite tokens ERC-20 representando fracoes de R$ 100 cada — totalizando 10.000 tokens.

### Contrato ERC-20 para CPR tokenizada

O padrao ERC-20 e o padrao de token fungivel mais utilizado na blockchain Ethereum. Ele define uma interface com funcoes como `transfer`, `approve`, `transferFrom`, `balanceOf` e `totalSupply`, que permitem a criacao, transferencia e gestao de tokens de forma padronizada e interoperavel com qualquer carteira ou exchange compativel. Para a tokenizacao de CPR, o ERC-20 e adequado quando todos os tokens representam fracoes identicas e fungiveis do mesmo ativo — ou seja, cada token vale exatamente o mesmo e tem os mesmos direitos.

Abaixo, o contrato Solidity completo para uma CPR tokenizada:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title CPRToken
 * @notice Contrato ERC-20 que representa fracoes tokenizadas de uma CPR financeira
 * @dev Utiliza OpenZeppelin para seguranca e padronizacao
 *
 * Fluxo: Originador emite CPR -> SPV recebe e registra -> Deploy deste contrato
 *        -> Mint de tokens proporcionais ao valor da CPR -> Distribuicao a investidores
 */
contract CPRToken is ERC20, AccessControl, Pausable {

    // === ROLES ===
    bytes32 public constant SPV_ROLE = keccak256("SPV_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");

    // === DADOS DA CPR ===
    string public cprRegistrationId;       // ID de registro na CERC/B3/TAG
    string public commodity;                // Ex: "SOJA", "MILHO", "CAFE"
    uint256 public sacas;                   // Quantidade de sacas no lastro
    uint256 public maturityDate;            // Data de vencimento (timestamp UNIX)
    uint256 public issuanceDate;            // Data de emissao
    uint256 public faceValue;               // Valor de face em centavos de BRL (evita decimais)
    address public originatorAddress;       // Endereco do produtor/cooperativa
    bool public isRedeemed;                 // Se a CPR ja foi liquidada

    // === WHITELIST (KYC/AML) ===
    mapping(address => bool) public whitelisted;

    // === EVENTOS ===
    event CPRCreated(
        string cprRegistrationId,
        string commodity,
        uint256 sacas,
        uint256 faceValue,
        uint256 maturityDate
    );
    event InvestorWhitelisted(address indexed investor, bool status);
    event CPRRedeemed(uint256 timestamp, uint256 totalDistributed);
    event TokensMinted(address indexed to, uint256 amount);

    /**
     * @notice Construtor do token CPR
     * @param _name Nome do token (ex: "CPR Soja Fazenda Santa Maria 2025")
     * @param _symbol Simbolo do token (ex: "CPRSOJA25")
     * @param _cprRegistrationId ID de registro na registradora (CERC, B3 ou TAG)
     * @param _commodity Commodity subjacente
     * @param _sacas Quantidade de sacas que lastreiam a CPR
     * @param _maturityDate Data de vencimento em timestamp UNIX
     * @param _faceValue Valor de face total em centavos de BRL
     * @param _originator Endereco do originador (produtor/cooperativa)
     * @param _spv Endereco do SPV/securitizadora
     */
    constructor(
        string memory _name,
        string memory _symbol,
        string memory _cprRegistrationId,
        string memory _commodity,
        uint256 _sacas,
        uint256 _maturityDate,
        uint256 _faceValue,
        address _originator,
        address _spv
    ) ERC20(_name, _symbol) {
        require(_maturityDate > block.timestamp, "Vencimento deve ser futuro");
        require(_faceValue > 0, "Valor de face deve ser positivo");
        require(_originator != address(0), "Originador invalido");
        require(_spv != address(0), "SPV invalido");

        cprRegistrationId = _cprRegistrationId;
        commodity = _commodity;
        sacas = _sacas;
        maturityDate = _maturityDate;
        faceValue = _faceValue;
        issuanceDate = block.timestamp;
        originatorAddress = _originator;
        isRedeemed = false;

        // Configura roles
        _grantRole(DEFAULT_ADMIN_ROLE, _spv);
        _grantRole(SPV_ROLE, _spv);
        _grantRole(COMPLIANCE_ROLE, _spv);

        // Whitelist o SPV automaticamente
        whitelisted[_spv] = true;

        emit CPRCreated(
            _cprRegistrationId,
            _commodity,
            _sacas,
            _faceValue,
            _maturityDate
        );
    }

    // === MODIFICADORES ===

    modifier onlyWhitelisted(address _addr) {
        require(whitelisted[_addr], "Endereco nao esta na whitelist (KYC/AML)");
        _;
    }

    modifier notRedeemed() {
        require(!isRedeemed, "CPR ja foi liquidada");
        _;
    }

    // === FUNCOES DE COMPLIANCE ===

    /**
     * @notice Adiciona ou remove investidor da whitelist (KYC/AML)
     * @dev Somente COMPLIANCE_ROLE pode executar
     * @param _investor Endereco do investidor
     * @param _status true para adicionar, false para remover
     */
    function setWhitelist(address _investor, bool _status)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        whitelisted[_investor] = _status;
        emit InvestorWhitelisted(_investor, _status);
    }

    /**
     * @notice Adiciona multiplos investidores a whitelist em lote
     * @param _investors Array de enderecos
     */
    function batchWhitelist(address[] calldata _investors)
        external
        onlyRole(COMPLIANCE_ROLE)
    {
        for (uint256 i = 0; i < _investors.length; i++) {
            whitelisted[_investors[i]] = true;
            emit InvestorWhitelisted(_investors[i], true);
        }
    }

    // === FUNCOES DE EMISSAO ===

    /**
     * @notice Emite tokens para investidores apos verificacao de whitelist
     * @dev Somente SPV_ROLE pode mintar tokens
     * @param _to Endereco do investidor (deve estar na whitelist)
     * @param _amount Quantidade de tokens a emitir
     */
    function mint(address _to, uint256 _amount)
        external
        onlyRole(SPV_ROLE)
        onlyWhitelisted(_to)
        notRedeemed
        whenNotPaused
    {
        require(
            totalSupply() + _amount <= faceValue,
            "Emissao excede valor de face da CPR"
        );
        _mint(_to, _amount);
        emit TokensMinted(_to, _amount);
    }

    // === OVERRIDE DE TRANSFER COM WHITELIST ===

    /**
     * @notice Override do _beforeTokenTransfer para enforcar whitelist
     * @dev Garante que apenas enderecos na whitelist podem receber tokens
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);

        // Permite mint (from == address(0)) e burn (to == address(0))
        if (to != address(0)) {
            require(
                whitelisted[to],
                "Destinatario nao esta na whitelist (KYC/AML)"
            );
        }
    }

    // === FUNCOES DE LIQUIDACAO ===

    /**
     * @notice Marca a CPR como liquidada no vencimento
     * @dev Somente SPV_ROLE pode executar. Apos redemption,
     *      nenhum novo mint e permitido.
     */
    function redeem() external onlyRole(SPV_ROLE) notRedeemed {
        require(
            block.timestamp >= maturityDate,
            "CPR ainda nao venceu"
        );
        isRedeemed = true;
        emit CPRRedeemed(block.timestamp, totalSupply());
    }

    // === FUNCOES DE EMERGENCIA ===

    function pause() external onlyRole(SPV_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(SPV_ROLE) {
        _unpause();
    }

    // === VIEW FUNCTIONS ===

    /**
     * @notice Retorna informacoes completas da CPR em uma unica chamada
     */
    function getCPRInfo()
        external
        view
        returns (
            string memory _cprRegistrationId,
            string memory _commodity,
            uint256 _sacas,
            uint256 _faceValue,
            uint256 _maturityDate,
            uint256 _issuanceDate,
            address _originator,
            bool _isRedeemed,
            uint256 _totalSupply
        )
    {
        return (
            cprRegistrationId,
            commodity,
            sacas,
            faceValue,
            maturityDate,
            issuanceDate,
            originatorAddress,
            isRedeemed,
            totalSupply()
        );
    }

    /**
     * @notice Retorna quantos dias faltam para o vencimento da CPR
     */
    function daysToMaturity() external view returns (uint256) {
        if (block.timestamp >= maturityDate) return 0;
        return (maturityDate - block.timestamp) / 1 days;
    }
}
```

### Explicacao detalhada do contrato

O contrato `CPRToken` herda de tres contratos da biblioteca OpenZeppelin, que e o padrao da industria para desenvolvimento seguro de smart contracts. O `ERC20` fornece toda a logica de token fungivel — saldo, transferencia, aprovacao. O `AccessControl` implementa um sistema de roles (papeis) que permite diferenciar quem pode mintar tokens (SPV_ROLE), quem pode gerenciar a whitelist (COMPLIANCE_ROLE) e quem tem poder administrativo total (DEFAULT_ADMIN_ROLE). O `Pausable` permite que o SPV pause todas as transferencias em caso de emergencia — por exemplo, se houver uma disputa judicial sobre a CPR subjacente ou se o regulador determinar a suspensao da negociacao.

Os dados da CPR sao armazenados on-chain como variaveis de estado: o ID de registro na CERC/B3/TAG (`cprRegistrationId`), a commodity subjacente, a quantidade de sacas, a data de vencimento, o valor de face e o endereco do originador. Isso cria um registro imutavel e auditavel que qualquer participante do mercado pode consultar diretamente na blockchain, sem depender de intermediarios. O campo `faceValue` e expresso em centavos de BRL para evitar problemas com decimais em Solidity (que nao suporta ponto flutuante).

A whitelist implementa o controle de KYC/AML exigido pela CVM para oferta de valores mobiliarios. Somente investidores previamente verificados e adicionados a whitelist podem receber tokens — seja via mint inicial ou via transferencia no mercado secundario. O override da funcao `_beforeTokenTransfer` garante que essa verificacao ocorre em toda e qualquer transferencia, incluindo operacoes em DEXs (exchanges descentralizadas). Esse mecanismo e essencial para conformidade com a Resolucao CVM 88/2022, que regulamenta a oferta de tokens de valores mobiliarios no Brasil.

A funcao `redeem` marca a CPR como liquidada apos o vencimento. Na pratica, a liquidacao financeira ocorreria off-chain (o originador paga o valor devido ao SPV, que distribui aos investidores), mas o registro on-chain garante transparencia e imutabilidade do evento. Apos a redemption, nenhum novo token pode ser mintado, preservando a integridade do lastro.

- **Exemplo**: A cooperativa Coamo, sediada em Campo Mourao/PR e uma das maiores cooperativas agropecuarias do Brasil com faturamento superior a R$ 30 bilhoes/ano, poderia tokenizar uma CPR financeira de R$ 5.000.000 lastreada em 25.000 sacas de soja. O SPV implantaria o contrato CPRToken com `faceValue = 500000000` (R$ 5.000.000 em centavos), `sacas = 25000`, `commodity = "SOJA"` e `maturityDate` correspondente a abril de 2026 (pos-colheita). Seriam emitidos 50.000 tokens de R$ 100 cada, distribuidos a investidores qualificados via plataforma regulada como a Liqi ou MB Tokens.

---

## 2. Integracao com oraculo de preco (Chainlink)

### O problema do oraculo no agronegocio

Smart contracts na blockchain sao deterministicos e isolados — eles nao conseguem acessar dados externos como precos de commodities, taxas de cambio ou indicadores climaticos. Para que o contrato de CPR tokenizada saiba o preco atual da soja (ou qualquer outra commodity do lastro), ele precisa de um oraculo — um servico que traz dados do mundo real para a blockchain de forma confiavel e verificavel.

No agronegocio brasileiro, os precos de referencia mais utilizados sao o CEPEA/ESALQ (Centro de Estudos Avancados em Economia Aplicada da USP), que publica indicadores diarios de soja, milho, cafe, boi gordo e outras commodities, e os precos da B3 (contratos futuros de soja, milho e cafe). Internacionalmente, os precos da CBOT (Chicago Board of Trade) sao referencia global para soja e milho. O oraculo precisa capturar esses precos e disponibiliza-los on-chain de forma que o smart contract possa consulta-los.

A Chainlink e a rede de oraculos descentralizados mais utilizada no ecossistema Ethereum, com mais de US$ 10 trilhoes em valor total transacionado desde sua criacao. A Chainlink opera com uma rede de nos independentes que consultam multiplas fontes de dados, agregam os resultados e publicam o preco consensuado on-chain. Isso elimina o risco de um unico ponto de falha ou manipulacao. Para commodities agricolas, a Chainlink ja oferece feeds de preco para soja, milho e trigo referenciados a CBOT, e ha iniciativas para integrar dados do CEPEA/ESALQ.

### Contrato de oraculo para preco de commodity

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CommodityPriceOracle
 * @notice Contrato que consulta preco de commodity via Chainlink
 * @dev Pode ser usado como modulo auxiliar pelo CPRToken
 *
 * Em producao, o feed Chainlink de soja/USD seria:
 *   Mainnet: endereco do feed oficial Chainlink
 *   Sepolia (testnet): usar mock ou feed disponivel
 *
 * O preco e retornado com 8 casas decimais (padrao Chainlink).
 * Ex: soja a USD 12.50/bushel => 1250000000
 */
contract CommodityPriceOracle is Ownable {

    AggregatorV3Interface internal priceFeed;

    // Fator de conversao: bushel -> saca de 60kg
    // 1 bushel de soja = ~27.216 kg
    // 1 saca = 60 kg
    // 1 saca = 60/27.216 = ~2.2046 bushels
    uint256 public constant BUSHELS_PER_SACA = 22046; // x10000 para precisao
    uint256 public constant PRECISION = 10000;

    // Taxa de cambio BRL/USD (atualizada via Chainlink ou manualmente)
    AggregatorV3Interface internal brlUsdFeed;

    // Ultimo preco calculado em centavos de BRL por saca
    uint256 public lastPriceInBRLCentavos;
    uint256 public lastUpdateTimestamp;

    // Tolerancia maxima para dados stale (1 hora)
    uint256 public stalePriceThreshold = 3600;

    event PriceUpdated(
        uint256 priceUSDPerBushel,
        uint256 brlUsdRate,
        uint256 priceInBRLCentavos,
        uint256 timestamp
    );

    /**
     * @param _soybeanFeed Endereco do feed Chainlink para soja/USD
     * @param _brlUsdFeed Endereco do feed Chainlink para BRL/USD
     */
    constructor(address _soybeanFeed, address _brlUsdFeed) {
        priceFeed = AggregatorV3Interface(_soybeanFeed);
        brlUsdFeed = AggregatorV3Interface(_brlUsdFeed);
    }

    /**
     * @notice Obtem o preco mais recente da soja em USD por bushel
     * @return price Preco com 8 decimais
     * @return timestamp Momento da ultima atualizacao
     */
    function getSoybeanPriceUSD()
        public
        view
        returns (int256 price, uint256 timestamp)
    {
        (
            /* uint80 roundID */,
            int256 answer,
            /* uint256 startedAt */,
            uint256 updatedAt,
            /* uint80 answeredInRound */
        ) = priceFeed.latestRoundData();

        require(answer > 0, "Preco invalido do oraculo");
        require(
            block.timestamp - updatedAt <= stalePriceThreshold,
            "Dados do oraculo estao desatualizados (stale)"
        );

        return (answer, updatedAt);
    }

    /**
     * @notice Obtem a taxa de cambio BRL/USD
     * @return rate Taxa com 8 decimais
     */
    function getBRLUSDRate() public view returns (int256 rate) {
        (
            ,
            int256 answer,
            ,
            uint256 updatedAt,

        ) = brlUsdFeed.latestRoundData();

        require(answer > 0, "Taxa de cambio invalida");
        require(
            block.timestamp - updatedAt <= stalePriceThreshold,
            "Taxa de cambio desatualizada (stale)"
        );

        return answer;
    }

    /**
     * @notice Calcula o preco de uma saca de soja em centavos de BRL
     * @dev Converte: USD/bushel -> USD/saca -> BRL/saca -> centavos BRL/saca
     *
     * Exemplo numerico:
     *   Soja: USD 12.50/bushel (1250000000 com 8 decimais)
     *   1 saca = 2.2046 bushels
     *   USD/saca = 12.50 * 2.2046 = USD 27.5575
     *   Cambio: BRL/USD = 5.10 (510000000 com 8 decimais)
     *   BRL/saca = 27.5575 * 5.10 = R$ 140.54
     *   Centavos = 14054
     */
    function calculateSacaPriceBRL()
        public
        returns (uint256 priceInCentavos)
    {
        (int256 soybeanPrice, ) = getSoybeanPriceUSD();
        int256 brlRate = getBRLUSDRate();

        // soybeanPrice: USD por bushel com 8 decimais
        // Converter para USD por saca: preco * BUSHELS_PER_SACA / PRECISION
        // Depois converter para BRL: * brlRate / 1e8
        // Depois converter para centavos: * 100 / 1e8

        uint256 usdPerSaca = (uint256(soybeanPrice) * BUSHELS_PER_SACA) /
            PRECISION;

        // usdPerSaca esta com 8 decimais
        // brlRate esta com 8 decimais
        // Resultado: (usdPerSaca * brlRate) / 1e8 = BRL por saca com 8 decimais
        // Dividir por 1e6 para obter centavos (8 decimais - 6 = 2 decimais = centavos)

        uint256 brlPerSacaCentavos = (usdPerSaca * uint256(brlRate)) / 1e14;

        lastPriceInBRLCentavos = brlPerSacaCentavos;
        lastUpdateTimestamp = block.timestamp;

        emit PriceUpdated(
            uint256(soybeanPrice),
            uint256(brlRate),
            brlPerSacaCentavos,
            block.timestamp
        );

        return brlPerSacaCentavos;
    }

    /**
     * @notice Calcula o valor total do lastro de uma CPR em centavos de BRL
     * @param _sacas Numero de sacas que lastreiam a CPR
     */
    function calculateCPRValue(uint256 _sacas)
        external
        returns (uint256 valueInCentavos)
    {
        uint256 pricePerSaca = calculateSacaPriceBRL();
        return pricePerSaca * _sacas;
    }

    /**
     * @notice Atualiza o threshold de dados stale
     */
    function setStalePriceThreshold(uint256 _newThreshold)
        external
        onlyOwner
    {
        stalePriceThreshold = _newThreshold;
    }
}
```

### Explicacao da integracao com oraculo

O contrato `CommodityPriceOracle` utiliza dois feeds Chainlink: um para o preco da soja em USD por bushel (unidade padrao da CBOT) e outro para a taxa de cambio BRL/USD. A combinacao desses dois feeds permite calcular o preco de uma saca de soja de 60kg em reais — a unidade de referencia do mercado brasileiro.

A conversao de bushel para saca e feita usando a constante `BUSHELS_PER_SACA`, que representa a relacao de aproximadamente 2,2046 bushels por saca de 60kg. O calculo completo e: preco em USD/bushel * bushels por saca * taxa BRL/USD = preco em BRL/saca. Todas as operacoes usam aritmetica inteira com fatores de precisao para evitar perda de dados, ja que o Solidity nao suporta numeros de ponto flutuante.

A verificacao de `stalePriceThreshold` e critica para a seguranca do sistema. Se o oraculo Chainlink nao atualizar o preco dentro do periodo configurado (padrao: 1 hora), a funcao reverte para evitar que decisoes financeiras sejam tomadas com dados desatualizados. Em mercados de commodities agricolas, um atraso de horas pode significar variacoes de 2% a 5% no preco — o que em uma CPR de R$ 5.000.000 representaria uma discrepancia de R$ 100.000 a R$ 250.000.

- **Exemplo**: Em janeiro de 2025, o preco da soja na CBOT estava em torno de USD 9,80/bushel. Com cambio de BRL/USD a 6,10, o preco da saca de soja seria: 9,80 * 2,2046 * 6,10 = R$ 131,78/saca. Se a CPR tokenizada tem lastro de 25.000 sacas, o valor total do lastro calculado pelo oraculo seria R$ 3.294.500. Se o token foi emitido com valor de face de R$ 5.000.000, o indice de cobertura seria 3.294.500/5.000.000 = 0,66x — abaixo de 1,0x, o que indicaria que o lastro fisico (ao preco de mercado atual) nao cobre o valor da emissao. Na pratica, a CPR financeira tem remuneracao adicional (taxa de juros) que compensa essa diferenca, mas o oraculo fornece ao investidor transparencia em tempo real sobre a relacao lastro/emissao.

---

## 3. Testes basicos e deploy em testnet

### Configuracao do ambiente de desenvolvimento

Para testar e implantar os contratos, utilizaremos o Hardhat — o framework de desenvolvimento Ethereum mais popular, com mais de 6 milhoes de downloads mensais no npm. O Hardhat fornece um ambiente de teste local, compilacao de contratos Solidity, scripts de deploy e integracao com testnets publicas como Sepolia e Goerli.

Estrutura do projeto:

```
cpr-token/
  contracts/
    CPRToken.sol
    CommodityPriceOracle.sol
    mocks/
      MockV3Aggregator.sol
  test/
    CPRToken.test.js
  scripts/
    deploy.js
  hardhat.config.js
  package.json
```

Configuracao do `hardhat.config.js`:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined
          ? [process.env.PRIVATE_KEY]
          : [],
    },
  },
};
```

### Mock do oraculo para testes locais

Em testes locais, nao temos acesso aos feeds Chainlink reais. Por isso, criamos um mock (simulacao) do aggregator:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title MockV3Aggregator
 * @notice Mock do AggregatorV3Interface da Chainlink para testes
 */
contract MockV3Aggregator {
    uint8 public decimals;
    int256 public latestAnswer;
    uint256 public latestTimestamp;
    uint256 public latestRound;

    constructor(uint8 _decimals, int256 _initialAnswer) {
        decimals = _decimals;
        updateAnswer(_initialAnswer);
    }

    function updateAnswer(int256 _answer) public {
        latestAnswer = _answer;
        latestTimestamp = block.timestamp;
        latestRound++;
    }

    function latestRoundData()
        external
        view
        returns (
            uint80 roundId,
            int256 answer,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        )
    {
        return (
            uint80(latestRound),
            latestAnswer,
            latestTimestamp,
            latestTimestamp,
            uint80(latestRound)
        );
    }
}
```

### Script de testes completo

```javascript
const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

describe("CPRToken", function () {
  let cprToken;
  let owner, spv, investor1, investor2, unauthorized;

  // Dados da CPR de teste
  const CPR_NAME = "CPR Soja Cooperativa Coamo 2025";
  const CPR_SYMBOL = "CPRSOJA25";
  const CPR_REGISTRATION = "CERC-2025-001234";
  const COMMODITY = "SOJA";
  const SACAS = 25000;
  const FACE_VALUE = 500000000; // R$ 5.000.000 em centavos
  const TOKEN_AMOUNT = ethers.parseUnits("100", 18); // 100 tokens

  beforeEach(async function () {
    [owner, spv, investor1, investor2, unauthorized] =
      await ethers.getSigners();

    // Data de vencimento: 180 dias no futuro
    const maturityDate =
      (await time.latest()) + 180 * 24 * 60 * 60;

    const CPRToken = await ethers.getContractFactory("CPRToken");
    cprToken = await CPRToken.deploy(
      CPR_NAME,
      CPR_SYMBOL,
      CPR_REGISTRATION,
      COMMODITY,
      SACAS,
      maturityDate,
      FACE_VALUE,
      owner.address, // originador
      spv.address     // SPV
    );
    await cprToken.waitForDeployment();
  });

  describe("Deploy", function () {
    it("deve criar o token com os dados corretos da CPR", async function () {
      expect(await cprToken.name()).to.equal(CPR_NAME);
      expect(await cprToken.symbol()).to.equal(CPR_SYMBOL);
      expect(await cprToken.cprRegistrationId()).to.equal(
        CPR_REGISTRATION
      );
      expect(await cprToken.commodity()).to.equal(COMMODITY);
      expect(await cprToken.sacas()).to.equal(SACAS);
      expect(await cprToken.faceValue()).to.equal(FACE_VALUE);
      expect(await cprToken.isRedeemed()).to.equal(false);
    });

    it("deve atribuir SPV_ROLE ao SPV", async function () {
      const SPV_ROLE = await cprToken.SPV_ROLE();
      expect(await cprToken.hasRole(SPV_ROLE, spv.address)).to.be
        .true;
    });
  });

  describe("Whitelist (KYC/AML)", function () {
    it("deve permitir que COMPLIANCE_ROLE adicione investidor", async function () {
      await cprToken
        .connect(spv)
        .setWhitelist(investor1.address, true);
      expect(await cprToken.whitelisted(investor1.address)).to.be
        .true;
    });

    it("deve rejeitar whitelist por endereco nao autorizado", async function () {
      await expect(
        cprToken
          .connect(unauthorized)
          .setWhitelist(investor1.address, true)
      ).to.be.reverted;
    });

    it("deve permitir whitelist em lote", async function () {
      await cprToken
        .connect(spv)
        .batchWhitelist([investor1.address, investor2.address]);
      expect(await cprToken.whitelisted(investor1.address)).to.be
        .true;
      expect(await cprToken.whitelisted(investor2.address)).to.be
        .true;
    });
  });

  describe("Mint de tokens", function () {
    beforeEach(async function () {
      await cprToken
        .connect(spv)
        .setWhitelist(investor1.address, true);
    });

    it("deve permitir que SPV minte tokens para investidor whitelisted", async function () {
      await cprToken
        .connect(spv)
        .mint(investor1.address, TOKEN_AMOUNT);
      expect(await cprToken.balanceOf(investor1.address)).to.equal(
        TOKEN_AMOUNT
      );
    });

    it("deve rejeitar mint para investidor nao whitelisted", async function () {
      await expect(
        cprToken
          .connect(spv)
          .mint(investor2.address, TOKEN_AMOUNT)
      ).to.be.revertedWith(
        "Endereco nao esta na whitelist (KYC/AML)"
      );
    });

    it("deve rejeitar mint acima do valor de face", async function () {
      const excessAmount = ethers.parseUnits("600000000", 0);
      await expect(
        cprToken
          .connect(spv)
          .mint(investor1.address, excessAmount)
      ).to.be.revertedWith(
        "Emissao excede valor de face da CPR"
      );
    });
  });

  describe("Transferencias com whitelist", function () {
    beforeEach(async function () {
      await cprToken
        .connect(spv)
        .batchWhitelist([investor1.address, investor2.address]);
      await cprToken
        .connect(spv)
        .mint(investor1.address, TOKEN_AMOUNT);
    });

    it("deve permitir transferencia entre enderecos whitelisted", async function () {
      await cprToken
        .connect(investor1)
        .transfer(investor2.address, TOKEN_AMOUNT);
      expect(await cprToken.balanceOf(investor2.address)).to.equal(
        TOKEN_AMOUNT
      );
    });

    it("deve bloquear transferencia para endereco nao whitelisted", async function () {
      await expect(
        cprToken
          .connect(investor1)
          .transfer(unauthorized.address, TOKEN_AMOUNT)
      ).to.be.revertedWith(
        "Destinatario nao esta na whitelist (KYC/AML)"
      );
    });
  });

  describe("Redemption (liquidacao)", function () {
    it("deve permitir redemption apos vencimento", async function () {
      await cprToken
        .connect(spv)
        .setWhitelist(investor1.address, true);
      await cprToken
        .connect(spv)
        .mint(investor1.address, TOKEN_AMOUNT);

      // Avanca o tempo para apos o vencimento
      await time.increase(181 * 24 * 60 * 60);

      await cprToken.connect(spv).redeem();
      expect(await cprToken.isRedeemed()).to.be.true;
    });

    it("deve bloquear mint apos redemption", async function () {
      await cprToken
        .connect(spv)
        .setWhitelist(investor1.address, true);
      await time.increase(181 * 24 * 60 * 60);
      await cprToken.connect(spv).redeem();

      await expect(
        cprToken
          .connect(spv)
          .mint(investor1.address, TOKEN_AMOUNT)
      ).to.be.revertedWith("CPR ja foi liquidada");
    });
  });

  describe("Pause/Unpause", function () {
    it("deve pausar e bloquear transferencias", async function () {
      await cprToken
        .connect(spv)
        .setWhitelist(investor1.address, true);
      await cprToken
        .connect(spv)
        .mint(investor1.address, TOKEN_AMOUNT);

      await cprToken.connect(spv).pause();

      await expect(
        cprToken
          .connect(spv)
          .mint(investor1.address, TOKEN_AMOUNT)
      ).to.be.reverted;
    });
  });
});
```

### Script de deploy em testnet Sepolia

```javascript
const { ethers } = require("hardhat");

async function main() {
  console.log("Iniciando deploy da CPR Token na Sepolia...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer (SPV):", deployer.address);
  console.log(
    "Saldo:",
    ethers.formatEther(
      await ethers.provider.getBalance(deployer.address)
    ),
    "ETH\n"
  );

  // Parametros da CPR
  const now = Math.floor(Date.now() / 1000);
  const maturityDate = now + 180 * 24 * 60 * 60; // 180 dias

  const CPRToken = await ethers.getContractFactory("CPRToken");
  const cprToken = await CPRToken.deploy(
    "CPR Soja Cooperativa Coamo 2025",  // nome
    "CPRSOJA25",                         // simbolo
    "CERC-2025-001234",                  // registro CERC
    "SOJA",                              // commodity
    25000,                               // sacas
    maturityDate,                        // vencimento
    500000000,                           // R$ 5.000.000 em centavos
    deployer.address,                    // originador
    deployer.address                     // SPV (mesmo endereco para teste)
  );

  await cprToken.waitForDeployment();
  const address = await cprToken.getAddress();

  console.log("CPRToken implantado em:", address);
  console.log("Rede: Sepolia Testnet");
  console.log("Explorador: https://sepolia.etherscan.io/address/" + address);
  console.log("\nDados da CPR:");
  console.log("  Registro: CERC-2025-001234");
  console.log("  Commodity: SOJA");
  console.log("  Sacas: 25.000");
  console.log("  Valor de face: R$ 5.000.000");
  console.log("  Vencimento:", new Date(maturityDate * 1000).toLocaleDateString());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

Para executar o deploy:

```bash
# Instalar dependencias
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npm install @openzeppelin/contracts @chainlink/contracts dotenv

# Compilar contratos
npx hardhat compile

# Executar testes locais
npx hardhat test

# Deploy na Sepolia (requer ETH de testnet e chave privada no .env)
npx hardhat run scripts/deploy.js --network sepolia
```

- **Exemplo**: A Liqi Digital Assets, plataforma brasileira regulada que ja tokenizou mais de R$ 500 milhoes em ativos, utiliza um fluxo semelhante ao descrito nesta aula para suas emissoes de recebiveis agro. O deploy do contrato na blockchain (Ethereum ou Polygon) e feito apos a conclusao de toda a estruturacao juridica e a aprovacao da oferta pela CVM (quando aplicavel). O contrato fica disponivel publicamente no Etherscan ou Polygonscan, permitindo que qualquer investidor audite o codigo, verifique o total de tokens emitidos e confirme que as regras de whitelist estao ativas.

---

## Conclusao

Nesta aula, construimos do zero a infraestrutura de tokenizacao de uma CPR financeira utilizando o padrao ERC-20. Percorremos o fluxo completo: do originador que emite a CPR, passando pelo SPV que a recebe e constitui o patrimonio separado, ate o smart contract que representa fracoes tokenizadas do ativo. O contrato `CPRToken` implementa controles essenciais de compliance (whitelist KYC/AML), gestao de roles (SPV e compliance), registro on-chain dos dados da CPR e mecanismos de emergencia (pause). Integramos um oraculo Chainlink para fornecer precos de commodities em tempo real, permitindo que investidores avaliem a cobertura do lastro a qualquer momento. Finalmente, configuramos o ambiente de testes com Hardhat, criamos um mock do oraculo para testes locais, escrevemos testes unitarios abrangentes e preparamos o script de deploy para a testnet Sepolia. Na proxima aula, avancaremos para a tokenizacao de CRA com tranches utilizando o padrao ERC-1155.

---

## Licao de Casa

1. Modifique o contrato `CPRToken` para adicionar uma funcao `addCollateral` que permita ao SPV registrar garantias adicionais on-chain (tipo de garantia, valor estimado e descricao). Implemente como um array de structs e crie uma funcao view para consulta. Teste com pelo menos duas garantias: alienacao fiduciaria de fazenda e penhor de safra.
2. Pesquise os feeds de preco disponiveis na Chainlink para commodities agricolas (acesse docs.chain.link/data-feeds). Identifique quais commodities do agro brasileiro ja possuem feed direto e quais precisariam de um oraculo customizado. Elabore uma tabela com: commodity, feed disponivel (sim/nao), fonte de preco alternativa e proposta de implementacao.
3. Faca o deploy do contrato `CPRToken` na testnet Sepolia (obtenha ETH de teste em sepoliafaucet.com). Execute as seguintes operacoes: (a) adicionar dois enderecos a whitelist; (b) mintar 1.000 tokens para cada endereco; (c) transferir 500 tokens entre os enderecos. Registre os hashes das transacoes e os links do Etherscan.

---

## Questionario

**1. No fluxo de tokenizacao de CPR apresentado na aula, qual e a funcao do SPV (Special Purpose Vehicle)?**

a) Emitir a CPR em nome do produtor rural e registra-la na B3
b) Isolar o risco do originador do risco do investidor, constituindo patrimonio separado que protege os ativos do lastro
c) Substituir o produtor rural como devedor da CPR, assumindo integralmente o risco de credito
d) Operar como exchange descentralizada para negociacao dos tokens no mercado secundario

**Resposta: b**

**2. Por que o contrato CPRToken utiliza o campo `faceValue` em centavos de BRL ao inves de reais com decimais?**

a) Porque a CVM exige que todos os valores em smart contracts sejam expressos em centavos
b) Porque o Solidity nao suporta numeros de ponto flutuante, e o uso de centavos (inteiros) evita erros de precisao
c) Porque o padrao ERC-20 obriga o uso de centavos como unidade monetaria
d) Porque os oraculos Chainlink so fornecem precos em centavos de BRL

**Resposta: b**

**3. Qual e a funcao do mecanismo de whitelist implementado no contrato CPRToken?**

a) Garantir que apenas mineradores autorizados possam validar transacoes do token
b) Limitar a quantidade maxima de tokens que cada investidor pode possuir
c) Implementar controle de KYC/AML exigido pela CVM, permitindo que apenas investidores verificados recebam e transfiram tokens
d) Aumentar a velocidade das transacoes ao reduzir o numero de participantes da rede

**Resposta: c**

**4. No contrato CommodityPriceOracle, o que acontece se o feed Chainlink nao atualizar o preco dentro do `stalePriceThreshold` configurado?**

a) O contrato retorna automaticamente o ultimo preco valido, sem nenhum aviso
b) A funcao reverte a transacao, impedindo que decisoes financeiras sejam tomadas com dados desatualizados
c) O contrato calcula o preco usando uma media dos ultimos 10 valores registrados
d) O oraculo envia uma notificacao automatica ao SPV para que atualize manualmente o preco

**Resposta: b**

**5. Uma cooperativa quer tokenizar uma CPR financeira de R$ 2.000.000 lastreada em 10.000 sacas de milho. O oraculo indica que o preco atual do milho e R$ 70/saca. Qual e o indice de cobertura do lastro?**

a) 2,86x (o lastro cobre quase tres vezes o valor da emissao)
b) 1,00x (o lastro cobre exatamente o valor da emissao)
c) 0,35x (o lastro cobre apenas 35% do valor da emissao)
d) 0,70x (o lastro cobre 70% do valor da emissao)

**Resposta: c** — Calculo: 10.000 sacas * R$ 70/saca = R$ 700.000. Indice = R$ 700.000 / R$ 2.000.000 = 0,35x. Na pratica, a CPR financeira inclui taxa de juros que compensa essa diferenca, e garantias adicionais (alienacao fiduciaria, penhor) protegem o investidor.

---

## Proxima Aula

Na proxima aula (5.2), vamos avancar para a tokenizacao de CRA (Certificado de Recebiveis do Agronegocio) utilizando o padrao ERC-1155, que permite representar multiplas tranches — senior e subordinada — no mesmo contrato. Voce aprendera a usar metadados para diferenciar classes de investimento e simulara a distribuicao de rendimentos entre as tranches. Ate la!
