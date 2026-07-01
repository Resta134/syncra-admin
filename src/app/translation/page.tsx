"use client";

import Navbar from "@/components/Navbar";
import {
  Mic,
  Globe,
  Zap,
  Volume2,
  Languages,
  Save,
  FileUp,
} from "lucide-react";
import { useEffect, useState } from "react";
// Import Supabase Client (Sesuaikan path-nya!)
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseKey);

// Tipe Data untuk Transkrip
type TranscriptLog = {
  id: string;
  event_id: string;
  speaker: string;
  original_text: string;
  translated_text: string;
  language: string;
  created_at: string;
};

export default function TranslationPage() {
  // --- STATE MANAJEMEN ---
  const [sourceLang, setSourceLang] = useState("Indonesian");
  const [targetLang, setTargetLang] = useState("English (US)");
  const [barHeights, setBarHeights] = useState<number[]>([]);

  // State untuk Real-time Database
  const [transcriptLogs, setTranscriptLogs] = useState<TranscriptLog[]>([]);
  const [isRecording, setIsRecording] = useState(false); // Bisa dihubungkan jika admin butuh pause siaran

  // Asumsi: Admin memilih event dengan ID tertentu.
  // Untuk sementara kita gunakan ID statis (atau bisa ambil dari props/URL).
  // GANTI INI dengan event_id yang valid di database Supabase kamu!
  const currentEventId = "MASUKKAN-UUID-EVENT-YANG-SEDANG-AKTIF-DI-SINI";

  // --- EFEK: SETUP VISUALIZER ---
  useEffect(() => {
    const heights = Array.from(
      { length: 30 },
      () => Math.floor(Math.random() * 80) + 20,
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBarHeights(heights);
  }, []);

  // --- EFEK: AMBIL DATA & DENGARKAN SUPABASE REAL-TIME ---
  useEffect(() => {
    // 1. Ambil data transkrip historis saat halaman pertama dibuka
    const fetchTranscripts = async () => {
      try {
        const { data, error } = await supabase
          .from("transcripts")
          .select("*")
          // .eq('event_id', currentEventId) // Buka komen ini kalau mau filter per event
          .order("created_at", { ascending: false }) // Yang terbaru di atas
          .limit(20);

        if (error) throw error;
        if (data) setTranscriptLogs(data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Gagal mengambil transkrip:", error.message);
      }
    };

    fetchTranscripts();

    // 2. Berlangganan (Subscribe) ke perubahan baru di tabel transcripts
    const transcriptChannel = supabase
      .channel("public:transcripts")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transcripts",
          // filter: `event_id=eq.${currentEventId}` // Buka komen ini kalau mau spesifik 1 event
        },
        (payload) => {
          console.log("Transkrip baru masuk!", payload.new);
          // Tambahkan data baru ke bagian paling atas list
          setTranscriptLogs((prevLogs) => [
            payload.new as TranscriptLog,
            ...prevLogs,
          ]);
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setIsRecording(true); // Animasi nyala kalau terhubung
        }
      });

    // Cleanup saat komponen ditutup
    return () => {
      supabase.removeChannel(transcriptChannel);
    };
  }, []);

  // --- FUNGSI UI ---
  const availableLanguages = ["Indonesian", "English (US)"];
  const toggleSource = () =>
    setSourceLang(
      availableLanguages[
        (availableLanguages.indexOf(sourceLang) + 1) % availableLanguages.length
      ],
    );
  const toggleTarget = () =>
    setTargetLang(
      availableLanguages[
        (availableLanguages.indexOf(targetLang) + 1) % availableLanguages.length
      ],
    );

  // FUNGSI: Download Transkrip dari Database ke TXT
  const handleSaveTranscript = () => {
    if (transcriptLogs.length === 0)
      return alert("Belum ada transkrip untuk disimpan!");

    // Susun log dari yang paling lama ke terbaru untuk file teks
    const content = [...transcriptLogs]
      .reverse()
      .map((log) => {
        const time = new Date(log.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        return `[${time}] ${log.speaker} (ID): ${log.original_text}\n[${time}] System (EN): ${log.translated_text}\n`;
      })
      .join("\n");

    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Syncra_Transcript_${new Date().getTime()}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleUploadMaterial = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.ppt,.pptx,.jpg,.png";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) alert(`Materi "${file.name}" berhasil diunggah.`);
    };
    input.click();
  };

  return (
    <>
      <Navbar />
      <div className="space-y-8 pb-10">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-glow text-white-400 tracking-tight">
              AI Live Translation
            </h2>
            <p className="text-gray-400 text-sm">
              Real-time multilingual stream processing for your events.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleUploadMaterial}
              className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-400 hover:text-white hover:bg-white/10 transition-all shadow-lg"
            >
              <FileUp size={14} /> UPLOAD MATERI
            </button>
            <button
              onClick={handleSaveTranscript}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-[10px] font-black text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all shadow-[0_0_15px_rgba(6,182,212,0.2)]"
            >
              <Save size={14} /> SAVE TRANSCRIPT
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="glass-card p-8 min-h-[480px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/10 blur-[120px] pointer-events-none"></div>

              {/* Audio Visualizer */}
              <div className="flex items-end justify-center gap-1.5 h-16 mb-8">
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
              <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-4">
                {transcriptLogs.length > 0 ? (
                  <div className="space-y-10">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                        <div className="w-2 h-2 rounded-full bg-gray-600 animate-pulse"></div>
                        Input Source ({transcriptLogs[0].language.toUpperCase()}
                        ) - {transcriptLogs[0].speaker}
                      </div>
                      <p className="text-2xl font-medium text-white/80 leading-relaxed italic">
                        {transcriptLogs[0].original_text}
                      </p>
                    </div>

                    <div className="space-y-3 p-8 bg-cyan-500/5 border-l-4 border-cyan-500 rounded-xl relative">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em]">
                        <Zap size={10} /> AI Instant Translation
                      </div>
                      <p className="text-3xl font-bold text-cyan-400 text-glow leading-tight italic">
                        {transcriptLogs[0].translated_text}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500 italic">
                    <Mic size={48} className="mb-4 opacity-20" />
                    <p>Menunggu pemateri untuk mulai berbicara...</p>
                  </div>
                )}
              </div>

              {/* Interaction Bar */}
              <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                <div className="flex gap-4">
                  <button
                    className={`p-4 rounded-2xl transition-all shadow-lg ${isRecording ? "bg-red-500 text-white animate-pulse" : "bg-cyan-500 text-black"}`}
                  >
                    <Mic size={20} />
                  </button>
                  <button className="p-4 glass-card text-gray-400 hover:text-white transition-all">
                    <Volume2 size={20} />
                  </button>
                </div>
                <div className="text-center">
                  <p className="text-[9px] text-gray-600 uppercase font-bold tracking-widest mb-1">
                    Status
                  </p>
                  <p
                    className={`text-[10px] font-mono tracking-tighter ${isRecording ? "text-emerald-400" : "text-gray-500"}`}
                  >
                    {isRecording ? "LISTENING TO SUPABASE..." : "OFFLINE"}
                  </p>
                </div>
                <div className="flex items-center gap-4 px-4 py-2 glass-card border-emerald-500/20">
                  <div className="text-right">
                    <p className="text-[9px] text-gray-500 uppercase font-black">
                      Total Logs
                    </p>
                    <p className="text-xs font-mono text-emerald-400">
                      {transcriptLogs.length}
                    </p>
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
