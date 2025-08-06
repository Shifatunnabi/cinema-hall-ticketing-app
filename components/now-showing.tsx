"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";

const nowShowingMovies = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    genre: "Sci-Fi, Adventure",
    duration: "3h 12m",
    rating: "PG-13",
    poster:
      "https://m.media-amazon.com/images/M/MV5BMDI2MThlNzAtYjU0MS00ZDYyLWEyOWItMjQzMGNhY2RkNDdjXkEyXkFqcGc@._V1_.jpg",
    trailer: "https://www.youtube.com/embed/d9MyW72ELq0",
  },
  {
    id: 2,
    title: "Top Gun: Maverick",
    genre: "Action, Drama",
    duration: "2h 11m",
    rating: "PG-13",
    poster:
      "https://images.justwatch.com/poster/318087954/s718/toofan-2024.jpg",
    trailer: "https://www.youtube.com/embed/qSqVVswa420",
  },
  {
    id: 3,
    title: "Black Panther: Wakanda Forever",
    genre: "Action, Adventure",
    duration: "2h 41m",
    rating: "PG-13",
    poster:
      "https://m.media-amazon.com/images/M/MV5BZmMwZTk1MDctMjM1My00YTA5LTg0YmYtZWE5Y2Q4N2JhZGQ1XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    trailer: "https://www.youtube.com/embed/_Z3QKkl1WyM",
  },
  {
    id: 4,
    title: "The Batman",
    genre: "Action, Crime",
    duration: "2h 56m",
    rating: "PG-13",
    poster: "https://i.ibb.co.com/Lhb8TTHr/Screenshot-2025-08-06-180557.png",
    trailer: "https://www.youtube.com/embed/mqqft2x_Aa4",
  },
];

export default function NowShowing() {
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState("");
  const [clickedCards, setClickedCards] = useState<Set<number>>(new Set());
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isCardActive, setIsCardActive] = useState(false);

  const openTrailer = (trailerUrl: string) => {
    setSelectedTrailer(trailerUrl);
    setShowTrailer(true);
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    setSelectedTrailer("");
  };

  const handleCardClick = (movieId: number) => {
    // Only handle click behavior on mobile/tablet
    if (window.innerWidth < 1024) {
      const newClickedCards = new Set(clickedCards);
      if (clickedCards.has(movieId)) {
        newClickedCards.delete(movieId);
        setIsCardActive(false); // No cards are active
      } else {
        newClickedCards.add(movieId);
        setIsCardActive(true); // A card is now active
      }
      setClickedCards(newClickedCards);
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const slideWidth = container.offsetWidth;
      container.scrollTo({
        left: slideWidth * index,
        behavior: "smooth",
      });
      setCurrentMobileIndex(index);
    }
  };

  // Auto-scroll functionality
  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (window.innerWidth < 1024 && !isCardActive) {
        // Only on mobile and if no card is active
        const nextIndex = (currentMobileIndex + 1) % nowShowingMovies.length;
        scrollToSlide(nextIndex);
      }
    }, 4000); // Auto-scroll every 4 seconds

    return () => clearInterval(autoScroll);
  }, [currentMobileIndex, isCardActive]);

  // Handle scroll events to update current index
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const slideWidth = container.offsetWidth;
      const newIndex = Math.round(scrollLeft / slideWidth);
      setCurrentMobileIndex(newIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleMouseEnter = () => {
    if (window.innerWidth >= 1024) {
      setIsCardActive(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) {
      setIsCardActive(false);
    }
  };

  return (
    <section className="py-16 px-4 md:px-8 relative">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#2C3930] mb-8 text-center">
          Now Showing
        </h2>

        {/* Desktop: Carousel with arrows, Mobile: Full width grid */}
        <div className="lg:hidden">
          <div className="relative">
            <div
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              ref={scrollContainerRef}
            >
              {nowShowingMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex-shrink-0 w-full px-4 snap-center"
                  onClick={() => handleCardClick(movie.id)}
                >
                  <div className="relative bg-[#3F4F44] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                    <div className="relative">
                      <Image
                        src={movie.poster || "/placeholder.svg"}
                        alt={movie.title}
                        width={300}
                        height={600}
                        className={`w-full h-[32rem] object-cover transition-all duration-300 ${
                          clickedCards.has(movie.id) ? "blur-sm" : ""
                        }`}
                      />

                      {/* Click Overlay */}
                      <div
                        className={`absolute inset-0 bg-[#2C3930]/90 transition-opacity duration-300 flex flex-col justify-center items-center p-6 ${
                          clickedCards.has(movie.id)
                            ? "opacity-100"
                            : "opacity-0"
                        }`}
                      >
                        <h3 className="text-xl font-bold text-[#DCD7C9] mb-2 text-center">
                          {movie.title}
                        </h3>
                        <p className="text-[#A2785C] text-sm mb-4 text-center">
                          {movie.genre} • {movie.duration}
                        </p>
                        <div className="flex space-x-3">
                          <Link href="/get-ticket">
                            <Button
                              size="sm"
                              className="bg-[#A2785C] hover:bg-[#A2785C]/80 text-[#DCD7C9]"
                            >
                              <Ticket size={16} className="mr-1" />
                              Buy Ticket
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-[#DCD7C9] text-[#DCD7C9] hover:bg-[#DCD7C9] hover:text-[#2C3930] bg-transparent"
                            onClick={(e) => {
                              e.stopPropagation();
                              openTrailer(movie.trailer);
                            }}
                          >
                            <Play size={16} className="mr-1" />
                            Trailer
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Dots indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {nowShowingMovies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    currentMobileIndex === index
                      ? "bg-[#A2785C]"
                      : "bg-[#3F4F44]/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop: Original carousel design */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Navigation Buttons */}
            <button className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#2C3930] hover:bg-[#3F4F44] text-[#DCD7C9] p-3 rounded-full shadow-lg transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-[#2C3930] hover:bg-[#3F4F44] text-[#DCD7C9] p-3 rounded-full shadow-lg transition-colors">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* Movie Cards */}
            <div className="overflow-hidden mx-12">
              <div className="flex transition-transform duration-300 ease-in-out">
                {nowShowingMovies.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex-shrink-0 w-1/3 px-4 group"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="relative bg-[#3F4F44] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="relative">
                        <Image
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          width={300}
                          height={400}
                          className="w-full h-[32rem] object-cover transition-all duration-300 group-hover:blur-sm"
                        />

                        {/* Hover Overlay */}
                        <div className="absolute inset-0 bg-[#2C3930]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6">
                          <h3 className="text-xl font-bold text-[#DCD7C9] mb-2 text-center">
                            {movie.title}
                          </h3>
                          <p className="text-[#A2785C] text-sm mb-4 text-center">
                            {movie.genre} • {movie.duration}
                          </p>
                          <div className="flex space-x-3">
                            <Link href="/get-ticket">
                              <Button
                                size="sm"
                                className="bg-[#A2785C] hover:bg-[#A2785C]/80 text-[#DCD7C9]"
                              >
                                <Ticket size={16} className="mr-1" />
                                Buy Ticket
                              </Button>
                            </Link>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#DCD7C9] text-[#DCD7C9] hover:bg-[#DCD7C9] hover:text-[#2C3930] bg-transparent"
                              onClick={() => openTrailer(movie.trailer)}
                            >
                              <Play size={16} className="mr-1" />
                              Trailer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

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
              <iframe
                src={selectedTrailer}
                className="w-full h-full"
                allowFullScreen
                title="Movie Trailer"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
