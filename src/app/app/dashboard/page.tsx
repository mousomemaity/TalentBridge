"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_DASHBOARD_METRICS, MOCK_JOBS, MOCK_APPLICATIONS } from "@/lib/mock-data";
import { formatRelativeTime } from "@/lib/utils";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  Briefcase,
  Users,
  Calendar,
  Gift,
  PlusCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";

export default function EmployerDashboardPage() {
  const metrics = MOCK_DASHBOARD_METRICS;
  const jobs = MOCK_JOBS.slice(0, 4);
  const recentApplications = MOCK_APPLICATIONS.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Employer ATS Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Pipeline velocity, candidate conversion funnel, and active recruitment metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/app/jobs/new">
            <Button size="sm" variant="purple" className="font-bold gap-1.5 shadow-sm text-xs">
              <PlusCircle className="h-4 w-4" /> Post New Job Opening
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Open Positions
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Briefcase className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{metrics.openJobs}</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            +3 published this month
          </span>
        </Card>

        <Card className="p-5 border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Applicants
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{metrics.totalApplicants}</p>
          <span className="text-[11px] text-purple-600 font-semibold mt-1 inline-block">
            78 in screening stage
          </span>
        </Card>

        <Card className="p-5 border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Interviews Today
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{metrics.interviewsToday}</p>
          <span className="text-[11px] text-slate-500 font-semibold mt-1 inline-block">
            Next at 5:00 PM UTC
          </span>
        </Card>

        <Card className="p-5 border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Avg. Time to Hire
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 mt-2">{metrics.timeToHireDays} Days</p>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 inline-block">
            4 days faster than industry avg
          </span>
        </Card>
      </div>

      {/* Hiring Funnel Chart (Recharts) */}
      <Card className="border-slate-200/90 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-600" /> Hiring Pipeline Conversion Funnel
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Candidate volume progression through active Kanban stages
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
            All Open Requisitions
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.funnelData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="stage" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  fontSize: "12px",
                  fontWeight: 600,
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {metrics.funnelData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Two Column Section: Active Pipelines vs Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Job Pipelines (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Active Job Requisitions</h3>
            <Link
              href="/app/jobs"
              className="text-xs font-semibold text-purple-600 hover:underline flex items-center gap-1"
            >
              All Pipelines <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {jobs.map((job) => (
              <Card key={job.id} className="border-slate-200/90 shadow-sm p-4 hover:border-purple-300 transition-colors">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Link
                      href={`/app/jobs/${job.id}`}
                      className="font-bold text-sm text-slate-900 hover:text-purple-600 transition-colors"
                    >
                      {job.title}
                    </Link>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {job.department} • {job.location} ({job.workplaceType})
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 block">
                        {job.applicantsCount} Applicants
                      </span>
                      <span className="text-[10px] text-emerald-600 font-semibold">Active</span>
                    </div>

                    <Link href={`/app/jobs/${job.id}`}>
                      <Button size="sm" variant="outline" className="text-xs font-semibold">
                        Kanban Pipeline →
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Candidate Activity */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-900">Recent Applications</h3>
          <Card className="border-slate-200/90 shadow-sm p-4 space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="flex items-center justify-between gap-3 text-xs border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <img
                    src={app.candidateAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"}
                    alt={app.candidateName}
                    className="h-8 w-8 rounded-full object-cover shrink-0"
                  />
                  <div className="overflow-hidden">
                    <p className="font-bold text-slate-900 truncate">{app.candidateName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{app.jobTitle}</p>
                  </div>
                </div>

                <Badge variant="purple" className="shrink-0 text-[10px]">
                  {app.matchScore}%
                </Badge>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
