"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, DollarSign, Clock, Film, Newspaper } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AdminLayout from "@/components/admin-layout"

// Mock data for analytics
const mockAnalytics = {
  today: {
    totalRevenue: 125000,
    totalTickets: 450,
    shows: [
      { time: "1:00 PM", tickets: 200, revenue: 55000 },
      { time: "4:00 PM", tickets: 234, revenue: 64350 },
      { time: "7:00 PM", tickets: 345, revenue: 94875 },
    ],
  },
  month: {
    totalRevenue: 875000,
    totalTickets: 3150,
  },
  year: {
    totalRevenue: 3500000,
    totalTickets: 12600,
  },
}

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedTab, setSelectedTab] = useState("day")

  useEffect(() => {
    const checkAuth = () => {
      const adminAuth = localStorage.getItem("adminAuth")
      if (adminAuth === "authenticated") {
        setIsAuthenticated(true)
      } else {
        router.push("/admin/login")
      }
    }

    checkAuth()
  }, [router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#DCD7C9] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A2785C] mx-auto mb-4"></div>
          <p className="text-[#3F4F44]">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return (
    <AdminLayout>
      <div className="p-4 md:p-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#2C3930] mb-2">Dashboard</h1>
          <p className="text-[#3F4F44]">Welcome back, Admin. Here's what's happening at your cinema.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#3F4F44]">Today's Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-[#A2785C]" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-[#2C3930]">
                ৳{mockAnalytics.today.totalRevenue.toLocaleString()}
              </div>
              <p className="text-xs text-[#3F4F44]">+12% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#3F4F44]">Today's Tickets</CardTitle>
              <Users className="h-4 w-4 text-[#A2785C]" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-[#2C3930]">{mockAnalytics.today.totalTickets}</div>
              <p className="text-xs text-[#3F4F44]">+8% from yesterday</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#3F4F44]">Active Movies</CardTitle>
              <Film className="h-4 w-4 text-[#A2785C]" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-[#2C3930]">8</div>
              <p className="text-xs text-[#3F4F44]">4 now showing, 4 upcoming</p>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-[#3F4F44]">Published News</CardTitle>
              <Newspaper className="h-4 w-4 text-[#A2785C]" />
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-[#2C3930]">12</div>
              <p className="text-xs text-[#3F4F44]">3 featured articles</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Section */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl font-bold text-[#2C3930]">Revenue Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="day">Daily</TabsTrigger>
                <TabsTrigger value="month">Monthly</TabsTrigger>
                <TabsTrigger value="year">Yearly</TabsTrigger>
              </TabsList>

              <TabsContent value="day">
                <div className="space-y-4">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#2C3930] mb-2">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#A2785C]/10 p-4 rounded-lg">
                      <h3 className="font-semibold text-[#2C3930] mb-2">Total Revenue</h3>
                      <p className="text-xl md:text-2xl font-bold text-[#A2785C]">
                        ৳{mockAnalytics.today.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-[#3F4F44]/10 p-4 rounded-lg">
                      <h3 className="font-semibold text-[#2C3930] mb-2">Total Tickets</h3>
                      <p className="text-xl md:text-2xl font-bold text-[#3F4F44]">{mockAnalytics.today.totalTickets}</p>
                    </div>
                  </div>

                  <h4 className="font-semibold text-[#2C3930] mb-4">Show-wise Breakdown</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {mockAnalytics.today.shows.map((show, index) => (
                      <div key={index} className="border border-[#3F4F44]/20 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-[#2C3930]">{show.time}</span>
                          <Clock className="h-4 w-4 text-[#A2785C]" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-[#3F4F44]">Tickets: {show.tickets}</p>
                          <p className="text-sm text-[#3F4F44]">Revenue: ৳{show.revenue.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="month">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#A2785C]/10 p-4 rounded-lg">
                      <h3 className="font-semibold text-[#2C3930] mb-2">Total Revenue</h3>
                      <p className="text-xl md:text-2xl font-bold text-[#A2785C]">
                        ৳{mockAnalytics.month.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-[#3F4F44]/10 p-4 rounded-lg">
                      <h3 className="font-semibold text-[#2C3930] mb-2">Total Tickets</h3>
                      <p className="text-xl md:text-2xl font-bold text-[#3F4F44]">{mockAnalytics.month.totalTickets}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="year">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#A2785C]/10 p-4 rounded-lg">
                      <h3 className="font-semibold text-[#2C3930] mb-2">Total Revenue</h3>
                      <p className="text-xl md:text-2xl font-bold text-[#A2785C]">
                        ৳{mockAnalytics.year.totalRevenue.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-[#3F4F44]/10 p-4 rounded-lg">
                      <h3 className="font-semibold text-[#2C3930] mb-2">Total Tickets</h3>
                      <p className="text-xl md:text-2xl font-bold text-[#3F4F44]">{mockAnalytics.year.totalTickets}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
