"use client";

import Link from "next/link";
import { Reveal } from "@/components/home/reveal";
import { SafeImg } from "@/components/menu-card";
import { useApi } from "@/hooks/use-api";
import type { MenuItem, Paged } from "@/lib/types";
import type { CATEGORIES } from "@/lib/constants";

type Category = (typeof CATEGORIES)[number];

export function CategoryCard({ category, delay }: { category: Category; delay: number }) {
  const query = new URLSearchParams({ category: category.name, limit: "1", sort: "newest" });
  const { data } = useApi<Paged<MenuItem>>(`/api/menu?${query.toString()}`, false);
  const image = data?.items.find((item) => item.images?.[0])?.images[0] ?? category.image;

  return (
    <Reveal delay={delay}>
      <Link href={`/menu?category=${encodeURIComponent(category.name)}`} className="group relative block aspect-[4/3] overflow-hidden rounded-2xl bg-brand shadow-sm">
        <SafeImg src={image} alt={category.name} className="home-category-image size-full object-cover opacity-90 transition-transform duration-500 group-hover:scale-110" />
        <div className="home-category-overlay absolute inset-0 bg-gradient-to-t from-brand/90 via-brand/20 to-transparent" />
        <div className="absolute bottom-0 p-4 sm:p-5">
          <h3 className="text-base font-bold text-white sm:text-xl">{category.name}</h3>
          <p className="text-xs text-gold sm:text-sm">{category.blurb}</p>
        </div>
      </Link>
    </Reveal>
  );
}
