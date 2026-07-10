"use client";

import {
  MonitorSmartphone,
  ScanFace,
  MessageSquareText,
  ShieldCheck,
  BarChart3,
  Users,
  Check,
  Play,
  Download,
  Mail,
  Phone,
  MapPin,
  LogOut,
  LayoutDashboard,
  User,
  CheckCircle, XCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase"; // Sesuaikan path ini dengan project Anda

export default function SyncroLandingPage() {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [profileName, setProfileName] = useState<string>("");
  // kontak
  // ================= STATE UNTUK CONTACT FORM =================
  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; type: "success" | "error"; message: string }>({
    show: false,
    type: "success",
    message: "",
  });

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Pastikan tabel di Supabase bernama "contact_messages"
      const { error } = await supabase
        .from("contact_messages")
        .insert([{
          name: contactForm.name,
          email: contactForm.email,
          message: contactForm.message
        }]);

      if (error) throw error;

      // Tampilkan toast sukses & reset form
      setToast({ show: true, type: "success", message: "Pesan berhasil dikirim! Tim kami akan segera merespons." });
      setContactForm({ name: "", email: "", message: "" });
    } catch (error: any) {
      // Tampilkan toast error
      setToast({ show: true, type: "error", message: error.message || "Gagal mengirim pesan." });
    } finally {
      setIsSubmitting(false);
      // Sembunyikan toast setelah 5 detik
      setTimeout(() => setToast(prev => ({ ...prev, show: false })), 5000);
    }
  };
  //
  // ================= 1. LOGIKA SYNC USER & STATUS PAKET =================
  useEffect(() => {
    const checkUserAndPackage = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);

        // Mengambil data profile pengguna secara realtime dari database public
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, package_tier")
          .eq("id", user.id)
          .single();

        if (profile) {
          setProfileName(profile.full_name || user.email?.split("@")[0]);
          // Menyisipkan tingkat tier paket ke dalam state local user
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setUser((prev: any) => ({
            ...prev,
            package_tier: profile.package_tier,
          }));
        }
      }
    };

    checkUserAndPackage();

    // Memantau perubahan status auth (jika login/logout di tab lain)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        checkUserAndPackage();
      } else {
        setUser(null);
        setProfileName("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // ================= 2. FUNGSI UPDATE PEMBELIAN PAKET =================
  const handleSelectPackage = async (tier: string) => {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();

    if (!currentUser) {
      alert(
        "Kamu harus login atau register terlebih dahulu untuk memilih paket!",
      );
      router.push("/login");
      return;
    }

    // Melakukan update status paket pada tabel profile
    const { error } = await supabase
      .from("profiles")
      .update({ package_tier: tier })
      .eq("id", currentUser.id);

    if (error) {
      alert("Gagal memproses paket: " + error.message);
    } else {
      alert(`Sukses! Akun kamu kini aktif dengan paket ${tier}.`);

      // Mengubah state lokal secara instan agar UI tombol dashboard langsung muncul
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setUser((prev: any) => ({ ...prev, package_tier: tier }));

      // Mengarahkan admin langsung ke dashboard manajemen sistem
      router.push("/dashboard");
    }
  };

  // ================= 3. FUNGSI LOGOUT (REVOKE TOKEN) =================
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfileName("");
    router.refresh();
  };

  return (
    <main className="bg-[#070B1A] text-white overflow-hidden">
      {/* ================= TOAST NOTIFICATION ================= */}
      {toast.show && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 rounded-2xl flex items-center gap-3 shadow-2xl transition-all border ${
          toast.type === "success" 
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
            : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}>
          {toast.type === "success" ? <CheckCircle size={20} /> : <XCircle size={20} />}
          <span className="font-medium text-sm">{toast.message}</span>
        </div>
      )}
      {/* ================= BACKGROUND EFFECT ================= */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#6d28d9_0%,transparent_30%)] opacity-30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#2563eb_0%,transparent_30%)] opacity-20" />

      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-50 backdrop-blur-xl border-b border-white/10 bg-[#070B1A]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/images/logo2.png"
              alt="Syncro AI Logo"
              // Ubah w-8 h-8 menjadi angka yang lebih besar, contohnya w-12 h-12
              className="w-50 h-20 rounded-lg object-contain" />
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-300">
            <a href="#home" className="hover:text-white transition">
              Beranda
            </a>
            <a href="#features" className="hover:text-white transition">
              Fitur
            </a>
            <a href="#pricing" className="hover:text-white transition">
              Paket
            </a>
            <a href="#download" className="hover:text-white transition">
              Download
            </a>
            <a href="#contact" className="hover:text-white transition">
              Kontak
            </a>
          </nav>

          {/* PERBAIKAN: DINAMIS NAVBAR AUTH BUTTONS */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 p-1.5 pr-4 rounded-2xl">
                <div className="w-8 h-8 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">
                  <User size={16} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold text-white max-w-[100px] truncate">
                    {profileName}
                  </span>
                  <span className="text-[9px] text-cyan-400 font-bold uppercase tracking-widest">
                    {user.package_tier || "Free"}
                  </span>
                </div>
                <div className="h-6 w-[1px] bg-white/10 mx-1" />

                {/* Aturan Proteksi: Tombol admin hanya merender jika tier paket bukan 'Free' */}
                {user.package_tier && user.package_tier !== "Free" && (
                  <button
                    onClick={() => router.push("/dashboard")}
                    className="p-1.5 text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition cursor-pointer"
                    title="Ke Dashboard Admin"
                  >
                    <LayoutDashboard size={16} />
                  </button>
                )}

                <button
                  onClick={handleLogout}
                  className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="px-5 py-2 rounded-xl border border-white/10 hover:bg-white/5 transition cursor-pointer text-sm font-semibold"
                >
                  Login
                </button>

                <button
                  onClick={() => router.push("/register")}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 hover:opacity-90 transition cursor-pointer text-sm font-semibold"
                >
                  Register
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="relative max-w-7xl mx-auto px-6 pt-12 pb-20"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* LEFT */}
          <div>
            <div className="inline-flex items-center px-4 py-2 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm mb-6">
              AI EVENT ECOSYSTEM
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-tight">
              Revolusi Cara Event Anda{" "}
              <span className="bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
                Berkomunikasi
              </span>
            </h1>

            <p className="text-gray-400 text-lg mt-8 leading-relaxed max-w-xl">
              Platform event management berbasis AI dengan realtime translation,
              face recognition attendance, dan interactive Q&A untuk seminar
              modern.
            </p>

            <div className="flex flex-wrap gap-4 mt-10">
              <button
                onClick={() =>
                  user ? router.push("/dashboard") : router.push("/login")
                }
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 font-semibold hover:scale-105 transition cursor-pointer"
              >
                Mulai Sekarang
              </button>

              <button className="px-7 py-4 rounded-2xl border border-white/10 flex items-center gap-2 hover:bg-white/5 transition">
                <Play size={18} /> Lihat Demo
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-6 mt-14">
              <div>
                <h3 className="text-3xl font-bold text-violet-400">500+</h3>
                <p className="text-gray-400 text-sm mt-1">Event Terlaksana</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-blue-400">50K+</h3>
                <p className="text-gray-400 text-sm mt-1">Peserta Aktif</p>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-cyan-400">12+</h3>
                <p className="text-gray-400 text-sm mt-1">Bahasa Didukung</p>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="relative">
            <div className="absolute inset-0 blur-3xl bg-violet-600/20 rounded-full" />

            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-bold text-lg">Dashboard Admin</h3>
                  <p className="text-gray-400 text-sm">AI Future Summit 2026</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-xs">
                  LIVE
                </div>
              </div>

              {/* CARDS */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="rounded-2xl bg-[#10172A] p-4 border border-white/5">
                  <p className="text-gray-400 text-sm">Total Peserta</p>
                  <h2 className="text-3xl font-bold mt-2">5.243</h2>
                </div>
                <div className="rounded-2xl bg-[#10172A] p-4 border border-white/5">
                  <p className="text-gray-400 text-sm">Bahasa Aktif</p>
                  <h2 className="text-3xl font-bold mt-2">12</h2>
                </div>
              </div>

              {/* LIVE SUBTITLE */}
              <div className="rounded-2xl bg-[#10172A] p-5 border border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <p className="font-semibold">Realtime Translation</p>
                  <div className="text-green-400 text-sm">0.8s latency</div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm text-gray-300">
                      Artificial Intelligence akan menjadi fondasi utama
                      industri masa depan...
                    </p>
                  </div>
                  <div className="h-14 rounded-xl bg-gradient-to-r from-violet-500/20 to-blue-500/20 flex items-center justify-center text-violet-300 text-sm">
                    AI Waveform Animation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-violet-400 font-semibold mb-3">FITUR UNGGULAN</p>
          <h2 className="text-4xl font-bold">Semua yang Anda Butuhkan</h2>
          <p className="text-gray-400 mt-5 max-w-2xl mx-auto">
            Platform event modern dengan teknologi AI realtime untuk
            meningkatkan pengalaman seminar dan konferensi.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<MonitorSmartphone />}
            title="Live Translate AI"
            desc="Subtitle realtime multi bahasa dengan latency rendah."
          />
          <FeatureCard
            icon={<ScanFace />}
            title="Face Recognition"
            desc="Check-in peserta cepat menggunakan scan wajah."
          />
          <FeatureCard
            icon={<MessageSquareText />}
            title="Interactive Q&A"
            desc="Peserta dapat bertanya realtime dengan moderasi."
          />
          <FeatureCard
            icon={<Users />}
            title="Multi Role System"
            desc="Organizer, Moderator, Speaker, Gatekeeper."
          />
          <FeatureCard
            icon={<BarChart3 />}
            title="Realtime Analytics"
            desc="Pantau statistik event dan engagement peserta."
          />
          <FeatureCard
            icon={<ShieldCheck />}
            title="Secure System"
            desc="Keamanan data dan role management enterprise."
          />
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <p className="text-violet-400 font-semibold mb-3">PAKET HARGA</p>
          <h2 className="text-4xl font-bold">Pilih Paket Terbaik</h2>
        </div>

        {/* PERBAIKAN: INTERKONEKSI KLIK PAKET KE DATABASE */}
        <div className="grid lg:grid-cols-3 gap-8">
          <PricingCard
            title="Starter"
            price="Rp 1.499.000"
            features={[
              "100 Peserta",
              "QR Attendance",
              "Basic Analytics",
              "1 Event Aktif",
            ]}
            onSelect={() => handleSelectPackage("Starter")}
          />
          <PricingCard
            popular
            title="Professional"
            price="Rp 4.999.000"
            features={[
              "1000 Peserta",
              "Realtime Translation",
              "Multi Role System",
              "Full Analytics",
            ]}
            onSelect={() => handleSelectPackage("Professional")}
          />
          <PricingCard
            title="Enterprise"
            price="Custom"
            features={[
              "Unlimited Peserta",
              "Dedicated Server",
              "Custom Integration",
              "Priority Support",
            ]}
            onSelect={() => handleSelectPackage("Enterprise")}
          />
        </div>
      </section>

      {/* ================= DOWNLOAD APP ================= */}
      <section id="download" className="max-w-7xl mx-auto px-6 py-24">
        <div className="rounded-[40px] border border-white/10 bg-gradient-to-br from-[#111827] to-[#0B1022] p-12">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* BAGIAN KIRI: Teks & Tombol */}
            <div>
              <p className="text-violet-400 font-semibold mb-3">MOBILE APP</p>
              <h2 className="text-5xl font-bold leading-tight text-white">
                Akses Translate Event Dalam Genggaman
              </h2>
              <p className="text-gray-400 mt-6 text-lg leading-relaxed">
                Peserta dapat melihat subtitle realtime, mengirim pertanyaan,
                melihat jadwal event, dan melakukan check-in langsung dari
                aplikasi.
              </p>
              <div className="flex flex-wrap gap-4 mt-10">
                <button className="px-6 py-4 rounded-2xl bg-white text-black font-semibold flex items-center gap-2 hover:bg-gray-200 transition">
                  <Download size={18} /> Unduh
                </button>

              </div>
            </div>

            {/* BAGIAN KANAN: Gambar Local */}
            <div className="relative flex justify-center items-center">
              {/* Efek cahaya di belakang gambar (Glow) */}
              <div className="absolute inset-0 bg-violet-500/20 blur-[100px] rounded-full"></div>

              <img
                src="/images/promosi syncro.png" // Sesuaikan dengan nama file-mu di folder public
                alt="Mobile App Preview"
                className="relative z-10 w-full max-w-md h-auto object-contain drop-shadow-2xl hover:-translate-y-4 hover:scale-105 transition-all duration-500 ease-out"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTACT ================= */}
      <section id="contact" className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <p className="text-violet-400 font-semibold mb-3">CONTACT US</p>
            <h2 className="text-5xl font-bold leading-tight">
              Hubungi Tim Syncro AI
            </h2>
            <p className="text-gray-400 mt-6 leading-relaxed">
              Punya pertanyaan tentang sistem, pricing, atau demo platform? Tim
              kami siap membantu Anda.
            </p>
            <div className="space-y-5 mt-10">
              <ContactItem
                icon={<Phone size={18} />}
                text="+62 812-3456-7890"
              />
              <ContactItem
                icon={<Mail size={18} />}
                text="syncro.ai2026@gmail.com"
              />
              <ContactItem
                icon={<MapPin size={18} />}
                text="Tegal, Jawa Tengah, Indonesia"
              />
            </div>
          </div>

          {/* BAGIAN KANAN: FORM */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            <form onSubmit={handleContactSubmit} className="space-y-5">
              <input
                type="text"
                name="name"
                value={contactForm.name}
                onChange={handleContactChange}
                required
                placeholder="Nama Lengkap"
                className="w-full rounded-2xl bg-[#10172A] border border-white/5 px-5 py-4 outline-none focus:border-violet-500/50 transition-colors"
              />
              <input
                type="email"
                name="email"
                value={contactForm.email}
                onChange={handleContactChange}
                required
                placeholder="Email"
                className="w-full rounded-2xl bg-[#10172A] border border-white/5 px-5 py-4 outline-none focus:border-violet-500/50 transition-colors"
              />
              <textarea
                name="message"
                value={contactForm.message}
                onChange={handleContactChange}
                required
                rows={5}
                placeholder="Tulis pesan Anda..."
                className="w-full rounded-2xl bg-[#10172A] border border-white/5 px-5 py-4 outline-none resize-none focus:border-violet-500/50 transition-colors"
              />
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-white/10 py-8 text-center text-gray-500">
        © 2026 Syncro AI. All rights reserved.
      </footer>
    </main>
  );
}

/* ================= FEATURE CARD ================= */
function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 hover:border-violet-500/40 transition">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-600/20 to-blue-500/20 flex items-center justify-center text-violet-400 mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{desc}</p>
    </div>
  );
}

/* ================= PRICING CARD (INTEGRATED) ================= */
function PricingCard({
  title,
  price,
  features,
  popular,
  onSelect,
}: {
  title: string;
  price: string;
  features: string[];
  popular?: boolean;
  onSelect: () => void;
}) {
  return (
    <div
      className={`relative rounded-3xl border p-8 ${popular ? "border-violet-500 bg-violet-500/10" : "border-white/10 bg-white/5"}`}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-violet-600 text-sm">
          Most Popular
        </div>
      )}

      <h3 className="text-3xl font-bold">{title}</h3>
      <div className="mt-6">
        <span className="text-5xl font-black">{price}</span>
      </div>

      <div className="space-y-4 mt-8">
        {features.map((item, i) => (
          <div key={i} className="flex items-center gap-3 text-gray-300">
            <Check size={18} className="text-green-400" /> {item}
          </div>
        ))}
      </div>

      <button
        onClick={onSelect}
        className={`w-full py-4 rounded-2xl mt-10 font-semibold cursor-pointer transition-all ${popular
            ? "bg-gradient-to-r from-violet-600 to-blue-500 text-white shadow-[0_0_20px_rgba(109,40,217,0.3)]"
            : "border border-white/10 hover:bg-white/5 text-white"
          }`}
      >
        Pilih Paket
      </button>
    </div>
  );
}

/* ================= CONTACT ITEM ================= */
function ContactItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-violet-400">
        {icon}
      </div>
      <p className="text-gray-300">{text}</p>
    </div>
  );
}
