import Link from "next/link";
import {
  UtensilsCrossed,
  Flag,
  Gamepad2,
  Layers,
  Lamp,
  Sparkles,
  Ribbon,
} from "lucide-react";
import { AI_ESSENTIALS } from "@/data/aiEssentials";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  UtensilsCrossed,
  Flag,
  Gamepad2,
  Layers,
  Lamp,
  Sparkles,
  Ribbon,
};

export function AICuratedEssentials() {
  return (
    <section className="section-py bg-white">
      <div className="container-site">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1">
              Curado por IA
            </p>
            <h2 className="section-title">Esenciales para tu Fiesta</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Artículos a juego seleccionados por nuestra IA
            </p>
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2">
          {AI_ESSENTIALS.map((cat) => {
            const Icon = ICON_MAP[cat.icon] ?? Sparkles;
            return (
              <Link
                key={cat.id}
                href={cat.href}
                className="flex flex-col items-center gap-2.5 group shrink-0"
              >
                <div className="w-16 h-16 rounded-full bg-cream-dark flex items-center justify-center transition-all duration-200 group-hover:bg-pink-light group-hover:scale-110">
                  <Icon className="w-7 h-7 text-dark" />
                </div>
                <span className="text-xs font-medium text-dark text-center whitespace-nowrap">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
