"use client";

import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Languages,
  Zap,
  LogOut,
  ShieldCheck, // Ikon baru untuk Roles & Users
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: Users, label: "Participants", href: "/participants" },
  { icon: ShieldCheck, label: "Roles & Users", href: "/roles" }, // Menu Baru
  { icon: Zap, label: "Face AI", href: "/face-ai" },
  { icon: Languages, label: "AI Translation", href: "/translation" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r border-white/10 p-6 flex flex-col justify-between fixed left-0 top-0 bg-[#050505] z-50">
      <div>
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <span className="font-bold text-black text-xs">S</span>
          </div>
          <h1 className="text-xl font-bold tracking-wider text-glow text-cyan-400">
            SYNCRO AI
          </h1>
        </div>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all hover:bg-white/5 hover:text-cyan-400 text-gray-400 group"
            >
              <item.icon
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="font-medium text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Logout Action */}
      <div className="pt-6 border-t border-white/5">
        <Link
          href="/login" // Diarahkan ke halaman login, bukan landing page lagi
          className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-gray-500 hover:bg-red-500/10 hover:text-red-500 group cursor-pointer"
        >
          <LogOut
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-black text-[10px] uppercase tracking-[0.3em]">
            Logout
          </span>
        </Link>
      </div>
    </aside>
  );
}
