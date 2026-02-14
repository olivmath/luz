'use client'

import { use, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { COURSES } from '@/lib/courses'
import { useProgress } from '@/context/progress-context'
import { getFlatLessons, getCourseTime, formatTime, getReadingTime } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { Check, Clock, BookOpen, BarChart3, ChevronDown, ChevronRight, ArrowRight, Award } from 'lucide-react'

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

  const toggleModule = (moduleId: string) => {
    setOpenModule(openModule === moduleId ? null : moduleId)
  }

  return (
    <div className="max-w-[900px] mx-auto px-8 pt-8 pb-20 max-md:px-5 max-md:pt-6 max-md:pb-16">
      {/* Breadcrumb */}
      <div className="mb-6 animate-fade-in-up">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">
            Cursos
          </Link>
          <span>&gt;</span>
          <span className="text-foreground">{course.title}</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
        {/* Level Badge */}
        <div className="mb-4">
          <span className="font-mono text-xs font-medium tracking-[0.1em] uppercase inline-block px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            {course.level}
          </span>
        </div>

        {/* Title & Subtitle */}
        <h1 className="font-display text-[2.5rem] max-md:text-[1.75rem] font-bold text-foreground leading-[1.15] mb-3">
          {course.title}
        </h1>
        <p className="font-display text-[1.25rem] max-md:text-base font-normal text-muted-foreground mb-8 max-md:mb-6 leading-relaxed">
          {course.subtitle}
        </p>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-4 max-md:gap-3 mb-8 max-md:mb-6 text-sm max-md:text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-medium">~{formatTime(totalTime)}</span>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="font-medium">{flat.length} aulas</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium capitalize">{course.level}</span>
          </div>
        </div>

        {/* CTA Button */}
        {next && (
          <Link
            href={`/${next.courseId}/${next.moduleId}/${next.lessonId}`}
            className="inline-flex items-center justify-center gap-3 px-8 py-4 max-md:w-full bg-primary text-primary-foreground font-semibold text-base rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 mb-6"
          >
            {prog.completed > 0 ? 'Continuar de onde parou' : 'Começar agora'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        )}

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">Progresso do curso</span>
            <span className="font-mono text-muted-foreground">{prog.completed}/{prog.total} aulas • {progressPercentage}%</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Completion Banner */}
      {isComplete && (
        <div
          className="w-full p-6 max-md:p-4 mb-12 bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 rounded-xl flex items-center justify-between max-md:flex-col max-md:items-start flex-wrap gap-4 animate-fade-in-up"
          style={{ animationDelay: '100ms' }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="font-semibold text-foreground text-lg">Parabéns!</div>
              <div className="text-sm text-muted-foreground">Você concluiu este curso com sucesso</div>
            </div>
          </div>
          <Link
            href={`/certificado/${courseId}`}
            className="font-medium px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all inline-flex items-center gap-2 shadow-md"
          >
            <Award className="w-4 h-4" />
            Ver certificado
          </Link>
        </div>
      )}

      {/* What You Will Learn Section */}
      <div className="mb-16 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        <h2 className="font-display text-2xl font-bold text-foreground mb-6">
          O que você vai aprender
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {course.modules.map((mod, idx) => (
            <div
              key={mod.id}
              className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border hover:border-primary/30 transition-colors"
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

      {/* Syllabus Section */}
      <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <h2 className="font-display text-2xl font-bold text-foreground mb-6">
          Conteúdo do curso
        </h2>
        <div className="space-y-3">
          {course.modules.map((mod, mi) => {
            const mp = progress.getModuleProgress(courseId, mod.id)
            const isOpen = openModule === mod.id
            const moduleNumber = String(mi + 1).padStart(2, '0')

            // Calculate module total time
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
                {/* Accordion Header */}
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
                        <span className="max-md:hidden">•</span>
                        <span>~{moduleTotalTime}min</span>
                        <span className="max-md:hidden">•</span>
                        <span className={cn(
                          mp.completed === mp.total && "text-primary font-medium"
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

                {/* Accordion Content */}
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
                            "flex items-center gap-4 px-6 py-4 hover:bg-secondary/70 transition-all group",
                            li > 0 && "border-t border-border/50"
                          )}
                        >
                          {/* Checkbox Circle */}
                          <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                            done
                              ? "bg-primary border-primary"
                              : "border-border group-hover:border-primary/50"
                          )}>
                            {done && <Check className="w-3 h-3 text-primary-foreground" />}
                          </div>

                          {/* Lesson Number */}
                          <span className="font-mono text-sm text-muted-foreground shrink-0 w-10">
                            {lesson.number}
                          </span>

                          {/* Lesson Title */}
                          <span className={cn(
                            "flex-1 text-sm transition-colors",
                            done
                              ? "text-muted-foreground"
                              : "text-foreground group-hover:text-primary"
                          )}>
                            {lesson.title}
                          </span>

                          {/* Reading Time */}
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
    </div>
  )
}
