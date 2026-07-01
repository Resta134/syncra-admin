"use client";

import Navbar from "@/components/Navbar";
import {
  Plus,
  Search,
  Calendar as CalIcon,
  Users,
  Trash2,
  Edit3,
  X,
  MapPin,
  Image as ImageIcon,
  Infinity,
  Clock,
  Loader2,
  Ticket,
  Mic, // <-- Tambahan icon Mic untuk pemateri
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase"; 

// --- 1. UPDATE INTERFACE (Tambahan Speaker) ---
interface EventData {
  id: string;
  title: string;
  status: "Upcoming" | "Ongoing" | "Completed";
  event_date: string;
  event_time: string;
  location: string;
  quota: number | "Unlimited";
  price: number;
  image_url: string;
  description: string;
  speaker_1: string; // Wajib
  speaker_2?: string | null; // Opsional
  speaker_3?: string | null; // Opsional
  participants?: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  
  // --- 2. UPDATE DEFAULT STATE (Tambahan Speaker) ---
  const [formData, setFormData] = useState<Partial<EventData>>({
    title: "",
    status: "Upcoming",
    event_date: "",
    event_time: "",
    location: "",
    quota: 0,
    price: 0,
    image_url: "",
    description: "",
    speaker_1: "",
    speaker_2: "",
    speaker_3: "",
  });

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error:", error.message);
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); 

    try {
      let finalImageUrl = formData.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        // eslint-disable-next-line react-hooks/purity
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("event-images")
          .upload(filePath, imageFile);

        if (uploadError) {
          throw new Error("Gagal upload gambar: " + uploadError.message);
        }

        const { data: urlData } = supabase.storage
          .from("event-images")
          .getPublicUrl(filePath);

        finalImageUrl = urlData.publicUrl;
      }

      // --- 3. UPDATE PAYLOAD UNTUK SUPABASE ---
      const payload = {
        title: formData.title,
        description: formData.description,
        event_date: formData.event_date,
        event_time: formData.event_time,
        location: formData.location,
        quota: formData.quota === "Unlimited" ? 999999 : formData.quota,
        price: Number(formData.price),
        status: formData.status,
        image_url: finalImageUrl,
        // Masukkan data speaker, jika string kosong ubah menjadi null
        speaker_1: formData.speaker_1,
        speaker_2: formData.speaker_2?.trim() === "" ? null : formData.speaker_2,
        speaker_3: formData.speaker_3?.trim() === "" ? null : formData.speaker_3,
      };

      if (editingEvent) {
        const { error: updateError } = await supabase
          .from("events")
          .update(payload)
          .eq("id", editingEvent.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from("events")
          .insert([payload]);

        if (insertError) throw insertError;
      }

      alert("System Synchronized Successfully!");
      setImageFile(null);
      fetchEvents();
      closeModal();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Submit Error:", error);
      alert("Proses Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Hapus event ini?")) {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) alert(error.message);
      else fetchEvents();
    }
  };

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, events]);

  const openModal = (event?: EventData) => {
    if (event) {
      setEditingEvent(event);
      setFormData({
        ...event,
        // Pastikan null dari database dikonversi ke string kosong untuk input form
        speaker_2: event.speaker_2 || "",
        speaker_3: event.speaker_3 || "",
      });
    } else {
      setEditingEvent(null);
      setFormData({
        title: "",
        status: "Upcoming",
        event_date: "",
        event_time: "",
        location: "",
        quota: 0,
        price: 0,
        image_url: "",
        description: "",
        speaker_1: "",
        speaker_2: "",
        speaker_3: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  return (
    <>
      <Navbar />
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-3xl font-bold text-glow text-white tracking-tight">
              Event Management
            </h2>
            <p className="text-gray-400 text-sm font-medium">
              Manage and monitor your AI-powered Syncro events.
            </p>
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <Plus size={20} /> Create Event
          </button>
        </div>

        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Filter by event name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111111] border border-white/5 rounded-xl py-4 pl-10 pr-4 text-sm text-white focus:border-cyan-500/50 outline-none"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="animate-spin mb-2" />
            <p className="text-xs uppercase tracking-widest font-bold">
              Synchronizing Data...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="glass-card overflow-hidden group hover:border-cyan-500/30 transition-all bg-[#0a0a0a] border border-white/5 rounded-2xl"
              >
                <div className="h-44 relative">
                  <img
                    src={
                      event.image_url ||
                      "https://images.unsplash.com/photo-1557683316-973673baf926"
                    }
                    alt={event.title}
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`text-[9px] font-bold uppercase px-2 py-1 rounded border ${
                        event.status === "Ongoing"
                          ? "border-emerald-500 text-emerald-400 bg-emerald-400/10"
                          : event.status === "Upcoming"
                            ? "border-cyan-500 text-cyan-400 bg-cyan-400/10"
                            : "border-gray-500 text-gray-400 bg-gray-500/10"
                      }`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-1">
                    <button
                      onClick={() => openModal(event)}
                      className="p-2 bg-black/60 hover:bg-cyan-500 hover:text-black rounded-lg text-gray-400 transition-all cursor-pointer"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="p-2 bg-black/60 hover:bg-red-500 hover:text-white rounded-lg text-gray-400 transition-all cursor-pointer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors leading-tight italic line-clamp-2">
                    {event.title}
                  </h3>
                  <div className="grid grid-cols-1 gap-2 text-[11px] text-gray-400 font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <CalIcon size={14} className="text-cyan-500" />{" "}
                      {event.event_date} |{" "}
                      <Clock size={14} className="text-cyan-500" />{" "}
                      {event.event_time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-cyan-500 shrink-0" />{" "}
                      <span className="truncate">{event.location}</span>
                    </div>
                    {/* INDIKATOR PEMATERI DI KARTU (Opsional, tapi bagus untuk UX) */}
                    <div className="flex items-center gap-2">
                      <Mic size={14} className="text-cyan-500 shrink-0" />{" "}
                      <span className="truncate text-white">
                        {event.speaker_1} {event.speaker_2 ? `& lainnya` : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-cyan-500 shrink-0" />{" "}
                      Kuota:{" "}
                      <span className="text-white">
                        {event.quota === 999999 ? "Unlimited" : event.quota}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Ticket
                        size={14}
                        className={
                          event.price === 0 || !event.price
                            ? "text-emerald-500"
                            : "text-yellow-500"
                        }
                        shrink-0
                      />
                      Harga:{" "}
                      <span
                        className={
                          event.price === 0 || !event.price
                            ? "text-emerald-400"
                            : "text-yellow-400"
                        }
                      >
                        {event.price === 0 || !event.price
                          ? "GRATIS"
                          : new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                              minimumFractionDigits: 0,
                            }).format(event.price)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
          <div className="glass-card w-full max-w-2xl p-8 border-cyan-500/20 relative max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#0a0a0a]">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 text-gray-500 hover:text-white cursor-pointer z-10"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold text-cyan-400 mb-6 uppercase tracking-widest italic">
              {editingEvent ? "Update System" : "Deploy New Event"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  Nama Event
                </label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500 transition-all"
                  placeholder="Contoh: Global Tech Summit"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500 resize-none"
                  placeholder="Detail singkat acara..."
                />
              </div>

              {/* --- 4. FORM INPUT PEMATERI (1 Wajib, 2 Opsional) --- */}
              <div className="space-y-4 bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                <label className="flex items-center gap-2 text-[10px] text-cyan-500 font-black uppercase tracking-[0.2em]">
                  <Mic size={14} /> Daftar Pemateri
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 uppercase font-bold">Pemateri 1 (Wajib)</label>
                    <input
                      required
                      value={formData.speaker_1}
                      onChange={(e) => setFormData({ ...formData, speaker_1: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-cyan-500 transition-all"
                      placeholder="Nama Lengkap"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 uppercase font-bold">Pemateri 2 (Opsional)</label>
                    <input
                      value={formData.speaker_2 || ""}
                      onChange={(e) => setFormData({ ...formData, speaker_2: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-cyan-500 transition-all"
                      placeholder="Nama Lengkap"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 uppercase font-bold">Pemateri 3 (Opsional)</label>
                    <input
                      value={formData.speaker_3 || ""}
                      onChange={(e) => setFormData({ ...formData, speaker_3: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-cyan-500 transition-all"
                      placeholder="Nama Lengkap"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.event_date}
                    onChange={(e) =>
                      setFormData({ ...formData, event_date: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                    Waktu (WIB)
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.event_time}
                    onChange={(e) =>
                      setFormData({ ...formData, event_time: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  Lokasi / Venue
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                    size={16}
                  />
                  <input
                    required
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-cyan-500"
                    placeholder="Gedung serbaguna..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  Batasan Kuota
                </label>
                <div className="flex gap-2">
                  <input
                    disabled={formData.quota === "Unlimited"}
                    type="number"
                    value={formData.quota === "Unlimited" ? "" : formData.quota}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quota: parseInt(e.target.value) || 0,
                      })
                    }
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500"
                    placeholder="0"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        quota: formData.quota === "Unlimited" ? 0 : "Unlimited",
                      })
                    }
                    className={`px-3 rounded-xl border text-[8px] font-black transition-all ${
                      formData.quota === "Unlimited"
                        ? "bg-cyan-500 text-black border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        : "border-white/10 text-gray-500"
                    }`}
                  >
                    UNLIMITED
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  Harga Tiket (Rp)
                </label>
                <div className="flex gap-2 items-center relative">
                  <span className="absolute left-4 text-gray-500 font-bold text-sm">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={formData.price === 0 ? "" : formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm text-white outline-none focus:border-cyan-500"
                    placeholder="0 (Gratis)"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  Status Event
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      status: e.target.value as any,
                    })
                  }
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="Upcoming">UPCOMING</option>
                  <option value="Ongoing">ONGOING</option>
                  <option value="Completed">COMPLETED</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">
                  Foto Pamflet / Banner
                </label>
                <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-cyan-500/50 transition-all min-h-[150px] bg-white/[0.02]">
                  {formData.image_url ? (
                    <div className="relative w-full h-32">
                      <img
                        src={formData.image_url}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() =>
                          setFormData({ ...formData, image_url: "" })
                        }
                        className="absolute -top-2 -right-2 bg-red-500 p-1 rounded-full z-10"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className="text-gray-600 mb-2" size={32} />
                      <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">
                        Tap to upload system file
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setImageFile(file); 
                        setFormData({
                          ...formData,
                          image_url: URL.createObjectURL(file),
                        });
                      }
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-5 rounded-2xl mt-4 shadow-[0_0_30px_rgba(6,182,212,0.3)] transition-all uppercase tracking-[0.3em] text-xs cursor-pointer"
              >
                {editingEvent ? "Confirm Update System" : "Deploy To System"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}