'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { COURSES } from '@/lib/courses'
import { useProgress } from '@/context/progress-context'
import { getFlatLessons, getCourseTime, formatTime } from '@/lib/helpers'

export default function CertificatePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params)
  const course = COURSES[courseId]
  const router = useRouter()
  const progress = useProgress()
  const { user, isSignedIn } = useUser()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (isSignedIn && user?.fullName && !progress.studentName) {
      progress.setStudentName(user.fullName)
    }
  }, [isSignedIn, user?.fullName, progress])

  useEffect(() => {
    if (mounted && course && !progress.isCourseComplete(courseId)) {
      router.push(`/${courseId}`)
    }
  }, [mounted, courseId, course, progress, router])

  if (!course) {
    router.push('/')
    return null
  }

  if (!mounted) return null

  const flat = getFlatLessons(courseId)
  const totalTime = getCourseTime(courseId)
  const now = new Date()
  const dateStr = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })
  const displayName = progress.studentName || user?.fullName || '...'

  return (
    <div className="max-w-[800px] mx-auto px-8 pt-12 pb-20 max-md:px-5 max-md:pt-8 max-md:pb-16">
      <Link
        href={`/${courseId}`}
        className="font-mono text-sm text-muted-foreground tracking-wider inline-flex items-center gap-2 hover:text-primary transition-colors animate-fade-in-up"
      >
        &larr; Voltar ao curso
      </Link>

      {/* Form */}
      <div className="cert-form-section max-w-[420px] mx-auto mt-8 mb-12 text-center animate-fade-in-up" style={{ animationDelay: '50ms' }}>
        <div className="font-display text-[2rem] font-medium text-foreground mb-2">
          Certificado de Conclusão
        </div>
        {isSignedIn ? (
          <>
            <div className="text-[0.9rem] text-muted-foreground mb-8">
              Emitido para
            </div>
            <div className="w-full px-5 py-4 text-lg text-foreground">
              {displayName}
            </div>
          </>
        ) : (
          <>
            <div className="text-[0.9rem] text-muted-foreground mb-8">
              Insira seu nome completo
            </div>
            <label htmlFor="cert-name" className="sr-only">Nome completo</label>
            <input
              id="cert-name"
              type="text"
              className="w-full px-5 py-4 text-lg text-foreground bg-card border border-border rounded-sm text-center outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/50"
              placeholder="Seu nome completo"
              value={progress.studentName}
              onChange={e => progress.setStudentName(e.target.value)}
            />
          </>
        )}
      </div>

      {/* Certificate card */}
      <div className="certificate-card bg-card border border-border rounded-md p-16 max-md:p-8 max-sm:p-5 text-center relative animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="text-primary text-lg mb-8 max-md:mb-6">&#9670;</div>
        <div className="font-mono text-sm max-sm:text-xs font-medium tracking-[0.25em] uppercase text-primary mb-10 max-md:mb-6">
          Certificado de Conclusão
        </div>
        <div className="text-[0.9rem] text-muted-foreground mb-3">Certificamos que</div>
        <div className="font-display text-[2.6rem] max-md:text-[1.8rem] max-sm:text-[1.5rem] font-medium text-foreground mb-6 border-b border-border pb-3 min-h-[3.5rem] max-md:min-h-[2.5rem] break-words">
          {displayName}
        </div>
        <div className="text-base max-sm:text-sm text-muted-foreground leading-[1.8] mb-2 max-w-[450px] mx-auto">
          concluiu com êxito o curso
        </div>
        <div className="font-display text-[1.3rem] max-sm:text-lg font-semibold text-foreground mb-1">
          {course.title}
        </div>
        <div className="font-display text-base max-sm:text-sm text-muted-foreground mb-8 max-md:mb-6">
          {course.subtitle}
        </div>
        <div className="font-mono text-xs max-sm:text-[0.6rem] text-muted-foreground tracking-wider mb-10 max-md:mb-6">
          {course.modules.length} módulos &middot; {flat.length} aulas &middot; ~{formatTime(totalTime)} &middot; {dateStr}
        </div>
        <div className="w-[50px] h-px bg-border mx-auto mb-8" />
        <div className="font-mono text-sm font-semibold tracking-[0.2em] text-muted-foreground">
          LUZ
        </div>
      </div>

      {/* Actions */}
      <div className="cert-actions flex justify-center max-sm:flex-col gap-4 max-sm:gap-3 mt-8 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        <button
          onClick={() => window.print()}
          className="font-mono text-sm font-medium px-6 py-3 rounded-sm bg-primary text-primary-foreground border border-primary hover:bg-primary/90 transition-all cursor-pointer max-sm:w-full text-center"
        >
          Imprimir
        </button>
        <Link
          href={`/${courseId}`}
          className="font-mono text-sm font-medium px-6 py-3 rounded-sm bg-card text-foreground border border-border hover:border-border/80 hover:bg-secondary transition-all max-sm:w-full text-center"
        >
          Voltar ao curso
        </Link>
      </div>
    </div>
  )
}
