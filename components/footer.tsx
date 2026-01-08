"use client"

import { Scale, Instagram, Linkedin } from "lucide-react"
import { colors, colorCombos } from "@/lib/colors"

export function Footer() {
  return (
    <footer className={`${colors.white[50]} border-t border-gray-200`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className={`h-6 w-6 ${colors.primary.text[700]}`} />
            <span className={`${colors.primary.text[800]} font-semibold`}>Derecho en Perspectiva</span>
          </div>
          <div className="flex items-center gap-6">
            <p className={`${colorCombos.secondaryText} text-sm`}> 2024 Derecho en Perspectiva. Todos los derechos reservados.</p>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/derechoenperspectiva"
                target="_blank"
                rel="noopener noreferrer"
                className={`${colorCombos.secondaryText} hover:text-[#6a2124] transition-colors`}
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://www.linkedin.com/company/derecho-en-perspectiva"
                target="_blank"
                rel="noopener noreferrer"
                className={`${colorCombos.secondaryText} hover:text-[#0A66C2] transition-colors`}
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}






