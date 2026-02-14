# Aula 4.2: Auditoria e Certificacao de Smart Contracts para Protocolos RWA

## Abertura

Bem-vindo a aula 4.2 do Modulo 4 — Seguranca, Auditoria e Governanca. Na aula anterior, mapeamos os vetores de ataque especificos de protocolos RWA e as praticas de mitigacao. Agora, vamos aprender como verificar sistematicamente se essas protecoes estao corretamente implementadas por meio de auditoria de smart contracts. A auditoria e o processo mais critico de garantia de qualidade em protocolos blockchain — e, no contexto de tokenizacao de ativos agro no Brasil, ela ganha uma dimensao adicional: nao basta verificar a seguranca do codigo; e preciso validar que o contrato implementa corretamente as regras de negocio do agro (lastro, compliance, limites regulatorios). Nesta aula, cobriremos o processo completo de auditoria, as ferramentas do estado da arte, property-based testing com invariantes especificas de RWA, e como manter a seguranca apos o deploy com bug bounty e monitoramento continuo.

### Programa da aula:

1. Processo de auditoria: escopo, revisao manual e automatizada, relatorio e remediacao
2. Ferramentas de analise: Slither, Mythril, Foundry fuzzing e Certora (verificacao formal)
3. Property-based testing, bug bounty e monitoramento pos-deploy

---

## 1. Processo de Auditoria de Smart Contracts

### 1.1 Fases de uma auditoria profissional

Uma auditoria de smart contracts para protocolos RWA segue um processo estruturado em cinco fases. Cada fase tem objetivos distintos e produz artefatos especificos. O custo de uma auditoria profissional varia de US$ 30.000 a US$ 500.000, dependendo da complexidade do protocolo e da reputacao da firma auditora. Para protocolos de tokenizacao de agro que buscam atrair capital institucional, a auditoria nao e opcional — e pre-requisito.

**Fase 1 — Definicao de escopo**: A equipe do protocolo e a firma auditora definem juntas quais contratos serao auditados, qual a versao do codigo (commit hash especifico no repositorio), quais sao os pressupostos de confianca (quem sao os atores confiaveis — owner, issuer, oracle), e quais sao os invariantes de negocio que devem ser preservados. Para um protocolo de FIAGRO tokenizado, o escopo tipicamente inclui: contrato do token ERC-20 ou ERC-3643 (T-REX), contrato de compliance (whitelist/KYC), contrato do oraculo, contrato de distribuicao de rendimentos, e contratos de proxy/upgrade.

**Fase 2 — Revisao automatizada**: A firma auditora executa ferramentas de analise estatica (Slither, Semgrep), analise simbolica (Mythril, Manticore), fuzzing (Foundry, Echidna) e verificacao formal (Certora, Halmos) sobre o codigo. Essas ferramentas identificam automaticamente categorias conhecidas de vulnerabilidades: reentrancy, overflow/underflow, acesso nao autorizado, delegatecall inseguro, manipulacao de storage, entre outras. A revisao automatizada cobre o "arroz com feijao" da seguranca e libera os auditores humanos para focarem em logica de negocio.

**Fase 3 — Revisao manual**: Auditores experientes analisam o codigo linha por linha, focando em: (a) logica de negocio — o contrato faz o que deveria fazer? (b) controle de acesso — as funcoes criticas estao protegidas adequadamente? (c) interacoes entre contratos — composicao de chamadas pode criar vulnerabilidades? (d) cenarios de fronteira — o que acontece com valores extremos, arrays vazios, enderecos zero? (e) conformidade regulatoria — o contrato implementa corretamente as regras de compliance exigidas pela CVM, Banco Central ou registradoras?

**Fase 4 — Relatorio**: A firma auditora produz um relatorio detalhado classificando cada vulnerabilidade encontrada por severidade:

| Severidade | Descricao | Exemplo em RWA Agro |
|------------|-----------|---------------------|
| Critica | Perda direta de fundos ou tokens | Funcao mint sem controle de acesso |
| Alta | Perda potencial sob condicoes especificas | Oraculo sem validacao de desvio |
| Media | Funcionamento incorreto sem perda direta | Evento nao emitido em transferencia |
| Baixa | Melhoria de boas praticas | Variavel publica desnecessaria |
| Informativa | Sugestao de otimizacao | Gas optimization |

**Fase 5 — Remediacao e re-auditoria**: A equipe do protocolo corrige as vulnerabilidades encontradas, e a firma auditora verifica se as correcoes estao adequadas. E comum que a remediacao introduza novas vulnerabilidades — por isso a re-auditoria e essencial. O processo completo tipicamente leva de 4 a 12 semanas, dependendo da complexidade.

- **Exemplo real**: O protocolo Maple Finance, que faz lending institucional com elementos de RWA, passou por auditorias com Trail of Bits, Sherlock e Code4rena antes de cada major release. O custo total de seguranca (auditorias + bug bounty) superou US$ 1 milhao, mas foi fundamental para atrair mais de US$ 2 bilhoes em volume de emprestimos. Para um protocolo de FIAGRO tokenizado, o investimento em auditoria e proporcional ao valor dos ativos sob gestao.

### 1.2 Escopo especifico para protocolos RWA de agro

Alem das vulnerabilidades genericas de smart contracts, a auditoria de protocolos RWA deve cobrir aspectos especificos:

**Verificacao de lastro**: O contrato garante que `totalSupply <= lastroVerificado`? Existe mecanismo para impedir mintagem alem do lastro? Como o lastro e atualizado on-chain?

**Compliance e KYC/AML**: O contrato implementa corretamente as restricoes de transferencia (whitelist, blacklist, jurisdicao)? Investidores nao verificados conseguem adquirir tokens? O contrato atende os requisitos da CVM para valores mobiliarios?

**Distribuicao de rendimentos**: Os dividendos ou juros sao calculados e distribuidos corretamente? Existe risco de arredondamento que cause perda ou criacao indevida de valor? O snapshot de saldos para distribuicao e imutavel?

**Integracao com oraculo**: O oraculo possui validacoes adequadas (heartbeat, desvio maximo, fallback)? O contrato funciona corretamente se o oraculo ficar offline?

**Mecanismo de resgate**: O processo de resgate (burn de token + pagamento em fiat ou stablecoin) funciona corretamente? Existe risco de race condition entre resgate e distribuicao de rendimento?

```solidity
// EXEMPLO: Checklist de auditoria para contrato de token RWA agro
// O auditor deve verificar cada um destes pontos:

// 1. LASTRO
// [x] totalSupply nunca excede lastroVerificado
// [x] Apenas trusted issuer pode mintar
// [x] Mintagem requer prova de lastro (hash de documento ou atestacao de oraculo)

// 2. COMPLIANCE
// [x] Transferencias bloqueadas para enderecos nao-KYC
// [x] Blacklist funciona para enderecos sancionados
// [x] Limite de concentracao por investidor (max 20% do supply)

// 3. ORACULO
// [x] Heartbeat check: rejeita preco se ultima atualizacao > 24h
// [x] Desvio maximo: rejeita variacao > 15% em uma atualizacao
// [x] Fallback: usa ultimo preco valido se oraculo falhar

// 4. RENDIMENTOS
// [x] Snapshot imutavel de saldos no bloco de corte
// [x] Distribuicao proporcional sem perda por arredondamento
// [x] Claim individual (pull pattern) ao inves de push

// 5. EMERGENCIA
// [x] Pause mechanism funcional
// [x] Rate limiting ativo
// [x] Timelock em funcoes administrativas
```

### 1.3 Principais firmas de auditoria e custo

As firmas de auditoria mais respeitadas no ecossistema Web3, com experiencia em protocolos RWA, incluem:

- **Trail of Bits**: Considerada a firma mais rigorosa. Custo: US$ 50.000-300.000. Prazo: 6-12 semanas.
- **OpenZeppelin**: Criadores da biblioteca de contratos mais usada. Custo: US$ 50.000-250.000. Prazo: 4-10 semanas.
- **Consensys Diligence**: Foco em ecossistema Ethereum. Custo: US$ 40.000-200.000.
- **Sherlock**: Plataforma de auditoria competitiva com seguro. Custo variavel.
- **Code4rena**: Auditoria por competicao publica. Custo: US$ 30.000-150.000 em premios.
- **Certora**: Especializada em verificacao formal. Custo: US$ 80.000-400.000.

Para protocolos brasileiros de tokenizacao de agro, a recomendacao e combinar pelo menos duas abordagens: uma auditoria privada com firma estabelecida (Trail of Bits, OpenZeppelin) e uma auditoria competitiva (Code4rena, Sherlock) para maximizar a cobertura.

---

## 2. Ferramentas de Analise de Seguranca

### 2.1 Slither — Analise Estatica

Slither e a ferramenta de analise estatica mais utilizada no ecossistema Ethereum, desenvolvida pela Trail of Bits. Ela analisa o codigo Solidity sem executa-lo, identificando padroes conhecidos de vulnerabilidade em segundos. Slither detecta mais de 90 categorias de problemas, incluindo: reentrancy, variaveis nao utilizadas, funcoes que deveriam ser view/pure, delegatecall para endereco arbitrario, e shadow variables.

```bash
# Instalacao do Slither
pip3 install slither-analyzer

# Executar Slither em um projeto Foundry
slither . --foundry-compile-all

# Executar Slither em um contrato especifico
slither src/TokenRWA.sol --solc-remaps "@openzeppelin/=lib/openzeppelin-contracts/"

# Gerar relatorio em formato JSON
slither . --json output.json

# Executar apenas detectores de alta severidade
slither . --detect reentrancy-eth,reentrancy-no-eth,arbitrary-send-eth,controlled-delegatecall
```

**Saida tipica do Slither para um contrato RWA vulneravel:**

```
TokenRWA.mint(address,uint256) (src/TokenRWA.sol#45-48) has no access control
    - Anyone can call mint() and create tokens without authorization
    Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#missing-access-control

TokenRWA.updateOracle(address) (src/TokenRWA.sol#52-54) uses a dangerous delegatecall
    - The oracle address can be changed to a malicious contract
    Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#controlled-delegatecall
```

- **Exemplo pratico**: Ao rodar Slither em um contrato de token de CRA tokenizado, o auditor descobre que a funcao `distribuirRendimentos()` pode ser chamada por qualquer endereco, nao apenas pelo administrador. Embora a funcao em si nao transfira fundos diretamente (ela apenas calcula os rendimentos devidos), um atacante poderia chama-la repetidamente com parametros manipulados para distorcer o calculo de distribuicao. Slither identifica esse problema como "missing access control" em menos de 5 segundos.

### 2.2 Mythril — Analise Simbolica

Mythril utiliza execucao simbolica para explorar todos os caminhos possiveis de execucao do smart contract, buscando estados que violem propriedades de seguranca. Diferentemente do Slither (que analisa o codigo estaticamente), o Mythril simula a execucao do contrato com inputs simbolicos, encontrando vulnerabilidades que dependem de sequencias especificas de transacoes.

```bash
# Instalacao do Mythril
pip3 install mythril

# Analise basica de um contrato
myth analyze src/TokenRWA.sol --solc-json mythril.config.json

# Analise profunda (mais tempo, mais cobertura)
myth analyze src/TokenRWA.sol --execution-timeout 300 --max-depth 50

# Analise focada em vulnerabilidades especificas
myth analyze src/TokenRWA.sol --modules ether_thief,suicide,delegatecall
```

**Mythril e especialmente util para detectar**:
- Caminhos de execucao que permitem drenar fundos
- Integer overflow/underflow em calculos de rendimento
- Condicoes que permitem bypass de controles de acesso
- Sequencias de transacoes que levam a estados inconsistentes

### 2.3 Foundry Fuzzing — Testes de Fuzzing

Foundry e o framework de desenvolvimento e teste mais moderno para smart contracts Solidity. Seu motor de fuzzing gera automaticamente milhares de inputs aleatorios para testar funcoes, buscando inputs que violem assertions. Para protocolos RWA, o fuzzing e especialmente valioso para testar invariantes de negocio.

```solidity
// EXEMPLO: Fuzzing de invariante de lastro com Foundry
// Arquivo: test/TokenRWA.invariant.t.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/TokenRWA.sol";

contract TokenRWAInvariantTest is Test {
    TokenRWA public token;
    address public issuer = address(1);
    address public oracle = address(2);

    function setUp() public {
        token = new TokenRWA(issuer, oracle);
        // Configurar lastro inicial de 1 milhao de tokens
        vm.prank(oracle);
        token.atualizarLastro(1_000_000 * 1e18);
    }

    // INVARIANTE 1: totalSupply nunca deve exceder o lastro verificado
    function invariant_supplyNuncaExcedeLastro() public view {
        assertLe(
            token.totalSupply(),
            token.lastroVerificado(),
            "INVARIANTE VIOLADA: totalSupply > lastroVerificado"
        );
    }

    // INVARIANTE 2: soma de todos os saldos deve ser igual ao totalSupply
    function invariant_somaDosSaldosIgualSupply() public view {
        // Esta invariante e implementada pelo proprio ERC-20
        // mas vale verificar em contratos customizados
        assertEq(
            token.totalSupply(),
            token.somaDeTodosOsSaldos(),
            "INVARIANTE VIOLADA: soma dos saldos != totalSupply"
        );
    }

    // TESTE FUZZ: mintagem com valores aleatorios nunca deve exceder lastro
    function testFuzz_mintNaoExcedeLastro(uint256 amount) public {
        vm.assume(amount > 0 && amount < type(uint128).max);
        vm.prank(issuer);

        if (token.totalSupply() + amount > token.lastroVerificado()) {
            vm.expectRevert("Excede lastro verificado");
        }
        token.mint(address(3), amount);

        assertLe(token.totalSupply(), token.lastroVerificado());
    }

    // TESTE FUZZ: transferencia entre enderecos KYC deve funcionar
    function testFuzz_transferenciaEntreKYC(uint256 amount) public {
        address alice = address(10);
        address bob = address(11);

        // Setup: KYC aprovado para ambos
        token.aprovarKYC(alice);
        token.aprovarKYC(bob);

        // Mint para Alice
        uint256 mintAmount = bound(amount, 1, token.lastroVerificado());
        vm.prank(issuer);
        token.mint(alice, mintAmount);

        // Transferencia de Alice para Bob
        uint256 transferAmount = bound(amount, 1, mintAmount);
        vm.prank(alice);
        token.transfer(bob, transferAmount);

        assertEq(token.balanceOf(alice), mintAmount - transferAmount);
        assertEq(token.balanceOf(bob), transferAmount);
    }
}
```

```bash
# Executar testes de fuzzing com Foundry
forge test --match-test testFuzz -vvv

# Executar testes de invariantes
forge test --match-test invariant -vvv

# Configurar numero de runs de fuzzing (padrao: 256)
forge test --match-test testFuzz --fuzz-runs 10000 -vvv

# Executar com seed especifica para reprodutibilidade
forge test --match-test testFuzz --fuzz-seed 42 -vvv
```

- **Exemplo pratico**: Ao rodar fuzzing com 10.000 runs na funcao de distribuicao de rendimentos de um token de FIAGRO, o Foundry descobre que, quando o numero de holders e exatamente 1 e o rendimento a distribuir e um numero primo muito grande, ocorre um erro de arredondamento que cria 1 wei a mais do que o rendimento real. Em um contrato com milhares de distribuicoes ao longo de anos, esse erro poderia acumular uma discrepancia significativa entre o lastro e os tokens em circulacao.

### 2.4 Certora — Verificacao Formal

Certora e a ferramenta mais avancada de verificacao de smart contracts, utilizando provas matematicas (verificacao formal) para garantir que propriedades criticas nunca serao violadas, independentemente dos inputs. Enquanto o fuzzing testa milhares de cenarios aleatorios, a verificacao formal prova matematicamente que a propriedade e verdadeira para TODOS os cenarios possiveis.

```
// EXEMPLO: Especificacao Certora para token RWA de agro
// Arquivo: specs/TokenRWA.spec

// Regra 1: totalSupply nunca excede lastro verificado
rule supplyNuncaExcedeLastro(method f, env e, calldataarg args) {
    require totalSupply() <= lastroVerificado();

    f(e, args); // executa qualquer funcao do contrato

    assert totalSupply() <= lastroVerificado(),
        "totalSupply excedeu lastro apos chamar funcao";
}

// Regra 2: apenas issuer pode mintar
rule apenasissuerMinta(env e, address to, uint256 amount) {
    mint(e, to, amount);

    assert e.msg.sender == issuer(),
        "Alguem diferente do issuer conseguiu mintar";
}

// Regra 3: transferencias so ocorrem entre enderecos KYC
rule transferenciaSomenteEntreKYC(env e, address to, uint256 amount) {
    require isKYCApproved(e.msg.sender);
    require isKYCApproved(to);

    transfer(e, to, amount);

    assert balanceOf(to) >= amount,
        "Transferencia falhou entre enderecos KYC validos";
}

// Regra 4: burn reduz totalSupply corretamente
rule burnReduzSupply(env e, uint256 amount) {
    uint256 supplyAntes = totalSupply();

    burn(e, amount);

    assert totalSupply() == supplyAntes - amount,
        "Burn nao reduziu totalSupply corretamente";
}

// Regra 5: pause bloqueia todas as transferencias
rule pauseBloqueiaTransferencias(env e, address to, uint256 amount) {
    require paused() == true;

    transfer@withrevert(e, to, amount);

    assert lastReverted,
        "Transferencia nao foi bloqueada durante pause";
}
```

```bash
# Executar verificacao formal com Certora
certoraRun src/TokenRWA.sol --verify TokenRWA:specs/TokenRWA.spec \
    --solc solc8.20 \
    --optimistic_loop \
    --loop_iter 3 \
    --msg "Auditoria TokenRWA FIAGRO v1.0"
```

- **Exemplo pratico**: Usando Certora, o auditor prova formalmente que, em um contrato de token de CRA tokenizado, a invariante `totalSupply <= lastroVerificado` e preservada por TODAS as funcoes do contrato (mint, burn, transfer, distribuirRendimentos, pause, unpause). Se qualquer funcao pudesse violar essa invariante, o Certora encontraria um contra-exemplo e reportaria a violacao. Essa prova matematica oferece um nivel de garantia impossivel de atingir com testes ou fuzzing sozinhos.

---

## 3. Property-Based Testing, Bug Bounty e Monitoramento Pos-Deploy

### 3.1 Property-Based Testing: invariantes especificas de RWA

Property-based testing e uma abordagem de teste onde, em vez de definir inputs e outputs especificos (testes unitarios), o desenvolvedor define propriedades (invariantes) que devem ser verdadeiras para qualquer input. Para protocolos RWA de agro, as invariantes criticas incluem:

**Invariantes de lastro**:
- `totalSupply <= lastroVerificado` — nunca pode haver mais tokens do que lastro
- `lastroVerificado >= 0` — lastro nao pode ser negativo
- `sum(pendingRedemptions) <= totalSupply` — resgates pendentes nao excedem o supply

**Invariantes de compliance**:
- `forall holder: isKYCApproved(holder) || balanceOf(holder) == 0` — nenhum holder sem KYC tem saldo
- `forall transfer: isKYCApproved(from) && isKYCApproved(to)` — toda transferencia e entre enderecos KYC
- `balanceOf(blacklisted) == 0` — enderecos na blacklist sempre tem saldo zero

**Invariantes de rendimento**:
- `sum(claimed) + sum(unclaimed) == totalDistributed` — rendimentos distribuidos sao consistentes
- `forall holder: claimable(holder) == (balance(holder) * rewardPerToken) - claimed(holder)` — calculo proporcional correto

**Invariantes de oraculo**:
- `block.timestamp - lastOracleUpdate <= HEARTBEAT` — oraculo esta atualizado
- `abs(newPrice - oldPrice) / oldPrice <= MAX_DEVIATION` — variacao dentro do limite

```solidity
// EXEMPLO: Suite completa de invariantes para protocolo RWA de agro
contract InvariantSuite is Test {
    TokenRWA token;
    OracleRWA oracle;
    ComplianceModule compliance;

    // Invariante principal: integridade do lastro
    function invariant_integridadeDoLastro() public view {
        assertTrue(
            token.totalSupply() <= oracle.lastroVerificado(),
            "CRITICO: tokens em circulacao excedem lastro real"
        );
    }

    // Invariante: nenhum holder sem KYC
    function invariant_complianceKYC() public view {
        address[] memory holders = token.getHolders();
        for (uint i = 0; i < holders.length; i++) {
            if (token.balanceOf(holders[i]) > 0) {
                assertTrue(
                    compliance.isVerified(holders[i]),
                    "CRITICO: holder sem KYC possui tokens"
                );
            }
        }
    }

    // Invariante: oraculo atualizado
    function invariant_oraculeAtualizado() public view {
        assertTrue(
            block.timestamp - oracle.ultimaAtualizacao() <= oracle.HEARTBEAT(),
            "ALERTA: oraculo desatualizado"
        );
    }

    // Invariante: rate limiting respeitado
    function invariant_rateLimiting() public view {
        assertTrue(
            token.mintadoHoje() <= token.LIMITE_DIARIO(),
            "CRITICO: rate limiting violado"
        );
    }
}
```

### 3.2 Programa de Bug Bounty

Apos a auditoria formal, o programa de bug bounty e a proxima camada de defesa. Ele oferece recompensas financeiras a pesquisadores de seguranca independentes que encontrem vulnerabilidades no protocolo ja em producao. As plataformas mais utilizadas sao Immunefi, HackerOne e Bugcrowd.

**Estrutura recomendada de bug bounty para protocolo RWA de agro:**

| Severidade | Descricao | Recompensa Sugerida |
|------------|-----------|---------------------|
| Critica | Perda direta de fundos ou mintagem sem lastro | US$ 50.000 - 500.000 |
| Alta | Bypass de compliance, manipulacao de oraculo | US$ 10.000 - 50.000 |
| Media | Logica de negocio incorreta sem perda direta | US$ 2.000 - 10.000 |
| Baixa | Melhoria de seguranca, gas optimization | US$ 500 - 2.000 |

**Regras essenciais do programa:**
- Escopo claramente definido (quais contratos, quais chains)
- Safe harbor: pesquisadores nao serao processados por testes de boa-fe
- Tempo de resposta maximo: 48 horas para triagem, 7 dias para avaliacao
- Recompensa proporcional ao impacto real, nao ao impacto teorico
- Restricoes: ataques em mainnet nao sao permitidos; apenas testnet ou fork local

- **Exemplo real**: O protocolo MakerDAO, referencia em DeFi e com crescente exposicao a RWA (incluindo titulos do Tesouro americano e credito estruturado), manteve programa de bug bounty na Immunefi com recompensas de ate US$ 10 milhoes para vulnerabilidades criticas. Esse nivel de investimento em seguranca e proporcional aos mais de US$ 8 bilhoes em valor total travado (TVL) no protocolo.

### 3.3 Monitoramento Pos-Deploy

A seguranca de um protocolo nao termina com a auditoria e o bug bounty. Monitoramento continuo em tempo real e essencial para detectar e reagir a ameaças apos o deploy. As principais ferramentas e praticas incluem:

**OpenZeppelin Defender**: Plataforma que permite configurar monitors (alertas), relayers (transacoes automatizadas) e actions (respostas automaticas). Para um protocolo RWA de agro, os monitors recomendados sao:

- Alerta quando `totalSupply` se aproxima de 90% do `lastroVerificado`
- Alerta quando uma unica transacao de mint excede 10% do supply
- Alerta quando um endereco nao-whitelisted tenta transferir tokens
- Alerta quando o oraculo nao e atualizado dentro do heartbeat
- Alerta quando a funcao `pause` e chamada

**Forta Network**: Rede descentralizada de bots de deteccao que monitoram transacoes em tempo real. Bots customizados podem ser escritos para detectar padroes especificos de ataque.

**Tenderly**: Plataforma de monitoramento e debugging que permite simular transacoes, configurar alertas e analisar traces de execucao. Util para entender o que aconteceu apos um incidente.

```javascript
// EXEMPLO: Configuracao de monitor no OpenZeppelin Defender
// Monitor: Alerta de mintagem anomala em token RWA

const { Defender } = require('@openzeppelin/defender-sdk');

const client = new Defender({
  apiKey: process.env.DEFENDER_API_KEY,
  apiSecret: process.env.DEFENDER_API_SECRET,
});

// Criar monitor para eventos de Mint anomalos
const monitor = await client.monitor.create({
  type: 'BLOCK',
  name: 'Mintagem Anomala - Token FIAGRO',
  network: 'mainnet',
  addresses: ['0x...TokenRWA'],
  abi: TokenRWA_ABI,
  eventConditions: [
    {
      eventSignature: 'Transfer(address,address,uint256)',
      expression: 'from == "0x0000000000000000000000000000000000000000" AND value > 100000e18'
    }
  ],
  alertThreshold: {
    amount: 1,
    windowSeconds: 3600 // 1 hora
  },
  notificationChannels: ['email-security-team', 'slack-alerts', 'pagerduty-oncall']
});

// Criar action automatica: pausar contrato se mintagem exceder limite
const action = await client.action.create({
  name: 'Auto-Pause em Mintagem Excessiva',
  trigger: { monitorId: monitor.monitorId },
  relayerId: 'relay-emergency',
  code: `
    const { ethers } = require('ethers');
    exports.handler = async function(event) {
      const token = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
      // Verificar se mintagem do dia excede 50% do limite
      const mintadoHoje = await token.mintadoHoje();
      const limite = await token.LIMITE_DIARIO();
      if (mintadoHoje > limite / 2n) {
        await token.pausar();
        console.log('CONTRATO PAUSADO: mintagem anomala detectada');
      }
    }
  `
});
```

### 3.4 Ciclo completo de seguranca pos-deploy

O ciclo de seguranca pos-deploy para um protocolo RWA de agro deve seguir este fluxo continuo:

1. **Deploy em mainnet** apos auditoria completa e re-auditoria de correcoes
2. **Lancamento de bug bounty** na Immunefi ou plataforma equivalente
3. **Ativacao de monitoramento** via OpenZeppelin Defender, Forta e Tenderly
4. **Revisao semanal** de alertas e metricas de seguranca pela equipe tecnica
5. **Auditoria periodica** (a cada 6 meses ou a cada major upgrade)
6. **Simulacao de incidentes** (war games) trimestralmente para testar procedimentos de resposta
7. **Atualizacao do threat model** conforme novos vetores de ataque sao descobertos no ecossistema

- **Exemplo pratico**: O protocolo Centrifuge, referencia em tokenizacao de RWA, manteve ciclo continuo de seguranca que inclui: auditorias com Trail of Bits e SRLabs, bug bounty ativo na Immunefi, monitoramento via Forta, e war games trimestrais onde a equipe simula cenarios de ataque (comprometimento de chave, manipulacao de oraculo, bridge exploit) e pratica os procedimentos de resposta. Essa disciplina operacional e o que separa protocolos profissionais de protocolos amadores.

---

## Conclusao

Nesta aula, percorremos o ciclo completo de auditoria e certificacao de smart contracts para protocolos RWA no agronegocio. Aprendemos que a auditoria profissional segue cinco fases estruturadas — do escopo a remediacao — e que protocolos RWA exigem verificacao de aspectos especificos como lastro, compliance e integracao com oraculo. Dominamos as quatro ferramentas essenciais do auditor moderno: Slither para analise estatica rapida, Mythril para analise simbolica profunda, Foundry para fuzzing de invariantes, e Certora para verificacao formal matematica. Aprendemos a escrever invariantes especificas de RWA — como `totalSupply <= lastro` — e a testa-las com property-based testing. Finalmente, entendemos que a seguranca nao termina no deploy: bug bounty, monitoramento continuo e simulacao de incidentes sao praticas essenciais para protocolos que gerenciam ativos reais do agronegocio brasileiro. Na proxima aula, veremos como estruturar a governanca desses protocolos para garantir operacao segura e descentralizacao progressiva.

---

## Licao de Casa

1. Instale o Slither e execute-o em um dos contratos de exemplo do OpenZeppelin (por exemplo, ERC20Votes ou AccessControl). Analise o relatorio gerado, classifique cada finding por severidade e escreva uma recomendacao de correcao para cada um. Documente o processo em um relatorio de auditoria simplificado.

2. Escreva uma suite de testes de invariantes usando Foundry para um contrato de token RWA que voce mesmo crie. O contrato deve ter: funcao mint protegida por role, funcao burn, funcao de atualizacao de lastro, e funcao pause. As invariantes devem incluir: (a) totalSupply <= lastroVerificado, (b) nenhum holder sem KYC possui saldo, (c) contrato pausado bloqueia todas as transferencias. Execute com pelo menos 5.000 runs de fuzzing.

3. Projete um programa de bug bounty completo para um protocolo hipotetico de tokenizacao de FIAGRO. Defina: escopo (quais contratos, quais chains), tabela de recompensas por severidade, regras de participacao, criterios de classificacao, tempo de resposta, e safe harbor. Use como referencia os programas de bug bounty de Aave, Compound ou MakerDAO na Immunefi.

---

## Questionario

**1. Qual das seguintes ferramentas utiliza execucao simbolica para explorar todos os caminhos possiveis de um smart contract?**

a) Slither
b) Mythril
c) Solhint
d) Prettier

**Resposta: b**

**2. Em um protocolo de FIAGRO tokenizado, qual invariante e a MAIS CRITICA para garantir que nao existam tokens sem lastro?**

a) `totalSupply == lastroVerificado` (supply sempre igual ao lastro)
b) `totalSupply <= lastroVerificado` (supply nunca excede o lastro)
c) `totalSupply >= lastroVerificado` (supply sempre maior ou igual ao lastro)
d) `totalSupply != 0` (supply nunca e zero)

**Resposta: b**

**3. Uma auditoria de smart contract identificou uma vulnerabilidade classificada como "Critica" em um contrato de token de CRA. Qual das seguintes descricoes MELHOR se encaixa nessa classificacao?**

a) Uma variavel publica que deveria ser private, expondo informacao interna do contrato
b) Uma funcao mint sem controle de acesso que permite qualquer endereco criar tokens sem lastro
c) Um evento que nao e emitido ao atualizar o preco no oraculo, dificultando a indexacao
d) Uma otimizacao de gas que reduziria o custo de transferencias em 15%

**Resposta: b**

**4. Qual e a principal vantagem da verificacao formal (Certora) sobre o fuzzing (Foundry) na auditoria de protocolos RWA?**

a) A verificacao formal e mais rapida e consome menos recursos computacionais
b) A verificacao formal prova matematicamente que uma propriedade e verdadeira para TODOS os inputs possiveis, enquanto o fuzzing testa apenas um subconjunto aleatorio
c) A verificacao formal detecta mais vulnerabilidades de gas optimization
d) A verificacao formal nao requer especificacao de propriedades pelo auditor

**Resposta: b**

**5. Um protocolo de tokenizacao de soja implementa monitoramento pos-deploy com OpenZeppelin Defender. O monitor detecta que, em um periodo de 1 hora, foram executadas 15 transacoes de mint totalizando 800.000 tokens, enquanto o limite diario e de 1.000.000 tokens. O que o sistema de monitoramento deve fazer, e por que essa situacao e preocupante mesmo estando dentro do limite diario?**

a) Nada, pois a mintagem esta dentro do limite diario e nao ha anomalia
b) Emitir alerta e considerar pausa preventiva, pois a concentracao de 80% do limite diario em apenas 1 hora indica possivel comprometimento de chave do issuer ou comportamento anomalo que requer investigacao imediata
c) Pausar o contrato imediatamente e revogar todas as chaves de issuer sem investigacao
d) Aumentar o limite diario automaticamente para acomodar a demanda

**Resposta: b**

---

## Proxima Aula

Na proxima aula (4.3), vamos explorar a governanca de protocolos RWA — como estruturar um modelo hibrido que combine a eficiencia da gestao centralizada com a transparencia da governanca descentralizada. Veremos RBAC (Role-Based Access Control) com roles especificos para Owner, Agent, ComplianceOfficer e OracleUpdater, timelocks e multisig em profundidade, governanca DAO aplicada a FIAGRO com votacao por cotas, e procedimentos de emergencia para cenarios de crise. Ate la!
