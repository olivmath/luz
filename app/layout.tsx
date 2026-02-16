import type { Metadata, Viewport } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ProgressProvider } from '@/context/progress-context'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { HashRedirect } from '@/components/hash-redirect'
import { ClerkProvider } from '@clerk/nextjs'

export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export const metadata: Metadata = {
  title: 'Oliveira LTDA — Cursos Especializados',
  description: 'Cursos especializados em agronegócio financeiro, nanotecnologia cosmética, identidade descentralizada e informática da saúde. Do nível introdutório ao especialista.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={{ cssLayerName: 'clerk' }}>
      <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Newsreader:ital,opsz,wght@0,6..72,300;0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,300;1,6..72,400;1,6..72,500&family=IBM+Plex+Mono:ital,wght@0,300;0,400;0,500;0,600;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <ProgressProvider>
            <a href="#main-content" className="skip-to-content">
              Pular para o conteúdo
            </a>
            <HashRedirect />
            <div className="grain" aria-hidden="true" />
            <Header />
            <main id="main-content" className="pt-[var(--header-h)] min-h-screen">
              {children}
            </main>
            <Footer />
          </ProgressProvider>
        </ThemeProvider>
      </body>
      </html>
    </ClerkProvider>
  )
}
