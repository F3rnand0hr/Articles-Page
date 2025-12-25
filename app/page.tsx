"use client"

import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Scale, BookOpen, Users, MessageCircle, LogOut, User } from "lucide-react"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { colors, colorCombos, theme } from "@/lib/colors"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion, Variants } from "framer-motion"
import { AuthorSection } from "@/components/author-section"

const container: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

type Profile = {
  id: string
  display_name: string | null
  bio: string | null
  avatar_url: string | null
}

type ArticleResponse = {
  id: string
  title: string
  excerpt: string
  category: string
  featured: boolean
  likes_count: number
  comments_count: number
  created_at: string
  article_authors: Array<{
    is_primary_author: boolean
    profiles: Profile
  }>
}

export default function HomePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [articles, setArticles] = useState<ArticleResponse[]>([])
  const [articlesLoading, setArticlesLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Error checking user on home page:", error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    void checkUser()
  }, [supabase])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { data, error } = await supabase
          .from('articles')
          .select(`
            id,
            title,
            excerpt,
            category,
            featured,
            likes_count,
            comments_count,
            created_at,
            article_authors(
              is_primary_author,
              profiles(
                id,
                display_name,
                bio,
                avatar_url
              )
            )
          `)
          .eq("published", true)
          .order("created_at", { ascending: false })
          .limit(4) // Get first 4 articles (1 featured + 3 regular)

        if (error) {
          console.error("Error fetching articles:", error)
        } else {
          setArticles((data || []) as unknown as ArticleResponse[])
        }
      } catch (error) {
        console.error("Error fetching articles:", error)
      } finally {
        setArticlesLoading(false)
      }
    }

    void fetchArticles()
  }, [supabase])

  const featuredArticles = articles.filter((article) => article.featured)
  const regularArticles = articles.filter((article) => !article.featured).slice(0, 3)

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Scale className={`h-8 w-8 ${colors.primary.text[700]}`} />
              <span className={`text-xl font-bold ${colors.primary.text[800]} tracking-tight`}>
                Derecho en Perspectiva
              </span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/articulos" className={`${colorCombos.navLink} transition-colors`}>
                Artículos
              </Link>
              <Link href="/sobre-nosotros" className={`${colorCombos.navLink} transition-colors`}>
                Sobre Nosotros
              </Link>
              <UserNav />
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className={`text-5xl lg:text-6xl font-bold ${colors.primary.text[800]} leading-tight text-balance`}>
                  Derecho en
                  <span className={`block ${colors.primary.text[700]}`}>Perspectiva</span>
                </h1>
                <p className={`text-xl ${colorCombos.secondaryText} leading-relaxed text-pretty`}>
                  Una revista jurídica digital donde encontrarás artículos sobre las noticias nacionales más relevantes desde un punto de vista legal y crítico, para entender mejor su impacto y fomentar una comunidad colegial más consciente e informada.
                </p>
                <div className={`space-y-3 ${colorCombos.mutedText}`}>
                  <p className={`text-lg leading-relaxed`}>
                    Somos un equipo de estudiantes de la Universidad de Puerto Rico, Recinto de Mayagüez.
                  </p>
                  
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Magazine Section */}
        <div className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className={`text-3xl font-bold ${theme.light.foreground} mb-4`}>Revista Digital</h2>
              <p className={`${colorCombos.secondaryText} text-lg max-w-2xl mx-auto`}>
                Explora nuestra colección de artículos especializados en derecho
              </p>
            </div>

            {articlesLoading ? (
              <div className="text-center py-12">
                <p className={colorCombos.secondaryText}>Cargando artículos...</p>
              </div>
            ) : articles.length === 0 ? (
              <div className="text-center py-12">
                <p className={colorCombos.secondaryText}>No hay artículos disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center max-w-5xl mx-auto">
                {/* Featured Article */}
                {featuredArticles.length > 0 && (
                  <div className="w-full max-w-md">
                    <Link href={`/articulos/${featuredArticles[0].id}`} className="group block h-full">
                      <div className={`h-full rounded-2xl overflow-hidden shadow-lg ${theme.light.card} ${theme.light.border} border group-hover:shadow-xl transition-shadow duration-300`}>
                        <div className="p-6">
                          <div className="flex items-center gap-3 mb-4 flex-wrap">
                            <Badge variant="secondary" className="bg-[#f9d9d9] text-[#6a2124] border-[#f3b3b3] border capitalize">
                              Vol. 1
                            </Badge>
                            <Badge variant="outline" className="bg-[#ffefc1] text-[#b8941f] border-[#ffefc1] border">
                              Destacado
                            </Badge>
                          </div>
                          <h3 className={`text-2xl font-bold ${theme.light.foreground} mb-3 line-clamp-2 group-hover:text-[#6a2124] transition-colors`}>
                            {featuredArticles[0].title}
                          </h3>
                          <p className={`${colorCombos.secondaryText} mb-4 line-clamp-3`}>
                            {featuredArticles[0].excerpt}
                          </p>
                          {(() => {
                            const sortedAuthors = featuredArticles[0].article_authors
                              .sort((a, b) => (a.is_primary_author === b.is_primary_author ? 0 : a.is_primary_author ? -1 : 1))
                              .map(author => author.profiles)
                            
                            return (
                              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex -space-x-2">
                                    {sortedAuthors.slice(0, 3).map((profile) => (
                                      <div key={profile.id} className="relative group">
                                        {profile.avatar_url ? (
                                          <img
                                            src={profile.avatar_url}
                                            alt={profile.display_name || 'Escritor Invitado'}
                                            className="h-8 w-8 rounded-full border-2 border-white shadow-sm object-cover"
                                          />
                                        ) : (
                                          <div className={`h-8 w-8 rounded-full ${colors.white[200]} flex items-center justify-center border-2 border-white`}>
                                            <User className={`h-4 w-4 ${colors.white.text[600]}`} />
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                  <AuthorSection
                                    primaryName={sortedAuthors[0]?.display_name || null}
                                    extraCount={sortedAuthors.length > 1 ? sortedAuthors.length - 1 : 0}
                                    authors={sortedAuthors}
                                  />
                                </div>
                              </div>
                            )
                          })()}
                        </div>
                      </div>
                    </Link>
                  </div>
                )}

                {/* Secondary Articles */}
                {regularArticles.map((article) => {
                  const sortedAuthors = article.article_authors
                    .sort((a, b) => (a.is_primary_author === b.is_primary_author ? 0 : a.is_primary_author ? -1 : 1))
                    .map(author => author.profiles)

                  return (
                    <Link key={article.id} href={`/articulos/${article.id}`} className="group block w-full max-w-md">
                      <div className={`h-full rounded-xl overflow-hidden shadow-md ${theme.light.card} ${theme.light.border} border group-hover:shadow-lg group-hover:bg-gray-50 transition-all duration-300`}>
                        <div className="p-6 h-full flex flex-col">
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="secondary" className="text-xs bg-[#f9d9d9] text-[#6a2124] border-[#f3b3b3] border capitalize">
                              Vol. 1
                            </Badge>
                            {article.featured && (
                              <Badge variant="outline" className="text-xs bg-[#ffefc1] text-[#b8941f] border-[#ffefc1] border">
                                Destacado
                              </Badge>
                            )}
                          </div>
                          <h4 className={`font-bold text-lg ${theme.light.foreground} group-hover:text-[#6a2124] transition-colors line-clamp-2 mb-3 flex-grow`}>
                            {article.title}
                          </h4>
                          <p className={`text-sm ${colorCombos.secondaryText} line-clamp-3 mb-4`}>
                            {article.excerpt}
                          </p>
                          <div className="flex items-center gap-2 mt-auto pt-4 border-t border-gray-200" onClick={(e) => e.stopPropagation()}>
                            <div className="flex -space-x-1">
                              {sortedAuthors.slice(0, 2).map((profile) => (
                                profile.avatar_url ? (
                                  <img
                                    key={profile.id}
                                    src={profile.avatar_url}
                                    alt={profile.display_name || 'Escritor Invitado'}
                                    className="h-6 w-6 rounded-full border border-white object-cover"
                                  />
                                ) : (
                                  <div key={profile.id} className={`h-6 w-6 rounded-full ${colors.white[200]} flex items-center justify-center border border-white`}>
                                    <User className={`h-3 w-3 ${colors.white.text[600]}`} />
                                  </div>
                                )
                              ))}
                            </div>
                            <AuthorSection
                              primaryName={sortedAuthors[0]?.display_name || null}
                              extraCount={sortedAuthors.length > 1 ? sortedAuthors.length - 1 : 0}
                              authors={sortedAuthors}
                            />
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}

            <div className="mt-12 text-center">
              <Link href="/articulos">
                <Button
                  variant="outline"
                  className={`${colors.primary.text[600]} border ${theme.light.border} hover:bg-[#e6f0f5] transition-colors`}
                >
                  Ver todos los artículos
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Section - hidden when user is logged in */}
        {!loading && !user && (
          <div className={`${colors.white[200]} ${theme.light.border} border-t`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="text-center space-y-6">
                <h2 className={`text-3xl font-bold ${theme.light.foreground}`}>
                  Únete a Nuestra Comunidad
                </h2>
                <p className={`${colorCombos.secondaryText} text-lg max-w-2xl mx-auto`}>
                  Regístrate para acceder a contenido exclusivo, participar en discusiones y conectar con profesionales
                  del derecho
                </p>
                <Link href="/auth/sign-up">
                  <Button size="lg" className={colorCombos.primaryButton}>
                    Crear Cuenta Gratuita
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold ${theme.light.foreground} mb-4`}>¿Qué Ofrecemos?</h2>
            <p className={`${colorCombos.secondaryText} text-lg max-w-2xl mx-auto`}>
              Una plataforma integral para el análisis y discusión del derecho moderno
            </p>
          </div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-50px 0px 0px 0px" }}
            onViewportEnter={() => { }}
          >
            <motion.div variants={item}>
              <Card className={`${colorCombos.darkCard} ${colorCombos.darkCardHover} transition-colors h-full`}>
                <CardContent className="p-6 text-center space-y-4">
                  <motion.div
                    className="w-12 h-12 bg-[#6a2124]/10 rounded-lg flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookOpen className="h-6 w-6 text-[#6a2124]" />
                  </motion.div>
                  <h3 className={`text-xl font-semibold ${theme.light.foreground}`}>Artículos Especializados</h3>
                  <p className={colorCombos.secondaryText}>Contenido legal de alta calidad cubriendo todas las ramas del derecho</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className={`${colorCombos.darkCard} ${colorCombos.darkCardHover} transition-colors h-full`}>
                <CardContent className="p-6 text-center space-y-4">
                  <motion.div
                    className="w-12 h-12 bg-[#8a2d32]/10 rounded-lg flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className="h-6 w-6 text-[#8a2d32]" />
                  </motion.div>
                  <h3 className={`text-xl font-semibold ${theme.light.foreground}`}>Discusiones Activas</h3>
                  <p className={colorCombos.secondaryText}>Participa en debates jurídicos con profesionales y estudiantes</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={item}>
              <Card className={`${colorCombos.darkCard} ${colorCombos.darkCardHover} transition-colors h-full`}>
                <CardContent className="p-6 text-center space-y-4">
                  <motion.div
                    className="w-12 h-12 bg-[#d4af37]/10 rounded-lg flex items-center justify-center mx-auto"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Users className="h-6 w-6 text-[#d4af37]" />
                  </motion.div>
                  <h3 className={`text-xl font-semibold ${theme.light.foreground}`}>Comunidad Legal</h3>
                  <p className={colorCombos.secondaryText}>Conecta con expertos y colegas del ámbito jurídico</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </div>


      </main>


      {/* Mobile bottom nav for narrow screens */}
      <div className="md:hidden border-t border-gray-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-center gap-4">
          <Link href="/articulos" className={`${colorCombos.navLink} transition-colors`}>
            Artículos
          </Link>
          <Link href="/sobre-nosotros" className={`${colorCombos.navLink} transition-colors`}>
            Sobre Nosotros
          </Link>
          {user ? (
            <Button
              variant="outline"
              size="sm"
              className={`${colorCombos.secondaryButton} flex items-center gap-1`}
              onClick={async () => {
                try {
                  await supabase.auth.signOut()
                  setUser(null)
                  router.push("/")
                } catch (error) {
                  console.error("Error al cerrar sesión desde el menú móvil:", error)
                  alert("Error al cerrar sesión. Por favor intenta nuevamente.")
                }
              }}
            >
              <LogOut className="h-4 w-4" />
              <span>Cerrar sesión</span>
            </Button>
          ) : (
            <Link href="/auth/login">
              <Button
                variant="outline"
                size="sm"
                className={`${colorCombos.secondaryButton} flex items-center gap-1`}
              >
                <span>Iniciar sesión</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

    </div>
  )
}
