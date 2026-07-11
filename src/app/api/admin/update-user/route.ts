export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Kunci sakti untuk bypass RLS tabel profiles
);

export async function POST(request: Request) {
  try {
    const { userId, name, role } = await request.json();

    if (!userId || !name || !role) {
      return NextResponse.json(
        { error: "Data tidak lengkap!" },
        { status: 400 },
      );
    }

    // Eksekusi update langsung ke tabel profiles menggunakan otoritas penuh Admin
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        full_name: name,
        package_tier: role, // Memperbarui tingkatan role (Speaker/Moderator/Gatekeeper)
      })
      .eq("id", userId);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Profil kru berhasil diperbarui!",
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
