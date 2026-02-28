"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { PartyPopper, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const schema = z
  .object({
    name: z.string().min(2, "El nombre debe tener mínimo 2 caracteres"),
    email: z.string().email("Correo inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegistroPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Error al crear la cuenta");
        return;
      }

      toast.success("¡Cuenta creada! Bienvenida a FiestaMania 🎉");
      router.push("/cuenta");
      router.refresh();
    } catch {
      toast.error("Error de conexión. Intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center section-py">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div
            className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ backgroundColor: "var(--pink-accent)" }}
          >
            <PartyPopper className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-3xl font-bold text-dark mb-1">
            Crea tu cuenta
          </h1>
          <p className="text-muted-foreground text-sm">
            Únete a la comunidad FiestaMania
          </p>
        </div>

        <div
          className="bg-white rounded-3xl p-8"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="name">Nombre completo</Label>
              <Input
                id="name"
                placeholder="María García"
                className="mt-1.5 h-11 rounded-xl"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
              )}
            </div>

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
                placeholder="Mínimo 8 caracteres"
                className="mt-1.5 h-11 rounded-xl"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repite tu contraseña"
                className="mt-1.5 h-11 rounded-xl"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">
                  {errors.confirmPassword.message}
                </p>
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
                "Crear cuenta"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link
              href="/login"
              className="font-semibold hover:underline"
              style={{ color: "var(--pink-accent)" }}
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
