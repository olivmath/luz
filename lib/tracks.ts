import { COURSES } from './courses'

export interface Track {
  id: string
  slug: string
  title: string
  subtitle: string
  description: string
  objectives: string[]
  courses: string[]
  gradient: string
  ctaTextColor: string
}

export const TRACKS: Record<string, Track> = {
  agronegocio: {
    id: 'agronegocio',
    slug: 'agronegocio',
    title: 'Agronegócio Financeiro',
    subtitle: 'Do crédito rural à tokenização de ativos',
    description:
      'Domine os instrumentos financeiros que movem o agronegócio brasileiro — do crédito rural e securitização à tokenização de ativos reais com blockchain.',
    objectives: [
      'Entender a estrutura institucional do financiamento agro brasileiro',
      'Dominar instrumentos como CPR, CRA, LCA e CDCA',
      'Compreender securitização, FIAGRO e mercado de capitais agro',
      'Aplicar conceitos de tokenização e RWA no agronegócio',
    ],
    courses: ['financeiro-agro-fundamentos', 'financeiro-agro-avancado', 'tokenizacao-agro-fundamentos', 'tokenizacao-agro-avancado'],
    gradient: 'from-[#1e4d38] to-[#28694d]',
    ctaTextColor: 'text-[#1e4d38]',
  },
  nanotecnologia: {
    id: 'nanotecnologia',
    slug: 'nanotecnologia',
    title: 'Nanotecnologia Cosmética',
    subtitle: 'Dos nanomateriais à formulação cosmética avançada',
    description:
      'Dos fundamentos da nanotecnologia à formulação cosmética — ciência aplicada à inovação em cuidados pessoais, proteção solar, skincare e haircare.',
    objectives: [
      'Compreender nanomateriais e suas propriedades na escala nanométrica',
      'Dominar aplicações em proteção solar, skincare e haircare',
      'Conhecer nanovetores, encapsulamento e permeação cutânea',
      'Entender regulação, segurança e escalonamento industrial',
    ],
    courses: ['nanotecnologia-fundamentos', 'nanovetores-avancado'],
    gradient: 'from-blue-700 to-blue-500',
    ctaTextColor: 'text-blue-700',
  },
  'identidade-descentralizada': {
    id: 'identidade-descentralizada',
    slug: 'identidade-descentralizada',
    title: 'Identidade Descentralizada',
    subtitle: 'Da identidade soberana à engenharia técnica',
    description:
      'Domine os fundamentos e a arquitetura de identidade descentralizada — DIDs, Verifiable Credentials, criptografia aplicada, ZKPs e interoperabilidade.',
    objectives: [
      'Compreender Self-Sovereign Identity e o triângulo da confiança',
      'Dominar DIDs, Verifiable Credentials e padrões W3C',
      'Aplicar criptografia avançada: ZKPs, BBS+ e pós-quântica',
      'Projetar sistemas seguros e interoperáveis com DIDs',
    ],
    courses: ['did-introducao', 'did-aplicacoes', 'did-criptografia', 'did-seguranca'],
    gradient: 'from-purple-700 to-purple-500',
    ctaTextColor: 'text-purple-700',
  },
  'informatica-saude': {
    id: 'informatica-saude',
    slug: 'informatica-saude',
    title: 'Informática da Saúde',
    subtitle: 'Blockchain, DID e interoperabilidade no SUS',
    description:
      'Do ecossistema digital do SUS à implementação prática — blockchain, identidade descentralizada, FHIR, LGPD e projetos reais na saúde brasileira.',
    objectives: [
      'Compreender a infraestrutura digital do SUS (RNDS, Conecte SUS, FHIR)',
      'Dominar o arcabouço regulatório (LGPD, CFM, Open Health)',
      'Aplicar blockchain e DIDs para consentimento, auditoria e interoperabilidade',
      'Prototipar soluções com Veramo, FHIR e redes blockchain',
    ],
    courses: ['saude-blockchain-fundamentos', 'saude-blockchain-avancado'],
    gradient: 'from-emerald-700 to-teal-500',
    ctaTextColor: 'text-emerald-700',
  },
}

export function getTrackStats(trackId: string) {
  const track = TRACKS[trackId]
  if (!track) return { totalCourses: 0, totalModules: 0, totalLessons: 0, estimatedHours: 0 }

  let totalModules = 0
  let totalLessons = 0

  for (const cid of track.courses) {
    const course = COURSES[cid]
    if (!course) continue
    totalModules += course.modules.length
    for (const mod of course.modules) {
      totalLessons += mod.lessons.length
    }
  }

  const estimatedHours = Math.round(totalLessons * 8 / 60)

  return {
    totalCourses: track.courses.filter(cid => COURSES[cid]).length,
    totalModules,
    totalLessons,
    estimatedHours,
  }
}
