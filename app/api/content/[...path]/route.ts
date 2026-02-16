import { auth, clerkClient } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

function isFreeLesson(moduleId: string, lessonId: string): boolean {
  return moduleId === 'modulo-01' && lessonId === 'aula-01'
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params

  // Expect exactly 3 segments: contentDir/moduleId/lessonId
  if (path.length !== 3) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  const [contentDir, moduleId, lessonId] = path

  // Validate path segments to prevent directory traversal
  const safePattern = /^[a-z0-9-]+$/
  if (!safePattern.test(contentDir) || !safePattern.test(moduleId) || !safePattern.test(lessonId)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  // Free lessons don't require auth
  if (!isFreeLesson(moduleId, lessonId)) {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    const authorized = user.publicMetadata?.authorized === true

    if (!authorized) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  // Read markdown file from public directory
  const filePath = join(process.cwd(), 'public', contentDir, moduleId, `${lessonId}.md`)

  try {
    const content = readFileSync(filePath, 'utf-8')
    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
