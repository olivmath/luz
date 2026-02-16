import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Oliveira LTDA',
  description:
    'Artigos sobre agronegócio financeiro, nanotecnologia cosmética, identidade descentralizada, tokenização de ativos e inovação.',
  openGraph: {
    title: 'Blog — Oliveira LTDA',
    description:
      'Artigos sobre agronegócio financeiro, nanotecnologia cosmética, identidade descentralizada, tokenização de ativos e inovação.',
  },
}

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children
}
