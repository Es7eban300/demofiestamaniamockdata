import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SmartPartyAssistant() {
  return (
    <section className="section-py bg-cream">
      <div className="container-site">
        <div
          className="relative rounded-3xl overflow-hidden"
          style={{ background: "linear-gradient(135deg, #00BCBC 0%, #007A7A 100%)" }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 min-h-[340px]">
            {/* Text side */}
            <div className="relative z-10 p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 bg-white/20 text-white text-xs font-semibold uppercase tracking-wider px-3 py-1.5 rounded-full mb-4 w-fit">
                <Sparkles className="w-3.5 h-3.5" />
                Powered by IA
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
                Asistente de Fiestas{" "}
                <span className="italic">Inteligente</span>
              </h2>
              <p className="text-white/75 text-sm leading-relaxed mb-6 max-w-sm">
                Elige un tema para empezar. Nuestra IA sugiere colores, kits y
                decoración para que tu fiesta sea perfecta.
              </p>
              <Button
                asChild
                className="w-fit bg-white text-dark hover:bg-white/90 rounded-full h-11 px-6 font-semibold"
              >
                <Link href="/plan-my-event">
                  Probar el Asistente
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Link>
              </Button>
            </div>

            {/* Image side */}
            <div className="relative min-h-[260px] lg:min-h-0">
              <Image
                src="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=700&h=500&fit=crop"
                alt="Asistente de fiestas IA"
                fill
                className="object-cover opacity-30 lg:opacity-60"
                sizes="50vw"
              />
              {/* Mock chat bubbles */}
              <div className="absolute inset-0 flex items-center justify-center p-8 lg:p-6">
                <div className="space-y-3 w-full max-w-xs">
                  {[
                    { from: "user", text: "Quiero una fiesta de unicornio 🦄" },
                    { from: "ai", text: "¡Perfecto! Te recomiendo el Kit Unicornio + globos pastel" },
                    { from: "user", text: "¿Para cuántas personas?" },
                    { from: "ai", text: "Tenemos kits desde 10 hasta 50 personas 🎉" },
                  ].map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`px-4 py-2.5 rounded-2xl text-xs font-medium max-w-[85%] leading-relaxed ${
                          msg.from === "user"
                            ? "bg-white text-dark"
                            : "bg-white/20 backdrop-blur-sm text-white border border-white/30"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
