"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import {
  Briefcase,
  Building2,
  ChevronDown,
  KanbanSquare,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  User,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Navbar() {
  const pathname = usePathname();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const { user, isAuthenticated, isCandidate, isEmployer, logout, switchRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const isPublicPage = !pathname.startsWith("/me") && !pathname.startsWith("/app");

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Briefcase className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                TalentBridge
                <span className="inline-block h-2 w-2 rounded-full bg-blue-600"></span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-600 -mt-1">
                Job Portal & ATS
              </span>
            </div>
          </Link>

          {/* Desktop Public Nav */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/jobs"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${pathname === "/jobs"
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
            >
              <Search className="h-4 w-4" />
              Find Jobs
            </Link>
            <Link
              href="/companies"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5 ${pathname.startsWith("/companies")
                  ? "text-blue-600 bg-blue-50 font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
            >
              <Building2 className="h-4 w-4" />
              Companies
            </Link>
          </nav>
        </div>

        {/* Right side Actions & Role Switcher */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Role Switcher Pill (Great for demonstration & review) */}
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Active Role:{" "}
              <span className="text-blue-600">
                {hasMounted
                  ? isEmployer
                    ? "Employer / Recruiter"
                    : "Candidate"
                  : "Loading..."}
              </span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {roleDropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95"
                onMouseLeave={() => setRoleDropdownOpen(false)}
              >
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Persona Demo
                </div>
                <button
                  onClick={() => {
                    switchRole("candidate");
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${isCandidate ? "bg-blue-50 text-blue-700 font-semibold" : "hover:bg-slate-50 text-slate-700"
                    }`}
                >
                  <User className="h-4 w-4" />
                  Candidate (Alex Rivera)
                </button>
                <button
                  onClick={() => {
                    switchRole("employer");
                    setRoleDropdownOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-colors cursor-pointer ${isEmployer ? "bg-purple-50 text-purple-700 font-semibold" : "hover:bg-slate-50 text-slate-700"
                    }`}
                >
                  <KanbanSquare className="h-4 w-4" />
                  Employer ATS (Sarah Jenkins)
                </button>
              </div>
            )}
          </div>

          {/* Logged in Navigation Direct Links */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              {isCandidate && (
                <Link href="/me/dashboard">
                  <Button variant="outline" size="sm" className="gap-1.5 font-medium">
                    <LayoutDashboard className="h-4 w-4 text-blue-600" />
                    Candidate Portal
                  </Button>
                </Link>
              )}

              {isEmployer && (
                <Link href="/app/dashboard">
                  <Button variant="purple" size="sm" className="gap-1.5 font-medium shadow-sm">
                    <KanbanSquare className="h-4 w-4 text-white" />
                    Employer ATS
                  </Button>
                </Link>
              )}

              {/* User Avatar with Profile & Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  href={isEmployer ? "/app/dashboard" : "/me/profile"}
                  className="flex items-center gap-2 group"
                >
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover ring-2 ring-slate-100 group-hover:ring-blue-400 transition-all"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                      {user?.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-xs font-medium text-slate-700 hidden lg:inline-block">
                    {user?.name}
                  </span>
                </Link>
                <button
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register/candidate">
                <Button size="sm">Get Started</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 rounded-lg hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 py-5 space-y-4">
          <nav className="flex flex-col space-y-2">
            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Find Jobs
            </Link>
            <Link
              href="/companies"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              Companies
            </Link>
            {isCandidate && (
              <Link
                href="/me/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
              >
                Candidate Dashboard
              </Link>
            )}
            {isEmployer && (
              <Link
                href="/app/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 rounded-lg"
              >
                Employer ATS Pipeline
              </Link>
            )}
          </nav>
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>Switch persona:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => switchRole("candidate")}
                  className="px-2 py-1 rounded bg-slate-100 font-semibold text-slate-700"
                >
                  Candidate
                </button>
                <button
                  onClick={() => switchRole("employer")}
                  className="px-2 py-1 rounded bg-purple-100 font-semibold text-purple-700"
                >
                  Employer
                </button>
              </div>
            </div>
            {isAuthenticated ? (
              <Button variant="outline" onClick={logout} className="w-full text-red-600">
                Sign out ({user?.name})
              </Button>
            ) : (
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full">Sign In / Register</Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
