"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Check, Tag, Loader2, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { PriceDisplay } from "@/components/shared/PriceDisplay";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import type { CheckoutStep } from "@/types";

interface ShippingMethod {
  id: string;
  name: string;
  description: string | null;
  price: number;
  estimatedDays: number | null;
}

interface CouponResult {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: number;
  discountAmount: number;
}

const schema = z.object({
  email: z.string().email("Correo inválido"),
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  address: z.string().min(5, "Dirección muy corta"),
  city: z.string().min(2, "Ciudad requerida"),
  state: z.string().min(2, "Estado requerido"),
  zipCode: z.string().min(5, "CP inválido"),
  phone: z.string().min(10, "Teléfono inválido"),
});

type FormData = z.infer<typeof schema>;

const STEPS: { id: CheckoutStep; label: string }[] = [
  { id: "informacion", label: "Información" },
  { id: "envio", label: "Envío" },
  { id: "pago", label: "Pago" },
];

function formatMXN(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(n);
}

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState<CheckoutStep>("informacion");
  const { items, totalPrice, clearCart } = useCartStore();
  const subtotal = totalPrice();

  // Shipping
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [selectedShippingId, setSelectedShippingId] = useState<string>("");
  const [loadingShipping, setLoadingShipping] = useState(false);

  // Coupon
  const [couponCode, setCouponCode] = useState("");
  const [couponResult, setCouponResult] = useState<CouponResult | null>(null);
  const [couponError, setCouponError] = useState("");
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // Order submission
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const currentStepIndex = STEPS.findIndex((s) => s.id === step);
  const selectedShipping = shippingMethods.find((m) => m.id === selectedShippingId);
  const shippingCost = selectedShipping?.price ?? 0;
  const discount = couponResult?.discountAmount ?? 0;
  const total = Math.max(0, subtotal - discount + shippingCost);

  // Load shipping methods when entering step "envio"
  useEffect(() => {
    if (step === "envio" && shippingMethods.length === 0) {
      setLoadingShipping(true);
      fetch("/api/shipping")
        .then((r) => r.json())
        .then((json) => {
          const methods: ShippingMethod[] = json.data ?? [];
          setShippingMethods(methods);
          if (methods.length > 0) setSelectedShippingId(methods[0].id);
        })
        .catch(() => toast.error("No se pudieron cargar los métodos de envío"))
        .finally(() => setLoadingShipping(false));
    }
  }, [step, shippingMethods.length]);

  async function handleValidateCoupon() {
    if (!couponCode.trim()) return;
    setCouponError("");
    setCouponResult(null);
    setValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), subtotal }),
      });
      const json = await res.json();
      if (!res.ok) {
        setCouponError(json.error ?? "Cupón no válido");
      } else {
        setCouponResult(json.data);
        toast.success(`Cupón aplicado: -${formatMXN(json.data.discountAmount)}`);
      }
    } catch {
      setCouponError("Error al validar el cupón");
    } finally {
      setValidatingCoupon(false);
    }
  }

  async function placeOrder(formData: FormData) {
    if (!selectedShippingId) {
      toast.error("Selecciona un método de envío");
      return;
    }
    setSubmitting(true);
    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        ...(item.variantId ? { variantId: item.variantId } : {}),
      }));

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: "MX",
          shippingMethodId: selectedShippingId,
          couponCode: couponResult?.code,
          paymentMethod: "card",
          items: orderItems,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Error al crear el pedido");
        return;
      }

      clearCart();
      toast.success("¡Pedido realizado con éxito! 🎉");
      router.push(`/cuenta/pedidos/${json.data.id}`);
    } catch {
      toast.error("Error de conexión. Intenta de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  const onSubmit = (data: FormData) => {
    if (step === "informacion") {
      setStep("envio");
    } else if (step === "envio") {
      setStep("pago");
    } else {
      placeOrder(data);
    }
  };

  // If there's nothing in the cart, the submit on pago needs form data — we get it from getValues
  const handlePaymentSubmit = () => {
    if (step === "pago") {
      const data = getValues();
      const parsed = schema.safeParse(data);
      if (parsed.success) {
        placeOrder(parsed.data);
      }
    }
  };

  return (
    <div className="container-site section-py">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/cart" className="text-muted-foreground hover:text-dark transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="font-display text-2xl font-bold text-dark">Finalizar Compra</h1>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-2 mb-10">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors"
                style={{
                  backgroundColor: i <= currentStepIndex ? "var(--dark)" : "var(--cream-dark)",
                  color: i <= currentStepIndex ? "white" : "var(--mid)",
                }}
              >
                {i < currentStepIndex ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${i === currentStepIndex ? "text-dark" : "text-muted-foreground"}`}>
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className="h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {step === "informacion" && (
              <>
                <h2 className="font-semibold text-lg text-dark">Información de contacto</h2>
                <div>
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input id="email" type="email" placeholder="tu@correo.com" className="mt-1.5" {...register("email")} />
                  {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
                </div>
                <Separator />
                <h2 className="font-semibold text-lg text-dark">Dirección de envío</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" placeholder="María" className="mt-1.5" {...register("firstName")} />
                    {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" placeholder="García" className="mt-1.5" {...register("lastName")} />
                    {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" placeholder="Calle, número, colonia" className="mt-1.5" {...register("address")} />
                  {errors.address && <p className="text-xs text-destructive mt-1">{errors.address.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ciudad</Label>
                    <Input id="city" placeholder="Ciudad de México" className="mt-1.5" {...register("city")} />
                    {errors.city && <p className="text-xs text-destructive mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="zipCode">Código Postal</Label>
                    <Input id="zipCode" placeholder="06600" className="mt-1.5" {...register("zipCode")} />
                    {errors.zipCode && <p className="text-xs text-destructive mt-1">{errors.zipCode.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input id="state" placeholder="CDMX" className="mt-1.5" {...register("state")} />
                    {errors.state && <p className="text-xs text-destructive mt-1">{errors.state.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="55 1234 5678" className="mt-1.5" {...register("phone")} />
                    {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>}
                  </div>
                </div>
              </>
            )}

            {step === "envio" && (
              <>
                <h2 className="font-semibold text-lg text-dark">Método de envío</h2>
                {loadingShipping ? (
                  <div className="flex items-center gap-2 py-8 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Cargando métodos de envío...</span>
                  </div>
                ) : shippingMethods.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-4">No hay métodos de envío disponibles.</p>
                ) : (
                  <div className="space-y-3">
                    {shippingMethods.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                          selectedShippingId === method.id
                            ? "border-dark bg-cream-dark"
                            : "border-border hover:border-dark"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping"
                            value={method.id}
                            checked={selectedShippingId === method.id}
                            onChange={() => setSelectedShippingId(method.id)}
                            className="accent-dark"
                          />
                          <div>
                            <p className="font-medium text-dark text-sm flex items-center gap-2">
                              <Truck className="w-4 h-4" />
                              {method.name}
                            </p>
                            {method.description && (
                              <p className="text-xs text-muted-foreground">{method.description}</p>
                            )}
                            {method.estimatedDays && (
                              <p className="text-xs text-muted-foreground">
                                {method.estimatedDays} {method.estimatedDays === 1 ? "día hábil" : "días hábiles"}
                              </p>
                            )}
                          </div>
                        </div>
                        <span className="font-semibold text-sm text-dark">
                          {method.price === 0 ? "Gratis" : formatMXN(method.price)}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                {/* Coupon */}
                <div className="pt-4">
                  <h2 className="font-semibold text-base text-dark mb-3">Cupón de descuento</h2>
                  {couponResult ? (
                    <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-xl">
                      <Tag className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-700">
                        {couponResult.code} aplicado — -{formatMXN(couponResult.discountAmount)}
                      </span>
                      <button
                        type="button"
                        onClick={() => { setCouponResult(null); setCouponCode(""); }}
                        className="ml-auto text-xs text-muted-foreground hover:text-destructive"
                      >
                        Quitar
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Código de cupón"
                        value={couponCode}
                        onChange={(e) => { setCouponCode(e.target.value); setCouponError(""); }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleValidateCoupon}
                        disabled={validatingCoupon || !couponCode.trim()}
                        className="shrink-0"
                      >
                        {validatingCoupon ? <Loader2 className="w-4 h-4 animate-spin" /> : "Aplicar"}
                      </Button>
                    </div>
                  )}
                  {couponError && <p className="text-xs text-destructive mt-1">{couponError}</p>}
                </div>
              </>
            )}

            {step === "pago" && (
              <>
                <h2 className="font-semibold text-lg text-dark">Pago seguro</h2>
                <div>
                  <Label htmlFor="cardNumber">Número de tarjeta</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" className="mt-1.5" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Vencimiento</Label>
                    <Input placeholder="MM/AA" className="mt-1.5" />
                  </div>
                  <div>
                    <Label>CVV</Label>
                    <Input placeholder="123" className="mt-1.5" />
                  </div>
                </div>
                <div>
                  <Label>Nombre en la tarjeta</Label>
                  <Input placeholder="MARÍA GARCÍA" className="mt-1.5" />
                </div>
              </>
            )}

            <div className="flex items-center gap-3 pt-2">
              {step !== "informacion" && (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full h-11 px-6"
                  onClick={() => {
                    const idx = currentStepIndex;
                    if (idx > 0) setStep(STEPS[idx - 1].id);
                  }}
                >
                  Atrás
                </Button>
              )}
              {step === "pago" ? (
                <Button
                  type="button"
                  onClick={handlePaymentSubmit}
                  disabled={submitting}
                  className="flex-1 bg-dark hover:bg-dark/90 text-white rounded-full h-11 font-semibold"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Procesando...
                    </>
                  ) : (
                    "Confirmar Pedido 🎉"
                  )}
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="flex-1 bg-dark hover:bg-dark/90 text-white rounded-full h-11 font-semibold"
                >
                  Continuar
                </Button>
              )}
            </div>
          </form>
        </div>

        {/* Order summary */}
        <div
          className="bg-white rounded-2xl p-6 h-fit sticky top-24"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <h2 className="font-semibold text-lg text-dark mb-5">Tu pedido</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-muted-foreground line-clamp-1 flex-1">
                  {item.product.name} × {item.quantity}
                  {item.variantColor && (
                    <span className="ml-1 text-xs" style={{ color: item.variantColor.hex }}>
                      ({item.variantColor.label})
                    </span>
                  )}
                </span>
                <span className="font-medium ml-2">
                  {formatMXN(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <Separator className="my-3" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span>{formatMXN(subtotal)}</span>
            </div>
            {selectedShipping && (
              <div className="flex justify-between text-muted-foreground">
                <span>Envío ({selectedShipping.name})</span>
                <span>{shippingCost === 0 ? "Gratis" : formatMXN(shippingCost)}</span>
              </div>
            )}
            {couponResult && (
              <div className="flex justify-between text-green-600">
                <span>Descuento ({couponResult.code})</span>
                <span>-{formatMXN(discount)}</span>
              </div>
            )}
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>{formatMXN(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
