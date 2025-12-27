import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://derechoenperspectiva.xyz'
  
  // Static pages - always include these
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

  // Dynamic article pages - fetch with timeout and error handling
  let articlePages: MetadataRoute.Sitemap = []
  
  try {
    // Create a timeout promise
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Database query timeout')), 5000) // 5 second timeout
    })

    // Create the database query promise
    const queryPromise = (async () => {
      const supabase = await createClient()
      const { data: articles, error } = await supabase
        .from('articles')
        .select('id, updated_at, created_at')
        .eq('published', true)
        .order('updated_at', { ascending: false })
        .limit(50000) // Limit to prevent huge sitemaps

      if (error) {
        console.error('Supabase error in sitemap:', error)
        return []
      }

      return articles || []
    })()

    // Race between timeout and query
    const articles = await Promise.race([queryPromise, timeoutPromise])

    articlePages = articles.map((article) => ({
      url: `${siteUrl}/articulos/${article.id}`,
      lastModified: article.updated_at ? new Date(article.updated_at) : new Date(article.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch (error) {
    // Log error but don't fail - return static pages
    console.error('Error generating sitemap (non-fatal):', error instanceof Error ? error.message : error)
    // Continue with just static pages
  }

  // Always return at least the static pages
  return [...staticPages, ...articlePages]
}

