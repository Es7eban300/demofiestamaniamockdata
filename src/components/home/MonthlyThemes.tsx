import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MOCK_THEMES } from "@/data/themes";

export function MonthlyThemes() {
  return (
    <section className="section-py bg-cream">
      <div className="container-site">
        <SectionHeader
          title="Temas del Mes"
          subtitle="Celebra con nuevos temas, colores primaverales y setups divertidos."
          ctaLabel="Ver todos los temas"
          ctaHref="/themes"
          className="mb-8"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {MOCK_THEMES.map((theme) => (
            <Link
              key={theme.id}
              href={theme.ctaHref}
              className="group relative aspect-[3/4] rounded-3xl overflow-hidden block"
            >
              <Image
                src={theme.image}
                alt={theme.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-white/70 text-xs uppercase tracking-wider mb-1">
                  {theme.subtitle}
                </p>
                <h3 className="font-display text-xl font-bold text-white mb-3">
                  {theme.name}
                </h3>
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-white/30 transition-colors">
                  {theme.ctaText}
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
