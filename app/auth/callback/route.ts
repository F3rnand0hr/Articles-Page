import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const type = searchParams.get("type") // 'signup', 'recovery', 'email', etc.
  const next = searchParams.get("next") ?? "/articulos"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      // If this is a signup verification, redirect to a success page
      // Otherwise, redirect to the next page or articles
      if (type === 'signup' || type === 'email') {
        return NextResponse.redirect(`${origin}/auth/verify?success=true&type=${type || 'signup'}`)
      }
      
      // For password recovery, redirect to login with message
      if (type === 'recovery') {
        return NextResponse.redirect(`${origin}/auth/login?message=password-reset`)
      }
      
      // Default redirect
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
