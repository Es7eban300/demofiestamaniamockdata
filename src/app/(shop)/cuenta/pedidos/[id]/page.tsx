import { getSession } from "@/lib/auth";
import { getOrderById } from "@/lib/mock-db";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, CheckCircle2, Truck, Clock, Circle, XCircle } from "lucide-react";

function formatMXN(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(n);
}

const STATUS_LABEL: Record<string, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};
const STATUS_COLOR: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  CONFIRMADO: "bg-blue-100 text-blue-700",
  ENVIADO: "bg-indigo-100 text-indigo-700",
  ENTREGADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-red-100 text-red-700",
};

const STATUS_STEPS = [
  { key: "PENDIENTE", label: "Pedido recibido", desc: "Tu pedido fue recibido y está siendo procesado", icon: Clock },
  { key: "CONFIRMADO", label: "Pago confirmado", desc: "El pago fue verificado exitosamente", icon: CheckCircle2 },
  { key: "ENVIADO", label: "En camino", desc: "Tu pedido está en camino hacia ti", icon: Truck },
  { key: "ENTREGADO", label: "Entregado", desc: "Tu pedido fue entregado satisfactoriamente", icon: Package },
];

const STATUS_ORDER: Record<string, number> = {
  PENDIENTE: 0,
  CONFIRMADO: 1,
  ENVIADO: 2,
  ENTREGADO: 3,
  CANCELADO: -1,
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PedidoDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/login");

  void session;
  const raw = getOrderById(id);
  if (!raw) notFound();

  const order = {
    id: raw.id,
    orderNumber: raw.id,
    status: raw.status.toUpperCase(),
    total: raw.total,
    subtotal: raw.total,
    discountAmount: 0,
    shippingCost: 0,
    shippingName: raw.customer,
    shippingAddress: raw.shippingAddress,
    shippingCity: "CDMX",
    shippingState: "Ciudad de México",
    shippingZipCode: "06600",
    shippingPhone: null as string | null,
    createdAt: new Date(raw.createdAt),
    items: [] as { id: string; name: string; price: number; quantity: number; imageUrl: string | null }[],
    shippingMethod: null as { name: string } | null,
    coupon: null as { code: string; type: string; value: number } | null,
  };

  const currentStep = STATUS_ORDER[order.status] ?? 0;
  const isCancelled = order.status === "CANCELADO";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/cuenta/pedidos" className="text-muted-foreground hover:text-dark transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-dark font-display">{order.orderNumber}</h1>
          <p className="text-xs text-muted-foreground">
            {new Date(order.createdAt).toLocaleDateString("es-MX", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`ml-auto inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[order.status] ?? "bg-gray-100"}`}
        >
          {STATUS_LABEL[order.status] ?? order.status}
        </span>
      </div>

      {/* Tracking timeline */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
        <h2 className="font-semibold text-dark mb-5 text-sm flex items-center gap-2">
          <Truck className="w-4 h-4 text-muted-foreground" />
          Estado del envío
        </h2>

        {isCancelled ? (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 shrink-0">
              <XCircle className="w-4 h-4 text-red-500" />
            </div>
            <div className="pt-1">
              <p className="text-sm font-medium text-dark">Pedido cancelado</p>
              <p className="text-xs text-muted-foreground mt-0.5">Este pedido fue cancelado. Si tienes dudas, contáctanos.</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div
              className="absolute left-4 top-4 bottom-4 w-0.5"
              style={{ backgroundColor: "var(--border)" }}
            />
            <div className="space-y-5">
              {STATUS_STEPS.map((step, i) => {
                const isCompleted = i <= currentStep;
                const isCurrent = i === currentStep;
                return (
                  <div key={step.key} className="flex items-start gap-3 relative">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 relative z-10 transition-colors"
                      style={{ backgroundColor: isCompleted ? "var(--pink-accent)" : "var(--cream-dark)" }}
                    >
                      {isCompleted
                        ? <step.icon className="w-4 h-4 text-white" />
                        : <Circle className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div className="pt-1">
                      <p className={`text-sm font-medium ${isCompleted ? "text-dark" : "text-muted-foreground"}`}>
                        {step.label}
                        {isCurrent && (
                          <span
                            className="ml-2 text-xs font-normal rounded-full px-2 py-0.5"
                            style={{ backgroundColor: "var(--pink-accent)", color: "white" }}
                          >
                            Actual
                          </span>
                        )}
                      </p>
                      {isCompleted && (
                        <p className="text-xs text-muted-foreground mt-0.5">{step.desc}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: "var(--shadow-card)" }}>
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-dark text-sm">Artículos</h2>
        </div>
        <div className="divide-y divide-border">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-5 py-4">
              {item.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover bg-cream-dark shrink-0"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-dark text-sm line-clamp-1">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatMXN(item.price)} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-dark text-sm shrink-0">
                {formatMXN(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Summary + Shipping */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Totals */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-semibold text-dark mb-4 text-sm">Resumen</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatMXN(order.subtotal)}</span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Descuento {order.coupon ? `(${order.coupon.code})` : ""}</span>
                <span>-{formatMXN(order.discountAmount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Envío</span>
              <span>{order.shippingCost === 0 ? "Gratis" : formatMXN(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
              <span>Total</span>
              <span>{formatMXN(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: "var(--shadow-card)" }}>
          <h2 className="font-semibold text-dark mb-4 text-sm">Dirección de entrega</h2>
          <div className="text-sm text-muted-foreground space-y-0.5">
            <p className="font-medium text-dark">{order.shippingName}</p>
            <p>{order.shippingAddress}</p>
            <p>{order.shippingCity}, {order.shippingState} {order.shippingZipCode}</p>
            {order.shippingPhone && <p>{order.shippingPhone}</p>}
            {order.shippingMethod && (
              <p className="mt-2 pt-2 border-t border-border">
                <span className="font-medium text-dark">Método:</span>{" "}
                {order.shippingMethod.name}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
