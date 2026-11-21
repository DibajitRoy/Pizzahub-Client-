import { Flame, ShieldCheck, Store, Truck } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/home/reveal";

const FEATURES = [
  { icon: Truck, title: "Fast Delivery", text: "Choose your delivery date and get your pizza right on time." },
  { icon: Store, title: "Local Pizza Shops", text: "Support neighborhood restaurants with authentic recipes." },
  { icon: Flame, title: "Always Hot & Fresh", text: "Baked to order and delivered while it's still piping hot." },
  { icon: ShieldCheck, title: "Safe & Trusted", text: "Every menu item is reviewed by our team before it goes live." },
];

export function WhyChoose() {
  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Benefits" title="Why Choose PizzaHub?" subtitle="We make ordering great pizza simple, safe and delicious." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.07} className="h-full">
              <div className="h-full rounded-2xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:border-gold hover:shadow-lg">
                <span className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-accent text-brand"><f.icon className="size-7" /></span>
                <h3 className="text-lg font-bold text-brand">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}