import { marked } from 'marked'
import type { QuizQuestion } from '@/types'
import { COURSES } from './courses'

marked.setOptions({ breaks: true, gfm: true })

const mdCache = new Map<string, string>()

export async function loadMarkdown(courseId: string, moduleId: string, lessonId: string): Promise<string> {
  const course = COURSES[courseId]
  const contentDir = course?.contentDir || courseId
  const cacheKey = `${contentDir}/${moduleId}/${lessonId}`
  const cached = mdCache.get(cacheKey)
  if (cached) return cached

  const isFree = moduleId === 'modulo-01' && lessonId === 'aula-01'
  const url = isFree
    ? `/${contentDir}/${moduleId}/${lessonId}.md`
    : `/api/content/${contentDir}/${moduleId}/${lessonId}`

  const res = await fetch(url)
  if (!res.ok) throw new Error(`${res.status}`)
  const text = await res.text()
  mdCache.set(cacheKey, text)
  return text
}

export function parseMarkdownToHtml(markdown: string): string {
  return marked.parse(markdown) as string
}

export function parseQuiz(markdown: string): QuizQuestion[] | null {
  const quizStart = markdown.indexOf('## Questionario')
  if (quizStart === -1) return null

  const quizText = markdown.substring(quizStart)
  const questions: QuizQuestion[] = []
  const blocks = quizText.split(/\*\*(\d+)\.\s/)

  for (let i = 1; i < blocks.length; i += 2) {
    const number = parseInt(blocks[i])
    const rest = blocks[i + 1]
    if (!rest) continue

    const textMatch = rest.match(/^(.*?)\*\*/)
    if (!textMatch) continue
    const text = textMatch[1].trim()

    const options: { letter: string; text: string }[] = []
    const optionRegex = /^([a-d])\)\s*(.+)$/gm
    let optMatch
    while ((optMatch = optionRegex.exec(rest)) !== null) {
      options.push({ letter: optMatch[1], text: optMatch[2].trim() })
    }

    const answerMatch = rest.match(/\*\*Resposta:\s*(\w)\*\*/)
    if (!answerMatch) continue

    questions.push({ number, text, options, correctAnswer: answerMatch[1].toLowerCase() })
  }

  return questions.length > 0 ? questions : null
}

export function stripQuizFromMarkdown(markdown: string): string {
  const idx = markdown.indexOf('## Questionario')
  return idx === -1 ? markdown : markdown.substring(0, idx).trim()
}
