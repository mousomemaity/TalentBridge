"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Briefcase, Building2, Globe, Users, Lock, Mail, User, ShieldCheck } from "lucide-react";

export default function EmployerRegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [companyName, setCompanyName] = useState("");
  const [fullName, setFullName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [password, setPassword] = useState("");
  const [website, setWebsite] = useState("");
  const [teamSize, setTeamSize] = useState("50-200");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await login("employer");
    router.push("/app/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md">
            <Building2 className="h-5 w-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">TalentBridge ATS</span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Register Your Company & Hiring Team
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Activate your collaborative Applicant Tracking System and publish verified jobs
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <Card className="border-slate-200/90 shadow-xl p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="NexusAI Labs"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://nexusai.com"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Your Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Sarah Jenkins"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Company Size
                </label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="50-200">50-200 employees</option>
                  <option value="200-1000">200-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  required
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="sarah@nexusai.com"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-purple-600 shrink-0" />
              <span>Includes 14-day free access to unlimited ATS pipelines and AI candidate matching.</span>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              variant="purple"
              className="w-full font-bold py-2.5 mt-2"
            >
              {isLoading ? "Provisioning ATS..." : "Create Employer Organization"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Already have an employer account?{" "}
            <Link href="/login" className="font-bold text-purple-600 hover:underline">
              Sign in to ATS
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
