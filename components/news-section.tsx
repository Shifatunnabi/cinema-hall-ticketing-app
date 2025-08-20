"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

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

export default function NewsSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("/api/news");
        if (response.ok) {
          const data = await response.json();
          // Get only the first 3 news items
          setNewsItems(data.news.slice(0, 3));
        }
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2C3930]">
              Latest News
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg overflow-hidden shadow-lg animate-pulse">
                <div className="w-full h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-3"></div>
                  <div className="h-6 bg-gray-300 rounded mb-3"></div>
                  <div className="h-20 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="py-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2C3930]">
            Latest News
          </h2>
        </div>

        {/* Responsive Grid: 1 column on mobile, 2 on medium, 3 on large */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <article
              key={item._id}
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
                  {item.category || "Cinema Updates"}
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-[#3F4F44] text-sm mb-3">
                  <Calendar size={16} className="mr-2" />
                  {new Date(item.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>

                <h3 className="text-xl font-bold text-[#2C3930] mb-3 hover:text-[#A2785C] transition-colors">
                  <Link href={`/news/${item._id}`}>{item.title}</Link>
                </h3>

                <p className="text-[#3F4F44] mb-4 line-clamp-3">
                  {item.description}
                </p>

                <Link
                  href={`/news/${item._id}`}
                  className="text-[#A2785C] hover:text-[#2C3930] font-semibold flex items-center transition-colors"
                >
                  Read More
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* View All News Button */}
        <div className="text-center mt-12">
          <Link
            href="/news"
            className="inline-flex items-center px-8 py-3 bg-[#A2785C] text-[#DCD7C9] font-semibold rounded-lg hover:bg-[#A2785C]/90 transition-colors shadow-lg hover:shadow-xl"
          >
            View All News
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
}
