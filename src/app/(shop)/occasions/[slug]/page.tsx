import { notFound } from "next/navigation";
import Image from "next/image";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getOccasionBySlug } from "@/lib/mock-db";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function OccasionPage({ params }: Props) {
  const { slug } = await params;

  const result = getOccasionBySlug(slug);
  if (!result) notFound();

  const { products, ...occasion } = result;
  const normalized = products;

  return (
    <div>
      <section className="relative h-64 md:h-80 overflow-hidden">
        {occasion.image ? (
          <Image src={occasion.image} alt={occasion.name} fill priority className="object-cover" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="container-site">
            {/* {occasion.icon && <span className="text-4xl mb-2 block">{occasion.icon}</span>} */}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white">{occasion.name}</h1>
            {occasion.description && (
              <p className="text-white/80 mt-2 max-w-md">{occasion.description}</p>
            )}
          </div>
        </div>
      </section>

      <div className="container-site section-py">
        <p className="text-muted-foreground text-sm mb-6">{products.length} productos</p>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <ProductGrid products={normalized as any} columns={4} emptyMessage={`No hay productos para ${occasion.name} aún.`} />
      </div>
    </div>
  );
}
