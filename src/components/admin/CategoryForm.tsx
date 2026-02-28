"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  description: z.string().optional(),
  color: z.string().optional(),
  image: z.string().url("URL inválida").optional().or(z.literal("")),
  heroImage: z.string().url("URL inválida").optional().or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

interface CategoryData {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  image: string | null;
  heroImage: string | null;
}

interface Props {
  category?: CategoryData;
}

function toSlug(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function CategoryForm({ category }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const isEditing = !!category;

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      color: category?.color ?? "",
      image: category?.image ?? "",
      heroImage: category?.heroImage ?? "",
    },
  });

  const nameValue = watch("name");

  // Auto-generate slug from name when creating
  useEffect(() => {
    if (!isEditing && nameValue) {
      setValue("slug", toSlug(nameValue), { shouldValidate: false });
    }
  }, [nameValue, isEditing, setValue]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const url = isEditing
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories";
      const method = isEditing ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        const msg = Array.isArray(json.error) ? json.error[0]?.message : json.error;
        toast.error(msg ?? "Error al guardar");
        return;
      }
      toast.success(isEditing ? "Categoría actualizada" : "Categoría creada");
      router.push("/admin/categories");
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
          <Input id="name" placeholder="Globos de Látex" className="mt-1.5" {...register("name")} />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input id="slug" placeholder="globos-de-latex" className="mt-1.5 font-mono text-sm" {...register("slug")} />
          {errors.slug && <p className="text-xs text-red-600 mt-1">{errors.slug.message}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="description">Descripción</Label>
        <textarea
          id="description"
          rows={3}
          placeholder="Descripción de la categoría..."
          className="mt-1.5 w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          {...register("description")}
        />
      </div>

      <div>
        <Label htmlFor="color">Color (hex)</Label>
        <div className="flex items-center gap-3 mt-1.5">
          <Input
            id="color"
            placeholder="#FF3B7B"
            className="font-mono text-sm"
            {...register("color")}
          />
          {watch("color") && /^#[0-9A-Fa-f]{6}$/.test(watch("color") ?? "") && (
            <div
              className="w-10 h-10 rounded-lg border border-gray-200 shrink-0"
              style={{ backgroundColor: watch("color") ?? undefined }}
            />
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="image">URL de imagen (miniatura)</Label>
        <Input id="image" placeholder="https://..." className="mt-1.5" {...register("image")} />
        {errors.image && <p className="text-xs text-red-600 mt-1">{errors.image.message}</p>}
      </div>

      <div>
        <Label htmlFor="heroImage">URL de imagen hero</Label>
        <Input id="heroImage" placeholder="https://..." className="mt-1.5" {...register("heroImage")} />
        {errors.heroImage && <p className="text-xs text-red-600 mt-1">{errors.heroImage.message}</p>}
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/categories")}
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
          ) : isEditing ? "Actualizar categoría" : "Crear categoría"}
        </Button>
      </div>
    </form>
  );
}
