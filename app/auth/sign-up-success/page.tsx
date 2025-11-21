import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { colors, colorCombos, theme } from "@/lib/colors"
import { Button } from "@/components/ui/button"
import { Scale, Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Scale className={`h-8 w-8 ${colors.primary.text[500]}`} />
            <span className={`text-2xl font-bold ${theme.light.foreground}`}>Derecho en Perspectiva</span>
          </Link>
        </div>

        <Card className={`${theme.light.card} ${theme.light.border}`}>
          <CardHeader className="text-center">
            <div className={`w-16 h-16 ${colors.green[100]} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Mail className={`h-8 w-8 ${colors.green[500]}`} />
            </div>
            <CardTitle className={`text-2xl ${theme.light.foreground}`}>¡Cuenta Creada!</CardTitle>
            <CardDescription className={colorCombos.mutedText}>Revisa tu email para confirmar tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className={colorCombos.secondaryText}>
              Te hemos enviado un email de confirmación. Haz clic en el enlace para activar tu cuenta y comenzar a
              participar en las discusiones.
            </p>
            <div className="space-y-2">
              <Link href="/auth/login">
                <Button className={`w-full ${colorCombos.primaryButton}`}>Ir a Iniciar Sesión</Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className={`w-full ${colorCombos.secondaryButton} ${theme.light.background}`}
                >
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
