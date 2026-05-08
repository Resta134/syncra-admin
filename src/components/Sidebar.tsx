import { LayoutDashboard, Calendar, Users, BarChart3, Settings, Languages, Zap } from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Calendar, label: 'Events', href: '/events' },
  { icon: Users, label: 'Participants', href: '/participants' },
  { icon: Zap, label: 'Face AI', href: '/face-ai' },
  { icon: Languages, label: 'AI Translation', href: '/translation' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 h-screen border-r border-white/10 p-6 flex flex-col fixed left-0 top-0 bg-[#050505]">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)]">
          <span className="font-bold text-black text-xs">S</span>
        </div>
        <h1 className="text-xl font-bold tracking-wider text-glow text-cyan-400">SYNCRA AI</h1>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all hover:bg-white/5 hover:text-cyan-400 text-gray-400"
          >
            <item.icon size={20} />
            <span className="font-medium text-sm">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}