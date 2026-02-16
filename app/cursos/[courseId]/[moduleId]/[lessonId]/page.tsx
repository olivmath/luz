'use client'

import { use, useState, useCallback, useEffect, useRef } from 'react'
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
import { Menu, X, BookOpen, CheckCircle2, Lock, ArrowRight, CreditCard } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { CheckoutModal } from '@/components/checkout-modal'

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
  const { user } = useUser()
  const router = useRouter()
  const adj = getAdjacentLessons(courseId, moduleId, lessonId)
  const done = progress.isCompleted(courseId, moduleId, lessonId)
  const { html, quiz, readingTime, loading, error } = useMarkdown(courseId, moduleId, lessonId)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [localDone, setLocalDone] = useState(done)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const searchParams = useSearchParams()
  const highlightTerm = searchParams.get('term')
  const articleRef = useRef<HTMLElement>(null)

  const isFreeLesson = moduleId === 'modulo-01' && lessonId === 'aula-01'
  const isAuthorized = user?.publicMetadata?.authorized === true
  const hasAccess = isFreeLesson || isAuthorized

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

  useEffect(() => {
    if (!highlightTerm || loading || error || !articleRef.current) return

    const escaped = highlightTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`(${escaped})`, 'gi')
    const walker = document.createTreeWalker(articleRef.current, NodeFilter.SHOW_TEXT)
    const matches: { node: Text; index: number }[] = []

    while (walker.nextNode()) {
      const textNode = walker.currentNode as Text
      if (regex.test(textNode.textContent || '')) {
        matches.push({ node: textNode, index: 0 })
      }
      regex.lastIndex = 0
    }

    for (const { node } of matches) {
      const text = node.textContent || ''
      const parts = text.split(regex)
      if (parts.length <= 1) continue

      const fragment = document.createDocumentFragment()
      for (const part of parts) {
        if (regex.test(part)) {
          const mark = document.createElement('mark')
          mark.className = 'term-highlight'
          mark.textContent = part
          fragment.appendChild(mark)
        } else {
          fragment.appendChild(document.createTextNode(part))
        }
        regex.lastIndex = 0
      }
      node.parentNode?.replaceChild(fragment, node)
    }

    // Scroll to first highlight
    const firstMark = articleRef.current.querySelector('.term-highlight')
    if (firstMark) {
      setTimeout(() => {
        firstMark.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 300)
    }
  }, [highlightTerm, loading, error, html])

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
        {/* Main content - Order 1 */}
        <div className="flex-1 min-w-0 px-12 py-10 pb-20 max-lg:max-w-full max-lg:px-6 max-lg:py-6 max-lg:pb-12 max-md:px-4 max-sm:px-3 order-1">
          {/* Topbar with Tabs */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="hidden max-lg:flex items-center gap-2 font-mono text-sm text-muted-foreground px-3 py-2 border border-border rounded-sm bg-card hover:border-primary hover:text-primary transition-all cursor-pointer"
                aria-label="Abrir menu de aulas"
              >
                <Menu className="w-4 h-4" /> Aulas
              </button>
              <div className="font-mono text-xs text-muted-foreground tracking-wider max-lg:hidden">
                {loading ? `Aula ${lesson.number}` : `Aula ${lesson.number} \u00b7 ~${readingTime} min de leitura`}
              </div>
              <div className="font-mono text-xs text-muted-foreground/60 tracking-wider">
                {adj.currentIndex + 1}/{adj.total}
              </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center gap-6 border-b border-border">
              <div className="flex items-center gap-2 px-1 pb-3 border-b-2 border-primary text-primary cursor-pointer">
                <BookOpen className="w-4 h-4" />
                <span className="font-mono text-sm font-medium tracking-wide">Aula Escrita</span>
              </div>
            </div>
          </div>

          {loading && (
            <div className="text-center py-16 font-mono text-sm text-muted-foreground">
              Carregando...
            </div>
          )}

          {error && hasAccess && (
            <div className="text-center py-16 font-mono text-sm text-muted-foreground">
              Erro ao carregar conteúdo.
            </div>
          )}

          {!hasAccess && (
            <div className="fixed inset-0 z-[1100] flex items-center justify-center">
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
              <div className="relative bg-background border border-border rounded-2xl shadow-2xl w-full max-w-[440px] mx-4 animate-fade-in-up">
                <div className="p-8 text-center">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
                    <Lock className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                    Conteúdo exclusivo
                  </h2>
                  <p className="text-sm text-muted-foreground mb-2">
                    A primeira aula de cada curso é gratuita. Para acessar todas as aulas, assine o plano anual.
                  </p>
                  <p className="font-mono text-xs text-muted-foreground/60 mb-6">
                    Aula {lesson.number} · {mod.title}
                  </p>

                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => setCheckoutOpen(true)}
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4" />
                      Assinar agora
                    </button>
                    <button
                      onClick={() => router.push(`/cursos/${courseId}/modulo-01/aula-01`)}
                      className="w-full inline-flex items-center justify-center gap-2 border border-border px-6 py-3 rounded-lg font-medium text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-all cursor-pointer"
                    >
                      Ver aula gratuita
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => router.back()}
                      className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer mt-1"
                    >
                      Voltar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!loading && !error && (
            <>
              <article
                ref={articleRef}
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
          {!error && !loading && <div className="max-w-[var(--reading-max)] mt-16 pt-8 border-t border-border">
            {!hasQuizGate && (
              isCompleted ? (
                <div className="w-full py-4 font-mono text-sm font-medium tracking-[0.08em] uppercase text-success bg-success/5 border border-success/20 rounded-sm flex items-center justify-center gap-3">
                  <CheckCircle2 className="w-4 h-4" />
                  Aula concluída
                </div>
              ) : (
                <button
                  onClick={handleComplete}
                  className="w-full py-4 font-mono text-sm font-medium tracking-[0.08em] uppercase text-white bg-success border-none rounded-sm hover:bg-success/90 transition-all cursor-pointer flex items-center justify-center gap-3"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Marcar como concluída
                </button>
              )
            )}

            <div className="flex justify-between items-stretch mt-6 gap-4 max-md:flex-col">
              {adj.prev ? (
                <Link
                  href={`/cursos/${adj.prev.courseId}/${adj.prev.moduleId}/${adj.prev.lessonId}`}
                  className="font-mono text-xs text-muted-foreground tracking-wider flex flex-col gap-1 px-5 py-4 border border-border/50 rounded-sm hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all max-w-[50%] max-md:max-w-full"
                >
                  <span className="text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground/50">&larr; Anterior</span>
                  <span className="font-sans text-sm leading-snug">{adj.prev.lessonNumber} {adj.prev.lessonTitle}</span>
                </Link>
              ) : <span />}

              {adj.next ? (
                <Link
                  href={`/cursos/${adj.next.courseId}/${adj.next.moduleId}/${adj.next.lessonId}`}
                  className="font-mono text-xs text-muted-foreground tracking-wider flex flex-col gap-1 px-5 py-4 border border-border/50 rounded-sm hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all max-w-[50%] max-md:max-w-full ml-auto max-md:ml-0 text-right max-md:text-left"
                >
                  <span className="text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground/50">Próxima &rarr;</span>
                  <span className="font-sans text-sm leading-snug">{adj.next.lessonNumber} {adj.next.lessonTitle}</span>
                </Link>
              ) : (courseComplete || isCompleted) ? (
                <Link
                  href={`/certificados/${courseId}`}
                  className="font-mono text-xs text-muted-foreground tracking-wider flex flex-col gap-1 px-5 py-4 border border-border/50 rounded-sm hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all max-w-[50%] max-md:max-w-full ml-auto max-md:ml-0 text-right max-md:text-left"
                >
                  <span className="text-[0.6rem] uppercase tracking-[0.1em] text-muted-foreground/50">Concluir &rarr;</span>
                  <span className="font-sans text-sm leading-snug">Ver certificado</span>
                </Link>
              ) : null}
            </div>
          </div>}
        </div>

        {/* Sidebar - Order 2 (RIGHT side) */}
        <div className={cn(
          "w-[var(--sidebar-w)] shrink-0 border-l border-border bg-sidebar sticky top-[var(--header-h)] h-[calc(100vh-var(--header-h))] overflow-y-auto sidebar-scroll order-2",
          "max-lg:fixed max-lg:top-[var(--header-h)] max-lg:right-0 max-lg:bottom-0 max-lg:z-[999] max-lg:shadow-[-4px_0_24px_rgba(0,0,0,0.08)]",
          sidebarOpen ? "max-lg:block" : "max-lg:hidden"
        )}>
          <div className="flex items-center justify-end p-6 pb-4 border-b border-border lg:hidden">
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-muted-foreground hover:text-foreground"
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
      </div>
      <CheckoutModal open={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
    </>
  )
}
