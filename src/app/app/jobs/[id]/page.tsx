"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MOCK_JOBS, MOCK_APPLICATIONS } from "@/lib/mock-data";
import { Application, KanbanStage } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import {
  KanbanSquare,
  Users,
  FileText,
  Sparkles,
  ArrowLeft,
  Search,
  Plus,
  Star,
  CheckCircle2,
  Clock,
  MessageSquare,
  ChevronRight,
  X,
  ExternalLink,
} from "lucide-react";

const STAGES: { id: KanbanStage; label: string; color: string }[] = [
  { id: "applied", label: "Applied", color: "border-slate-300 text-slate-700 bg-slate-100" },
  { id: "screening", label: "Screening", color: "border-blue-300 text-blue-700 bg-blue-50" },
  { id: "interview", label: "Interview", color: "border-purple-300 text-purple-700 bg-purple-50" },
  { id: "assessment", label: "Assessment", color: "border-amber-300 text-amber-700 bg-amber-50" },
  { id: "offer", label: "Offer", color: "border-emerald-300 text-emerald-700 bg-emerald-50" },
  { id: "hired", label: "Hired", color: "border-green-400 text-green-800 bg-green-100" },
  { id: "rejected", label: "Rejected", color: "border-red-300 text-red-700 bg-red-50" },
];

export default function JobKanbanPipelinePage() {
  return (
    <React.Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Pipeline...</div>}>
      <JobKanbanPipelineContent />
    </React.Suspense>
  );
}

function JobKanbanPipelineContent() {
  const params = useParams();
  const jobId = (params?.id as string) || "job-1";

  const job = MOCK_JOBS.find((j) => j.id === jobId || j.slug === jobId) || MOCK_JOBS[0];

  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [activeTab, setActiveTab] = useState<"kanban" | "table" | "details">("kanban");
  const [search, setSearch] = useState("");
  const [activeDragApp, setActiveDragApp] = useState<Application | null>(null);

  // Candidate detail drawer
  const [selectedCandidate, setSelectedCandidate] = useState<Application | null>(null);
  const [newNote, setNewNote] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const app = applications.find((a) => a.id === event.active.id);
    if (app) setActiveDragApp(app);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragApp(null);

    if (!over) return;
    const targetStage = over.id as KanbanStage;
    const appId = active.id as string;

    setApplications((prev) =>
      prev.map((a) =>
        a.id === appId
          ? { ...a, stage: targetStage, updatedAt: new Date().toISOString() }
          : a
      )
    );
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !selectedCandidate) return;

    const noteObj = {
      id: `note-${Date.now()}`,
      author: "Sarah Jenkins (Lead Recruiter)",
      content: newNote.trim(),
      createdAt: new Date().toISOString(),
    };

    setApplications((prev) =>
      prev.map((a) =>
        a.id === selectedCandidate.id
          ? {
              ...a,
              recruiterNotes: [noteObj, ...(a.recruiterNotes || [])],
            }
          : a
      )
    );

    setSelectedCandidate((prev) =>
      prev
        ? {
            ...prev,
            recruiterNotes: [noteObj, ...(prev.recruiterNotes || [])],
          }
        : null
    );

    setNewNote("");
  };

  const updateCandidateStage = (appId: string, newStage: KanbanStage) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, stage: newStage } : a))
    );
    if (selectedCandidate?.id === appId) {
      setSelectedCandidate((prev) => (prev ? { ...prev, stage: newStage } : null));
    }
  };

  const filteredApps = applications.filter((a) =>
    a.candidateName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            href="/app/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-purple-600 transition-colors mb-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Requisitions
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{job.title}</h1>
            <Badge variant="success" className="text-xs">
              Open Requisition
            </Badge>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {job.department} • {job.location} ({job.workplaceType}) • {applications.length} Active Candidates
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1 p-1 bg-white border border-slate-200 rounded-xl shadow-sm text-xs font-bold">
            <button
              onClick={() => setActiveTab("kanban")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "kanban"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Kanban Pipeline
            </button>
            <button
              onClick={() => setActiveTab("table")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "table"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Candidates Table
            </button>
            <button
              onClick={() => setActiveTab("details")}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === "details"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Job Details
            </button>
          </div>
        </div>
      </div>

      {/* Kanban View */}
      {activeTab === "kanban" && (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-6 pt-2">
            {STAGES.map((stage) => {
              const stageCandidates = filteredApps.filter((a) => a.stage === stage.id);
              return (
                <KanbanColumn
                  key={stage.id}
                  stage={stage}
                  candidates={stageCandidates}
                  onSelectCandidate={setSelectedCandidate}
                />
              );
            })}
          </div>

          <DragOverlay>
            {activeDragApp ? (
              <div className="w-64 p-3.5 rounded-xl border border-purple-400 bg-white shadow-2xl rotate-2">
                <div className="flex items-center gap-2.5">
                  <img
                    src={
                      activeDragApp.candidateAvatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                    }
                    alt={activeDragApp.candidateName}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">{activeDragApp.candidateName}</h5>
                    <p className="text-[10px] text-slate-500">{activeDragApp.matchScore}% Match</p>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Table View */}
      {activeTab === "table" && (
        <Card className="border-slate-200/90 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">
              Candidate Roster ({filteredApps.length})
            </h3>
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate by name..."
              className="max-w-xs h-8 text-xs"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">AI Match</th>
                  <th className="py-3 px-4">Applied</th>
                  <th className="py-3 px-4">Current Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            app.candidateAvatar ||
                            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                          }
                          alt={app.candidateName}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <button
                            onClick={() => setSelectedCandidate(app)}
                            className="font-bold text-slate-900 hover:text-purple-600 text-xs text-left cursor-pointer"
                          >
                            {app.candidateName}
                          </button>
                          <p className="text-[11px] text-slate-400">{app.candidateEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="purple" className="text-[10px]">
                        {app.matchScore}%
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{formatRelativeTime(app.appliedAt)}</td>
                    <td className="py-3 px-4">
                      <select
                        value={app.stage}
                        onChange={(e) => updateCandidateStage(app.id, e.target.value as KanbanStage)}
                        className="rounded border border-slate-200 bg-white p-1 text-[11px] font-semibold text-slate-800"
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedCandidate(app)}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-700"
                      >
                        Inspect 360°
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Job Details Tab */}
      {activeTab === "details" && (
        <Card className="border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-slate-900 mb-2">Requisition Specifications</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{job.description}</p>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-2">Key Responsibilities</h4>
            <ul className="space-y-1.5 text-xs text-slate-600 list-disc list-inside">
              {job.responsibilities.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-2">Hiring Pipeline Stages</h4>
            <div className="flex flex-wrap gap-2">
              {STAGES.map((s) => (
                <Badge key={s.id} variant="secondary" className="text-xs">
                  {s.label}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      {/* Candidate Detail Drawer (Slide-Over Dialog) */}
      <Dialog open={!!selectedCandidate} onOpenChange={() => setSelectedCandidate(null)}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          {selectedCandidate && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={
                      selectedCandidate.candidateAvatar ||
                      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                    }
                    alt={selectedCandidate.candidateName}
                    className="h-14 w-14 rounded-2xl object-cover ring-2 ring-purple-100"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      {selectedCandidate.candidateName}
                    </h3>
                    <p className="text-xs text-slate-500">{selectedCandidate.candidateHeadline}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Badge variant="purple" className="text-[10px] gap-1">
                        <Sparkles className="h-3 w-3" /> {selectedCandidate.matchScore}% Match
                      </Badge>
                      <span className="text-[11px] text-slate-400">
                        Applied {formatRelativeTime(selectedCandidate.appliedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stage Transition Selector */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-purple-50/70 border border-purple-100">
                <span className="text-xs font-bold text-purple-900">Advance Candidate Stage:</span>
                <select
                  value={selectedCandidate.stage}
                  onChange={(e) =>
                    updateCandidateStage(selectedCandidate.id, e.target.value as KanbanStage)
                  }
                  className="rounded-lg border border-purple-200 bg-white px-2.5 py-1 text-xs font-bold text-purple-900 focus:outline-none"
                >
                  {STAGES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Match Breakdown */}
              {selectedCandidate.matchReasons && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-900 uppercase tracking-wider block">
                    AI Match Evaluation
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {selectedCandidate.matchReasons.matchedSkills.map((s) => (
                      <Badge key={s} variant="success" className="text-[10px]">
                        ✓ {s}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-slate-600 mt-2">
                    {selectedCandidate.matchReasons.experienceFit}
                  </p>
                </div>
              )}

              {/* Recruiter Notes & @Mentions */}
              <div className="space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5 text-purple-600" /> Hiring Team Notes & @Mentions
                </h4>

                {/* Note list */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedCandidate.recruiterNotes?.map((note) => (
                    <div key={note.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex justify-between font-bold text-slate-800 mb-1">
                        <span>{note.author}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {formatRelativeTime(note.createdAt)}
                        </span>
                      </div>
                      <p className="text-slate-600">{note.content}</p>
                    </div>
                  ))}
                </div>

                {/* Add note input */}
                <form onSubmit={handleAddNote} className="flex gap-2">
                  <Input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add recruiter note or tag @hiring-manager..."
                    className="text-xs"
                  />
                  <Button type="submit" variant="purple" size="sm" className="font-bold text-xs shrink-0">
                    Add Note
                  </Button>
                </form>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Kanban Column with Droppable
function KanbanColumn({
  stage,
  candidates,
  onSelectCandidate,
}: {
  stage: { id: KanbanStage; label: string; color: string };
  candidates: Application[];
  onSelectCandidate: (app: Application) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: stage.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-72 shrink-0 flex flex-col rounded-2xl border p-3 min-h-[550px] transition-colors ${
        isOver ? "bg-purple-50/70 border-purple-400" : "bg-slate-100/70 border-slate-200/80"
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-2 py-1.5 mb-3">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
          <span className={`h-2 w-2 rounded-full ${stage.color.split(" ")[2]}`}></span>
          {stage.label}
        </span>
        <span className="h-5 min-w-5 px-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center">
          {candidates.length}
        </span>
      </div>

      {/* Cards List */}
      <div className="space-y-2.5 flex-1 overflow-y-auto">
        {candidates.map((app) => (
          <KanbanCandidateCard
            key={app.id}
            app={app}
            onSelect={() => onSelectCandidate(app)}
          />
        ))}
      </div>
    </div>
  );
}

// Kanban Card with Draggable
function KanbanCandidateCard({
  app,
  onSelect,
}: {
  app: Application;
  onSelect: () => void;
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: app.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={onSelect}
      className={`card-hover p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm cursor-grab active:cursor-grabbing ${
        isDragging ? "opacity-30 border-purple-400" : ""
      }`}
    >
      <div className="flex items-start gap-2.5">
        <img
          src={
            app.candidateAvatar ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
          }
          alt={app.candidateName}
          className="h-8 w-8 rounded-full object-cover shrink-0 mt-0.5"
        />
        <div className="overflow-hidden">
          <h5 className="font-bold text-xs text-slate-900 truncate">{app.candidateName}</h5>
          <p className="text-[11px] text-slate-400 truncate">{app.candidateHeadline}</p>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
        <Badge variant="purple" className="text-[10px] gap-0.5 py-0 px-1.5 font-bold">
          <Sparkles className="h-2.5 w-2.5" /> {app.matchScore}%
        </Badge>
        <span className="text-slate-400">{formatRelativeTime(app.appliedAt)}</span>
      </div>
    </div>
  );
}
