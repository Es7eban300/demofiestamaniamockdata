import { cn } from "@/lib/utils";

interface DiscountBadgeProps {
  originalPrice: number;
  salePrice: number;
  className?: string;
}

export function DiscountBadge({ originalPrice, salePrice, className }: DiscountBadgeProps) {
  const pct = Math.round((1 - salePrice / originalPrice) * 100);
  if (pct <= 0) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-bold text-white",
        className
      )}
      style={{ backgroundColor: "#ef4444" }}
    >
      -{pct}%
    </span>
  );
}
