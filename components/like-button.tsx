"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import type { User } from "@supabase/supabase-js"
import { toggleArticleLike } from "@/app/actions/article-actions"
import { toast } from "@/hooks/use-toast"

interface LikeButtonProps {
  articleId: string
  initialLikesCount: number
  initialIsLiked?: boolean
  variant?: "default" | "outline"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function LikeButton({
  articleId,
  initialLikesCount,
  initialIsLiked = false,
  variant = "outline",
  size = "default",
  className = ""
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked)
  const [likesCount, setLikesCount] = useState(initialLikesCount)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleLike = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Inicia sesión",
          description: "Por favor iniciar sesión o crear una cuenta para dar like.",
        })
        return
      }

      const { error } = await toggleArticleLike(articleId, user.id)

      if (error) {
        toast({
          variant: "destructive",
          title: "Error al actualizar el like",
          description: String(error),
        })
        return
      }

      // Optimistic update
      if (isLiked) {
        setLikesCount(prev => Math.max(0, prev - 1))
      } else {
        setLikesCount(prev => prev + 1)
        setIsLiked(!isLiked)
      }


    } catch (error) {
      console.error('Error toggling like:', error)
      toast({
        variant: "destructive",
        title: "Error al actualizar el like",
        description: "Ocurrió un error al actualizar el like.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant={isLiked ? 'default' : variant}
      size={size}
      onClick={handleLike}
      disabled={isLoading}
      className={`gap-2 ${isLiked ? 'bg-red-600 hover:bg-red-700' : ''} ${className}`}
    >
      <Heart
        className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`}
        fill={isLiked ? 'currentColor' : 'none'}
      />
      <span>{likesCount}</span>
    </Button>
  )
}
