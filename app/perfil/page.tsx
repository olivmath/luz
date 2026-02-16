'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useProgress } from '@/context/progress-context'
import { COURSES } from '@/lib/courses'
import { getFlatLessons, getCourseTime, formatTime } from '@/lib/helpers'
import Image from 'next/image'
import Link from 'next/link'
import { Award, Diamond, Clock, BookOpen, Target, CreditCard, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function PerfilPage() {
  const { user, isLoaded } = useUser()
  const progress = useProgress()
  const [activeTab, setActiveTab] = useState<string>('cursos')

  if (!isLoaded) return null

  const courseIds = Object.keys(COURSES)

  // Stats
  const completedCourses = courseIds.filter(id => progress.isCourseComplete(id)).length
  let completedLessons = 0
  for (const id of courseIds) {
    const p = progress.getCourseProgress(id)
    completedLessons += p.completed
  }

  const quizStats = progress.getQuizStats()
  const quizAccuracy = quizStats.totalQuestions > 0
    ? Math.round((quizStats.totalCorrect / quizStats.totalQuestions) * 100)
    : 0

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
    : ''

  return (
    <div>
      {/* ===== PROFILE HERO ===== */}
      <section className="relative bg-gradient-to-b from-primary/5 to-background border-b border-border">
        <div className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 pt-12 pb-10 max-sm:pt-8 max-sm:pb-8">
          <div className="flex items-center gap-6 max-sm:gap-4 animate-fade-in-up">
            {user?.imageUrl ? (
              <Image
                src={user.imageUrl}
                alt={user.fullName || 'Avatar'}
                width={88}
                height={88}
                className="rounded-full ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
              />
            ) : (
              <div className="w-[88px] h-[88px] rounded-full bg-primary/10 flex items-center justify-center ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                <span className="text-3xl text-primary font-display">{user?.fullName?.[0] || '?'}</span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-3xl max-sm:text-2xl font-medium text-foreground">{user?.fullName}</h1>
              <p className="font-mono text-sm text-muted-foreground mt-1 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
              {memberSince && (
                <p className="font-mono text-xs text-muted-foreground mt-1">Membro desde {memberSince}</p>
              )}
            </div>
          </div>

          {/* Stats Row — only 2 stats */}
          <div className="grid grid-cols-2 gap-4 max-sm:gap-3 mt-8 animate-fade-in-up" style={{ animationDelay: '50ms' }}>
            <div className="bg-card border border-border rounded-lg p-4 max-sm:p-3">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs text-muted-foreground">Aulas concluídas</span>
              </div>
              <div className="font-display text-2xl font-medium text-foreground">{completedLessons}</div>
            </div>
            <div className="bg-card border border-border rounded-lg p-4 max-sm:p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-primary" />
                <span className="font-mono text-xs text-muted-foreground">Taxa de acerto</span>
              </div>
              <div className="font-display text-2xl font-medium text-foreground">
                {quizStats.totalQuestions > 0 ? (
                  <>{quizAccuracy}%</>
                ) : (
                  <span className="text-muted-foreground text-lg">—</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TAB NAVIGATION ===== */}
      <nav className="sticky top-[56px] z-30 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 flex items-center gap-8">
          {[
            { id: 'cursos', label: 'Meus Cursos' },
            { id: 'certificados', label: 'Certificados' },
            { id: 'assinatura', label: 'Assinatura' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'font-mono text-sm tracking-wide py-4 border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ===== TAB CONTENT ===== */}
      <div className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 pt-10 pb-20">

        {/* Meus Cursos Tab */}
        {activeTab === 'cursos' && (
          <div className="animate-fade-in-up">
            <div className="space-y-4">
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
                    href={isComplete ? `/certificados/${id}` : `/cursos/${id}`}
                    className="block bg-card border border-border rounded-lg p-6 max-sm:p-4 hover:border-primary/30 transition-all animate-fade-in-up"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="min-w-0">
                        <h3 className="font-display text-xl max-sm:text-lg font-medium text-foreground">{course.title}</h3>
                        <p className="font-mono text-sm text-muted-foreground truncate">{course.subtitle}</p>
                      </div>
                      {isComplete ? (
                        <span className="shrink-0 px-3 py-1 bg-success/10 text-success font-mono text-xs rounded-full border border-success/20">
                          Concluído
                        </span>
                      ) : pct > 0 ? (
                        <span className="shrink-0 px-3 py-1 bg-primary/10 text-primary font-mono text-xs rounded-full border border-primary/20">
                          Em andamento
                        </span>
                      ) : null}
                    </div>
                    <div className="flex items-center gap-3 font-mono text-xs text-muted-foreground mb-3 flex-wrap">
                      <span>{course.modules.length} módulos</span>
                      <span>&middot;</span>
                      <span>{flat.length} aulas</span>
                      <span>&middot;</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        ~{formatTime(time)}
                      </span>
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
          </div>
        )}

        {/* Certificados Tab */}
        {activeTab === 'certificados' && (
          <div className="animate-fade-in-up">
            {completedCourses > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {courseIds.filter(id => progress.isCourseComplete(id)).map((id, i) => {
                  const course = COURSES[id]
                  return (
                    <Link
                      key={id}
                      href={`/certificados/${id}`}
                      className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 transition-all animate-fade-in-up"
                      style={{ animationDelay: `${i * 50}ms` }}
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
              <div className="bg-card border border-border rounded-lg p-12 text-center">
                <Award className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="font-body text-muted-foreground mb-2">
                  Nenhum certificado disponível
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  Conclua um curso para receber seu certificado
                </p>
              </div>
            )}
          </div>
        )}

        {/* Assinatura Tab */}
        {activeTab === 'assinatura' && (() => {
          const isAuthorized = user?.publicMetadata?.authorized === true
          const expiresAt = user?.publicMetadata?.expiresAt as string | undefined
          const subType = (user?.publicMetadata?.subscriptionType as string) || undefined

          return (
            <div className="animate-fade-in-up max-w-[600px]">
              {isAuthorized ? (
                <div className="space-y-6">
                  <div className="bg-card border border-border rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h3 className="font-display text-lg font-medium text-foreground">Plano Anual</h3>
                        <p className="font-mono text-xs text-success">Assinatura ativa</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-border">
                        <span className="font-mono text-xs text-muted-foreground">Status</span>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-success/10 text-success font-mono text-xs rounded-full border border-success/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-success" />
                          Ativo
                        </span>
                      </div>
                      {subType && (
                        <div className="flex justify-between items-center py-3 border-b border-border">
                          <span className="font-mono text-xs text-muted-foreground">Tipo</span>
                          <span className="font-mono text-sm text-foreground">
                            {subType === 'recurring' ? 'Recorrente' : 'Pagamento único'}
                          </span>
                        </div>
                      )}
                      {expiresAt && (
                        <div className="flex justify-between items-center py-3 border-b border-border">
                          <span className="font-mono text-xs text-muted-foreground">Próxima renovação</span>
                          <span className="font-mono text-sm text-foreground">
                            {new Date(expiresAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center py-3">
                        <span className="font-mono text-xs text-muted-foreground">Acesso</span>
                        <span className="font-mono text-sm text-foreground">12 cursos + certificados</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                  <h3 className="font-display text-xl font-medium text-foreground mb-2">
                    Sem assinatura ativa
                  </h3>
                  <p className="text-muted-foreground mb-6 max-w-[360px] mx-auto">
                    Assine o plano anual para ter acesso completo a todos os cursos e certificados.
                  </p>
                  <Link
                    href="/checkout"
                    className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-all shadow-lg"
                  >
                    <CreditCard className="w-4 h-4" />
                    Assinar agora
                  </Link>
                </div>
              )}
            </div>
          )
        })()}
      </div>
    </div>
  )
}
