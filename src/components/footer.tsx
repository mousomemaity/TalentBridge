"use client";

import React from "react";
import Link from "next/link";
import { Briefcase, Globe, Share2, ExternalLink } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
                <Briefcase className="h-4 w-4" />
              </div>
              <span className="text-lg font-black tracking-tight text-slate-900">TalentBridge</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              The next-generation hiring platform combining a public job board for top candidates with a full-featured Applicant Tracking System (ATS) for high-growth teams.
            </p>
            <div className="flex gap-4 text-slate-400">
              <a href="#" className="hover:text-blue-600 transition-colors" title="Global Network">
                <Globe className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors" title="Share Platform">
                <Share2 className="h-4 w-4" />
              </a>
              <a href="#" className="hover:text-blue-600 transition-colors" title="External Portal">
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Candidates */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              For Job Seekers
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/jobs" className="hover:text-blue-600 transition-colors">
                  Explore All Jobs
                </Link>
              </li>
              <li>
                <Link href="/companies" className="hover:text-blue-600 transition-colors">
                  Company Directory
                </Link>
              </li>
              <li>
                <Link href="/me/dashboard" className="hover:text-blue-600 transition-colors">
                  Candidate Dashboard
                </Link>
              </li>
              <li>
                <Link href="/me/resume" className="hover:text-blue-600 transition-colors">
                  Resume Manager
                </Link>
              </li>
              <li>
                <Link href="/me/job-alerts" className="hover:text-blue-600 transition-colors">
                  Job Alerts
                </Link>
              </li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              For Employers & Recruiters
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <Link href="/app/dashboard" className="hover:text-blue-600 transition-colors">
                  Employer ATS Dashboard
                </Link>
              </li>
              <li>
                <Link href="/app/jobs/new" className="hover:text-blue-600 transition-colors">
                  Post a Job Opening
                </Link>
              </li>
              <li>
                <Link href="/app/jobs" className="hover:text-blue-600 transition-colors">
                  Kanban Hiring Pipeline
                </Link>
              </li>
              <li>
                <Link href="/register/employer" className="hover:text-blue-600 transition-colors">
                  Create Employer Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-4">
              Platform & Standards
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600">
              <li>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  REST API v1 Compliant
                </span>
              </li>
              <li>
                <span className="text-xs text-slate-500 block mt-2">
                  Shared NestJS & PostgreSQL architecture with strict tenant isolation.
                </span>
              </li>
              <li className="pt-2">
                <Link href="/privacy" className="hover:text-blue-600 transition-colors text-xs text-slate-500">
                  Privacy Policy & GDPR
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-blue-600 transition-colors text-xs text-slate-500">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© 2026 TalentBridge Inc. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Engineered with modern Next.js App Router, TypeScript & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
