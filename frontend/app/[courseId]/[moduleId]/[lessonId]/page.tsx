'use client'

import { use, useState, useCallback } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { COURSES } from '@/lib/courses'
import { useProgress } from '@/context/progress-context'
import { getAdjacentLessons } from '@/lib/helpers'
import { useMarkdown } from '@/hooks/use-markdown'
import { useKeyboardNavigation } from '@/hooks/use-keyboard-navigation'
import { ReadingProgressBar } from '@/components/reading-progress-bar'
import { LessonSidebar } from '@/components/lesson-sidebar'
import { QuizSection } from '@/components/quiz-section'
import { cn } from '@/lib/utils'
import { Menu, X } from 'lucide-react'

export default function LessonPage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string; lessonId: string }>
}) {
  const { courseId, moduleId, lessonId } = use(params)
  const course = COURSES[courseId]
  if (!course) notFound()
  const mod = course.modules.find(m => m.id === moduleId)
  if (!mod) notFound()
  const lesson = mod.lessons.find(l => l.id === lessonId)
  if (!lesson) notFound()

  const progress = useProgress()
  const adj = getAdjacentLessons(courseId, moduleId, lessonId)
  const done = progress.isCompleted(courseId, moduleId, lessonId)
  const { html, quiz, readingTime, loading, error } = useMarkdown(courseId, moduleId, lessonId)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [localDone, setLocalDone] = useState(done)

  useKeyboardNavigation(adj)

  const handleComplete = useCallback(() => {
    if (progress.isCompleted(courseId, moduleId, lessonId)) return
    progress.markCompleted(courseId, moduleId, lessonId)
    setLocalDone(true)
  }, [courseId, moduleId, lessonId, progress])

  const handleQuizComplete = useCallback(() => {
    progress.markCompleted(courseId, moduleId, lessonId)
    setLocalDone(true)
  }, [courseId, moduleId, lessonId, progress])

  const isCompleted = done || localDone
  const hasQuizGate = quiz && !isCompleted
  const courseComplete = progress.isCourseComplete(courseId)

  return (
    <>
      <ReadingProgressBar enabled={!loading && !error} />

      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-[998] lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex max-w-[1200px] mx-auto min-h-[calc(100vh-var(--header-h))]">
        {/* Sidebar */}
        <div className={cn(
          "w-[var(--sidebar-w)] shrink-0 border-r border-border bg-sidebar sticky top-[var(--header-h)] h-[calc(100vh-var(--header-h))] overflow-y-auto sidebar-scroll",
          "max-lg:fixed max-lg:top-[var(--header-h)] max-lg:left-0 max-lg:bottom-0 max-lg:z-[999] max-lg:shadow-[4px_0_24px_rgba(0,0,0,0.08)]",
          sidebarOpen ? "max-lg:block" : "max-lg:hidden"
        )}>
          <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
            <Link href={`/${courseId}`} className="font-mono text-xs text-muted-foreground tracking-wider hover:text-primary transition-colors flex items-center gap-2">
              &larr; Curso
            </Link>
            <div className="font-mono text-xs text-muted-foreground font-medium">
              {progress.getCourseProgress(courseId).completed}/{progress.getCourseProgress(courseId).total}
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground"
              aria-label="Fechar menu de aulas"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <LessonSidebar
            courseId={courseId}
            activeModuleId={moduleId}
            activeLessonId={lessonId}
            onLessonClick={() => setSidebarOpen(false)}
          />
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0 px-12 py-10 pb-20 max-lg:max-w-full max-lg:px-6 max-lg:py-6 max-lg:pb-12 max-md:px-5">
          {/* Topbar */}
          <div className="flex items-center justify-between mb-10 pb-6 border-b border-border/50">
            <button
              onClick={() => setSidebarOpen(true)}
              className="hidden max-lg:flex items-center gap-2 font-mono text-sm text-muted-foreground px-3 py-2 border border-border rounded-sm bg-card hover:border-primary hover:text-primary transition-all cursor-pointer"
              aria-label="Abrir menu de aulas"
            >
              <Menu className="w-4 h-4" /> Aulas
            </button>
            <div className="font-mono text-xs text-muted-foreground tracking-wider">
              {loading ? `Aula ${lesson.number}` : `Aula ${lesson.number} \u00b7 ~${readingTime} min de leitura`}
            </div>
            <div className="font-mono text-xs text-muted-foreground/60 tracking-wider">
              {adj.currentIndex + 1}/{adj.total}
            </div>
          </div>

          {loading && (
            <div className="text-center py-16 font-mono text-sm text-muted-foreground">
              Carregando...
            </div>
          )}

          {error && (
            <div className="text-center py-16 font-mono text-base text-muted-foreground">
              <p className="text-2xl text-muted-foreground/50 mb-4">&#9671;</p>
              <p>Conteudo ainda nao disponivel.</p>
              <p className="text-muted-foreground/50 mt-2">Em breve</p>
            </div>
          )}

          {!loading && !error && (
            <>
              <article
                className="lesson-content"
                dangerouslySetInnerHTML={{ __html: html }}
              />

              {quiz && (
                <QuizSection
                  questions={quiz}
                  courseId={courseId}
                  moduleId={moduleId}
                  lessonId={lessonId}
                  alreadyDone={isCompleted}
                  onComplete={handleQuizComplete}
                />
              )}
            </>
          )}

          {/* Footer */}
          <div className="max-w-[var(--reading-max)] mt-16 pt-8 border-t border-border">
            {!hasQuizGate && (
              isCompleted ? (
                <div className="w-full py-4 font-mono text-sm font-medium tracking-[0.08em] uppercase text-success bg-success/5 border border-success/20 rounded-sm flex items-center justify-center gap-3">
                  &#10003; Aula concluida
                </div>
              ) : (
                <button
                  onClick={handleComplete}
                  className="w-full py-4 font-mono text-sm font-medium tracking-[0.08em] uppercase text-foreground bg-card border border-border rounded-sm hover:bg-primary/5 hover:border-primary hover:text-primary transition-all cursor-pointer flex items-center justify-center gap-3"
                >
                  Marcar como concluida
                </button>
              )
            )}

            <div className="flex justify-between items-stretch mt-6 gap-4 max-md:flex-col">
              {adj.prev ? (
                <Link
                  href={`/${adj.prev.courseId}/${adj.prev.moduleId}/${adj.prev.lessonId}`}
                  className="font-mono text-xs text-muted-foreground tracking-wider flex flex-col gap-1 px-5 py-4 border border-border/50 rounded-sm hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all max-w-[50%] max-md:max-w-full"
                >
                  <span className="text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground/50">&larr; Anterior</span>
                  <span className="font-sans text-sm leading-snug">{adj.prev.lessonNumber} {adj.prev.lessonTitle}</span>
                </Link>
              ) : <span />}

              {adj.next ? (
                <Link
                  href={`/${adj.next.courseId}/${adj.next.moduleId}/${adj.next.lessonId}`}
                  className="font-mono text-xs text-muted-foreground tracking-wider flex flex-col gap-1 px-5 py-4 border border-border/50 rounded-sm hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all max-w-[50%] max-md:max-w-full ml-auto max-md:ml-0 text-right max-md:text-left"
                >
                  <span className="text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground/50">Proxima &rarr;</span>
                  <span className="font-sans text-sm leading-snug">{adj.next.lessonNumber} {adj.next.lessonTitle}</span>
                </Link>
              ) : (courseComplete || isCompleted) ? (
                <Link
                  href={`/certificado/${courseId}`}
                  className="font-mono text-xs text-muted-foreground tracking-wider flex flex-col gap-1 px-5 py-4 border border-border/50 rounded-sm hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all max-w-[50%] max-md:max-w-full ml-auto max-md:ml-0 text-right max-md:text-left"
                >
                  <span className="text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground/50">Concluir &rarr;</span>
                  <span className="font-sans text-sm leading-snug">Ver certificado</span>
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
