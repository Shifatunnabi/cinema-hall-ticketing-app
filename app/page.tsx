import HeroSection from "@/components/hero-section"
import NowShowing from "@/components/now-showing"
import UpcomingMovies from "@/components/upcoming-movies"
import NewsSection from "@/components/news-section"
import BuyTicketButton from "@/components/buy-ticket-button"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#DCD7C9] relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#2C3930] via-[#3F4F44] to-[#A2785C] opacity-10"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-[#2C3930] rounded-full opacity-5 animate-pulse"></div>
        <div className="absolute bottom-40 right-32 w-24 h-24 bg-[#A2785C] rounded-full opacity-5 animate-bounce"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-[#3F4F44] transform rotate-45 opacity-5 animate-spin"></div>
      </div>

      <div className="relative z-10">
        <HeroSection />
        <NowShowing />
        <UpcomingMovies />
        <NewsSection />
      </div>

      <BuyTicketButton />
    </main>
  )
}
