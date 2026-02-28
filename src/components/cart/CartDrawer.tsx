"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, X, Minus, Plus, Trash2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useCartStore } from "@/store/useCartStore";

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(price);
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalItems, totalPrice } =
    useCartStore();

  const count = totalItems();
  const subtotal = totalPrice();
  const shippingThreshold = 490;
  const isFreeShipping = subtotal >= shippingThreshold;
  const progress = Math.min((subtotal / shippingThreshold) * 100, 100);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && closeCart()}>
      <SheetContent side="right" className="w-full sm:max-w-md flex flex-col p-0">
        {/* Header */}
        <SheetHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2 text-lg font-semibold">
              <ShoppingBag className="w-5 h-5" />
              Mi Carrito
              {count > 0 && (
                <span className="ml-1 text-sm font-medium text-muted-foreground">
                  ({count} {count === 1 ? "artículo" : "artículos"})
                </span>
              )}
            </SheetTitle>
          </div>
        </SheetHeader>

        {/* Empty state */}
        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6">
            <div className="w-20 h-20 rounded-full bg-cream-dark flex items-center justify-center">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="font-semibold text-dark">Tu carrito está vacío</p>
              <p className="text-sm text-muted-foreground mt-1">
                ¡Agrega productos para empezar tu fiesta!
              </p>
            </div>
            <Button asChild onClick={closeCart} className="bg-dark hover:bg-dark/90 mt-2">
              <Link href="/products">Explorar Productos</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="px-6 py-3 bg-cream-dark text-sm">
              {isFreeShipping ? (
                <p className="text-green-600 font-medium text-center">
                  🎉 ¡Tienes envío gratis!
                </p>
              ) : (
                <div>
                  <p className="text-muted-foreground text-center mb-2">
                    Agrega{" "}
                    <span className="font-semibold text-dark">
                      {formatPrice(shippingThreshold - subtotal)}
                    </span>{" "}
                    más para envío gratis
                  </p>
                  <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${progress}%`,
                        backgroundColor: "var(--pink-accent)",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Cart items */}
            <ScrollArea className="flex-1 px-6">
              <div className="py-4 space-y-4">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream-dark flex-shrink-0">
                      <Image
                        src={item.product.images[0]?.url || "https://placehold.co/64x64/FFD6E0/1A1A1A?text=Prod"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.product.slug}`}
                        onClick={closeCart}
                        className="text-sm font-medium text-dark line-clamp-2 hover:text-pink-accent transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-sm font-semibold text-dark mt-1">
                        {formatPrice(item.product.price)}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 border border-border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-cream-dark rounded-l-lg transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            className="w-7 h-7 flex items-center justify-center hover:bg-cream-dark rounded-r-lg transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm font-semibold text-dark flex-shrink-0">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-border space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className={isFreeShipping ? "text-green-600 font-medium" : ""}>
                  {isFreeShipping ? "Gratis" : "Se calculará al finalizar"}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <Button
                asChild
                className="w-full bg-dark hover:bg-dark/90 text-white h-11"
                onClick={closeCart}
              >
                <Link href="/checkout">Finalizar Compra</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full h-10"
                onClick={closeCart}
              >
                <Link href="/cart">Ver carrito completo</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
