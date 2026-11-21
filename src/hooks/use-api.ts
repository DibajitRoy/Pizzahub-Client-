"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";

export function useApi<T>(path: string | null, auth = true) {
  const [result, setResult] = useState<{ key: string; data: T | null; error: string | null } | null>(null);
  const [tick, setTick] = useState(0);
  const key = `${path ?? ""}|${auth}|${tick}`;

  useEffect(() => {
    if (!path) return;
    let alive = true;
    api<T>(path, { auth })
      .then((data) => alive && setResult({ key, data, error: null }))
      .catch((e: Error) => alive && setResult({ key, data: null, error: e.message }));
    return () => {
      alive = false;
    };
  }, [path, auth, tick, key]);

  const current = result?.key === key ? result : null;
  return { data: current?.data ?? null, loading: !!path && !current, error: current?.error ?? null, reload: () => setTick((t) => t + 1) };
}

export function useDebounce<T>(value: T, ms = 400) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}
