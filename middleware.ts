import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isAuthRequired = createRouteMatcher([
  '/perfil(.*)',
  '/certificados(.*)',
  '/checkout(.*)',
  '/cursos/:courseId/:moduleId/:lessonId',
])

function isFreeLesson(pathname: string): boolean {
  const match = pathname.match(/^\/cursos\/[^/]+\/([^/]+)\/([^/]+)$/)
  if (!match) return false
  return match[1] === 'modulo-01' && match[2] === 'aula-01'
}

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl

  // Free lessons: no auth required
  if (isFreeLesson(pathname)) return

  // Protected routes: require authentication
  if (isAuthRequired(req)) {
    const { userId } = await auth.protect()

    // Authorization check is now handled client-side on the lesson page
    // to show a modal instead of redirecting
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
