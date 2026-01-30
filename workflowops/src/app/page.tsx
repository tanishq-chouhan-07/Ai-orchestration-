export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-8 py-6">
        <div>
          <p className="text-xs uppercase text-muted">WorkflowOps</p>
          <h1 className="text-lg font-semibold tracking-tight">Operations Console</h1>
        </div>
        <nav className="flex items-center gap-2">
          <a
            className="rounded-[var(--radius)] border border-border px-4 py-2 text-sm text-muted transition hover:bg-background/60 hover:text-foreground"
            href="/login"
          >
            Sign in
          </a>
          <a
            className="rounded-[var(--radius)] bg-primary px-4 py-2 text-sm text-primary-foreground transition hover:opacity-90"
            href="/register"
          >
            Create account
          </a>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-8 pb-16 pt-10">
        <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase text-muted">Minimalist Precision</p>
            <h2 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Monitor, govern, and scale your workflow infrastructure.
            </h2>
            <p className="text-base text-muted sm:text-lg">
              WorkflowOps centralizes analytics, audit trails, execution health, and retention
              governance across all n8n instances.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                className="rounded-[var(--radius)] bg-primary px-5 py-2.5 text-sm text-primary-foreground transition hover:opacity-90"
                href="/dashboard"
              >
                Open dashboard
              </a>
              <a
                className="rounded-[var(--radius)] border border-border px-5 py-2.5 text-sm text-foreground transition hover:bg-background/60"
                href="/login"
              >
                Sign in
              </a>
            </div>
          </div>
          <div className="glass-panel rounded-[var(--radius)] p-6 shadow-[var(--shadow)]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase text-muted">Live overview</span>
                <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">Beta</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[var(--radius)] border border-border bg-card p-4">
                  <p className="text-xs text-muted">Active workflows</p>
                  <p className="mt-2 text-2xl font-semibold">128</p>
                </div>
                <div className="rounded-[var(--radius)] border border-border bg-card p-4">
                  <p className="text-xs text-muted">Success rate</p>
                  <p className="mt-2 text-2xl font-semibold">98.2%</p>
                </div>
                <div className="rounded-[var(--radius)] border border-border bg-card p-4">
                  <p className="text-xs text-muted">Audit events</p>
                  <p className="mt-2 text-2xl font-semibold">3,482</p>
                </div>
                <div className="rounded-[var(--radius)] border border-border bg-card p-4">
                  <p className="text-xs text-muted">Retention policies</p>
                  <p className="mt-2 text-2xl font-semibold">24</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Analytics at a glance",
              description: "Traffic, success rates, and cost breakdowns in one view.",
            },
            {
              title: "Governed access",
              description: "Admin-only audit logs and retention policy controls.",
            },
            {
              title: "Operational control",
              description: "Manage instances, workflows, and executions in minutes.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[var(--radius)] border border-border bg-card p-5">
              <h3 className="text-sm font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
