import Link from 'next/link'
import { COURSES } from '@/lib/courses'

const CATEGORIES = [
  {
    label: 'Agronegócio Financeiro',
    courses: ['curso-01', 'curso-02', 'curso-05', 'curso-06'],
  },
  {
    label: 'Nanotecnologia Cosmética',
    courses: ['curso-03', 'curso-04'],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="max-w-[var(--content-max)] mx-auto px-8 max-md:px-5 py-12 max-md:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 max-md:gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-4 hover:opacity-70 transition-opacity">
              <span className="text-primary text-[0.7rem]">&#9670;</span>
              <span className="font-mono text-sm font-semibold tracking-[0.18em] text-foreground">
                LUZ
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
              Cursos especializados em agronegócio financeiro e nanotecnologia cosmética.
            </p>
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
                        href={`/${cid}`}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {course.title} — {course.subtitle}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between max-sm:flex-col max-sm:gap-3">
          <p className="font-mono text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} LUZ. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/perfil" className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors">
              Meu perfil
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
