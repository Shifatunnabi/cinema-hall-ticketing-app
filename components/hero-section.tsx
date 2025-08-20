"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Play, Calendar, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [dates, setDates] = useState<any[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [movies, setMovies] = useState<any[]>([]);

  // Load Now Showing movies from API
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const res = await fetch("/api/movies", { cache: "no-store" });
        const allMovies = await res.json();
        if (res.ok) {
          const nowShowingMovies = (allMovies || []).filter(
            (movie: any) => movie.status === "now-showing"
          );
          setMovies(nowShowingMovies);
        }
      } catch (error) {
        console.error("Error loading movies:", error);
      }
    };
    loadMovies();
  }, []);

  useEffect(() => {
    // Generate dates (3 before today, today, 3 after today)
    const today = new Date();
    const dateArray = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dateArray.push({
        date: date,
        day: date.getDate().toString().padStart(2, "0"),
        month: date.toLocaleDateString("en", { month: "short" }),
        fullDate: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "2-digit",
        }),
        isPast: date < today,
        isToday: date.toDateString() === today.toDateString(),
      });
    }
    setDates(dateArray);
  }, []);

  useEffect(() => {
    // Only auto-slide if there are multiple movies
    if (movies.length > 1) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % movies.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [movies.length]);

  const handleDateClick = (dateInfo: any) => {
    if (dateInfo.isPast) return; // Don't allow past dates

    // Navigate to get-ticket page with selected date
    const searchParams = new URLSearchParams();
    searchParams.set("selectedDate", dateInfo.fullDate);
    router.push(`/get-ticket?${searchParams.toString()}`);
  };

  const handleCalendarDateSelect = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return; // Don't allow past dates

    const selectedDateString = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });

    setShowCalendar(false);

    // Navigate to get-ticket page with selected date
    const searchParams = new URLSearchParams();
    searchParams.set("selectedDate", selectedDateString);
    router.push(`/get-ticket?${searchParams.toString()}`);
  };

  const renderCalendar = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isToday = date.toDateString() === today.toDateString();
      const isPast = date < today;
      const isDisabled = isPast;

      days.push(
        <button
          key={day}
          onClick={() => !isDisabled && handleCalendarDateSelect(date)}
          disabled={isDisabled}
          className={`p-2 text-sm rounded-lg transition-colors ${
            isToday
              ? "bg-[#A2785C] text-[#DCD7C9] font-bold"
              : isDisabled
              ? "text-[#3F4F44]/30 cursor-not-allowed"
              : "hover:bg-[#A2785C]/20 text-[#2C3930]"
          }`}
        >
          {day}
        </button>
      );
    }

    return (
      <div className="bg-white rounded-lg p-4 shadow-xl max-w-sm w-full">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCalendarDate(new Date(year, month - 1, 1))}
            className="p-1 hover:bg-[#3F4F44]/10 rounded"
          >
            ←
          </button>
          <h3 className="font-semibold text-[#2C3930]">
            {monthNames[month]} {year}
          </h3>
          <button
            onClick={() => setCalendarDate(new Date(year, month + 1, 1))}
            className="p-1 hover:bg-[#3F4F44]/10 rounded"
          >
            →
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-xs font-medium text-[#3F4F44] text-center"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  };

  return (
    <section className="relative overflow-hidden lg:h-screen">
      {/* Mobile: 16:9 aspect ratio, Desktop: full height */}
      <div className="w-full lg:h-screen" style={{ aspectRatio: "16/9" }}>
      {/* Movie Carousel */}
      <div className="absolute inset-0">
        {movies.length === 0 ? (
          // Show placeholder when no movies are available
          <div className="absolute inset-0">
            <div className="relative w-full h-full">
              <Image
                src="/placeholder.svg"
                alt="No movies available"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2C3930]/80 via-transparent to-[#2C3930]/60"></div>
            </div>
          </div>
        ) : (
          movies.map((movie, index) => (
            <div
              key={movie._id || movie.id}
              className={`absolute inset-0 transition-transform duration-1000 ease-in-out ${
                index === currentSlide ? "translate-x-0" : "translate-x-full"
              }`}
            >
              <div className="relative w-full h-full">
                <Image
                  src={movie.thumbnail || movie.poster || "/placeholder.svg"}
                  alt={movie.title || "Movie thumbnail"}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2C3930]/80 via-transparent to-[#2C3930]/60"></div>
              </div>
            </div>
          ))
        )}
      </div>

        {/* Calendar - Left Side (Hidden on mobile/tablet) */}
        <div className="absolute left-4 md:left-8 top-20 z-20 hidden lg:block">
          <div className="flex flex-col">
            {dates.map((dateInfo, index) => {
              const distanceFromToday = Math.abs(index - 3); // 3 is the middle index (today)

              // Size and opacity based on distance from today
              let sizeClass = "text-sm";
              let opacity = "opacity-40";

              if (dateInfo.isToday) {
                sizeClass = "text-3xl";
                opacity = "opacity-100";
              } else if (distanceFromToday === 1) {
                sizeClass = "text-xl";
                opacity = "opacity-70";
              } else if (distanceFromToday === 2) {
                sizeClass = "text-lg";
                opacity = "opacity-55";
              } else {
                sizeClass = "text-base";
                opacity = "opacity-40";
              }

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(dateInfo)}
                  disabled={dateInfo.isPast}
                  className={`text-left p-3 mb-2 rounded transition-all duration-300 text-[#DCD7C9] ${sizeClass} ${opacity} ${
                    dateInfo.isPast
                      ? "cursor-not-allowed opacity-20"
                      : "hover:border-2 hover:border-[#A2785C] hover:rounded-full hover:scale-110 hover:shadow-lg transform cursor-pointer"
                  } ${dateInfo.isToday ? "font-bold" : "font-medium"}`}
                  style={{ textShadow: "2px 2px 4px rgba(44, 57, 48, 0.8)" }}
                >
                  <div className="font-bold">{dateInfo.day}</div>
                  <div className="text-xs mt-1">{dateInfo.month}</div>
                </button>
              );
            })}

            {/* Calendar Icon for More Dates */}
            <button
              onClick={() => setShowCalendar(true)}
              className="mt-4 bg-[#2C3930]/80 hover:bg-[#2C3930] text-[#DCD7C9] p-2 rounded-full transition-colors self-center"
              title="Select other dates"
            >
              <Calendar size={20} />
            </button>
          </div>
        </div>

        {/* Movie Info - Bottom Left with smaller text on mobile */}
        <div className="absolute bottom-4 left-4 right-4 lg:bottom-32 lg:left-64 lg:right-auto lg:max-w-lg z-20">
          {movies.length > 0 ? (
            <>
              <div className="mb-1 lg:mb-3">
                <span
                  className="inline-block text-[#A2785C] text-xs lg:text-lg font-semibold tracking-wide"
                  style={{ textShadow: "2px 2px 4px rgba(44, 57, 48, 0.8)" }}
                >
                  {movies[currentSlide]?.genre || "Movie"}
                </span>
              </div>

              <h1
                className="text-lg lg:text-4xl xl:text-5xl font-bold text-[#DCD7C9] mb-1 lg:mb-3 leading-tight"
                style={{ textShadow: "3px 3px 6px rgba(44, 57, 48, 0.9)" }}
              >
                {movies[currentSlide]?.title || "Movie Title"}
              </h1>

              <p
                className="text-[#DCD7C9] text-xs lg:text-base mb-2 lg:mb-6 opacity-90"
                style={{ textShadow: "2px 2px 4px rgba(44, 57, 48, 0.8)" }}
              >
                Duration: {movies[currentSlide]?.durationMinutes ? `${movies[currentSlide].durationMinutes}m` : 'TBA'} • Now Showing
              </p>

              <div className="flex space-x-2 lg:space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-transparent border border-[#DCD7C9] text-[#DCD7C9] hover:bg-[#DCD7C9] hover:text-[#2C3930] px-2 lg:px-6 py-1 lg:py-2 font-semibold text-xs lg:text-base"
                >
                  More Info
                </Button>
                <Link href="/get-ticket">
                  <Button
                    size="sm"
                    className="bg-[#A2785C] hover:bg-[#A2785C]/80 text-[#DCD7C9] px-2 lg:px-6 py-1 lg:py-2 font-semibold text-xs lg:text-base"
                  >
                    <Play size={10} className="mr-1 lg:mr-2" />
                    Get Ticket
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1
                className="text-lg lg:text-4xl xl:text-5xl font-bold text-[#DCD7C9] mb-1 lg:mb-3 leading-tight"
                style={{ textShadow: "3px 3px 6px rgba(44, 57, 48, 0.9)" }}
              >
                Coming Soon
              </h1>
              <p
                className="text-[#DCD7C9] text-xs lg:text-base mb-2 lg:mb-6 opacity-90"
                style={{ textShadow: "2px 2px 4px rgba(44, 57, 48, 0.8)" }}
              >
                Stay tuned for exciting new movies!
              </p>
            </>
          )}
        </div>

        {/* Now Showing Indicator - Top Right */}
        <div className="absolute top-2 lg:top-8 right-2 lg:right-8 z-20 text-right">
          <p
            className="text-[#DCD7C9] text-xs lg:text-sm opacity-80 mb-1"
            style={{ textShadow: "2px 2px 4px rgba(44, 57, 48, 0.8)" }}
          >
            Now Showing
          </p>
          <p
            className="text-[#A2785C] text-sm lg:text-xl font-bold border-b-2 border-[#A2785C] inline-block"
            style={{ textShadow: "2px 2px 4px rgba(44, 57, 48, 0.8)" }}
          >
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Slide Indicators - Only show if there are multiple movies */}
        {movies.length > 1 && (
          <div className="absolute bottom-16 lg:bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {movies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full transition-colors ${
                  index === currentSlide ? "bg-[#A2785C]" : "bg-[#DCD7C9]/50"
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="relative">
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute -top-2 -right-2 z-10 bg-[#2C3930] text-[#DCD7C9] rounded-full p-2 hover:bg-[#3F4F44] transition-colors"
            >
              <X size={16} />
            </button>
            {renderCalendar()}
          </div>
        </div>
      )}
    </section>
  );
}
