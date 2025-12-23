/**
 * Simple in-memory rate limiting for email resend functionality
 * In production, consider using Redis or a more robust solution
 */

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

/**
 * Rate limit configuration for email resend
 */
const EMAIL_RESEND_RATE_LIMIT = {
  maxAttempts: 3, // Maximum number of resend attempts
  windowMs: 15 * 60 * 1000, // 15 minutes window
}

/**
 * Checks if an action should be rate limited
 * @param key - Unique identifier for the rate limit (e.g., email address)
 * @param maxAttempts - Maximum number of attempts allowed
 * @param windowMs - Time window in milliseconds
 * @returns Object with isAllowed flag and remaining time
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = EMAIL_RESEND_RATE_LIMIT.maxAttempts,
  windowMs: number = EMAIL_RESEND_RATE_LIMIT.windowMs
): {
  isAllowed: boolean
  remainingAttempts: number
  resetTime: number | null
  message?: string
} {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry) {
    // First attempt, create new entry
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      isAllowed: true,
      remainingAttempts: maxAttempts - 1,
      resetTime: now + windowMs,
    }
  }

  // Check if window has expired
  if (entry.resetTime < now) {
    // Reset the counter
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    })
    return {
      isAllowed: true,
      remainingAttempts: maxAttempts - 1,
      resetTime: now + windowMs,
    }
  }

  // Check if limit exceeded
  if (entry.count >= maxAttempts) {
    const minutesRemaining = Math.ceil((entry.resetTime - now) / (60 * 1000))
    return {
      isAllowed: false,
      remainingAttempts: 0,
      resetTime: entry.resetTime,
      message: `Has excedido el límite de reintentos. Por favor espera ${minutesRemaining} minuto${minutesRemaining !== 1 ? "s" : ""} antes de intentar nuevamente.`,
    }
  }

  // Increment counter
  entry.count++
  rateLimitStore.set(key, entry)

  return {
    isAllowed: true,
    remainingAttempts: maxAttempts - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Check rate limit status without incrementing the counter (peek only)
 */
export function peekRateLimit(
  key: string,
  maxAttempts: number = EMAIL_RESEND_RATE_LIMIT.maxAttempts,
  windowMs: number = EMAIL_RESEND_RATE_LIMIT.windowMs
): {
  isAllowed: boolean
  remainingAttempts: number
  resetTime: number | null
  message?: string
} {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry) {
    return {
      isAllowed: true,
      remainingAttempts: maxAttempts,
      resetTime: null,
    }
  }

  // Check if window has expired
  if (entry.resetTime < now) {
    return {
      isAllowed: true,
      remainingAttempts: maxAttempts,
      resetTime: null,
    }
  }

  // Check if limit exceeded
  if (entry.count >= maxAttempts) {
    const minutesRemaining = Math.ceil((entry.resetTime - now) / (60 * 1000))
    return {
      isAllowed: false,
      remainingAttempts: 0,
      resetTime: entry.resetTime,
      message: `Has excedido el límite de reintentos. Por favor espera ${minutesRemaining} minuto${minutesRemaining !== 1 ? "s" : ""} antes de intentar nuevamente.`,
    }
  }

  return {
    isAllowed: true,
    remainingAttempts: maxAttempts - entry.count,
    resetTime: entry.resetTime,
  }
}

/**
 * Reset rate limit for a specific key (useful for testing)
 */
export function resetRateLimit(key: string): void {
  rateLimitStore.delete(key)
}

