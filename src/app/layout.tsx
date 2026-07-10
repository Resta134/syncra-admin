"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Daftar lengkap halaman AUTH dan LANDING yang tidak boleh ada sidebar
  const noSidebarPages = ["/", "/login", "/register", "/forgot-password"];
  
  // Cek apakah rute saat ini ada dalam daftar di atas
  const isAuthOrLanding = noSidebarPages.includes(pathname);

  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className="bg-[#050505] text-white flex min-h-screen">
        {/* Sidebar HANYA muncul jika BUKAN halaman auth atau landing */}
        {!isAuthOrLanding && <Sidebar />}
        
        <main 
          className={`flex-1 transition-all ${
            isAuthOrLanding ? "w-full" : "ml-64 p-8"
          }`}
        >
          {children}
        </main>
      </body>
    </html>
  );
}