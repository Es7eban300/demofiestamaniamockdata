import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FEATURED_COLLECTION } from "@/data/collections";

export function CollectionBanner() {
  const c = FEATURED_COLLECTION;
  return (
    <section className="section-py bg-white">
      <div className="container-site">
        <div className="relative rounded-3xl overflow-hidden min-h-[320px] flex items-center"
          style={{ boxShadow: "var(--shadow-card-hover)" }}>
          <Image
            src={c.image}
            alt={c.name}
            fill
            className="object-cover object-right"
            sizes="100vw"
          />
          {/* Gradient left */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/30 to-transparent" />

          {/* Content */}
          <div className="relative z-10 p-8 md:p-12 max-w-md">
            <p className="text-sm font-semibold uppercase tracking-widest mb-2"
              style={{ color: "var(--pink-accent)" }}>
              Colección Especial
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-3">
              {c.name}
            </h2>
            <p className="text-white/75 text-sm mb-6 leading-relaxed">
              {c.tagline}
            </p>
            <div className="flex flex-wrap gap-3">
              <Button
                asChild
                className="rounded-full h-11 px-6 font-semibold text-white"
                style={{ backgroundColor: "var(--pink-accent)" }}
              >
                <Link href={c.primaryCta.href}>
                  {c.primaryCta.label}
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full h-11 px-6 font-semibold bg-white/10 border-white/40 text-white hover:bg-white/20"
              >
                <Link href={c.secondaryCta.href}>
                  {c.secondaryCta.label}
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
