import { Suspense } from "react";
import { getProducts as mockGetProducts, getCategories, getOccasions } from "@/lib/mock-db";
import { ProductGrid } from "@/components/products/ProductGrid";
import { ProductFilters } from "@/components/products/ProductFilters";
import type { Product } from "@/types";

interface SearchParams {
  category?: string;
  occasion?: string;
  sortBy?: string;
  priceMin?: string;
  priceMax?: string;
  inStock?: string;
  badge?: string;
  search?: string;
  page?: string;
}

const LIMIT = 24;

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page ?? 1));

  const { data: normalizedProducts, meta } = mockGetProducts({
    category: sp.category,
    occasion: sp.occasion,
    priceMin: sp.priceMin ? Number(sp.priceMin) : undefined,
    priceMax: sp.priceMax ? Number(sp.priceMax) : undefined,
    inStock: sp.inStock === "true",
    sortBy: sp.sortBy,
    search: sp.search,
    page,
    limit: LIMIT,
  });

  const total = meta.total;
  const totalPages = meta.totalPages;
  const categories = getCategories().map((c) => ({ id: c.id, slug: c.slug, name: c.name }));
  const occasions = getOccasions().map((o) => ({ id: o.id, slug: o.slug, name: o.name, icon: o.icon }));

  return (
    <div className="container-site section-py">
      <div className="mb-8">
        <h1 className="section-title mb-1">Todos los Productos</h1>
        <p className="text-sm text-muted-foreground">{total} productos encontrados</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters (Client Component) */}
        <aside className="lg:w-56 shrink-0">
          <Suspense fallback={null}>
            <ProductFilters
              categories={categories}
              occasions={occasions}
              currentParams={sp as Record<string, string | undefined>}
            />
          </Suspense>
        </aside>

        {/* Product grid */}
        <div className="flex-1 min-w-0">
          <ProductGrid
            products={normalizedProducts as unknown as Product[]}
            columns={3}
            emptyMessage="No se encontraron productos con esos filtros."
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pNum = i + 1;
                const params = new URLSearchParams(sp as Record<string, string>);
                params.set("page", String(pNum));
                return (
                  <a
                    key={pNum}
                    href={`/products?${params.toString()}`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                      pNum === page ? "text-white" : "hover:bg-cream-dark text-dark"
                    }`}
                    style={pNum === page ? { backgroundColor: "var(--dark)" } : {}}
                  >
                    {pNum}
                  </a>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
