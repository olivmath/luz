export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  category: 'agronegocio' | 'nanotecnologia' | 'did' | 'saude'
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

  // Informática da Saúde
  {
    id: 'blockchain-saude',
    term: 'Blockchain na Saúde',
    definition: 'Aplicação de tecnologia de registro distribuído para garantir integridade, rastreabilidade e imutabilidade de dados clínicos, prontuários e cadeias de suprimento farmacêutica.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
  },
  {
    id: 'consentimento-informado-digital',
    term: 'Consentimento Informado Digital',
    definition: 'Mecanismo eletrônico pelo qual o paciente autoriza o uso de seus dados de saúde, com registro auditável e revogável, alinhado à LGPD.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
  },
  {
    id: 'credencial-verificavel-saude',
    term: 'Credencial Verificável (VC) na Saúde',
    definition: 'Atestado digital criptograficamente assinado (ex.: carteira de vacinação, receita médica) que pode ser verificado sem contatar o emissor original.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
  },
  {
    id: 'fhir',
    term: 'FHIR (Fast Healthcare Interoperability Resources)',
    definition: 'Padrão HL7 de interoperabilidade para troca de dados clínicos baseado em recursos RESTful, adotado pela RNDS como espinha dorsal da troca de informações de saúde no Brasil.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
  },
  {
    id: 'ihe',
    term: 'IHE (Integrating the Healthcare Enterprise)',
    definition: 'Iniciativa internacional que define perfis de integração para melhorar a interoperabilidade entre sistemas de informação em saúde.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
  },
  {
    id: 'interoperabilidade-saude',
    term: 'Interoperabilidade em Saúde',
    definition: 'Capacidade de diferentes sistemas de informação em saúde trocarem dados de forma padronizada e compreensível, usando padrões como HL7 FHIR, openEHR e IHE.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
  },
  {
    id: 'ips',
    term: 'IPS (International Patient Summary)',
    definition: 'Resumo padronizado e portátil do histórico de saúde do paciente, projetado para emergências e atendimentos em contextos internacionais.',
    category: 'saude',
    courseId: 'saude-blockchain-avancado',
  },
  {
    id: 'lgpd-saude',
    term: 'LGPD na Saúde',
    definition: 'Aplicação da Lei Geral de Proteção de Dados ao setor de saúde, que classifica dados médicos como sensíveis e exige bases legais específicas para tratamento.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
  },
  {
    id: 'maturidade-digital-saude',
    term: 'Maturidade Digital em Saúde',
    definition: 'Grau de adoção e integração de tecnologias digitais em estabelecimentos de saúde, avaliado por indicadores como conectividade, prontuário eletrônico e telemedicina.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
  },
  {
    id: 'mvp-saude',
    term: 'MVP (Minimum Viable Product) em Saúde Digital',
    definition: 'Protótipo funcional mínimo de uma solução de saúde digital, usado para validar hipóteses e obter feedback antes do desenvolvimento completo.',
    category: 'saude',
    courseId: 'saude-blockchain-avancado',
  },
  {
    id: 'open-health',
    term: 'Open Health',
    definition: 'Conceito de compartilhamento padronizado e consentido de dados de saúde entre instituições, inspirado no modelo do Open Banking/Open Finance.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
  },
  {
    id: 'openehr',
    term: 'openEHR',
    definition: 'Plataforma aberta para modelagem de dados clínicos baseada em arquétipos, que separa o modelo de informação do modelo de conhecimento clínico.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
  },
  {
    id: 'prontuario-eletronico',
    term: 'Prontuário Eletrônico (PEP)',
    definition: 'Registro digital do histórico de saúde do paciente, incluindo consultas, exames, diagnósticos e tratamentos, armazenado em sistemas de informação hospitalares.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
  },
  {
    id: 'rnds',
    term: 'RNDS (Rede Nacional de Dados em Saúde)',
    definition: 'Plataforma nacional de interoperabilidade do SUS que conecta estabelecimentos de saúde para troca de dados clínicos padronizados via FHIR.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
  },
  {
    id: 'ssi-saude',
    term: 'SSI na Saúde (Self-Sovereign Identity)',
    definition: 'Modelo de identidade autossoberana aplicado à saúde, onde o paciente controla seus dados médicos e decide com quem compartilhá-los.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
  },
  {
    id: 'supply-chain-farmaceutica',
    term: 'Supply Chain Farmacêutica',
    definition: 'Cadeia de suprimento de medicamentos, do fabricante ao paciente, que pode utilizar blockchain para rastreabilidade e combate à falsificação.',
    category: 'saude',
    courseId: 'saude-blockchain-avancado',
  },
  {
    id: 'telemedicina',
    term: 'Telemedicina',
    definition: 'Prática médica à distância mediada por tecnologia, regulamentada no Brasil pela Resolução CFM nº 2.314/2022, abrangendo teleconsulta, telediagnóstico e telemonitoramento.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
  },
  {
    id: 'zkp-saude',
    term: 'ZKP na Saúde (Zero-Knowledge Proof)',
    definition: 'Prova criptográfica que permite verificar atributos de saúde (ex.: "vacinado contra COVID") sem revelar dados pessoais do paciente.',
    category: 'saude',
    courseId: 'saude-blockchain-fundamentos',
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
