# 📘 Software Requirements Specification (SRS)

**Project:** WorkflowOps — n8n Management & Observability Dashboard  
**Purpose:** Define the detailed workflow architecture and AI‑agent development lifecycle for building WorkflowOps.  
**Date:** January 28, 2026

---

## 1. Scope
WorkflowOps is a secure observability and management dashboard for n8n instances. It provides workflow visibility, execution analytics, control actions, and governance features while protecting sensitive execution data and API keys.

---

## 2. Stakeholders
- **Automation Engineers:** Monitor workflow health and execution trends.
- **Platform Admins:** Manage instances, roles, and access control.
- **Security & Compliance:** Enforce retention, auditability, and data‑access policies.
- **Finance/Operations:** Track and allocate execution costs.

---

## 3. Detailed Workflow Architecture

### 3.1 Logical Flow (End‑to‑End)
1. **User Authentication**
   - User signs in to WorkflowOps with role‑based access.
2. **Instance Registration**
   - User registers n8n instance URL and API key.
   - Backend encrypts the API key and stores it in MongoDB.
3. **Data Retrieval (Read Path)**
   - Frontend requests data via Next.js API routes.
   - Backend checks MongoDB cache for recent data.
   - If stale, backend decrypts API key and calls n8n Public API.
4. **Data Processing & Governance**
   - Execution data is redacted based on policy (mask PII, tokens).
   - Audit log entries are recorded for all data access.
5. **Control Actions (Write Path)**
   - User toggles workflow status.
   - Backend validates permissions and sends PATCH to n8n.
6. **Analytics & Costing**
   - Backend aggregates execution counts and durations.
   - Costs are computed per workflow and per instance.

### 3.2 Data Flow Components
- **Frontend (Next.js App Router)**
  - UI, charts, and workflow management views.
- **API Layer (Next.js Route Handlers)**
  - Proxy routes to n8n, internal services, and DB.
- **Services Layer**
  - n8n API service, caching, and cost computation.
- **Database (MongoDB)**
  - Encrypted API keys, cached data, audit logs, retention policies.

### 3.3 Security & Governance Layer
- **API Key Vaulting:** Encrypted at rest; rotation support.
- **RBAC:** Viewer/Operator/Admin access control.
- **Redaction:** Sensitive fields removed from execution logs.
- **Retention & Pruning:** Automatic cleanup schedules.
- **Audit Trails:** Immutable access records.
- **Policy Alerts:** Notifications on admin access or risky changes.

### 3.4 Architecture Diagram (Textual)
User → Dashboard → Next.js API → Cache(DB) → n8n API → DB Cache → Dashboard

---

## 4. Development Lifecycle Using AI Agents

### Stage 1: Core Vision (Visionary Agent)
- **Input:** Project brief.
- **Output:** Core goal, conceptual data flow, MVP features.
- **Deliverable:** docs/VISION.md

### Stage 2: Resource Gathering (Librarian Agent)
- **Input:** docs/VISION.md
- **Output:** Tech stack finalization, API endpoints, docs links.
- **Deliverable:** docs/DEV_RESOURCES.md

### Stage 3: Architecture Roadmap (Architect Agent)
- **Input:** docs/VISION.md + docs/DEV_RESOURCES.md
- **Output:** Folder structure, DB schemas, API contracts, UI component tree.
- **Deliverable:** docs/ARCHITECTURE.md

### Stage 4: Backend Implementation (Backend Engineer Agent)
- **Input:** docs/ARCHITECTURE.md
- **Output:** Database connection, models, encryption, service layer, API routes.
- **Deliverable:** app/api/* and lib/*

### Stage 5: Frontend Implementation (Frontend Engineer Agent)
- **Input:** docs/ARCHITECTURE.md + working APIs
- **Output:** Components, hooks, pages, analytics dashboards.
- **Deliverable:** app/* and components/*

---

## 4.1 Agent Task Breakdown (Work Ownership)

### Visionary Agent
- Define product goal and success metrics.
- Draft user stories and core MVP scope.
- Confirm data flow assumptions and governance needs.
- Produce docs/VISION.md.

### Librarian Agent
- Freeze tech stack and library versions.
- Enumerate required n8n API endpoints and auth headers.
- Collect official documentation links.
- Produce docs/DEV_RESOURCES.md.

### Architect Agent
- Design folder structure and module boundaries.
- Define DB schemas (User, Instance, ExecutionCache, AuditLog).
- Specify API contracts and response shapes.
- Define UI component tree and key routes.
- Produce docs/ARCHITECTURE.md.

### Backend Engineer Agent
- Implement MongoDB connection and Mongoose models.
- Build encryption utilities for API key vaulting.
- Implement n8n service layer with caching and redaction.
- Add cost computation utilities and retention jobs.
- Build API routes with RBAC enforcement and audit logging.

### Frontend Engineer Agent
- Build UI components and layouts.
- Implement data hooks (SWR/React Query).
- Create workflow list, execution analytics, and cost views.
- Add error/loading states and optimistic updates.
- Wire RBAC‑based UI gating.

---

## 5. Functional Requirements
- **Workflow Management:** List, activate/deactivate workflows.
- **Execution Observability:** Access execution history, errors, and metrics.
- **Caching:** Reduce load via short‑term caching.
- **Cost & Usage Computing:** Compute costs by workflow and instance.
- **Access Control:** RBAC with least privilege.
- **Redaction:** Mask sensitive execution data.
- **Audit Logging:** Track who accessed what and when.
- **Retention:** Auto‑prune sensitive data.

---

## 6. Non‑Functional Requirements
- **Security:** Encryption at rest, secure API handling.
- **Performance:** Cache frequently accessed data.
- **Scalability:** Support multiple n8n instances.
- **Reliability:** Graceful fallback on API errors.
- **Compliance:** Audit trails and retention controls.

---

## 7. Acceptance Criteria
- System supports all five AI‑agent stages with documented outputs.
- API key storage is encrypted and never exposed to frontend.
- RBAC enforcement validated for all read/write endpoints.
- Execution data redaction verified against policy rules.
- Cost computation outputs are consistent per workflow and instance.
- Audit logs record all data access and control actions.

---

## 8. Out of Scope
- Building or replacing n8n.
- Storing raw secrets for third‑party services.
- Full SIEM or SOC automation beyond alerts.
