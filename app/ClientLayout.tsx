"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"

export function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()

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
            </motion.div>
        </AnimatePresence>
    )
}
