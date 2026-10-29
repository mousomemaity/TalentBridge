import { describe, it, expect } from "vitest";
import { formatCurrency, formatRelativeTime, cn } from "@/lib/utils";
import { MOCK_JOBS, MOCK_APPLICATIONS } from "@/lib/mock-data";
import { apiClient } from "@/lib/api-client";
import { KanbanStage } from "@/types";

describe("Formatting Utilities", () => {
  it("formats currency correctly into USD without decimals", () => {
    expect(formatCurrency(140000)).toBe("$140,000");
    expect(formatCurrency(85000)).toBe("$85,000");
  });

  it("merges class names with tailwind utilities safely", () => {
    const result = cn("bg-white", false && "hidden", "p-4", "text-slate-900");
    expect(result).toBe("bg-white p-4 text-slate-900");
  });

  it("handles relative time formatting", () => {
    const today = new Date().toISOString();
    expect(formatRelativeTime(today)).toBe("Today");
  });
});

describe("Job Search & Filtering Logic", () => {
  it("contains pre-configured verified jobs with valid schemas", () => {
    expect(MOCK_JOBS.length).toBeGreaterThan(0);
    const firstJob = MOCK_JOBS[0];
    expect(firstJob).toHaveProperty("id");
    expect(firstJob).toHaveProperty("title");
    expect(firstJob).toHaveProperty("salaryMin");
    expect(firstJob).toHaveProperty("skills");
    expect(firstJob.salaryMin).toBeLessThanOrEqual(firstJob.salaryMax);
  });

  it("correctly filters jobs by skill keyword", () => {
    const reactJobs = MOCK_JOBS.filter((j) => j.skills.includes("React"));
    expect(reactJobs.length).toBeGreaterThan(0);
    expect(reactJobs.every((j) => j.skills.includes("React"))).toBe(true);
  });
});

describe("ATS Kanban Pipeline & Application Milestones", () => {
  it("contains initial applications with valid Kanban stages", () => {
    const validStages: KanbanStage[] = [
      "applied",
      "screening",
      "interview",
      "assessment",
      "offer",
      "hired",
      "rejected",
    ];

    expect(MOCK_APPLICATIONS.length).toBeGreaterThan(0);
    for (const app of MOCK_APPLICATIONS) {
      expect(validStages).toContain(app.stage);
    }
  });

  it("allows updating application stage through the typed API client", async () => {
    const targetApp = MOCK_APPLICATIONS[0];
    const newStage: KanbanStage = "offer";
    const updated = await apiClient.updateApplicationStage(targetApp.id, newStage);
    expect(updated).toHaveProperty("stage", newStage);
  });

  it("retrieves candidates and jobs through the API client", async () => {
    const jobsResponse = await apiClient.getJobs();
    expect(jobsResponse).toHaveProperty("jobs");
    expect(jobsResponse.jobs.length).toBeGreaterThan(0);
  });
});
