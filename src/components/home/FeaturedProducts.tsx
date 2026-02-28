"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProductFilterTabs } from "@/components/products/ProductFilterTabs";
import { ProductGrid } from "@/components/products/ProductGrid";
import { FEATURED_PRODUCTS, MOCK_PRODUCTS } from "@/data/products";
import type { FilterTab } from "@/types";

const TABS: FilterTab[] = ["Todos", "Vajilla", "Decoración", "Globos", "Sombreros"];

const SLUG_MAP: Record<FilterTab, string | null> = {
  Todos: null,
  Vajilla: "vajilla",
  Decoración: "decoracion",
  Globos: "globos",
  Sombreros: "sombreros",
};

export function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState<FilterTab>("Todos");

  const filtered =
    SLUG_MAP[activeTab] === null
      ? FEATURED_PRODUCTS.slice(0, 8)
      : MOCK_PRODUCTS.filter((p) => p.category.slug === SLUG_MAP[activeTab]).slice(0, 8);

  return (
    <section className="section-py bg-white">
      <div className="container-site">
        <SectionHeader
          title="Productos Destacados"
          ctaLabel="Ver todo"
          ctaHref="/products"
          className="mb-5"
        />

        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <ProductFilterTabs
            tabs={[...TABS]}
            activeTab={activeTab}
            onTabChange={(t) => setActiveTab(t as FilterTab)}
          />
        </div>

        <ProductGrid products={filtered} columns={4} />
      </div>
    </section>
  );
}
