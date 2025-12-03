import { createClient } from "@/lib/supabase/server"
import { SupabaseClient } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scale, Heart, MessageCircle, Calendar, User } from "lucide-react"
import { AnimatedArticlesGrid } from "@/components/animated-articles-grid"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { colors, colorCombos, theme } from "@/lib/colors"

interface Profile {
  id: string
  display_name: string | null
  avatar_url: string | null
}

interface ArticleAuthor {
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
        profiles(
          id,
          display_name,
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

  const featuredArticles = (articles || []).filter((article) => article.featured)
  const regularArticles = (articles || []).filter((article) => !article.featured)

  return (
    <div className={`min-h-screen ${theme.light.background}`}>
      {/* Navigation */}
      <nav className={`${theme.light.background} ${theme.light.border} border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Scale className={`h-8 w-8 ${colors.primary.text[600]}`} />
              <span className={`text-xl font-bold ${theme.light.foreground}`}>Derecho en Perspectiva</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/articulos" className={`${colors.primary.text[600]} font-medium`}>
                Artículos
              </Link>
              <Link href="/sobre-nosotros" className={`${colorCombos.mutedText} hover:${theme.light.foreground} transition-colors`}>
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
          <div className={`mb-12 ${colors.white[100]} rounded-xl overflow-hidden`}>
            <div className="md:flex">
              <div className="md:flex-shrink-0 md:w-1/2">
                <img
                  className="h-64 w-full object-cover md:h-full"
                  src="/images/placeholder-article.jpg"
                  alt="Featured article"
                />
              </div>
              <div className="p-8 md:w-1/2">
                <div className="flex items-center text-sm mb-4">
                  <span className={`bg-red-100 ${colors.primary.text[800]} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                    {featuredArticles[0].category}
                  </span>
                  <span className={`mx-2 ${colorCombos.mutedText}`}>•</span>
                  <span className={colorCombos.mutedText}>
                    {new Date(featuredArticles[0].created_at).toLocaleDateString("es-ES", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h2 className={`text-2xl font-bold ${theme.light.foreground} mb-3`}>
                  {featuredArticles[0].title}
                </h2>
                <p className={`${colorCombos.mutedText} mb-6`}>
                  {featuredArticles[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {featuredArticles[0].article_authors.slice(0, 3).map((author) => {
                        const profile = author.profiles;
                        return (
                          <div key={profile.id} className="relative group">
                            {profile.avatar_url ? (
                              <img
                                src={profile.avatar_url}
                                alt={profile.display_name || 'Autor'}
                                className="h-8 w-8 rounded-full border-2 border-white"
                              />
                            ) : (
                              <div className={`h-8 w-8 rounded-full ${colors.white[200]} flex items-center justify-center`}>
                                <User className={`h-4 w-4 ${colors.white.text[600]}`} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <span className={`ml-3 text-sm ${colorCombos.mutedText}`}>
                      Por {featuredArticles[0].article_authors[0]?.profiles?.display_name || 'Autor'}
                      {featuredArticles[0].article_authors.length > 1 && ` y ${featuredArticles[0].article_authors.length - 1} más`}
                    </span>
                  </div>
                  <Link href={`/articulos/${featuredArticles[0].id}`}>
                    <Button className={colorCombos.primaryButton}>
                      Leer más
                    </Button>
                  </Link>
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

        {/* Load More Button */}
        {articles && articles.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
              Cargar más artículos
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
