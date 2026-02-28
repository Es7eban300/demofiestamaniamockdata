"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/useCartStore";
import type { Product } from "@/types";

interface AddToCartButtonProps {
  product: Product;
  variant?: "icon" | "full";
  className?: string;
  variantId?: string;
  variantColor?: { hex: string; label: string };
}

export function AddToCartButton({
  product,
  variant = "icon",
  className,
  variantId,
  variantColor,
}: AddToCartButtonProps) {
  const [added, setAdded] = useState(false);
  const { addItem, openCart } = useCartStore();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1, variantId, variantColor);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      if (variant === "icon") openCart();
    }, 800);
  };

  if (variant === "full") {
    return (
      <button
        onClick={handleClick}
        className={cn(
          "flex items-center justify-center gap-2 bg-dark text-white font-semibold rounded-full transition-all duration-200 cursor-pointer hover:bg-dark/90",
          added && "scale-95",
          className
        )}
        aria-label="Agregar al carrito"
        style={added ? { backgroundColor: "var(--teal-accent)" } : undefined}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            ¡Agregado!
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            Agregar al Carrito
          </>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "btn-add-cart",
        added && "scale-95",
        className
      )}
      aria-label="Agregar al carrito"
      style={added ? { backgroundColor: "var(--teal-accent)" } : undefined}
    >
      {added ? (
        <Check className="w-4 h-4" />
      ) : (
        <ShoppingBag className="w-4 h-4" />
      )}
    </button>
  );
}
