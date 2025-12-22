"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageCircle, Reply, User } from "lucide-react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { colors, colorCombos, theme } from "@/lib/colors"

interface Comment {
  id: string
  content: string
  created_at: string
  author_id: string
  parent_id: string | null
  profiles: {
    display_name: string
    avatar_url: string | null
  }[]
  replies?: Comment[]
}

interface CommentsSectionProps {
  articleId: string
  initialCommentsCount: number
}

export function CommentsSection({ articleId, initialCommentsCount }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<{ display_name: string; avatar_url: string | null } | null>(null)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    checkUser()
    fetchComments()
  }, [articleId])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
    
    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .single()
      setUserProfile(profile)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from("comments")
        .select(`
          id,
          content,
          created_at,
          author_id,
          parent_id,
          profiles!comments_author_id_fkey (
            display_name,
            avatar_url
          )
        `)
        .eq("article_id", articleId)
        .order("created_at", { ascending: true })

      if (error) throw error

      // Organize comments into threads
      const commentMap = new Map<string, Comment>()
      const rootComments: Comment[] = []

      // First pass: create all comment objects
      data?.forEach((comment) => {
        const commentObj: Comment = {
          ...comment,
          replies: [],
        }
        commentMap.set(comment.id, commentObj)
      })

      // Second pass: organize into threads
      data?.forEach((comment) => {
        const commentObj = commentMap.get(comment.id)!
        if (comment.parent_id) {
          const parent = commentMap.get(comment.parent_id)
          if (parent) {
            parent.replies!.push(commentObj)
          }
        } else {
          rootComments.push(commentObj)
        }
      })

      setComments(rootComments)
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newComment.trim()) return

    setSubmitting(true)
    try {
      const { error } = await supabase.from("comments").insert({
        article_id: articleId,
        author_id: user.id,
        content: newComment.trim(),
        parent_id: null,
      })

      if (error) throw error

      setNewComment("")
      await fetchComments()
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitReply = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault()
    if (!user || !replyContent.trim()) return

    setSubmitting(true)
    try {
      const { error } = await supabase.from("comments").insert({
        article_id: articleId,
        author_id: user.id,
        content: replyContent.trim(),
        parent_id: parentId,
      })

      if (error) throw error

      setReplyContent("")
      setReplyingTo(null)
      await fetchComments()
    } catch (error) {
      console.error("Error submitting reply:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const CommentItem = ({ comment, depth = 0 }: { comment: Comment; depth?: number }) => (
    <div className={`${depth > 0 ? "ml-8 border-l border-gray-200 pl-4" : ""}`}>
      <Card className={`${theme.light.card} ${theme.light.border} mb-4`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {comment.profiles?.[0]?.avatar_url ? (
              <img
                src={comment.profiles[0].avatar_url}
                alt={comment.profiles[0]?.display_name || "Usuario"}
                className="w-12 h-12 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-gray-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className={`font-medium ${theme.light.foreground}`}>
                  {comment.profiles?.[0]?.display_name || "Usuario"}
                </span>
                <span className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className={`${colorCombos.secondaryText} mb-3 whitespace-pre-wrap`}>{comment.content}</p>
              {user && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                  className="text-gray-500 hover:text-gray-800 hover:bg-gray-100 p-0 h-auto"
                >
                  <Reply className="h-3 w-3 mr-1" />
                  Responder
                </Button>
              )}
            </div>
          </div>

          {/* Reply Form */}
          {replyingTo === comment.id && user && (
            <form onSubmit={(e) => handleSubmitReply(e, comment.id)} className="mt-4 ml-11">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 mb-3"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  type="submit"
                  size="sm"
                  disabled={!replyContent.trim() || submitting}
                  className={colorCombos.primaryButton}
                >
                  {submitting ? "Enviando..." : "Responder"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyContent("")
                  }}
                  className="text-slate-400 hover:text-white hover:bg-slate-700"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Render replies */}
      {comment.replies?.map((reply) => (
        <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
      ))}
    </div>
  )

  if (loading) {
    return (
      <Card className={`${theme.light.card} ${theme.light.border}`}>
        <CardContent className="p-8 text-center">
          <MessageCircle className={`h-12 w-12 ${colors.primary.text[400]} mx-auto mb-4`} />
          <p className={colorCombos.secondaryText}>Cargando comentarios...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={`${theme.light.card} ${theme.light.border}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-6">
          <MessageCircle className={`h-5 w-5 ${colors.primary.text[500]}`} />
          <h3 className={`text-xl font-semibold ${theme.light.foreground}`}>
            Comentarios ({comments.reduce((total, comment) => total + 1 + (comment.replies?.length || 0), 0)})
          </h3>
        </div>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmitComment} className="mb-8">
            <div className="flex items-start gap-3">
              {userProfile?.avatar_url ? (
                <img
                  src={userProfile.avatar_url}
                  alt={userProfile.display_name || "Usuario"}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
              )}
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Comparte tu opinión sobre este artículo..."
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-400 mb-3"
                  rows={4}
                />
                <Button
                  type="submit"
                  disabled={!newComment.trim() || submitting}
                  className={colorCombos.primaryButton}
                >
                  {submitting ? "Enviando..." : "Publicar Comentario"}
                </Button>
              </div>
            </div>
          </form>
        ) : (
          <div className="text-center mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <p className={colorCombos.secondaryText + " mb-4"}>Inicia sesión para participar en la discusión</p>
            <Button className={colorCombos.primaryButton}>
              <a href="/auth/login">Iniciar Sesión</a>
            </Button>
          </div>
        )}

        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <MessageCircle className={`h-12 w-12 ${colors.primary.text[400]} mx-auto mb-4`} />
            <p className={colorCombos.secondaryText}>
              {user ? "Sé el primero en comentar este artículo" : "No hay comentarios aún"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
