"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // Sesuaikan path ini
import Navbar from "@/components/Navbar";
import { Users, Calendar, Languages, Zap } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart, // TAMBAHKAN INI
    Pie,
    Legend,
    Cell,
} from "recharts";

// Definisi tipe data untuk grafik
type ChartData = {
    bulan: string;
    total_event: number;
};

export default function Home() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    // State untuk menyimpan angka KPI dari Supabase
    const [kpiStats, setKpiStats] = useState({
        events: 0,
        participants: 0,
        accuracy: "98.2%", // Statis (bisa diubah jika ada tabel log AI)
        latencies: "12 ms", // Statis
    });

    // State untuk pola Drill-Down
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [rawVideoData, setRawVideoData] = useState<any[]>([]); // Menyimpan seluruh data video
    const [categorySummary, setCategorySummary] = useState<any[]>([]); // Menyimpan data agregat kategori

    // State untuk menyimpan data grafik dari MongoDB
    const [chartData, setChartData] = useState<ChartData[]>([]);

    const [summary, setSummary] = useState({
        totalVideo: 0,
        totalChannel: 0,
        totalViews: 0,
    });

    // penambahan baru
    const [pieData, setPieData] = useState<any[]>([]);
    const [barData, setBarData] = useState<any[]>([]);
    const [availableYears, setAvailableYears] = useState<number[]>([]);
    const currentYear = new Date().getFullYear();
    const [filterMode, setFilterMode] = useState<
        "default" | "lastYear" | "range"
    >("default");

    const [selectedYear, setSelectedYear] =
        useState(currentYear);

    const [rangeStart, setRangeStart] =
        useState(currentYear - 2);

    const [rangeEnd, setRangeEnd] =
        useState(currentYear);

    const COLORS = [
        "#06b6d4",
        "#3b82f6",
        "#8b5cf6",
        "#10b981",
        "#f59e0b",
    ];
    const totalViews = pieData.reduce(
        (sum, item) => sum + item.totalViews,
        0
    );
    const fetchDashboard = useCallback(async () => {

        setLoading(true);

        try {

            let url = "/api/dashboard";

            if (filterMode === "default") {
                url += `?year=${selectedYear}`;
            }

            if (filterMode === "lastYear") {
                url += `?year=${currentYear - 1}`;
            }

            if (filterMode === "range") {
                url += `?startYear=${rangeStart}&endYear=${rangeEnd}`;
            }

            const res = await fetch(url);
            const data = await res.json();

            console.log(data);

            setSummary(data.summary);
            setPieData(data.visualization.pie);
            setBarData([]);
            setSelectedCategory(null);
            setAvailableYears(data.filters.availableYears);

        } catch (err) {

            console.error(err);

        } finally {

            setLoading(false);

        }

    }, [
        filterMode,
        selectedYear,
        rangeStart,
        rangeEnd,
        currentYear
    ]);
    // ================= UTAMA: SATPAM PENGUNCI DASHBOARD & FETCH DATA =================
    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    // Tampilan loading proteksi saat sistem mengecek akun dan menarik data
    // ================= LOADING =================
    if (loading) {
        return (
            <div className="min-h-screen bg-[#070B1A] flex items-center justify-center text-white">
                <div className="text-center space-y-3">
                    <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />

                    <p className="animate-pulse text-xs tracking-[0.3em] font-black text-cyan-400 uppercase">
                        Securing Connection & Fetching Data...
                    </p>
                </div>
            </div>
        );
        // ================= KPI =================

    }



    //  penambhan baru
    const handlePieClick = async (entry: any) => {

        setSelectedCategory(entry.category);

        let url = "/api/dashboard";

        if (filterMode === "default") {
            url += `?year=${selectedYear}&category=${entry.category}`;
        }

        if (filterMode === "lastYear") {
            url += `?year=${currentYear - 1}&category=${entry.category}`;
        }

        if (filterMode === "range") {
            url += `?startYear=${rangeStart}&endYear=${rangeEnd}&category=${entry.category}`;
        }

        const res = await fetch(url);

        const data = await res.json();

        setBarData(data.visualization.bar);

    }

    // Konfigurasi Array untuk KPI agar mudah di-render
    const kpiCards = [
        { label: "Total Events", val: kpiStats.events.toString(), icon: Calendar },
        {
            label: "Active Participants",
            val: kpiStats.participants.toString(),
            icon: Users,
        },
        { label: "AI Accuracy", val: kpiStats.accuracy, icon: Zap },
        { label: "Average Latency", val: kpiStats.latencies, icon: Languages },
    ];



    // ================= TAMPILAN DASHBOARD ASLI (JIKA LOLOS LOGIN) =================
    return (
        <>
            <Navbar />
            <div className="space-y-8 pb-10">
                <div>
                    <h2 className="text-3xl font-bold text-glow text-white">
                        YouTube Event Analytics
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                        <p className="text-gray-400 text-sm">
                            Real-time performance of SYNCRO AI system.
                        </p>

                    </div>
                </div>

                <div className="flex gap-3">
                    <Select
                        value={filterMode}
                        onValueChange={(value: any) =>
                            setFilterMode(value)
                        }
                    >

                        <SelectTrigger className="w-44 bg-[#111827] border-cyan-500/20 text-white">
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent className="bg-[#111827] border-cyan-500/20 text-white">

                            <SelectItem value="default">
                                Current Year
                            </SelectItem>

                            <SelectItem value="lastYear">
                                Previous Year
                            </SelectItem>

                            <SelectItem value="range">
                                Range
                            </SelectItem>

                        </SelectContent>

                    </Select>
                    {
                        filterMode === "default" && (
                            <Select
                                value={selectedYear.toString()}
                                onValueChange={(value) =>
                                    setSelectedYear(Number(value))
                                }
                            >
                                <SelectTrigger className="w-32 bg-[#111827] border-cyan-500/20 text-white">
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent
                                    side="bottom"
                                    align="start"
                                    sideOffset={6}
                                    className="max-h-60 bg-[#111827] text-white"
                                >
                                    {availableYears.map((year) => (
                                        <SelectItem
                                            key={year}
                                            value={year.toString()}
                                        >
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )
                    }
                    {
                        filterMode === "range" && (
                            <>
                                <Select
                                    // Menggunakan rangeStart sebagai value (dikonversi ke string untuk Shadcnui Select)
                                    value={rangeStart.toString()}
                                    // Menyesuaikan dengan kode dulu: mengupdate state rangeStart
                                    onValueChange={(value) => setRangeStart(Number(value))}
                                >
                                    <SelectTrigger className="w-28 bg-[#111827] text-white">
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent className="max-h-60 bg-[#111827] text-white">
                                        {availableYears.map((year) => (
                                            <SelectItem
                                                key={year}
                                                value={year.toString()}
                                            >
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <span className="text-gray-500">-</span>

                                <Select
                                    // Menggunakan rangeEnd sebagai value (dikonversi ke string untuk Shadcnui Select)
                                    value={rangeEnd.toString()}
                                    // Menyesuaikan dengan kode dulu: mengupdate state rangeEnd (buku rangeStart)
                                    onValueChange={(value) => setRangeEnd(Number(value))}
                                >
                                    <SelectTrigger className="w-28 bg-[#111827] text-white">
                                        <SelectValue />
                                    </SelectTrigger>

                                    <SelectContent className="max-h-60 bg-[#111827] text-white">
                                        {availableYears.map((year) => (
                                            <SelectItem
                                                key={year}
                                                value={year.toString()}
                                            >
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </>)
                    }
                </div>

                {/* SECTION 2: ANALYTICS CHART (Data dari MongoDB via API) */}
                <div className="glass-card p-6 border border-white/5">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Calendar size={18} className="text-cyan-400" />
                            Event analysis based on view count
                        </h3>
                        <p className="text-xs text-gray-500">
                            Visualisasi pertumbuhan event yang direkam di MongoDB.
                        </p>
                    </div>

                    {/* code pie chart dibawah sini */}
                    <div className="h-[600px]">
                        {
                            selectedCategory == null ?
                                (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                dataKey="totalViews"
                                                nameKey="category"
                                                outerRadius={250}
                                                label
                                                onClick={handlePieClick}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell
                                                        key={index}
                                                        fill={COLORS[index % COLORS.length]}
                                                    />
                                                ))}
                                            </Pie>

                                            <Tooltip />

                                            <Legend
                                                layout="vertical"
                                                align="right"
                                                verticalAlign="middle"
                                                formatter={(value, entry: any) => {
                                                    const total = pieData.reduce(
                                                        (sum, item) => sum + item.totalViews,
                                                        0
                                                    );

                                                    const percent =
                                                        ((entry.payload.totalViews / total) * 100).toFixed(1);

                                                    return `${value} (${percent}%)`;
                                                }}
                                            />

                                        </PieChart>
                                    </ResponsiveContainer>

                                )
                                :
                                (
                                    <ResponsiveContainer width="100%" height="100%">
                                        {/* 1. HEADER CONTAINER: Menggunakan flex-col pada mobile dan sm:flex-row pada desktop untuk responsivitas */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

                                            {/* Grup Kiri: Tombol Back + Judul Kategori (Didekatkan secara logis dengan gap-3) */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setSelectedCategory(null)}
                                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors"
                                                >
                                                    {/* Menambahkan ikon panah membuat UX tombol back jauh lebih intuitif */}
                                                    <span className="text-base">←</span> Back
                                                </button>

                                                {/* Pembatas vertikal halus (opsional, meningkatkan estetika profesional) */}
                                                <div className="h-5 w-[1px] bg-gray-700 hidden sm:block"></div>

                                                {/* Judul Kategori sebagai sub-header utama */}
                                                <h2 className="text-lg font-semibold text-gray-200 capitalize">
                                                    {selectedCategory || "Semua Kategori"}
                                                </h2>
                                            </div>

                                        </div>
                                        <BarChart
                                            layout="vertical"
                                            data={barData}
                                            cursor="pointer"

                                            onClick={(data: any) => {

                                                if (data?.url) {
                                                    window.open(data.url, "_blank");
                                                }
                                            }}
                                            margin={{
                                                left: 10,
                                                right: 20,
                                                bottom: 45
                                            }}
                                        >

                                            <CartesianGrid strokeDasharray="3 3" />

                                            <XAxis type="number" />

                                            <YAxis
                                                type="category"
                                                dataKey="title"
                                                width={200}
                                                tickFormatter={(value) => {
                                                    const words = value.split(" ");
                                                    if (words.length <= 3) return value;
                                                    return words.slice(0, 3).join(" ") + " ...";
                                                }}
                                            />

                                            <Tooltip
                                                content={({ active, payload }) => {

                                                    if (!active || !payload || !payload.length)
                                                        return null;

                                                    const data = payload[0].payload;

                                                    return (

                                                        <div className="bg-[#111827] border border-cyan-500 rounded-lg p-3 shadow-xl">

                                                            <p className="text-white font-semibold">
                                                                {data.title}
                                                            </p>

                                                            <p className="text-cyan-400 text-sm">
                                                                Channel :
                                                               
                                                                {data.channel}
                                                            </p>

                                                            <p className="text-yellow-400 text-sm">
                                                                Views :
                                                                {" "}
                                                                {data.views.toLocaleString()}
                                                            </p>

                                                            <p className="text-gray-400 text-xs mt-2">
                                                                Click bar to open YouTube
                                                            </p>

                                                        </div>

                                                    );

                                                }}
                                            />

                                            <Bar
                                                dataKey="views"
                                                fill="#06b6d4"
                                                shape={(props: any) => {

                                                    const {
                                                        x,
                                                        y,
                                                        width,
                                                        height,
                                                        payload
                                                    } = props;

                                                    return (

                                                        <rect
                                                            x={x}
                                                            y={y}
                                                            width={width}
                                                            height={height}
                                                            rx={5}
                                                            fill="#06b6d4"
                                                            style={{ cursor: "pointer" }}
                                                            onClick={() => {
                                                                window.open(payload.url, "_blank");
                                                            }}
                                                        />
                                                    );
                                                }}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                )
                        }
                    </div>
                </div>

            </div>
        </>
    );
}
