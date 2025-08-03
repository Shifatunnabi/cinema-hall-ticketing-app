"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Calendar, Clock, CheckCircle, XCircle, Send, FileText, Phone, Mail, User, Ticket, Film } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminLayout from "@/components/admin-layout"

// Comprehensive mock data structure for tickets with 3 movies and 3 showtimes each
const mockTicketData: { [key: string]: any } = {}

// Generate mock data for the next 7 days
const generateMockData = () => {
  const today = new Date()

  for (let i = 0; i < 7; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    const dateKey = date.toISOString().split("T")[0]

    mockTicketData[dateKey] = {
      "Avatar: The Way of Water": {
        "1:00 PM": [
          {
            id: `TKT${String(i * 10 + 1).padStart(3, "0")}`,
            customerName: "John Doe",
            phone: "+880 1712-345678",
            email: "john.doe@email.com",
            movieName: "Avatar: The Way of Water",
            ticketId: `AC${String(1234 + i * 10 + 1).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 1).padStart(3, "0")}.pdf`,
            emailSent: i % 2 === 0,
          },
          {
            id: `TKT${String(i * 10 + 2).padStart(3, "0")}`,
            customerName: "Jane Smith",
            phone: "+880 1812-345679",
            email: "jane.smith@email.com",
            movieName: "Avatar: The Way of Water",
            ticketId: `AC${String(1234 + i * 10 + 2).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 2).padStart(3, "0")}.pdf`,
            emailSent: i % 3 !== 0,
          },
          {
            id: `TKT${String(i * 10 + 3).padStart(3, "0")}`,
            customerName: "Mike Johnson",
            phone: "+880 1912-345680",
            email: "mike.johnson@email.com",
            movieName: "Avatar: The Way of Water",
            ticketId: `AC${String(1234 + i * 10 + 3).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 3).padStart(3, "0")}.pdf`,
            emailSent: true,
          },
        ],
        "4:00 PM": [
          {
            id: `TKT${String(i * 10 + 4).padStart(3, "0")}`,
            customerName: "Sarah Wilson",
            phone: "+880 1612-345681",
            email: "sarah.wilson@email.com",
            movieName: "Avatar: The Way of Water",
            ticketId: `AC${String(1234 + i * 10 + 4).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 4).padStart(3, "0")}.pdf`,
            emailSent: i % 2 === 1,
          },
          {
            id: `TKT${String(i * 10 + 5).padStart(3, "0")}`,
            customerName: "David Brown",
            phone: "+880 1512-345682",
            email: "david.brown@email.com",
            movieName: "Avatar: The Way of Water",
            ticketId: `AC${String(1234 + i * 10 + 5).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 5).padStart(3, "0")}.pdf`,
            emailSent: true,
          },
        ],
        "7:00 PM": [
          {
            id: `TKT${String(i * 10 + 6).padStart(3, "0")}`,
            customerName: "Lisa Davis",
            phone: "+880 1412-345683",
            email: "lisa.davis@email.com",
            movieName: "Avatar: The Way of Water",
            ticketId: `AC${String(1234 + i * 10 + 6).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 6).padStart(3, "0")}.pdf`,
            emailSent: i % 3 === 0,
          },
          {
            id: `TKT${String(i * 10 + 7).padStart(3, "0")}`,
            customerName: "Tom Anderson",
            phone: "+880 1312-345684",
            email: "tom.anderson@email.com",
            movieName: "Avatar: The Way of Water",
            ticketId: `AC${String(1234 + i * 10 + 7).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 7).padStart(3, "0")}.pdf`,
            emailSent: false,
          },
        ],
      },
      "Top Gun: Maverick": {
        "2:00 PM": [
          {
            id: `TKT${String(i * 10 + 8).padStart(3, "0")}`,
            customerName: "Peter Parker",
            phone: "+880 1212-345685",
            email: "peter.parker@email.com",
            movieName: "Top Gun: Maverick",
            ticketId: `AC${String(1234 + i * 10 + 8).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 8).padStart(3, "0")}.pdf`,
            emailSent: true,
          },
          {
            id: `TKT${String(i * 10 + 9).padStart(3, "0")}`,
            customerName: "Mary Jane Watson",
            phone: "+880 1112-345686",
            email: "mary.jane@email.com",
            movieName: "Top Gun: Maverick",
            ticketId: `AC${String(1234 + i * 10 + 9).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 9).padStart(3, "0")}.pdf`,
            emailSent: i % 2 === 0,
          },
        ],
        "5:00 PM": [
          {
            id: `TKT${String(i * 10 + 10).padStart(3, "0")}`,
            customerName: "Tony Stark",
            phone: "+880 1012-345687",
            email: "tony.stark@email.com",
            movieName: "Top Gun: Maverick",
            ticketId: `AC${String(1234 + i * 10 + 10).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 10).padStart(3, "0")}.pdf`,
            emailSent: false,
          },
        ],
        "8:00 PM": [
          {
            id: `TKT${String(i * 10 + 11).padStart(3, "0")}`,
            customerName: "Bruce Wayne",
            phone: "+880 1712-345688",
            email: "bruce.wayne@email.com",
            movieName: "Top Gun: Maverick",
            ticketId: `AC${String(1234 + i * 10 + 11).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 11).padStart(3, "0")}.pdf`,
            emailSent: true,
          },
        ],
      },
      "Black Panther: Wakanda Forever": {
        "3:00 PM": [
          {
            id: `TKT${String(i * 10 + 12).padStart(3, "0")}`,
            customerName: "T'Challa Udaku",
            phone: "+880 1612-345689",
            email: "tchalla@email.com",
            movieName: "Black Panther: Wakanda Forever",
            ticketId: `AC${String(1234 + i * 10 + 12).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 12).padStart(3, "0")}.pdf`,
            emailSent: i % 3 === 1,
          },
          {
            id: `TKT${String(i * 10 + 13).padStart(3, "0")}`,
            customerName: "Shuri Udaku",
            phone: "+880 1512-345690",
            email: "shuri@email.com",
            movieName: "Black Panther: Wakanda Forever",
            ticketId: `AC${String(1234 + i * 10 + 13).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 13).padStart(3, "0")}.pdf`,
            emailSent: false,
          },
        ],
        "6:00 PM": [
          {
            id: `TKT${String(i * 10 + 14).padStart(3, "0")}`,
            customerName: "Okoye General",
            phone: "+880 1412-345691",
            email: "okoye@email.com",
            movieName: "Black Panther: Wakanda Forever",
            ticketId: `AC${String(1234 + i * 10 + 14).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 14).padStart(3, "0")}.pdf`,
            emailSent: true,
          },
        ],
        "9:00 PM": [
          {
            id: `TKT${String(i * 10 + 15).padStart(3, "0")}`,
            customerName: "M'Baku Jabari",
            phone: "+880 1312-345692",
            email: "mbaku@email.com",
            movieName: "Black Panther: Wakanda Forever",
            ticketId: `AC${String(1234 + i * 10 + 15).padStart(6, "0")}`,
            pdfLink: `/tickets/TKT${String(i * 10 + 15).padStart(3, "0")}.pdf`,
            emailSent: i % 2 === 1,
          },
        ],
      },
    }
  }
}

// Generate the mock data when the module loads
generateMockData()

export default function TicketManagement() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedMovie, setSelectedMovie] = useState("")
  const [selectedShowtime, setSelectedShowtime] = useState("")
  const [dates, setDates] = useState<string[]>([])
  const [availableMovies, setAvailableMovies] = useState<string[]>([])
  const [availableShowtimes, setAvailableShowtimes] = useState<string[]>([])
  const [reportData, setReportData] = useState<any[]>([])
  const [showReport, setShowReport] = useState(false)

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth")
      if (adminAuth !== "authenticated") {
        router.push("/admin/login")
        return
      }

      // Generate next 7 days including today
      const today = new Date()
      const dateArray = []
      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        dateArray.push(date.toISOString().split("T")[0])
      }
      setDates(dateArray)

      // Regenerate mock data to ensure it matches current dates
      generateMockData()
    }

    checkAuth()
  }, [router])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()

    return {
      display: date.toLocaleDateString("en", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      isToday,
    }
  }

  const handleDateChange = (date: string) => {
    setSelectedDate(date)
    setSelectedMovie("")
    setSelectedShowtime("")
    setShowReport(false)

    // Get available movies for selected date
    const dateData = mockTicketData[date as keyof typeof mockTicketData]
    if (dateData) {
      setAvailableMovies(Object.keys(dateData))
    } else {
      setAvailableMovies([])
    }
    setAvailableShowtimes([])
  }

  const handleMovieChange = (movie: string) => {
    setSelectedMovie(movie)
    setSelectedShowtime("")
    setShowReport(false)

    // Get available showtimes for selected movie and date
    const dateData = mockTicketData[selectedDate as keyof typeof mockTicketData]
    if (dateData && dateData[movie as keyof typeof dateData]) {
      setAvailableShowtimes(Object.keys(dateData[movie as keyof typeof dateData]))
    } else {
      setAvailableShowtimes([])
    }
  }

  const handleShowtimeChange = (showtime: string) => {
    setSelectedShowtime(showtime)
    setShowReport(false)
  }

  const generateReport = () => {
    if (!selectedDate || !selectedMovie || !selectedShowtime) {
      alert("Please select date, movie, and showtime first!")
      return
    }

    const dateData = mockTicketData[selectedDate as keyof typeof mockTicketData]
    if (dateData && dateData[selectedMovie as keyof typeof dateData]) {
      const movieData = dateData[selectedMovie as keyof typeof dateData]
      const showtimeData = movieData[selectedShowtime as keyof typeof movieData]

      if (showtimeData) {
        setReportData(showtimeData)
        setShowReport(true)
      } else {
        setReportData([])
        setShowReport(true)
      }
    } else {
      setReportData([])
      setShowReport(true)
    }
  }

  const handleResendEmail = (ticketId: string) => {
    // Update the email status for the ticket
    const updatedData = reportData.map((ticket) => (ticket.id === ticketId ? { ...ticket, emailSent: true } : ticket))
    setReportData(updatedData)
    alert(`Email resent successfully for ticket ID: ${ticketId}`)
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2C3930] mb-2">Ticket Management</h1>
          <p className="text-[#3F4F44]">Generate ticket reports by selecting date, movie, and showtime.</p>
        </div>

        {/* Filter Form */}
        <Card className="bg-white shadow-lg mb-8">
          <CardHeader>
            <CardTitle className="flex items-center text-[#2C3930]">
              <Ticket className="mr-2" size={20} />
              Generate Ticket Report
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {/* Date Selection */}
              <div>
                <label className="block text-[#2C3930] font-medium mb-2">
                  <Calendar className="inline mr-2" size={16} />
                  Select Date *
                </label>
                <select
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full p-3 border border-[#3F4F44]/20 rounded-lg focus:border-[#A2785C] focus:outline-none bg-white"
                  required
                >
                  <option value="">Choose a date</option>
                  {dates.map((date) => {
                    const { display, isToday } = formatDate(date)
                    return (
                      <option key={date} value={date}>
                        {display} {isToday ? "(Today)" : ""}
                      </option>
                    )
                  })}
                </select>
              </div>

              {/* Movie Selection */}
              <div>
                <label className="block text-[#2C3930] font-medium mb-2">
                  <Film className="inline mr-2" size={16} />
                  Select Movie *
                </label>
                <select
                  value={selectedMovie}
                  onChange={(e) => handleMovieChange(e.target.value)}
                  disabled={!selectedDate}
                  className="w-full p-3 border border-[#3F4F44]/20 rounded-lg focus:border-[#A2785C] focus:outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">Choose a movie</option>
                  {availableMovies.map((movie) => (
                    <option key={movie} value={movie}>
                      {movie}
                    </option>
                  ))}
                </select>
              </div>

              {/* Showtime Selection */}
              <div>
                <label className="block text-[#2C3930] font-medium mb-2">
                  <Clock className="inline mr-2" size={16} />
                  Select Showtime *
                </label>
                <select
                  value={selectedShowtime}
                  onChange={(e) => handleShowtimeChange(e.target.value)}
                  disabled={!selectedMovie}
                  className="w-full p-3 border border-[#3F4F44]/20 rounded-lg focus:border-[#A2785C] focus:outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">Choose showtime</option>
                  {availableShowtimes.map((showtime) => (
                    <option key={showtime} value={showtime}>
                      {showtime}
                    </option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <div className="flex items-end">
                <Button
                  onClick={generateReport}
                  disabled={!selectedDate || !selectedMovie || !selectedShowtime}
                  className="w-full bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9] py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Generate Report
                </Button>
              </div>
            </div>

            {/* Selected Info Display */}
            {(selectedDate || selectedMovie || selectedShowtime) && (
              <div className="bg-[#A2785C]/10 p-4 rounded-lg">
                <h4 className="font-semibold text-[#2C3930] mb-2">Selected Filters:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-[#3F4F44]">Date: </span>
                    <span className="font-medium text-[#2C3930]">
                      {selectedDate ? formatDate(selectedDate).display : "Not selected"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[#3F4F44]">Movie: </span>
                    <span className="font-medium text-[#2C3930]">{selectedMovie || "Not selected"}</span>
                  </div>
                  <div>
                    <span className="text-[#3F4F44]">Showtime: </span>
                    <span className="font-medium text-[#2C3930]">{selectedShowtime || "Not selected"}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Table */}
        {showReport && (
          <Card className="bg-white shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-[#2C3930]">
                <div className="flex items-center">
                  <FileText className="mr-2" size={20} />
                  Ticket Report
                </div>
                <div className="text-sm font-normal text-[#3F4F44]">Total Tickets: {reportData.length}</div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {reportData.length > 0 ? (
                <>
                  {/* Summary Stats */}
                  <div className="bg-[#A2785C]/10 p-4 rounded-lg mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-sm text-[#3F4F44]">Total Tickets</p>
                        <p className="text-xl md:text-2xl font-bold text-[#2C3930]">{reportData.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-[#3F4F44]">Emails Sent</p>
                        <p className="text-xl md:text-2xl font-bold text-green-600">
                          {reportData.filter((ticket) => ticket.emailSent).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[#3F4F44]">Email Issues</p>
                        <p className="text-xl md:text-2xl font-bold text-red-600">
                          {reportData.filter((ticket) => !ticket.emailSent).length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-[#3F4F44]">Success Rate</p>
                        <p className="text-xl md:text-2xl font-bold text-[#A2785C]">
                          {Math.round(
                            (reportData.filter((ticket) => ticket.emailSent).length / reportData.length) * 100,
                          )}
                          %
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse border border-[#3F4F44]/20">
                      <thead>
                        <tr className="bg-[#3F4F44]/10">
                          <th className="border border-[#3F4F44]/20 p-3 text-left">
                            <div className="flex items-center">
                              <User className="mr-2" size={16} />
                              Customer Details
                            </div>
                          </th>
                          <th className="border border-[#3F4F44]/20 p-3 text-left">Movie Name</th>
                          <th className="border border-[#3F4F44]/20 p-3 text-left">Ticket ID</th>
                          <th className="border border-[#3F4F44]/20 p-3 text-left">PDF Link</th>
                          <th className="border border-[#3F4F44]/20 p-3 text-left">Email Status</th>
                          <th className="border border-[#3F4F44]/20 p-3 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-[#3F4F44]/5">
                            <td className="border border-[#3F4F44]/20 p-3">
                              <div className="space-y-1">
                                <div className="flex items-center">
                                  <User className="mr-2" size={14} />
                                  <span className="font-semibold text-[#2C3930]">{ticket.customerName}</span>
                                </div>
                                <div className="flex items-center text-sm text-[#3F4F44]">
                                  <Phone className="mr-2" size={14} />
                                  <span>{ticket.phone}</span>
                                </div>
                                <div className="flex items-center text-sm text-[#3F4F44]">
                                  <Mail className="mr-2" size={14} />
                                  <span>{ticket.email}</span>
                                </div>
                              </div>
                            </td>
                            <td className="border border-[#3F4F44]/20 p-3">
                              <span className="font-medium text-[#2C3930]">{ticket.movieName}</span>
                            </td>
                            <td className="border border-[#3F4F44]/20 p-3">
                              <span className="font-mono text-[#A2785C] font-semibold">{ticket.ticketId}</span>
                            </td>
                            <td className="border border-[#3F4F44]/20 p-3">
                              <a
                                href={ticket.pdfLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                              >
                                <FileText className="mr-1" size={14} />
                                View PDF
                              </a>
                            </td>
                            <td className="border border-[#3F4F44]/20 p-3">
                              <div className="flex items-center">
                                {ticket.emailSent ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                                    <span className="text-green-600 text-sm font-medium">Success</span>
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="h-4 w-4 text-red-500 mr-2" />
                                    <span className="text-red-600 text-sm font-medium">Failure</span>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="border border-[#3F4F44]/20 p-3">
                              {!ticket.emailSent && (
                                <Button
                                  size="sm"
                                  onClick={() => handleResendEmail(ticket.id)}
                                  className="bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9]"
                                >
                                  <Send size={14} className="mr-1" />
                                  Force Send
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden space-y-4">
                    {reportData.map((ticket) => (
                      <div key={ticket.id} className="border border-[#3F4F44]/20 rounded-lg p-4 bg-white">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-[#2C3930]">{ticket.customerName}</h4>
                          <div className="flex items-center">
                            {ticket.emailSent ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-green-600 text-xs font-medium">Success</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-red-500 mr-1" />
                                <span className="text-red-600 text-xs font-medium">Failure</span>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex items-center text-[#3F4F44]">
                            <Phone className="mr-2" size={14} />
                            <span>{ticket.phone}</span>
                          </div>
                          <div className="flex items-center text-[#3F4F44]">
                            <Mail className="mr-2" size={14} />
                            <span>{ticket.email}</span>
                          </div>
                          <div className="flex items-center text-[#3F4F44]">
                            <Film className="mr-2" size={14} />
                            <span>{ticket.movieName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[#3F4F44]">Ticket ID:</span>
                            <span className="font-mono text-[#A2785C] font-semibold">{ticket.ticketId}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#3F4F44]/10">
                          <a
                            href={ticket.pdfLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-sm"
                          >
                            <FileText className="mr-1" size={14} />
                            View PDF
                          </a>

                          {!ticket.emailSent && (
                            <Button
                              size="sm"
                              onClick={() => handleResendEmail(ticket.id)}
                              className="bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9]"
                            >
                              <Send size={14} className="mr-1" />
                              Force Send
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Ticket className="mx-auto h-16 w-16 text-[#3F4F44]/50 mb-4" />
                  <h3 className="text-lg font-semibold text-[#2C3930] mb-2">No Tickets Found</h3>
                  <p className="text-[#3F4F44]">
                    No tickets were found for the selected date, movie, and showtime combination.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}
