import type { Course } from '@/types'

export const COURSES: Record<string, Course> = {
  'curso-01': {
    id: 'curso-01',
    title: 'Sistema Financeiro do Agronegócio Brasileiro',
    subtitle: 'Fundamentos',
    level: 'Introdutório',
    description: 'Visão completa do sistema de financiamento do agronegócio brasileiro — bases institucionais, instrumentos financeiros, gestão de risco e tendências de mercado.',
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
  'curso-02': {
    id: 'curso-02',
    title: 'Sistema Financeiro do Agronegócio Brasileiro',
    subtitle: 'Estruturação e Mercado Avançado',
    level: 'Avançado',
    description: 'Aprofundamento em estruturação de crédito agro — securitização, gestão de risco, FIAGRO, funding internacional e tokenização.',
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
  'curso-03': {
    id: 'curso-03',
    title: 'Nanotecnologia Aplicada a Cosméticos',
    subtitle: 'Fundamentos',
    level: 'Introdutório',
    description: 'Visão completa da nanotecnologia cosmética — nanomateriais, proteção solar, skincare, haircare, maquiagem, regulação e segurança.',
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
  'curso-04': {
    id: 'curso-04',
    title: 'Nanovetores e Nanoencapsulamento Aplicados a Cosméticos',
    subtitle: 'Abordagem Avançada',
    level: 'Avançado',
    description: 'Aprofundamento em nanovetores cosméticos — design, encapsulamento, caracterização, permeação cutânea, escalonamento industrial e inovação.',
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
  }
}
