'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { QuizQuestion } from '@/types'

interface QuizSectionProps {
  questions: QuizQuestion[]
  courseId: string
  moduleId: string
  lessonId: string
  alreadyDone: boolean
  onComplete: () => void
}

export function QuizSection({ questions, alreadyDone, onComplete }: QuizSectionProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState<Record<number, boolean>>({})
  const [allCorrect, setAllCorrect] = useState(false)

  const handleSelect = useCallback((qIndex: number, letter: string) => {
    if (submitted && allCorrect) return
    setAnswers(prev => ({ ...prev, [qIndex]: letter }))
  }, [submitted, allCorrect])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    const newResults: Record<number, boolean> = {}
    let correct = true

    questions.forEach((q, i) => {
      const answer = answers[i]
      if (!answer || answer !== q.correctAnswer) {
        correct = false
        newResults[i] = false
      } else {
        newResults[i] = true
      }
    })

    setResults(newResults)
    setSubmitted(true)
    setAllCorrect(correct)

    if (correct) {
      onComplete()
    }
  }, [answers, questions, onComplete])

  if (alreadyDone) {
    return (
      <div className="max-w-[var(--reading-max)] mt-12 pt-10 border-t border-border">
        <div className="font-display text-[1.6rem] font-semibold text-foreground mb-2">Questionario</div>
        <div className="font-mono text-sm text-success font-medium mt-2">&#10003; Concluido</div>
      </div>
    )
  }

  const correctCount = Object.values(results).filter(Boolean).length

  return (
    <div className="max-w-[var(--reading-max)] mt-12 pt-10 border-t border-border">
      <div className="mb-8">
        <div className="font-display text-[1.6rem] font-semibold text-foreground mb-2">Questionario</div>
        <div className="font-mono text-sm text-muted-foreground tracking-wider">
          Responda corretamente para concluir esta aula
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {questions.map((q, qi) => (
          <div key={qi} className={cn("mb-8 pb-6", qi < questions.length - 1 && "border-b border-border/50")}>
            <div className="text-base font-medium text-foreground leading-relaxed mb-4">
              <span className="font-mono text-sm text-muted-foreground font-semibold">{q.number}.</span>{' '}
              {q.text}
            </div>
            <div className="flex flex-col gap-2" role="radiogroup" aria-label={`Questao ${q.number}`}>
              {q.options.map(opt => {
                const isSelected = answers[qi] === opt.letter
                const showResult = submitted && results[qi] !== undefined
                const isCorrectAnswer = opt.letter === q.correctAnswer
                const isWrongSelection = showResult && isSelected && !results[qi]
                const isCorrectSelection = showResult && isCorrectAnswer

                return (
                  <label
                    key={opt.letter}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 border border-border rounded-sm cursor-pointer transition-all",
                      "hover:bg-secondary hover:border-border",
                      isSelected && !showResult && "border-primary bg-primary/5",
                      isCorrectSelection && "border-success bg-success/5",
                      isWrongSelection && "border-destructive bg-destructive/5"
                    )}
                  >
                    <input
                      type="radio"
                      name={`q${qi}`}
                      value={opt.letter}
                      checked={isSelected}
                      onChange={() => handleSelect(qi, opt.letter)}
                      required
                      className="sr-only"
                    />
                    <span className={cn(
                      "font-mono text-sm font-medium text-muted-foreground shrink-0 w-5 pt-px",
                      isSelected && !showResult && "text-primary",
                      isCorrectSelection && "text-success",
                      isWrongSelection && "text-destructive"
                    )}>
                      {opt.letter})
                    </span>
                    <span className="text-[0.9rem] text-foreground leading-relaxed">
                      {opt.text}
                    </span>
                  </label>
                )
              })}
            </div>
            {submitted && results[qi] !== undefined && (
              <div className="mt-2">
                {results[qi] ? (
                  <span className="font-mono text-sm text-success font-medium">&#10003; Correto</span>
                ) : (
                  <span className="font-mono text-sm text-destructive font-medium">&#10007; Incorreto</span>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="mt-6 mb-6">
          <button
            type="submit"
            className="w-full font-mono text-sm font-medium px-6 py-3 rounded-sm bg-primary text-primary-foreground border border-primary hover:bg-primary/90 transition-all cursor-pointer flex items-center justify-center"
          >
            {submitted && !allCorrect ? 'Verificar novamente' : 'Verificar respostas'}
          </button>
        </div>

        {submitted && (
          <div className={cn(
            "flex items-center gap-3 px-5 py-4 rounded-sm animate-fade-in-up",
            allCorrect
              ? "bg-success/5 border border-success/20"
              : "bg-destructive/5 border border-destructive/20"
          )}>
            {allCorrect ? (
              <>
                <span className="text-xl text-success">&#10003;</span>
                <span className="font-mono text-sm text-success font-medium">
                  Parabens! Voce acertou todas as {questions.length} questoes.
                </span>
              </>
            ) : (
              <span className="font-mono text-sm text-destructive font-medium">
                Voce acertou {correctCount} de {questions.length}. Revise e tente novamente.
              </span>
            )}
          </div>
        )}
      </form>
    </div>
  )
}
