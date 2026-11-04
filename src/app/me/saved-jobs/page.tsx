"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_JOBS } from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { BookmarkCheck, Trash2, ArrowRight, Sparkles } from "lucide-react";

export default function CandidateSavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState(MOCK_JOBS.filter((j) => j.isSaved));

  const removeSaved = (id: string) => {
    setSavedJobs((prev) => prev.filter((j) => j.id !== id));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Jobs</h1>
        <p className="text-xs text-slate-500">
          Bookmarked positions you want to review or apply for later.
        </p>
      </div>

      <div className="space-y-3">
        {savedJobs.length === 0 ? (
          <Card className="p-12 text-center text-slate-500 space-y-3">
            <BookmarkCheck className="h-10 w-10 text-slate-300 mx-auto" />
            <h4 className="font-bold text-slate-800">No saved jobs</h4>
            <p className="text-xs text-slate-400">Bookmark interesting roles while searching to access them here.</p>
            <Link href="/jobs" className="inline-block pt-2">
              <Button size="sm">Search Jobs</Button>
            </Link>
          </Card>
        ) : (
          savedJobs.map((job) => (
            <Card key={job.id} className="card-hover border-slate-200 p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div>
                    <Link
                      href={`/jobs/${job.slug}`}
                      className="font-bold text-base text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      {job.title}
                    </Link>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">
                      {job.companyName} • {job.location} ({job.workplaceType})
                    </p>
                    <p className="text-xs font-semibold text-emerald-700 mt-1">
                      {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSaved(job.id)}
                    className="text-xs text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Link href={`/jobs/${job.slug}`}>
                    <Button size="sm" className="font-semibold text-xs">
                      Apply Now
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
