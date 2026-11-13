"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Lock, Eye, EyeOff, Building2, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";

const EMPLOYER_ROLES = ["REC", "HM", "INT", "CA"] as const;

export default function EmployerLoginPage() {
  const router = useRouter();
  const { login, user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect already authenticated employer users to their dashboard
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      if (EMPLOYER_ROLES.includes(user.role as any)) {
        router.replace("/app/dashboard");
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Role verification: strictly accept only RECRUITER, HIRING_MANAGER, INTERVIEWER, COMPANY_ADMIN
      const loggedInUser = await login(email, password, [...EMPLOYER_ROLES]);
      if (EMPLOYER_ROLES.includes(loggedInUser.role as any)) {
        router.push("/app/dashboard");
      }
    } catch (err: any) {
      setError(err?.message || "Invalid credentials or unauthorized organization access.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Role Icon Header */}
        <div className="mx-auto h-12 w-12 rounded-2xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-600 shadow-xs mb-3">
          <Building2 className="h-6 w-6" />
        </div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Employer & Recruiter Portal
        </h2>
        <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto">
          Sign in to manage job requisitions, evaluate candidate pipelines, and collaborate with your hiring team.
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
                Work Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
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
                  className="text-xs font-semibold text-purple-600 hover:underline"
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
              variant="purple"
              className="w-full font-bold py-2.5 mt-2 bg-purple-600 hover:bg-purple-700 text-white shadow-xs"
            >
              {isLoading ? "Signing in..." : "Sign in to ATS Platform"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Need an employer ATS account for your organization?{" "}
            <Link
              href="/register/employer"
              className="font-bold text-purple-600 hover:underline inline-flex items-center gap-0.5"
            >
              Start free trial <ArrowRight className="h-3 w-3 inline" />
            </Link>
          </div>

          {/* Quick links to alternate portals */}
          <div className="mt-4 pt-4 border-t border-slate-100/80 flex items-center justify-between text-[11px] text-slate-500">
            <Link
              href="/login/candidate"
              className="text-slate-600 hover:text-blue-600 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <UserCheck className="h-3 w-3 text-blue-500" /> Candidate Portal
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

