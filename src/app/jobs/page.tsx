"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_JOBS } from "@/lib/mock-data";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { WorkplaceType, JobType, ExperienceLevel, Job } from "@/types";
import {
  Search,
  MapPin,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck,
  Sparkles,
  ArrowUpDown,
  Building2,
  DollarSign,
  Briefcase,
  X,
  ChevronRight,
  Filter,
} from "lucide-react";

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading jobs...</div>}>
      <JobsSearchContent />
    </Suspense>
  );
}

function JobsSearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search filter states
  const initialQuery = searchParams.get("query") || "";
  const initialLocation = searchParams.get("location") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [locationQuery, setLocationQuery] = useState(initialLocation);

  const [workplaceTypes, setWorkplaceTypes] = useState<WorkplaceType[]>([]);
  const [jobTypes, setJobTypes] = useState<JobType[]>([]);
  const [experienceLevels, setExperienceLevels] = useState<ExperienceLevel[]>([]);
  const [minSalary, setMinSalary] = useState<number>(0);
  const [selectedSkill, setSelectedSkill] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("relevance");
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set(["job-1", "job-4"]));
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleSaveJob = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedJobIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleWorkplace = (type: WorkplaceType) => {
    setWorkplaceTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleJobType = (type: JobType) => {
    setJobTypes((prev) => (prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]));
  };

  const toggleExperience = (level: ExperienceLevel) => {
    setExperienceLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setLocationQuery("");
    setWorkplaceTypes([]);
    setJobTypes([]);
    setExperienceLevels([]);
    setMinSalary(0);
    setSelectedSkill("");
    router.push("/jobs");
  };

  // Filtered & Sorted jobs
  const filteredJobs = useMemo(() => {
    return MOCK_JOBS.filter((job) => {
      // Keyword query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(q);
        const matchesCompany = job.companyName.toLowerCase().includes(q);
        const matchesSkills = job.skills.some((s) => s.toLowerCase().includes(q));
        if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
      }

      // Location query
      if (locationQuery) {
        const loc = locationQuery.toLowerCase();
        const matchesLoc = job.location.toLowerCase().includes(loc);
        const matchesRemote = loc.includes("remote") && job.workplaceType === "remote";
        if (!matchesLoc && !matchesRemote) return false;
      }

      // Workplace type
      if (workplaceTypes.length > 0 && !workplaceTypes.includes(job.workplaceType)) {
        return false;
      }

      // Job type
      if (jobTypes.length > 0 && !jobTypes.includes(job.jobType)) {
        return false;
      }

      // Experience level
      if (experienceLevels.length > 0 && !experienceLevels.includes(job.experienceLevel)) {
        return false;
      }

      // Min Salary
      if (minSalary > 0 && job.salaryMax < minSalary) {
        return false;
      }

      // Skill filter
      if (selectedSkill && !job.skills.includes(selectedSkill)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "salary_high") return b.salaryMax - a.salaryMax;
      if (sortBy === "newest") return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      if (sortBy === "best_match") return (b.matchScore || 0) - (a.matchScore || 0);
      return 0; // relevance
    });
  }, [
    searchQuery,
    locationQuery,
    workplaceTypes,
    jobTypes,
    experienceLevels,
    minSalary,
    selectedSkill,
    sortBy,
  ]);

  const allSkills = Array.from(new Set(MOCK_JOBS.flatMap((j) => j.skills)));

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full flex items-center pl-3 bg-slate-50 rounded-xl border border-slate-200">
              <Search className="h-5 w-5 text-slate-400 shrink-0" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Title, keyword, skill, or company"
                className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm py-2.5"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 mr-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="relative flex-1 w-full flex items-center pl-3 bg-slate-50 rounded-xl border border-slate-200">
              <MapPin className="h-5 w-5 text-slate-400 shrink-0" />
              <Input
                type="text"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                placeholder="Location (city, state, or 'Remote')"
                className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm py-2.5"
              />
              {locationQuery && (
                <button
                  onClick={() => setLocationQuery("")}
                  className="p-1 mr-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className="md:hidden w-full flex items-center justify-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters ({workplaceTypes.length + jobTypes.length + experienceLevels.length})
            </Button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside
            className={`md:block ${
              mobileFilterOpen ? "block fixed inset-0 z-50 bg-white p-6 overflow-y-auto" : "hidden"
            } md:static md:z-auto md:p-0 md:bg-transparent`}
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-blue-600" />
                  Filters
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetFilters}
                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Reset All
                  </button>
                  {mobileFilterOpen && (
                    <button onClick={() => setMobileFilterOpen(false)} className="md:hidden p-1">
                      <X className="h-5 w-5 text-slate-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Workplace Mode */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Workplace Mode
                </h4>
                <div className="space-y-2">
                  {(["remote", "hybrid", "on-site"] as WorkplaceType[]).map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={workplaceTypes.includes(type)}
                        onChange={() => toggleWorkplace(type)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>

              {/* Employment Type */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Job Type
                </h4>
                <div className="space-y-2">
                  {(["full-time", "part-time", "contract", "internship"] as JobType[]).map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={jobTypes.includes(type)}
                        onChange={() => toggleJobType(type)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      {type.replace("-", " ")}
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience Level */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Experience Level
                </h4>
                <div className="space-y-2">
                  {(["entry", "mid", "senior", "lead"] as ExperienceLevel[]).map((lvl) => (
                    <label
                      key={lvl}
                      className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer capitalize"
                    >
                      <input
                        type="checkbox"
                        checked={experienceLevels.includes(lvl)}
                        onChange={() => toggleExperience(lvl)}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                      {lvl} level
                    </label>
                  ))}
                </div>
              </div>

              {/* Salary Floor Slider */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Min Salary
                  </h4>
                  <span className="text-xs font-bold text-blue-600">
                    {minSalary > 0 ? formatCurrency(minSalary) : "Any"}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="200000"
                  step="10000"
                  value={minSalary}
                  onChange={(e) => setMinSalary(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Popular Skills Multi-Select */}
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
                  Key Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {allSkills.slice(0, 10).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => setSelectedSkill(selectedSkill === skill ? "" : skill)}
                      className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                        selectedSkill === skill
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              {mobileFilterOpen && (
                <Button onClick={() => setMobileFilterOpen(false)} className="w-full md:hidden mt-4">
                  Apply Filters
                </Button>
              )}
            </div>
          </aside>

          {/* Results Column */}
          <main className="md:col-span-3 space-y-4">
            {/* Header: count & sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white px-5 py-3 rounded-xl border border-slate-200/90 shadow-sm">
              <span className="text-sm font-semibold text-slate-800">
                Showing <span className="text-blue-600">{filteredJobs.length}</span> available jobs
              </span>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="relevance">Most Relevant</option>
                  <option value="newest">Recently Posted</option>
                  <option value="salary_high">Highest Salary</option>
                  <option value="best_match">Highest Match Score</option>
                </select>
              </div>
            </div>

            {/* Job Listings List */}
            {filteredJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
                <Briefcase className="h-12 w-12 text-slate-300 mx-auto" />
                <h3 className="text-lg font-bold text-slate-900">No matching jobs found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Try adjusting your keywords, broadening the location filter, or resetting your salary criteria.
                </p>
                <Button onClick={resetFilters} variant="outline" size="sm">
                  Clear All Filters
                </Button>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const isSaved = savedJobIds.has(job.id);
                return (
                  <Card
                    key={job.id}
                    className="card-hover border-slate-200/90 hover:border-blue-400/80 transition-all shadow-sm"
                  >
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <img
                            src={job.companyLogo}
                            alt={job.companyName}
                            className="h-12 w-12 rounded-xl object-cover border border-slate-200 shrink-0 mt-0.5"
                          />
                          <div>
                            <div className="flex items-center gap-2.5 flex-wrap">
                              <Link
                                href={`/jobs/${job.slug}`}
                                className="font-bold text-lg text-slate-900 hover:text-blue-600 transition-colors"
                              >
                                {job.title}
                              </Link>
                              {job.matchScore && (
                                <Badge variant="purple" className="gap-1 font-semibold text-[11px]">
                                  <Sparkles className="h-3 w-3" />
                                  {job.matchScore}% Match
                                </Badge>
                              )}
                            </div>

                            <p className="text-sm font-semibold text-slate-600 mt-1">
                              {job.companyName} •{" "}
                              <span className="text-slate-500 font-normal">{job.location}</span>
                            </p>

                            <p className="text-sm text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                              {job.description}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-1.5">
                              {job.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Save Button */}
                        <button
                          onClick={(e) => toggleSaveJob(job.id, e)}
                          title={isSaved ? "Saved" : "Save Job"}
                          className={`p-2 rounded-xl border transition-all cursor-pointer ${
                            isSaved
                              ? "bg-blue-50 border-blue-200 text-blue-600"
                              : "bg-white border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300"
                          }`}
                        >
                          {isSaved ? (
                            <BookmarkCheck className="h-5 w-5 fill-blue-600" />
                          ) : (
                            <Bookmark className="h-5 w-5" />
                          )}
                        </button>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
                        <div className="flex items-center gap-4 font-semibold text-slate-700">
                          <span className="text-sm text-emerald-700">
                            {formatCurrency(job.salaryMin)} - {formatCurrency(job.salaryMax)}
                          </span>
                          <span>•</span>
                          <span className="capitalize">{job.workplaceType}</span>
                          <span>•</span>
                          <span className="capitalize">{job.jobType}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-slate-400">
                            Posted {formatRelativeTime(job.postedAt)}
                          </span>
                          <Link href={`/jobs/${job.slug}`}>
                            <Button size="sm" className="font-semibold gap-1 text-xs">
                              Apply Now <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
