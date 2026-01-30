# UI Task List (WorkflowOps)

Based on [docs/FRONTEND.md](docs/FRONTEND.md) and [docs/UI_refrence.md](docs/UI_refrence.md).

## 1. Foundation (Global Styles)
- [ ] Update [workflowops/src/app/globals.css](workflowops/src/app/globals.css)
  - Add `.glow-primary` and `.glass-panel` utilities.
  - Enable smooth scrolling and font smoothing.
  - Confirm base text/background colors align with the light/dark palette.

## 2. Layout Shell
- [ ] Refine [workflowops/src/components/layout/DashboardLayout.tsx](workflowops/src/components/layout/DashboardLayout.tsx)
  - Apply sidebar glassmorphism and borders.
  - Ensure layout spacing is on a 4px/8px grid.
- [ ] Update [workflowops/src/components/layout/Header.tsx](workflowops/src/components/layout/Header.tsx)
  - Make header sticky and add blurred background on scroll.
- [ ] Update [workflowops/src/components/layout/Sidebar.tsx](workflowops/src/components/layout/Sidebar.tsx)
  - Add `backdrop-blur` and subtle border in dark mode.

## 3. Core Card Interactions
- [ ] Update [workflowops/src/components/features/StatsCard.tsx](workflowops/src/components/features/StatsCard.tsx)
  - Add hover lift (`hover:-translate-y-1`) and shadow.
  - Add top-light border in dark mode.
- [ ] Update [workflowops/src/components/features/InstanceCard.tsx](workflowops/src/components/features/InstanceCard.tsx)
  - Match card hover and depth effects.

## 4. Tables & Badges
- [ ] Update [workflowops/src/components/features/WorkflowTable.tsx](workflowops/src/components/features/WorkflowTable.tsx)
  - Remove vertical grid lines.
  - Add subtle horizontal borders and row hover.
- [ ] Update [workflowops/src/components/features/AuditLogTable.tsx](workflowops/src/components/features/AuditLogTable.tsx)
  - Align table styling with the new minimal grid.
  - Add glow-style status badges with a ping dot for success.

## 5. Buttons & Micro-Interactions
- [ ] Update [workflowops/src/components/ui/Button.tsx](workflowops/src/components/ui/Button.tsx)
  - Add `active:scale-95` and smooth transitions.

## 6. Loading & Empty States
- [ ] Update [workflowops/src/components/ui/Skeleton.tsx](workflowops/src/components/ui/Skeleton.tsx)
  - Add shimmer animation (left-to-right gradient).
- [ ] Update [workflowops/src/components/ui/States.tsx](workflowops/src/components/ui/States.tsx)
  - Improve empty states with guidance + primary action.

## 7. Page-Level Motion
- [ ] Update [workflowops/src/app/dashboard/page.tsx](workflowops/src/app/dashboard/page.tsx)
  - Add staggered entrance animation to cards.
- [ ] Update [workflowops/src/app/analytics/page.tsx](workflowops/src/app/analytics/page.tsx)
  - Add the same entrance motion for key panels.

## 8. Theme Persistence
- [ ] Update [workflowops/src/components/shared/ThemeProvider.tsx](workflowops/src/components/shared/ThemeProvider.tsx)
  - Ensure initial theme is set before hydration.
- [ ] Update [workflowops/src/components/shared/ThemeToggle.tsx](workflowops/src/components/shared/ThemeToggle.tsx)
  - Prevent flicker on first load.

## 9. Consistency & QA
- [ ] Verify spacing, typography, and borders across pages in [workflowops/src/app](workflowops/src/app)
- [ ] Ensure components in [workflowops/src/components/features](workflowops/src/components/features) match the design language
- [ ] Cross-check against [docs/UI_refrence.md](docs/UI_refrence.md) checklist
