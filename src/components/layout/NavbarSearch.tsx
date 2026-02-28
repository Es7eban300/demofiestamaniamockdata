"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Input } from "@/components/ui/input";

export function NavbarSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const open = () => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  const close = () => setIsOpen(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const query = e.currentTarget.value.trim();
      if (query) {
        router.push(`/products?search=${encodeURIComponent(query)}`);
        close();
      }
    }
    if (e.key === "Escape") close();
  };

  return (
    <div className="relative flex items-center">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 240, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <Input
              ref={inputRef}
              placeholder="Buscar productos..."
              onBlur={close}
              onKeyDown={handleKeyDown}
              className="h-9 bg-white border-border rounded-full pr-8 text-sm"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={isOpen ? close : open}
        className="ml-1 w-9 h-9 flex items-center justify-center rounded-full hover:bg-cream-dark transition-colors text-dark"
        aria-label="Buscar"
      >
        {isOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
      </button>
    </div>
  );
}
