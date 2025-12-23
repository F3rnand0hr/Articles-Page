import { z } from "zod"

/**
 * Common email domain typos that should be caught before sending
 */
const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmail.con": "gmail.com",
  "gmail.cmo": "gmail.com",
  "gmai.com": "gmail.com",
  "yahooo.com": "yahoo.com",
  "yhoo.com": "yahoo.com",
  "yahoo.con": "yahoo.com",
  "hotmai.com": "hotmail.com",
  "hotmial.com": "hotmail.com",
  "hotmail.con": "hotmail.com",
  "outlok.com": "outlook.com",
  "outlook.con": "outlook.com",
  "icloud.con": "icloud.com",
  "protonmai.com": "protonmail.com",
}

/**
 * Email validation schema with strict rules
 */
export const emailSchema = z
  .string()
  .min(1, "El correo electrónico es requerido")
  .email("Por favor ingresa un correo electrónico válido")
  .toLowerCase()
  .trim()
  .refine(
    (email) => {
      // Check for common typos
      const domain = email.split("@")[1]
      if (!domain) return true
      
      // Check if domain is a known typo
      const correctedDomain = COMMON_DOMAIN_TYPOS[domain]
      if (correctedDomain) {
        return false // Will trigger error message
      }
      
      return true
    },
    (email) => {
      const domain = email.split("@")[1]
      const correctedDomain = COMMON_DOMAIN_TYPOS[domain || ""]
      return {
        message: correctedDomain
          ? `¿Quisiste decir ${email.split("@")[0]}@${correctedDomain}?`
          : "Por favor verifica el dominio del correo electrónico",
      }
    }
  )
  .refine(
    (email) => {
      // Reject common invalid patterns
      const invalidPatterns = [
        "test@test.com",
        "example@example.com",
        "user@domain.com",
        "email@email.com",
      ]
      return !invalidPatterns.includes(email)
    },
    {
      message: "Por favor usa un correo electrónico válido y real",
    }
  )

/**
 * Validates an email address and returns the result
 */
export function validateEmail(email: string): {
  isValid: boolean
  error?: string
  correctedEmail?: string
} {
  try {
    const parsed = emailSchema.parse(email)
    return { isValid: true, correctedEmail: parsed }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0]
      
      // Check if we can auto-correct common typos
      const domain = email.split("@")[1]
      const correctedDomain = domain ? COMMON_DOMAIN_TYPOS[domain] : null
      
      if (correctedDomain) {
        const correctedEmail = `${email.split("@")[0]}@${correctedDomain}`
        return {
          isValid: false,
          error: firstError.message,
          correctedEmail,
        }
      }
      
      return {
        isValid: false,
        error: firstError.message,
      }
    }
    return {
      isValid: false,
      error: "Por favor ingresa un correo electrónico válido",
    }
  }
}

/**
 * Checks if an email domain looks suspicious (likely invalid)
 */
export function isSuspiciousEmail(email: string): boolean {
  const suspiciousPatterns = [
    /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/i,
  ]
  
  // Check for suspicious domains
  const suspiciousDomains = [
    "tempmail",
    "10minutemail",
    "throwaway",
    "guerrillamail",
    "mailinator",
  ]
  
  const domain = email.split("@")[1]?.toLowerCase()
  if (!domain) return true
  
  return suspiciousDomains.some((susp) => domain.includes(susp))
}

