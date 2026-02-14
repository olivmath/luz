import { Metadata } from 'next'
import Link from 'next/link'
import { getGlossaryByLetter, getAlphabet, GLOSSARY } from '@/lib/glossary'

export const metadata: Metadata = {
  title: 'Glossário — LUZ',
  description:
    'Glossário completo de termos de agronegócio financeiro e nanotecnologia cosmética. CPR, CRA, securitização, nanopartículas, nanovetores e mais.',
  openGraph: {
    title: 'Glossário — LUZ',
    description:
      'Glossário completo de termos de agronegócio financeiro e nanotecnologia cosmética.',
  },
}

const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'DefinedTermSet',
  name: 'Glossário LUZ',
  description: 'Termos de agronegócio financeiro e nanotecnologia cosmética',
  definedTerm: GLOSSARY.map((t) => ({
    '@type': 'DefinedTerm',
    name: t.term,
    description: t.definition,
  })),
}

export default function GlossarioPage() {
  const glossaryByLetter = getGlossaryByLetter()
  const activeLetters = getAlphabet()

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto max-w-[var(--content-max)] px-6 py-12">
        {/* Header */}
        <header className="mb-10">
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
            Glossário
          </h1>
          <p className="mt-3 max-w-[var(--reading-max)] text-lg text-muted-foreground">
            Termos essenciais de agronegócio financeiro e nanotecnologia
            cosmética reunidos em um só lugar. Use a navegação por letras para
            encontrar rapidamente o que procura.
          </p>
        </header>

        {/* Alphabet navigation */}
        <nav
          aria-label="Navegação alfabética"
          className="mb-10 flex flex-wrap gap-2"
        >
          {ALL_LETTERS.map((letter) => {
            const isActive = activeLetters.includes(letter)
            return isActive ? (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="font-mono text-sm inline-flex h-9 w-9 items-center justify-center rounded-md bg-green-500/10 font-semibold text-green-700 transition-colors hover:bg-green-500/20 dark:text-green-400"
              >
                {letter}
              </a>
            ) : (
              <span
                key={letter}
                className="font-mono text-sm inline-flex h-9 w-9 items-center justify-center rounded-md text-muted-foreground/40"
                aria-disabled="true"
              >
                {letter}
              </span>
            )
          })}
        </nav>

        {/* Terms by letter */}
        <div className="space-y-12">
          {activeLetters.map((letter) => (
            <section key={letter} id={`letter-${letter}`}>
              <h2 className="font-display mb-4 border-b border-border pb-2 text-2xl font-bold text-foreground">
                {letter}
              </h2>

              <dl className="space-y-6">
                {glossaryByLetter[letter].map((term) => (
                  <div key={term.id} className="pl-4">
                    <dt className="flex flex-wrap items-center gap-2">
                      <span className="text-lg font-semibold text-foreground">
                        {term.term}
                      </span>
                      <span
                        className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          term.category === 'agronegocio'
                            ? 'bg-green-500/10 text-green-700 dark:text-green-400'
                            : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                        }`}
                      >
                        {term.category === 'agronegocio'
                          ? 'Agronegócio'
                          : 'Nanotecnologia'}
                      </span>
                    </dt>
                    <dd className="mt-1 text-muted-foreground">
                      {term.definition}
                      {term.courseId && (
                        <Link
                          href={`/cursos/${term.courseId}`}
                          className="ml-2 inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Ver no curso &rarr;
                        </Link>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </main>
    </>
  )
}
