"use client";
import { useState } from "react";
import { Check, Crown, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { PageTitle } from "@/components/dashboard/page-title";
import { ConfirmDialog } from "@/components/modal";
import { StatusBadge } from "@/components/status-badge";
import { ErrorState, InlineLoader } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useApi } from "@/hooks/use-api";
import { api } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Status { plan: "free" | "premium"; expiresAt: string | null; cancelAtPeriodEnd: boolean; activeItems: number; limit: number | null }
interface Tx { _id: string; plan: string; amount: number; status: string; createdAt: string }

const FREE = ["Max 3 active menu items", "Basic vendor dashboard", "Order management"];
const PREMIUM = ["Unlimited active items", "Premium vendor badge", "Featured menu placement", "All Free features"];

export default function SubscriptionPage() {
  const { data, loading, error, reload } = useApi<Status>("/api/payments/status");
  const tx = useApi<{ items: Tx[] }>("/api/vendor/transactions");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function upgrade() {
    setBusy(true);
    try {
      const { url } = await api<{ url: string }>("/api/payments/checkout", { method: "POST" });
      window.location.href = url;
    } catch (e) { toast.error((e as Error).message); setBusy(false); }
  }
  async function cancel() {
    setBusy(true);
    try {
      const r = await api<{ message: string }>("/api/payments/cancel", { method: "POST" });
      toast.success(r.message);
      setConfirm(false);
      reload();
    } catch (e) { toast.error((e as Error).message); } finally { setBusy(false); }
  }

  if (loading) return <InlineLoader />;
  if (error || !data) return <ErrorState message={error || "Failed to load"} onRetry={reload} />;
  const premium = data.plan === "premium";

  const plan = (title: string, price: string, feats: string[], current: boolean, highlight?: boolean) => (
    <Card className={cn("border-2 shadow-sm", highlight ? "border-gold" : "border-border")}>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-xl font-extrabold text-brand">{highlight && <Crown className="size-5 text-gold" />}{title}</h3>
          {current && <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-800">Current plan</span>}
        </div>
        <p className="text-3xl font-extrabold text-brand">{price}</p>
        <ul className="space-y-2">{feats.map((f) => <li key={f} className="flex items-center gap-2 text-sm"><Check className="size-4 text-green-600" />{f}</li>)}</ul>
        {highlight && !premium && (
          <Button onClick={upgrade} disabled={busy} className="h-11 w-full gap-2 font-bold">
            {busy ? <LoaderCircle className="size-4 animate-spin" /> : <Crown className="size-4" />} Upgrade to Premium
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <>
      <PageTitle title="Subscription" subtitle="Manage your PizzaHub plan" />
      <div className="mb-6 rounded-2xl border bg-accent p-4 text-sm">
        <p className="font-semibold text-brand">
          You&apos;re on the <span className="capitalize">{data.plan}</span> plan.{" "}
          {premium ? (data.cancelAtPeriodEnd ? `Ends on ${formatDate(data.expiresAt ?? undefined)}.` : `Renews on ${formatDate(data.expiresAt ?? undefined)}.`) : `${data.activeItems}/${data.limit} active items used.`}
        </p>
        {premium && !data.cancelAtPeriodEnd && <Button variant="outline" size="sm" className="mt-3" onClick={() => setConfirm(true)}>Cancel subscription</Button>}
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {plan("Free", "$0", FREE, !premium)}
        {plan("Premium", "$9.99 / month", PREMIUM, premium, true)}
      </div>

      <h2 className="mb-3 mt-10 text-lg font-extrabold text-brand">Payment history</h2>
      {tx.loading ? <InlineLoader /> : !tx.data?.items.length ? <p className="text-sm text-muted-foreground">No payments yet.</p> : (
        <div className="overflow-x-auto rounded-2xl border bg-white">
          <Table>
            <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Plan</TableHead><TableHead>Amount</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>{tx.data.items.map((t) => (
              <TableRow key={t._id}><TableCell>{formatDate(t.createdAt)}</TableCell><TableCell className="capitalize">{t.plan}</TableCell><TableCell>{formatPrice(t.amount)}</TableCell><TableCell><StatusBadge status={t.status} /></TableCell></TableRow>
            ))}</TableBody>
          </Table>
        </div>
      )}
      <ConfirmDialog open={confirm} title="Cancel Premium?" message="You'll keep Premium until the end of the current billing period, then return to the Free plan." confirmLabel="Cancel subscription" destructive loading={busy} onConfirm={cancel} onClose={() => setConfirm(false)} />
    </>
  );
}