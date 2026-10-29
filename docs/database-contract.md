# TalentBridge — Shared Database Contract & Mongoose Specification

This document defines the authoritative database schemas, fields, enums, relationships, indexes, and security policies for **TalentBridge**.

All branches (`feature/frontend`, `feature/backend`, `feature/database`, `feature/ai`) must conform to the models and identifiers documented here. Do not rename fields, alter enums, or modify types without coordinating across teams.

---

## 1. Connection & Deployment Configuration

### Environment Variable Contract
The application connects to MongoDB using the `MONGODB_URI` environment variable.

```env
# Local MongoDB (Standalone or Replica Set)
MONGODB_URI=mongodb://localhost:27017/talentbridge

# MongoDB Atlas (Production / Staging)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/talentbridge?retryWrites=true&w=majority
```

### Replica Set Requirement for Transactions
- **Multi-document ACID transactions** in MongoDB require a replica set.
- **Local Development**: When testing transactions locally, run MongoDB as a single-node replica set (`mongod --replSet rs0`).
- **Atlas**: Replica sets are enabled by default on all Atlas clusters (free tier M0 and dedicated tiers).

---

## 2. Enums & Domain Constants

All enums are defined in `@talentbridge/database` (`database/src/enums/index.ts`):

```typescript
export enum UserRole {
  CANDIDATE = 'CANDIDATE',
  EMPLOYER = 'EMPLOYER',
  ADMIN = 'ADMIN',
}

export enum AccountStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DEACTIVATED = 'DEACTIVATED',
}

export enum CompanyMemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  RECRUITER = 'RECRUITER',
  HIRING_MANAGER = 'HIRING_MANAGER',
  MEMBER = 'MEMBER',
}

export enum MembershipStatus {
  INVITED = 'INVITED',
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum ResumeParseStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  PARSED = 'PARSED',
  FAILED = 'FAILED',
}

export enum JobAlertFrequency {
  INSTANT = 'INSTANT',
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
}

export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  TEMPORARY = 'TEMPORARY',
}

export enum RemoteType {
  ON_SITE = 'ON_SITE',
  HYBRID = 'HYBRID',
  REMOTE = 'REMOTE',
}

export enum JobStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED',
}

export enum PipelineStageCategory {
  SOURCED = 'SOURCED',
  APPLIED = 'APPLIED',
  SCREENING = 'SCREENING',
  INTERVIEW = 'INTERVIEW',
  ASSESSMENT = 'ASSESSMENT',
  OFFER = 'OFFER',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
}

export enum ApplicationStatus {
  SUBMITTED = 'SUBMITTED',
  IN_REVIEW = 'IN_REVIEW',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEWING = 'INTERVIEWING',
  OFFERED = 'OFFERED',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export enum NotificationType {
  APPLICATION_RECEIVED = 'APPLICATION_RECEIVED',
  STAGE_CHANGED = 'STAGE_CHANGED',
  JOB_ALERT_MATCH = 'JOB_ALERT_MATCH',
  MESSAGE_RECEIVED = 'MESSAGE_RECEIVED',
  SYSTEM = 'SYSTEM',
}
```

---

## 3. Mongoose Schemas & Field Contracts

### 3.1. Identity & Organization

#### `User` (Collection: `users`)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Unique user ID |
| `email` | `String` | Yes | Lowercase, trimmed, unique normalized email |
| `passwordHash`| `String` | Yes | `select: false`. Stripped from JSON outputs |
| `role` | `UserRole` | Yes | `CANDIDATE`, `EMPLOYER`, `ADMIN` (default: `CANDIDATE`) |
| `accountStatus`| `AccountStatus`| Yes | `PENDING`, `ACTIVE`, `SUSPENDED`, `DEACTIVATED` |
| `lastLoginAt` | `Date` | No | Timestamp of most recent login |
| `createdAt` | `Date` | Auto | Creation timestamp |
| `updatedAt` | `Date` | Auto | Last update timestamp |

**Indexes:**
- `{ email: 1 }` (unique)
- `{ role: 1, accountStatus: 1 }`

---

#### `Company` (Collection: `companies`)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Company identifier |
| `name` | `String` | Yes | Trimmed company name |
| `slug` | `String` | Yes | Lowercase URL-safe unique slug |
| `description` | `String` | No | Company overview |
| `logo` | `String` | No | Public CDN or storage URL |
| `industry` | `String` | Yes | Business industry categorization |
| `settings` | Subdocument | Yes | Website, size, autoRejectBelowMatchScore |
| `createdAt` / `updatedAt` | `Date` | Auto | Timestamps |

**Indexes:**
- `{ slug: 1 }` (unique)
- `{ industry: 1, createdAt: -1 }`

---

#### `CompanyMember` (Collection: `company_members`)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Membership record ID |
| `user` | `ObjectId (User)`| Yes | User reference |
| `company` | `ObjectId (Company)`| Yes | Company reference |
| `role` | `CompanyMemberRole`| Yes | `OWNER`, `ADMIN`, `RECRUITER`, `HIRING_MANAGER`, `MEMBER` |
| `membershipStatus`| `MembershipStatus`| Yes | `INVITED`, `ACTIVE`, `INACTIVE` |

**Indexes:**
- `{ company: 1, user: 1 }` (unique — enforces single membership per company)
- `{ user: 1, membershipStatus: 1 }`

---

### 3.2. Candidate Domain

#### `CandidateProfile` (Collection: `candidate_profiles`)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Candidate profile ID |
| `user` | `ObjectId (User)`| Yes | One-to-one unique user reference |
| `photo` | `String` | No | Avatar URL |
| `headline` | `String` | No | Candidate headline (e.g., "Senior Fullstack Engineer") |
| `summary` | `String` | No | Professional summary / bio |
| `contactInfo` | Subdocument | Yes | Phone, alternateEmail, LinkedIn, GitHub, portfolioWebsite |
| `location` | Subdocument | Yes | City, state, country, postalCode, isRemote |
| `experience` | Subdocument[] | Yes | Array of work experiences |
| `education` | Subdocument[] | Yes | Array of degrees / institutions |
| `skills` | Subdocument[] | Yes | Array of `{ name, yearsOfExperience, proficiency }` |
| `projects` | Subdocument[] | Yes | Array of portfolio projects |
| `certifications`| Subdocument[] | Yes | Array of professional certifications |
| `languages` | Subdocument[] | Yes | Array of `{ language, proficiency }` |
| `jobPreferences`| Subdocument | Yes | Desired titles, employmentTypes, salary range |

**Indexes:**
- `{ user: 1 }` (unique)
- `{ "skills.name": 1 }`
- `{ "location.country": 1, "location.city": 1 }`

---

#### `Resume` (Collection: `resumes`)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Resume document ID |
| `candidate` | `ObjectId (CandidateProfile)`| Yes | Candidate owner reference |
| `fileName` | `String` | Yes | Uploaded file display name |
| `storageKey` | `String` | Yes | `select: false`. Private secure storage identifier |
| `mimeType` | `String` | Yes | e.g., `application/pdf` |
| `fileSize` | `Number` | Yes | File size in bytes |
| `isDefault` | `Boolean` | Yes | Default resume flag for one-click applications |
| `parseStatus` | `ResumeParseStatus` | Yes | `PENDING`, `PROCESSING`, `PARSED`, `FAILED` |
| `parsedResult`| Subdocument | No | Typed extracted skills, experience, education, raw text |
| `parserVersion`| `String` | Yes | Version of AI/Parser engine |

**Indexes:**
- `{ candidate: 1, isDefault: 1 }`
- `{ candidate: 1, createdAt: -1 }`
- `{ parseStatus: 1 }`

---

#### `SavedJob` (Collection: `saved_jobs`)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Record ID |
| `candidate` | `ObjectId (CandidateProfile)`| Yes | Candidate reference |
| `job` | `ObjectId (Job)` | Yes | Job reference |

**Indexes:**
- `{ candidate: 1, job: 1 }` (unique — prevents duplicate saves)
- `{ candidate: 1, createdAt: -1 }`

---

#### `SavedSearch` / `JobAlert` (Collection: `saved_searches`)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Search alert record ID |
| `candidate` | `ObjectId (CandidateProfile)`| Yes | Candidate owner |
| `keywords` | `String` | No | Search query keywords |
| `location` | `String` | No | Location query |
| `filters` | Subdocument | Yes | Filter criteria (types, remote, salary, skills) |
| `frequency` | `JobAlertFrequency` | Yes | `INSTANT`, `DAILY`, `WEEKLY` |
| `isActive` | `Boolean` | Yes | Alert toggle (default: `true`) |
| `lastNotifiedAt`| `Date` | No | Last alert execution timestamp |

**Indexes:**
- `{ candidate: 1, isActive: 1 }`
- `{ isActive: 1, frequency: 1, lastNotifiedAt: 1 }`

---

### 3.3. Jobs, Pipeline & AI Matching

#### `Job` (Collection: `jobs`)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Job record ID |
| `company` | `ObjectId (Company)` | Yes | Hiring company reference |
| `title` | `String` | Yes | Job posting title |
| `slug` | `String` | Yes | Unique URL-safe slug |
| `description` | `String` | Yes | Full markdown/HTML job description |
| `requirements`| `String[]` | Yes | Bullet requirements |
| `skills` | `String[]` | Yes | Required technical skill tags |
| `salaryRange` | Subdocument | Yes | `{ min, max, currency, period }` (validator: `max >= min`) |
| `location` | Subdocument | Yes | City, state, country, isRemote |
| `employmentType`| `EmploymentType` | Yes | `FULL_TIME`, `PART_TIME`, `CONTRACT`, etc. |
| `remoteType` | `RemoteType` | Yes | `ON_SITE`, `HYBRID`, `REMOTE` |
| `status` | `JobStatus` | Yes | `DRAFT`, `PUBLISHED`, `PAUSED`, `CLOSED`, `ARCHIVED` |
| `publishedAt` | `Date` | No | Publication date |
| `expiresAt` | `Date` | No | Expiration date |

**Indexes:**
- `{ slug: 1 }` (unique)
- `{ status: 1, publishedAt: -1 }`
- `{ company: 1, status: 1, createdAt: -1 }`
- `{ "location.country": 1, "location.city": 1 }`
- `{ remoteType: 1, employmentType: 1, status: 1 }`
- `{ skills: 1, status: 1 }`
- `{ "salaryRange.min": 1, "salaryRange.max": 1 }`

---

#### `PipelineStage` (Collection: `pipeline_stages`)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Stage ID |
| `company` | `ObjectId (Company)` | Yes | Company owning the pipeline |
| `job` | `ObjectId (Job)` | No | Optional job override (null = company default) |
| `name` | `String` | Yes | Stage display name |
| `position` | `Number` | Yes | Order index in Kanban column |
| `category` | `PipelineStageCategory` | Yes | `SOURCED`, `APPLIED`, `SCREENING`, `INTERVIEW`, `OFFER`, etc. |
| `slaDays` | `Number` | Yes | Expected SLA in days (default: 3) |
| `slaHours` | `Number` | Yes | Additional SLA hours |

**Indexes:**
- `{ company: 1, job: 1, position: 1 }`
- `{ company: 1, category: 1 }`

---

#### `Application` (Collection: `applications`)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Application ID |
| `job` | `ObjectId (Job)` | Yes | Applied job reference |
| `candidate` | `ObjectId (CandidateProfile)`| Yes | Candidate reference |
| `selectedResume`| `ObjectId (Resume)` | Yes | Resume used for this application |
| `answers` | Subdocument[] | Yes | Array of `{ questionId, question, answer }` |
| `coverLetter` | `String` | No | Candidate cover letter |
| `currentStage`| `ObjectId (PipelineStage)` | Yes | Current hiring stage |
| `status` | `ApplicationStatus` | Yes | `SUBMITTED`, `IN_REVIEW`, `INTERVIEWING`, `OFFERED`, `HIRED`, `REJECTED`, `WITHDRAWN` |
| `matchResult` | `ObjectId (MatchResult)` | No | Reference to latest computed AI match |
| `matchScoreSnapshot`| Subdocument | No | Snapshot `{ totalScore, modelVersion, calculatedAt }` |

**Indexes:**
- `{ job: 1, candidate: 1 }` (unique — 1 application per job per candidate)
- `{ job: 1, currentStage: 1 }`
- `{ candidate: 1, updatedAt: -1 }`
- `{ job: 1, status: 1 }`
- `{ "matchScoreSnapshot.totalScore": -1 }`

---

#### `ApplicationStageHistory` (Collection: `application_stage_histories`)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | History record ID |
| `application` | `ObjectId (Application)` | Yes | Target application |
| `previousStage`| `ObjectId (PipelineStage)` | No | Previous stage (null if initial submission) |
| `nextStage` | `ObjectId (PipelineStage)` | Yes | New stage transitioned to |
| `actor` | `ObjectId (User)` | Yes | Recruiter / User making the transition |
| `notes` | `String` | No | Interviewer feedback / notes |
| `createdAt` | `Date` | Auto | Timestamp of transition |

**Indexes:**
- `{ application: 1, createdAt: -1 }`
- `{ actor: 1, createdAt: -1 }`

---

#### `MatchResult` (Collection: `match_results`)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Match calculation ID |
| `candidate` | `ObjectId (CandidateProfile)`| Yes | Candidate profile reference |
| `job` | `ObjectId (Job)` | Yes | Job reference |
| `totalScore` | `Number` | Yes | Total score 0–100 |
| `componentBreakdown`| Subdocument | Yes | SkillsScore, experienceScore, educationScore, matchedSkills, missingSkills |
| `modelVersion`| `String` | Yes | AI model version identifier |
| `calculatedAt`| `Date` | Yes | Timestamp of calculation |

**Indexes:**
- `{ job: 1, candidate: 1 }` (unique)
- `{ job: 1, totalScore: -1 }`
- `{ candidate: 1, totalScore: -1 }`

---

#### `Notification` (Collection: `notifications`)
| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto | Notification record ID |
| `recipient` | `ObjectId (User)` | Yes | Target user |
| `type` | `NotificationType` | Yes | Notification type |
| `title` | `String` | Yes | Short title |
| `message` | `String` | Yes | Human-readable notification body |
| `relatedEntity`| Subdocument | Yes | `{ entityType: string, entityId: ObjectId }` |
| `isRead` | `Boolean` | Yes | Read state flag |
| `readAt` | `Date` | No | Timestamp when read |

**Indexes:**
- `{ recipient: 1, isRead: 1, createdAt: -1 }`

---

## 4. Security & Tenant Isolation Rules

1. **Password Hashes & Storage Keys**:
   - `User.passwordHash` and `Resume.storageKey` are set with `select: false`.
   - Mongoose schemas provide automatic `toJSON` transformations stripping private fields.
2. **Tenant Scoping**:
   - Every candidate entity (`Resume`, `SavedJob`, `SavedSearch`, `CandidateProfile`) references `candidate` or `user`.
   - Every employer entity (`Job`, `PipelineStage`, `CompanyMember`) references `company`.
   - Backend API endpoints must verify that the authenticated JWT subject matches the entity owner or membership role.
3. **Data Retention & Soft Deletion**:
   - Resumes and personally identifiable information (PII) must support safe deletion: when a candidate requests deletion, private files in storage must be deleted before removing the database metadata.
