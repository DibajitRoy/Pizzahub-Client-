import { cn } from "@/lib/utils";

export function SelectField({ className, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn("h-10 w-full rounded-lg border border-input bg-white px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 disabled:opacity-60", className)}
      {...props}
    />
  );
}