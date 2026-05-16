"use client";

import Link from 'next/link';
import { 
  Zap, Shield, Globe, ArrowRight, CheckCircle2, 
  Smartphone, Download, Mail, Phone, MapPin 
} from 'lucide-react';

export default function LandingPage() {
  const plans = [
    {
      name: "Starter",
      price: "Rp 1.499.000",
      period: "/event",
      features: ["Up to 100 Peserta", "1 Event Aktif", "Live Translate", "Face Recognition", "Q&A System"],
      recommended: false
    },
    {
      name: "Professional",
      price: "Rp 4.999.000",
      period: "/event",
      features: ["Up to 1.000 Peserta", "5 Event Aktif", "Semua Fitur Starter", "Multi Role Management", "Analytics Dashboard"],
      recommended: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["Unlimited Peserta", "Unlimited Event", "Custom Integration", "Dedicated Support", "SLA Guarantee"],
      recommended: false
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      </div>

      {/* Navigation - Sesuai Header Gambar */}
      <nav className="container mx-auto px-6 py-8 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <span className="font-black text-black text-xl">S</span>
          </div>
          <h1 className="text-2xl font-black tracking-tighter">SYNCRO <span className="text-cyan-400">AI</span></h1>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-gray-400">
          <a href="#fitur" className="hover:text-cyan-400 transition-colors">Fitur</a>
          <a href="#paket" className="hover:text-cyan-400 transition-colors">Paket</a>
          <a href="#mobile" className="hover:text-cyan-400 transition-colors">Download App</a>
          <a href="#kontak" className="hover:text-cyan-400 transition-colors">Kontak</a>
          <div className="flex items-center gap-4 ml-4">
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="px-6 py-2 bg-cyan-500 text-black rounded-full hover:bg-cyan-400 transition-all font-black">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-6 pt-20 pb-32 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-8">
          <Zap size={14} className="text-cyan-400" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400">AI Event Ecosystem</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic mb-8 leading-[0.9]">
          REVOLUSI CARA EVENT <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-600 italic">ANDA BERKOMUNIKASI.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-gray-500 text-lg md:text-xl font-medium mb-12">
          Syncro AI adalah platform cerdas dengan real-time translation, face recognition attendance, dan Q&A interaktif berbasis AI.
        </p>
        <div className="flex justify-center gap-6">
          <Link href="/register" className="group flex items-center gap-3 px-10 py-5 bg-cyan-500 text-black rounded-2xl font-black text-sm transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]">
            COBA GRATIS <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <button className="px-10 py-5 bg-white/5 border border-white/10 rounded-2xl font-black text-sm hover:bg-white/10 transition-all">LIHAT DEMO</button>
        </div>
      </header>

      {/* Paket Harga Section */}
      <section id="paket" className="container mx-auto px-6 py-24 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black uppercase tracking-widest italic text-cyan-400">Paket Harga</h2>
          <p className="text-gray-500 text-sm mt-2">Pilih paket yang sesuai dengan kebutuhan event Anda.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, i) => (
            <div key={i} className={`p-8 rounded-[2.5rem] border ${plan.recommended ? 'border-cyan-500 bg-cyan-500/[0.03] scale-105' : 'border-white/5 bg-white/[0.02]'} flex flex-col justify-between transition-all hover:border-cyan-500/50`}>
              <div>
                {plan.recommended && <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-3 py-1 rounded-full mb-4 inline-block italic">Most Popular</span>}
                <h3 className="text-xl font-black uppercase mb-4 tracking-widest">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-3xl font-black">{plan.price}</span>
                  <span className="text-gray-500 text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-[11px] text-gray-400 font-bold">
                      <CheckCircle2 size={14} className="text-cyan-500" /> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <button className={`w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${plan.recommended ? 'bg-cyan-500 text-black' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}>Pilih Paket</button>
            </div>
          ))}
        </div>
      </section>

      {/* Mobile App Section */}
      <section id="mobile" className="container mx-auto px-6 py-24 relative z-10 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <h2 className="text-5xl font-black tracking-tighter italic leading-tight">APLIKASI MOBILE UNTUK <br /> PESERTA EVENT</h2>
            <p className="text-gray-500 leading-relaxed font-medium text-lg">
              Peserta dapat melihat terjemahan real-time, melakukan absen wajah instan, dan berinteraksi langsung melalui aplikasi Syncro AI di smartphone mereka.
            </p>
            <div className="flex gap-4">
              <button className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs hover:bg-white/10 transition-all uppercase tracking-widest"><Smartphone size={18} /> Google Play</button>
              <button className="flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black text-xs hover:bg-white/10 transition-all uppercase tracking-widest"><Download size={18} /> App Store</button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            {/* Simulasi Frame HP */}
            <div className="w-64 h-[500px] border-8 border-white/10 rounded-[3rem] bg-[#0a0a0a] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-white/10 rounded-b-2xl"></div>
              <div className="p-6 h-full flex flex-col justify-center items-center text-center gap-4">
                <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center animate-pulse"><Zap className="text-black" /></div>
                <p className="text-[10px] font-black text-cyan-400 tracking-[0.3em] uppercase">AI Scanning Active</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="kontak" className="container mx-auto px-6 py-24 relative z-10 border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl mx-auto">
          <div className="space-y-8">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Hubungi Kami</h2>
            <p className="text-gray-500 font-medium">Punya pertanyaan? Tim B2B kami siap membantu transformasi digital event Anda.</p>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-cyan-400"><Phone size={20} /></div>
                <span className="font-bold text-sm">+62 812-3456-7890</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-cyan-400"><Mail size={20} /></div>
                <span className="font-bold text-sm">hello@syncroai.com</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-xl text-cyan-400"><MapPin size={20} /></div>
                <span className="font-bold text-sm">Jakarta, Indonesia</span>
              </div>
            </div>
          </div>
          <form className="glass-card p-8 border-white/5 space-y-4">
            <input placeholder="Nama Anda" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-cyan-500 outline-none" />
            <input placeholder="Email Bisnis" className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-cyan-500 outline-none" />
            <textarea rows={4} placeholder="Pesan Anda..." className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-cyan-500 outline-none resize-none"></textarea>
            <button className="w-full py-4 bg-cyan-500 text-black font-black text-xs rounded-xl uppercase tracking-widest shadow-[0_0_20px_rgba(6,182,212,0.3)]">Kirim Pesan</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 text-center text-[9px] text-gray-700 font-bold tracking-[0.5em] uppercase border-t border-white/5">
        &copy; 2026 Syncro AI Ecosystem • Designed by Resta Sabrina
      </footer>
    </div>
  );
}