"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import AdminLayout from "@/components/admin-layout"

// Mock movie data
const mockMovies = [
  {
    id: 1,
    title: "Avatar: The Way of Water",
    genre: "Sci-Fi, Adventure",
    duration: "3h 12m",
    rating: "PG-13",
    poster: "/placeholder.svg?height=400&width=300",
    trailer: "https://www.youtube.com/embed/d9MyW72ELq0",
    description: "Set more than a decade after the events of the first film...",
    status: "now-showing",
    isActive: true,
  },
  {
    id: 2,
    title: "Top Gun: Maverick",
    genre: "Action, Drama",
    duration: "2h 11m",
    rating: "PG-13",
    poster: "/placeholder.svg?height=400&width=300",
    trailer: "https://www.youtube.com/embed/qSqVVswa420",
    description: "After thirty years, Maverick is still pushing the envelope...",
    status: "now-showing",
    isActive: true,
  },
  {
    id: 3,
    title: "Spider-Man: Across the Spider-Verse",
    genre: "Animation, Action",
    duration: "2h 20m",
    rating: "PG",
    poster: "/placeholder.svg?height=400&width=300",
    trailer: "https://www.youtube.com/embed/cqGjhVJWtEg",
    description: "Miles Morales catapults across the Multiverse...",
    status: "upcoming",
    isActive: true,
  },
]

export default function MovieManagement() {
  const router = useRouter()
  const [movies, setMovies] = useState(mockMovies)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingMovie, setEditingMovie] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    duration: "",
    rating: "",
    poster: "",
    trailer: "",
    description: "",
    status: "now-showing",
  })

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth")
      if (adminAuth !== "authenticated") {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingMovie) {
      // Update existing movie
      setMovies(movies.map((movie) => (movie.id === editingMovie.id ? { ...movie, ...formData } : movie)))
      setEditingMovie(null)
    } else {
      // Add new movie
      const newMovie = {
        id: Date.now(),
        ...formData,
        isActive: true,
      }
      setMovies([...movies, newMovie])
    }
    setFormData({
      title: "",
      genre: "",
      duration: "",
      rating: "",
      poster: "",
      trailer: "",
      description: "",
      status: "now-showing",
    })
    setIsAddDialogOpen(false)
  }

  const handleEdit = (movie: any) => {
    setEditingMovie(movie)
    setFormData({
      title: movie.title,
      genre: movie.genre,
      duration: movie.duration,
      rating: movie.rating,
      poster: movie.poster,
      trailer: movie.trailer,
      description: movie.description,
      status: movie.status,
    })
    setIsAddDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this movie?")) {
      setMovies(movies.filter((movie) => movie.id !== id))
    }
  }

  const toggleActive = (id: number) => {
    setMovies(movies.map((movie) => (movie.id === id ? { ...movie, isActive: !movie.isActive } : movie)))
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2C3930] mb-2">Movie Management</h1>
          <p className="text-[#3F4F44]">Add, edit, or remove movies from your cinema listings.</p>
        </div>

        {/* Add Movie Button */}
        <div className="mb-8">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={() => {
                  setEditingMovie(null)
                  setFormData({
                    title: "",
                    genre: "",
                    duration: "",
                    rating: "",
                    poster: "",
                    trailer: "",
                    description: "",
                    status: "now-showing",
                  })
                }}
                className="bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9]"
              >
                <Plus size={20} className="mr-2" />
                Add New Movie
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingMovie ? "Edit Movie" : "Add New Movie"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#2C3930] font-medium mb-2">Movie Title *</label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter movie title"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#2C3930] font-medium mb-2">Genre *</label>
                    <Input
                      value={formData.genre}
                      onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
                      placeholder="e.g., Action, Drama"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#2C3930] font-medium mb-2">Duration *</label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 2h 30m"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[#2C3930] font-medium mb-2">Rating *</label>
                    <Input
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      placeholder="e.g., PG-13"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">Poster URL *</label>
                  <Input
                    value={formData.poster}
                    onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                    placeholder="Enter poster image URL"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">Trailer URL *</label>
                  <Input
                    value={formData.trailer}
                    onChange={(e) => setFormData({ ...formData, trailer: e.target.value })}
                    placeholder="Enter YouTube embed URL"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">Description *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Enter movie description"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-[#2C3930] font-medium mb-2">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full p-3 border border-[#3F4F44]/20 rounded-lg focus:border-[#A2785C] focus:outline-none"
                    required
                  >
                    <option value="now-showing">Now Showing</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                  <Button type="submit" className="bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9]">
                    {editingMovie ? "Update Movie" : "Add Movie"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {movies.map((movie) => (
            <Card key={movie.id} className={`bg-white shadow-lg ${!movie.isActive ? "opacity-50" : ""}`}>
              <CardHeader className="p-0">
                <div className="relative">
                  <Image
                    src={movie.poster || "/placeholder.svg"}
                    alt={movie.title}
                    width={300}
                    height={400}
                    className="w-full h-48 md:h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        movie.status === "now-showing" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {movie.status === "now-showing" ? "Now Showing" : "Upcoming"}
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <h3 className="font-bold text-[#2C3930] mb-2 line-clamp-2">{movie.title}</h3>
                <p className="text-[#3F4F44] text-sm mb-2">{movie.genre}</p>
                <p className="text-[#3F4F44] text-sm mb-4">
                  {movie.duration} • {movie.rating}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEdit(movie)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                  >
                    <Edit size={14} className="mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => toggleActive(movie.id)}
                    variant="outline"
                    className={`text-xs ${movie.isActive ? "border-orange-500 text-orange-500" : "border-green-500 text-green-500"}`}
                  >
                    {movie.isActive ? <EyeOff size={14} className="mr-1" /> : <Eye size={14} className="mr-1" />}
                    {movie.isActive ? "Hide" : "Show"}
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleDelete(movie.id)}
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
      </div>
    </AdminLayout>
  )
}
