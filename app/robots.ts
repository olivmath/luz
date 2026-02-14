import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/perfil', '/sign-in', '/sign-up', '/api/'],
    },
    sitemap: 'https://luz.oliveira.com.br/sitemap.xml',
  }
}
