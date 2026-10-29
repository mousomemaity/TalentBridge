"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { MOCK_COMPANIES } from "@/lib/mock-data";
import { Search, Building2, MapPin, Star, Users, ArrowRight } from "lucide-react";

export default function CompaniesPage() {
  const [search, setSearch] = useState("");

  const filteredCompanies = MOCK_COMPANIES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Top Technology Employers
          </h1>
          <p className="mt-3 text-sm text-slate-600">
            Learn about company culture, values, tech stacks, and active open positions directly
            from verified hiring teams.
          </p>

          <div className="mt-6 relative max-w-md mx-auto">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company or industry..."
              className="pl-10 bg-white"
            />
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <Card key={company.id} className="card-hover border-slate-200/90 shadow-sm flex flex-col justify-between">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <img
                    src={company.logo}
                    alt={company.name}
                    className="h-14 w-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">{company.name}</h3>
                    <p className="text-xs font-medium text-slate-500 mt-0.5">{company.industry}</p>
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-500 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span>{company.rating}</span>
                      <span className="text-slate-400 font-normal">({company.size})</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-4 line-clamp-3 leading-relaxed">
                  {company.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {company.culture.slice(0, 2).map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>

              <div className="p-6 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-600">
                  {company.openJobsCount} Open Roles
                </span>
                <Link href={`/companies/${company.slug}`}>
                  <Button size="sm" variant="outline" className="font-semibold text-xs gap-1">
                    View Profile <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
