"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Play, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UpcomingMovies() {
  const [showTrailer, setShowTrailer] = useState(false);
  const [selectedTrailer, setSelectedTrailer] = useState("");
  const [clickedCards, setClickedCards] = useState<Set<string>>(new Set());
  const [isCardActive, setIsCardActive] = useState(false);
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [movies, setMovies] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/movies", { cache: "no-store" });
        const all = await res.json();
        if (res.ok) {
          const filtered = (all || []).filter(
            (m: any) => m.status === "upcoming"
          );
          setMovies(filtered);
        }
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, []);

  const openTrailer = (trailerUrl: string) => {
    setSelectedTrailer(trailerUrl);
    setShowTrailer(true);
  };

  const closeTrailer = () => {
    setShowTrailer(false);
    setSelectedTrailer("");
  };

  const handleCardClick = (movieId: string) => {
    if (window.innerWidth < 1024) {
      const newClickedCards = new Set(clickedCards);
      if (clickedCards.has(movieId)) {
        newClickedCards.delete(movieId);
        setIsCardActive(false);
      } else {
        newClickedCards.add(movieId);
        setIsCardActive(true);
      }
      setClickedCards(newClickedCards);
    }
  };

  const scrollToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const slideWidth = container.offsetWidth;
      container.scrollTo({ left: slideWidth * index, behavior: "smooth" });
      setCurrentMobileIndex(index);
    }
  };

  useEffect(() => {
    const autoScroll = setInterval(() => {
      if (window.innerWidth < 1024 && !isCardActive && movies.length > 0) {
        const nextIndex = (currentMobileIndex + 1) % movies.length;
        scrollToSlide(nextIndex);
      }
    }, 4000);
    return () => clearInterval(autoScroll);
  }, [currentMobileIndex, isCardActive, movies.length]);

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
    if (window.innerWidth >= 1024) setIsCardActive(true);
  };
  const handleMouseLeave = () => {
    if (window.innerWidth >= 1024) setIsCardActive(false);
  };

  return (
    <section className="py-16 px-4 md:px-8 relative bg-[#3F4F44]/10">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#2C3930] mb-8 text-center">
          Coming Soon
        </h2>

        {/* Mobile */}
        <div className="lg:hidden">
          <div className="relative">
            <div
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              ref={scrollContainerRef}
            >
              {movies.map((movie) => {
                const id = String(movie._id || movie.id);
                const genreStr = (movie.genres || []).join(", ");
                return (
                  <div
                    key={id}
                    className="flex-shrink-0 w-full px-4 snap-center"
                    onClick={() => handleCardClick(id)}
                  >
                    <div className="relative bg-[#3F4F44] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer">
                      <div className="relative">
                        <Image
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          width={300}
                          height={400}
                          className={`w-full h-[32rem] object-cover transition-all duration-300 ${
                            clickedCards.has(id) ? "blur-sm" : ""
                          }`}
                          unoptimized
                        />

                        <div className="absolute top-4 left-4 bg-[#A2785C] text-[#DCD7C9] px-3 py-1 rounded-full text-sm font-semibold">
                          Coming Soon
                        </div>

                        <div
                          className={`absolute inset-0 bg-[#2C3930]/90 transition-opacity duration-300 flex flex-col justify-center items-center p-6 ${
                            clickedCards.has(id) ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <h3 className="text-xl font-bold text-[#DCD7C9] mb-2 text-center">
                            {movie.title}
                          </h3>
                          <p className="text-[#A2785C] text-sm mb-2 text-center">
                            {genreStr}
                          </p>
                          <div className="flex space-x-3">
                            <Button
                              size="sm"
                              className="bg-[#A2785C] hover:bg-[#A2785C]/80 text-[#DCD7C9]"
                            >
                              <Bell size={16} className="mr-1" />
                              Notify Me
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-[#DCD7C9] text-[#DCD7C9] hover:bg-[#DCD7C9] hover:text-[#2C3930] bg-transparent"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTrailer(movie.trailer);
                                setShowTrailer(true);
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
                );
              })}
            </div>

            <div className="flex justify-center mt-4 space-x-2">
              {movies.map((_, index) => (
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

        {/* Desktop */}
        <div className="hidden lg:block">
          <div className="relative">
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

            <div className="overflow-hidden mx-12">
              <div className="flex transition-transform duration-300 ease-in-out">
                {movies.map((movie) => {
                  const id = String(movie._id || movie.id);
                  const genreStr = (movie.genres || []).join(", ");
                  return (
                    <div
                      key={id}
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
                            unoptimized
                          />
                          <div className="absolute top-4 left-4 bg-[#A2785C] text-[#DCD7C9] px-3 py-1 rounded-full text-sm font-semibold">
                            Coming Soon
                          </div>
                          <div className="absolute inset-0 bg-[#2C3930]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6">
                            <h3 className="text-xl font-bold text-[#DCD7C9] mb-2 text-center">
                              {movie.title}
                            </h3>
                            <p className="text-[#A2785C] text-sm mb-2 text-center">
                              {genreStr}
                            </p>
                            <div className="flex space-x-3">
                              <Button
                                size="sm"
                                className="bg-[#A2785C] hover:bg-[#A2785C]/80 text-[#DCD7C9]"
                              >
                                <Bell size={16} className="mr-1" />
                                Notify Me
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-[#DCD7C9] text-[#DCD7C9] hover:bg-[#DCD7C9] hover:text-[#2C3930] bg-transparent"
                                onClick={() => {
                                  setSelectedTrailer(movie.trailer);
                                  setShowTrailer(true);
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
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

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
