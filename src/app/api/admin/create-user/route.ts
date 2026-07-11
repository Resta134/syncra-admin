export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// VAKSIN VERCEL: Wajib pakai dummy URL jika env kosong saat build
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummy.supabase.co";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "dummy-key"; 

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: Request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: "Data tidak lengkap!" },
        { status: 400 },
      );
    }

    // 1. Buat user baru di Auth Supabase secara otomatis (Langsung Aktif tanpa link email)
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true, // Otomatis terkonfirmasi
        user_metadata: { full_name: name },
      });

    if (authError) throw authError;

    // 2. Masukkan role dan datanya ke tabel public.profiles
    if (authData?.user) {
      const { error: profileError } = await supabaseAdmin
        .from("profiles")
        .insert([
          {
            id: authData.user.id,
            full_name: name,
            email: email,
            package_tier: role, // Disimpan sebagai Role akses (Speaker/Moderator/Gatekeeper)
          },
        ]);

      if (profileError) throw profileError;
    }

    return NextResponse.json({
      success: true,
      message: "Akun kru berhasil dideploy!",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
