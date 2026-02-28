"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Category { id: string; slug: string; name: string }
interface Occasion { id: string; slug: string; name: string; icon: string | null }

interface Props {
  categories: Category[];
  occasions: Occasion[];
  currentParams: Record<string, string | undefined>;
}

const SORT_OPTIONS = [
  { value: "featured", label: "Destacados" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "bestseller", label: "Más vendidos" },
  { value: "rating", label: "Mejor valorados" },
];

const PRICE_RANGES = [
  { label: "Menos de $100", min: undefined, max: "100" },
  { label: "$100 – $200", min: "100", max: "200" },
  { label: "$200 – $500", min: "200", max: "500" },
  { label: "Más de $500", min: "500", max: undefined },
];

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
        active ? "font-semibold text-white" : "text-dark hover:bg-cream-dark"
      }`}
      style={active ? { backgroundColor: "var(--dark)" } : {}}
    >
      {children}
    </button>
  );
}

export function ProductFilters({ categories, occasions, currentParams }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAll = () => router.push("/products");

  const hasActiveFilters =
    currentParams.category ||
    currentParams.occasion ||
    currentParams.priceMin ||
    currentParams.priceMax ||
    currentParams.inStock ||
    currentParams.sortBy ||
    currentParams.badge;

  return (
    <div
      className="bg-white rounded-2xl p-5 space-y-5 sticky top-24"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-dark text-sm">
          <SlidersHorizontal className="w-4 h-4" /> Filtros
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
          >
            <X className="w-3 h-3" /> Limpiar
          </button>
        )}
      </div>

      <Separator />

      {/* Sort */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Ordenar
        </p>
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <FilterButton
              key={opt.value}
              active={currentParams.sortBy === opt.value}
              onClick={() =>
                updateParam(
                  "sortBy",
                  currentParams.sortBy === opt.value ? undefined : opt.value
                )
              }
            >
              {opt.label}
            </FilterButton>
          ))}
        </div>
      </div>

      <Separator />

      {/* Categories */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Categoría
        </p>
        <div className="space-y-1">
          <FilterButton
            active={!currentParams.category}
            onClick={() => updateParam("category", undefined)}
          >
            Todas
          </FilterButton>
          {categories.map((c) => (
            <FilterButton
              key={c.slug}
              active={currentParams.category === c.slug}
              onClick={() =>
                updateParam("category", currentParams.category === c.slug ? undefined : c.slug)
              }
            >
              {c.name}
            </FilterButton>
          ))}
        </div>
      </div>

      <Separator />

      {/* Occasions */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Ocasión
        </p>
        <div className="space-y-1">
          {occasions.map((o) => (
            <FilterButton
              key={o.slug}
              active={currentParams.occasion === o.slug}
              onClick={() =>
                updateParam(
                  "occasion",
                  currentParams.occasion === o.slug ? undefined : o.slug
                )
              }
            >
              {o.icon && <span className="text-base">{o.icon}</span>}
              {o.name}
            </FilterButton>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Precio
        </p>
        <div className="space-y-1">
          {PRICE_RANGES.map((r) => {
            const active =
              currentParams.priceMin === (r.min ?? "") &&
              currentParams.priceMax === (r.max ?? "");
            return (
              <FilterButton
                key={r.label}
                active={active}
                onClick={() => {
                  const params = new URLSearchParams(searchParams.toString());
                  if (active) {
                    params.delete("priceMin");
                    params.delete("priceMax");
                  } else {
                    if (r.min) params.set("priceMin", r.min);
                    else params.delete("priceMin");
                    if (r.max) params.set("priceMax", r.max);
                    else params.delete("priceMax");
                  }
                  params.delete("page");
                  router.push(`/products?${params.toString()}`);
                }}
              >
                {r.label}
              </FilterButton>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Badge filters */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
          Tipo
        </p>
        <div className="space-y-1">
          {[
            { value: "sale", label: "🏷️ En descuento" },
            { value: "new", label: "✨ Nuevos" },
            { value: "bestseller", label: "🔥 Más vendidos" },
          ].map((opt) => (
            <FilterButton
              key={opt.value}
              active={currentParams.badge === opt.value}
              onClick={() =>
                updateParam("badge", currentParams.badge === opt.value ? undefined : opt.value)
              }
            >
              {opt.label}
            </FilterButton>
          ))}
        </div>
      </div>

      <Separator />

      {/* In stock */}
      <label className="flex items-center gap-2.5 cursor-pointer text-sm text-dark select-none">
        <input
          type="checkbox"
          checked={currentParams.inStock === "true"}
          onChange={(e) => updateParam("inStock", e.target.checked ? "true" : undefined)}
          className="rounded accent-pink-500 w-4 h-4"
        />
        Solo en stock
      </label>
    </div>
  );
}
