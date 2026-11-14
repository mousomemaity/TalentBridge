"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, UserCheck, ArrowRight, ShieldCheck, Building2 } from "lucide-react";

export default function CandidateLoginPage() {
  const router = useRouter();
  const { login, user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect already authenticated candidate users to their dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (user.role === "CAN") {
        router.replace("/me/dashboard");
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Role verification: strictly accept only CANDIDATE ("CAN") accounts
      const loggedInUser = await login(email, password, ["CAN"]);
      if (loggedInUser.role === "CAN") {
        router.push("/me/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid credentials or authorization failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Role Icon Header */}
        <div className="mx-auto h-12 w-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-xs mb-3">
          <UserCheck className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Candidate Portal
        </h2>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Sign in to access your jobs, track application milestones, and manage your AI-enhanced profile.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="border-slate-200/90 shadow-xl p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-medium text-red-700 leading-relaxed animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Candidate Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="candidate@example.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full font-bold py-2.5 mt-2 bg-blue-600 hover:bg-blue-700 text-white shadow-xs"
            >
              {isLoading ? "Signing in..." : "Sign in as Candidate"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Don&apos;t have a candidate account yet?{" "}
            <Link
              href="/register/candidate"
              className="font-bold text-blue-600 hover:underline inline-flex items-center gap-0.5"
            >
              Register here <ArrowRight className="h-3 w-3 inline" />
            </Link>
          </div>

          {/* Quick links to alternate portals */}
          <div className="mt-4 pt-4 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
            <Link
              href="/login/employer"
              className="text-slate-600 hover:text-purple-600 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <Building2 className="h-3 w-3 text-purple-500" /> Recruiter Portal
            </Link>
            <Link
              href="/login/admin"
              className="text-slate-600 hover:text-slate-900 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <ShieldCheck className="h-3 w-3 text-slate-700" /> Admin Portal
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

