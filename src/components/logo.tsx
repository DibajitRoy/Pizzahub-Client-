import Link from "next/link";
import { cn } from "@/lib/utils";

// Crops the triangle mark out of /pizzahubLogo.png
export function LogoMark({ size = 40 }: { size?: number }) {
  const w = size * 4.1;
  return (
    <span className="relative inline-block shrink-0 overflow-hidden rounded-xl bg-[#3d0f0a]" style={{ width: size, height: size }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/pizzahubLogo.png"
        alt="PizzaHub logo"
        className="absolute max-w-none"
        style={{ width: w, left: -(w / 2 - size / 2), top: -(w * 0.5625 * 0.41 - size / 2) }}
      />
    </span>
  );
}

export function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className={cn("font-heading text-xl font-extrabold tracking-tight", light ? "text-white" : "text-brand")}>
        Pizza<span className="text-gold">Hub</span>
      </span>
    </Link>
  );
}