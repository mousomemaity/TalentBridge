"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import {
  Users,
  Building2,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
  Server,
  Database,
  Lock,
  Activity,
  Layers,
  ArrowUpRight,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "tenants" | "security">("overview");

  const tenants = [
    {
      id: "tenant-nexusai",
      name: "NexusAI Technologies",
      domain: "careers.nexusai.com",
      adminEmail: "sarah.jenkins@nexusai.com",
      plan: "Enterprise ATS",
      status: "ACTIVE",
      openJobs: 12,
    },
    {
      id: "tenant-cloudscale",
      name: "CloudScale Systems",
      domain: "jobs.cloudscale.io",
      adminEmail: "admin@cloudscale.io",
      plan: "Enterprise ATS",
      status: "ACTIVE",
      openJobs: 8,
    },
    {
      id: "tenant-finpulse",
      name: "FinPulse Labs",
      domain: "hiring.finpulse.tech",
      adminEmail: "talent@finpulse.tech",
      plan: "Growth ATS",
      status: "ACTIVE",
      openJobs: 5,
    },
    {
      id: "tenant-biovanguard",
      name: "BioVanguard Therapeutics",
      domain: "careers.biovanguard.com",
      adminEmail: "hr@biovanguard.com",
      plan: "Enterprise ATS",
      status: "ACTIVE",
      openJobs: 14,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            Super Admin Dashboard
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              Live Production
            </Badge>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global telemetry, multi-tenant isolation, user directory, and platform infrastructure control.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-xs bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800 gap-1.5"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-3 w-3" /> Refresh Telemetry
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-800 bg-slate-900/90 p-5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Candidates
            </span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">14,820</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> All candidate profiles verified
          </p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/90 p-5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Verified Tenants
            </span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Building2 className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">850</p>
          <p className="text-[11px] text-purple-400 mt-1 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Strict tenant schema isolation
          </p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/90 p-5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Job Postings
            </span>
            <div className="h-8 w-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">4,230</p>
          <p className="text-[11px] text-indigo-400 mt-1 flex items-center gap-1">
            <span>• Published across public board</span>
          </p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/90 p-5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Atlas & Cluster
            </span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Database className="h-4 w-4" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-white mt-3">99.98%</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> MongoDB Atlas ReplicaSet
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab("overview")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === "overview"
              ? "bg-amber-400/10 text-amber-300 border border-amber-400/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Tenants & Organizations
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeTab === "security"
              ? "bg-amber-400/10 text-amber-300 border border-amber-400/30"
              : "text-slate-400 hover:text-white"
          }`}
        >
          Security & RBAC Compliance
        </button>
      </div>

      {activeTab === "overview" ? (
        <Card className="border-slate-800 bg-slate-900 text-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-base text-white">Registered Employer Tenants</h3>
              <p className="text-xs text-slate-400">
                Organizations operating dedicated ATS workflows with tenant-level RBAC.
              </p>
            </div>
            <Badge className="bg-slate-800 text-slate-300 border-slate-700 text-xs">
              {tenants.length} Active Displayed
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2">Organization</th>
                  <th className="py-3 px-2">Tenant Domain</th>
                  <th className="py-3 px-2">Admin Account</th>
                  <th className="py-3 px-2">Plan</th>
                  <th className="py-3 px-2">Open Requisitions</th>
                  <th className="py-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-2 font-bold text-slate-200">{t.name}</td>
                    <td className="py-3 px-2 font-mono text-[11px] text-slate-400">{t.domain}</td>
                    <td className="py-3 px-2 text-slate-300">{t.adminEmail}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-semibold text-[10px]">
                        {t.plan}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-slate-300">{t.openJobs} active jobs</td>
                    <td className="py-3 px-2 text-right">
                      <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px]">
                        {t.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <Card className="border-slate-800 bg-slate-900 text-white p-6 shadow-sm space-y-4">
          <div>
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-amber-400" />
              Role-Based Access Control (RBAC) Specification
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              JobPilot enforces strict role verification across all authentication portals and REST endpoints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <span className="font-bold text-xs text-amber-400 uppercase tracking-wider block">
                Super Admin (SA)
              </span>
              <p className="text-xs text-slate-300">
                Full platform clearance. Root management of tenants, platform seed scripts, and cluster telemetry.
              </p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-700">
                Portal: /admin/dashboard
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <span className="font-bold text-xs text-purple-400 uppercase tracking-wider block">
                Employer & ATS (REC, HM, CA)
              </span>
              <p className="text-xs text-slate-300">
                Organization-scoped ATS pipelines, job creation, interview stages, and candidate reviews.
              </p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-700">
                Portal: /app/dashboard
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 space-y-2">
              <span className="font-bold text-xs text-blue-400 uppercase tracking-wider block">
                Candidate (CAN)
              </span>
              <p className="text-xs text-slate-300">
                Public job search, applications tracking, AI match scores, and resume management.
              </p>
              <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-700">
                Portal: /me/dashboard
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

