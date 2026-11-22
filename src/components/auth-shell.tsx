import { ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="bg-[#f8f5ef] px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
      <div className="mx-auto grid min-h-[min(760px,calc(100svh-8rem))] max-w-6xl overflow-hidden rounded-[28px] border border-[#eadfce] bg-white shadow-[0_24px_80px_-40px_rgba(61,15,10,0.35)] lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="relative hidden min-h-[650px] overflow-hidden bg-[#3d0f0a] lg:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/bannerpizzahub.png" alt="Freshly baked PizzaHub pizza" className="absolute inset-0 size-full object-cover object-[69%_center]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#210805]/95 via-[#210805]/25 to-[#210805]/10" />
          <div className="absolute left-9 top-9">
            <Logo light />
          </div>
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-3.5 py-2 text-xs font-semibold tracking-wide text-white/90 backdrop-blur-sm">
              <Sparkles className="size-3.5 text-[#ffc247]" /> GOOD FOOD, GOOD MOOD
            </div>
            <h2 className="max-w-md font-heading text-4xl font-extrabold leading-[1.12] tracking-tight xl:text-[44px]">
              A little slice of <span className="text-[#ffc247]">happiness.</span>
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
              Order from the neighborhood spots you love, or bring your restaurant to more people.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-white/90">
              <span className="flex -space-x-2" aria-hidden="true">
                <span className="size-8 rounded-full border-2 border-[#3d0f0a] bg-[#ffc247]" />
                <span className="size-8 rounded-full border-2 border-[#3d0f0a] bg-[#f28c55]" />
                <span className="size-8 rounded-full border-2 border-[#3d0f0a] bg-[#f4d9a7]" />
              </span>
              <span>Freshly made. Always worth it.</span>
            </div>
          </div>
        </aside>

        <div className="flex items-center justify-center px-5 py-9 sm:px-10 lg:px-14 xl:px-20">
          <div className="w-full max-w-[410px]">
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Logo />
              <Link href="/" className="inline-flex items-center gap-1 text-sm font-semibold text-[#6f544a] hover:text-brand">
                Home <ArrowUpRight className="size-4" />
              </Link>
            </div>
            <div className="mb-8">
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#c47b08]">Welcome to PizzaHub</p>
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-[#32100c] sm:text-[34px]">{title}</h1>
              <p className="mt-2 text-[15px] leading-6 text-[#78665f]">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-1 pt-4 text-xs text-[#907c70]">
        <span>© {new Date().getFullYear()} PizzaHub</span>
        <span>Fresh food. Friendly service.</span>
      </div>
    </section>
  );
}
