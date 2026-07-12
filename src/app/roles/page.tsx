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
  X,
  CheckCircle2,
  AlertCircle,
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

  // --- 1. STATE BARU: POP-UP TOAST & MODAL KONFIRMASI (UNTUK KATALON) ---
  const [statusPopup, setStatusPopup] = useState<{
    show: boolean;
    type: "success" | "error";
    message: string;
  }>({ show: false, type: "success", message: "" });

  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    idToDelete: string | null;
  }>({ show: false, idToDelete: null });

  // Helper function untuk memunculkan pop-up
  const showPopup = (type: "success" | "error", message: string) => {
    setStatusPopup({ show: true, type, message });
    setTimeout(() => {
      setStatusPopup((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Gatekeeper",
    status: "Active",
  });

  const fetchUsersFromSupabase = async () => {
    if (!supabase) {
      console.warn("⚠️ Supabase client belum siap.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
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
    } catch (error: any) {
      console.error("Gagal sinkronisasi RLS: ", error.message);
      showPopup("error", "Gagal sinkronisasi data dari database: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      password: "",
      role: user.role,
      status: user.status,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (editingId !== null) {
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
          // Ganti alert dengan showPopup
          showPopup("success", "Akun user berhasil diperbarui.");
        } else {
          showPopup("error", "Gagal memperbarui: " + result.error);
        }
      } catch (error: any) {
        showPopup("error", "Terjadi kesalahan jaringan: " + error.message);
      }
    } else {
      try {
        const response = await fetch("/api/admin/create-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role,
          }),
        })

        const result = await response.json();
        if (result.success) {
          showPopup("success", `Akun untuk ${formData.name} sebagai ${formData.role} berhasil dibuat!`);
        } else {
          showPopup("error", "Gagal deploy kru: " + result.error);
        }
      } catch (error: any) {
        showPopup("error", "Terjadi kesalahan jaringan: " + error.message);
      }
    }

    await fetchUsersFromSupabase();
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

  // --- 2. MODIFIKASI ALUR HAPUS: MENGGUNAKAN POP-UP MODAL ---
  const confirmDeleteClick = (id: string) => {
    setDeleteConfirm({ show: true, idToDelete: id });
  };

  const executeDeleteUser = async () => {
    if (!deleteConfirm.idToDelete) return;
    
    try {
      setLoading(true);
      const response = await fetch("/api/admin/delete-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: deleteConfirm.idToDelete }),
      });

      const result = await response.json();

      if (result.success) {
        showPopup("success", "Akun berhasil dihapus secara permanen dari server.");
        await fetchUsersFromSupabase();
      } else {
        showPopup("error", "Gagal menghapus: " + result.error);
      }
    } catch (error: any) {
      showPopup("error", "Terjadi kesalahan jaringan: " + error.message);
    } finally {
      setLoading(false);
      setDeleteConfirm({ show: false, idToDelete: null });
    }
  };

  return (
    <>
      <Navbar />

     
      {statusPopup.show && (
        <div
          data-testid="status-popup"
          id="katalon-status-popup"
          className={`fixed top-6 left-1/2 -translate-x-1/2 z-[100] p-4 rounded-lg border flex items-center gap-3 shadow-lg animate-in fade-in slide-in-from-top-4 duration-300 min-w-[320px] max-w-md ${
            statusPopup.type === "success"
              ? "bg-[#18181b] border-emerald-500/50 text-emerald-400"
              : "bg-[#18181b] border-red-500/50 text-red-400"
          }`}
        >
          {statusPopup.type === "success" ? (
            <CheckCircle2 className="text-emerald-500 shrink-0" size={18} />
          ) : (
            <AlertCircle className="text-red-500 shrink-0" size={18} />
          )}
          <div className="text-xs font-medium flex-1">
            <span className="uppercase text-[9px] block text-gray-400 font-bold tracking-wider">
              System Notification
            </span>
            <span data-testid="status-popup-message" className="text-white mt-0.5 block">
              {statusPopup.message}
            </span>
          </div>
          <button
            onClick={() => setStatusPopup((prev) => ({ ...prev, show: false }))}
            className="ml-2 text-gray-500 hover:text-white cursor-pointer p-1"
            data-testid="close-status-popup"
          >
            <X size={16} />
          </button>
        </div>
      )}

      
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            data-testid="delete-confirm-modal"
            id="katalon-delete-confirm-modal"
            className="w-full max-w-sm p-6 bg-[#18181b] border border-gray-700 rounded-lg text-left space-y-4 shadow-lg animate-in zoom-in-95 duration-200"
          >
            <div>
              <h4 className="text-white font-semibold text-base">
                Konfirmasi Penghapusan Akun
              </h4>
              <p className="text-gray-300 text-sm mt-2 leading-relaxed">
                Apakah Anda yakin ingin Menghapus Akun ini dari sistem? Tindakan ini bersifat permanen.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm({ show: false, idToDelete: null })}
                data-testid="btn-cancel-delete"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-sm font-medium transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={executeDeleteUser}
                data-testid="btn-confirm-delete"
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-medium transition-colors cursor-pointer"
              >
                Ya, Hapus Akun
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-8">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">
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
            data-testid="btn-create-account"
            className="flex items-center gap-2 bg-cyan-500 text-black px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-cyan-400 transition-all cursor-pointer"
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
              className="bg-[#111111] px-4 py-3 flex items-center justify-between border border-white/5 rounded-xl"
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
            data-testid="input-search-user"
            placeholder="Cari akun tim..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#111111] border border-white/5 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:border-cyan-500/50 outline-none transition-all"
          />
        </div>

        {/* Table Render */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="animate-spin text-cyan-400" size={32} />
          </div>
        ) : (
          <div className="bg-[#111111] overflow-hidden border border-white/5 rounded-xl">
            <table className="w-full text-left" data-testid="users-table">
              <thead>
                <tr className="bg-white/5 text-gray-500 text-[10px] uppercase tracking-widest font-bold">
                  <th className="px-6 py-5">User Profile</th>
                  <th className="px-6 py-5">Role Assigned</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    data-testid={`user-row-${index}`}
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
                          data-testid={`btn-edit-user-${index}`}
                          className="hover:text-cyan-400 cursor-pointer p-1"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => confirmDeleteClick(user.id)}
                          data-testid={`btn-delete-user-${index}`}
                          className="hover:text-red-500 cursor-pointer p-1"
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

      {/* MODAL DIALOG (FORM CREATE / EDIT STANDAR & SIMPEL) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div
            data-testid="user-form-modal"
            className="w-full max-w-md p-6 bg-[#18181b] border border-gray-700 rounded-lg relative shadow-lg"
          >
            <h3 className="text-lg font-bold text-white mb-4">
              {editingId !== null ? "Update Access Role" : "Create Account Kru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 font-medium">
                  Full Name
                </label>
                <input
                  required
                  data-testid="input-user-name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-md p-2.5 text-sm text-white outline-none focus:border-cyan-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 font-medium">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  data-testid="input-user-email"
                  readOnly={editingId !== null}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-md p-2.5 text-sm text-white outline-none focus:border-cyan-500 disabled:text-gray-500"
                />
              </div>

              {editingId === null && (
                <div className="space-y-1">
                  <label className="text-[11px] text-gray-400 font-medium">
                    Password Akun Kru
                  </label>
                  <input
                    required
                    type="password"
                    data-testid="input-user-password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-white/5 border border-white/10 rounded-md p-2.5 text-sm text-white outline-none focus:border-cyan-500"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] text-gray-400 font-medium">
                  Assign Role
                </label>
                <select
                  data-testid="select-user-role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full bg-[#18181b] border border-white/10 rounded-md p-2.5 text-sm text-white outline-none focus:border-cyan-500"
                >
                  <option value="Gatekeeper">Gatekeeper</option>
                  <option value="Speaker">Speaker</option>
                  <option value="Moderator">Moderator</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 mt-6 pt-2">
                <button
                  type="button"
                  data-testid="btn-cancel-modal"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded text-sm font-medium transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  data-testid="btn-submit-user"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-sm font-medium transition-colors cursor-pointer"
                >
                  {editingId !== null ? "Simpan Perubahan" : "Buat Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}