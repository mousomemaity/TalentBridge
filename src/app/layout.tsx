import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TalentBridge — Job Portal & Applicant Tracking System (ATS)",
  description:
    "A unified hiring platform connecting candidates with high-growth companies with an end-to-end Applicant Tracking System (ATS) and AI-assisted matching.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <Providers>
          <Suspense fallback={<div className="h-16 border-b border-slate-200 bg-white" />}>
            <Navbar />
          </Suspense>
          <div className="flex-1">
            <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading...</div>}>
              {children}
            </Suspense>
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
