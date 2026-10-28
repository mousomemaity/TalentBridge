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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MOCK_INTERVIEWS } from "@/lib/mock-data";
import { Video, Clock, Calendar, User, CheckCircle2 } from "lucide-react";

export default function CandidateInterviewsPage() {
  const [interviews, setInterviews] = useState(MOCK_INTERVIEWS);
  const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
  const [rescheduleId, setRescheduleId] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [submittedToast, setSubmittedToast] = useState(false);

  const handleReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    setInterviews((prev) =>
      prev.map((i) =>
        i.id === rescheduleId ? { ...i, status: "reschedule_requested" } : i
      )
    );
    setRescheduleModalOpen(false);
    setSubmittedToast(true);
    setTimeout(() => setSubmittedToast(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Interviews</h1>
          <p className="text-xs text-slate-500">
            View scheduled interview panels, access secure video links, and request time changes.
          </p>
        </div>
      </div>

      {submittedToast && (
        <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-purple-600" />
          Reschedule request sent to the recruitment team. They will contact you shortly!
        </div>
      )}

      <div className="space-y-4">
        {interviews.map((item) => (
          <Card key={item.id} className="border-slate-200/90 shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-purple-100 text-purple-700 shrink-0">
                  <Video className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-slate-900">{item.interviewType} Round</h3>
                    <Badge variant={item.status === "scheduled" ? "purple" : "warning"} className="text-[10px]">
                      {item.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-xs font-semibold text-slate-600 mt-1">
                    {item.companyName} • <span className="text-slate-500">{item.jobTitle}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <User className="h-3.5 w-3.5 text-slate-400" /> Interviewer: {item.interviewerName}
                  </p>
                  <div className="mt-2.5 flex items-center gap-3 text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1 text-purple-700">
                      <Calendar className="h-3.5 w-3.5" /> Oct 26, 2026
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <Clock className="h-3.5 w-3.5" /> 5:00 PM UTC ({item.durationMinutes} min)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setRescheduleId(item.id);
                    setRescheduleModalOpen(true);
                  }}
                  className="text-xs font-semibold"
                >
                  Request Reschedule
                </Button>
                <a href={item.meetingLink} target="_blank" rel="noreferrer">
                  <Button size="sm" variant="purple" className="font-bold text-xs gap-1.5">
                    <Video className="h-3.5 w-3.5" /> Join Video Room
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reschedule Modal */}
      <Dialog open={rescheduleModalOpen} onOpenChange={setRescheduleModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Request Interview Reschedule</DialogTitle>
            <DialogDescription>
              Let the recruiting coordinator know why you need to move this round.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleReschedule} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Reason & Available Time Windows
              </label>
              <textarea
                required
                rows={4}
                value={rescheduleReason}
                onChange={(e) => setRescheduleReason(e.target.value)}
                placeholder="I have an unexpected conflict on Oct 26th. I am available anytime on Oct 27th or 28th between 2 PM and 6 PM..."
                className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-purple-600"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setRescheduleModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="purple" className="font-bold">
                Send Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
