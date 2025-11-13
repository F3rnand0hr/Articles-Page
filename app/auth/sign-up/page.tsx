"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
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

      // Redirect to verify page if email confirmation is enabled
      router.push("/auth/verify")
    } catch (error) {
      console.error("Error during sign up:", error)
      const errorMessage = error instanceof Error ? error.message : 'Error al crear la cuenta. Por favor intenta de nuevo.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <Card className="w-full max-w-md border-slate-700 bg-slate-800">
        <CardHeader>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Scale className="h-8 w-8 text-red-500" />
            <span className="text-2xl font-bold text-white">Derecho en Perspectiva</span>
          </div>
          <CardTitle className="text-2xl text-white text-center">Crear Cuenta</CardTitle>
          <CardDescription className="text-slate-400 text-center">
            Únete a nuestra comunidad legal y participa en las discusiones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp}>
            <div className="flex flex-col gap-6">
              {error && (
                <div className="p-3 bg-red-900/50 border border-red-700 text-red-200 text-sm rounded-md">
                  {error}
                </div>
              )}

              <div className="grid gap-2">
                <Label htmlFor="displayName" className="text-white">
                  Nombre de Usuario
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="Tu nombre"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  required
                  minLength={3}
                  maxLength={50}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email" className="text-white">
                  Correo Electrónico
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="password" className="text-white">
                  Contraseña
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  required
                  minLength={6}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirmPassword" className="text-white">
                  Confirmar Contraseña
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-slate-400 focus:border-red-500 focus:ring-red-500"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
              </Button>

              <p className="text-center text-sm text-slate-400">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/auth/sign-in" className="text-red-400 hover:underline">
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
