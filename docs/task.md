# 📋 WorkflowOps Development Task Breakdown

**Project:** WorkflowOps — n8n Management & Observability Dashboard  
**Methodology:** 5-Stage Sequential AI Agent Execution  
**Last Updated:** January 29, 2026

---

## 🎯 Overall Project Status

- [x] Stage 1: Core Vision (Visionary Agent)
- [x] Stage 2: Resource Gathering (Librarian Agent)
- [x] Stage 3: Architecture Roadmap (Architect Agent)
- [x] Stage 4: Backend Implementation (Backend Engineer Agent)
- [ ] Stage 5: Frontend Implementation (Frontend Engineer Agent)

---

## 🟢 Stage 1: Core Vision (Visionary Agent)

**Status:** ✅ COMPLETE  
**Deliverable:** `docs/VISION.md`

### Tasks
- [x] Define product goal and success metrics
- [x] Document conceptual data flow (User → Dashboard → API → Cache → n8n)
- [x] List core MVP features (Auth, Instance Management, Observability, Control, Analytics, Governance)
- [x] Write user stories for all stakeholders
- [x] Identify key technical features and differentiators
- [x] Define scope boundaries (what we are NOT building)
- [x] Create example user flow
- [x] Document assumptions and constraints
- [x] Create `docs/VISION.md` file

### Outputs
- ✅ `docs/VISION.md` — Comprehensive vision document with 9 sections

---

## 🟡 Stage 2: Resource Gathering (Librarian Agent)

**Status:** ✅ COMPLETE  
**Deliverable:** `docs/DEV_RESOURCES.md`

### Tasks
- [x] Finalize tech stack with specific versions
  - [x] Next.js 16.1.5 (LTS) — latest stable version with App Router
  - [x] Tailwind CSS 4.1.18 — latest version
  - [x] MongoDB 6.x/7.x/8.x & Mongoose 9.1.5 — latest versions
  - [x] Recharts 3.7.0 — for analytics visualization
  - [x] Lucide React 0.563.0 — for icons
  - [x] Node.js Crypto (built-in) — for encryption
  - [x] TanStack Query 5.90.20 — for data fetching (chosen over SWR)
- [x] Document n8n Public API endpoints
  - [x] `GET /workflows` — list all workflows
  - [x] `GET /workflows/{id}` — get workflow details
  - [x] `POST /workflows/{id}/activate` — activate workflow
  - [x] `POST /workflows/{id}/deactivate` — deactivate workflow
  - [x] `PUT /workflows/{id}` — update workflow
  - [x] `GET /executions` — list executions
  - [x] `GET /executions/{id}` — get execution details
  - [x] `GET /users` — list users (admin only)
  - [x] Document authentication header: `X-N8N-API-KEY`
- [x] Collect official documentation links
  - [x] Next.js App Router documentation
  - [x] Mongoose schema documentation
  - [x] n8n Public API documentation
  - [x] Tailwind CSS documentation
  - [x] Recharts documentation
  - [x] TanStack Query documentation
  - [x] Auth.js (NextAuth v5) documentation
- [x] Document environment variables needed
  - [x] `MONGODB_URI`
  - [x] `NEXTAUTH_SECRET`
  - [x] `ENCRYPTION_KEY`
  - [x] `NODE_ENV`
  - [x] `N8N_TEST_INSTANCE_URL`
  - [x] `N8N_TEST_API_KEY`
- [x] Create `docs/DEV_RESOURCES.md` file

---

## 🟠 Stage 3: Architecture Roadmap (Architect Agent)

**Status:** ✅ COMPLETE  
**Deliverable:** `docs/ARCHITECTURE.md`

### Tasks
- [x] Design folder structure
  - [x] Next.js 16 App Router structure with route groups
  - [x] API routes organization (auth, instances, proxy, analytics)
  - [x] Component organization (ui, layout, features, shared)
  - [x] Services and utilities structure
- [x] Define database schemas
  - [x] User schema (email, password, role, timestamps)
  - [x] Instance schema (userId, name, url, encryptedApiKey, health status)
  - [x] ExecutionCache schema (instanceId, workflowId, executions, TTL)
  - [x] AuditLog schema (userId, action, resource, metadata, timestamp)
  - [x] RetentionPolicy schema (instanceId, workflowId, retentionDays)
- [x] Design API contracts
  - [x] Authentication endpoints (register, login, me)
  - [x] Instance management endpoints (CRUD)
  - [x] n8n proxy endpoints (workflows, executions)
  - [x] Analytics endpoints (stats, costs)
  - [x] Audit log endpoints
  - [x] Define request/response shapes for all endpoints
- [x] Define frontend component tree
  - [x] Layout components (Sidebar, Header, DashboardLayout)
  - [x] UI components (Button, Card, Badge, Table, etc.)
  - [x] Feature components (WorkflowTable, ExecutionHistory, Analytics)
  - [x] Page components (Dashboard, Workflows, Executions, etc.)
- [x] Create architecture diagrams
  - [x] Component hierarchy diagram
  - [x] Data flow diagrams (workflow activation, execution caching)
  - [x] Authentication & authorization flow
- [x] Define security architecture
  - [x] API key encryption strategy (AES-256-GCM)
  - [x] PII redaction implementation
  - [x] Audit logging specification
  - [x] RBAC permission matrix
- [x] Gap Analysis & Updates **(NEW)**
  - [x] Identify missing features (Gap Analysis)
  - [x] Add bulk operations to architecture
  - [x] Add webhooks & retry to architecture
  - [x] Add system health monitoring
- [x] Final Pre-Development Validation
  - [x] Cross-reference Vision vs Architecture
  - [x] Verify gap analysis integration
  - [x] Create `docs/VALIDATION_REPORT.md`
- [x] Create `docs/ARCHITECTURE.md` file

---

## 🔵 Stage 4: Backend Implementation (Backend Engineer Agent)

**Status:** ✅ COMPLETE  
**Deliverable:** Working API routes and services  
**Focus:** Single-user functionalities first (no org/teams)

### Tasks

#### Phase 4.0: Backend Planning (Single-User Scope)
- [ ] Confirm backend scope excludes org/teams, SSO, multi-tenant RBAC
- [ ] Define user context source (`session.user.id`) for all data access
- [ ] Add single-user assumption notes in API route docs

#### Phase 4.1: Foundation (Setup & DB)
- [ ] Initialize Next.js 16 project with TypeScript & Tailwind
- [ ] Configure environment variables (`.env`)
- [ ] Set up `lib/db.ts` (MongoDB connection) & test connection
- [ ] Add `lib/env.ts` validation for required variables
- [ ] Create Mongoose Models
  - [ ] `User.ts` (Basic auth)
  - [ ] `Instance.ts` (n8n connection details)
  - [ ] `ExecutionCache.ts` (Performance)
  - [ ] `AuditLog.ts` (Security)
  - [ ] `WebhookEvent.ts` (Real-time foundation)

#### Phase 4.2: Auth (Single User)
- [ ] Implement `lib/encryption.ts` (AES-256-GCM for API keys)
- [ ] Configure Auth.js (`lib/auth.ts`)
  - [ ] Credential provider (Email/Password)
  - [ ] Session handling
  - [ ] Minimal `getServerSession` helper
- [ ] Build Auth API Routes
  - [ ] `POST /api/auth/register`
  - [ ] `GET /api/auth/me`
  - [ ] `POST /api/auth/login` (optional if not using NextAuth UI)

#### Phase 4.3: Instance Management (Single User)
- [ ] Create input validators (zod) for instance payloads
- [ ] Build Instance API Routes
  - [ ] `POST /api/instances` (Create with encryption)
  - [ ] `GET /api/instances` (List user's instances)
  - [ ] `GET /api/instances/[id]` (Get details & health)
  - [ ] `PUT /api/instances/[id]` (Update name/url/api key)
  - [ ] `DELETE /api/instances/[id]`
- [ ] Add per-user ownership checks on all instance reads/writes
- [ ] Add basic health check helper using stored API key

#### Phase 4.4: n8n Proxy & Core Services
- [ ] Implement `services/n8n.ts` (Proxy layer)
  - [ ] Fetch workflows/executions with `X-N8N-API-KEY`
  - [ ] Handle connection errors gracefully
  - [ ] Normalize upstream errors to API responses
- [ ] Implement `services/cache.ts` (Performance)
  - [ ] Read-through caching for executions
  - [ ] TTL strategy per endpoint
- [ ] Build Proxy API Routes (single-user instance scoped)
  - [ ] `GET /api/proxy/workflows`
  - [ ] `GET /api/proxy/workflows/[id]`
  - [ ] `GET /api/proxy/executions`
  - [ ] `GET /api/proxy/executions/[id]`
  - [ ] `POST /api/proxy/workflows/[id]/activate`
  - [ ] `POST /api/proxy/workflows/[id]/deactivate`

#### Phase 4.5: Audit, Redaction, and Retention (Single User)
- [ ] Implement `lib/redaction.ts` utilities
- [ ] Implement `services/audit.ts` (action logging)
- [ ] Add audit logging in all proxy and instance routes
- [ ] Add retention policy defaults (per instance)

#### Phase 4.6: Advanced Features (Single User)
- [ ] Implement Bulk Operations
  - [ ] `POST /api/proxy/workflows/bulk/activate`
  - [ ] `POST /api/proxy/workflows/bulk/deactivate`
- [ ] Implement Execution Retry
  - [ ] `POST /api/proxy/executions/[id]/retry`
- [ ] Implement Webhook Receiver
  - [ ] `POST /api/webhooks/n8n` (Signature verification)
  - [ ] `services/webhook.ts` (Event processing)

#### Phase 4.7: Analytics & Background Jobs
- [ ] Implement `services/analytics.ts`
  - [ ] success/error rate calculation
  - [ ] cost estimation logic
- [ ] Build Analytics API Routes
  - [ ] `GET /api/analytics/stats`
  - [ ] `GET /api/analytics/costs`
- [ ] Set up Background Jobs (Node Cron)
  - [ ] `jobs/health-check.ts` (Instance monitoring)
  - [ ] `jobs/retention.ts` (Data pruning)
  - [x] `jobs/cache-warmup.ts` (optional)

---

## 🟣 Stage 5: Frontend Implementation (Frontend Engineer Agent)

**Status:** ⏳ PENDING  
**Deliverable:** Complete UI with all features

### Current Frontend Task List (Short)
- [x] Theme tokens with CSS variables
- [x] Core UI primitives (Button/Card/Badge/Input/Table/Modal/Toast/Skeleton)
- [x] Layout shell (Sidebar/Header/DashboardLayout)
- [x] Auth screens (login/register)
- [x] Instances page (list/create/delete)
- [x] Workflows page + bulk actions
- [x] Executions page + retry
- [x] Analytics page (stats/costs/trends/anomalies)
- [x] Audit page (admin only)
- [x] Settings page + theme toggle settings

### Frontend Completion Checklist (Detailed)
- [x] Route guards for authenticated pages
- [x] Admin-only guard for audit/retention
- [x] Logout button in header
- [x] Retention page uses dashboard layout + theme vars
- [x] Workflow bulk selection UI (checkboxes)
- [x] Execution detail + delete UI
- [x] Workflow detail + update UI
- [x] Audit filters (action/resource/limit)
- [x] Analytics charts (visual)
- [x] Standardized empty/loading/error states

### Frontend Completion Checklist (Active)
- [x] Route guard for authenticated pages
- [x] Admin-only gate for audit + retention
- [x] Logout action in header
- [x] Integrate retention page into dashboard layout/theme
- [x] Instance edit/update UI (modal + PUT)
- [x] Workflow details view (GET by id)
- [x] Execution details + delete action
- [x] Bulk workflow selection (checkboxes)
- [x] Analytics data mapping fixes (successRate/cost/anomalies)
- [x] Analytics charts (real charts)
- [x] Audit log filters + cursor pagination

### Tasks

#### 5.1 Theme Foundation (CSS Variables First)
- [x] Define CSS variable tokens in `globals.css` (color, radius, spacing, elevation)
  - [x] `--bg`, `--fg`, `--muted`, `--border`, `--primary`, `--primary-foreground`, `--danger`, `--warning`, `--success`
- [x] Add light/dark theme scopes using variables (e.g., `[data-theme="light"]`, `[data-theme="dark"]`)
- [x] Map Tailwind to CSS variables (background, text, border, ring)
- [x] Create a simple theme switch hook (toggle `data-theme`)

#### 5.2 UI Primitives (Variable-Driven)
- [x] `components/ui/Button.tsx` (variants via CSS vars)
- [x] `components/ui/Card.tsx`
- [x] `components/ui/Badge.tsx`
- [x] `components/ui/Input.tsx`
- [x] `components/ui/Table.tsx`
- [x] `components/ui/Modal.tsx`
- [x] `components/ui/Toast.tsx`
- [x] `components/ui/Skeleton.tsx`

#### 5.3 Layout & Navigation
- [x] `components/Sidebar.tsx` (links to dashboard/workflows/executions/analytics/instances/audit/retention)
- [x] `components/Header.tsx` (user menu, theme toggle)
- [x] `components/DashboardLayout.tsx`
- [x] Route guard layout for authenticated pages

#### 5.4 Data Layer (Aligned to Backend)
- [x] `hooks/useAuth.ts` → `/api/auth/me`
- [x] `hooks/useInstances.ts` → `/api/instances`
- [x] `hooks/useWorkflows.ts` → `/api/proxy/workflows`
- [x] `hooks/useExecutions.ts` → `/api/proxy/executions`
- [x] `hooks/useAnalytics.ts` → `/api/analytics/stats|costs|trends|anomalies`
- [x] `hooks/useAuditLogs.ts` → `/api/audit-logs`
- [x] `hooks/useRetentionPolicies.ts` → `/api/retention-policies`
- [x] Standardize error/loading/empty states in each hook

#### 5.5 Auth Screens
- [x] `app/login/page.tsx` (Credentials login)
- [x] `app/register/page.tsx` (uses `/api/auth/register`)
- [x] Redirect unauthenticated users to login

#### 5.6 Instance Management
- [x] `app/instances/page.tsx` (list/create/update/delete)
- [x] `components/InstanceCard.tsx`
- [x] Inline health status badges + last check

#### 5.7 Workflow Management
- [x] `app/workflows/page.tsx` (list, activate/deactivate)
- [x] `components/WorkflowTable.tsx`
- [x] Bulk activate/deactivate UI wired to `/api/proxy/workflows/bulk/*`

#### 5.8 Execution Monitoring
- [x] `app/executions/page.tsx` (filters: workflowId/status)
- [x] `components/ExecutionHistory.tsx`
- [x] Retry action wired to `/api/proxy/executions/[id]/retry`

#### 5.9 Analytics & Insights
- [x] `app/analytics/page.tsx`
- [x] `components/StatsCard.tsx`
- [x] `components/SuccessRateChart.tsx`
- [x] `components/TrafficChart.tsx`
- [x] `components/CostBreakdown.tsx` (unitCost input)
- [x] Anomalies/trends panels
  - [x] Fix successRate percent mapping
  - [x] Fix costs response mapping
  - [x] Render anomaly fields (expected/actual/severity)

#### 5.10 Governance & Audit
- [x] `app/audit/page.tsx` (admin-only)
- [x] `components/AuditLogTable.tsx`
- [x] `app/retention/page.tsx` polish (already created) + integrate with new layout
  - [x] Add cursor pagination (before/next)

#### 5.11 Settings & Profile
- [x] `app/settings/page.tsx` (theme toggle, user info)
- [ ] Optional: api key rotation info (read-only)

#### 5.12 UX & QA
- [ ] Optimistic UI for workflow toggles
- [ ] Toasts for success/error
- [ ] Responsive layout (mobile/tablet/desktop)
- [ ] Accessibility pass (ARIA, focus, contrast)
- [ ] Frontend tests for core flows

---

## 🔧 Additional Tasks (Cross-Cutting)

### Documentation
- [ ] Create `README.md` with setup instructions
- [ ] Create `CONTRIBUTING.md` with development guidelines
- [ ] Create API documentation
- [ ] Create user guide

### DevOps
- [ ] Set up environment variables template (`.env.example`)
- [ ] Create Docker configuration
- [ ] Set up CI/CD pipeline
- [ ] Configure deployment (Vercel/Railway)

### Security
- [ ] Security audit of encryption implementation
- [ ] Penetration testing
- [ ] Dependency vulnerability scanning
- [ ] OWASP compliance check

### Performance
- [ ] Optimize database queries
- [ ] Implement rate limiting
- [ ] Add CDN for static assets
- [ ] Performance testing and profiling

---

## ✅ Backend Completion Checklist (Current Codebase)

### Security & Access
- [x] Enforce RBAC on all read endpoints (workflows/executions/analytics)
- [x] Confirm n8n webhook signature header + format and update verification

### Data Governance
- [x] Seed default retention policy on instance creation
- [x] Add UI integration for retention policies

### Reliability
- [x] Normalize n8n proxy errors and surface rate-limit info
- [x] Add API-level rate limiting (global + per user)

### Background Jobs
- [x] Start scheduler on server boot (avoid per-request starts)

### QA
- [x] Add API contract validation tests
- [x] Add integration tests for proxy routes

---

## 📊 Progress Tracking

| Stage | Status | Completion | Deliverable |
|-------|--------|------------|-------------|
| Stage 1: Vision | ✅ Complete | 100% | `docs/VISION.md` |
| Stage 2: Resources | ✅ Complete | 100% | `docs/DEV_RESOURCES.md` |
| Stage 3: Architecture | ✅ Complete | 100% | `docs/ARCHITECTURE.md` |
| Stage 4: Backend | ✅ Complete | 100% | API routes & services |
| Stage 5: Frontend | ⏳ Pending | 0% | UI components & pages |

---

**Next Action:** Execute Stage 4 (Backend Engineer Agent) to implement database connection, models, services, and API routes.
