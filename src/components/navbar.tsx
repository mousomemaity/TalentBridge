"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { apiClient } from "@/lib/api-client";
import { formatRelativeTime } from "@/lib/utils";
import { NotificationItem } from "@/types";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Building2,
  ShieldCheck,
  Settings,
  LogOut,
  Sparkles,
  Bell,
} from "lucide-react";

interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export function Navbar(props: NavbarProps) {
  return (
    <Suspense fallback={<header className="sticky top-0 z-40 w-full h-16 border-b border-slate-200/80 bg-white" />}>
      <NavbarContent {...props} />
    </Suspense>
  );
}

function NavbarContent({ onToggleSidebar, isSidebarOpen }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, isCandidate, isEmployer, isAdmin, logout, switchRole } = useAuth();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationDropdownOpen, setNotificationDropdownOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  const [searchQuery, setSearchQuery] = useState(searchParams.get("query") || "");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);


  // Fetch real notifications from existing API integration
  useEffect(() => {
    let mounted = true;
    const fetchNotifications = async () => {
      try {
        const data = await apiClient.getNotifications();
        if (mounted && Array.isArray(data)) {
          setNotifications(data);
        }
      } catch {
        // Fallback silently if offline or mock handler
      }
    };
    fetchNotifications();
    return () => {
      mounted = false;
    };
  }, [user]);

  // Sync search input if query param changes externally
  useEffect(() => {
    const q = searchParams.get("query");
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Global keyboard shortcut '/' to focus search bar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileDropdownOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      router.push("/jobs");
      return;
    }
    router.push(`/jobs?query=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleMarkAllRead = async () => {
    setIsMarkingRead(true);
    try {
      await apiClient.markNotificationsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, readAt: new Date().toISOString() }))
      );
    } catch {
      // Fallback
    } finally {
      setIsMarkingRead(false);
    }
  };

  // Determine role label: Candidate / Recruiter / Admin
  const getRoleLabel = () => {
    if (isAdmin) return "Admin";
    if (isEmployer) return "Recruiter";
    return "Candidate";
  };

  const roleLabel = getRoleLabel();
  const unreadCount = notifications.filter((n) => !n.readAt).length;

  return (
    <>
      <header className="sticky top-0 z-40 w-full h-16 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="flex h-16 w-full items-center justify-between px-3 sm:px-6 gap-2 sm:gap-4">
          {/* 1. LEFT SECTION: TalentBridge Logo Icon & Mobile Toggle */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Mobile hamburger menu toggle */}
            {onToggleSidebar && (
              <button
                type="button"
                onClick={onToggleSidebar}
                className="p-2 -ml-1 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 md:hidden transition-colors"
                aria-label="Toggle Navigation Sidebar"
              >
                {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            )}

            {/* TalentBridge Logo Icon Only */}
            <Link href="/" aria-label="TalentBridge" className="flex items-center group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-all duration-200 shrink-0">
                {/* Elegant TalentBridge monogram icon: talent node connected over bridge */}
                <svg
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19h16" />
                  <path d="M4 15c4-6 12-6 16 0" />
                  <circle cx="12" cy="7" r="2.5" />
                </svg>
              </div>
            </Link>
          </div>

          {/* 2. CENTER SECTION: Search / Command Bar */}
          <div className="flex-1 max-w-lg mx-auto flex justify-center px-2 sm:px-4">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full max-w-md relative"
              role="search"
            >
              <div className="relative flex items-center w-full h-10 px-3.5 rounded-full border border-slate-200/90 bg-slate-50/70 hover:bg-slate-50 hover:border-slate-300 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100/80 shadow-2xs transition-all">
                <Search className="h-4 w-4 text-slate-400 shrink-0 mr-2.5" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for jobs, candidates... or press /"
                  className="w-full bg-transparent text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none"
                />
                <div className="hidden md:flex items-center gap-1 shrink-0 ml-2">
                  <kbd className="h-5 flex items-center justify-center rounded border border-slate-200 bg-white px-1.5 text-[10px] font-mono font-medium text-slate-400 shadow-2xs">
                    /
                  </kbd>
                </div>
              </div>
            </form>
          </div>

          {/* 3. RIGHT SECTION: Notification Bell → Integrate AI Tools Button → User Profile Picture → User Name → Current Role */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Element 1: Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => {
                  setNotificationDropdownOpen(!notificationDropdownOpen);
                  setProfileDropdownOpen(false);
                }}
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Notifications"
                title="Notifications"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {notificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-xl z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100 px-1">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-900">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-semibold bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {notifications.length > 0 && (
                      <button
                        type="button"
                        onClick={handleMarkAllRead}
                        disabled={isMarkingRead}
                        className="text-[11px] font-medium text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                      >
                        {isMarkingRead ? "Updating..." : "Mark all as read"}
                      </button>
                    )}
                  </div>

                  {notifications.length === 0 ? (
                    <div className="py-8 text-center px-4 space-y-2">
                      <div className="h-10 w-10 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                        <Bell className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800">No new notifications</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        You are all caught up with your candidate and job alerts.
                      </p>
                    </div>
                  ) : (
                    <div className="max-h-72 overflow-y-auto space-y-1.5 divide-y divide-slate-50">
                      {notifications.map((item) => (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-xl transition-colors text-left ${
                            item.readAt ? "bg-white" : "bg-blue-50/50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-slate-900">{item.title}</p>
                            {item.createdAt && (
                              <span className="text-[10px] text-slate-400 shrink-0">
                                {formatRelativeTime(item.createdAt)}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-0.5">{item.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Element 2: Integrate AI Tools Button */}
            <button
              type="button"
              onClick={() => setAiModalOpen(true)}
              className="flex items-center gap-1.5 h-9 px-3 sm:px-3.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-semibold text-xs shadow-xs hover:shadow-sm transition-all duration-150 cursor-pointer shrink-0"
              aria-label="Integrate AI Tools"
              title="Integrate AI Tools"
            >
              <Sparkles className="h-3.5 w-3.5 fill-white/20 text-white" />
              <span className="hidden sm:inline">Integrate AI Tools</span>
              <span className="sm:hidden">AI Tools</span>
            </button>

            {/* User Profile Picture → User Name → Current Role */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    setProfileDropdownOpen(!profileDropdownOpen);
                    setNotificationDropdownOpen(false);
                  }}
                  className="flex items-center gap-2.5 p-1 rounded-full sm:rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                  aria-expanded={profileDropdownOpen}
                  aria-haspopup="true"
                >
                  {/* User Avatar */}
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-200/80 group-hover:ring-blue-400 transition-all shrink-0"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white text-xs font-bold ring-2 ring-slate-200/80 shrink-0">
                      {user.name.charAt(0)}
                    </div>
                  )}

                  {/* User Name & Role Pill */}
                  <div className="hidden sm:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-900 leading-tight truncate max-w-[120px]">
                      {user.name}
                    </span>
                    <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full inline-block self-start mt-0.5 border border-blue-200/60 leading-tight">
                      {roleLabel}
                    </span>
                  </div>

                  <ChevronDown className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-transform duration-150" />
                </button>

                {/* Profile & Role Persona Switcher Dropdown */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-xl z-50 animate-in fade-in zoom-in-95">
                    {/* Current Active Persona Header */}
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                          Active Role: {roleLabel}
                        </span>
                      </div>
                    </div>

                    {/* Switch Persona Demo Section */}
                    <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Switch Role Persona
                    </div>

                    <div className="space-y-1">
                      <button
                        type="button"
                        onClick={() => {
                          switchRole("candidate");
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                          isCandidate && !isAdmin
                            ? "bg-blue-50 text-blue-700 font-bold"
                            : "text-slate-700 hover:bg-slate-50 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Candidate</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Alex R.</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          switchRole("employer");
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                          isEmployer && !isAdmin
                            ? "bg-purple-50 text-purple-700 font-bold"
                            : "text-slate-700 hover:bg-slate-50 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          <span>Recruiter</span>
                        </div>
                        <span className="text-[10px] text-slate-400">Sarah J.</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          switchRole("admin");
                          setProfileDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl transition-colors cursor-pointer ${
                          isAdmin
                            ? "bg-indigo-50 text-indigo-700 font-bold"
                            : "text-slate-700 hover:bg-slate-50 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="h-4 w-4" />
                          <span>Admin</span>
                        </div>
                        <span className="text-[10px] text-slate-400">NexusAI SA</span>
                      </button>
                    </div>

                    <div className="my-1.5 border-t border-slate-100" />

                    {/* Navigation Links */}
                    <Link
                      href={isEmployer ? "/app/settings" : "/me/profile"}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      href={isEmployer ? "/app/settings" : "/me/settings"}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      <span>Settings</span>
                    </Link>

                    <div className="my-1.5 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                        router.push("/login");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register/candidate">
                  <Button size="sm" className="text-xs font-semibold">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Integrate AI Tools Modal Dialog */}
      <Dialog open={aiModalOpen} onOpenChange={setAiModalOpen}>
        <DialogContent className="max-w-xl p-6">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-1">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-sm shrink-0">
                <Sparkles className="h-5 w-5 text-white fill-white/20" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900">
                  TalentBridge AI Suite & Integrations
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500">
                  Native intelligent automation, matching algorithms, and recruitment accelerators.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-3 my-2">
            {/* Tool 1 */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    AI Job Description Generator
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Generate comprehensive, benchmarked job specs tailored to department, seniority, and tech stack in seconds.
                </p>
              </div>
              <Link
                href="/app/jobs/new"
                onClick={() => setAiModalOpen(false)}
                className="shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-white border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-lg shadow-2xs transition-all"
              >
                Open Generator
              </Link>
            </div>

            {/* Tool 2 */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Candidate Fit & Explainable Matching
                  </span>
                  <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200/60">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Calculates 100-point compatibility scores based on candidate skills, years of experience, and requirements fit.
                </p>
              </div>
              <Link
                href="/app/jobs/job-1"
                onClick={() => setAiModalOpen(false)}
                className="shrink-0 text-xs font-semibold text-purple-600 hover:text-purple-800 bg-white border border-slate-200 hover:border-purple-300 px-3 py-1.5 rounded-lg shadow-2xs transition-all"
              >
                View Pipeline
              </Link>
            </div>

            {/* Tool 3 */}
            <div className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">
                    Resume Parsing & Skills Extractor
                  </span>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200/60">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Extracts structured proficiencies, seniority levels, and certifications directly from PDF/DOCX resumes.
                </p>
              </div>
              <Link
                href="/me/resume"
                onClick={() => setAiModalOpen(false)}
                className="shrink-0 text-xs font-semibold text-blue-600 hover:text-blue-800 bg-white border border-slate-200 hover:border-blue-300 px-3 py-1.5 rounded-lg shadow-2xs transition-all"
              >
                Manage Resumes
              </Link>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-[11px]">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              NexusAI Engine v4.2 Connected
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAiModalOpen(false)}
              className="text-xs"
            >
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
