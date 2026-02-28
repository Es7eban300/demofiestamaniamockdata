"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Cake,
  Baby,
  GraduationCap,
  Heart,
  Star,
  PartyPopper,
  Users,
  DollarSign,
  Palette,
  ShoppingBag,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice: number | null;
  shortDescription: string;
  badges: string[];
  images: { url: string; alt: string | null }[];
  category: { name: string };
}

interface Bundle {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  compareAtPrice: number | null;
  savings: number;
  image: string | null;
}

interface RecommendationResult {
  products: Product[];
  bundles: Bundle[];
  occasionName: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const OCCASIONS = [
  { slug: "cumpleanos", label: "Cumpleaños", icon: Cake, color: "#FFD6E0", emoji: "🎂" },
  { slug: "baby-shower", label: "Baby Shower", icon: Baby, color: "#D6F0FF", emoji: "👶" },
  { slug: "graduacion", label: "Graduación", icon: GraduationCap, color: "#D6FFE8", emoji: "🎓" },
  { slug: "aniversario", label: "Aniversario", icon: Heart, color: "#FFE8D6", emoji: "💑" },
  { slug: "noche-de-gala", label: "Noche de Gala", icon: Star, color: "#EDD6FF", emoji: "✨" },
  { slug: "otro", label: "Otro evento", icon: PartyPopper, color: "#F5F5F5", emoji: "🎉" },
];

const BUDGETS = [
  { label: "Hasta $500", min: 0, max: 500 },
  { label: "$500 – $1,000", min: 500, max: 1000 },
  { label: "$1,000 – $3,000", min: 1000, max: 3000 },
  { label: "Más de $3,000", min: 3000, max: 99999 },
];

const THEMES = [
  { value: "rosa", label: "Rosa & Dorado", color: "#FFD6E0" },
  { value: "azul", label: "Azul & Plata", color: "#D6F0FF" },
  { value: "verde", label: "Verde & Blanco", color: "#D6FFE8" },
  { value: "morado", label: "Morado & Oro", color: "#EDD6FF" },
  { value: "cualquiera", label: "Sin preferencia", color: "#F5F5F5" },
];

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = ["Ocasión", "Detalles", "Estilo", "Recomendaciones"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatMXN(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(n);
}

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2 justify-center mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
              style={{
                backgroundColor: i <= current ? "var(--pink-accent)" : "var(--cream-dark)",
                color: i <= current ? "white" : "var(--mid)",
              }}
            >
              {i < current ? <Check className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className="text-[10px] text-muted-foreground hidden sm:block">{label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className="w-8 h-0.5 rounded mb-4"
              style={{ backgroundColor: i < current ? "var(--pink-accent)" : "var(--cream-dark)" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PlanMyEventPage() {
  const [step, setStep] = useState(0);
  const [occasion, setOccasion] = useState("");
  const [guests, setGuests] = useState("");
  const [budget, setBudget] = useState<(typeof BUDGETS)[0] | null>(null);
  const [theme, setTheme] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RecommendationResult | null>(null);

  const selectedOccasion = OCCASIONS.find((o) => o.slug === occasion);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (occasion && occasion !== "otro") params.set("occasion", occasion);
      if (budget) {
        params.set("priceMax", String(budget.max));
        if (budget.min > 0) params.set("priceMin", String(budget.min));
      }

      const [productsRes, bundlesRes] = await Promise.all([
        fetch(`/api/products/batch-recommend?${params.toString()}`),
        fetch(`/api/bundles?${params.toString()}`),
      ]);

      const productsJson = productsRes.ok ? await productsRes.json() : { data: [] };
      const bundlesJson = bundlesRes.ok ? await bundlesRes.json() : { data: [] };

      setResult({
        products: productsJson.data ?? [],
        bundles: bundlesJson.data ?? [],
        occasionName: selectedOccasion?.label ?? "tu evento",
      });
    } catch {
      setResult({ products: [], bundles: [], occasionName: selectedOccasion?.label ?? "tu evento" });
    } finally {
      setLoading(false);
    }
  };

  const next = async () => {
    if (step === 2) {
      await fetchRecommendations();
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const canProceed = () => {
    if (step === 0) return !!occasion;
    if (step === 1) return !!guests && !!budget;
    if (step === 2) return !!theme;
    return true;
  };

  return (
    <div className="container-site section-py">
      {/* Hero */}
      <div className="text-center mb-10">
        <div
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
          style={{ backgroundColor: "var(--pink-accent)" }}
        >
          <PartyPopper className="w-8 h-8 text-white" />
        </div>
        <h1 className="font-display text-4xl font-bold text-dark mb-2">Planear Mi Evento</h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Responde algunas preguntas y te recomendaremos los productos perfectos para tu fiesta
        </p>
      </div>

      <div className="max-w-2xl mx-auto">
        <StepIndicator current={step} />

        {/* ── Step 0: Occasion ── */}
        {step === 0 && (
          <div>
            <h2 className="text-xl font-bold text-dark text-center mb-6">
              ¿Qué tipo de evento vas a celebrar?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {OCCASIONS.map((occ) => {
                const Icon = occ.icon;
                const selected = occasion === occ.slug;
                return (
                  <button
                    key={occ.slug}
                    onClick={() => setOccasion(occ.slug)}
                    className="relative flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all hover:scale-105"
                    style={{
                      borderColor: selected ? "var(--pink-accent)" : "transparent",
                      backgroundColor: selected ? `${occ.color}99` : "white",
                      boxShadow: selected ? "0 0 0 3px var(--pink-accent)33" : "var(--shadow-card)",
                    }}
                  >
                    {selected && (
                      <div
                        className="absolute top-2 right-2 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: "var(--pink-accent)" }}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <span className="text-3xl">{occ.emoji}</span>
                    <span className="text-sm font-medium text-dark">{occ.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 1: Details ── */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-dark text-center mb-2">
              Cuéntanos los detalles
            </h2>

            {/* Guests */}
            <div
              className="bg-white rounded-2xl p-6"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-muted-foreground" />
                <p className="font-semibold text-dark">¿Cuántos invitados esperas?</p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {["1–10", "10–25", "25–50", "50–100", "+100"].map((g) => (
                  <button
                    key={g}
                    onClick={() => setGuests(g)}
                    className="px-4 py-2 rounded-full text-sm font-medium border-2 transition-colors"
                    style={{
                      borderColor: guests === g ? "var(--pink-accent)" : "var(--border)",
                      backgroundColor: guests === g ? "var(--pink-accent)" : "white",
                      color: guests === g ? "white" : "var(--dark)",
                    }}
                  >
                    {g} personas
                  </button>
                ))}
              </div>
            </div>

            {/* Budget */}
            <div
              className="bg-white rounded-2xl p-6"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-muted-foreground" />
                <p className="font-semibold text-dark">¿Cuál es tu presupuesto?</p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {BUDGETS.map((b) => (
                  <button
                    key={b.label}
                    onClick={() => setBudget(b)}
                    className="px-4 py-3 rounded-xl text-sm font-medium border-2 transition-colors text-left"
                    style={{
                      borderColor: budget?.label === b.label ? "var(--pink-accent)" : "var(--border)",
                      backgroundColor: budget?.label === b.label ? "var(--pink-accent)" : "white",
                      color: budget?.label === b.label ? "white" : "var(--dark)",
                    }}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 2: Theme ── */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-bold text-dark text-center mb-2">
              ¿Qué estilo prefieres?
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">
              Elige la paleta de colores para tu {selectedOccasion?.label.toLowerCase() ?? "evento"}
            </p>
            <div
              className="bg-white rounded-2xl p-6"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Palette className="w-5 h-5 text-muted-foreground" />
                <p className="font-semibold text-dark">Paleta de colores</p>
              </div>
              <div className="space-y-2">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 transition-all text-left"
                    style={{
                      borderColor: theme === t.value ? "var(--pink-accent)" : "var(--border)",
                      backgroundColor: theme === t.value ? `${t.color}88` : "white",
                    }}
                  >
                    <div
                      className="w-8 h-8 rounded-full border border-border shrink-0"
                      style={{ backgroundColor: t.color }}
                    />
                    <span className="text-sm font-medium text-dark">{t.label}</span>
                    {theme === t.value && (
                      <Check className="w-4 h-4 ml-auto" style={{ color: "var(--pink-accent)" }} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 3: Results ── */}
        {step === 3 && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-16">
                <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4" style={{ color: "var(--pink-accent)" }} />
                <p className="text-dark font-medium">Preparando tus recomendaciones…</p>
                <p className="text-sm text-muted-foreground mt-1">Un momento, estamos eligiendo los mejores productos</p>
              </div>
            ) : (
              <>
                {/* Summary */}
                <div
                  className="rounded-2xl p-5 flex items-center gap-4"
                  style={{ backgroundColor: selectedOccasion?.color ?? "#F5F5F5" }}
                >
                  <span className="text-4xl">{selectedOccasion?.emoji ?? "🎉"}</span>
                  <div>
                    <p className="font-bold text-dark text-lg">{result?.occasionName ?? "Tu evento"}</p>
                    <p className="text-sm text-muted-foreground">
                      {guests} personas · {budget?.label} · Tema {THEMES.find((t) => t.value === theme)?.label.toLowerCase()}
                    </p>
                  </div>
                </div>

                {/* Bundles */}
                {result && result.bundles.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-dark mb-3 flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5" style={{ color: "var(--pink-accent)" }} />
                      Paquetes recomendados
                    </h2>
                    <div className="space-y-3">
                      {result.bundles.slice(0, 3).map((bundle) => (
                        <Link
                          key={bundle.id}
                          href={`/bundles/${bundle.slug}`}
                          className="flex items-center gap-4 bg-white rounded-2xl p-4 hover:shadow-md transition-shadow"
                          style={{ boxShadow: "var(--shadow-card)" }}
                        >
                          {bundle.image && (
                            <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 relative bg-cream-dark">
                              <Image src={bundle.image} alt={bundle.name} fill className="object-cover" sizes="64px" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-dark text-sm">{bundle.name}</p>
                            {bundle.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{bundle.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="font-bold" style={{ color: "var(--pink-accent)" }}>
                                {formatMXN(bundle.price)}
                              </span>
                              {bundle.compareAtPrice && (
                                <span className="text-xs text-muted-foreground line-through">
                                  {formatMXN(bundle.compareAtPrice)}
                                </span>
                              )}
                              {bundle.savings > 0 && (
                                <span
                                  className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                                  style={{ backgroundColor: "var(--pink-accent)" }}
                                >
                                  -{bundle.savings}%
                                </span>
                              )}
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Individual products */}
                {result && result.products.length > 0 && (
                  <div>
                    <h2 className="text-lg font-bold text-dark mb-3">Productos individuales</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {result.products.slice(0, 6).map((product) => {
                        const image = product.images[0];
                        const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
                        const discountPct = hasDiscount
                          ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
                          : 0;

                        return (
                          <Link
                            key={product.id}
                            href={`/products/${product.slug}`}
                            className="bg-white rounded-2xl overflow-hidden group card-hover"
                            style={{ boxShadow: "var(--shadow-card)" }}
                          >
                            <div className="relative aspect-square bg-cream-dark">
                              {image ? (
                                <Image
                                  src={image.url}
                                  alt={image.alt ?? product.name}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                  sizes="(max-width: 640px) 50vw, 33vw"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                                </div>
                              )}
                              {hasDiscount && (
                                <span
                                  className="absolute top-2 left-2 text-xs font-bold px-1.5 py-0.5 rounded-full text-white"
                                  style={{ backgroundColor: "var(--pink-accent)" }}
                                >
                                  -{discountPct}%
                                </span>
                              )}
                            </div>
                            <div className="p-3">
                              <p className="text-xs text-muted-foreground">{product.category.name}</p>
                              <p className="text-sm font-medium text-dark line-clamp-2 mt-0.5">{product.name}</p>
                              <div className="flex items-center gap-1.5 mt-1.5">
                                <span className="font-bold text-dark text-sm">{formatMXN(product.price)}</span>
                                {hasDiscount && (
                                  <span className="text-xs text-muted-foreground line-through">
                                    {formatMXN(product.compareAtPrice!)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Empty state */}
                {result && result.products.length === 0 && result.bundles.length === 0 && (
                  <div className="text-center py-10 bg-white rounded-2xl" style={{ boxShadow: "var(--shadow-card)" }}>
                    <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="font-medium text-dark mb-1">Sin resultados específicos</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Pero tenemos muchos productos que podrían gustarte
                    </p>
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                      style={{ backgroundColor: "var(--pink-accent)" }}
                    >
                      Ver todos los productos
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}

                {/* CTA */}
                {result && (result.products.length > 0 || result.bundles.length > 0) && (
                  <div className="text-center pt-2">
                    <Link
                      href="/products"
                      className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                      style={{ color: "var(--pink-accent)" }}
                    >
                      Ver todos los productos
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="outline"
            onClick={step === 0 ? undefined : back}
            disabled={step === 0}
            className={step === 0 ? "invisible" : ""}
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            Atrás
          </Button>

          {step < STEPS.length - 1 ? (
            <Button
              onClick={next}
              disabled={!canProceed() || loading}
              className="text-white"
              style={{ backgroundColor: "var(--pink-accent)" }}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {step === 2 ? "Ver recomendaciones" : "Siguiente"}
              {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setStep(0);
                setOccasion("");
                setGuests("");
                setBudget(null);
                setTheme("");
                setResult(null);
              }}
            >
              Empezar de nuevo
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
