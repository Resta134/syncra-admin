"use client";
import Navbar from "@/components/Navbar";
import { Bell, Info, AlertTriangle, CheckCircle } from 'lucide-react';

export default function NotificationsPage() {
  const notifications = [
    { id: 1, type: 'info', text: "New participant 'David L.' verified via Face AI.", time: "2 mins ago" },
    { id: 2, type: 'alert', text: "System latency detected above 50ms in Tokyo Node.", time: "15 mins ago" },
    { id: 3, type: 'success', text: "Syncra AI Translation engine updated to v2.4.", time: "1 hour ago" },
  ];

  return (
    <>
      <Navbar />
      <div className="max-w-4xl space-y-6">
        <h2 className="text-3xl font-bold text-glow text-cyan-400">System Notifications</h2>
        <div className="space-y-4">
          {notifications.map((n) => (
            <div key={n.id} className="glass-card p-5 flex gap-4 items-start border-l-2 border-cyan-500/50">
              <div className="p-2 bg-white/5 rounded-lg">
                {n.type === 'alert' ? <AlertTriangle className="text-amber-500" size={18} /> : 
                 n.type === 'success' ? <CheckCircle className="text-emerald-500" size={18} /> : 
                 <Info className="text-cyan-400" size={18} />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/90">{n.text}</p>
                <p className="text-[10px] text-gray-500 mt-1 uppercase font-bold tracking-widest">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}