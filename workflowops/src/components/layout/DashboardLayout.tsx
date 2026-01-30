import { PropsWithChildren } from "react";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import AuthGuard from "@/components/shared/AuthGuard";

export default function DashboardLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header />
        <main className="flex-1 px-8 py-8">
          <AuthGuard>{children}</AuthGuard>
        </main>
      </div>
    </div>
  );
}
