import { cn } from "@/lib/utils";

const MAP: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-800",
  accepted: "bg-green-100 text-green-800",
  paid: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  failed: "bg-red-100 text-red-800",
  cancelled: "bg-stone-200 text-stone-700",
  inactive: "bg-stone-200 text-stone-700",
};
export function StatusBadge({ status }: { status: string }) {
  return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", MAP[status] ?? "bg-stone-100 text-stone-700")}>{status}</span>;
}