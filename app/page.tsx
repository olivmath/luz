'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { COURSES } from '@/lib/courses'
import { useProgress } from '@/context/progress-context'
import { getFlatLessons, getCourseTime, formatTime } from '@/lib/helpers'
import { cn } from '@/lib/utils'
import { Check, Clock, BookOpen, ArrowRight, GraduationCap } from 'lucide-react'
import { SignedIn, SignedOut } from '@clerk/nextjs'
import { LandingPage } from '@/components/landing-page'

const CATEGORIES = [
  {
    label: 'Agronegócio Financeiro',
    description: 'Crédito rural, instrumentos financeiros, securitização e tokenização',
    courses: ['financeiro-agro-fundamentos', 'financeiro-agro-avancado', 'tokenizacao-agro-fundamentos', 'tokenizacao-agro-avancado'],
    accent: 'from-green-500 to-green-600',
    badgeColor: 'bg-green-500/10 text-green-700 dark:text-green-400',
  },
  {
    label: 'Nanotecnologia Cosmética',
    description: 'Nanomateriais, nanovetores, encapsulamento e permeação cutânea',
    courses: ['nanotecnologia-fundamentos', 'nanovetores-avancado'],
    accent: 'from-blue-500 to-blue-600',
    badgeColor: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
  },
  {
    label: 'Identidade Descentralizada',
    description: 'DIDs, Verifiable Credentials, SSI, criptografia aplicada e interoperabilidade',
    courses: ['did-fundamentos', 'did-engenharia'],
    accent: 'from-purple-500 to-purple-600',
    badgeColor: 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
  },
]

const SLIDES = [
  {
    label: 'Agronegócio Financeiro',
    subtitle: 'Crédito rural, securitização e tokenização',
    description:
      'Do crédito rural à tokenização de ativos — domine os instrumentos financeiros que movem o agronegócio brasileiro.',
    bullets: [
      'Crédito rural, CPR e CRA',
      'Securitização e mercado de capitais',
      'Tokenização de ativos agro',
    ],
    cta: { text: 'Explorar trilha', href: '/trilha/agronegocio' },
    gradient: 'from-[#1e4d38] to-[#28694d]',
    ctaTextColor: 'text-[#1e4d38]',
  },
  {
    label: 'Nanotecnologia Cosmética',
    subtitle: 'Nanomateriais, nanovetores e permeação',
    description:
      'Dos fundamentos da nanotecnologia à formulação cosmética — ciência aplicada à inovação em cuidados pessoais.',
    bullets: [
      'Nanomateriais e nanopartículas',
      'Nanovetores e encapsulamento',
      'Permeação cutânea e formulação',
    ],
    cta: { text: 'Explorar trilha', href: '/trilha/nanotecnologia' },
    gradient: 'from-blue-700 to-blue-500',
    ctaTextColor: 'text-blue-700',
  },
  {
    label: 'Identidade Descentralizada',
    subtitle: 'DIDs, Verifiable Credentials e SSI',
    description:
      'Da identidade soberana à engenharia técnica — domine os padrões W3C, criptografia e arquitetura de sistemas DID.',
    bullets: [
      'Self-Sovereign Identity e DIDs',
      'Verifiable Credentials e ZKPs',
      'Criptografia, segurança e interoperabilidade',
    ],
    cta: { text: 'Explorar trilha', href: '/trilha/identidade-descentralizada' },
    gradient: 'from-purple-700 to-purple-500',
    ctaTextColor: 'text-purple-700',
  },
]

export default function CatalogPage() {
  const progress = useProgress()
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % SLIDES.length)
  }, [])

  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 6000)
    return () => clearInterval(id)
  }, [paused, next])

  return (
    <>
    <SignedOut>
      <LandingPage />
    </SignedOut>
    <SignedIn>
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <div className="max-w-[var(--content-max)] mx-auto px-8 pt-8 pb-16 max-md:px-5 max-md:pt-6 max-md:pb-12">
        <div
          className="relative overflow-hidden rounded-2xl animate-fade-in-up"
          role="region"
          aria-roledescription="carousel"
          aria-label="Trilhas de cursos"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {SLIDES.map((slide, i) => (
            <div
              key={slide.label}
              aria-hidden={i !== current}
              className={cn(
                'transition-all duration-500 ease-in-out bg-gradient-to-br text-white px-12 py-16 max-md:px-6 max-md:py-10 max-sm:px-5 max-sm:py-8',
                slide.gradient,
                i === current
                  ? 'relative opacity-100 translate-x-0'
                  : 'absolute inset-0 opacity-0 translate-x-8 pointer-events-none'
              )}
            >
              <div className="max-w-3xl">
                <span className="inline-block font-mono text-xs font-semibold tracking-wider uppercase bg-white/15 px-3 py-1 rounded-full mb-6 max-md:mb-4">
                  {slide.label}
                </span>
                <h2 className="font-display text-4xl max-md:text-3xl max-sm:text-[1.7rem] font-bold mb-3 max-md:mb-2 leading-tight">
                  {slide.subtitle}
                </h2>
                <p className="text-lg max-md:text-base text-white/90 mb-8 max-md:mb-6 leading-relaxed max-w-2xl">
                  {slide.description}
                </p>
                <div className="space-y-4 max-md:space-y-3 mb-10 max-md:mb-8">
                  {slide.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-start gap-3">
                      <div className="mt-1 flex-shrink-0">
                        <Check className="w-5 h-5 text-white" strokeWidth={2.5} />
                      </div>
                      <p className="text-white/95 max-md:text-sm">{bullet}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={slide.cta.href}
                  className={cn(
                    'inline-flex items-center justify-center gap-2 bg-white px-8 py-3.5 max-md:w-full rounded-lg font-semibold hover:bg-white/95 transition-all duration-200 hover:gap-3 shadow-lg',
                    slide.ctaTextColor
                  )}
                >
                  {slide.cta.text}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ))}

          {/* Dot navigation — padded for 44px touch target */}
          <div className="absolute bottom-4 left-10 max-md:left-4 max-sm:left-3 flex gap-0">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Slide ${i + 1}`}
                className="p-3"
              >
                <span
                  className={cn(
                    'block w-2.5 h-2.5 rounded-full transition-all duration-300',
                    i === current ? 'bg-white scale-110' : 'bg-white/40 hover:bg-white/60'
                  )}
                />
              </button>
            ))}
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
              <p className="text-sm text-muted-foreground pl-4">
                {cat.description}
              </p>
            </div>

            {/* Course Cards Grid — Updraft style */}
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
                    href={isComplete ? `/certificados/${cid}` : `/cursos/${cid}`}
                    aria-label={`${course.title} — ${course.level}`}
                    className={cn(
                      "group bg-card border border-border rounded-xl overflow-hidden",
                      "transition-all duration-300 hover:border-primary/40 hover:shadow-lg"
                    )}
                    style={{ animationDelay: `${(ci + 1) * 100 + (i + 1) * 60}ms` }}
                  >
                    <div className="flex">
                      {/* Course image — large, left side (Updraft style) */}
                      <div className="shrink-0 relative w-40 min-h-[180px] max-sm:w-28 max-sm:min-h-[160px]">
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>

                      {/* Course content — right side */}
                      <div className="flex-1 min-w-0 p-5 flex flex-col">
                        {/* Level badge */}
                        <div className="flex items-center justify-end mb-2">
                          <span className={cn(
                            "shrink-0 font-mono text-[0.65rem] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full",
                            cat.badgeColor
                          )}>
                            {course.level}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="font-display text-lg max-sm:text-base font-bold text-foreground leading-snug mb-1 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-auto max-sm:line-clamp-1">
                          {course.description}
                        </p>

                        {/* Footer: metadata + progress + CTA */}
                        <div className="mt-4">
                          {/* Metadata row */}
                          <div className="flex items-center gap-3 mb-3 text-xs text-muted-foreground font-mono">
                            <div className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              <span>{course.modules.length} módulos</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-3.5 h-3.5" />
                              <span>{flat.length} aulas</span>
                            </div>
                            <div className="flex items-center gap-1 max-sm:hidden">
                              <Clock className="w-3.5 h-3.5" />
                              <span>~{formatTime(totalTime)}</span>
                            </div>
                          </div>

                          {/* Progress + CTA row */}
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-muted-foreground font-mono">
                                  Progresso: <strong className="text-foreground">{pct}%</strong>
                                </span>
                              </div>
                              <div
                                className="w-full h-1.5 bg-border/50 rounded-full overflow-hidden"
                                role="progressbar"
                                aria-valuenow={pct}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`Progresso do curso: ${pct}%`}
                              >
                                <div
                                  className="h-full rounded-full transition-all duration-500 bg-primary"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>

                            {/* CTA button (Updraft style) */}
                            <span className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-primary/30 text-xs font-mono font-medium text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                              {isComplete ? 'Certificado' : prog.completed > 0 ? 'Continuar' : 'Começar'}
                              <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
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
    </SignedIn>
    </>
  )
}
