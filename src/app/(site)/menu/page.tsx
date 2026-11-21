"use client";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { MenuCard, MenuCardSkeleton } from "@/components/menu-card";
import { Pager } from "@/components/pager";
import { SelectField } from "@/components/select-field";
import { EmptyState, ErrorState } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApi, useDebounce } from "@/hooks/use-api";
import { CATEGORY_NAMES } from "@/lib/constants";
import type { MenuItem, Paged } from "@/lib/types";

function BrowseMenu({ initialCategory }: { initialCategory: string }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState("");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const dSearch = useDebounce(search);

  const qs = new URLSearchParams({ sort, page: String(page), limit: "9" });
  if (dSearch) qs.set("search", dSearch);
  if (category) qs.set("category", category);
  if (location) qs.set("location", location);

  const { data, loading, error, reload } = useApi<Paged<MenuItem>>(`/api/menu?${qs}`, false);
  const { data: locs } = useApi<{ locations: string[] }>("/api/menu/locations", false);
  const hasFilter = search || category || location || sort !== "newest";
  const reset = () => { setSearch(""); setCategory(""); setLocation(""); setSort("newest"); setPage(1); };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-brand sm:text-4xl">Browse Pizza Menu</h1>
        <p className="mt-2 text-muted-foreground">Search, filter and sort to find your perfect pizza.</p>
      </div>

      <div className="mb-8 grid gap-3 rounded-2xl border bg-muted/60 p-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or description..." className="h-10 bg-white pl-9" />
        </div>
        <SelectField value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }}>
          <option value="">All Categories</option>
          {CATEGORY_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
        </SelectField>
        <SelectField value={location} onChange={(e) => { setLocation(e.target.value); setPage(1); }}>
          <option value="">All Locations</option>
          {locs?.locations.map((l) => <option key={l} value={l}>{l}</option>)}
        </SelectField>
        <SelectField value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
          <option value="newest">Newest first</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </SelectField>
      </div>
      {hasFilter && (
        <div className="mb-6 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{data ? `${data.total} item${data.total === 1 ? "" : "s"} found` : ""}</span>
          <Button variant="ghost" size="sm" onClick={reset} className="gap-1"><X className="size-4" /> Clear filters</Button>
        </div>
      )}

      {error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <MenuCardSkeleton key={i} />)}</div>
      ) : !data?.items.length ? (
        <EmptyState title="No pizzas found" text="Try a different search or clear your filters." action={<Button onClick={reset}>Clear filters</Button>} />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data.items.map((it) => <MenuCard key={it._id} item={it} />)}</div>
          <Pager page={data.page} pages={data.pages} onChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); }} />
        </>
      )}
    </div>
  );
}

function BrowseMenuRoute() {
  const sp = useSearchParams();
  const initialCategory = sp.get("category") ?? "";
  return <BrowseMenu key={initialCategory} initialCategory={initialCategory} />;
}

export default function MenuPage() {
  return (
    <Suspense fallback={<div className="py-24 text-center text-muted-foreground">Loading menu...</div>}>
      <BrowseMenuRoute />
    </Suspense>
  );
}
