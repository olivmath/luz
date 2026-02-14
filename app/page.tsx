'use client'

import Link from 'next/link'
import { COURSES } from '@/lib/courses'
import { useProgress } from '@/context/progress-context'
import { getFlatLessons, getCourseTime, formatTime } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { Check, Clock, BookOpen, ArrowRight, GraduationCap } from 'lucide-react'

const CATEGORIES = [
  {
    label: 'Agronegócio Financeiro',
    description: 'Crédito rural, instrumentos financeiros, securitização e tokenização',
    courses: ['curso-01', 'curso-02'],
    accent: 'from-green-500 to-green-600',
    badgeColor: 'bg-green-500/10 text-green-700 dark:text-green-400',
  },
  {
    label: 'Nanotecnologia Cosmética',
    description: 'Nanomateriais, nanovetores, encapsulamento e permeação cutânea',
    courses: ['curso-03', 'curso-04'],
    accent: 'from-blue-500 to-blue-600',
    badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  },
]

export default function CatalogPage() {
  const progress = useProgress()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="max-w-[var(--content-max)] mx-auto px-8 pt-8 pb-16 max-md:px-5 max-md:pt-6 max-md:pb-12">
        <div className="bg-gradient-to-br from-[var(--green-700)] to-[var(--green-600)] rounded-2xl px-12 py-16 max-md:px-6 max-md:py-10 max-sm:px-5 max-sm:py-8 text-white animate-fade-in-up">
          <div className="max-w-3xl">
            <h1 className="font-display text-5xl max-md:text-3xl max-sm:text-[1.7rem] font-bold mb-6 max-md:mb-4 leading-tight">
              Conhecimento especializado, do fundamento à prática
            </h1>
            <p className="text-lg max-md:text-base text-white/90 mb-8 max-md:mb-6 leading-relaxed max-w-2xl">
              Trilhas completas em agronegócio financeiro e nanotecnologia cosmética. Conteúdo técnico, progressivo e aplicável — do nível introdutório ao avançado.
            </p>
            <div className="space-y-4 max-md:space-y-3 mb-10 max-md:mb-8">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <p className="text-white/95 max-md:text-sm">
                  4 cursos com 72 aulas, questionários e certificado de conclusão
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <p className="text-white/95 max-md:text-sm">
                  Agro financeiro: crédito rural, CPR, CRA, securitização e tokenização
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
                <p className="text-white/95 max-md:text-sm">
                  Nanotecnologia cosmética: nanomateriais, nanovetores, encapsulamento e permeação
                </p>
              </div>
            </div>
            <Link
              href="/curso-01"
              className="inline-flex items-center justify-center gap-2 bg-white text-[var(--green-700)] px-8 py-3.5 max-md:w-full rounded-lg font-semibold hover:bg-white/95 transition-all duration-200 hover:gap-3 shadow-lg"
            >
              Começar a aprender
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Courses by Category */}
      <div className="max-w-[var(--content-max)] mx-auto px-8 pb-20 max-md:px-5 max-md:pb-16">
        {CATEGORIES.map((cat, ci) => (
          <div key={cat.label} className="mb-16 last:mb-0 animate-fade-in-up" style={{ animationDelay: `${(ci + 1) * 100}ms` }}>
            {/* Category Header */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("w-1 h-6 rounded-full bg-gradient-to-b", cat.accent)} />
                <h2 className="font-display text-2xl max-md:text-xl font-bold text-foreground">
                  {cat.label}
                </h2>
              </div>
              <p className="text-sm text-muted-foreground ml-[1.15rem]">
                {cat.description}
              </p>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {cat.courses.map((cid, i) => {
                const course = COURSES[cid]
                if (!course) return null
                const prog = progress.getCourseProgress(cid)
                const flat = getFlatLessons(cid)
                const isComplete = progress.isCourseComplete(cid)
                const pct = prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0
                const totalTime = getCourseTime(cid)

                return (
                  <Link
                    key={cid}
                    href={isComplete ? `/certificado/${cid}` : `/${cid}`}
                    className={cn(
                      "group bg-card border border-border rounded-xl overflow-hidden flex flex-col",
                      "transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
                    )}
                    style={{ animationDelay: `${(ci + 1) * 100 + (i + 1) * 60}ms` }}
                  >
                    {/* Top accent bar */}
                    <div className={cn("h-1 w-full bg-gradient-to-r", cat.accent)} />

                    <div className="p-6 flex flex-col flex-1">
                      {/* Level badge */}
                      <div className="mb-4">
                        <span className={cn(
                          "font-mono text-[0.65rem] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full",
                          cat.badgeColor
                        )}>
                          {course.level}
                        </span>
                      </div>

                      {/* Title & Subtitle */}
                      <h3 className="font-display text-lg font-bold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="font-mono text-xs text-muted-foreground mb-3">
                        {course.subtitle}
                      </p>

                      {/* Description */}
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5 line-clamp-2 flex-1">
                        {course.description}
                      </p>

                      {/* Metadata */}
                      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground font-mono">
                        <div className="flex items-center gap-1.5">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{course.modules.length} módulos</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <GraduationCap className="w-3.5 h-3.5" />
                          <span>{flat.length} aulas</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>~{formatTime(totalTime)}</span>
                        </div>
                      </div>

                      {/* Progress bar */}
                      <div className="mb-4">
                        <div className="w-full h-1.5 bg-border/50 rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              "bg-primary"
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <span className="text-[0.65rem] text-muted-foreground font-mono">
                            {prog.completed}/{prog.total} aulas
                          </span>
                          <span className="text-[0.65rem] font-semibold text-foreground font-mono">
                            {pct}%
                          </span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex items-center gap-2 font-mono text-sm font-medium text-primary group-hover:gap-3 transition-all">
                        {isComplete ? (
                          <>Ver certificado</>
                        ) : prog.completed > 0 ? (
                          <>Continuar</>
                        ) : (
                          <>Começar curso</>
                        )}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
