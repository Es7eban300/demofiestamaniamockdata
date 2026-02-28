import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function formatMXN(amount: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(amount);
}

const sizeMap = {
  sm: { sale: "text-sm font-semibold", original: "text-xs" },
  md: { sale: "text-base font-semibold", original: "text-sm" },
  lg: { sale: "text-2xl font-bold", original: "text-base" },
};

export function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
  className,
}: PriceDisplayProps) {
  const { sale, original } = sizeMap[size];

  return (
    <div className={cn("flex items-baseline gap-1.5 flex-wrap", className)}>
      <span
        className={cn(sale)}
        style={compareAtPrice ? { color: "var(--pink-accent)" } : { color: "var(--dark)" }}
      >
        {formatMXN(price)}
      </span>
      {compareAtPrice && (
        <span className={cn(original, "text-muted-foreground line-through")}>
          {formatMXN(compareAtPrice)}
        </span>
      )}
    </div>
  );
}
