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
import { useState, useMemo } from "react";

interface Participant {
  id: number;
  name: string;
  email: string;
  status: string;
  language: string;
  confidence: string;
  lastSeen: string;
}

export default function ParticipantsPage() {
  const [participants] = useState<Participant[]>([
    {
      id: 1,
      name: "Rhiki Sulistiyo",
      email: "rhiki@syncro.ai",
      status: "Verified",
      language: "Indonesian",
      confidence: "99.8%",
      lastSeen: "10:45 AM",
    },
    {
      id: 2,
      name: "Ahmat Fauzi",
      email: "fauzi@syncro.ai",
      status: "Verified",
      language: "English",
      confidence: "98.2%",
      lastSeen: "10:50 AM",
    },
    {
      id: 3,
      name: "M. Iqbal Saputra",
      email: "iqbal@syncro.ai",
      status: "Pending",
      language: "Indonesian",
      confidence: "N/A",
      lastSeen: "Waiting",
    },
    {
      id: 4,
      name: "David L.",
      email: "david@enterprise.com",
      status: "Verified",
      language: "English",
      confidence: "97.5%",
      lastSeen: "11:02 AM",
    },
    {
      id: 5,
      name: "Siti Aminah",
      email: "siti@event.com",
      status: "Verified",
      language: "Mandarin",
      confidence: "99.1%",
      lastSeen: "11:15 AM",
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  // Fungsi Pencarian Berfungsi (Sesuai dengan input di image_87ba56.png)
  const filteredParticipants = useMemo(() => {
    return participants.filter(
      (p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.language.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, participants]);

  // Fungsi Export Data ke CSV
  const handleExport = () => {
    const headers = ["ID,Name,Email,Status,Language,Confidence,Last Seen\n"];
    const rows = filteredParticipants.map(
      (p) =>
        `${p.id},${p.name},${p.email},${p.status},${p.language},${p.confidence},${p.lastSeen}\n`,
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
                <th className="px-6 py-5">Face Status</th>
                <th className="px-6 py-5 text-center">Confidence</th>
                <th className="px-6 py-5">Language</th>
                <th className="px-6 py-5">Last Check-in</th>
                {/* <th className="px-6 py-5 text-right">Action</th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredParticipants.length > 0 ? (
                filteredParticipants.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-xs font-bold text-cyan-400">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors">
                            {p.name}
                          </p>
                          <p className="text-[10px] text-gray-500">{p.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-bold border ${
                          p.status === "Verified"
                            ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                            : "border-amber-500/30 text-amber-400 bg-amber-400/10"
                        }`}
                      >
                        {p.status === "Verified" ? (
                          <UserCheck size={12} />
                        ) : (
                          <UserX size={12} />
                        )}
                        {p.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                            style={{
                              width:
                                p.confidence !== "N/A" ? p.confidence : "0%",
                            }}
                          ></div>
                        </div>
                        <span className="text-[10px] font-mono text-gray-500">
                          {p.confidence}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-300">
                        <Globe size={14} className="text-cyan-500" />
                        {p.language}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                      {p.lastSeen}
                    </td>
                    {/* <td className="px-6 py-4 text-right">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-gray-600 hover:text-white transition-all cursor-pointer">
                        <MoreVertical size={18} />
                      </button>
                    </td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-20 text-center text-gray-500 text-sm italic"
                  >
                    No participants found for {searchQuery}
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
  );
}
