# Checklist: Adicionar Novo Curso à Plataforma

Workflow para atualizar todos os pontos da plataforma ao incluir um novo curso.

---

## 1. Criar conteúdo das aulas

- [ ] Criar pasta `content/{contentDir}/` (ex.: `content/saude/`)
- [ ] Dentro dela, criar pastas por módulo: `modulo-01/`, `modulo-02/`, etc.
- [ ] Criar arquivos de aula: `aula-01.md`, `aula-02.md`, etc.
- [ ] Cada aula deve ter seções de conteúdo e opcionalmente `## Questionario`
- [ ] Criar `README.md` em cada nível de módulo se necessário

## 2. Registrar o curso em `lib/courses.ts`

- [ ] Adicionar entrada no objeto `COURSES` com:
  - `id` — slug descritivo (ex.: `saude-blockchain-fundamentos`)
  - `contentDir` — pasta de conteúdo (ex.: `curso-12`)
  - `title`, `subtitle`, `level`, `description`
  - `image` — caminho da imagem (ex.: `/images/courses/curso-12.svg`)
  - `modules[]` com `lessons[]` completos

## 3. Criar imagem do curso

- [ ] Adicionar imagem em `public/images/courses/{contentDir}.svg` (ou `.png`/`.webp`)
- [ ] Dimensão recomendada: 400x400 ou 600x600 (quadrada)

## 4. Atualizar trilhas em `lib/tracks.ts`

- [ ] Adicionar o `courseId` na trilha correspondente (ou criar nova trilha)
- [ ] Atualizar `objectives[]` da trilha se necessário

## 5. Atualizar o footer em `components/footer.tsx`

- [ ] Adicionar o `courseId` no array `courses` da categoria correspondente em `CATEGORIES`
- [ ] Se for uma nova categoria, criar entrada nova em `CATEGORIES`

## 6. Atualizar a landing page em `components/landing-page.tsx`

- [ ] Verificar se a seção de categorias/cursos reflete o novo curso
- [ ] Atualizar contadores ou textos se houver menção a quantidade de cursos

## 7. Ampliar o glossário em `lib/glossary.ts`

- [ ] Adicionar termos relevantes do novo curso ao array `GLOSSARY`
- [ ] Cada termo precisa de: `id`, `term`, `definition`, `category`, `courseId`
- [ ] Categorias válidas: `'agronegocio' | 'nanotecnologia' | 'did' | 'saude'`
- [ ] Se for uma nova categoria, atualizar o type `GlossaryTerm['category']`

## 8. Adicionar artigos no blog em `app/blog/page.tsx`

- [ ] Adicionar pelo menos 2-3 artigos ao array `ARTICLES` com a categoria do novo curso
- [ ] Se for uma nova categoria, adicionar entrada em `CATEGORIES` (filtro do blog)

## 9. Atualizar metadata e SEO

- [ ] Verificar `app/layout.tsx` — description inclui a nova área
- [ ] Verificar `app/glossario/page.tsx` — description menciona a nova área
- [ ] Verificar `app/blog/layout.tsx` — description menciona a nova área

## 10. Atualizar `CLAUDE.md`

- [ ] Atualizar a seção "Project Overview" com o novo curso
- [ ] Atualizar "Categories" com os novos courseIds
- [ ] Atualizar contagem total de cursos e aulas

## 11. Validar

```bash
pnpm build        # Verificar se compila sem erros
pnpm dev           # Testar navegação manual:
```

- [ ] Home — novo curso aparece no catálogo
- [ ] Página do curso — módulos e aulas renderizam
- [ ] Trilha — novo curso aparece na progressão
- [ ] Blog — artigos da nova categoria aparecem e filtro funciona
- [ ] Glossário — novos termos aparecem e link "Ver no curso" funciona
- [ ] Footer — novo curso listado na categoria correta
- [ ] Certificado — emite ao completar 100%

---

> **Dica:** Use este checklist como prompt para o Claude Code:
> "Adicione o curso X seguindo o `NOVO-CURSO-CHECKLIST.md`"
