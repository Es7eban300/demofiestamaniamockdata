"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ProductVariant {
  id: string;
  color: string;
  colorName: string;
  stock: number;
}

interface Props {
  variants: ProductVariant[];
  onSelect: (variantId: string | null, color: { hex: string; label: string } | null) => void;
}

export function ColorSelector({ variants, onSelect }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  if (variants.length === 0) return null;

  function handleSelect(variant: ProductVariant) {
    if (variant.stock === 0) return;
    if (selected === variant.id) {
      setSelected(null);
      onSelect(null, null);
    } else {
      setSelected(variant.id);
      onSelect(variant.id, { hex: variant.color, label: variant.colorName });
    }
  }

  return (
    <div className="mb-5">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
        Color
        {selected && (
          <span className="ml-2 normal-case font-normal text-dark">
            — {variants.find((v) => v.id === selected)?.colorName}
          </span>
        )}
      </p>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selected === variant.id;
          const isOutOfStock = variant.stock === 0;

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => handleSelect(variant)}
              disabled={isOutOfStock}
              title={isOutOfStock ? `${variant.colorName} — Sin stock` : variant.colorName}
              className={cn(
                "relative w-9 h-9 rounded-full border-2 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                isSelected
                  ? "border-dark scale-110 shadow-md"
                  : "border-transparent hover:border-gray-300",
                isOutOfStock && "opacity-40 cursor-not-allowed"
              )}
              style={{ backgroundColor: variant.color }}
              aria-label={variant.colorName}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <Check
                    className="w-4 h-4 drop-shadow"
                    style={{ color: isLightColor(variant.color) ? "#1A1A1A" : "white" }}
                  />
                </span>
              )}
              {isOutOfStock && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-0.5 bg-gray-400 rotate-45" />
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Simple luminance check to decide check color
function isLightColor(hex: string): boolean {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
