import { Categories } from "@/components/home/categories";
import { FeaturedItems } from "@/components/home/featured-items";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { VendorCta } from "@/components/home/vendor-cta";
import { WhyChoose } from "@/components/home/why-choose";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedItems />
      <Categories />
      <WhyChoose />
      <HowItWorks />
      <VendorCta />
    </>
  );
}