"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminLogin() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Mock authentication - in real app, this would be an API call
    if (credentials.username === "admin" && credentials.password === "admin123") {
      localStorage.setItem("adminAuth", "authenticated")
      router.push("/admin")
    } else {
      setError("Invalid username or password")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#DCD7C9] flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-[#A2785C] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-[#DCD7C9] font-bold text-2xl">A</span>
          </div>
          <CardTitle className="text-2xl font-bold text-[#2C3930]">Admin Login</CardTitle>
          <p className="text-[#3F4F44]">Sign in to access the admin panel</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-[#2C3930] font-medium mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3F4F44]" size={20} />
                <Input
                  type="text"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  placeholder="Enter your username"
                  className="pl-10 border-[#3F4F44]/20 focus:border-[#A2785C]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[#2C3930] font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#3F4F44]" size={20} />
                <Input
                  type={showPassword ? "text" : "password"}
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 border-[#3F4F44]/20 focus:border-[#A2785C]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#3F4F44] hover:text-[#A2785C]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#A2785C] hover:bg-[#A2785C]/90 text-[#DCD7C9] py-3 text-lg font-semibold"
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-[#3F4F44]">
              Demo credentials: <br />
              Username: <span className="font-semibold">admin</span> <br />
              Password: <span className="font-semibold">admin123</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
