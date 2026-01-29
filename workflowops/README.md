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

## Background jobs
Scheduler runs automatically in Node runtime via instrumentation:
- Health check (every 15 minutes)
- Retention cleanup (daily at 2 AM)
- Cache warmup (every 6 hours)

## Test webhooks
POST to /api/webhooks/n8n with the configured signature header and secret if enabled.
