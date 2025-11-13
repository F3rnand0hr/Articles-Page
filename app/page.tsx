import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scale, BookOpen, Users, MessageCircle } from "lucide-react"
import Link from "next/link"
import { UserNav } from "@/components/user-nav"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Scale className="h-8 w-8 text-red-500" />
              <span className="text-xl font-bold text-white">Derecho en Perspectiva</span>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/articulos" className="text-slate-300 hover:text-white transition-colors">
                Artículos
              </Link>
              <Link href="/sobre-nosotros" className="text-slate-300 hover:text-white transition-colors">
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
                <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight text-balance">
                  Derecho en
                  <span className="text-red-500 block">Perspectiva</span>
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed text-pretty">
                  Bienvenido a nuestra plataforma de contenido legal. Explora artículos especializados, participa en
                  discusiones jurídicas y mantente actualizado con las últimas perspectivas del derecho.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/articulos">
                  <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                    Explorar Artículos
                  </Button>
                </Link>
                <Link href="/sobre-nosotros">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
                  >
                    Conocer Más
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-800 border border-slate-700">
                <img
                  src="/classical-justice-statue-with-scales-in-dramatic-l.png"
                  alt="Estatua de la Justicia"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-500/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">¿Qué Ofrecemos?</h2>
            <p className="text-slate-300 text-lg max-w-2xl mx-auto">
              Una plataforma integral para el análisis y discusión del derecho moderno
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mx-auto">
                  <BookOpen className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="text-xl font-semibold text-white">Artículos Especializados</h3>
                <p className="text-slate-300">Contenido legal de alta calidad cubriendo todas las ramas del derecho</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto">
                  <MessageCircle className="h-6 w-6 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold text-white">Discusiones Activas</h3>
                <p className="text-slate-300">Participa en debates jurídicos con profesionales y estudiantes</p>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-colors">
              <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <h3 className="text-xl font-semibold text-white">Comunidad Legal</h3>
                <p className="text-slate-300">Conecta con expertos y colegas del ámbito jurídico</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-slate-800/30 border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold text-white">Únete a Nuestra Comunidad</h2>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Regístrate para acceder a contenido exclusivo, participar en discusiones y conectar con profesionales
                del derecho
              </p>
              <Link href="/auth/sign-up">
                <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white">
                  Crear Cuenta Gratuita
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-red-500" />
              <span className="text-white font-semibold">Derecho en Perspectiva</span>
            </div>
            <p className="text-slate-400 text-sm">© 2024 Derecho en Perspectiva. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
