# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LUZ is a course platform with two content areas: Agronegócio Financeiro (agricultural finance) and Nanotecnologia Cosmética (cosmetic nanotechnology). 4 courses, 72 lessons total.

## Commands

```bash
pnpm dev          # Dev server with Turbopack (runs on port 3001)
pnpm build        # Production build
pnpm start        # Start production server
```

Package manager: **pnpm** (do not use npm/yarn).

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 4 with CSS custom properties (design tokens in `app/globals.css`)
- Clerk auth (`@clerk/nextjs`) with Google OAuth
- `next-themes` for light/dark mode
- `marked` for markdown rendering
- No database — courses defined statically, progress in localStorage

## Architecture

**Routing:**
- `/` — Catalog (courses grouped by category)
- `/[courseId]` — Course detail with module accordion
- `/[courseId]/[moduleId]/[lessonId]` — Lesson page (markdown + quiz)
- `/certificado/[courseId]` — Certificate (requires 100% completion)
- `/perfil` — User profile (protected by Clerk middleware)

**Data flow:**
- Course catalog: `lib/courses.ts` → `COURSES` object (static)
- Lesson content: `content/{courseId}/{moduleId}/{lessonId}.md` → fetched at runtime by `lib/markdown.ts`
- Progress: `context/progress-context.tsx` → localStorage scoped by Clerk userId
- Quiz: parsed from `## Questionario` section in markdown files

**Key conventions:**
- Course IDs: `curso-01` through `curso-04`
- Module IDs: `modulo-01`, `modulo-02`, etc.
- Lesson IDs: `aula-01`, `aula-02`, etc.
- Content paths map directly: `/curso-01/modulo-01/aula-01` → `content/curso-01/modulo-01/aula-01.md`
- Categories: "Agronegócio Financeiro" (curso-01, curso-02), "Nanotecnologia Cosmética" (curso-03, curso-04)

**Styling tokens** (defined as CSS variables in `globals.css`):
- Colors: `--green-700`, `--green-600`, `--cream-*` for light; inverted for dark
- Fonts: Cormorant Garamond (display), Newsreader (body), IBM Plex Mono (mono)
- Layout: `--header-h: 56px`, `--sidebar-w: 280px`, `--content-max: 1120px`, `--reading-max: 680px`

**Clerk integration:**
- `middleware.ts` protects `/perfil(.*)` only; everything else is public
- `globals.css` has `@layer clerk;` before Tailwind import (required for Tailwind 4 compat)
- `layout.tsx` wraps with `<ClerkProvider appearance={{ cssLayerName: 'clerk' }}>`
- Avatar images from `img.clerk.com` (configured in `next.config.ts`)

## Language

All UI text is in Brazilian Portuguese (PT-BR). Use proper accents: ã, ç, é, ê, í, ó, ô, ú, ü.

## Screenshots & Design Checks

Save all design check screenshots to `public/screenshots/`. Use descriptive names like `design-check-home.png`, `design-check-home-mobile.png`, etc. Reference design: Updraft Cyfrin (https://updraft.cyfrin.io/courses).

## Course Images

- Path: `public/images/courses/{courseId}.svg` (or `.png`/`.webp`)
- Current SVG dimensions: 1200x630 (OG-image ratio)
- Card display: 80x80px (`w-20 h-20`) rounded square with `object-cover`
- Recommended: square images (e.g., 400x400 or 600x600) for better card display since they render as squares

## Development Workflow

Follow brainstorm → plan → approve → implement for non-trivial features. Use EnterPlanMode before creative/architectural changes.


