# TalentBridge — Job Portal & Applicant Tracking System (ATS)

A modern, production-grade two-sided hiring platform built with **Next.js App Router**, **TypeScript**, **Tailwind CSS**, and **shadcn/ui**. It combines a public job board and candidate experience with an end-to-end Applicant Tracking System (ATS) for recruiters and hiring managers.

---

## 🚀 Technology Stack

* **Framework**: Next.js 16 (App Router, Turbopack, React 19)
* **Styling**: Tailwind CSS, PostCSS, Radix UI primitives
* **State & Data Caching**: TanStack Query (React Query v5)
* **Kanban Drag & Drop**: `@dnd-kit/core`, `@dnd-kit/sortable`
* **Data Visualization**: Recharts (Hiring conversion funnel)
* **Icons**: Lucide React
* **Forms & Validation**: React Hook Form & Zod
* **Type Safety**: Strict TypeScript 5 with comprehensive DTO schemas

---

## 📁 Application Architecture & Routes

```
src/
├── app/
│   ├── layout.tsx                # Root layout with Providers, Navbar & Footer
│   ├── page.tsx                  # Public Homepage (Hero search, categories, featured jobs)
│   ├── jobs/
│   │   ├── page.tsx              # Job Search (Filters, salary slider, sorting, pagination)
│   │   └── [slug]/page.tsx       # Job Details (Requirements, AI match analysis, Apply modal)
│   ├── companies/
│   │   ├── page.tsx              # Public Companies Directory
│   │   └── [slug]/page.tsx       # Company Profile (Overview, Open roles, Culture tabs)
│   ├── (auth)/
│   │   ├── login/page.tsx        # Persona-based login (Candidate & Employer 1-click presets)
│   │   ├── register/
│   │   │   ├── candidate/page.tsx# 2-step registration with AI resume parsing preview
│   │   │   └── employer/page.tsx # Company & hiring team registration
│   │   ├── verify-email/page.tsx # Email confirmation token screen
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── me/                       # Candidate Portal
│   │   ├── layout.tsx            # Candidate sidebar navigation & profile completion badge
│   │   ├── dashboard/page.tsx    # Completeness meter, recommendations, application milestones
│   │   ├── profile/page.tsx      # Personal details, skills matrix with proficiency, experience
│   │   ├── resume/page.tsx       # Resume uploads, default selection, AI parsed review dialog
│   │   ├── applications/page.tsx # Status tracking, timeline, withdrawal flow
│   │   ├── saved-jobs/page.tsx   # Bookmarked jobs
│   │   ├── job-alerts/page.tsx   # Automated search alerts (daily/weekly digest)
│   │   ├── interviews/page.tsx   # Video interview rounds, reschedule request modal
│   │   ├── assessments/page.tsx  # Skill tests with countdown & sample test runner
│   │   ├── offers/page.tsx       # Offer package preview, accept & decline action
│   │   └── settings/page.tsx     # Security, MFA, notifications, GDPR data export
│   └── app/                      # Employer ATS
│       ├── layout.tsx            # Employer organization sidebar & plan status
│       ├── dashboard/page.tsx    # ATS KPIs, Recharts hiring conversion funnel, recent activity
│       ├── jobs/
│       │   ├── page.tsx          # Requisitions list (Open, Draft, Closed tabs)
│       │   ├── new/page.tsx      # Multi-step job wizard with AI JD generation
│       │   └── [id]/page.tsx     # 7-stage dnd-kit Kanban ATS, Candidate 360 Drawer, Roster table
│       └── settings/page.tsx     # Tenant branding, career site domain, hiring team roles
├── components/
│   ├── ui/                       # Reusable primitives (Button, Card, Badge, Dialog, Input)
│   ├── navbar.tsx                # Responsive navigation with persona switcher
│   ├── footer.tsx                # Categorized footer with compliance badges
│   └── providers.tsx             # TanStack QueryClientProvider & AuthProvider
├── context/
│   └── auth-context.tsx          # Role-based auth state (CAN, REC, HM, CA)
├── lib/
│   ├── api-client.ts             # Typed API client with JWT headers & mock adapter fallback
│   ├── mock-data.ts              # Master mock data matching Section 6 & 7 specifications
│   └── utils.ts                  # Class merge (cn), currency and date formatters
└── types/
    └── index.ts                  # Complete TypeScript domain contracts (Job, Application, etc.)
```

---

## 🛠️ Getting Started

### 1. Prerequisites
* **Node.js**: v18.17+ (v20+ recommended)
* **npm**: v9+

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure your backend API URL (defaults to `/api/v1`):
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔍 Validation & Verification Commands

```bash
# Typecheck
npx tsc --noEmit

# Production Build
npm run build

# Linting
npm run lint
```

---

## 🤝 Backend API Coordination (`/api/v1`)

The frontend strictly implements the shared API contract specified in the project architecture:
* **Public**: `GET /jobs`, `GET /jobs/:slug`, `GET /companies`, `GET /companies/:slug`
* **Auth**: `POST /auth/login`, `POST /auth/register/candidate`, `POST /auth/register/employer`
* **Candidate**: `GET /me/profile`, `PATCH /me/profile`, `GET /me/applications`, `POST /me/applications/:id/withdraw`
* **Employer ATS**: `GET /app/dashboard/metrics`, `GET /app/jobs`, `POST /app/jobs`, `PATCH /app/applications/:id/stage`

When the backend API is running locally, requests seamlessly resolve to the live server. When running standalone, a built-in mock adapter handles requests to ensure the application remains completely testable and functional.
