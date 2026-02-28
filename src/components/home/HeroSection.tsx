import Link from "next/link";
import Image from "next/image";
import { ArrowRight, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfettiDecoration } from "@/components/shared/ConfettiDecoration";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream min-h-[560px] flex items-center">
      <div className="container-site w-full py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[520px]">
          {/* Text column */}
          <div className="relative z-10 py-8 lg:py-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-pink-light text-sm font-medium mb-6"
              style={{ color: "var(--pink-accent)" }}>
              <PartyPopper className="w-4 h-4" />
              Nueva colección disponible
            </div>

            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-dark">
              Tu Próxima Fiesta,{" "}
              <br />
              <span className="italic" style={{ color: "var(--pink-accent)" }}>
                Inolvidable.
              </span>
            </h1>

            <p className="mt-5 text-muted-foreground text-lg leading-relaxed max-w-md">
              Artículos de fiesta y piñatería cuidadosamente seleccionados para hacer
              cada celebración sin esfuerzo.
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Button
                asChild
                size="lg"
                className="bg-dark hover:bg-dark/90 text-white rounded-full px-7 h-12 text-base font-semibold"
              >
                <Link href="/products">
                  <PartyPopper className="w-4 h-4 mr-2" />
                  Explorar Tienda
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-7 h-12 text-base font-semibold border-dark text-dark hover:bg-cream-dark"
              >
                <Link href="/plan-my-event">
                  Planear Mi Evento
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 mt-10">
              {[
                { value: "500+", label: "Productos" },
                { value: "50k+", label: "Clientes felices" },
                { value: "4.9★", label: "Calificación" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-bold text-xl text-dark">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Image column */}
          <div className="relative hidden lg:flex items-center justify-center h-full min-h-[520px]">
            {/* Gradient background blob */}
            <div
              className="absolute inset-8 rounded-[3rem] opacity-60"
              style={{
                background: "radial-gradient(ellipse at center, #F5E6D3 0%, #FFD6E0 50%, #F8F5F0 100%)",
              }}
            />

            <div className="relative w-full h-full min-h-[480px]">
              <Image
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&h=900&fit=crop"
                alt="Artículos de fiesta FiestaMania"
                fill
                priority
                className="object-cover rounded-[3rem]"
                sizes="50vw"
              />
            </div>

            {/* Floating cards */}
            <div
              className="absolute top-8 -left-4 bg-white rounded-2xl px-4 py-3 shadow-card-hover animate-float"
            >
              <p className="text-xs text-muted-foreground">Envío rápido</p>
              <p className="font-bold text-dark text-sm">🚀 Mismo día</p>
            </div>
            <div
              className="absolute bottom-12 -right-4 bg-white rounded-2xl px-4 py-3 shadow-card-hover animate-float"
              style={{ animationDelay: "1s" }}
            >
              <p className="text-xs text-muted-foreground">Productos</p>
              <p className="font-bold text-dark text-sm">⭐ 500+ artículos</p>
            </div>

            <ConfettiDecoration />
          </div>
        </div>
      </div>
    </section>
  );
}
