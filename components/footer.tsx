import Link from 'next/link'
import { COURSES } from '@/lib/courses'

const CATEGORIES = [
  {
    label: 'Agronegócio Financeiro',
    courses: ['financeiro-agro-fundamentos', 'financeiro-agro-avancado', 'tokenizacao-agro-fundamentos', 'tokenizacao-agro-avancado'],
  },
  {
    label: 'Nanotecnologia Cosmética',
    courses: ['nanotecnologia-fundamentos', 'nanovetores-avancado'],
  },
  {
    label: 'Identidade Descentralizada',
    courses: ['did-introducao', 'did-aplicacoes', 'did-criptografia', 'did-seguranca'],
  },
  {
    label: 'Informática da Saúde',
    courses: ['saude-blockchain-fundamentos', 'saude-blockchain-avancado'],
  },
]

const SOCIAL_LINKS = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/olivmath',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/olivmath',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com/olivmath_',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: 'https://youtube.com/@olivmath',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.13C5.12 19.56 12 19.56 12 19.56s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
        <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
      </svg>
    ),
  },
]

const PLATFORM_LINKS = [
  { label: 'Blog', href: '/blog' },
  { label: 'Perfil', href: '/perfil' },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 py-12 max-md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-10 max-md:gap-8">
          {/* Brand + Social */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-4 hover:opacity-70 transition-opacity">
              <span className="text-primary text-[0.7rem]">&#9670;</span>
              <span className="font-mono text-sm font-semibold tracking-[0.18em] text-foreground">
                Oliveira LTDA
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] mb-5">
              Cursos especializados em agronegócio financeiro, nanotecnologia cosmética, identidade descentralizada e informática da saúde.
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Course categories */}
          {CATEGORIES.map((cat) => (
            <div key={cat.label}>
              <h3 className="font-mono text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
                {cat.label}
              </h3>
              <ul className="space-y-2.5">
                {cat.courses.map((cid) => {
                  const course = COURSES[cid]
                  if (!course) return null
                  return (
                    <li key={cid}>
                      <Link
                        href={`/cursos/${cid}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {course.subtitle}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}

          {/* Plataforma */}
          <div>
            <h3 className="font-mono text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-4">
              Plataforma
            </h3>
            <ul className="space-y-2.5">
              {PLATFORM_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between max-sm:flex-col max-sm:gap-3">
          <p className="font-mono text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Oliveira LTDA. Todos os direitos reservados.
          </p>
          <p className="font-mono text-xs text-muted-foreground">
            Powered by{' '}
            <span className="text-foreground font-semibold">Oliveira LTDA</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
