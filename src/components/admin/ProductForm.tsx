"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  ImagePlus,
  Tag,
  Package,
  DollarSign,
  AlignLeft,
  Sliders,
  Palette,
} from "lucide-react";
import { VariantManager } from "@/components/admin/VariantManager";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// ─── Zod schema ───────────────────────────────────────────────────────────────

const productSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().min(2, "Mínimo 2 caracteres").regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  description: z.string().min(10, "Descripción muy corta"),
  shortDescription: z.string().optional(),
  price: z.coerce.number().positive("El precio debe ser mayor a 0"),
  compareAtPrice: z.coerce.number().positive().optional().or(z.literal("")),
  categoryId: z.string().min(1, "Selecciona una categoría"),
  inStock: z.boolean().default(true),
  stockCount: z.coerce.number().int().min(0).default(0),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNew: z.boolean().default(true),
  tags: z.string().optional(), // comma-separated
  badges: z.array(z.string()).default([]),
  occasionIds: z.array(z.string()).default([]),
  images: z
    .array(
      z.object({
        url: z.string().url("URL inválida"),
        alt: z.string().min(1, "Requerido"),
        isPrimary: z.boolean().default(false),
        sortOrder: z.coerce.number().int().default(0),
      })
    )
    .min(1, "Agrega al menos una imagen"),
  attributes: z
    .array(
      z.object({
        name: z.string().min(1, "Nombre requerido"),
        value: z.string().min(1, "Valor requerido"),
      })
    )
    .default([]),
});

type FormData = z.infer<typeof productSchema>;

// ─── Props ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  slug: string;
}
interface Occasion {
  id: string;
  name: string;
  icon: string | null;
}

interface Variant {
  id: string;
  color: string;
  colorName: string;
  stock: number;
  sku: string | null;
}

interface Props {
  categories: Category[];
  occasions: Occasion[];
  defaultValues?: Partial<FormData>;
  productId?: string;
  initialVariants?: Variant[];
}

const BADGE_OPTIONS = [
  { value: "new", label: "Nuevo" },
  { value: "sale", label: "Oferta" },
  { value: "bestseller", label: "Más vendido" },
  { value: "limited", label: "Edición limitada" },
];

// ─── Slug helper ──────────────────────────────────────────────────────────────

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── Section card ─────────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50">
        <Icon className="w-4 h-4 text-gray-500" />
        <h2 className="font-semibold text-gray-900 text-sm">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ProductForm({ categories, occasions, defaultValues, productId, initialVariants = [] }: Props) {
  const router = useRouter();
  const isEditing = !!productId;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      inStock: true,
      stockCount: 0,
      isFeatured: false,
      isBestSeller: false,
      isNew: true,
      badges: [],
      occasionIds: [],
      images: [{ url: "", alt: "", isPrimary: true, sortOrder: 0 }],
      attributes: [],
      ...defaultValues,
    },
  });

  const {
    fields: imageFields,
    append: appendImage,
    remove: removeImage,
  } = useFieldArray({ control, name: "images" });

  const {
    fields: attrFields,
    append: appendAttr,
    remove: removeAttr,
  } = useFieldArray({ control, name: "attributes" });

  const watchedBadges = watch("badges");
  const watchedOccasions = watch("occasionIds");
  const watchedName = watch("name");

  const toggleBadge = (value: string) => {
    const current = watchedBadges ?? [];
    setValue(
      "badges",
      current.includes(value) ? current.filter((b) => b !== value) : [...current, value]
    );
  };

  const toggleOccasion = (id: string) => {
    const current = watchedOccasions ?? [];
    setValue(
      "occasionIds",
      current.includes(id) ? current.filter((o) => o !== id) : [...current, id]
    );
  };

  const autoSlug = () => {
    if (watchedName) setValue("slug", slugify(watchedName));
  };

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      compareAtPrice: data.compareAtPrice === "" ? undefined : data.compareAtPrice,
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : [],
    };

    const url = isEditing
      ? `/api/admin/products/${productId}`
      : "/api/products";
    const method = isEditing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const json = await res.json();

    if (!res.ok) {
      toast.error(
        Array.isArray(json.error)
          ? json.error[0]?.message ?? "Error de validación"
          : json.error ?? "Error al guardar"
      );
      return;
    }

    toast.success(isEditing ? "Producto actualizado" : "Producto creado exitosamente");
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left column (2/3) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Información básica */}
          <Section icon={AlignLeft} title="Información básica">
            <div>
              <Label htmlFor="name">Nombre del producto *</Label>
              <Input
                id="name"
                placeholder="Ramo de Globos Pastel 12 pzas"
                className="mt-1.5"
                {...register("name")}
                onBlur={autoSlug}
              />
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="slug">
                Slug (URL){" "}
                <span className="text-gray-400 font-normal text-xs">
                  — se genera automáticamente
                </span>
              </Label>
              <Input
                id="slug"
                placeholder="ramo-globos-pastel-12pzas"
                className="mt-1.5 font-mono text-sm"
                {...register("slug")}
              />
              {errors.slug && (
                <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descripción completa *</Label>
              <Textarea
                id="description"
                placeholder="Describe el producto detalladamente…"
                rows={4}
                className="mt-1.5 resize-none"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="shortDescription">Descripción corta</Label>
              <Input
                id="shortDescription"
                placeholder="12 globos de látex rosa pastel"
                className="mt-1.5"
                {...register("shortDescription")}
              />
            </div>
          </Section>

          {/* Imágenes */}
          <Section icon={ImagePlus} title="Imágenes">
            <div className="space-y-3">
              {imageFields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_auto_auto_auto] gap-2 items-start"
                >
                  <div className="space-y-1">
                    <Input
                      placeholder="https://…"
                      className="text-sm"
                      {...register(`images.${index}.url`)}
                    />
                    {errors.images?.[index]?.url && (
                      <p className="text-xs text-red-500">
                        {errors.images[index].url?.message}
                      </p>
                    )}
                  </div>
                  <Input
                    placeholder="Texto alt"
                    className="text-sm w-36"
                    {...register(`images.${index}.alt`)}
                  />
                  <label className="flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap cursor-pointer pt-2">
                    <input
                      type="radio"
                      name="primaryImage"
                      defaultChecked={index === 0}
                      onChange={() => {
                        imageFields.forEach((_, i) =>
                          setValue(`images.${i}.isPrimary`, i === index)
                        );
                      }}
                      className="accent-pink-500"
                    />
                    Principal
                  </label>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    disabled={imageFields.length === 1}
                    className="p-2 text-gray-400 hover:text-red-500 disabled:opacity-30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {errors.images && !Array.isArray(errors.images) && (
              <p className="text-xs text-red-500">{errors.images.message}</p>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() =>
                appendImage({ url: "", alt: "", isPrimary: false, sortOrder: imageFields.length })
              }
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar imagen
            </Button>
          </Section>

          {/* Atributos específicos */}
          <Section icon={Sliders} title="Atributos del producto">
            <p className="text-xs text-gray-500">
              Define características únicas de este producto (ej. Diámetro: 30cm, Material: Látex, Colores: Rosa y Azul).
            </p>
            <div className="space-y-2">
              {attrFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center">
                  <Input
                    placeholder="Característica (ej. Diámetro)"
                    className="text-sm"
                    {...register(`attributes.${index}.name`)}
                  />
                  <Input
                    placeholder="Valor (ej. 30cm)"
                    className="text-sm"
                    {...register(`attributes.${index}.value`)}
                  />
                  <button
                    type="button"
                    onClick={() => removeAttr(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => appendAttr({ name: "", value: "" })}
            >
              <Plus className="w-3.5 h-3.5" />
              Agregar atributo
            </Button>
          </Section>

          {/* Tags */}
          <Section icon={Tag} title="Etiquetas">
            <div>
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="globos, rosa, cumpleaños, baby-shower"
                className="mt-1.5"
                {...register("tags")}
              />
              <p className="text-xs text-gray-400 mt-1">Separados por comas</p>
            </div>
          </Section>
        </div>

        {/* Right column (1/3) */}
        <div className="space-y-6">
          {/* Precio */}
          <Section icon={DollarSign} title="Precios">
            <div>
              <Label htmlFor="price">Precio de venta *</Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-7"
                  {...register("price")}
                />
              </div>
              {errors.price && (
                <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="compareAtPrice">Precio tachado (antes)</Label>
              <div className="relative mt-1.5">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                  $
                </span>
                <Input
                  id="compareAtPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Opcional"
                  className="pl-7"
                  {...register("compareAtPrice")}
                />
              </div>
            </div>
          </Section>

          {/* Organización */}
          <Section icon={Package} title="Organización">
            <div>
              <Label>Categoría *</Label>
              <Select
                onValueChange={(v) => setValue("categoryId", v)}
                defaultValue={defaultValues?.categoryId}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Selecciona categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>
              )}
            </div>

            <Separator />

            <div>
              <Label className="mb-2 block">Ocasiones</Label>
              <div className="space-y-1.5">
                {occasions.map((o) => (
                  <label
                    key={o.id}
                    className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
                  >
                    <input
                      type="checkbox"
                      checked={watchedOccasions?.includes(o.id) ?? false}
                      onChange={() => toggleOccasion(o.id)}
                      className="accent-pink-500 rounded"
                    />
                    {o.icon && <span>{o.icon}</span>}
                    {o.name}
                  </label>
                ))}
              </div>
            </div>
          </Section>

          {/* Inventario */}
          <Section icon={Package} title="Inventario">
            <div>
              <Label htmlFor="stockCount">Cantidad en stock</Label>
              <Input
                id="stockCount"
                type="number"
                min="0"
                className="mt-1.5"
                {...register("stockCount")}
              />
            </div>

            <div className="space-y-2">
              {[
                { name: "inStock", label: "En stock" },
                { name: "isFeatured", label: "Destacado" },
                { name: "isBestSeller", label: "Más vendido" },
                { name: "isNew", label: "Nuevo" },
              ].map((opt) => (
                <label
                  key={opt.name}
                  className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    className="accent-pink-500 rounded"
                    {...register(opt.name as keyof FormData)}
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </Section>

          {/* Badges */}
          <Section icon={Tag} title="Insignias">
            <div className="space-y-1.5">
              {BADGE_OPTIONS.map((b) => (
                <label
                  key={b.value}
                  className="flex items-center gap-2 cursor-pointer text-sm text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={watchedBadges?.includes(b.value) ?? false}
                    onChange={() => toggleBadge(b.value)}
                    className="accent-pink-500 rounded"
                  />
                  {b.label}
                </label>
              ))}
            </div>
          </Section>
        </div>
      </div>

      {/* Variantes de color — solo disponible al editar */}
      {productId && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100 bg-gray-50">
            <Palette className="w-4 h-4 text-gray-500" />
            <h2 className="text-sm font-semibold text-gray-700">Variantes de color</h2>
          </div>
          <div className="p-6">
            <p className="text-xs text-gray-500 mb-4">
              Agrega variantes de color para que los clientes puedan elegir. Cada variante tiene su propio stock.
            </p>
            <VariantManager productId={productId} initialVariants={initialVariants} />
          </div>
        </div>
      )}

      {/* Footer actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
          className="rounded-lg"
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg px-6 gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>{isEditing ? "Guardar cambios" : "Crear producto"}</>
          )}
        </Button>
      </div>
    </form>
  );
}
