import { COURSES } from './courses'
import type { FlatLesson, AdjacentLessons } from '@/types'

const WORDS_PER_MINUTE = 200
const readingTimeCache: Record<string, number> = {}

export function estimateReadingTime(wordCount: number): number {
  return Math.max(1, Math.ceil(wordCount / WORDS_PER_MINUTE))
}

export function cacheReadingTime(key: string, wordCount: number): void {
  readingTimeCache[key] = estimateReadingTime(wordCount)
}

export function getReadingTime(key: string): number {
  return readingTimeCache[key] || 8
}

export function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}min` : `${h}h`
}

export function getFlatLessons(courseId: string): FlatLesson[] {
  const course = COURSES[courseId]
  if (!course) return []
  const flat: FlatLesson[] = []
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      flat.push({
        courseId,
        moduleId: mod.id,
        moduleTitle: mod.title,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        lessonNumber: lesson.number,
      })
    }
  }
  return flat
}

export function getAdjacentLessons(courseId: string, moduleId: string, lessonId: string): AdjacentLessons {
  const flat = getFlatLessons(courseId)
  const idx = flat.findIndex(l => l.moduleId === moduleId && l.lessonId === lessonId)
  return {
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
    currentIndex: idx,
    total: flat.length,
  }
}

export function getCourseTime(courseId: string): number {
  const flat = getFlatLessons(courseId)
  let total = 0
  for (const l of flat) {
    const key = `${l.courseId}/${l.moduleId}/${l.lessonId}`
    total += readingTimeCache[key] || 8
  }
  return total
}
