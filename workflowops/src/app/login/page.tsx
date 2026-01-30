"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid credentials.");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError("Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md glass-panel">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase text-muted">WorkflowOps</p>
            <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">Secure</span>
        </div>
        <p className="mt-2 text-sm text-muted">
          Use your WorkflowOps account to continue.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm text-muted">Email</label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="text-sm text-muted">Password</label>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-muted">
          No account? <Link className="text-primary" href="/register">Create one</Link>
        </p>
      </Card>
    </div>
  );
}
