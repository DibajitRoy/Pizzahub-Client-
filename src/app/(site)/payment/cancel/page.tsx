"use client";
import Link from "next/link";
import { CircleX } from "lucide-react";
import { RoleGuard } from "@/components/role-guard";
import { buttonVariants } from "@/components/ui/button";
import { PageLoader } from "@/components/states";
import { cn } from "@/lib/utils";

export default function PaymentCancelPage() {
  return (
    <RoleGuard role="vendor" fallback={<PageLoader />}>
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-4 text-center">
        <CircleX className="size-16 text-red-500" />
        <h1 className="mt-5 text-3xl font-extrabold text-brand">Payment cancelled</h1>
        <p className="mt-2 text-muted-foreground">No charges were made. You can upgrade to Premium any time.</p>
        <Link href="/dashboard/vendor/subscription" className={cn(buttonVariants({ size: "lg" }), "mt-8 h-11 px-7 font-semibold")}>Back to Subscription</Link>
      </div>
    </RoleGuard>
  );
}