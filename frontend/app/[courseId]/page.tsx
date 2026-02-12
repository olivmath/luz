'use client'

import { use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { COURSES } from '@/lib/courses'
import { useProgress } from '@/context/progress-context'
import { getFlatLessons, getCourseTime, formatTime, getReadingTime } from '@/lib/helpers'
import { cn } from '@/lib/utils'

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  const course = COURSES[courseId]
  if (!course) notFound()

  const progress = useProgress()
  const prog = progress.getCourseProgress(courseId)
  const flat = getFlatLessons(courseId)
  const isComplete = progress.isCourseComplete(courseId)
  const totalTime = getCourseTime(courseId)

  return (
    <div className="max-w-[900px] mx-auto px-8 pt-12 pb-20 max-md:px-5 max-md:pt-8 max-md:pb-16">
      <Link
        href="/"
        className="font-mono text-sm text-muted-foreground tracking-wider inline-flex items-center gap-2 hover:text-primary transition-colors animate-fade-in-up"
      >
        &larr; Cursos
      </Link>

      <div className="mt-6 mb-12 pb-10 border-b border-border animate-fade-in-up" style={{ animationDelay: '50ms' }}>
        <div className="mb-4">
          <span className="font-mono text-xs font-medium tracking-[0.1em] uppercase inline-block px-3 py-1 rounded-sm bg-primary/5 text-primary border border-primary/20">
            {course.level}
          </span>
        </div>
        <h1 className="font-display text-[2rem] max-md:text-[2rem] font-medium text-foreground leading-[1.2] mb-1">
          {course.title}
        </h1>
        <div className="font-display text-[1.3rem] font-normal text-muted-foreground mb-6">
          {course.subtitle}
        </div>
        <p className="text-base text-muted-foreground leading-[1.7] max-w-[600px] mb-6">
          {course.description}
        </p>
        <div className="flex gap-8 font-mono text-sm text-muted-foreground">
          <span><strong className="text-foreground font-semibold">{course.modules.length}</strong> modulos</span>
          <span><strong className="text-foreground font-semibold">{flat.length}</strong> aulas</span>
          <span><strong className="text-foreground font-semibold">~{formatTime(totalTime)}</strong> total</span>
          <span><strong className="text-foreground font-semibold">{prog.completed}</strong> concluidas</span>
        </div>
      </div>

      {isComplete && (
        <div
          className="w-full p-6 px-8 bg-primary/5 border border-primary/20 rounded-md flex items-center justify-between flex-wrap gap-4 mb-8 animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <span className="font-mono text-sm text-primary tracking-wider font-medium">
            &#9670; Curso concluido com sucesso
          </span>
          <Link
            href={`/certificado/${courseId}`}
            className="font-mono text-sm font-medium px-6 py-3 rounded-sm border border-primary/20 text-primary hover:bg-primary/5 hover:border-primary transition-all"
          >
            Ver certificado
          </Link>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {course.modules.map((mod, mi) => {
          const mp = progress.getModuleProgress(courseId, mod.id)
          const modComplete = mp.completed === mp.total

          return (
            <div
              key={mod.id}
              className="bg-card border border-border rounded-md px-10 py-8 max-md:px-6 max-md:py-6 animate-fade-in-up"
              style={{ animationDelay: `${Math.min(mi + 2, 6) * 50}ms` }}
            >
              <div className="flex items-start gap-8 max-md:gap-4 mb-6">
                <div className="font-mono text-[2.2rem] max-md:text-[1.6rem] font-light text-border leading-none tracking-tight shrink-0 w-[55px] max-md:w-[38px]">
                  {String(mi + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <div className="font-display text-[1.3rem] font-semibold text-foreground leading-[1.3] mb-1">
                    {mod.title}
                  </div>
                  <div className="text-[0.9rem] text-muted-foreground leading-relaxed">
                    {mod.objective}
                  </div>
                </div>
                <div className={cn(
                  "font-mono text-xs text-muted-foreground shrink-0 pt-1 whitespace-nowrap",
                  modComplete && "text-success font-medium"
                )}>
                  {mp.completed}/{mp.total}{modComplete ? ' \u2713' : ''}
                </div>
              </div>

              <div className="flex flex-col pl-[calc(55px+2rem)] max-md:pl-[calc(38px+1rem)]">
                {mod.lessons.map((lesson, li) => {
                  const done = progress.isCompleted(courseId, mod.id, lesson.id)
                  const timeKey = `${courseId}/${mod.id}/${lesson.id}`
                  const time = getReadingTime(timeKey)

                  return (
                    <Link
                      key={lesson.id}
                      href={`/${courseId}/${mod.id}/${lesson.id}`}
                      className={cn(
                        "flex items-center gap-4 py-3 px-4 rounded-sm transition-colors",
                        "hover:bg-secondary -mx-4 max-md:-mx-2",
                        li > 0 && "border-t border-border/50",
                        done && "opacity-75"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full border-[1.5px] border-border flex items-center justify-center text-[0.6rem] shrink-0 transition-all",
                        done && "bg-success border-success text-white"
                      )}>
                        {done ? '\u2713' : ''}
                      </div>
                      <div className="font-mono text-sm text-muted-foreground shrink-0 w-[30px]">
                        {lesson.number}
                      </div>
                      <div className={cn(
                        "text-[0.9rem] text-foreground flex-1",
                        done && "text-muted-foreground"
                      )}>
                        {lesson.title}
                      </div>
                      <div className="font-mono text-xs text-muted-foreground shrink-0">
                        ~{time}min
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {!isComplete && (() => {
        const next = progress.getNextLesson(courseId)
        if (!next) return null
        return (
          <div className="mt-10 pt-8 border-t border-border animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Link
              href={`/${next.courseId}/${next.moduleId}/${next.lessonId}`}
              className="font-mono text-sm font-medium px-6 py-3 rounded-sm bg-primary text-primary-foreground border border-primary hover:bg-primary/90 transition-all inline-flex items-center gap-2"
            >
              {prog.completed > 0 ? 'Continuar' : 'Comecar'} &mdash; Aula {next.lesson.number} &rarr;
            </Link>
          </div>
        )
      })()}
    </div>
  )
}
