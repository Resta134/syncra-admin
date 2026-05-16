"use client";
import { useState } from "react";

export default function DebugPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test-db');
      const result = await res.json();
      setStatus(result);
    } catch (err) {
      setStatus({ success: false, error: "Gagal memanggil API" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12 bg-[#020205] min-h-screen text-white font-sans">
      <div className="max-w-2xl mx-auto border border-white/10 p-8 rounded-2xl bg-white/5">
        <h1 className="text-2xl font-bold mb-4 italic text-purple-500">Syncra Database Debugger</h1>
        <p className="text-gray-400 text-sm mb-8 font-bold uppercase tracking-widest">
          Status Koneksi: {status?.success ? "✅ TERKONEKSI" : "❌ BELUM TERHUBUNG"}
        </p>

        <button 
          onClick={checkConnection}
          disabled={loading}
          className="px-6 py-3 bg-purple-600 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-purple-500 transition-all shadow-lg"
        >
          {loading ? "Mengecek..." : "Tes Koneksi Sekarang"}
        </button>

        {status && (
          <div className="mt-8 p-4 bg-black/40 rounded-lg border border-white/5">
            <p className="text-[10px] font-bold text-gray-500 uppercase mb-2">Hasil Response API:</p>
            <pre className="text-xs text-emerald-400 overflow-auto">
              {JSON.stringify(status, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}