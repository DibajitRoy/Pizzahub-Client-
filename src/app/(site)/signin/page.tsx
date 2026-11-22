"use client";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/auth-shell";
import { GoogleIcon } from "@/components/social-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input";
import { clearTokenCache } from "@/lib/api";
import { authClient, useSession } from "@/lib/auth-client";

function SignInForm() {
  const sp = useSearchParams();
  const { data: session, isPending } = useSession();
  const r = sp.get("redirect");
  const dest = r && r.startsWith("/") && !r.startsWith("//") ? r : "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!isPending && session?.user) window.location.replace(dest);
  }, [dest, isPending, session]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) return toast.error("Please enter your email and password");
    setBusy(true);
    try {
      const { error } = await authClient.signIn.email({ email, password });
      if (error) {
        toast.error(error.message || "Invalid email or password");
        return;
      }
      clearTokenCache();
      toast.success("Welcome back!");
      // Reload so the dashboard and its role guard read the newly created session.
      window.location.replace(dest);
    } catch {
      toast.error("Unable to sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    clearTokenCache();
    await authClient.signIn.social({ provider: "google", callbackURL: "/onboarding" });
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to continue to PizzaHub">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2"><Label htmlFor="email" className="text-sm font-semibold text-[#32100c]">Email address</Label><Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="h-12 rounded-xl border-[#e8dfd4] bg-[#fcfbf9] px-4 text-sm focus-visible:bg-white" autoComplete="email" /></div>
        <div className="space-y-2"><Label htmlFor="password" className="text-sm font-semibold text-[#32100c]">Password</Label><PasswordInput id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="h-12 rounded-xl border-[#e8dfd4] bg-[#fcfbf9] px-4 text-sm focus-visible:bg-white" autoComplete="current-password" /></div>
        <Button type="submit" disabled={busy} className="h-12 w-full rounded-xl bg-[#f3a008] text-sm font-bold text-[#32100c] shadow-[0_5px_14px_-8px_rgba(190,112,0,0.8)] transition hover:bg-[#e99100]">{busy ? <LoaderCircle className="size-4 animate-spin" /> : "Sign in to your account"}</Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a5968d]"><span className="h-px flex-1 bg-[#eee6dc]" />or continue with<span className="h-px flex-1 bg-[#eee6dc]" /></div>
      <Button type="button" variant="outline" onClick={google} className="h-12 w-full gap-2 rounded-xl border-[#e8dfd4] bg-white text-sm font-semibold text-[#32100c] hover:bg-[#fcfbf9]"><GoogleIcon /> Continue with Google</Button>
      <p className="mt-7 text-center text-sm text-[#78665f]">New to PizzaHub? <Link href="/signup" className="font-bold text-[#a46100] underline-offset-4 hover:underline">Create an account</Link></p>
    </AuthShell>
  );
}

export default function SignInPage() {
  return <Suspense><SignInForm /></Suspense>;
}
