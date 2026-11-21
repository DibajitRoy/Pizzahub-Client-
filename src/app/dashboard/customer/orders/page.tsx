"use client";
import { useState } from "react";
import { Eye, XCircle } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/dashboard/page-title";
import { SafeImg } from "@/components/menu-card";
import { ConfirmDialog, Modal } from "@/components/modal";
import { OrderTimeline } from "@/components/order-timeline";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState, ErrorState, InlineLoader } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import type { Order } from "@/lib/types";

export default function MyOrders() {
  const { data, loading, error, reload } = useApi<{ items: Order[] }>("/api/orders/my");
  const [view, setView] = useState<Order | null>(null);
  const [cancel, setCancel] = useState<Order | null>(null);
  const [busy, setBusy] = useState(false);

  async function doCancel() {
    if (!cancel) return;
    setBusy(true);
    try {
      await api(`/api/orders/${cancel._id}/cancel`, { method: "PATCH" });
      toast.success("Order cancelled");
      setCancel(null);
      reload();
    } catch (e) { toast.error((e as Error).message); reload(); setCancel(null); } finally { setBusy(false); }
  }

  return (
    <>
      <PageTitle title="My Orders" subtitle="Track and manage your orders" />
      {loading ? <InlineLoader /> : error ? <ErrorState message={error} onRetry={reload} /> : !data?.items.length ? (
        <EmptyState title="No orders yet" text="Browse the menu and place your first order." />
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Restaurant</TableHead><TableHead>Delivery</TableHead><TableHead>Requested</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.items.map((o) => (
                <TableRow key={o._id}>
                  <TableCell><div className="flex items-center gap-3"><SafeImg src={o.item.image} alt="" className="size-12 rounded-lg object-cover" /><span className="font-semibold text-brand">{o.item.itemName}</span></div></TableCell>
                  <TableCell className="text-sm">{o.vendor?.businessName || o.vendor?.name || "—"}</TableCell>
                  <TableCell className="max-w-52"><p className="text-sm font-medium">{formatDate(o.deliveryDate)}</p><p className="line-clamp-1 text-xs text-muted-foreground">{o.deliveryAddress}</p></TableCell>
                  <TableCell className="text-sm">{formatDate(o.createdAt)}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="sm" className="gap-1" onClick={() => setView(o)}><Eye className="size-4" /> Details</Button>
                      {o.status === "pending" && <Button variant="outline" size="sm" className="gap-1 text-red-600" onClick={() => setCancel(o)}><XCircle className="size-4" /> Cancel</Button>}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Modal open={!!view} onClose={() => setView(null)} title="Order details" wide>
        {view && (
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3 text-sm">
              <SafeImg src={view.item.image} alt="" className="aspect-[4/3] w-full rounded-xl object-cover" />
              <p className="text-lg font-bold text-brand">{view.item.itemName}</p>
              <p><b>Price:</b> {formatPrice(view.item.price)}</p>
              <p><b>Restaurant:</b> {view.vendor?.businessName || view.vendor?.name}</p>
              <p><b>Delivery date:</b> {formatDate(view.deliveryDate)}</p>
              <p><b>Address:</b> {view.deliveryAddress}</p>
              {view.message && <p><b>Message:</b> {view.message}</p>}
              <StatusBadge status={view.status} />
            </div>
            <div><h4 className="mb-4 font-bold text-brand">Order status</h4><OrderTimeline order={view} /></div>
          </div>
        )}
      </Modal>
      <ConfirmDialog open={!!cancel} title="Cancel this order?" message="Only pending orders can be cancelled. This cannot be undone." confirmLabel="Cancel order" destructive loading={busy} onConfirm={doCancel} onClose={() => setCancel(null)} />
    </>
  );
}