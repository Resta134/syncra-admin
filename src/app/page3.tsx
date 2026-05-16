"use client";

import Link from 'next/link';
import { 
  Zap, Shield, Globe, ArrowRight, MessageSquare, 
  Users, BarChart3, Smartphone, QrCode, Play 
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#020205] text-white selection:bg-purple-500/30 font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-blue-600/5 blur-[120px] rounded-full"></div>
      </div>

      {/* Navbar - Desain Minimalis & Transparan */}
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center">
            <Zap size={18} className="fill-white text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">SYNCRO AI</h1>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-gray-400">
          {["Beranda", "Fitur", "Paket", "Kontak", "Download App"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-purple-400 transition-colors">{item}</a>
          ))}
          <div className="flex items-center gap-4 ml-6">
            <Link href="/login" className="px-5 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-all">Login</Link>
            <Link href="/register" className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 transition-all shadow-[0_0_15px_rgba(147,51,234,0.4)]">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section - Dua Kolom Sesuai Referensi */}
      <header className="container mx-auto px-6 pt-16 pb-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/5">
              <Zap size={12} className="text-purple-400" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-purple-400 italic">AI Event Ecosystem</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] tracking-tight">
              Revolusi Cara Event <br />
              Anda Berkomunikasi <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400 italic">dengan AI</span>
            </h1>
            
            <p className="max-w-md text-gray-400 text-sm leading-relaxed">
              Syncro AI adalah platform event pintar dengan real-time translation, face recognition attendance, dan Q&A interaktif berbasis AI.
            </p>

            <div className="flex gap-4">
              <Link href="/register" className="px-8 py-4 bg-purple-600 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-purple-500 transition-all shadow-lg">Coba Gratis</Link>
              <button className="px-8 py-4 bg-transparent border border-white/20 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/5 transition-all">Lihat Demo</button>
            </div>
          </div>

          {/* AI Translation Mockup Preview */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-[#0a0a0f] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
              <div className="p-4 bg-white/5 flex items-center justify-between border-b border-white/10">
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                  <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Live Translation Mode</div>
              </div>
              <div className="aspect-video relative bg-slate-900 flex items-center justify-center overflow-hidden">
                 <img 
                   src="https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800" 
                   alt="Presenter" 
                   className="w-full h-full object-cover opacity-60"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                 <div className="absolute bottom-6 left-6 right-6 p-4 glass-card border-white/10 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                       <span>Translated from English</span>
                       <span className="text-emerald-400 flex items-center gap-1"><Zap size={8} /> 0.8s Latency</span>
                    </div>
                    <p className="text-xs text-white leading-relaxed">
                      Artificial Intelligence akan menjadi fondasi utama industri masa depan dan mengubah cara manusia bekerja, belajar, dan hidup.
                    </p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trusted By Section */}
      <section className="container mx-auto px-6 py-12 border-t border-white/5">
        <p className="text-center text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] mb-10">Dipercaya oleh berbagai organisasi</p>
        <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
           {["BINUS", "Telkom Indonesia", "ICE", "KOMPAS", "EduTech"].map(brand => (
             <span key={brand} className="text-xl font-black italic tracking-tighter text-white">{brand}</span>
           ))}
        </div>
      </section>

      {/* Fitur Unggulan Section */}
      <section className="container mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <h2 className="text-3xl font-bold tracking-tight uppercase italic">Fitur Unggulan Syncro AI</h2>
          <p className="text-gray-500 text-xs leading-relaxed uppercase tracking-widest font-medium">Semua yang Anda butuhkan untuk event yang lebih cerdas, interaktif, dan tanpa batas bahasa.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { icon: <Globe size={24}/>, title: "Live Translate AI", desc: "Terjemahan real-time dengan akurasi tinggi." },
            { icon: <Shield size={24}/>, title: "Face Recognition", desc: "Check-in peserta cepat dan aman biometrik." },
            { icon: <MessageSquare size={24}/>, title: "AI Q&A System", desc: "Peserta dapat bertanya, AI menerjemahkan." },
            { icon: <Users size={24}/>, title: "Multi Role System", desc: "Kelola Organizer, Moderator, Speaker." },
            { icon: <BarChart3 size={24}/>, title: "Realtime Analytics", desc: "Pantau semua aktivitas event secara langsung." }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-purple-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-purple-600/10 flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-[11px] font-black uppercase mb-3 tracking-widest text-white">{feature.title}</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed font-medium uppercase tracking-tighter">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile Preview & QR Section */}
      <section className="container mx-auto px-6 py-24 border-t border-white/5">
        <div className="glass-card p-12 flex flex-col lg:flex-row items-center gap-16 overflow-hidden">
          <div className="flex-1 flex justify-center">
             <div className="w-56 h-[420px] rounded-[2.5rem] border-[6px] border-white/10 bg-black relative overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=400" 
                  alt="Mobile App" 
                  className="w-full h-full object-cover opacity-80"
                />
             </div>
          </div>
          <div className="flex-1 space-y-8">
            <h2 className="text-4xl font-bold tracking-tight italic">Aplikasi Mobile Untuk Peserta Event</h2>
            <p className="text-gray-400 text-sm leading-relaxed">Peserta dapat melihat terjemahan real-time, mengajukan pertanyaan, dan berinteraksi langsung melalui aplikasi Syncro AI.</p>
            
            <div className="flex items-start gap-12">
               <div className="space-y-4 flex-1">
                  <div className="flex gap-3">
                    <button className="bg-white/5 border border-white/10 p-3 rounded-lg hover:bg-white/10 transition-all"><Play size={16} fill="white" /></button>
                    <button className="bg-white/5 border border-white/10 p-3 rounded-lg hover:bg-white/10 transition-all"><Smartphone size={16} /></button>
                  </div>
               </div>
               <div className="p-4 bg-white rounded-2xl flex flex-col items-center gap-3">
                  <QrCode size={100} className="text-black" />
                  <p className="text-[8px] font-bold text-black text-center uppercase tracking-widest leading-tight">Scan QR untuk <br /> Download App</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-6 py-20 bg-white/[0.01] border-y border-white/5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {[
            { label: "Event Terlaksana", val: "500+" },
            { label: "Peserta Aktif", val: "50K+" },
            { label: "Bahasa Didukung", val: "12+" },
            { label: "Akurasi Terjemahan", val: "99.5%" }
          ].map((stat, i) => (
            <div key={i} className="space-y-2">
               <p className="text-3xl font-black tracking-tight">{stat.val}</p>
               <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer / CTA Akhir */}
      <footer className="container mx-auto px-6 py-24 text-center space-y-12 relative z-10">
        <div className="space-y-4">
          <h2 className="text-4xl font-bold tracking-tight italic">Siap membuat event Anda lebih cerdas dengan AI?</h2>
          <p className="text-gray-500 text-xs uppercase tracking-widest">Bergabunglah bersama ratusan organisasi yang telah mempercayakan event mereka kepada Syncro AI.</p>
        </div>
        <Link href="/register" className="inline-block px-12 py-5 bg-purple-600 text-white rounded-xl font-bold text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all">Mulai Sekarang</Link>
        <div className="pt-20 border-t border-white/5">
          <p className="text-[10px] text-gray-700 font-bold tracking-[0.4em] uppercase">&copy; 2026 Syncro AI Ecosystem • Semarang, Indonesia</p>
        </div>
      </footer>
    </div>
  );
}