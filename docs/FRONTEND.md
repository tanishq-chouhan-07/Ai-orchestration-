# 🎨 FRONTEND

**Project:** WorkflowOps  
**Purpose:** Frontend pages, components, and use cases for UI redesign input  
**Date:** 2026-01-30  
**Agent:** GitHub Copilot  

**Project Description:** WorkflowOps is a web-based operations console for managing and monitoring workflow automation infrastructure. It provides authenticated, role-aware views for dashboards, analytics, audit logs, executions, instances, retention policies, and settings to support operational visibility, governance, and day-to-day administration.

---

## 1. Overview
This document summarizes the frontend routes, layout/shared components, feature widgets, UI primitives, and hooks with their primary use cases. It is intended as a concise inventory to drive UI redesign and styling guidance.

## 2. App Routes (Pages) and Use Cases
- [workflowops/src/app/page.tsx](../workflowops/src/app/page.tsx)
  - Public landing page with branding, value proposition, and CTAs for login/register/dashboard.
- [workflowops/src/app/dashboard/page.tsx](../workflowops/src/app/dashboard/page.tsx)
  - Primary dashboard overview; quick stats and navigation into core areas.
- [workflowops/src/app/analytics/page.tsx](../workflowops/src/app/analytics/page.tsx)
  - Analytics overview with traffic, success rate, and cost breakdown.
- [workflowops/src/app/audit/page.tsx](../workflowops/src/app/audit/page.tsx)
  - Admin-only audit log viewer with filters and table display.
- [workflowops/src/app/executions/page.tsx](../workflowops/src/app/executions/page.tsx)
  - Execution history view with retry/view/delete actions.
- [workflowops/src/app/instances/page.tsx](../workflowops/src/app/instances/page.tsx)
  - n8n instance management with create/edit/delete cards.
- [workflowops/src/app/retention/page.tsx](../workflowops/src/app/retention/page.tsx)
  - Admin-only retention policy CRUD and visibility into policy scope.
- [workflowops/src/app/settings/page.tsx](../workflowops/src/app/settings/page.tsx)
  - User settings, profile summary, and theme preferences.
- [workflowops/src/app/workflows/page.tsx](../workflowops/src/app/workflows/page.tsx)
  - Workflow listing with bulk toggles and per-workflow actions.
- [workflowops/src/app/login/page.tsx](../workflowops/src/app/login/page.tsx)
  - Login form and authentication entry point.
- [workflowops/src/app/register/page.tsx](../workflowops/src/app/register/page.tsx)
  - Registration form for new users.

## 3. Layout Components
- [workflowops/src/components/layout/DashboardLayout.tsx](../workflowops/src/components/layout/DashboardLayout.tsx)
  - Application shell for authenticated pages; composes sidebar, header, and content frame.
- [workflowops/src/components/layout/Header.tsx](../workflowops/src/components/layout/Header.tsx)
  - Top navigation bar; user status, theme toggle, and sign-out controls.
- [workflowops/src/components/layout/Sidebar.tsx](../workflowops/src/components/layout/Sidebar.tsx)
  - Primary navigation with links to major routes.

## 4. Shared Components
- [workflowops/src/components/shared/AuthGuard.tsx](../workflowops/src/components/shared/AuthGuard.tsx)
  - Redirects unauthenticated users to login; gate for protected routes.
- [workflowops/src/components/shared/AdminGuard.tsx](../workflowops/src/components/shared/AdminGuard.tsx)
  - Prevents non-admin access to admin-only pages.
- [workflowops/src/components/shared/RoleGate.tsx](../workflowops/src/components/shared/RoleGate.tsx)
  - Role-based UI gating with fallback display.
- [workflowops/src/components/shared/ProtectedLayout.tsx](../workflowops/src/components/shared/ProtectedLayout.tsx)
  - Lightweight wrapper to ensure authenticated rendering.
- [workflowops/src/components/shared/ThemeProvider.tsx](../workflowops/src/components/shared/ThemeProvider.tsx)
  - Applies persisted theme and provides theme context.
- [workflowops/src/components/shared/ThemeToggle.tsx](../workflowops/src/components/shared/ThemeToggle.tsx)
  - UI control to switch light/dark themes.
- [workflowops/src/components/shared/cn.ts](../workflowops/src/components/shared/cn.ts)
  - Utility for conditional className composition.

## 5. Feature Components (Domain Widgets)
- [workflowops/src/components/features/StatsCard.tsx](../workflowops/src/components/features/StatsCard.tsx)
  - KPI summary block for totals, trends, and headline metrics.
- [workflowops/src/components/features/CostBreakdown.tsx](../workflowops/src/components/features/CostBreakdown.tsx)
  - Cost summary section; breakdown by dimension or period.
- [workflowops/src/components/features/TrafficChart.tsx](../workflowops/src/components/features/TrafficChart.tsx)
  - Visualizes traffic trends for analytics.
- [workflowops/src/components/features/SuccessRateChart.tsx](../workflowops/src/components/features/SuccessRateChart.tsx)
  - Visualizes success rate over time.
- [workflowops/src/components/features/AuditLogTable.tsx](../workflowops/src/components/features/AuditLogTable.tsx)
  - Tabular view of audit entries with filters and pagination support.
- [workflowops/src/components/features/ExecutionHistory.tsx](../workflowops/src/components/features/ExecutionHistory.tsx)
  - Table/list for execution records with retry/view/delete actions.
- [workflowops/src/components/features/InstanceCard.tsx](../workflowops/src/components/features/InstanceCard.tsx)
  - Instance summary card with edit/delete options.
- [workflowops/src/components/features/WorkflowTable.tsx](../workflowops/src/components/features/WorkflowTable.tsx)
  - Workflow listing with selection, toggle, and detail actions.

## 6. UI Primitives
- [workflowops/src/components/ui/Button.tsx](../workflowops/src/components/ui/Button.tsx)
  - Primary button with variants and sizes.
- [workflowops/src/components/ui/Card.tsx](../workflowops/src/components/ui/Card.tsx)
  - Bordered container for content sections.
- [workflowops/src/components/ui/Input.tsx](../workflowops/src/components/ui/Input.tsx)
  - Form text input styling.
- [workflowops/src/components/ui/Badge.tsx](../workflowops/src/components/ui/Badge.tsx)
  - Status/label chip with variant colors.
- [workflowops/src/components/ui/Modal.tsx](../workflowops/src/components/ui/Modal.tsx)
  - Modal dialog container for overlays.
- [workflowops/src/components/ui/Skeleton.tsx](../workflowops/src/components/ui/Skeleton.tsx)
  - Loading placeholder for async content.
- [workflowops/src/components/ui/States.tsx](../workflowops/src/components/ui/States.tsx)
  - Empty/error/loading state blocks.
- [workflowops/src/components/ui/Table.tsx](../workflowops/src/components/ui/Table.tsx)
  - Table structure primitives.
- [workflowops/src/components/ui/Toast.tsx](../workflowops/src/components/ui/Toast.tsx)
  - Toast notification container.

## 7. Hooks (Data and State)
- [workflowops/src/hooks/useAuth.ts](../workflowops/src/hooks/useAuth.ts)
  - Retrieves current user and authentication status.
- [workflowops/src/hooks/useTheme.ts](../workflowops/src/hooks/useTheme.ts)
  - Theme state management and persistence.
- [workflowops/src/hooks/useInstances.ts](../workflowops/src/hooks/useInstances.ts)
  - Fetches instance list and handles loading/error state.
- [workflowops/src/hooks/useWorkflows.ts](../workflowops/src/hooks/useWorkflows.ts)
  - Fetches workflows for a given instance.
- [workflowops/src/hooks/useExecutions.ts](../workflowops/src/hooks/useExecutions.ts)
  - Fetches execution history for an instance.
- [workflowops/src/hooks/useAnalytics.ts](../workflowops/src/hooks/useAnalytics.ts)
  - Loads analytics stats, trends, and cost data.
- [workflowops/src/hooks/useAuditLogs.ts](../workflowops/src/hooks/useAuditLogs.ts)
  - Retrieves audit logs with filters and pagination.
- [workflowops/src/hooks/useRetentionPolicies.ts](../workflowops/src/hooks/useRetentionPolicies.ts)
  - Loads retention policies and related instance data (admin-focused).

## 8. Route-to-Component Mapping (High Level)
- Dashboard: StatsCard, TrafficChart, SuccessRateChart, CostBreakdown
- Analytics: TrafficChart, SuccessRateChart, CostBreakdown
- Audit Logs: AuditLogTable
- Executions: ExecutionHistory
- Instances: InstanceCard
- Workflows: WorkflowTable
- Settings: ThemeToggle

## 9. UI Redesign Notes
- Ensure layout consistency across authenticated pages via DashboardLayout.
- Prefer cohesive visual language for cards, tables, and charts.
- Provide clear empty/loading/error states for all data surfaces.
- Preserve role-based access affordances for admin-only sections.
