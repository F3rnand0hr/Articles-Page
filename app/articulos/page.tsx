import { createClient } from "@/lib/supabase/server"
import { SupabaseClient } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scale, Heart, Calendar, User } from "lucide-react"
import { AnimatedArticlesGrid } from "@/components/animated-articles-grid"
import { AuthorSection } from "@/components/author-section"
import { ShareButton } from "@/components/share-button"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { colors, colorCombos, theme } from "@/lib/colors"
import { getArticleLikesCounts } from "@/app/actions/article-actions"

interface Profile {
  id: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
}

interface ArticleAuthor {
  is_primary_author: boolean
  profiles: Profile
}

interface Article {
  id: string
  title: string
  excerpt: string
  category: string
  featured: boolean
  likes_count: number
  comments_count: number
  created_at: string
  article_authors: ArticleAuthor[]
}

export default async function ArticulosPage() {
  const supabase: SupabaseClient = await createClient()

  type ArticleResponse = {
    id: string
    title: string
    excerpt: string
    category: string
    featured: boolean
    likes_count: number
    comments_count: number
    created_at: string
    article_authors: Array<{
      is_primary_author: boolean
      profiles: Profile
    }>
  }

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
      article_authors(
        is_primary_author,
        profiles(
          id,
          display_name,
          bio,
          avatar_url
        )
      )
    `)
    .eq("published", true)
    .order("created_at", { ascending: false })

  const articles = data as ArticleResponse[] | null

  if (error) {
    console.error("Error fetching articles:", error)
  }

  // Get actual like counts from article_likes table
  const articleIds = (articles || []).map(article => article.id)
  const likesCountsMap = await getArticleLikesCounts(articleIds)

  // Update articles with actual like counts
  const articlesWithLikes = (articles || []).map(article => ({
    ...article,
    likes_count: likesCountsMap.get(article.id) || 0
  }))

  const featuredArticles = articlesWithLikes.filter((article) => article.featured)
  const regularArticles = articlesWithLikes.filter((article) => !article.featured)

  return (
    <div className={`min-h-screen ${theme.light.background}`}>
      {/* Navigation */}
      <nav className={`${theme.light.background} ${theme.light.border} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Scale className={`h-8 w-8 ${colors.primary.text[700]}`} />
              <span className={`text-xl font-bold ${colors.primary.text[800]} tracking-tight`}>Derecho en Perspectiva</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/articulos" className="text-[#6a2124] font-semibold border-b-2 border-[#6a2124] pb-1">
                Artículos
              </Link>
              <Link href="/sobre-nosotros" className={`${colorCombos.navLink}`}>
                Sobre Nosotros
              </Link>
              <UserNav />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Featured Article */}
        {featuredArticles.length > 0 && (
          <div className={`mb-12 ${theme.light.card} ${theme.light.border} border rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center text-sm mb-4">
              <Badge variant="secondary" className="bg-[#f9d9d9] text-[#6a2124] border-[#f3b3b3] border capitalize">
                {featuredArticles[0].category}
              </Badge>
              <Badge variant="outline" className="ml-2 bg-[#ffefc1] text-[#b8941f] border-[#ffefc1] border">
                Destacado
              </Badge>
              <span className={`mx-3 ${colorCombos.mutedText}`}>•</span>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span className={colorCombos.mutedText}>
                  {new Date(featuredArticles[0].created_at).toLocaleDateString("es-ES", {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <h2 className={`text-3xl font-bold ${theme.light.foreground} mb-4`}>
              {featuredArticles[0].title}
            </h2>
            <p className={`${colorCombos.secondaryText} text-lg mb-6 leading-relaxed`}>
              {featuredArticles[0].excerpt}
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-3">
                {(() => {
                  // Sort authors to show primary author first
                  const sortedAuthors = featuredArticles[0].article_authors
                    .sort((a, b) => (a.is_primary_author === b.is_primary_author ? 0 : a.is_primary_author ? -1 : 1))
                    .map(author => author.profiles)

                  return (
                    <>
                      <div className="flex -space-x-2">
                        {sortedAuthors.slice(0, 3).map((profile) => (
                          <div key={profile.id} className="relative group">
                            {profile.avatar_url ? (
                              <img
                                src={profile.avatar_url}
                                alt={profile.display_name || 'Escritor Invitado'}
                                className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover"
                              />
                            ) : (
                              <div className={`h-10 w-10 rounded-full ${colors.white[200]} flex items-center justify-center border-2 border-white`}>
                                <User className={`h-5 w-5 ${colors.white.text[600]}`} />
                              </div>
                            )}
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                              {profile.display_name || 'Escritor Invitado'}
                            </div>
                          </div>
                        ))}
                        {sortedAuthors.length > 3 && (
                          <div className="h-10 w-10 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs text-slate-400">
                            +{sortedAuthors.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <AuthorSection
                          primaryName={sortedAuthors[0]?.display_name || null}
                          extraCount={sortedAuthors.length > 1 ? sortedAuthors.length - 1 : 0}
                          authors={sortedAuthors}
                        />
                      </div>
                    </>
                  )
                })()}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`flex items-center ${colorCombos.secondaryText}`}>
                    <Heart className={`h-4 w-4 mr-1 ${colorCombos.icon.red}`} />
                    {featuredArticles[0].likes_count}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/articulos/${featuredArticles[0].id}`}>
                    <Button className={colorCombos.primaryButton}>
                      Leer más
                    </Button>
                  </Link>
                  <ShareButton
                    articleId={featuredArticles[0].id}
                    articleTitle={featuredArticles[0].title}
                    variant="outline"
                    size="default"
                    iconOnly={true}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold ${theme.light.foreground} mb-8`}>Artículos recientes</h2>
          <AnimatedArticlesGrid articles={[...featuredArticles.slice(1), ...regularArticles]} />
        </div>

        {/* Empty State */}
        {(!articles || articles.length === 0) && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scale className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay artículos disponibles</h3>
            <p className="text-gray-500">Los artículos aparecerán aquí una vez que sean publicados.</p>
          </div>
        )}

       
      </main>
    </div>
  )
}
