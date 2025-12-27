import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://derechoenperspectiva.xyz'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/auth/', '/api/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}

