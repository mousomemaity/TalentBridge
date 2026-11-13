"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  UserCheck,
  Building2,
  ShieldCheck,
  Settings,
  LogOut,
  X,
  Sparkles,
} from "lucide-react";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar(props: SidebarProps) {
  return (
    <Suspense fallback={<aside className="hidden md:flex w-64 fixed top-16 left-0 bottom-0 bg-white border-r border-slate-200 z-30" />}>
      <SidebarContent {...props} />
    </Suspense>
  );
}

function SidebarContent({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isCandidate, isEmployer, isAdmin, logout, switchRole } = useAuth();

  const portalParam = searchParams.get("portal");

  // Determine which navigation item is currently active
  const isItemActive = (key: string): boolean => {
    switch (key) {
      case "dashboard":
        // Active ONLY when directly on either dashboard page and no conflicting portal query
        if (pathname === "/app/dashboard") {
          return portalParam !== "recruiter";
        }
        if (pathname === "/me/dashboard") {
          return portalParam !== "candidate";
        }
        return false;

      case "jobs":
        return (
          pathname === "/jobs" ||
          pathname.startsWith("/jobs/") ||
          pathname === "/app/jobs"
        );

      case "applications":
        return pathname === "/me/applications" || pathname.startsWith("/me/applications");

      case "candidates":
        return pathname.startsWith("/app/jobs/job-") || pathname.startsWith("/candidates");

      case "candidate-portal":
        return (
          portalParam === "candidate" ||
          (pathname.startsWith("/me") &&
            pathname !== "/me/dashboard" &&
            !pathname.startsWith("/me/applications") &&
            !pathname.startsWith("/me/settings"))
        );

      case "recruiter-portal":
        return (
          portalParam === "recruiter" ||
          (pathname.startsWith("/app") &&
            pathname !== "/app/dashboard" &&
            pathname !== "/app/jobs" &&
            !pathname.startsWith("/app/settings") &&
            !pathname.startsWith("/app/jobs/job-"))
        );

      case "admin-portal":
        return (
          portalParam === "admin" ||
          pathname.startsWith("/admin") ||
          pathname === "/login/admin"
        );

      case "settings":
        return (
          (pathname === "/app/settings" && portalParam !== "admin") ||
          pathname === "/me/settings"
        );

      case "logout":
        return false;

      default:
        return false;
    }
  };

  // Determine targets dynamically based on role
  const dashboardHref = isEmployer ? "/app/dashboard" : isAdmin ? "/admin/dashboard" : "/me/dashboard";
  const jobsHref = isEmployer ? "/app/jobs" : "/jobs";
  const settingsHref = isEmployer ? "/app/settings" : isAdmin ? "/admin/dashboard" : "/me/settings";

  // Dedicated role-specific portal targets (opens role login if not authenticated as that role)
  const candidatePortalHref = user?.role === "CAN" ? "/me/dashboard" : "/login/candidate";
  const recruiterPortalHref = isEmployer ? "/app/dashboard" : "/login/employer";
  const adminPortalHref = user?.role === "SA" ? "/admin/dashboard" : "/login/admin";

  const handleNavClick = (key: string) => {
    if (onClose) onClose();

    if (key === "logout") {
      logout();
      router.push("/login");
    }
  };

  const navSection1 = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      href: dashboardHref,
    },
    {
      key: "jobs",
      label: "Jobs",
      icon: Briefcase,
      href: jobsHref,
    },
    {
      key: "applications",
      label: "Applications",
      icon: FileText,
      href: "/me/applications",
    },
    {
      key: "candidates",
      label: "Candidates",
      icon: Users,
      href: "/app/jobs/job-1",
    },
  ];

  const navSection2 = [
    {
      key: "candidate-portal",
      label: "Candidate Portal",
      icon: UserCheck,
      href: candidatePortalHref,
    },
    {
      key: "recruiter-portal",
      label: "Recruiter Portal",
      icon: Building2,
      href: recruiterPortalHref,
    },
    {
      key: "admin-portal",
      label: "Admin Portal",
      icon: ShieldCheck,
      href: adminPortalHref,
    },
  ];

  const navSection3 = [
    {
      key: "settings",
      label: "Settings",
      icon: Settings,
      href: settingsHref,
    },
    {
      key: "logout",
      label: "Logout",
      icon: LogOut,
      href: "#",
      isLogout: true,
    },
  ];

  const renderNavItem = (item: {
    key: string;
    label: string;
    icon: React.ElementType;
    href: string;
    isLogout?: boolean;
  }) => {
    const Icon = item.icon;
    const active = isItemActive(item.key);

    if (item.isLogout) {
      return (
        <button
          key={item.key}
          type="button"
          onClick={() => handleNavClick("logout")}
          className="group w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:text-red-600 hover:bg-red-50 text-left transition-all duration-150 cursor-pointer"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 group-hover:bg-red-100 group-hover:text-red-600 shrink-0 transition-colors">
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-sm font-medium">{item.label}</span>
        </button>
      );
    }

    return (
      <Link
        key={item.key}
        href={item.href}
        onClick={() => handleNavClick(item.key)}
        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-150 ${
          active
            ? "bg-slate-100/90 text-slate-900 font-semibold shadow-xs"
            : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full shrink-0 transition-all duration-150 ${
              active
                ? "bg-[#0F172A] text-white shadow-xs"
                : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-800"
            }`}
          >
            <Icon className={`h-4 w-4 ${active ? "text-white" : "text-slate-500 group-hover:text-slate-800"}`} />
          </div>
          <span className={`text-sm ${active ? "text-slate-900 font-semibold" : "text-slate-600 group-hover:text-slate-900"}`}>
            {item.label}
          </span>
        </div>
        {active && (
          <div className="h-2 w-2 rounded-full bg-[#0F172A] mr-1" />
        )}
      </Link>
    );
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 left-0 bottom-0 w-64 bg-white border-r border-slate-200/90 z-40 md:z-30 flex flex-col justify-between py-4 px-3 overflow-y-auto transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="space-y-4">
          {/* Mobile Header with close button */}
          <div className="flex items-center justify-between px-2 pb-2 md:hidden border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Navigation Menu
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Section 1: Core Dashboard & Workflows */}
          <nav className="space-y-1">
            {navSection1.map(renderNavItem)}
          </nav>

          {/* Subtle Divider 1 */}
          <div className="my-2 border-t border-slate-100 mx-2" />

          {/* Section 2: Portals */}
          <div className="px-3 py-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Portals
            </span>
          </div>
          <nav className="space-y-1">
            {navSection2.map(renderNavItem)}
          </nav>

          {/* Subtle Divider 2 */}
          <div className="my-2 border-t border-slate-100 mx-2" />

          {/* Section 3: Settings & Logout */}
          <nav className="space-y-1">
            {navSection3.map(renderNavItem)}
          </nav>
        </div>

        {/* Subtle Workspace Status Card at Bottom */}
        <div className="pt-4 border-t border-slate-100 mt-4 px-1">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-[11px]">
                <Sparkles className="h-3 w-3 text-blue-600" />
                JobPilot ATS
              </span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" title="System Online" />
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              {isAdmin
                ? "Full Admin Access Active"
                : isEmployer
                ? "NexusAI Enterprise Recruiter"
                : "Candidate Career Suite"}
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

