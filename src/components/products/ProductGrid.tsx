import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product } from "@/types";

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

const colMap: Record<number, string> = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
};

export function ProductGrid({
  products,
  columns = 4,
  loading = false,
  emptyMessage = "No se encontraron productos.",
  className,
}: ProductGridProps) {
  if (loading) {
    return (
      <div className={cn("grid gap-4", colMap[columns], className)}>
        {Array.from({ length: columns * 2 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-4xl mb-3">🎈</p>
        <p className="font-semibold text-dark">{emptyMessage}</p>
        <p className="text-sm text-muted-foreground mt-1">
          Prueba con otros filtros o categorías.
        </p>
      </div>
    );
  }

  return (
    <div className={cn("grid gap-4", colMap[columns], className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
