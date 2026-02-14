import type { MetadataRoute } from 'next'

const COURSE_IDS = ['financeiro-agro-fundamentos', 'financeiro-agro-avancado', 'nanotecnologia-fundamentos', 'nanovetores-avancado', 'tokenizacao-agro-fundamentos', 'tokenizacao-agro-avancado']

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://luz.oliveira.com.br'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/glossario`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/trilha/agronegocio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/trilha/nanotecnologia`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
  ]

  const courseRoutes: MetadataRoute.Sitemap = COURSE_IDS.map(courseId => ({
    url: `${baseUrl}/cursos/${courseId}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...courseRoutes]
}
