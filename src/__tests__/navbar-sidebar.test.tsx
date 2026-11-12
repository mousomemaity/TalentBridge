import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { AuthProvider } from "@/context/auth-context";

let mockPathname = "/app/dashboard";
let mockSearchParams = new URLSearchParams();

vi.mock("next/navigation", () => ({
  usePathname: () => mockPathname,
  useSearchParams: () => mockSearchParams,
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("Top Navbar Design Requirements", () => {
  beforeEach(() => {
    cleanup();
    mockPathname = "/app/dashboard";
    mockSearchParams = new URLSearchParams();
  });

  it("renders TalentBridge logo icon without text or subtitle beside it", () => {
    const { container } = render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    // Logo link/icon is present
    const logoLink = screen.getByLabelText("TalentBridge");
    expect(logoLink).toBeDefined();
    expect(logoLink.querySelector("svg")).toBeDefined();

    // "TalentBridge" text and "HIRING & CAREER PLATFORM" subtitle are removed
    expect(screen.queryByText("Talent")).toBeNull();
    expect(screen.queryByText("Bridge")).toBeNull();
    expect(screen.queryByText("HIRING & CAREER PLATFORM")).toBeNull();
  });

  it("renders the exact Search / Command Bar in the center section", () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    const searchInput = screen.getByPlaceholderText(
      "Search for jobs, candidates... or press /"
    );
    expect(searchInput).toBeDefined();
    expect(searchInput.getAttribute("placeholder")).toBe(
      "Search for jobs, candidates... or press /"
    );
  });

  it("displays user profile picture/avatar, name, and current role on the right section", () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    // Default candidate user Alex Rivera or recruiter
    expect(screen.getByText(/Alex Rivera|Sarah Jenkins/)).toBeDefined();
    expect(screen.getByText(/Candidate|Recruiter|Admin/)).toBeDefined();
  });

  it("renders Notification Bell on the right, opens dropdown, and does not show fake counts", async () => {
    const { fireEvent } = await import("@testing-library/react");
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    const bellBtn = screen.getByLabelText("Notifications");
    expect(bellBtn).toBeDefined();

    // Clicking bell opens dropdown
    fireEvent.click(bellBtn);
    expect(screen.getByText("Notifications")).toBeDefined();
    expect(screen.getByText("No new notifications")).toBeDefined();

    // Verify no fake numbers/badges like "5" or "99"
    expect(screen.queryByText("5 new")).toBeNull();
    expect(screen.queryByText("99+")).toBeNull();
  });

  it("renders Integrate AI Tools button and opens AI modal on click", async () => {
    const { fireEvent } = await import("@testing-library/react");
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    const aiBtn = screen.getByLabelText("Integrate AI Tools");
    expect(aiBtn).toBeDefined();
    expect(aiBtn.textContent).toContain("Integrate AI Tools");

    // Click opens modal
    fireEvent.click(aiBtn);
    expect(screen.getByText("TalentBridge AI Suite & Integrations")).toBeDefined();
    expect(screen.getByText("AI Job Description Generator")).toBeDefined();
  });

  it("arranges elements in the exact order: Notification Bell -> Integrate AI Tools -> User Profile", () => {
    render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    const html = document.body.innerHTML;
    const bellPos = html.indexOf('aria-label="Notifications"');
    const aiPos = html.indexOf('aria-label="Integrate AI Tools"');
    const profilePos = html.indexOf('Alex Rivera');

    expect(bellPos).toBeGreaterThan(-1);
    expect(aiPos).toBeGreaterThan(bellPos);
    expect(profilePos).toBeGreaterThan(aiPos);
  });
});

describe("Left Sidebar Design & Navigation Items", () => {
  beforeEach(() => {
    cleanup();
    mockSearchParams = new URLSearchParams();
  });

  it("includes all 9 navigation items in the exact required order", () => {
    mockPathname = "/me/dashboard";
    render(
      <AuthProvider>
        <Sidebar isOpen={true} />
      </AuthProvider>
    );

    const expectedItems = [
      "Dashboard",
      "Jobs",
      "Applications",
      "Candidates",
      "Candidate Portal",
      "Recruiter Portal",
      "Admin Portal",
      "Settings",
      "Logout",
    ];

    const renderedLinks = screen.getAllByRole("link");
    const linkTexts = renderedLinks.map((l) => l.textContent?.trim());

    // Check each expected item exists
    for (const item of expectedItems.slice(0, 8)) {
      expect(linkTexts.some((t) => t?.includes(item))).toBe(true);
    }

    // Check Logout button exists
    expect(screen.getByText("Logout")).toBeDefined();

    // Verify ordering
    const textPositions = expectedItems.map((name) =>
      document.body.innerHTML.indexOf(name)
    );
    for (let i = 0; i < textPositions.length - 1; i++) {
      expect(textPositions[i]).toBeLessThan(textPositions[i + 1]);
    }
  });

  it("does NOT contain the global Search Bar inside the Left Sidebar", () => {
    mockPathname = "/me/dashboard";
    const { container } = render(
      <AuthProvider>
        <Sidebar isOpen={true} />
      </AuthProvider>
    );

    const inputInSidebar = container.querySelector("input");
    expect(inputInSidebar).toBeNull();
  });

  it("highlights the active menu item with a dark navy circular background and white icon", () => {
    mockPathname = "/jobs";
    const { container } = render(
      <AuthProvider>
        <Sidebar isOpen={true} />
      </AuthProvider>
    );

    // On /jobs, the Jobs link should have the active circular icon bg (bg-[#0F172A]) and white icon
    const activeCircle = container.querySelector(".bg-\\[\\#0F172A\\]");
    expect(activeCircle).not.toBeNull();
    expect(activeCircle?.className).toContain("rounded-full");
    expect(activeCircle?.className).toContain("text-white");
  });

  it("updates active state automatically by route and NEVER keeps Dashboard active on every page", () => {
    // 1. On /jobs -> Jobs is active, NOT Dashboard
    mockPathname = "/jobs";
    const { container: containerJobs } = render(
      <AuthProvider>
        <Sidebar isOpen={true} />
      </AuthProvider>
    );
    const dashboardLink1 = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink1?.querySelector(".bg-\\[\\#0F172A\\]")).toBeNull();

    cleanup();

    // 2. On /me/applications -> Applications is active, NOT Dashboard
    mockPathname = "/me/applications";
    render(
      <AuthProvider>
        <Sidebar isOpen={true} />
      </AuthProvider>
    );
    const dashboardLink2 = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink2?.querySelector(".bg-\\[\\#0F172A\\]")).toBeNull();
    const appLink = screen.getByText("Applications").closest("a");
    expect(appLink?.querySelector(".bg-\\[\\#0F172A\\]")).not.toBeNull();

    cleanup();

    // 3. On /app/jobs/job-1 -> Candidates is active, NOT Dashboard
    mockPathname = "/app/jobs/job-1";
    render(
      <AuthProvider>
        <Sidebar isOpen={true} />
      </AuthProvider>
    );
    const dashboardLink3 = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink3?.querySelector(".bg-\\[\\#0F172A\\]")).toBeNull();
    const candLink = screen.getByText("Candidates").closest("a");
    expect(candLink?.querySelector(".bg-\\[\\#0F172A\\]")).not.toBeNull();
  });
});

describe("Hero Section Changes", () => {
  it("does not render the Job Search Bar in Hero section while preserving other elements", async () => {
    const HomePage = (await import("@/app/page")).default;
    render(
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    );

    // Job search bar inputs & button removed
    expect(screen.queryByPlaceholderText("Job title, keywords, or skills...")).toBeNull();
    expect(screen.queryByPlaceholderText("Location or 'Remote'")).toBeNull();
    expect(screen.queryByRole("button", { name: /search jobs/i })).toBeNull();

    // Preserved Hero content
    expect(screen.getByText(/AI-Powered Matching/i)).toBeDefined();
    expect(screen.getByText(/Bridging Ambitious Talent/i)).toBeDefined();
    expect(screen.getByText(/Discover verified tech opportunities/i)).toBeDefined();
    expect(screen.getByText("Popular:")).toBeDefined();
    expect(screen.getByText("Active Tech Jobs")).toBeDefined();
  });
});

