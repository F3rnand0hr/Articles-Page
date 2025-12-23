"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Footer } from "@/components/footer"

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    
    // Don't show footer on auth pages
    const isAuthPage = pathname?.startsWith("/auth")

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ x: 30 }}
                animate={{ x: 0 }}
                exit={{ x: -30 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
            >
                {children}
                {!isAuthPage && <Footer />}
            </motion.div>
        </AnimatePresence>
    )
}
