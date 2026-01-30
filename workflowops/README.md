# WorkflowOps

n8n Management & Observability Dashboard built with Next.js App Router, MongoDB, and Auth.js.

## Setup

### Prerequisites
- Node.js 20+
- MongoDB (Atlas or local)

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
Copy the example file and fill in values:
```bash
cp .env.example .env
```

Required keys in .env:
- MONGODB_URI
- NEXTAUTH_SECRET
- ENCRYPTION_KEY (32+ chars recommended)
- N8N_WEBHOOK_SECRET (optional but recommended)

Optional keys:
- N8N_TEST_INSTANCE_URL
- N8N_TEST_API_KEY
- N8N_WEBHOOK_SIGNATURE_HEADER (default: x-n8n-signature)

### 3) Run the dev server
```bash
npm run dev
```

Open http://localhost:3000

## Scripts
- npm run dev
- npm run build
- npm run start
- npm run lint
- npm test

## Connect an n8n instance
1. Run n8n (local, self-hosted, or cloud) and ensure it is reachable from this app.
2. Create an n8n API key in n8n (Settings → API/Personal Access Tokens).
3. In WorkflowOps, go to Instances → Add instance.
4. Use the base URL only (e.g., http://localhost:5678 or https://your-n8n-domain). Do not include /api/v1.
5. Paste the API key and save.

Notes:
- Cloud/self-hosted instances must allow outbound access from the WorkflowOps server.
- If you use a reverse proxy, ensure /api/v1 is exposed.

## Background jobs
Scheduler runs automatically in Node runtime via instrumentation:
- Health check (every 15 minutes)
- Retention cleanup (daily at 2 AM)
- Cache warmup (every 6 hours)

## Test webhooks
POST to /api/webhooks/n8n with the configured signature header and secret if enabled.
