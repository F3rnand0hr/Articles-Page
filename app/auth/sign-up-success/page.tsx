import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Scale, Mail } from "lucide-react"
import Link from "next/link"

export default function SignUpSuccessPage() {
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
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="h-8 w-8 text-green-500" />
            </div>
            <CardTitle className="text-2xl text-white">¡Cuenta Creada!</CardTitle>
            <CardDescription className="text-slate-400">Revisa tu email para confirmar tu cuenta</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-slate-300">
              Te hemos enviado un email de confirmación. Haz clic en el enlace para activar tu cuenta y comenzar a
              participar en las discusiones.
            </p>
            <div className="space-y-2">
              <Link href="/auth/login">
                <Button className="w-full bg-red-600 hover:bg-red-700 text-white">Ir a Iniciar Sesión</Button>
              </Link>
              <Link href="/">
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
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
