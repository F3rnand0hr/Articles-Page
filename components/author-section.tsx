"use client"

import { useState } from "react"
import { X, User } from "lucide-react"
import { colors, colorCombos, theme } from "@/lib/colors"

type Author = {
    id: string
    display_name: string | null
    bio: string | null
    avatar_url: string | null
}

interface AuthorSectionProps {
    primaryName: string | null
    extraCount: number
    authors: Author[]
}

export function AuthorSection({ primaryName, extraCount, authors }: AuthorSectionProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={`text-left text-sm ${colorCombos.secondaryText} underline-offset-2 hover:underline`}
            >
                Por {primaryName || "Autor"}
                {extraCount > 0 && ` y ${extraCount} más`}
            </button>

            {open && (
                <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center">
                    <div className="relative w-full h-full">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="absolute top-4 right-4 z-50 rounded-full bg-white/90 hover:bg-white text-gray-900 shadow-lg p-2"
                        >
                            <X className="h-5 w-5" />
                        </button>

                        <div className="flex h-full items-center justify-center px-4">
                            <div className={`max-w-xl w-full rounded-xl shadow-2xl ${theme.light.card} ${theme.light.border} p-6 sm:p-8 overflow-y-auto max-h-[90vh]`}>
                                <h3 className={`text-2xl font-semibold mb-4 ${theme.light.foreground}`}>
                                    Sobre los autores
                                </h3>
                                <div className="space-y-4">
                                    {authors.map((author) => (
                                        <div key={author.id} className="flex items-start gap-4">
                                            {author.avatar_url ? (
                                                <img
                                                    src={author.avatar_url}
                                                    alt={author.display_name || "Autor"}
                                                    className="h-12 w-12 rounded-full border-2 border-white shadow-sm"
                                                />
                                            ) : (
                                                <div className={`w-12 h-12 ${colors.white[200]} rounded-full flex items-center justify-center`}>
                                                    <User className={`h-6 w-6 ${colors.white.text[600]}`} />
                                                </div>
                                            )}
                                            <div>
                                                <h4 className={`font-medium ${theme.light.foreground}`}>
                                                    {author.display_name || "Autor"}
                                                </h4>
                                                {author.bio && (
                                                    <p className={`${colorCombos.secondaryText} text-sm mt-1`}>
                                                        {author.bio}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
