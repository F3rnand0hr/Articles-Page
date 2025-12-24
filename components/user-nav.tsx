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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
        setProfile(null)
        setDropdownOpen(false)
      } else if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        checkUser()
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!dropdownOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('user-dropdown');
      const button = document.querySelector('[data-user-nav-button]');
      const target = event.target as HTMLElement;

      if (target?.closest('#sign-out-button') || target?.closest('#user-dropdown')) {
        return;
      }

      if (dropdown && button && !dropdown.contains(target) && !button.contains(target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [dropdownOpen])

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
            className={`${colors.primary.text[600]} border ${theme.light.border} hover:bg-[#e6f0f5] transition-colors`}
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
    >
      <Button
        variant="outline"
        size="sm"
        className={`${colorCombos.secondaryButton}`}
        data-user-nav-button
        onClick={() => {
          setDropdownOpen(!dropdownOpen);
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
        className={`absolute right-0 top-full mt-2 w-56 ${theme.light.card} ${theme.light.border} z-50 shadow-lg border-2 rounded-md ${dropdownOpen ? '' : 'hidden'}`}
      >
        <div className="p-2">
          <button
            id="sign-out-button"
            type="button"
            onClick={async (e) => {
              e.preventDefault()
              e.stopPropagation()
              setDropdownOpen(false)
              await handleSignOut()
            }}
            onMouseDown={(e) => {
              // Prevent the click outside handler from closing the dropdown
              e.stopPropagation()
            }}
            className={`w-full justify-start px-3 py-2 rounded ${theme.light.foreground} hover:bg-gray-100 flex items-center gap-2 transition-colors cursor-pointer`}
          >
            <LogOut className="h-4 w-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  )
}
