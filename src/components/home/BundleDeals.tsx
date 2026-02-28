import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { MOCK_BUNDLES } from "@/data/bundles";

export function BundleDeals() {
  const featured = MOCK_BUNDLES[0];

  return (
    <section className="section-py bg-cream">
      <div className="container-site">
        <SectionHeader
          title="Bundle Deals"
          subtitle="Conjuntos completos con todo lo que necesitas."
          className="mb-8"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden"
          style={{ boxShadow: "var(--shadow-card-hover)" }}>
          {/* Left: bundle list */}
          <div className="bg-cream-dark p-8 lg:p-10 flex flex-col">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
              Sets combinados
            </p>
            <h3 className="font-display text-2xl font-bold text-dark mb-6">
              Conjuntos Perfectos
            </h3>

            <ul className="flex-1 space-y-2">
              {MOCK_BUNDLES.map((bundle) => (
                <li key={bundle.id}>
                  <Link
                    href={`/bundles/${bundle.slug}`}
                    className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-pink-light/40 transition-colors group"
                  >
                    <span className="font-medium text-dark text-sm group-hover:text-pink-accent transition-colors">
                      {bundle.name}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground group-hover:text-pink-accent transition-colors shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/bundles"
              className="mt-6 text-sm font-semibold text-dark underline underline-offset-2 hover:text-pink-accent transition-colors"
            >
              Ver todos los bundles →
            </Link>
          </div>

          {/* Right: featured bundle hero */}
          <div className="relative min-h-[320px] lg:min-h-0">
            <Image
              src={featured.image}
              alt={featured.name}
              fill
              className="object-cover"
              sizes="50vw"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                ✦ Adorable colección
              </p>
              <p className="font-display text-2xl font-bold text-white mb-4">
                {featured.collection}
              </p>
              <Link
                href={`/bundles/${featured.slug}`}
                className="inline-flex items-center gap-2 bg-white text-dark font-semibold text-sm px-5 py-2.5 rounded-full hover:bg-cream transition-colors"
              >
                Ver Bundles
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
