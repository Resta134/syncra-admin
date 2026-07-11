import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Mengabaikan error TypeScript saat build di Vercel jika ada ketidaksesuaian tipe
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
