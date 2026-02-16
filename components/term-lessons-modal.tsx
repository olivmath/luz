'use client'

import { useEffect } from 'react'
import Link from 'next/link'

interface LessonEntry {
  courseId: string
  courseTitle: string
  moduleId: string
  moduleTitle: string
  lessonId: string
  lessonTitle: string
  lessonNumber: string
}

interface TermLessonsModalProps {
  termName: string
  lessons: LessonEntry[]
  onClose: () => void
}

export function TermLessonsModal({ termName, lessons, onClose }: TermLessonsModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEscape)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleEscape)
    }
  }, [onClose])

  // Group lessons by courseId
  const byCourse: Record<string, { courseTitle: string; lessons: LessonEntry[] }> = {}
  for (const entry of lessons) {
    if (!byCourse[entry.courseId]) {
      byCourse[entry.courseId] = { courseTitle: entry.courseTitle, lessons: [] }
    }
    byCourse[entry.courseId].lessons.push(entry)
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="relative mx-4 w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-lg max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">
              {termName}
            </h3>
            <p className="text-sm text-muted-foreground">
              Aparece em {lessons.length} {lessons.length === 1 ? 'aula' : 'aulas'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>

        {/* Lessons grouped by course */}
        <div className="space-y-5">
          {Object.entries(byCourse).map(([courseId, group]) => (
            <div key={courseId}>
              <h4 className="mb-2 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                {group.courseTitle}
              </h4>
              <ul className="space-y-1">
                {group.lessons.map((entry) => (
                  <li key={`${entry.moduleId}-${entry.lessonId}`}>
                    <Link
                      href={`/cursos/${courseId}/${entry.moduleId}/${entry.lessonId}?term=${encodeURIComponent(termName)}`}
                      className="flex items-baseline gap-2 rounded-md px-3 py-2 text-sm hover:bg-muted transition-colors"
                      onClick={onClose}
                    >
                      <span className="font-mono text-xs text-muted-foreground shrink-0">
                        {entry.lessonNumber}
                      </span>
                      <span className="text-foreground">
                        {entry.lessonTitle}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
