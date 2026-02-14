'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { useEffect, useRef, useState } from 'react'
import { Moon, Sun, LogIn, LogOut, Award, ChevronDown, User } from 'lucide-react'
import { SignInButton, SignedIn, SignedOut, useUser, useClerk } from '@clerk/nextjs'

interface HeaderProps {
  meta?: React.ReactNode
}

export function Header({ meta }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { user } = useUser()
  const { signOut } = useClerk()
  const [mounted, setMounted] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 h-[var(--header-h)] z-[1000] bg-background/92 backdrop-blur-xl border-b border-border">
      <nav
        className="max-w-[1400px] mx-auto h-full flex items-center justify-between gap-6 px-8 max-md:px-5"
        aria-label="Navegação principal"
      >
        {/* Left section: Logo + Navigation */}
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 transition-opacity duration-200 hover:opacity-65 shrink-0"
            aria-label="Página inicial"
          >
            <span className="text-primary text-[0.7rem]">&#9670;</span>
            <span className="font-mono text-sm font-semibold tracking-[0.18em] text-foreground">
              LUZ
            </span>
          </Link>

          <Link
            href="/"
            className="hidden md:flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 tracking-wider"
          >
            Cursos
          </Link>

          <Link
            href="/blog"
            className="hidden md:flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 tracking-wider"
          >
            Blog
          </Link>

          <Link
            href="/glossario"
            className="hidden md:flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors duration-200 tracking-wider"
          >
            Glossário
          </Link>

        </div>

        {/* Right section: Meta, Auth, Theme toggle */}
        <div className="flex items-center gap-4">
          {meta}

          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono text-xs text-muted-foreground hover:text-foreground hover:bg-background/50 border border-transparent hover:border-border transition-all duration-200">
                <LogIn className="w-4 h-4" />
                <span className="hidden sm:inline">Entrar</span>
              </button>
            </SignInButton>
          </SignedOut>

          <SignedIn>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-lg hover:bg-background/50 border border-transparent hover:border-border transition-all duration-200"
                aria-label="Menu do usuário"
              >
                {user?.imageUrl ? (
                  <Image
                    src={user.imageUrl}
                    alt={user.fullName || 'Avatar'}
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                )}
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                  <div className="px-4 py-3 border-b border-border">
                    <div className="font-mono text-sm font-medium text-foreground truncate">
                      {user?.fullName}
                    </div>
                    <div className="font-mono text-xs text-muted-foreground truncate">
                      {user?.primaryEmailAddress?.emailAddress}
                    </div>
                  </div>
                  <Link
                    href="/perfil"
                    className="flex items-center gap-3 px-4 py-2.5 font-mono text-xs text-foreground hover:bg-secondary transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User className="w-4 h-4 text-muted-foreground" />
                    Meu Perfil
                  </Link>
                  <Link
                    href="/perfil#certificados"
                    className="flex items-center gap-3 px-4 py-2.5 font-mono text-xs text-foreground hover:bg-secondary transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Award className="w-4 h-4 text-muted-foreground" />
                    Certificados
                  </Link>
                  <div className="border-t border-border mt-1 pt-1">
                    <button
                      onClick={() => { signOut(); setDropdownOpen(false); }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 font-mono text-xs text-foreground hover:bg-secondary transition-colors"
                    >
                      <LogOut className="w-4 h-4 text-muted-foreground" />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>
          </SignedIn>

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-2 rounded-lg font-mono text-xs text-muted-foreground hover:text-foreground hover:bg-background/50 transition-all duration-200 border border-transparent hover:border-border focus:outline-none focus:ring-2 focus:ring-primary/50 focus-visible:ring-2 focus-visible:ring-primary/50"
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
