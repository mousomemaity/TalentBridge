"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isCandidate: boolean;
  isEmployer: boolean;
  login: (role?: "candidate" | "employer") => Promise<void>;
  logout: () => void;
  switchRole: (role: "candidate" | "employer") => void;
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Default to candidate user for pleasant out-of-the-box experience
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return CANDIDATE_USER;
    const savedRole = localStorage.getItem("talentbridge_role");
    return savedRole === "employer" ? EMPLOYER_USER : CANDIDATE_USER;
  });
  const [token, setToken] = useState<string | null>("mock_jwt_token_talentbridge");

  const login = async (role: "candidate" | "employer" = "candidate") => {
    const activeUser = role === "employer" ? EMPLOYER_USER : CANDIDATE_USER;
    const mockToken = `jwt_${role}_${Date.now()}`;
    setUser(activeUser);
    setToken(mockToken);
    localStorage.setItem("talentbridge_token", mockToken);
    localStorage.setItem("talentbridge_role", role);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("talentbridge_token");
    localStorage.removeItem("talentbridge_role");
  };

  const switchRole = (role: "candidate" | "employer") => {
    login(role);
  };

  const isCandidate = user?.role === "CAN";
  const isEmployer = ["REC", "HM", "INT", "CA"].includes(user?.role || "");

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isCandidate,
        isEmployer,
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
