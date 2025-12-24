import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scale, MessageCircle, Calendar, User, ArrowLeft } from "lucide-react"
import { UserNav } from "@/components/user-nav"
import { LikeButton } from "@/components/like-button"
import { ShareButton } from "@/components/share-button"
import { CommentsSection } from "@/components/comments-section"
import Link from "next/link"
import { notFound } from "next/navigation"
import { colors, colorCombos, theme } from "@/lib/colors"
import { hasUserLikedArticle } from "@/app/actions/article-actions"
import { AuthorSection } from "@/components/author-section"
import ReactMarkdown from "react-markdown"

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
    return notFound()
  }

  // Get current user session
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user has liked the article and get the actual like count
  let isLiked = false
  let actualLikesCount = 0

  // Get the like count and check if user has liked the article in parallel
  const [{ count }, likeStatus] = await Promise.all([
    supabase
      .from('article_likes')
      .select('*', { count: 'exact', head: true })
      .eq('article_id', article.id),
    user ? hasUserLikedArticle(article.id, user.id) : { liked: false, error: null }
  ])

  actualLikesCount = count || 0
  isLiked = likeStatus.liked || false

  // Sort authors to show primary author first
  const sortedAuthors = article.article_authors
    .sort((a, b) => (a.is_primary_author === b.is_primary_author ? 0 : a.is_primary_author ? -1 : 1))
    .map(author => author.profiles)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <div className="mb-8">
          <Link href="/articulos">
            <Button variant="ghost" className={`${colorCombos.navLink} px-0`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Artículos
            </Button>
          </Link>
        </div>
        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="bg-[#f9d9d9] text-[#6a2124] border-[#f3b3b3] border capitalize">
              {article.category}
            </Badge>
            {article.featured && (
              <Badge variant="outline" className="bg-[#ffefc1] text-[#b8941f] border-[#ffefc1] border">
                Destacado
              </Badge>
            )}
          </div>

          <h1 className={`text-4xl font-bold ${theme.light.foreground} mb-6 text-balance`}>{article.title}</h1>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500 mb-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {sortedAuthors.slice(0, 3).map((author) => (
                    <div key={author.id} className="relative group">
                      {author.avatar_url ? (
                        <img
                          src={author.avatar_url}
                          alt={author.display_name || 'Autor'}
                          className="h-12 w-12 rounded-full border-2 border-white shadow-sm object-cover"
                        />
                      ) : (
                        <div className={`h-12 w-12 rounded-full ${colors.white[200]} flex items-center justify-center border-2 border-white`}>
                          <User className={`h-6 w-6 ${colors.white.text[600]}`} />
                        </div>
                      )}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        {author.display_name || 'Autor'}
                      </div>
                    </div>
                  ))}
                  {sortedAuthors.length > 3 && (
                    <div className="h-12 w-12 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-xs text-slate-400">
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

            {/* <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <MessageCircle className="h-5 w-5" />
                <span>{article.comments_count}</span>
              </div>
            </div> */}
          </div>
        </div>

        {/* Interaction Buttons */}
        <div className="flex items-center gap-4 mb-8">
          <LikeButton
            articleId={article.id}
            initialLikesCount={actualLikesCount}
            initialIsLiked={isLiked}
          />
          <ShareButton
            articleId={article.id}
            articleTitle={article.title}
          />
          {/* <Button
            variant="outline"
            className={`border-gray-300 text-gray-700 hover:bg-gray-50`}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Comentar ({article.comments_count})
          </Button> */}
        </div>
        {/**
         * Authors Info (temporarily disabled)
         *
         * To re-enable, remove this JSX comment wrapper.
         */}
        {/**
        <Card className={`${theme.light.card} ${theme.light.border} mb-8`}>
          <CardContent className="p-6">
            <h3 className={`text-lg font-semibold ${theme.light.foreground} mb-4`}>Sobre los autores</h3>
            <div className="space-y-4">
              {sortedAuthors.map((author) => (
                <div key={author.id} className="flex items-start gap-4">
                  {author.avatar_url ? (
                    <img
                      src={author.avatar_url}
                      alt={author.display_name || 'Autor'}
                      className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
                    />
                  ) : (
                    <div className={`w-12 h-12 ${colors.white[200]} rounded-full flex items-center justify-center`}>
                      <User className={`h-6 w-6 ${colors.white.text[600]}`} />
                    </div>
                  )}
                  <div>
                    <h4 className={`font-medium ${theme.light.foreground}`}>{author.display_name || 'Autor'}</h4>
                    {author.bio && <p className={`${colorCombos.secondaryText} text-sm mt-1`}>{author.bio}</p>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        */}

        {/* Comments Section */}
        {/* <div className="mb-16">
          <CommentsSection articleId={article.id} initialCommentsCount={article.comments_count} />
        </div> */}

        {/* Article Content */}
        <Card className={`${theme.light.card} ${theme.light.border} mb-8`}>
          <CardContent className="p-4 sm:p-6 lg:p-8">
            <div className="prose prose-lg prose-gray max-w-none w-full">
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => <p className="leading-relaxed mb-4 text-gray-600 break-words" {...props} />,
                  strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                  em: ({ node, ...props }) => <em className="italic" {...props} />,
                  h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900" {...props} />,
                  h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900" {...props} />,
                  h3: ({ node, ...props }) => <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900" {...props} />,
                  ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-600" {...props} />,
                  ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-600" {...props} />,
                  li: ({ node, ...props }) => <li className="ml-4" {...props} />,
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-700" {...props} />
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-gray-800" {...props} />
                  ),
                  pre: ({ node, ...props }) => (
                    <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4" {...props} />
                  ),
                  a: ({ node, ...props }) => (
                    <a className="text-blue-600 hover:text-blue-800 underline break-all" {...props} />
                  ),
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>

  )
}