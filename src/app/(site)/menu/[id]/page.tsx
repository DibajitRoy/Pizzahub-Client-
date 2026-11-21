"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Crown, MapPin, ShoppingBag, Store } from "lucide-react";
import { OrderForm } from "@/components/order-form";
import { ItemReviews } from "@/components/item-reviews";
import { SafeImg } from "@/components/menu-card";
import { ErrorState, PageLoader } from "@/components/states";
import { UserAvatar } from "@/components/user-avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { useApi } from "@/hooks/use-api";
import { useSession } from "@/lib/auth-client";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function ItemDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const user = session?.user;
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isPending && !user) router.replace(`/signin?redirect=/menu/${id}`);
  }, [isPending, user, id, router]);

  const { data: item, loading, error, reload } = useApi<MenuItem>(user ? `/api/menu/${id}` : null);

  if (isPending || !user || loading || (!item && !error)) return <PageLoader label="Loading item..." />;
  if (error || !item) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <ErrorState message={error || "Item not found"} onRetry={reload} />
        <div className="mt-6 text-center"><Link href="/menu" className={cn(buttonVariants(), "h-10 px-6")}>Back to Menu</Link></div>
      </div>
    );
  }

  const approved = item.status === "approved";
  let orderNote = "";
  if (!approved) orderNote = "This item is not available for ordering right now.";
  else if (user.role === "vendor") orderNote = "Restaurant accounts cannot place orders.";
  else if (user.role === "admin") orderNote = "Admin accounts cannot place customer orders.";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <Link href="/menu" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-brand"><ArrowLeft className="size-4" /> Back to menu</Link>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <div className="aspect-[4/3] overflow-hidden rounded-2xl border bg-muted">
            <SafeImg src={item.images[active]} alt={item.itemName} className="size-full object-cover" />
          </div>
          {item.images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {item.images.map((img, i) => (
                <button key={img} onClick={() => setActive(i)} className={cn("aspect-[4/3] overflow-hidden rounded-xl border-2", i === active ? "border-gold" : "border-transparent opacity-70 hover:opacity-100")}>
                  <SafeImg src={img} alt="" className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-accent text-brand hover:bg-accent">{item.category}</Badge>
            {!approved && <Badge variant="outline" className="capitalize">{item.status}</Badge>}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold text-brand sm:text-4xl">{item.itemName}</h1>
          <p className="mt-3 text-3xl font-extrabold text-gold">{formatPrice(item.price)}</p>
          <p className="mt-4 flex items-center gap-2 text-muted-foreground"><MapPin className="size-5 text-gold" /> {item.location}</p>
          <p className="mt-5 leading-relaxed text-foreground/80">{item.description}</p>

          <div className="mt-6 flex items-center gap-3 rounded-2xl border bg-muted/60 p-4">
            <UserAvatar name={item.vendor?.name} image={item.vendor?.image} className="size-12" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1.5 truncate font-bold text-brand"><Store className="size-4 text-gold" />{item.vendor?.businessName || item.vendor?.name}</p>
              <p className="text-xs text-muted-foreground">Restaurant partner</p>
            </div>
            {item.vendor?.isPremium && <Badge className="gap-1 bg-brand text-gold hover:bg-brand"><Crown className="size-3" /> Premium</Badge>}
          </div>

          <div className="mt-8">
            {orderNote ? (
              <p className="rounded-xl border border-gold/50 bg-accent p-4 text-sm font-medium text-brand">{orderNote}</p>
            ) : (
              <Button onClick={() => setOpen(true)} className="h-12 w-full gap-2 text-base font-bold sm:w-auto sm:px-10"><ShoppingBag className="size-5" /> Order Now</Button>
            )}
          </div>
        </div>
      </div>
      <ItemReviews itemId={item._id} vendorId={item.vendorId} />
      <OrderForm item={item} open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
