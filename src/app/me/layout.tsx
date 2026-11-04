"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  LayoutDashboard,
  UserCheck,
  FileText,
  Briefcase,
  Bookmark,
  BellRing,
  Video,
  Award,
  Gift,
  Settings,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/me/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/me/profile", label: "Profile", icon: UserCheck },
  { href: "/me/resume", label: "Resumes", icon: FileText },
  { href: "/me/applications", label: "My Applications", icon: Briefcase },
  { href: "/me/saved-jobs", label: "Saved Jobs", icon: Bookmark },
  { href: "/me/job-alerts", label: "Job Alerts", icon: BellRing },
  { href: "/me/interviews", label: "Interviews", icon: Video },
  { href: "/me/assessments", label: "Assessments", icon: Award },
  { href: "/me/offers", label: "Offers", icon: Gift },
  { href: "/me/settings", label: "Settings", icon: Settings },
];

function CandidateSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sticky top-24 space-y-6">
      {/* Profile Card Summary */}
      <div className="flex items-center gap-3 p-2 border-b border-slate-100 pb-4">
        <img
          src={
            user?.avatarUrl ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
          }
          alt={user?.name || "Candidate"}
          className="h-12 w-12 rounded-xl object-cover ring-2 ring-blue-100"
        />
        <div className="overflow-hidden">
          <h3 className="font-bold text-sm text-slate-900 truncate">
            {user?.name || "Alex Rivera"}
          </h3>
          <p className="text-xs text-slate-500 truncate">Candidate Portal</p>
          <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.5 rounded mt-0.5">
            <Sparkles className="h-2.5 w-2.5" /> AI Profile 88%
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xl transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-blue-200" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <Suspense fallback={<div className="h-48 bg-white rounded-2xl animate-pulse" />}>
              <CandidateSidebar />
            </Suspense>
          </aside>
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
