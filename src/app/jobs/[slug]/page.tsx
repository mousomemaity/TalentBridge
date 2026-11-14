"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MOCK_JOBS, MOCK_COMPANIES, MOCK_RESUMES } from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { useAuth } from "@/context/auth-context";
import {
  MapPin,
  Building2,
  DollarSign,
  Clock,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Share2,
  ArrowLeft,
  Briefcase,
  AlertCircle,
  FileText,
  Upload,
} from "lucide-react";

export default function JobDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Job Details...</div>}>
      <JobDetailContent />
    </React.Suspense>
  );
}

function JobDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { user, isCandidate } = useAuth();
  const slug = params?.slug as string;

  const job = MOCK_JOBS.find((j) => j.slug === slug || j.id === slug) || MOCK_JOBS[0];
  const company = MOCK_COMPANIES.find((c) => c.name === job.companyName) || MOCK_COMPANIES[0];

  const [isSaved, setIsSaved] = useState(job.isSaved || false);
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedResumeId, setSelectedResumeId] = useState(MOCK_RESUMES[0]?.id || "");
  const [coverNote, setCoverNote] = useState("");
  const [hasApplied, setHasApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setHasApplied(true);
      setApplyModalOpen(false);
    }, 600);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Job Search
          </Link>
        </div>

        {/* Main Grid: Job info + Match rail */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Header Card */}
            <Card className="border-slate-200/90 shadow-sm p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
                <div className="flex items-start gap-5">
                  <img
                    src={job.companyLogo}
                    alt={job.companyName}
                    className="h-16 w-16 rounded-2xl object-cover border border-slate-200 shrink-0 shadow-sm"
                  />
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                      {job.title}
                    </h1>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <Link
                        href={`/companies/${company.slug}`}
                        className="font-bold text-slate-900 hover:text-blue-600 hover:underline"
                      >
                        {job.companyName}
                      </Link>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-500">
                        <MapPin className="h-3.5 w-3.5" />
                        {job.location}
                      </span>
                      <span>•</span>
                      <span className="capitalize text-slate-500">{job.workplaceType}</span>
                    </div>
                  </div>
                </div>

                {/* Primary CTA Buttons */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => setIsSaved(!isSaved)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                      isSaved
                        ? "bg-blue-50 border-blue-200 text-blue-600"
                        : "bg-white border-slate-200 text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {isSaved ? (
                      <BookmarkCheck className="h-5 w-5 fill-blue-600" />
                    ) : (
                      <Bookmark className="h-5 w-5" />
                    )}
                  </button>

                  <Button
                    onClick={() => setApplyModalOpen(true)}
                    disabled={hasApplied}
                    size="lg"
                    className="font-bold px-6 shadow-md"
                  >
                    {hasApplied ? "Applied ✓" : "Apply for Role"}
                  </Button>
                </div>
              </div>

              {/* Snapshot Metrics Bar */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Compensation</span>
                  <p className="text-sm font-bold text-emerald-700 mt-0.5">
                    {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Job Type</span>
                  <p className="text-sm font-bold text-slate-800 capitalize mt-0.5">
                    {job.jobType}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Experience</span>
                  <p className="text-sm font-bold text-slate-800 capitalize mt-0.5">
                    {job.experienceLevel} Level
                  </p>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-medium">Posted</span>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">
                    {formatRelativeTime(job.postedAt)}
                  </p>
                </div>
              </div>
            </Card>

            {/* Description & Responsibilities */}
            <Card className="border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-8">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-3">About the Position</h2>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {job.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Key Responsibilities</h3>
                <ul className="space-y-2.5">
                  {job.responsibilities.map((resp, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-normal">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Requirements & Qualifications</h3>
                <ul className="space-y-2.5">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-normal">
                      <CheckCircle2 className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Required Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Benefits & Perks</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {job.benefits.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700"
                    >
                      <Sparkles className="h-4 w-4 text-purple-600 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Right Rail: AI Match Breakdown & Company Preview */}
          <div className="space-y-6">
            {/* Match Analysis Card */}
            <Card className="border-purple-200/90 bg-gradient-to-br from-white to-purple-50/40 shadow-sm p-6">
              <div className="flex items-center justify-between pb-4 border-b border-purple-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">AI Match Analysis</h3>
                    <p className="text-xs text-slate-500">Based on your candidate profile</p>
                  </div>
                </div>
                <span className="text-2xl font-black text-purple-700">{job.matchScore}%</span>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    Skills You Match
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["React", "TypeScript", "Next.js", "Tailwind CSS"].map((s) => (
                      <Badge key={s} variant="success" className="text-[11px] font-semibold">
                        ✓ {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Missing Skills
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {["REST / GraphQL"].map((s) => (
                      <Badge key={s} variant="outline" className="text-[11px] font-medium text-slate-600">
                        • {s}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-100/80">
                  <p className="text-xs text-purple-900 leading-relaxed font-medium">
                    Strong match! Your 6 years of React & Next.js production experience fits the
                    senior profile requirements closely.
                  </p>
                </div>
              </div>
            </Card>

            {/* Company Card */}
            <Card className="border-slate-200/90 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 text-base mb-4">About the Company</h3>
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{company.name}</h4>
                  <p className="text-xs text-slate-500">{company.industry}</p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {company.description}
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{company.size}</span>
                <Link
                  href={`/companies/${company.slug}`}
                  className="font-bold text-blue-600 hover:underline"
                >
                  View Profile →
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Dialog open={applyModalOpen} onOpenChange={setApplyModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Apply to {job.companyName}</DialogTitle>
            <DialogDescription>
              Submit your candidate application for <span className="font-semibold text-slate-800">{job.title}</span>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleApply} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Select Resume
              </label>
              <div className="space-y-2">
                {MOCK_RESUMES.map((res) => (
                  <label
                    key={res.id}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                      selectedResumeId === res.id
                        ? "border-blue-600 bg-blue-50/60 font-semibold text-blue-900"
                        : "border-slate-200 bg-white hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{res.fileName}</span>
                    </div>
                    <input
                      type="radio"
                      name="resume"
                      value={res.id}
                      checked={selectedResumeId === res.id}
                      onChange={() => setSelectedResumeId(res.id)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Note to Recruiter (Optional)
              </label>
              <textarea
                value={coverNote}
                onChange={(e) => setCoverNote(e.target.value)}
                placeholder="Briefly highlight why you're interested in this role..."
                rows={3}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setApplyModalOpen(false)}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="font-bold">
                {isSubmitting ? "Submitting Application..." : "Submit Application"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
