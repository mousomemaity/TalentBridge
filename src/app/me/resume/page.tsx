"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { MOCK_RESUMES } from "@/lib/mock-data";
import { ResumeItem } from "@/types";
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  Trash2,
  Sparkles,
  Download,
  Eye,
  Star,
} from "lucide-react";

export default function CandidateResumePage() {
  const [resumes, setResumes] = useState<ResumeItem[]>(MOCK_RESUMES);
  const [previewResume, setPreviewResume] = useState<ResumeItem | null>(null);

  const makeDefault = (id: string) => {
    setResumes((prev) =>
      prev.map((r) => ({
        ...r,
        isDefault: r.id === id,
      }))
    );
  };

  const deleteResume = (id: string) => {
    setResumes((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newResume: ResumeItem = {
        id: `res-${Date.now()}`,
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(0)} KB`,
        uploadedAt: new Date().toISOString(),
        isDefault: resumes.length === 0,
        parsedData: {
          skillsDetected: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
          experienceSummary: "Extracted software engineering experience from uploaded document.",
          educationSummary: "Extracted academic credentials.",
        },
      };
      setResumes([newResume, ...resumes]);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Resume Management</h1>
        <p className="text-xs text-slate-500">
          Upload, manage, and inspect AI-parsed metadata across your candidate resumes.
        </p>
      </div>

      {/* Upload Zone */}
      <Card className="border-2 border-dashed border-slate-300 p-8 text-center bg-slate-50/50 hover:border-blue-500 transition-colors">
        <UploadCloud className="h-10 w-10 text-blue-600 mx-auto mb-3" />
        <h3 className="font-bold text-base text-slate-900">Upload a New Resume</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Drag and drop your updated PDF or DOCX resume. Our AI parser will automatically extract your
          skills and experience.
        </p>
        <label className="mt-4 inline-block">
          <input
            type="file"
            accept=".pdf,.docx,.doc"
            onChange={handleUpload}
            className="hidden"
          />
          <Button type="button" size="sm" className="font-bold shadow-sm pointer-events-none">
            Choose Resume File
          </Button>
        </label>
      </Card>

      {/* Resume Cards */}
      <div className="space-y-4">
        {resumes.map((res) => (
          <Card key={res.id} className="border-slate-200/90 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-50 text-blue-600 shrink-0">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-sm text-slate-900">{res.fileName}</h4>
                    {res.isDefault && (
                      <Badge variant="purple" className="text-[10px]">
                        Default Resume
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {res.fileSize} • Uploaded {new Date(res.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {!res.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => makeDefault(res.id)}
                    className="text-xs font-semibold text-slate-600"
                  >
                    Set Default
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewResume(res)}
                  className="text-xs font-semibold gap-1"
                >
                  <Eye className="h-3.5 w-3.5" /> Parsed Data
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteResume(res.id)}
                  className="text-xs text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick preview of detected skills */}
            {res.parsedData?.skillsDetected && (
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-purple-600" /> Extracted Skills:
                </span>
                <div className="flex flex-wrap gap-1">
                  {res.parsedData.skillsDetected.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-[10px]">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* AI Parsed Review Dialog */}
      <Dialog open={!!previewResume} onOpenChange={() => setPreviewResume(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>AI Resume Parsing Review</DialogTitle>
            <DialogDescription>{previewResume?.fileName}</DialogDescription>
          </DialogHeader>

          {previewResume?.parsedData && (
            <div className="space-y-4 py-2 text-xs">
              <div>
                <h5 className="font-bold text-slate-800 uppercase tracking-wider mb-1.5">
                  Extracted Skills
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {previewResume.parsedData.skillsDetected.map((s) => (
                    <Badge key={s} variant="purple">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Experience Summary
                </h5>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {previewResume.parsedData.experienceSummary}
                </p>
              </div>

              <div>
                <h5 className="font-bold text-slate-800 uppercase tracking-wider mb-1">
                  Education Credentials
                </h5>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {previewResume.parsedData.educationSummary}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
