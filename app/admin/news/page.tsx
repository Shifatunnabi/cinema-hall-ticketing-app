"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Edit, Trash2, Eye, EyeOff, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AdminLayout from "@/components/admin-layout"
import { useAdminAuth } from "@/hooks/use-admin-auth"

// Mock news data
const mockNews = [
  {
    id: 1,
    title: "New IMAX Screen Installation Complete",
    description:
      "Experience movies like never before with our brand new IMAX screen featuring enhanced sound and visual quality.",
    image: "/placeholder.svg?height=200&width=300",
    link: "/news/1",
    featured: true,
    isActive: true,
    date: "July 25, 2024",
  },
  {
    id: 2,
    title: "Special Midnight Screening Events",
    description:
      "Join us for exclusive midnight screenings of the latest blockbusters with special pricing and refreshments.",
    image: "/placeholder.svg?height=200&width=300",
    link: "/news/2",
    featured: false,
    isActive: true,
    date: "July 22, 2024",
  },
  {
    id: 3,
    title: "Student Discount Program Launched",
    description: "Students can now enjoy 25% off on all movie tickets by presenting their valid student ID cards.",
    image: "/placeholder.svg?height=200&width=300",
    link: "/news/3",
    featured: false,
    isActive: true,
    date: "July 20, 2024",
  },
]

export default function NewsManagement() {
  const { authenticated, loading: authLoading, redirectToLogin } = useAdminAuth();
  const router = useRouter()
  const [news, setNews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingNews, setEditingNews] = useState<any>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    featured: false,
  })

  // Handle authentication
  useEffect(() => {
    if (!authLoading && !authenticated) {
      redirectToLogin();
    }
  }, [authLoading, authenticated, redirectToLogin]);

  useEffect(() => {
    if (authenticated) {
      fetchNews()
    }
  }, [authenticated])

  // Show loading or redirect if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#DCD7C9] flex items-center justify-center">
        <div className="text-[#2C3930]">Loading...</div>
      </div>
    );
  }

  if (!authenticated) {
    return null; // Will redirect
  }

  const fetchNews = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/news")
      const data = await response.json()
      
      if (response.ok) {
        // Transform MongoDB data to match the existing UI format
        const transformedNews = data.news.map((item: any) => ({
          id: item._id,
          title: item.title,
          description: item.description,
          image: item.image,
          link: item.link,
          featured: item.featured,
          isActive: item.isActive,
          date: new Date(item.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }))
        setNews(transformedNews)
      } else {
        console.error("Failed to fetch news:", data.error)
      }
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      if (editingNews) {
        // Update existing news
        const response = await fetch(`/api/news/${editingNews.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (response.ok) {
          // Update local state
          setNews(news.map((item) => 
            item.id === editingNews.id 
              ? { ...item, ...formData }
              : item
          ))
          alert("News updated successfully!")
        } else {
          alert(data.error || "Failed to update news")
        }
        setEditingNews(null)
      } else {
        // Add new news
        const response = await fetch("/api/news", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })

        const data = await response.json()

        if (response.ok) {
          // Transform the response to match UI format
          const newNews = {
            id: data.news._id,
            title: data.news.title,
            description: data.news.description,
            image: data.news.image,
            link: data.news.link,
            featured: data.news.featured,
            isActive: data.news.isActive,
            date: new Date(data.news.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          }
          setNews([newNews, ...news])
          alert("News created successfully!")
        } else {
          alert(data.error || "Failed to create news")
        }
      }

      setFormData({
        title: "",
        description: "",
        image: "",
        link: "",
        featured: false,
      })
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error("Error submitting news:", error)
      alert("An error occurred. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (newsItem: any) => {
    setEditingNews(newsItem)
    setFormData({
      title: newsItem.title,
      description: newsItem.description,
      image: newsItem.image,
      link: newsItem.link,
      featured: newsItem.featured,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this news article?")) {
      try {
        const response = await fetch(`/api/news/${id}`, {
          method: "DELETE",
        })

        const data = await response.json()

        if (response.ok) {
          setNews(news.filter((item) => item.id !== id))
          alert("News deleted successfully!")
        } else {
          alert(data.error || "Failed to delete news")
        }
      } catch (error) {
        console.error("Error deleting news:", error)
        alert("An error occurred. Please try again.")
      }
    }
  }

  const toggleActive = async (id: string) => {
    try {
      const currentNews = news.find(item => item.id === id)
      if (!currentNews) return

      const response = await fetch(`/api/news/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isActive: !currentNews.isActive }),
      })

      const data = await response.json()

      if (response.ok) {
        setNews(news.map((item) => 
          item.id === id 
            ? { ...item, isActive: !item.isActive }
            : item
        ))
      } else {
        alert(data.error || "Failed to update news status")
      }
    } catch (error) {
      console.error("Error toggling news status:", error)
      alert("An error occurred. Please try again.")
    }
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2C3930] mb-2">News Management</h1>
          <p className="text-[#3F4F44]">Manage news articles and announcements for your website.</p>
        </div>

        {/* Add News Button */}
        <div className="mb-8">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingNews(null)
                  setFormData({
                    title: "",
                    description: "",
                    image: "",
                    link: "",
                    featured: false,
                  })
                }}
                className="bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9]"
              >
                <Plus size={20} className="mr-2" />
                Add New News
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingNews ? "Edit News" : "Add New News"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">News Title *</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Enter news title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">Image URL *</label>
                  <Input
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Enter image URL"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">Description *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter news description"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">Link</label>
                  <Input
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="Enter news article link (optional)"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 text-[#A2785C] border-[#3F4F44]/20 rounded focus:ring-[#A2785C]"
                  />
                  <label htmlFor="featured" className="text-[#2C3930] font-medium">
                    Featured Article
                  </label>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button 
                    type="submit" 
                    className="bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9]"
                    disabled={submitting}
                  >
                    {submitting 
                      ? (editingNews ? "Updating..." : "Adding...")
                      : (editingNews ? "Update News" : "Add News")
                    }
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsAddDialogOpen(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* News Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-white shadow-lg animate-pulse">
                <CardHeader className="p-0">
                  <div className="h-40 md:h-48 bg-gray-200 rounded-t-lg"></div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="flex gap-2">
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#3F4F44] text-lg">No news articles found.</p>
            <p className="text-[#3F4F44] text-sm">Click "Add New News" to create your first article.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {news.map((item) => (
            <Card key={item.id} className={`bg-white shadow-lg ${!item.isActive ? "opacity-50" : ""}`}>
              <CardHeader className="p-0">
                <div className="relative">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={300}
                    height={200}
                    className="w-full h-40 md:h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4 flex space-x-2">
                    {item.featured && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Star size={12} className="mr-1" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-bold text-[#2C3930] mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-[#3F4F44] text-sm mb-2 line-clamp-3">{item.description}</p>
                <p className="text-[#3F4F44] text-xs mb-4">{item.date}</p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(item)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => toggleActive(item.id)}
                    variant="outline"
                    className={`text-xs ${item.isActive ? "border-orange-500 text-orange-500" : "border-green-500 text-green-500"}`}
                  >
                    {item.isActive ? <EyeOff size={14} className="mr-1" /> : <Eye size={14} className="mr-1" />}
                    {item.isActive ? "Hide" : "Show"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs"
                  >
                    <Trash2 size={14} className="mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
