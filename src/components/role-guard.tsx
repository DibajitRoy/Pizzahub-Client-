"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { PageLoader } from "@/components/states";
import { useSession } from "@/lib/auth-client";
import type { Role } from "@/lib/types";

export function RoleGuard({ role, roles, children, fallback }: { role?: Role; roles?: Role[]; children: React.ReactNode; fallback?: React.ReactNode }) {
  const { data, isPending } = useSession();
  const router = useRouter();
  const user = data?.user;
  const allowed = !!user && (roles ? roles.includes(user.role as Role) : !role || user.role === role);

  useEffect(() => {
    if (isPending) return;
    if (!user) { router.replace("/signin"); return; }
    if (!allowed) {
      toast.error("You don't have access to that page");
      router.replace("/dashboard");
    }
  }, [isPending, user, allowed, router]);

  if (isPending || !user || !allowed) return <>{fallback ?? <PageLoader />}</>;
  return <>{children}</>;
}
