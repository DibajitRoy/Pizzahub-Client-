"use client";
import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <p className="text-6xl">🔥</p>
      <h1 className="mt-4 text-3xl font-extrabold text-brand">Something went wrong</h1>
      <p className="mt-2 text-muted-foreground">An unexpected error occurred. Please try again.</p>
      <Button onClick={reset} className="mt-6 h-11 px-6 font-semibold">
        Try again
      </Button>
    </div>
  );
}