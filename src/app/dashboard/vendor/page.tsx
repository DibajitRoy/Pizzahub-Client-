"use client";
import { CheckCircle, Clock, CreditCard, Package, UtensilsCrossed } from "lucide-react";
import { BarCard, PieCard, toPoints } from "@/components/dashboard/charts";
import { PageTitle } from "@/components/dashboard/page-title";
import { StatCard } from "@/components/dashboard/stat-card";
import { ErrorState, InlineLoader } from "@/components/states";
import { useApi } from "@/hooks/use-api";

interface Overview {
  totalItems: number; activeItems: number; pendingOrders: number; acceptedOrders: number; plan: string;
  itemsByStatus: Record<string, number>; ordersByStatus: Record<string, number>;
}

export default function VendorOverview() {
  const { data, loading, error, reload } = useApi<Overview>("/api/vendor/overview");
  if (loading) return <InlineLoader label="Loading overview..." />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} onRetry={reload} />;
  return (
    <>
      <PageTitle title="Vendor Overview" subtitle="A quick look at your restaurant" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Menu Items" value={data.totalItems} icon={UtensilsCrossed} />
        <StatCard label="Active Menu Items" value={data.activeItems} icon={CheckCircle} />
        <StatCard label="Pending Orders" value={data.pendingOrders} icon={Clock} />
        <StatCard label="Accepted Orders" value={data.acceptedOrders} icon={Package} />
        <StatCard label="Current Plan" value={data.plan} icon={CreditCard} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <BarCard title="Orders by status" data={toPoints(data.ordersByStatus)} />
        <PieCard title="Menu items by status" data={toPoints(data.itemsByStatus)} />
      </div>
    </>
  );
}