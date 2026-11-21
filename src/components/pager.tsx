import { Button } from "@/components/ui/button";

export function Pager({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="mt-6 flex items-center justify-center gap-3">
      <Button variant="outline" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</Button>
      <span className="text-sm font-medium text-muted-foreground">Page {page} of {pages}</span>
      <Button variant="outline" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</Button>
    </div>
  );
}