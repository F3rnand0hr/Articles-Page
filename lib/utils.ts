import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Gets the site URL for email redirects.
 * 
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL environment variable (recommended for production and mobile testing)
 * 2. window.location.origin (works in production and same-device development)
 * 3. VERCEL_URL (automatically set by Vercel)
 * 4. localhost fallback (development only)
 * 
 * For mobile testing in development, set NEXT_PUBLIC_SITE_URL to your local IP:
 * NEXT_PUBLIC_SITE_URL=http://192.168.1.X:3000
 * 
 * For production on Vercel, set NEXT_PUBLIC_SITE_URL to your production URL:
 * NEXT_PUBLIC_SITE_URL=https://articles-page-five.vercel.app
 * 
 * To find your local IP:
 * - Mac/Linux: ifconfig | grep "inet " | grep -v 127.0.0.1
 * - Windows: ipconfig
 */
export function getSiteUrl(): string {
  // Use environment variable if available (recommended)
  // In Next.js, NEXT_PUBLIC_* vars are available in both client and server
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL
  
  if (envUrl) {
    // Remove trailing slash if present
    return envUrl.replace(/\/$/, '')
  }
  
  // In production (Vercel), use window.location.origin which will be the correct URL
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  
  // Server-side: Try Vercel's automatic URL (for server-side rendering)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }
  
  // Development fallback (shouldn't happen in client components)
  return 'http://localhost:3000'
}
