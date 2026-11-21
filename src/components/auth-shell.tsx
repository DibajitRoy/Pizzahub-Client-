import { Logo } from "@/components/logo";

export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-brand lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/bannerpizzahub.png" alt="" className="absolute inset-0 size-full object-cover object-[80%_center]" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand/80 to-transparent" />
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <h2 className="text-3xl font-extrabold">Hot &amp; fresh, <span className="text-gold">every time.</span></h2>
          <p className="mt-2 text-white/80">Join PizzaHub to order your favorites or grow your restaurant.</p>
        </div>
      </div>
      <div className="flex items-center justify-center bg-cream/50 px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <Logo />
            <h1 className="mt-5 text-2xl font-extrabold text-brand">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}