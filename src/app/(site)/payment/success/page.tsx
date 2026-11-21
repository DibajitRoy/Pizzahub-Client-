"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CircleCheck, LoaderCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { PageLoader } from "@/components/states";
import { RoleGuard } from "@/components/role-guard";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

function Success() {
  const [state, setState] = useState<"checking" | "premium" | "pending">("checking");

  useEffect(() => {
    let tries = 0;
    let stop = false;
    async function poll() {
      try {
        // Premium is only activated by the verified Stripe webhook on the server.
        const s = await api<{ plan: string }>("/api/payments/status");
        if (stop) return;
        if (s.plan === "premium") return setState("premium");
      } catch {}
      if (++tries >= 10) return setState("pending");
      setTimeout(poll, 2000);
    }
    poll();
    return () => { stop = true; };
  }, []);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      {state === "checking" ? (
        <>
          <LoaderCircle className="size-14 animate-spin text-gold" />
          <h1 className="mt-5 text-2xl font-extrabold text-brand">Confirming your payment...</h1>
          <p className="mt-2 text-muted-foreground">Please wait while we verify your subscription with Stripe.</p>
        </>
      ) : state === "premium" ? (
        <>
          <CircleCheck className="size-16 text-green-500" />
          <h1 className="mt-5 text-3xl font-extrabold text-brand">Payment successful! 🎉</h1>
          <p className="mt-2 text-muted-foreground">You&apos;re now a Premium vendor. Enjoy unlimited items, the Premium badge and featured placement.</p>
        </>
      ) : (
        <>
          <CircleCheck className="size-16 text-gold" />
          <h1 className="mt-5 text-3xl font-extrabold text-brand">Payment received</h1>
          <p className="mt-2 text-muted-foreground">Your payment is being verified. Premium will activate automatically in a moment. Refresh your subscription page shortly.</p>
        </>
      )}
      <Link href="/dashboard/vendor/subscription" className={cn(buttonVariants({ size: "lg" }), "mt-8 h-11 px-7 font-semibold")}>Go to Subscription</Link>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return <RoleGuard role="vendor" fallback={<PageLoader />}><Success /></RoleGuard>;
}