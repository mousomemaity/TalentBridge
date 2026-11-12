import { NavigationShell } from "@/components/navigation-shell";
import { Providers } from "@/components/providers";
import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "TalentBridge — Smart Hiring Platform & ATS",
  description:
    "A unified hiring platform connecting candidates with high-growth companies with an end-to-end Applicant Tracking System (ATS) and AI-assisted matching.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="font-sans">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
        <Providers>
          <NavigationShell>
            <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading...</div>}>
              {children}
            </Suspense>
          </NavigationShell>
        </Providers>
      </body>
    </html>
  );
}
