"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  ChartNoAxesColumn, ClipboardList, CreditCard, Heart, LayoutDashboard,
  LogOut, Package, Plus, Receipt, Settings, ShieldCheck, Store, Users,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/logo";
import { UserAvatar } from "@/components/user-avatar";
import { authClient, useSession } from "@/lib/auth-client";
import { clearTokenCache } from "@/lib/api";
import type { Role } from "@/lib/types";
import { cn } from "@/lib/utils";

const navigation: Record<Role, { href: string; label: string; icon: typeof LayoutDashboard }[]> = {
  vendor: [
    { href: "/dashboard/vendor", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/vendor/items", label: "My Menu Items", icon: Package },
    { href: "/dashboard/vendor/add", label: "Add Menu Item", icon: Plus },
    { href: "/dashboard/vendor/orders", label: "Customer Orders", icon: ClipboardList },
    { href: "/dashboard/vendor/subscription", label: "Subscription", icon: CreditCard },
  ],
  customer: [
    { href: "/dashboard/customer", label: "Overview", icon: LayoutDashboard },
    { href: "/dashboard/customer/orders", label: "My Orders", icon: ClipboardList },
    { href: "/dashboard/customer/favorites", label: "Favorites", icon: Heart },
  ],
  admin: [
    { href: "/dashboard/admin", label: "Overview", icon: ChartNoAxesColumn },
    { href: "/dashboard/admin/users", label: "Manage Users", icon: Users },
    { href: "/dashboard/admin/items", label: "Manage Menu Items", icon: Package },
    { href: "/dashboard/admin/transactions", label: "Transactions", icon: Receipt },
  ],
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data } = useSession();
  const [signingOut, setSigningOut] = useState(false);
  const user = data?.user;
  const role = user?.role as Role | undefined;
  const links = role ? navigation[role] ?? [] : [];

  async function logout() {
    setSigningOut(true);
    try {
      await authClient.signOut();
      clearTokenCache();
      toast.success("Logged out successfully");
      router.replace("/signin");
      router.refresh();
    } catch {
      toast.error("Unable to log out. Please try again.");
      setSigningOut(false);
    }
  }

  const navLinks = (vertical = false) => (
    <>
      {links.map(({ href, label, icon: Icon }) => {
        const active = href === "/dashboard/vendor" || href === "/dashboard/customer" || href === "/dashboard/admin"
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link key={href} href={href} aria-current={active ? "page" : undefined}
            className={cn("flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors", active ? "bg-accent text-brand" : "text-foreground/75 hover:bg-muted hover:text-brand", vertical ? "md:w-full" : "") }>
            <Icon className="size-4" />{label}
          </Link>
        );
      })}
      <Link href="/dashboard/profile" aria-current={pathname === "/dashboard/profile" ? "page" : undefined}
        className={cn("flex shrink-0 items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors", pathname === "/dashboard/profile" ? "bg-accent text-brand" : "text-foreground/75 hover:bg-muted hover:text-brand", vertical ? "md:w-full" : "")}>
        <Settings className="size-4" />Profile Settings
      </Link>
    </>
  );

  return (
    <div className="min-h-screen bg-muted/20 md:grid md:grid-cols-[250px_minmax(0,1fr)]">
      <aside className="border-b bg-white md:sticky md:top-0 md:flex md:h-screen md:flex-col md:border-b-0 md:border-r">
        <div className="flex h-16 items-center justify-between px-4 md:px-5">
          <Logo />
          <div className="flex items-center gap-2">
            {role && <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-xs font-bold capitalize text-brand"><ShieldCheck className="size-3.5" />{role}</span>}
            <button type="button" onClick={logout} disabled={signingOut} aria-label="Log out" title="Log out" className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-700 disabled:opacity-50 md:hidden"><LogOut className="size-4" /></button>
          </div>
        </div>
        <nav aria-label="Dashboard navigation" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-1 md:flex-col md:overflow-y-auto md:px-3 md:py-5">
          {navLinks(true)}
        </nav>
        <div className="hidden border-t p-4 md:block">
          <Link href="/menu" className="mb-3 flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-foreground/75 hover:bg-muted hover:text-brand"><Store className="size-4" />Browse Menu</Link>
          {user && <div className="flex items-center gap-2.5 border-t pt-3">
            <UserAvatar name={user.name} image={user.image} />
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{user.name}</p><p className="truncate text-xs text-muted-foreground">{user.email}</p></div>
            <button type="button" onClick={logout} disabled={signingOut} aria-label="Log out" title="Log out" className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-700 disabled:opacity-50"><LogOut className="size-4" /></button>
          </div>}
        </div>
      </aside>
      <div className="min-w-0">
        <header className="hidden h-16 items-center justify-between border-b bg-white px-6 lg:flex lg:px-8">
          <p className="text-sm font-semibold text-muted-foreground">PizzaHub Dashboard</p>
          <Link href="/menu" className="text-sm font-semibold text-brand hover:underline">Explore menu</Link>
        </header>
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
