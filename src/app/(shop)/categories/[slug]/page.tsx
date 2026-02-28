import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getCategoryBySlug } from "@/lib/mock-db";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  const result = getCategoryBySlug(slug);
  if (!result) notFound();

  const { products, ...category } = result;
  const normalized = products;

  return (
    <div>
      <section className="relative h-64 md:h-80 overflow-hidden">
        {category.heroImage || category.image ? (
          <Image
            src={(category.heroImage ?? category.image)!}
            alt={category.name}
            fill priority
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-site">
            <p className="text-white/70 text-sm mb-2">{products.length} productos</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white">{category.name}</h1>
            {category.description && (
              <p className="text-white/80 mt-2 max-w-md">{category.description}</p>
            )}
          </div>
        </div>
      </section>

      <div className="container-site section-py">
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ProductGrid products={normalized as any} columns={4} emptyMessage={`No hay productos en ${category.name} aún.`} />
      </div>
    </div>
  );
}
