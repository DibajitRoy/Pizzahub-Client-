"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/format";

type Review = { _id: string; rating: number; comment: string; createdAt: string; customer?: { name: string } };
function ReviewPanel({ path, title, canReview }: { path: string; title: string; canReview: boolean }) {
  const { data } = useSession();
  const [reviews, setReviews] = useState<Review[] | null>(null);
  const [summary, setSummary] = useState({ average: 0, count: 0 });
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  async function load() {
    try { const result = await api<{ items: Review[]; average: number; count: number }>(`/api/reviews/${path}`, { auth: false }); setReviews(result.items); setSummary({ average: result.average, count: result.count }); }
    catch (e) { toast.error((e as Error).message); }
  }
  useEffect(() => { void load(); }, [path]);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true);
    try { await api(`/api/reviews/${path}`, { method: "POST", body: { rating, comment } }); toast.success("Review submitted"); setComment(""); await load(); }
    catch (err) { toast.error((err as Error).message); }
    finally { setBusy(false); }
  }
  return <section className="rounded-2xl border bg-card p-5 sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-2xl font-bold text-brand">{title}</h2><p className="mt-1 text-sm text-muted-foreground">Ratings and feedback from our customers</p><p className="mt-2 flex items-center gap-1 text-sm font-semibold"><Star className="size-4 fill-gold text-gold" />{summary.average ? `${summary.average} / 5` : "No ratings yet"}<span className="font-normal text-muted-foreground">({summary.count} reviews)</span></p></div><button onClick={load} className="text-sm font-semibold text-brand">Refresh</button></div>
    {canReview && data?.user?.role === "customer" && <form onSubmit={submit} className="mt-5 grid gap-3 rounded-xl bg-muted/50 p-4"><label className="text-sm font-semibold">Your rating<select value={rating} onChange={e => setRating(Number(e.target.value))} className="ml-3 rounded-lg border bg-background px-3 py-2">{[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}</select></label><textarea value={comment} onChange={e => setComment(e.target.value)} maxLength={1000} required placeholder="Share your experience" className="min-h-20 rounded-xl border bg-background p-3"/><button disabled={busy} className="w-fit rounded-xl bg-primary px-5 py-2 font-bold text-primary-foreground disabled:opacity-60">{busy ? "Submitting…" : "Submit review"}</button></form>}
    <div className="mt-5 grid gap-3">{reviews === null ? <p className="text-sm text-muted-foreground">Loading reviews…</p> : reviews.length === 0 ? <p className="text-sm text-muted-foreground">No reviews yet. Be the first to leave one.</p> : reviews.map(r => <article key={r._id} className="rounded-xl border p-4"><div className="flex items-center justify-between"><b>{r.customer?.name || "Customer"}</b><time className="text-xs text-muted-foreground">{formatDate(r.createdAt)}</time></div><p className="mt-1 flex items-center gap-1 text-gold">{Array.from({length:r.rating}, (_,i)=><Star key={i} className="size-4 fill-current" />)}<span className="ml-1 text-sm text-foreground">{r.rating}/5</span></p><p className="mt-2 text-sm text-muted-foreground">{r.comment}</p></article>)}</div>
  </section>;
}

export function ItemReviews({ itemId, vendorId }: { itemId: string; vendorId: string }) {
  return <div className="mt-12 grid gap-6"><ReviewPanel path={itemId} title="Menu item reviews" canReview /><ReviewPanel path={`restaurant/${vendorId}`} title="Restaurant reviews" canReview /></div>;
}
