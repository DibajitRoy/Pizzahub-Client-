import { CheckCheck, Search, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/home/reveal";

const STEPS = [
  { icon: Search, title: "Browse", text: "Search menus from local pizza shops and filter by category or location." },
  { icon: ShoppingBag, title: "Order", text: "Pick your delivery date, add your address and place the order." },
  { icon: CheckCheck, title: "Confirmed", text: "The restaurant accepts your order and starts preparing it." },
  { icon: UtensilsCrossed, title: "Enjoy", text: "Your hot, fresh pizza arrives at your door. Dig in!" },
];

export function HowItWorks() {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Simple Steps" title="How PizzaHub Works" subtitle="From craving to doorstep in four easy steps." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08} className="h-full">
              <div className="relative h-full rounded-2xl bg-white p-6 shadow-sm">
                <span className="absolute -top-4 left-6 flex size-9 items-center justify-center rounded-full bg-gold text-sm font-extrabold text-brand">{i + 1}</span>
                <s.icon className="mb-4 mt-2 size-9 text-brand" />
                <h3 className="text-lg font-bold text-brand">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}