'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function toggleArticleLike(articleId: string, userId: string) {
    const supabase = await createClient()

    // Check if the user already liked the article
    const { data: existingLike, error: likeError } = await supabase
        .from('article_likes')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_id', userId)
        .single()

    if (likeError && likeError.code !== 'PGRST116') { // PGRST116 means no rows returned
        console.error('Error checking existing like:', likeError)
        return { error: 'Error checking like status' }
    }

    if (existingLike) {
        // Unlike the article
        const { error: deleteError } = await supabase
            .from('article_likes')
            .delete()
            .eq('id', existingLike.id)

        if (deleteError) {
            console.error('Error unliking article:', deleteError)
            return { error: 'Error unliking article' }
        }

        // Decrement likes_count directly in the articles table
        const { error: decrementError } = await supabase.rpc('decrement_article_likes', {
            article_id: articleId
        })

        if (decrementError) {
            console.error('Error decrementing likes:', decrementError)
            // Fallback to direct update if RPC fails
            const { error: updateError } = await supabase
                .from('articles')
                .update({ likes_count: supabase.rpc('COALESCE(likes_count, 0) - 1') })
                .eq('id', articleId)
                .gt('likes_count', 0)

            if (updateError) {
                console.error('Fallback update error:', updateError)
                return { error: 'Error updating like count' }
            }
        }
    } else {
        // Like the article
        const { error: insertError } = await supabase
            .from('article_likes')
            .insert([
                { article_id: articleId, user_id: userId }
            ])

        if (insertError) {
            console.error('Error liking article:', insertError)
            return { error: 'Error liking article' }
        }

        // Increment likes_count directly in the articles table
        const { error: incrementError } = await supabase.rpc('increment_article_likes', {
            article_id: articleId
        })

        if (incrementError) {
            console.error('Error incrementing likes:', incrementError)
            // Fallback to direct update if RPC fails
            const { error: updateError } = await supabase
                .from('articles')
                .update({ likes_count: supabase.rpc('COALESCE(likes_count, 0) + 1') })
                .eq('id', articleId)

            if (updateError) {
                console.error('Fallback update error:', updateError)
                return { error: 'Error updating like count' }
            }
        }
    }

    // Revalidate the article page and articles list
    revalidatePath(`/articulos/${articleId}`)
    revalidatePath('/articulos')

    return { success: true }
}

/**
 * Checks if a user has liked an article
 * @param articleId The ID of the article
 * @param userId The ID of the user
 * @returns Object with `liked` boolean and potential error
 */
export async function hasUserLikedArticle(articleId: string, userId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('article_likes')
        .select('id')
        .eq('article_id', articleId)
        .eq('user_id', userId)
        .maybeSingle()

    if (error) {
        console.error('Error checking if user liked article:', error)
        return { error: 'Error checking like status', liked: false }
    }

    return { liked: !!data, error: null }
}

export async function getArticleLikesCount(articleId: string) {
    const supabase = await createClient()

    const { count, error } = await supabase
        .from('article_likes')
        .select('*', { count: 'exact', head: true })
        .eq('article_id', articleId)

    if (error) {
        console.error('Error getting article likes count:', error)
        return { error: 'Error getting like count' }
    }

    return { count: count || 0 }
}
