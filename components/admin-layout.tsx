"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Film,
  Newspaper,
  Ticket,
  LogOut,
  Menu,
  X,
  User,
  Users as UsersIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Movie Management",
    href: "/admin/movies",
    icon: Film,
  },
  {
    name: "News Management",
    href: "/admin/news",
    icon: Newspaper,
  },
  {
    name: "Ticket Management",
    href: "/admin/tickets",
    icon: Ticket,
  },
  {
    name: "Admins & Moderators",
    href: "/admin/users",
    icon: UsersIcon,
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#DCD7C9]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#2C3930] text-[#DCD7C9] p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            size="sm"
            className="text-[#DCD7C9] hover:bg-[#3F4F44]"
          >
            <Menu size={20} />
          </Button>
          <h1 className="text-lg font-bold">Admin Panel</h1>
        </div>
        <div className="flex items-center space-x-2">
          <User size={16} />
          <span className="text-sm">Admin</span>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={closeSidebar}
        />
      )}

      {/* Desktop Layout Container */}
      <div className="lg:flex">
        {/* Sidebar - Reduced z-index for desktop */}
        <div
          className={`fixed lg:relative inset-y-0 left-0 w-64 bg-[#2C3930] text-[#DCD7C9] transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0 z-50" : "-translate-x-full z-10"
          } lg:translate-x-0 lg:z-10 flex flex-col lg:h-screen`}
        >
          {/* Sidebar Header */}
          <div className="p-4 border-b border-[#3F4F44]">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-[#A2785C] rounded-lg flex items-center justify-center">
                  <Film size={20} className="text-[#DCD7C9]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Ananda Cinema</h2>
                  <p className="text-xs text-[#DCD7C9]/70">Admin Panel</p>
                </div>
              </div>
              <Button
                onClick={closeSidebar}
                variant="ghost"
                size="sm"
                className="lg:hidden text-[#DCD7C9] hover:bg-[#3F4F44]"
              >
                <X size={16} />
              </Button>
            </div>
          </div>

          {/* Logout Button - Moved to top */}
          <div className="p-4 border-b border-[#3F4F44]">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-[#DCD7C9]/80 hover:bg-red-600 hover:text-white transition-colors duration-200"
            >
              <LogOut size={20} />
              <span className="font-medium">Logout</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    router.push(item.href);
                    closeSidebar();
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors duration-200 ${
                    isActive
                      ? "bg-[#A2785C] text-[#DCD7C9]"
                      : "text-[#DCD7C9]/80 hover:bg-[#3F4F44] hover:text-[#DCD7C9]"
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Main Content - Properly positioned for desktop */}
        <div className="flex-1 lg:ml-0 pt-16 lg:pt-0 min-h-screen">
          {children}
        </div>
      </div>
    </div>
  );
}
