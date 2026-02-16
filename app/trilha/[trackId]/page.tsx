import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { TRACKS, getTrackStats } from '@/lib/tracks'
import { COURSES } from '@/lib/courses'
import { BookOpen, GraduationCap, Clock, Award, Check, ArrowRight } from 'lucide-react'

type Props = { params: Promise<{ trackId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { trackId } = await params
  const track = TRACKS[trackId]
  if (!track) return {}
  return {
    title: `${track.title} — Oliveira LTDA`,
    description: track.description,
    openGraph: { title: `${track.title} — Oliveira LTDA`, description: track.description },
  }
}

export function generateStaticParams() {
  return [
    { trackId: 'agronegocio' },
    { trackId: 'nanotecnologia' },
    { trackId: 'identidade-descentralizada' },
    { trackId: 'informatica-saude' },
  ]
}

export default async function TrackPage({ params }: Props) {
  const { trackId } = await params
  const track = TRACKS[trackId]
  if (!track) notFound()

  const stats = getTrackStats(trackId)
  const courses = track.courses
    .map((cid) => COURSES[cid])
    .filter(Boolean)

  const firstCourse = courses[0]

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero */}
      <section
        className={`bg-gradient-to-br ${track.gradient} text-white`}
      >
        <div className="mx-auto max-w-[var(--content-max)] px-6 py-20 md:py-28">
          <p className="font-mono text-sm uppercase tracking-widest text-white/70 mb-4">
            Trilha de aprendizado
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {track.title}
          </h1>
          <p className="font-display text-xl md:text-2xl text-white/90 mb-6">
            {track.subtitle}
          </p>
          <p className="max-w-2xl text-lg text-white/80 leading-relaxed mb-10">
            {track.description}
          </p>
          {firstCourse && (
            <Link
              href={`/cursos/${firstCourse.id}`}
              className={`inline-flex items-center gap-2 rounded-lg bg-white ${track.ctaTextColor} px-6 py-3 font-semibold transition-transform hover:scale-105`}
            >
              Começar agora
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto max-w-[var(--content-max)] px-6 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <BookOpen className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalCourses}</p>
                <p className="text-sm text-muted-foreground">Cursos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <GraduationCap className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalModules}</p>
                <p className="text-sm text-muted-foreground">Módulos</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Award className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.totalLessons}</p>
                <p className="text-sm text-muted-foreground">Aulas</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.estimatedHours}h</p>
                <p className="text-sm text-muted-foreground">Horas estimadas</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* O que voce vai aprender */}
      <section className="mx-auto max-w-[var(--content-max)] px-6 py-16">
        <h2 className="font-display text-3xl font-bold text-foreground mb-8">
          O que você vai aprender
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {track.objectives.map((objective, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
            >
              <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600/10">
                <Check className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-foreground leading-relaxed">{objective}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Course progression */}
      <section className="mx-auto max-w-[var(--content-max)] px-6 pb-20">
        <h2 className="font-display text-3xl font-bold text-foreground mb-3">
          Progressão dos cursos
        </h2>
        <p className="text-muted-foreground mb-10 max-w-2xl">
          Siga a ordem recomendada para uma experiência de aprendizado completa,
          do nível introdutório ao especialista.
        </p>

        <div className="relative space-y-6">
          {/* Vertical line connecting courses */}
          <div className="absolute left-6 top-8 bottom-8 w-px bg-border md:left-8 hidden md:block" />

          {courses.map((course, index) => {
            const moduleCount = course.modules.length
            const lessonCount = course.modules.reduce(
              (acc, mod) => acc + mod.lessons.length,
              0
            )

            return (
              <Link
                key={course.id}
                href={`/cursos/${course.id}`}
                className="group relative flex gap-4 md:gap-6 rounded-xl border border-border bg-card p-5 md:p-6 transition-all hover:border-foreground/20 hover:shadow-md"
              >
                {/* Step number */}
                <div className="relative z-10 flex h-12 w-12 md:h-16 md:w-16 shrink-0 items-center justify-center rounded-xl bg-muted">
                  {course.image ? (
                    <Image
                      src={course.image}
                      alt={course.title}
                      width={64}
                      height={64}
                      className="h-full w-full rounded-xl object-cover"
                    />
                  ) : (
                    <span className="font-mono text-lg font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-muted-foreground">
                      Curso {index + 1} de {courses.length}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                      {course.level}
                    </span>
                  </div>

                  <h3 className="font-display text-lg md:text-xl font-semibold text-foreground group-hover:underline">
                    {course.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {course.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <GraduationCap className="h-4 w-4" />
                      {moduleCount} módulos
                    </span>
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      {lessonCount} aulas
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex items-center">
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            )
          })}
        </div>
      </section>
    </main>
  )
}
