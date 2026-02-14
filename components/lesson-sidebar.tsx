'use client'

import { useState } from 'react'
import Link from 'next/link'
import { COURSES } from '@/lib/courses'
import { useProgress } from '@/context/progress-context'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronRight, Check } from 'lucide-react'

interface LessonSidebarProps {
  courseId: string
  activeModuleId: string
  activeLessonId: string
  onLessonClick?: () => void
}

export function LessonSidebar({ courseId, activeModuleId, activeLessonId, onLessonClick }: LessonSidebarProps) {
  const course = COURSES[courseId]
  const progress = useProgress()
  const [expandedModule, setExpandedModule] = useState<string>(activeModuleId)

  if (!course) return null

  const courseProgress = progress.getCourseProgress(courseId)
  const progressPercentage = courseProgress.total > 0
    ? Math.round((courseProgress.completed / courseProgress.total) * 100)
    : 0

  return (
    <nav className="flex flex-col h-full" aria-label="Aulas do curso">
      {/* Breadcrumb */}
      <div className="px-6 pt-4 pb-3 border-b border-border">
        <Link
          href={`/${courseId}`}
          className="text-xs text-muted-foreground hover:text-primary transition-colors"
        >
          {courseId === 'curso-01' || courseId === 'curso-02' ? 'Agronegócio Financeiro' : 'Nanotecnologia Cosmética'} &gt; {course.title}
        </Link>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-muted-foreground">Progresso do Curso</span>
          <span className="text-xs font-mono font-semibold text-primary">{progressPercentage}%</span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Accordion Modules */}
      <div className="flex-1 overflow-y-auto py-2">
        {course.modules.map((mod, mi) => {
          const isExpanded = expandedModule === mod.id
          const moduleNumber = String(mi + 1).padStart(2, '0')

          return (
            <div key={mod.id} className="mb-1">
              {/* Module Header */}
              <button
                onClick={() => setExpandedModule(isExpanded ? '' : mod.id)}
                className="w-full flex items-center gap-3 px-6 py-3 text-left hover:bg-muted/50 transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                )}
                <span className="font-mono text-xs font-semibold text-muted-foreground/70">
                  {moduleNumber}
                </span>
                <span className="text-sm font-medium text-foreground flex-1 leading-snug">
                  {mod.title}
                </span>
              </button>

              {/* Lessons List */}
              {isExpanded && (
                <div className="pb-2">
                  {mod.lessons.map(lesson => {
                    const done = progress.isCompleted(courseId, mod.id, lesson.id)
                    const isActive = mod.id === activeModuleId && lesson.id === activeLessonId

                    return (
                      <Link
                        key={lesson.id}
                        href={`/${courseId}/${mod.id}/${lesson.id}`}
                        onClick={onLessonClick}
                        className={cn(
                          "flex items-center gap-3 px-6 py-2.5 text-sm text-muted-foreground transition-all border-l-2 border-transparent ml-6",
                          "hover:bg-muted/30 hover:text-foreground",
                          isActive && "bg-primary/5 text-primary font-medium border-l-primary",
                          !isActive && done && "text-muted-foreground/60"
                        )}
                      >
                        {/* Checkbox Circle */}
                        <span className={cn(
                          "w-4 h-4 rounded-full flex items-center justify-center shrink-0 border-[1.5px]",
                          done && !isActive && "bg-success border-success text-white",
                          isActive && "border-primary bg-primary/10",
                          !done && !isActive && "border-border"
                        )}>
                          {done && !isActive && <Check className="w-2.5 h-2.5" />}
                        </span>

                        {/* Lesson Number */}
                        <span className={cn(
                          "font-mono text-xs text-muted-foreground/50 shrink-0 w-[22px]",
                          isActive && "text-primary"
                        )}>
                          {lesson.number}
                        </span>

                        {/* Lesson Title */}
                        <span className="flex-1 leading-snug">{lesson.title}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </nav>
  )
}
