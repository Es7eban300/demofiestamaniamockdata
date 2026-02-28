"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface UserOption {
  id: string;
  name: string | null;
  email: string;
}

interface ShippingMethodOption {
  id: string;
  name: string;
  price: number;
  description: string | null;
}

interface Props {
  users: UserOption[];
  shippingMethods: ShippingMethodOption[];
}

const itemSchema = z.object({
  name: z.string().min(1, "Nombre del artículo requerido"),
  price: z.coerce.number().min(0, "Precio inválido"),
  quantity: z.coerce.number().min(1).int(),
  imageUrl: z.string().optional(),
  productId: z.string().optional(),
});

const schema = z.object({
  customerType: z.enum(["user", "guest"]),
  userId: z.string().optional(),
  guestName: z.string().optional(),
  guestEmail: z.string().optional(),
  guestPhone: z.string().optional(),
  items: z.array(itemSchema).min(1, "Agrega al menos un artículo"),
  shippingMethodId: z.string().optional(),
  shippingName: z.string().min(1, "Requerido"),
  shippingAddress: z.string().min(1, "Requerido"),
  shippingCity: z.string().min(1, "Requerido"),
  shippingState: z.string().min(1, "Requerido"),
  shippingZipCode: z.string().min(1, "Requerido"),
  shippingPhone: z.string().optional(),
  shippingCost: z.coerce.number().min(0).default(0),
  discountAmount: z.coerce.number().min(0).default(0),
  status: z.enum(["PENDIENTE", "CONFIRMADO", "ENVIADO", "ENTREGADO", "CANCELADO"]),
  paymentStatus: z.enum(["PENDIENTE", "PAGADO", "FALLIDO", "REEMBOLSADO"]),
  paymentMethod: z.string().optional(),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2 mb-4">
    {children}
  </h2>
);

export function OrderForm({ users, shippingMethods }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<FormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema) as any,
    defaultValues: {
      customerType: "guest",
      items: [{ name: "", price: 0, quantity: 1, imageUrl: "", productId: "" }],
      status: "PENDIENTE",
      paymentStatus: "PENDIENTE",
      shippingCost: 0,
      discountAmount: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "items" });

  const watchItems = watch("items");
  const watchShippingCost = watch("shippingCost") ?? 0;
  const watchDiscount = watch("discountAmount") ?? 0;
  const watchCustomerType = watch("customerType");
  const watchShippingMethodId = watch("shippingMethodId");

  const subtotal = (watchItems ?? []).reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );
  const total = subtotal + Number(watchShippingCost) - Number(watchDiscount);

  // Auto-fill shipping cost when selecting a method
  const handleShippingMethodChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const methodId = e.target.value;
    setValue("shippingMethodId", methodId);
    const method = shippingMethods.find((m) => m.id === methodId);
    if (method) setValue("shippingCost", method.price);
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        userId: data.customerType === "user" ? data.userId : undefined,
        guestName: data.customerType === "guest" ? data.guestName : undefined,
        guestEmail: data.customerType === "guest" ? data.guestEmail : undefined,
        guestPhone: data.customerType === "guest" ? data.guestPhone : undefined,
      };

      const res = await fetch("/api/admin/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        const msg = Array.isArray(json.error) ? json.error[0]?.message : json.error;
        toast.error(msg ?? "Error al crear pedido");
        return;
      }

      toast.success("Pedido creado correctamente");
      router.push("/admin/orders");
      router.refresh();
    } catch {
      toast.error("Error de conexión");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-3xl">
      {/* ─── Cliente ─────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Cliente</SectionTitle>

        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="guest"
              {...register("customerType")}
              className="accent-pink-500"
            />
            <span className="text-sm font-medium text-gray-700">Invitado</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              value="user"
              {...register("customerType")}
              className="accent-pink-500"
            />
            <span className="text-sm font-medium text-gray-700">Cliente registrado</span>
          </label>
        </div>

        {watchCustomerType === "user" ? (
          <div>
            <Label htmlFor="userId">Seleccionar cliente</Label>
            <select
              id="userId"
              {...register("userId")}
              className="mt-1.5 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">-- Seleccionar --</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name ? `${u.name} (${u.email})` : u.email}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="guestName">Nombre</Label>
              <Input id="guestName" placeholder="Nombre completo" className="mt-1.5" {...register("guestName")} />
            </div>
            <div>
              <Label htmlFor="guestEmail">Correo</Label>
              <Input id="guestEmail" type="email" placeholder="correo@ejemplo.com" className="mt-1.5" {...register("guestEmail")} />
            </div>
            <div>
              <Label htmlFor="guestPhone">Teléfono</Label>
              <Input id="guestPhone" placeholder="55 0000 0000" className="mt-1.5" {...register("guestPhone")} />
            </div>
          </div>
        )}
      </section>

      {/* ─── Artículos ────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Artículos</SectionTitle>

        <div className="space-y-3">
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-12 gap-2 items-start">
              <div className="col-span-5">
                <Input
                  placeholder="Nombre del producto"
                  {...register(`items.${index}.name`)}
                />
                {errors.items?.[index]?.name && (
                  <p className="text-xs text-red-600 mt-0.5">{errors.items[index]?.name?.message}</p>
                )}
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Precio"
                  {...register(`items.${index}.price`)}
                />
              </div>
              <div className="col-span-2">
                <Input
                  type="number"
                  min="1"
                  placeholder="Cant."
                  {...register(`items.${index}.quantity`)}
                />
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600 py-2 font-medium text-right">
                  ${(
                    (Number(watchItems?.[index]?.price) || 0) *
                    (Number(watchItems?.[index]?.quantity) || 0)
                  ).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="col-span-1 flex justify-end">
                {fields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {errors.items?.root && (
          <p className="text-xs text-red-600 mt-1">{errors.items.root.message}</p>
        )}

        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          onClick={() => append({ name: "", price: 0, quantity: 1, imageUrl: "", productId: "" })}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Agregar artículo
        </Button>
      </section>

      {/* ─── Envío ─────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Información de envío</SectionTitle>

        <div className="space-y-4">
          <div>
            <Label htmlFor="shippingMethodId">Método de envío</Label>
            <select
              id="shippingMethodId"
              value={watchShippingMethodId ?? ""}
              onChange={handleShippingMethodChange}
              className="mt-1.5 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">-- Sin método --</option>
              {shippingMethods.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} — ${m.price.toLocaleString("es-MX")}
                  {m.description ? ` (${m.description})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shippingName">Nombre del destinatario *</Label>
              <Input id="shippingName" className="mt-1.5" {...register("shippingName")} />
              {errors.shippingName && (
                <p className="text-xs text-red-600 mt-0.5">{errors.shippingName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="shippingPhone">Teléfono</Label>
              <Input id="shippingPhone" className="mt-1.5" {...register("shippingPhone")} />
            </div>
          </div>

          <div>
            <Label htmlFor="shippingAddress">Dirección *</Label>
            <Input id="shippingAddress" className="mt-1.5" {...register("shippingAddress")} />
            {errors.shippingAddress && (
              <p className="text-xs text-red-600 mt-0.5">{errors.shippingAddress.message}</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="shippingCity">Ciudad *</Label>
              <Input id="shippingCity" className="mt-1.5" {...register("shippingCity")} />
              {errors.shippingCity && (
                <p className="text-xs text-red-600 mt-0.5">{errors.shippingCity.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="shippingState">Estado *</Label>
              <Input id="shippingState" className="mt-1.5" {...register("shippingState")} />
              {errors.shippingState && (
                <p className="text-xs text-red-600 mt-0.5">{errors.shippingState.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="shippingZipCode">CP *</Label>
              <Input id="shippingZipCode" className="mt-1.5" {...register("shippingZipCode")} />
              {errors.shippingZipCode && (
                <p className="text-xs text-red-600 mt-0.5">{errors.shippingZipCode.message}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Pago y Estado ────────────────────────────────────────── */}
      <section>
        <SectionTitle>Pago y estado</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status">Estado del pedido</Label>
            <select
              id="status"
              {...register("status")}
              className="mt-1.5 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="CONFIRMADO">Confirmado</option>
              <option value="ENVIADO">Enviado</option>
              <option value="ENTREGADO">Entregado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>

          <div>
            <Label htmlFor="paymentStatus">Estado de pago</Label>
            <select
              id="paymentStatus"
              {...register("paymentStatus")}
              className="mt-1.5 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="PAGADO">Pagado</option>
              <option value="FALLIDO">Fallido</option>
              <option value="REEMBOLSADO">Reembolsado</option>
            </select>
          </div>

          <div>
            <Label htmlFor="paymentMethod">Método de pago</Label>
            <Input
              id="paymentMethod"
              placeholder="Tarjeta, transferencia, efectivo…"
              className="mt-1.5"
              {...register("paymentMethod")}
            />
          </div>

          <div>
            <Label htmlFor="shippingCost">Costo de envío ($)</Label>
            <Input
              id="shippingCost"
              type="number"
              step="0.01"
              min="0"
              className="mt-1.5"
              {...register("shippingCost")}
            />
          </div>

          <div>
            <Label htmlFor="discountAmount">Descuento ($)</Label>
            <Input
              id="discountAmount"
              type="number"
              step="0.01"
              min="0"
              className="mt-1.5"
              {...register("discountAmount")}
            />
          </div>
        </div>
      </section>

      {/* ─── Notas ────────────────────────────────────────────────── */}
      <section>
        <SectionTitle>Notas internas</SectionTitle>
        <textarea
          rows={3}
          placeholder="Notas adicionales sobre el pedido..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
          {...register("notes")}
        />
      </section>

      {/* ─── Totales ──────────────────────────────────────────────── */}
      <section className="bg-gray-50 rounded-xl p-5 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span>${subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Envío</span>
          <span>
            {Number(watchShippingCost) === 0
              ? "Gratis"
              : `$${Number(watchShippingCost).toLocaleString("es-MX", { minimumFractionDigits: 2 })}`}
          </span>
        </div>
        {Number(watchDiscount) > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>Descuento</span>
            <span>-${Number(watchDiscount).toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
          </div>
        )}
        <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-200">
          <span>Total</span>
          <span>${total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
        </div>
      </section>

      {/* ─── Acciones ─────────────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/orders")}
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
              Creando pedido...
            </>
          ) : (
            "Crear pedido"
          )}
        </Button>
      </div>
    </form>
  );
}
