"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MOCK_ASSESSMENTS } from "@/lib/mock-data";
import { AssessmentItem } from "@/types";
import { Award, Clock, CheckCircle2, Play, AlertCircle } from "lucide-react";

export default function CandidateAssessmentsPage() {
  const [assessments, setAssessments] = useState(MOCK_ASSESSMENTS);
  const [activeTest, setActiveTest] = useState<AssessmentItem | null>(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [testComplete, setTestComplete] = useState(false);

  const SAMPLE_QUESTIONS = [
    {
      q: "In Next.js App Router, which file convention is used to wrap child route segments in persistent layout state without re-rendering the header?",
      options: ["template.tsx", "layout.tsx", "page.tsx", "loading.tsx"],
      correct: 1,
    },
    {
      q: "What is the primary benefit of React 19's React Compiler during component re-rendering?",
      options: [
        "Eliminates the need for manual useMemo and useCallback memoization",
        "Replaces JSX with WebAssembly bytecode",
        "Disables React Fiber entirely",
        "Forces all components to be Client Components",
      ],
      correct: 0,
    },
  ];

  const handleNextQuestion = () => {
    if (currentQIndex < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setSelectedAnswer(null);
    } else {
      setTestComplete(true);
      // Mark assessment completed
      if (activeTest) {
        setAssessments((prev) =>
          prev.map((a) => (a.id === activeTest.id ? { ...a, status: "completed", score: 98 } : a))
        );
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Technical Assessments</h1>
        <p className="text-xs text-slate-500">
          Complete verified coding and architecture assessments assigned by prospective employers.
        </p>
      </div>

      <div className="space-y-4">
        {assessments.map((test) => (
          <Card key={test.id} className="border-slate-200/90 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-2xl shrink-0 ${
                    test.status === "completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  <Award className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">{test.title}</h3>
                    <Badge variant={test.status === "completed" ? "success" : "default"}>
                      {test.status === "completed" ? `Passed (${test.score}%)` : "Pending Attempt"}
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-slate-500 mt-1">
                    Target Role: <span className="text-slate-800">{test.jobTitle}</span>
                  </p>
                  <div className="mt-2.5 flex items-center gap-3 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-blue-600" /> {test.durationMinutes} Minutes
                    </span>
                    <span>•</span>
                    <span>{test.totalQuestions} Questions</span>
                    <span>•</span>
                    <span className="text-slate-400">Due {new Date(test.dueDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div>
                {test.status === "completed" ? (
                  <div className="text-right">
                    <span className="text-xs text-emerald-700 font-bold block">Assessment Verified</span>
                    <span className="text-[11px] text-slate-400">Score sent to hiring manager</span>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => {
                      setActiveTest(test);
                      setCurrentQIndex(0);
                      setSelectedAnswer(null);
                      setTestComplete(false);
                    }}
                    className="font-bold gap-1.5 text-xs shadow-sm"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" /> Start Test Runner
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Test Runner Modal */}
      <Dialog open={!!activeTest} onOpenChange={() => setActiveTest(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{activeTest?.title}</span>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                ⏱ 44:12 remaining
              </span>
            </DialogTitle>
          </DialogHeader>

          {testComplete ? (
            <div className="text-center py-6 space-y-4">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">Assessment Submitted!</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Your answers have been graded. Your final score of <span className="font-bold text-emerald-700">98%</span> has been automatically synchronized with the employer&apos;s ATS pipeline.
              </p>
              <Button onClick={() => setActiveTest(null)} className="font-bold mt-2">
                Close Runner
              </Button>
            </div>
          ) : (
            <div className="space-y-6 py-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
                <span>
                  Question {currentQIndex + 1} of {SAMPLE_QUESTIONS.length}
                </span>
                <span>Category: Modern React Architecture</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                <p className="font-semibold text-sm text-slate-900 leading-relaxed">
                  {SAMPLE_QUESTIONS[currentQIndex].q}
                </p>
              </div>

              <div className="space-y-2">
                {SAMPLE_QUESTIONS[currentQIndex].options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-xs font-medium cursor-pointer transition-all ${
                      selectedAnswer === idx
                        ? "border-blue-600 bg-blue-50 text-blue-900 font-bold"
                        : "border-slate-200 hover:bg-slate-50 text-slate-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="answer"
                      checked={selectedAnswer === idx}
                      onChange={() => setSelectedAnswer(idx)}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className="font-bold"
                >
                  {currentQIndex === SAMPLE_QUESTIONS.length - 1 ? "Submit Test" : "Next Question →"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
