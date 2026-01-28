# 📚 Development Resources

**Project:** WorkflowOps — n8n Management & Observability Dashboard  
**Purpose:** Technical stack finalization, API references, and documentation hub  
**Date:** January 28, 2026  
**Agent:** Librarian (Stage 2)

---

## 1. Tech Stack Finalization

### 1.1 Core Framework

| Technology | Version | Purpose | Installation |
|------------|---------|---------|--------------|
| **Next.js** | 16.1.5 (LTS) | Full-stack React framework with App Router | `npx create-next-app@latest` |
| **React** | 19.x | UI library (bundled with Next.js 16) | Included with Next.js |
| **TypeScript** | 5.x | Type safety and developer experience | Included with Next.js |
| **Node.js** | 20.x LTS | Runtime environment | System installation |

**Why Next.js 16?**
- Latest LTS release (security support until October 2027)
- Stable Turbopack as default bundler (faster builds)
- React Compiler Support
- Enhanced routing and caching mechanisms
- App Router with Server Components

> [!IMPORTANT]
> Next.js 14 reached end of security support on October 26, 2025. Use Next.js 16 for long-term support.

---

### 1.2 Styling & UI

| Technology | Version | Purpose | Installation |
|------------|---------|---------|--------------|
| **Tailwind CSS** | 4.1.18 | Utility-first CSS framework | `npm install tailwindcss@latest` |
| **Lucide React** | 0.563.0 | Icon library (tree-shakable SVGs) | `npm install lucide-react` |
| **Recharts** | 3.7.0 | Charting library for analytics | `npm install recharts` |

**Why Tailwind CSS v4?**
- New compilation engine (faster builds, smaller CSS)
- CSS-first approach (more intuitive customization)
- Optimized for modern browsers
- Released early 2025 with performance improvements

**Why Lucide React?**
- Tree-shakable (only imported icons in bundle)
- Optimized inline SVGs
- Consistent design system
- 1000+ icons available

**Why Recharts?**
- Built specifically for React
- Composable chart components
- Responsive and customizable
- Perfect for execution analytics and traffic graphs

---

### 1.3 Database & ORM

| Technology | Version | Purpose | Installation |
|------------|---------|---------|--------------|
| **MongoDB** | 6.x / 7.x / 8.x | NoSQL database for flexibility | Cloud (Atlas) or self-hosted |
| **Mongoose** | 9.1.5 | MongoDB ODM with schema validation | `npm install mongoose` |

**Why Mongoose 9?**
- Latest stable version (published January 20, 2026)
- Compatible with MongoDB 6.x, 7.x, and 8.x
- TypeScript support improvements
- Active LTS support until February 2027

**MongoDB Compatibility:**
- Mongoose `^9.0.0` supports MongoDB Server 8.x
- Mongoose `^8.7.0` also supports MongoDB Server 8.x
- Use MongoDB Atlas for managed hosting or self-host

---

### 1.4 Data Fetching & State Management

| Technology | Version | Purpose | Installation |
|------------|---------|---------|--------------|
| **TanStack Query** | 5.90.20 | Server state management | `npm install @tanstack/react-query` |
| **TanStack Query DevTools** | 5.x | Debugging and inspection | `npm install @tanstack/react-query-devtools` |

**Why TanStack Query over SWR?**

| Feature | TanStack Query v5 | SWR v2 |
|---------|-------------------|--------|
| **Bundle Size** | ~16KB | ~5KB |
| **Features** | Extensive (pagination, infinite queries, mutations) | Minimal (core fetching) |
| **DevTools** | Built-in official DevTools | No native DevTools |
| **Customization** | Highly configurable | Simpler API |
| **RSC Support** | Enhanced in v5+ | Supported |
| **Garbage Collection** | Automatic cache management | No automatic GC |
| **Best For** | Complex server state, advanced features | Simple data fetching, small bundles |

**Decision:** Use **TanStack Query v5** for WorkflowOps because:
- Complex server state management (workflows, executions, analytics)
- Need for pagination and infinite scrolling
- Built-in DevTools for debugging
- Robust optimistic UI and mutation management
- Automatic cache garbage collection

---

### 1.5 Authentication

| Technology | Version | Purpose | Installation |
|------------|---------|---------|--------------|
| **Auth.js (NextAuth v5)** | 5.x | Authentication for Next.js | `npm install next-auth@beta` |
| **bcryptjs** | 2.x | Password hashing | `npm install bcryptjs` |
| **@types/bcryptjs** | 2.x | TypeScript types | `npm install -D @types/bcryptjs` |

**Why Auth.js v5?**
- Formerly NextAuth.js, now framework-agnostic
- Enhanced TypeScript support
- Unified API across frameworks
- Improved security and performance
- Minimum Next.js version: 14.0 (compatible with Next.js 16)
- Smaller client bundle size

> [!NOTE]
> Auth.js v5 is the recommended version for new projects. The npm package `next-auth@4.24.13` is the latest v4, but v5 is the current focus.

---

### 1.6 Security & Encryption

| Technology | Version | Purpose | Installation |
|------------|---------|---------|--------------|
| **Node.js Crypto** | Built-in | API key encryption (AES-256) | Native module |
| **jsonwebtoken** | 9.x | JWT token generation | `npm install jsonwebtoken` |
| **@types/jsonwebtoken** | 9.x | TypeScript types | `npm install -D @types/jsonwebtoken` |

**Why Node.js Crypto over crypto-js?**
- Native Node.js module (no external dependency)
- Better performance
- More secure (regularly updated with Node.js)
- Built-in support for AES-256-GCM

**Encryption Strategy:**
```typescript
// lib/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex'); // 32 bytes

export function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
}

export function decrypt(encryptedData: string): string {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
  
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

---

### 1.7 Development Tools

| Technology | Version | Purpose | Installation |
|------------|---------|---------|--------------|
| **ESLint** | 9.x | Code linting | Included with Next.js |
| **Prettier** | 3.x | Code formatting | `npm install -D prettier` |
| **TypeScript ESLint** | 8.x | TypeScript linting | `npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin` |

---

## 2. n8n Public API Reference

### 2.1 API Overview

**Base URL:** `https://<your-n8n-instance>.com/api/v1`

**Authentication:**
- **Method:** API Key (Bearer Token)
- **Header:** `X-N8N-API-KEY: <your-api-key>`

**API Key Generation:**
1. Log in to your n8n instance
2. Navigate to **Settings > n8n API**
3. Select **Create an API key**
4. Provide a label and expiration time
5. (Enterprise only) Define scopes for permissions
6. Copy the generated API key

> [!WARNING]
> API access is NOT available during n8n free trial period. Requires paid plan or self-hosted instance.

---

### 2.2 Workflows Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| **GET** | `/workflows` | List all workflows | None | Array of workflow objects |
| **GET** | `/workflows/{id}` | Get workflow details | None | Single workflow object |
| **POST** | `/workflows` | Create new workflow | Workflow object | Created workflow |
| **PUT** | `/workflows/{id}` | Update workflow | Updated workflow object | Updated workflow |
| **DELETE** | `/workflows/{id}` | Delete workflow | None | Success message |
| **POST** | `/workflows/{id}/activate` | Activate workflow | None | Activated workflow |
| **POST** | `/workflows/{id}/deactivate` | Deactivate workflow | None | Deactivated workflow |

**Example: Get All Workflows**
```typescript
const response = await fetch('https://n8n.example.com/api/v1/workflows', {
  headers: {
    'X-N8N-API-KEY': process.env.N8N_API_KEY!
  }
});

const workflows = await response.json();
```

**Example Workflow Object:**
```json
{
  "id": "1",
  "name": "My Workflow",
  "active": true,
  "nodes": [...],
  "connections": {...},
  "settings": {...},
  "staticData": null,
  "tags": [],
  "createdAt": "2026-01-28T10:00:00.000Z",
  "updatedAt": "2026-01-28T14:00:00.000Z"
}
```

---

### 2.3 Executions Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| **GET** | `/executions` | List all executions | Query params (filters) | Array of execution objects |
| **GET** | `/executions/{id}` | Get execution details | None | Single execution object |
| **DELETE** | `/executions/{id}` | Delete execution | None | Success message |
| **POST** | `/executions/{id}/retry` | Retry failed execution | None | New execution object |

**Query Parameters for GET /executions:**
- `workflowId` — Filter by workflow ID
- `status` — Filter by status (`success`, `error`, `waiting`)
- `limit` — Number of results (default: 20, max: 250)
- `cursor` — Pagination cursor

**Example: Get Executions for a Workflow**
```typescript
const response = await fetch(
  'https://n8n.example.com/api/v1/executions?workflowId=1&limit=100',
  {
    headers: {
      'X-N8N-API-KEY': process.env.N8N_API_KEY!
    }
  }
);

const executions = await response.json();
```

**Example Execution Object:**
```json
{
  "id": "123",
  "workflowId": "1",
  "mode": "trigger",
  "retryOf": null,
  "retrySuccessId": null,
  "startedAt": "2026-01-28T14:30:00.000Z",
  "stoppedAt": "2026-01-28T14:30:05.000Z",
  "finished": true,
  "status": "success",
  "data": {
    "resultData": {...},
    "executionData": {...}
  }
}
```

---

### 2.4 Users Endpoints (Admin Only)

| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| **GET** | `/users` | List all users | Instance owner only |
| **GET** | `/users/{id}` | Get user details | Instance owner only |
| **PATCH** | `/users/{id}/role` | Update user role | Instance owner only |

> [!CAUTION]
> User endpoints are restricted to the instance owner. Attempting to access without proper permissions will result in 403 Forbidden.

---

### 2.5 API Rate Limits & Best Practices

**Rate Limiting:**
- n8n does not publicly document specific rate limits
- Implement caching to minimize API calls
- Use pagination for large datasets
- Monitor response headers for rate limit information

**Best Practices:**
1. **Cache Aggressively:** Store workflow and execution data for 5-10 minutes
2. **Batch Requests:** Fetch multiple workflows/executions in single calls when possible
3. **Error Handling:** Implement exponential backoff for failed requests
4. **Pagination:** Use cursor-based pagination for executions
5. **Webhook Alternative:** Consider n8n webhooks for real-time updates instead of polling

---

## 3. Official Documentation Links

### 3.1 Framework & Core

| Technology | Documentation URL |
|------------|-------------------|
| **Next.js 16** | https://nextjs.org/docs |
| **Next.js App Router** | https://nextjs.org/docs/app |
| **React 19** | https://react.dev/ |
| **TypeScript** | https://www.typescriptlang.org/docs/ |

### 3.2 Styling & UI

| Technology | Documentation URL |
|------------|-------------------|
| **Tailwind CSS v4** | https://tailwindcss.com/docs |
| **Lucide React** | https://lucide.dev/guide/packages/lucide-react |
| **Recharts** | https://recharts.org/en-US/ |

### 3.3 Database & ORM

| Technology | Documentation URL |
|------------|-------------------|
| **MongoDB** | https://www.mongodb.com/docs/ |
| **Mongoose** | https://mongoosejs.com/docs/ |
| **Mongoose Schemas** | https://mongoosejs.com/docs/guide.html |
| **Mongoose Validation** | https://mongoosejs.com/docs/validation.html |

### 3.4 Data Fetching & State

| Technology | Documentation URL |
|------------|-------------------|
| **TanStack Query** | https://tanstack.com/query/latest |
| **TanStack Query DevTools** | https://tanstack.com/query/latest/docs/framework/react/devtools |
| **React Query Mutations** | https://tanstack.com/query/latest/docs/framework/react/guides/mutations |

### 3.5 Authentication & Security

| Technology | Documentation URL |
|------------|-------------------|
| **Auth.js (NextAuth v5)** | https://authjs.dev/ |
| **Auth.js Migration Guide** | https://authjs.dev/getting-started/migrating-to-v5 |
| **Node.js Crypto** | https://nodejs.org/api/crypto.html |
| **bcryptjs** | https://www.npmjs.com/package/bcryptjs |

### 3.6 n8n API

| Resource | Documentation URL |
|----------|-------------------|
| **n8n Public API** | https://docs.n8n.io/api/ |
| **n8n API OpenAPI Spec (JSON)** | https://docs.n8n.io/api/openapi.json |
| **n8n API OpenAPI Spec (YAML)** | https://docs.n8n.io/api/openapi.yaml |
| **n8n Authentication** | https://docs.n8n.io/api/authentication/ |

---

## 4. Environment Variables

### 4.1 Required Environment Variables

Create a `.env.local` file in your project root:

```bash
# Database
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority

# Authentication (Auth.js)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>

# Encryption (API Key Vaulting)
ENCRYPTION_KEY=<generate-with-openssl-rand-hex-32>

# Environment
NODE_ENV=development

# n8n API (for testing)
N8N_TEST_INSTANCE_URL=https://n8n.example.com
N8N_TEST_API_KEY=<your-test-api-key>
```

### 4.2 Generating Secrets

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

**Generate ENCRYPTION_KEY (32 bytes = 64 hex characters):**
```bash
openssl rand -hex 32
```

### 4.3 Environment Variable Validation

Create `lib/env.ts` for runtime validation:

```typescript
// lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  MONGODB_URI: z.string().url(),
  NEXTAUTH_URL: z.string().url(),
  NEXTAUTH_SECRET: z.string().min(32),
  ENCRYPTION_KEY: z.string().length(64), // 32 bytes in hex
  NODE_ENV: z.enum(['development', 'production', 'test']),
});

export const env = envSchema.parse(process.env);
```

---

## 5. Package Installation Commands

### 5.1 Initialize Next.js Project

```bash
npx create-next-app@latest workflowops --typescript --tailwind --app --src-dir --import-alias "@/*"
cd workflowops
```

### 5.2 Install Core Dependencies

```bash
npm install mongoose@9.1.5
npm install @tanstack/react-query@5.90.20
npm install next-auth@beta
npm install bcryptjs
npm install jsonwebtoken
npm install recharts@3.7.0
npm install lucide-react@0.563.0
npm install zod
```

### 5.3 Install Dev Dependencies

```bash
npm install -D @tanstack/react-query-devtools
npm install -D @types/bcryptjs
npm install -D @types/jsonwebtoken
npm install -D prettier
npm install -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

### 5.4 Complete package.json Dependencies

```json
{
  "dependencies": {
    "next": "^16.1.5",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "mongoose": "^9.1.5",
    "@tanstack/react-query": "^5.90.20",
    "next-auth": "^5.0.0-beta",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "recharts": "^3.7.0",
    "lucide-react": "^0.563.0",
    "zod": "^3.23.8",
    "tailwindcss": "^4.1.18"
  },
  "devDependencies": {
    "@tanstack/react-query-devtools": "^5.90.20",
    "@types/bcryptjs": "^2.4.6",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "prettier": "^3.0.0",
    "@typescript-eslint/parser": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^8.0.0",
    "eslint": "^9.0.0",
    "eslint-config-next": "^16.1.5"
  }
}
```

---

## 6. Additional Resources

### 6.1 Learning Resources

| Topic | Resource | URL |
|-------|----------|-----|
| **Next.js 16 Features** | Official Blog Post | https://nextjs.org/blog/next-16 |
| **TanStack Query Tutorial** | Official Docs | https://tanstack.com/query/latest/docs/framework/react/overview |
| **Mongoose Best Practices** | Official Guide | https://mongoosejs.com/docs/guide.html |
| **n8n API Examples** | Community Forum | https://community.n8n.io/ |

### 6.2 Code Examples & Boilerplates

| Resource | Description | URL |
|----------|-------------|-----|
| **Next.js Examples** | Official example projects | https://github.com/vercel/next.js/tree/canary/examples |
| **TanStack Query Examples** | Query patterns and recipes | https://tanstack.com/query/latest/docs/framework/react/examples |
| **Auth.js Examples** | Authentication patterns | https://github.com/nextauthjs/next-auth-example |

### 6.3 Tools & Utilities

| Tool | Purpose | URL |
|------|---------|-----|
| **MongoDB Compass** | GUI for MongoDB | https://www.mongodb.com/products/compass |
| **Postman** | API testing | https://www.postman.com/ |
| **n8n OpenAPI Viewer** | Interactive API docs | https://docs.n8n.io/api/ |

---

## 7. Version Compatibility Matrix

| Next.js | React | Node.js | TypeScript | Mongoose | MongoDB |
|---------|-------|---------|------------|----------|---------|
| 16.x | 19.x | 20.x LTS | 5.x | 9.x | 6.x / 7.x / 8.x |
| 15.x | 18.x / 19.x | 18.x / 20.x | 5.x | 8.x / 9.x | 6.x / 7.x / 8.x |

---

## 8. Next Steps

With the tech stack finalized and resources gathered, the project is ready for **Stage 3: Architecture Roadmap (Architect Agent)**.

The Architect Agent should:
1. Design the folder structure based on Next.js 16 App Router conventions
2. Define database schemas using Mongoose 9 syntax
3. Specify API contracts for Next.js Route Handlers
4. Create the frontend component tree

---

**Document Status:** ✅ Complete  
**Stage 2 Status:** ✅ Complete  
**Ready for:** Stage 3 (Architect Agent)  
**Next Deliverable:** `docs/ARCHITECTURE.md`
