import { Navbar } from "@/components/navbar";
import { AuthProvider, useAuth } from "@/context/auth-context";
import { render } from "@testing-library/react";
import { renderToString as reactDomServerRenderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/app/dashboard",
  useSearchParams: () => new URLSearchParams(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

describe("SSR and Hydration Consistency for Auth & User Profile", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("produces deterministic initial output matching server render even when localStorage has a different role", async () => {
    // 1. Simulate server-side render
    const serverHtml = reactDomServerRenderToString(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    // Verify server HTML contains initial deterministic user data (Alex Rivera, Candidate)
    expect(serverHtml).toContain("Alex Rivera");
    expect(serverHtml).toContain("Candidate");

    // 2. Simulate client with saved employer role in localStorage
    localStorage.setItem("talentbridge_role", "employer");
    localStorage.setItem("talentbridge_token", "jwt_employer_test");

    // Test a helper component that captures the initial synchronous render value
    let initialRenderUser: string | undefined;
    function UserCapture() {
      const { user } = useAuth();
      if (!initialRenderUser) {
        initialRenderUser = user?.name;
      }
      return <div>{user?.name}</div>;
    }

    const { findAllByText, findByText } = render(
      <AuthProvider>
        <UserCapture />
        <Navbar />
      </AuthProvider>
    );

    // The initial synchronous render MUST match server render (Alex Rivera)
    expect(initialRenderUser).toBe("Alex Rivera");

    // After hydration effects run, it should transition consistently to Sarah Jenkins
    const employerProfiles = await findAllByText("Sarah Jenkins");
    expect(employerProfiles.length).toBeGreaterThan(0);

    const recruiterRole = await findByText("Recruiter");
    expect(recruiterRole).toBeDefined();
  });

  it("loads admin user consistently after hydration when admin role is saved in localStorage", async () => {
    localStorage.setItem("talentbridge_role", "admin");

    const { findByText } = render(
      <AuthProvider>
        <Navbar />
      </AuthProvider>
    );

    // After hydration effect loads the admin role
    const adminUser = await findByText("Sarah Jenkins");
    expect(adminUser).toBeDefined();

    const adminRole = await findByText("Admin");
    expect(adminRole).toBeDefined();
  });
});
