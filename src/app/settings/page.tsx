"use client";

import Navbar from "@/components/Navbar";
import { useState } from "react";
import { 
  Settings, 
  Key, 
  UserCog, 
  ShieldCheck, 
  Bell, 
  Save, 
  Cpu 
} from 'lucide-react';

export default function SettingsPage() {
  const [faceThreshold, setFaceThreshold] = useState(85);

  return (
    <>
      <Navbar />
      <div className="space-y-8 pb-10">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-glow text-cyan-400 uppercase tracking-tight">System Settings</h2>
            <p className="text-gray-400 text-sm font-medium">Configure SYNCRA AI engine and administrative controls.</p>
          </div>
          <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer">
            <Save size={18} />
            Save Changes
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section 1: AI & API Configuration */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-sm font-bold flex items-center gap-2 text-cyan-400 uppercase tracking-widest">
                <Cpu size={18} /> Advanced AI Configuration
              </h3>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">Face Recognition Threshold</label>
                  <div className="flex items-center gap-6 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <input 
                      type="range" 
                      min="50" 
                      max="100" 
                      value={faceThreshold} 
                      onChange={(e) => setFaceThreshold(parseInt(e.target.value))}
                      className="flex-1 accent-cyan-500 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-lg font-mono font-bold text-cyan-400 w-16 text-right">{faceThreshold}%</span>
                  </div>
                  <p className="text-[10px] text-gray-500 italic px-2">
                    {"*Higher threshold increases biometric security but may increase latency in recognition."}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">AI API Endpoint</label>
                    <input 
                      type="text" 
                      defaultValue="https://api.syncra.ai/v1/vision"
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-cyan-500/50 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-gray-500 uppercase font-black tracking-widest">System Secret Key</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        defaultValue="••••••••••••••••"
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-sm focus:outline-none focus:border-cyan-500/50 text-white"
                      />
                      <Key className="absolute right-3 top-3 text-gray-600" size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Security Toggle Panel */}
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-sm font-bold flex items-center gap-2 text-emerald-400 uppercase tracking-widest">
                <ShieldCheck size={18} /> Security & Protocols
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Two-Factor Authentication", desc: "Require identity verification for admin access.", active: true },
                  { label: "Biometric Data Encryption", desc: "Automatically encrypt all face recognition logs.", active: true },
                  { label: "Public API Integration", desc: "Allow external plugins to access translation nodes.", active: false },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/[0.04] transition-all">
                    <div>
                      <p className="text-sm font-bold text-white">{item.label}</p>
                      <p className="text-[10px] text-gray-500 font-medium">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.active} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-400 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500 peer-checked:after:bg-white shadow-inner"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Sidebar Controls */}
          <div className="space-y-6">
            <div className="glass-card p-6 space-y-6">
              <h3 className="text-sm font-bold flex items-center gap-2 text-purple-400 uppercase tracking-widest">
                <UserCog size={18} /> Access Roles
              </h3>
              <div className="space-y-3">
                {['Super Admin', 'Event Moderator', 'AI Support'].map((role) => (
                  <div key={role} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl text-xs group hover:border-cyan-500/30 transition-all">
                    <span className="font-medium text-gray-300">{role}</span>
                    <button className="text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity font-bold">CONFIG</button>
                  </div>
                ))}
                <button className="w-full py-3 border border-dashed border-white/10 rounded-xl text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 hover:border-cyan-500/50 hover:text-cyan-400 transition-all">
                  + Register New Role
                </button>
              </div>
            </div>

            <div className="glass-card p-6 space-y-5">
              <h3 className="text-sm font-bold flex items-center gap-2 text-amber-400 uppercase tracking-widest">
                <Bell size={18} /> Alerts
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-medium">Real-time System Alerts</span>
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-cyan-500" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-medium">Weekly Performance Audit</span>
                  <input type="checkbox" className="w-4 h-4 accent-cyan-500" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}