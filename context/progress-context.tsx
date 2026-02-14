'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { COURSES } from '@/lib/courses'
import type { ProgressData, QuizData, QuizResult } from '@/types'

interface ProgressContextType {
  isCompleted: (courseId: string, moduleId: string, lessonId: string) => boolean
  markCompleted: (courseId: string, moduleId: string, lessonId: string) => void
  getCourseProgress: (courseId: string) => { completed: number; total: number }
  getModuleProgress: (courseId: string, moduleId: string) => { completed: number; total: number }
  isCourseComplete: (courseId: string) => boolean
  getNextLesson: (courseId: string) => { courseId: string; moduleId: string; lessonId: string; lesson: { id: string; title: string; number: string } } | null
  saveQuizResult: (courseId: string, moduleId: string, lessonId: string, correct: number, total: number) => void
  getQuizStats: () => { totalCorrect: number; totalQuestions: number }
  studentName: string
  setStudentName: (name: string) => void
}

const ProgressContext = createContext<ProgressContextType | null>(null)

const PROGRESS_KEY = 'oken-curso-progress'
const QUIZ_KEY = 'oken-quiz-results'
const NAME_KEY = 'oken-student-name'

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const [data, setData] = useState<ProgressData>({})
  const [quizData, setQuizData] = useState<QuizData>({})
  const [studentName, setStudentNameState] = useState('')
  const [mounted, setMounted] = useState(false)

  // Derive scoped storage keys based on Clerk userId
  const progressKey = user?.id ? `oken-curso-progress-${user.id}` : PROGRESS_KEY
  const quizKey = user?.id ? `oken-quiz-results-${user.id}` : QUIZ_KEY
  const nameKey = user?.id ? `oken-student-name-${user.id}` : NAME_KEY

  // Load from localStorage only after Clerk has loaded
  useEffect(() => {
    if (!isLoaded) return

    // Load progress data from the scoped key
    let progress: ProgressData = {}
    try {
      const raw = localStorage.getItem(progressKey)
      progress = raw ? JSON.parse(raw) : {}
    } catch {
      progress = {}
    }

    // Migration: if user is logged in and scoped key was empty, copy from unscoped key
    if (user?.id && Object.keys(progress).length === 0) {
      try {
        const unscopedRaw = localStorage.getItem(PROGRESS_KEY)
        if (unscopedRaw) {
          const unscopedProgress = JSON.parse(unscopedRaw)
          if (Object.keys(unscopedProgress).length > 0) {
            progress = unscopedProgress
            localStorage.setItem(progressKey, JSON.stringify(progress))
          }
        }
      } catch {}
    }

    setData(progress)

    // Load student name from the scoped key
    let name = ''
    try {
      name = localStorage.getItem(nameKey) || ''
    } catch {}

    // Migration: if user is logged in and scoped name was empty, copy from unscoped key
    if (user?.id && !name) {
      try {
        const unscopedName = localStorage.getItem(NAME_KEY) || ''
        if (unscopedName) {
          name = unscopedName
          localStorage.setItem(nameKey, name)
        }
      } catch {}
    }

    // Auto-fill studentName from Clerk profile if localStorage is still empty
    if (!name && user?.fullName) {
      name = user.fullName
      try {
        localStorage.setItem(nameKey, name)
      } catch {}
    }

    setStudentNameState(name)

    // Load quiz data
    let quiz: QuizData = {}
    try {
      const rawQuiz = localStorage.getItem(quizKey)
      quiz = rawQuiz ? JSON.parse(rawQuiz) : {}
    } catch {
      quiz = {}
    }
    setQuizData(quiz)

    setMounted(true)
  }, [isLoaded, user?.id, user?.fullName, progressKey, quizKey, nameKey])

  // Persist progress data to scoped key
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(progressKey, JSON.stringify(data))
    } catch {}
  }, [data, mounted, progressKey])

  // Persist quiz data to scoped key
  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(quizKey, JSON.stringify(quizData))
    } catch {}
  }, [quizData, mounted, quizKey])

  const isCompleted = useCallback((courseId: string, moduleId: string, lessonId: string) => {
    return !!(data[courseId] && data[courseId][`${moduleId}/${lessonId}`])
  }, [data])

  const markCompleted = useCallback((courseId: string, moduleId: string, lessonId: string) => {
    setData(prev => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        [`${moduleId}/${lessonId}`]: { completedAt: new Date().toISOString() },
      },
    }))
  }, [])

  const getCourseProgress = useCallback((courseId: string) => {
    const course = COURSES[courseId]
    if (!course) return { completed: 0, total: 0 }
    let completed = 0, total = 0
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        total++
        if (data[courseId] && data[courseId][`${mod.id}/${lesson.id}`]) completed++
      }
    }
    return { completed, total }
  }, [data])

  const getModuleProgress = useCallback((courseId: string, moduleId: string) => {
    const course = COURSES[courseId]
    if (!course) return { completed: 0, total: 0 }
    const mod = course.modules.find(m => m.id === moduleId)
    if (!mod) return { completed: 0, total: 0 }
    let completed = 0
    for (const lesson of mod.lessons) {
      if (data[courseId] && data[courseId][`${mod.id}/${lesson.id}`]) completed++
    }
    return { completed, total: mod.lessons.length }
  }, [data])

  const isCourseComplete = useCallback((courseId: string) => {
    const { completed, total } = getCourseProgress(courseId)
    return total > 0 && completed === total
  }, [getCourseProgress])

  const getNextLesson = useCallback((courseId: string) => {
    const course = COURSES[courseId]
    if (!course) return null
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        if (!(data[courseId] && data[courseId][`${mod.id}/${lesson.id}`])) {
          return { courseId, moduleId: mod.id, lessonId: lesson.id, lesson }
        }
      }
    }
    return null
  }, [data])

  const saveQuizResult = useCallback((courseId: string, moduleId: string, lessonId: string, correct: number, total: number) => {
    const key = `${courseId}/${moduleId}/${lessonId}`
    setQuizData(prev => ({
      ...prev,
      [key]: { correct, total, completedAt: new Date().toISOString() },
    }))
  }, [])

  const getQuizStats = useCallback(() => {
    let totalCorrect = 0
    let totalQuestions = 0
    for (const result of Object.values(quizData)) {
      totalCorrect += result.correct
      totalQuestions += result.total
    }
    return { totalCorrect, totalQuestions }
  }, [quizData])

  const setStudentName = useCallback((name: string) => {
    setStudentNameState(name)
    try {
      localStorage.setItem(nameKey, name)
    } catch {}
  }, [nameKey])

  return (
    <ProgressContext.Provider value={{
      isCompleted, markCompleted, getCourseProgress, getModuleProgress,
      isCourseComplete, getNextLesson, saveQuizResult, getQuizStats,
      studentName, setStudentName,
    }}>
      {children}
    </ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
