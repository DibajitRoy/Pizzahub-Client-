"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { useSession } from "@/lib/auth-client";

interface Ctx {
  ids: Set<string>;
  enabled: boolean;
  toggle: (id: string) => Promise<void>;
}
const FavCtx = createContext<Ctx>({ ids: new Set(), enabled: false, toggle: async () => {} });
const EMPTY_IDS = new Set<string>();
export const useFavorites = () => useContext(FavCtx);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { data } = useSession();
  const enabled = data?.user?.role === "customer";
  const userId = enabled ? data?.user?.id : undefined;
  const [favorites, setFavorites] = useState<{ userId: string; ids: Set<string> } | null>(null);
  const ids = userId && favorites?.userId === userId ? favorites.ids : EMPTY_IDS;

  useEffect(() => {
    if (!userId) return;
    let alive = true;
    api<string[]>("/api/favorites/ids").then((l) => alive && setFavorites({ userId, ids: new Set(l) })).catch(() => {});
    return () => { alive = false; };
  }, [userId]);

  async function toggle(id: string) {
    const has = ids.has(id);
    try {
      await api(`/api/favorites/${id}`, { method: has ? "DELETE" : "POST" });
      setFavorites((p) => {
        if (!userId) return p;
        const n = new Set(p?.userId === userId ? p.ids : []);
        if (has) n.delete(id);
        else n.add(id);
        return { userId, ids: n };
      });
      toast.success(has ? "Removed from favorites" : "Added to favorites");
    } catch (e) {
      toast.error((e as Error).message);
    }
  }
  return <FavCtx.Provider value={{ ids, enabled, toggle }}>{children}</FavCtx.Provider>;
}
