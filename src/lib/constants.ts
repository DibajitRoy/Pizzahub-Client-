export const CATEGORIES = [
  { name: "Classic Pizzas", image: "/categories/classic-pizzas.jpg", blurb: "Timeless favorites" },
  { name: "Vegetarian Pizzas", image: "/categories/vegetarian-pizzas.jpg", blurb: "Fresh & garden-loaded" },
  { name: "Meat Lovers", image: "/categories/meat-lovers.jpg", blurb: "Loaded with toppings" },
  { name: "Specialty / Gourmet Pizzas", image: "/categories/gourmet-pizzas.jpg", blurb: "Chef-crafted creations" },
  { name: "Sides & Appetizers", image: "/categories/sides-appetizers.jpg", blurb: "Perfect starters" },
  { name: "Beverages & Desserts", image: "/categories/beverages-desserts.jpg", blurb: "Sweet & refreshing" },
] as const;

export const CATEGORY_NAMES = CATEGORIES.map((c) => c.name);
export const FALLBACK_IMG = "/pizza-placeholder.jpg";
export const FREE_LIMIT = 3;