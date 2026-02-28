"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/shared/AddToCartButton";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { ColorSelector, type ProductVariant } from "@/components/products/ColorSelector";
import type { Product } from "@/types";

interface Props {
  product: Product;
  variants: ProductVariant[];
}

export function ProductActions({ product, variants }: Props) {
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<{ hex: string; label: string } | null>(null);

  function handleColorSelect(variantId: string | null, color: { hex: string; label: string } | null) {
    setSelectedVariantId(variantId);
    setSelectedColor(color);
  }

  return (
    <div className="space-y-4">
      {variants.length > 0 && (
        <ColorSelector variants={variants} onSelect={handleColorSelect} />
      )}
      <div className="flex items-center gap-3">
        <AddToCartButton
          product={product}
          variant="full"
          className="flex-1 h-12"
          variantId={selectedVariantId ?? undefined}
          variantColor={selectedColor ?? undefined}
        />
        <WishlistButton productId={product.id} />
      </div>
    </div>
  );
}
