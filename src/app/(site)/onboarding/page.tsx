"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Store, User } from "lucide-react";
import { toast } from "sonner";
import { PageLoader } from "@/components/states";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api";
import { authClient, useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const { data, isPending, refetch } = useSession();
  const [role, setRole] = useState<"customer" | "vendor">("customer");
  const [businessName, setBusinessName] = useState("");
  const [busy, setBusy] = useState(false);
  const ran = useRef(false);

  async function submit(r: "customer" | "vendor", restaurantName = businessName) {
    const trimmedBusinessName = restaurantName.trim();
    if (r === "vendor" && trimmedBusinessName.length < 2) {
      setRole("vendor");
      toast.error("Please enter your restaurant name");
      return;
    }
    setBusy(true);
    try {
      await api("/api/users/me/select-role", {
        method: "POST",
        body: { role: r, ...(r === "vendor" ? { businessName: trimmedBusinessName } : {}) },
      });
      localStorage.removeItem("pizzahub:role");
      localStorage.removeItem("pizzahub:businessName");
      await authClient.getSession({ query: { disableCookieCache: true } });
      await refetch();
      toast.success("You're all set!");
      window.location.replace("/dashboard");
    } catch (e) {
      toast.error((e as Error).message);
      setBusy(false);
    }
  }

  useEffect(() => {
    if (isPending || ran.current) return;
    if (!data?.user) { router.replace("/signin"); return; }
    if (data.user.roleSelected !== false) { router.replace("/dashboard"); return; }
    const saved = localStorage.getItem("pizzahub:role");
    const savedBusinessName = localStorage.getItem("pizzahub:businessName") ?? "";
    if (saved === "vendor" || saved === "customer") {
      ran.current = true;
      if (saved === "customer" || savedBusinessName.trim().length >= 2) {
        queueMicrotask(() => { void submit(saved, savedBusinessName); });
      } else {
        queueMicrotask(() => {
          setBusinessName(savedBusinessName);
          setRole("vendor");
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending, data]);

  if (isPending || busy || !data?.user) return <PageLoader label="Setting up your account..." />;
  const card = (r: "customer" | "vendor", icon: React.ReactNode, title: string, text: string) => (
    <button type="button" disabled={busy} onClick={() => setRole(r)} className={cn("flex-1 rounded-2xl border-2 p-5 text-left transition disabled:opacity-60", role === r ? "border-gold bg-accent" : "hover:bg-muted")}>
      <div className="mb-2 text-brand">{icon}</div><p className="font-bold text-brand">{title}</p><p className="text-sm text-muted-foreground">{text}</p>
    </button>
  );
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-4 py-12">
      <h1 className="text-center text-3xl font-extrabold text-brand">How will you use PizzaHub?</h1>
      <p className="mt-2 text-center text-muted-foreground">Choose your account type. You can&apos;t change it later.</p>
      <div className="mt-8 flex flex-col gap-4 sm:flex-row">
        {card("customer", <User className="size-7" />, "Customer", "Browse menus and order pizza")}
        {card("vendor", <Store className="size-7" />, "Vendor (Restaurant)", "Publish menu items and manage orders")}
      </div>
      {role === "vendor" && (
        <div className="mt-5 space-y-1.5">
          <Label htmlFor="businessName">Restaurant Name</Label>
          <Input
            id="businessName"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            placeholder="Your restaurant name"
            className="h-11"
            maxLength={80}
          />
        </div>
      )}
      <Button onClick={() => submit(role)} disabled={busy} className="mt-8 h-11 font-semibold">Continue</Button>
    </div>
  );
}
