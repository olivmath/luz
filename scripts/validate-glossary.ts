/**
 * Valida o glossário:
 * 1. Cada termo tem courseId válido (existe em COURSES)
 * 2. Cada rota /cursos/{courseId} resolve para um curso real
 * 3. Cada entrada no term-lesson-index aponta para um curso/módulo/aula válido
 * 4. O arquivo markdown da aula existe no filesystem
 * 5. O termo realmente aparece no conteúdo markdown da aula
 *
 * Uso: pnpm validate:glossary
 */

import * as fs from 'fs'
import * as path from 'path'
import { GLOSSARY } from '../lib/glossary'
import { COURSES } from '../lib/courses'

const ROOT = path.resolve(__dirname, '..')
const indexPath = path.join(ROOT, 'lib', 'term-lesson-index.json')

let errors = 0
let warnings = 0
let checks = 0

function fail(msg: string) {
  console.error(`  ✗ ${msg}`)
  errors++
}

function warn(msg: string) {
  console.warn(`  ⚠ ${msg}`)
  warnings++
}

function pass(msg: string) {
  checks++
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&')
}

// ──────────────────────────────────────────────
// 1. Validar courseId de cada termo do glossário
// ──────────────────────────────────────────────
console.log('\n1. Validando courseId dos termos do glossário...')
for (const term of GLOSSARY) {
  if (!term.courseId) {
    warn(`Termo "${term.term}" (${term.id}) não tem courseId`)
    continue
  }
  if (!COURSES[term.courseId]) {
    fail(`Termo "${term.term}" (${term.id}) tem courseId "${term.courseId}" que não existe em COURSES`)
  } else {
    pass(`${term.id} → ${term.courseId}`)
  }
}

// ──────────────────────────────────────────────
// 2. Validar IDs únicos
// ──────────────────────────────────────────────
console.log('\n2. Validando IDs únicos...')
const idCounts = new Map<string, number>()
for (const term of GLOSSARY) {
  idCounts.set(term.id, (idCounts.get(term.id) || 0) + 1)
}
for (const [id, count] of idCounts) {
  if (count > 1) {
    fail(`ID "${id}" aparece ${count} vezes no glossário`)
  } else {
    pass(`${id} único`)
  }
}

// ──────────────────────────────────────────────
// 3. Validar term-lesson-index.json
// ──────────────────────────────────────────────
console.log('\n3. Validando term-lesson-index.json...')

if (!fs.existsSync(indexPath)) {
  fail(`Arquivo ${indexPath} não encontrado. Rode: pnpm build:index`)
} else {
  const index: Record<string, Array<{
    courseId: string
    courseTitle: string
    moduleId: string
    moduleTitle: string
    lessonId: string
    lessonTitle: string
    lessonNumber: string
  }>> = JSON.parse(fs.readFileSync(indexPath, 'utf-8'))

  // 3a. Cada termId no index existe no glossário
  console.log('\n  3a. Cada termId do index existe no glossário...')
  const glossaryIds = new Set(GLOSSARY.map(t => t.id))
  for (const termId of Object.keys(index)) {
    if (!glossaryIds.has(termId)) {
      fail(`Index contém termId "${termId}" que não existe no glossário`)
    } else {
      pass(`${termId} existe no glossário`)
    }
  }

  // 3b. Cada entrada aponta para curso/módulo/aula válidos
  console.log('\n  3b. Cada entrada aponta para curso/módulo/aula válidos...')
  for (const [termId, entries] of Object.entries(index)) {
    for (const entry of entries) {
      const course = COURSES[entry.courseId]
      if (!course) {
        fail(`[${termId}] courseId "${entry.courseId}" não existe em COURSES`)
        continue
      }

      const mod = course.modules.find(m => m.id === entry.moduleId)
      if (!mod) {
        fail(`[${termId}] moduleId "${entry.moduleId}" não existe no curso "${entry.courseId}"`)
        continue
      }

      const lesson = mod.lessons.find(l => l.id === entry.lessonId)
      if (!lesson) {
        fail(`[${termId}] lessonId "${entry.lessonId}" não existe no módulo "${entry.moduleId}" do curso "${entry.courseId}"`)
        continue
      }

      // 3c. Arquivo markdown existe
      const mdPath = path.join(ROOT, 'public', course.contentDir, entry.moduleId, `${entry.lessonId}.md`)
      if (!fs.existsSync(mdPath)) {
        fail(`[${termId}] Markdown não encontrado: ${mdPath}`)
        continue
      }

      // 3d. Termo aparece no conteúdo
      const term = GLOSSARY.find(t => t.id === termId)
      if (term) {
        const content = fs.readFileSync(mdPath, 'utf-8')
        const escaped = escapeRegex(term.term)
        const regex = new RegExp(`\\b${escaped}\\b`, 'i')
        if (!regex.test(content)) {
          fail(`[${termId}] Termo "${term.term}" não encontrado no conteúdo de ${course.contentDir}/${entry.moduleId}/${entry.lessonId}.md`)
        } else {
          pass(`${termId} → ${entry.courseId}/${entry.moduleId}/${entry.lessonId}`)
        }
      }
    }
  }

  // 3e. Validar títulos estão sincronizados
  console.log('\n  3c. Validando títulos sincronizados com COURSES...')
  for (const [termId, entries] of Object.entries(index)) {
    for (const entry of entries) {
      const course = COURSES[entry.courseId]
      if (!course) continue

      if (entry.courseTitle !== course.title) {
        fail(`[${termId}] courseTitle "${entry.courseTitle}" != "${course.title}" (COURSES)`)
      }

      const mod = course.modules.find(m => m.id === entry.moduleId)
      if (mod && entry.moduleTitle !== mod.title) {
        fail(`[${termId}] moduleTitle "${entry.moduleTitle}" != "${mod.title}" (COURSES)`)
      }

      const lesson = mod?.lessons.find(l => l.id === entry.lessonId)
      if (lesson) {
        if (entry.lessonTitle !== lesson.title) {
          fail(`[${termId}] lessonTitle "${entry.lessonTitle}" != "${lesson.title}" (COURSES)`)
        }
        if (entry.lessonNumber !== lesson.number) {
          fail(`[${termId}] lessonNumber "${entry.lessonNumber}" != "${lesson.number}" (COURSES)`)
        }
      }

      pass(`${termId} títulos ok`)
    }
  }
}

// ──────────────────────────────────────────────
// 4. Validar rotas (formato)
// ──────────────────────────────────────────────
console.log('\n4. Validando formato das rotas...')
for (const term of GLOSSARY) {
  if (!term.courseId) continue
  const route = `/cursos/${term.courseId}`
  if (!/^\/cursos\/[a-z0-9-]+$/.test(route)) {
    fail(`Rota "${route}" do termo "${term.term}" tem formato inválido`)
  } else {
    pass(`${route} formato ok`)
  }
}

// ──────────────────────────────────────────────
// Resultado
// ──────────────────────────────────────────────
console.log('\n' + '═'.repeat(50))
console.log(`  ${checks} verificações passaram`)
if (warnings > 0) console.log(`  ${warnings} avisos`)
if (errors > 0) {
  console.error(`  ${errors} ERROS encontrados`)
  console.log('═'.repeat(50))
  process.exit(1)
} else {
  console.log(`  0 erros — Glossário válido!`)
  console.log('═'.repeat(50))
}
