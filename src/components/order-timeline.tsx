import { formatDate } from "@/lib/format";
import type { Order } from "@/lib/types";
import { cn } from "@/lib/utils";

export function OrderTimeline({ order }: { order: Order }) {
  const steps: { label: string; note: string; state: "done" | "current" | "bad" }[] = [
    { label: "Order placed", note: formatDate(order.createdAt), state: "done" },
  ];
  if (order.status === "pending") steps.push({ label: "Waiting for restaurant", note: "The restaurant will review your order", state: "current" });
  if (order.status === "accepted") steps.push({ label: "Accepted by restaurant", note: `Delivery on ${formatDate(order.deliveryDate)}`, state: "done" });
  if (order.status === "rejected") steps.push({ label: "Rejected by restaurant", note: "Sorry, the restaurant couldn't take this order", state: "bad" });
  if (order.status === "cancelled") steps.push({ label: "Cancelled by you", note: "This order was cancelled", state: "bad" });
  return (
    <ol className="relative ml-3 space-y-5 border-l-2 border-gold/40 pl-6">
      {steps.map((s, i) => (
        <li key={i} className="relative">
          <span className={cn("absolute -left-[33px] top-0.5 size-4 rounded-full border-2 border-white ring-2",
            s.state === "done" && "bg-green-500 ring-green-300", s.state === "current" && "animate-pulse bg-gold ring-gold/40", s.state === "bad" && "bg-red-500 ring-red-300")} />
          <p className="text-sm font-bold text-brand">{s.label}</p>
          <p className="text-xs text-muted-foreground">{s.note}</p>
        </li>
      ))}
    </ol>
  );
}