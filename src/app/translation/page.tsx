"use client";

import Navbar from "@/components/Navbar";
import { Mic, Globe, Zap, Volume2, History, Languages } from "lucide-react";
import { useEffect, useState } from "react";

export default function TranslationPage() {
  // Solusi untuk error Math.random: Kita simpan tinggi bar di dalam state
  const [barHeights, setBarHeights] = useState<number[]>([]);

  useEffect(() => {
    // Fungsi ini hanya berjalan satu kali setelah komponen muncul di browser (Client Side)
    const generateHeights = () => {
      const heights = Array.from(
        { length: 30 },
        () => Math.floor(Math.random() * 80) + 20,
      );
      setBarHeights(heights);
    };

    generateHeights();
  }, []);

  return (
    <>
      <Navbar />
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-glow text-cyan-400">
              AI Live Translation
            </h2>
            <p className="text-gray-400 text-sm">
              Real-time multilingual stream processing for your events.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-[10px] font-bold">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></div>
              SYSTEM ACTIVE
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-8 min-h-[450px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 blur-[120px] pointer-events-none"></div>

              {/* Audio Visualizer - Diperbaiki agar tidak error */}
              <div className="flex items-end justify-center gap-1.5 h-16 mb-12">
                {barHeights.map((h, i) => (
                  <div
                    key={i}
                    className="w-1 bg-cyan-500/30 rounded-full animate-pulse"
                    style={{
                      height: `${h}%`,
                      animationDelay: `${i * 0.05}s`,
                    }}
                  ></div>
                ))}
              </div>

              {/* Translation Display - Perbaikan Tanda Kutip */}
              <div className="space-y-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    Input Source (ID)
                  </div>
                  <p className="text-2xl font-medium text-white/80 leading-relaxed">
                    {
                      '"Terima kasih telah bergabung di SYNCRA AI, sistem manajemen event masa depan."'
                    }
                  </p>
                </div>

                <div className="space-y-3 p-8 bg-cyan-500/5 border-l-4 border-cyan-500 rounded-xl relative">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em]">
                    <Zap size={10} />
                    AI Instant Translation (EN)
                  </div>
                  <p className="text-3xl font-bold text-cyan-400 text-glow leading-tight italic">
                    {
                      '"Thank you for joining SYNCRA AI, the future of event management systems."'
                    }
                  </p>
                </div>
              </div>

              {/* Interaction Bar */}
              <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex gap-4">
                  <button className="p-4 bg-cyan-500 text-black rounded-2xl hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                    <Mic size={20} />
                  </button>
                  <button className="p-4 glass-card text-gray-400 hover:text-white transition-all">
                    <Volume2 size={20} />
                  </button>
                </div>
                <div className="flex items-center gap-4 px-4 py-2 glass-card border-emerald-500/20">
                  <div className="text-right">
                    <p className="text-[9px] text-gray-500 uppercase font-black">
                      Latency
                    </p>
                    <p className="text-xs font-mono text-emerald-400 tracking-tighter">
                      0.012s
                    </p>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <Languages size={18} className="text-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 space-y-5">
              <h3 className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest text-gray-400">
                <Globe size={14} className="text-cyan-400" /> Language Engine
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center cursor-pointer">
                  <span className="text-xs font-medium">Indonesian</span>
                  <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-gray-400">
                    SRC
                  </span>
                </div>
                <div className="p-4 border border-cyan-500/30 bg-cyan-500/5 rounded-xl flex justify-between items-center cursor-pointer">
                  <span className="text-xs font-bold text-cyan-400">
                    English (US)
                  </span>
                  <span className="text-[9px] bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-400">
                    TGT
                  </span>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 space-y-5 flex-1">
              <h3 className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest text-gray-400">
                <History size={14} className="text-cyan-400" /> Live Transcript
              </h3>
              <div className="space-y-6 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                {[
                  {
                    time: "20:05",
                    text: "Initializing AI translation buffers...",
                  },
                  {
                    time: "20:06",
                    text: "Voice signature recognized: Resta Sabrina",
                  },
                  {
                    time: "20:07",
                    text: "Successfully connected to Global Edge Nodes.",
                  },
                ].map((log, i) => (
                  <div
                    key={i}
                    className="space-y-1 border-b border-white/5 pb-3"
                  >
                    <p className="text-[10px] font-mono text-cyan-500/50">
                      {log.time}
                    </p>
                    <p className="text-[11px] text-gray-400 italic">{`"${log.text}"`}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(6, 182, 212, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}
