"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  PartyPopper,
  Tag,
  Calendar,
} from "lucide-react";
import { LogoutButton } from "./LogoutButton";

const NAV_LINKS = [
  { href: "/admin",            label: "Dashboard",  icon: LayoutDashboard, exact: true },
  { href: "/admin/products",   label: "Productos",  icon: Package,         exact: false },
  { href: "/admin/orders",     label: "Órdenes",    icon: ShoppingBag,     exact: false },
  { href: "/admin/categories", label: "Categorías", icon: Tag,             exact: false },
  { href: "/admin/occasions",  label: "Ocasiones",  icon: Calendar,        exact: false },
  { href: "/admin/users",      label: "Usuarios",   icon: Users,           exact: false },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-64 flex-shrink-0 bg-[#1C1F26] flex flex-col h-screen sticky top-0">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <PartyPopper className="h-6 w-6 text-pink-400" />
          <span className="text-white font-bold text-lg">FiestaMania</span>
        </Link>
        <p className="text-gray-400 text-xs mt-1">Panel de administración</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_LINKS.map(({ href, label, icon: Icon, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-pink-500 text-white"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6 border-t border-white/10 pt-4">
        <LogoutButton />
      </div>
    </aside>
  );
}
