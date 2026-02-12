'use client'

import Link from 'next/link'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

interface HeaderProps {
  meta?: React.ReactNode
}

export function Header({ meta }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <header className="fixed top-0 left-0 right-0 h-[var(--header-h)] z-[1000] bg-background/92 backdrop-blur-xl border-b border-border">
      <nav
        className="max-w-[var(--content-max)] mx-auto h-full flex items-center justify-between px-8 max-md:px-5"
        aria-label="Navegacao principal"
      >
        <Link
          href="/"
          className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-65"
          aria-label="Pagina inicial"
        >
          <span className="text-primary text-[0.7rem]">&#9670;</span>
          <span className="font-mono text-sm font-semibold tracking-[0.18em] text-foreground">
            OKEN
          </span>
        </Link>
        <div className="font-mono text-xs text-muted-foreground tracking-wider flex items-center gap-3">
          {meta}
          {mounted && (
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="font-mono text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              aria-label={theme === 'light' ? 'Ativar tema escuro' : 'Ativar tema claro'}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
