"use client"
import { createClient } from "@/lib/supabase/server"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Scale, Heart, MessageCircle, Calendar, User } from "lucide-react"
import Link from "next/link"
import { colors, colorCombos, theme } from "@/lib/colors"


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
            {articles.map((article) => (
                <motion.div key={article.id} variants={item}>
                    <Card className={`h-full flex flex-col ${colorCombos.darkCard} hover:bg-opacity-90 transition-colors`}>
                        <CardHeader className="pb-2">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className={`text-xs ${colorCombos.secondaryButton} hover:opacity-90`}>
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
                            <div className={`flex items-center justify-between text-sm ${colorCombos.secondaryText}`}>
                                <div className="flex items-center space-x-2">
                                    <User className={`h-4 w-4 ${colorCombos.secondaryText}`} />
                                    <span className={colorCombos.secondaryText}>{article.article_authors[0]?.profiles?.display_name || 'Anónimo'}</span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`flex items-center ${colorCombos.secondaryText}`}>
                                        <Heart className={`h-4 w-4 mr-1 ${colorCombos.icon.red}`} />
                                        {article.likes_count}
                                    </span>
                                    <span className={`flex items-center ${colorCombos.secondaryText}`}>
                                        <MessageCircle className={`h-4 w-4 mr-1 ${colorCombos.icon.blue}`} />
                                        {article.comments_count}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button asChild variant="outline" size="sm" className={`${colorCombos.icon} hover:opacity-90`}>
                                    <Link href={`/articulos/${article.id}`}>
                                        Leer más
                                    </Link>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </motion.div>
    )
}

export default AnimatedArticlesGrid