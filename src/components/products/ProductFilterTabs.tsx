"use client";

import { cn } from "@/lib/utils";

interface ProductFilterTabsProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  className?: string;
}

export function ProductFilterTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
}: ProductFilterTabsProps) {
  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={cn(
            "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200",
            activeTab === tab
              ? "bg-dark text-white shadow-sm"
              : "bg-cream-dark text-dark hover:bg-pink-light"
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
