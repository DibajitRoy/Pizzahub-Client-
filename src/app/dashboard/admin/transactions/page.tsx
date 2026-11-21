"use client";
import { PageTitle } from "@/components/dashboard/page-title";
import { StatusBadge } from "@/components/status-badge";
import { EmptyState, ErrorState, InlineLoader } from "@/components/states";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { formatDate } from "@/lib/format";

interface Tx { _id: string; plan: string; amount: number; currency: string; status: string; createdAt: string; vendor?: { name: string; email: string; businessName?: string } }

export default function Transactions() {
  const { data, loading, error, reload } = useApi<{ items: Tx[] }>("/api/admin/transactions");
  return (
    <>
      <PageTitle title="Transactions" subtitle="Subscription payments (read-only)" />
      {loading ? <InlineLoader /> : error ? <ErrorState message={error} onRetry={reload} /> : !data?.items.length ? <EmptyState title="No transactions yet" /> : (
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Vendor</TableHead><TableHead>Plan</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead><TableHead>Date</TableHead></TableRow></TableHeader>
            <TableBody>
              {data.items.map((t) => (
                <TableRow key={t._id}>
                  <TableCell><p className="font-semibold">{t.vendor?.businessName || t.vendor?.name || "—"}</p><p className="text-xs text-muted-foreground">{t.vendor?.email}</p></TableCell>
                  <TableCell className="capitalize">{t.plan}</TableCell>
                  <TableCell className="font-semibold">{t.amount.toFixed(2)} {t.currency?.toUpperCase()}</TableCell>
                  <TableCell><StatusBadge status={t.status} /></TableCell>
                  <TableCell>{formatDate(t.createdAt)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}