"use client"

import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scale, Users, BookOpen, Target } from "lucide-react"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { colors, colorCombos, theme } from "@/lib/colors"
import { createClient } from "@/lib/supabase/client"

export default function SobreNosotrosPage() {
    const [user, setUser] = useState<SupabaseUser | null>(null)
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser()
                setUser(user)
            } catch (error) {
                console.error("Error checking user on about page:", error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        void checkUser()
    }, [supabase])

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
            {/* Navigation */}
            <nav className={`${theme.light.border} border-b bg-white/80 backdrop-blur-sm`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2">
                            <Scale className={`h-8 w-8 ${colors.primary.text[700]}`} />
                            <span className={`text-xl font-bold ${theme.light.foreground}`}>Derecho en Perspectiva</span>
                        </Link>
                        <div className="hidden md:flex items-center gap-6">
                            <Link href="/articulos" className={colorCombos.navLink}>
                                Artículos
                            </Link>
                            <Link href="/sobre-nosotros" className={colorCombos.navLinkActive}>
                                Sobre Nosotros
                            </Link>
                            <UserNav />
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className={`text-4xl font-bold ${theme.light.foreground} mb-6`}>¿Quiénes Somos?</h1>
                    <p className={`text-xl ${colorCombos.secondaryText} max-w-3xl mx-auto leading-relaxed`}>
                        Somos una asociación de leyes sub-graduadas comprometida con la educación jurídica y el análisis crítico del
                        derecho contemporáneo.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
                    <div>
                        <h2 className={`text-3xl font-bold ${theme.light.foreground} mb-6`}>Nuestra Misión</h2>
                        <p className={`${colorCombos.secondaryText} text-lg leading-relaxed mb-6`}>
                            Democratizar el acceso al conocimiento jurídico a través de contenido de calidad, análisis profundo y
                            discusiones constructivas que enriquezcan la comprensión del derecho en nuestra sociedad.
                        </p>
                        <p className={`${colorCombos.secondaryText} text-lg leading-relaxed`}>
                            Creemos que el derecho debe ser accesible y comprensible para todos, no solo para los profesionales del
                            área. Por eso, nos esforzamos por crear contenido que sea tanto riguroso académicamente como accesible al
                            público general.
                        </p>
                    </div>
                    <div className="relative">
                        <div className={`aspect-square rounded-2xl overflow-hidden ${colors.white[100]} ${theme.light.border} border`}>
                            <img
                                src="/legal-books-and-scales-of-justice.png"
                                alt="Libros de derecho y balanza de la justicia"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mb-16">
                    <h2 className={`text-3xl font-bold ${theme.light.foreground} text-center mb-12`}>Nuestros Valores</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className={`${colorCombos.darkCard} text-center`}>
                            <CardContent className="p-8">
                                <div className={`w-16 h-16 ${colorCombos.iconBg.red} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                    <Target className={`h-8 w-8 ${colorCombos.icon.red}`} />
                                </div>
                                <h3 className={`text-xl font-semibold ${theme.light.foreground} mb-4`}>Excelencia Académica</h3>
                                <p className={colorCombos.secondaryText}>
                                    Nos comprometemos con la más alta calidad en nuestro contenido, basado en investigación rigurosa y
                                    análisis crítico.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`${colorCombos.darkCard} text-center`}>
                            <CardContent className="p-8">
                                <div className={`w-16 h-16 ${colorCombos.iconBg.blue} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                    <Users className={`h-8 w-8 ${colorCombos.icon.blue}`} />
                                </div>
                                <h3 className={`text-xl font-semibold ${theme.light.foreground} mb-4`}>Comunidad Inclusiva</h3>
                                <p className={colorCombos.secondaryText}>
                                    Fomentamos un espacio de diálogo respetuoso donde todas las perspectivas son valoradas y consideradas.
                                </p>
                            </CardContent>
                        </Card>

                        <Card className={`${colorCombos.darkCard} text-center`}>
                            <CardContent className="p-8">
                                <div className={`w-16 h-16 ${colorCombos.iconBg.green} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                    <BookOpen className={`h-8 w-8 ${colorCombos.icon.green}`} />
                                </div>
                                <h3 className={`text-xl font-semibold ${theme.light.foreground} mb-4`}>Acceso al Conocimiento</h3>
                                <p className={colorCombos.secondaryText}>
                                    Creemos que el conocimiento jurídico debe ser accesible para todos, sin barreras económicas o
                                    sociales.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-16">
                    <h2 className={`text-3xl font-bold ${theme.light.foreground} text-center mb-12`}>Nuestro Equipo</h2>
                    <Card className={`${colorCombos.darkCard}`}>
                        <CardContent className="p-8 text-center">
                            <p className={`${colorCombos.secondaryText} text-lg leading-relaxed max-w-3xl mx-auto`}>
                                Nuestro equipo está compuesto por estudiantes de derecho, profesionales jurídicos y académicos
                                comprometidos con la excelencia educativa. Cada miembro aporta su experiencia única para crear contenido
                                diverso y enriquecedor que refleje la complejidad y belleza del derecho moderno.
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* CTA Section - hide sign-up for logged-in users but keep "Explorar Artículos" */}
                <div className="text-center">
                    {!loading && !user && (
                        <>
                            <h2 className={`text-3xl font-bold ${theme.light.foreground} mb-6`}>Únete a Nuestra Comunidad</h2>
                            <p className={`${colorCombos.secondaryText} text-lg mb-8 max-w-2xl mx-auto`}>
                                ¿Interesado en contribuir o simplemente quieres ser parte de nuestras discusiones? Te invitamos a unirte a
                                nuestra comunidad.
                            </p>
                        </>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        {!loading && !user && (
                            <Link href="/auth/sign-up">
                                <Button size="lg" className={colorCombos.primaryButton}>
                                    Crear Cuenta
                                </Button>
                            </Link>
                        )}
                        <Link href="/articulos">
                            <Button
                                size="lg"
                                variant="outline"
                                className={colorCombos.secondaryButton}
                            >
                                Explorar Artículos
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
