"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Lock, Bell, Shield, Download, Trash2, CheckCircle2 } from "lucide-react";

export default function CandidateSettingsPage() {
  const [savedMessage, setSavedMessage] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [interviewSms, setInterviewSms] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Account Settings</h1>
          <p className="text-xs text-slate-500">
            Manage your account security, notification channels, and privacy preferences.
          </p>
        </div>

        {savedMessage && (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            Preferences updated!
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Security Settings */}
        <Card className="border-slate-200/90 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Lock className="h-4 w-4 text-blue-600" /> Security & Password
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Current Password
              </label>
              <Input type="password" placeholder="••••••••••••" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                New Password
              </label>
              <Input type="password" placeholder="Min 8 characters" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Two-Factor Authentication (2FA)</h4>
              <p className="text-xs text-slate-500">Require an authenticator app code on login</p>
            </div>
            <Button
              type="button"
              variant={mfaEnabled ? "outline" : "secondary"}
              size="sm"
              onClick={() => setMfaEnabled(!mfaEnabled)}
              className="text-xs font-semibold"
            >
              {mfaEnabled ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </div>
        </Card>

        {/* Notifications */}
        <Card className="border-slate-200/90 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Bell className="h-4 w-4 text-purple-600" /> Notifications & Communications
          </h3>

          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Job Matches & Daily Digests</span>
                <span className="text-[11px] text-slate-500">Receive email alerts for jobs that match your skillset</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={() => setEmailAlerts(!emailAlerts)}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer">
              <div>
                <span className="text-xs font-bold text-slate-900 block">Interview & Meeting Reminders</span>
                <span className="text-[11px] text-slate-500">Receive SMS notifications 1 hour before scheduled rounds</span>
              </div>
              <input
                type="checkbox"
                checked={interviewSms}
                onChange={() => setInterviewSms(!interviewSms)}
                className="h-4 w-4 text-blue-600 rounded"
              />
            </label>
          </div>
        </Card>

        {/* Privacy & GDPR Data Export */}
        <Card className="border-slate-200/90 shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Shield className="h-4 w-4 text-emerald-600" /> Privacy & Data Control (GDPR)
          </h3>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-1">
            <div>
              <p className="text-xs text-slate-700 font-semibold">Export Account Archive</p>
              <p className="text-[11px] text-slate-500">Download a JSON archive of your profile, resumes, and applications.</p>
            </div>
            <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs font-semibold">
              <Download className="h-3.5 w-3.5" /> Request Data Export
            </Button>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" className="font-bold shadow-sm">
            Save Settings
          </Button>
        </div>
      </form>
    </div>
  );
}
