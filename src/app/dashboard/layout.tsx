import { RoleGuard } from "@/components/role-guard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
export default function Layout({ children }: { children: React.ReactNode }) {
  return <RoleGuard><DashboardShell>{children}</DashboardShell></RoleGuard>;
}
