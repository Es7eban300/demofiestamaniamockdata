"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistStore {
  items: string[];
  toggle: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  clear: () => void;
}

export const useWishlist = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: (productId) => {
        set((state) => ({
          items: state.items.includes(productId)
            ? state.items.filter((id) => id !== productId)
            : [...state.items, productId],
        }));
      },

      isWishlisted: (productId) => get().items.includes(productId),

      clear: () => set({ items: [] }),
    }),
    {
      name: "fiestamania-wishlist",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
