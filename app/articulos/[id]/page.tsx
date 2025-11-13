import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scale, MessageCircle, Calendar, User, ArrowLeft } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { LikeButton } from "@/components/like-button"
import { CommentsSection } from "@/components/comments-section"
import Link from "next/link"
import { notFound } from "next/navigation"

type Profile = {
  id: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
}

type ArticleAuthor = {
  is_primary_author: boolean
  profiles: Profile
}

type Article = {
  id: string
  title: string
  content: string
  excerpt: string | null
  category: string
  featured: boolean
  likes_count: number
  comments_count: number
  created_at: string
  article_authors: ArticleAuthor[]
}

type Comment = {
  id: string
  content: string
  created_at: string
  updated_at: string
  profiles: Profile
}

interface ArticlePageProps {
  params: { id: string }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { id } = params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('articles')
    .select(`
      id,
      title,
      content,
      excerpt,
      category,
      featured,
      likes_count,
      comments_count,
      created_at,
      article_authors!inner(
        is_primary_author,
        profiles (
          id,
          display_name,
          bio,
          avatar_url
        )
      )
    `)
    .eq('id', id)
    .eq('published', true)
    .single()
    
  const article = data as Article | null

  if (error || !article) {
    notFound()
  }
  
  // Sort authors to show primary author first
  const sortedAuthors = article.article_authors
    .sort((a, b) => (a.is_primary_author === b.is_primary_author ? 0 : a.is_primary_author ? -1 : 1))
    .map(author => author.profiles)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <Scale className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold text-white">Derecho en Perspectiva</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/articulos" className="text-red-400 font-medium">
                Artículos
              </Link>
              <Link href="/sobre-nosotros" className="text-slate-300 hover:text-white transition-colors">
                Sobre Nosotros
              </Link>
              <UserNav />
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/articulos">
            <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Artículos
            </Button>
          </Link>
        </div>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="bg-red-500/20 text-red-400 border-red-500/30 capitalize">
              {article.category}
            </Badge>
            {article.featured && (
              <Badge variant="outline" className="border-yellow-500/50 text-yellow-400">
                Destacado
              </Badge>
            )}
          </div>

          <h1 className="text-4xl font-bold text-white mb-6 text-balance">{article.title}</h1>

          <div className="flex items-center justify-between text-slate-400 mb-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {sortedAuthors.slice(0, 3).map((author) => (
                    <div key={author.id} className="relative group">
                      {author.avatar_url ? (
                        <img
                          src={author.avatar_url}
                          alt={author.display_name || 'Autor'}
                          className="h-8 w-8 rounded-full border-2 border-slate-800 hover:border-red-500 transition-all"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-800 hover:border-red-500 transition-all">
                          <User className="h-4 w-4 text-slate-300" />
                        </div>
                      )}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {author.display_name || 'Autor'}
                      </div>
                    </div>
                  ))}
                  {sortedAuthors.length > 3 && (
                    <div className="h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs text-slate-400">
                      +{sortedAuthors.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex flex-col">
                  <div className="text-sm text-slate-300">
                    Por {sortedAuthors[0]?.display_name || 'Autor'}
                    {sortedAuthors.length > 1 && ` y ${sortedAuthors.length - 1} más`}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {new Date(article.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MessageCircle className="h-5 w-5" />
                <span>{article.comments_count}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <Card className="bg-slate-800/30 border-slate-700 mb-8">
          <CardContent className="p-8">
            <div className="prose prose-invert prose-slate max-w-none">
              <div className="text-slate-200 leading-relaxed whitespace-pre-wrap text-lg">{article.content}</div>
            </div>
          </CardContent>
        </Card>

        {/* Authors Info */}
        <Card className="bg-slate-800/30 border-slate-700 mb-8">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Sobre los autores</h3>
            <div className="space-y-4">
              {sortedAuthors.map((author) => (
                <div key={author.id} className="flex items-start gap-4">
                  {author.avatar_url ? (
                    <img
                      src={author.avatar_url}
                      alt={author.display_name || 'Autor'}
                      className="h-12 w-12 rounded-full border-2 border-slate-700"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-slate-400" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-medium text-white">{author.display_name || 'Autor'}</h4>
                    {author.bio && <p className="text-slate-300 text-sm mt-1">{author.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Interaction Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <LikeButton articleId={article.id} initialLikesCount={article.likes_count} />
          <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent">
            <MessageCircle className="h-4 w-4 mr-2" />
            Comentar ({article.comments_count})
          </Button>
        </div>

        {/* Comments Section */}
        <CommentsSection articleId={article.id} initialCommentsCount={article.comments_count} />
      </main>
    </div>
  )
}
