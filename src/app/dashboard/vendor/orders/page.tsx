"use client";
import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/dashboard/page-title";
import { SafeImg } from "@/components/menu-card";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState, ErrorState, InlineLoader } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function VendorOrders() {
  const { data, loading, error, reload } = useApi<{ items: Order[] }>("/api/vendor/orders");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function act(id: string, status: "accepted" | "rejected") {
    setBusyId(id);
    try {
      await api(`/api/vendor/orders/${id}/status`, { method: "PATCH", body: { status } });
      toast.success(`Order ${status}`);
      reload();
    } catch (e) { toast.error((e as Error).message); reload(); } finally { setBusyId(null); }
  }

  return (
    <>
      <PageTitle title="Customer Orders" subtitle="Accept or reject incoming orders" />
      {loading ? <InlineLoader /> : error ? <ErrorState message={error} onRetry={reload} /> : !data?.items.length ? (
        <EmptyState title="No orders yet" text="Orders from customers will appear here." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Customer</TableHead><TableHead>Item</TableHead><TableHead>Delivery</TableHead><TableHead>Message</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.items.map((o) => (
                <TableRow key={o._id}>
                  <TableCell><p className="font-semibold">{o.customer?.name ?? "Unknown"}</p><p className="text-xs text-muted-foreground">{o.customer?.email}</p></TableCell>
                  <TableCell><div className="flex items-center gap-2"><SafeImg src={o.item.image} alt="" className="size-10 rounded-lg object-cover" /><span className="text-sm font-medium">{o.item.itemName}</span></div></TableCell>
                  <TableCell className="max-w-56"><p className="text-sm font-medium">{formatDate(o.deliveryDate)}</p><p className="line-clamp-2 text-xs text-muted-foreground">{o.deliveryAddress}</p></TableCell>
                  <TableCell className="max-w-48"><p className="line-clamp-2 text-xs text-muted-foreground">{o.message || "—"}</p></TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell>
                    {o.status === "pending" ? (
                      <div className="flex justify-end gap-2">
                        <Button size="sm" disabled={busyId === o._id} onClick={() => act(o._id, "accepted")} className="gap-1"><Check className="size-4" /> Accept</Button>
                        <Button size="sm" variant="outline" disabled={busyId === o._id} onClick={() => act(o._id, "rejected")} className="gap-1 text-red-600"><X className="size-4" /> Reject</Button>
                      </div>
                    ) : <p className="text-right text-xs text-muted-foreground">No actions</p>}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}