"use client";
import { Search, Bell, User } from 'lucide-react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="flex items-right justify-end mb-8">
      {/* Search Bar */}
      {/* <div className="relative w-96">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
        <input 
          type="text" 
          placeholder="Search syncro AI..." 
          className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:border-cyan-500/50 transition-all text-sm text-white"
        />
      </div> */}

      {/* Action Icons */}
      <div className="flex items-center gap-6">
        {/* Notification Link */}
        <Link href="/notifications" className="relative p-2 text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-cyan-500 rounded-full shadow-[0_0_8px_rgba(6,182,212,1)]"></span>
        </Link>
        
        {/* Profile Link */}
        <Link href="/profile" className="flex items-center gap-3 pl-6 border-l border-white/10 group cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-medium group-hover:text-cyan-400 transition-colors">Resta Sabrina</p>
            <p className="text-[10px] text-cyan-500 font-bold uppercase tracking-tighter">Admin Manager</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-cyan-400 group-hover:border-cyan-500/50 transition-all">
            <User size={20} />
          </div>
        </Link>
      </div>
    </header>
  );
}