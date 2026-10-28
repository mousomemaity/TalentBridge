import {
  Job,
  JobFilterParams,
  Company,
  Application,
  CandidateProfile,
  ResumeItem,
  InterviewSession,
  AssessmentItem,
  OfferItem,
  JobAlert,
  DashboardMetrics,
  KanbanStage,
} from "@/types";
import {
  MOCK_JOBS,
  MOCK_COMPANIES,
  MOCK_APPLICATIONS,
  MOCK_CANDIDATE_PROFILE,
  MOCK_RESUMES,
  MOCK_OFFERS,
  MOCK_JOB_ALERTS,
  MOCK_DASHBOARD_METRICS,
} from "./mock-data";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api/v1";

class ApiError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

// Memory stores for dynamic state during session
let inMemoryJobs = [...MOCK_JOBS];
let inMemoryApplications = [...MOCK_APPLICATIONS];
let inMemoryCandidateProfile = { ...MOCK_CANDIDATE_PROFILE };
const inMemoryResumes = [...MOCK_RESUMES];
const inMemoryAlerts = [...MOCK_JOB_ALERTS];
const inMemoryOffers = [...MOCK_OFFERS];

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("talentbridge_token");
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAuthToken();
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const res = await fetch(url, { ...options, headers });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new ApiError(res.status, errorData.message || res.statusText, errorData);
    }
    return (await res.json()) as T;
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    console.info(`[API Client] Live endpoint (${url}) not reachable. Using fallback mock adapter.`);
    return mockHandler<T>(endpoint, options);
  }
}

// Fallback Mock Adapter to support standalone frontend demonstration
function mockHandler<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const method = (options.method || "GET").toUpperCase();

      // PUBLIC JOBS
      if (endpoint.startsWith("/jobs") && method === "GET") {
        if (endpoint.includes("/jobs/")) {
          const slug = endpoint.split("/jobs/")[1].split("?")[0];
          const job = inMemoryJobs.find((j) => j.slug === slug || j.id === slug);
          if (job) return resolve(job as unknown as T);
          return reject(new ApiError(404, "Job not found"));
        }
        return resolve({ jobs: inMemoryJobs, total: inMemoryJobs.length } as unknown as T);
      }

      // PUBLIC COMPANIES
      if (endpoint.startsWith("/companies") && method === "GET") {
        if (endpoint.includes("/companies/")) {
          const slug = endpoint.split("/companies/")[1].split("?")[0];
          const company = MOCK_COMPANIES.find((c) => c.slug === slug || c.id === slug);
          if (company) return resolve(company as unknown as T);
          return reject(new ApiError(404, "Company not found"));
        }
        return resolve(MOCK_COMPANIES as unknown as T);
      }

      // CANDIDATE PROFILE
      if (endpoint === "/me/profile") {
        if (method === "GET") return resolve(inMemoryCandidateProfile as unknown as T);
        if (method === "PATCH") {
          const body = JSON.parse(options.body as string);
          inMemoryCandidateProfile = { ...inMemoryCandidateProfile, ...body };
          return resolve(inMemoryCandidateProfile as unknown as T);
        }
      }

      // CANDIDATE APPLICATIONS
      if (endpoint === "/me/applications") {
        return resolve(inMemoryApplications as unknown as T);
      }

      if (endpoint.startsWith("/me/applications/") && endpoint.endsWith("/withdraw") && method === "POST") {
        const id = endpoint.split("/me/applications/")[1].split("/withdraw")[0];
        inMemoryApplications = inMemoryApplications.filter((a) => a.id !== id);
        return resolve({ success: true } as unknown as T);
      }

      // CANDIDATE RESUMES
      if (endpoint === "/me/resumes") {
        return resolve(inMemoryResumes as unknown as T);
      }

      // EMPLOYER METRICS
      if (endpoint === "/app/dashboard/metrics") {
        return resolve(MOCK_DASHBOARD_METRICS as unknown as T);
      }

      // EMPLOYER JOBS
      if (endpoint === "/app/jobs") {
        if (method === "GET") return resolve(inMemoryJobs as unknown as T);
        if (method === "POST") {
          const body = JSON.parse(options.body as string);
          const newJob: Job = {
            id: `job-${Date.now()}`,
            slug: body.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
            companyId: "comp-1",
            companyName: "NexusAI Technologies",
            companyLogo: MOCK_COMPANIES[0].logo,
            postedAt: new Date().toISOString(),
            status: "open",
            applicantsCount: 0,
            matchScore: 90,
            ...body,
          };
          inMemoryJobs = [newJob, ...inMemoryJobs];
          return resolve(newJob as unknown as T);
        }
      }

      // STAGE MOVE IN KANBAN
      if (endpoint.startsWith("/app/applications/") && endpoint.endsWith("/stage") && method === "PATCH") {
        const id = endpoint.split("/app/applications/")[1].split("/stage")[0];
        const { stage } = JSON.parse(options.body as string);
        inMemoryApplications = inMemoryApplications.map((app) =>
          app.id === id ? { ...app, stage, updatedAt: new Date().toISOString() } : app
        );
        const updated = inMemoryApplications.find((a) => a.id === id);
        return resolve(updated as unknown as T);
      }

      // Default mock resolution
      return resolve({ success: true } as unknown as T);
    }, 150);
  });
}

// Exported typed API functions
export const apiClient = {
  // Public
  getJobs: (params?: JobFilterParams) => {
    void params;
    return request<{ jobs: Job[]; total: number }>("/jobs");
  },
  getJobBySlug: (slug: string) => request<Job>(`/jobs/${slug}`),
  getCompanies: () => request<Company[]>("/companies"),
  getCompanyBySlug: (slug: string) => request<Company>(`/companies/${slug}`),
  applyForJob: (jobId: string, data: Record<string, unknown>) =>
    request<{ success: boolean; applicationId: string }>(`/jobs/${jobId}/apply`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  saveJob: (jobId: string) => request<{ success: boolean }>(`/me/saved-jobs/${jobId}`, { method: "POST" }),
  unsaveJob: (jobId: string) => request<{ success: boolean }>(`/me/saved-jobs/${jobId}`, { method: "DELETE" }),

  // Candidate
  getCandidateProfile: () => request<CandidateProfile>("/me/profile"),
  updateCandidateProfile: (data: Partial<CandidateProfile>) =>
    request<CandidateProfile>("/me/profile", { method: "PATCH", body: JSON.stringify(data) }),
  getCandidateApplications: () => request<Application[]>("/me/applications"),
  withdrawApplication: (id: string) => request<{ success: boolean }>(`/me/applications/${id}/withdraw`, { method: "POST" }),
  getResumes: () => request<ResumeItem[]>("/me/resumes"),
  uploadResume: (data: Record<string, unknown>) =>
    request<ResumeItem>("/me/resumes", { method: "POST", body: JSON.stringify(data) }),
  deleteResume: (id: string) => request<{ success: boolean }>(`/me/resumes/${id}`, { method: "DELETE" }),
  setDefaultResume: (id: string) => request<{ success: boolean }>(`/me/resumes/${id}/default`, { method: "PATCH" }),
  getInterviews: () => request<InterviewSession[]>("/me/interviews"),
  getAssessments: () => request<AssessmentItem[]>("/me/assessments"),
  getOffers: () => request<OfferItem[]>("/me/offers"),
  acceptOffer: (id: string) => request<{ success: boolean }>(`/me/offers/${id}/accept`, { method: "POST" }),
  declineOffer: (id: string, reason: string) =>
    request<{ success: boolean }>(`/me/offers/${id}/decline`, { method: "POST", body: JSON.stringify({ reason }) }),
  getJobAlerts: () => request<JobAlert[]>("/me/saved-searches"),
  createJobAlert: (data: Partial<JobAlert>) => request<JobAlert>("/me/saved-searches", { method: "POST", body: JSON.stringify(data) }),
  deleteJobAlert: (id: string) => request<{ success: boolean }>(`/me/saved-searches/${id}`, { method: "DELETE" }),

  // Employer ATS
  getEmployerMetrics: () => request<DashboardMetrics>("/app/dashboard/metrics"),
  getEmployerJobs: () => request<Job[]>("/app/jobs"),
  createEmployerJob: (data: Partial<Job>) => request<Job>("/app/jobs", { method: "POST", body: JSON.stringify(data) }),
  getJobApplications: (jobId: string) => request<Application[]>(`/app/jobs/${jobId}/applications`),
  updateApplicationStage: (applicationId: string, stage: KanbanStage) =>
    request<Application>(`/app/applications/${applicationId}/stage`, {
      method: "PATCH",
      body: JSON.stringify({ stage }),
    }),
  addRecruiterNote: (applicationId: string, content: string) =>
    request<{ success: boolean }>(`/app/applications/${applicationId}/notes`, {
      method: "POST",
      body: JSON.stringify({ content }),
    }),
};
