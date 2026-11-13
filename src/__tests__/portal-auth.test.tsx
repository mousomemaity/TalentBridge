import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CandidateLoginPage from "@/app/login/candidate/page";
import EmployerLoginPage from "@/app/login/employer/page";
import AdminLoginPage from "@/app/login/admin/page";
import { AuthProvider } from "@/context/auth-context";

// Mock next/navigation
const mockPush = vi.fn();
const mockReplace = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/login",
}));

describe("Three Separate Role-Specific Authentication Portals", () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockReset();
    mockReplace.mockReset();
    vi.restoreAllMocks();
  });

  describe("1. Admin Portal", () => {
    it("renders only Admin login fields and no candidate/employer role tabs", () => {
      render(
        <AuthProvider>
          <AdminLoginPage />
        </AuthProvider>
      );

      expect(screen.getByText("Super Admin Console")).toBeDefined();
      expect(screen.getByPlaceholderText("admin@jobpilot.internal")).toBeDefined();
      expect(screen.getByText("Authenticate as Super Admin")).toBeDefined();

      // No role tab switchers
      expect(screen.queryByText("Job Seeker (Candidate)")).toBeNull();
      expect(screen.queryByText("Employer / Recruiter")).toBeNull();
    });

    it("accepts SUPER_ADMIN accounts and redirects to /admin/dashboard", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          accessToken: "jwt_super_admin_token",
          user: {
            id: "sa-1",
            email: "admin@jobpilot.internal",
            firstName: "Super",
            lastName: "Admin",
            role: "SUPER_ADMIN",
          },
        }),
      });

      render(
        <AuthProvider>
          <AdminLoginPage />
        </AuthProvider>
      );

      fireEvent.change(screen.getByPlaceholderText("admin@jobpilot.internal"), {
        target: { value: "admin@jobpilot.internal" },
      });
      fireEvent.change(screen.getByPlaceholderText("••••••••••••"), {
        target: { value: "SuperAdmin@2026!" },
      });
      fireEvent.click(screen.getByText("Authenticate as Super Admin"));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/admin/dashboard");
      });
    });

    it("rejects non-admin (CANDIDATE / RECRUITER) accounts with a clear error", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          accessToken: "jwt_candidate_token",
          user: {
            id: "can-1",
            email: "candidate@example.com",
            role: "CANDIDATE",
          },
        }),
      });

      render(
        <AuthProvider>
          <AdminLoginPage />
        </AuthProvider>
      );

      fireEvent.change(screen.getByPlaceholderText("admin@jobpilot.internal"), {
        target: { value: "candidate@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("••••••••••••"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByText("Authenticate as Super Admin"));

      await waitFor(() => {
        expect(screen.getByText(/Access Denied: This portal requires verified Super Admin clearance/i)).toBeDefined();
        expect(mockPush).not.toHaveBeenCalled();
      });
    });
  });

  describe("2. Candidate Portal", () => {
    it("renders only Candidate login fields and no role tabs", () => {
      render(
        <AuthProvider>
          <CandidateLoginPage />
        </AuthProvider>
      );

      expect(screen.getByText("Candidate Portal")).toBeDefined();
      expect(screen.getByPlaceholderText("candidate@example.com")).toBeDefined();
      expect(screen.getByText("Sign in as Candidate")).toBeDefined();
      expect(screen.queryByText("Employer / Recruiter")).toBeNull();
    });

    it("accepts CANDIDATE accounts and redirects to /me/dashboard", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          accessToken: "jwt_candidate_token",
          user: {
            id: "can-2",
            email: "alice@example.com",
            firstName: "Alice",
            lastName: "Smith",
            role: "CANDIDATE",
          },
        }),
      });

      render(
        <AuthProvider>
          <CandidateLoginPage />
        </AuthProvider>
      );

      fireEvent.change(screen.getByPlaceholderText("candidate@example.com"), {
        target: { value: "alice@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("••••••••"), {
        target: { value: "Password123!" },
      });
      fireEvent.click(screen.getByText("Sign in as Candidate"));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/me/dashboard");
      });
    });

    it("rejects RECRUITER or SUPER_ADMIN accounts attempting Candidate login", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          accessToken: "jwt_recruiter_token",
          user: {
            id: "rec-1",
            email: "recruiter@nexusai.com",
            role: "RECRUITER",
          },
        }),
      });

      render(
        <AuthProvider>
          <CandidateLoginPage />
        </AuthProvider>
      );

      fireEvent.change(screen.getByPlaceholderText("candidate@example.com"), {
        target: { value: "recruiter@nexusai.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("••••••••"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByText("Sign in as Candidate"));

      await waitFor(() => {
        expect(screen.getByText(/Access Denied: This portal is for Job Seekers/i)).toBeDefined();
        expect(mockPush).not.toHaveBeenCalled();
      });
    });
  });

  describe("3. Recruiter / Employer Portal", () => {
    it("renders only Employer/Recruiter login fields and no role tabs", () => {
      render(
        <AuthProvider>
          <EmployerLoginPage />
        </AuthProvider>
      );

      expect(screen.getByText("Employer & Recruiter Portal")).toBeDefined();
      expect(screen.getByPlaceholderText("name@company.com")).toBeDefined();
      expect(screen.getByText("Sign in to ATS Platform")).toBeDefined();
      expect(screen.queryByText("Job Seeker (Candidate)")).toBeNull();
    });

    it("accepts RECRUITER accounts and redirects to /app/dashboard", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          accessToken: "jwt_recruiter_token",
          user: {
            id: "rec-2",
            email: "sarah@nexusai.com",
            firstName: "Sarah",
            lastName: "Jenkins",
            role: "RECRUITER",
          },
        }),
      });

      render(
        <AuthProvider>
          <EmployerLoginPage />
        </AuthProvider>
      );

      fireEvent.change(screen.getByPlaceholderText("name@company.com"), {
        target: { value: "sarah@nexusai.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("••••••••"), {
        target: { value: "Password123!" },
      });
      fireEvent.click(screen.getByText("Sign in to ATS Platform"));

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith("/app/dashboard");
      });
    });

    it("rejects CANDIDATE accounts attempting Recruiter login", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          accessToken: "jwt_candidate_token",
          user: {
            id: "can-3",
            email: "jobseeker@example.com",
            role: "CANDIDATE",
          },
        }),
      });

      render(
        <AuthProvider>
          <EmployerLoginPage />
        </AuthProvider>
      );

      fireEvent.change(screen.getByPlaceholderText("name@company.com"), {
        target: { value: "jobseeker@example.com" },
      });
      fireEvent.change(screen.getByPlaceholderText("••••••••"), {
        target: { value: "password123" },
      });
      fireEvent.click(screen.getByText("Sign in to ATS Platform"));

      await waitFor(() => {
        expect(screen.getByText(/Access Denied: This portal is reserved for Recruiters/i)).toBeDefined();
        expect(mockPush).not.toHaveBeenCalled();
      });
    });
  });
});

