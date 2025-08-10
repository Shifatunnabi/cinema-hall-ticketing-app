"use client";

import type React from "react";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CreditCard,
  Minus,
  Plus,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Types matching our Movie API
type SeatCategory = { name: string; price: number };
type ShowTime = { time: string; categories: SeatCategory[] };
interface MovieDoc {
  _id: string;
  title: string;
  genres?: string[];
  poster?: string;
  thumbnail?: string;
  status: string;
  schedule?: Record<string, ShowTime[]>;
}

function toDateKey(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseToDateKey(input: string): string | null {
  if (!input) return null;
  // Allow YYYY-MM-DD directly
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) return input;
  // Fallback: try Date parsing
  const d = new Date(input);
  if (!isNaN(d.getTime())) return toDateKey(d);
  return null;
}

function displayPartsFromKey(key: string) {
  const [y, m, d] = key.split("-").map((n) => parseInt(n, 10));
  const date = new Date(y, (m || 1) - 1, d || 1);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return {
    day: dayNames[date.getDay()],
    date: String(date.getDate()).padStart(2, "0"),
    month: monthNames[date.getMonth()],
    dateObj: date,
  };
}

export default function GetTicketPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [movies, setMovies] = useState<MovieDoc[]>([]);
  const [availableDates, setAvailableDates] = useState<
    {
      day: string;
      date: string;
      month: string;
      fullDate: string;
      dateObj: Date;
    }[]
  >([]);
  const [selectedDate, setSelectedDate] = useState<string>(""); // YYYY-MM-DD
  const [selectedMovie, setSelectedMovie] = useState<MovieDoc | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedSeatType, setSelectedSeatType] = useState<SeatCategory | null>(
    null
  );
  const [ticketQuantity, setTicketQuantity] = useState<number>(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    mobile: "",
    email: "",
  });
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load and cache movies (status: now-showing)
  useEffect(() => {
    const load = async () => {
      try {
        const cacheKey = "nowShowingMoviesCache";
        const ttlMs = 10 * 60 * 1000; // 10 minutes
        const cachedRaw =
          typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;
        if (cachedRaw) {
          try {
            const cached = JSON.parse(cachedRaw);
            if (
              cached.updatedAt &&
              Date.now() - cached.updatedAt < ttlMs &&
              Array.isArray(cached.data)
            ) {
              setMovies(cached.data);
            }
          } catch {
            // ignore cache parse errors
          }
        }

        const res = await fetch("/api/movies", { cache: "no-store" });
        const all = await res.json();
        if (res.ok) {
          const running = (all || []).filter(
            (m: MovieDoc) => m.status === "now-showing"
          );
          setMovies(running);
          try {
            localStorage.setItem(
              cacheKey,
              JSON.stringify({ updatedAt: Date.now(), data: running })
            );
          } catch {
            // ignore cache save errors
          }
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    };
    load();
  }, []);

  // Build available dates from schedules of running movies
  useEffect(() => {
    const keys = new Set<string>();
    for (const m of movies) {
      const sched = m.schedule || {};
      for (const k of Object.keys(sched)) keys.add(k);
    }
    const list = Array.from(keys)
      .sort((a, b) => a.localeCompare(b))
      .map((k) => {
        const p = displayPartsFromKey(k);
        return {
          day: p.day,
          date: p.date,
          month: p.month,
          fullDate: k,
          dateObj: p.dateObj,
        };
      });
    setAvailableDates(list);
  }, [movies]);

  // Helper to update URL params without full reload
  const pushParams = (updates: Record<string, string | null>) => {
    const sp = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(updates).forEach(([k, v]) => {
      if (v === null || v === undefined || v === "") sp.delete(k);
      else sp.set(k, v);
    });
    router.push(`${pathname}?${sp.toString()}`, { scroll: false });
  };

  // Handle pre-selected date from URL params
  useEffect(() => {
    const pre = searchParams.get("selectedDate");
    const key = pre ? parseToDateKey(pre) : null;
    if (key && key !== selectedDate) {
      setSelectedDate(key);
      // Reset subsequent selections when date changes
      setSelectedMovie(null);
      setSelectedTime("");
      setSelectedSeatType(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("selectedDate")]);

  // Hydrate movie/time/seat/qty from URL when possible
  useEffect(() => {
    const movieId = searchParams.get("movieId");
    const time = searchParams.get("time");
    const seat = searchParams.get("seat");
    const qty = searchParams.get("qty");

    // Movie
    if (!selectedMovie && movieId) {
      const m = movies.find((x) => x._id === movieId);
      if (m && (!selectedDate || (m.schedule || {})[selectedDate])) {
        setSelectedMovie(m);
      }
    }

    // Time
    if (selectedMovie && !selectedTime && time && selectedDate) {
      const times = ((selectedMovie.schedule || {})[selectedDate] || []).map(
        (t) => t.time
      );
      if (times.includes(time)) setSelectedTime(time);
    }

    // Seat
    if (selectedTime && !selectedSeatType && seat) {
      const st = ((selectedMovie?.schedule || {})[selectedDate] || []).find(
        (x) => x.time === selectedTime
      );
      const cat = st?.categories.find(
        (c) => c.name.toLowerCase() === seat.toLowerCase()
      );
      if (cat) setSelectedSeatType(cat);
    }

    // Qty
    if (qty) {
      const n = Math.max(1, Math.min(10, parseInt(qty, 10) || 1));
      if (n !== ticketQuantity) setTicketQuantity(n);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [movies, selectedDate, selectedMovie, selectedTime, searchParams]);

  const moviesOnSelectedDate = useMemo(() => {
    if (!selectedDate) return [] as MovieDoc[];
    return movies.filter((m) => (m.schedule || {})[selectedDate]?.length > 0);
  }, [movies, selectedDate]);

  const showTimesForMovieAndDate = useMemo<ShowTime[]>(() => {
    if (!selectedMovie || !selectedDate) return [];
    const sched = selectedMovie.schedule || {};
    return (sched[selectedDate] || [])
      .slice()
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedMovie, selectedDate]);

  const selectedShowTime = useMemo(() => {
    if (!selectedTime) return null as ShowTime | null;
    return (
      showTimesForMovieAndDate.find((st) => st.time === selectedTime) || null
    );
  }, [showTimesForMovieAndDate, selectedTime]);

  const totalAmount = selectedSeatType
    ? selectedSeatType.price * ticketQuantity
    : 0;

  const handlePurchase = async () => {
    if (!selectedMovie || !selectedDate || !selectedTime || !selectedSeatType) return;
    if (!customerInfo.name || !customerInfo.mobile || !customerInfo.email) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/payments/bkash/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          movieId: selectedMovie._id,
          movieTitle: selectedMovie.title,
          showDate: selectedDate,
          showTime: selectedTime,
          seatType: selectedSeatType.name,
          quantity: ticketQuantity,
          unitPrice: selectedSeatType.price,
          totalAmount,
          customerName: customerInfo.name,
          customerMobile: customerInfo.mobile,
          customerEmail: customerInfo.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to initiate payment");
      if (data.redirectURL) {
        window.location.href = data.redirectURL;
      } else {
        throw new Error("Missing redirectURL from payment response");
      }
    } catch (e: any) {
      alert(e?.message || "Failed to start payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCalendarDateSelect = (date: Date) => {
    const key = toDateKey(date);
    setSelectedDate(key);
    setShowCalendar(false);
    pushParams({ selectedDate: key, movieId: null, time: null, seat: null });
    // Reset subsequent selections when date changes
    setSelectedMovie(null);
    setSelectedTime("");
    setSelectedSeatType(null);
  };

  const renderCalendar = () => {
    const today = new Date();
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: React.ReactElement[] = [];
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
      const isPast =
        date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
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
    <div className="min-h-screen bg-[#DCD7C9] py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2C3930] text-center mb-8">
          Buy Ticket
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Side - Booking Form */}
          <div className="space-y-8">
            {/* Date Selection */}
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-[#2C3930] flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Select Date
                </h2>
                <button
                  onClick={() => setShowCalendar(true)}
                  className="p-2 hover:bg-[#A2785C]/10 rounded-full transition-colors"
                  title="Select other dates"
                >
                  <Calendar size={20} className="text-[#A2785C]" />
                </button>
              </div>

              {availableDates.length === 0 ? (
                <div className="text-sm text-[#3F4F44]">
                  No schedules available.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {availableDates.map((d) => (
                    <button
                      key={d.fullDate}
                      onClick={() => {
                        setSelectedDate(d.fullDate);
                        pushParams({
                          selectedDate: d.fullDate,
                          movieId: null,
                          time: null,
                          seat: null,
                        });
                        // Reset subsequent selections when date changes
                        setSelectedMovie(null);
                        setSelectedTime("");
                        setSelectedSeatType(null);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                        selectedDate === d.fullDate
                          ? "border-[#A2785C] bg-[#A2785C] text-[#DCD7C9]"
                          : "border-[#3F4F44]/20 hover:border-[#A2785C] text-[#2C3930]"
                      }`}
                    >
                      <div className="text-sm font-medium">{d.day}</div>
                      <div className="text-lg font-bold">{d.date}</div>
                      <div className="text-xs">{d.month}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Movie Selection */}
            {selectedDate && (
              <div className="bg-white rounded-lg p-6 shadow-lg animate-in slide-in-from-bottom duration-500">
                <h2 className="text-xl font-semibold text-[#2C3930] mb-4">
                  Select Movie
                </h2>
                {moviesOnSelectedDate.length === 0 ? (
                  <div className="text-sm text-[#3F4F44]">
                    No movies scheduled for this date.
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-4">
                    {moviesOnSelectedDate.map((movie) => (
                      <button
                        key={movie._id}
                        onClick={() => {
                          setSelectedMovie(movie);
                          pushParams({
                            movieId: movie._id,
                            time: null,
                            seat: null,
                          });
                          setSelectedTime("");
                          setSelectedSeatType(null);
                        }}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                          selectedMovie?._id === movie._id
                            ? "border-[#A2785C] bg-[#A2785C]/10"
                            : "border-[#3F4F44]/20 hover:border-[#A2785C]"
                        }`}
                      >
                        <Image
                          src={movie.poster || "/placeholder.svg"}
                          alt={movie.title}
                          width={150}
                          height={200}
                          className="w-full h-32 object-cover rounded mb-2"
                          unoptimized
                        />
                        <h3 className="font-semibold text-[#2C3930] text-sm">
                          {movie.title}
                        </h3>
                        <p className="text-xs text-[#3F4F44] mt-1">
                          {(movie.genres || []).join(", ")}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Show Time Selection */}
            {selectedMovie && (
              <div className="bg-white rounded-lg p-6 shadow-lg animate-in slide-in-from-bottom duration-500">
                <h2 className="text-xl font-semibold text-[#2C3930] mb-4 flex items-center">
                  <Clock className="mr-2" size={20} />
                  Select Show Time
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {showTimesForMovieAndDate.map((st) => (
                    <button
                      key={st.time}
                      onClick={() => {
                        setSelectedTime(st.time);
                        pushParams({ time: st.time, seat: null });
                        setSelectedSeatType(null);
                      }}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                        selectedTime === st.time
                          ? "border-[#A2785C] bg-[#A2785C] text-[#DCD7C9]"
                          : "border-[#3F4F44]/20 hover:border-[#A2785C] text-[#2C3930]"
                      }`}
                    >
                      {st.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seat Type Selection */}
            {selectedTime && selectedShowTime && (
              <div className="bg-white rounded-lg p-6 shadow-lg animate-in slide-in-from-bottom duration-500">
                <h2 className="text-xl font-semibold text-[#2C3930] mb-4">
                  Select Seat Type
                </h2>
                <div className="space-y-3">
                  {selectedShowTime.categories.map((seat) => (
                    <button
                      key={seat.name}
                      onClick={() => {
                        setSelectedSeatType(seat);
                        pushParams({ seat: seat.name });
                      }}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                        selectedSeatType?.name === seat.name
                          ? "border-[#A2785C] bg-[#A2785C]/10"
                          : "border-[#3F4F44]/20 hover:border-[#A2785C]"
                      }`}
                    >
                      <div className="font-semibold text-[#2C3930]">
                        {seat.name}
                      </div>
                      <div className="text-sm text-[#3F4F44]">
                        ৳{seat.price}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Ticket Quantity */}
            {selectedSeatType && (
              <div className="bg-white rounded-lg p-6 shadow-lg animate-in slide-in-from-bottom duration-500">
                <h2 className="text-xl font-semibold text-[#2C3930] mb-4 flex items-center">
                  <Users className="mr-2" size={20} />
                  Number of Tickets
                </h2>
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={() => {
                      const n = Math.max(1, ticketQuantity - 1);
                      setTicketQuantity(n);
                      pushParams({ qty: String(n) });
                    }}
                    className="w-12 h-12 rounded-full bg-[#3F4F44] text-[#DCD7C9] flex items-center justify-center hover:bg-[#2C3930] transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-2xl font-bold text-[#2C3930] w-16 text-center">
                    {ticketQuantity}
                  </span>
                  <button
                    onClick={() => {
                      const n = Math.min(10, ticketQuantity + 1);
                      setTicketQuantity(n);
                      pushParams({ qty: String(n) });
                    }}
                    className="w-12 h-12 rounded-full bg-[#3F4F44] text-[#DCD7C9] flex items-center justify-center hover:bg-[#2C3930] transition-colors"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Side - Ticket Summary */}
          <div className="lg:sticky lg:top-8 h-fit">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-xl font-semibold text-[#2C3930] mb-6 text-center">
                Ticket Summary
              </h2>

              {selectedMovie && (
                <div className="mb-6">
                  <Image
                    src={selectedMovie.poster || "/placeholder.svg"}
                    alt={selectedMovie.title}
                    width={300}
                    height={150}
                    className="w-full h-32 object-cover rounded mb-3"
                    unoptimized
                  />
                  <h3 className="font-bold text-[#2C3930]">
                    {selectedMovie.title}
                  </h3>
                  <p className="text-sm text-[#3F4F44]">
                    {(selectedMovie.genres || []).join(", ")}
                  </p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {selectedDate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#3F4F44]">
                      <Calendar size={16} className="mr-2" />
                      Show Date
                    </div>
                    <span className="font-semibold text-[#2C3930]">
                      {selectedDate}
                    </span>
                  </div>
                )}

                {selectedTime && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#3F4F44]">
                      <Clock size={16} className="mr-2" />
                      Show Time
                    </div>
                    <span className="font-semibold text-[#2C3930]">
                      {selectedTime}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-[#3F4F44]">
                    <MapPin size={16} className="mr-2" />
                    Hall Name
                  </div>
                  <span className="font-semibold text-[#2C3930]">
                    Ananda Cinema Hall
                  </span>
                </div>

                {selectedSeatType && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#3F4F44]">
                      <Users size={16} className="mr-2" />
                      Seat Type
                    </div>
                    <span className="font-semibold text-[#2C3930]">
                      {selectedSeatType.name}
                    </span>
                  </div>
                )}

                {ticketQuantity > 0 && selectedSeatType && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#3F4F44]">
                      <Users size={16} className="mr-2" />
                      Ticket Quantity
                    </div>
                    <span className="font-semibold text-[#2C3930]">
                      {ticketQuantity}
                    </span>
                  </div>
                )}

                {totalAmount > 0 && (
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center text-[#3F4F44]">
                      <CreditCard size={16} className="mr-2" />
                      Total Amount
                    </div>
                    <span className="font-bold text-[#A2785C] text-lg">
                      ৳{totalAmount.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              {totalAmount > 0 && (
                <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
                  <h3 className="font-semibold text-[#2C3930] mb-3">
                    Ticket For
                  </h3>
                  <Input
                    placeholder="Full Name"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                    className="border-[#3F4F44]/20 focus:border-[#A2785C]"
                  />
                  <Input
                    placeholder="Mobile Number"
                    value={customerInfo.mobile}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        mobile: e.target.value,
                      })
                    }
                    className="border-[#3F4F44]/20 focus:border-[#A2785C]"
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        email: e.target.value,
                      })
                    }
                    className="border-[#3F4F44]/20 focus:border-[#A2785C]"
                  />

                  <Button
                    onClick={handlePurchase}
                    disabled={
                      isSubmitting ||
                      !customerInfo.name ||
                      !customerInfo.mobile ||
                      !customerInfo.email
                    }
                    className="w-full bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9] py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Redirecting to bKash..." : "Purchase Ticket"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
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
    </div>
  );
}
