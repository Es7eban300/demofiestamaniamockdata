"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PartyPopper, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") ?? "/cuenta";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Error al iniciar sesión");
        return;
      }

      toast.success(`¡Bienvenida de vuelta, ${json.data.name ?? json.data.email}! 🎉`);
      router.push(redirect);
      router.refresh();
    } catch {
      toast.error("Error de conexión. Intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center section-py">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ backgroundColor: "var(--pink-accent)" }}>
            <PartyPopper className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-dark mb-1">
            ¡Hola de nuevo!
          </h1>
          <p className="text-muted-foreground text-sm">
            Ingresa a tu cuenta FiestaMania
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-3xl p-8"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@correo.com"
                className="mt-1.5 h-11 rounded-xl"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="mt-1.5 h-11 rounded-xl"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-full font-semibold text-white"
              style={{ backgroundColor: "var(--dark)" }}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                "Iniciar sesión"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?{" "}
            <Link
              href="/registro"
              className="font-semibold hover:underline"
              style={{ color: "var(--pink-accent)" }}
            >
              Regístrate gratis
            </Link>
          </div>

          <div className="mt-4 text-center">
            <Link
              href="/admin/login"
              className="text-xs text-muted-foreground hover:text-dark transition-colors underline underline-offset-2"
            >
              ¿Eres administrador? Acceder al panel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
