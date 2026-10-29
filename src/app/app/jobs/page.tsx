"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_JOBS } from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import {
  Briefcase,
  Search,
  PlusCircle,
  Users,
  Clock,
  MoreVertical,
  KanbanSquare,
  ArrowRight,
} from "lucide-react";

export default function EmployerJobsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "open" | "draft" | "closed">("open");
  const [search, setSearch] = useState("");

  const filteredJobs = MOCK_JOBS.filter((job) => {
    if (activeTab !== "all" && job.status !== activeTab) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.department.toLowerCase().includes(q) ||
        job.location.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Job Requisitions & ATS Pipelines
          </h1>
          <p className="text-xs text-slate-500">
            Manage your organization&apos;s open listings and candidate Kanban workflows.
          </p>
        </div>

        <Link href="/app/jobs/new">
          <Button size="sm" variant="purple" className="font-bold gap-1.5 shadow-sm text-xs">
            <PlusCircle className="h-4 w-4" /> Create New Job
          </Button>
        </Link>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm">
        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl">
          {(["open", "draft", "closed", "all"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-bold capitalize rounded-lg transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-white text-purple-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab} Roles
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roles or departments..."
            className="pl-9 h-9 text-xs"
          />
        </div>
      </div>

      {/* Requisitions List */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <Card className="p-12 text-center text-slate-500">
            No job requisitions found matching this status or search.
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="card-hover border-slate-200/90 shadow-sm p-5 hover:border-purple-300 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <Link
                      href={`/app/jobs/${job.id}`}
                      className="font-bold text-base text-slate-900 hover:text-purple-600 transition-colors"
                    >
                      {job.title}
                    </Link>
                    <Badge variant={job.status === "open" ? "success" : "secondary"} className="text-[10px]">
                      {job.status.toUpperCase()}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {job.department} • {job.location} ({job.workplaceType}) • Posted {formatRelativeTime(job.postedAt)}
                  </p>

                  <div className="mt-3 flex items-center gap-4 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1.5 text-purple-700">
                      <Users className="h-3.5 w-3.5" />
                      {job.applicantsCount} Total Applicants
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700">
                      {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                  <Link href={`/jobs/${job.slug}`} target="_blank">
                    <Button variant="ghost" size="sm" className="text-xs text-slate-500">
                      Public View
                    </Button>
                  </Link>
                  <Link href={`/app/jobs/${job.id}`}>
                    <Button size="sm" variant="purple" className="font-bold text-xs gap-1.5 shadow-sm">
                      <KanbanSquare className="h-4 w-4" /> Open Kanban Pipeline
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
