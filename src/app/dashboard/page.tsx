"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Navbar from "@/components/Navbar";
import { Users, Calendar, Languages, Zap } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // ================= UTAMA: SATPAM PENGUNCI DASHBOARD =================
  useEffect(() => {
    const guardDashboard = async () => {
      // Cek sesi user aktif dari Supabase Auth
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Jika tidak ada user yang aktif login, blokir dan tendang ke halaman login
      if (!user) {
        alert("Akses ditolak! Anda harus masuk (login) terlebih dahulu.");
        router.push("/login");
      } else {
        // Jika user valid, matikan loading dan izinkan melihat dashboard
        setLoading(false);
      }
    };

    guardDashboard();
  }, [router]);

  // Tampilan loading proteksi saat sistem mengecek akun
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B1A] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="animate-pulse text-xs tracking-[0.3em] font-black text-cyan-400 uppercase">
            Securing Connection...
          </p>
        </div>
      </div>
    );
  }

  // ================= TAMPILAN DASHBOARD ASLI (JIKA LOLOS LOGIN) =================
  return (
    <>
      <Navbar />
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-glow">Dashboard Overview</h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <p className="text-gray-400 text-sm">
              Real-time performance of SYNCRO AI system.
            </p>
            {/* TOMBOL PINTAS DOCS */}
            <button
              onClick={() => router.push("/api-docs")}
              className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-cyan-500/20 transition cursor-pointer"
            >
              Lihat Dokumentasi API System
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Events", val: "128", icon: Calendar },
            { label: "Active Participants", val: "3,421", icon: Users },
            { label: "AI Accuracy", val: "98.2%", icon: Zap },
            {
              label: "Translation Active",
              val: "14 Latencies",
              icon: Languages,
            },
          ].map((kpi) => (
            <div key={kpi.label} className="glass-card p-6">
              <div className="p-2 bg-cyan-500/10 w-fit rounded-lg text-cyan-400 mb-4">
                <kpi.icon size={20} />
              </div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">
                {kpi.label}
              </p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight">
                {kpi.val}
              </h3>
            </div>
          ))}
        </div>

        <div className="glass-card h-80 flex items-center justify-center border-dashed border-white/20">
          <p className="text-gray-500 animate-pulse italic text-sm">
            Ready to visualize Syncro analytics...
          </p>
        </div>
      </div>
    </>
  );
}
