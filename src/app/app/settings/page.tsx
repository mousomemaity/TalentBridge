"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, Mail, Plus, CheckCircle2, Shield, Globe } from "lucide-react";

export default function EmployerSettingsPage() {
  const [savedToast, setSavedToast] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("REC");
  const [teamMembers, setTeamMembers] = useState([
    { name: "Sarah Jenkins", email: "sarah.jenkins@nexusai.com", role: "Company Admin (CA)" },
    { name: "Dr. Aris Vance", email: "aris.vance@nexusai.com", role: "Hiring Manager (HM)" },
    { name: "Elena Chen", email: "elena.chen@nexusai.com", role: "Recruiter (REC)" },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setTeamMembers([
      ...teamMembers,
      {
        name: inviteEmail.split("@")[0],
        email: inviteEmail,
        role: inviteRole === "CA" ? "Company Admin (CA)" : inviteRole === "HM" ? "Hiring Manager (HM)" : "Recruiter (REC)",
      },
    ]);
    setInviteEmail("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Company Settings</h1>
          <p className="text-xs text-slate-500">
            Configure employer tenant branding, career site settings, and collaborate with your hiring team.
          </p>
        </div>

        {savedToast && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Company settings saved!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile Card */}
        <Card className="border-slate-200/90 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Building2 className="h-4 w-4 text-purple-600" /> Tenant Organization Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Company Display Name
              </label>
              <Input defaultValue="NexusAI Technologies" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Primary Career Site Domain
              </label>
              <Input defaultValue="careers.nexusai.com" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Public Description
            </label>
            <textarea
              rows={3}
              defaultValue="NexusAI builds autonomous enterprise workflows powered by generative AI models, helping Fortune 500 companies streamline operations."
              className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </Card>

        {/* Team Collaboration */}
        <Card className="border-slate-200/90 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Users className="h-4 w-4 text-purple-600" /> Hiring Team & Roles
            </h3>
            <span className="text-xs text-slate-400">
              {teamMembers.length} active team members
            </span>
          </div>

          <div className="space-y-2">
            {teamMembers.map((member, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div>
                  <h4 className="font-bold text-slate-900">{member.name}</h4>
                  <p className="text-[11px] text-slate-500">{member.email}</p>
                </div>
                <Badge variant="purple" className="text-[10px]">
                  {member.role}
                </Badge>
              </div>
            ))}
          </div>

          {/* Invite form */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row gap-2">
            <Input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@nexusai.com"
              className="text-xs flex-1"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800"
            >
              <option value="REC">Recruiter (REC)</option>
              <option value="HM">Hiring Manager (HM)</option>
              <option value="CA">Company Admin (CA)</option>
            </select>
            <Button
              type="button"
              onClick={handleInvite}
              variant="outline"
              size="sm"
              className="font-bold text-xs gap-1 shrink-0"
            >
              <Plus className="h-3.5 w-3.5" /> Invite Member
            </Button>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="purple" className="font-bold shadow-sm">
            Save Organization Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
