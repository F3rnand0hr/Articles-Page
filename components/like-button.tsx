"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface LikeButtonProps {
  articleId: string
  initialLikesCount: number
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
}

export function LikeButton({ articleId, initialLikesCount, variant = "default", size = "default" }: LikeButtonProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLoading, setIsLoading] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    if (user) {
      checkIfLiked()
    }
  }, [user, articleId])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setUser(user)
  }

  const checkIfLiked = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("article_likes")
        .select("id")
        .eq("article_id", articleId)
        .eq("user_id", user.id)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error checking like status:", error)
        return
      }

      setIsLiked(!!data)
    } catch (error) {
      console.error("Error checking like status:", error)
    }
  }

  const handleLike = async () => {
    if (!user) {
      // Redirect to login
      window.location.href = "/auth/login"
      return
    }

    setIsLoading(true)

    try {
      if (isLiked) {
        // Unlike
        const { error } = await supabase
          .from("article_likes")
          .delete()
          .eq("article_id", articleId)
          .eq("user_id", user.id)

        if (error) throw error

        setIsLiked(false)
        setLikesCount((prev) => prev - 1)
      } else {
        // Like
        const { error } = await supabase.from("article_likes").insert({
          article_id: articleId,
          user_id: user.id,
        })

        if (error) throw error

        setIsLiked(true)
        setLikesCount((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLike}
      disabled={isLoading}
      variant={variant}
      size={size}
      className={
        variant === "default"
          ? `${isLiked ? "bg-red-600 hover:bg-red-700" : "bg-red-600 hover:bg-red-700"} text-white`
          : "border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
      }
    >
      <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-current" : ""}`} />
      {isLiked ? "Te Gusta" : "Me Gusta"} ({likesCount})
    </Button>
  )
}
