"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { Calendar, Clock, MapPin, Users, CreditCard, Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const movies = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    genre: "Sci-Fi, Adventure",
    poster: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 2,
    title: "Top Gun: Maverick",
    genre: "Action, Drama",
    poster: "/placeholder.svg?height=200&width=150",
  },
  {
    id: 3,
    title: "Black Panther: Wakanda Forever",
    genre: "Action, Adventure",
    poster: "/placeholder.svg?height=200&width=150",
  },
]

const showTimes = ["1:00 PM", "4:00 PM", "7:00 PM"]

const seatTypes = [
  { type: "Front", price: 350, fee: 17.5 },
  { type: "Rear", price: 450, fee: 22.5 },
]

export default function GetTicketPage() {
  const searchParams = useSearchParams()
  const [availableDates, setAvailableDates] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState<string>("")
  const [selectedMovie, setSelectedMovie] = useState<any>(null)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [selectedSeatType, setSelectedSeatType] = useState<any>(null)
  const [ticketQuantity, setTicketQuantity] = useState<number>(1)
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    mobile: "",
    email: "",
  })
  const [showCalendar, setShowCalendar] = useState(false)
  const [calendarDate, setCalendarDate] = useState(new Date())

  // Generate dynamic dates (today + next 4 days) - only run once
  useEffect(() => {
    const generateDates = () => {
      const dates = []
      const today = new Date()

      for (let i = 0; i < 5; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)

        const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

        dates.push({
          day: dayNames[date.getDay()],
          date: date.getDate().toString().padStart(2, "0"),
          month: monthNames[date.getMonth()],
          fullDate: date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }),
          dateObj: date,
        })
      }

      setAvailableDates(dates)
    }

    generateDates()
  }, []) // Empty dependency array - only run once

  // Handle pre-selected date from URL params - separate useEffect
  useEffect(() => {
    const preSelectedDate = searchParams.get("selectedDate")
    if (preSelectedDate && preSelectedDate !== selectedDate) {
      setSelectedDate(preSelectedDate)
    }
  }, [searchParams.get("selectedDate")]) // Only depend on the actual parameter value

  const totalAmount = selectedSeatType ? (selectedSeatType.price + selectedSeatType.fee) * ticketQuantity : 0

  const handlePurchase = () => {
    window.location.href = "/booking-confirmation"
  }

  const handleCalendarDateSelect = (date: Date) => {
    const selectedDateString = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    })

    setSelectedDate(selectedDateString)
    setShowCalendar(false)

    // Reset subsequent selections when date changes
    setSelectedMovie(null)
    setSelectedTime("")
    setSelectedSeatType(null)
  }

  const renderCalendar = () => {
    const today = new Date()
    const year = calendarDate.getFullYear()
    const month = calendarDate.getMonth()

    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
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
    ]

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      const isToday = date.toDateString() === today.toDateString()
      const isPast = date < today
      const isDisabled = isPast

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
        </button>,
      )
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
            <div key={day} className="p-2 text-xs font-medium text-[#3F4F44] text-center">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#DCD7C9] py-8">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#2C3930] text-center mb-8">Buy Ticket</h1>

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

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {availableDates.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedDate(date.fullDate)
                      // Reset subsequent selections when date changes
                      setSelectedMovie(null)
                      setSelectedTime("")
                      setSelectedSeatType(null)
                    }}
                    className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                      selectedDate === date.fullDate
                        ? "border-[#A2785C] bg-[#A2785C] text-[#DCD7C9]"
                        : "border-[#3F4F44]/20 hover:border-[#A2785C] text-[#2C3930]"
                    }`}
                  >
                    <div className="text-sm font-medium">{date.day}</div>
                    <div className="text-lg font-bold">{date.date}</div>
                    <div className="text-xs">{date.month}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Movie Selection */}
            {selectedDate && (
              <div className="bg-white rounded-lg p-6 shadow-lg animate-in slide-in-from-bottom duration-500">
                <h2 className="text-xl font-semibold text-[#2C3930] mb-4">Select Movie</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {movies.map((movie) => (
                    <button
                      key={movie.id}
                      onClick={() => {
                        setSelectedMovie(movie)
                        // Reset subsequent selections when movie changes
                        setSelectedTime("")
                        setSelectedSeatType(null)
                      }}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        selectedMovie?.id === movie.id
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
                      />
                      <h3 className="font-semibold text-[#2C3930] text-sm">{movie.title}</h3>
                      <p className="text-xs text-[#3F4F44] mt-1">{movie.genre}</p>
                    </button>
                  ))}
                </div>
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
                  {showTimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => {
                        setSelectedTime(time)
                        // Reset subsequent selections when time changes
                        setSelectedSeatType(null)
                      }}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                        selectedTime === time
                          ? "border-[#A2785C] bg-[#A2785C] text-[#DCD7C9]"
                          : "border-[#3F4F44]/20 hover:border-[#A2785C] text-[#2C3930]"
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Seat Type Selection */}
            {selectedTime && (
              <div className="bg-white rounded-lg p-6 shadow-lg animate-in slide-in-from-bottom duration-500">
                <h2 className="text-xl font-semibold text-[#2C3930] mb-4">Select Seat Type</h2>
                <div className="space-y-3">
                  {seatTypes.map((seat) => (
                    <button
                      key={seat.type}
                      onClick={() => setSelectedSeatType(seat)}
                      className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                        selectedSeatType?.type === seat.type
                          ? "border-[#A2785C] bg-[#A2785C]/10"
                          : "border-[#3F4F44]/20 hover:border-[#A2785C]"
                      }`}
                    >
                      <div className="font-semibold text-[#2C3930]">{seat.type}</div>
                      <div className="text-sm text-[#3F4F44]">
                        ৳{seat.price} + (৳{seat.fee} Fee)
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
                    onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                    className="w-12 h-12 rounded-full bg-[#3F4F44] text-[#DCD7C9] flex items-center justify-center hover:bg-[#2C3930] transition-colors"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="text-2xl font-bold text-[#2C3930] w-16 text-center">{ticketQuantity}</span>
                  <button
                    onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
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
              <h2 className="text-xl font-semibold text-[#2C3930] mb-6 text-center">Ticket Summary</h2>

              {selectedMovie && (
                <div className="mb-6">
                  <Image
                    src={selectedMovie.poster || "/placeholder.svg"}
                    alt={selectedMovie.title}
                    width={300}
                    height={150}
                    className="w-full h-32 object-cover rounded mb-3"
                  />
                  <h3 className="font-bold text-[#2C3930]">{selectedMovie.title}</h3>
                  <p className="text-sm text-[#3F4F44]">{selectedMovie.genre}</p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {selectedDate && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#3F4F44]">
                      <Calendar size={16} className="mr-2" />
                      Show Date
                    </div>
                    <span className="font-semibold text-[#2C3930]">{selectedDate}</span>
                  </div>
                )}

                {selectedTime && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#3F4F44]">
                      <Clock size={16} className="mr-2" />
                      Show Time
                    </div>
                    <span className="font-semibold text-[#2C3930]">{selectedTime}</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center text-[#3F4F44]">
                    <MapPin size={16} className="mr-2" />
                    Hall Name
                  </div>
                  <span className="font-semibold text-[#2C3930]">Ananda Cinema Hall</span>
                </div>

                {selectedSeatType && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#3F4F44]">
                      <Users size={16} className="mr-2" />
                      Seat Type
                    </div>
                    <span className="font-semibold text-[#2C3930]">{selectedSeatType.type}</span>
                  </div>
                )}

                {ticketQuantity > 0 && selectedSeatType && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#3F4F44]">
                      <Users size={16} className="mr-2" />
                      Ticket Quantity
                    </div>
                    <span className="font-semibold text-[#2C3930]">{ticketQuantity}</span>
                  </div>
                )}

                {totalAmount > 0 && (
                  <div className="flex items-center justify-between border-t pt-3">
                    <div className="flex items-center text-[#3F4F44]">
                      <CreditCard size={16} className="mr-2" />
                      Total Amount
                    </div>
                    <span className="font-bold text-[#A2785C] text-lg">৳{totalAmount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Customer Information */}
              {totalAmount > 0 && (
                <div className="space-y-4 animate-in slide-in-from-bottom duration-500">
                  <h3 className="font-semibold text-[#2C3930] mb-3">Ticket For</h3>
                  <Input
                    placeholder="Full Name"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="border-[#3F4F44]/20 focus:border-[#A2785C]"
                  />
                  <Input
                    placeholder="Mobile Number"
                    value={customerInfo.mobile}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, mobile: e.target.value })}
                    className="border-[#3F4F44]/20 focus:border-[#A2785C]"
                  />
                  <Input
                    placeholder="Email Address"
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="border-[#3F4F44]/20 focus:border-[#A2785C]"
                  />

                  <Button
                    onClick={handlePurchase}
                    disabled={!customerInfo.name || !customerInfo.mobile || !customerInfo.email}
                    className="w-full bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9] py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Purchase Ticket
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
  )
}
