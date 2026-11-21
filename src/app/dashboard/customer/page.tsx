"use client";
import { CheckCircle, Clock, Package, XCircle } from "lucide-react";
import { PieCard } from "@/components/dashboard/charts";
import { PageTitle } from "@/components/dashboard/page-title";
import { StatCard } from "@/components/dashboard/stat-card";
import { ErrorState, InlineLoader } from "@/components/states";
import { useApi } from "@/hooks/use-api";

interface O { total: number; pending: number; accepted: number; rejected: number; cancelled: number }

export default function CustomerOverview() {
  const { data, loading, error, reload } = useApi<O>("/api/orders/overview");
  if (loading) return <InlineLoader />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} onRetry={reload} />;
  return (
    <>
      <PageTitle title="My Overview" subtitle="Your order activity at a glance" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Orders" value={data.total} icon={Package} />
        <StatCard label="Pending" value={data.pending} icon={Clock} />
        <StatCard label="Accepted" value={data.accepted} icon={CheckCircle} />
        <StatCard label="Rejected" value={data.rejected} icon={XCircle} />
      </div>
      <div className="mt-6 max-w-xl">
        <PieCard title="Orders breakdown" data={[
          { name: "Pending", value: data.pending }, { name: "Accepted", value: data.accepted },
          { name: "Rejected", value: data.rejected }, { name: "Cancelled", value: data.cancelled },
        ]} />
      </div>
    </>
  );
}