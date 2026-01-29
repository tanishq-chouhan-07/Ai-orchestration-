import Link from "next/link";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/instances", label: "Instances" },
  { href: "/workflows", label: "Workflows" },
  { href: "/executions", label: "Executions" },
  { href: "/analytics", label: "Analytics" },
  { href: "/audit", label: "Audit" },
  { href: "/retention", label: "Retention" },
  { href: "/settings", label: "Settings" },
];

export default function Sidebar() {
  return (
    <aside className="flex h-full w-60 flex-col gap-4 border-r border-border bg-card px-4 py-6">
      <div className="px-2">
        <div className="text-sm font-semibold">WorkflowOps</div>
        <div className="text-xs text-muted">n8n control center</div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-[var(--radius)] px-3 py-2 text-sm text-muted transition hover:bg-background hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
