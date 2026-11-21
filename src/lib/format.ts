export const formatPrice = (n: number) => `$${Number(n).toFixed(2)}`;
export const formatDate = (d?: string) => {
  if (!d) return "—";
  const date = new Date(d.length === 10 ? `${d}T00:00:00` : d);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};
export const todayLocal = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD