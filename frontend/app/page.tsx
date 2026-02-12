'use client'

import Link from 'next/link'
import { COURSES } from '@/lib/courses'
import { useProgress } from '@/context/progress-context'
import { getFlatLessons, getCourseTime, formatTime } from '@/lib/helpers'
import { cn } from '@/lib/utils'

export default function CatalogPage() {
  const progress = useProgress()

  return (
    <div className="max-w-[var(--content-max)] mx-auto px-8 pt-16 pb-20 max-md:px-5 max-md:pt-10 max-md:pb-16">
      <div className="mb-16 animate-fade-in-up">
        <div className="font-mono text-xs font-medium tracking-[0.15em] uppercase text-primary mb-4">
          Plataforma de Cursos
        </div>
        <h1 className="font-display text-[2.6rem] max-md:text-[2rem] font-normal text-foreground leading-[1.15] max-w-[550px]">
          Agronegocio Financeiro
        </h1>
        <p className="text-lg text-muted-foreground mt-4 max-w-[500px] leading-relaxed">
          Cursos especializados sobre o sistema de financiamento do agronegocio brasileiro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fit,minmax(380px,1fr))] gap-6">
        {Object.keys(COURSES).map((cid, i) => {
          const course = COURSES[cid]
          const prog = progress.getCourseProgress(cid)
          const flat = getFlatLessons(cid)
          const hasContent = cid === 'curso-01' || cid === 'curso-02'
          const isComplete = progress.isCourseComplete(cid)
          const pct = prog.total > 0 ? Math.round((prog.completed / prog.total) * 100) : 0
          const locked = !hasContent
          const totalTime = getCourseTime(cid)

          if (locked) {
            return (
              <div
                key={cid}
                className={cn(
                  "bg-card border border-border rounded-md p-10 max-md:p-8 opacity-50 cursor-default",
                  "animate-fade-in-up"
                )}
                style={{ animationDelay: `${(i + 1) * 50}ms` }}
                aria-disabled="true"
              >
                <CourseCardContent course={course} flat={flat} totalTime={totalTime} />
                <div className="font-mono text-sm text-muted-foreground">Em breve</div>
              </div>
            )
          }

          return (
            <Link
              key={cid}
              href={isComplete ? `/certificado/${cid}` : `/${cid}`}
              className={cn(
                "bg-card border border-border rounded-md p-10 max-md:p-8 cursor-pointer",
                "transition-all duration-500 hover:border-primary/30 hover:shadow-[0_2px_20px_rgba(30,77,56,0.06)]",
                "dark:hover:shadow-[0_2px_24px_rgba(0,0,0,0.3)]",
                "group block animate-fade-in-up"
              )}
              style={{ animationDelay: `${(i + 1) * 50}ms` }}
            >
              <CourseCardContent course={course} flat={flat} totalTime={totalTime} />
              <div className="mb-6">
                <div className="w-full h-1 bg-border/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="font-mono text-xs text-muted-foreground mt-2">
                  {prog.completed} de {prog.total} concluidas{isComplete ? ' — Completo' : ''}
                </div>
              </div>
              <div className="font-mono text-sm font-medium text-primary tracking-wider inline-flex items-center gap-2 group-hover:gap-3 transition-all duration-200">
                {isComplete ? 'Ver certificado' : prog.completed > 0 ? 'Continuar' : 'Comecar'}{' '}
                <span>&rarr;</span>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function CourseCardContent({
  course,
  flat,
  totalTime,
}: {
  course: { level: string; title: string; subtitle: string; description: string; modules: { length: number }[] }
  flat: { length: number }[]
  totalTime: number
}) {
  return (
    <>
      <div className="mb-6">
        <span className="font-mono text-xs font-medium tracking-[0.1em] uppercase inline-block px-3 py-1 rounded-sm bg-primary/5 text-primary border border-primary/20">
          {course.level}
        </span>
      </div>
      <div className="font-display text-[1.6rem] font-medium text-foreground leading-[1.25] mb-1">
        {course.title}
      </div>
      <div className="font-display text-[1.3rem] font-normal text-muted-foreground mb-6">
        {course.subtitle}
      </div>
      <p className="text-[0.9rem] text-muted-foreground leading-relaxed mb-6">
        {course.description}
      </p>
      <div className="font-mono text-sm text-muted-foreground tracking-wider mb-6">
        {course.modules.length} modulos &middot; {flat.length} aulas &middot; ~{formatTime(totalTime)}
      </div>
    </>
  )
}
