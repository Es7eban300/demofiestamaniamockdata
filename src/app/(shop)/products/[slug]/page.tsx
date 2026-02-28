import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { DiscountBadge } from "@/components/shared/DiscountBadge";
import { NewBadge } from "@/components/shared/NewBadge";
import { ProductGrid } from "@/components/products/ProductGrid";
import { WishlistButton } from "@/components/shared/WishlistButton";
import { getProductBySlug, getProducts } from "@/lib/mock-db";
import { ProductActions } from "@/components/products/ProductActions";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const product = getProductBySlug(slug);
  if (!product) notFound();

  const { data: relatedRaw } = getProducts({ category: product.category.slug, limit: 5 });
  const related = relatedRaw.filter((p) => p.id !== product.id).slice(0, 4);

  const primaryImage = product.images.find((i) => i.isPrimary) ?? product.images[0];
  const otherImages = product.images.filter((i) => i.id !== primaryImage?.id);
  const variants: { id: string; color: string; colorName: string; stock: number }[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const occasions: any[] = [];
  const attributes = (product as unknown as { attributes?: { id: string; name: string; value: string }[] }).attributes ?? [];

  return (
    <div className="container-site section-py">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
        <Link href="/" className="hover:text-dark transition-colors">Inicio</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-dark transition-colors">Productos</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/categories/${product.category.slug}`} className="hover:text-dark transition-colors">
          {product.category.name}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-dark font-medium line-clamp-1">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-cream-dark" style={{ boxShadow: "var(--shadow-card)" }}>
            <Image
              src={primaryImage?.url ?? `https://placehold.co/600x600/FFD6E0/1A1A1A?text=${encodeURIComponent(product.name)}`}
              alt={primaryImage?.alt ?? product.name}
              fill priority
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && <NewBadge />}
              {product.compareAtPrice && !product.isNew && (
                <DiscountBadge originalPrice={product.compareAtPrice} salePrice={product.price} />
              )}
            </div>
            <WishlistButton productId={product.id} className="absolute top-4 right-4" />
          </div>
          {otherImages.length > 0 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {otherImages.slice(0, 5).map((img) => (
                <div key={img.id} className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-cream-dark">
                  <Image src={img.url} alt={img.alt ?? ""} fill className="object-cover" sizes="80px" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-2">
            {product.category.name}
          </p>
          <h1 className="font-display text-3xl font-bold text-dark mb-3 leading-tight">{product.name}</h1>

          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-4 h-4"
                  style={{ fill: i < Math.floor(product.rating) ? "#FBBF24" : "none", color: i < Math.floor(product.rating) ? "#FBBF24" : "#D1D5DB" }}
                />
              ))}
            </div>
            <span className="text-sm text-muted-foreground">{product.rating} ({product.reviewCount} reseñas)</span>
          </div>

          <PriceDisplay price={product.price} compareAtPrice={product.compareAtPrice ?? undefined} size="lg" className="mb-4" />

          {product.shortDescription && (
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">{product.shortDescription}</p>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">{product.description}</p>

          {/* Specific attributes — product differentiation */}
          {attributes.length > 0 && (
            <div className="mb-5 bg-cream-dark rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Características</p>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                {attributes.map((attr) => (
                  <div key={attr.id}>
                    <dt className="text-xs text-muted-foreground">{attr.name}</dt>
                    <dd className="text-sm font-medium text-dark">{attr.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="flex items-center gap-2 mb-5">
            <div className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-400"}`} />
            <span className="text-sm font-medium">
              {product.inStock ? `En stock (${product.stockCount} disponibles)` : "Agotado"}
            </span>
          </div>

          {occasions.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-5">
              {occasions.map((o) => (
                <Link key={o.id} href={`/occasions/${o.slug}`}>
                  <Badge variant="secondary" className="rounded-full text-xs bg-cream-dark hover:bg-cream cursor-pointer">
                    {o.icon && <span className="mr-1">{o.icon}</span>}{o.name}
                  </Badge>
                </Link>
              ))}
            </div>
          )}

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="rounded-full text-xs bg-cream-dark">{tag}</Badge>
              ))}
            </div>
          )}

          <Separator className="mb-6" />

          {/* Color selector + Add to cart — client component */}
          <ProductActions
            product={product}
            variants={variants}
          />
        </div>
      </div>

      {related.length > 0 && (
        <>
          <Separator className="mb-10" />
          <h2 className="section-title mb-6">También te podría gustar</h2>
          <ProductGrid products={related} columns={4} />
        </>
      )}
    </div>
  );
}
