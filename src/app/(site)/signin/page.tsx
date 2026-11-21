"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth-shell";
import { GoogleIcon } from "@/components/social-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input";
import { clearTokenCache } from "@/lib/api";
import { authClient } from "@/lib/auth-client";

function SignInForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const r = sp.get("redirect");
  const dest = r && r.startsWith("/") && !r.startsWith("//") ? r : "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return toast.error("Please enter your email and password");
    setBusy(true);
    const { error } = await authClient.signIn.email({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message || "Invalid email or password");
    clearTokenCache();
    toast.success("Welcome back!");
    router.push(dest);
  }

  async function google() {
    clearTokenCache();
    await authClient.signIn.social({ provider: "google", callbackURL: "/onboarding" });
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue to PizzaHub">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-10" /></div>
        <div className="space-y-1.5"><Label htmlFor="password">Password</Label><PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="h-10" autoComplete="current-password" /></div>
        <Button type="submit" disabled={busy} className="h-11 w-full font-semibold">{busy ? <LoaderCircle className="size-4 animate-spin" /> : "Sign In"}</Button>
      </form>
      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" /></div>
      <Button type="button" variant="outline" onClick={google} className="h-11 w-full gap-2 font-semibold"><GoogleIcon /> Continue with Google</Button>
      <p className="mt-6 text-center text-sm text-muted-foreground">New to PizzaHub? <Link href="/signup" className="font-bold text-brand underline">Create an account</Link></p>
    </AuthShell>
  );
}

export default function SignInPage() {
  return <Suspense><SignInForm /></Suspense>;
}
