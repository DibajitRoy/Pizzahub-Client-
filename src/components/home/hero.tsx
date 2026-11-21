"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Clock, ShieldCheck, Star } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-brand">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/bannerpizzahub.png" alt="" className="home-hero-image absolute inset-0 -z-20 size-full object-cover object-[78%_center]" />
      <div className="home-hero-overlay absolute inset-0 -z-10 bg-gradient-to-r from-brand via-brand/80 to-brand/10 max-md:from-brand/90 max-md:via-brand/75 max-md:to-brand/50" />
      <div className="mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-20 sm:px-6 lg:min-h-[640px]">
        <motion.div className="max-w-xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-gold backdrop-blur">
            <Star className="size-4 fill-gold" /> Rated #1 pizza ordering platform
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Hot &amp; Fresh <span className="text-gold">Pizza</span> Delivered to Your Door
          </h1>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/80">
            Discover local pizza shops, browse irresistible menus and order your favorites in just a few taps.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/menu" className={cn(buttonVariants({ size: "lg" }), "h-12 gap-2 px-7 text-base font-bold")}>
              Explore Pizza Menu <ArrowRight className="size-5" />
            </Link>
            <Link href="/signup" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-12 border-white/40 bg-transparent px-7 text-base font-semibold text-white hover:bg-white/10 hover:text-white")}>
              Become a Partner
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80">
            <span className="flex items-center gap-2"><Clock className="size-4 text-gold" /> Quick delivery</span>
            <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-gold" /> Verified restaurants</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
