import { RotateCcw, Truck, Shield, Headphones } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { TRUST_BADGES } from "@/data/trustBadges";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  RotateCcw,
  Truck,
  Shield,
  Headphones,
};

export function TrustBadges() {
  return (
    <section className="bg-white border-y border-border">
      <div className="container-site">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
          {TRUST_BADGES.map((badge) => {
            const Icon = ICON_MAP[badge.icon] ?? Shield;
            return (
              <div
                key={badge.id}
                className="flex items-center gap-3 py-6 px-4 md:px-6"
              >
                <div className="w-10 h-10 rounded-full bg-cream-dark flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-dark" />
                </div>
                <div>
                  <p className="font-semibold text-dark text-sm">{badge.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{badge.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
