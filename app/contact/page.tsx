"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import BuyTicketButton from "@/components/buy-ticket-button"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "general",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    alert("Thank you for your message! We'll get back to you soon.")
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
      inquiryType: "general",
    })
    setIsSubmitting(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      details: ["+880 1234-567890", "+880 9876-543210"],
      description: "Call us for immediate assistance",
    },
    {
      icon: Mail,
      title: "Email",
      details: ["info@anandacinema.com", "booking@anandacinema.com"],
      description: "Send us your queries anytime",
    },
    {
      icon: MapPin,
      title: "Address",
      details: ["123 Cinema Street", "Entertainment District, Dhaka 1000"],
      description: "Visit us at our location",
    },
    {
      icon: Clock,
      title: "Operating Hours",
      details: ["Daily: 10:00 AM - 11:00 PM", "Box Office: 9:30 AM - 10:30 PM"],
      description: "We're here to serve you",
    },
  ]

  const inquiryTypes = [
    { value: "general", label: "General Inquiry" },
    { value: "booking", label: "Booking Support" },
    { value: "technical", label: "Technical Issues" },
    { value: "feedback", label: "Feedback & Suggestions" },
    { value: "partnership", label: "Business Partnership" },
    { value: "media", label: "Media & Press" },
  ]

  return (
    <div className="min-h-screen bg-[#DCD7C9]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2C3930] to-[#3F4F44] text-[#DCD7C9] py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Get in Touch</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Contact Form */}
          <div className="space-y-8">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-[#2C3930] mb-2">Send us a Message</h2>
                <p className="text-[#3F4F44]">Fill out the form below and we'll get back to you within short time.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#2C3930] font-medium mb-2">Full Name *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                      className="border-[#3F4F44]/20 focus:border-[#A2785C]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#2C3930] font-medium mb-2">Phone Number</label>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      className="border-[#3F4F44]/20 focus:border-[#A2785C]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">Email Address *</label>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    required
                    className="border-[#3F4F44]/20 focus:border-[#A2785C]"
                  />
                </div>

                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">Inquiry Type</label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-[#3F4F44]/20 rounded-lg focus:border-[#A2785C] focus:outline-none"
                  >
                    {inquiryTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">Subject *</label>
                  <Input
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Enter the subject of your message"
                    required
                    className="border-[#3F4F44]/20 focus:border-[#A2785C]"
                  />
                </div>

                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">Message *</label>
                  <Textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Enter your message here..."
                    rows={4}
                    required
                    className="border-[#3F4F44]/20 focus:border-[#A2785C] resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9] py-3 text-lg font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#DCD7C9] mr-2"></div>
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send size={20} className="mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Social Media - Moved under contact form */}
            <div className="bg-gradient-to-r from-[#2C3930] to-[#3F4F44] rounded-2xl p-4 md:p-8 text-[#DCD7C9]">
              <h3 className="text-xl font-bold mb-4">Follow Us</h3>
              <p className="mb-4 opacity-90">
                Stay connected with us on social media for the latest updates and behind-the-scenes content.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="bg-[#A2785C] hover:bg-[#A2785C]/80 p-3 rounded-full transition-colors">
                  <span className="sr-only">Facebook</span>
                  <div className="w-6 h-6 bg-[#DCD7C9] rounded"></div>
                </a>
                <a href="#" className="bg-[#A2785C] hover:bg-[#A2785C]/80 p-3 rounded-full transition-colors">
                  <span className="sr-only">Instagram</span>
                  <div className="w-6 h-6 bg-[#DCD7C9] rounded"></div>
                </a>
                <a href="#" className="bg-[#A2785C] hover:bg-[#A2785C]/80 p-3 rounded-full transition-colors">
                  <span className="sr-only">Twitter</span>
                  <div className="w-6 h-6 bg-[#DCD7C9] rounded"></div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-[#2C3930] mb-6">Contact Information</h2>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4 p-4 rounded-lg hover:bg-[#A2785C]/5 transition-colors"
                  >
                    <div className="bg-[#A2785C] text-[#DCD7C9] p-3 rounded-full">
                      <info.icon size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#2C3930] mb-1">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-[#3F4F44] font-medium">
                          {detail}
                        </p>
                      ))}
                      <p className="text-sm text-[#3F4F44]/70 mt-1">{info.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions - Removed Live Chat Support */}
            <div className="bg-white rounded-2xl p-4 md:p-8 shadow-xl">
              <h3 className="text-xl font-bold text-[#2C3930] mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#A2785C] text-[#A2785C] hover:bg-[#A2785C] hover:text-[#DCD7C9] bg-transparent"
                >
                  <Phone size={20} className="mr-3" />
                  Request Callback
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#A2785C] text-[#A2785C] hover:bg-[#A2785C] hover:text-[#DCD7C9] bg-transparent"
                >
                  <Star size={20} className="mr-3" />
                  Leave a Review
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-[#2C3930] mb-8 text-center">Find Us on the Map</h2>
          <div className="bg-white rounded-2xl p-2 md:p-4 shadow-xl">
            <div className="bg-[#3F4F44]/10 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin size={48} className="text-[#A2785C] mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[#2C3930] mb-2">Interactive Map</h3>
                <p className="text-[#3F4F44]">
                  123 Cinema Street, Entertainment District
                  <br />
                  Dhaka 1000, Bangladesh
                </p>
                <Button className="mt-4 bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9]">Get Directions</Button>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-8 md:mt-16 bg-white rounded-2xl p-4 md:p-8 shadow-xl">
          <h2 className="text-2xl font-bold text-[#2C3930] mb-8 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
            <div>
              <h3 className="font-semibold text-[#2C3930] mb-2">How can I book tickets online?</h3>
              <p className="text-[#3F4F44] text-sm mb-4">
                You can easily book tickets through our website by visiting the "Get Ticket" page and following the
                simple booking process.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#2C3930] mb-2">What are your refund policies?</h3>
              <p className="text-[#3F4F44] text-sm mb-4">
                Tickets can be refunded up to 2 hours before the show time. Please contact our support team for
                assistance.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#2C3930] mb-2">Do you offer group discounts?</h3>
              <p className="text-[#3F4F44] text-sm mb-4">
                Yes, we offer special group rates for bookings of 15 or more tickets. Contact us for more details.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#2C3930] mb-2">Is parking available?</h3>
              <p className="text-[#3F4F44] text-sm mb-4">
                Yes, we have complimentary parking available for all our guests with easy access to the cinema hall.
              </p>
            </div>
          </div>
        </div>
      </div>
      <BuyTicketButton />
    </div>
  )
}
