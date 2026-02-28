import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { getCategories, getOccasions } from "@/lib/mock-db";
import type { NavItem } from "@/types";
import { NAV_ITEMS } from "@/data/navigation";

function buildNavItems(): NavItem[] {
  const categories = getCategories();
  const occasions = getOccasions();

  return NAV_ITEMS.map((item) => {
    if (item.href === "/occasions") {
      return {
        ...item,
        children: occasions.map((o) => ({
          label: o.name,
          href: `/occasions/${o.slug}`,
          description: `${o.productCount} productos`,
        })),
      };
    }
    if (item.href === "/categories") {
      return {
        ...item,
        children: categories.map((c) => ({
          label: c.name,
          href: `/categories/${c.slug}`,
          description: `${c.productCount} productos`,
        })),
      };
    }
    return item;
  });
}

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navItems = buildNavItems();

  return (
    <Providers>
      <Navbar navItems={navItems} />
      <main>{children}</main>
      <Footer />
    </Providers>
  );
}
