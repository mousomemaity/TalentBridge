"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Footer } from "@/components/footer";

interface NavigationShellProps {
  children: React.ReactNode;
}

export function NavigationShell({ children }: NavigationShellProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* 1. TOP NAVBAR (Sticky at top, spans full width) */}
      <Navbar
        onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        isSidebarOpen={mobileSidebarOpen}
      />

      <div className="flex-1 flex min-w-0 relative">
        {/* 2. LEFT SIDEBAR (Fixed vertical sidebar on desktop, responsive drawer on mobile/tablet) */}
        <Sidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* 3. MAIN APPLICATION CONTENT AREA */}
        <div className="flex-1 flex flex-col md:pl-64 min-w-0 w-full transition-all duration-200">
          <main className="flex-1 min-w-0 w-full">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}

