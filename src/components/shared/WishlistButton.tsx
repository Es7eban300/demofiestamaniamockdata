"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWishlist } from "@/hooks/useWishlist";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const { toggle, isWishlisted } = useWishlist();
  const wishlisted = isWishlisted(productId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(productId);
      }}
      className={cn(
        "w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm transition-all duration-200 hover:scale-110",
        className
      )}
      aria-label={wishlisted ? "Quitar de favoritos" : "Agregar a favoritos"}
    >
      <Heart
        className={cn(
          "w-4 h-4 transition-colors duration-200",
          wishlisted ? "fill-red-500 text-red-500" : "text-muted-foreground"
        )}
      />
    </button>
  );
}
