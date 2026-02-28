"use client";

import { Toaster } from "@/components/ui/sonner";
import { CartDrawer } from "@/components/cart/CartDrawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer />
      <Toaster position="bottom-right" richColors />
    </>
  );
}
