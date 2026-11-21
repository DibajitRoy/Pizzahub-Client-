import { SectionHeading } from "@/components/section-heading";
import { CategoryCard } from "@/components/home/category-card";
import { CATEGORIES } from "@/lib/constants";

export function Categories() {
  return (
    <section className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading eyebrow="Categories" title="Pizza Categories" subtitle="Craving something specific? Jump straight into your favorite category." />
        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
          {CATEGORIES.map((c, i) => (
            <CategoryCard key={c.name} category={c} delay={i * 0.05} />
          ))}
        </div>
      </div>
    </section>
  );
}
