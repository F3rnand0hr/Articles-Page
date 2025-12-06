"use client"

import { useEffect, useState } from "react"
import type { User as SupabaseUser } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scale, BookOpen, Users, MessageCircle, LogOut, Instagram, Linkedin } from "lucide-react"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { colors, colorCombos, theme } from "@/lib/colors"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { motion, Variants } from "framer-motion"

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

export default function HomePage() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [loading, setLoading] = useState(true)
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Scale className={`h-8 w-8 ${colors.primary.text[700]}`} />
              <span className={`text-xl font-bold ${theme.light.foreground}`}>
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
                <h1 className={`text-5xl lg:text-6xl font-bold ${theme.light.foreground} leading-tight text-balance`}>
                  Derecho en
                  <span className={`block ${colors.primary.text[700]}`}>Perspectiva</span>
                </h1>
                <p className={`text-xl ${colorCombos.secondaryText} leading-relaxed text-pretty`}>
                  Bienvenido a nuestra plataforma de contenido legal. Explora artículos especializados, participa en
                  discusiones jurídicas y mantente actualizado con las últimas perspectivas del derecho.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/articulos">
                  <Button size="lg" className={colorCombos.primaryButton}>
                    Explorar Artículos
                  </Button>
                </Link>
                <Link href="/sobre-nosotros">
                  <Button
                    variant="outline"
                    size="lg"
                    className={colorCombos.secondaryButton}
                  >
                    Conocer Más
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className={`aspect-square rounded-2xl overflow-hidden ${colors.white[100]} ${theme.light.border} border`}>
                <img
                  src="/classical-justice-statue-with-scales-in-dramatic-l.png"
                  alt="Estatua de la Justicia"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className={`absolute -top-4 -right-4 w-24 h-24 ${colors.primary[500]}/20 rounded-full blur-xl`}></div>
              <div className={`absolute -bottom-4 -left-4 w-32 h-32 ${colors.blue[500]}/10 rounded-full blur-xl`}></div>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Featured Article */}
              <div className="md:col-span-2 lg:col-span-2">
                <Link href="/articulos/1" className="group block h-full">
                  <div className={`h-full rounded-2xl overflow-hidden shadow-lg ${colorCombos.lightCard} group-hover:shadow-xl transition-shadow duration-300`}>
                    <div className="relative pt-[56.25%] bg-gray-100 overflow-hidden">
                      <img
                        src="/law-article.jpg"
                        alt="Artículo destacado"
                        className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-6 text-white">
                        <span className="inline-block px-3 py-1 text-sm font-medium bg-white/20 backdrop-blur-sm rounded-full mb-2">
                          Derecho Civil
                        </span>
                        <h3 className="text-2xl font-bold leading-tight mb-2 line-clamp-2">
                          Análisis de las últimas reformas al Código Civil
                        </h3>
                        <p className="text-sm text-gray-200 line-clamp-2">
                          Un examen detallado de los cambios recientes y su impacto en los derechos de propiedad y contratos.
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Secondary Articles */}
              <div className="space-y-6">
                {[1, 2, 3].map((item) => (
                  <Link key={item} href={`/articulos/${item + 1}`} className="group block">
                    <div className={`flex gap-4 p-4 rounded-xl ${colorCombos.lightCard} group-hover:bg-gray-50 transition-colors`}>
                      <div className="flex-shrink-0 w-24 h-24 rounded-lg bg-gray-200 overflow-hidden">
                        <img
                          src={`/article-${item}.jpg`}
                          alt={`Artículo ${item}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium ${theme.light.foreground} group-hover:${colors.primary[600]} transition-colors line-clamp-2`}>
                          {[
                            "Derechos humanos en la era digital",
                            "Novedades en derecho laboral 2023",
                            "La justicia restaurativa en el sistema penal"
                          ][item - 1]}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {[
                            "Explorando los desafíos legales de la privacidad y protección de datos.",
                            "Lo que necesitas saber sobre las nuevas regulaciones laborales.",
                            "Un enfoque alternativo para la resolución de conflictos penales."
                          ][item - 1]}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-12 text-center">
              <Link href="/articulos">
                <Button
                  variant="outline"
                  className={`${colorCombos.secondaryButton} border ${theme.light.border} hover:${colors.primary[50]} transition-colors`}
                >
                  Ver todos los artículos
                </Button>
              </Link>
            </div>
          </div>
        </div>

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
                    className={`w-12 h-12 ${colorCombos.iconBg.red} rounded-lg flex items-center justify-center mx-auto`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookOpen className={`h-6 w-6 ${colorCombos.icon.red}`} />
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
                    className={`w-12 h-12 ${colorCombos.iconBg.blue} rounded-lg flex items-center justify-center mx-auto`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <MessageCircle className={`h-6 w-6 ${colorCombos.icon.blue}`} />
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
                    className={`w-12 h-12 ${colorCombos.iconBg.green} rounded-lg flex items-center justify-center mx-auto`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Users className={`h-6 w-6 ${colorCombos.icon.green}`} />
                  </motion.div>
                  <h3 className={`text-xl font-semibold ${theme.light.foreground}`}>Comunidad Legal</h3>
                  <p className={colorCombos.secondaryText}>Conecta con expertos y colegas del ámbito jurídico</p>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
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

      {/* Footer */}
      <footer className={`${colors.white[50]} ${theme.light.border} border-t`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Scale className={`h-6 w-6 ${colors.primary.text[700]}`} />
              <span className={`${theme.light.foreground} font-semibold`}>Derecho en Perspectiva</span>
            </div>
            <div className="flex items-center gap-6">
              <p className={`${colorCombos.secondaryText} text-sm`}> 2024 Derecho en Perspectiva. Todos los derechos reservados.</p>
              <div className="flex items-center gap-4">
                <a
                  href="https://www.instagram.com/derechoenperspectiva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${colorCombos.secondaryText} hover:${colors.primary.text[500]} transition-colors`}
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/derecho-en-perspectiva"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${colorCombos.secondaryText} hover:text-[#0A66C2] transition-colors`}
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
