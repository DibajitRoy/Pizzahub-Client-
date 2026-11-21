"use client";
import { useState } from "react";
import { ImagePlus, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient, useSession } from "@/lib/auth-client";
import { uploadImage } from "@/lib/upload";

type U = NonNullable<ReturnType<typeof useSession>["data"]>["user"];

function Inner({ user }: { user: U }) {
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image ?? "");
  const [businessName, setBusinessName] = useState(user.businessName ?? "");
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      setImage(await uploadImage(file));
      toast.success("Image uploaded. Save to apply.");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim().length < 2) return toast.error("Name must be at least 2 characters");
    setBusy(true);
    const payload: Record<string, string> = { name: name.trim() };
    if (image) payload.image = image;
    if (user.role === "vendor") payload.businessName = businessName.trim();
    const { error } = await authClient.updateUser(payload as never);
    setBusy(false);
    if (error) return toast.error(error.message || "Could not update profile");
    toast.success("Profile updated successfully");
  }

  return (
    <form onSubmit={save} className="max-w-2xl space-y-6 rounded-2xl border bg-white p-5 sm:p-8">
      <div className="flex items-center gap-4">
        <UserAvatar name={name} image={image} className="size-20 text-2xl" />
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium hover:bg-muted">
          {uploading ? <LoaderCircle className="size-4 animate-spin" /> : <ImagePlus className="size-4 text-gold" />} Change photo
          <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={uploading} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5"><Label htmlFor="pname">Full Name</Label><Input id="pname" value={name} onChange={(e) => setName(e.target.value)} className="h-10" /></div>
        <div className="space-y-1.5"><Label>Email</Label><Input value={user.email} disabled className="h-10" /></div>
        <div className="space-y-1.5"><Label>Role</Label><Input value={user.role ?? ""} disabled className="h-10 capitalize" /></div>
        {user.role === "vendor" && (
          <div className="space-y-1.5"><Label htmlFor="biz">Restaurant / Business Name</Label><Input id="biz" value={businessName} onChange={(e) => setBusinessName(e.target.value)} className="h-10" /></div>
        )}
      </div>
      <p className="text-xs text-muted-foreground">Your role and subscription status cannot be changed from here.</p>
      <Button type="submit" disabled={busy || uploading} className="h-11 px-8 font-semibold">{busy ? "Saving..." : "Save Changes"}</Button>
    </form>
  );
}

export function ProfileForm() {
  const { data } = useSession();
  if (!data?.user) return null;
  return <Inner key={data.user.id} user={data.user} />;
}