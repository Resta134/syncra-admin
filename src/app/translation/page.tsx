"use client";

import Navbar from "@/components/Navbar";
import {
  Mic,
  Globe,
  Zap,
  Volume2,
  History,
  Languages,
  Save,
  FileUp,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function TranslationPage() {
  // State untuk melacak bahasa yang dipilih
  const [sourceLang, setSourceLang] = useState("Indonesian");
  const [targetLang, setTargetLang] = useState("English (US)");

  // Daftar bahasa yang tersedia di sistem Syncro
  const availableLanguages = [
    "Indonesian",
    "English (US)",
  ];

  // Fungsi ganti bahasa (simulasi)
  const toggleSource = () => {
    const nextIndex =
      (availableLanguages.indexOf(sourceLang) + 1) % availableLanguages.length;
    setSourceLang(availableLanguages[nextIndex]);
  };

  const toggleTarget = () => {
    const nextIndex =
      (availableLanguages.indexOf(targetLang) + 1) % availableLanguages.length;
    setTargetLang(availableLanguages[nextIndex]);
  };

  // State untuk Audio Visualizer agar tidak hydration error
  const [barHeights, setBarHeights] = useState<number[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  // Data Simulasi Transkrip yang akan dikelola admin
  const [transcriptLogs] = useState([
    { time: "20:05", text: "Initializing AI translation buffers..." },
    { time: "20:06", text: "Voice signature recognized: Resta Sabrina" },
    { time: "20:07", text: "Successfully connected to Global Edge Nodes." },
    { time: "20:08", text: "Terima kasih telah bergabung di SYNCRO AI." },
  ]);

  useEffect(() => {
    // Generate tinggi bar sekali saja di sisi client
    const heights = Array.from(
      { length: 30 },
      () => Math.floor(Math.random() * 80) + 20,
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBarHeights(heights);
  }, []);

  // FUNGSI: Download Transkrip untuk Admin & User
  const handleSaveTranscript = () => {
    const content = transcriptLogs
      .map((log) => `[${log.time}] ${log.text}`)
      .join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Syncro_Live_Transcript.txt";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // FUNGSI: Simulasi Upload Materi (Pamflet/Slide)
  const handleUploadMaterial = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.ppt,.pptx,.jpg,.png";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        alert(
          `Materi "${file.name}" berhasil diunggah dan akan tampil di aplikasi User.`,
        );
      }
    };
    input.click();
  };

  return (
    <>
      <Navbar />
      <div className="space-y-8 pb-10">
        {/* Header dengan tombol aksi baru */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-glow text-cyan-400 uppercase tracking-tight">
              AI Live Translation
            </h2>
            <p className="text-gray-400 text-sm">
              Real-time multilingual stream processing for your events.
            </p>
          </div>

          <div className="flex gap-3">
            {/* Action: Upload Materi untuk User */}
            <button
              onClick={handleUploadMaterial}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer shadow-lg"
            >
              <FileUp size={14} /> UPLOAD MATERI
            </button>

            {/* Action: Simpan Transkrip */}
            <button
              onClick={handleSaveTranscript}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-black text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <Save size={14} /> SAVE TRANSCRIPT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Monitor Panel */}
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-8 min-h-[480px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 blur-[120px] pointer-events-none"></div>

              {/* Audio Visualizer */}
              <div className="flex items-end justify-center gap-1.5 h-16 mb-12">
                {barHeights.length > 0 ? (
                  barHeights.map((h, i) => (
                    <div
                      key={i}
                      className={`w-1 rounded-full transition-all duration-300 ${isRecording ? "bg-cyan-400 animate-pulse" : "bg-white/10"}`}
                      style={{
                        height: isRecording ? `${h}%` : "20%",
                        animationDelay: `${i * 0.05}s`,
                      }}
                    ></div>
                  ))
                ) : (
                  <div className="text-[10px] text-gray-600 font-mono">
                    INITIALIZING AI ENGINE...
                  </div>
                )}
              </div>

              {/* Translation Display */}
              <div className="space-y-10">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                    <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                    Input Source (ID)
                  </div>
                  <p className="text-2xl font-medium text-white/80 leading-relaxed italic">
                    {
                      '"Terima kasih telah bergabung di SYNCRO AI, sistem manajemen event masa depan."'
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
                      '"Thank you for joining SYNCRO AI, the future of event management systems."'
                    }
                  </p>
                </div>
              </div>

              {/* Interaction Bar */}
              <div className="mt-12 flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => setIsRecording(!isRecording)}
                    className={`p-4 rounded-2xl transition-all shadow-lg cursor-pointer ${isRecording ? "bg-red-500 text-white animate-pulse" : "bg-cyan-500 text-black hover:scale-105"}`}
                  >
                    <Mic size={20} />
                  </button>
                  <button className="p-4 glass-card text-gray-400 hover:text-white transition-all cursor-pointer">
                    <Volume2 size={20} />
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest mb-1">
                    Status
                  </p>
                  <p className="text-[10px] text-emerald-400 font-mono tracking-tighter">
                    BROADCASTING TO USERS
                  </p>
                </div>
                <div className="flex items-center gap-4 px-4 py-2 glass-card border-emerald-500/20">
                  <div className="text-right">
                    <p className="text-[9px] text-gray-500 uppercase font-black">
                      Latency
                    </p>
                    <p className="text-xs font-mono text-emerald-400">0.012s</p>
                  </div>
                  <div className="w-px h-8 bg-white/10"></div>
                  <Languages size={18} className="text-cyan-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="glass-card p-6 space-y-5">
            <h3 className="text-xs font-bold flex items-center gap-2 uppercase tracking-widest text-gray-400">
              <Globe size={14} className="text-cyan-400" /> Language Engine
            </h3>
            <div className="space-y-3 text-xs">
              {/* Source Language Selector */}
              <div
                onClick={toggleSource}
                className="p-4 bg-white/5 border border-white/10 rounded-xl flex justify-between items-center group cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all"
              >
                <div>
                  <p className="text-[8px] text-gray-500 uppercase font-black mb-1">
                    Source Language
                  </p>
                  <span className="font-medium text-white">{sourceLang}</span>
                </div>
                <span className="text-[9px] bg-white/10 px-2 py-0.5 rounded text-gray-400 uppercase font-bold">
                  Src
                </span>
              </div>

              {/* Target Language Selector */}
              <div
                onClick={toggleTarget}
                className="p-4 border border-cyan-500/30 bg-cyan-500/5 rounded-xl flex justify-between items-center group cursor-pointer hover:bg-cyan-500/10 hover:border-cyan-500 transition-all"
              >
                <div>
                  <p className="text-[8px] text-cyan-500/50 uppercase font-black mb-1">
                    Target Language
                  </p>
                  <span className="font-bold text-cyan-400">{targetLang}</span>
                </div>
                <span className="text-[9px] bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-400 uppercase font-bold">
                  Tgt
                </span>
              </div>
            </div>
            <p className="text-[9px] text-gray-600 italic text-center">
              {"*Click to switch between available AI voice models."}
            </p>
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
