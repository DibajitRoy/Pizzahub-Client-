"use client";
import { useState } from "react";
import Link from "next/link";
import { Eye, Pencil, Plus, Power, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/dashboard/page-title";
import { ConfirmDialog } from "@/components/modal";
import { SafeImg } from "@/components/menu-card";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState, ErrorState, InlineLoader } from "@/components/states";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function MyItemsPage() {
  const { data, loading, error, reload } = useApi<{ items: MenuItem[] }>("/api/vendor/menu");
  const [del, setDel] = useState<MenuItem | null>(null);
  const [busy, setBusy] = useState(false);

  async function toggle(it: MenuItem) {
    try {
      const r = await api<{ message: string }>(`/api/vendor/menu/${it._id}/availability`, { method: "PATCH", body: { available: it.status !== "approved" } });
      toast.success(r.message);
      reload();
    } catch (e) { toast.error((e as Error).message); }
  }
  async function remove() {
    if (!del) return;
    setBusy(true);
    try {
      await api(`/api/vendor/menu/${del._id}`, { method: "DELETE" });
      toast.success("Item deleted");
      setDel(null);
      reload();
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  }

  return (
    <>
      <PageTitle title="My Menu Items" subtitle="Manage your published and pending items"
        action={<Link href="/dashboard/vendor/add" className={cn(buttonVariants(), "h-10 gap-2 px-5 font-semibold")}><Plus className="size-4" /> Add Item</Link>} />
      {loading ? <InlineLoader /> : error ? <ErrorState message={error} onRetry={reload} /> : !data?.items.length ? (
        <EmptyState title="No menu items yet" text="Add your first pizza to start receiving orders." action={<Link href="/dashboard/vendor/add" className={cn(buttonVariants(), "h-10 px-5")}>Add Menu Item</Link>} />
      ) : (
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Category</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.items.map((it) => (
                <TableRow key={it._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <SafeImg src={it.images[0]} alt={it.itemName} className="size-12 rounded-lg object-cover" />
                      <div><p className="font-semibold text-brand">{it.itemName}</p><p className="text-xs text-muted-foreground">{it.location}</p></div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{it.category}</TableCell>
                  <TableCell className="font-semibold">{formatPrice(it.price)}</TableCell>
                  <TableCell><StatusBadge status={it.status} /></TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1.5">
                      <Link href={`/menu/${it._id}`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))} title="View"><Eye className="size-4" /></Link>
                      <Link href={`/dashboard/vendor/items/${it._id}/edit`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))} title="Edit"><Pencil className="size-4" /></Link>
                      {(it.status === "approved" || it.status === "inactive") && (
                        <Button variant="outline" size="icon" title={it.status === "approved" ? "Deactivate" : "Activate"} onClick={() => toggle(it)}><Power className="size-4" /></Button>
                      )}
                      <Button variant="outline" size="icon" title="Delete" onClick={() => setDel(it)}><Trash2 className="size-4 text-red-600" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      <ConfirmDialog open={!!del} title="Delete menu item?" message={`"${del?.itemName}" will be permanently removed.`} confirmLabel="Delete" destructive loading={busy} onConfirm={remove} onClose={() => setDel(null)} />
    </>
  );
}