import Image from "next/image"
import Link from "next/link"
import { Calendar, ArrowRight } from "lucide-react"

const newsItems = [
  {
    id: 1,
    title: "New IMAX Screen Installation Complete",
    excerpt:
      "Experience movies like never before with our brand new IMAX screen featuring enhanced sound and visual quality.",
    image: "/placeholder.svg?height=200&width=300",
    date: "July 25, 2024",
    category: "Cinema Updates",
  },
  {
    id: 2,
    title: "Special Midnight Screening Events",
    excerpt:
      "Join us for exclusive midnight screenings of the latest blockbusters with special pricing and refreshments.",
    image: "/placeholder.svg?height=200&width=300",
    date: "July 22, 2024",
    category: "Events",
  },
  {
    id: 3,
    title: "Student Discount Program Launched",
    excerpt: "Students can now enjoy 25% off on all movie tickets by presenting their valid student ID cards.",
    image: "/placeholder.svg?height=200&width=300",
    date: "July 20, 2024",
    category: "Offers",
  },
]

export default function NewsSection() {
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3930]">Latest News</h2>
          <Link
            href="/news"
            className="text-[#A2785C] hover:text-[#2C3930] font-semibold flex items-center transition-colors"
          >
            View All News
            <ArrowRight size={20} className="ml-1" />
          </Link>
        </div>

        {/* Responsive Grid: 1 column on mobile, 2 on medium, 3 on large */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-[#3F4F44]/10"
            >
              <div className="relative">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#A2785C] text-[#DCD7C9] px-3 py-1 rounded-full text-sm font-semibold">
                  {item.category}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-[#3F4F44] text-sm mb-3">
                  <Calendar size={16} className="mr-2" />
                  {item.date}
                </div>

                <h3 className="text-xl font-bold text-[#2C3930] mb-3 hover:text-[#A2785C] transition-colors">
                  <Link href={`/news/${item.id}`}>{item.title}</Link>
                </h3>

                <p className="text-[#3F4F44] mb-4 line-clamp-3">{item.excerpt}</p>

                <Link
                  href={`/news/${item.id}`}
                  className="text-[#A2785C] hover:text-[#2C3930] font-semibold flex items-center transition-colors"
                >
                  Read More
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
