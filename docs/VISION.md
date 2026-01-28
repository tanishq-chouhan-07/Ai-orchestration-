# 📂 WorkflowOps: Core Vision

**Project:** WorkflowOps — n8n Management & Observability Dashboard  
**Purpose:** Define the product goal, conceptual data flow, and MVP scope  
**Date:** January 28, 2026  
**Agent:** Visionary (Stage 1)

---

## 1. Product Goal (The "Why")

**WorkflowOps** is a dedicated **Observability & Management Dashboard** for the n8n automation platform.

As organizations scale their use of n8n from simple tasks to critical business infrastructure, they hit a **"Black Box" problem**: it becomes difficult to see which of hundreds of workflows are active, which are failing, and where the bottlenecks are.

**WorkflowOps solves this** by pulling data out of n8n's internal UI and presenting it in a **"Single Pane of Glass" dashboard**. It allows engineers to monitor health, bulk-manage workflows, and visualize execution data without logging into multiple n8n servers.

### Success Metrics
- **Visibility:** Users can see all workflows across multiple n8n instances in one dashboard
- **Control:** Users can activate/deactivate workflows without accessing n8n directly
- **Insights:** Users gain analytics on execution success rates, traffic patterns, and costs that n8n doesn't provide natively

---

## 2. Conceptual Data Flow (The "How")

The system operates as a **Secure Proxy & Caching Layer** between the user and their n8n instance. It does not replace n8n; it sits *on top* of it.

### Flow Diagram (Text-Based)

```
User → Dashboard (Next.js Frontend)
  ↓
Next.js API Routes (Backend)
  ↓
MongoDB Cache (Check for fresh data)
  ↓
n8n Public API (Fetch if cache is stale)
  ↓
MongoDB (Store fresh data + audit logs)
  ↓
Dashboard (Display visualizations)
```

### Detailed Step-by-Step Flow

#### Step 1: Onboarding (The Connection)
- User logs into WorkflowOps
- They enter their n8n Instance URL (e.g., `https://n8n.mycompany.com`) and **Public API Key**
- **Security:** The system encrypts this API Key (using AES-256) and stores it in MongoDB
- The key is never exposed to the frontend browser

#### Step 2: Data Ingestion (The "Smart Sync")
- When the user opens the Dashboard, the Frontend requests data (e.g., "Show me all active workflows")
- The **Next.js Backend** receives this request
- **The Cache Check:** Before hitting the n8n API, the backend checks the **MongoDB Cache**
  - *Scenario A (Cache Hit):* If we fetched the workflow list 2 minutes ago, we return that data instantly (Fast & saves n8n resources)
  - *Scenario B (Cache Miss):* If the data is stale, the backend decrypts the API Key, calls the **n8n Public API**, saves the fresh result to MongoDB, and then sends it to the user

#### Step 3: Execution Observability (The Analytics)
- WorkflowOps periodically polls the n8n `/executions` endpoint
- It downloads the execution logs (Status: Success/Error, Duration: 500ms)
- It aggregates this raw data into **Metrics**:
  - *Success Rate:* "98.5% of workflows passed today"
  - *Traffic:* "You had 5,000 executions between 2 PM and 3 PM"
- These metrics are visualized using graphs (Recharts), giving the user insights n8n doesn't provide natively

#### Step 4: Control Actions (The Management)
- The user sees a workflow is failing and wants to stop it
- They click a **"Deactivate" toggle** on the dashboard
- The Backend verifies the user's permissions
- The Backend sends a `PATCH /workflows/{id}` request to the n8n instance with `active: false`
- The n8n instance stops the workflow, and the dashboard updates to reflect the new state

---

## 3. Core Features (MVP Scope)

### 3.1 Authentication & User Management
- **User Login:** Secure authentication system with role-based access
- **Session Management:** Persistent sessions with secure token handling
- **RBAC Foundation:** Three roles: Viewer, Operator, Admin

### 3.2 Instance Management
- **Add n8n Instance:** Register n8n instance URL and API key
- **API Key Vaulting:** Encrypted storage with AES-256
- **Multi-Instance Support:** Manage multiple n8n instances from one dashboard
- **Instance Health Check:** Verify connectivity and API access

### 3.3 Workflow Observability
- **Workflow List View:** Display all workflows with status, name, and last execution
- **Execution History:** View past executions with success/failure status
- **Execution Details:** Drill down into individual execution logs
- **Real-Time Status:** Live updates on workflow execution states
- **Search & Filter:** Find workflows by name, status, or tags

### 3.4 Workflow Control
- **Activate/Deactivate:** Toggle workflow status with one click
- **Bulk Actions:** Manage multiple workflows simultaneously
- **Optimistic UI:** Instant feedback with automatic rollback on failure
- **Permission Gating:** RBAC enforcement on control actions

### 3.5 Analytics & Insights
- **Success Rate Dashboard:** Visual representation of workflow health
- **Execution Traffic:** Timeline graphs showing execution volume
- **Error Tracking:** Identify and monitor failing workflows
- **Performance Metrics:** Average execution duration and trends
- **Cost Computing:** Calculate execution costs per workflow and instance

### 3.6 Security & Governance
- **Data Redaction:** Mask sensitive fields (PII, tokens, emails) in execution logs
- **Audit Trails:** Immutable logs of all user actions and data access
- **Retention Policies:** Automatic pruning of old execution data (7/30/90 days)
- **Access Scoping:** Workflow-level access control with allow/deny lists
- **Policy Alerts:** Notifications for admin access or suspicious activity

---

## 4. User Stories (The "Who")

### Automation Engineer
> "As an automation engineer, I want to see all my workflows in one place so I can quickly identify which ones are failing without logging into multiple n8n instances."

> "As an automation engineer, I want to view execution history with success rates so I can identify trends and proactively fix issues."

### Platform Admin
> "As a platform admin, I want to control who can view and manage workflows so I can enforce least-privilege access across my team."

> "As a platform admin, I want to set data retention policies so we don't store sensitive execution data longer than necessary."

### Security & Compliance Officer
> "As a security officer, I want audit logs of all workflow access so I can track who accessed sensitive automation data."

> "As a compliance officer, I want execution data to be automatically redacted so we don't expose PII in our observability system."

### Finance/Operations
> "As a finance manager, I want to see execution costs per workflow so I can allocate infrastructure costs to the right teams."

> "As an operations lead, I want to monitor execution traffic patterns so I can plan capacity and identify cost optimization opportunities."

---

## 5. Key Technical Features (The "What Makes It Special")

| Feature | Description | Why it matters? |
|---------|-------------|-----------------|
| **Zero-Knowledge Auth** | API Keys are encrypted at rest. The backend only decrypts them for the split second needed to make a request. | Protects sensitive credentials if the database is leaked. |
| **Request Caching** | Stores API responses in MongoDB for 5-10 minutes. | Prevents "Rate Limiting" and crashing the n8n server with too many requests. |
| **Optimistic UI** | When you toggle a switch, the UI flips *instantly*, then reverts if the server fails. | Makes the app feel incredibly fast and responsive ("Native app feel"). |
| **Execution History** | Keeps a longer history of execution stats than the default n8n instance usually retains. | Allows for long-term trend analysis (e.g., "Are we getting more errors this month?"). |
| **API Key Vaulting** | Store encrypted keys with rotation support and per-instance scoping. | Prevents key reuse and limits blast radius if compromised. |
| **Role-Based Access Control (RBAC)** | Fine-grained roles (viewer, operator, admin) that gate workflow edits, execution data, and user list access. | Prevents sensitive data exposure to non-admins. |
| **Execution Data Redaction** | Configurable masking of sensitive fields (emails, tokens, PII) in execution logs. | Reduces exposure of processed data retrieved via `/executions`. |
| **Data Retention & Pruning** | Automatic pruning policies per instance or workflow (e.g., keep 7/30/90 days). | Minimizes stored sensitive data and compliance risk. |
| **Audit Trails** | Immutable logs of who accessed workflows, executions, and admin endpoints. | Supports compliance and incident response. |
| **Cost & Usage Computing** | Compute per-workflow and per-instance costs (execution count × unit cost; runtime × unit cost). | Enables budgeting and chargeback. |

---

## 6. What We Are NOT Building (Out of Scope)

- **Not a Workflow Builder:** We are not replacing n8n's workflow editor
- **Not a Secrets Manager:** We store encrypted API keys, but not the secrets used within workflows
- **Not a Full SIEM:** We provide alerts and audit logs, but not complete security operations automation
- **Not a Workflow Executor:** We don't run workflows; we only observe and manage them

---

## 7. Example User Flow (The "Experience")

### Scenario: An automation engineer wants to check workflow health

1. **User** visits `app.workflowops.com/dashboard`
2. **Frontend** calls `GET /api/proxy/stats`
3. **Backend** checks **MongoDB** → "Data is old"
4. **Backend** calls **n8n API** → Gets fresh data
5. **Backend** updates **MongoDB** → Returns JSON to Frontend
6. **Frontend** renders the **"Success Rate" Graph**
7. **User** sees that "Payment Processor" workflow has a 60% failure rate
8. **User** clicks on the workflow to see execution details
9. **User** identifies the issue and clicks "Deactivate" to stop further failures
10. **Backend** sends `PATCH` to n8n, logs the action in audit trail
11. **Dashboard** updates instantly with optimistic UI

---

## 8. Next Steps

This vision document serves as the **Source of Truth** for all future development stages.

### Immediate Next Actions:
1. ✅ **Vision Defined** (This document)
2. ⏭️ **Stage 2:** Run the **Librarian Agent** to create `docs/DEV_RESOURCES.md`
3. ⏭️ **Stage 3:** Run the **Architect Agent** to create `docs/ARCHITECTURE.md`
4. ⏭️ **Stage 4:** Backend implementation
5. ⏭️ **Stage 5:** Frontend implementation

---

## 9. Assumptions & Constraints

### Assumptions
- Users have access to n8n instances with Public API enabled
- Users have generated n8n API keys with appropriate permissions
- MongoDB is available for data storage
- Users understand basic n8n concepts (workflows, executions, nodes)

### Constraints
- We rely on n8n's Public API; any API limitations affect our capabilities
- Cache staleness is a trade-off between freshness and performance
- Encryption adds minimal overhead but is non-negotiable for security
- RBAC enforcement requires careful implementation to avoid privilege escalation

---

**Document Status:** ✅ Complete  
**Ready for:** Stage 2 (Librarian Agent)
