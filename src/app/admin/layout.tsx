"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  ShieldCheck,
  LayoutDashboard,
  Building2,
  Users,
  Activity,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, token, isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user || !token) {
      router.replace("/login/admin");
      return;
    }

    // Role-based protection: Super Admin only
    if (user.role !== "SA") {
      // Reject non-admin roles: Never show another portal's dashboard
      if (user.role === "CAN") {
        router.replace("/me/dashboard");
      } else {
        router.replace("/app/dashboard");
      }
    }
  }, [isLoading, isAuthenticated, user, token, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Verifying Super Admin clearance...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !token || user.role !== "SA") {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Super Admin Top Header */}
      <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-900/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black shadow-md">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-tight text-white">JobPilot</span>
                <Badge className="bg-amber-400/10 text-amber-300 border-amber-400/30 text-[10px] font-bold">
                  SUPER ADMIN
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">Root Management & Platform Governance</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Atlas MongoDB: Connected</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-200">{user.name}</p>
                <p className="text-[10px] text-slate-400">{user.email}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  logout();
                  router.push("/login/admin");
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-red-950/60 hover:text-red-400 border border-slate-700 transition-colors text-slate-300 cursor-pointer"
                title="Sign out of Super Admin Console"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}

