"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  user: { id: string; name: string | null; email: string };
}

const profileSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Requerida"),
    newPassword: z.string().min(8, "Mínimo 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type ProfileData = z.infer<typeof profileSchema>;
type PasswordData = z.infer<typeof passwordSchema>;

export function EditProfileForm({ user }: Props) {
  const router = useRouter();

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user.name ?? "" },
  });

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSaveProfile = async (data: ProfileData) => {
    const res = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: data.name }),
    });
    if (res.ok) {
      toast.success("Nombre actualizado");
      router.refresh();
    } else {
      const j = await res.json();
      toast.error(j.error ?? "Error al actualizar");
    }
  };

  const onChangePassword = async (data: PasswordData) => {
    const res = await fetch("/api/auth/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }),
    });
    if (res.ok) {
      toast.success("Contraseña actualizada");
      passwordForm.reset();
    } else {
      const j = await res.json();
      toast.error(j.error ?? "Error al actualizar contraseña");
    }
  };

  return (
    <div className="space-y-6">
      {/* Datos personales */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <h2 className="font-semibold text-dark mb-5">Información personal</h2>

        <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
          <div>
            <Label>Correo electrónico</Label>
            <Input
              value={user.email}
              disabled
              className="mt-1.5 h-11 rounded-xl bg-cream-dark"
            />
            <p className="text-xs text-muted-foreground mt-1">
              El correo no se puede cambiar
            </p>
          </div>

          <div>
            <Label htmlFor="name">Nombre completo</Label>
            <Input
              id="name"
              className="mt-1.5 h-11 rounded-xl"
              {...profileForm.register("name")}
            />
            {profileForm.formState.errors.name && (
              <p className="text-xs text-destructive mt-1">
                {profileForm.formState.errors.name.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={profileForm.formState.isSubmitting}
            className="h-10 px-6 rounded-full font-semibold text-white"
            style={{ backgroundColor: "var(--dark)" }}
          >
            {profileForm.formState.isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Guardar cambios"
            )}
          </Button>
        </form>
      </div>

      {/* Cambiar contraseña */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <h2 className="font-semibold text-dark mb-5">Cambiar contraseña</h2>

        <form
          onSubmit={passwordForm.handleSubmit(onChangePassword)}
          className="space-y-4"
        >
          <div>
            <Label htmlFor="currentPassword">Contraseña actual</Label>
            <Input
              id="currentPassword"
              type="password"
              placeholder="••••••••"
              className="mt-1.5 h-11 rounded-xl"
              {...passwordForm.register("currentPassword")}
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-xs text-destructive mt-1">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <Separator />

          <div>
            <Label htmlFor="newPassword">Nueva contraseña</Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Mínimo 8 caracteres"
              className="mt-1.5 h-11 rounded-xl"
              {...passwordForm.register("newPassword")}
            />
            {passwordForm.formState.errors.newPassword && (
              <p className="text-xs text-destructive mt-1">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirmar nueva contraseña</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Repite la nueva contraseña"
              className="mt-1.5 h-11 rounded-xl"
              {...passwordForm.register("confirmPassword")}
            />
            {passwordForm.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive mt-1">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={passwordForm.formState.isSubmitting}
            variant="outline"
            className="h-10 px-6 rounded-full font-semibold"
          >
            {passwordForm.formState.isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Cambiar contraseña"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
