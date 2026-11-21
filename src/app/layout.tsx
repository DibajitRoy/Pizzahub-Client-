import type { Metadata } from "next";
import { Toaster } from "sonner";
import { FavoritesProvider } from "@/components/favorites-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "PizzaHub — Hot & Fresh Pizza Delivered", template: "%s | PizzaHub" },
  description: "Discover local pizza shops, browse menus and order hot, fresh pizza delivered to your door.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background">
        <FavoritesProvider>{children}</FavoritesProvider>
        <div className="fixed bottom-4 right-4 z-50"><ThemeToggle compact /></div>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
