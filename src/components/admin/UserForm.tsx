"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const createSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  role: z.enum(["CUSTOMER", "ADMIN"]),
});

const editSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().optional(),
  role: z.enum(["CUSTOMER", "ADMIN"]),
});

type CreateData = z.infer<typeof createSchema>;
type EditData = z.infer<typeof editSchema>;

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: "CUSTOMER" | "ADMIN";
}

interface Props {
  user?: UserData;
}

export function UserForm({ user }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isEditing = !!user;

  const schema = isEditing ? editSchema : createSchema;

  const { register, handleSubmit, formState: { errors } } = useForm<CreateData | EditData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      password: "",
      role: user?.role ?? "CUSTOMER",
    },
  });

  const onSubmit = async (data: CreateData | EditData) => {
    setSubmitting(true);
    try {
      let url: string;
      let method: string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: any = { name: data.name, email: data.email, role: data.role };

      if (isEditing) {
        url = `/api/admin/users/${user.id}`;
        method = "PUT";
        // Only include password if it was provided
        if ((data as EditData).password) {
          payload.password = (data as EditData).password;
        }
      } else {
        url = "/api/admin/users";
        method = "POST";
        payload.password = (data as CreateData).password;
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = Array.isArray(json.error) ? json.error[0]?.message : json.error;
        toast.error(msg ?? "Error al guardar");
        return;
      }
      toast.success(isEditing ? "Usuario actualizado" : "Usuario creado");
      router.push("/admin/users");
      router.refresh();
    } catch {
      toast.error("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nombre *</Label>
          <Input id="name" placeholder="María García" className="mt-1.5" {...register("name")} />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Correo electrónico *</Label>
          <Input id="email" type="email" placeholder="maria@ejemplo.com" className="mt-1.5" {...register("email")} />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="password">
          Contraseña {isEditing ? "(dejar en blanco para no cambiar)" : "*"}
        </Label>
        <div className="relative mt-1.5">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder={isEditing ? "Nueva contraseña (opcional)" : "Mínimo 8 caracteres"}
            className="pr-10"
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
        {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
      </div>

      <div>
        <Label htmlFor="role">Rol *</Label>
        <select
          id="role"
          className="mt-1.5 w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
          {...register("role")}
        >
          <option value="CUSTOMER">Cliente</option>
          <option value="ADMIN">Administrador</option>
        </select>
        {errors.role && <p className="text-xs text-red-600 mt-1">{errors.role.message}</p>}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/users")}
          disabled={submitting}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={submitting}
          className="bg-pink-500 hover:bg-pink-600 text-white"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
              Guardando...
            </>
          ) : isEditing ? "Actualizar usuario" : "Crear usuario"}
        </Button>
      </div>
    </form>
  );
}
