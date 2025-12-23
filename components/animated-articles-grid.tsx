"use client"
import { createClient } from "@/lib/supabase/server"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scale, Heart, Calendar, User } from "lucide-react"
import Link from "next/link"
import { colors, colorCombos, theme } from "@/lib/colors"
import { AuthorSection } from "@/components/author-section"


export function AnimatedArticlesGrid({ articles }: { articles: any[] }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    }

    if (!articles || articles.length === 0) {
        return <div className="text-center py-12">No articles found</div>
    }


    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {articles.map((article) => {
                // Sort authors to show primary author first
                const sortedAuthors = article.article_authors
                    ?.sort((a: any, b: any) => (a.is_primary_author === b.is_primary_author ? 0 : a.is_primary_author ? -1 : 1))
                    .map((author: any) => author.profiles) || []

                return (
                    <motion.div key={article.id} variants={item}>
                        <Card className={`h-full flex flex-col ${colorCombos.darkCard} hover:bg-opacity-90 transition-colors`}>
                            <CardHeader className="pb-2">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="secondary" className="text-xs bg-red-100 text-red-700 border-red-200 capitalize hover:opacity-90">
                                        {article.category}
                                    </Badge>
                                    {article.featured && (
                                        <Badge variant="default" className={`text-xs ${colorCombos.primaryButton} hover:opacity-90`}>
                                            Destacado
                                        </Badge>
                                    )}
                                </div>
                                <h3 className={`font-semibold text-lg line-clamp-2 ${theme.light.foreground}`}>
                                    {article.title}
                                </h3>
                                <p className={`text-sm ${colorCombos.secondaryText} mt-2 line-clamp-2`}>
                                    {article.excerpt}
                                </p>
                            </CardHeader>
                            <CardContent className="mt-auto pt-0">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {sortedAuthors.slice(0, 3).map((profile: any) => (
                                                <div key={profile.id} className="relative group">
                                                    {profile.avatar_url ? (
                                                        <img
                                                            src={profile.avatar_url}
                                                            alt={profile.display_name || 'Autor'}
                                                            className="h-10 w-10 rounded-full border-2 border-white shadow-sm object-cover"
                                                        />
                                                    ) : (
                                                        <div className={`h-10 w-10 rounded-full ${colors.white[200]} flex items-center justify-center border-2 border-white`}>
                                                            <User className={`h-5 w-5 ${colors.white.text[600]}`} />
                                                        </div>
                                                    )}
                                                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                        {profile.display_name || 'Autor'}
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
                                    </div>
                                    <div className="flex items-center">
                                        <span className={`flex items-center ${colorCombos.secondaryText}`}>
                                            <Heart className={`h-4 w-4 mr-1 ${colorCombos.icon.red}`} />
                                            {article.likes_count}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <Button asChild variant="outline" size="sm" className={`${colorCombos.icon} hover:opacity-90`}>
                                        <Link href={`/articulos/${article.id}`}>
                                            Leer más
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )
            })}
        </motion.div>
    )
}

export default AnimatedArticlesGrid