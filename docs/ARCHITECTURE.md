# 🏗️ Architecture Roadmap

**Project:** WorkflowOps — n8n Management & Observability Dashboard  
**Purpose:** System architecture, folder structure, database schemas, and API contracts  
**Date:** January 28, 2026  
**Agent:** Architect (Stage 3)

---

## 1. Folder Structure

### 1.1 Complete Project Structure

```
workflowops/
├── .next/                          # Next.js build output (gitignored)
├── .git/                           # Git repository
├── node_modules/                   # Dependencies (gitignored)
├── public/                         # Static assets
│   ├── favicon.ico
│   ├── logo.svg
│   └── images/
├── src/                            # Source code
│   ├── app/                        # Next.js 16 App Router
│   │   ├── (auth)/                 # Auth route group
│   │   │   ├── login/
│   │   │   │   └── page.tsx        # Login page
│   │   │   └── register/
│   │   │       └── page.tsx        # Registration page
│   │   ├── (dashboard)/            # Dashboard route group (requires auth)
│   │   │   ├── layout.tsx          # Dashboard layout with sidebar
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx        # Main dashboard page
│   │   │   ├── workflows/
│   │   │   │   ├── page.tsx        # Workflows list page
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Single workflow details
│   │   │   ├── executions/
│   │   │   │   ├── page.tsx        # Executions history page
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx    # Single execution details
│   │   │   ├── analytics/
│   │   │   │   └── page.tsx        # Analytics & insights page
│   │   │   ├── instances/
│   │   │   │   ├── page.tsx        # Instance management page
│   │   │   │   └── new/
│   │   │   │       └── page.tsx    # Add new instance
│   │   │   ├── audit/
│   │   │   │   └── page.tsx        # Audit logs (admin only)
│   │   │   └── settings/
│   │   │       └── page.tsx        # User settings
│   │   ├── api/                    # API routes
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/
│   │   │   │   │   └── route.ts    # NextAuth.js handler
│   │   │   │   ├── register/
│   │   │   │   │   └── route.ts    # POST /api/auth/register
│   │   │   │   └── me/
│   │   │   │       └── route.ts    # GET /api/auth/me
│   │   │   ├── instances/
│   │   │   │   ├── route.ts        # GET, POST /api/instances
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts    # GET, PUT, DELETE /api/instances/:id
│   │   │   ├── proxy/              # n8n API proxy routes
│   │   │   │   ├── workflows/
│   │   │   │   │   ├── route.ts    # GET /api/proxy/workflows
│   │   │   │   │   ├── bulk/
│   │   │   │   │   │   ├── activate/
│   │   │   │   │   │   │   └── route.ts       # POST /api/proxy/workflows/bulk/activate
│   │   │   │   │   │   └── deactivate/
│   │   │   │   │   │       └── route.ts       # POST /api/proxy/workflows/bulk/deactivate
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── route.ts           # GET, PUT /api/proxy/workflows/:id
│   │   │   │   │       ├── activate/
│   │   │   │   │       │   └── route.ts       # POST /api/proxy/workflows/:id/activate
│   │   │   │   │       └── deactivate/
│   │   │   │   │           └── route.ts       # POST /api/proxy/workflows/:id/deactivate
│   │   │   │   └── executions/
│   │   │   │       ├── route.ts    # GET /api/proxy/executions
│   │   │   │       └── [id]/
│   │   │   │           ├── route.ts           # GET, DELETE /api/proxy/executions/:id
│   │   │   │           └── retry/
│   │   │   │               └── route.ts       # POST /api/proxy/executions/:id/retry
│   │   │   ├── analytics/
│   │   │   │   ├── stats/
│   │   │   │   │   └── route.ts    # GET /api/analytics/stats
│   │   │   │   └── costs/
│   │   │   │       └── route.ts    # GET /api/analytics/costs
│   │   │   ├── webhooks/
│   │   │   │   └── n8n/
│   │   │   │       └── route.ts    # POST /api/webhooks/n8n
│   │   │   ├── system/
│   │   │   │   └── health/
│   │   │   │       └── route.ts    # GET /api/system/health
│   │   │   └── audit-logs/
│   │   │       └── route.ts        # GET /api/audit-logs
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Home page (redirects to dashboard or login)
│   │   ├── globals.css             # Global styles (Tailwind imports)
│   │   └── providers.tsx           # Client-side providers (TanStack Query)
│   ├── components/                 # React components
│   │   ├── ui/                     # Atomic UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Toast.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Checkbox.tsx
│   │   │   └── Alert.tsx
│   │   ├── layout/                 # Layout components
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── Footer.tsx
│   │   ├── features/               # Feature-specific components
│   │   │   ├── workflows/
│   │   │   │   ├── WorkflowTable.tsx
│   │   │   │   ├── WorkflowCard.tsx
│   │   │   │   ├── WorkflowStatusBadge.tsx
│   │   │   │   ├── WorkflowToggle.tsx
│   │   │   │   ├── BulkActionBar.tsx          # NEW: Bulk operations toolbar
│   │   │   │   └── WorkflowSelection.tsx      # NEW: Multi-select state
│   │   │   ├── executions/
│   │   │   │   ├── ExecutionHistory.tsx
│   │   │   │   ├── ExecutionTimeline.tsx
│   │   │   │   ├── ExecutionDetails.tsx
│   │   │   │   ├── ExecutionStatusBadge.tsx
│   │   │   │   └── RetryButton.tsx            # NEW: Retry execution
│   │   │   ├── analytics/
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── SuccessRateChart.tsx
│   │   │   │   ├── TrafficChart.tsx
│   │   │   │   ├── CostBreakdown.tsx
│   │   │   │   └── MetricCard.tsx
│   │   │   ├── instances/
│   │   │   │   ├── InstanceCard.tsx
│   │   │   │   ├── InstanceForm.tsx
│   │   │   │   └── InstanceHealthBadge.tsx
│   │   │   ├── audit/
│   │   │   │   ├── AuditLogTable.tsx
│   │   │   │   └── AuditLogEntry.tsx
│   │   │   └── system/                        # NEW: System features
│   │   │       └── HealthStatus.tsx           # System health widget
│   │   └── shared/                 # Shared components
│   │       ├── ErrorBoundary.tsx
│   │       ├── LoadingState.tsx
│   │       └── EmptyState.tsx
│   ├── lib/                        # Utility functions and configurations
│   │   ├── db.ts                   # MongoDB connection
│   │   ├── auth.ts                 # Auth.js configuration
│   │   ├── encryption.ts           # API key encryption/decryption
│   │   ├── rbac.ts                 # Role-based access control utilities
│   │   ├── redaction.ts            # PII redaction utilities
│   │   ├── env.ts                  # Environment variable validation
│   │   ├── logger.ts               # NEW: Structured logging (Winston/Pino)
│   │   └── utils.ts                # General utilities
│   ├── models/                     # Mongoose schemas
│   │   ├── User.ts                 # User model
│   │   ├── Instance.ts             # n8n Instance model
│   │   ├── ExecutionCache.ts       # Execution cache model
│   │   ├── AuditLog.ts             # Audit log model
│   │   ├── RetentionPolicy.ts      # Retention policy model
│   │   └── WebhookEvent.ts         # NEW: Webhook event log
│   ├── services/                   # Business logic layer
│   │   ├── n8n.ts                  # n8n API service
│   │   ├── cache.ts                # Cache service
│   │   ├── analytics.ts            # Analytics computation service
│   │   ├── audit.ts                # Audit logging service
│   │   ├── retention.ts            # Data retention service
│   │   └── webhook.ts              # NEW: Webhook processing service
│   ├── jobs/                       # NEW: Background jobs
│   │   ├── scheduler.ts            # Job scheduler (node-cron)
│   │   ├── retentionJob.ts         # Data pruning job
│   │   ├── healthCheckJob.ts       # Instance health check job
│   │   └── cacheWarmupJob.ts       # Cache warming job
│   ├── hooks/                      # Custom React hooks
│   │   ├── useWorkflows.ts         # Fetch workflows
│   │   ├── useExecutions.ts        # Fetch executions
│   │   ├── useAnalytics.ts         # Fetch analytics
│   │   ├── useInstances.ts         # Fetch instances
│   │   ├── useAuth.ts              # Authentication state
│   │   ├── useToast.ts             # Toast notifications
│   │   └── useBulkSelection.ts     # NEW: Bulk selection state
│   ├── types/                      # TypeScript type definitions
│   │   ├── api.ts                  # API request/response types
│   │   ├── models.ts               # Database model types
│   │   ├── n8n.ts                  # n8n API types
│   │   └── index.ts                # Barrel exports
│   └── middleware.ts               # Next.js middleware (auth protection)
├── docs/                           # Documentation
│   ├── VISION.md                   # Stage 1: Product vision
│   ├── DEV_RESOURCES.md            # Stage 2: Tech stack
│   ├── ARCHITECTURE.md             # Stage 3: This document
│   ├── GAP_ANALYSIS.md             # Gap analysis report
│   └── task.md                     # Task breakdown
├── .env.local                      # Environment variables (gitignored)
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore file
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── next.config.js                  # Next.js configuration
├── tailwind.config.ts              # Tailwind CSS configuration
├── tsconfig.json                   # TypeScript configuration
├── package.json                    # Dependencies
├── package-lock.json               # Dependency lock file
└── README.md                       # Project README
```

### 1.2 Key Architectural Decisions

#### Route Groups
- `(auth)` — Authentication pages (login, register) without dashboard layout
- `(dashboard)` — Protected pages with sidebar and header layout

#### API Organization
- `/api/auth` — Authentication endpoints
- `/api/instances` — Instance management (CRUD)
- `/api/proxy` — n8n API proxy (workflows, executions)
  - `/api/proxy/workflows/bulk` — **NEW:** Bulk workflow operations
  - `/api/proxy/executions/[id]/retry` — **NEW:** Retry failed executions
- `/api/analytics` — Analytics and cost computation
- `/api/webhooks` — **NEW:** Webhook receivers (n8n events)
- `/api/system` — **NEW:** System health and monitoring
- `/api/audit-logs` — Audit trail access

#### Component Organization
- `ui/` — Reusable atomic components (Button, Card, etc.)
- `layout/` — Layout components (Sidebar, Header)
- `features/` — Feature-specific components organized by domain
- `shared/` — Shared utility components (ErrorBoundary, LoadingState)

---

## 2. Database Schemas

### 2.1 User Schema

```typescript
// src/models/User.ts
import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'viewer' | 'operator' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['viewer', 'operator', 'admin'],
      default: 'viewer',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
```

**Indexes:**
- `email` (unique)

**Roles:**
- `viewer` — Read-only access to workflows and executions
- `operator` — Can activate/deactivate workflows
- `admin` — Full access including user management and audit logs

---

### 2.2 Instance Schema

```typescript
// src/models/Instance.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IInstance extends Document {
  userId: Types.ObjectId;
  name: string;
  url: string;
  encryptedApiKey: string; // Encrypted with AES-256-GCM
  isActive: boolean;
  lastHealthCheck: Date | null;
  healthStatus: 'healthy' | 'unhealthy' | 'unknown';
  createdAt: Date;
  updatedAt: Date;
}

const InstanceSchema = new Schema<IInstance>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    encryptedApiKey: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastHealthCheck: {
      type: Date,
      default: null,
    },
    healthStatus: {
      type: String,
      enum: ['healthy', 'unhealthy', 'unknown'],
      default: 'unknown',
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for user's instances
InstanceSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.Instance || mongoose.model<IInstance>('Instance', InstanceSchema);
```

**Indexes:**
- `userId` (for querying user's instances)
- `{ userId, createdAt }` (compound, for sorted queries)

---

### 2.3 ExecutionCache Schema

```typescript
// src/models/ExecutionCache.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IExecutionCache extends Document {
  instanceId: Types.ObjectId;
  workflowId: string; // n8n workflow ID
  executions: Array<{
    id: string;
    status: 'success' | 'error' | 'waiting';
    startedAt: Date;
    stoppedAt: Date | null;
    duration: number | null; // milliseconds
    redactedData: any; // Redacted execution data
  }>;
  cachedAt: Date;
  expiresAt: Date;
}

const ExecutionCacheSchema = new Schema<IExecutionCache>(
  {
    instanceId: {
      type: Schema.Types.ObjectId,
      ref: 'Instance',
      required: true,
      index: true,
    },
    workflowId: {
      type: String,
      required: true,
      index: true,
    },
    executions: [
      {
        id: { type: String, required: true },
        status: {
          type: String,
          enum: ['success', 'error', 'waiting'],
          required: true,
        },
        startedAt: { type: Date, required: true },
        stoppedAt: { type: Date, default: null },
        duration: { type: Number, default: null },
        redactedData: { type: Schema.Types.Mixed },
      },
    ],
    cachedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compound index for cache lookups
ExecutionCacheSchema.index({ instanceId: 1, workflowId: 1 });

// TTL index for automatic expiration
ExecutionCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.ExecutionCache || 
  mongoose.model<IExecutionCache>('ExecutionCache', ExecutionCacheSchema);
```

**Indexes:**
- `instanceId`
- `workflowId`
- `{ instanceId, workflowId }` (compound, for cache lookups)
- `expiresAt` (TTL index for automatic cleanup)

**Cache Strategy:**
- Cache expires after 5-10 minutes (configurable)
- MongoDB TTL index automatically removes expired documents

---

### 2.4 AuditLog Schema

```typescript
// src/models/AuditLog.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  userId: Types.ObjectId;
  action: string; // e.g., 'workflow.activate', 'execution.view', 'instance.create'
  resource: string; // e.g., 'workflow:123', 'instance:abc'
  instanceId: Types.ObjectId | null;
  metadata: Record<string, any>;
  ipAddress: string | null;
  userAgent: string | null;
  timestamp: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    resource: {
      type: String,
      required: true,
    },
    instanceId: {
      type: Schema.Types.ObjectId,
      ref: 'Instance',
      default: null,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compound indexes for common queries
AuditLogSchema.index({ userId: 1, timestamp: -1 });
AuditLogSchema.index({ instanceId: 1, timestamp: -1 });
AuditLogSchema.index({ action: 1, timestamp: -1 });

export default mongoose.models.AuditLog || 
  mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
```

**Indexes:**
- `userId`
- `action`
- `instanceId`
- `timestamp`
- `{ userId, timestamp }` (compound)
- `{ instanceId, timestamp }` (compound)
- `{ action, timestamp }` (compound)

**Immutability:**
- Audit logs are never updated or deleted (append-only)
- Retention policies may archive old logs

---

### 2.5 RetentionPolicy Schema

```typescript
// src/models/RetentionPolicy.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IRetentionPolicy extends Document {
  instanceId: Types.ObjectId;
  workflowId: string | null; // null = applies to all workflows
  retentionDays: number; // 7, 30, 90, etc.
  applyToExecutions: boolean;
  applyToAuditLogs: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const RetentionPolicySchema = new Schema<IRetentionPolicy>(
  {
    instanceId: {
      type: Schema.Types.ObjectId,
      ref: 'Instance',
      required: true,
      index: true,
    },
    workflowId: {
      type: String,
      default: null,
    },
    retentionDays: {
      type: Number,
      required: true,
      min: 1,
      max: 365,
    },
    applyToExecutions: {
      type: Boolean,
      default: true,
    },
    applyToAuditLogs: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for policy lookups
RetentionPolicySchema.index({ instanceId: 1, workflowId: 1 });

export default mongoose.models.RetentionPolicy || 
  mongoose.model<IRetentionPolicy>('RetentionPolicy', RetentionPolicySchema);
```

**Indexes:**
- `instanceId`
- `{ instanceId, workflowId }` (compound)

**Policy Application:**
- `workflowId: null` — Default policy for all workflows in instance
- `workflowId: "123"` — Specific policy for workflow 123

---

### 2.6 WebhookEvent Schema (New)

```typescript
// src/models/WebhookEvent.ts
import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IWebhookEvent extends Document {
  instanceId: Types.ObjectId;
  eventType: string; // e.g., 'execution.finished', 'execution.started'
  payload: any;
  processed: boolean;
  receivedAt: Date;
}

const WebhookEventSchema = new Schema<IWebhookEvent>(
  {
    instanceId: {
      type: Schema.Types.ObjectId,
      ref: 'Instance',
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },
    processed: {
      type: Boolean,
      default: false,
      index: true,
    },
    receivedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// TTL index to auto-delete processed events after 7 days
WebhookEventSchema.index({ receivedAt: 1 }, { expireAfterSeconds: 604800 });

export default mongoose.models.WebhookEvent || 
  mongoose.model<IWebhookEvent>('WebhookEvent', WebhookEventSchema);
```

**Indexes:**
- `instanceId`
- `processed`
- `receivedAt` (TTL)

---

## 3. API Contracts

### 3.1 Authentication Endpoints

#### POST /api/auth/register

**Request:**
```typescript
{
  email: string;
  password: string;
  name: string;
}
```

**Response (201 Created):**
```typescript
{
  success: true;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'viewer' | 'operator' | 'admin';
  };
}
```

**Errors:**
- `400` — Validation error
- `409` — Email already exists

---

#### GET /api/auth/me

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```typescript
{
  success: true;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'viewer' | 'operator' | 'admin';
  };
}
```

**Errors:**
- `401` — Unauthorized

---

### 3.2 Instance Management Endpoints

#### GET /api/instances

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response (200 OK):**
```typescript
{
  success: true;
  instances: Array<{
    id: string;
    name: string;
    url: string;
    isActive: boolean;
    healthStatus: 'healthy' | 'unhealthy' | 'unknown';
    lastHealthCheck: string | null;
    createdAt: string;
  }>;
}
```

---

#### POST /api/instances

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request:**
```typescript
{
  name: string;
  url: string;
  apiKey: string; // Will be encrypted before storage
}
```

**Response (201 Created):**
```typescript
{
  success: true;
  instance: {
    id: string;
    name: string;
    url: string;
    isActive: boolean;
    healthStatus: 'unknown';
    createdAt: string;
  };
}
```

**Errors:**
- `400` — Validation error
- `401` — Unauthorized

---

#### GET /api/instances/[id]

**Response (200 OK):**
```typescript
{
  success: true;
  instance: {
    id: string;
    name: string;
    url: string;
    isActive: boolean;
    healthStatus: 'healthy' | 'unhealthy' | 'unknown';
    lastHealthCheck: string | null;
    createdAt: string;
    updatedAt: string;
  };
}
```

**Errors:**
- `404` — Instance not found
- `403` — Forbidden (not owner)

---

### 3.3 n8n Proxy Endpoints

#### GET /api/proxy/workflows

**Headers:**
```
Authorization: Bearer <jwt_token>
X-Instance-Id: <instance_id>
```

**Query Parameters:**
```
?limit=50&offset=0
```

**Response (200 OK):**
```typescript
{
  success: true;
  workflows: Array<{
    id: string;
    name: string;
    active: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  }>;
  total: number;
}
```

**Errors:**
- `401` — Unauthorized
- `403` — Forbidden (insufficient permissions)
- `404` — Instance not found
- `502` — n8n API error

---

#### POST /api/proxy/workflows/[id]/activate

**Headers:**
```
Authorization: Bearer <jwt_token>
X-Instance-Id: <instance_id>
```

**Response (200 OK):**
```typescript
{
  success: true;
  workflow: {
    id: string;
    name: string;
    active: true;
    updatedAt: string;
  };
}
```

**Errors:**
- `401` — Unauthorized
- `403` — Forbidden (requires 'operator' or 'admin' role)
- `404` — Workflow not found
- `502` — n8n API error

**Audit Log:**
- Action: `workflow.activate`
- Resource: `workflow:{id}`

---

#### GET /api/proxy/executions

**Headers:**
```
Authorization: Bearer <jwt_token>
X-Instance-Id: <instance_id>
```

**Query Parameters:**
```
?workflowId=123&status=success&limit=100&cursor=abc
```

**Response (200 OK):**
```typescript
{
  success: true;
  executions: Array<{
    id: string;
    workflowId: string;
    status: 'success' | 'error' | 'waiting';
    startedAt: string;
    stoppedAt: string | null;
    duration: number | null; // milliseconds
  }>;
  nextCursor: string | null;
}
```

**Cache Strategy:**
- Check `ExecutionCache` collection first
- If cache miss or stale, fetch from n8n API
- Store in cache with 5-minute TTL

---

### 3.4 Analytics Endpoints

#### GET /api/analytics/stats

**Headers:**
```
Authorization: Bearer <jwt_token>
X-Instance-Id: <instance_id>
```

**Query Parameters:**
```
?timeRange=24h&workflowId=123
```

**Response (200 OK):**
```typescript
{
  success: true;
  stats: {
    totalExecutions: number;
    successRate: number; // percentage
    errorRate: number; // percentage
    avgDuration: number; // milliseconds
    executionsByHour: Array<{
      hour: string; // ISO timestamp
      count: number;
      successCount: number;
      errorCount: number;
    }>;
  };
}
```

---

#### GET /api/analytics/costs

**Headers:**
```
Authorization: Bearer <jwt_token>
X-Instance-Id: <instance_id>
```

**Query Parameters:**
```
?timeRange=30d
```

**Response (200 OK):**
```typescript
{
  success: true;
  costs: {
    totalCost: number;
    costPerWorkflow: Array<{
      workflowId: string;
      workflowName: string;
      executionCount: number;
      totalDuration: number; // milliseconds
      estimatedCost: number;
    }>;
  };
}
```

**Cost Calculation:**
```
cost = (executionCount × executionCost) + (totalDuration × runtimeCost)
```

---

### 3.5 Audit Log Endpoints

#### GET /api/audit-logs

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
```
?userId=abc&action=workflow.activate&limit=50&offset=0
```

**Response (200 OK):**
```typescript
{
  success: true;
  logs: Array<{
    id: string;
    userId: string;
    userName: string;
    action: string;
    resource: string;
    timestamp: string;
    metadata: Record<string, any>;
  }>;
  total: number;
}
```

**Errors:**
- `403` — Forbidden (requires 'admin' role)

---

### 3.6 Bulk Operations (New)

#### POST /api/proxy/workflows/bulk/activate

**Headers:**
```
Authorization: Bearer <jwt_token>
X-Instance-Id: <instance_id>
```

**Request:**
```typescript
{
  workflowIds: string[];
}
```

**Response (200 OK):**
```typescript
{
  success: true;
  results: {
    activated: number;
    failed: number;
    details: Array<{
      workflowId: string;
      status: 'success' | 'error';
      error?: string;
    }>;
  };
}
```

---

#### POST /api/proxy/workflows/bulk/deactivate

**Headers:**
```
Authorization: Bearer <jwt_token>
X-Instance-Id: <instance_id>
```

**Request:**
```typescript
{
  workflowIds: string[];
}
```

**Response (200 OK):**
```typescript
{
  success: true;
  results: {
    deactivated: number;
    failed: number;
    details: Array<{
      workflowId: string;
      status: 'success' | 'error';
      error?: string;
    }>;
  };
}
```

---

### 3.7 Execution Retry (New)

#### POST /api/proxy/executions/[id]/retry

**Headers:**
```
Authorization: Bearer <jwt_token>
X-Instance-Id: <instance_id>
```

**Response (200 OK):**
```typescript
{
  success: true;
  executionId: string; // The NEW execution ID
}
```

---

### 3.8 Webhooks (New)

#### POST /api/webhooks/n8n

**Headers:**
```
X-N8N-Webhook-Signature: <signature>
```

**Request:**
```typescript
{
  event: 'execution.finished' | 'execution.started';
  payload: any;
}
```

**Response (200 OK):**
```typescript
{
  received: true;
}
```

---

### 3.9 System Health (New)

#### GET /api/system/health

**Response (200 OK):**
```typescript
{
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: { status: 'up' | 'down'; latency: number };
    n8n_instances: {
      total: number;
      healthy: number;
      unhealthy: number;
    };
    cache: { status: 'up' | 'down'; hitRate: number };
  };
}
```

---

## 4. Frontend Component Tree

### 4.1 Component Hierarchy

```
App
├── Providers (TanStack Query, Toast)
├── RootLayout
│   ├── (auth)
│   │   ├── LoginPage
│   │   │   ├── Card
│   │   │   ├── Input
│   │   │   └── Button
│   │   └── RegisterPage
│   │       ├── Card
│   │       ├── Input
│   │       └── Button
│   └── (dashboard)
│       ├── DashboardLayout
│       │   ├── Sidebar
│       │   │   ├── Logo
│       │   │   ├── NavItem (multiple)
│       │   │   └── UserMenu
│       │   ├── Header
│       │   │   ├── Breadcrumbs
│       │   │   └── UserAvatar
│       │   └── {children}
│       ├── DashboardPage
│       │   ├── StatsCard (multiple)
│       │   ├── SuccessRateChart
│       │   ├── TrafficChart
│       │   └── RecentExecutions
│       ├── WorkflowsPage
│       │   ├── WorkflowTable
│       │   │   ├── WorkflowRow (multiple)
│       │   │   │   ├── WorkflowStatusBadge
│       │   │   │   └── WorkflowToggle
│       │   │   └── Pagination
│       │   └── SearchBar
│       ├── ExecutionsPage
│       │   ├── ExecutionHistory
│       │   │   ├── ExecutionTimeline
│       │   │   └── ExecutionCard (multiple)
│       │   │       └── ExecutionStatusBadge
│       │   └── FilterBar
│       ├── AnalyticsPage
│       │   ├── MetricCard (multiple)
│       │   ├── SuccessRateChart
│       │   ├── TrafficChart
│       │   └── CostBreakdown
│       ├── InstancesPage
│       │   ├── InstanceCard (multiple)
│       │   │   └── InstanceHealthBadge
│       │   └── AddInstanceButton
│       ├── AuditPage (admin only)
│       │   ├── AuditLogTable
│       │   │   └── AuditLogEntry (multiple)
│       │   └── FilterBar
│       └── SettingsPage
│           ├── ProfileSection
│           └── PreferencesSection
```

### 4.2 Key Component Specifications

#### WorkflowTable

**Props:**
```typescript
interface WorkflowTableProps {
  instanceId: string;
}
```

**State:**
- Workflows list (from `useWorkflows` hook)
- Loading state
- Error state
- Optimistic updates for toggle actions

**Features:**
- Sortable columns (name, status, last execution)
- Search/filter
- Pagination
- Optimistic UI for activate/deactivate

---

#### SuccessRateChart

**Props:**
```typescript
interface SuccessRateChartProps {
  instanceId: string;
  workflowId?: string;
  timeRange: '24h' | '7d' | '30d';
}
```

**Data Source:**
- `useAnalytics` hook → `GET /api/analytics/stats`

**Chart Type:**
- Line chart (Recharts)
- X-axis: Time
- Y-axis: Success rate percentage

---

#### WorkflowToggle

**Props:**
```typescript
interface WorkflowToggleProps {
  workflowId: string;
  instanceId: string;
  initialActive: boolean;
  onToggle?: (active: boolean) => void;
}
```

**Behavior:**
- Optimistic UI update
- Calls `POST /api/proxy/workflows/{id}/activate` or `/deactivate`
- Reverts on error
- Shows toast notification

---

## 5. Authentication & Authorization Flow

### 5.1 Authentication Flow

```
1. User submits login form
   ↓
2. POST /api/auth/login (Auth.js)
   ↓
3. Validate credentials (bcrypt.compare)
   ↓
4. Generate JWT token
   ↓
5. Set HTTP-only cookie
   ↓
6. Redirect to /dashboard
```

### 5.2 Authorization Middleware

```typescript
// src/middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const path = req.nextUrl.pathname;
      
      // Public routes
      if (path.startsWith('/login') || path.startsWith('/register')) {
        return true;
      }
      
      // Protected routes require authentication
      if (!token) {
        return false;
      }
      
      // Admin-only routes
      if (path.startsWith('/audit')) {
        return token.role === 'admin';
      }
      
      // Operator and admin can activate/deactivate
      if (req.method === 'POST' && path.includes('/activate')) {
        return token.role === 'operator' || token.role === 'admin';
      }
      
      return true;
    },
  },
});

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/workflows/:path*',
    '/executions/:path*',
    '/analytics/:path*',
    '/instances/:path*',
    '/audit/:path*',
    '/settings/:path*',
    '/api/instances/:path*',
    '/api/proxy/:path*',
    '/api/analytics/:path*',
    '/api/audit-logs/:path*',
  ],
};
```

### 5.3 RBAC Permission Matrix

| Action | Viewer | Operator | Admin |
|--------|--------|----------|-------|
| View workflows | ✅ | ✅ | ✅ |
| View executions | ✅ | ✅ | ✅ |
| View analytics | ✅ | ✅ | ✅ |
| Activate/deactivate workflows | ❌ | ✅ | ✅ |
| Manage instances | ✅ (own) | ✅ (own) | ✅ (all) |
| View audit logs | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## 6. Data Flow Diagrams

### 6.1 Workflow Activation Flow

```
User clicks "Activate" toggle
  ↓
WorkflowToggle component
  ↓
Optimistic UI update (toggle immediately)
  ↓
POST /api/proxy/workflows/{id}/activate
  ↓
Middleware: Check auth & RBAC
  ↓
Route handler: Decrypt API key
  ↓
Call n8n API: POST /workflows/{id}/activate
  ↓
Log audit entry: workflow.activate
  ↓
Return success response
  ↓
TanStack Query: Invalidate cache
  ↓
UI: Confirm toggle state
  ↓
Toast: "Workflow activated successfully"
```

**Error Handling:**
- If n8n API fails → Revert optimistic update
- Show error toast
- Log error in audit trail

---

### 6.2 Execution Data Flow (with Caching)

```
User visits /executions page
  ↓
useExecutions hook
  ↓
GET /api/proxy/executions?workflowId=123
  ↓
Route handler: Check ExecutionCache
  ↓
Cache hit (< 5 min old)?
  ├─ YES → Return cached data
  └─ NO → Fetch from n8n API
       ↓
       Redact PII (emails, tokens)
       ↓
       Store in ExecutionCache (TTL: 5 min)
       ↓
       Return data
  ↓
TanStack Query: Cache in client
  ↓
ExecutionHistory component renders
```

---

## 7. Security Architecture

### 7.1 API Key Encryption

**Storage:**
```typescript
// When storing
const encrypted = encrypt(apiKey); // AES-256-GCM
instance.encryptedApiKey = encrypted;
await instance.save();

// When using
const apiKey = decrypt(instance.encryptedApiKey);
const response = await fetch(n8nUrl, {
  headers: { 'X-N8N-API-KEY': apiKey }
});
```

**Key Management:**
- Encryption key stored in `ENCRYPTION_KEY` environment variable
- 32-byte key (64 hex characters)
- Never exposed to client

---

### 7.2 PII Redaction

**Redacted Fields:**
- Email addresses
- API tokens
- Passwords
- Credit card numbers
- Phone numbers

**Implementation:**
```typescript
// src/lib/redaction.ts
export function redactExecutionData(data: any): any {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const tokenRegex = /\b[A-Za-z0-9_-]{20,}\b/g;
  
  const json = JSON.stringify(data);
  const redacted = json
    .replace(emailRegex, '[REDACTED_EMAIL]')
    .replace(tokenRegex, '[REDACTED_TOKEN]');
  
  return JSON.parse(redacted);
}
```

---

### 7.3 Audit Logging

**Logged Actions:**
- `workflow.view`
- `workflow.activate`
- `workflow.deactivate`
- `execution.view`
- `instance.create`
- `instance.update`
- `instance.delete`
- `user.login`
- `user.logout`

**Implementation:**
```typescript
// src/services/audit.ts
export async function logAction(
  userId: string,
  action: string,
  resource: string,
  metadata?: Record<string, any>
) {
  await AuditLog.create({
    userId,
    action,
    resource,
    metadata,
    timestamp: new Date(),
  });
}
```

---

## 8. Performance Optimizations

### 8.1 Caching Strategy

| Data Type | Cache Location | TTL | Invalidation |
|-----------|----------------|-----|--------------|
| Workflows | MongoDB (ExecutionCache) | 5 min | Manual (on update) |
| Executions | MongoDB (ExecutionCache) | 5 min | TTL index |
| Analytics | TanStack Query (client) | 2 min | Auto |
| User session | HTTP-only cookie | 30 days | Manual (logout) |

### 8.2 Database Indexes

**Critical Indexes:**
- `User.email` (unique)
- `Instance.userId`
- `ExecutionCache.{ instanceId, workflowId }`
- `AuditLog.{ userId, timestamp }`

**Query Optimization:**
- Use projection to limit fields
- Implement pagination for large datasets
- Use aggregation pipeline for analytics

---

## 9. Error Handling

### 9.1 API Error Responses

**Standard Error Format:**
```typescript
{
  success: false;
  error: {
    code: string; // e.g., 'UNAUTHORIZED', 'VALIDATION_ERROR'
    message: string; // User-friendly message
    details?: any; // Additional error details
  };
}
```

**HTTP Status Codes:**
- `400` — Bad Request (validation errors)
- `401` — Unauthorized (missing or invalid token)
- `403` — Forbidden (insufficient permissions)
- `404` — Not Found
- `409` — Conflict (duplicate resource)
- `500` — Internal Server Error
- `502` — Bad Gateway (n8n API error)

---

### 9.2 Client-Side Error Handling

**ErrorBoundary Component:**
```typescript
// src/components/shared/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

**TanStack Query Error Handling:**
```typescript
const { data, error, isError } = useWorkflows(instanceId);

if (isError) {
  return <ErrorState error={error} />;
}
```

---

## 10. Testing Strategy

### 10.1 Unit Tests

**Test Coverage:**
- Utility functions (`lib/encryption.ts`, `lib/redaction.ts`)
- Service layer (`services/n8n.ts`, `services/analytics.ts`)
- Custom hooks (`hooks/useWorkflows.ts`)

**Tools:**
- Jest
- React Testing Library

---

### 10.2 Integration Tests

**API Route Tests:**
- Test all API endpoints with different roles
- Test error scenarios
- Test RBAC enforcement

**Database Tests:**
- Test schema validation
- Test indexes
- Test TTL expiration

---

### 10.3 E2E Tests

**User Flows:**
- Login → View workflows → Activate workflow
- Register → Add instance → View executions
- Admin → View audit logs

**Tools:**
- Playwright or Cypress

---

## 11. Deployment Architecture

### 11.1 Environment Variables

```bash
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
NEXTAUTH_URL=https://workflowops.com
NEXTAUTH_SECRET=<secret>

# Encryption
ENCRYPTION_KEY=<32-byte-hex>

# Environment
NODE_ENV=production
```

### 11.2 Deployment Platforms

**Recommended:**
- **Vercel** — Next.js optimized, automatic deployments
- **MongoDB Atlas** — Managed MongoDB hosting
- **Cloudflare** — CDN for static assets

**Alternative:**
- **Railway** — Full-stack deployment
- **AWS** — EC2 + RDS + S3

---

## 12. Next Steps

With the architecture defined, the project is ready for **Stage 4: Backend Implementation (Backend Engineer Agent)**.

The Backend Engineer Agent should:
1. Set up MongoDB connection (`lib/db.ts`)
2. Create all Mongoose models
3. Implement encryption utilities
4. Build n8n service layer with caching
5. Create all API routes with RBAC
6. Implement audit logging
7. Add background jobs for retention

---

**Document Status:** ✅ Complete  
**Stage 3 Status:** ✅ Complete  
**Ready for:** Stage 4 (Backend Engineer Agent)  
**Next Deliverable:** Working API routes and services
