"use client";
import { DollarSign, Package, Receipt, Store, UserRound, Users, Clock } from "lucide-react";
import { BarCard, PieCard, toPoints } from "@/components/dashboard/charts";
import { PageTitle } from "@/components/dashboard/page-title";
import { StatCard } from "@/components/dashboard/stat-card";
import { ErrorState, InlineLoader } from "@/components/states";
import { useApi } from "@/hooks/use-api";
import { formatPrice } from "@/lib/format";

interface O {
  totalUsers: number; totalVendors: number; totalCustomers: number; totalMenuItems: number; pendingMenuItems: number;
  totalTransactions: number; totalRevenue: number; itemsByStatus: Record<string, number>; usersByRole: Record<string, number>;
  revenueByMonth: { month: string; amount: number }[];
}

export default function AdminOverview() {
  const { data, loading, error, reload } = useApi<O>("/api/admin/overview");
  if (loading) return <InlineLoader />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} onRetry={reload} />;
  return (
    <>
      <PageTitle title="Admin Overview" subtitle="Platform statistics" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Users" value={data.totalUsers} icon={Users} />
        <StatCard label="Total Vendors" value={data.totalVendors} icon={Store} />
        <StatCard label="Total Customers" value={data.totalCustomers} icon={UserRound} />
        <StatCard label="Total Menu Items" value={data.totalMenuItems} icon={Package} />
        <StatCard label="Pending Menu Items" value={data.pendingMenuItems} icon={Clock} />
        <StatCard label="Total Transactions" value={data.totalTransactions} icon={Receipt} />
        <StatCard label="Total Revenue" value={formatPrice(data.totalRevenue)} icon={DollarSign} />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <BarCard title="Revenue by month (USD)" data={data.revenueByMonth.map((m) => ({ name: m.month, value: m.amount }))} />
        <PieCard title="Menu items by status" data={toPoints(data.itemsByStatus)} />
        <PieCard title="Users by role" data={toPoints(data.usersByRole)} />
      </div>
    </>
  );
}