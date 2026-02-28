import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  ctaLabel?: string;
  ctaHref?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  title,
  subtitle,
  ctaLabel,
  ctaHref,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5",
        align === "center" && "items-center text-center",
        className
      )}
    >
      <div className={cn("flex items-end justify-between gap-4", align === "center" && "flex-col items-center")}>
        <h2 className="section-title">{title}</h2>
        {ctaLabel && ctaHref && align !== "center" && (
          <Link
            href={ctaHref}
            className="flex items-center gap-1 text-sm font-medium text-dark hover:text-accent transition-colors shrink-0 mb-1 group"
            style={{ "--tw-text-opacity": "1" } as React.CSSProperties}
          >
            {ctaLabel}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      {subtitle && (
        <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-xl">
          {subtitle}
        </p>
      )}
      {ctaLabel && ctaHref && align === "center" && (
        <Link
          href={ctaHref}
          className="flex items-center gap-1 text-sm font-medium text-dark hover:text-accent transition-colors mt-1 group"
        >
          {ctaLabel}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
