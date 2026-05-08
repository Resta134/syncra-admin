"use client"; // Wajib karena kita akan pakai state untuk animasi
import Navbar from "@/components/Navbar";
import { Camera, ShieldCheck, Activity, UserCheck, RefreshCw } from 'lucide-react';
import { useState, useEffect } from "react";

export default function FaceAIPage() {
  const [isScanning, setIsScanning] = useState(true);

  return (
    <>
      <Navbar />
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-glow">Face Recognition Check-in</h2>
          <p className="text-gray-400 text-sm">Real-time AI biometric authentication stream.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Camera Feed */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card aspect-video relative overflow-hidden bg-black border-cyan-500/20 shadow-[0_0_50px_rgba(6,182,212,0.1)]">
              {/* Overlay Scanner Animation */}
              {isScanning && (
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className="w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(6,182,212,1)] absolute top-0 animate-[scan_3s_linear_infinite]"></div>
                  {/* Face Bounding Box Simulation */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-cyan-500/50 rounded-3xl border-dashed animate-pulse">
                     <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-cyan-400"></div>
                     <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-cyan-400"></div>
                     <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-cyan-400"></div>
                     <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-cyan-400"></div>
                  </div>
                </div>
              )}
              
              {/* Camera Placeholder */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-700">
                <Camera size={80} className="mb-4 opacity-20" />
                <p className="text-sm font-mono tracking-widest opacity-40 uppercase">System Streaming Active...</p>
              </div>
            </div>

            {/* AI Processing Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="glass-card p-4 flex items-center gap-4">
                <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><Activity size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Latency</p>
                  <p className="text-sm font-mono">24ms</p>
                </div>
              </div>
              <div className="glass-card p-4 flex items-center gap-4">
                <div className="p-2 bg-cyan-500/10 text-cyan-400 rounded-lg"><ShieldCheck size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Confidence</p>
                  <p className="text-sm font-mono">99.2%</p>
                </div>
              </div>
              <div className="glass-card p-4 flex items-center gap-4">
                <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><RefreshCw size={20} /></div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Frames</p>
                  <p className="text-sm font-mono">60 FPS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed Side Panel */}
          <div className="space-y-6">
            <h3 className="font-bold flex items-center gap-2">
              <UserCheck size={18} className="text-cyan-400" />
              Recent Check-ins
            </h3>
            <div className="space-y-4">
              {[
                { name: "Rhiki Sulistiyo", time: "Just now", status: "Verified" },
                { name: "Ahmat Fauzi", time: "2m ago", status: "Verified" },
                { name: "M. Iqbal Saputra", time: "5m ago", status: "Verified" },
              ].map((user, i) => (
                <div key={i} className="glass-card p-4 flex items-center justify-between border-l-4 border-l-emerald-500">
                  <div>
                    <p className="text-sm font-bold">{user.name}</p>
                    <p className="text-[10px] text-gray-500">{user.time}</p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/5 px-2 py-1 rounded">
                    {user.status}
                  </span>
                </div>
              ))}
            </div>
            <button className="w-full py-3 glass-card hover:bg-white/10 transition-all text-xs font-bold tracking-widest text-gray-400 uppercase">
              View All Logs
            </button>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
      `}</style>
    </>
  );
}