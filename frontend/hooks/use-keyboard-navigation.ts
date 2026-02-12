'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { AdjacentLessons } from '@/types'

export function useKeyboardNavigation(adj: AdjacentLessons | null) {
  const router = useRouter()

  useEffect(() => {
    if (!adj) return

    function handleKeyDown(e: KeyboardEvent) {
      if ((e.target as HTMLElement).tagName === 'INPUT') return

      if (e.key === 'ArrowRight' && adj!.next) {
        router.push(`/${adj!.next.courseId}/${adj!.next.moduleId}/${adj!.next.lessonId}`)
      } else if (e.key === 'ArrowLeft' && adj!.prev) {
        router.push(`/${adj!.prev.courseId}/${adj!.prev.moduleId}/${adj!.prev.lessonId}`)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [adj, router])
}
