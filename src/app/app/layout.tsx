"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  Settings,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const EMPLOYER_NAV = [
  { href: "/app/dashboard", label: "ATS Dashboard", icon: LayoutDashboard },
  { href: "/app/jobs", label: "Job Postings & Pipelines", icon: Briefcase },
  { href: "/app/jobs/new", label: "Create New Job", icon: PlusCircle },
  { href: "/app/settings", label: "Company Settings", icon: Settings },
];

function EmployerSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sticky top-24 space-y-6">
      {/* Organization Header */}
      <div className="flex items-center gap-3 p-2 border-b border-slate-100 pb-4">
        <div className="h-12 w-12 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
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

      {/* Navigation Links */}
      <nav className="space-y-1">
        {EMPLOYER_NAV.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href === "/app/jobs" && pathname.startsWith("/app/jobs/job-"));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                isActive
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </div>
              {isActive && <ChevronRight className="h-3.5 w-3.5 text-purple-200" />}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-slate-100">
        <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-900 space-y-1">
          <span className="font-bold block">7-Stage Kanban ATS</span>
          <p className="text-[11px] text-purple-700">
            Live candidate drag-and-drop, automated screening, and recruiter scorecards.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50/80 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <aside className="md:col-span-1">
            <Suspense fallback={<div className="h-48 bg-white rounded-2xl animate-pulse" />}>
              <EmployerSidebar />
            </Suspense>
          </aside>
          <main className="md:col-span-3">{children}</main>
        </div>
      </div>
    </div>
  );
}
