"use client";
import { useState } from "react";
import { Ban, Eye, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/dashboard/page-title";
import { Modal } from "@/components/modal";
import { Pager } from "@/components/pager";
import { SelectField } from "@/components/select-field";
import { EmptyState, ErrorState, InlineLoader } from "@/components/states";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi, useDebounce } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Paged } from "@/lib/types";
import { StatusBadge } from "@/components/status-badge";

interface U { _id: string; name: string; email: string; image?: string; role: string; isBlocked?: boolean; businessName?: string; subscriptionPlan?: string; subscriptionExpiresAt?: string; createdAt?: string }

export default function ManageUsers() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [page, setPage] = useState(1);
  const [view, setView] = useState<U | null>(null);
  const d = useDebounce(search);
  const qs = new URLSearchParams({ page: String(page) });
  if (d) qs.set("search", d);
  if (role) qs.set("role", role);
  const { data, loading, error, reload } = useApi<Paged<U>>(`/api/admin/users?${qs}`);

  async function block(u: U) {
    try {
      const r = await api<{ message: string }>(`/api/admin/users/${u._id}/block`, { method: "PATCH", body: { blocked: !u.isBlocked } });
      toast.success(r.message);
      reload();
    } catch (e) { toast.error((e as Error).message); }
  }

  return (
    <>
      <PageTitle title="Manage Users" subtitle="View, search and block or unblock users" />
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..." className="h-10 bg-white sm:col-span-2" />
        <SelectField value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
          <option value="">All roles</option><option value="vendor">Vendors</option><option value="customer">Customers</option><option value="admin">Admins</option>
        </SelectField>
      </div>
      {loading ? <InlineLoader /> : error ? <ErrorState message={error} onRetry={reload} /> : !data?.items.length ? <EmptyState title="No users found" /> : (
        <>
          <div className="overflow-x-auto rounded-2xl border bg-white">
            <Table>
              <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Plan</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {data.items.map((u) => (
                  <TableRow key={u._id}>
                    <TableCell><div className="flex items-center gap-3"><UserAvatar name={u.name} image={u.image} /><div><p className="font-semibold">{u.name}</p><p className="text-xs text-muted-foreground">{u.email}</p></div></div></TableCell>
                    <TableCell className="capitalize">{u.role}</TableCell>
                    <TableCell className="capitalize">{u.role === "vendor" ? u.subscriptionPlan ?? "free" : "—"}</TableCell>
                    <TableCell><StatusBadge status={u.isBlocked ? "rejected" : "approved"} /></TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" className="gap-1" onClick={() => setView(u)}><Eye className="size-4" /> Details</Button>
                        {u.role !== "admin" && (
                          <Button variant="outline" size="sm" className={u.isBlocked ? "gap-1" : "gap-1 text-red-600"} onClick={() => block(u)}>
                            {u.isBlocked ? <><ShieldCheck className="size-4" /> Unblock</> : <><Ban className="size-4" /> Block</>}
                          </Button>
                        )}
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
      <Modal open={!!view} onClose={() => setView(null)} title="User details">
        {view && (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3"><UserAvatar name={view.name} image={view.image} className="size-14" /><div><p className="text-lg font-bold text-brand">{view.name}</p><p className="text-muted-foreground">{view.email}</p></div></div>
            <p><b>Role:</b> <span className="capitalize">{view.role}</span></p>
            {view.businessName && <p><b>Restaurant:</b> {view.businessName}</p>}
            {view.role === "vendor" && <p><b>Plan:</b> <span className="capitalize">{view.subscriptionPlan ?? "free"}</span>{view.subscriptionExpiresAt && ` (until ${formatDate(view.subscriptionExpiresAt)})`}</p>}
            <p><b>Joined:</b> {formatDate(view.createdAt)}</p>
            <p><b>Account:</b> {view.isBlocked ? "Blocked" : "Active"}</p>
          </div>
        )}
      </Modal>
    </>
  );
}