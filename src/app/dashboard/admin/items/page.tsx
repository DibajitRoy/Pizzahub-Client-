"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, Eye, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/dashboard/page-title";
import { SafeImg } from "@/components/menu-card";
import { ConfirmDialog } from "@/components/modal";
import { Pager } from "@/components/pager";
import { SelectField } from "@/components/select-field";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState, ErrorState, InlineLoader } from "@/components/states";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi, useDebounce } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { CATEGORY_NAMES } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { MenuItem, Paged } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function AdminItems() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [del, setDel] = useState<MenuItem | null>(null);
  const [busy, setBusy] = useState(false);
  const d = useDebounce(search);
  const qs = new URLSearchParams({ page: String(page) });
  if (d) qs.set("search", d);
  if (status) qs.set("status", status);
  if (category) qs.set("category", category);
  const { data, loading, error, reload } = useApi<Paged<MenuItem>>(`/api/admin/menu?${qs}`);

  async function setItemStatus(id: string, s: string) {
    try {
      const r = await api<{ message: string }>(`/api/admin/menu/${id}/status`, { method: "PATCH", body: { status: s } });
      toast.success(r.message);
      reload();
    } catch (e) { toast.error((e as Error).message); }
  }
  async function remove() {
    if (!del) return;
    setBusy(true);
    try {
      await api(`/api/admin/menu/${del._id}`, { method: "DELETE" });
      toast.success("Item deleted");
      setDel(null);
      reload();
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  }

  return (
    <>
      <PageTitle title="Manage Menu Items" subtitle="Review, approve, reject or remove items" />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by item name..." className="h-10 bg-white" />
        <SelectField value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="inactive">Inactive</option>
        </SelectField>
        <SelectField value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All categories</option>{CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}
        </SelectField>
      </div>
      {loading ? <InlineLoader /> : error ? <ErrorState message={error} onRetry={reload} /> : !data?.items.length ? <EmptyState title="No items found" /> : (
        <>
          <div className="overflow-x-auto rounded-2xl border bg-white">
            <Table>
              <TableHeader><TableRow><TableHead>Item</TableHead><TableHead>Vendor</TableHead><TableHead>Price</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {data.items.map((it) => (
                  <TableRow key={it._id}>
                    <TableCell><div className="flex items-center gap-3"><SafeImg src={it.images[0]} alt="" className="size-12 rounded-lg object-cover" /><div><p className="font-semibold text-brand">{it.itemName}</p><p className="text-xs text-muted-foreground">{it.category}</p></div></div></TableCell>
                    <TableCell className="text-sm">{it.vendor?.businessName || it.vendor?.name}</TableCell>
                    <TableCell className="font-semibold">{formatPrice(it.price)}</TableCell>
                    <TableCell><StatusBadge status={it.status} /></TableCell>
                    <TableCell>
                      <div className="flex flex-wrap justify-end gap-1.5">
                        <Link href={`/menu/${it._id}`} className={cn(buttonVariants({ variant: "outline", size: "icon" }))} title="View"><Eye className="size-4" /></Link>
                        {it.status === "pending" ? (
                          <>
                            <Button size="sm" className="gap-1" onClick={() => setItemStatus(it._id, "approved")}><Check className="size-4" /> Approve</Button>
                            <Button size="sm" variant="outline" className="gap-1 text-red-600" onClick={() => setItemStatus(it._id, "rejected")}><X className="size-4" /> Reject</Button>
                          </>
                        ) : (
                          <SelectField className="h-8 w-32" value={it.status} onChange={(e) => setItemStatus(it._id, e.target.value)}>
                            <option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option><option value="inactive">Inactive</option>
                          </SelectField>
                        )}
                        <Button variant="outline" size="icon" title="Delete" onClick={() => setDel(it)}><Trash2 className="size-4 text-red-600" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Pager page={data.page} pages={data.pages} onChange={setPage} />
        </>
      )}
      <ConfirmDialog open={!!del} title="Delete this item?" message={`"${del?.itemName}" will be permanently removed.`} confirmLabel="Delete" destructive loading={busy} onConfirm={remove} onClose={() => setDel(null)} />
    </>
  );
}