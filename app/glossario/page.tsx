import { Metadata } from 'next'
import { GLOSSARY } from '@/lib/glossary'
import { GlossarioContent } from './glossario-content'

export const metadata: Metadata = {
  title: 'Glossário — Oliveira LTDA',
  description:
    'Glossário completo de termos de agronegócio financeiro, nanotecnologia cosmética, identidade descentralizada e informática da saúde.',
  openGraph: {
    title: 'Glossário — Oliveira LTDA',
    description:
      'Glossário completo de termos de agronegócio financeiro, nanotecnologia cosmética, identidade descentralizada e informática da saúde.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'Glossário Oliveira LTDA',
  description: 'Termos de agronegócio financeiro, nanotecnologia cosmética, identidade descentralizada e informática da saúde',
  definedTerm: GLOSSARY.map((t) => ({
    '@type': 'DefinedTerm',
    name: t.term,
    description: t.definition,
  })),
}

export default function GlossarioPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GlossarioContent />
    </>
  )
}
