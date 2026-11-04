# TalentBridge — AI Integration & Architecture Guide

This document defines the architecture, contracts, environment variables, and coordination specifications for the **AI Features** of TalentBridge (`feature/ai`).

---

## 1. Environment Configuration

Add the following variables to `backend/.env` (refer to [backend/.env.example](file:///d:/TalentBridge/backend/.env.example)):

```bash
# AI Provider (OpenAI / Compatible Hosted LLM Endpoint)
AI_PROVIDER_KEY=sk-proj-... # Or OPENAI_API_KEY
OPENAI_API_KEY=sk-proj-...
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
AI_EMBEDDING_MODEL=text-embedding-3-small
AI_TIMEOUT_MS=30000
AI_MAX_RETRIES=2
```

> **Provider Fallback Behavior**: If neither `AI_PROVIDER_KEY` nor `OPENAI_API_KEY` is provided, all endpoints return explicit `configured: false` with deterministic heuristic parsing/scoring without throwing or fabricating responses.

---

## 2. Implemented Features & Endpoints

### Feature 1: Resume Parsing & Document Extraction
- **Service**: [ResumeParserService](file:///d:/TalentBridge/backend/src/modules/ai/services/resume-parser.service.ts), [DocumentExtractorService](file:///d:/TalentBridge/backend/src/modules/ai/services/document-extractor.service.ts)
- **Supported Formats**: PDF, DOCX, TXT (Maximum file size: 10MB).
- **Security & Untrusted Data**: Documents are sanitized against prompt injection patterns (`ignore previous instructions`, etc.). Unsafe control characters are stripped.
- **Workflow & Profile Confirmation**:
  1. Candidate uploads resume -> triggers `POST /me/resumes/:id/parse`.
  2. Data is extracted into structured JSON with confidence indicators and missing-field warnings.
  3. Candidate reviews the parsed fields via `GET /me/resumes/:id/parsed`.
  4. Candidate confirms via `POST /me/resumes/:id/apply-parsed` which merges fields into [CandidateProfile](file:///d:/TalentBridge/backend/src/database/schemas/candidate-profile.schema.ts) without silently overwriting user-edited information.

### Feature 2: AI Resume Analysis
- **Service**: [ResumeAnalyzerService](file:///d:/TalentBridge/backend/src/modules/ai/services/resume-analyzer.service.ts)
- **Endpoint**: `POST /me/resume/analyze`
- **Output**:
  - `identifiedSkills`: Recognized skills in candidate profile.
  - `strengths`: Concrete professional strengths.
  - `missingSkills`: High-impact gaps for target roles.
  - `improvementSuggestions`: Actionable resume enhancement advice.
  - `score`: Transparent 0–100 quality indicator.

### Feature 3: Recommended Jobs with Transparent Scoring
- **Service**: [JobMatcherService](file:///d:/TalentBridge/backend/src/modules/ai/services/job-matcher.service.ts)
- **Endpoints**:
  - Candidate: `GET /me/recommended-jobs?limit=10`
  - Recruiter: `GET /app/jobs/:id/recommended-candidates?limit=10`
  - Explainability: `GET /matching/explain?jobId=...&candidateId=...`
- **Scoring Weights (0–100 Scale)**:
  | Component | Weight | Criteria |
  | :--- | :--- | :--- |
  | **Skill Coverage** | 50% | Exact & semantic match ratio against required skills |
  | **Experience Fit** | 25% | Candidate years vs. required seniority level |
  | **Location / Workplace** | 15% | Remote compatibility, hybrid, and location overlap |
  | **Salary Compatibility** | 10% | Overlap between candidate expectations and employer budget |
- **Governance**: AI scores are advisory decision aids. Matches include the explicit governance notice:
  > *"AI match scores are transparent decision aids and never automatically reject candidates or make autonomous employment determinations."*

### Feature 4: Recruiter Assistance
- **Service**: [RecruiterAssistantService](file:///d:/TalentBridge/backend/src/modules/ai/services/recruiter-assistant.service.ts)
- **Endpoints**:
  - `POST /app/jobs/ai/generate-description`: Draft generation requiring human review.
  - `POST /app/jobs/ai/bias-check`: Scans for exclusionary jargon (`rockstar`, `aggressive`, `native english speaker`) with inclusive alternatives.
  - `POST /app/jobs/ai/interview-questions`: Suggests structured technical and behavioral interview questions.
  - `GET /app/candidates/:id/ai-summary`: Objective candidate briefing for authorized recruiters.

---

## 3. Integration Contracts for Teammates

### Backend Teammates
The [AiModule](file:///d:/TalentBridge/backend/src/modules/ai/ai.module.ts) exports [AiService](file:///d:/TalentBridge/backend/src/modules/ai/ai.service.ts) and its specialized sub-services. Inject `AiService` directly into controllers or domain services (`ResumesService`, `ApplicationsService`, etc.).

### Frontend Teammates
All endpoints adhere to Swagger / OpenAPI standards in [backend/src/modules/ai/dto/ai.dto.ts](file:///d:/TalentBridge/backend/src/modules/ai/dto/ai.dto.ts). Responses follow the standard envelope:
```typescript
{
  status: 'success' | 'unavailable';
  configured: boolean;
  data: ...;
}
```
If `configured === false`, display the fallback warning banner indicating that AI suggestions are using standard heuristics.
