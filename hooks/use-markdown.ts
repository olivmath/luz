'use client'

import { useState, useEffect } from 'react'
import { loadMarkdown, parseMarkdownToHtml, parseQuiz, stripQuizFromMarkdown } from '@/lib/markdown'
import { cacheReadingTime } from '@/lib/helpers'
import type { QuizQuestion } from '@/types'

interface UseMarkdownResult {
  html: string
  quiz: QuizQuestion[] | null
  readingTime: number
  loading: boolean
  error: boolean
}

export function useMarkdown(courseId: string, moduleId: string, lessonId: string): UseMarkdownResult {
  const [html, setHtml] = useState('')
  const [quiz, setQuiz] = useState<QuizQuestion[] | null>(null)
  const [readingTime, setReadingTime] = useState(8)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    loadMarkdown(courseId, moduleId, lessonId)
      .then(text => {
        if (cancelled) return
        const wordCount = text.split(/\s+/).length
        const time = Math.max(1, Math.ceil(wordCount / 200))
        cacheReadingTime(`${courseId}/${moduleId}/${lessonId}`, wordCount)
        setReadingTime(time)

        const parsedQuiz = parseQuiz(text)
        setQuiz(parsedQuiz)

        const cleanMd = parsedQuiz ? stripQuizFromMarkdown(text) : text
        setHtml(parseMarkdownToHtml(cleanMd))
        setLoading(false)
      })
      .catch(() => {
        if (cancelled) return
        setError(true)
        setLoading(false)
      })

    return () => { cancelled = true }
  }, [courseId, moduleId, lessonId])

  return { html, quiz, readingTime, loading, error }
}
