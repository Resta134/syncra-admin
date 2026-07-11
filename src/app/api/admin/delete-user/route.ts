export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Memakai kunci sakti bypass RLS
);

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "ID Pengguna tidak ditemukan!" }, { status: 400 });
    }

    // 1. Hapus user dari sistem autentikasi utama Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) throw authError;

    // 2. Hapus data dari tabel public.profiles (Otomatis terhapus jika ada cascade, tapi kita hapus manual demi keamanan)
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", userId);
      
    if (profileError) throw profileError;

    return NextResponse.json({ success: true, message: "Hak akses berhasil dicabut sepenuhnya!" });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}