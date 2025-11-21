import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { colors, colorCombos, theme } from "@/lib/colors"
import { Button } from "@/components/ui/button"
import { Scale, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthCodeError() {
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
            <div className={`mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full ${colors.primary[100]}`}>
              <AlertCircle className={`h-6 w-6 ${colors.primary.text[600]}`} />
            </div>
            <CardTitle className={`text-2xl ${theme.light.foreground}`}>Error de Autenticación</CardTitle>
            <CardDescription className={colorCombos.mutedText}>Hubo un problema al confirmar tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className={colorCombos.secondaryText}>El enlace de confirmación puede haber expirado o ya haber sido usado.</p>
            <div className="space-y-2">
              <Button asChild className={`w-full ${colorCombos.primaryButton}`}>
                <Link href="/auth/sign-up">Intentar de nuevo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className={`w-full ${colorCombos.secondaryButton}`}
              >
                <Link href="/auth/login">Iniciar sesión</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
