"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { NAV_ITEMS } from "@/data/navigation";
import { useCartStore } from "@/store/useCartStore";
import type { NavItem } from "@/types";

interface NavbarMobileProps {
  isOpen: boolean;
  onClose: () => void;
  navItems?: NavItem[];
}

export function NavbarMobile({ isOpen, onClose, navItems = NAV_ITEMS }: NavbarMobileProps) {
  const { openCart } = useCartStore();

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="left" className="w-80 p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="text-xl font-bold tracking-tight">
            🎉 FiestaMania
          </SheetTitle>
        </SheetHeader>

        <nav className="px-4 py-4">
          <Accordion type="multiple" className="w-full space-y-1">
            {navItems.map((item) =>
              item.children ? (
                <AccordionItem key={item.href} value={item.href} className="border-none">
                  <AccordionTrigger className="py-3 px-2 rounded-lg hover:bg-cream-dark hover:no-underline font-medium text-dark">
                    {item.label}
                    {item.badge && (
                      <Badge className="ml-2 text-xs bg-pink-accent text-white border-none">
                        {item.badge}
                      </Badge>
                    )}
                  </AccordionTrigger>
                  <AccordionContent className="pt-1 pb-2">
                    <div className="pl-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onClose}
                          className="flex items-center justify-between py-2 px-2 rounded-lg hover:bg-cream-dark text-sm text-dark transition-colors"
                        >
                          <span>{child.label}</span>
                          {child.description && (
                            <span className="text-xs text-muted-foreground">
                              {child.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <div key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-cream-dark font-medium text-dark transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      {item.badge && (
                        <Badge className="text-xs bg-pink-accent text-white border-none">
                          {item.badge}
                        </Badge>
                      )}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                </div>
              )
            )}
          </Accordion>

          <Separator className="my-4" />

          <div className="space-y-1">
            <Link
              href="/cuenta"
              onClick={onClose}
              className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-cream-dark text-sm text-dark transition-colors"
            >
              Mi cuenta
            </Link>
            <button
              onClick={() => { onClose(); openCart(); }}
              className="w-full flex items-center justify-between py-3 px-2 rounded-lg hover:bg-cream-dark text-sm text-dark transition-colors"
            >
              Mi carrito
            </button>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
