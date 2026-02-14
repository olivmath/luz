# Aula 3.2: Componentes de um Smart Contract para RWA

## Abertura

Bem-vindo a aula 3.2 do Modulo 3 — Arquitetura de uma Solucao RWA e Smart Contracts. Na aula anterior, voce conheceu as cinco camadas do RWA Stack e entendeu como elas se conectam para formar uma plataforma de tokenizacao completa. Agora, vamos abrir a "caixa-preta" da Camada 2 e dissecar os componentes internos de um smart contract projetado especificamente para ativos reais do agronegocio. Voce vai entender como funciona a emissao (mint) de um token lastreado em CPR ou CRA, como funciona a destruicao (burn) do token no resgate, como as transferencias sao restritas para garantir compliance regulatorio, qual o papel juridico do SPV/securitizadora como legal wrapper e como o fluxo completo de mint/redeem conecta o ativo fisico (graos no silo, recebiveis no banco) ao token digital na blockchain. Ao final, voce sera capaz de ler e compreender a logica de um smart contract de RWA e identificar seus pontos criticos.

### Programa da aula:

1. Estrutura basica: mint, burn e transfer com restricoes
2. Papel do SPV/securitizadora: o legal wrapper
3. Fluxo de mint/redeem: ativo off-chain → verificacao → emissao on-chain

---

## 1. Estrutura basica: mint, burn e transfer com restricoes

### Funcao mint: criando tokens lastreados em ativos reais

A funcao `mint` e o ponto de entrada do ciclo de vida de um token de RWA. Diferentemente de um token de utilidade ou de governanca, onde o mint pode ser livre ou programatico, em um token de RWA o mint e um evento controlado e auditavel que so ocorre quando existe um ativo real verificado como lastro. Em outras palavras: nenhum token pode ser criado "do nada" — cada unidade mintada deve corresponder a um ativo off-chain que foi verificado, custodiado e registrado.

Na arquitetura de um smart contract de RWA para o agro, a funcao mint e restrita a um papel especifico — geralmente o "issuer" (emissor) ou "minter" — que e o endereco controlado pela entidade responsavel pela emissao (a securitizadora, o SPV ou a plataforma de tokenizacao). A funcao recebe como parametros: o endereco do destinatario (investidor que comprou o token), a quantidade de tokens a ser emitida e, opcionalmente, metadados do lastro (identificador da CPR, numero do CRA, lote de armazenagem). Antes de executar o mint, o contrato verifica internamente se o destinatario esta na whitelist de investidores elegíveis (verificacao de compliance) e se o total de tokens emitidos nao excede o limite da oferta (cap).

```solidity
// Exemplo simplificado de funcao mint para RWA agro
// Baseado no padrao ERC-3643 (T-REX)

contract TokenCRA is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint256 public maxSupply;          // Limite da emissao (ex: 400.000 tokens = R$ 400M)
    IIdentityRegistry public identityRegistry;  // Registro de identidade on-chain
    IComplianceModule public compliance;        // Modulo de compliance

    // Evento emitido a cada mint para auditoria
    event TokensMinted(
        address indexed investor,
        uint256 amount,
        string assetReference  // Referencia ao ativo off-chain (ex: "CRA-AGRO-2024-001")
    );

    function mint(
        address _investor,
        uint256 _amount,
        string calldata _assetReference
    ) external onlyRole(MINTER_ROLE) {
        // Verificacao 1: o investidor esta registrado e verificado?
        require(
            identityRegistry.isVerified(_investor),
            "Investidor nao verificado (KYC incompleto)"
        );

        // Verificacao 2: a emissao nao excede o limite?
        require(
            totalSupply() + _amount <= maxSupply,
            "Limite da emissao excedido"
        );

        // Verificacao 3: o compliance permite esta operacao?
        require(
            compliance.canMint(_investor, _amount),
            "Operacao bloqueada pelo modulo de compliance"
        );

        // Emissao dos tokens
        _mint(_investor, _amount);

        // Registro do evento para auditoria on-chain
        emit TokensMinted(_investor, _amount, _assetReference);
    }
}
```

- **Exemplo**: Uma securitizadora emite um CRA de R$ 200 milhoes lastreado em CPRs de soja do Mato Grosso. O CRA e dividido em 200.000 tokens, cada um representando R$ 1.000 de valor nominal. Quando o investidor Fundo ABC compra R$ 5 milhoes em tokens, a securitizadora chama a funcao `mint` passando o endereco da wallet do Fundo ABC, a quantidade de 5.000 tokens e a referencia "CRA-SOJA-MT-2024-S1". O contrato verifica que o Fundo ABC passou por KYC (claim de investidor qualificado no IdentityRegistry), que o total emitido (digamos, 150.000 tokens ja emitidos + 5.000 = 155.000) nao excede o maxSupply de 200.000, e que o modulo de compliance permite a alocacao. Aprovado, os 5.000 tokens sao creditados ao Fundo ABC e o evento e registrado na blockchain para auditoria permanente.

### Funcao burn: destruindo tokens no resgate ou vencimento

A funcao `burn` e o inverso do mint — ela destroi tokens, retirando-os permanentemente de circulacao. No ciclo de vida de um RWA, o burn ocorre em tres situacoes principais: (1) no vencimento do titulo, quando o investidor resgata seus tokens e recebe o valor de face mais rendimentos; (2) em amortizacoes periodicas, quando parte do principal e devolvido ao investidor e a quantidade correspondente de tokens e destruida; (3) em resgates antecipados, quando o emissor ou o investidor exercem uma clausula de resgate antes do vencimento.

O burn e tao critico quanto o mint porque ele precisa estar sincronizado com o mundo off-chain: quando tokens sao queimados, o ativo real subjacente precisa ser liberado ou o pagamento precisa ser efetuado. Essa sincronizacao e um dos maiores desafios da tokenizacao de RWA — o smart contract pode queimar tokens instantaneamente, mas a transferencia bancaria para o investidor leva D+1 ou D+2, e a liberacao de colateral fisico (graos em armazem) pode levar dias. Por isso, a funcao burn em contratos de RWA sofisticados geralmente opera em duas etapas: primeiro, um "pedido de resgate" (redemption request) que bloqueia os tokens; depois, a confirmacao do burn apos a verificacao de que o pagamento off-chain foi realizado.

```solidity
// Funcao burn em duas etapas para RWA agro

// Etapa 1: Investidor solicita resgate
function requestRedemption(uint256 _amount) external {
    require(balanceOf(msg.sender) >= _amount, "Saldo insuficiente");
    require(!redemptionPaused, "Resgates temporariamente suspensos");

    // Bloqueia os tokens (nao podem ser transferidos)
    _transfer(msg.sender, address(this), _amount);

    // Registra o pedido de resgate
    redemptionRequests[msg.sender] += _amount;

    emit RedemptionRequested(msg.sender, _amount, block.timestamp);
}

// Etapa 2: Emissor confirma o resgate apos pagamento off-chain
function confirmRedemption(
    address _investor,
    uint256 _amount,
    string calldata _paymentReference  // Referencia do pagamento bancario
) external onlyRole(MINTER_ROLE) {
    require(
        redemptionRequests[_investor] >= _amount,
        "Pedido de resgate nao encontrado"
    );

    // Queima os tokens definitivamente
    _burn(address(this), _amount);

    // Atualiza o registro de resgates
    redemptionRequests[_investor] -= _amount;

    emit RedemptionConfirmed(_investor, _amount, _paymentReference);
}
```

- **Exemplo**: Um CRA tokenizado de cafe do cerrado mineiro tem amortizacao semestral de 15% do principal. A cada seis meses, o smart contract recebe a confirmacao (via oraculo ou transacao do emissor) de que os pagamentos foram processados no sistema bancario. O contrato entao queima 15% dos tokens de cada investidor proporcionalmente — se o Fundo XYZ detinha 10.000 tokens, 1.500 sao queimados e o Fundo XYZ recebe R$ 1.500.000 via transferencia bancaria (referenciada no evento on-chain). O saldo restante de 8.500 tokens continua rendendo CDI + spread ate a proxima amortizacao. No vencimento final, os ultimos tokens sao queimados e todo o lastro e liberado.

### Funcao transfer com restricoes: compliance embutido

Em tokens convencionais (ERC-20), qualquer detentor pode transferir tokens para qualquer endereco, a qualquer momento, sem restricoes. Em tokens de RWA, isso e inaceitavel: a regulacao exige que apenas investidores verificados detenham os tokens, que limites de concentracao sejam respeitados e que certas jurisdicoes sejam bloqueadas. Por isso, smart contracts de RWA implementam transferencias restritas — a funcao `transfer` (e `transferFrom`) e sobrescrita para incluir verificacoes de compliance antes de cada transacao.

O padrao ERC-3643 (T-REX) resolve isso de forma elegante: antes de cada transferencia, o contrato consulta o modulo de compliance e o registro de identidade. Se o destinatario nao estiver na whitelist, a transacao reverte. Se a transferencia violar uma regra de compliance (por exemplo, concentracao maxima de 10% por investidor), a transacao reverte. Se o token estiver em periodo de lockup (bloqueio de negociacao), a transacao reverte. Tudo isso acontece automaticamente, sem necessidade de intervencao humana ou aprovacao manual.

```solidity
// Transfer com restricoes — padrao ERC-3643 simplificado

function _beforeTokenTransfer(
    address from,
    address to,
    uint256 amount
) internal override {
    // Ignora verificacoes em mint (from = 0) e burn (to = 0)
    if (from == address(0) || to == address(0)) return;

    // Verificacao 1: destinatario esta verificado no registro de identidade?
    require(
        identityRegistry.isVerified(to),
        "Destinatario nao verificado — transferencia bloqueada"
    );

    // Verificacao 2: modulo de compliance aprova a transferencia?
    require(
        compliance.canTransfer(from, to, amount),
        "Transferencia viola regras de compliance"
    );
}
```

As regras de compliance implementadas no modulo podem incluir:

- **Whitelist de investidores**: Apenas enderecos com KYC aprovado podem receber tokens
- **Restricao de jurisdicao**: Investidores de paises sancionados (OFAC, UE) sao bloqueados
- **Limite de concentracao**: Nenhum investidor pode deter mais de X% do total de tokens
- **Lockup period**: Tokens nao podem ser transferidos nos primeiros 90 dias apos o mint
- **Numero maximo de detentores**: Limitar a 75 investidores (regra de oferta restrita no Brasil)
- **Classe do investidor**: Apenas investidores qualificados (patrimonio superior a R$ 1 milhao)

- **Exemplo**: Um FIAGRO tokenizado emite tokens de cotas destinados exclusivamente a investidores qualificados (Resolucao CVM 30). O smart contract tem um modulo de compliance que verifica, a cada transferencia no mercado secundario, se o comprador possui o claim "investidor_qualificado_br" no registro de identidade on-chain. Um investidor de varejo tenta comprar tokens no mercado secundario via uma exchange descentralizada (DEX) — a transacao reverte automaticamente com a mensagem "Destinatario nao verificado — transferencia bloqueada". Isso garante que o ativo permaneca exclusivamente nas maos de investidores elegíveis, sem necessidade de intermediarios manuais monitorando cada transacao.

---

## 2. Papel do SPV/securitizadora: o legal wrapper

### Por que tokens precisam de uma "capa juridica"

Um token na blockchain e apenas um registro digital — um numero associado a um endereco. Por si so, ele nao confere direitos legais sobre nenhum ativo real. Para que um token represente legitimamente uma fracao de CRA, uma CPR ou um lote de soja em armazem, e necessario que exista uma estrutura juridica que vincule o token ao ativo. Essa estrutura e o "legal wrapper" — o embrulho juridico que da sustentacao legal a tokenizacao.

No Brasil e na maioria das jurisdicoes, o legal wrapper e implementado por meio de um SPV (Special Purpose Vehicle — Veiculo de Proposito Especifico) ou de uma securitizadora registrada na CVM. O SPV e uma entidade juridica criada exclusivamente para deter o ativo real e emitir os tokens que o representam. Ele nao tem outros negocios, funcionarios ou atividades — sua unica funcao e ser o elo juridico entre o mundo fisico e o mundo digital.

A estrutura funciona assim: (1) o ativo real (CPR, CRA, contrato de armazenagem, recebivel) e transferido para o SPV via cessao ou custodia; (2) o SPV emite tokens que representam direitos sobre esse ativo; (3) os detentores dos tokens tem direitos juridicos (contratualmente definidos) sobre os fluxos de caixa ou o valor do ativo detido pelo SPV; (4) no vencimento ou resgate, o SPV liquida o ativo e distribui os recursos aos detentores dos tokens.

### Modelos de legal wrapper no agro brasileiro

Existem tres modelos principais de legal wrapper utilizados em tokenizacao de ativos do agro no Brasil:

**Modelo 1 — Securitizadora CVM**: A securitizadora registrada na CVM emite CRA (ou outro titulo de securitizacao) lastreado em recebiveis do agro. Os CRA sao entao tokenizados — cada token representa uma fracao do CRA. A securitizadora atua como emissora dos tokens e custodia os ativos subjacentes em patrimonio separado. Este e o modelo mais robusto juridicamente, pois se beneficia de toda a legislacao de securitizacao (Lei 14.430/2022), incluindo o patrimonio separado que protege os investidores em caso de insolvencia da securitizadora. A Liqi e a Vortx Digital utilizam esse modelo em operacoes de CRA tokenizado.

**Modelo 2 — SPV dedicado (Sociedade de Proposito Especifico)**: Uma SPE (LTDA ou S/A) e constituida para deter o ativo real e emitir tokens que representam cotas ou direitos sobre esse ativo. Este modelo e mais flexivel que a securitizadora e pode ser utilizado para tokenizar ativos que nao se enquadram em CRA — como estoques fisicos de commodities, terras rurais ou contratos de barter. O risco juridico e maior porque a SPE nao tem patrimonio separado por forca de lei (diferentemente da securitizadora), e a relacao entre token e ativo depende integralmente dos contratos firmados.

**Modelo 3 — Fundo de investimento (FIAGRO)**: Um FIAGRO registrado na CVM adquire os ativos do agro (CPR, CRA, terras) e emite cotas que podem ser tokenizadas. Os detentores dos tokens possuem cotas do fundo, com todos os direitos e obrigacoes previstos no regulamento. Este modelo e o mais regulado e oferece protecao significativa ao investidor, mas tambem e o mais caro e burocratico.

```
Diagrama: Legal wrapper — fluxo juridico do ativo ao token

  ATIVO REAL                    LEGAL WRAPPER                  TOKEN
  ==========                   =============                  =====

  CPR financeira   ---cessao-->  SPV / Securitizadora  ---mint-->  Token ERC-3643
  (R$ 5M, soja MT)              (patrimonio separado)              (5.000 tokens)
                                       |
                                       |--- Contrato define:
                                       |    - Token = direito creditorio
                                       |    - Waterfall de pagamentos
                                       |    - Condicoes de resgate (burn)
                                       |    - Governanca e compliance
                                       |
  Pagamento CPR   ---deposito-->  Conta escrow SPV  ---distribuicao-->  Holders
  (produtor paga)                                      de rendimento     recebem
```

- **Exemplo**: A securitizadora True Securitizadora estruturou em 2024 uma emissao de CRA de R$ 150 milhoes lastreada em recebiveis de cooperativas de graos de Goias. Os CRA foram tokenizados em parceria com uma plataforma de tokenizacao, com cada token representando R$ 500 de valor nominal. O legal wrapper e a propria securitizadora, que detem os recebiveis em patrimonio separado (protecao contra insolvencia), emitiu o CRA registrado na B3 e autorizou a emissao dos tokens correspondentes. O contrato juridico (termo de securitizacao) define explicitamente que cada token confere ao detentor os mesmos direitos de um investidor de CRA tradicional — direito a receber juros semestrais (CDI + 2,5%), amortizacao do principal e protecao do patrimonio separado. Se a securitizadora falir, os ativos do patrimonio separado nao sao afetados — e os detentores de tokens tem os mesmos direitos de investidores que compraram CRA por meios tradicionais.

### A questao da validade juridica do token no Brasil

A validade juridica do token como representacao de ativo real no Brasil ainda esta em evolucao. A CVM, por meio da Resolucao 88 (sandbox regulatorio) e de manifestacoes publicas, reconhece que tokens podem representar valores mobiliarios desde que respeitem as regras de oferta publica, registro e transparencia. O Marco Legal das Criptomoedas (Lei 14.478/2022) regulamentou a prestacao de servicos de ativos virtuais, mas nao abordou especificamente a tokenizacao de ativos reais. Na pratica, o mercado opera com base em pareceres juridicos que equiparam o token a um direito contratual sobre o ativo detido pelo SPV — ou seja, o investidor nao detem diretamente o ativo real, mas sim um direito contratual (representado pelo token) de receber os fluxos de caixa ou o valor do ativo.

O Drex (Real Digital) pode ser o catalisador que resolve essa ambiguidade. Ao criar uma infraestrutura de moeda digital do Banco Central que interopera com tokens de RWA, o Drex confere legitimidade institucional a tokenizacao e viabiliza a liquidacao de tokens de RWA em moeda soberana digital. Pilotos do Drex ja incluem a tokenizacao de titulos publicos federais (Tesouro Direto tokenizado), CDB e creditos do agro — sinalizando que o regulador brasileiro caminha para um framework que integre tokens e sistema financeiro tradicional.

- **Exemplo**: No piloto do Drex conduzido em 2024, o Banco do Brasil testou a tokenizacao de titulos do agronegocio em ambiente controlado. O teste simulou a emissao de um CRA tokenizado, onde o token na rede Drex representava uma fracao do CRA custodiado na B3. A liquidacao foi feita em Real Digital (CBDC), eliminando o risco de settlement que existe quando tokens sao pagos em stablecoins privadas. Esse piloto demonstrou que e tecnicamente viavel integrar a camada de tokenizacao (smart contracts) com a infraestrutura bancaria e regulatoria brasileira — um passo fundamental para a escala da tokenizacao no agro.

---

## 3. Fluxo de mint/redeem: ativo off-chain → verificacao → emissao on-chain

### O ciclo completo: do grao no silo ao token na wallet

O fluxo de mint/redeem e o processo end-to-end que conecta o ativo real ao token digital e, no resgate, reconverte o token em valor financeiro ou ativo fisico. Esse fluxo e o coracao de qualquer operacao de tokenizacao de RWA e envolve multiplos participantes, verificacoes e sincronizacoes entre o mundo on-chain e off-chain.

**Fase 1 — Originacao e verificacao do ativo off-chain**

Tudo comeca no mundo fisico. Um produtor de soja do Mato Grosso emite uma CPR financeira de R$ 3 milhoes em favor de uma securitizadora. A securitizadora (ou a plataforma de tokenizacao) realiza a due diligence: verifica a validade juridica da CPR, confirma as garantias (alienacao fiduciaria sobre a producao, cessao de recebiveis, seguro rural), audita o historico do produtor e valida que o recebivel atende aos criterios de elegibilidade da operacao. Paralelamente, o armazem certificado confirma o estoque de soja (se for CPR fisica ou se houver commodity pledge), e o banco confirma que a conta escrow esta operacional.

**Fase 2 — Custodia e registro do ativo**

Aprovada a due diligence, o ativo e transferido para a custodia do SPV/securitizadora. A CPR e registrada em registradora autorizada (B3 ou Cerc). Os documentos comprobatorios sao armazenados pelo custodiante (Vortx, Oliveira Trust). Neste momento, o ativo existe formalmente no mundo regulado — registrado, custodiado e vinculado ao patrimonio separado da securitizadora.

**Fase 3 — Emissao on-chain (mint)**

Com o ativo custodiado e registrado, a securitizadora autoriza o mint dos tokens correspondentes. A plataforma de tokenizacao chama a funcao `mint` do smart contract, emitindo a quantidade de tokens proporcional ao valor do ativo (por exemplo, 3.000 tokens de R$ 1.000 cada para uma CPR de R$ 3 milhoes). Os tokens sao creditados ao endereco do investidor que adquiriu a oferta. O evento de mint e registrado permanentemente na blockchain, criando um historico auditavel.

**Fase 4 — Vida util do token (holding period)**

Durante a vida util do token, o investidor detem os tokens em sua wallet e recebe rendimentos periodicos (juros semestrais, amortizacoes). Os rendimentos sao distribuidos pelo smart contract de vault, que recebe os pagamentos via oraculo ou transacao do emissor e distribui proporcionalmente aos detentores. O investidor pode transferir (vender) seus tokens no mercado secundario, desde que o comprador atenda aos requisitos de compliance verificados pelo smart contract.

**Fase 5 — Resgate (redeem/burn)**

No vencimento ou em resgate antecipado, o investidor solicita o resgate dos tokens. O smart contract bloqueia os tokens (transfere para o contrato). A securitizadora liquida o ativo off-chain (recebe o pagamento da CPR, vende o estoque de soja ou recebe o pagamento do devedor do CRA). O valor e depositado na conta do investidor via transferencia bancaria ou em stablecoin/CBDC. A securitizadora confirma o pagamento on-chain, e o smart contract queima (burn) os tokens resgatados. O ciclo se fecha.

```
Diagrama: Fluxo completo mint/redeem de um token de CPR agro

  FASE 1: ORIGINACAO           FASE 2: CUSTODIA          FASE 3: MINT
  ================            ==============            ==========
  Produtor emite CPR  --->  SPV recebe CPR via   --->  Smart contract
  Due diligence:             cessao                     mint(investidor,
  - Garantias OK             Registro na B3/Cerc        3000, "CPR-001")
  - Seguro OK                Custodia documental        |
  - Historico OK             Patrimonio separado        v
                                                     3.000 tokens
                                                     creditados ao
                                                     investidor

  FASE 4: HOLDING             FASE 5: REDEEM
  ===============            ==============
  Investidor detem tokens    Vencimento da CPR:
  Recebe rendimentos CDI+    Produtor paga CPR
  Pode vender no mercado     Securitizadora recebe $
  secundario (compliance     Investidor solicita burn
  automatico)                Smart contract queima tokens
                             Investidor recebe R$ via banco
```

- **Exemplo**: A plataforma Liqi Digital Assets executa o seguinte fluxo para tokenizar recebiveis de uma cooperativa de cafe de Minas Gerais: (1) a cooperativa cede R$ 20 milhoes em recebiveis (contratos de venda de cafe para exportadoras) a uma securitizadora parceira; (2) a securitizadora registra os recebiveis na Cerc e custodia os documentos na Vortx; (3) a securitizadora emite CRA de R$ 18 milhoes (sobrecolateralizacao de 11%) e autoriza o mint de 18.000 tokens de R$ 1.000; (4) investidores qualificados compram os tokens via plataforma da Liqi, com KYC verificado via idwall; (5) a cada trimestre, as exportadoras pagam os recebiveis na conta escrow da operacao, e o vault distribui CDI + 3,2% proporcionalmente aos detentores de tokens; (6) no vencimento (12 meses), os ultimos recebiveis sao liquidados, o vault distribui o principal, e todos os tokens sao queimados. O ciclo completo — do cafe no armazem ao token na wallet e de volta ao dinheiro no banco — leva 12 meses, com total rastreabilidade on-chain.

### Sincronizacao on-chain/off-chain: o desafio central

O maior desafio tecnico do fluxo mint/redeem nao e a logica do smart contract — essa parte e relativamente simples de implementar. O desafio central e a sincronizacao entre o que acontece on-chain (emissao e queima de tokens) e o que acontece off-chain (custodia de ativos, pagamentos bancarios, verificacoes regulatorias). Essa sincronizacao e o que o mercado chama de "settlement gap" — a lacuna temporal e operacional entre a instrucao on-chain e a execucao off-chain.

Tres estrategias sao utilizadas para minimizar o settlement gap:

**Estrategia 1 — Oraculos de estado**: Servicos que monitoram eventos off-chain (pagamentos, liquidacoes, registros) e os reportam on-chain. Quando o banco confirma que o pagamento da CPR foi recebido na conta escrow, o oraculo envia uma transacao ao smart contract atualizando o status do ativo. Essa estrategia depende da confiabilidade do oraculo e da velocidade de atualizacao.

**Estrategia 2 — Stablecoins e CBDC**: Ao utilizar stablecoins (USDC, USDT, BRZ) ou CBDC (Drex) para pagamentos, o fluxo financeiro tambem ocorre on-chain, eliminando parte do settlement gap. O investidor solicita resgate, o vault transfere stablecoins diretamente para a wallet do investidor e queima os tokens — tudo em uma unica transacao atomica, sem depender de transferencia bancaria.

**Estrategia 3 — Atomic settlement via Drex**: O Drex promete viabilizar o settlement atomico (DvP — Delivery vs. Payment) entre tokens de RWA e moeda digital do Banco Central. Nesse modelo, a entrega do token e o pagamento em Real Digital ocorrem simultaneamente, em uma unica transacao na rede — eliminando completamente o settlement gap e o risco de contraparte.

- **Exemplo**: Em uma operacao de CRA tokenizado com pagamento via stablecoin BRZ (Real tokenizado pela Transfero), o fluxo de resgate funciona assim: (1) o investidor chama `requestRedemption(1000)` no smart contract, bloqueando 1.000 tokens; (2) o vault do smart contract calcula o valor de resgate (R$ 1.000.000 + rendimentos acumulados = R$ 1.032.000); (3) a securitizadora deposita 1.032.000 BRZ no vault; (4) o vault transfere os BRZ para a wallet do investidor e queima os 1.000 tokens em uma unica transacao atomica. O investidor recebeu o pagamento e entregou os tokens simultaneamente — sem settlement gap, sem risco de contraparte, sem esperar D+1 bancario. Quando o Drex estiver operacional, esse mesmo fluxo podera ocorrer em Real Digital (CBDC), conferindo ainda mais seguranca e legitimidade ao processo.

---

## Conclusao

Nesta aula, abrimos a caixa-preta dos smart contracts para RWA e detalhamos seus tres componentes fundamentais. Primeiro, estudamos as funcoes core — mint (emissao controlada de tokens lastreados em ativos reais verificados), burn (destruicao de tokens no resgate, sincronizada com pagamentos off-chain) e transfer com restricoes (compliance automatico que verifica identidade, whitelist e regras regulatorias a cada transacao). Segundo, compreendemos o papel do SPV/securitizadora como legal wrapper — a entidade juridica que detem o ativo real e confere validade legal ao token, com destaque para os tres modelos utilizados no Brasil (securitizadora CVM, SPV dedicado e FIAGRO). Terceiro, percorremos o fluxo completo de mint/redeem, desde a originacao do ativo off-chain (CPR de soja no armazem) ate a emissao on-chain (token na wallet), passando pela custodia, registro e distribuicao de rendimentos, e concluindo com o resgate e a queima do token. O desafio central — a sincronizacao on-chain/off-chain — e mitigado por oraculos de estado, stablecoins e, no futuro proximo, pelo settlement atomico via Drex. Na proxima aula, vamos colocar a mao na massa: estudaremos as ferramentas de desenvolvimento e deploy de smart contracts para RWA.

---

## Licao de Casa

1. Leia a documentacao do padrao ERC-3643 (T-REX) disponivel em erc3643.org e identifique os cinco contratos core do protocolo (Identity Registry, Compliance, Trusted Issuers Registry, Claim Topics Registry e Token). Descreva em um paragrafo a funcao de cada um e como eles interagem para garantir compliance automatico em transferencias de security tokens.
2. Pesquise um caso real de tokenizacao de CRA ou recebivel do agro no Brasil (plataformas como Liqi, Mercado Bitcoin ou Vortx Digital). Identifique: qual o legal wrapper utilizado (securitizadora, SPV ou fundo), qual blockchain foi escolhida, como funciona o resgate (burn) e se ha mercado secundario para os tokens.
3. Desenhe o fluxo completo de mint/redeem para um cenario hipotetico: tokenizacao de 500 CPRs de milho do Parana, totalizando R$ 50 milhoes, com securitizadora como legal wrapper, emissao de 50.000 tokens na Polygon, rendimento de CDI + 2,8%, amortizacao semestral e vencimento em 18 meses. Indique em cada etapa quem e o responsavel (produtor, securitizadora, plataforma, investidor) e qual sistema e utilizado (on-chain ou off-chain).

---

## Questionario

**1. Em um smart contract de RWA, a funcao mint so pode ser executada quando:**

a) Qualquer usuario da blockchain decide criar novos tokens
b) O emissor autorizado (MINTER_ROLE) aciona a funcao apos verificacao de que o ativo real esta custodiado, o investidor esta verificado (KYC) e o limite da emissao nao foi excedido
c) O preco do ativo subjacente atinge um valor minimo definido no contrato
d) A blockchain atinge um numero especifico de blocos apos o deploy do contrato

**Resposta: b**

**2. Por que a funcao burn em contratos de RWA geralmente opera em duas etapas (request + confirm)?**

a) Porque a blockchain exige duas transacoes separadas para qualquer operacao de destruicao de tokens
b) Porque a queima de tokens precisa estar sincronizada com o pagamento off-chain ao investidor — primeiro os tokens sao bloqueados, depois sao queimados apos confirmacao do pagamento
c) Porque a CVM exige um periodo de espera de 30 dias entre o pedido e a confirmacao de qualquer resgate
d) Porque o padrao ERC-20 nao permite a queima de tokens em uma unica transacao

**Resposta: b**

**3. Qual das seguintes regras NAO e tipicamente implementada no modulo de compliance de um smart contract para CRA tokenizado no Brasil?**

a) Verificacao de whitelist de investidores qualificados a cada transferencia
b) Limite de concentracao maximo por investidor
c) Calculo e recolhimento automatico de IRPF sobre ganho de capital a cada transacao
d) Restricao de jurisdicao bloqueando investidores de paises sancionados

**Resposta: c**

**4. Qual e a funcao do "legal wrapper" (SPV/securitizadora) na arquitetura de tokenizacao de RWA?**

a) Desenvolver e fazer deploy dos smart contracts na blockchain
b) Fornecer feeds de preco de commodities para os oraculos on-chain
c) Ser a entidade juridica que detem o ativo real e confere validade legal ao token, vinculando o registro digital ao direito sobre o ativo subjacente
d) Operar como exchange para negociacao dos tokens no mercado secundario

**Resposta: c**

**5. Em uma operacao de CRA tokenizado com pagamento de resgate via stablecoin BRZ, o vault do smart contract distribui o valor de resgate e queima os tokens em uma unica transacao. Qual e a principal vantagem dessa abordagem em relacao ao resgate tradicional com transferencia bancaria?**

a) O custo de gas na blockchain e menor que a tarifa bancaria de transferencia
b) A stablecoin BRZ tem lastro em ouro, oferecendo protecao contra inflacao
c) Elimina o settlement gap — a entrega dos tokens e o pagamento ocorrem simultaneamente (atomic settlement), sem risco de contraparte e sem espera de D+1 bancario
d) A stablecoin permite que investidores de qualquer pais comprem tokens sem necessidade de KYC

**Resposta: c**

---

## Proxima Aula

Na proxima aula — a ultima deste modulo — vamos sair da teoria e entrar no ambiente de desenvolvimento: estudaremos as ferramentas (Solidity, Hardhat, Foundry), os ambientes de teste (testnets Sepolia, Amoy), o processo de deploy e a estimativa de custos de gas para operacoes de tokenizacao de RWA no agro. Voce vai entender quanto custa, na pratica, colocar um smart contract de CRA tokenizado em producao. Ate la!
