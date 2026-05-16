"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Terminal, Shield, CheckCircle, AlertTriangle } from "lucide-react";

export default function ApiDocsPage() {
  const router = useRouter();

  const endpoints = [
    {
      method: "GET",
      path: "/rest/v1/profiles",
      desc: "Mengambil data profil pengguna yang sedang login dan status tingkat tier paket aktif.",
      headers: ["apikey: REQUIRED_ANON_KEY", "Authorization: Bearer USER_JWT_TOKEN"],
      response: `[\n  {\n    "id": "uui-id-user-12345",\n    "full_name": "Resta Sabrina",\n    "email": "resta@example.com",\n    "package_tier": "Professional",\n    "updated_at": "2026-05-16T15:30:00Z"\n  }\n]`
    },
    {
      method: "PATCH",
      path: "/rest/v1/profiles",
      desc: "Mengubah atau memperbarui tingkat tier paket (Pricing) setelah melakukan transaksi.",
      headers: ["apikey: REQUIRED_ANON_KEY", "Authorization: Bearer USER_JWT_TOKEN", "Content-Type: application/json"],
      body: `{\n  "package_tier": "Professional"\n}`,
      response: `{\n  "message": "Successfully updated package tier."\n}`
    },
    {
      method: "POST",
      path: "/rest/v1/events",
      desc: "Membuat data event seminar baru ke dalam sistem database (Khusus Admin/Organizer).",
      headers: ["apikey: REQUIRED_ANON_KEY", "Authorization: Bearer ADMIN_JWT_TOKEN", "Content-Type: application/json"],
      body: `{\n  "title": "AI Future Summit 2026",\n  "description": "Seminar modern membahas masa depan AI.",\n  "event_date": "2026-06-20",\n  "image_url": "https://[id].supabase.co/storage/v1/object/public/EVENT-IMAGES/pamflet.png"\n}`,
      response: `{\n  "id": 88,\n  "status": "Success",\n  "created_at": "2026-05-16T15:31:00Z"\n}`
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans p-6 md:p-12">
      {/* HEADER */}
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 mb-10 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-black tracking-widest text-xs uppercase">
            <Terminal size={14} /> Core Arsitektur Sistem
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Syncra <span className="text-cyan-500 text-glow">AI</span> API Documentation
          </h1>
          <p className="text-gray-500 text-xs">
            Base URL: <code className="bg-white/5 px-2 py-1 rounded text-cyan-300">https://zzcevejojtsnsdrmxnik.supabase.co</code>
          </p>
        </div>
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/10 transition cursor-pointer w-fit"
        >
          <ArrowLeft size={14} /> Kembali
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KIRI: DAFTAR ENDPOINT */}
        <div className="lg:col-span-2 space-y-8">
          {endpoints.map((api, index) => (
            <div key={index} className="glass-card p-6 border-white/5 space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-lg text-xs font-black text-black ${
                  api.method === "GET" ? "bg-green-400" : api.method === "POST" ? "bg-blue-400" : "bg-yellow-400"
                }`}>
                  {api.method}
                </span>
                <code className="text-sm font-bold text-white tracking-wide">{api.path}</code>
              </div>
              
              <p className="text-sm text-gray-400 leading-relaxed">{api.desc}</p>

              {/* HEADERS */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Required Headers</div>
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-1">
                  {api.headers.map((h, i) => (
                    <div key={i} className="text-xs font-mono text-gray-400">{h}</div>
                  ))}
                </div>
              </div>

              {/* REQUEST BODY (JIKA ADA) */}
              {api.body && (
                <div className="space-y-1.5">
                  <div className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Request Body (JSON)</div>
                  <pre className="bg-[#0b0f19] rounded-xl p-4 text-xs font-mono text-cyan-400 overflow-x-auto border border-white/5">
                    {api.body}
                  </pre>
                </div>
              )}

              {/* RESPONSE SUCCESS */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-green-500 font-black uppercase tracking-widest flex items-center gap-1">
                  <CheckCircle size={10} /> Response Success (200/201)
                </div>
                <pre className="bg-[#0b0f19] rounded-xl p-4 text-xs font-mono text-green-400 overflow-x-auto border border-green-500/10">
                  {api.response}
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* KANAN: STATUS CODE & KEAMANAN */}
        <div className="space-y-6">
          {/* CARD KEAMANAN */}
          <div className="glass-card p-6 border-cyan-500/10 bg-cyan-950/5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 mb-3">
              <Shield size={16} className="text-cyan-400" /> Gateway Security
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Arsitektur API diisolasi ketat menggunakan mekanisme <span className="text-cyan-400 font-bold">JSON Web Token (JWT)</span> dan <span className="text-cyan-400 font-bold">Row Level Security (RLS)</span>. Setiap token memuat identitas pengguna untuk membatasi hak akses data secara otomatis di level database.
            </p>
          </div>

          {/* CARD STATUS CODES */}
          <div className="glass-card p-6 border-white/5">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2 mb-4">
              <AlertTriangle size={16} className="text-yellow-400" /> HTTP Status Codes
            </h3>
            <div className="space-y-3">
              {[
                { code: "200 OK", desc: "Permintaan data atau pembaruan paket sukses.", color: "text-green-400" },
                { code: "201 Created", desc: "Data entitas baru (User/Event) berhasil dibuat.", color: "text-blue-400" },
                { code: "401 Unauthorized", desc: "Akses ditolak karena token JWT tidak valid.", color: "text-red-400" },
                { code: "422 Unprocessable", desc: "Eror validasi data, misalnya email duplikat.", color: "text-yellow-400" },
              ].map((status, i) => (
                <div key={i} className="border-b border-white/5 pb-2 last:border-0 last:pb-0">
                  <div className={`text-xs font-mono font-black ${status.color}`}>{status.code}</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{status.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}