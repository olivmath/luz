'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function HashRedirect() {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash
    if (hash.startsWith('#/')) {
      const path = hash.slice(1) // remove #
      window.location.hash = ''
      router.replace(path)
    }
  }, [router])

  return null
}
