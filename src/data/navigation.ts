import type { NavItem } from "@/types";

export const NAV_ITEMS: NavItem[] = [
  {
    label: "Ver Todo",
    href: "/products",
  },
  {
    label: "Ocasiones",
    href: "/occasions",
    children: [
      { label: "Cumpleaños", href: "/occasions/cumpleanos", description: "145 productos" },
      { label: "Baby Shower", href: "/occasions/baby-shower", description: "89 productos" },
      { label: "Graduación", href: "/occasions/graduacion", description: "67 productos" },
      { label: "Aniversario", href: "/occasions/aniversario", description: "54 productos" },
      { label: "Noche de Gala", href: "/occasions/noche-de-gala", description: "38 productos" },
    ],
  },
  {
    label: "Temas",
    href: "/themes",
    children: [
      { label: "Radiante Rosado", href: "/themes/radiante-rosado" },
      { label: "Temas Unicornio", href: "/themes/temas-unicornio" },
      { label: "Elegancia Dorada", href: "/themes/elegancia-dorada" },
    ],
  },
  {
    label: "Artículos de Fiesta",
    href: "/categories",
    children: [
      { label: "Globos", href: "/categories/globos", description: "48 productos" },
      { label: "Vajilla", href: "/categories/vajilla", description: "62 productos" },
      { label: "Decoración", href: "/categories/decoracion", description: "97 productos" },
      { label: "Sombreros", href: "/categories/sombreros", description: "29 productos" },
    ],
  },
  {
    label: "Planear Mi Evento",
    href: "/plan-my-event",
    badge: "Nuevo",
  },
];
