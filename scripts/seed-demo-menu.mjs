import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("Set MONGODB_URI in the client .env before running this script.");
  process.exit(1);
}

const apply = process.argv.includes("--apply");
const client = new MongoClient(uri);
const samples = [
  {
    demoSeedKey: "pizzahub-demo-margherita-v1",
    itemName: "Margherita Classic",
    category: "Classic Pizzas",
    description: "Stone-baked crust topped with tomato, fresh mozzarella, basil, and a drizzle of olive oil.",
    price: 9.99,
    location: "Dhanmondi, Dhaka",
    images: ["/categories/classic-pizzas.jpg"],
  },
  {
    demoSeedKey: "pizzahub-demo-garden-veggie-v1",
    itemName: "Garden Fresh Veggie",
    category: "Vegetarian Pizzas",
    description: "A colorful mix of bell peppers, olives, mushrooms, red onion, and mozzarella on herb sauce.",
    price: 11.49,
    location: "Dhanmondi, Dhaka",
    images: ["/categories/vegetarian-pizzas.jpg"],
  },
  {
    demoSeedKey: "pizzahub-demo-bbq-chicken-v1",
    itemName: "Smoky BBQ Chicken",
    category: "Meat Lovers",
    description: "Smoky barbecue chicken, caramelized onions, mozzarella, and a tangy house-made sauce.",
    price: 13.49,
    location: "Dhanmondi, Dhaka",
    images: ["/categories/gourmet-pizzas.jpg"],
  },
];

try {
  await client.connect();
  const db = client.db(process.env.MONGODB_DB || "pizzahub");
  const users = db.collection("users");
  const menu = db.collection("menuItems");
  const vendor = await users.find({ role: "vendor", isBlocked: { $ne: true } }).sort({ createdAt: -1 }).limit(1).next();
  if (!vendor) throw new Error("Create a vendor account before adding sample menu cards.");

  const premium = vendor.subscriptionPlan === "premium" && vendor.subscriptionExpiresAt && new Date(vendor.subscriptionExpiresAt) > new Date();
  const activeLimit = premium ? samples.length : 3;
  const activeCount = await menu.countDocuments({ vendorId: vendor._id, status: { $in: ["pending", "approved"] } });
  const existing = new Set((await menu.find({ demoSeedKey: { $in: samples.map((item) => item.demoSeedKey) } }).project({ demoSeedKey: 1 }).toArray()).map((item) => item.demoSeedKey));
  const availableSlots = Math.max(0, activeLimit - activeCount);
  const toAdd = samples.filter((item) => !existing.has(item.demoSeedKey)).slice(0, availableSlots);

  if (!apply) {
    console.log(`Vendor account found. ${toAdd.length} sample card(s) can be added without exceeding the ${premium ? "Premium" : "Free"} plan active-item limit.`);
    console.log("Review the target account, then rerun with --apply to insert the sample cards.");
  } else if (!toAdd.length) {
    console.log("No sample cards were added: the cards already exist or the vendor's active-item limit is full.");
  } else {
    const now = new Date();
    await menu.insertMany(toAdd.map((item, index) => ({
      ...item,
      vendorId: vendor._id,
      status: "approved",
      createdAt: new Date(now.getTime() - index * 1000),
      updatedAt: now,
    })));
    console.log(`Added ${toAdd.length} approved sample menu card(s) for the vendor account.`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : "Could not seed sample menu cards.");
  process.exitCode = 1;
} finally {
  await client.close();
}
