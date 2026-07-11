"use client";

import Navbar from "@/components/Navbar";
import {
  Search,
  Download,
} from "lucide-react";
import { useState, useEffect, useMemo } from 'react';
// Pastikan Anda sudah menginisialisasi client Supabase di file terpisah
import { supabase } from '@/lib/supabase';

interface Participant {
  id: number;
  full_name: string;
  waktu_checkin: string;
}

export default function ParticipantsPage() {
  // 2. State awal
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 3. Ambil data dari Supabase saat komponen dimuat
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        // 1. Tambahkan benteng pengaman di sini
        if (!supabase) {
          console.warn("⚠️ Supabase client belum siap.");
          setIsLoading(false);
          return;
        }

        // 2. Di bawah ini TypeScript dijamin aman dan aman dari error 'possibly null'
        const { data, error } = await supabase
          .from("attendance")
          .select("id, full_name, waktu_checkin")
          .order("waktu_checkin", { ascending: false }); 

        if (error) {
          console.error("Error fetching data dari Supabase:", error);
          return;
        }

        if (data) {
          setParticipants(data);
        }
      } catch (error) {
        console.error("Unexpected error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  // 4. Filter pencarian berdasarkan nama lengkap
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) =>
      p.full_name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, participants]);

  // 5. Ekspor data ke CSV dengan aman
  const handleExport = () => {
    const headers = "ID,Full Name,Check-in Time\n";
    const rows = filteredParticipants.map(
      // Membungkus nama dengan kutip dua "" untuk mencegah bug pemisahan kolom jika nama mengandung koma
      (p) => `${p.id},"${p.full_name.replace(/"/g, '""')}",${p.waktu_checkin}\n`
    );

    const blob = new Blob([headers + rows.join("")], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "syncra_participants.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Helper untuk mempercantik format waktu
  const formatDateTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoString;
    }
  };

  return (
    <>
      <Navbar />
      {/* Ditambahkan padding pembungkus halaman (bisa disesuaikan jika sudah ada di layout.tsx) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            {/* Perbaikan typo kelas warna: text-white-400 diubah menjadi text-white atau text-cyan-400 */}
            <h2 className="text-3xl font-bold text-glow text-white">
              Participant Directory
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Manage and verify event attendees with AI Biometrics.
            </p>
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-transparent border border-white/20 hover:bg-white/5 text-white px-6 py-2.5 rounded-xl text-sm transition-all cursor-pointer"
          >
            <Download size={16} /> Export Data
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              placeholder="Search syncra AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111111] border border-white/5 rounded-xl py-4 pl-10 pr-4 focus:outline-none focus:border-cyan-500/50 transition-all text-sm text-white"
            />
          </div>
          <div className="glass-card px-4 py-3 flex items-center justify-between border border-white/5 rounded-xl bg-[#111111]">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              Total Present
            </span>
            <span className="text-xl font-bold text-cyan-400">
              {filteredParticipants.length.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="glass-card overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl">
          <div className="overflow-x-auto"> {/* Responsif jika layar HP kekecilan */}
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-5">Participant</th>
                  <th className="px-6 py-5">Last Check-in</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {isLoading ? (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-6 py-20 text-center text-gray-500 text-sm"
                    >
                      Memuat data dari database...
                    </td>
                  </tr>
                ) : filteredParticipants.length > 0 ? (
                  filteredParticipants.map((p) => (
                    <tr
                      key={p.id}
                      className="hover:bg-white/[0.02] transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400 uppercase flex-shrink-0">
                            {p.full_name ? p.full_name.charAt(0) : "?"}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                              {p.full_name}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Perbaikan typo kelas warna: text-white-500 diubah menjadi text-gray-400 */}
                      <td className="px-6 py-4 text-xs text-gray-400 font-mono">
                        {formatDateTime(p.waktu_checkin)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={2}
                      className="px-6 py-20 text-center text-gray-500 text-sm italic"
                    >
                      No participants found for "{searchQuery}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest font-bold px-2">
          <p>
            Showing {filteredParticipants.length} of {participants.length}{" "}
            Participants
          </p>
          <div className="flex gap-6">
            <button className="hover:text-cyan-400 transition-colors cursor-pointer disabled:opacity-30">
              Previous
            </button>
            <button className="hover:text-cyan-400 transition-colors cursor-pointer disabled:opacity-30">
              Next
            </button>
          </div>
        </div>
      </main>
    </>
  );
}