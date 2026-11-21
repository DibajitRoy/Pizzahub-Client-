"use client";
import { MenuCard, MenuCardSkeleton } from "@/components/menu-card";
import { PageTitle } from "@/components/dashboard/page-title";
import { EmptyState, ErrorState } from "@/components/states";
import { useFavorites } from "@/components/favorites-provider";
import { useApi } from "@/hooks/use-api";
import type { MenuItem } from "@/lib/types";

export default function FavoritesPage() {
  const { ids } = useFavorites();
  // re-fetch whenever the favorite set changes size
  const { data, loading, error, reload } = useApi<{ items: MenuItem[] }>(`/api/favorites?n=${ids.size}`);
  return (
    <>
      <PageTitle title="Favorites" subtitle="Pizzas you've saved for later" />
      {error ? <ErrorState message={error} onRetry={reload} /> : loading && !data ? (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 3 }).map((_, i) => <MenuCardSkeleton key={i} />)}</div>
      ) : !data?.items.length ? (
        <EmptyState title="No favorites yet" text="Tap the heart on any menu item to save it here." />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{data.items.map((it) => <MenuCard key={it._id} item={it} />)}</div>
      )}
    </>
  );
}