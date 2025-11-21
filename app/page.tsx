import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scale, BookOpen, Users, MessageCircle } from "lucide-react"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"
import { colors, colorCombos, theme } from "@/lib/colors"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Scale className={`h-8 w-8 ${colors.primary.text[500]}`} />
              <span className={`text-xl font-bold ${theme.light.foreground}`}>Derecho en Perspectiva</span>
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
                  <span className={`block ${colors.primary.text[500]}`}>Perspectiva</span>
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

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className={`text-3xl font-bold ${theme.light.foreground} mb-4`}>¿Qué Ofrecemos?</h2>
            <p className={`${colorCombos.secondaryText} text-lg max-w-2xl mx-auto`}>
              Una plataforma integral para el análisis y discusión del derecho moderno
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className={`${colorCombos.darkCard} ${colorCombos.darkCardHover} transition-colors`}>
              <CardContent className="p-6 text-center space-y-4">
                <div className={`w-12 h-12 ${colorCombos.iconBg.red} rounded-lg flex items-center justify-center mx-auto`}>
                  <BookOpen className={`h-6 w-6 ${colorCombos.icon.red}`} />
                </div>
                <h3 className={`text-xl font-semibold ${theme.light.foreground}`}>Artículos Especializados</h3>
                <p className={colorCombos.secondaryText}>Contenido legal de alta calidad cubriendo todas las ramas del derecho</p>
              </CardContent>
            </Card>

            <Card className={`${colorCombos.darkCard} ${colorCombos.darkCardHover} transition-colors`}>
              <CardContent className="p-6 text-center space-y-4">
                <div className={`w-12 h-12 ${colorCombos.iconBg.blue} rounded-lg flex items-center justify-center mx-auto`}>
                  <MessageCircle className={`h-6 w-6 ${colorCombos.icon.blue}`} />
                </div>
                <h3 className={`text-xl font-semibold ${theme.light.foreground}`}>Discusiones Activas</h3>
                <p className={colorCombos.secondaryText}>Participa en debates jurídicos con profesionales y estudiantes</p>
              </CardContent>
            </Card>

            <Card className={`${colorCombos.darkCard} ${colorCombos.darkCardHover} transition-colors`}>
              <CardContent className="p-6 text-center space-y-4">
                <div className={`w-12 h-12 ${colorCombos.iconBg.green} rounded-lg flex items-center justify-center mx-auto`}>
                  <Users className={`h-6 w-6 ${colorCombos.icon.green}`} />
                </div>
                <h3 className={`text-xl font-semibold ${theme.light.foreground}`}>Comunidad Legal</h3>
                <p className={colorCombos.secondaryText}>Conecta con expertos y colegas del ámbito jurídico</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className={`${colors.white[200]} ${theme.light.border} border-t`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center space-y-6">
              <h2 className={`text-3xl font-bold ${theme.light.foreground}`}>Únete a Nuestra Comunidad</h2>
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
      </main>

      {/* Footer */}
      <footer className={`${colors.white[50]} ${theme.light.border} border-t`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Scale className={`h-6 w-6 ${colors.primary.text[500]}`} />
              <span className={`${theme.light.foreground} font-semibold`}>Derecho en Perspectiva</span>
            </div>
            <p className={`${colorCombos.secondaryText} text-sm`}> 2024 Derecho en Perspectiva. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
