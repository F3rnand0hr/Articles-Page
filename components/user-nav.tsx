"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { colors, colorCombos, theme } from "@/lib/colors"
import { Button } from "@/components/ui/button"
import { User, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function UserNav() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<{ display_name: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [remountKey, setRemountKey] = useState(0)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown');
      const button = event.target as HTMLElement;

      if (dropdown && !dropdown.contains(button) && !button.closest('button')) {
        dropdown.classList.add('hidden');
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [])

  const checkUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)

      if (user) {
        const { data: profileData } = await supabase.from("profiles").select("display_name").eq("id", user.id).single()

        setProfile(profileData)
      }
    } catch (error) {
      console.error("Error checking user:", error)
      setUser(null)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    console.log("Sign out function called")
    try {
      // Sign out from Supabase
      await supabase.auth.signOut()
      console.log("Supabase sign out completed")

      // Clear all local storage
      localStorage.clear()
      console.log("Local storage cleared")

      // Clear all session storage
      sessionStorage.clear()
      console.log("Session storage cleared")

      // Clear Supabase specific storage
      if (typeof window !== 'undefined') {
        // Remove any Supabase related items
        Object.keys(localStorage).forEach(key => {
          if (key.includes('supabase') || key.includes('sb-')) {
            localStorage.removeItem(key)
          }
        })
        Object.keys(sessionStorage).forEach(key => {
          if (key.includes('supabase') || key.includes('sb-')) {
            sessionStorage.removeItem(key)
          }
        })
        console.log("Supabase specific storage cleared")
      }

      // Clear user state
      setUser(null)
      setProfile(null)
      setLoading(false)
      console.log("User state cleared")

      // Force component remount
      setRemountKey(prev => prev + 1)
      console.log("Component remount triggered")

      // Redirect to home page
      router.push("/")
      router.refresh()
      console.log("Redirect completed")

    } catch (error) {
      console.error("Error signing out:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Button
        variant="outline"
        size="sm"
        className={`${colorCombos.secondaryButton}`}
        disabled
      >
        Cargando...
      </Button>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/auth/login">
          <Button
            variant="outline"
            size="sm"
            className={`${colorCombos.secondaryButton}`}
          >
            Iniciar Sesión
          </Button>
        </Link>
        <Link href="/auth/sign-up">
          <Button
            className={`w-full ${colorCombos.primaryButton}`}
          >
            Registrarse
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div key={remountKey} className="relative">
      <Button
        variant="outline"
        size="sm"
        className={`${colorCombos.secondaryButton}`}
        onClick={() => {
          const dropdown = document.getElementById('user-dropdown');
          if (dropdown) {
            dropdown.classList.toggle('hidden');
            setDropdownOpen(!dropdownOpen);
          }
        }}
      >
        <User className="h-4 w-4 mr-2" />
        {profile?.display_name || "Usuario"}
      </Button>

      <div
        id="user-dropdown"
        className={`absolute right-0 top-full mt-2 w-56 ${theme.light.card} ${theme.light.border} z-50 shadow-lg border-2 rounded-md hidden`}
      >
        <div className="p-2">
          <button
            className={`w-full text-left px-3 py-2 rounded ${theme.light.foreground} hover:bg-gray-100 flex items-center gap-2`}
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleSignOut()
            }}
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  )
}
