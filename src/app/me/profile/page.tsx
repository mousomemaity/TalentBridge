"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_CANDIDATE_PROFILE } from "@/lib/mock-data";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Sparkles,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
} from "lucide-react";

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState(MOCK_CANDIDATE_PROFILE);
  const [isSavedToast, setIsSavedToast] = useState(false);
  const [newSkillName, setNewSkillName] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavedToast(true);
    setTimeout(() => setIsSavedToast(false), 2500);
  };

  const addSkill = () => {
    if (!newSkillName.trim()) return;
    setProfile((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        { name: newSkillName.trim(), level: "Advanced", yearsOfExperience: 3 },
      ],
    }));
    setNewSkillName("");
  };

  const removeSkill = (skillName: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name !== skillName),
    }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Page Title & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Candidate Profile</h1>
          <p className="text-xs text-slate-500">
            Keep your professional background up to date to maximize AI job matching accuracy.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isSavedToast && (
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200 flex items-center gap-1.5 animate-in fade-in">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Profile changes saved!
            </span>
          )}
          <Button type="submit" size="sm" className="font-bold gap-1.5 shadow-sm">
            <Save className="h-4 w-4" /> Save Profile
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <Card className="border-slate-200/90 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <User className="h-4 w-4 text-blue-600" />
          Personal & Contact Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <Input
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Phone Number
            </label>
            <Input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Location
            </label>
            <Input
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Professional Headline
          </label>
          <Input
            value={profile.headline}
            onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Summary / Bio
          </label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            rows={3}
            className="w-full rounded-lg border border-slate-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 text-slate-800"
          />
        </div>
      </Card>

      {/* Skills Matrix */}
      <Card className="border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
            Skills & Proficiency
          </h3>
          <span className="text-xs text-slate-400">Used by AI matching engine</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <div
              key={skill.name}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-800"
            >
              <span>{skill.name}</span>
              <Badge variant="purple" className="text-[10px] py-0 px-1.5">
                {skill.level} ({skill.yearsOfExperience}y)
              </Badge>
              <button
                type="button"
                onClick={() => removeSkill(skill.name)}
                className="text-slate-400 hover:text-red-600 ml-1 cursor-pointer"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Input
            value={newSkillName}
            onChange={(e) => setNewSkillName(e.target.value)}
            placeholder="Add a new skill (e.g. Docker, GraphQL, Redis)"
            className="max-w-xs text-xs"
          />
          <Button type="button" onClick={addSkill} variant="outline" size="sm" className="gap-1 text-xs font-semibold">
            <Plus className="h-3.5 w-3.5" /> Add Skill
          </Button>
        </div>
      </Card>

      {/* Experience History */}
      <Card className="border-slate-200/90 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <Briefcase className="h-4 w-4 text-blue-600" />
          Work Experience
        </h3>

        <div className="space-y-4">
          {profile.experiences.map((exp) => (
            <div key={exp.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-slate-900">{exp.title}</h4>
                <span className="text-xs text-slate-500 font-medium">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>
              <p className="text-xs font-semibold text-blue-600">
                {exp.company} • {exp.location}
              </p>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Education */}
      <Card className="border-slate-200/90 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-indigo-600" />
          Education
        </h3>

        <div className="space-y-3">
          {profile.educations.map((edu) => (
            <div key={edu.id} className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <h4 className="font-bold text-sm text-slate-900">{edu.degree}</h4>
              <p className="text-xs font-medium text-slate-600">
                {edu.institution} • {edu.fieldOfStudy}
              </p>
              <span className="text-xs text-slate-400 mt-1 block">
                {edu.startDate} - {edu.endDate}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </form>
  );
}
