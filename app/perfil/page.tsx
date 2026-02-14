'use client'

import { useUser } from '@clerk/nextjs'
import { useProgress } from '@/context/progress-context'
import { COURSES } from '@/lib/courses'
import { getFlatLessons, getCourseTime, formatTime } from '@/lib/helpers'
import Image from 'next/image'
import Link from 'next/link'
import { BookOpen, Award, Diamond } from 'lucide-react'

export default function PerfilPage() {
  const { user, isLoaded } = useUser()
  const progress = useProgress()

  if (!isLoaded) return null

  const courseIds = Object.keys(COURSES)

  // Stats
  const totalCourses = courseIds.length
  const completedCourses = courseIds.filter(id => progress.isCourseComplete(id)).length
  let totalLessons = 0
  let completedLessons = 0
  for (const id of courseIds) {
    const p = progress.getCourseProgress(id)
    totalLessons += p.total
    completedLessons += p.completed
  }

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="max-w-[900px] mx-auto px-8 pt-12 pb-20 max-md:px-5 max-md:pt-8 max-md:pb-16">
      {/* Profile Header */}
      <div className="flex items-center gap-6 mb-12 animate-fade-in-up">
        {user?.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.fullName || 'Avatar'}
            width={80}
            height={80}
            className="rounded-full"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-2xl text-primary font-display">{user?.fullName?.[0] || '?'}</span>
          </div>
        )}
        <div>
          <h1 className="font-display text-3xl font-medium text-foreground">{user?.fullName}</h1>
          <p className="font-mono text-sm text-muted-foreground mt-1">{user?.primaryEmailAddress?.emailAddress}</p>
          {memberSince && (
            <p className="font-mono text-xs text-muted-foreground mt-1">Membro desde {memberSince}</p>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-12 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
        <div className="bg-card border border-border rounded-lg p-5 text-center">
          <div className="font-display text-3xl font-medium text-foreground">{completedCourses}</div>
          <div className="font-mono text-xs text-muted-foreground mt-1">Cursos completos</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 text-center">
          <div className="font-display text-3xl font-medium text-foreground">{completedLessons}</div>
          <div className="font-mono text-xs text-muted-foreground mt-1">Aulas concluídas</div>
        </div>
        <div className="bg-card border border-border rounded-lg p-5 text-center">
          <div className="font-display text-3xl font-medium text-foreground">{totalLessons}</div>
          <div className="font-mono text-xs text-muted-foreground mt-1">Total de aulas</div>
        </div>
      </div>

      {/* My Courses */}
      <h2 className="font-display text-2xl font-medium text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        Meus Cursos
      </h2>
      <div className="space-y-4 mb-16">
        {courseIds.map((id, i) => {
          const course = COURSES[id]
          const flat = getFlatLessons(id)
          const time = getCourseTime(id)
          const { completed, total } = progress.getCourseProgress(id)
          const pct = total > 0 ? Math.round((completed / total) * 100) : 0
          const isComplete = progress.isCourseComplete(id)

          return (
            <Link
              key={id}
              href={isComplete ? `/certificado/${id}` : `/${id}`}
              className="block bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-all animate-fade-in-up"
              style={{ animationDelay: `${150 + i * 50}ms` }}
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground">{course.title}</h3>
                  <p className="font-mono text-sm text-muted-foreground">{course.subtitle}</p>
                </div>
                {isComplete && (
                  <span className="shrink-0 px-3 py-1 bg-success/10 text-success font-mono text-xs rounded-full border border-success/20">
                    Concluído
                  </span>
                )}
              </div>
              <div className="font-mono text-xs text-muted-foreground mb-3">
                {course.modules.length} módulos &middot; {flat.length} aulas &middot; ~{formatTime(time)}
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div className="font-mono text-xs text-muted-foreground">
                {completed} de {total} aulas &middot; {pct}%
              </div>
            </Link>
          )
        })}
      </div>

      {/* Certificates Section */}
      <div id="certificados" className="scroll-mt-20">
        <h2 className="font-display text-2xl font-medium text-foreground mb-6 animate-fade-in-up" style={{ animationDelay: '250ms' }}>
          Certificados
        </h2>
        {completedCourses > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {courseIds.filter(id => progress.isCourseComplete(id)).map((id, i) => {
              const course = COURSES[id]
              return (
                <Link
                  key={id}
                  href={`/certificado/${id}`}
                  className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-all animate-fade-in-up"
                  style={{ animationDelay: `${300 + i * 50}ms` }}
                >
                  <Diamond className="w-8 h-8 text-primary mb-3" />
                  <div className="font-mono text-xs text-muted-foreground mb-1">Certificado de Conclusão</div>
                  <div className="font-display text-lg font-medium text-foreground mb-3">{course.title}</div>
                  <div className="font-mono text-xs text-primary">Ver certificado &rarr;</div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-lg p-12 text-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="font-mono text-sm text-muted-foreground">
              Conclua um curso para receber seu certificado
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
