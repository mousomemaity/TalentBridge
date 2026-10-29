"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_JOBS, MOCK_COMPANIES } from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import {
  Search,
  MapPin,
  Briefcase,
  Sparkles,
  ArrowRight,
  Building2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Star,
  Users,
  Layers,
} from "lucide-react";

const CATEGORIES = [
  { name: "Frontend & UI", count: "320+ jobs", icon: Layers, color: "text-blue-600 bg-blue-50" },
  { name: "Backend & Systems", count: "410+ jobs", icon: Briefcase, color: "text-indigo-600 bg-indigo-50" },
  { name: "AI & Machine Learning", count: "190+ jobs", icon: Sparkles, color: "text-purple-600 bg-purple-50" },
  { name: "Product & Design", count: "145+ jobs", icon: Zap, color: "text-amber-600 bg-amber-50" },
  { name: "Cloud & DevOps", count: "215+ jobs", icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
  { name: "Data & Analytics", count: "180+ jobs", icon: Building2, color: "text-rose-600 bg-rose-50" },
];

export default function HomePage() {
  const router = useRouter();
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword) params.set("query", keyword);
    if (location) params.set("location", location);
    router.push(`/jobs?${params.toString()}`);
  };

  const featuredJobs = MOCK_JOBS.slice(0, 4);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-slate-100/70 border-b border-slate-200/80 pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.15]"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-semibold text-blue-700 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
            <Sparkles className="h-3.5 w-3.5 text-blue-600" />
            <span>AI-Powered Matching & Modern ATS Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15]">
            Bridging Ambitious Talent with{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              World-Class Teams
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover verified tech opportunities with transparent compensation, precision skills
            matching, and an end-to-end applicant tracking workflow.
          </p>

          {/* Search Box */}
          <div className="mt-10 max-w-3xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="glass-panel p-2.5 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-2.5 border border-slate-200"
            >
              <div className="relative flex-1 w-full flex items-center pl-3">
                <Search className="h-5 w-5 text-slate-400 shrink-0" />
                <Input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Job title, keywords, or skills..."
                  className="border-0 shadow-none focus-visible:ring-0 text-base py-3 pl-3 pr-2 placeholder:text-slate-400 bg-transparent"
                />
              </div>

              <div className="hidden md:block h-8 w-px bg-slate-200"></div>

              <div className="relative flex-1 w-full flex items-center pl-3">
                <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
                <Input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location or 'Remote'"
                  className="border-0 shadow-none focus-visible:ring-0 text-base py-3 pl-3 pr-2 placeholder:text-slate-400 bg-transparent"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full md:w-auto px-8 py-3 rounded-xl shadow-md text-base font-semibold"
              >
                Search Jobs
              </Button>
            </form>

            {/* Quick search tags */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Popular:</span>
              {["React", "Next.js", "TypeScript", "Go", "Python", "Remote"].map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => {
                    setKeyword(tag);
                    router.push(`/jobs?query=${tag}`);
                  }}
                  className="rounded-full bg-white px-3 py-1 font-medium text-slate-600 border border-slate-200 hover:border-blue-400 hover:text-blue-600 transition-all cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Social Proof Stats */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto pt-10 border-t border-slate-200/80">
            <div>
              <p className="text-3xl font-extrabold text-slate-900">4,200+</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Active Tech Jobs</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-blue-600">850+</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Verified Companies</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-purple-600">92%</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Precision Match Rate</p>
            </div>
            <div>
              <p className="text-3xl font-extrabold text-emerald-600">14 Days</p>
              <p className="text-xs font-medium text-slate-500 mt-1">Avg. Time to Offer</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Job Categories */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Browse Roles
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
                Explore by Job Category
              </h2>
            </div>
            <Link
              href="/jobs"
              className="mt-4 md:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
            >
              All Categories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  href={`/jobs?query=${encodeURIComponent(cat.name)}`}
                  className="card-hover group p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-blue-400/80 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3.5 rounded-xl ${cat.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs font-medium text-slate-500 mt-0.5">{cat.count}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Top Opportunities
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
                Featured Open Positions
              </h2>
            </div>
            <Link
              href="/jobs"
              className="mt-4 md:mt-0 text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1.5"
            >
              View all {MOCK_JOBS.length} positions <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {featuredJobs.map((job) => (
              <Card
                key={job.id}
                className="card-hover overflow-hidden border-slate-200 hover:border-blue-400/70"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <img
                        src={job.companyLogo}
                        alt={job.companyName}
                        className="h-12 w-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <Link
                          href={`/jobs/${job.slug}`}
                          className="font-bold text-lg text-slate-900 hover:text-blue-600 transition-colors line-clamp-1"
                        >
                          {job.title}
                        </Link>
                        <p className="text-sm font-medium text-slate-500">{job.companyName}</p>
                      </div>
                    </div>
                    {job.matchScore && (
                      <Badge variant="purple" className="shrink-0 gap-1 font-semibold">
                        <Sparkles className="h-3 w-3" />
                        {job.matchScore}% Match
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm text-slate-600 mt-4 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="text-xs px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-3 font-semibold text-slate-700">
                      <span>
                        {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                      </span>
                      <span>•</span>
                      <span className="capitalize">{job.workplaceType}</span>
                    </div>
                    <Link href={`/jobs/${job.slug}`}>
                      <Button size="sm" variant="outline" className="font-semibold text-xs">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Companies */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Verified Partners
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Top Companies Hiring on TalentBridge
            </h2>
            <p className="text-slate-500 text-sm mt-3">
              Direct access to engineering leaders and recruiters without third-party agency spam.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_COMPANIES.map((company) => (
              <Card key={company.id} className="card-hover text-center p-6 border-slate-200">
                <img
                  src={company.logo}
                  alt={company.name}
                  className="h-16 w-16 rounded-2xl mx-auto object-cover border border-slate-200 shadow-sm"
                />
                <h3 className="font-bold text-base text-slate-900 mt-4">{company.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">{company.industry}</p>
                <div className="mt-3 flex items-center justify-center gap-1 text-xs text-amber-500 font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  <span>{company.rating}</span>
                  <span className="text-slate-400 font-normal">({company.size})</span>
                </div>
                <Link href={`/companies/${company.slug}`} className="mt-5 block">
                  <Button variant="secondary" size="sm" className="w-full text-xs font-semibold">
                    {company.openJobsCount} Open Roles
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Employer Banner CTA */}
      <section className="py-16 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl text-center lg:text-left">
            <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 mb-3">
              For Recruiters & Hiring Teams
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Streamline Your Entire Hiring Pipeline with TalentBridge ATS
            </h2>
            <p className="text-slate-300 text-base mt-4 leading-relaxed">
              Post jobs, evaluate AI candidate match breakdowns, collaborate with your hiring team,
              and manage candidates across a dynamic 7-stage Kanban workflow.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 shrink-0">
            <Link href="/register/employer">
              <Button size="lg" className="w-full sm:w-auto font-bold bg-blue-600 hover:bg-blue-700">
                Start Free Employer Trial
              </Button>
            </Link>
            <Link href="/app/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto font-bold text-white border-slate-700 bg-slate-800/80 hover:bg-slate-700"
              >
                Explore ATS Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
