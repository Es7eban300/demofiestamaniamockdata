"use client";

import { useEffect, useState } from "react";
import { useWishlist } from "@/hooks/useWishlist";
import { Heart, ShoppingBag } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WishlistButton } from "@/components/shared/WishlistButton";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  images: { url: string; alt: string | null }[];
  category: { slug: string; name: string };
}

function formatMXN(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(n);
}

export default function FavoritosPage() {
  const { items } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (items.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/products/batch?ids=${items.join(",")}`)
      .then((r) => (r.ok ? r.json() : { data: [] }))
      .then((json) => setProducts(json.data ?? []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [items]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-dark font-display">Mis Favoritos</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {items.length} producto{items.length !== 1 ? "s" : ""} guardado{items.length !== 1 ? "s" : ""}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: Math.max(items.length, 3) }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl h-64 animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-10 text-center"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-dark mb-1">Aún no tienes favoritos</p>
          <p className="text-sm text-muted-foreground mb-4">
            Guarda los productos que te gustan para encontrarlos fácilmente
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--dark)" }}
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {products.map((product) => {
            const image = product.images[0];
            const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
            const discount = hasDiscount
              ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
              : 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden group card-hover"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                {/* Image */}
                <div className="relative aspect-square bg-cream-dark overflow-hidden">
                  <Link href={`/products/${product.slug}`}>
                    {image ? (
                      <Image
                        src={image.url}
                        alt={image.alt ?? product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                  </Link>
                  {hasDiscount && (
                    <span
                      className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: "var(--pink-accent)" }}
                    >
                      -{discount}%
                    </span>
                  )}
                  {/* Wishlist remove button */}
                  <div className="absolute top-2 right-2">
                    <WishlistButton productId={product.id} />
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs text-muted-foreground mb-0.5">{product.category.name}</p>
                  <Link href={`/products/${product.slug}`}>
                    <p className="text-sm font-medium text-dark line-clamp-2 hover:underline">
                      {product.name}
                    </p>
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-bold text-dark">{formatMXN(product.price)}</span>
                    {hasDiscount && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatMXN(product.compareAtPrice!)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
