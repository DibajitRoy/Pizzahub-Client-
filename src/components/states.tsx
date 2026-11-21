import { LoaderCircle, SearchX, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <LoaderCircle className="size-10 animate-spin text-gold" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}

export function InlineLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
      <LoaderCircle className="size-5 animate-spin text-gold" /> <span className="text-sm">{label}</span>
    </div>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed bg-muted/50 px-6 py-14 text-center">
      <SearchX className="mb-3 size-10 text-gold" />
      <h3 className="text-lg font-bold text-brand">{title}</h3>
      {text && <p className="mt-1 max-w-md text-sm text-muted-foreground">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
      <TriangleAlert className="mb-3 size-10 text-red-500" />
      <h3 className="text-lg font-bold text-red-700">Something went wrong</h3>
      <p className="mt-1 text-sm text-red-600">{message}</p>
      {onRetry && (
        <Button variant="outline" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}