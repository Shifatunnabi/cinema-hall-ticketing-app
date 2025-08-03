"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Ticket } from "lucide-react"

export default function BuyTicketButton() {
  const pathname = usePathname()

  // Don't show on get-ticket page
  if (pathname === "/get-ticket") return null

  return (
    <Link
      href="/get-ticket"
      className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50 bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9] rounded-l-full shadow-lg transition-all duration-300 hover:translate-x-1 px-4 py-3 lg:px-6 lg:py-4"
    >
      <div className="flex items-center lg:space-x-2">
        <Ticket size={16} className="lg:hidden" />
        <Ticket size={20} className="hidden lg:block" />
        <div className="lg:hidden flex flex-col items-center ml-1">
          <span className="font-semibold text-xs leading-tight">Buy</span>
          <span className="font-semibold text-xs leading-tight">Ticket</span>
        </div>
        <span className="font-semibold hidden lg:inline">Buy Ticket</span>
      </div>
    </Link>
  )
}
