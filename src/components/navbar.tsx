"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/logo";
import { UserAvatar } from "@/components/user-avatar";
import { buttonVariants } from "@/components/ui/button";
import { authClient, useSession } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data, isPending } = useSession();
  const user = data?.user;
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setMenu(false);
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const links = [
    { href: "/", label: "Home" },
    { href: "/menu", label: "Browse Menu" },
  ];
  if (user?.role === "customer") links.push({ href: "/dashboard/customer/orders", label: "My Orders" });
  if (user?.role === "vendor") links.push({ href: "/dashboard/vendor/items", label: "My Menu" });
  if (user?.role === "admin") links.push({ href: "/dashboard/admin/users", label: "Manage Users" });

  async function logout() {
    await authClient.signOut();
    clearTokenCache();
    setMenu(false);
    toast.success("Logged out successfully");
    router.push("/");
  }

  const linkCls = (href: string) =>
    cn(
      "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
      (href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "bg-accent text-brand" : "text-foreground/80 hover:bg-muted hover:text-brand"
    );

  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => { setOpen(false); setMenu(false); }} className={linkCls(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isPending ? (
            <div className="size-9 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <div className="relative" ref={ref}>
              <button onClick={() => setMenu((m) => !m)} className="flex items-center gap-2 rounded-full border bg-white py-1 pl-1 pr-3 hover:bg-muted">
                <UserAvatar name={user.name} image={user.image} />
                <span className="max-w-28 truncate text-sm font-semibold">{user.name}</span>
                <ChevronDown className="size-4" />
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border bg-white shadow-xl">
                  <div className="flex items-center gap-3 border-b bg-muted/60 p-3">
                    <UserAvatar name={user.name} image={user.image} className="size-10" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">{user.name}</p>
                      <p className="truncate text-xs capitalize text-muted-foreground">{user.role}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent">
                    <LayoutDashboard className="size-4" /> Dashboard
                  </Link>
                  <Link href="/dashboard/profile" onClick={() => setMenu(false)} className="flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-accent">
                    <User className="size-4" /> Profile Settings
                  </Link>
                  <button onClick={logout} className="flex w-full items-center gap-2 border-t px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="size-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/signin" className={cn(buttonVariants({ variant: "outline" }), "h-10 px-5 font-semibold")}>
                Sign In
              </Link>
              <Link href="/signup" className={cn(buttonVariants(), "h-10 px-5 font-semibold")}>
                Sign Up
              </Link>
            </>
          )}
        </div>

        <button className="rounded-lg p-2 md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="space-y-1 border-t bg-white px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={cn(linkCls(l.href), "block")}>
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link href="/dashboard" onClick={() => setOpen(false)} className={cn(linkCls("/dashboard"), "block")}>Dashboard</Link>
              <Link href="/dashboard/profile" onClick={() => setOpen(false)} className={cn(linkCls("/dashboard/profile"), "block")}>Profile Settings</Link>
              <button onClick={logout} className="block w-full rounded-full px-4 py-2 text-left text-sm font-semibold text-red-600">Logout</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link href="/signin" onClick={() => setOpen(false)} className={cn(buttonVariants({ variant: "outline" }), "h-10 flex-1")}>Sign In</Link>
              <Link href="/signup" onClick={() => setOpen(false)} className={cn(buttonVariants(), "h-10 flex-1")}>Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
