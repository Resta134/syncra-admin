"use client";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { User, Mail, Shield, MapPin } from 'lucide-react';
import { useEffect, useState } from "react";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  package_tier: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('id, full_name, email, package_tier')
            .eq('id', user.id)
            .single();

          if (data) setProfile(data);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // Logika Pemformatan ID Baru
  const formatCustomId = (tier: string, fullId: string) => {
    // 1. Kondisi khusus jika package_tier adalah 'Starter'
    if (tier?.toLowerCase() === 'starter') {
      return 'SYNC-Super-Admin';
    }
    
    // 2. Format default untuk Enterprise, Free, dll (Contoh: SYNC-B2B2F391)
    const shortId = fullId.slice(0, 8).toUpperCase();
    return `SYNC-${shortId}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl p-8 text-center text-gray-400">Loading profile data...</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-4xl space-y-8">
        <div className="glass-card p-8 flex items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-3xl"></div>
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <User size={48} className="text-black" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">{profile?.full_name || "Anonymous"}</h2>
            {/* Menampilkan ID yang sudah diformat sesuai logika baru */}
            <p className="text-cyan-400 font-mono text-sm tracking-widest uppercase">
              {profile ? formatCustomId(profile.package_tier, profile.id) : "SYNC-XXXXXX"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-6 space-y-4">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Personal Info</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-cyan-500" /> {profile?.email || "No email available"}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin size={16} className="text-cyan-500" /> Tegal, Central Java
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield size={16} className="text-cyan-500" /> Admin Manager Role
              </div>
            </div>
          </div>
          <div className="glass-card p-6 flex flex-col justify-center items-center border-dashed border-white/10">
            <p className="text-xs text-gray-500 italic uppercase">Security Clearance: Level 4</p>
            <div className="mt-4 px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[10px] font-bold">
              ACCOUNT VERIFIED
            </div>
          </div>
        </div>
      </div>
    </>
  );
}