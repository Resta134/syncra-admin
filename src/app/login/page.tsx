"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Zap, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  
  // 1. TAMBAHKAN STATE INPUT & LOADING
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // 2. TEMPATKAN FUNGSI HANDLELOGIN DI SINI (Di dalam komponen, sebelum return)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      alert("Email dan Password tidak boleh kosong!");
      return;
    }

    // Benteng pengaman untuk TypeScript & Vercel build
    if (!supabase) {
      alert("Koneksi gagal: Supabase client belum siap. Periksa environment variables Anda.");
      return;
    }

    setLoading(true);

    try {
      // TypeScript sekarang tahu pasti 'supabase' tidak null
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("Login Gagal: " + error.message);
        setLoading(false);
        return; 
      }

      if (data?.user) {
        router.push("/dashboard");
      }
    } catch (err: any) {
      console.error("Login Error:", err);
      alert("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="glass-card w-full max-w-md p-10 border-white/5 relative z-10">
        <div className="text-center mb-10 space-y-2">
          <div className="w-12 h-12 bg-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <Zap size={24} className="text-black" />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">
            Login Organizer
          </h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
            Masuk ke dashboard Syncra AI Anda
          </p>
        </div>

        {/* 3. HUBUNGKAN FORM KE HANDLELOGIN */}
        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                size={16}
              />
              <input
                type="email"
                required
                placeholder="email@perusahaan.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)} // Bind data email
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:border-cyan-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-gray-500 font-black uppercase tracking-widest">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                size={16}
              />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)} // Bind data password
                className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white focus:border-cyan-500 outline-none transition-all"
              />
            </div>
            <div className="flex justify-end pt-1">
              <Link
                href="/forgot-password"
                className="text-[10px] text-cyan-500 font-bold hover:underline uppercase tracking-tighter"
              >
                Lupa password?
              </Link>
            </div>
          </div>

          {/* 4. PERBAIKAN UTAMA: Ganti <Link> Menjadi <button type="submit"> */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-cyan-500 text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <>
                Login <ArrowRight size={14} />
              </>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          Belum punya akun?{" "}
          <Link href="/register" className="text-cyan-500 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
}