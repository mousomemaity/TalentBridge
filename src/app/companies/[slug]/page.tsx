"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_COMPANIES, MOCK_JOBS } from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import {
  Building2,
  MapPin,
  Globe,
  Users,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Briefcase,
  ChevronRight,
} from "lucide-react";

export default function CompanyDetailPage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Company...</div>}>
      <CompanyDetailContent />
    </React.Suspense>
  );
}

function CompanyDetailContent() {
  const params = useParams();
  const slug = params?.slug as string;

  const company =
    MOCK_COMPANIES.find((c) => c.slug === slug || c.id === slug) || MOCK_COMPANIES[0];
  const companyJobs = MOCK_JOBS.filter((j) => j.companyName === company.name);

  const [activeTab, setActiveTab] = useState<"overview" | "jobs" | "culture">("overview");
  const [isFollowing, setIsFollowing] = useState(false);

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          href="/companies"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Companies
        </Link>

        {/* Company Header Card */}
        <Card className="border-slate-200/90 shadow-sm p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-start gap-5">
              <img
                src={company.logo}
                alt={company.name}
                className="h-20 w-20 rounded-2xl object-cover border border-slate-200 shadow-md"
              />
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {company.name}
                </h1>
                <p className="text-sm font-semibold text-slate-600 mt-1">{company.industry}</p>
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {company.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {company.size}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    {company.rating} Rating
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a href={company.website} target="_blank" rel="noreferrer">
                <Button variant="outline" size="sm" className="gap-1.5 font-semibold text-xs">
                  <Globe className="h-3.5 w-3.5" />
                  Website
                </Button>
              </a>
              <Button
                size="sm"
                variant={isFollowing ? "outline" : "default"}
                onClick={() => setIsFollowing(!isFollowing)}
                className="font-semibold text-xs"
              >
                {isFollowing ? "Following ✓" : "Follow Company"}
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mt-8 flex gap-2 border-b border-slate-100">
            {(["overview", "jobs", "culture"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-3 px-4 text-sm font-bold border-b-2 capitalize transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                {tab === "jobs" ? `Open Roles (${companyJobs.length})` : tab}
              </button>
            ))}
          </div>
        </Card>

        {/* Tab Contents */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">About {company.name}</h3>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {company.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Work Culture & Core Values</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {company.culture.map((val, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-2.5"
                    >
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="border-slate-200/90 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Perks & Benefits</h3>
              <ul className="space-y-2.5">
                {company.benefits.map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                    <Sparkles className="h-3.5 w-3.5 text-purple-600 shrink-0" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        )}

        {activeTab === "jobs" && (
          <div className="space-y-4">
            {companyJobs.length === 0 ? (
              <Card className="p-8 text-center text-slate-500">
                No active openings currently published for this company.
              </Card>
            ) : (
              companyJobs.map((job) => (
                <Card key={job.id} className="card-hover border-slate-200 p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <Link
                        href={`/jobs/${job.slug}`}
                        className="text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
                      >
                        {job.title}
                      </Link>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span>{job.location}</span>
                        <span>•</span>
                        <span className="capitalize">{job.workplaceType}</span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-700">
                          {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                        </span>
                      </div>
                    </div>

                    <Link href={`/jobs/${job.slug}`}>
                      <Button size="sm" className="font-semibold text-xs gap-1">
                        View Role <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "culture" && (
          <Card className="border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900">Our Mission & Life at {company.name}</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              We empower our team to solve complex distributed systems challenges with autonomy,
              continuous mentorship, and deep empathy for end users.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
              {company.culture.map((c, i) => (
                <div key={i} className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100 text-center">
                  <Sparkles className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-bold text-sm text-slate-900">{c}</h4>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
