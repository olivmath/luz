export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  category: 'agronegocio' | 'nanotecnologia'
  courseId?: string
}

export const GLOSSARY: GlossaryTerm[] = [
  // Agronegócio Financeiro
  {
    id: 'cdca',
    term: 'CDCA',
    definition: 'Certificado de Direitos Creditórios do Agronegócio — título de crédito emitido por cooperativas ou empresas do agronegócio, lastreado em recebíveis do setor.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-fundamentos',
  },
  {
    id: 'cda-wa',
    term: 'CDA/WA',
    definition: 'Certificado de Depósito Agropecuário e Warrant Agropecuário — títulos vinculados a produtos agropecuários depositados em armazéns certificados.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-fundamentos',
  },
  {
    id: 'cpr',
    term: 'CPR',
    definition: 'Cédula de Produto Rural — título financeiro que representa uma promessa de entrega de produto rural ou pagamento em dinheiro, utilizado como instrumento de financiamento do produtor.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-fundamentos',
  },
  {
    id: 'cra',
    term: 'CRA',
    definition: 'Certificado de Recebíveis do Agronegócio — título de securitização lastreado em recebíveis do agronegócio, emitido por securitizadoras e negociado no mercado de capitais.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-avancado',
  },
  {
    id: 'credit-enhancement',
    term: 'Credit Enhancement',
    definition: 'Conjunto de técnicas utilizadas para melhorar a qualidade de crédito de uma operação estruturada, como subordinação, overcollateral e garantias reais.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-avancado',
  },
  {
    id: 'credito-rural',
    term: 'Crédito Rural',
    definition: 'Sistema de financiamento destinado ao setor agropecuário, regulado pelo Banco Central e operado por instituições financeiras autorizadas.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-fundamentos',
  },
  {
    id: 'erc-1155',
    term: 'ERC-1155',
    definition: 'Padrão de token multi-asset na blockchain Ethereum que permite representar tokens fungíveis e não-fungíveis em um único contrato.',
    category: 'agronegocio',
    courseId: 'tokenizacao-agro-fundamentos',
  },
  {
    id: 'erc-20',
    term: 'ERC-20',
    definition: 'Padrão de token fungível na blockchain Ethereum, amplamente usado para representar ativos digitais divisíveis e intercambiáveis.',
    category: 'agronegocio',
    courseId: 'tokenizacao-agro-fundamentos',
  },
  {
    id: 'erc-3643',
    term: 'ERC-3643 (T-REX)',
    definition: 'Padrão de token permissionado para security tokens que incorpora regras regulatórias e de identidade on-chain.',
    category: 'agronegocio',
    courseId: 'tokenizacao-agro-avancado',
  },
  {
    id: 'erc-4626',
    term: 'ERC-4626',
    definition: 'Padrão de vault tokenizado yield-bearing na blockchain Ethereum, utilizado para criar fundos tokenizados com rendimento.',
    category: 'agronegocio',
    courseId: 'tokenizacao-agro-avancado',
  },
  {
    id: 'fiagro',
    term: 'FIAGRO',
    definition: 'Fundo de Investimento nas Cadeias Produtivas Agroindustriais — veículo de investimento coletivo que aplica recursos em ativos do agronegócio.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-avancado',
  },
  {
    id: 'funding',
    term: 'Funding',
    definition: 'Processo de captação de recursos financeiros para operações de crédito, podendo ser público (recursos obrigatórios) ou privado (mercado de capitais).',
    category: 'agronegocio',
    courseId: 'financeiro-agro-fundamentos',
  },
  {
    id: 'hedge',
    term: 'Hedge',
    definition: 'Estratégia de proteção contra variações adversas de preço de commodities, câmbio ou taxa de juros, usando derivativos ou instrumentos financeiros.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-avancado',
  },
  {
    id: 'lca',
    term: 'LCA',
    definition: 'Letra de Crédito do Agronegócio — título de renda fixa emitido por bancos, lastreado em créditos do agronegócio, isento de IR para pessoa física.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-fundamentos',
  },
  {
    id: 'oraculo',
    term: 'Oráculo',
    definition: 'Serviço que fornece dados externos (preços, clima, reservas) para smart contracts em blockchain, conectando o mundo on-chain ao off-chain.',
    category: 'agronegocio',
    courseId: 'tokenizacao-agro-fundamentos',
  },
  {
    id: 'overcollateral',
    term: 'Overcollateral',
    definition: 'Excesso de garantia oferecida em uma operação estruturada para proteger investidores contra perdas, geralmente expresso como percentual sobre o valor da emissão.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-avancado',
  },
  {
    id: 'plano-safra',
    term: 'Plano Safra',
    definition: 'Programa anual do governo federal que define as condições de financiamento para a agricultura e pecuária, incluindo volumes, taxas e linhas de crédito.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-fundamentos',
  },
  {
    id: 'rwa',
    term: 'RWA (Real World Assets)',
    definition: 'Ativos do mundo real representados digitalmente em blockchain — inclui imóveis, commodities, títulos de crédito e outros instrumentos financeiros.',
    category: 'agronegocio',
    courseId: 'tokenizacao-agro-fundamentos',
  },
  {
    id: 'securitizacao',
    term: 'Securitização',
    definition: 'Processo de transformação de recebíveis em títulos negociáveis no mercado de capitais, como CRAs, permitindo antecipação de recursos e pulverização de risco.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-avancado',
  },
  {
    id: 'smart-contract',
    term: 'Smart Contract',
    definition: 'Programa autoexecutável armazenado em blockchain que executa automaticamente os termos de um acordo quando condições predefinidas são atendidas.',
    category: 'agronegocio',
    courseId: 'tokenizacao-agro-fundamentos',
  },
  {
    id: 'sncr',
    term: 'SNCR',
    definition: 'Sistema Nacional de Crédito Rural — arcabouço institucional que regula o financiamento do setor agropecuário brasileiro desde 1965.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-fundamentos',
  },
  {
    id: 'subordinacao',
    term: 'Subordinação',
    definition: 'Estrutura de tranches em operações de securitização onde cotas subordinadas absorvem perdas antes das cotas sênior, protegendo investidores prioritários.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-avancado',
  },
  {
    id: 'tokenizacao',
    term: 'Tokenização',
    definition: 'Processo de representação digital de um ativo real (como CPR, CRA ou commodity) em blockchain, permitindo fracionamento, liquidez e automação.',
    category: 'agronegocio',
    courseId: 'tokenizacao-agro-fundamentos',
  },
  {
    id: 'waterfall',
    term: 'Waterfall',
    definition: 'Cascata de pagamento em operações de securitização que define a ordem de prioridade na distribuição de recursos entre diferentes classes de investidores.',
    category: 'agronegocio',
    courseId: 'financeiro-agro-avancado',
  },

  // Nanotecnologia Cosmética
  {
    id: 'bioadesao',
    term: 'Bioadesão',
    definition: 'Capacidade de um material ou nanovetor de aderir a superfícies biológicas (pele, mucosa), aumentando o tempo de contato e a absorção de ativos.',
    category: 'nanotecnologia',
    courseId: 'nanovetores-avancado',
  },
  {
    id: 'dendrimero',
    term: 'Dendrímero',
    definition: 'Polímero altamente ramificado com estrutura tridimensional regular, utilizado como nanovetor para encapsulação de ativos cosméticos.',
    category: 'nanotecnologia',
    courseId: 'nanovetores-avancado',
  },
  {
    id: 'dls',
    term: 'DLS (Dynamic Light Scattering)',
    definition: 'Técnica analítica de espalhamento dinâmico de luz usada para medir o tamanho e a distribuição de nanopartículas em suspensão.',
    category: 'nanotecnologia',
    courseId: 'nanovetores-avancado',
  },
  {
    id: 'eficiencia-encapsulacao',
    term: 'Eficiência de Encapsulação',
    definition: 'Percentual do ativo cosmético efetivamente incorporado dentro do nanovetor em relação à quantidade total adicionada durante a formulação.',
    category: 'nanotecnologia',
    courseId: 'nanovetores-avancado',
  },
  {
    id: 'filtro-solar-nanometrico',
    term: 'Filtro Solar Nanométrico',
    definition: 'Filtro UV composto por nanopartículas (como TiO₂ ou ZnO) que oferece proteção solar com melhor espalhabilidade e menor esbranquiçamento.',
    category: 'nanotecnologia',
    courseId: 'nanotecnologia-fundamentos',
  },
  {
    id: 'lipossoma',
    term: 'Lipossoma',
    definition: 'Vesícula esférica formada por bicamada lipídica que encapsula ativos hidrofílicos e lipofílicos, amplamente usada em cosméticos anti-aging e hidratantes.',
    category: 'nanotecnologia',
    courseId: 'nanovetores-avancado',
  },
  {
    id: 'nanocapsula',
    term: 'Nanocápsula',
    definition: 'Nanopartícula polimérica com estrutura núcleo-casca, onde o ativo fica no núcleo oleoso ou aquoso envolto por uma parede polimérica.',
    category: 'nanotecnologia',
    courseId: 'nanovetores-avancado',
  },
  {
    id: 'nanocristal',
    term: 'Nanocristal',
    definition: 'Partícula cristalina com dimensões nanométricas, usada para aumentar a solubilidade e biodisponibilidade de ativos cosméticos pouco solúveis.',
    category: 'nanotecnologia',
    courseId: 'nanovetores-avancado',
  },
  {
    id: 'nanoemulsao',
    term: 'Nanoemulsão',
    definition: 'Sistema coloidal com gotículas na faixa de 20–200 nm, formado por óleo, água e surfactante, com alta estabilidade e capacidade de veiculação de ativos.',
    category: 'nanotecnologia',
    courseId: 'nanotecnologia-fundamentos',
  },
  {
    id: 'nanoesfera',
    term: 'Nanoesfera',
    definition: 'Nanopartícula polimérica com estrutura matricial onde o ativo está disperso ou adsorvido na matriz polimérica.',
    category: 'nanotecnologia',
    courseId: 'nanovetores-avancado',
  },
  {
    id: 'nanoparticula',
    term: 'Nanopartícula',
    definition: 'Partícula com pelo menos uma dimensão entre 1 e 100 nanômetros, com propriedades físicas e químicas distintas do material em escala macro.',
    category: 'nanotecnologia',
    courseId: 'nanotecnologia-fundamentos',
  },
  {
    id: 'nanovetor',
    term: 'Nanovetor',
    definition: 'Sistema de transporte em escala nanométrica que encapsula e direciona ativos cosméticos para camadas específicas da pele.',
    category: 'nanotecnologia',
    courseId: 'nanovetores-avancado',
  },
  {
    id: 'nlc',
    term: 'NLC (Nanostructured Lipid Carriers)',
    definition: 'Carreadores lipídicos nanoestruturados compostos por mistura de lipídios sólidos e líquidos, com maior capacidade de carga de ativos que SLN.',
    category: 'nanotecnologia',
    courseId: 'nanovetores-avancado',
  },
  {
    id: 'permeacao-cutanea',
    term: 'Permeação Cutânea',
    definition: 'Processo de passagem de substâncias através das camadas da pele, influenciado pelo tamanho, carga e lipofilicidade do ativo e do nanovetor.',
    category: 'nanotecnologia',
    courseId: 'nanovetores-avancado',
  },
  {
    id: 'potencial-zeta',
    term: 'Potencial Zeta',
    definition: 'Medida da carga elétrica superficial de nanopartículas em suspensão, indicador de estabilidade coloidal (valores acima de |30 mV| indicam boa estabilidade).',
    category: 'nanotecnologia',
    courseId: 'nanovetores-avancado',
  },
  {
    id: 'sln',
    term: 'SLN (Solid Lipid Nanoparticles)',
    definition: 'Nanopartículas lipídicas sólidas — sistema de entrega com matriz de lipídio sólido que encapsula ativos cosméticos com liberação controlada.',
    category: 'nanotecnologia',
    courseId: 'nanovetores-avancado',
  },
  {
    id: 'toxicologia-nano',
    term: 'Nanotoxicologia',
    definition: 'Área da toxicologia dedicada ao estudo dos efeitos adversos de nanomateriais nos organismos vivos e no meio ambiente.',
    category: 'nanotecnologia',
    courseId: 'nanotecnologia-fundamentos',
  },
]

export function getGlossaryByLetter(): Record<string, GlossaryTerm[]> {
  const grouped: Record<string, GlossaryTerm[]> = {}
  const sorted = [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, 'pt-BR'))

  for (const term of sorted) {
    const letter = term.term[0].toUpperCase()
    if (!grouped[letter]) grouped[letter] = []
    grouped[letter].push(term)
  }

  return grouped
}

export function getAlphabet(): string[] {
  const letters = new Set(GLOSSARY.map(t => t.term[0].toUpperCase()))
  return [...letters].sort((a, b) => a.localeCompare(b, 'pt-BR'))
}
