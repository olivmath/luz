'use client'

import Link from 'next/link'
import { COURSES } from '@/lib/courses'
import { useProgress } from '@/context/progress-context'
import { cn } from '@/lib/utils'

interface LessonSidebarProps {
  courseId: string
  activeModuleId: string
  activeLessonId: string
  onLessonClick?: () => void
}

export function LessonSidebar({ courseId, activeModuleId, activeLessonId, onLessonClick }: LessonSidebarProps) {
  const course = COURSES[courseId]
  const progress = useProgress()
  if (!course) return null

  return (
    <nav className="py-4" aria-label="Aulas do curso">
      {course.modules.map((mod, mi) => (
        <div key={mod.id} className="mb-2">
          <div className="font-mono text-[0.65rem] font-semibold tracking-[0.1em] uppercase text-muted-foreground/50 px-6 pt-3 pb-1">
            Modulo {String(mi + 1).padStart(2, '0')}
          </div>
          <div className="text-sm font-medium text-muted-foreground px-6 pb-2 leading-snug">
            {mod.title}
          </div>
          {mod.lessons.map(lesson => {
            const done = progress.isCompleted(courseId, mod.id, lesson.id)
            const isActive = mod.id === activeModuleId && lesson.id === activeLessonId

            return (
              <Link
                key={lesson.id}
                href={`/${courseId}/${mod.id}/${lesson.id}`}
                onClick={onLessonClick}
                className={cn(
                  "flex items-center gap-3 px-6 py-2 text-sm text-muted-foreground transition-all border-l-2 border-transparent",
                  "hover:bg-muted hover:text-foreground",
                  isActive && "bg-primary/5 text-primary font-medium border-l-primary",
                  !isActive && done && "text-muted-foreground/60"
                )}
              >
                <span className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center text-[0.5rem] shrink-0 border-[1.5px] border-border text-transparent",
                  done && !isActive && "bg-success border-success text-white",
                  isActive && "border-primary bg-primary text-white"
                )}>
                  {(done || isActive) ? '\u2713' : ''}
                </span>
                <span className={cn(
                  "font-mono text-xs text-muted-foreground/50 shrink-0 w-[22px]",
                  isActive && "text-primary"
                )}>
                  {lesson.number}
                </span>
                <span className="flex-1 leading-snug">{lesson.title}</span>
              </Link>
            )
          })}
        </div>
      ))}
    </nav>
  )
}
