import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { MOCK_CATEGORIES } from "@/data/categories";

const DISPLAY_CATEGORIES = [
  { slug: "barware", image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&h=800&fit=crop", label: "Barware Elegante", offset: "-mt-6" },
  { slug: "packs-personajes", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=800&fit=crop", label: "Packs de Personajes", offset: "mt-6" },
  { slug: "decoracion", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&h=800&fit=crop", label: "Artículos de Fiesta", offset: "-mt-6" },
];

export function CategoryImages() {
  return (
    <section className="section-py bg-white overflow-hidden">
      <div className="container-site">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-start">
          {DISPLAY_CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={`group relative rounded-3xl overflow-hidden block aspect-[2/3] ${cat.offset}`}
            >
              <Image
                src={cat.image}
                alt={cat.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  {cat.label}
                </h3>
                <span className="inline-flex items-center gap-1.5 bg-white text-dark text-sm font-semibold px-4 py-2 rounded-full opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  Comprar ahora
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
