"use client";
import Navbar from "@/components/Navbar";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Filter, TrendingUp, Zap, Languages, Brain } from 'lucide-react';

const attendanceData = [
  { name: '09:00', value: 400 },
  { name: '10:00', value: 1200 },
  { name: '11:00', value: 900 },
  { name: '12:00', value: 1500 },
  { name: '13:00', value: 2100 },
  { name: '14:00', value: 1800 },
];

const languageData = [
  { name: 'English', value: 45 },
  { name: 'Indonesian', value: 35 },
  { name: 'Mandarin', value: 20 },
];

const COLORS = ['#06b6d4', '#3b82f6', '#1e1b4b'];

export default function AnalyticsPage() {
  return (
    <>
      <Navbar />
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-glow">System Analytics</h2>
            <p className="text-gray-400 text-sm">Deep insights into Syncra AI performance and engagement.</p>
          </div>
          <button className="flex items-center gap-2 glass-card px-4 py-2 text-sm text-cyan-400 hover:bg-white/5 transition-all">
            <Download size={16} /> Export Report
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card p-6 border-l-4 border-l-cyan-500">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">Avg. AI Accuracy</p>
              <Brain size={18} className="text-cyan-500" />
            </div>
            <h3 className="text-3xl font-bold italic">98.8%</h3>
            <p className="text-[10px] text-emerald-400 mt-2 flex items-center gap-1">
              <TrendingUp size={12} /> +1.2% from last event
            </p>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-blue-500">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">Live Translations</p>
              <Languages size={18} className="text-blue-500" />
            </div>
            <h3 className="text-3xl font-bold italic">14.2k</h3>
            <p className="text-[10px] text-gray-500 mt-2 uppercase tracking-tighter">Processed Sentences</p>
          </div>
          <div className="glass-card p-6 border-l-4 border-l-purple-500">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-400 text-xs uppercase font-bold tracking-widest">Processing Speed</p>
              <Zap size={18} className="text-purple-500" />
            </div>
            <h3 className="text-3xl font-bold italic">18ms</h3>
            <p className="text-[10px] text-emerald-400 mt-2 uppercase tracking-tighter">Peak Performance</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Attendance Chart */}
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="text-sm font-bold mb-6 flex items-center gap-2">Realtime Attendance Flow</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#06b6d4', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#06b6d4" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Language Pie Chart */}
          <div className="glass-card p-6 flex flex-col">
            <h3 className="text-sm font-bold mb-6">Language Distribution</h3>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={languageData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 w-full text-[10px]">
                {languageData.map((lang, i) => (
                  <div key={lang.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }}></div>
                    <span className="text-gray-400">{lang.name}: {lang.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}