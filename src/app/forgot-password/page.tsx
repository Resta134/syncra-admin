"use client";

import Link from 'next/link';
import { Mail, ArrowLeft, CheckCircle2, Send } from 'lucide-react';
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulasi pengiriman instruksi reset ke email
    setIsSent(true);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Glow Background - Konsisten dengan Login/Register */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="glass-card w-full max-w-md p-10 border-white/5 relative z-10 text-center">
        {!isSent ? (
          <>
            <div className="mb-8 space-y-2">
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Reset Password</h2>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                Masukkan email Anda untuk menerima instruksi pemulihan.
              </p>
            </div>

            <form onSubmit={handleReset} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest pl-1">Business Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
                  <input 
                    required
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@perusahaan.com" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:border-cyan-500 outline-none transition-all" 
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-cyan-500 text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer">
                Send Instructions <Send size={14} />
              </button>
            </form>
          </>
        ) : (
          <div className="py-4 space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Email Terkirim</h2>
              <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Kami telah mengirimkan tautan konfirmasi perubahan password ke <br />
                <span className="text-cyan-400">{email}</span>
              </p>
            </div>
            <p className="text-[9px] text-gray-600 italic">
              *Silakan periksa folder kotak masuk atau spam Anda.
            </p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-[10px] text-gray-500 font-black uppercase tracking-widest hover:text-white transition-colors">
            <ArrowLeft size={12} /> Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}