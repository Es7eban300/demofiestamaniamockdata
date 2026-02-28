import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { AddToCartButton } from "@/components/shared/AddToCartButton";
import { DiscountBadge } from "@/components/shared/DiscountBadge";
import { NewBadge } from "@/components/shared/NewBadge";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export function ProductCard({ product, className }: ProductCardProps) {
  const primaryImage =
    product.images.find((i) => i.isPrimary) ?? product.images[0];

  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden card-hover",
        className
      )}
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      {/* Image area */}
      <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-cream-dark">
        <Image
          src={primaryImage?.url ?? `https://placehold.co/400x400/FFD6E0/1A1A1A?text=${encodeURIComponent(product.name)}`}
          alt={primaryImage?.alt ?? product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges — top left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.isNew && <NewBadge />}
          {product.compareAtPrice && !product.isNew && (
            <DiscountBadge
              originalPrice={product.compareAtPrice}
              salePrice={product.price}
            />
          )}
        </div>

        {/* Wishlist — top right */}
        <WishlistButton
          productId={product.id}
          className="absolute top-2.5 right-2.5"
        />
      </Link>

      {/* Body */}
      <div className="p-3">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium mb-0.5">
          {product.category.name}
        </p>
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm font-semibold text-dark line-clamp-2 leading-snug hover:text-pink-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-2">
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="sm"
          />
          <AddToCartButton product={product} />
        </div>
      </div>
    </div>
  );
}
