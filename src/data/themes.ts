import type { Theme } from "@/types";

export const MOCK_THEMES: Theme[] = [
  {
    id: "theme-001",
    slug: "radiante-rosado",
    name: "Radiante Rosado",
    subtitle: "Baby shower y primer año",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=1000&fit=crop",
    ctaText: "Ver setup de bebé",
    ctaHref: "/themes/radiante-rosado",
  },
  {
    id: "theme-002",
    slug: "temas-unicornio",
    name: "Temas Unicornio",
    subtitle: "Magia y color para niñas",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=1000&fit=crop",
    ctaText: "Ver kits unicornio",
    ctaHref: "/themes/temas-unicornio",
  },
  {
    id: "theme-003",
    slug: "elegancia-dorada",
    name: "Elegancia Dorada",
    subtitle: "Aniversarios y celebraciones",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=1000&fit=crop",
    ctaText: "Ver colección dorada",
    ctaHref: "/themes/elegancia-dorada",
  },
];
