# Aula 2.1: ERC-4626 — O Padrao de Vaults Yield-Bearing

## Abertura

Bem-vindo a aula 2.1 do Modulo 2! No modulo anterior, voce dominou os padroes de tokens de seguranca — ERC-3643, compliance on-chain e a arquitetura de identidade descentralizada aplicada a ativos do agronegocio. Agora, damos um salto fundamental: vamos aprender a construir vaults tokenizados, estruturas que permitem agrupar ativos, emitir cotas e distribuir rendimentos de forma programatica. O padrao ERC-4626 e a base dessa arquitetura. Ele define uma interface universal para vaults que recebem depositos de um ativo (asset) e emitem cotas proporcionais (shares), exatamente como um fundo de investimento funciona — mas inteiramente on-chain. Se voce quer entender como construir um FIAGRO tokenizado onde investidores depositam stablecoins e recebem cotas com rendimento automatico, esta aula e o ponto de partida.

### Programa da aula:

1. Conceito fundamental: deposit de asset, emissao de shares e a matematica de conversao
2. Interface completa do ERC-4626: funcoes deposit, mint, withdraw, redeem e preview
3. Aplicacao pratica: FIAGRO tokenizado com stablecoins e a limitacao da atomicidade para ativos reais

---

## 1. Conceito fundamental: deposit de asset, emissao de shares e a matematica de conversao

### O que e um vault tokenizado

Um vault tokenizado e um smart contract que funciona como um fundo de investimento on-chain. Ele recebe depositos de um token especifico (chamado de "asset" ou "underlying asset") e, em troca, emite tokens de cota (chamados de "shares") ao depositante. Essas shares representam a participacao proporcional do investidor no pool de ativos mantidos pelo vault. Quando o vault gera rendimentos — seja por juros, taxas ou valorizacao dos ativos subjacentes — o valor de cada share aumenta proporcionalmente.

Antes do ERC-4626, cada protocolo DeFi implementava sua propria logica de vault: Yearn Finance tinha yTokens, Compound tinha cTokens, Aave tinha aTokens. Cada um com interface diferente, funcoes diferentes, logica de conversao diferente. Isso criava um problema serio de composabilidade: integrar um vault de um protocolo com outro exigia desenvolvimento customizado para cada par. O ERC-4626 resolve esse problema ao padronizar a interface, permitindo que qualquer vault seja integrado de forma generica por outros contratos e protocolos.

- **Exemplo agro**: Imagine um FIAGRO tokenizado que investe em CPRs (Cedulas de Produto Rural) de produtores de cafe. O investidor deposita USDC (stablecoin) no vault. O vault emite cotas (shares) proporcionais ao deposito. Os recursos do vault sao utilizados para comprar CPRs tokenizadas. Quando as CPRs pagam juros e principal, os recursos voltam ao vault, aumentando o valor de cada share. O investidor pode resgatar suas shares a qualquer momento, recebendo USDC proporcional ao valor atualizado do vault.

### A matematica de conversao: totalAssets, totalSupply e o exchange rate

A relacao entre assets e shares e determinada por uma formula simples que constitui o coracao do ERC-4626:

```
shares = assets * totalSupply / totalAssets
assets = shares * totalAssets / totalSupply
```

Onde:
- `totalAssets` e o valor total dos ativos controlados pelo vault (em unidades do token asset)
- `totalSupply` e o total de shares emitidas pelo vault
- `assets` e a quantidade de tokens que o usuario quer depositar
- `shares` e a quantidade de cotas que o usuario recebera

Quando o vault e criado e nao possui depositos, a taxa de conversao e tipicamente 1:1 (um asset para uma share). A medida que o vault acumula rendimentos, `totalAssets` cresce enquanto `totalSupply` permanece constante (ate que novos depositos sejam feitos). Isso significa que cada share passa a valer mais assets do que antes.

- **Exemplo agro**: Um vault FIAGRO comeca com R$ 1 milhao em USDC depositados e 1 milhao de shares emitidas (taxa 1:1). Apos seis meses, as CPRs no portfolio pagam R$ 60 mil em juros. Agora, `totalAssets` = 1.060.000 USDC e `totalSupply` = 1.000.000 shares. A taxa de conversao passa a ser 1 share = 1,06 USDC. Um investidor que depositou 100.000 USDC e recebeu 100.000 shares agora pode resgatar essas shares por 106.000 USDC — capturando sua parte proporcional dos juros sem nenhuma transacao adicional.

### Protecao contra inflation attack

Um problema classico de vaults ERC-4626 e o chamado "inflation attack" ou "donation attack". Nesse ataque, o primeiro depositante faz um deposito minimo (por exemplo, 1 wei), recebe 1 share, e em seguida "doa" uma grande quantidade de assets diretamente ao vault (sem usar a funcao deposit). Isso infla `totalAssets` sem aumentar `totalSupply`, fazendo com que o proximo depositante receba zero shares (por arredondamento inteiro).

A solucao padrao e o "virtual offset": o vault inicializa com shares e assets "virtuais" que evitam a manipulacao. A implementacao da OpenZeppelin, por exemplo, adiciona 1 unidade virtual a `totalAssets` e `totalSupply` nos calculos de conversao.

```solidity
// Protecao contra inflation attack (OpenZeppelin)
function _decimalsOffset() internal pure virtual returns (uint8) {
    return 0;
}

// totalAssets + 1 e totalSupply + 10^offset sao usados nos calculos
// Isso garante que o primeiro deposito nao seja manipulavel
```

- **Exemplo agro**: Em um vault FIAGRO com milhoes de dolares em depositos, esse ataque parece improvavel. Mas em vaults menores — como um pool de credito para pequenos produtores de hortalicas com capital inicial de R$ 50 mil — o risco e real. A protecao virtual offset e obrigatoria em qualquer implementacao de producao.

---

## 2. Interface completa do ERC-4626: funcoes deposit, mint, withdraw, redeem e preview

### As quatro operacoes fundamentais

O ERC-4626 define quatro operacoes simetricas para interagir com o vault:

**Deposito (entrada no vault):**
- `deposit(uint256 assets, address receiver)`: o usuario especifica quantos assets quer depositar e recebe shares proporcionais
- `mint(uint256 shares, address receiver)`: o usuario especifica quantas shares quer receber e o vault calcula quantos assets sao necessarios

**Resgate (saida do vault):**
- `withdraw(uint256 assets, address receiver, address owner)`: o usuario especifica quantos assets quer receber de volta e o vault queima as shares correspondentes
- `redeem(uint256 shares, address receiver, address owner)`: o usuario especifica quantas shares quer queimar e recebe os assets proporcionais

A simetria e intencional. `deposit` e `withdraw` sao denominados em assets. `mint` e `redeem` sao denominados em shares. Essa dupla interface permite que o usuario escolha se quer pensar em termos de "quanto quero investir" (deposit) ou "quantas cotas quero ter" (mint).

### Funcoes preview: simulacao antes da execucao

Para cada operacao, o ERC-4626 define uma funcao `preview` que retorna o resultado esperado sem executar a transacao:

```solidity
// Preview functions - simulam o resultado
function previewDeposit(uint256 assets) external view returns (uint256 shares);
function previewMint(uint256 shares) external view returns (uint256 assets);
function previewWithdraw(uint256 assets) external view returns (uint256 shares);
function previewRedeem(uint256 shares) external view returns (uint256 assets);
```

Essas funcoes sao `view` (nao alteram estado) e permitem que frontends, agregadores e outros contratos calculem exatamente o resultado de uma operacao antes de executa-la. Elas devem ser INCLUSIVE dos fees (taxas) cobrados pelo vault.

### Funcoes maxDeposit, maxMint, maxWithdraw, maxRedeem

O padrao tambem define funcoes que retornam o valor maximo que um endereco pode depositar ou resgatar:

```solidity
function maxDeposit(address receiver) external view returns (uint256 maxAssets);
function maxMint(address receiver) external view returns (uint256 maxShares);
function maxWithdraw(address owner) external view returns (uint256 maxAssets);
function maxRedeem(address owner) external view returns (uint256 maxShares);
```

Essas funcoes sao essenciais para compliance: em um vault regulado, `maxDeposit` pode retornar zero para investidores nao qualificados, ou limitar o valor maximo por investidor conforme regras regulatorias.

### Implementacao Solidity de um vault FIAGRO basico

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title FIAGROVault
 * @notice Vault ERC-4626 para fundo tokenizado de credito agro
 * O asset e uma stablecoin (USDC/DREX) e as shares representam cotas do fundo
 */
contract FIAGROVault is ERC4626, AccessControl {
    bytes32 public constant MANAGER_ROLE = keccak256("MANAGER_ROLE");
    bytes32 public constant COMPLIANCE_ROLE = keccak256("COMPLIANCE_ROLE");

    // Mapeamento de investidores aprovados (KYC/AML)
    mapping(address => bool) public approvedInvestors;

    // Limite maximo de deposito por investidor (em assets)
    uint256 public maxDepositPerInvestor;

    // Taxa de performance (em basis points, ex: 200 = 2%)
    uint256 public performanceFee;

    // Eventos especificos do FIAGRO
    event InvestorApproved(address indexed investor);
    event InvestorRevoked(address indexed investor);
    event YieldDistributed(uint256 amount, uint256 timestamp);

    constructor(
        IERC20 _asset,
        string memory _name,
        string memory _symbol,
        uint256 _maxDepositPerInvestor,
        uint256 _performanceFee
    ) ERC4626(_asset) ERC20(_name, _symbol) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MANAGER_ROLE, msg.sender);
        _grantRole(COMPLIANCE_ROLE, msg.sender);

        maxDepositPerInvestor = _maxDepositPerInvestor;
        performanceFee = _performanceFee;
    }

    // === Compliance: controle de acesso de investidores ===

    function approveInvestor(address investor) external onlyRole(COMPLIANCE_ROLE) {
        approvedInvestors[investor] = true;
        emit InvestorApproved(investor);
    }

    function revokeInvestor(address investor) external onlyRole(COMPLIANCE_ROLE) {
        approvedInvestors[investor] = false;
        emit InvestorRevoked(investor);
    }

    // === Override das funcoes max para aplicar compliance ===

    function maxDeposit(address receiver) public view override returns (uint256) {
        if (!approvedInvestors[receiver]) return 0;

        uint256 currentDeposit = convertToAssets(balanceOf(receiver));
        if (currentDeposit >= maxDepositPerInvestor) return 0;

        return maxDepositPerInvestor - currentDeposit;
    }

    function maxMint(address receiver) public view override returns (uint256) {
        uint256 maxAssets = maxDeposit(receiver);
        return convertToShares(maxAssets);
    }

    function maxWithdraw(address owner) public view override returns (uint256) {
        if (!approvedInvestors[owner]) return 0;
        return convertToAssets(balanceOf(owner));
    }

    function maxRedeem(address owner) public view override returns (uint256) {
        if (!approvedInvestors[owner]) return 0;
        return balanceOf(owner);
    }

    // === Hooks internos para validacao ===

    function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) internal override {
        require(approvedInvestors[receiver], "FIAGRO: investidor nao aprovado");
        super._deposit(caller, receiver, assets, shares);
    }

    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares
    ) internal override {
        require(approvedInvestors[owner], "FIAGRO: investidor nao aprovado");
        super._withdraw(caller, receiver, owner, assets, shares);
    }

    // === Gestao do fundo: distribuicao de yield ===

    /**
     * @notice O gestor deposita rendimentos das CPRs no vault
     * Ao transferir assets diretamente para o vault, o totalAssets aumenta
     * e o valor de cada share sobe proporcionalmente
     */
    function distributeYield(uint256 amount) external onlyRole(MANAGER_ROLE) {
        IERC20(asset()).transferFrom(msg.sender, address(this), amount);
        emit YieldDistributed(amount, block.timestamp);
    }
}
```

- **Exemplo agro**: Esse contrato implementa um FIAGRO tokenizado onde: (1) apenas investidores com KYC aprovado podem depositar e resgatar, (2) existe um limite maximo de deposito por investidor para compliance regulatorio, (3) o gestor do fundo pode distribuir rendimentos das CPRs transferindo stablecoins para o vault, e (4) o valor das cotas (shares) sobe automaticamente quando rendimentos sao distribuidos. Um investidor qualificado deposita 50.000 USDC, recebe shares proporcionais, e quando o gestor distribui os juros das CPRs de cafe e soja, as shares do investidor valem mais — tudo transparente e verificavel on-chain.

---

## 3. Aplicacao pratica: FIAGRO tokenizado com stablecoins e a limitacao da atomicidade

### Arquitetura de um FIAGRO tokenizado com ERC-4626

A arquitetura completa de um FIAGRO tokenizado usando ERC-4626 envolve multiplas camadas:

**Camada 1 — Asset (stablecoin):** O token base que investidores depositam. Pode ser USDC, USDT ou DREX (Real Digital). Em um cenario regulado brasileiro, o DREX seria o asset natural, pois permite integracao direta com o sistema financeiro via Banco Central.

**Camada 2 — Vault (contrato ERC-4626):** O contrato principal que recebe depositos, emite cotas e gerencia a conversao asset/share. Esse contrato implementa compliance (KYC/AML), limites de investimento e logica de taxas.

**Camada 3 — Ativos subjacentes (CPRs, CRAs tokenizados):** Os instrumentos de credito agro nos quais o vault investe. Esses ativos geram rendimentos (juros, amortizacao) que retornam ao vault e aumentam o valor das shares.

**Camada 4 — Gestor (off-chain ou on-chain):** A entidade responsavel por selecionar os ativos, monitorar inadimplencia e executar a politica de investimento do fundo. No modelo atual, essa funcao e majoritariamente off-chain, com o gestor executando transacoes no vault.

```
Investidor --> [deposit USDC] --> FIAGRO Vault (ERC-4626)
                                       |
                                       v
                              [totalAssets = USDC pool]
                                       |
                              [Gestor investe em CPRs]
                                       |
                                       v
                              CPR Cafe | CPR Soja | CPR Milho
                                       |
                              [Juros e amortizacao]
                                       |
                                       v
                              [distributeYield() -> totalAssets sobe]
                                       |
                                       v
                              [Share value aumenta]
                                       |
Investidor <-- [redeem shares] <-- FIAGRO Vault
```

- **Exemplo agro**: Um FIAGRO tokenizado com portfolio de 20 CPRs de produtores de soja do Mato Grosso, cada uma com prazo de 12 meses e taxa de CDI + 4% a.a. O vault recebe USDC de 200 investidores, totalizando R$ 10 milhoes. O gestor utiliza esses recursos para adquirir as CPRs. Mensalmente, os produtores pagam juros, e o gestor executa `distributeYield()` para creditar os rendimentos no vault. As shares dos investidores se valorizam automaticamente.

### A limitacao fundamental: atomicidade vs. ativos reais

Aqui chegamos ao ponto critico que motiva toda a evolucao dos padroes que veremos nas proximas aulas. O ERC-4626 foi desenhado para ativos DeFi nativos — tokens que existem inteiramente on-chain e podem ser transferidos instantaneamente. A funcao `deposit()` e atomica: o usuario envia assets e recebe shares na mesma transacao, no mesmo bloco, sem delay.

Mas ativos reais nao funcionam assim. Considere os cenarios:

**Problema 1 — Deposito:** Um investidor quer depositar R$ 500 mil via TED em um FIAGRO tokenizado. O dinheiro fiat precisa ser convertido em stablecoin, o que pode levar horas ou dias. O vault nao pode emitir shares antes de receber os assets, mas o investidor quer "travar" a taxa de conversao no momento do pedido. Com ERC-4626, isso e impossivel — a taxa de conversao no momento do `deposit()` pode ser diferente da taxa no momento em que o dinheiro efetivamente chega.

**Problema 2 — Resgate:** Um investidor quer resgatar R$ 1 milhao em shares. Mas o vault nao tem R$ 1 milhao em stablecoins liquidas — o dinheiro esta aplicado em CPRs com vencimento em 6 meses. O vault precisaria liquidar CPRs (vendendo no mercado secundario com desconto) ou negar o resgate. Com ERC-4626, a funcao `withdraw()` ou falha (se nao ha liquidez) ou executa instantaneamente (se ha liquidez). Nao existe estado intermediario de "resgate pendente".

**Problema 3 — Precificacao:** O `totalAssets` de um vault ERC-4626 e atualizado em tempo real. Mas o valor de CPRs de produtores rurais nao muda a cada bloco — ele depende de avaliacoes periodicas, pagamentos futuros e risco de credito que so podem ser atualizados off-chain. Qual valor usar para `totalAssets`? Se o gestor atualiza apenas mensalmente, investidores que depositam logo antes da atualizacao podem ser prejudicados ou beneficiados.

```solidity
// O problema: deposit() e atomico, mas ativos reais nao sao
function deposit(uint256 assets, address receiver) public override returns (uint256) {
    // Isso funciona perfeitamente para USDC -> shares de um vault DeFi
    // Mas para ativos reais:
    // 1. O dinheiro fiat pode nao ter chegado ainda
    // 2. A avaliacao do portfolio pode estar desatualizada
    // 3. O compliance KYC pode estar pendente
    // Resultado: precisamos de um vault ASSINCRONO
    return super.deposit(assets, receiver);
}
```

### Por que a atomicidade falha no agronegocio

O agronegocio brasileiro opera em ciclos longos. Uma CPR de soja tem prazo tipico de 8 a 12 meses. Um CRA pode ter prazo de 3 a 5 anos. Um financiamento de investimento para compra de maquinario pode ter prazo de 7 a 10 anos. Nenhum desses instrumentos e instantaneamente liquido. Quando um investidor pede resgate de cotas de um FIAGRO lastreado em CPRs, o gestor precisa de tempo para:

1. Avaliar a liquidez disponivel no vault
2. Se necessario, vender CPRs no mercado secundario (que pode levar dias)
3. Verificar se o resgate nao viola covenants ou limites de concentracao
4. Processar a conversao fiat/stablecoin se necessario
5. Cumprir prazos regulatorios de resgate (D+30 para FIAGROs tradicionais)

Esse processo nao cabe em uma transacao atomica. E por isso que o ERC-4626 sozinho nao e suficiente para RWA. Precisamos de uma extensao assincrona — que e exatamente o que o ERC-7540 oferece, e sera o tema da proxima aula.

- **Exemplo agro**: Um FIAGRO listado na B3 com PL de R$ 500 milhoes tem prazo de resgate de D+30. Se um investidor solicita resgate de R$ 10 milhoes, o gestor tem 30 dias para processar. Durante esse periodo, ele pode receber amortizacoes de CPRs, vender cotas de CRAs no mercado secundario ou usar linhas de credito para gerar liquidez. Esse processo multi-etapa e multi-dia e fundamentalmente incompativel com a atomicidade do ERC-4626. O ERC-7540 introduz o conceito de "request" — o investidor solicita o resgate, o vault processa de forma assincrona, e o investidor reclama os assets quando o processamento e concluido.

---

## Conclusao

Nesta aula, construimos a base dos vaults tokenizados com o padrao ERC-4626. Entendemos que um vault e um fundo de investimento on-chain que recebe depositos de um asset, emite shares proporcionais e distribui rendimentos automaticamente via valorizacao das shares. Dominamos a interface completa — deposit, mint, withdraw, redeem e as funcoes preview — e implementamos um contrato FIAGROVault com compliance integrado. Porem, identificamos a limitacao fundamental do padrao: a atomicidade. Operacoes com ativos reais do agronegocio — CPRs, CRAs, recebiveis — nao sao instantaneas. Depositos envolvem conversao fiat-cripto, resgates dependem de liquidez que pode levar dias para ser gerada, e a precificacao e periodica, nao em tempo real. Essa limitacao motiva diretamente o proximo padrao que estudaremos.

---

## Licao de Casa

1. Implemente o contrato `FIAGROVault` apresentado nesta aula em Remix ou Foundry, usando um token ERC-20 de teste como asset. Execute depositos com diferentes enderecos, simule distribuicao de yield com `distributeYield()`, e verifique que o valor das shares aumenta proporcionalmente apos cada distribuicao. Registre as taxas de conversao antes e depois de cada distribuicao.

2. Pesquise tres FIAGROs listados na B3 (como KNCA11, RURA11 ou NCRA11) e analise seus regulamentos. Identifique: (a) qual e o ativo subjacente (CPRs, CRAs, imoveis rurais), (b) qual e o prazo de resgate, (c) como os rendimentos sao distribuidos aos cotistas. Compare essas caracteristicas com a arquitetura ERC-4626 apresentada e identifique quais funcionalidades do fundo tradicional sao cobertas pelo padrao e quais nao sao.

3. Estude o inflation attack descrito na aula e tente executa-lo contra um vault ERC-4626 sem protecao (deploy um vault basico sem virtual offset). Documente o ataque passo a passo e depois implemente a protecao usando o parametro `_decimalsOffset()` da OpenZeppelin. Verifique que o ataque nao funciona mais apos a protecao.

---

## Questionario

**1. Qual e a funcao principal do padrao ERC-4626?**

a) Criar tokens nao fungiveis para representar propriedades rurais
b) Padronizar a interface de vaults tokenizados que recebem depositos de um asset e emitem shares proporcionais, permitindo composabilidade entre protocolos DeFi
c) Implementar transferencias de stablecoins entre blockchains
d) Definir regras de compliance KYC/AML para tokens de seguranca

**Resposta: b**

**2. Em um vault ERC-4626, o que acontece com o valor de cada share quando o vault recebe rendimentos (yield)?**

a) O valor de cada share permanece constante e os rendimentos sao distribuidos como dividendos separados
b) Novas shares sao emitidas automaticamente para todos os holders
c) O totalAssets aumenta enquanto o totalSupply permanece constante, fazendo o valor de cada share subir proporcionalmente
d) O vault queima shares para manter a taxa de conversao 1:1

**Resposta: c**

**3. Qual a diferenca entre as funcoes `deposit()` e `mint()` no ERC-4626?**

a) Nao ha diferenca — ambas fazem a mesma coisa
b) `deposit()` e denominado em assets (o usuario especifica quanto quer depositar) e `mint()` e denominado em shares (o usuario especifica quantas cotas quer receber)
c) `deposit()` e para investidores individuais e `mint()` e para investidores institucionais
d) `deposit()` e gratuito e `mint()` cobra taxas

**Resposta: b**

**4. Por que a atomicidade do ERC-4626 e uma limitacao para ativos reais (RWA) do agronegocio?**

a) Porque ativos reais como CPRs e CRAs nao podem ser representados como tokens ERC-20
b) Porque o ERC-4626 nao suporta compliance KYC/AML
c) Porque operacoes com ativos reais — conversao fiat, liquidacao de CPRs, avaliacao de portfolio — levam dias e nao podem ser executadas atomicamente em uma unica transacao on-chain
d) Porque stablecoins nao sao aceitas pelo padrao ERC-4626

**Resposta: c**

**5. No contrato FIAGROVault implementado nesta aula, como a funcao `maxDeposit()` implementa compliance regulatorio?**

a) Ela sempre retorna zero, impedindo qualquer deposito
b) Ela verifica se o investidor esta na lista de aprovados (KYC) e se o deposito nao excede o limite maximo por investidor, retornando zero para investidores nao qualificados
c) Ela consulta um oraculo externo para verificar a identidade do investidor
d) Ela nao implementa compliance — essa funcao e apenas para limites tecnicos do vault

**Resposta: b**

---

## Proxima Aula

Na proxima aula, vamos resolver a limitacao fundamental identificada aqui: a atomicidade. Estudaremos o ERC-7540, o padrao de vaults assincronos projetado especificamente para ativos reais. Voce vai aprender como o mecanismo de request-based deposit/redeem com pending status e epoch mechanism permite que um FIAGRO tokenizado processe depositos e resgates em multiplas etapas, respeitando os tempos reais de liquidacao de CPRs, CRAs e recebiveis do agronegocio. Ate la!
