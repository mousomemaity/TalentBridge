"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserCheck, Building2, ShieldCheck, ArrowRight } from "lucide-react";
import CandidateLoginPage from "./candidate/page";
import EmployerLoginPage from "./employer/page";
import AdminLoginPage from "./admin/page";

function LoginContent() {
  const searchParams = useSearchParams();
  const portalParam = searchParams.get("portal")?.toLowerCase();

  if (portalParam === "admin") {
    return <AdminLoginPage />;
  }

  if (portalParam === "employer" || portalParam === "recruiter") {
    return <EmployerLoginPage />;
  }

  if (portalParam === "candidate") {
    return <CandidateLoginPage />;
  }

  // Gateway view: Allows immediate selection of the three role-specific portals
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl text-center">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Select Your Portal
        </h2>
        <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
          JobPilot provides dedicated role-specific authentication portals for candidates, employer hiring teams, and administrators.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 1. Candidate Portal Card */}
          <Card className="border-slate-200/90 shadow-lg hover:shadow-xl transition-all duration-200 p-6 flex flex-col justify-between bg-white group hover:border-blue-300">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-blue-50 border border-blue-200/80 flex items-center justify-center text-blue-600 shadow-xs mb-4 group-hover:scale-105 transition-transform">
                <UserCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Candidate Portal</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Explore tech jobs, submit applications, manage resumes, and track AI match scores.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <Link href="/login/candidate" className="block">
                <Button className="w-full font-bold bg-blue-600 hover:bg-blue-700 text-white gap-1 text-xs">
                  Candidate Sign In <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link
                href="/register/candidate"
                className="block text-center text-[11px] font-semibold text-blue-600 hover:underline pt-1"
              >
                New candidate? Register
              </Link>
            </div>
          </Card>

          {/* 2. Recruiter / Employer Portal Card */}
          <Card className="border-slate-200/90 shadow-lg hover:shadow-xl transition-all duration-200 p-6 flex flex-col justify-between bg-white group hover:border-purple-300">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-purple-50 border border-purple-200/80 flex items-center justify-center text-purple-600 shadow-xs mb-4 group-hover:scale-105 transition-transform">
                <Building2 className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Employer & ATS</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Post job openings, manage candidate hiring pipelines, evaluate resumes, and coordinate interviews.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <Link href="/login/employer" className="block">
                <Button variant="purple" className="w-full font-bold bg-purple-600 hover:bg-purple-700 text-white gap-1 text-xs">
                  Recruiter Sign In <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link
                href="/register/employer"
                className="block text-center text-[11px] font-semibold text-purple-600 hover:underline pt-1"
              >
                New organization? Free trial
              </Link>
            </div>
          </Card>

          {/* 3. Super Admin Console Card */}
          <Card className="border-slate-200/90 shadow-lg hover:shadow-xl transition-all duration-200 p-6 flex flex-col justify-between bg-white group hover:border-slate-700">
            <div>
              <div className="h-12 w-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shadow-xs mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">Admin Console</h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                Restricted platform administration, tenant isolation management, and security compliance.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 space-y-2">
              <Link href="/login/admin" className="block">
                <Button className="w-full font-bold bg-slate-900 hover:bg-slate-800 text-white gap-1 text-xs">
                  Super Admin Sign In <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <p className="text-center text-[11px] text-slate-400 pt-1">
                Restricted • Root Clearance
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
