"use client"

import { Suspense, useState, useEffect } from "react"
import { CheckCircle, Download, Mail, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"

function BookingConfirmationContent() {
  const sp = useSearchParams()
  const bookingId = sp.get("bookingId")
  const [isGeneratingTicket, setIsGeneratingTicket] = useState(true)
  const [ticketGenerated, setTicketGenerated] = useState(false)
  const [booking, setBooking] = useState<any | null>(null)

  // Mock booking data - in real app, this would come from the booking process
  const mock = {
    bookingId: "AC" + Math.random().toString(36).substr(2, 8).toUpperCase(),
    movieTitle: "Avatar: The Way of Water",
    showDate: "29 Jul, 2025",
    showTime: "3:30 PM",
    hallName: "Ananda Cinema Hall",
    seatType: "Front",
    quantity: 2,
    totalAmount: 735.0,
    customerName: "John Doe",
    customerMobile: "+880 1234-567890",
    customerEmail: "john.doe@email.com",
  }

  useEffect(() => {
    const load = async () => {
      try {
        if (bookingId) {
          const res = await fetch(`/api/bookings/${bookingId}`, { cache: "no-store" })
          const data = await res.json()
          if (res.ok) {
            setBooking(data)
          }
        }
      } catch {}
      setTimeout(() => {
        setIsGeneratingTicket(false)
        setTicketGenerated(true)
      }, 1200)
    }
    load()
  }, [bookingId])

  const details = booking
    ? {
        bookingId: booking.ticketNumber || booking._id,
        movieTitle: booking.movieTitle,
        showDate: booking.showDate,
        showTime: booking.showTime,
        hallName: "Ananda Cinema Hall",
        seatType: booking.seatType,
        quantity: booking.quantity,
        totalAmount: booking.totalAmount,
        customerName: booking.customerName,
        customerMobile: booking.customerMobile,
        customerEmail: booking.customerEmail,
      }
    : mock

  const handleDownloadTicket = () => {
    // In real implementation, this would generate and download a PDF
    alert("Ticket download started!")
  }

  const handleEmailTicket = () => {
    // In real implementation, this would send email
    alert("Ticket sent to your email!")
  }

  if (isGeneratingTicket) {
    return (
      <div className="min-h-screen bg-[#DCD7C9] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-16 h-16 text-[#A2785C] animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#2C3930] mb-2">Generating Your Ticket</h2>
          <p className="text-[#3F4F44]">Please wait while we prepare your cinema ticket...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#DCD7C9] py-8">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-[#2C3930] mb-2">Booking Confirmed!</h1>
          <p className="text-[#3F4F44] text-lg">
            Your movie ticket has been successfully booked. Booking ID:{" "}
            <span className="font-bold text-[#A2785C]">{details.bookingId}</span>
          </p>
        </div>

        {/* Ticket Design */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden mb-8">
          {/* Ticket Header */}
          <div className="bg-gradient-to-r from-[#2C3930] to-[#3F4F44] text-[#DCD7C9] p-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Ananda Cinema Hall</h2>
                <p className="text-[#A2785C]">Premium Movie Experience</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80">Booking ID</p>
                <p className="text-xl font-bold">{details.bookingId}</p>
              </div>
            </div>
          </div>

          {/* Ticket Body */}
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Movie Details */}
              <div>
                <h3 className="text-2xl font-bold text-[#2C3930] mb-4">{details.movieTitle}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-[#3F4F44]">Show Date:</span>
                    <span className="font-semibold text-[#2C3930]">{details.showDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3F4F44]">Show Time:</span>
                    <span className="font-semibold text-[#2C3930]">{details.showTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3F4F44]">Hall:</span>
                    <span className="font-semibold text-[#2C3930]">{details.hallName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3F4F44]">Seat Type:</span>
                    <span className="font-semibold text-[#2C3930]">{details.seatType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#3F4F44]">Quantity:</span>
                    <span className="font-semibold text-[#2C3930]">{details.quantity} Tickets</span>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div>
                <h3 className="text-xl font-bold text-[#2C3930] mb-4">Customer Information</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-[#3F4F44] block">Name:</span>
                    <span className="font-semibold text-[#2C3930]">{details.customerName}</span>
                  </div>
                  <div>
                    <span className="text-[#3F4F44] block">Mobile:</span>
                    <span className="font-semibold text-[#2C3930]">{details.customerMobile}</span>
                  </div>
                  <div>
                    <span className="text-[#3F4F44] block">Email:</span>
                    <span className="font-semibold text-[#2C3930]">{details.customerEmail}</span>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="mt-6 p-4 bg-[#A2785C]/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-[#3F4F44] text-lg">Total Amount:</span>
                    <span className="font-bold text-[#A2785C] text-2xl">৳{Number(details.totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="mt-8 text-center">
              <div className="inline-block p-4 border-2 border-dashed border-[#3F4F44]/30 rounded-lg">
                <div className="w-32 h-32 bg-[#3F4F44]/10 rounded flex items-center justify-center">
                  <span className="text-[#3F4F44] text-sm">QR Code</span>
                </div>
              </div>
              <p className="text-sm text-[#3F4F44] mt-2">Show this QR code at the cinema entrance</p>
            </div>
          </div>

          {/* Ticket Footer */}
          <div className="bg-[#3F4F44]/5 p-4 text-center">
            <p className="text-sm text-[#3F4F44]">
              Please arrive 15 minutes before showtime. This ticket is non-refundable and non-transferable.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleDownloadTicket}
            className="bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9] px-8 py-3 text-lg font-semibold"
          >
            <Download className="mr-2" size={20} />
            Download Ticket
          </Button>
          <Button
            onClick={handleEmailTicket}
            variant="outline"
            className="border-[#A2785C] text-[#A2785C] hover:bg-[#A2785C] hover:text-[#DCD7C9] px-8 py-3 text-lg font-semibold bg-transparent"
          >
            <Mail className="mr-2" size={20} />
            Email Ticket
          </Button>
        </div>

        {/* Additional Information */}
        <div className="mt-8 text-center">
          <p className="text-[#3F4F44] mb-2">
            A copy of your ticket has been sent to <span className="font-semibold">{details.customerEmail}</span>
          </p>
          <p className="text-sm text-[#3F4F44]">
            For any queries, please contact us at +880 1234-567890 or visit our help center.
          </p>
        </div>
      </div>
    </div>
  )
}

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BookingConfirmationContent />
    </Suspense>
  );
}
