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
  ChartArea,// icon BARU NICHHH
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: ChartArea, label: "Visualisasi", href: "/visualisasi" },
  { icon: Calendar, label: "Events", href: "/events" },
  { icon: Users, label: "Participants", href: "/participants" },
  { icon: ShieldCheck, label: "Roles & Users", href: "/roles" }, // Menu Baru
  // { icon: Zap, label: "Face AI", href: "/face-ai" },
  // { icon: Languages, label: "AI Translation", href: "/translation" },
  // { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r border-white/10 p-6 flex flex-col justify-between fixed left-0 top-0 bg-[#050505] z-50">
      <div>
        {/* Logo Section */}
        <div className="flex items-center">
          <img
            src="/images/logo2.png"
            alt="Syncro AI Logo"
            // Ubah w-8 h-8 menjadi angka yang lebih besar, contohnya w-12 h-12
            className="w-50 h-20 rounded-lg object-contain" />
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
