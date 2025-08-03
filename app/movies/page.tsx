"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Play, Ticket, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import BuyTicketButton from "@/components/buy-ticket-button"

const nowShowingMovies = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    genre: "Sci-Fi, Adventure",
    duration: "3h 12m",
    rating: "PG-13",
    poster: "/placeholder.svg?height=600&width=400",
    trailer: "https://www.youtube.com/embed/d9MyW72ELq0",
    description:
      "Set more than a decade after the events of the first film, Avatar: The Way of Water begins to tell the story of the Sully family, the trouble that follows them, the lengths they go to keep each other safe, the battles they fight to stay alive, and the tragedies they endure.",
  },
  {
    id: 2,
    title: "Top Gun: Maverick",
    genre: "Action, Drama",
    duration: "2h 11m",
    rating: "PG-13",
    poster: "/placeholder.svg?height=600&width=400",
    trailer: "https://www.youtube.com/embed/qSqVVswa420",
    description:
      "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice from those chosen to fly it.",
  },
  {
    id: 3,
    title: "Black Panther: Wakanda Forever",
    genre: "Action, Adventure",
    duration: "2h 41m",
    rating: "PG-13",
    poster: "/placeholder.svg?height=600&width=400",
    trailer: "https://www.youtube.com/embed/_Z3QKkl1WyM",
    description:
      "Queen Ramonda, Shuri, M'Baku, Okoye and the Dora Milaje fight to protect their nation from intervening world powers in the wake of King T'Challa's death.",
  },
  {
    id: 4,
    title: "The Batman",
    genre: "Action, Crime",
    duration: "2h 56m",
    rating: "PG-13",
    poster: "/placeholder.svg?height=600&width=400",
    trailer: "https://www.youtube.com/embed/mqqft2x_Aa4",
    description:
      "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
  },
]

const upcomingMovies = [
  {
    id: 1,
    title: "Spider-Man: Across the Spider-Verse",
    genre: "Animation, Action",
    releaseDate: "June 2, 2023",
    poster: "/placeholder.svg?height=600&width=400",
    trailer: "https://www.youtube.com/embed/cqGjhVJWtEg",
    description:
      "Miles Morales catapults across the Multiverse, where he encounters a team of Spider-People charged with protecting its very existence.",
  },
  {
    id: 2,
    title: "Guardians of the Galaxy Vol. 3",
    genre: "Action, Adventure",
    releaseDate: "May 5, 2023",
    poster: "/placeholder.svg?height=600&width=400",
    trailer: "https://www.youtube.com/embed/u3V5KDHRQvk",
    description:
      "Peter Quill, still reeling from the loss of Gamora, must rally his team around him to defend the universe along with protecting one of their own.",
  },
  {
    id: 3,
    title: "Fast X",
    genre: "Action, Crime",
    releaseDate: "May 19, 2023",
    poster: "/placeholder.svg?height=600&width=400",
    trailer: "https://www.youtube.com/embed/32RAq6JzY-w",
    description: "Dom Toretto and his family are targeted by the vengeful son of drug kingpin Hernan Reyes.",
  },
  {
    id: 4,
    title: "Indiana Jones 5",
    genre: "Action, Adventure",
    releaseDate: "June 30, 2023",
    poster: "/placeholder.svg?height=600&width=400",
    trailer: "https://www.youtube.com/embed/ZVuToMilP6M",
    description:
      "Aging archaeologist Indiana Jones races against time to retrieve a legendary artifact that can change the course of history.",
  },
]

export default function MoviesPage() {
  const [nowShowingIndex, setNowShowingIndex] = useState(0)
  const [upcomingIndex, setUpcomingIndex] = useState(0)
  const [showTrailer, setShowTrailer] = useState(false)
  const [selectedTrailer, setSelectedTrailer] = useState("")
  const [clickedCards, setClickedCards] = useState<Set<string>>(new Set())

  // Touch handling refs and state
  const nowShowingContainerRef = useRef<HTMLDivElement>(null)
  const upcomingContainerRef = useRef<HTMLDivElement>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  const nextNowShowing = () => {
    setNowShowingIndex((prev) => (prev + 1) % nowShowingMovies.length)
  }

  const prevNowShowing = () => {
    setNowShowingIndex((prev) => (prev - 1 + nowShowingMovies.length) % nowShowingMovies.length)
  }

  const nextUpcoming = () => {
    setUpcomingIndex((prev) => (prev + 1) % upcomingMovies.length)
  }

  const prevUpcoming = () => {
    setUpcomingIndex((prev) => (prev - 1 + upcomingMovies.length) % upcomingMovies.length)
  }

  const openTrailer = (trailerUrl: string) => {
    setSelectedTrailer(trailerUrl)
    setShowTrailer(true)
  }

  const closeTrailer = () => {
    setShowTrailer(false)
    setSelectedTrailer("")
  }

  const handleCardClick = (cardId: string) => {
    // Only handle click behavior on mobile/tablet
    if (window.innerWidth < 1024) {
      const newClickedCards = new Set(clickedCards)
      if (clickedCards.has(cardId)) {
        newClickedCards.delete(cardId)
      } else {
        newClickedCards.add(cardId)
      }
      setClickedCards(newClickedCards)
    }
  }

  // Touch handling functions
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = (section: "nowShowing" | "upcoming") => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      // Swipe left - next movie
      if (section === "nowShowing") {
        nextNowShowing()
      } else {
        nextUpcoming()
      }
    }

    if (isRightSwipe) {
      // Swipe right - previous movie
      if (section === "nowShowing") {
        prevNowShowing()
      } else {
        prevUpcoming()
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#DCD7C9]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2C3930] to-[#3F4F44] text-[#DCD7C9] py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Our Movies</h1>
        </div>
      </div>

      {/* Now Showing Section */}
      <section className="py-16 px-4 md:px-8 relative">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3930] mb-12 text-center">Now Showing</h2>

          {/* Mobile Layout - Full width with margins and touch support */}
          <div className="lg:hidden">
            <div className="px-4">
              <div
                ref={nowShowingContainerRef}
                className="group cursor-pointer"
                onClick={() => handleCardClick(`now-${nowShowingMovies[nowShowingIndex].id}`)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={() => onTouchEnd("nowShowing")}
              >
                <div className="relative bg-[#3F4F44] rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
                  <div className="relative">
                    {/* Movie Poster */}
                    <Image
                      src={nowShowingMovies[nowShowingIndex].poster || "/placeholder.svg"}
                      alt={nowShowingMovies[nowShowingIndex].title}
                      width={400}
                      height={600}
                      className={`w-full h-96 object-cover transition-all duration-500 ${
                        clickedCards.has(`now-${nowShowingMovies[nowShowingIndex].id}`) ? "blur-sm" : ""
                      }`}
                    />

                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 bg-[#2C3930]/90 transition-opacity duration-500 flex flex-col justify-center items-center p-8 ${
                        clickedCards.has(`now-${nowShowingMovies[nowShowingIndex].id}`) ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <h3 className="text-2xl md:text-3xl font-bold text-[#DCD7C9] mb-4 text-center">
                        {nowShowingMovies[nowShowingIndex].title}
                      </h3>
                      <p className="text-[#A2785C] text-lg mb-6 text-center">
                        {nowShowingMovies[nowShowingIndex].genre} • {nowShowingMovies[nowShowingIndex].duration}
                      </p>
                      <div className="flex space-x-4">
                        <Link href="/get-ticket">
                          <Button
                            size="lg"
                            className="bg-[#A2785C] hover:bg-[#A2785C]/80 text-[#DCD7C9] px-6 py-3"
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          >
                            <Ticket size={20} className="mr-2" />
                            Buy Ticket
                          </Button>
                        </Link>
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-[#DCD7C9] text-[#DCD7C9] hover:bg-[#DCD7C9] hover:text-[#2C3930] bg-transparent px-6 py-3"
                          onClick={(e) => {
                            e.stopPropagation()
                            openTrailer(nowShowingMovies[nowShowingIndex].trailer)
                          }}
                        >
                          <Play size={20} className="mr-2" />
                          Trailer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Movie Indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {nowShowingMovies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setNowShowingIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === nowShowingIndex ? "bg-[#A2785C]" : "bg-[#3F4F44]/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Layout - With navigation buttons */}
          <div className="hidden lg:block">
            <div className="relative max-w-4xl mx-auto">
              {/* Navigation Buttons */}
              <button
                onClick={prevNowShowing}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#2C3930] hover:bg-[#3F4F44] text-[#DCD7C9] p-4 rounded-full shadow-lg transition-colors"
              >
                <ChevronLeft size={32} />
              </button>

              <button
                onClick={nextNowShowing}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#2C3930] hover:bg-[#3F4F44] text-[#DCD7C9] p-4 rounded-full shadow-lg transition-colors"
              >
                <ChevronRight size={32} />
              </button>

              {/* Movie Display */}
              <div className="mx-16">
                <div className="group cursor-pointer">
                  <div className="relative bg-[#3F4F44] rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <div className="relative">
                      {/* Movie Poster */}
                      <Image
                        src={nowShowingMovies[nowShowingIndex].poster || "/placeholder.svg"}
                        alt={nowShowingMovies[nowShowingIndex].title}
                        width={400}
                        height={600}
                        className="w-full h-96 md:h-[600px] object-cover transition-all duration-500 group-hover:blur-sm"
                      />

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-[#2C3930]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center p-8">
                        <h3 className="text-3xl md:text-4xl font-bold text-[#DCD7C9] mb-4 text-center">
                          {nowShowingMovies[nowShowingIndex].title}
                        </h3>
                        <p className="text-[#A2785C] text-lg md:text-xl mb-6 text-center">
                          {nowShowingMovies[nowShowingIndex].genre} • {nowShowingMovies[nowShowingIndex].duration}
                        </p>
                        <div className="flex space-x-4">
                          <Link href="/get-ticket">
                            <Button
                              size="lg"
                              className="bg-[#A2785C] hover:bg-[#A2785C]/80 text-[#DCD7C9] px-6 py-3"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              <Ticket size={20} className="mr-2" />
                              Buy Ticket
                            </Button>
                          </Link>
                          <Button
                            size="lg"
                            variant="outline"
                            className="border-[#DCD7C9] text-[#DCD7C9] hover:bg-[#DCD7C9] hover:text-[#2C3930] bg-transparent px-6 py-3"
                            onClick={(e) => {
                              e.stopPropagation()
                              openTrailer(nowShowingMovies[nowShowingIndex].trailer)
                            }}
                          >
                            <Play size={20} className="mr-2" />
                            Trailer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Movie Indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {nowShowingMovies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setNowShowingIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === nowShowingIndex ? "bg-[#A2785C]" : "bg-[#3F4F44]/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Movies Section */}
      <section className="py-16 px-4 md:px-8 relative bg-[#3F4F44]/10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3930] mb-12 text-center">Coming Soon</h2>

          {/* Mobile Layout - Full width with margins and touch support */}
          <div className="lg:hidden">
            <div className="px-4">
              <div
                ref={upcomingContainerRef}
                className="group cursor-pointer"
                onClick={() => handleCardClick(`upcoming-${upcomingMovies[upcomingIndex].id}`)}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={() => onTouchEnd("upcoming")}
              >
                <div className="relative bg-[#3F4F44] rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
                  <div className="relative">
                    {/* Movie Poster */}
                    <Image
                      src={upcomingMovies[upcomingIndex].poster || "/placeholder.svg"}
                      alt={upcomingMovies[upcomingIndex].title}
                      width={400}
                      height={600}
                      className={`w-full h-96 object-cover transition-all duration-500 ${
                        clickedCards.has(`upcoming-${upcomingMovies[upcomingIndex].id}`) ? "blur-sm" : ""
                      }`}
                    />

                    {/* Coming Soon Badge */}
                    <div className="absolute top-6 left-6 bg-[#A2785C] text-[#DCD7C9] px-4 py-2 rounded-full text-sm font-semibold">
                      Coming Soon
                    </div>

                    {/* Overlay */}
                    <div
                      className={`absolute inset-0 bg-[#2C3930]/90 transition-opacity duration-500 flex flex-col justify-center items-center p-8 ${
                        clickedCards.has(`upcoming-${upcomingMovies[upcomingIndex].id}`) ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <h3 className="text-2xl md:text-3xl font-bold text-[#DCD7C9] mb-4 text-center">
                        {upcomingMovies[upcomingIndex].title}
                      </h3>
                      <p className="text-[#A2785C] text-lg mb-2 text-center">{upcomingMovies[upcomingIndex].genre}</p>
                      <p className="text-[#DCD7C9] text-base mb-6 text-center">
                        Release: {upcomingMovies[upcomingIndex].releaseDate}
                      </p>
                      <div className="flex space-x-4">
                        <Button
                          size="lg"
                          className="bg-[#A2785C] hover:bg-[#A2785C]/80 text-[#DCD7C9] px-6 py-3"
                          onClick={(e) => {
                            e.stopPropagation()
                            // Handle notify me functionality
                          }}
                        >
                          <Bell size={20} className="mr-2" />
                          Notify Me
                        </Button>
                        <Button
                          size="lg"
                          variant="outline"
                          className="border-[#DCD7C9] text-[#DCD7C9] hover:bg-[#DCD7C9] hover:text-[#2C3930] bg-transparent px-6 py-3"
                          onClick={(e) => {
                            e.stopPropagation()
                            openTrailer(upcomingMovies[upcomingIndex].trailer)
                          }}
                        >
                          <Play size={20} className="mr-2" />
                          Trailer
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Movie Indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {upcomingMovies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setUpcomingIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === upcomingIndex ? "bg-[#A2785C]" : "bg-[#3F4F44]/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Layout - With navigation buttons */}
          <div className="hidden lg:block">
            <div className="relative max-w-4xl mx-auto">
              {/* Navigation Buttons */}
              <button
                onClick={prevUpcoming}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#2C3930] hover:bg-[#3F4F44] text-[#DCD7C9] p-4 rounded-full shadow-lg transition-colors"
              >
                <ChevronLeft size={32} />
              </button>

              <button
                onClick={nextUpcoming}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#2C3930] hover:bg-[#3F4F44] text-[#DCD7C9] p-4 rounded-full shadow-lg transition-colors"
              >
                <ChevronRight size={32} />
              </button>

              {/* Movie Display */}
              <div className="mx-16">
                <div className="group cursor-pointer">
                  <div className="relative bg-[#3F4F44] rounded-2xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500">
                    <div className="relative">
                      {/* Movie Poster */}
                      <Image
                        src={upcomingMovies[upcomingIndex].poster || "/placeholder.svg"}
                        alt={upcomingMovies[upcomingIndex].title}
                        width={400}
                        height={600}
                        className="w-full h-96 md:h-[600px] object-cover transition-all duration-500 group-hover:blur-sm"
                      />

                      {/* Coming Soon Badge */}
                      <div className="absolute top-6 left-6 bg-[#A2785C] text-[#DCD7C9] px-4 py-2 rounded-full text-sm font-semibold">
                        Coming Soon
                      </div>

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-[#2C3930]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-center items-center p-8">
                        <h3 className="text-3xl md:text-4xl font-bold text-[#DCD7C9] mb-4 text-center">
                          {upcomingMovies[upcomingIndex].title}
                        </h3>
                        <p className="text-[#A2785C] text-lg md:text-xl mb-2 text-center">
                          {upcomingMovies[upcomingIndex].genre}
                        </p>
                        <p className="text-[#DCD7C9] text-base md:text-lg mb-6 text-center">
                          Release: {upcomingMovies[upcomingIndex].releaseDate}
                        </p>
                        <div className="flex space-x-4">
                          <Button
                            size="lg"
                            className="bg-[#A2785C] hover:bg-[#A2785C]/80 text-[#DCD7C9] px-6 py-3"
                            onClick={(e) => {
                              e.stopPropagation()
                              // Handle notify me functionality
                            }}
                          >
                            <Bell size={20} className="mr-2" />
                            Notify Me
                          </Button>
                          <Button
                            size="lg"
                            variant="outline"
                            className="border-[#DCD7C9] text-[#DCD7C9] hover:bg-[#DCD7C9] hover:text-[#2C3930] bg-transparent px-6 py-3"
                            onClick={(e) => {
                              e.stopPropagation()
                              openTrailer(upcomingMovies[upcomingIndex].trailer)
                            }}
                          >
                            <Play size={20} className="mr-2" />
                            Trailer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Movie Indicators */}
              <div className="flex justify-center mt-8 space-x-2">
                {upcomingMovies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setUpcomingIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === upcomingIndex ? "bg-[#A2785C]" : "bg-[#3F4F44]/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      {showTrailer && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative bg-[#2C3930] rounded-lg overflow-hidden max-w-4xl w-full">
            <button
              onClick={closeTrailer}
              className="absolute top-4 right-4 z-10 text-[#DCD7C9] hover:text-[#A2785C] text-2xl"
            >
              ×
            </button>
            <div className="aspect-video">
              <iframe src={selectedTrailer} className="w-full h-full" allowFullScreen title="Movie Trailer" />
            </div>
          </div>
        </div>
      )}
      <BuyTicketButton />
    </div>
  )
}
