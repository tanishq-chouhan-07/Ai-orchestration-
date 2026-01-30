import Link from "next/link";
import {
  Activity,
  BarChart3,
  ClipboardList,
  FileText,
  Gauge,
  ListChecks,
  Settings,
  Shield,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Gauge },
  { href: "/instances", label: "Instances", icon: Activity },
  { href: "/workflows", label: "Workflows", icon: ListChecks },
  { href: "/executions", label: "Executions", icon: ClipboardList },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/audit", label: "Audit", icon: Shield },
  { href: "/retention", label: "Retention", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="glass-panel flex h-full w-60 flex-col gap-4 border-r border-border/80 px-4 py-6 shadow-sm">
      <div className="px-2">
        <div className="text-sm font-semibold">WorkflowOps</div>
        <div className="text-xs text-muted">n8n control center</div>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 rounded-[var(--radius)] px-3 py-2 text-sm text-muted transition hover:bg-background/60 hover:text-foreground"
          >
            <item.icon size={16} strokeWidth={1.5} />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
