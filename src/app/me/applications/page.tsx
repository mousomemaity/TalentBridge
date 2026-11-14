"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_APPLICATIONS } from "@/lib/mock-data";
import { Application, KanbanStage } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import {
  Briefcase,
  Building2,
  Clock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>(
    MOCK_APPLICATIONS.filter((a) => a.candidateId === "cand-1")
  );
  const [activeTab, setActiveTab] = useState<"all" | "active" | "archived">("active");

  const withdrawApplication = (id: string) => {
    if (confirm("Are you sure you want to withdraw this application?")) {
      setApplications((prev) => prev.filter((a) => a.id !== id));
    }
  };

  const getStageBadge = (stage: KanbanStage) => {
    switch (stage) {
      case "applied":
        return <Badge variant="secondary">Applied</Badge>;
      case "screening":
        return <Badge variant="default">In Review</Badge>;
      case "interview":
        return <Badge variant="purple">Interview Scheduled</Badge>;
      case "assessment":
        return <Badge variant="warning">Take-Home Test</Badge>;
      case "offer":
        return <Badge variant="success">Offer Extended 🎉</Badge>;
      case "hired":
        return <Badge variant="success">Hired ✓</Badge>;
      case "rejected":
        return <Badge variant="destructive">Not Selected</Badge>;
      default:
        return <Badge variant="secondary">{stage}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Applications</h1>
          <p className="text-xs text-slate-500">
            Track status updates, timeline milestones, and interview schedules for your submitted roles.
          </p>
        </div>

        <Link href="/jobs">
          <Button size="sm" className="font-semibold text-xs shadow-sm">
            Find More Jobs
          </Button>
        </Link>
      </div>

      {/* Applications list */}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 space-y-3">
            <Briefcase className="h-10 w-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800">No applications yet</h4>
            <p className="text-xs text-slate-400">Browse the job board and submit your first application.</p>
          </Card>
        ) : (
          applications.map((app) => (
            <Card key={app.id} className="border-slate-200/90 shadow-sm p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={app.companyLogo}
                    alt={app.companyName}
                    className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{app.jobTitle}</h3>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {app.companyName} • Applied {formatRelativeTime(app.appliedAt)}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      {getStageBadge(app.stage)}
                      {app.matchScore && (
                        <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200 flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> {app.matchScore}% AI Fit
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => withdrawApplication(app.id)}
                    className="text-xs text-slate-600 hover:text-red-600 hover:bg-red-50"
                  >
                    Withdraw
                  </Button>
                  <Link href={`/jobs/senior-frontend-engineer-react-nextjs`}>
                    <Button size="sm" variant="secondary" className="text-xs font-semibold">
                      View Job Post
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Recruiter notes timeline preview */}
              {app.recruiterNotes && app.recruiterNotes.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50/70 p-3 rounded-xl text-xs space-y-1">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" /> Latest Activity
                  </span>
                  <p className="text-slate-600">{app.recruiterNotes[0].content}</p>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
