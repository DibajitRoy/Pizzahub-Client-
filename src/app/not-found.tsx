import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 text-center">
      <p className="text-8xl">🍕</p>
      <h1 className="mt-4 text-5xl font-extrabold text-brand">404</h1>
      <p className="mt-2 text-lg text-muted-foreground">Oops! This slice of the page is missing.</p>
      <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-6 h-11 px-6 font-semibold")}>
        Back to Home
      </Link>
    </div>
  );
}