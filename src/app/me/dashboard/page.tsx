"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  MOCK_CANDIDATE_PROFILE,
  MOCK_JOBS,
  MOCK_APPLICATIONS,
  MOCK_INTERVIEWS,
  MOCK_ASSESSMENTS,
} from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import {
  Sparkles,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Calendar,
  Clock,
  Video,
  Award,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

export default function CandidateDashboardPage() {
  const profile = MOCK_CANDIDATE_PROFILE;
  const applications = MOCK_APPLICATIONS.filter((a) => a.candidateId === "cand-1");
  const upcomingInterview = MOCK_INTERVIEWS[0];
  const pendingAssessment = MOCK_ASSESSMENTS.find((a) => a.status === "pending");
  const recommendedJobs = MOCK_JOBS.slice(0, 3);

  // Application stage counts
  const stageCounts = {
    applied: applications.filter((a) => a.stage === "applied").length,
    screening: applications.filter((a) => a.stage === "screening").length,
    interview: applications.filter((a) => a.stage === "interview").length,
    offer: applications.filter((a) => a.stage === "offer").length,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Profile Completeness */}
      <Card className="border-blue-100 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md overflow-hidden relative">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30 mb-2">
              Candidate Workspace
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {profile.fullName.split(" ")[0]}!
            </h1>
            <p className="text-blue-100 text-xs sm:text-sm mt-1 leading-relaxed">
              You have <span className="font-bold text-white">1 upcoming interview</span> and{" "}
              <span className="font-bold text-white">1 pending assessment</span> this week.
            </p>

            {/* Completeness bar */}
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-semibold mb-2 text-blue-200">
                <span>Profile Completeness</span>
                <span>{profile.completenessPercentage}% Complete</span>
              </div>
              <div className="w-full h-2.5 bg-blue-950/60 rounded-full overflow-hidden border border-blue-400/30">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${profile.completenessPercentage}%` }}
                ></div>
              </div>
              <p className="text-[11px] text-blue-300 mt-2">
                Tip: Add 1 more certification or project to achieve a 100% profile score and boost recruiter visibility!
              </p>
            </div>
          </div>

          <Link href="/me/profile" className="shrink-0">
            <Button size="sm" variant="purple" className="font-bold text-xs">
              Complete Profile →
            </Button>
          </Link>
        </div>
      </Card>

      {/* Application Status Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-200/90 shadow-sm text-center">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Applied
          </span>
          <p className="text-2xl font-black text-slate-900 mt-1">{stageCounts.applied}</p>
        </Card>
        <Card className="p-4 border-slate-200/90 shadow-sm text-center">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
            In Screening
          </span>
          <p className="text-2xl font-black text-blue-600 mt-1">{stageCounts.screening}</p>
        </Card>
        <Card className="p-4 border-slate-200/90 shadow-sm text-center">
          <span className="text-xs font-semibold text-purple-600 uppercase tracking-wider">
            Interviews
          </span>
          <p className="text-2xl font-black text-purple-600 mt-1">{stageCounts.interview}</p>
        </Card>
        <Card className="p-4 border-slate-200/90 shadow-sm text-center">
          <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
            Offers
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stageCounts.offer}</p>
        </Card>
      </div>

      {/* Two Column Grid: Upcoming Actions vs Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Recommended Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-purple-600" />
              Recommended for You
            </h2>
            <Link
              href="/jobs"
              className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
            >
              Browse all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recommendedJobs.map((job) => (
              <Card key={job.id} className="card-hover border-slate-200 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <img
                      src={job.companyLogo}
                      alt={job.companyName}
                      className="h-10 w-10 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <Link
                        href={`/jobs/${job.slug}`}
                        className="font-bold text-sm text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <p className="text-xs text-slate-500 font-medium">
                        {job.companyName} • {job.location} ({job.workplaceType})
                      </p>
                      <p className="text-xs font-semibold text-emerald-700 mt-1">
                        {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 shrink-0">
                    {job.matchScore && (
                      <Badge variant="purple" className="text-[11px] font-semibold gap-1">
                        <Sparkles className="h-3 w-3" />
                        {job.matchScore}% Match
                      </Badge>
                    )}
                    <Link href={`/jobs/${job.slug}`}>
                      <Button size="sm" variant="outline" className="text-xs font-semibold h-7">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Right Column: Upcoming Interview & Assessment Widgets */}
        <div className="space-y-4">
          {/* Interview Widget */}
          {upcomingInterview && (
            <Card className="border-purple-200 bg-purple-50/40 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-purple-700 flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5" /> Upcoming Round
                </span>
                <span className="text-xs font-semibold text-purple-900">
                  {upcomingInterview.interviewType}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {upcomingInterview.companyName}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  Interviewer: {upcomingInterview.interviewerName}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <Clock className="h-3.5 w-3.5 text-purple-600" />
                  <span>Oct 26 • 5:00 PM (60 min)</span>
                </div>
              </div>

              <div className="pt-2">
                <a href={upcomingInterview.meetingLink} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="purple" className="w-full font-bold text-xs">
                    Join Video Room
                  </Button>
                </a>
              </div>
            </Card>
          )}

          {/* Assessment Widget */}
          {pendingAssessment && (
            <Card className="border-blue-200 bg-blue-50/40 p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                  <Award className="h-3.5 w-3.5" /> Pending Challenge
                </span>
                <span className="text-xs font-semibold text-blue-900">Due in 3 days</span>
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {pendingAssessment.title}
                </h4>
                <p className="text-xs text-slate-500 font-medium">
                  {pendingAssessment.totalQuestions} questions • {pendingAssessment.durationMinutes} mins
                </p>
              </div>

              <div className="pt-2">
                <Link href="/me/assessments">
                  <Button size="sm" className="w-full font-bold text-xs">
                    Start Test Runner
                  </Button>
                </Link>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
