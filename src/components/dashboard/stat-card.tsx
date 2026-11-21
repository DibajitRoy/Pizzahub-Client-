import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function StatCard({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon: LucideIcon }) {
  return (
    <Card className="border shadow-sm">
      <CardContent className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-brand"><Icon className="size-6" /></span>
        <div className="min-w-0">
          <p className="truncate text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-extrabold capitalize text-brand">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}