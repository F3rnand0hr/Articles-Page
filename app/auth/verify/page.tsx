"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { colors, colorCombos, theme } from "@/lib/colors"
import { checkRateLimit, peekRateLimit } from "@/lib/rate-limit"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"

type VerificationType = 'signup' | 'recovery' | 'email' | null

// Client-side only component
function VerifyClient() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState<string>('Verificando tu correo...')
  const [isResending, setIsResending] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [canResend, setCanResend] = useState(true)
  const [resendMessage, setResendMessage] = useState<string | undefined>(undefined)
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')
  const type = searchParams.get('type') as VerificationType
  const email = searchParams.get('email')
  const success = searchParams.get('success') === 'true'

  useEffect(() => {
    setIsMounted(true)
    
    // If verification was successful via callback, show success immediately
    if (success) {
      setStatus('success')
      setMessage('¡Correo verificado con éxito! Redirigiendo...')
      setTimeout(() => {
        if (type === 'recovery') {
          router.push('/auth/login?message=password-reset')
        } else {
          router.push('/articulos')
        }
      }, 2000)
      return
    }
    
    // Only run verification on the client side if we have a token
    if (typeof window !== 'undefined' && token) {
      verifyToken()
    } else if (!token && !success) {
      // No token and not a success redirect - show error
      setStatus('error')
      setMessage('No se proporcionó un token de verificación.')
    }
    
    // Check rate limit status when component mounts (without incrementing)
    if (email) {
      const rateLimitCheck = peekRateLimit(`email-resend-${email}`)
      setCanResend(rateLimitCheck.isAllowed)
      if (!rateLimitCheck.isAllowed) {
        setResendMessage(rateLimitCheck.message)
      }
    }
  }, [email, token, success, type, router]) // Check rate limit when email changes

  const verifyToken = async () => {
    if (!token) {
      setStatus('error')
      setMessage('No se proporcionó un token de verificación.')
      return
    }

    const supabase = createClient()

    try {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type || 'email',
        email: email || undefined
      })

      if (error) throw error

      setStatus('success')
      setMessage('¡Correo verificado con éxito! Redirigiendo...')

      // Redirect based on verification type
      setTimeout(() => {
        if (type === 'recovery') {
          router.push('/auth/login?message=password-reset')
        } else {
          router.push('/articulos')
        }
      }, 2000)

    } catch (error) {
      console.error('Error during verification:', error)
      setStatus('error')
      setMessage('El enlace de verificación no es válido o ha expirado.')
    }
  }

  const handleResend = async () => {
    if (!email) {
      setMessage('No se puede reenviar el correo sin una dirección de correo electrónico.')
      return
    }

    // Check rate limit before attempting to resend
    const rateLimitCheck = checkRateLimit(`email-resend-${email}`)
    if (!rateLimitCheck.isAllowed) {
      setStatus('error')
      setMessage(rateLimitCheck.message || 'Has excedido el límite de reintentos. Por favor espera antes de intentar nuevamente.')
      return
    }

    setIsResending(true)
    setStatus('loading')
    setMessage('Enviando correo de verificación...')

    const supabase = createClient()

    try {
      // Supabase resend only accepts 'signup' or 'email_change', not 'recovery' or 'email'
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      })

      if (error) throw error

      const remainingMessage = rateLimitCheck.remainingAttempts > 0 
        ? ` (${rateLimitCheck.remainingAttempts} reintentos restantes)` 
        : ''
      setStatus('success')
      setMessage(`¡Correo de verificación reenviado! Por favor revisa tu bandeja de entrada.${remainingMessage}`)
      
      // Update rate limit status after successful resend (peek only)
      const newRateLimitCheck = peekRateLimit(`email-resend-${email}`)
      setCanResend(newRateLimitCheck.isAllowed)
      if (!newRateLimitCheck.isAllowed) {
        setResendMessage(newRateLimitCheck.message)
      }
    } catch (error) {
      console.error('Error resending verification:', error)
      setStatus('error')
      setMessage('Error al reenviar el correo. Por favor intenta nuevamente.')
    } finally {
      setIsResending(false)
    }
  }

  const renderContent = () => {
    if (!isMounted) {
      return (
        <div className="text-center space-y-4">
          <Loader2 className={`h-12 w-12 ${colors.primary.text[500]} animate-spin mx-auto`} />
          <p className={`text-lg ${theme.light.foreground}`}>Cargando...</p>
        </div>
      )
    }

    switch (status) {
      case 'loading':
        return (
          <div className="text-center space-y-4">
            <Loader2 className={`h-12 w-12 ${colors.primary.text[500]} animate-spin mx-auto`} />
            <p className={`text-lg ${theme.light.foreground}`}>{message}</p>
          </div>
        )
      case 'success':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className={`h-12 w-12 ${colors.green[500]} mx-auto`} />
            <h2 className={`text-2xl font-bold ${theme.light.foreground}`}>¡Verificación exitosa!</h2>
            <p className={colorCombos.secondaryText}>{message}</p>
          </div>
        )
      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <AlertCircle className={`h-12 w-12 ${colors.primary.text[500]} mx-auto`} />
              <h2 className={`text-2xl font-bold ${theme.light.foreground}`}>Error de verificación</h2>
              <p className={colorCombos.secondaryText}>{message}</p>
            </div>

            {email && (
              <Button
                onClick={handleResend}
                disabled={isResending || !canResend}
                className={`w-full ${colorCombos.primaryButton}`}
                title={resendMessage}
              >
                {isResending ? 'Enviando...' : canResend ? 'Reenviar correo' : 'Límite de reintentos alcanzado'}
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className={`w-full ${colorCombos.secondaryButton}`}
            >
              Volver al inicio
            </Button>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center p-4">
      <div className={`w-full max-w-md ${theme.light.card} backdrop-blur-sm rounded-xl ${theme.light.border} p-8 shadow-xl`}>
        {renderContent()}
      </div>
    </div>
  )
}

// Main page component
export default function VerifyPage() {
  // Only render the client component on the client side
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-white flex items-center justify-center p-4">
        <div className={`w-full max-w-md ${theme.light.card} backdrop-blur-sm rounded-xl ${theme.light.border} p-8 shadow-xl text-center`}>
          <Loader2 className={`h-12 w-12 ${colors.primary.text[500]} animate-spin mx-auto`} />
          <p className={`mt-4 text-lg ${theme.light.foreground}`}>Cargando...</p>
        </div>
      </div>
    )
  }

  return <VerifyClient />
}
