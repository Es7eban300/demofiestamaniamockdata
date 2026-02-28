import { SectionHeader } from "@/components/shared/SectionHeader";
import { ProductGrid } from "@/components/products/ProductGrid";
import { BEST_SELLERS } from "@/data/products";

export function BestSellers() {
  return (
    <section className="section-py bg-cream">
      <div className="container-site">
        <SectionHeader
          title="Más Vendidos"
          ctaLabel="Ver todo"
          ctaHref="/products?sort=bestseller"
          className="mb-8"
        />
        <ProductGrid products={BEST_SELLERS.slice(0, 4)} columns={4} />
      </div>
    </section>
  );
}
