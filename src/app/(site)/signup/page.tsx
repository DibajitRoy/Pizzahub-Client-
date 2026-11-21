"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImagePlus, LoaderCircle, Store, User } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth-shell";
import { GoogleIcon } from "@/components/social-icons";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input";
import { clearTokenCache } from "@/lib/api";
import { authClient } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";
import { cn } from "@/lib/utils";

type RoleChoice = "customer" | "vendor";

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<RoleChoice>("customer");
  const [f, setF] = useState({ name: "", email: "", password: "", businessName: "" });
  const [image, setImage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try { setImage(await uploadImage(file)); } catch (err) { toast.error((err as Error).message); } finally { setUploading(false); }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (f.name.trim().length < 2) return toast.error("Please enter your full name");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return toast.error("Please enter a valid email");
    if (f.password.length < 6 || !/[A-Z]/.test(f.password) || !/[a-z]/.test(f.password))
      return toast.error("Password needs 6+ characters, one uppercase and one lowercase letter");
    if (role === "vendor" && f.businessName.trim().length < 2) return toast.error("Please enter your restaurant name");
    setBusy(true);
    const { error } = await authClient.signUp.email({
      name: f.name.trim(), email: f.email, password: f.password, role,
      ...(image ? { image } : {}), ...(role === "vendor" ? { businessName: f.businessName.trim() } : {}),
    });
    setBusy(false);
    if (error) return toast.error(error.message || "Could not create your account");
    clearTokenCache();
    toast.success("Account created successfully!");
    router.push("/dashboard");
  }

  async function google() {
    localStorage.setItem("pizzahub:role", role);
    if (role === "vendor") localStorage.setItem("pizzahub:businessName", f.businessName.trim());
    else localStorage.removeItem("pizzahub:businessName");
    clearTokenCache();
    await authClient.signIn.social({ provider: "google", callbackURL: "/onboarding" });
  }

  const roleBtn = (r: RoleChoice, icon: React.ReactNode, label: string) => (
    <button type="button" onClick={() => setRole(r)}
      className={cn("flex flex-1 flex-col items-center gap-1 rounded-xl border-2 p-3 text-sm font-semibold transition", role === r ? "border-gold bg-accent text-brand" : "border-border text-muted-foreground hover:bg-muted")}>
      {icon}{label}
    </button>
  );

  return (
    <AuthShell title="Create your account" subtitle="Join PizzaHub as a customer or restaurant">
      <div className="mb-4 flex gap-3">
        {roleBtn("customer", <User className="size-5" />, "Customer")}
        {roleBtn("vendor", <Store className="size-5" />, "Vendor (Restaurant)")}
      </div>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="flex items-center gap-3">
          <UserAvatar name={f.name} image={image} className="size-12" />
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-muted">
            {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <ImagePlus className="size-4 text-gold" />} Profile photo (optional)
            <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
          </label>
        </div>
        <div className="space-y-1.5"><Label htmlFor="name">Full Name</Label><Input id="name" value={f.name} onChange={set("name")} className="h-10" /></div>
        {role === "vendor" && <div className="space-y-1.5"><Label htmlFor="biz">Restaurant Name</Label><Input id="biz" value={f.businessName} onChange={set("businessName")} className="h-10" /></div>}
        <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={f.email} onChange={set("email")} className="h-10" /></div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <PasswordInput id="password" value={f.password} onChange={set("password")} className="h-10" autoComplete="new-password" />
          <p className="text-xs text-muted-foreground">Min 6 characters, with one uppercase and one lowercase letter.</p>
        </div>
        <Button type="submit" disabled={busy || uploading} className="h-11 w-full font-semibold">{busy ? <LoaderCircle className="size-4 animate-spin" /> : "Create Account"}</Button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" /></div>
      <Button type="button" variant="outline" onClick={google} className="h-11 w-full gap-2 font-semibold"><GoogleIcon /> Sign up with Google</Button>
      <p className="mt-6 text-center text-sm text-muted-foreground">Already have an account? <Link href="/signin" className="font-bold text-brand underline">Sign in</Link></p>
    </AuthShell>
  );
}
