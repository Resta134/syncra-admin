"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Sesuaikan path ini
import Navbar from "@/components/Navbar";
import { Users, Calendar, Languages, Zap } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Definisi tipe data untuk grafik
type ChartData = {
  bulan: string;
  total_event: number;
};

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  // State untuk menyimpan angka KPI dari Supabase
  const [kpiStats, setKpiStats] = useState({
    events: 0,
    participants: 0,
    accuracy: "98.2%", // Statis (bisa diubah jika ada tabel log AI)
    latencies: "12 ms", // Statis
  });

  // State untuk menyimpan data grafik dari MongoDB
  const [chartData, setChartData] = useState<ChartData[]>([]);

  // ================= UTAMA: SATPAM PENGUNCI DASHBOARD & FETCH DATA =================
  useEffect(() => {
    const initializeDashboard = async () => {
      // 1. Cek Sesi Auth
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Akses ditolak! Anda harus masuk (login) terlebih dahulu.");
        router.push("/login");
        return; // Hentikan eksekusi jika tidak login
      }

      // 2. Jika valid, ambil perhitungan total data langsung dari tabel Supabase
      try {
        // Menghitung total baris di tabel 'events'
        const { count: eventsCount } = await supabase
          .from("events")
          .select("*", { count: "exact", head: true });

        // Menghitung total baris partisipan (Misal dari tabel 'tickets' atau 'profiles')
        const { count: participantsCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true });

        setKpiStats((prev) => ({
          ...prev,
          events: eventsCount || 0,
          participants: participantsCount || 0,
        }));
      } catch (error) {
        console.error("Gagal mengambil data KPI Supabase:", error);
      }

      // 3. Ambil data analitik hasil scraping dari MongoDB via API Next.js
      try {
        // Pastikan kamu membuat file route.ts di folder app/api/analytics
        const response = await fetch("/api/analytics");
        if (response.ok) {
          const mongoData = await response.json();
          setChartData(mongoData);
        } else {
          // Data cadangan sementara jika API MongoDB belum siap
          setChartData([
            { bulan: "Jan", total_event: 12 },
            { bulan: "Feb", total_event: 19 },
            { bulan: "Mar", total_event: 15 },
            { bulan: "Apr", total_event: 28 },
            { bulan: "Mei", total_event: 22 },
            { bulan: "Jun", total_event: 35 },
          ]);
        }
      } catch (error) {
        console.error("Gagal mengambil data MongoDB:", error);
      }

      setLoading(false);
    };

    initializeDashboard();
  }, [router]);

  // Tampilan loading proteksi saat sistem mengecek akun dan menarik data
  if (loading) {
    return (
      <div className="min-h-screen bg-[#070B1A] flex items-center justify-center text-white">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="animate-pulse text-xs tracking-[0.3em] font-black text-cyan-400 uppercase">
            Securing Connection & Fetching Data...
          </p>
        </div>
      </div>
    );
  }

  // Konfigurasi Array untuk KPI agar mudah di-render
  const kpiCards = [
    { label: "Total Events", val: kpiStats.events.toString(), icon: Calendar },
    {
      label: "Active Participants",
      val: kpiStats.participants.toString(),
      icon: Users,
    },
    { label: "AI Accuracy", val: kpiStats.accuracy, icon: Zap },
    { label: "Average Latency", val: kpiStats.latencies, icon: Languages },
  ];

  // ================= TAMPILAN DASHBOARD ASLI (JIKA LOLOS LOGIN) =================
  return (
    <>
      <Navbar />
      <div className="space-y-8 pb-10">
        <div>
          <h2 className="text-3xl font-bold text-glow text-white">
            Dashboard Overview
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
            <p className="text-gray-400 text-sm">
              Real-time performance of SYNCRO AI system.
            </p>
            <button
              onClick={() => router.push("/api-docs")}
              className="px-4 py-2 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-cyan-500/20 transition cursor-pointer"
            >
              Lihat Dokumentasi API System
            </button>
          </div>
        </div>

        {/* SECTION 1: KPI CARDS (Data dari Supabase) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiCards.map((kpi) => (
            <div
              key={kpi.label}
              className="glass-card p-6 border border-white/5 hover:border-cyan-500/30 transition-colors"
            >
              <div className="p-2 bg-cyan-500/10 w-fit rounded-lg text-cyan-400 mb-4">
                <kpi.icon size={20} />
              </div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">
                {kpi.label}
              </p>
              <h3 className="text-3xl font-bold mt-2 tracking-tight text-white">
                {kpi.val}
              </h3>
            </div>
          ))}
        </div>

        {/* SECTION 2: ANALYTICS CHART (Data dari MongoDB via API) */}
        <div className="glass-card p-6 border border-white/5">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar size={18} className="text-cyan-400" /> Tren Event
              Bulanan (Scraped Data)
            </h3>
            <p className="text-xs text-gray-500">
              Visualisasi pertumbuhan event yang direkam di MongoDB.
            </p>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#1f2937"
                  vertical={false}
                />
                <XAxis
                  dataKey="bulan"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  cursor={{ fill: "#1f2937", opacity: 0.4 }}
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderColor: "#374151",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Bar
                  dataKey="total_event"
                  fill="#06b6d4"
                  radius={[4, 4, 0, 0]}
                  barSize={40}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
}
