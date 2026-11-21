"use client";
import { useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Modal({ open, onClose, title, children, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", h);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-brand/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl", wide ? "max-w-2xl" : "max-w-md")}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-brand">{title}</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted" aria-label="Close"><X className="size-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", destructive, loading, onConfirm, onClose }: {
  open: boolean; title: string; message: string; confirmLabel?: string; destructive?: boolean; loading?: boolean; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title}>
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
        <Button variant={destructive ? "destructive" : "default"} onClick={onConfirm} disabled={loading}>{loading ? "Please wait..." : confirmLabel}</Button>
      </div>
    </Modal>
  );
}