
# 🚀 WorkflowOps: Master Development Lifecycle

**Project:** WorkflowOps — N8n Management & Observability Dashboard
**Methodology:** 5-Stage Sequential Execution
**Stack:** Next.js 14 (App Router), Tailwind CSS, MongoDB, n8n Public API

---

## 🟢 Stage 1: The Core Vision (Concept & Goal)

**Objective:** Define *what* we are building and *how* the data flows conceptually. No code yet.
**Output:** `docs/VISION.md` (System Logic, Core Goals, User Stories).

### 🤖 AI Agent Prompt 1 (The Visionary)

```markdown
**ROLE:** Product Manager & Systems Analyst.
**PROJECT:** WorkflowOps (n8n Dashboard).

**TASK:**
Define the "Core Logic" of the application. We need to clearly state the problem and the solution before we touch any technology.

**DELIVERABLES:**
1.  **Project Goal:** A 3-sentence summary of what "WorkflowOps" does for an automation engineer.
2.  **Conceptual Data Flow:** A text-based description of how data moves from the User -> Dashboard -> Next.js API -> MongoDB Cache -> n8n Instance.
3.  **Core Features List (MVP):**
    * Auth (User Login).
    * Instance Management (Adding n8n URLs).
    * Observability (Viewing Execution Logs).
    * Control (Activating/Deactivating Workflows).

**OUTPUT:**
Create a file `docs/VISION.md` with these details.

```

---

## 🟡 Stage 2: Resource Gathering (The Librarian)

**Objective:** Lock in the tech stack, libraries, and official documentation links so we don't waste time searching later.
**Output:** `docs/DEV_RESOURCES.md` (Library versions, API endpoints, Docs).

### 🤖 AI Agent Prompt 2 (The Librarian)

```markdown
**ROLE:** Senior Technical Lead.
**INPUT:** `docs/VISION.md` (The goal is defined).

**TASK:**
Create the "Technical Constitution" for the project. Identify every tool we will use to achieve the vision.

**DELIVERABLES:**
1.  **Tech Stack Finalization:**
    * **Framework:** Next.js 14 (App Router).
    * **Styling:** Tailwind CSS + Lucide React (Icons).
    * **Database:** Mongoose (MongoDB).
    * **Charts:** Recharts (for execution analytics).
    * **Encryption:** `crypto-js` or Node native `crypto` (for securing API Keys).
2.  **API Reference Sheet:**
    * List the specific n8n Public API endpoints we need (e.g., `GET /workflows`, `GET /executions`).
    * Identify the exact Auth Header needed (`X-N8N-API-KEY`).
3.  **Documentation Hub:**
    * Provide URLs to the official docs for Mongoose, Next.js App Router, and n8n API.

**OUTPUT:**
Create a file `docs/DEV_RESOURCES.md`.

```

---

## 🟠 Stage 3: Architecture Roadmap (The Blueprint)

**Objective:** Plan the code structure. Define the "Contracts" (API Shapes and Component Trees) so Backend and Frontend developers agree *before* coding.
**Output:** `docs/ARCHITECTURE.md` (Folder Tree, API Endpoints, DB Schemas).

### 🤖 AI Agent Prompt 3 (The Architect)

```markdown
**ROLE:** Senior Systems Architect.
**INPUT:** `docs/VISION.md` (The What) and `docs/DEV_RESOURCES.md` (The Tools).

**TASK:**
Design the code infrastructure. Do not write implementation code, just the blueprints.

**DELIVERABLES:**
1.  **Folder Structure:** A complete, indented tree structure for a Next.js App Router project (focus on `app/`, `lib/`, `models/`, `components/`).
2.  **Database Schema Design:**
    * Define the Mongoose Schema fields for: `User`, `Instance`, `ExecutionCache`.
3.  **API Roadmap (The Contract):**
    * List the API Routes we need to build (e.g., `GET /api/proxy/workflows`).
    * Define the **JSON Response Shape** for each route (e.g., `{ success: true, data: [...] }`).
4.  **Frontend Component Tree:**
    * List the key React components we need (e.g., `Sidebar`, `WorkflowTable`, `StatusBadge`).

**OUTPUT:**
Create a file `docs/ARCHITECTURE.md`.

```

---

## 🔵 Stage 4: Backend Implementation (The Engine)

**Objective:** Build the secure API, Database connection, and n8n Service integration.
**Output:** Working API Routes (`app/api/...`) and Services (`lib/...`).

### 🤖 AI Agent Prompt 4 (The Backend Engineer)

```markdown
**ROLE:** Backend Developer (Next.js/Node.js).
**INPUT:** `docs/ARCHITECTURE.md` (The Blueprint).

**TASK:**
Implement the server-side logic based on the Architect's roadmap.

**STEP-BY-STEP INSTRUCTIONS:**
1.  **Setup:** Initialize the MongoDB connection helper (`lib/db.ts`).
2.  **Models:** Create the Mongoose models based on the schema design.
3.  **Security:** Create `lib/encryption.ts` to encrypt/decrypt n8n API keys.
4.  **Service Layer:** Create `services/n8n.ts`. Implement:
    * `fetchWorkflows()`
    * `fetchExecutions()` (Implement Caching: Check DB first, then API).
    * `toggleWorkflow()`
5.  **API Routes:** Create the Next.js Route Handlers (`app/api/proxy/...`) that use these services.

**CONSTRAINT:**
Ensure all API routes return the exact JSON shape defined in the Architecture. Use `try/catch` for error handling.

```

---

## 🟣 Stage 5: Frontend Implementation (The UI)

**Objective:** Build the visible dashboard and connect it to the Backend API.
**Output:** React Components and Pages.

### 🤖 AI Agent Prompt 5 (The Frontend Developer)

```markdown
**ROLE:** Frontend Developer (React/Tailwind).
**INPUT:** `docs/ARCHITECTURE.md` (The Component Tree) and the working Backend API.

**TASK:**
Build the User Interface to visualize the data.

**STEP-BY-STEP INSTRUCTIONS:**
1.  **Global Components:** Build the "Atomic" UI parts first:
    * `components/ui/Card.tsx`
    * `components/ui/Badge.tsx` (Green for Active, Gray for Inactive)
    * `components/ui/Button.tsx`
2.  **Layout:** Create `components/Sidebar.tsx` and the main dashboard layout wrapper.
3.  **Data Fetching:** Create a custom hook `useWorkflows` using SWR to fetch data from our Backend API.
4.  **Pages:**
    * **Dashboard:** Show Stats Cards and a Recharts Graph.
    * **Workflow Manager:** A table listing workflows. Add the "Toggle Switch" that calls the activation API.

**CONSTRAINT:**
Use Tailwind CSS for styling. Ensure the UI handles "Loading" states (skeletons) and "Error" states gracefully.

```

---

### **How to Use This Lifecycle**

1. **Initialize:** Create your Next.js project.
2. **Copy this file** as `README.md` in your project root.
3. **Execute:** Run **Prompt 1** in your AI Chat. Paste the result into `docs/VISION.md`.
4. **Proceed:** Run **Prompt 2** (feeding it the content of `VISION.md`). Paste result into `docs/DEV_RESOURCES.md`.
5. **Repeat:** Continue down the list. Never skip a step. The "Input" section of each prompt tells you exactly what data to feed the AI from the previous step.