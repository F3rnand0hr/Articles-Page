"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { colors, colorCombos, theme } from "@/lib/colors"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Scale } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      router.push("/articulos")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Ocurrió un error. Por favor intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

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
          <CardHeader>
            <CardTitle className={`text-2xl ${theme.light.foreground}`}>Iniciar Sesión</CardTitle>
            <CardDescription className={colorCombos.mutedText}>
              Ingresa tu email y contraseña para acceder a tu cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email" className={theme.light.foreground}>
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`${theme.light.background} ${theme.light.border} ${theme.light.foreground} placeholder:${colorCombos.mutedText}`}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password" className={theme.light.foreground}>
                    Contraseña
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${theme.light.background} ${theme.light.border} ${theme.light.foreground} placeholder:${colorCombos.mutedText}`}
                  />
                </div>
                {error && <p className="text-sm text-red-400">{error}</p>}
                <Button type="submit" className={`w-full ${colorCombos.primaryButton}`} disabled={isLoading}>
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                <span className={colorCombos.mutedText}>¿No tienes una cuenta? </span>
                <Link href="/auth/sign-up" className={`${colors.primary.text[600]} hover:${colors.primary.text[500]} underline underline-offset-4`}>
                  Regístrate
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
