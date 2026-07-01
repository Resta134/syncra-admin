"use client";

import Navbar from "@/components/Navbar";
import {
  UserPlus,
  Shield,
  Key as KeyIcon,
  Mic2,
  Search,
  Trash2,
  Edit,
  Loader2,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function RolesPage() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form data sekarang mencakup Password untuk pembuatan akun kru baru oleh Admin
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Gatekeeper",
    status: "Active",
  });

  const fetchUsersFromSupabase = async () => {
    try {
      setLoading(true);
      // Mengambil seluruh data profil kru dari tabel
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) throw error;

      if (data) {
        setUsers(
          data.map((u) => ({
            id: u.id,
            name: u.full_name || "No Name",
            email: u.email || "No Email",
            role: u.package_tier || "Gatekeeper",
            status: "Active",
          })),
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Gagal sinkronisasi RLS: ", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsersFromSupabase();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [searchQuery, users]);

  const handleEditClick = (user: UserAccount) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      password: "", // Kosongkan saat edit
      role: user.role,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  // HANDLER: SIMPAN DATA (CREATE VIA API ATAU UPDATE VIA DIRECT)
  // HANDLER: SIMPAN DATA (CREATE & UPDATE VIA API ROUTE ADMIN)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (editingId !== null) {
      // ================= PROSES UPDATE DATA KRU VIA API =================
      try {
        const response = await fetch("/api/admin/update-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: editingId,
            name: formData.name,
            role: formData.role,
          }),
        });

        const result = await response.json();
        if (result.success) {
          alert(
            "Sukses! Hak akses akun kru berhasil diperbarui secara permanen.",
          );
        } else {
          alert("Gagal memperbarui: " + result.error);
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        alert("Terjadi kesalahan jaringan: " + error.message);
      }
    } else {
      // PROSES CREATE ACCOUNT KRU BARU
      const response = await fetch("/api/admin/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });

      const result = await response.json();
      if (result.success) {
        alert(
          `Akun untuk ${formData.name} sebagai ${formData.role} berhasil dibuat!`,
        );
      } else {
        alert("Gagal deploy kru: " + result.error);
      }
    }

    // Sinkronisasi ulang data tabel langsung dari Supabase cloud setelah disave
    await fetchUsersFromSupabase();

    // Reset status form dan tutup modal dialog
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "Gatekeeper",
      status: "Active",
    });
    setLoading(false);
  };

  const handleDeleteUser = async (id: string) => {
    if (
      !confirm(
        "Apakah Anda yakin ingin mencabut paksa hak akses akun ini dari sistem Syncra AI?",
      )
    )
      return;

    try {
      setLoading(true);
      // Panggil API Route internal Next.js yang memegang kunci sakti admin
      const response = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      });

      const result = await response.json();

      if (result.success) {
        alert(
          "Sukses! Akun berhasil dihapus secara permanen dari server cloud.",
        );
        await fetchUsersFromSupabase(); // Segarkan isi tabel agar datanya langsung hilang dari layar
      } else {
        alert("Gagal menghapus: " + result.error);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      alert("Terjadi kesalahan jaringan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-glow text-White-400 tracking-tight">
              Roles & User Access
            </h2>
            <p className="text-gray-400 text-sm">
              Kelola hak akses Moderator, Speaker, dan petugas Gatekeeper.
            </p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                email: "",
                password: "",
                role: "Gatekeeper",
                status: "Active",
              });
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-cyan-500 text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <UserPlus size={14} /> Create Account
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              label: "Moderators",
              count: users.filter((u) => u.role === "Moderator").length,
              icon: <Shield size={18} />,
            },
            {
              label: "Speakers",
              count: users.filter((u) => u.role === "Speaker").length,
              icon: <Mic2 size={18} />,
            },
            {
              label: "Gatekeepers",
              count: users.filter((u) => u.role === "Gatekeeper").length,
              icon: <KeyIcon size={18} />,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="glass-card px-4 py-3 flex items-center justify-between border-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="text-cyan-400">{stat.icon}</div>
                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                  {stat.label}
                </span>
              </div>
              <span className="text-xl font-bold text-white">{stat.count}</span>
            </div>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Cari akun tim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-cyan-500/50 outline-none transition-all"
          />
        </div>

        {/* Table Render */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-cyan-400" size={32} />
          </div>
        ) : (
          <div className="glass-card overflow-hidden border-white/5">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-5">User Profile</th>
                  <th className="px-6 py-5">Role Assigned</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-cyan-400 text-sm font-bold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {user.name}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold">
                      <span className="text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded uppercase">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-emerald-400 font-mono italic uppercase">
                      {user.status}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 text-gray-500 group-hover:text-gray-300">
                        <button
                          onClick={() => handleEditClick(user)}
                          className="hover:text-cyan-400 cursor-pointer"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DIALOG */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="glass-card w-full max-w-md p-8 border-cyan-500/20 relative">
            <h3 className="text-xl font-bold text-cyan-400 mb-6 uppercase tracking-tight italic">
              {editingId !== null ? "Update Access Role" : "Create Account Kru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Full Name
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  readOnly={editingId !== null}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-cyan-500 disabled:text-gray-500"
                />
              </div>

              {/* Tampilkan input password HANYA saat membuat akun baru */}
              {editingId === null && (
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    Password Akun Kru
                  </label>
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                    Assign Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-xl p-3 text-sm text-white outline-none focus:border-cyan-500"
                  >
                    <option value="Gatekeeper">Gatekeeper</option>
                    <option value="Speaker">Speaker</option>
                    <option value="Moderator">Moderator</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-cyan-500 text-black rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
                >
                  {editingId !== null ? "Save Changes" : "Deploy Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
