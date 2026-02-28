"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { useCartStore } from "@/store/useCartStore";

function formatMXN(n: number) {
  return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", minimumFractionDigits: 0 }).format(n);
} 

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
  const subtotal = totalPrice();
  const isFreeShipping = subtotal >= 490;

  if (items.length === 0) {
    return (
      <div className="container-site section-py flex flex-col items-center text-center">
        <p className="text-7xl mb-4">🛒</p>
        <h1 className="font-display text-3xl font-bold text-dark mb-2">Tu carrito está vacío</h1>
        <p className="text-muted-foreground mb-8">¡Agrega artículos para empezar tu fiesta!</p>
        <Button asChild className="bg-dark hover:bg-dark/90 text-white rounded-full px-8 h-11">
          <Link href="/products">Explorar Productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container-site section-py">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/products" className="text-muted-foreground hover:text-dark transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="section-title">Mi Carrito</h1>
        <span className="text-muted-foreground text-sm">({items.length} artículos)</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 bg-white rounded-2xl"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <Link href={`/products/${item.product.slug}`} className="relative w-20 h-20 rounded-xl overflow-hidden bg-cream-dark shrink-0">
                <Image
                  src={item.product.images[0]?.url ?? `https://placehold.co/80x80/FFD6E0/1A1A1A?text=P`}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{item.product.category.name}</p>
                <Link href={`/products/${item.product.slug}`}>
                  <h3 className="font-semibold text-dark text-sm hover:text-pink-accent transition-colors line-clamp-2">
                    {item.product.name}
                  </h3>
                </Link>
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-1 border border-border rounded-lg">
                    <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-cream-dark rounded-l-lg transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-cream-dark rounded-r-lg transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <PriceDisplay price={item.product.price * item.quantity} size="sm" />
                    <button onClick={() => removeItem(item.productId)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button onClick={clearCart} className="text-sm text-muted-foreground hover:text-destructive transition-colors">
            Vaciar carrito
          </button>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-6 h-fit sticky top-24"
          style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-semibold text-lg text-dark mb-5">Resumen del Pedido</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatMXN(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span className={isFreeShipping ? "text-green-600 font-medium" : ""}>
                {isFreeShipping ? "Gratis 🎉" : "Se calculará al finalizar"}
              </span>
            </div>
            {!isFreeShipping && (
              <p className="text-xs text-muted-foreground">
                Agrega {formatMXN(490 - subtotal)} más para envío gratis
              </p>
            )}
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between font-bold text-base mb-5">
            <span>Total</span>
            <span>{formatMXN(subtotal)}</span>
          </div>
          <Button asChild className="w-full bg-dark hover:bg-dark/90 text-white rounded-full h-12 font-semibold">
            <Link href="/checkout">Finalizar Compra</Link>
          </Button>
          <Button asChild variant="outline" className="w-full mt-2 rounded-full h-10">
            <Link href="/products">Seguir comprando</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
