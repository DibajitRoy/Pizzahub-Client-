import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/logo";
import { FacebookIcon, InstagramIcon, LinkedinIcon, XIcon } from "@/components/social-icons";

export function Footer() {
  const social = [
    { label: "X", href: "https://x.com", icon: <XIcon /> },
    { label: "Facebook", href: "https://facebook.com", icon: <FacebookIcon /> },
    { label: "Instagram", href: "https://instagram.com", icon: <InstagramIcon /> },
    { label: "LinkedIn", href: "https://linkedin.com", icon: <LinkedinIcon /> },
  ];
  return (
    <footer className="bg-brand text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <Logo light />
          <p className="mt-4 text-sm leading-relaxed">
            Discover local pizza shops, browse their menus and get hot, fresh pizza delivered right to your door.
          </p>
          <div className="mt-5 flex gap-2">
            {social.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label}
                className="flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-gold hover:text-brand">
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-4 text-base font-bold text-gold">Explore</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/" className="hover:text-gold">Home</Link></li>
            <li><Link href="/menu" className="hover:text-gold">Browse Menu</Link></li>
            <li><Link href="/signin" className="hover:text-gold">Sign In</Link></li>
            <li><Link href="/signup" className="hover:text-gold">Sign Up</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-base font-bold text-gold">Popular Categories</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/menu?category=Classic%20Pizzas" className="hover:text-gold">Classic Pizzas</Link></li>
            <li><Link href="/menu?category=Vegetarian%20Pizzas" className="hover:text-gold">Vegetarian Pizzas</Link></li>
            <li><Link href="/menu?category=Meat%20Lovers" className="hover:text-gold">Meat Lovers</Link></li>
            <li><Link href="/menu?category=Beverages%20%26%20Desserts" className="hover:text-gold">Beverages & Desserts</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 text-base font-bold text-gold">Contact</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-2"><MapPin className="mt-0.5 size-4 shrink-0 text-gold" /> House 12, Road 5, Dhanmondi, Dhaka</li>
            <li className="flex gap-2"><Phone className="mt-0.5 size-4 shrink-0 text-gold" /> +880 1700-000000</li>
            <li className="flex gap-2"><Mail className="mt-0.5 size-4 shrink-0 text-gold" /> support@pizzahub.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-sm text-white/60">
        © {new Date().getFullYear()} PizzaHub. All rights reserved.
      </div>
    </footer>
  );
}