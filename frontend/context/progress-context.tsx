'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { COURSES } from '@/lib/courses'
import type { ProgressData } from '@/types'

interface ProgressContextType {
  isCompleted: (courseId: string, moduleId: string, lessonId: string) => boolean
  markCompleted: (courseId: string, moduleId: string, lessonId: string) => void
  getCourseProgress: (courseId: string) => { completed: number; total: number }
  getModuleProgress: (courseId: string, moduleId: string) => { completed: number; total: number }
  isCourseComplete: (courseId: string) => boolean
  getNextLesson: (courseId: string) => { courseId: string; moduleId: string; lessonId: string; lesson: { id: string; title: string; number: string } } | null
  studentName: string
  setStudentName: (name: string) => void
}

const ProgressContext = createContext<ProgressContextType | null>(null)

const PROGRESS_KEY = 'oken-curso-progress'
const NAME_KEY = 'oken-student-name'

function loadProgress(): ProgressData {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ProgressData>({})
  const [studentName, setStudentNameState] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setData(loadProgress())
    try {
      setStudentNameState(localStorage.getItem(NAME_KEY) || '')
    } catch {}
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    try {
      localStorage.setItem(PROGRESS_KEY, JSON.stringify(data))
    } catch {}
  }, [data, mounted])

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

  const setStudentName = useCallback((name: string) => {
    setStudentNameState(name)
    try {
      localStorage.setItem(NAME_KEY, name)
    } catch {}
  }, [])

  return (
    <ProgressContext.Provider value={{
      isCompleted, markCompleted, getCourseProgress, getModuleProgress,
      isCourseComplete, getNextLesson, studentName, setStudentName,
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
