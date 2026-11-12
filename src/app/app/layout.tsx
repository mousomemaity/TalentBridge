"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Settings,
  Sparkles,
} from "lucide-react";

const EMPLOYER_TABS = [
  { href: "/app/dashboard", label: "ATS Dashboard", icon: LayoutDashboard },
  { href: "/app/jobs", label: "Job Postings & Pipelines", icon: Briefcase },
  { href: "/app/jobs/new", label: "Create New Job", icon: PlusCircle },
  { href: "/app/settings", label: "Company Settings", icon: Settings },
];

function EmployerSubHeader() {
  const pathname = usePathname();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-3 sm:p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs shrink-0">
            NA
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-sm text-slate-900 truncate">
              NexusAI Technologies
            </h3>
            <p className="text-[11px] text-purple-700 font-semibold flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Enterprise ATS Plan
            </p>
          </div>
        </div>

        <Link href="/app/jobs/new">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-purple-600 text-white hover:bg-purple-700 shadow-2xs transition-colors cursor-pointer">
            <PlusCircle className="h-3.5 w-3.5" /> Post Opening
          </span>
        </Link>
      </div>

      {/* Sub-nav horizontal pills */}
      <div className="flex items-center gap-1.5 pt-3 overflow-x-auto scrollbar-none">
        {EMPLOYER_TABS.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === "/app/jobs" && pathname.startsWith("/app/jobs/job-"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                isActive
                  ? "bg-purple-50 text-purple-700 border border-purple-200/80"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className={`h-3.5 w-3.5 ${isActive ? "text-purple-600" : "text-slate-400"}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/70 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Suspense fallback={<div className="h-24 bg-white rounded-2xl animate-pulse mb-6" />}>
          <EmployerSubHeader />
        </Suspense>
        <div>{children}</div>
      </div>
    </div>
  );
}
