'use client'

import Link from 'next/link'
import { COURSES } from '@/lib/courses'
import { useProgress } from '@/context/progress-context'
import { getFlatLessons, getCourseTime, formatTime } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { Check, Clock, BookOpen, BarChart3, ArrowRight, GraduationCap } from 'lucide-react'

export default function CatalogPage() {
  const progress = useProgress()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-[var(--content-max)] mx-auto px-8 pt-8 pb-16 max-md:px-5 max-md:pt-6 max-md:pb-12">
        <div className="bg-gradient-to-br from-[var(--green-700)] to-[var(--green-600)] rounded-2xl px-12 py-16 max-md:px-8 max-md:py-12 text-white animate-fade-in-up">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl max-md:text-4xl font-bold mb-6 leading-tight">
              Conhecimento especializado, do fundamento a pratica
            </h1>
            <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-2xl">
              Trilhas completas em agronegocio financeiro e nanotecnologia cosmetica. Conteudo tecnico, progressivo e aplicavel — do nivel introdutorio ao avancado.
            </p>
            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <p className="text-white/95">
                  4 cursos com 72 aulas, questionarios e certificado de conclusao
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <p className="text-white/95">
                  Agro financeiro: credito rural, CPR, CRA, securitizacao e tokenizacao
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <p className="text-white/95">
                  Nanotecnologia cosmetica: nanomateriais, nanovetores, encapsulamento e permeacao
                </p>
              </div>
            </div>
            <Link
              href="/curso-01"
              className="inline-flex items-center gap-2 bg-white text-[var(--green-700)] px-8 py-3.5 rounded-lg font-semibold hover:bg-white/95 transition-all duration-200 hover:gap-3 shadow-lg"
            >
              Comecar a aprender
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className="max-w-[var(--content-max)] mx-auto px-8 pb-20 max-md:px-5 max-md:pb-16">
        <div className="mb-10 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="font-display text-3xl max-md:text-2xl font-bold text-foreground mb-2">
            Todos os cursos
          </h2>
          <p className="text-muted-foreground">
            Escolha uma trilha e comece agora
          </p>
        </div>

        <div className="space-y-6">
          {Object.keys(COURSES).map((cid, i) => {
            const course = COURSES[cid]
            const prog = progress.getCourseProgress(cid)
            const flat = getFlatLessons(cid)
            const hasContent = cid === 'curso-01' || cid === 'curso-02' || cid === 'curso-03' || cid === 'curso-04'
            const isComplete = progress.isCourseComplete(cid)
            const pct = prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0
            const locked = !hasContent
            const totalTime = getCourseTime(cid)

            const levelColors = {
              Introdutorio: 'bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400',
              Avancado: 'bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400',
            }

            if (locked) {
              return (
                <div
                  key={cid}
                  className={cn(
                    "bg-card border border-border rounded-xl overflow-hidden opacity-50 cursor-not-allowed",
                    "animate-fade-in-up"
                  )}
                  style={{ animationDelay: `${(i + 2) * 50}ms` }}
                >
                  <div className="flex max-md:flex-col">
                    {/* Colored accent bar */}
                    <div className="w-1.5 max-md:w-full max-md:h-1.5 bg-gradient-to-b max-md:bg-gradient-to-r from-gray-400 to-gray-300 flex-shrink-0" />

                    {/* Content */}
                    <div className="flex-1 p-8 max-md:p-6">
                      {/* Header badges */}
                      <div className="flex items-center gap-3 mb-4 flex-wrap">
                        <span className="font-mono text-xs font-medium tracking-wider uppercase text-muted-foreground">
                          {cid.startsWith('curso-0') && (cid === 'curso-01' || cid === 'curso-02') ? 'Agronegocio Financeiro' : 'Nanotecnologia Cosmetica'}
                        </span>
                        <span className={cn(
                          "font-mono text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full",
                          levelColors[course.level as keyof typeof levelColors] || levelColors.Introdutorio
                        )}>
                          {course.level}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-2xl max-md:text-xl font-bold text-foreground mb-2">
                        {course.title}
                      </h3>

                      {/* Description */}
                      <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-2">
                        {course.description}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground flex-wrap">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          <span>{course.modules.length} modulos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <GraduationCap className="w-4 h-4" />
                          <span>{flat.length} aulas</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>~{formatTime(totalTime)}</span>
                        </div>
                      </div>

                      {/* Coming soon label */}
                      <div className="inline-flex items-center gap-2 font-mono text-sm font-medium text-muted-foreground">
                        Em breve
                      </div>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <Link
                key={cid}
                href={isComplete ? `/certificado/${cid}` : `/${cid}`}
                className={cn(
                  "bg-card border border-border rounded-xl overflow-hidden",
                  "transition-all duration-300 hover:border-primary/40 hover:shadow-lg",
                  "group block animate-fade-in-up"
                )}
                style={{ animationDelay: `${(i + 2) * 50}ms` }}
              >
                <div className="flex max-md:flex-col">
                  {/* Colored accent bar */}
                  <div className={cn(
                    "w-1.5 max-md:w-full max-md:h-1.5 flex-shrink-0 transition-all duration-300",
                    course.level === 'Introdutorio'
                      ? "bg-gradient-to-b max-md:bg-gradient-to-r from-green-500 to-green-600"
                      : "bg-gradient-to-b max-md:bg-gradient-to-r from-blue-500 to-blue-600"
                  )} />

                  {/* Content */}
                  <div className="flex-1 p-8 max-md:p-6">
                    {/* Header badges */}
                    <div className="flex items-center gap-3 mb-4 flex-wrap">
                      <span className="font-mono text-xs font-medium tracking-wider uppercase text-muted-foreground">
                        {cid.startsWith('curso-0') && (cid === 'curso-01' || cid === 'curso-02') ? 'Agronegocio Financeiro' : 'Nanotecnologia Cosmetica'}
                      </span>
                      <span className={cn(
                        "font-mono text-xs font-semibold tracking-wide uppercase px-3 py-1 rounded-full",
                        levelColors[course.level as keyof typeof levelColors] || levelColors.Introdutorio
                      )}>
                        {course.level}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-display text-2xl max-md:text-xl font-bold text-foreground mb-2">
                      {course.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground leading-relaxed mb-6 line-clamp-2">
                      {course.description}
                    </p>

                    {/* Metadata */}
                    <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{course.modules.length} modulos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>{flat.length} aulas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>~{formatTime(totalTime)}</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">
                          Progresso
                        </span>
                        <span className="text-xs font-semibold text-foreground">
                          {pct}%
                        </span>
                      </div>
                      <div className="w-full h-2 bg-border/50 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            course.level === 'Introdutorio' ? "bg-green-500" : "bg-blue-500"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1.5">
                        {prog.completed} de {prog.total} aulas concluidas
                        {isComplete && ' — Completo'}
                      </div>
                    </div>

                    {/* Action button */}
                    <div className={cn(
                      "inline-flex items-center gap-2 font-semibold px-6 py-2.5 rounded-lg transition-all duration-200",
                      "group-hover:gap-3",
                      isComplete
                        ? "bg-primary/10 text-primary border border-primary/20"
                        : prog.completed > 0
                        ? "bg-primary text-white"
                        : "bg-primary text-white"
                    )}>
                      {isComplete ? (
                        <>
                          Ver certificado
                          <BarChart3 className="w-4 h-4" />
                        </>
                      ) : prog.completed > 0 ? (
                        <>
                          Continuar
                          <ArrowRight className="w-4 h-4" />
                        </>
                      ) : (
                        <>
                          Comecar
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
