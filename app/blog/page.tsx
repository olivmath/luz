'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { label: 'Todos', value: 'all', color: 'bg-foreground text-background', inactive: 'bg-muted text-muted-foreground hover:bg-muted/80' },
  { label: 'Agronegócio', value: 'Agronegócio', color: 'bg-green-600 text-white dark:bg-green-500', inactive: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50' },
  { label: 'Nanotecnologia', value: 'Nanotecnologia', color: 'bg-blue-600 text-white dark:bg-blue-500', inactive: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50' },
  { label: 'Identidade Descentralizada', value: 'Identidade Descentralizada', color: 'bg-purple-600 text-white dark:bg-purple-500', inactive: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900/50' },
  { label: 'Informática da Saúde', value: 'Informática da Saúde', color: 'bg-emerald-600 text-white dark:bg-emerald-500', inactive: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50' },
]

const ARTICLES = [
  {
    title: 'O que é Self-Sovereign Identity e por que importa',
    summary:
      'Entenda o conceito de identidade auto-soberana, o triângulo da confiança e como DIDs devolvem o controle dos dados ao usuário.',
    date: '2026-02-14',
    readTime: 7,
    category: 'Identidade Descentralizada',
  },
  {
    title: 'O futuro da tokenização no agronegócio brasileiro',
    summary:
      'Como a blockchain está transformando o financiamento rural e abrindo novas oportunidades para investidores.',
    date: '2026-02-10',
    readTime: 8,
    category: 'Agronegócio',
  },
  {
    title: 'DIDs vs login federado: qual o futuro da autenticação?',
    summary:
      'Comparativo entre OAuth/OIDC tradicionais e autenticação baseada em Decentralized Identifiers — prós, contras e cenários de adoção.',
    date: '2026-02-08',
    readTime: 9,
    category: 'Identidade Descentralizada',
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
    title: 'Verifiable Credentials na prática: diplomas, saúde e KYC',
    summary:
      'Como credenciais verificáveis estão sendo usadas em educação, saúde e compliance financeiro ao redor do mundo.',
    date: '2026-01-30',
    readTime: 11,
    category: 'Identidade Descentralizada',
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
    title: 'Zero-Knowledge Proofs e privacidade em identidade digital',
    summary:
      'Como ZKPs permitem provar atributos sem revelar dados pessoais — da teoria às implementações com BBS+ e zk-SNARKs.',
    date: '2026-01-22',
    readTime: 10,
    category: 'Identidade Descentralizada',
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
    title: 'Métodos DID: did:web, did:key, did:ethr — qual escolher?',
    summary:
      'Guia prático dos principais métodos DID, seus trade-offs de descentralização, custo e facilidade de implementação.',
    date: '2026-01-12',
    readTime: 8,
    category: 'Identidade Descentralizada',
  },
  {
    title: 'Regulação de nanocosméticos no Brasil e na União Europeia',
    summary:
      'Comparativo dos marcos regulatórios e requisitos para registro de produtos com nanomateriais.',
    date: '2026-01-08',
    readTime: 9,
    category: 'Nanotecnologia',
  },
  {
    title: 'eIDAS 2.0 e a carteira de identidade digital europeia',
    summary:
      'O regulamento europeu que exige wallets de identidade digital para 450 milhões de cidadãos e o papel dos DIDs nessa arquitetura.',
    date: '2026-01-05',
    readTime: 8,
    category: 'Identidade Descentralizada',
  },
  {
    title: 'Blockchain na saúde: prontuários eletrônicos descentralizados',
    summary:
      'Como a tecnologia blockchain pode garantir integridade, interoperabilidade e privacidade dos registros médicos eletrônicos.',
    date: '2026-02-12',
    readTime: 9,
    category: 'Informática da Saúde',
  },
  {
    title: 'FHIR e interoperabilidade: o padrão que conecta sistemas de saúde',
    summary:
      'Entenda o padrão HL7 FHIR, como ele facilita a troca de dados clínicos e seu papel na transformação digital da saúde.',
    date: '2026-02-06',
    readTime: 7,
    category: 'Informática da Saúde',
  },
  {
    title: 'Telemedicina e IoT: monitoramento remoto de pacientes',
    summary:
      'As tecnologias de Internet das Coisas que estão revolucionando o acompanhamento de pacientes crônicos à distância.',
    date: '2026-01-25',
    readTime: 8,
    category: 'Informática da Saúde',
  },
  {
    title: 'LGPD na saúde: proteção de dados sensíveis de pacientes',
    summary:
      'Os desafios da conformidade com a Lei Geral de Proteção de Dados no setor de saúde e as melhores práticas para clínicas e hospitais.',
    date: '2026-01-18',
    readTime: 10,
    category: 'Informática da Saúde',
  },
  {
    title: 'Inteligência artificial no diagnóstico por imagem',
    summary:
      'Como algoritmos de deep learning estão auxiliando radiologistas na detecção precoce de doenças em exames de imagem.',
    date: '2026-01-10',
    readTime: 8,
    category: 'Informática da Saúde',
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

function badgeColor(category: string) {
  if (category === 'Agronegócio') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
  if (category === 'Identidade Descentralizada') return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
  if (category === 'Informática da Saúde') return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
  return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
}

export default function BlogPage() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? ARTICLES : ARTICLES.filter((a) => a.category === filter)

  return (
    <main className="mx-auto max-w-[var(--content-max)] px-4 py-12 sm:px-6 lg:px-8">
      <header className="mb-12 text-center">
        <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
          Blog
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Artigos sobre agronegócio financeiro, nanotecnologia cosmética,
          identidade descentralizada, informática da saúde e inovação.
        </p>
      </header>

      {/* Filter bar */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setFilter(cat.value)}
            className={cn(
              'rounded-full px-4 py-1.5 font-mono text-xs font-medium transition-all duration-200',
              filter === cat.value ? cat.color : cat.inactive,
            )}
          >
            {cat.label}
            {cat.value !== 'all' && (
              <span className="ml-1.5 opacity-70">
                {ARTICLES.filter((a) => a.category === cat.value).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {filtered.map((article) => (
          <Link
            key={article.title}
            href="#"
            className="group flex flex-col rounded-lg border border-border bg-card p-6 transition-colors hover:border-foreground/20"
          >
            <span
              className={cn('mb-3 w-fit rounded-full px-3 py-1 font-mono text-xs font-medium', badgeColor(article.category))}
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

      {filtered.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="font-display text-lg font-medium">Nenhum artigo encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Novos artigos nesta categoria estão a caminho.
          </p>
        </div>
      )}

      <div className="mt-12 rounded-lg border border-border bg-card p-6 text-center">
        <p className="font-display text-lg font-medium">Em breve</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Novos artigos sobre tokenização, nanotecnologia, identidade
          descentralizada e inovação estão a caminho. Fique ligado!
        </p>
      </div>
    </main>
  )
}
