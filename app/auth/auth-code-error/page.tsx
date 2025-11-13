import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scale, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthCodeError() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Scale className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-white">Derecho en Perspectiva</span>
          </Link>
        </div>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-white">Error de Autenticación</CardTitle>
            <CardDescription className="text-slate-400">Hubo un problema al confirmar tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-300">El enlace de confirmación puede haber expirado o ya haber sido usado.</p>
            <div className="space-y-2">
              <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                <Link href="/auth/sign-up">Intentar de nuevo</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700 bg-transparent"
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
