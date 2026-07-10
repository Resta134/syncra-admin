"use client";

import Navbar from "@/components/Navbar";
import {
  Search,
  UserCheck,
  UserX,
  Globe,
  MoreVertical,
  Download,
} from "lucide-react";
import { useState, useEffect,useMemo } from 'react';
// Pastikan Anda sudah menginisialisasi client Supabase di file terpisah
// Sesuaikan path import di bawah ini dengan struktur folder Anda (misal: '@/lib/supabase')
import { supabase } from '@/lib/supabase';

interface Participant {
  id: number;
  full_name: string;
  waktu_checkin: string;
}

export default function ParticipantsPage() {
  // 2. Kosongkan state awal
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 3. Ambil data dari Supabase saat komponen dimuat
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const { data, error } = await supabase
          .from("attendance")
          .select("id, full_name, waktu_checkin")
          .order("waktu_checkin", { ascending: false }); // Urutkan dari yang terbaru (opsional)

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

  // 4. Sesuaikan variabel pencarian ke full_name
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) =>
      p.full_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, participants]);

  // 5. Sesuaikan variabel export ke full_name dan waktu_checkin
  const handleExport = () => {
    const headers = ["ID,Full Name,Check-in Time\n"];
    const rows = filteredParticipants.map(
      (p) => `${p.id},${p.full_name},${p.waktu_checkin}\n`
    );

    const blob = new Blob([...headers, ...rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "syncro_participants.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <Navbar />
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-glow text-white-400">
              Participant Directory
            </h2>
            <p className="text-gray-400 text-sm">
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
              placeholder="Search syncro AI..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111111] border border-white/5 rounded-xl py-4 pl-10 pr-4 focus:outline-none focus:border-cyan-500/50 transition-all text-sm text-white"
            />
          </div>
          <div className="glass-card px-4 py-3 flex items-center justify-between border border-white/5">
            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
              Total Present
            </span>
            <span className="text-xl font-bold text-cyan-400">
              {filteredParticipants.length.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="glass-card overflow-hidden bg-[#0a0a0a] border border-white/5 rounded-2xl">
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
                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400 uppercase">
                          {/* 6. Update variabel UI ke full_name */}
                          {p.full_name ? p.full_name.charAt(0) : "?"}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {p.full_name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-white-500 font-mono">
                      {/* 7. Update variabel UI ke waktu_checkin */}
                      {p.waktu_checkin}
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
      </div>
    </>
  );}
