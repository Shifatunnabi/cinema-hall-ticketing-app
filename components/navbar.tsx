"use client"

import Link from "next/link"
import { useState } from "react"
import { Home, Ticket, Film, Newspaper, Phone, Search } from "lucide-react"

export default function Navbar() {
  const [activeTab, setActiveTab] = useState("home")

  return (
    <>
      {/* Desktop Navigation - Hidden on mobile/tablet */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#2C3930]/95 backdrop-blur-sm border-b border-[#3F4F44]/20 hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#A2785C] rounded-full flex items-center justify-center">
                <span className="text-[#DCD7C9] font-bold text-sm">A</span>
              </div>
              <span className="text-[#DCD7C9] font-bold text-xl">Ananda Cinema</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-[#DCD7C9] hover:text-[#A2785C] transition-colors">
                Home
              </Link>
              <Link href="/get-ticket" className="text-[#DCD7C9] hover:text-[#A2785C] transition-colors">
                Get Ticket
              </Link>
              <Link href="/movies" className="text-[#DCD7C9] hover:text-[#A2785C] transition-colors">
                Movies
              </Link>
              <Link href="/news" className="text-[#DCD7C9] hover:text-[#A2785C] transition-colors">
                News
              </Link>
              <Link href="/contact" className="text-[#DCD7C9] hover:text-[#A2785C] transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile/Tablet Top Navigation - Scrollable */}
      <nav className="bg-[#2C3930] text-[#DCD7C9] lg:hidden">
        <div className="flex justify-between items-center px-4 py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-[#A2785C] rounded-full flex items-center justify-center">
              <span className="text-[#DCD7C9] font-bold text-sm">A</span>
            </div>
            <span className="text-[#DCD7C9] font-bold text-lg">Ananda Cinema</span>
          </Link>

          {/* Search Icon */}
          <button className="p-2 hover:bg-[#3F4F44] rounded-full transition-colors">
            <Search size={20} />
          </button>
        </div>
      </nav>

      {/* Mobile/Tablet Bottom Navigation - Hidden on desktop */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#2C3930]/95 backdrop-blur-sm border-t border-[#3F4F44]/20 lg:hidden">
        <div className="flex justify-around items-center py-2">
          <Link
            href="/"
            className={`flex flex-col items-center py-2 px-3 transition-colors ${
              activeTab === "home" ? "text-[#A2785C]" : "text-[#DCD7C9]"
            }`}
            onClick={() => setActiveTab("home")}
          >
            <Home size={20} />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link
            href="/get-ticket"
            className={`flex flex-col items-center py-2 px-3 transition-colors ${
              activeTab === "ticket" ? "text-[#A2785C]" : "text-[#DCD7C9]"
            }`}
            onClick={() => setActiveTab("ticket")}
          >
            <Ticket size={20} />
            <span className="text-xs mt-1">Ticket</span>
          </Link>

          <Link
            href="/movies"
            className={`flex flex-col items-center py-2 px-3 transition-colors ${
              activeTab === "movies" ? "text-[#A2785C]" : "text-[#DCD7C9]"
            }`}
            onClick={() => setActiveTab("movies")}
          >
            <Film size={20} />
            <span className="text-xs mt-1">Movies</span>
          </Link>

          <Link
            href="/news"
            className={`flex flex-col items-center py-2 px-3 transition-colors ${
              activeTab === "news" ? "text-[#A2785C]" : "text-[#DCD7C9]"
            }`}
            onClick={() => setActiveTab("news")}
          >
            <Newspaper size={20} />
            <span className="text-xs mt-1">News</span>
          </Link>

          <Link
            href="/contact"
            className={`flex flex-col items-center py-2 px-3 transition-colors ${
              activeTab === "contact" ? "text-[#A2785C]" : "text-[#DCD7C9]"
            }`}
            onClick={() => setActiveTab("contact")}
          >
            <Phone size={20} />
            <span className="text-xs mt-1">Contact</span>
          </Link>
        </div>
      </nav>
    </>
  )
}
