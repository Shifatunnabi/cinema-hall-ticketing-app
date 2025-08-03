import Link from "next/link"
import { MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#2C3930] text-[#DCD7C9] py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#A2785C] rounded-full flex items-center justify-center">
                <span className="text-[#DCD7C9] font-bold text-sm">A</span>
              </div>
              <span className="text-xl font-bold">Ananda Cinema</span>
            </div>
            <p className="text-[#DCD7C9]/80 text-sm leading-relaxed">
              Experience the magic of cinema with state-of-the-art technology and comfortable seating. Your premier
              destination for entertainment.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#A2785C]">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-[#DCD7C9]/80 hover:text-[#A2785C] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/movies" className="text-[#DCD7C9]/80 hover:text-[#A2785C] transition-colors">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/get-ticket" className="text-[#DCD7C9]/80 hover:text-[#A2785C] transition-colors">
                  Book Tickets
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-[#DCD7C9]/80 hover:text-[#A2785C] transition-colors">
                  News & Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-[#DCD7C9]/80 hover:text-[#A2785C] transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#A2785C]">Contact Info</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="text-[#A2785C] mt-1 flex-shrink-0" />
                <span className="text-[#DCD7C9]/80 text-sm">123 Cinema Street, Entertainment District, Dhaka 1000</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={16} className="text-[#A2785C] flex-shrink-0" />
                <span className="text-[#DCD7C9]/80 text-sm">+880 1234-567890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={16} className="text-[#A2785C] flex-shrink-0" />
                <span className="text-[#DCD7C9]/80 text-sm">info@anandacinema.com</span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-[#A2785C]">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="bg-[#3F4F44] hover:bg-[#A2785C] p-2 rounded-full transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-[#3F4F44] hover:bg-[#A2785C] p-2 rounded-full transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-[#3F4F44] hover:bg-[#A2785C] p-2 rounded-full transition-colors">
                <Instagram size={20} />
              </a>
            </div>

            <div className="mt-6">
              <h4 className="text-sm font-semibold mb-2 text-[#A2785C]">Opening Hours</h4>
              <p className="text-[#DCD7C9]/80 text-sm">Daily: 10:00 AM - 11:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-[#3F4F44] mt-8 pt-8 text-center">
          <p className="text-[#DCD7C9]/60 text-sm">
            © {new Date().getFullYear()} Ananda Cinema Hall. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
