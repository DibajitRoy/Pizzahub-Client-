import Link from "next/link";
import { Crown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Reveal } from "@/components/home/reveal";
import { cn } from "@/lib/utils";

export function VendorCta() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Reveal>
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-brand px-6 py-14 text-center md:px-16">
            <Crown className="size-10 text-gold" />
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Own a pizza shop? Grow with PizzaHub</h2>
            <p className="max-w-2xl text-white/80">List your menu, manage orders and go Premium for unlimited items, a Premium badge and featured placement on our homepage.</p>
            <Link href="/signup" className={cn(buttonVariants({ size: "lg" }), "h-12 px-8 text-base font-bold")}>Join as a Restaurant</Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}