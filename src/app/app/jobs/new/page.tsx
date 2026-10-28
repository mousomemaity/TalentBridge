"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  DollarSign,
  HelpCircle,
  FileCheck,
} from "lucide-react";

export default function NewJobWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);

  // Form State
  const [title, setTitle] = useState("Staff Cloud Systems Architect");
  const [department, setDepartment] = useState("Infrastructure & Platform");
  const [location, setLocation] = useState("San Francisco, CA");
  const [workplaceType, setWorkplaceType] = useState("hybrid");
  const [jobType, setJobType] = useState("full-time");
  const [experienceLevel, setExperienceLevel] = useState("lead");

  const [description, setDescription] = useState(
    "We are seeking a Staff Cloud Systems Architect to design and govern our high-availability multi-region Kubernetes platform."
  );
  const [responsibilities, setResponsibilities] = useState(
    "• Architect zero-trust distributed cloud topologies\n• Lead SRE incident management reviews\n• Optimize infrastructure expenditures with FinOps automation"
  );
  const [requirements, setRequirements] = useState(
    "• 8+ years distributed cloud systems background\n• Deep mastery of Kubernetes, Terraform, and Go\n• Proven history in 99.999% SLA environments"
  );

  const [salaryMin, setSalaryMin] = useState("180000");
  const [salaryMax, setSalaryMax] = useState("230000");

  const [screeningQ, setScreeningQ] = useState(
    "Do you have 5+ years experience managing production Kubernetes clusters?"
  );

  const handleAiGenerate = () => {
    setAiGenerating(true);
    setTimeout(() => {
      setAiGenerating(false);
      setDescription(
        `As our ${title}, you will pioneer high-throughput, fault-tolerant cloud architectures supporting our global enterprise customer base. You will directly influence technical strategy, mentor platform engineers, and champion engineering excellence.`
      );
    }, 700);
  };

  const handlePublish = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      router.push("/app/jobs");
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Page Header & Step Progress */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Create Job Requisition
          </h1>
          <p className="text-xs text-slate-500">
            Multi-step wizard with built-in AI job description generation and knockout screening rules.
          </p>
        </div>

        <Link href="/app/jobs">
          <Button variant="outline" size="sm" className="text-xs">
            Cancel
          </Button>
        </Link>
      </div>

      {/* Steps Indicator */}
      <div className="grid grid-cols-5 gap-2 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-sm text-center text-xs font-semibold">
        {[
          { step: 1, label: "Basics" },
          { step: 2, label: "Description" },
          { step: 3, label: "Compensation" },
          { step: 4, label: "Screening" },
          { step: 5, label: "Publish" },
        ].map((item) => (
          <div
            key={item.step}
            className={`py-1.5 rounded-xl transition-all ${
              currentStep === item.step
                ? "bg-purple-600 text-white font-bold shadow-sm"
                : currentStep > item.step
                ? "text-emerald-700 font-bold bg-emerald-50"
                : "text-slate-400"
            }`}
          >
            {item.step}. {item.label}
          </div>
        ))}
      </div>

      {/* Step Forms */}
      <Card className="border-slate-200/90 shadow-xl p-6 sm:p-8">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Step 1: Role Overview & Department
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Job Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Department
                </label>
                <Input
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Engineering"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Workplace Mode
                </label>
                <select
                  value={workplaceType}
                  onChange={(e) => setWorkplaceType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium focus:ring-2 focus:ring-purple-600"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="on-site">On-site</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Employment Type
                </label>
                <select
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium focus:ring-2 focus:ring-purple-600"
                >
                  <option value="full-time">Full-Time</option>
                  <option value="contract">Contract</option>
                  <option value="part-time">Part-Time</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Experience Level
                </label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2 text-xs font-medium focus:ring-2 focus:ring-purple-600"
                >
                  <option value="entry">Entry Level</option>
                  <option value="mid">Mid Level</option>
                  <option value="senior">Senior Level</option>
                  <option value="lead">Lead / Staff</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100 mt-6">
              <Button onClick={() => setCurrentStep(2)} variant="purple" className="font-bold gap-1 text-xs">
                Continue to Description <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                Step 2: Description & Responsibilities
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAiGenerate}
                disabled={aiGenerating}
                className="gap-1.5 text-xs font-bold text-purple-700 border-purple-200 hover:bg-purple-50"
              >
                <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                {aiGenerating ? "Generating Draft..." : "AI Generate JD"}
              </Button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Role Summary
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-purple-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Key Responsibilities (One per line)
              </label>
              <textarea
                rows={4}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-purple-600 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Requirements & Tech Stack (One per line)
              </label>
              <textarea
                rows={4}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:ring-2 focus:ring-purple-600 text-slate-800"
              />
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 mt-6">
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(1)} className="gap-1 text-xs">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
              <Button onClick={() => setCurrentStep(3)} variant="purple" className="font-bold gap-1 text-xs">
                Continue to Compensation <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Step 3: Target Compensation Range (USD)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Minimum Annual Salary ($)
                </label>
                <Input
                  type="number"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="140000"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Maximum Annual Salary ($)
                </label>
                <Input
                  type="number"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="190000"
                />
              </div>
            </div>

            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 text-xs text-purple-900 space-y-1 mt-4">
              <span className="font-bold block">Pay Transparency Compliance</span>
              <p className="text-purple-700">
                Jobs with clear compensation ranges attract 3.4x more qualified applicants and comply with California, New York, and EU pay transparency mandates.
              </p>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 mt-6">
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(2)} className="gap-1 text-xs">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
              <Button onClick={() => setCurrentStep(4)} variant="purple" className="font-bold gap-1 text-xs">
                Continue to Screening <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-3">
              Step 4: Knockout Screening Questions
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Knockout Question
              </label>
              <Input
                value={screeningQ}
                onChange={(e) => setScreeningQ(e.target.value)}
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Candidates must answer &quot;Yes&quot; to advance to recruiter screening.
              </p>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100 mt-6">
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(3)} className="gap-1 text-xs">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
              <Button onClick={() => setCurrentStep(5)} variant="purple" className="font-bold gap-1 text-xs">
                Review & Publish <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-700">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-900">Ready to Publish Requisition</h3>
                <p className="text-xs text-slate-500">
                  Review the requisition summary before publishing live to the TalentBridge job board.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-500">Job Title:</span>
                <span className="font-bold text-slate-900">{title}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-500">Department:</span>
                <span className="text-slate-800">{department}</span>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-500">Location:</span>
                <span className="text-slate-800">{location} ({workplaceType})</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-slate-500">Target Range:</span>
                <span className="font-bold text-emerald-700">
                  ${Number(salaryMin).toLocaleString()} - ${Number(salaryMax).toLocaleString()} / year
                </span>
              </div>
            </div>

            <div className="flex justify-between pt-4 border-t border-slate-100">
              <Button variant="ghost" size="sm" onClick={() => setCurrentStep(4)} className="gap-1 text-xs">
                <ArrowLeft className="h-3.5 w-3.5" /> Back
              </Button>
              <Button
                onClick={handlePublish}
                disabled={isSubmitting}
                variant="purple"
                className="font-bold text-xs"
              >
                {isSubmitting ? "Publishing Requisition..." : "Publish Requisition Live"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
