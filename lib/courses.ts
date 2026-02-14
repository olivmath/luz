import type { Course } from '@/types'

export const COURSES: Record<string, Course> = {
  'curso-01': {
    id: 'curso-01',
    title: 'Sistema Financeiro do Agronegocio Brasileiro',
    subtitle: 'Fundamentos',
    level: 'Introdutorio',
    description: 'Visao completa e estruturada do sistema de financiamento do agronegocio brasileiro, desde suas bases institucionais ate os instrumentos financeiros, riscos e tendencias de mercado.',
    modules: [
      {
        id: 'modulo-01',
        title: 'O Agronegocio na Economia Brasileira',
        objective: 'Compreender o peso do agronegocio na economia nacional e as razoes estruturais que tornam o credito rural indispensavel.',
        lessons: [
          { id: 'aula-01', title: 'Dimensao economica do agronegocio', number: '1.1' },
          { id: 'aula-02', title: 'Por que o agro precisa de credito estruturado', number: '1.2' },
          { id: 'aula-03', title: 'Origem historica do credito rural no Brasil', number: '1.3' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'Estrutura Institucional do Financiamento Agro',
        objective: 'Conhecer os orgaos, entidades e agentes que compoem o sistema de financiamento do agronegocio.',
        lessons: [
          { id: 'aula-01', title: 'Sistema Nacional de Credito Rural (SNCR)', number: '2.1' },
          { id: 'aula-02', title: 'Agentes financeiros do agro', number: '2.2' },
          { id: 'aula-03', title: 'Plano Safra e programas governamentais', number: '2.3' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Fontes de Financiamento do Agronegocio',
        objective: 'Mapear as tres grandes fontes de recursos que financiam o agro brasileiro.',
        lessons: [
          { id: 'aula-01', title: 'Credito publico dirigido', number: '3.1' },
          { id: 'aula-02', title: 'Credito bancario comercial', number: '3.2' },
          { id: 'aula-03', title: 'Mercado de capitais agro', number: '3.3' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Instrumentos Financeiros do Agro',
        objective: 'Conhecer os principais titulos e instrumentos financeiros do agronegocio.',
        lessons: [
          { id: 'aula-01', title: 'CPR: Cedula de Produto Rural', number: '4.1' },
          { id: 'aula-02', title: 'CRA: Certificado de Recebiveis do Agronegocio', number: '4.2' },
          { id: 'aula-03', title: 'Outros instrumentos: LCA, CDCA, CDA/WA', number: '4.3' },
        ]
      },
      {
        id: 'modulo-05',
        title: 'Ciclo Financeiro e Fluxo de Capital no Agro',
        objective: 'Visualizar como o dinheiro circula no agronegocio, do investidor ao produtor.',
        lessons: [
          { id: 'aula-01', title: 'Fases do ciclo produtivo e financeiro', number: '5.1' },
          { id: 'aula-02', title: 'Fluxo real do capital: do investidor ao produtor', number: '5.2' },
          { id: 'aula-03', title: 'Ecossistema de participantes', number: '5.3' },
        ]
      },
      {
        id: 'modulo-06',
        title: 'Riscos, Tendencias e Inovacao',
        objective: 'Compreender os riscos do credito agro, a privatizacao do funding e a tokenizacao.',
        lessons: [
          { id: 'aula-01', title: 'Riscos do sistema de credito agro', number: '6.1' },
          { id: 'aula-02', title: 'Tendencia de privatizacao do funding agro', number: '6.2' },
          { id: 'aula-03', title: 'Introducao a tokenizacao no agro', number: '6.3' },
        ]
      },
    ]
  },
  'curso-02': {
    id: 'curso-02',
    title: 'Sistema Financeiro do Agronegocio Brasileiro',
    subtitle: 'Estruturacao e Mercado Avancado',
    level: 'Avancado',
    description: 'Aprofundamento em estruturacao de operacoes de credito agro, securitizacao, gestao de risco e veiculos de investimento.',
    modules: [
      {
        id: 'modulo-01',
        title: 'Arquitetura do Funding Agro',
        objective: 'Consolidar a visao macro das tres camadas de financiamento.',
        lessons: [
          { id: 'aula-01', title: 'As tres camadas de financiamento', number: '1.1' },
          { id: 'aula-02', title: 'Transicao estrutural: do publico ao privado', number: '1.2' },
          { id: 'aula-03', title: 'Regulacao e marcos legais relevantes', number: '1.3' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'CPR: Estruturacao Avancada',
        objective: 'Aprofundar o conhecimento sobre a CPR como instrumento juridico e financeiro.',
        lessons: [
          { id: 'aula-01', title: 'Estrutura juridica da CPR moderna', number: '2.1' },
          { id: 'aula-02', title: 'Garantias e colaterais avancados', number: '2.2' },
          { id: 'aula-03', title: 'CPR como veiculo estruturado', number: '2.3' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Securitizacao Agro',
        objective: 'Dominar a mecanica de securitizacao de recebiveis do agronegocio.',
        lessons: [
          { id: 'aula-01', title: 'Anatomia de uma operacao de CRA', number: '3.1' },
          { id: 'aula-02', title: 'Patrimonio separado e protecao ao investidor', number: '3.2' },
          { id: 'aula-03', title: 'Waterfall: fluxo de pagamento e subordinacao', number: '3.3' },
          { id: 'aula-04', title: 'Overcollateral e credit enhancement', number: '3.4' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Gestao de Risco no Agro Estruturado',
        objective: 'Analisar riscos especificos e instrumentos de mitigacao.',
        lessons: [
          { id: 'aula-01', title: 'Risco climatico e instrumentos de mitigacao', number: '4.1' },
          { id: 'aula-02', title: 'Risco de preco e hedge de commodities', number: '4.2' },
          { id: 'aula-03', title: 'Risco de credito e contraparte na cadeia', number: '4.3' },
        ]
      },
      {
        id: 'modulo-05',
        title: 'Veiculos de Investimento e Mercado Global',
        objective: 'Conhecer FIAGRO, funding internacional e a mentalidade de estruturacao.',
        lessons: [
          { id: 'aula-01', title: 'FIAGRO: estrutura e estrategias', number: '5.1' },
          { id: 'aula-02', title: 'Funding internacional e estruturas cross-border', number: '5.2' },
          { id: 'aula-03', title: 'Mentalidade do structurer', number: '5.3' },
        ]
      },
      {
        id: 'modulo-06',
        title: 'Tokenizacao e Fronteira de Inovacao',
        objective: 'Analisar criticamente o papel da tokenizacao no agro estruturado.',
        lessons: [
          { id: 'aula-01', title: 'O que a tokenizacao resolve e o que nao resolve', number: '6.1' },
          { id: 'aula-02', title: 'Casos de uso e arquitetura tecnica', number: '6.2' },
          { id: 'aula-03', title: 'Competencias do especialista em agro estruturado', number: '6.3' },
        ]
      },
    ]
  },
  'curso-03': {
    id: 'curso-03',
    title: 'Nanotecnologia Aplicada a Cosmeticos',
    subtitle: 'Fundamentos',
    level: 'Introdutorio',
    description: 'Visao completa da nanotecnologia aplicada ao setor cosmetico, desde os fundamentos da nanociencia ate as aplicacoes praticas em diferentes nichos, incluindo aspectos regulatorios e de seguranca.',
    modules: [
      {
        id: 'modulo-01',
        title: 'Fundamentos de Nanociencia e Nanotecnologia',
        objective: 'Compreender os conceitos fundamentais da nanociencia e por que a escala nanometrica revoluciona a cosmetologia.',
        lessons: [
          { id: 'aula-01', title: 'O que e nanotecnologia: da escala atomica a aplicacao', number: '1.1' },
          { id: 'aula-02', title: 'Propriedades unicas na nanoescala', number: '1.2' },
          { id: 'aula-03', title: 'Panorama da nanotecnologia no setor cosmetico', number: '1.3' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'Nanomateriais Utilizados em Cosmeticos',
        objective: 'Conhecer os principais tipos de nanomateriais empregados na industria cosmetica.',
        lessons: [
          { id: 'aula-01', title: 'Nanoparticulas inorganicas: oxidos metalicos e metais nobres', number: '2.1' },
          { id: 'aula-02', title: 'Nanomateriais organicos: lipidicos e polimericos', number: '2.2' },
          { id: 'aula-03', title: 'Nanoemulsoes e sistemas coloidais', number: '2.3' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Nanotecnologia em Protecao Solar',
        objective: 'Dominar a aplicacao de nanomateriais em fotoprotetores, mecanismos de acao e regulacao.',
        lessons: [
          { id: 'aula-01', title: 'Filtros solares nanometricos: mecanismos e formulacao', number: '3.1' },
          { id: 'aula-02', title: 'Eficacia, estetica e aceitacao do consumidor', number: '3.2' },
          { id: 'aula-03', title: 'Seguranca e regulacao de nanofiltros solares', number: '3.3' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Nanotecnologia em Cuidados com a Pele',
        objective: 'Explorar aplicacoes de nanotecnologia em anti-aging, clareamento, hidratacao e acne.',
        lessons: [
          { id: 'aula-01', title: 'Anti-aging nanometrico: retinoides, peptideos e antioxidantes', number: '4.1' },
          { id: 'aula-02', title: 'Clareamento e tratamento de hiperpigmentacao', number: '4.2' },
          { id: 'aula-03', title: 'Hidratacao avancada e tratamento de acne', number: '4.3' },
        ]
      },
      {
        id: 'modulo-05',
        title: 'Nanotecnologia em Cabelos e Nichos Especiais',
        objective: 'Conhecer aplicacoes em cuidados capilares, maquiagem, perfumaria e cosmeticos decorativos.',
        lessons: [
          { id: 'aula-01', title: 'Nanotecnologia capilar: reparacao, coloracao e protecao', number: '5.1' },
          { id: 'aula-02', title: 'Maquiagem e cosmeticos decorativos nanometricos', number: '5.2' },
          { id: 'aula-03', title: 'Perfumaria, desodorantes e nichos emergentes', number: '5.3' },
        ]
      },
      {
        id: 'modulo-06',
        title: 'Seguranca, Regulacao e Futuro dos Nanocosmeticos',
        objective: 'Compreender aspectos toxicologicos, regulatorios e tendencias futuras.',
        lessons: [
          { id: 'aula-01', title: 'Toxicologia de nanomateriais cosmeticos', number: '6.1' },
          { id: 'aula-02', title: 'Marco regulatorio e rotulagem de nanocosmeticos', number: '6.2' },
          { id: 'aula-03', title: 'Tendencias e futuro da nanotecnologia cosmetica', number: '6.3' },
        ]
      },
    ]
  },
  'curso-04': {
    id: 'curso-04',
    title: 'Nanovetores e Nanoencapsulamento Aplicados a Cosmeticos',
    subtitle: 'Abordagem Avancada',
    level: 'Avancado',
    description: 'Aprofundamento em design, sintese, caracterizacao e aplicacao de nanovetores e sistemas de nanoencapsulamento em cosmeticos com liberacao controlada e alta performance.',
    modules: [
      {
        id: 'modulo-01',
        title: 'Arquitetura de Nanovetores Cosmeticos',
        objective: 'Consolidar a visao dos diferentes tipos de nanovetores e dominar criterios de selecao.',
        lessons: [
          { id: 'aula-01', title: 'Taxonomia dos nanovetores: classificacao e principios de design', number: '1.1' },
          { id: 'aula-02', title: 'Lipossomas e vesiculas lipidicas: da primeira geracao aos sistemas avancados', number: '1.2' },
          { id: 'aula-03', title: 'Nanoparticulas lipidicas: SLN e NLC em profundidade', number: '1.3' },
        ]
      },
      {
        id: 'modulo-02',
        title: 'Nanovetores Polimericos e Sistemas Hibridos',
        objective: 'Aprofundar nanoparticulas polimericas, dendrimeros e sistemas hibridos.',
        lessons: [
          { id: 'aula-01', title: 'Nanoparticulas polimericas: nanoesferas e nanocapsulas', number: '2.1' },
          { id: 'aula-02', title: 'Dendrimeros, nanocristais e sistemas supramoleculares', number: '2.2' },
          { id: 'aula-03', title: 'Sistemas hibridos e nanovetores de nova geracao', number: '2.3' },
        ]
      },
      {
        id: 'modulo-03',
        title: 'Tecnicas de Nanoencapsulamento',
        objective: 'Dominar tecnicas laboratoriais e industriais de nanoencapsulamento.',
        lessons: [
          { id: 'aula-01', title: 'Metodos de alta energia: homogeneizacao e ultrassom', number: '3.1' },
          { id: 'aula-02', title: 'Metodos de baixa energia e tecnicas quimicas', number: '3.2' },
          { id: 'aula-03', title: 'Secagem e processamento pos-encapsulamento', number: '3.3' },
        ]
      },
      {
        id: 'modulo-04',
        title: 'Caracterizacao e Controle de Qualidade',
        objective: 'Dominar tecnicas analiticas de caracterizacao e controle de qualidade de nanovetores.',
        lessons: [
          { id: 'aula-01', title: 'Tamanho, distribuicao e potencial zeta', number: '4.1' },
          { id: 'aula-02', title: 'Morfologia e estrutura interna', number: '4.2' },
          { id: 'aula-03', title: 'Eficiencia de encapsulacao, liberacao e estabilidade', number: '4.3' },
        ]
      },
      {
        id: 'modulo-05',
        title: 'Permeacao Cutanea e Direcionamento de Ativos',
        objective: 'Compreender mecanismos de permeacao cutanea e estrategias de direcionamento.',
        lessons: [
          { id: 'aula-01', title: 'Barreira cutanea e vias de penetracao na nanoescala', number: '5.1' },
          { id: 'aula-02', title: 'Estrategias de direcionamento cutaneo', number: '5.2' },
          { id: 'aula-03', title: 'Metodos de avaliacao de permeacao e bioadesao', number: '5.3' },
        ]
      },
      {
        id: 'modulo-06',
        title: 'Escalonamento, Inovacao e Fronteiras',
        objective: 'Dominar escalonamento industrial, propriedade intelectual e fronteiras emergentes.',
        lessons: [
          { id: 'aula-01', title: 'Do laboratorio a industria: escalonamento de nanovetores', number: '6.1' },
          { id: 'aula-02', title: 'Propriedade intelectual e estrategia de inovacao', number: '6.2' },
          { id: 'aula-03', title: 'Fronteiras da nanotecnologia cosmetica avancada', number: '6.3' },
        ]
      },
    ]
  }
}
