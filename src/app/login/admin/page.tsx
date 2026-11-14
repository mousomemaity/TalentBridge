"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/auth-context";
import { Building2, Eye, EyeOff, Lock, Mail, ShieldAlert, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect already authenticated super admin users directly to the Admin dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === "SA") {
        router.replace("/admin/dashboard");
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Role verification: strictly accept only SUPER_ADMIN ("SA") accounts
      const loggedInUser = await login(email, password, ["SA"]);
      if (loggedInUser.role === "SA") {
        router.push("/admin/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid credentials or unauthorized administrative access.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center relative z-10">
        {/* Role Icon Header */}
        <div className="mx-auto h-12 w-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 shadow-lg mb-3">
          <ShieldCheck className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Super Admin Console
        </h2>
        <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
          Restricted platform management portal for verified JobPilot system administrators.
        </p>
        <div className="mt-2.5">
          <Badge className="bg-amber-500/10 text-amber-300 border-amber-500/30 text-[10px] uppercase font-bold tracking-wider">
            Root Clearance Required
          </Badge>
        </div>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Card className="border-slate-800 bg-slate-850/95 backdrop-blur-md shadow-2xl p-6 sm:p-8 bg-slate-800/90 text-white">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800/80 text-xs font-medium text-red-300 leading-relaxed flex items-start gap-2 animate-in fade-in">
              <ShieldAlert className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@jobpilot.internal"
                  className="pl-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Admin Master Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 bg-slate-900 border-slate-700 text-white placeholder:text-slate-500 focus:border-amber-400 focus:ring-amber-400/20"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-700/60 text-[11px] text-slate-400 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
              <span>TLS Encrypted • Authentication sessions monitored</span>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full font-bold py-2.5 mt-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-md transition-all cursor-pointer"
            >
              {isLoading ? "Authenticating Clearance..." : "Authenticate as Super Admin"}
            </Button>
          </form>

          {/* Quick links to alternate portals */}
          <div className="mt-6 pt-4 border-t border-slate-700/80 flex items-center justify-between text-[11px] text-slate-400">
            <Link
              href="/login/candidate"
              className="hover:text-blue-400 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <UserCheck className="h-3 w-3 text-blue-400" /> Candidate Portal
            </Link>
            <Link
              href="/login/employer"
              className="hover:text-purple-400 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <Building2 className="h-3 w-3 text-purple-400" /> Recruiter Portal
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

