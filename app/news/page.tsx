"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User, ArrowRight, Search, Filter, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import BuyTicketButton from "@/components/buy-ticket-button"

interface NewsItem {
  _id: string;
  title: string;
  description: string;
  image: string;
  link?: string;
  featured: boolean;
  isActive: boolean;
  author?: string;
  category?: string;
  views?: number;
  readTime?: string;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  "All",
  "Cinema Updates",
  "Events",
  "Offers",
  "Technology",
  "Partnerships",
  "Food & Beverage",
  "Accessibility",
]

export default function NewsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [allNews, setAllNews] = useState<any[]>([])
  const [filteredNews, setFilteredNews] = useState<any[]>([])
  const [featuredNews, setFeaturedNews] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/news")
      const data = await response.json()
      
      if (response.ok) {
        // Transform MongoDB data to match the existing UI format
        const transformedNews = data.news.map((item: any) => ({
          id: item._id,
          title: item.title,
          excerpt: item.description,
          image: item.image,
          author: item.author || "Cinema Management",
          date: new Date(item.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long", 
            day: "numeric",
          }),
          readTime: item.readTime || "3 min read",
          category: item.category || "Cinema Updates",
          views: item.views || 0,
          featured: item.featured,
        }))

        setAllNews(transformedNews)
        
        // Set featured news (first featured article or first article)
        const featured = transformedNews.find((item: any) => item.featured) || transformedNews[0]
        setFeaturedNews(featured)
        
        // Set filtered news (non-featured articles)
        const nonFeatured = transformedNews.filter((item: any) => !item.featured || item.id !== featured?.id)
        setFilteredNews(nonFeatured)
      } else {
        console.error("Failed to fetch news:", data.error)
      }
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterNews(term, selectedCategory)
  }

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(category)
    filterNews(searchTerm, category)
  }

  const filterNews = (search: string, category: string) => {
    // Get non-featured articles from allNews
    const nonFeatured = allNews.filter((item: any) => 
      !item.featured || (featuredNews && item.id !== featuredNews.id)
    )
    
    let filtered = nonFeatured

    if (category !== "All") {
      filtered = filtered.filter((item) => item.category === category)
    }

    if (search) {
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.excerpt.toLowerCase().includes(search.toLowerCase()),
      )
    }

    setFilteredNews(filtered)
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Cinema Updates": "bg-blue-100 text-blue-800",
      Events: "bg-purple-100 text-purple-800",
      Offers: "bg-green-100 text-green-800",
      Technology: "bg-orange-100 text-orange-800",
      Partnerships: "bg-pink-100 text-pink-800",
      "Food & Beverage": "bg-yellow-100 text-yellow-800",
      Accessibility: "bg-indigo-100 text-indigo-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-[#DCD7C9]">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#2C3930] to-[#3F4F44] text-[#DCD7C9] py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">Cinema News & Updates</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        {/* Search and Filter Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3F4F44]" size={20} />
              <Input
                placeholder="Search news articles..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 border-[#3F4F44]/20 focus:border-[#A2785C] bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter size={20} className="text-[#3F4F44]" />
              <span className="text-[#3F4F44] font-medium">Filter:</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryFilter(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-[#A2785C] text-[#DCD7C9]"
                    : "bg-white text-[#3F4F44] hover:bg-[#A2785C]/10 border border-[#3F4F44]/20"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Featured News - Reduced height on desktop */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-[#2C3930] mb-6 flex items-center">
            <span className="bg-[#A2785C] text-[#DCD7C9] px-3 py-1 rounded-full text-sm mr-3">Featured</span>
            Latest Headlines
          </h2>

          {loading ? (
            <article className="bg-white rounded-2xl overflow-hidden shadow-xl animate-pulse">
              <div className="md:flex">
                <div className="md:w-1/2">
                  <div className="w-full h-64 md:h-80 lg:h-64 bg-gray-200"></div>
                </div>
                <div className="md:w-1/2 p-6 lg:p-8">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-6"></div>
                  <div className="h-10 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </article>
          ) : featuredNews ? (
            <article className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 group">
              <div className="md:flex">
                <div className="md:w-1/2 relative overflow-hidden">
                  <Image
                    src={featuredNews.image || "/placeholder.svg"}
                    alt={featuredNews.title}
                    width={800}
                    height={400}
                    className="w-full h-64 md:h-80 lg:h-64 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(featuredNews.category)}`}
                    >
                      {featuredNews.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center">
                    <Eye size={12} className="mr-1" />
                    {featuredNews.views}
                  </div>
                </div>

                <div className="md:w-1/2 p-6 lg:p-8">
                  <div className="flex items-center text-[#3F4F44] text-sm mb-4">
                    <User size={16} className="mr-2" />
                    {featuredNews.author}
                    <Calendar size={16} className="ml-4 mr-2" />
                    {featuredNews.date}
                    <Clock size={16} className="ml-4 mr-2" />
                    {featuredNews.readTime}
                  </div>

                  <h3 className="text-xl lg:text-2xl font-bold text-[#2C3930] mb-3 lg:mb-4 group-hover:text-[#A2785C] transition-colors">
                    {featuredNews.title}
                </h3>

                <p className="text-[#3F4F44] mb-4 lg:mb-6 leading-relaxed text-sm lg:text-base">
                  {featuredNews.excerpt}
                </p>

                <Link
                  href={`/news/${featuredNews.id}`}
                  className="inline-flex items-center bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9] px-4 lg:px-6 py-2 lg:py-3 rounded-full font-semibold transition-all duration-300 group-hover:translate-x-1 text-sm lg:text-base"
                >
                  Read Full Story
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </div>
            </div>
          </article>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#3F4F44] text-lg">No featured news available.</p>
            </div>
          )}
        </div>

        {/* News Grid */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#2C3930] mb-8">More News & Updates</h2>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <article key={i} className="bg-white rounded-xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-3 bg-gray-200 rounded mb-3"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 w-24 bg-gray-200 rounded"></div>
                  </div>
                </article>
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#3F4F44] text-lg">No news articles found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredNews.map((item) => (
                <article
                  key={item.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(item.category)}`}
                      >
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <Eye size={10} className="mr-1" />
                      {item.views}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-[#3F4F44] text-xs mb-3">
                      <User size={12} className="mr-1" />
                      {item.author}
                      <Calendar size={12} className="ml-3 mr-1" />
                      {item.date}
                      <Clock size={12} className="ml-3 mr-1" />
                      {item.readTime}
                    </div>

                    <h3 className="text-lg font-bold text-[#2C3930] mb-3 group-hover:text-[#A2785C] transition-colors line-clamp-2">
                      {item.title}
                    </h3>

                    <p className="text-[#3F4F44] text-sm mb-4 line-clamp-3">{item.excerpt}</p>

                    <Link
                      href={`/news/${item.id}`}
                      className="inline-flex items-center text-[#A2785C] hover:text-[#2C3930] font-semibold text-sm transition-colors group-hover:translate-x-1 duration-300"
                    >
                      Read More
                      <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-[#2C3930] to-[#3F4F44] rounded-2xl p-8 text-center text-[#DCD7C9]">
          <h3 className="text-2xl font-bold mb-4">Stay Updated with Cinema News</h3>
          <p className="mb-6 opacity-90">
            Subscribe to our newsletter and never miss the latest updates, exclusive offers, and special events.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input placeholder="Enter your email address" className="flex-1 bg-white text-[#2C3930] border-none" />
            <Button className="bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9] px-6">Subscribe</Button>
          </div>
        </div>
      </div>
      <BuyTicketButton />
    </div>
  )
}
