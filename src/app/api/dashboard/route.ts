export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from "next/server";
import client from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {

    const db = client.db(process.env.MONGODB_DB);
    const collection = db.collection("data_youtube_events_clean");

    // ===========================
    // QUERY PARAMETER
    // ===========================

    const searchParams = request.nextUrl.searchParams;

    const year = searchParams.get("year");
    const startYear = searchParams.get("startYear");
    const endYear = searchParams.get("endYear");
    const category = searchParams.get("category");

    // ===========================
    // FILTER MONGODB
    // ===========================

    let match: any = {};

    if (year) {
      match.year = Number(year);
    }

    if (startYear && endYear) {
      match.year = {
        $gte: Number(startYear),
        $lte: Number(endYear),
      };
    }

    // ===========================
    // SUMMARY
    // ===========================

    const totalVideo =
      await collection.countDocuments(match);

    const totalChannel = (
      await collection.distinct(
        "channel_name",
        match
      )
    ).length;

    const totalViews = await collection
      .aggregate([
        {
          $match: match,
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$view_count",
            },
          },
        },
      ])
      .toArray();

    // ===========================
    // PIE CHART
    // ===========================

    const pieChart = await collection
      .aggregate([
        {
          $match: match,
        },
        {
          $group: {
            _id: "$event_type",
            totalViews: {
              $sum: "$view_count",
            },
            totalVideo: {
              $sum: 1,
            },
          },
        },
        {
          $sort: {
            totalViews: -1,
          },
        },
      ])
      .toArray();

    // ===========================
    // BAR CHART (DRILL DOWN)
    // ===========================

    let barChart: any[] = [];

    if (category) {

      const barMatch = {
        ...match,
        event_type: category,
      };

      barChart = await collection
        .aggregate([
          {
            $match: barMatch,
          },
          {
            $project: {
              _id: 0,
              title: "$title_clean",
              views: "$view_count",
              url: "$video_url",
              channel: "$channel_name",
            },
          },
          {
            $sort: {
              views: -1,
            },
          },
          {
            $limit: 10,
          },
        ])
        .toArray();
    }

    // ===========================
    // FILTER TAHUN
    // ===========================

    const years = await collection.distinct("year");

    years.sort((a: number, b: number) => b - a);

    

    // ===========================
    // RESPONSE
    // ===========================

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
        totalViews:
          totalViews[0]?.total || 0,
      },

      filters: {
        availableYears: years,
      },

      visualization: {
        pie: pieChart.map((item) => ({
          category: item._id,
          totalViews: item.totalViews,
          totalVideo: item.totalVideo,
        })),

        bar: barChart,
      },
    });

  } catch (error) {

    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error",
      },
      {
        status: 500,
      }
    );

  }
}