"use client";

import Navbar from "@/components/Navbar";
import {
  Search,
  Camera,
  RefreshCw,
  Activity,
  ShieldCheck,
  User,
  Maximize2,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi Supabase dengan penegasan tipe string (Fix 2)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Definisi tipe data untuk TypeScript (Fix 1)
type CheckInData = {
  id: string | number;
  name: string;
  time: string;
  status: string;
};

export default function FaceAIPage() {
  // State untuk angka biometrik
  const [biometrics, setBiometrics] = useState({
    latency: 24,
    confidence: 99.2,
    fps: 60,
  });
  const [isStreaming, setIsStreaming] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // State untuk data dari Supabase menggunakan tipe CheckInData (Fix 1)
  const [checkIns, setCheckIns] = useState<CheckInData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Efek untuk mengambil data dari Supabase
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // GANTI 'profiles' DENGAN NAMA TABELMU DI SUPABASE
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false }) // Urutkan dari yang terbaru
          .limit(10); // Ambil 10 data terakhir

        if (error) throw error;

        if (data) {
          // Mapping data Supabase agar sesuai dengan format UI kamu
          const formattedData = data.map((item) => {
            const date = new Date(item.created_at);
            const timeString = date.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            // Sesuaikan 'is_verified' dengan nama kolom yang ada di database-mu
            const statusLabel = item.is_verified ? "Verified" : "Pending";

            return {
              id: item.id,
              name: item.full_name || item.name || "Unknown User", // Sesuaikan nama kolom
              time: timeString,
              status: statusLabel,
            };
          });

          setCheckIns(formattedData);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        // Penambahan tipe any pada catch (Fix 3)
        console.error("Error fetching data dari Supabase:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();

    // Opsional: Real-time update jika ada partisipan baru yang masuk ke database
    const channel = supabase
      .channel("realtime-checkins")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "profiles" },
        (payload) => {
          console.log("Ada user baru!", payload.new);
          fetchUsers();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Efek untuk mensimulasikan angka biometrik yang bergerak real-time
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setBiometrics({
        latency: Math.floor(Math.random() * (28 - 22) + 22),
        confidence: Number((Math.random() * (99.9 - 98.8) + 98.8).toFixed(1)),
        fps: Math.floor(Math.random() * (62 - 58) + 58),
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isStreaming]);

  // Fungsi pencarian log peserta
  const filteredCheckIns = useMemo(() => {
    return checkIns.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, checkIns]);

  return (
    <>
      <Navbar />
      <div className="space-y-8 pb-10">
        <div>
          <h2 className="text-3xl font-bold text-glow text-white tracking-tight">
            Face Recognition Check-in
          </h2>
          <p className="text-gray-400 text-sm font-medium">
            Real-time AI biometric authentication stream.
          </p>
        </div>

        {/* Search Bar Utama */}
        <div className="relative max-w-lg">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search active participants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111111] border border-white/5 rounded-xl py-3 pl-10 pr-4 text-sm text-white focus:border-cyan-500/50 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Camera Monitor */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card aspect-video relative overflow-hidden group border-cyan-500/10">
              {/* Overlay Scanner Effect */}
              <div
                className={`absolute inset-0 z-10 pointer-events-none transition-opacity duration-500 ${isStreaming ? "opacity-100" : "opacity-0"}`}
              >
                <div className="absolute top-1/2 left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] animate-scan"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-dashed border-cyan-500/30 rounded-3xl"></div>
              </div>

              {/* Camera Background */}
              <div className="absolute inset-0 bg-[#050505] flex items-center justify-center">
                {isStreaming ? (
                  <div className="text-center space-y-4">
                    <Camera size={48} className="text-white/5 mx-auto" />
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                      System Streaming Active...
                    </p>
                  </div>
                ) : (
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mx-auto">
                      <Camera size={24} />
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase">
                      Camera Paused
                    </p>
                  </div>
                )}
              </div>

              {/* Floating Camera Actions */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setIsStreaming(!isStreaming)}
                  className="p-4 bg-black/60 backdrop-blur-md rounded-2xl text-white hover:bg-cyan-500 hover:text-black transition-all cursor-pointer"
                >
                  <RefreshCw
                    size={20}
                    className={isStreaming ? "animate-spin-slow" : ""}
                  />
                </button>
                <button className="p-4 bg-black/60 backdrop-blur-md rounded-2xl text-white hover:bg-white hover:text-black transition-all cursor-pointer">
                  <Maximize2 size={20} />
                </button>
              </div>
            </div>

            {/* Bottom Biometrics Dashboard */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card p-4 flex items-center gap-4 border-white/5">
                <div className="p-3 bg-white/5 rounded-xl text-cyan-500">
                  <Activity size={20} />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">
                    Latency
                  </p>
                  <p className="text-lg font-mono font-bold text-white">
                    {biometrics.latency}ms
                  </p>
                </div>
              </div>
              <div className="glass-card p-4 flex items-center gap-4 border-white/5">
                <div className="p-3 bg-white/5 rounded-xl text-emerald-500">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">
                    Confidence
                  </p>
                  <p className="text-lg font-mono font-bold text-white">
                    {biometrics.confidence}%
                  </p>
                </div>
              </div>
              <div className="glass-card p-4 flex items-center gap-4 border-white/5">
                <div className="p-3 bg-white/5 rounded-xl text-purple-500">
                  <RefreshCw size={20} />
                </div>
                <div>
                  <p className="text-[9px] text-gray-500 font-black uppercase tracking-tighter">
                    Frames
                  </p>
                  <p className="text-lg font-mono font-bold text-white">
                    {biometrics.fps} FPS
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Recent Check-ins */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <User size={14} className="text-cyan-500" /> Recent Check-ins
              </h3>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-10 text-gray-500 text-xs animate-pulse">
                  Loading data...
                </div>
              ) : filteredCheckIns.length > 0 ? (
                filteredCheckIns.map((person) => (
                  <div
                    key={person.id}
                    className="glass-card p-4 flex items-center justify-between border-white/5 hover:border-cyan-500/30 transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50">
                        <User
                          size={18}
                          className="text-gray-500 group-hover:text-cyan-400"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {person.name}
                        </p>
                        <p className="text-[10px] text-gray-500">
                          {person.time}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[9px] font-black px-2 py-1 rounded border italic ${
                        person.status === "Verified"
                          ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20"
                          : "text-amber-400 bg-amber-400/10 border-amber-400/20"
                      }`}
                    >
                      {person.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-gray-600 text-xs italic">
                  No participants found.
                </div>
              )}
            </div>

            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] hover:bg-white/10 transition-all">
              View All Logs
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0%,
          100% {
            top: 20%;
          }
          50% {
            top: 80%;
          }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
      `}</style>
    </>
  );
}
