export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/mongodb";
import { createClient } from "@supabase/supabase-js";

// VAKSIN TOTAL: Gunakan URL berformat lengkap agar .startsWith('http') milik Supabase tidak crash
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://dummyproject.supabase.co";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummykey";

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: NextRequest) {
  // Jika sedang di-build oleh Vercel (env belum terbaca), potong jalur di sini
  if (supabaseUrl.includes("dummyproject")) {
    return NextResponse.json({ success: true, message: "Bypass build time" });
  }

  try {
    const dbName = process.env.MONGODB_DB;
    if (!dbName) {
      return NextResponse.json({ error: "Database name missing" }, { status: 500 });
    }
    
    const db = client.db(dbName);
    const collection = db.collection("data_youtube_events_clean");

    // ===========================
    // QUERY PARAMETER & FILTERS
    // ===========================
    const searchParams = request.nextUrl.searchParams;
    const year = searchParams.get("year");
    const startYear = searchParams.get("startYear");
    const endYear = searchParams.get("endYear");
    const category = searchParams.get("category");

    const match: Record<string, any> = {};
    if (year) match.year = Number(year);
    if (startYear && endYear) {
      match.year = { $gte: Number(startYear), $lte: Number(endYear) };
    }

    // ===========================
    // AMBIL DATA DARI MONGODB
    // ===========================
    const totalVideo = await collection.countDocuments(match);
    const totalChannel = (await collection.distinct("channel_name", match)).length;

    const totalViews = await collection
      .aggregate([{ $match: match }, { $group: { _id: null, total: { $sum: "$view_count" } } }])
      .toArray();

    const pieChart = await collection
      .aggregate([
        { $match: match },
        { $group: { _id: "$event_type", totalViews: { $sum: "$view_count" }, totalVideo: { $sum: 1 } } },
        { $sort: { totalViews: -1 } }
      ])
      .toArray();

    let barChart: any[] = [];
    if (category) {
      barChart = await collection
        .aggregate([
          { $match: { ...match, event_type: category } },
          { $project: { _id: 0, title: "$title_clean", views: "$view_count", url: "$video_url", channel: "$channel_name" } },
          { $sort: { views: -1 } },
          { $limit: 10 }
        ])
        .toArray();
    }

    const years = await collection.distinct("year");
    years.sort((a: number, b: number) => b - a);

    return NextResponse.json({
      success: true,
      sync: {
        lastSync: "09 Jul 2026 09:35 WIB",
        status: "Success",
        updatedRecords: totalVideo,
        newRecords: 8,
      },
      summary: {
        totalVideo,
        totalChannel,
        totalViews: totalViews[0]?.total || 0,
      },
      filters: { availableYears: years },
      visualization: {
        pie: pieChart.map((item) => ({
          category: item._id,
          totalViews: item.totalViews,
          totalVideo: item.totalVideo,
        })),
        bar: barChart,
      },
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message || "Internal Server Error" }, { status: 500 });
  }
}