import Navbar from "@/components/Navbar";
import { Plus, Search, Filter, Calendar as CalIcon, Users, Globe } from 'lucide-react';

const eventsData = [
  {
    id: 1,
    title: "Global Tech Summit 2026",
    status: "Ongoing",
    date: "May 15, 2026 - 09:00 AM",
    speaker: "Dr. Aris Setiawan",
    participants: 1240,
    translation: true,
  },
  {
    id: 2,
    title: "AI & Future Logistics",
    status: "Upcoming",
    date: "June 02, 2026 - 13:00 PM",
    speaker: "Resta Sabrina",
    participants: 450,
    translation: true,
  },
  {
    id: 3,
    title: "Smart City Tegal Workshop",
    status: "Completed",
    date: "April 20, 2026 - 10:00 AM",
    speaker: "Muhammad Iqbal",
    participants: 890,
    translation: false,
  }
];

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-glow">Event Management</h2>
            <p className="text-gray-400 text-sm">Create and monitor your AI-powered events.</p>
          </div>
          <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Plus size={20} />
            Create Event
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Filter by event name..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-cyan-500/50 transition-all text-sm"
            />
          </div>
          <button className="glass-card px-4 flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>

        {/* Event List Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventsData.map((event) => (
            <div key={event.id} className="glass-card overflow-hidden group hover:border-cyan-500/30 transition-all">
              <div className="h-32 bg-gradient-to-br from-cyan-900/40 to-blue-900/20 relative">
                <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase px-2 py-1 rounded-md border ${
                  event.status === 'Ongoing' ? 'border-emerald-500 text-emerald-500 bg-emerald-500/10' : 
                  event.status === 'Upcoming' ? 'border-cyan-500 text-cyan-500 bg-cyan-500/10' : 
                  'border-gray-500 text-gray-500 bg-gray-500/10'
                }`}>
                  {event.status}
                </span>
              </div>
              <div className="p-6 space-y-4">
                <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">{event.title}</h3>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <CalIcon size={14} className="text-cyan-500" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-cyan-500" />
                    <span>{event.participants} Participants</span>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {event.translation && (
                      <div className="flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-400/5 px-2 py-1 rounded">
                        <Globe size={10} /> AI TRANSLATION
                      </div>
                    )}
                  </div>
                  <button className="text-xs font-bold hover:text-cyan-400 underline decoration-cyan-500/30">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}