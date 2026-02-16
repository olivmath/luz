import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isAuthRequired = createRouteMatcher([
  '/perfil(.*)',
  '/certificados(.*)',
  '/cursos/:courseId/:moduleId/:lessonId',
])

function isFreeLesson(pathname: string): boolean {
  const match = pathname.match(/^\/cursos\/[^/]+\/([^/]+)\/([^/]+)$/)
  if (!match) return false
  return match[1] === 'modulo-01' && match[2] === 'aula-01'
}

function needsAuthorization(pathname: string): boolean {
  return /^\/cursos\/[^/]+\/[^/]+\/[^/]+$/.test(pathname)
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  // Free lessons: no auth required
  if (isFreeLesson(pathname)) return

  // Protected routes: require authentication
  if (isAuthRequired(req)) {
    const { userId } = await auth.protect()

    // Lesson pages also require authorization via publicMetadata
    if (needsAuthorization(pathname)) {
      const client = await clerkClient()
      const user = await client.users.getUser(userId)
      const authorized = user.publicMetadata?.authorized === true

      if (!authorized) {
        const url = req.nextUrl.clone()
        url.pathname = '/'
        url.hash = 'planos'
        return NextResponse.redirect(url)
      }
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
