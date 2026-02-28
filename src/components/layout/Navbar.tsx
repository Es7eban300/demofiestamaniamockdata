"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { User, ShoppingBag, Menu } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { NavbarSearch } from "./NavbarSearch";
import { NavbarMobile } from "./NavbarMobile";
import { useCartStore } from "@/store/useCartStore";
import { useUser } from "@/hooks/useUser";
import { NAV_ITEMS } from "@/data/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface NavbarProps {
  navItems?: NavItem[];
}

export function Navbar({ navItems = NAV_ITEMS }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { totalItems, openCart } = useCartStore();
  const { user } = useUser();
  const cartCount = totalItems();

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300",
          isScrolled
            ? "bg-cream/90 backdrop-blur-md shadow-navbar"
            : "bg-cream"
        )}
      >
        <div className="container-site">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-1.5 font-bold text-xl tracking-tight text-dark shrink-0"
            >
              <span className="text-2xl">🎉</span>
              <span>
                FIESTA<span style={{ color: "var(--pink-accent)" }}>MANIA</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <NavigationMenu className="hidden lg:flex" viewport={false}>
              <NavigationMenuList>
                {navItems.map((item) =>
                  item.children ? (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuTrigger className="bg-transparent hover:bg-cream-dark text-dark h-9 text-sm font-medium">
                        {item.label}
                        {item.badge && (
                          <Badge className="ml-1.5 text-[10px] px-1.5 py-0 bg-pink-accent text-white border-none">
                            {item.badge}
                          </Badge>
                        )}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-1 p-4 w-56 bg-white shadow-card-hover rounded-xl border border-border">
                          {item.children.map((child) => (
                            <NavigationMenuLink asChild key={child.href}>
                              <Link
                                href={child.href}
                                className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-cream-dark transition-colors text-sm text-dark group"
                              >
                                <span className="font-medium">{child.label}</span>
                                {child.description && (
                                  <span className="text-xs text-muted-foreground">
                                    {child.description}
                                  </span>
                                )}
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={item.href}
                          className={cn(
                            navigationMenuTriggerStyle(),
                            "bg-transparent hover:bg-cream-dark text-dark h-9 text-sm font-medium"
                          )}
                        >
                          {item.label}
                          {item.badge && (
                            <Badge className="ml-1.5 text-[10px] px-1.5 py-0 bg-pink-accent text-white border-none">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right icons */}
            <div className="flex items-center gap-0.5">
              <NavbarSearch />

              {user ? (
                <Link
                  href="/cuenta"
                  className="w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold text-white hover:opacity-80 transition-opacity"
                  style={{ backgroundColor: "var(--dark)" }}
                  aria-label="Mi cuenta"
                >
                  {(user.name ?? user.email).charAt(0).toUpperCase()}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-cream-dark transition-colors text-dark"
                  aria-label="Iniciar sesión"
                >
                  <User className="w-4 h-4" />
                </Link>
              )}

              <button
                onClick={openCart}
                className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-cream-dark transition-colors text-dark"
                aria-label="Carrito de compras"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center text-white"
                    style={{ backgroundColor: "var(--pink-accent)" }}>
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>

              {/* Mobile hamburger */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden ml-1 hover:bg-cream-dark"
                onClick={() => setIsMobileOpen(true)}
                aria-label="Abrir menú"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <NavbarMobile isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} navItems={navItems} />
    </>
  );
}
