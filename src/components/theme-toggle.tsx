"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("pizzahub-theme");
    const value = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDark(value);
    document.documentElement.classList.toggle("dark", value);
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("pizzahub-theme", next ? "dark" : "light");
  }
  return <button type="button" onClick={toggle} aria-label={`Switch to ${dark ? "light" : "dark"} mode`} className="inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold hover:bg-muted"><span>{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}</span>{!compact && (dark ? "Light mode" : "Dark mode")}</button>;
}
