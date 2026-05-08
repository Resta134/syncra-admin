import Navbar from "@/components/Navbar";
import { Users, Calendar, Languages, Zap } from "lucide-react";

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl font-bold text-glow">Dashboard Overview</h2>
          <p className="text-gray-400 text-sm">
            Real-time performance of SYNCRA AI system.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Events", val: "128", icon: Calendar },
            { label: "Active Participants", val: "3,421", icon: Users },
            { label: "AI Accuracy", val: "98.2%", icon: Zap },
            {
              label: "Translation Active",
              val: "14 Latencies",
              icon: Languages,
            },
          ].map((kpi) => (
            <div key={kpi.label} className="glass-card p-6">
              <div className="p-2 bg-cyan-500/10 w-fit rounded-lg text-cyan-400 mb-4">
                <kpi.icon size={20} />
              </div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">
                {kpi.label}
              </p>
              <h3 className="text-2xl font-bold mt-1 tracking-tight">
                {kpi.val}
              </h3>
            </div>
          ))}
        </div>

        <div className="glass-card h-80 flex items-center justify-center border-dashed border-white/20">
          <p className="text-gray-500 animate-pulse italic text-sm">
            Ready to visualize Syncra analytics...
          </p>
        </div>
      </div>
    </>
  );
}
