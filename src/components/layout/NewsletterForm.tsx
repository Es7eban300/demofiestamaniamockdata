"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function NewsletterForm() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("¡Suscrito! Recibirás novedades pronto 🎉");
  };

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <Input
        type="email"
        placeholder="tu@correo.com"
        className="bg-white/10 border-white/20 text-white placeholder:text-white/40 h-9 text-sm flex-1"
      />
      <Button
        type="submit"
        className="shrink-0 h-9 px-4 text-white"
        style={{ backgroundColor: "var(--pink-accent)" }}
      >
        OK
      </Button>
    </form>
  );
}
