"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, Settings } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { User as SupabaseUser } from "@supabase/supabase-js"

export function UserNav() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [profile, setProfile] = useState<{ display_name: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    checkUser()
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
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  if (loading) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
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
            className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
          >
            Iniciar Sesión
          </Button>
        </Link>
        <Link href="/auth/sign-up">
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
            Registrarse
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-transparent"
        >
          <User className="h-4 w-4 mr-2" />
          {profile?.display_name || "Usuario"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700" align="end">
        <DropdownMenuItem className="text-slate-300 focus:bg-slate-700 focus:text-white">
          <User className="h-4 w-4 mr-2" />
          <span>Perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-slate-300 focus:bg-slate-700 focus:text-white">
          <Settings className="h-4 w-4 mr-2" />
          <span>Configuración</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem
          className="text-slate-300 focus:bg-slate-700 focus:text-white cursor-pointer"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4 mr-2" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
