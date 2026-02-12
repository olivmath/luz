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
  }
}
