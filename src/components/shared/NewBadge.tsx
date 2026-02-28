import { cn } from "@/lib/utils";

export function NewBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded-md text-xs font-bold text-white",
        className
      )}
      style={{ backgroundColor: "var(--teal-accent)" }}
    >
      Nuevo
    </span>
  );
}
