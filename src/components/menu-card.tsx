"use client";
import Link from "next/link";
import { Crown, Heart, MapPin, Store } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/components/favorites-provider";
import { FALLBACK_IMG } from "@/lib/constants";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SafeImg({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src || FALLBACK_IMG} alt={alt} className={className} loading="lazy"
      onError={(e) => { const t = e.currentTarget; if (!t.src.endsWith(FALLBACK_IMG)) t.src = FALLBACK_IMG; }} />
  );
}

export function MenuCard({ item }: { item: MenuItem }) {
  const { ids, enabled, toggle } = useFavorites();
  const fav = ids.has(item._id);
  return (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <SafeImg src={item.images?.[0]} alt={item.itemName} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <Badge className="absolute left-3 top-3 bg-white/95 text-brand hover:bg-white">{item.category}</Badge>
        {item.vendor?.isPremium && (
          <Badge className="absolute bottom-3 left-3 gap-1 bg-brand text-gold hover:bg-brand"><Crown className="size-3" /> Premium</Badge>
        )}
        {enabled && (
          <button onClick={() => toggle(item._id)} aria-label="Toggle favorite"
            className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-white/95 shadow">
            <Heart className={cn("size-4", fav ? "fill-red-500 text-red-500" : "text-brand")} />
          </button>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-lg font-bold text-brand">{item.itemName}</h3>
          <span className="shrink-0 text-lg font-extrabold text-gold">{formatPrice(item.price)}</span>
        </div>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-4 shrink-0 text-gold" /><span className="line-clamp-1">{item.location}</span></p>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground"><Store className="size-4 shrink-0 text-gold" /><span className="line-clamp-1">{item.vendor?.businessName || item.vendor?.name}</span></p>
        <div className="mt-auto pt-4">
          <Link href={`/menu/${item._id}`} className={cn(buttonVariants(), "h-10 w-full font-semibold")}>View Details</Link>
        </div>
      </div>
    </div>
  );
}

export function MenuCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border bg-white">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="space-y-3 p-4">
        <Skeleton className="h-5 w-3/4" /><Skeleton className="h-4 w-1/2" /><Skeleton className="h-4 w-2/3" /><Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}