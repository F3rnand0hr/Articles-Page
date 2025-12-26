import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://articles-page-five.vercel.app'
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/articulos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/sobre-nosotros`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Dynamic article pages
  try {
    const supabase = await createClient()
    const { data: articles } = await supabase
      .from('articles')
      .select('id, updated_at, created_at')
      .eq('published', true)
      .order('updated_at', { ascending: false })

    const articlePages: MetadataRoute.Sitemap = (articles || []).map((article) => ({
      url: `${siteUrl}/articulos/${article.id}`,
      lastModified: article.updated_at ? new Date(article.updated_at) : new Date(article.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    return [...staticPages, ...articlePages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Return static pages even if database query fails
    return staticPages
  }
}

