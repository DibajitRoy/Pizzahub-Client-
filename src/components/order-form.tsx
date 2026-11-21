"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Modal } from "@/components/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { formatPrice, todayLocal } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

export function OrderForm({ item, open, onClose }: { item: MenuItem; open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [date, setDate] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return toast.error("Please select a delivery date");
    if (address.trim().length < 5) return toast.error("Please enter a valid delivery address");
    setBusy(true);
    try {
      await api("/api/orders", { method: "POST", body: { itemId: item._id, deliveryDate: date, deliveryAddress: address, message } });
      toast.success("Order placed! The restaurant will review it shortly.");
      onClose();
      router.push("/dashboard/customer/orders");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Place your order">
      <div className="mb-4 rounded-xl bg-muted p-3 text-sm">
        <p className="font-bold text-brand">{item.itemName}</p>
        <p className="text-muted-foreground">{item.vendor?.businessName || item.vendor?.name} · {formatPrice(item.price)}</p>
      </div>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="date">Delivery Date</Label>
          <Input id="date" type="date" min={todayLocal()} value={date} onChange={(e) => setDate(e.target.value)} className="h-10" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="address">Delivery Address</Label>
          <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House, road, area, city" className="h-10" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="message">Additional Message / Special Instructions</Label>
          <Textarea id="message" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={500} placeholder="Extra cheese, no onions..." rows={3} />
        </div>
        <Button type="submit" disabled={busy} className="h-11 w-full font-semibold">
          {busy ? <><LoaderCircle className="mr-2 size-4 animate-spin" /> Placing order...</> : `Place Order · ${formatPrice(item.price)}`}
        </Button>
        <p className="text-center text-xs text-muted-foreground">Payment is made on delivery.</p>
      </form>
    </Modal>
  );
}