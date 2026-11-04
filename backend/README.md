# TalentBridge Backend API

Modular NestJS backend for the **TalentBridge** Two-Sided Hiring Platform & Applicant Tracking System (ATS).

## 🚀 Key Architectural Highlights

* **Framework**: NestJS 10 + TypeScript with strict modular boundaries.
* **REST API**: All endpoints exposed under `/api/v1`.
* **Database**: MongoDB integration via `@nestjs/mongoose` with single source-of-truth Mongoose schemas.
* **Authentication & Authorization**:
  * Dual-registration flows for **Candidates** and **Employers** (creates tenant company + admin user).
  * JWT access tokens with short-lived expiry (15m).
  * Opaque, hashed refresh tokens with **family-based reuse detection & automatic rotation**.
  * Role-based access control (`CANDIDATE`, `RECRUITER`, `HIRING_MANAGER`, `COMPANY_ADMIN`, `SUPER_ADMIN`).
  * Strict tenant isolation for employer resources and user-ownership checks for candidates.
* **ATS Pipeline & Business Rules**:
  * **Database-backed uniqueness strategy**: Guaranteed one application per candidate per job via compound unique index `{ jobId: 1, candidateId: 1 }`.
  * **Optimistic concurrency control**: Application stage updates require matching `version` to eliminate race conditions.
  * **Audit & History**: Application stage transitions atomically create immutable `ApplicationStageHistory` records capturing actor, timestamp, previous stage, and reason.
  * Per-job customized stage copies cloned from tenant pipeline templates.
* **Explainable AI Adapter**:
  * Safe degradation: If `AI_PROVIDER_KEY` is omitted, API returns clean `{ status: "unavailable" }` responses rather than fake output.
  * Explainable match scoring (`/matching/explain`) with full skill-gap breakdown; AI scores never auto-reject candidates.
* **Documentation & Contracts**:
  * Live Swagger UI at `/docs` and `/api/v1/docs`.
  * Generated, version-controlled OpenAPI 3.0 specification at `docs/openapi.json` and `docs/openapi.yaml`.

---

## 📂 Modular Structure

```
backend/
├── docs/                       # Published OpenAPI specifications
│   ├── openapi.json
│   └── openapi.yaml
├── src/
│   ├── common/                 # Guards, decorators, filters, interceptors, enums
│   │   ├── constants/roles.enum.ts
│   │   ├── decorators/
│   │   ├── guards/             # JwtAuthGuard, RolesGuard
│   │   ├── filters/            # AllExceptionsFilter
│   │   └── interceptors/       # LoggingInterceptor
│   ├── database/               # Shared Mongoose database module & authoritative schemas
│   │   ├── database.module.ts
│   │   └── schemas/            # User, Session, Tenant, Job, Application, etc.
│   ├── modules/
│   │   ├── auth/               # Candidate/Employer registration, login, refresh, password reset
│   │   ├── users/              # User management & profile lookup
│   │   ├── tenants/            # Companies, branding, team member management & invites
│   │   ├── candidates/         # /me/profile, skills, experience, education, visibility
│   │   ├── resumes/            # Resume registration, parsing, file presign
│   │   ├── jobs/               # Public job search & employer ATS requisitions
│   │   ├── saved-jobs/         # Candidate saved jobs & search alerts
│   │   ├── applications/       # Candidate apply flow & employer Kanban stage transitions
│   │   ├── pipelines/          # Pipeline templates, custom stages, stage reordering
│   │   ├── ai/                 # AI recommendations, JD generator, bias checker, match explainer
│   │   ├── notifications/      # Real-time alerts & channel preferences
│   │   ├── interviews/         # Interview scheduling, scorecards, timed assessments
│   │   └── reports/            # Funnel conversion, sourcing analytics, time-to-hire, audit logs
│   ├── app.module.ts
│   └── main.ts
└── test/                       # Unit and Supertest integration tests
```

---

## 🛠️ Setup & Running

### Prerequisites
* **Node.js**: v18+ (tested on Node v20 & v24)
* **MongoDB**: v6.0+ (local instance or MongoDB Atlas)

### 1. Installation
Navigate into the `backend/` directory:
```bash
cd backend
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `MONGODB_URI` points to your MongoDB instance:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/talentbridge
JWT_ACCESS_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
PORT=3001
```

### 3. Start Development Server
```bash
npm run start:dev
```
* **API Base URL**: `http://localhost:3001/api/v1`
* **Swagger Documentation**: `http://localhost:3001/docs`

---

## 🧪 Testing

Run unit tests (Auth, Job Applications, Stage Transitions, Roles Guard):
```bash
npm test
```

Run Supertest E2E integration tests:
```bash
npm run test:e2e
```

Run TypeScript compilation check:
```bash
npm run lint
```

---

## 📋 Core API Endpoints

### Auth (`/api/v1/auth`)
| Method | Endpoint | Description | Auth | Roles |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register/candidate` | Register candidate account & initialize profile | No | Public |
| `POST` | `/auth/register/employer` | Register employer, company tenant & default pipeline | No | Public |
| `POST` | `/auth/login` | Email/password login, returns access + refresh tokens | No | Public |
| `POST` | `/auth/refresh` | Refresh token rotation with reuse detection | Cookie/Body | Any |
| `POST` | `/auth/logout` | Revoke active session | Yes | Any |
| `POST` | `/auth/forgot-password` | Send password reset email (generic response) | No | Public |
| `POST` | `/auth/reset-password` | Reset password using verified token | No | Public |

### Candidate Portal (`/api/v1/me`)
| Method | Endpoint | Description | Auth | Roles |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/me/profile` | Get logged-in candidate profile | Yes | `CANDIDATE` |
| `PATCH` | `/me/profile` | Update candidate headline, summary, location | Yes | `CANDIDATE` |
| `POST` | `/me/experiences` | Add experience record | Yes | `CANDIDATE` |
| `DELETE` | `/me/experiences/:id` | Remove experience record | Yes | `CANDIDATE` |
| `POST` | `/me/educations` | Add education credential | Yes | `CANDIDATE` |
| `PUT` | `/me/skills` | Replace/update skills list | Yes | `CANDIDATE` |
| `PATCH` | `/me/preferences` | Update job search preferences & salary expectations | Yes | `CANDIDATE` |
| `GET` | `/me/resumes` | List uploaded resumes | Yes | `CANDIDATE` |
| `POST` | `/me/resumes` | Register uploaded resume | Yes | `CANDIDATE` |
| `POST` | `/me/resumes/:id/parse` | Trigger AI resume parsing | Yes | `CANDIDATE` |
| `POST` | `/me/resumes/:id/apply-parsed` | Merge parsed resume fields into profile | Yes | `CANDIDATE` |
| `GET` | `/me/applications` | List candidate submitted applications | Yes | `CANDIDATE` |
| `POST` | `/me/applications/:id/withdraw` | Withdraw active application | Yes | `CANDIDATE` |
| `GET` | `/me/saved-jobs` | List saved jobs | Yes | `CANDIDATE` |
| `POST` | `/me/saved-jobs/:jobId` | Save job to favorites (enforces uniqueness) | Yes | `CANDIDATE` |
| `GET` | `/me/recommended-jobs` | Get AI recommended jobs based on skills fit | Yes | `CANDIDATE` |

### Public Job Board (`/api/v1`)
| Method | Endpoint | Description | Auth | Roles |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/jobs` | Search & filter published jobs (title, skills, remote, salary) | No | Public |
| `GET` | `/jobs/:slug` | View public job details by unique slug | No | Public |
| `POST` | `/jobs/:id/apply` | Candidate applies for job (one application per job enforced) | Yes | `CANDIDATE` |
| `GET` | `/companies` | Public directory of verified companies | No | Public |
| `GET` | `/companies/:slug` | Public company profile & active job listings | No | Public |

### Employer ATS (`/api/v1/app`)
| Method | Endpoint | Description | Auth | Roles |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/app/jobs` | List company job requisitions (Open, Draft, Paused, Closed) | Yes | `REC, HM, CA` |
| `POST` | `/app/jobs` | Create new job draft & clone pipeline stages | Yes | `REC, CA` |
| `GET` | `/app/jobs/:id` | Get internal job details & hiring team | Yes | `REC, HM, INT, CA` |
| `POST` | `/app/jobs/:id/publish` | Publish job to public board | Yes | `REC, CA` |
| `GET` | `/app/jobs/:id/applications` | Get candidate cards grouped by stage (Kanban) | Yes | `REC, HM, CA` |
| `GET` | `/app/applications/:id` | Application 360 view (timeline, resume, scores) | Yes | `REC, HM, INT, CA` |
| `PATCH` | `/app/applications/:id/stage` | Move stage (optimistic versioning + history logging) | Yes | `REC, HM, CA` |
| `POST` | `/app/applications/:id/reject` | Reject application with documented reason | Yes | `REC, HM, CA` |
| `POST` | `/app/applications/:id/hire` | Mark candidate as hired | Yes | `REC, CA` |
| `GET` | `/app/interviews` | List scheduled interviews | Yes | `REC, HM, INT, CA` |
| `POST` | `/app/interviews/:id/scorecards` | Submit interview scorecard evaluation | Yes | `REC, HM, INT, CA` |
| `GET` | `/app/reports/funnel` | Stage conversion funnel analytics | Yes | `REC, HM, CA` |
| `GET` | `/audit-logs` | Append-only audit trail for compliance | Yes | `CA, SA` |

---

## 🔒 Security & Data Integrity

1. **Password Security**: Salted bcrypt hashing with generic password-reset responses to prevent enumeration attacks.
2. **Token Security**: Tokens are excluded from ordinary responses; refresh tokens are stored hashed and rotated upon every use.
3. **Optimistic Locking**: Prevents simultaneous overwrites during collaborative ATS Kanban movements.
4. **Tenant Isolation**: Every employer query is filtered by `tenantId` extracted securely from validated JWT payload.
