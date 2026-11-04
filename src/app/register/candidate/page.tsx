"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  CheckCircle2,
  UploadCloud,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  User,
  MapPin,
} from "lucide-react";

export default function CandidateRegisterPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedSkills, setParsedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setResumeFile(file);
      setIsParsing(true);
      setTimeout(() => {
        setIsParsing(false);
        setParsedSkills(["React", "TypeScript", "Next.js", "Tailwind CSS", "Node.js"]);
      }, 800);
    }
  };

  const handleFinalSubmit = async () => {
    setIsLoading(true);
    await login("candidate");
    router.push("/me/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center">
        <Link href="/" className="inline-flex items-center gap-2 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
            <Briefcase className="h-5 w-5" />
          </div>
          <span className="text-2xl font-black tracking-tight text-slate-900">TalentBridge</span>
        </Link>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create Your Candidate Profile
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Get matched with top engineering opportunities based on your actual skills
        </p>

        {/* Steps indicator */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step === 1 ? "text-blue-600 font-bold" : "text-emerald-600"}`}>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${step === 1 ? "bg-blue-100 text-blue-700" : "bg-emerald-100 text-emerald-700"}`}>
              {step > 1 ? "✓" : "1"}
            </span>
            Account Info
          </div>
          <div className="h-px w-8 bg-slate-200"></div>
          <div className={`flex items-center gap-1.5 ${step === 2 ? "text-blue-600 font-bold" : "text-slate-400"}`}>
            <span className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${step === 2 ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-500"}`}>
              2
            </span>
            Resume & AI Match
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <Card className="border-slate-200/90 shadow-xl p-6 sm:p-8">
          {step === 1 ? (
            <form onSubmit={handleStep1Submit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="San Francisco, CA"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full font-bold mt-4 gap-2">
                Continue to Resume Upload <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Upload Resume (PDF, DOCX)
                </label>
                <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-blue-500 transition-colors bg-slate-50/50">
                  <UploadCloud className="h-10 w-10 text-blue-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-slate-800">
                    {resumeFile ? resumeFile.name : "Drag and drop your resume file here"}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB` : "Supports PDF, DOCX up to 10MB"}
                  </p>
                  <label className="mt-4 inline-block">
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <span className="inline-flex items-center px-4 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer">
                      Browse File
                    </span>
                  </label>
                </div>
              </div>

              {/* Parsing status & preview */}
              {isParsing && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center gap-3 text-xs text-blue-800 font-semibold animate-pulse">
                  <Sparkles className="h-4 w-4 text-blue-600" />
                  AI parsing resume structure and technical competencies...
                </div>
              )}

              {parsedSkills.length > 0 && (
                <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-purple-900">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                      Extracted Skills
                    </span>
                    <span className="text-[11px] text-purple-600">Auto-detected</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {parsedSkills.map((s) => (
                      <Badge key={s} variant="purple" className="text-xs">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <Button variant="ghost" size="sm" onClick={() => setStep(1)} className="gap-1">
                  <ArrowLeft className="h-3.5 w-3.5" /> Back
                </Button>
                <Button onClick={handleFinalSubmit} disabled={isLoading} className="font-bold">
                  {isLoading ? "Finalizing Account..." : "Complete & Enter Dashboard"}
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            Already registered?{" "}
            <Link href="/login" className="font-bold text-blue-600 hover:underline">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
