import * as fs from 'fs'
import * as path from 'path'
import { GLOSSARY } from '../lib/glossary'
import { COURSES } from '../lib/courses'

const ROOT = path.resolve(__dirname, '..')

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')
}

interface LessonEntry {
  courseId: string
  courseTitle: string
  moduleId: string
  moduleTitle: string
  lessonId: string
  lessonTitle: string
  lessonNumber: string
}

type TermIndex = Record<string, LessonEntry[]>

function main() {
  const index: TermIndex = {}

  for (const term of GLOSSARY) {
    index[term.id] = []
  }

  for (const course of Object.values(COURSES)) {
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        const mdPath = path.join(ROOT, 'public', course.contentDir, mod.id, `${lesson.id}.md`)

        let content: string
        try {
          content = fs.readFileSync(mdPath, 'utf-8')
        } catch (err: any) {
          if (err.code === 'ENOENT') continue
          throw err
        }

        for (const term of GLOSSARY) {
          const escaped = escapeRegex(term.term)
          const regex = new RegExp(`\\b${escaped}\\b`, 'i')

          if (regex.test(content)) {
            index[term.id].push({
              courseId: course.id,
              courseTitle: course.title,
              moduleId: mod.id,
              moduleTitle: mod.title,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              lessonNumber: lesson.number,
            })
          }
        }
      }
    }
  }

  // Remove terms with no matches
  for (const key of Object.keys(index)) {
    if (index[key].length === 0) {
      delete index[key]
    }
  }

  const outPath = path.join(ROOT, 'lib', 'term-lesson-index.json')
  fs.writeFileSync(outPath, JSON.stringify(index, null, 2), 'utf-8')

  const termCount = Object.keys(index).length
  const totalEntries = Object.values(index).reduce((sum, arr) => sum + arr.length, 0)
  console.log(`Done! ${termCount} terms mapped to ${totalEntries} lesson entries.`)
  console.log(`Output: ${outPath}`)
}

main()
