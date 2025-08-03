import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ananda Cinema Hall - Book Your Movie Tickets Online",
  description:
    "Experience the magic of cinema at Ananda Cinema Hall. Book tickets online for the latest movies with comfortable seating and state-of-the-art technology.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="pt-0 lg:pt-16 pb-16 lg:pb-0">{children}</div>
        <Footer />
      </body>
    </html>
  )
}
