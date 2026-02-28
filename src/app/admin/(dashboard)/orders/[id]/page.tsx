import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getOrderById } from "@/lib/mock-db";
import { OrderStatusUpdater } from "@/components/admin/OrderStatusUpdater";

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDIENTE:  { label: "Pendiente",  className: "bg-yellow-100 text-yellow-700" },
  CONFIRMADO: { label: "Confirmado", className: "bg-blue-100 text-blue-700" },
  ENVIADO:    { label: "Enviado",    className: "bg-purple-100 text-purple-700" },
  ENTREGADO:  { label: "Entregado",  className: "bg-green-100 text-green-700" },
  CANCELADO:  { label: "Cancelado",  className: "bg-red-100 text-red-700" },
  COMPLETADO: { label: "Completado", className: "bg-green-100 text-green-700" },
};

const PAYMENT_LABELS: Record<string, { label: string; className: string }> = {
  PENDIENTE:   { label: "Pendiente",   className: "bg-yellow-100 text-yellow-700" },
  PAGADO:      { label: "Pagado",      className: "bg-green-100 text-green-700" },
  FALLIDO:     { label: "Fallido",     className: "bg-red-100 text-red-700" },
  REEMBOLSADO: { label: "Reembolsado", className: "bg-gray-100 text-gray-700" },
};

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;

  const raw = getOrderById(id);
  if (!raw) notFound();

  type OrderStatus = "PENDIENTE" | "CONFIRMADO" | "ENVIADO" | "ENTREGADO" | "CANCELADO";
  type PaymentStatus = "PENDIENTE" | "PAGADO" | "FALLIDO" | "REEMBOLSADO";

  const STATUS_MAP: Record<string, OrderStatus> = {
    PENDIENTE: "PENDIENTE", CONFIRMADO: "CONFIRMADO", ENVIADO: "ENVIADO",
    ENTREGADO: "ENTREGADO", CANCELADO: "CANCELADO", COMPLETADO: "ENTREGADO",
  };

  // Adapt the mock order to the shape the template expects
  const order = {
    id: raw.id,
    orderNumber: raw.id,
    status: (STATUS_MAP[raw.status.toUpperCase()] ?? "PENDIENTE") as OrderStatus,
    paymentStatus: "PAGADO" as PaymentStatus,
    createdAt: new Date(raw.createdAt),
    items: [] as Array<{ id: string; imageUrl: string | null; name: string; price: number; quantity: number }>,
    subtotal: raw.total,
    shippingMethod: null as { name: string } | null,
    shippingCost: 0,
    coupon: null as { code: string } | null,
    discountAmount: 0,
    total: raw.total,
    shippingName: raw.customer,
    shippingAddress: raw.shippingAddress,
    shippingCity: "México",
    shippingState: "CDMX",
    shippingZipCode: "00000",
    shippingPhone: null as string | null,
    notes: null as string | null,
    user: null as { id: string; name: string; email: string } | null,
    guestName: raw.customer,
    guestEmail: raw.email,
    guestPhone: null as string | null,
    paymentMethod: "Tarjeta de crédito",
    paymentRef: null as string | null,
  };

  const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, className: "bg-gray-100 text-gray-700" };
  const paymentInfo = PAYMENT_LABELS[order.paymentStatus] ?? { label: order.paymentStatus, className: "bg-gray-100 text-gray-700" };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-mono">{order.orderNumber}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {order.createdAt.toLocaleDateString("es-MX", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${statusInfo.className}`}>
            {statusInfo.label}
          </span>
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${paymentInfo.className}`}>
            {paymentInfo.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: items + summary */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Artículos ({order.items.length})</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  {item.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100 shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">
                      ${item.price.toLocaleString("es-MX", { minimumFractionDigits: 2 })} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-sm text-gray-900 shrink-0">
                    ${(item.price * item.quantity).toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
              {order.items.length === 0 && (
                <div className="px-5 py-8 text-center text-sm text-gray-400">
                  Los artículos del pedido no están disponibles en modo demo.
                </div>
              )}
            </div>
            {/* Totals */}
            <div className="px-5 py-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span>${order.subtotal.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
              </div>
              {order.shippingMethod && (
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Envío ({order.shippingMethod.name})</span>
                  <span>
                    {order.shippingCost === 0
                      ? "Gratis"
                      : `$${order.shippingCost.toLocaleString("es-MX", { minimumFractionDigits: 2 })}`}
                  </span>
                </div>
              )}
              {order.coupon && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Cupón ({order.coupon.code})</span>
                  <span>-${order.discountAmount.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100">
                <span>Total</span>
                <span>${order.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Shipping address */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="font-semibold text-gray-900 mb-3">Dirección de entrega</h2>
            <address className="not-italic text-sm text-gray-600 space-y-0.5">
              <p className="font-medium text-gray-900">{order.shippingName}</p>
              <p>{order.shippingAddress}</p>
              <p>{order.shippingCity}, {order.shippingState} {order.shippingZipCode}</p>
              {order.shippingPhone && <p>{order.shippingPhone}</p>}
            </address>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="font-semibold text-gray-900 mb-2">Notas</h2>
              <p className="text-sm text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Status updater */}
          <OrderStatusUpdater
            orderId={order.id}
            currentStatus={order.status}
            currentPaymentStatus={order.paymentStatus}
          />

          {/* Customer info */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Cliente</h3>
            {order.user ? (
              <div className="text-sm space-y-1">
                <p className="font-medium text-gray-900">{order.user.name}</p>
                <p className="text-gray-500">{order.user.email}</p>
                <Link
                  href={`/admin/users/${order.user.id}/editar`}
                  className="text-xs text-pink-600 hover:text-pink-800 font-medium"
                >
                  Ver usuario →
                </Link>
              </div>
            ) : (
              <div className="text-sm space-y-1">
                <p className="font-medium text-gray-900">{order.guestName ?? "Invitado"}</p>
                <p className="text-gray-500">{order.guestEmail}</p>
                {order.guestPhone && <p className="text-gray-500">{order.guestPhone}</p>}
                <span className="text-xs text-gray-400">Sin cuenta registrada</span>
              </div>
            )}
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="font-semibold text-gray-900 mb-3">Pago</h3>
            <p className="text-sm text-gray-600 capitalize">{order.paymentMethod ?? "No especificado"}</p>
            {order.paymentRef && (
              <p className="text-xs text-gray-400 mt-1 font-mono">{order.paymentRef}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
