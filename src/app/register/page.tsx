"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";

export default function RegisterPage() {
  // Kode sebaris ini TETAP SAMA, tidak diganti!
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // ================= BENTENG PENGAMAN UTAMA SUPABASE =================
    if (!supabase) {
      console.warn("⚠️ Supabase client belum siap.");
      alert("Koneksi gagal: Layanan database belum siap. Silakan coba lagi.");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    ) {
      alert("Semua kolom pendaftaran wajib diisi!");
      return;
    }

    setLoading(true);

    try {
      // 1. Register ke Supabase Auth (TypeScript dijamin aman dari 'possibly null')
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: { full_name: formData.name },
        },
      });

      if (error) {
        if (
          error.message.toLowerCase().includes("already registered") ||
          error.status === 422
        ) {
          alert(
            "Pendaftaran Gagal: Email ini sudah terdaftar di sistem Syncra AI! Silakan gunakan email lain atau langsung login.",
          );
        } else {
          alert("Pendaftaran Gagal: " + error.message);
        }
        setLoading(false);
        return;
      }

      // 2. Simpan ke tabel profiles jika sukses
      if (data?.user) {
        // Proteksi tambahan untuk memastikan TypeScript tahu supabase aman di dalam blok ini
        if (!supabase) return;

        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            full_name: formData.name,
            email: formData.email,
            package_tier: "Free",
          },
        ]);

        if (profileError) {
          console.error("Profile DB Error:", profileError.message);
        }

        setIsSent(true);
      } else {
        alert(
          "Pemberitahuan: Silakan periksa kotak masuk Gmail Anda untuk melihat tautan aktivasi akun.",
        );
        setIsSent(true);
      }
    } catch (err: any) {
      console.error("Unexpected Register Error:", err);
      alert("Terjadi kesalahan tidak terduga saat registrasi.");
    } finally {
      setLoading(false);
    }
  };

  if (isSent) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="glass-card max-w-md p-10 text-center space-y-4">
          <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto text-cyan-400 animate-bounce">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white uppercase italic">
            Check Your Email
          </h2>
          <p className="text-gray-400 text-sm">
            Kami telah mengirimkan link verifikasi ke{" "}
            <span className="text-white font-bold">{formData.email}</span>.
            Silakan klik link tersebut untuk mengaktifkan akun Syncra kamu.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-10 border-cyan-500/20 relative overflow-hidden">
        <div className="relative z-10 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-black text-white italic uppercase">
              Join Syncra <span className="text-cyan-500 text-glow">AI</span>
            </h1>
            <p className="text-gray-500 text-[9px] font-bold uppercase tracking-[0.3em] mt-2">
              Create Administrative Account
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {/* INPUT NAMA */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-black uppercase ml-1">
                Full Name
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={16}
                />
                <input
                  required
                  value={formData.name || ""}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-cyan-500 transition-all"
                  placeholder="Resta Sabrina"
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
            </div>

            {/* INPUT EMAIL */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-black uppercase ml-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  size={16}
                />
                <input
                  type="email"
                  required
                  value={formData.email || ""}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-cyan-500 transition-all"
                  placeholder="resta@example.com"
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* INPUT PASSWORD */}
            <div className="space-y-1">
              <label className="text-[10px] text-gray-500 font-black uppercase ml-1">
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
                  value={formData.password || ""}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-cyan-500 transition-all"
                  placeholder="••••••••"
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full bg-white text-black font-black py-4 rounded-2xl transition-all flex items-center justify-center gap-2 uppercase text-xs tracking-widest mt-4 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <>
                  Register System
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
