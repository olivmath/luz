'use client'

import { useState, useCallback, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, Check, X, RotateCcw } from 'lucide-react'
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
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selected, setSelected] = useState<Record<number, string>>({})
  const [checked, setChecked] = useState<Record<number, boolean>>({})
  const [completed, setCompleted] = useState(false)
  const [showReport, setShowReport] = useState(false)

  const isChecked = checked[currentQuestion] !== undefined
  const hasSelection = selected[currentQuestion] !== undefined
  const q = questions[currentQuestion]
  const isFirst = currentQuestion === 0
  const isLast = currentQuestion === questions.length - 1

  const allChecked = Object.keys(checked).length === questions.length
  const correctCount = Object.values(checked).filter(Boolean).length
  const allCorrect = allChecked && correctCount === questions.length

  useEffect(() => {
    if (allCorrect && !completed) {
      setCompleted(true)
      setShowReport(true)
      onComplete()
    } else if (allChecked && !allCorrect) {
      setShowReport(true)
    }
  }, [allChecked, allCorrect, completed, onComplete])

  const handleSelect = useCallback((letter: string) => {
    if (isChecked) return
    setSelected(prev => ({ ...prev, [currentQuestion]: letter }))
  }, [isChecked, currentQuestion])

  const handleCheck = useCallback(() => {
    if (!hasSelection || isChecked) return
    const isCorrect = selected[currentQuestion] === questions[currentQuestion].correctAnswer
    setChecked(prev => ({ ...prev, [currentQuestion]: isCorrect }))
  }, [hasSelection, isChecked, selected, currentQuestion, questions])

  const handleNext = useCallback(() => {
    if (!isLast) {
      setCurrentQuestion(prev => prev + 1)
    }
  }, [isLast])

  const handleRetry = useCallback(() => {
    const newSelected: Record<number, string> = {}
    const newChecked: Record<number, boolean> = {}
    Object.entries(checked).forEach(([i, correct]) => {
      if (correct) {
        newSelected[Number(i)] = selected[Number(i)]
        newChecked[Number(i)] = true
      }
    })
    setSelected(newSelected)
    setChecked(newChecked)
    setCompleted(false)
    setShowReport(false)
    const firstWrong = questions.findIndex((_, i) => !newChecked[i])
    if (firstWrong !== -1) setCurrentQuestion(firstWrong)
  }, [checked, selected, questions])

  if (alreadyDone) {
    return (
      <div className="max-w-[var(--reading-max)] mt-12 pt-10 border-t border-border">
        <div className="font-display text-[1.6rem] font-semibold text-foreground mb-2">Questionário</div>
        <div className="font-mono text-sm text-success font-medium mt-2">&#10003; Concluído</div>
      </div>
    )
  }

  // Final report view
  if (showReport) {
    const pct = Math.round((correctCount / questions.length) * 100)
    const circumference = 2 * Math.PI * 40
    const strokeDashoffset = circumference - (pct / 100) * circumference
    const correctQuestions = questions.filter((_, i) => checked[i] === true)
    const wrongQuestions = questions.filter((_, i) => checked[i] === false)

    return (
      <div className="max-w-[var(--reading-max)] mt-12 pt-10 border-t border-border">
        <div className="mb-6">
          <div className="font-display text-[1.6rem] font-semibold text-foreground mb-2">Questionário</div>
        </div>

        <div className="flex flex-col items-center py-8">
          {/* SVG circular progress ring */}
          <div className="relative w-24 h-24 mb-5">
            <svg className="w-24 h-24 -rotate-90" viewBox="0 0 96 96">
              <circle
                cx="48" cy="48" r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                className="text-muted-foreground/15"
              />
              <circle
                cx="48" cy="48" r="40"
                fill="none"
                stroke="currentColor"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={allCorrect ? "text-success" : "text-success"}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-lg font-bold text-foreground">{pct}%</span>
            </div>
          </div>

          <div className="font-display text-2xl font-semibold text-foreground mb-2">
            {allCorrect ? 'Parabéns!' : 'Quase lá!'}
          </div>

          <div className="text-sm text-muted-foreground mb-10 text-center max-w-md">
            {allCorrect
              ? `Você acertou todas as ${questions.length} questões.`
              : 'Você completou o questionário! Veja onde focar seus estudos:'
            }
          </div>

          {/* Two-column results */}
          {allCorrect ? (
            <div className="w-full">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-base">&#128578;</span>
                <span className="font-mono text-sm font-semibold text-foreground">O que você sabe</span>
              </div>
              <div className="flex flex-col gap-1">
                {correctQuestions.map((question, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2">
                    <span className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </span>
                    <span className="text-sm text-foreground truncate">
                      {question.number}. {question.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column: correct */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-base">&#128578;</span>
                  <span className="font-mono text-sm font-semibold text-foreground">O que você sabe</span>
                </div>
                <div className="flex flex-col gap-1">
                  {correctQuestions.map((question) => (
                    <div key={question.number} className="flex items-center gap-3 px-3 py-2">
                      <span className="w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 text-white" />
                      </span>
                      <span className="text-sm text-foreground truncate">
                        {question.number}. {question.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right column: wrong */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-base">&#129300;</span>
                  <span className="font-mono text-sm font-semibold text-foreground">O que precisa revisar</span>
                </div>
                <div className="flex flex-col gap-1">
                  {wrongQuestions.map((question) => (
                    <div key={question.number} className="flex items-start gap-3 px-3 py-2">
                      <span className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center shrink-0 mt-0.5">
                        <X className="w-3 h-3 text-white" />
                      </span>
                      <span className="text-sm text-foreground truncate">
                        {question.number}. {question.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 mt-6 mb-6">
          {!allCorrect && (
            <button
              type="button"
              onClick={handleRetry}
              className="flex items-center gap-2 font-mono text-sm font-medium px-5 py-2.5 rounded-sm border border-border text-foreground hover:bg-secondary transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Tentar novamente
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[var(--reading-max)] mt-12 pt-10 border-t border-border">
      {/* Header */}
      <div className="mb-6 flex items-baseline justify-between">
        <div>
          <div className="font-display text-[1.6rem] font-semibold text-foreground mb-2">Questionário</div>
          <div className="font-mono text-sm text-muted-foreground tracking-wider">
            Questões: {questions.length}
          </div>
        </div>
      </div>

      {/* Feedback banner */}
      {isChecked && (
        <div className={cn(
          "text-center font-display text-lg font-semibold mb-4",
          checked[currentQuestion] ? "text-success" : "text-destructive"
        )}>
          {checked[currentQuestion] ? 'Correto!' : 'Incorreto'}
        </div>
      )}

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {questions.map((_, i) => {
          const hasResult = checked[i] !== undefined
          const isCorrect = checked[i] === true
          const isWrong = checked[i] === false
          const isCurrent = i === currentQuestion

          return (
            <button
              key={i}
              type="button"
              onClick={() => setCurrentQuestion(i)}
              className={cn(
                "w-3 h-3 rounded-full transition-all cursor-pointer",
                !hasResult && !isCurrent && "bg-muted-foreground/20",
                isCorrect && !isCurrent && "bg-success",
                isWrong && !isCurrent && "bg-destructive",
                isCurrent && !hasResult && "bg-primary ring-2 ring-primary/30 ring-offset-2 ring-offset-background",
                isCurrent && isCorrect && "bg-success ring-2 ring-success/30 ring-offset-2 ring-offset-background",
                isCurrent && isWrong && "bg-destructive ring-2 ring-destructive/30 ring-offset-2 ring-offset-background"
              )}
              aria-label={`Questão ${i + 1}`}
            />
          )
        })}
      </div>

      {/* Question card */}
      <div className="min-h-[280px] max-sm:min-h-[240px]">
        <div className="text-base max-sm:text-[0.9rem] font-medium text-foreground leading-relaxed mb-5">
          {q.number}. {q.text}
        </div>

        <div className="flex flex-col gap-2.5" role="radiogroup" aria-label={`Questão ${q.number}`}>
          {q.options.map(opt => {
            const isSelected = selected[currentQuestion] === opt.letter
            const isCorrectAnswer = opt.letter === q.correctAnswer
            const showCorrect = isChecked && isCorrectAnswer
            const showWrong = isChecked && !isCorrectAnswer

            return (
              <label
                key={opt.letter}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 max-sm:px-3 rounded-sm border transition-all",
                  // Before check
                  !isChecked && "border-border cursor-pointer hover:bg-secondary/50",
                  !isChecked && isSelected && "border-primary bg-primary/5",
                  // After check
                  isChecked && "cursor-default",
                  showCorrect && "border-success bg-success/10",
                  showWrong && "border-border opacity-50",
                  isChecked && isSelected && !checked[currentQuestion] && "border-destructive bg-destructive/10 opacity-100"
                )}
              >
                <input
                  type="radio"
                  name={`q${currentQuestion}`}
                  value={opt.letter}
                  checked={isSelected}
                  onChange={() => handleSelect(opt.letter)}
                  disabled={isChecked}
                  className="sr-only"
                />
                {/* Icon */}
                <span className="shrink-0 w-5 h-5 flex items-center justify-center">
                  {isChecked && isCorrectAnswer ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : isChecked && isSelected && !checked[currentQuestion] ? (
                    <X className="w-4 h-4 text-destructive" />
                  ) : (
                    <span className={cn(
                      "w-4 h-4 rounded-full border-2 transition-all",
                      isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                    )} />
                  )}
                </span>
                <span className="text-[0.9rem] max-sm:text-[0.85rem] text-foreground leading-relaxed">
                  {opt.text}
                </span>
              </label>
            )
          })}
        </div>
      </div>

      {/* Footer navigation */}
      <div className="flex items-center justify-between mt-6 mb-6">
        {/* Back */}
        <button
          type="button"
          onClick={() => setCurrentQuestion(prev => prev - 1)}
          disabled={isFirst}
          className={cn(
            "flex items-center gap-1 font-mono text-sm font-medium px-4 py-2 rounded-sm border transition-all",
            isFirst
              ? "border-border text-muted-foreground/40 cursor-not-allowed"
              : "border-border text-foreground hover:bg-secondary cursor-pointer"
          )}
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        {/* Check / Next */}
        {!isChecked ? (
          <button
            type="button"
            onClick={handleCheck}
            disabled={!hasSelection}
            className={cn(
              "flex items-center gap-1 font-mono text-sm font-medium px-5 py-2 rounded-sm transition-all",
              hasSelection
                ? "bg-primary text-primary-foreground border border-primary hover:bg-primary/90 cursor-pointer"
                : "bg-muted text-muted-foreground border border-border cursor-not-allowed"
            )}
          >
            Verificar
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            disabled={isLast}
            className={cn(
              "flex items-center gap-1 font-mono text-sm font-medium px-5 py-2 rounded-sm border transition-all",
              isLast
                ? "border-border text-muted-foreground/40 cursor-not-allowed"
                : "bg-primary text-primary-foreground border border-primary hover:bg-primary/90 cursor-pointer"
            )}
          >
            Próxima
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
