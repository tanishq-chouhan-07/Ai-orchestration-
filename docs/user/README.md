Here is the comprehensive **Project Idea & Working Mechanism** for **WorkflowOps**.

This is designed to be the content for your `docs/VISION.md` file. It serves as the "Source of Truth" for all future AI agents, ensuring they understand *what* they are building before they write a single line of code.

---

# 📂 Project: WorkflowOps

### **1. The Core Idea**

**WorkflowOps** is a dedicated **Observability & Management Dashboard** for the n8n automation platform.

As organizations scale their use of n8n from simple tasks to critical business infrastructure, they hit a "Black Box" problem: it becomes difficult to see which of hundreds of workflows are active, which are failing, and where the bottlenecks are.

**WorkflowOps** solves this by pulling data out of n8n’s internal UI and presenting it in a "Single Pane of Glass" dashboard. It allows engineers to monitor health, bulk-manage workflows, and visualize execution data without logging into multiple n8n servers.

### **2. How It Works (The "Mental Model")**

The system operates as a **Secure Proxy & Caching Layer** between the user and their n8n instance. It does not replace n8n; it sits *on top* of it.

#### **Step 1: Onboarding (The Connection)**

* The user logs into WorkflowOps.
* They enter their n8n Instance URL (e.g., `https://n8n.mycompany.com`) and their **Public API Key**.
* **Security:** The system encrypts this API Key (using AES-256) and stores it in MongoDB. It is never exposed to the frontend browser.

#### **Step 2: Data Ingestion (The "Smart Sync")**

* When the user opens the Dashboard, the Frontend requests data (e.g., "Show me all active workflows").
* The **Next.js Backend** receives this request.
* **The Cache Check:** Before hitting the n8n API, the backend checks the **MongoDB Cache**.
* *Scenario A (Cache Hit):* If we fetched the workflow list 2 minutes ago, we return that data instantly. (Fast & saves n8n resources).
* *Scenario B (Cache Miss):* If the data is stale, the backend decrypts the API Key, calls the **n8n Public API**, saves the fresh result to MongoDB, and then sends it to the user.



#### **Step 3: Execution Observability (The Analytics)**

* WorkflowOps periodically polls the n8n `/executions` endpoint.
* It downloads the execution logs (Status: Success/Error, Duration: 500ms).
* It aggregates this raw data into **Metrics**:
* *Success Rate:* "98.5% of workflows passed today."
* *Traffic:* "You had 5,000 executions between 2 PM and 3 PM."


* These metrics are visualized using graphs (Recharts), giving the user insights n8n doesn't provide natively.

#### **Step 4: Control Actions (The Management)**

* The user sees a workflow is failing and wants to stop it.
* They click a **"Deactivate" toggle** on the dashboard.
* The Backend verifies the user's permissions.
* The Backend sends a `PATCH /workflows/{id}` request to the n8n instance with `active: false`.
* The n8n instance stops the workflow, and the dashboard updates to reflect the new state.

---

### **3. Key Technical Features**

| Feature | Description | Why it matters? |
| --- | --- | --- |
| **Zero-Knowledge Auth** | API Keys are encrypted at rest. The backend only decrypts them for the split second needed to make a request. | Protects sensitive credentials if the database is leaked. |
| **Request Caching** | Stores API responses in MongoDB for 5-10 minutes. | Prevents "Rate Limiting" and crashing the n8n server with too many requests. |
| **Optimistic UI** | When you toggle a switch, the UI flips *instantly*, then reverts if the server fails. | Makes the app feel incredibly fast and responsive ("Native app feel"). |
| **Execution History** | Keeps a longer history of execution stats than the default n8n instance usually retains. | Allows for long-term trend analysis (e.g., "Are we getting more errors this month?"). |

---

### **3.1 Additional Required Functionalities (Based on n8n API Key Access)**

These features directly address the risks and data access scope of an n8n API key (workflows, executions, credentials metadata, and admin data).

| Functionality | Description | Why it matters |
| --- | --- | --- |
| **API Key Vaulting** | Store encrypted keys with rotation support and per-instance scoping. | Prevents key reuse and limits blast radius if compromised. |
| **Role-Based Access Control (RBAC)** | Fine-grained roles (viewer, operator, admin) that gate workflow edits, execution data, and user list access. | Prevents sensitive data exposure to non-admins. |
| **Execution Data Redaction** | Configurable masking of sensitive fields (emails, tokens, PII) in execution logs. | Reduces exposure of processed data retrieved via `/executions`. |
| **Data Retention & Pruning** | Automatic pruning policies per instance or workflow (e.g., keep 7/30/90 days). | Minimizes stored sensitive data and compliance risk. |
| **Audit Trails** | Immutable logs of who accessed workflows, executions, and admin endpoints. | Supports compliance and incident response. |
| **Access Scoping by Workflow** | Allow/deny lists for which workflows can be viewed or managed. | Protects high-risk automations from broad access. |
| **Secrets Inventory (Metadata Only)** | List credential types and usage without exposing secrets. | Enables governance without leaking keys. |
| **Instance Health & Limits** | Monitor rate limits, error spikes, and API availability. | Prevents overload and detects abnormal activity. |
| **Cost & Usage Computing** | Compute per-workflow and per-instance costs (execution count × unit cost; runtime × unit cost). | Enables budgeting and chargeback. |
| **Policy Alerts** | Alerts for admin-level access use, new users, or unexpected workflow edits. | Early detection of misuse or account takeover. |


### **4. User Flow Summary**

1. **User** visits `app/dashboard`.
2. **Frontend** calls `GET /api/proxy/stats`.
3. **Backend** checks **MongoDB** -> "Data is old."
4. **Backend** calls **n8n API** -> Gets fresh data.
5. **Backend** updates **MongoDB** -> Returns JSON to Frontend.
6. **Frontend** renders the **"Success Rate" Graph**.

---

### **Next Step for You**

Now that you have the "Vision," you are ready for **Stage 2** of your lifecycle: **Gathering Resources.**

Do you want me to run the **"Librarian Agent"** now to generate the `docs/DEV_RESOURCES.md` file with the exact n8n API endpoints and library versions?