import type { Course } from '@/types'

export const COURSES: Record<string, Course> = {
  'financeiro-agro-fundamentos': {
    id: 'financeiro-agro-fundamentos',
    contentDir: 'curso-01',
    title: 'Sistema Financeiro do Agronegócio Brasileiro',
    subtitle: 'Fundamentos',
    level: 'Introdutório',
    description: 'Visão completa do sistema de financiamento do agronegócio brasileiro — bases institucionais, instrumentos financeiros, gestão de risco e tendências de mercado.',
    image: '/images/courses/curso-01.svg',
    modules: [
      {
        id: 'modulo-01',
        title: 'O Agronegócio na Economia Brasileira',
        objective: 'Compreender o peso do agronegócio na economia nacional e as razões estruturais que tornam o crédito rural indispensável.',
        lessons: [
          { id: 'aula-01', title: 'Dimensão econômica do agronegócio', number: '1.1' },
          { id: 'aula-02', title: 'Por que o agro precisa de crédito estruturado', number: '1.2' },
          { id: 'aula-03', title: 'Origem histórica do crédito rural no Brasil', number: '1.3' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'Estrutura Institucional do Financiamento Agro',
        objective: 'Conhecer os órgãos, entidades e agentes que compõem o sistema de financiamento do agronegócio.',
        lessons: [
          { id: 'aula-01', title: 'Sistema Nacional de Crédito Rural (SNCR)', number: '2.1' },
          { id: 'aula-02', title: 'Agentes financeiros do agro', number: '2.2' },
          { id: 'aula-03', title: 'Plano Safra e programas governamentais', number: '2.3' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Fontes de Financiamento do Agronegócio',
        objective: 'Mapear as três grandes fontes de recursos que financiam o agro brasileiro.',
        lessons: [
          { id: 'aula-01', title: 'Crédito público dirigido', number: '3.1' },
          { id: 'aula-02', title: 'Crédito bancário comercial', number: '3.2' },
          { id: 'aula-03', title: 'Mercado de capitais agro', number: '3.3' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Instrumentos Financeiros do Agro',
        objective: 'Conhecer os principais títulos e instrumentos financeiros do agronegócio.',
        lessons: [
          { id: 'aula-01', title: 'CPR: Cédula de Produto Rural', number: '4.1' },
          { id: 'aula-02', title: 'CRA: Certificado de Recebíveis do Agronegócio', number: '4.2' },
          { id: 'aula-03', title: 'Outros instrumentos: LCA, CDCA, CDA/WA', number: '4.3' },
        ]
      },
      {
        id: 'modulo-05',
        title: 'Ciclo Financeiro e Fluxo de Capital no Agro',
        objective: 'Visualizar como o dinheiro circula no agronegócio, do investidor ao produtor.',
        lessons: [
          { id: 'aula-01', title: 'Fases do ciclo produtivo e financeiro', number: '5.1' },
          { id: 'aula-02', title: 'Fluxo real do capital: do investidor ao produtor', number: '5.2' },
          { id: 'aula-03', title: 'Ecossistema de participantes', number: '5.3' },
        ]
      },
      {
        id: 'modulo-06',
        title: 'Riscos, Tendências e Inovação',
        objective: 'Compreender os riscos do crédito agro, a privatização do funding e a tokenização.',
        lessons: [
          { id: 'aula-01', title: 'Riscos do sistema de crédito agro', number: '6.1' },
          { id: 'aula-02', title: 'Tendência de privatização do funding agro', number: '6.2' },
          { id: 'aula-03', title: 'Introdução à tokenização no agro', number: '6.3' },
        ]
      },
    ]
  },
  'financeiro-agro-avancado': {
    id: 'financeiro-agro-avancado',
    contentDir: 'curso-02',
    title: 'Sistema Financeiro do Agronegócio Brasileiro',
    subtitle: 'Estruturação e Mercado Avançado',
    level: 'Avançado',
    description: 'Aprofundamento em estruturação de crédito agro — securitização, gestão de risco, FIAGRO, funding internacional e tokenização.',
    image: '/images/courses/curso-02.svg',
    modules: [
      {
        id: 'modulo-01',
        title: 'Arquitetura do Funding Agro',
        objective: 'Consolidar a visão macro das três camadas de financiamento.',
        lessons: [
          { id: 'aula-01', title: 'As três camadas de financiamento', number: '1.1' },
          { id: 'aula-02', title: 'Transição estrutural: do público ao privado', number: '1.2' },
          { id: 'aula-03', title: 'Regulação e marcos legais relevantes', number: '1.3' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'CPR: Estruturação Avançada',
        objective: 'Aprofundar o conhecimento sobre a CPR como instrumento jurídico e financeiro.',
        lessons: [
          { id: 'aula-01', title: 'Estrutura jurídica da CPR moderna', number: '2.1' },
          { id: 'aula-02', title: 'Garantias e colaterais avançados', number: '2.2' },
          { id: 'aula-03', title: 'CPR como veículo estruturado', number: '2.3' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Securitização Agro',
        objective: 'Dominar a mecânica de securitização de recebíveis do agronegócio.',
        lessons: [
          { id: 'aula-01', title: 'Anatomia de uma operação de CRA', number: '3.1' },
          { id: 'aula-02', title: 'Patrimônio separado e proteção ao investidor', number: '3.2' },
          { id: 'aula-03', title: 'Waterfall: fluxo de pagamento e subordinação', number: '3.3' },
          { id: 'aula-04', title: 'Overcollateral e credit enhancement', number: '3.4' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Gestão de Risco no Agro Estruturado',
        objective: 'Analisar riscos específicos e instrumentos de mitigação.',
        lessons: [
          { id: 'aula-01', title: 'Risco climático e instrumentos de mitigação', number: '4.1' },
          { id: 'aula-02', title: 'Risco de preço e hedge de commodities', number: '4.2' },
          { id: 'aula-03', title: 'Risco de crédito e contraparte na cadeia', number: '4.3' },
        ]
      },
      {
        id: 'modulo-05',
        title: 'Veículos de Investimento e Mercado Global',
        objective: 'Conhecer FIAGRO, funding internacional e a mentalidade de estruturação.',
        lessons: [
          { id: 'aula-01', title: 'FIAGRO: estrutura e estratégias', number: '5.1' },
          { id: 'aula-02', title: 'Funding internacional e estruturas cross-border', number: '5.2' },
          { id: 'aula-03', title: 'Mentalidade do structurer', number: '5.3' },
        ]
      },
      {
        id: 'modulo-06',
        title: 'Tokenização e Fronteira de Inovação',
        objective: 'Analisar criticamente o papel da tokenização no agro estruturado.',
        lessons: [
          { id: 'aula-01', title: 'O que a tokenização resolve e o que não resolve', number: '6.1' },
          { id: 'aula-02', title: 'Casos de uso e arquitetura técnica', number: '6.2' },
          { id: 'aula-03', title: 'Competências do especialista em agro estruturado', number: '6.3' },
        ]
      },
    ]
  },
  'tokenizacao-agro-fundamentos': {
    id: 'tokenizacao-agro-fundamentos',
    contentDir: 'curso-05',
    title: 'Web3 e Tokenização de RWA no Agronegócio',
    subtitle: 'Fundamentos e Implementação',
    level: 'Avançado',
    description: 'Fundamentos de RWA, padrões de tokenização (ERC-20/721/1155), arquitetura de soluções, oráculos, implementação prática e escolha de blockchain.',
    image: '/images/courses/curso-05.svg',
    modules: [
      {
        id: 'modulo-01',
        title: 'Fundamentos de RWA e Web3 no Agronegócio',
        objective: 'Entender o conceito de Real World Assets (RWA), seu potencial e limitações no agro brasileiro.',
        lessons: [
          { id: 'aula-01', title: 'O que RWA resolve (e o que não resolve) no agro', number: '1.1' },
          { id: 'aula-02', title: 'Mercado global de RWA vs. realidade brasileira', number: '1.2' },
          { id: 'aula-03', title: 'Regulamentação brasileira atualizada', number: '1.3' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'Padrões de Tokenização Básicos: ERC-20, ERC-721 e ERC-1155',
        objective: 'Dominar os padrões fundamentais para representar ativos fungíveis, não-fungíveis e híbridos no agro.',
        lessons: [
          { id: 'aula-01', title: 'ERC-20: Tokens fungíveis', number: '2.1' },
          { id: 'aula-02', title: 'ERC-721: Tokens não-fungíveis (NFTs)', number: '2.2' },
          { id: 'aula-03', title: 'ERC-1155: Multi-token (semi-fungível)', number: '2.3' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Arquitetura de uma Solução RWA e Smart Contracts',
        objective: 'Compreender as camadas técnicas envolvidas em uma plataforma de tokenização.',
        lessons: [
          { id: 'aula-01', title: 'A pilha tecnológica (The RWA Stack)', number: '3.1' },
          { id: 'aula-02', title: 'Componentes de um smart contract para RWA', number: '3.2' },
          { id: 'aula-03', title: 'Ferramentas de desenvolvimento e deploy', number: '3.3' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Oráculos e Integração Off-Chain',
        objective: 'Conectar o mundo on-chain a dados externos confiáveis (preços, reservas, clima).',
        lessons: [
          { id: 'aula-01', title: 'Oráculos de preço e dados', number: '4.1' },
          { id: 'aula-02', title: 'Proof of Reserve (PoR) para commodities', number: '4.2' },
          { id: 'aula-03', title: 'Oráculos climáticos e agronômicos', number: '4.3' },
        ]
      },
      {
        id: 'modulo-05',
        title: 'Implementação Prática Básica: Tokenização de CPR e CRA',
        objective: 'Colocar em prática os conceitos com exemplos de tokenização.',
        lessons: [
          { id: 'aula-01', title: 'Tokenização de CPR com ERC-20', number: '5.1' },
          { id: 'aula-02', title: 'Tokenização de CRA com ERC-1155 (tranches)', number: '5.2' },
          { id: 'aula-03', title: 'Exercícios integradores', number: '5.3' },
        ]
      },
      {
        id: 'modulo-06',
        title: 'Infraestrutura Blockchain: Escolha da Rede',
        objective: 'Comparar blockchains e selecionar a mais adequada para cada operação agro.',
        lessons: [
          { id: 'aula-01', title: 'Ethereum e Layer-2s', number: '6.1' },
          { id: 'aula-02', title: 'Alternativas de alta performance: Solana e XRPL', number: '6.2' },
          { id: 'aula-03', title: 'Protocolos especializados e permissioned', number: '6.3' },
        ]
      },
    ]
  },
  'tokenizacao-agro-avancado': {
    id: 'tokenizacao-agro-avancado',
    contentDir: 'curso-06',
    title: 'Web3 e Tokenização de RWA no Agronegócio',
    subtitle: 'Arquitetura Avançada e Integração DeFi',
    level: 'Especialista',
    description: 'Padrões avançados de compliance (ERC-3643), vaults tokenizados, waterfall on-chain, segurança, governança e integração com o sistema financeiro.',
    image: '/images/courses/curso-06.svg',
    modules: [
      {
        id: 'modulo-01',
        title: 'Padrões Avançados de Token Compliance',
        objective: 'Dominar os padrões que incorporam regras regulatórias e de identidade on-chain.',
        lessons: [
          { id: 'aula-01', title: 'ERC-1400: Security tokens com particionamento', number: '1.1' },
          { id: 'aula-02', title: 'ERC-3643 (T-REX): Tokens permissionados', number: '1.2' },
          { id: 'aula-03', title: 'Padrões emergentes: ERC-7518, EIP-7943 e EIP-7493', number: '1.3' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'Vaults Tokenizados e Estruturas DeFi para RWA',
        objective: 'Utilizar vaults padronizados para criar fundos tokenizados.',
        lessons: [
          { id: 'aula-01', title: 'ERC-4626: Vaults yield-bearing', number: '2.1' },
          { id: 'aula-02', title: 'ERC-7540: Vaults assíncronos para ativos reais', number: '2.2' },
          { id: 'aula-03', title: 'ERC-7575: Vaults multi-asset e compliance', number: '2.3' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Waterfall e Automação de Pagamentos',
        objective: 'Implementar a lógica de cascata de pagamentos de securitizações em smart contracts.',
        lessons: [
          { id: 'aula-01', title: 'Waterfall programática', number: '3.1' },
          { id: 'aula-02', title: 'Credit enhancement on-chain', number: '3.2' },
          { id: 'aula-03', title: 'Automação do lifecycle', number: '3.3' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Segurança, Auditoria e Governança',
        objective: 'Garantir a integridade e confiabilidade dos protocolos RWA.',
        lessons: [
          { id: 'aula-01', title: 'Riscos específicos de RWA', number: '4.1' },
          { id: 'aula-02', title: 'Auditoria e certificação', number: '4.2' },
          { id: 'aula-03', title: 'Governança de protocolos RWA', number: '4.3' },
        ]
      },
      {
        id: 'modulo-05',
        title: 'Integração com o Sistema Financeiro Tradicional',
        objective: 'Conectar a infraestrutura on-chain com registradoras, custodiantes, DREX e mercados secundários.',
        lessons: [
          { id: 'aula-01', title: 'Custódia física e jurídica', number: '5.1' },
          { id: 'aula-02', title: 'KYC/AML e whitelists on-chain', number: '5.2' },
          { id: 'aula-03', title: 'Mercado secundário e liquidez', number: '5.3' },
        ]
      },
      {
        id: 'modulo-06',
        title: 'Projeto Final: Tokenização End-to-End',
        objective: 'Integrar todos os conhecimentos em um projeto prático completo.',
        lessons: [
          { id: 'aula-01', title: 'Briefing e design de arquitetura', number: '6.1' },
          { id: 'aula-02', title: 'Implementação dos smart contracts core', number: '6.2' },
          { id: 'aula-03', title: 'Integração, deploy e apresentação', number: '6.3' },
        ]
      },
    ]
  },
  'nanotecnologia-fundamentos': {
    id: 'nanotecnologia-fundamentos',
    contentDir: 'curso-03',
    title: 'Nanotecnologia Aplicada a Cosméticos',
    subtitle: 'Fundamentos',
    level: 'Introdutório',
    description: 'Visão completa da nanotecnologia cosmética — nanomateriais, proteção solar, skincare, haircare, maquiagem, regulação e segurança.',
    image: '/images/courses/curso-03.svg',
    modules: [
      {
        id: 'modulo-01',
        title: 'Fundamentos de Nanociência e Nanotecnologia',
        objective: 'Compreender os conceitos fundamentais da nanociência e por que a escala nanométrica revoluciona a cosmetologia.',
        lessons: [
          { id: 'aula-01', title: 'O que é nanotecnologia: da escala atômica à aplicação', number: '1.1' },
          { id: 'aula-02', title: 'Propriedades únicas na nanoescala', number: '1.2' },
          { id: 'aula-03', title: 'Panorama da nanotecnologia no setor cosmético', number: '1.3' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'Nanomateriais Utilizados em Cosméticos',
        objective: 'Conhecer os principais tipos de nanomateriais empregados na indústria cosmética.',
        lessons: [
          { id: 'aula-01', title: 'Nanopartículas inorgânicas: óxidos metálicos e metais nobres', number: '2.1' },
          { id: 'aula-02', title: 'Nanomateriais orgânicos: lipídicos e poliméricos', number: '2.2' },
          { id: 'aula-03', title: 'Nanoemulsões e sistemas coloidais', number: '2.3' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Nanotecnologia em Proteção Solar',
        objective: 'Dominar a aplicação de nanomateriais em fotoprotetores, mecanismos de ação e regulação.',
        lessons: [
          { id: 'aula-01', title: 'Filtros solares nanométricos: mecanismos e formulação', number: '3.1' },
          { id: 'aula-02', title: 'Eficácia, estética e aceitação do consumidor', number: '3.2' },
          { id: 'aula-03', title: 'Segurança e regulação de nanofiltros solares', number: '3.3' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Nanotecnologia em Cuidados com a Pele',
        objective: 'Explorar aplicações de nanotecnologia em anti-aging, clareamento, hidratação e acne.',
        lessons: [
          { id: 'aula-01', title: 'Anti-aging nanométrico: retinoides, peptídeos e antioxidantes', number: '4.1' },
          { id: 'aula-02', title: 'Clareamento e tratamento de hiperpigmentação', number: '4.2' },
          { id: 'aula-03', title: 'Hidratação avançada e tratamento de acne', number: '4.3' },
        ]
      },
      {
        id: 'modulo-05',
        title: 'Nanotecnologia em Cabelos e Nichos Especiais',
        objective: 'Conhecer aplicações em cuidados capilares, maquiagem, perfumaria e cosméticos decorativos.',
        lessons: [
          { id: 'aula-01', title: 'Nanotecnologia capilar: reparação, coloração e proteção', number: '5.1' },
          { id: 'aula-02', title: 'Maquiagem e cosméticos decorativos nanométricos', number: '5.2' },
          { id: 'aula-03', title: 'Perfumaria, desodorantes e nichos emergentes', number: '5.3' },
        ]
      },
      {
        id: 'modulo-06',
        title: 'Segurança, Regulação e Futuro dos Nanocosméticos',
        objective: 'Compreender aspectos toxicológicos, regulatórios e tendências futuras.',
        lessons: [
          { id: 'aula-01', title: 'Toxicologia de nanomateriais cosméticos', number: '6.1' },
          { id: 'aula-02', title: 'Marco regulatório e rotulagem de nanocosméticos', number: '6.2' },
          { id: 'aula-03', title: 'Tendências e futuro da nanotecnologia cosmética', number: '6.3' },
        ]
      },
    ]
  },
  'nanovetores-avancado': {
    id: 'nanovetores-avancado',
    contentDir: 'curso-04',
    title: 'Nanovetores e Nanoencapsulamento Aplicados a Cosméticos',
    subtitle: 'Abordagem Avançada',
    level: 'Avançado',
    description: 'Aprofundamento em nanovetores cosméticos — design, encapsulamento, caracterização, permeação cutânea, escalonamento industrial e inovação.',
    image: '/images/courses/curso-04.svg',
    modules: [
      {
        id: 'modulo-01',
        title: 'Arquitetura de Nanovetores Cosméticos',
        objective: 'Consolidar a visão dos diferentes tipos de nanovetores e dominar critérios de seleção.',
        lessons: [
          { id: 'aula-01', title: 'Taxonomia dos nanovetores: classificação e princípios de design', number: '1.1' },
          { id: 'aula-02', title: 'Lipossomas e vesículas lipídicas: da primeira geração aos sistemas avançados', number: '1.2' },
          { id: 'aula-03', title: 'Nanopartículas lipídicas: SLN e NLC em profundidade', number: '1.3' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'Nanovetores Poliméricos e Sistemas Híbridos',
        objective: 'Aprofundar nanopartículas poliméricas, dendrímeros e sistemas híbridos.',
        lessons: [
          { id: 'aula-01', title: 'Nanopartículas poliméricas: nanoesferas e nanocápsulas', number: '2.1' },
          { id: 'aula-02', title: 'Dendrímeros, nanocristais e sistemas supramoleculares', number: '2.2' },
          { id: 'aula-03', title: 'Sistemas híbridos e nanovetores de nova geração', number: '2.3' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Técnicas de Nanoencapsulamento',
        objective: 'Dominar técnicas laboratoriais e industriais de nanoencapsulamento.',
        lessons: [
          { id: 'aula-01', title: 'Métodos de alta energia: homogeneização e ultrassom', number: '3.1' },
          { id: 'aula-02', title: 'Métodos de baixa energia e técnicas químicas', number: '3.2' },
          { id: 'aula-03', title: 'Secagem e processamento pós-encapsulamento', number: '3.3' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Caracterização e Controle de Qualidade',
        objective: 'Dominar técnicas analíticas de caracterização e controle de qualidade de nanovetores.',
        lessons: [
          { id: 'aula-01', title: 'Tamanho, distribuição e potencial zeta', number: '4.1' },
          { id: 'aula-02', title: 'Morfologia e estrutura interna', number: '4.2' },
          { id: 'aula-03', title: 'Eficiência de encapsulação, liberação e estabilidade', number: '4.3' },
        ]
      },
      {
        id: 'modulo-05',
        title: 'Permeação Cutânea e Direcionamento de Ativos',
        objective: 'Compreender mecanismos de permeação cutânea e estratégias de direcionamento.',
        lessons: [
          { id: 'aula-01', title: 'Barreira cutânea e vias de penetração na nanoescala', number: '5.1' },
          { id: 'aula-02', title: 'Estratégias de direcionamento cutâneo', number: '5.2' },
          { id: 'aula-03', title: 'Métodos de avaliação de permeação e bioadesão', number: '5.3' },
        ]
      },
      {
        id: 'modulo-06',
        title: 'Escalonamento, Inovação e Fronteiras',
        objective: 'Dominar escalonamento industrial, propriedade intelectual e fronteiras emergentes.',
        lessons: [
          { id: 'aula-01', title: 'Do laboratório à indústria: escalonamento de nanovetores', number: '6.1' },
          { id: 'aula-02', title: 'Propriedade intelectual e estratégia de inovação', number: '6.2' },
          { id: 'aula-03', title: 'Fronteiras da nanotecnologia cosmética avançada', number: '6.3' },
        ]
      },
    ]
  },
  'did-introducao': {
    id: 'did-introducao',
    contentDir: 'curso-07',
    title: 'Identidade Descentralizada (DID)',
    subtitle: 'Introdução e Conceitos Fundamentais',
    level: 'Introdutório',
    description: 'O que é identidade descentralizada — SSI, DIDs, Verifiable Credentials, triângulo da confiança e arquitetura do ecossistema.',
    image: '/images/courses/curso-07.svg',
    modules: [
      {
        id: 'modulo-01',
        title: 'O Problema da Identidade Digital Atual',
        objective: 'Compreender as falhas dos modelos tradicionais de identidade e a proposta da Self-Sovereign Identity.',
        lessons: [
          { id: 'aula-01', title: 'Evolução da identidade: do papel aos sistemas centralizados e federados', number: '1.1' },
          { id: 'aula-02', title: 'Falhas dos modelos tradicionais: vazamentos, censura e dependência', number: '1.2' },
          { id: 'aula-03', title: 'Introdução à Self-Sovereign Identity (SSI): os 10 princípios', number: '1.3' },
          { id: 'aula-04', title: 'A camada de identidade que faltava na internet', number: '1.4' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'Conceitos Fundamentais: DIDs e VCs',
        objective: 'Dominar os conceitos de Decentralized Identifiers e Verifiable Credentials.',
        lessons: [
          { id: 'aula-01', title: 'O que é um DID? Definição formal e estrutura', number: '2.1' },
          { id: 'aula-02', title: 'Propriedades essenciais: persistência, resolubilidade e controle criptográfico', number: '2.2' },
          { id: 'aula-03', title: 'Comparação com identificadores tradicionais', number: '2.3' },
          { id: 'aula-04', title: 'Anatomia básica de um DID Document', number: '2.4' },
          { id: 'aula-05', title: 'Verifiable Credentials e Verifiable Presentations', number: '2.5' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Atores e o Triângulo da Confiança',
        objective: 'Identificar os papéis no ecossistema e compreender o modelo de confiança descentralizado.',
        lessons: [
          { id: 'aula-01', title: 'Papéis no ecossistema: Emissor, Titular, Verificador e outros', number: '3.1' },
          { id: 'aula-02', title: 'O triângulo da confiança', number: '3.2' },
          { id: 'aula-03', title: 'Trust frameworks: da confiança técnica à jurídica', number: '3.3' },
          { id: 'aula-04', title: 'Exemplos concretos: governos, universidades e bancos como emissores', number: '3.4' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Arquitetura de Alto Nível do Ecossistema',
        objective: 'Visualizar os componentes principais e o fluxo de dados no ecossistema DID.',
        lessons: [
          { id: 'aula-01', title: 'Componentes principais: DIDs, resolvers, registros e carteiras', number: '4.1' },
          { id: 'aula-02', title: 'Onde os dados ficam? On-chain vs. off-chain', number: '4.2' },
          { id: 'aula-03', title: 'Papel da blockchain/DLT: quando é necessária', number: '4.3' },
          { id: 'aula-04', title: 'Fluxo completo de criação, resolução e verificação', number: '4.4' },
        ]
      },
    ]
  },
  'did-aplicacoes': {
    id: 'did-aplicacoes',
    contentDir: 'curso-09',
    title: 'Identidade Descentralizada (DID)',
    subtitle: 'Aplicações e Casos de Uso',
    level: 'Intermediário',
    description: 'DID no mundo real — padrões W3C, organizações, casos de uso em saúde, finanças, governo, Web3 e desafios para adoção.',
    image: '/images/courses/curso-09.svg',
    modules: [
      {
        id: 'modulo-01',
        title: 'Padrões, Organizações e Iniciativas de Mercado',
        objective: 'Conhecer os padrões W3C, organizações-chave e o contexto regulatório.',
        lessons: [
          { id: 'aula-01', title: 'Padrões W3C: DID Core e Modelo de Dados de VCs', number: '1.1' },
          { id: 'aula-02', title: 'Organizações-chave: DIF, ToIP e Hyperledger', number: '1.2' },
          { id: 'aula-03', title: 'Iniciativas da indústria: Microsoft ION, Sovrin, Trinsic', number: '1.3' },
          { id: 'aula-04', title: 'Contexto regulatório: eIDAS 2.0, GDPR e LGPD', number: '1.4' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'Casos de Uso: Pessoas, Educação e Saúde',
        objective: 'Explorar aplicações práticas de DID em identidade pessoal, educação e saúde.',
        lessons: [
          { id: 'aula-01', title: 'Identidade pessoal: passaporte digital e KYC sem intermediários', number: '2.1' },
          { id: 'aula-02', title: 'Credenciais educacionais e profissionais verificáveis', number: '2.2' },
          { id: 'aula-03', title: 'Saúde: dados médicos soberanos e consentimento do paciente', number: '2.3' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Casos de Uso: Finanças, IoT, Governo e Web3',
        objective: 'Explorar aplicações de DID em finanças, IoT, governo e Web3.',
        lessons: [
          { id: 'aula-01', title: 'DeFi e CeFi: KYC reutilizável e compliance automatizado', number: '3.1' },
          { id: 'aula-02', title: 'Internet das Coisas: identificação de dispositivos', number: '3.2' },
          { id: 'aula-03', title: 'Governo e cidadania: votação eletrônica e identidade governamental', number: '3.3' },
          { id: 'aula-04', title: 'Web3: logins descentralizados e reputação portátil', number: '3.4' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Desafios, Governança e Futuro',
        objective: 'Analisar barreiras para adoção, governança e tendências futuras.',
        lessons: [
          { id: 'aula-01', title: 'Privacidade e proteção de dados em sistemas imutáveis', number: '4.1' },
          { id: 'aula-02', title: 'Recuperação de chaves: social recovery e multisig', number: '4.2' },
          { id: 'aula-03', title: 'Barreiras para adoção em massa: UX, interoperabilidade e custos', number: '4.3' },
          { id: 'aula-04', title: 'Roadmap 2025–2030: tendências e evolução regulatória', number: '4.4' },
        ]
      },
    ]
  },
  'did-criptografia': {
    id: 'did-criptografia',
    contentDir: 'curso-10',
    title: 'Identidade Descentralizada (DID)',
    subtitle: 'Criptografia e Infraestrutura Técnica',
    level: 'Avançado',
    description: 'Engenharia de DIDs — especificação W3C, criptografia aplicada, métodos DID, resolução e infraestrutura técnica.',
    image: '/images/courses/curso-10.svg',
    modules: [
      {
        id: 'modulo-01',
        title: 'Especificação W3C DID Core e DID Document',
        objective: 'Dominar a especificação W3C DID Core e a estrutura completa de um DID Document.',
        lessons: [
          { id: 'aula-01', title: 'Sintaxe do DID URI e regras do padrão W3C', number: '1.1' },
          { id: 'aula-02', title: 'Estrutura completa do DID Document', number: '1.2' },
          { id: 'aula-03', title: 'Representações: JSON, JSON-LD e CBOR', number: '1.3' },
          { id: 'aula-04', title: 'Resolução determinística e estratégias de caching', number: '1.4' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'Criptografia Aplicada a DIDs',
        objective: 'Compreender os fundamentos criptográficos que sustentam o ecossistema DID.',
        lessons: [
          { id: 'aula-01', title: 'Criptografia assimétrica: pares de chaves e assinaturas digitais', number: '2.1' },
          { id: 'aula-02', title: 'Algoritmos de hashing e Merkle Trees', number: '2.2' },
          { id: 'aula-03', title: 'Curvas elípticas: secp256k1, Ed25519, X25519 e BLS12-381', number: '2.3' },
          { id: 'aula-04', title: 'Algoritmos de assinatura: ECDSA, EdDSA, ES256K e Schnorr', number: '2.4' },
          { id: 'aula-05', title: 'Esquemas de codificação: Multibase, Multicodec e Multihash', number: '2.5' },
          { id: 'aula-06', title: 'Gerenciamento de chaves: rotação, revogação e secure enclave', number: '2.6' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Métodos DID: Arquitetura e Comparação',
        objective: 'Dominar os principais métodos DID e critérios de seleção para cada caso de uso.',
        lessons: [
          { id: 'aula-01', title: 'O que é um método DID? Tipos e classificação', number: '3.1' },
          { id: 'aula-02', title: 'Estudo detalhado: did:ethr, did:ion, did:web e did:key', number: '3.2' },
          { id: 'aula-03', title: 'Trade-offs: custo, velocidade, imutabilidade e privacidade', number: '3.3' },
          { id: 'aula-04', title: 'Critérios para escolha do método adequado', number: '3.4' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Resolução e Infraestrutura Técnica',
        objective: 'Compreender operações de ciclo de vida, resolvers e registros verificáveis.',
        lessons: [
          { id: 'aula-01', title: 'Operações de ciclo de vida: Create, Read, Update, Deactivate', number: '4.1' },
          { id: 'aula-02', title: 'DID URLs e fragments: referenciando chaves e serviços', number: '4.2' },
          { id: 'aula-03', title: 'Universal Resolver e Universal Registrar', number: '4.3' },
          { id: 'aula-04', title: 'Verifiable Data Registries: blockchains, IPFS e Ceramic', number: '4.4' },
          { id: 'aula-05', title: 'Escalabilidade: batching, caching, sidechains e L2s', number: '4.5' },
        ]
      },
    ]
  },
  'did-seguranca': {
    id: 'did-seguranca',
    contentDir: 'curso-11',
    title: 'Identidade Descentralizada (DID)',
    subtitle: 'Segurança, Privacidade e Integração',
    level: 'Especialista',
    description: 'Segurança e fronteiras de DIDs — stack tecnológica, ZKPs, criptografia pós-quântica, modelos de ameaça e interoperabilidade.',
    image: '/images/courses/curso-11.svg',
    modules: [
      {
        id: 'modulo-01',
        title: 'Stack Tecnológica e Ferramentas de Desenvolvimento',
        objective: 'Conhecer as principais bibliotecas, frameworks e ferramentas para desenvolvimento com DIDs.',
        lessons: [
          { id: 'aula-01', title: 'Bibliotecas e frameworks: Veramo, Aries e DIDKit', number: '1.1' },
          { id: 'aula-02', title: 'Linguagens suportadas: TypeScript, Rust, Go e Python', number: '1.2' },
          { id: 'aula-03', title: 'Integrações de armazenamento: IPFS, Ceramic e Arweave', number: '1.3' },
          { id: 'aula-04', title: 'DevOps: dockerização de resolvers e monitoramento', number: '1.4' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'Criptografia Avançada e Privacidade',
        objective: 'Dominar técnicas avançadas de privacidade: ZKPs, divulgação seletiva e criptografia pós-quântica.',
        lessons: [
          { id: 'aula-01', title: 'Zero-Knowledge Proofs: conceitos, zk-SNARKs e zk-STARKs', number: '2.1' },
          { id: 'aula-02', title: 'Divulgação seletiva e predicados', number: '2.2' },
          { id: 'aula-03', title: 'Assinaturas BBS+ e AnonCreds', number: '2.3' },
          { id: 'aula-04', title: 'Criptografia pós-quântica: Dilithium e Falcon', number: '2.4' },
          { id: 'aula-05', title: 'Desafios de privacidade: correlacionabilidade e rastreamento', number: '2.5' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Segurança, Modelos de Ameaça e Ataques',
        objective: 'Analisar modelos de ameaça e implementar boas práticas de segurança em sistemas DID.',
        lessons: [
          { id: 'aula-01', title: 'Modelos de ameaça: DID hijacking, Sybil e grinding attacks', number: '3.1' },
          { id: 'aula-02', title: 'Boas práticas: rotação de chaves, multisig e assinaturas limiares', number: '3.2' },
          { id: 'aula-03', title: 'Comunicação segura: DIDComm v2, CHAPI e Presentation Exchange', number: '3.3' },
          { id: 'aula-04', title: 'Armazenamento seguro: Encrypted Data Vaults e Identity Hubs', number: '3.4' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Interoperabilidade, Integração e Futuro Técnico',
        objective: 'Conectar o ecossistema DID com padrões existentes e projetar o futuro da tecnologia.',
        lessons: [
          { id: 'aula-01', title: 'Ponte Web2–Web3: OIDC4VC', number: '4.1' },
          { id: 'aula-02', title: 'Integração com padrões existentes: SIWE e ERC-4337', number: '4.2' },
          { id: 'aula-03', title: 'Resolução cross-chain e interoperabilidade entre métodos', number: '4.3' },
          { id: 'aula-04', title: 'Roadmap técnico 2026–2028: DID 2.0 e zkDIDs', number: '4.4' },
          { id: 'aula-05', title: 'Métricas de adoção e lições aprendidas', number: '4.5' },
        ]
      },
    ]
  }
}
