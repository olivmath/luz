'use client'

import { useState } from 'react'
import Link from 'next/link'
import { getGlossaryByLetter, getAlphabet } from '@/lib/glossary'
import { cn } from '@/lib/utils'
import { TermLessonsModal } from '@/components/term-lessons-modal'
import termLessonIndex from '@/lib/term-lesson-index.json'

const ALL_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

export function GlossarioContent() {
  const glossaryByLetter = getGlossaryByLetter()
  const activeLetters = getAlphabet()
  const [filter, setFilter] = useState<string | null>(null)
  const [selectedTerm, setSelectedTerm] = useState<string | null>(null)

  const visibleLetters = filter ? [filter] : activeLetters

  return (
    <main className="mx-auto max-w-[var(--content-max)] px-6 py-12">
      {/* Header */}
      <header className="mb-10">
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">
          Glossário
        </h1>
        <p className="mt-3 max-w-[var(--reading-max)] text-lg text-muted-foreground">
          Termos essenciais de agronegócio financeiro, nanotecnologia
          cosmética, identidade descentralizada e informática da saúde
          reunidos em um só lugar. Use os filtros por letra para encontrar
          rapidamente o que procura.
        </p>
      </header>

      {/* Alphabet filter */}
      <div
        aria-label="Filtro alfabético"
        className="mb-10 flex flex-wrap gap-2"
      >
        <button
          onClick={() => setFilter(null)}
          className={cn(
            'font-mono text-sm inline-flex h-9 px-3 items-center justify-center rounded-md font-semibold transition-colors',
            filter === null
              ? 'bg-foreground text-background'
              : 'bg-muted text-muted-foreground hover:bg-muted/80',
          )}
        >
          Todos
        </button>
        {ALL_LETTERS.map((letter) => {
          const isActive = activeLetters.includes(letter)
          const isSelected = filter === letter
          return (
            <button
              key={letter}
              onClick={() => isActive && setFilter(isSelected ? null : letter)}
              disabled={!isActive}
              className={cn(
                'font-mono text-sm inline-flex h-9 w-9 items-center justify-center rounded-md font-semibold transition-colors',
                !isActive && 'text-muted-foreground/40 cursor-not-allowed',
                isActive && isSelected && 'bg-green-600 text-white dark:bg-green-500',
                isActive && !isSelected && 'bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20',
              )}
            >
              {letter}
            </button>
          )
        })}
      </div>

      {/* Terms by letter */}
      <div className="space-y-12">
        {visibleLetters.map((letter) => (
          <section key={letter}>
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
                          : term.category === 'nanotecnologia'
                          ? 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                          : term.category === 'did'
                          ? 'bg-purple-500/10 text-purple-700 dark:text-purple-400'
                          : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      }`}
                    >
                      {term.category === 'agronegocio'
                        ? 'Agronegócio'
                        : term.category === 'nanotecnologia'
                        ? 'Nanotecnologia'
                        : term.category === 'did'
                        ? 'Identidade Descentralizada'
                        : 'Informática da Saúde'}
                    </span>
                  </dt>
                  <dd className="mt-1 text-muted-foreground">
                    {term.definition}
                    {(termLessonIndex as Record<string, unknown[]>)[term.id] ? (
                      <button
                        onClick={() => setSelectedTerm(term.id)}
                        className="ml-2 inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300 cursor-pointer"
                      >
                        Ver nas aulas &rarr;
                      </button>
                    ) : term.courseId ? (
                      <Link
                        href={`/${term.courseId}`}
                        className="ml-2 inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-600 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Ver no curso &rarr;
                      </Link>
                    ) : null}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      {filter && visibleLetters.length === 0 && (
        <div className="rounded-lg border border-border bg-card p-12 text-center">
          <p className="font-display text-lg font-medium">Nenhum termo encontrado</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Não há termos começando com a letra {filter}.
          </p>
        </div>
      )}
      {selectedTerm && (termLessonIndex as Record<string, any[]>)[selectedTerm] && (() => {
        const allTerms = Object.values(glossaryByLetter).flat()
        const termData = allTerms.find(t => t.id === selectedTerm)
        return (
          <TermLessonsModal
            termName={termData?.term ?? selectedTerm}
            lessons={(termLessonIndex as Record<string, any[]>)[selectedTerm]}
            onClose={() => setSelectedTerm(null)}
          />
        )
      })()}
    </main>
  )
}
