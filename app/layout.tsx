import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ClientLayout } from "./ClientLayout"

// Import Google Fonts for professional typography
import { Playfair_Display, Lora } from "next/font/google"

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://articles-page-five.vercel.app'

export const metadata: Metadata = {
  title: "Derecho en Perspectiva - Plataforma Legal",
  description: "Plataforma de contenido legal con artículos, discusiones y análisis jurídico",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
      { url: "/icon.jpg", type: "image/jpeg" },
    ],
    apple: [
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: siteUrl,
    siteName: "Derecho en Perspectiva",
    title: "Derecho en Perspectiva - Plataforma Legal",
    description: "Plataforma de contenido legal con artículos, discusiones y análisis jurídico",
    images: [
      {
        url: `${siteUrl}/icon.png`,
        width: 1200,
        height: 630,
        alt: "Derecho en Perspectiva",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Derecho en Perspectiva - Plataforma Legal",
    description: "Plataforma de contenido legal con artículos, discusiones y análisis jurídico",
    images: [`${siteUrl}/icon.png`],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`font-serif ${GeistSans.variable} ${GeistMono.variable} ${playfair.variable} ${lora.variable}`}>
        <ClientLayout>
          {children}
        </ClientLayout>
        <Toaster />
      </body>
    </html>
  )
}
