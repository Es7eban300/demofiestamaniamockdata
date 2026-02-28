"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product } from "@/types";

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  totalItems: () => number;
  totalPrice: () => number;
  addItem: (
    product: Product,
    quantity?: number,
    variantId?: string,
    variantColor?: { hex: string; label: string }
  ) => void;
  removeItem: (productId: string, variantId?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

function itemKey(productId: string, variantId?: string) {
  return variantId ? `${productId}::${variantId}` : productId;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      totalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

      totalPrice: () =>
        get().items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),

      addItem: (product, quantity = 1, variantId, variantColor) => {
        set((state) => {
          const key = itemKey(product.id, variantId);
          const existing = state.items.find(
            (i) => itemKey(i.productId, i.variantId) === key
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                itemKey(i.productId, i.variantId) === key
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                product,
                quantity,
                ...(variantId ? { variantId } : {}),
                ...(variantColor ? { variantColor } : {}),
              },
            ],
          };
        });
      },

      removeItem: (productId, variantId) => {
        const key = itemKey(productId, variantId);
        set((state) => ({
          items: state.items.filter(
            (i) => itemKey(i.productId, i.variantId) !== key
          ),
        }));
      },

      updateQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeItem(productId, variantId);
          return;
        }
        const key = itemKey(productId, variantId);
        set((state) => ({
          items: state.items.map((i) =>
            itemKey(i.productId, i.variantId) === key ? { ...i, quantity } : i
          ),
        }));
      },

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
    }),
    {
      name: "fiestamania-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
