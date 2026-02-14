import { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog — LUZ',
  description:
    'Artigos sobre agronegócio financeiro, nanotecnologia cosmética, tokenização de ativos e inovação.',
  openGraph: {
    title: 'Blog — LUZ',
    description:
      'Artigos sobre agronegócio financeiro, nanotecnologia cosmética, tokenização de ativos e inovação.',
  },
}

const ARTICLES = [
  {
    title: 'O futuro da tokenização no agronegócio brasileiro',
    summary:
      'Como a blockchain está transformando o financiamento rural e abrindo novas oportunidades para investidores.',
    date: '2026-02-10',
    readTime: 8,
    category: 'Agronegócio',
  },
  {
    title: 'Nanoemulsões em cosméticos: tendências para 2026',
    summary:
      'As inovações em nanoemulsões que estão redefinindo a eficácia de produtos de skincare e proteção solar.',
    date: '2026-02-05',
    readTime: 6,
    category: 'Nanotecnologia',
  },
  {
    title: 'CPR digital: o que muda com a tokenização',
    summary:
      'Análise das implicações jurídicas e operacionais da tokenização de Cédulas de Produto Rural.',
    date: '2026-01-28',
    readTime: 10,
    category: 'Agronegócio',
  },
  {
    title: 'Nanopartículas lipídicas: SLN vs NLC',
    summary:
      'Comparativo entre Solid Lipid Nanoparticles e Nanostructured Lipid Carriers para aplicações cosméticas.',
    date: '2026-01-20',
    readTime: 7,
    category: 'Nanotecnologia',
  },
  {
    title: 'FIAGRO: guia completo para investidores',
    summary:
      'Tudo o que você precisa saber sobre Fundos de Investimento nas Cadeias Produtivas Agroindustriais.',
    date: '2026-01-15',
    readTime: 12,
    category: 'Agronegócio',
  },
  {
    title: 'Regulação de nanocosméticos no Brasil e na União Europeia',
    summary:
      'Comparativo dos marcos regulatórios e requisitos para registro de produtos com nanomateriais.',
    date: '2026-01-08',
    readTime: 9,
    category: 'Nanotecnologia',
  },
]

function formatDate(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

export default function BlogPage() {
  return (
    <main className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Artigos sobre agronegócio financeiro, nanotecnologia cosmética,
          tokenização de ativos e inovação.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2">
        {ARTICLES.map((article) => (
          <Link
            key={article.title}
            href="#"
            className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-foreground/20"
          >
            <span
              className={`mb-3 w-fit rounded-full px-3 py-1 font-mono text-xs font-medium ${
                article.category === 'Agronegócio'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
              }`}
            >
              {article.category}
            </span>

            <h2 className="font-display text-xl font-semibold leading-tight group-hover:underline">
              {article.title}
            </h2>

            <p className="mt-2 flex-1 text-sm text-muted-foreground">
              {article.summary}
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(article.date)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {article.readTime} min
                </span>
              </div>

              <span className="flex items-center gap-1 font-mono text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100">
                Ler artigo
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-border bg-card p-6 text-center">
        <p className="font-display text-lg font-medium">Em breve</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Novos artigos sobre tokenização, nanotecnologia e inovação estão a
          caminho. Fique ligado!
        </p>
      </div>
    </main>
  )
}
