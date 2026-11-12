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
} from "lucide-react";

const CANDIDATE_TABS = [
  { href: "/me/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/me/profile", label: "Profile", icon: UserCheck },
  { href: "/me/resume", label: "Resumes", icon: FileText },
  { href: "/me/applications", label: "Applications", icon: Briefcase },
  { href: "/me/saved-jobs", label: "Saved Jobs", icon: Bookmark },
  { href: "/me/job-alerts", label: "Job Alerts", icon: BellRing },
  { href: "/me/interviews", label: "Interviews", icon: Video },
  { href: "/me/assessments", label: "Assessments", icon: Award },
  { href: "/me/offers", label: "Offers", icon: Gift },
  { href: "/me/settings", label: "Settings", icon: Settings },
];

function CandidateSubHeader() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <img
            src={
              user?.avatarUrl ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
            }
            alt={user?.name || "Candidate"}
            className="h-10 w-10 rounded-xl object-cover ring-2 ring-blue-100 shrink-0"
          />
          <div className="overflow-hidden">
            <h3 className="font-bold text-sm text-slate-900 truncate">
              {user?.name || "Alex Rivera"}
            </h3>
            <p className="text-xs text-slate-500 truncate flex items-center gap-1.5">
              <span>Candidate Career Suite</span>
              <span className="inline-flex items-center gap-1 text-[10px] text-blue-600 font-semibold bg-blue-50 px-1.5 py-0.2 rounded">
                <Sparkles className="h-2.5 w-2.5" /> AI Profile 88%
              </span>
            </p>
          </div>
        </div>

        <Link href="/jobs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-2xs transition-colors cursor-pointer">
            Explore Open Jobs
          </span>
        </Link>
      </div>

      {/* Sub-nav horizontal pills */}
      <div className="flex items-center gap-1.5 pt-3 overflow-x-auto scrollbar-none">
        {CANDIDATE_TABS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-700 border border-blue-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function CandidateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/70 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={<div className="h-24 bg-white rounded-2xl animate-pulse mb-6" />}>
          <CandidateSubHeader />
        </Suspense>
        <div>{children}</div>
      </div>
    </div>
  );
}
