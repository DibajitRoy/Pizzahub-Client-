"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/states";
import { useSession } from "@/lib/auth-client";

export default function DashboardIndex() {
  const { data, isPending } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (!isPending && data?.user) router.replace(`/dashboard/${data.user.role ?? "customer"}`);
  }, [isPending, data, router]);
  return <PageLoader />;
}