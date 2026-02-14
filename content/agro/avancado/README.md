# Curso: Web3 e Tokenizacao de Real World Assets (RWA) no Agronegocio — Fundamentos e Implementacao

## Informacoes gerais

- **Nivel**: Avancado
- **Pre-requisitos**: Conclusao do Curso 2 (Estruturacao e Mercado Avancado) ou conhecimento equivalente sobre CPR, CRA, securitizacao, waterfall, subordinacao, credit enhancement e Lei do Agro. Nocoes basicas de blockchain (wallets, transacoes, smart contracts) e familiaridade com programacao em Solidity sao recomendadas.
- **Publico-alvo**: Profissionais de tokenizadoras, securitizadoras, gestoras de ativos, mesas de credito agro, bancos, cooperativas, estruturadores financeiros, analistas de risco, arquitetos de solucoes Web3 e desenvolvedores blockchain que desejam dominar a tokenizacao de ativos reais do agronegocio (RWAs).
- **Objetivo geral**: Capacitar o aluno a compreender, projetar e implementar estruturas basicas de tokenizacao de RWAs agro (CPR, CRA, CDA/WA, estoques) utilizando padroes EIP/ERC reconhecidos pelo mercado, integrando oraculos e selecionando a infraestrutura blockchain adequada.

---

## Modulo 1 — Fundamentos de RWA e Web3 no Agronegocio

**Objetivo do modulo**: Entender o conceito de Real World Assets (RWA), seu potencial e limitacoes no agro brasileiro, e mapear o ecossistema atual.

### Aula 1.1 — O que RWA resolve (e o que nao resolve) no agro

- **Objetivo**: Definir tokenizacao de forma tecnica e identificar beneficios e limitacoes concretas.
- **Conteudo**:
  - Definicao tecnica de tokenizacao: representacao digital de direitos sobre ativos reais em registro distribuido
  - Diferenca entre digitalizacao (PDF) e tokenizacao (ativo programavel)
  - Beneficios concretos: fracionamento, liquidez secundaria 24/7, rastreabilidade on-chain, acesso global a capital, automacao via smart contracts, reducao de intermediarios
  - Limitacoes: riscos off-chain persistem (climatico, inadimplencia, custodia fisica, oraculos)

### Aula 1.2 — Mercado global de RWA vs. realidade brasileira

- **Objetivo**: Contextualizar o mercado global de RWA e posicionar o agro brasileiro nesse cenario.
- **Conteudo**:
  - Tamanho e crescimento: US$ 28 bi em 2025, projecao de US$ 16 tri ate 2030
  - Principais protocolos globais: Centrifuge, Ondo, BlackRock BUILD, Maple
  - Posicionamento do agro brasileiro: commodities fungiveis, recebiveis de safra, terras como ativos ideais
  - Casos reais no Brasil: Agrotoken, token de credito rural do BV, emissoes via Res. CVM 88/160, tokenizacao de CDA/WA

### Aula 1.3 — Regulamentacao brasileira atualizada

- **Objetivo**: Mapear o arcabouco regulatorio brasileiro para tokenizacao de ativos agro.
- **Conteudo**:
  - CVM: Resolucoes 88 (crowdfunding tokenizado), 160, Parecer 40/2022, agenda regulatoria 2026
  - Banco Central: Resolucoes 519-521/2025 (autorizacao de VASPs a partir de fev/2026)
  - Lei do Agro e integracao com registro de CPR
  - DREX: atacado, varejo e titulos publicos; DvP atomico

---

## Modulo 2 — Padroes de Tokenizacao Basicos: ERC-20, ERC-721 e ERC-1155

**Objetivo do modulo**: Dominar os padroes fundamentais para representar ativos fungiveis, nao-fungiveis e hibridos no agro.

### Aula 2.1 — ERC-20: Tokens fungiveis

- **Objetivo**: Compreender o padrao ERC-20 e suas aplicacoes no agro.
- **Conteudo**:
  - Padrao basico: transfer, approve, balanceOf, totalSupply
  - Aplicacao agro: tokenizacao de CPR financeira, cotas de CRA fracionadas, stablecoins (BRL tokenizado, USDC)
  - Eventos para auditoria on-chain

### Aula 2.2 — ERC-721: Tokens nao-fungiveis (NFTs)

- **Objetivo**: Dominar a representacao de ativos unicos no agro.
- **Conteudo**:
  - Representacao de ativos unicos: ownerOf, safeTransferFrom
  - Uso agro: CDA especifica, titulo de terra, CPR fisica com lastro singular
  - Metadados: tokenURI para documentos legais (qualidade, prazo, geolocalizacao)

### Aula 2.3 — ERC-1155: Multi-token (semi-fungivel)

- **Objetivo**: Entender a eficiencia do padrao multi-token e suas aplicacoes.
- **Conteudo**:
  - Eficiencia gas para multiplos tokens em um contrato
  - Aplicacao: batches de estoques, tranches de CRA
  - Distincao entre fungivel e nao-fungivel no mesmo contrato

---

## Modulo 3 — Arquitetura de uma Solucao RWA e Smart Contracts

**Objetivo do modulo**: Compreender as camadas tecnicas envolvidas em uma plataforma de tokenizacao e os componentes de um smart contract.

### Aula 3.1 — A pilha tecnologica (The RWA Stack)

- **Objetivo**: Mapear as cinco camadas de uma solucao RWA completa.
- **Conteudo**:
  - Camada 1 — Blockchain base: Ethereum, L2s, alternativas
  - Camada 2 — Smart contracts core: token, compliance, identidade, vault
  - Camada 3 — Oraculos e feeds de dados
  - Camada 4 — Off-chain services: KYC/AML, registradoras, custodiantes
  - Camada 5 — Interface e distribuicao

### Aula 3.2 — Componentes de um smart contract para RWA

- **Objetivo**: Entender a estrutura interna de um contrato de tokenizacao.
- **Conteudo**:
  - Estrutura basica: mint, burn, transfer com restricoes
  - Papel do SPV/securitizadora: legal wrapper
  - Fluxo de mint/redeem: ativo off-chain → verificacao → emissao on-chain

### Aula 3.3 — Ferramentas de desenvolvimento e deploy

- **Objetivo**: Configurar o ambiente de desenvolvimento e realizar deploys.
- **Conteudo**:
  - Solidity, Hardhat, Foundry/Truffle
  - Ambientes: testnets (Sepolia, Mumbai), mainnet
  - Estimativa de custos de gas

---

## Modulo 4 — Oraculos e Integracao Off-Chain

**Objetivo do modulo**: Conectar o mundo on-chain a dados externos confiaveis (precos, reservas, clima).

### Aula 4.1 — Oraculos de preco e dados

- **Objetivo**: Compreender o papel dos oraculos e integrar price feeds.
- **Conteudo**:
  - Importancia dos oraculos para RWA
  - Price feeds: Chainlink, Pyth para commodities (soja B3, CBOT)
  - Riscos: centralizacao, stale data; mitigacao com multiplas fontes

### Aula 4.2 — Proof of Reserve (PoR) para commodities e estoques

- **Objetivo**: Garantir a correspondencia entre tokens e ativos fisicos.
- **Conteudo**:
  - Desafio da dupla posse (vender token e grao fisico)
  - Tecnologias: IoT em silos, imagens de satelite, auditoria em tempo real
  - Chainlink Proof of Reserve: conexao com API do armazem para mint/burn automatico

### Aula 4.3 — Oraculos climaticos e agronomicos

- **Objetivo**: Integrar dados de safra e clima em smart contracts.
- **Conteudo**:
  - Dados de safra: ZARC, indice de precipitacao, NDVI
  - Uso em seguros parametricos e covenants
  - Arquitetura de oraculo customizado para dados nao publicos

---

## Modulo 5 — Implementacao Pratica Basica: Tokenizacao de CPR e CRA

**Objetivo do modulo**: Colocar em pratica os conceitos com exemplos simples de tokenizacao.

### Aula 5.1 — Tokenizacao de CPR com ERC-20

- **Objetivo**: Implementar um contrato de tokenizacao de CPR do zero.
- **Conteudo**:
  - Passo a passo: originador → SPV → contrato ERC-20 → distribuicao
  - Integracao com oraculo de preco
  - Testes basicos e deploy em testnet

### Aula 5.2 — Tokenizacao de CRA com ERC-1155 (tranches)

- **Objetivo**: Representar tranches de CRA em smart contract.
- **Conteudo**:
  - Representacao de tranches senior e subordinada no mesmo contrato
  - Uso de metadados para diferenciar classes
  - Simulacao de distribuicao de rendimentos

### Aula 5.3 — Exercicios integradores

- **Objetivo**: Integrar todos os conceitos em um case pratico.
- **Conteudo**:
  - Case: cooperativa quer tokenizar recebiveis de 10 produtores
  - Escolher padroes, oraculos e arquitetura
  - Apresentar solucao integrada

---

## Modulo 6 — Infraestrutura Blockchain: Escolha da Rede

**Objetivo do modulo**: Comparar blockchains e selecionar a mais adequada para cada operacao agro.

### Aula 6.1 — Ethereum e Layer-2s

- **Objetivo**: Avaliar Ethereum e suas L2s para operacoes RWA agro.
- **Conteudo**:
  - Vantagens: seguranca, liquidez, ecossistema DeFi
  - L2s recomendadas: Polygon, Arbitrum, Base
  - Custos reais de deployment e manutencao

### Aula 6.2 — Alternativas de alta performance: Solana e XRPL

- **Objetivo**: Explorar alternativas de alto throughput.
- **Conteudo**:
  - Solana: alta TPS, custo quase zero, ideal para microtransacoes
  - XRPL: caso real de tokenizacao de CRA no Brasil (US$ 130M)

### Aula 6.3 — Protocolos especializados e permissioned

- **Objetivo**: Comparar blockchains publicas e permissioned para diferentes cenarios.
- **Conteudo**:
  - Centrifuge (private credit), Hedera, Avalanche subnets
  - Permissioned ledgers vs. blockchains publicas: quando usar cada uma
  - Decisao final: escolher a stack completa para uma emissao de R$ 50 milhoes

---

## Consideracoes finais

Ao concluir este curso, o aluno sera capaz de:

- Classificar e selecionar o padrao de token mais adequado (ERC-20, 721, 1155) para cada tipo de ativo agro
- Projetar a stack tecnica basica de uma operacao RWA: blockchain, smart contracts, oraculos
- Implementar tokens basicos para CPR e CRA com integracao de oraculos
- Comparar blockchains e selecionar a infraestrutura adequada para cada operacao
- Compreender o arcabouco regulatorio brasileiro para tokenizacao de ativos agro
