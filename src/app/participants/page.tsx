"use client"; // Wajib ada di baris paling atas

import Navbar from "@/components/Navbar";
import { Search, UserCheck, UserX, Globe, MoreVertical, Download } from 'lucide-react';

// Data simulasi peserta
const participantsData = [
  { id: 1, name: "Rhiki Sulistiyo", email: "rhiki@syncra.ai", status: "Verified", language: "Indonesian", confidence: "99.8%", lastSeen: "10:45 AM" },
  { id: 2, name: "Ahmat Fauzi", email: "fauzi@syncra.ai", status: "Verified", language: "English", confidence: "98.2%", lastSeen: "10:50 AM" },
  { id: 3, name: "M. Iqbal Saputra", email: "iqbal@syncra.ai", status: "Pending", language: "Indonesian", confidence: "N/A", lastSeen: "Waiting" },
  { id: 4, name: "David L.", email: "david@enterprise.com", status: "Verified", language: "English", confidence: "97.5%", lastSeen: "11:02 AM" },
  { id: 5, name: "Siti Aminah", email: "siti@event.com", status: "Verified", language: "Mandarin", confidence: "99.1%", lastSeen: "11:15 AM" },
];

// Pastikan ada kata 'export default' sebelum 'function'
export default function ParticipantsPage() {
  return (
    <>
      <Navbar />
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-glow text-cyan-400">Participant Directory</h2>
            <p className="text-gray-400 text-sm">Manage and verify event attendees with AI Biometrics.</p>
          </div>
          <button className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-xl text-sm transition-all">
            <Download size={16} />
            Export Data
          </button>
        </div>

        {/* Search & Stats Section */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name, email, or language..." 
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500/50 transition-all text-sm text-white"
                />
            </div>
            <div className="glass-card px-4 py-3 flex items-center justify-between">
                <span className="text-gray-400 text-[10px] font-bold uppercase">Total Present</span>
                <span className="text-xl font-bold text-cyan-400">1,240</span>
            </div>
        </div>

        {/* Participant Table */}
        <div className="glass-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                <th className="px-6 py-4">Participant</th>
                <th className="px-6 py-4">Face Status</th>
                <th className="px-6 py-4">Confidence</th>
                <th className="px-6 py-4">Language</th>
                <th className="px-6 py-4">Last Check-in</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {participantsData.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-400">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover:text-cyan-400 transition-colors text-white">{p.name}</p>
                        <p className="text-[10px] text-gray-500">{p.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold border ${
                      p.status === 'Verified' 
                      ? 'border-emerald-500/30 text-emerald-400 bg-emerald-400/10' 
                      : 'border-amber-500/30 text-amber-400 bg-amber-400/10'
                    }`}>
                      {p.status === 'Verified' ? <UserCheck size={12} /> : <UserX size={12} />}
                      {p.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]" 
                          style={{ width: p.confidence !== 'N/A' ? p.confidence : '0%' }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono text-gray-400">{p.confidence}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-300">
                      <Globe size={12} className="text-cyan-500" />
                      {p.language}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-500 font-mono">
                    {p.lastSeen}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center text-[10px] text-gray-500 uppercase tracking-widest font-bold px-2">
            <p>Showing 5 of 1,240 Participants</p>
            <div className="flex gap-4">
                <button className="hover:text-cyan-400 transition-colors cursor-pointer">Previous</button>
                <button className="hover:text-cyan-400 transition-colors cursor-pointer">Next</button>
            </div>
        </div>
      </div>
    </>
  );
}