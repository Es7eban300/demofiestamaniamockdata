import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  "Cada pieza es elegida por nuestro equipo y validada por IA",
  "Todos los sets combinan perfecto entre sí",
  "Calidad garantizada en cada artículo",
  "Entregas rápidas para que no te quedes sin nada",
];

export function CarefullyChosen() {
  return (
    <section className="section-py bg-cream">
      <div className="container-site">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative aspect-[4/3] rounded-3xl overflow-hidden"
            style={{ boxShadow: "var(--shadow-card-hover)" }}>
            <Image
              src="https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800&h=600&fit=crop"
              alt="Artículos de fiesta cuidadosamente elegidos"
              fill
              className="object-cover"
              sizes="50vw"
            />
          </div>

          {/* Text */}
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-3">
              Sets a juego
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-dark mb-2 leading-tight">
              Elegidos con Cuidado.
              <br />
              <span style={{ color: "var(--pink-accent)" }}>Listos para Usar.</span>
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
              Nos encargamos de la coordinación para que tú solo te preocupes
              de disfrutar. Cada colección está diseñada para que todo combine
              perfecto.
            </p>

            <ul className="space-y-3 mb-8">
              {FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: "var(--pink-accent)" }}
                  />
                  <span className="text-sm text-dark">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              asChild
              className="bg-dark hover:bg-dark/90 text-white rounded-full h-11 px-7 font-semibold"
            >
              <Link href="/products">
                Explorar Colección
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
