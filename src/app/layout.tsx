import type { Metadata } from "next";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "SYNCRA AI - Dashboard",
  description: "Futuristic AI Event Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex bg-[#050505]">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}