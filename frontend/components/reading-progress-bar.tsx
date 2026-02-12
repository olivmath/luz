'use client'

import { useReadingProgress } from '@/hooks/use-reading-progress'

export function ReadingProgressBar({ enabled }: { enabled: boolean }) {
  const progress = useReadingProgress(enabled)

  return (
    <div
      className="reading-progress"
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  )
}
