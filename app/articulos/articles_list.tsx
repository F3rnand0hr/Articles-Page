// app/articulos/articles-list.tsx
"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Scale } from "lucide-react"
import { AnimatedArticlesGrid } from "@/components/animated-articles-grid"
import { colors, theme } from "@/lib/colors"

const ARTICLES_PER_PAGE = 5

export function ArticlesList() {
  const [articles, setArticles] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const supabase = createClient()

  const loadArticles = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('articles')
        .select(`
          id,
          title,
          excerpt,
          category,
          featured,
          likes_count,
          comments_count,
          created_at,
          article_authors!inner(
            profiles(
              id,
              display_name,
              avatar_url
            )
          )
        `)
        .eq("published", true)
        .order("created_at", { ascending: false })

      if (error) throw error

      const articlesData = data || []
      
      // Get actual like counts from article_likes table
      if (articlesData.length > 0) {
        const articleIds = articlesData.map(article => article.id)
        
        // Fetch all likes for these articles
        const { data: likesData, error: likesError } = await supabase
          .from('article_likes')
          .select('article_id')
          .in('article_id', articleIds)

        if (!likesError && likesData) {
          // Count likes per article
          const likesCountMap = new Map<string, number>()
          articleIds.forEach(id => likesCountMap.set(id, 0))
          likesData.forEach(like => {
            const currentCount = likesCountMap.get(like.article_id) || 0
            likesCountMap.set(like.article_id, currentCount + 1)
          })

          // Update articles with actual like counts
          articlesData.forEach(article => {
            article.likes_count = likesCountMap.get(article.id) || 0
          })
        }
      }

      setArticles(articlesData)
      setHasMore(false) // No more to load after this
    } catch (error) {
      console.error("Error loading articles:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadArticles()
  }, [])

  const handleLoadMore = () => {
    loadArticles()
  }

  const featuredArticles = articles.filter(article => article.featured)
  const regularArticles = articles.filter(article => !article.featured)

  if (loading && articles.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Scale className="h-8 w-8 text-gray-400" />
        </div>
        <p className="text-gray-500">Cargando artículos...</p>
      </div>
    )
  }

  return (
    <>
      {/* Articles Grid */}
      <div className="mb-12">
        <h2 className={`text-2xl font-bold ${theme.light.foreground} mb-8`}>
          {articles.length > 0 ? "Artículos recientes" : "No hay artículos disponibles"}
        </h2>
        <AnimatedArticlesGrid articles={[...featuredArticles, ...regularArticles]} />
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-8">
          <Button 
            variant="outline" 
            className="border-gray-300 text-gray-700 hover:bg-gray-50"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Cargar más artículos"}
          </Button>
        </div>
      )}
    </>
  )
}