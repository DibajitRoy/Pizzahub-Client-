"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImagePlus, LoaderCircle, X } from "lucide-react";
import { toast } from "sonner";
import { SafeImg } from "@/components/menu-card";
import { SelectField } from "@/components/select-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api, ApiError } from "@/lib/api";
import { CATEGORY_NAMES } from "@/lib/constants";
import type { MenuItem } from "@/lib/types";
import { uploadImage } from "@/lib/upload";

export function ItemForm({ initial }: { initial?: MenuItem }) {
  const router = useRouter();
  const [f, setF] = useState({
    itemName: initial?.itemName ?? "",
    category: initial?.category ?? CATEGORY_NAMES[0],
    description: initial?.description ?? "",
    price: initial?.price?.toString() ?? "",
    location: initial?.location ?? "",
  });
  const [images, setImages] = useState<string[]>(initial?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [upgrade, setUpgrade] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    e.target.value = "";
    if (!files.length) return;
    if (images.length + files.length > 4) return toast.error("You can upload up to 4 images");
    setUploading(true);
    try {
      const urls = await Promise.all(files.map(uploadImage));
      setImages((p) => [...p, ...urls]);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (f.itemName.trim().length < 2) return toast.error("Item name is required");
    if (!(Number(f.price) > 0)) return toast.error("Enter a valid price");
    if (f.location.trim().length < 2) return toast.error("Location is required");
    if (f.description.trim().length < 10) return toast.error("Description must be at least 10 characters");
    if (images.length < 1) return toast.error("Please upload at least one image");
    setBusy(true);
    setUpgrade(false);
    try {
      const body = { ...f, price: Number(f.price), images };
      if (initial) {
        const r = await api<{ message: string }>(`/api/vendor/menu/${initial._id}`, { method: "PATCH", body });
        toast.success(r.message);
      } else {
        await api("/api/vendor/menu", { method: "POST", body });
        toast.success("Menu item submitted for admin approval");
      }
      router.push("/dashboard/vendor/items");
    } catch (err) {
      if (err instanceof ApiError && err.code === "UPGRADE_REQUIRED") setUpgrade(true);
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-5 rounded-2xl border bg-white p-5 sm:p-8">
      {upgrade && (
        <div className="rounded-xl border border-gold bg-accent p-4 text-sm">
          Free plan limit reached (3 active items). <Link href="/dashboard/vendor/subscription" className="font-bold text-brand underline">Upgrade to Premium</Link> to add more.
        </div>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="itemName">Item Name</Label>
          <Input id="itemName" value={f.itemName} onChange={set("itemName")} placeholder="Margherita Supreme" className="h-10" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <SelectField id="category" value={f.category} onChange={set("category")}>
            {CATEGORY_NAMES.map((c) => <option key={c}>{c}</option>)}
          </SelectField>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Price (USD)</Label>
          <Input id="price" type="number" min="0" step="0.01" value={f.price} onChange={set("price")} placeholder="12.99" className="h-10" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Location (area / city)</Label>
          <Input id="location" value={f.location} onChange={set("location")} placeholder="Dhanmondi, Dhaka" className="h-10" />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" rows={4} value={f.description} onChange={(e) => setF((p) => ({ ...p, description: e.target.value }))} placeholder="Describe the toppings, size, taste..." maxLength={1000} />
      </div>
      <div className="space-y-2">
        <Label>Item Images (required, up to 4)</Label>
        <div className="flex flex-wrap gap-3">
          {images.map((u) => (
            <div key={u} className="relative size-24 overflow-hidden rounded-xl border">
              <SafeImg src={u} alt="Item" className="size-full object-cover" />
              <button type="button" onClick={() => setImages((p) => p.filter((x) => x !== u))} className="absolute right-1 top-1 rounded-full bg-white p-0.5 shadow" aria-label="Remove image"><X className="size-3.5" /></button>
            </div>
          ))}
          {images.length < 4 && (
            <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gold/60 bg-muted text-xs font-medium text-muted-foreground hover:bg-accent">
              {uploading ? <LoaderCircle className="size-5 animate-spin" /> : <ImagePlus className="size-5 text-gold" />}
              {uploading ? "Uploading" : "Upload"}
              <input type="file" accept="image/*" multiple className="hidden" onChange={onFiles} disabled={uploading} />
            </label>
          )}
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={busy || uploading} className="h-11 px-8 font-semibold">
          {busy ? "Saving..." : initial ? "Save Changes" : "Add Menu Item"}
        </Button>
        <Button type="button" variant="outline" className="h-11" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  );
}
