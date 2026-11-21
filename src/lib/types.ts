export type Role = "vendor" | "customer" | "admin";
export type ItemStatus = "pending" | "approved" | "rejected" | "inactive";
export type OrderStatus = "pending" | "accepted" | "rejected" | "cancelled";

export interface Vendor {
  _id: string;
  name: string;
  businessName?: string;
  email?: string;
  image?: string;
  isPremium?: boolean;
}
export interface MenuItem {
  _id: string;
  vendorId: string;
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
  status: ItemStatus;
  createdAt: string;
  vendor?: Vendor;
}
export interface Order {
  _id: string;
  itemId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: OrderStatus;
  createdAt: string;
  item: { itemName: string; image: string; price: number; category: string };
  vendor?: Vendor;
  customer?: { name: string; email: string; image?: string };
}
export interface Paged<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}