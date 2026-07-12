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
  Clock,
  Loader2,
  Ticket,
  Mic,
  CheckCircle2, // <-- Tambahan icon untuk testing pop-up
  AlertCircle,  // <-- Tambahan icon untuk testing pop-up
  HelpCircle,   // <-- Tambahan icon untuk testing pop-up
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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
  speaker_1: string;
  speaker_2?: string | null;
  speaker_3?: string | null;
  participants?: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  // --- 1. STATE BARU: POP-UP TESTING KATALON ---
  const [statusPopup, setStatusPopup] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    idToDelete: string | null;
  }>({ show: false, idToDelete: null });

  // Fungsi helper untuk menampilkan pop-up
  const showPopup = (type: "success" | "error", message: string) => {
    setStatusPopup({ show: true, type, message });
    // Otomatis hilang setelah 4 detik
    setTimeout(() => {
      setStatusPopup((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

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
    // Benteng Pengaman 1: Pastikan client Supabase terinisialisasi
    if (!supabase) {
      console.error("❌ Supabase client gagal diinisialisasi.");
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error:", error.message);
      showPopup("error", "Gagal mengambil data dari database!");
    } else {
      setEvents(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Benteng Pengaman 2: Pastikan client Supabase terinisialisasi
    if (!supabase) {
      showPopup("error", "Proses Gagal: Koneksi ke database belum siap.");
      return;
    }

    setLoading(true);

    try {
      let finalImageUrl = formData.image_url;

      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
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

      // 2. GANTI ALERT SUKSES DENGAN POP-UP
      showPopup("success", "System Synchronized Successfully!");
      setImageFile(null);
      fetchEvents();
      closeModal();
    } catch (error: any) {
      console.error("Submit Error:", error);
      // 3. GANTI ALERT ERROR DENGAN POP-UP
      showPopup("error", "Proses Gagal: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. MODIFIKASI ALUR DELETE AGAR MENGGUNAKAN POP-UP MODAL (Gabungan dengan pengaman Supabase)
  const confirmDeleteClick = (id: string) => {
    if (!supabase) {
      showPopup("error", "Gagal menghapus: Koneksi database belum siap.");
      return;
    }
    setDeleteConfirm({ show: true, idToDelete: id });
  };

  const executeDelete = async () => {
    if (!deleteConfirm.idToDelete) return;

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", deleteConfirm.idToDelete);

    if (error) {
      showPopup("error", error.message);
    } else {
      showPopup("success", "Event berhasil dihapus dari sistem!");
      fetchEvents();
    }
    setDeleteConfirm({ show: false, idToDelete: null });
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
      {statusPopup.show && (
        <div
          data-testid="status-popup"
          id="katalon-status-popup"
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] p-4 rounded-2xl border flex items-center gap-3 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in fade-in slide-in-from-top-5 duration-300 min-w-[320px] max-w-md ${
            statusPopup.type === "success"
              ? "bg-[#0a0a0a]/95 border-emerald-500/50 text-emerald-400"
              : "bg-[#0a0a0a]/95 border-red-500/50 text-red-400"
          }`}
        >
          {statusPopup.type === "success" ? (
            <CheckCircle2 className="text-emerald-500 shrink-0" size={20} />
          ) : (
            <AlertCircle className="text-red-500 shrink-0" size={20} />
          )}
          <div className="text-xs font-bold tracking-wide flex-1">
            <span className="uppercase text-[9px] block text-gray-400 font-black tracking-widest">
              System Notification
            </span>
            <span
              data-testid="status-popup-message"
              className="text-white mt-0.5 block font-medium"
            >
              {statusPopup.message}
            </span>
          </div>
          <button
            onClick={() => setStatusPopup((prev) => ({ ...prev, show: false }))}
            className="ml-2 text-gray-500 hover:text-white cursor-pointer p-1 rounded-lg hover:bg-white/5 transition-colors"
            data-testid="close-status-popup"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {deleteConfirm.show && (
        // Hapus backdrop-blur, pakai bg-black/60 biasa
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            data-testid="delete-confirm-modal"
            id="katalon-delete-confirm-modal"
            // Hapus glass-card, ganti warna ke dark slate biasa (#18181b), border tipis standar
            className="w-full max-w-sm p-6 bg-[#18181b] border border-gray-700 rounded-lg text-left space-y-4 shadow-lg"
          >
            <div>
              <h4 className="text-white font-semibold text-base">
                Konfirmasi Hapus Event
              </h4>
              <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                Apakah Anda yakin ingin menghapus data event ini? Data yang
                dihapus tidak dapat dikembalikan.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() =>
                  setDeleteConfirm({ show: false, idToDelete: null })
                }
                data-testid="btn-cancel-delete"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-sm font-medium transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={executeDelete}
                data-testid="btn-confirm-delete"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors cursor-pointer"
              >
                Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}

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
            data-testid="btn-create-event"
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
            data-testid="input-search-event"
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
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                data-testid={`event-card-${index}`}
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
                      data-testid={`btn-edit-event-${index}`}
                      className="p-2 bg-black/60 hover:bg-cyan-500 hover:text-black rounded-lg text-gray-400 transition-all cursor-pointer"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      onClick={() => confirmDeleteClick(event.id)}
                      data-testid={`btn-delete-event-${index}`}
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
                    <div className="flex items-center gap-2">
                      <Mic size={14} className="text-cyan-500 shrink-0" />{" "}
                      <span className="truncate text-white">
                        {event.speaker_1} {event.speaker_2 ? `& lainnya` : ""}
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
                        className={`shrink-0 ${
                          event.price === 0 || !event.price
                            ? "text-emerald-500"
                            : "text-yellow-500"
                        }`}
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
          <div
            data-testid="event-form-modal"
            className="glass-card w-full max-w-2xl p-8 border-cyan-500/20 relative max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#0a0a0a]"
          >
            <button
              onClick={closeModal}
              data-testid="btn-close-modal"
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
                  data-testid="input-event-title"
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
                  data-testid="input-event-description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white outline-none focus:border-cyan-500 resize-none"
                  placeholder="Detail singkat acara..."
                />
              </div>

              <div className="space-y-4 bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                <label className="flex items-center gap-2 text-[10px] text-cyan-500 font-black uppercase tracking-[0.2em]">
                  <Mic size={14} /> Daftar Pemateri
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 uppercase font-bold">
                      Pemateri 1 (Wajib)
                    </label>
                    <input
                      required
                      data-testid="input-speaker-1"
                      value={formData.speaker_1}
                      onChange={(e) =>
                        setFormData({ ...formData, speaker_1: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-cyan-500 transition-all"
                      placeholder="Nama Lengkap"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 uppercase font-bold">
                      Pemateri 2 (Opsional)
                    </label>
                    <input
                      data-testid="input-speaker-2"
                      value={formData.speaker_2 || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, speaker_2: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white outline-none focus:border-cyan-500 transition-all"
                      placeholder="Nama Lengkap"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] text-gray-500 uppercase font-bold">
                      Pemateri 3 (Opsional)
                    </label>
                    <input
                      data-testid="input-speaker-3"
                      value={formData.speaker_3 || ""}
                      onChange={(e) =>
                        setFormData({ ...formData, speaker_3: e.target.value })
                      }
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
                    data-testid="input-event-date"
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
                    data-testid="input-event-time"
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
                    data-testid="input-event-location"
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
                    data-testid="input-event-quota"
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
                    data-testid="btn-quota-unlimited"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        quota:
                          formData.quota === "Unlimited" ? 0 : "Unlimited",
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
                    data-testid="input-event-price"
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
                  data-testid="select-event-status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
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
                        type="button"
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
                    data-testid="input-event-image"
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
                data-testid="btn-submit-event"
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