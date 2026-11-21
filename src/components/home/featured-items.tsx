"use client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { MenuCard, MenuCardSkeleton } from "@/components/menu-card";
import { SectionHeading } from "@/components/section-heading";
import { EmptyState, ErrorState } from "@/components/states";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/home/reveal";
import { useApi } from "@/hooks/use-api";
import type { MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FeaturedItems() {
  const { data, loading, error, reload } = useApi<{ items: MenuItem[] }>("/api/menu/featured?limit=6", false);
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Featured" title="Featured Menu Items" subtitle="Hand-picked favorites from our top restaurants. Premium partners appear first." />
        {error ? (
          <ErrorState message={error} onRetry={reload} />
        ) : loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <MenuCardSkeleton key={i} />)}</div>
        ) : !data?.items.length ? (
          <EmptyState title="No featured items yet" text="Check back soon. Restaurants are adding their menus." />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.items.map((it, i) => <Reveal key={it._id} delay={i * 0.05} className="h-full"><MenuCard item={it} /></Reveal>)}
          </div>
        )}
        <div className="mt-10 text-center">
          <Link href="/menu" className={cn(buttonVariants({ size: "lg" }), "h-11 gap-2 px-7 font-semibold")}>View Full Menu <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </section>
  );
}