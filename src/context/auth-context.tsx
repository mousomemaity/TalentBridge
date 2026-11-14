"use client";

import { User, UserRole } from "@/types";
import React, { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

interface BackendLoginResponse {
  user: {
    id: string;
    email: string;
    role: string;
    firstName?: string;
    lastName?: string;
    tenantId?: string;
    candidateId?: string;
    avatarUrl?: string;
    status?: string;
  };
  accessToken: string;
  refreshToken?: string;
}


interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isCandidate: boolean;
  isEmployer: boolean;
  isAdmin: boolean;

  login: (
    email: string,
    password: string,
    allowedRoles?: UserRole[]
  ) => Promise<User>;

  registerCandidate: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<User>;

  registerEmployer: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    companyName: string;
    domain?: string;
  }) => Promise<User>;

  logout: () => void;

  switchRole: (role: "candidate" | "employer" | "admin") => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapBackendRole(role?: string): UserRole {
  if (!role) return "CAN";
  const normalized = role.toUpperCase();
  const roleMap: Record<string, UserRole> = {
    CANDIDATE: "CAN",
    RECRUITER: "REC",
    HIRING_MANAGER: "HM",
    INTERVIEWER: "INT",
    COMPANY_ADMIN: "CA",
    SUPER_ADMIN: "SA",
    PUBLIC: "PUB",
    CAN: "CAN",
    REC: "REC",
    HM: "HM",
    INT: "INT",
    CA: "CA",
    SA: "SA",
    PUB: "PUB",
  };
  return roleMap[normalized] || "CAN";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated session after hydration if available
  useEffect(() => {
    try {
      const isLoggedOut =
        localStorage.getItem("jobpilot_logged_out") === "true" ||
        localStorage.getItem("talentbridge_logged_out") === "true";

      if (isLoggedOut) {
        setUser(null);
        setToken(null);
        setIsLoading(false);
        return;
      }

      const savedToken =
        localStorage.getItem("jobpilot_token") ||
        localStorage.getItem("talentbridge_token");

      const savedUser =
        localStorage.getItem("jobpilot_user") ||
        localStorage.getItem("talentbridge_user");

      if (savedToken) {
        setToken(savedToken);
      }

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser) as User);
        } catch {
          localStorage.removeItem("jobpilot_user");
          localStorage.removeItem("talentbridge_user");
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    allowedRoles?: UserRole[]
  ): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = Array.isArray(result?.message)
        ? result.message.join(", ")
        : result?.message || "Invalid email or password. Please try again.";
      throw new Error(message);
    }

    const data = result as BackendLoginResponse;
    if (!data.accessToken || !data.user) {
      throw new Error("Invalid response received from authentication server.");
    }

    const mappedRole = mapBackendRole(data.user.role);

    // Enforce role verification for role-specific portals
    if (allowedRoles && !allowedRoles.includes(mappedRole)) {
      if (allowedRoles.includes("SA")) {
        throw new Error(
          "Access Denied: This portal requires verified Super Admin clearance. Candidates and employers must sign in through their respective portals."
        );
      }
      if (allowedRoles.includes("CAN")) {
        throw new Error(
          "Access Denied: This portal is for Job Seekers (Candidates) only. Please sign in through the Employer or Admin Portal."
        );
      }
      if (allowedRoles.includes("REC")) {
        throw new Error(
          "Access Denied: This portal is reserved for Recruiters and Hiring Teams. Candidates should sign in via the Candidate Portal."
        );
      }
      throw new Error(
        "Access Denied: Your account role does not have permission to access this portal."
      );
    }

    const fullName = [data.user.firstName, data.user.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();
    const name = fullName || data.user.email.split("@")[0] || "User";

    const activeUser: User = {
      id: data.user.id,
      email: data.user.email,
      name,
      role: mappedRole,
      avatarUrl: data.user.avatarUrl || "",
      tenantId: data.user.tenantId,
      candidateId: data.user.candidateId,
    };

    setUser(activeUser);
    setToken(data.accessToken);

    // Clear logged-out flags
    localStorage.removeItem("jobpilot_logged_out");
    localStorage.removeItem("talentbridge_logged_out");

    // Save tokens and user data in localStorage
    localStorage.setItem("jobpilot_token", data.accessToken);
    localStorage.setItem("talentbridge_token", data.accessToken);
    localStorage.setItem("jobpilot_user", JSON.stringify(activeUser));
    localStorage.setItem("talentbridge_user", JSON.stringify(activeUser));

    const roleKey =
      mappedRole === "CAN" ? "candidate" : mappedRole === "SA" ? "admin" : "employer";
    localStorage.setItem("jobpilot_role", roleKey);
    localStorage.setItem("talentbridge_role", roleKey);

    if (data.refreshToken) {
      localStorage.setItem("jobpilot_refresh_token", data.refreshToken);
      localStorage.setItem("talentbridge_refresh_token", data.refreshToken);
    }

    return activeUser;
  };

  const registerCandidate = async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/register/candidate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        email: payload.email.trim(),
        password: payload.password,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = Array.isArray(result?.message)
        ? result.message.join(", ")
        : result?.message || "Candidate registration failed.";
      throw new Error(message);
    }

    const data = result as BackendLoginResponse;

    if (!data.accessToken || !data.user) {
      throw new Error("Invalid response received from authentication server.");
    }

    const mappedRole = mapBackendRole(data.user.role);
    const fullName = [data.user.firstName, data.user.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    const activeUser: User = {
      id: data.user.id,
      email: data.user.email,
      name: fullName || data.user.email.split("@")[0] || "User",
      role: mappedRole,
      avatarUrl: data.user.avatarUrl || "",
      tenantId: data.user.tenantId,
      candidateId: data.user.candidateId,
    };

    setUser(activeUser);
    setToken(data.accessToken);

    localStorage.removeItem("jobpilot_logged_out");
    localStorage.removeItem("talentbridge_logged_out");

    localStorage.setItem("jobpilot_token", data.accessToken);
    localStorage.setItem("talentbridge_token", data.accessToken);
    localStorage.setItem("jobpilot_user", JSON.stringify(activeUser));
    localStorage.setItem("talentbridge_user", JSON.stringify(activeUser));

    localStorage.setItem("jobpilot_role", "candidate");
    localStorage.setItem("talentbridge_role", "candidate");

    if (data.refreshToken) {
      localStorage.setItem("jobpilot_refresh_token", data.refreshToken);
      localStorage.setItem("talentbridge_refresh_token", data.refreshToken);
    }

    return activeUser;
  };
  const registerEmployer = async (payload: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    companyName: string;
    domain?: string;
  }): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/register/employer`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstName: payload.firstName.trim(),
        lastName: payload.lastName.trim(),
        email: payload.email.trim(),
        password: payload.password,
        companyName: payload.companyName.trim(),
        domain: payload.domain,
      }),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message = Array.isArray(result?.message)
        ? result.message.join(", ")
        : result?.message || "Employer registration failed.";
      throw new Error(message);
    }

    const data = result as BackendLoginResponse;

    if (!data.accessToken || !data.user) {
      throw new Error("Invalid response received from authentication server.");
    }

    const mappedRole = mapBackendRole(data.user.role);
    const fullName = [data.user.firstName, data.user.lastName]
      .filter(Boolean)
      .join(" ")
      .trim();

    const activeUser: User = {
      id: data.user.id,
      email: data.user.email,
      name: fullName || data.user.email.split("@")[0] || "User",
      role: mappedRole,
      avatarUrl: data.user.avatarUrl || "",
      tenantId: data.user.tenantId,
      candidateId: data.user.candidateId,
    };

    setUser(activeUser);
    setToken(data.accessToken);

    localStorage.removeItem("jobpilot_logged_out");
    localStorage.removeItem("talentbridge_logged_out");

    localStorage.setItem("jobpilot_token", data.accessToken);
    localStorage.setItem("talentbridge_token", data.accessToken);
    localStorage.setItem("jobpilot_user", JSON.stringify(activeUser));
    localStorage.setItem("talentbridge_user", JSON.stringify(activeUser));

    localStorage.setItem("jobpilot_role", "employer");
    localStorage.setItem("talentbridge_role", "employer");

    if (data.refreshToken) {
      localStorage.setItem("jobpilot_refresh_token", data.refreshToken);
      localStorage.setItem("talentbridge_refresh_token", data.refreshToken);
    }

    return activeUser;
  };
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.setItem("jobpilot_logged_out", "true");
    localStorage.setItem("talentbridge_logged_out", "true");
    localStorage.removeItem("jobpilot_token");
    localStorage.removeItem("jobpilot_role");
    localStorage.removeItem("jobpilot_user");
    localStorage.removeItem("jobpilot_refresh_token");
    localStorage.removeItem("talentbridge_token");
    localStorage.removeItem("talentbridge_role");
    localStorage.removeItem("talentbridge_user");
    localStorage.removeItem("talentbridge_refresh_token");
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
  };

  const switchRole = (role: "candidate" | "employer" | "admin") => {
    console.warn(
      `Role switching is disabled for real accounts. Please log in with a ${role} account.`
    );
  };

  const isCandidate = user?.role === "CAN";
  const isEmployer = ["REC", "HM", "INT", "CA"].includes(user?.role || "");
  const isAdmin = user?.role === "SA";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isLoading,
        isCandidate,
        isEmployer,
        isAdmin,
        login,
        registerCandidate,
        registerEmployer,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
