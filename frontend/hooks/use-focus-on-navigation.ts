'use client'

import { useEffect, useRef } from 'react'

export function useFocusOnNavigation(dep: string) {
  const ref = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.focus({ preventScroll: true })
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [dep])

  return ref
}
