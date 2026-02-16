'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SignInButton } from '@clerk/nextjs'
import { ArrowRight, BookOpen, GraduationCap, Award, Clock, Sparkles, TrendingUp, Microscope, Fingerprint, HeartPulse, Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const TRACKS = [
  {
    label: 'Agronegócio Financeiro',
    subtitle: 'Do crédito rural à tokenização',
    description: 'CPR, CRA, securitização, FIAGRO, mercado de capitais e tokenização de ativos reais.',
    href: '/trilha/agronegocio',
    courses: 4,
    lessons: 73,
    icon: TrendingUp,
    gradient: 'from-[#1e4d38] to-[#28694d]',
    accentBg: 'bg-green-500/10',
    accentText: 'text-green-700 dark:text-green-400',
  },
  {
    label: 'Nanotecnologia Cosmética',
    subtitle: 'Dos nanomateriais à formulação',
    description: 'Nanopartículas, nanovetores, encapsulamento, permeação cutânea e escalonamento industrial.',
    href: '/trilha/nanotecnologia',
    courses: 2,
    lessons: 36,
    icon: Microscope,
    gradient: 'from-blue-700 to-blue-500',
    accentBg: 'bg-blue-500/10',
    accentText: 'text-blue-700 dark:text-blue-400',
  },
  {
    label: 'Identidade Descentralizada',
    subtitle: 'Da identidade soberana à engenharia técnica',
    description: 'DIDs, Verifiable Credentials, SSI, criptografia aplicada, ZKPs e interoperabilidade.',
    href: '/trilha/identidade-descentralizada',
    courses: 4,
    lessons: 69,
    icon: Fingerprint,
    gradient: 'from-purple-700 to-purple-500',
    accentBg: 'bg-purple-500/10',
    accentText: 'text-purple-700 dark:text-purple-400',
  },
  {
    label: 'Informática da Saúde',
    subtitle: 'Blockchain, DID e interoperabilidade no SUS',
    description: 'RNDS, FHIR, LGPD, blockchain, DIDs e projetos reais na saúde brasileira.',
    href: '/trilha/informatica-saude',
    courses: 2,
    lessons: 38,
    icon: HeartPulse,
    gradient: 'from-emerald-700 to-teal-500',
    accentBg: 'bg-emerald-500/10',
    accentText: 'text-emerald-700 dark:text-emerald-400',
  },
]

const STATS = [
  { value: '12', label: 'Cursos', icon: BookOpen },
  { value: '216', label: 'Aulas', icon: GraduationCap },
  { value: '29h+', label: 'Conteúdo', icon: Clock },
  { value: '12', label: 'Certificados', icon: Award },
]

const PLANS = [
  {
    name: 'Gratuito',
    price: 'R$ 0',
    period: '',
    description: 'Explore a plataforma e veja se é para você.',
    features: [
      'Acesso às 3 primeiras aulas de cada curso',
      'Glossário completo',
      'Blog com artigos técnicos',
    ],
    cta: 'Começar grátis',
    highlighted: false,
  },
  {
    name: 'Anual',
    price: 'R$ 5.200',
    priceNote: '≈ US$ 1.000 · R$ 433/mês',
    period: '/ano',
    description: 'Acesso completo a tudo — cursos, certificados e conteúdo sob demanda.',
    features: [
      'Acesso ilimitado a todos os 12 cursos',
      'Certificados de conclusão',
      'Solicitar novos cursos e conteúdos',
      'Acesso antecipado a novos cursos',
      'Suporte prioritário por e-mail',
    ],
    cta: 'Assinar agora',
    highlighted: true,
  },
]

const FAQ = [
  {
    q: 'Posso testar antes de pagar?',
    a: 'Sim. O plano gratuito dá acesso às 3 primeiras aulas de cada curso, sem precisar de cartão de crédito.',
  },
  {
    q: 'Como funciona a solicitação de conteúdo novo?',
    a: 'Assinantes anuais podem sugerir temas, cursos ou aprofundamentos. Avaliamos cada pedido e priorizamos com base na demanda.',
  },
  {
    q: 'Qual a forma de pagamento?',
    a: 'Aceitamos cartão de crédito e PIX. O valor é R$ 5.200/ano (equivalente a US$ 1.000). O pagamento é processado de forma segura via Stripe.',
  },
  {
    q: 'Os certificados têm validade?',
    a: 'Os certificados são emitidos pela Oliveira LTDA e comprovam a conclusão do curso. Não possuem validade acadêmica formal, mas são reconhecidos no mercado como certificação técnica.',
  },
  {
    q: 'Posso cancelar a assinatura?',
    a: 'Sim, a qualquer momento. Você mantém o acesso até o fim do período já pago. Não há multa de cancelamento.',
  },
  {
    q: 'Os cursos são atualizados?',
    a: 'Sim. Atualizamos o conteúdo conforme regulações, tecnologias e mercado evoluem. Assinantes recebem todas as atualizações automaticamente.',
  },
]

const BENEFITS = [
  {
    title: 'Conteúdo especializado',
    description: 'Cursos criados por especialistas em finanças do agro, nanotecnologia, identidade digital e saúde.',
  },
  {
    title: 'Progressão estruturada',
    description: 'Do introdutório ao especialista — cada curso constrói sobre o anterior.',
  },
  {
    title: 'Certificado de conclusão',
    description: 'Comprove seu conhecimento com certificados ao completar cada curso.',
  },
  {
    title: 'Questionários por aula',
    description: 'Fixe o conteúdo com questões práticas ao final de cada aula.',
  },
]

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 max-sm:px-4 max-sm:py-4 text-left cursor-pointer"
      >
        <span className="font-semibold text-foreground text-[0.95rem]">{question}</span>
        <ChevronDown className={cn('w-5 h-5 shrink-0 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
      </button>
      <div
        className={cn(
          'grid transition-all duration-200 ease-in-out',
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
        )}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 max-sm:px-4 max-sm:pb-4 text-sm text-muted-foreground leading-relaxed">
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e4d38] via-[#1e4d38] to-[#163328]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,170,122,0.15),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(40,105,77,0.2),transparent_60%)]" />

        <div className="relative max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 pt-24 pb-28 max-md:pt-16 max-md:pb-20">
          {/* Badge */}
          <div className="animate-fade-in-up mb-8">
            <span className="inline-flex items-center gap-2 font-mono text-xs tracking-widest uppercase bg-white/10 border border-white/15 text-white/80 px-4 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" />
              Plataforma de cursos especializados
            </span>
          </div>

          {/* Title */}
          <h1 className="animate-fade-in-up font-display text-6xl max-lg:text-5xl max-md:text-4xl max-sm:text-[2rem] font-bold text-white leading-[1.08] mb-6 max-w-[800px]" style={{ animationDelay: '60ms' }}>
            Conteúdo em português nichado que{' '}
            <span className="text-white/60">não existe em lugar nenhum</span>
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up text-lg max-md:text-base text-white/75 leading-relaxed max-w-[560px] mb-10" style={{ animationDelay: '120ms' }}>
            Agronegócio financeiro, nanotecnologia cosmética, identidade descentralizada e informática
            da saúde — cursos aprofundados em português que você não encontra em nenhuma outra plataforma.
          </p>

          {/* CTAs */}
          <div className="animate-fade-in-up flex items-center gap-4 max-sm:flex-col max-sm:items-start" style={{ animationDelay: '180ms' }}>
            <SignInButton mode="modal">
              <button className="inline-flex items-center justify-center gap-2 bg-white text-[#1e4d38] px-7 py-3.5 max-sm:w-full rounded-lg font-semibold hover:bg-white/95 transition-all duration-200 hover:gap-3 shadow-lg cursor-pointer">
                Começar gratuitamente
                <ArrowRight className="w-5 h-5" />
              </button>
            </SignInButton>
          </div>

          {/* Stats row */}
          <div className="animate-fade-in-up mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 max-sm:gap-4 border-t border-white/10 pt-10" style={{ animationDelay: '240ms' }}>
            {STATS.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-white/60" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="font-mono text-xs text-white/50 tracking-wider">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRILHAS ===== */}
      <section className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 py-20 max-md:py-14">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl max-md:text-2xl font-bold text-foreground mb-3">
            Quatro trilhas de especialização
          </h2>
          <p className="text-muted-foreground max-w-[500px] mx-auto">
            Escolha sua área de interesse e siga uma progressão estruturada do básico ao avançado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {TRACKS.map((track, i) => (
            <Link
              key={track.label}
              href={track.href}
              className="group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/40 hover:shadow-xl animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Gradient top bar */}
              <div className={cn('h-1.5 bg-gradient-to-r', track.gradient)} />

              <div className="p-7 max-sm:p-5">
                {/* Icon + label */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', track.accentBg)}>
                    <track.icon className={cn('w-5 h-5', track.accentText)} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                      {track.label}
                    </h3>
                    <p className="font-mono text-xs text-muted-foreground tracking-wider">
                      {track.subtitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                  {track.description}
                </p>

                {/* Meta */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 font-mono text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5" />
                      {track.courses} cursos
                    </span>
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5" />
                      {track.lessons} aulas
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                    Explorar <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ===== BENEFÍCIOS ===== */}
      <section className="border-y border-border bg-secondary/30">
        <div className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 py-20 max-md:py-14">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl max-md:text-2xl font-bold text-foreground mb-3">
              Por que a Oliveira LTDA?
            </h2>
            <p className="text-muted-foreground max-w-[440px] mx-auto">
              Conteúdo nichado, em português, que não existe em nenhum outro lugar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {BENEFITS.map((benefit, i) => (
              <div
                key={benefit.title}
                className="flex gap-4 p-6 rounded-xl bg-card border border-border animate-fade-in-up"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="mt-1 shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="font-mono text-xs font-bold text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PLANOS ===== */}
      <section id="planos" className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 py-20 max-md:py-14">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl max-md:text-2xl font-bold text-foreground mb-3">
            Planos
          </h2>
          <p className="text-muted-foreground max-w-[480px] mx-auto">
            Comece gratuitamente ou desbloqueie tudo com o plano anual.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[800px] mx-auto">
          {PLANS.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                'relative flex flex-col rounded-2xl border p-8 max-sm:p-6 transition-all duration-300',
                plan.highlighted
                  ? 'border-primary bg-card shadow-xl shadow-primary/5 ring-1 ring-primary/20'
                  : 'border-border bg-card hover:border-border/80',
              )}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 font-mono text-[0.65rem] font-semibold tracking-widest uppercase bg-primary text-primary-foreground px-4 py-1 rounded-full">
                  Recomendado
                </span>
              )}

              <h3 className="font-display text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.description}</p>

              <div className="mt-6 mb-6">
                <span className="font-display text-4xl font-bold text-foreground">{plan.price}</span>
                {plan.period && (
                  <span className="text-muted-foreground text-sm">{plan.period}</span>
                )}
                {'priceNote' in plan && plan.priceNote && (
                  <div className="mt-1 font-mono text-xs text-muted-foreground">{plan.priceNote}</div>
                )}
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <Check className={cn('w-4 h-4 mt-0.5 shrink-0', plan.highlighted ? 'text-primary' : 'text-muted-foreground/60')} />
                    {feature}
                  </li>
                ))}
              </ul>

              <SignInButton mode="modal">
                <button
                  className={cn(
                    'w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg font-semibold transition-all duration-200 cursor-pointer',
                    plan.highlighted
                      ? 'bg-primary text-primary-foreground hover:opacity-90 shadow-lg'
                      : 'bg-secondary text-foreground hover:bg-secondary/80 border border-border',
                  )}
                >
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </SignInButton>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="border-y border-border bg-secondary/30">
        <div className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 py-20 max-md:py-14">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl max-md:text-2xl font-bold text-foreground mb-3">
              Perguntas frequentes
            </h2>
          </div>

          <div className="max-w-[700px] mx-auto space-y-3">
            {FAQ.map((item) => (
              <FaqItem key={item.q} question={item.q} answer={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <section className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 py-20 max-md:py-14">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1e4d38] to-[#28694d] px-12 py-16 max-md:px-6 max-md:py-10 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl max-md:text-2xl font-bold text-white mb-4">
              Comece sua jornada agora
            </h2>
            <p className="text-white/70 max-w-[420px] mx-auto mb-8">
              Teste gratuitamente ou assine o plano anual e desbloqueie todos os cursos, certificados e conteúdo sob demanda.
            </p>
            <div className="flex items-center justify-center gap-4 max-sm:flex-col">
              <SignInButton mode="modal">
                <button className="inline-flex items-center justify-center gap-2 bg-white text-[#1e4d38] px-8 py-4 rounded-lg font-semibold hover:bg-white/95 transition-all duration-200 hover:gap-3 shadow-lg cursor-pointer">
                  Começar grátis
                  <ArrowRight className="w-5 h-5" />
                </button>
              </SignInButton>
              <a href="#planos" className="inline-flex items-center justify-center gap-2 border border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-200 cursor-pointer">
                Ver planos
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
