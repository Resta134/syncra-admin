import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

// Paksa agar route API ini dibaca secara dinamis oleh Next.js saat build
export const dynamic = 'force-dynamic';

export async function GET() {
  // 1. Cek apakah client supabase berhasil terinisialisasi
  if (!supabase) {
    return NextResponse.json(
      { success: false, error: "Supabase client gagal diinisialisasi. Periksa environment variables." }, 
      { status: 500 }
    );
  }

  // 2. Jika lolos pengecekan di atas, TypeScript tahu pasti kalau 'supabase' tidak null
  const { data, error } = await supabase
    .from('connection_test')
    .select('*');

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}