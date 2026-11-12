"use client";

import { User } from "@/types";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isCandidate: boolean;
  isEmployer: boolean;
  isAdmin: boolean;
  login: (role?: "candidate" | "employer" | "admin") => Promise<void>;
  logout: () => void;
  switchRole: (role: "candidate" | "employer" | "admin") => void;
}

const CANDIDATE_USER: User = {
  id: "user-cand-1",
  email: "alex.rivera@example.com",
  name: "Alex Rivera",
  role: "CAN",
  candidateId: "cand-1",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
};

const EMPLOYER_USER: User = {
  id: "user-rec-1",
  email: "sarah.jenkins@nexusai.com",
  name: "Sarah Jenkins",
  role: "REC",
  tenantId: "comp-1",
  avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80",
};

const ADMIN_USER: User = {
  id: "user-admin-1",
  email: "admin@talentbridge.com",
  name: "Sarah Jenkins",
  role: "SA",
  tenantId: "comp-1",
  avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to candidate user for pleasant out-of-the-box experience & deterministic SSR
  const [user, setUser] = useState<User | null>(CANDIDATE_USER);
  const [token, setToken] = useState<string | null>("mock_jwt_token_jobpilot");

  // Load authenticated user and role data consistently after hydration
  useEffect(() => {
    const isLoggedOut = localStorage.getItem("talentbridge_logged_out") === "true";
    if (isLoggedOut) {
      setUser(null);
      setToken(null);
      return;
    }

    const savedRole = localStorage.getItem("talentbridge_role") || localStorage.getItem("jobpilot_role");
    if (savedRole === "admin") {
      setUser(ADMIN_USER);
    } else if (savedRole === "employer") {
      setUser(EMPLOYER_USER);
    } else if (savedRole === "candidate") {
      setUser(CANDIDATE_USER);
    }

    const savedToken = localStorage.getItem("talentbridge_token") || localStorage.getItem("jobpilot_token");
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const login = async (role: "candidate" | "employer" | "admin" = "candidate") => {
    const activeUser = role === "admin" ? ADMIN_USER : role === "employer" ? EMPLOYER_USER : CANDIDATE_USER;
    const mockToken = `jwt_${role}_${Date.now()}`;
    setUser(activeUser);
    setToken(mockToken);
    localStorage.removeItem("talentbridge_logged_out");
    localStorage.setItem("jobpilot_token", mockToken);
    localStorage.setItem("jobpilot_role", role);
    localStorage.setItem("talentbridge_token", mockToken);
    localStorage.setItem("talentbridge_role", role);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.setItem("talentbridge_logged_out", "true");
    localStorage.removeItem("jobpilot_token");
    localStorage.removeItem("jobpilot_role");
    localStorage.removeItem("talentbridge_token");
    localStorage.removeItem("talentbridge_role");
  };

  const switchRole = (role: "candidate" | "employer" | "admin") => {
    login(role);
  };

  const isCandidate = user?.role === "CAN";
  const isEmployer = ["REC", "HM", "INT", "CA"].includes(user?.role || "");
  const isAdmin = user?.role === "SA" || user?.role === "CA";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isCandidate,
        isEmployer,
        isAdmin,
        login,
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
