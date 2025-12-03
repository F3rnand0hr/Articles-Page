"use client"

import type React from "react"
import { useEffect } from "react"
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

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkExistingUser = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          router.replace("/")
        }
      } catch (error) {
        console.error("Error checking existing user on sign-up page:", error)
      }
    }

    void checkExistingUser()
  }, [router, supabase])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres")
      setIsLoading(false)
      return
    }

    const supabase = createClient()

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
        },
      })

      if (signUpError) throw signUpError

      // Check if we need to confirm the email
      if (data.user?.identities?.length === 0) {
        setError("Este correo ya está registrado. Por favor inicia sesión.")
        return
      }

      // Redirigir a la página de éxito para indicar que revise su correo
      router.push("/auth/sign-up-success")
    } catch (error) {
      console.error("Error during sign up:", error)
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la cuenta. Por favor intenta de nuevo.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-gray-50 to-white p-4">
      <Card className={`w-full max-w-md ${theme.light.border} ${theme.light.card}`}>
        <CardHeader>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Scale className={`h-8 w-8 ${colors.primary.text[700]}`} />
            <span className={`text-2xl font-bold ${theme.light.foreground}`}>Derecho en Perspectiva</span>
          </div>
          <CardTitle className={`text-2xl ${theme.light.foreground} text-center`}>Crear Cuenta</CardTitle>
          <CardDescription className={`${colorCombos.mutedText} text-center`}>
            Únete a nuestra comunidad legal y participa en las discusiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-sm rounded-md">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="displayName" className={theme.light.foreground}>
                  Nombre de Usuario
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Tu nombre"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  onInvalid={(e) => e.currentTarget.setCustomValidity("Por favor completa este campo.")}
                  onInput={(e) => e.currentTarget.setCustomValidity("")}
                  className={`${theme.light.background} ${theme.light.border} ${theme.light.foreground} placeholder:${colorCombos.mutedText} focus:border-red-500 focus:ring-red-500`}
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className={theme.light.foreground}>
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onInvalid={(e) => e.currentTarget.setCustomValidity("Por favor completa este campo.")}
                  onInput={(e) => e.currentTarget.setCustomValidity("")}
                  className={`${theme.light.background} ${theme.light.border} ${theme.light.foreground} placeholder:${colorCombos.mutedText} focus:border-red-500 focus:ring-red-500`}
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className={theme.light.foreground}>
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onInvalid={(e) => e.currentTarget.setCustomValidity("Por favor completa este campo.")}
                  onInput={(e) => e.currentTarget.setCustomValidity("")}
                  className={`${theme.light.background} ${theme.light.border} ${theme.light.foreground} placeholder:${colorCombos.mutedText} focus:border-red-500 focus:ring-red-500`}
                  required
                  minLength={6}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className={theme.light.foreground}>
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onInvalid={(e) => e.currentTarget.setCustomValidity("Por favor completa este campo.")}
                  onInput={(e) => e.currentTarget.setCustomValidity("")}
                  className={`${theme.light.background} ${theme.light.border} ${theme.light.foreground} placeholder:${colorCombos.mutedText} focus:border-red-500 focus:ring-red-500`}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className={`w-full ${colorCombos.primaryButton} font-medium py-2 px-4 rounded-md transition-colors`}
                disabled={isLoading}
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>

              <p className={`text-center text-sm ${colorCombos.mutedText}`}>
                ¿Ya tienes una cuenta?{' '}
                <Link href="/auth/login" className={`${colors.primary.text[600]} hover:underline`}>
                  Iniciar Sesión
                </Link>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
