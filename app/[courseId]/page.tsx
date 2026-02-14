'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { COURSES } from '@/lib/courses'
import { useProgress } from '@/context/progress-context'
import { getFlatLessons, getCourseTime, formatTime, getReadingTime } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { Check, Clock, BookOpen, Layers, ChevronDown, ChevronRight, ArrowRight, Award } from 'lucide-react'

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  const course = COURSES[courseId]
  if (!course) notFound()

  const progress = useProgress()
  const prog = progress.getCourseProgress(courseId)
  const flat = getFlatLessons(courseId)
  const isComplete = progress.isCourseComplete(courseId)
  const totalTime = getCourseTime(courseId)
  const next = progress.getNextLesson(courseId)
  const progressPercentage = prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0

  const [openModule, setOpenModule] = useState<string | null>('modulo-01')
  const [activeTab, setActiveTab] = useState<string>('sobre')

  const toggleModule = (moduleId: string) => {
    setOpenModule(openModule === moduleId ? null : moduleId)
  }

  const totalLessons = flat.length
  const totalModules = course.modules.length

  return (
    <div className="w-full">
      {/* ===== A. HERO SECTION ===== */}
      <section className="relative min-h-[500px] max-md:min-h-[450px] w-full overflow-hidden animate-fade-in-up">
        {/* Background image */}
        <Image
          src={course.image}
          alt={course.title}
          fill
          priority
          className="object-cover"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-transparent dark:via-background/90 dark:to-background/40 max-md:bg-background/90 max-md:bg-none" />
        {/* Mobile: full overlay */}
        <div className="absolute inset-0 hidden max-md:block bg-background/90" />

        {/* Content */}
        <div className="relative z-10 max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 flex items-center min-h-[500px] max-md:min-h-[450px]">
          <div className="w-[60%] max-md:w-full py-16 max-md:py-12">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">
                  Cursos
                </Link>
                <span>&gt;</span>
                <span className="text-foreground">{course.title}</span>
              </div>
            </nav>

            {/* Level badge */}
            <div className="mb-4">
              <span className="font-mono text-xs tracking-widest uppercase bg-primary/15 text-primary border border-primary/25 px-3 py-1 rounded-full inline-block">
                {course.level}
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-5xl max-md:text-3xl font-bold text-foreground leading-[1.1] mb-3">
              {course.title}
            </h1>

            {/* Subtitle */}
            <p className="font-display text-xl text-muted-foreground mb-6">
              {course.subtitle}
            </p>

            {/* Description */}
            <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-[540px]">
              {course.description}
            </p>

            {/* CTA Button */}
            {next && (
              <Link
                href={`/${next.courseId}/${next.moduleId}/${next.lessonId}`}
                className="inline-flex items-center justify-center gap-3 px-8 py-4 max-md:w-full bg-primary-foreground text-primary font-semibold text-base rounded-lg hover:bg-primary-foreground/90 transition-all shadow-lg mb-6 border border-border"
              >
                {prog.completed > 0 ? 'Continuar de onde parou' : 'Começar agora'}
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}

            {/* Progress bar */}
            <div className="max-w-[400px] space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">Progresso do curso</span>
                <span className="font-mono text-xs text-muted-foreground">
                  {prog.completed}/{prog.total} aulas &bull; {progressPercentage}%
                </span>
              </div>
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== B. STATS BAR ===== */}
      <section className="animate-fade-in-up" style={{ animationDelay: '80ms' }}>
        <div className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 -mt-8 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-3 shadow-sm">
              <Clock className="w-5 h-5 text-primary shrink-0" />
              <div>
                <div className="font-mono text-xs text-muted-foreground uppercase tracking-wide">Duração</div>
                <div className="font-semibold text-foreground">~{formatTime(totalTime)}</div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-3 shadow-sm">
              <BookOpen className="w-5 h-5 text-primary shrink-0" />
              <div>
                <div className="font-mono text-xs text-muted-foreground uppercase tracking-wide">Aulas</div>
                <div className="font-semibold text-foreground">{totalLessons} aulas</div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-3 shadow-sm">
              <Layers className="w-5 h-5 text-primary shrink-0" />
              <div>
                <div className="font-mono text-xs text-muted-foreground uppercase tracking-wide">Módulos</div>
                <div className="font-semibold text-foreground">{totalModules} módulos</div>
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-3 shadow-sm">
              <Award className="w-5 h-5 text-primary shrink-0" />
              <div>
                <div className="font-mono text-xs text-muted-foreground uppercase tracking-wide">Conclusão</div>
                <div className="font-semibold text-foreground">Certificado</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== C. TAB NAVIGATION ===== */}
      <nav className="sticky top-[56px] z-30 bg-background/80 backdrop-blur-md border-b border-border mt-12">
        <div className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 flex items-center gap-8">
          {[
            { id: 'sobre', label: 'Sobre' },
            { id: 'conteudo', label: 'Conteúdo' },
            { id: 'certificado', label: 'Certificado' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'font-mono text-sm tracking-wide py-4 border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ===== TAB CONTENT ===== */}
      {activeTab === 'sobre' && (
        <div className="animate-fade-in-up">
          {/* O que voce vai aprender */}
          <section>
            <div className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 pt-16 pb-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-8">
                O que você vai aprender
              </h2>
              <div className="border border-border rounded-xl p-6 bg-card">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.modules.map((mod) => (
                    <div
                      key={mod.id}
                      className="flex items-start gap-3 p-4 rounded-lg hover:bg-secondary/50 transition-colors"
                    >
                      <div className="mt-0.5 shrink-0">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-primary" />
                        </div>
                      </div>
                      <p className="text-sm text-foreground leading-relaxed">
                        {mod.objective}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </div>
      )}

      {activeTab === 'conteudo' && (
        <div className="animate-fade-in-up">
          <section>
            <div className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 py-12">
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Conteúdo do curso
              </h2>

              {/* Summary line */}
              <p className="font-mono text-sm text-muted-foreground mb-8">
                {totalModules} módulos &bull; {totalLessons} aulas &bull; ~{formatTime(totalTime)} de conteúdo
              </p>

              {/* Accordion - keep exact same logic */}
              <div className="space-y-3">
                {course.modules.map((mod, mi) => {
                  const mp = progress.getModuleProgress(courseId, mod.id)
                  const isOpen = openModule === mod.id
                  const moduleNumber = String(mi + 1).padStart(2, '0')

                  let moduleTotalTime = 0
                  mod.lessons.forEach((lesson) => {
                    const timeKey = `${courseId}/${mod.id}/${lesson.id}`
                    moduleTotalTime += getReadingTime(timeKey)
                  })

                  return (
                    <div
                      key={mod.id}
                      className="border border-border rounded-lg overflow-hidden bg-card transition-all hover:border-primary/30"
                    >
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="w-full px-6 py-5 max-md:px-4 max-md:py-4 flex items-center gap-4 max-md:gap-3 hover:bg-secondary/50 transition-colors text-left"
                      >
                        <div className="flex-1 flex items-center gap-4">
                          <span className="font-mono text-lg font-semibold text-primary shrink-0">
                            {moduleNumber}
                          </span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground mb-1">
                              {mod.title}
                            </h3>
                            <div className="flex items-center gap-4 max-md:gap-2 text-xs text-muted-foreground font-mono flex-wrap">
                              <span>{mod.lessons.length} aulas</span>
                              <span className="max-md:hidden">&bull;</span>
                              <span>~{moduleTotalTime}min</span>
                              <span className="max-md:hidden">&bull;</span>
                              <span className={cn(
                                mp.completed === mp.total && mp.total > 0 && 'text-primary font-medium'
                              )}>
                                {mp.completed}/{mp.total} concluídas
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-muted-foreground">
                          {isOpen ? (
                            <ChevronDown className="w-5 h-5" />
                          ) : (
                            <ChevronRight className="w-5 h-5" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-border bg-secondary/20">
                          {mod.lessons.map((lesson, li) => {
                            const done = progress.isCompleted(courseId, mod.id, lesson.id)
                            const timeKey = `${courseId}/${mod.id}/${lesson.id}`
                            const time = getReadingTime(timeKey)

                            return (
                              <Link
                                key={lesson.id}
                                href={`/${courseId}/${mod.id}/${lesson.id}`}
                                className={cn(
                                  'flex items-center gap-4 px-6 py-4 hover:bg-secondary/70 transition-all group',
                                  li > 0 && 'border-t border-border/50'
                                )}
                              >
                                <div className={cn(
                                  'w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',
                                  done
                                    ? 'bg-primary border-primary'
                                    : 'border-border group-hover:border-primary/50'
                                )}>
                                  {done && <Check className="w-3 h-3 text-primary-foreground" />}
                                </div>
                                <span className="font-mono text-sm text-muted-foreground shrink-0 w-10">
                                  {lesson.number}
                                </span>
                                <span className={cn(
                                  'flex-1 text-sm transition-colors',
                                  done
                                    ? 'text-muted-foreground'
                                    : 'text-foreground group-hover:text-primary'
                                )}>
                                  {lesson.title}
                                </span>
                                <span className="font-mono text-xs text-muted-foreground shrink-0">
                                  ~{time}min
                                </span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'certificado' && (
        <div className="animate-fade-in-up">
          <section>
            <div className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 py-16 pb-24">
              <div className="border border-border rounded-xl p-8 max-md:p-6 bg-card">
                {isComplete ? (
                  <div className="flex items-center justify-between max-md:flex-col max-md:items-start gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Award className="w-7 h-7 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-display text-2xl font-bold text-foreground mb-1">
                          Parabéns!
                        </h3>
                        <p className="text-muted-foreground">
                          Você concluiu este curso com sucesso. Seu certificado está disponível.
                        </p>
                      </div>
                    </div>
                    <Link
                      href={`/certificado/${courseId}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all shadow-md shrink-0"
                    >
                      <Award className="w-4 h-4" />
                      Ver certificado
                    </Link>
                  </div>
                ) : (
                  <div className="text-center max-w-md mx-auto py-4">
                    <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-6">
                      <Award className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                      Certificado de conclusão
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Complete todas as aulas e questionários para receber seu certificado de conclusão.
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Seu progresso</span>
                        <span className="font-mono text-sm font-medium text-foreground">{progressPercentage}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {prog.completed} de {prog.total} aulas concluídas
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
