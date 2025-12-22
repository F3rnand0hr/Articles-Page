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
  const [profile, setProfile] = useState<{ display_name: string; avatar_url: string | null } | null>(null)
  const [loading, setLoading] = useState(true)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [remountKey, setRemountKey] = useState(0)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkUser()

    // Debug click events
    const handleGlobalClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest && target.closest('#sign-out-button')) {
        console.log('Global click caught on sign out button')
      }
    }

    document.addEventListener('click', handleGlobalClick, true)

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event)
      if (event === 'SIGNED_OUT') {
        console.log('Auth: User signed out')
        setUser(null)
        setProfile(null)
        setDropdownOpen(false)
      } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        console.log('Auth: User signed in or initial session')
        checkUser()
      }
    })

    return () => {
      document.removeEventListener('click', handleGlobalClick, true)
      subscription?.unsubscribe()
    }
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
        const { data: profileData } = await supabase.from("profiles").select("display_name, avatar_url").eq("id", user.id).single()

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
    try {
      const { error: signOutError } = await supabase.auth.signOut()

      if (signOutError) throw signOutError

      setUser(null)
      setProfile(null)
      router.push("/")
    } catch (error) {
      alert("Error al cerrar sesión. Por favor intenta nuevamente.")
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
    <div
      key={remountKey}
      className="relative"
      onClickCapture={(e) => {
        const target = e.target as HTMLElement
        if (target?.closest && target.closest('#sign-out-button')) {
          e.preventDefault()
          e.stopPropagation()
          console.log('Capture: sign out clicked')
          handleSignOut()
        }
      }}
    >
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
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={profile.display_name || "Usuario"}
            className="h-6 w-6 mr-2 rounded-full object-cover"
          />
        ) : (
          <User className="h-5 w-5 mr-2" />
        )}
        {profile?.display_name || "Usuario"}
      </Button>

      <div
        id="user-dropdown"
        className={`absolute right-0 top-full mt-2 w-56 ${theme.light.card} ${theme.light.border} z-50 shadow-lg border-2 rounded-md hidden`}
      >
        <div className="p-2">
          <button
            id="sign-out-button"
            type="button"
            className={`w-full justify-start px-3 py-2 rounded ${theme.light.foreground} hover:bg-npgray-100 flex items-center gap-2`}
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión </span>
          </button>
        </div>
      </div>
    </div>
  )
}
