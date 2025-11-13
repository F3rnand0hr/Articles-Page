import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scale, Heart, MessageCircle, Calendar, User } from "lucide-react"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"

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
  const supabase = await createClient()

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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Scale className="h-8 w-8 text-red-600" />
              <span className="text-xl font-bold text-gray-900">Derecho en Perspectiva</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/articulos" className="text-red-600 font-medium">
                Artículos
              </Link>
              <Link href="/sobre-nosotros" className="text-gray-500 hover:text-gray-900 transition-colors">
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
          <div className="mb-12 bg-gray-50 rounded-xl overflow-hidden">
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
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    {featuredArticles[0].category}
                  </span>
                  <span className="mx-2 text-gray-500">•</span>
                  <span className="text-gray-500">
                    {new Date(featuredArticles[0].created_at).toLocaleDateString("es-ES", {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">
                  {featuredArticles[0].title}
                </h2>
                <p className="text-gray-600 mb-6">
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
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <User className="h-4 w-4 text-gray-500" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <span className="ml-3 text-sm text-gray-500">
                      Por {featuredArticles[0].article_authors[0]?.profiles?.display_name || 'Autor'}
                      {featuredArticles[0].article_authors.length > 1 && ` y ${featuredArticles[0].article_authors.length - 1} más`}
                    </span>
                  </div>
                  <Link href={`/articulos/${featuredArticles[0].id}`}>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
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
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Artículos recientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...featuredArticles.slice(1), ...regularArticles].map((article) => (
              <article key={article.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src="/images/placeholder-article.jpg"
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm mb-3">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      {article.category}
                    </span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-500">
                      {new Date(article.created_at).toLocaleDateString("es-ES", {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex -space-x-2">
                        {article.article_authors.slice(0, 2).map((author) => {
                          const profile = author.profiles;
                          return (
                            <div key={profile.id} className="relative group">
                              {profile.avatar_url ? (
                                <img
                                  src={profile.avatar_url}
                                  alt={profile.display_name || 'Autor'}
                                  className="h-6 w-6 rounded-full border-2 border-white"
                                />
                              ) : (
                                <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="h-3 w-3 text-gray-500" />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        {article.article_authors[0]?.profiles?.display_name || 'Autor'}
                        {article.article_authors.length > 1 && ` +${article.article_authors.length - 1}`}
                      </span>
                    </div>
                    <Link href={`/articulos/${article.id}`}>
                      <Button variant="ghost" className="text-red-600 hover:bg-red-50">
                        Leer más
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
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
        <div className="flex justify-center mt-8">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            Cargar más artículos
          </Button>
        </div>
      </main>
    </div>
  )
}
