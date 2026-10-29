"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MOCK_JOB_ALERTS } from "@/lib/mock-data";
import { JobAlert } from "@/types";
import { BellRing, Plus, Trash2, CheckCircle2 } from "lucide-react";

export default function CandidateJobAlertsPage() {
  const [alerts, setAlerts] = useState<JobAlert[]>(MOCK_JOB_ALERTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("Remote");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlert: JobAlert = {
      id: `alert-${Date.now()}`,
      title,
      query,
      location,
      frequency,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    setAlerts([newAlert, ...alerts]);
    setTitle("");
    setQuery("");
    setModalOpen(false);
  };

  const toggleActive = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isActive: !a.isActive } : a))
    );
  };

  const deleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Job Alerts</h1>
          <p className="text-xs text-slate-500">
            Receive automated notifications when newly posted roles match your criteria.
          </p>
        </div>

        <Button onClick={() => setModalOpen(true)} size="sm" className="font-semibold gap-1.5 shadow-sm">
          <Plus className="h-4 w-4" /> Create Alert
        </Button>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => (
          <Card key={alert.id} className="border-slate-200/90 shadow-sm p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">{alert.title}</h4>
                  <Badge variant={alert.isActive ? "success" : "secondary"} className="text-[10px]">
                    {alert.isActive ? "Active" : "Paused"}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Query: <span className="font-semibold text-slate-700">&quot;{alert.query}&quot;</span> • Location:{" "}
                  <span className="font-semibold text-slate-700">{alert.location}</span> • Frequency:{" "}
                  <span className="capitalize">{alert.frequency}</span>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleActive(alert.id)}
                  className="text-xs font-semibold"
                >
                  {alert.isActive ? "Pause" : "Resume"}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAlert(alert.id)}
                  className="text-xs text-slate-400 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Alert Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Job Alert</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreate} className="space-y-4 py-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Alert Name
              </label>
              <Input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Senior React Roles"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Keywords / Query
              </label>
              <Input
                required
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Next.js React Senior"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Location
                </label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Remote"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Frequency
                </label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as "daily" | "weekly")}
                  className="w-full rounded-lg border border-slate-200 bg-white p-2 text-xs font-medium focus:ring-2 focus:ring-blue-600"
                >
                  <option value="daily">Daily Digest</option>
                  <option value="weekly">Weekly Summary</option>
                </select>
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="font-bold">
                Save Alert
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
