"use client"

import { useState } from "react"
import { X, User } from "lucide-react"
import { colors, colorCombos, theme } from "@/lib/colors"
import ReactMarkdown from "react-markdown"

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
                onClick={(e) => {
                    e.stopPropagation()
                    setOpen(true)
                }}
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
                                    Sobre el autor
                                </h3>
                                <div className="space-y-4">
                                    {authors.map((author) => (
                                        <div key={author.id} className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                                            {author.avatar_url ? (
                                                <img
                                                    src={author.avatar_url}
                                                    alt={author.display_name || "Autor"}
                                                    className="h-32 w-32 sm:h-40 sm:w-40 rounded-full border-2 border-white shadow-sm flex-shrink-0 object-cover"
                                                />
                                            ) : (
                                                <div className={`h-32 w-32 sm:h-40 sm:w-40 ${colors.white[200]} rounded-full flex items-center justify-center flex-shrink-0`}>
                                                    <User className={`h-8 w-8 sm:h-10 sm:w-10 ${colors.white.text[600]}`} />
                                                </div>
                                            )}
                                            <div className="text-center sm:text-left">
                                                <h4 className={`font-medium ${theme.light.foreground}`}>
                                                    {author.display_name || "Autor"}
                                                </h4>
                                                {author.bio && (
                                                    <div className={`${colorCombos.secondaryText} text-sm mt-1`}>
                                                        <ReactMarkdown
                                                            components={{
                                                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                                                strong: ({ node, ...props }) => <strong className="font-semibold text-gray-900" {...props} />,
                                                                em: ({ node, ...props }) => <em className="italic" {...props} />,
                                                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-2 space-y-1" {...props} />,
                                                                ol: ({ node, ...props }) => <ol className="list-decimal list-inside mb-2 space-y-1" {...props} />,
                                                                li: ({ node, ...props }) => <li className="ml-2" {...props} />,
                                                                a: ({ node, ...props }) => (
                                                                    <a className="text-blue-600 hover:text-blue-800 underline" {...props} />
                                                                ),
                                                                code: ({ node, ...props }) => (
                                                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono" {...props} />
                                                                ),
                                                            }}
                                                        >
                                                            {author.bio}
                                                        </ReactMarkdown>
                                                    </div>
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
