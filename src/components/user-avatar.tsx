import { cn } from "@/lib/utils";

export function UserAvatar({ name, image, className }: { name?: string | null; image?: string | null; className?: string }) {
  const initials = (name || "U").trim().split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  return image ? (
  
    <img src={image} alt={name || "User"} referrerPolicy="no-referrer" className={cn("size-9 rounded-full border object-cover", className)} />
  ) : (
    <span className={cn("flex size-9 items-center justify-center rounded-full bg-gold text-sm font-bold text-brand", className)}>{initials}</span>
  );
}