import { getSession } from "@/lib/auth";
import { getOrders } from "@/lib/mock-db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, Truck, CheckCircle2, Clock } from "lucide-react";

function formatMXN(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
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

// Compact progress bar for each order
const STATUS_STEPS = ["PENDIENTE", "CONFIRMADO", "ENVIADO", "ENTREGADO"];
const STATUS_ICONS: Record<string, React.ElementType> = {
  PENDIENTE: Clock,
  CONFIRMADO: CheckCircle2,
  ENVIADO: Truck,
  ENTREGADO: Package,
};

function OrderProgress({ status }: { status: string }) {
  if (status === "CANCELADO") return null;
  const currentIdx = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-1 mt-3">
      {STATUS_STEPS.map((step, i) => {
        const done = i <= currentIdx;
        const Icon = STATUS_ICONS[step];
        return (
          <div key={step} className="flex items-center gap-1 flex-1 last:flex-none">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors"
              style={{ backgroundColor: done ? "var(--pink-accent)" : "var(--cream-dark)" }}
            >
              <Icon className="w-3 h-3" style={{ color: done ? "white" : "var(--mid)" }} />
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div
                className="h-0.5 flex-1 rounded-full transition-colors"
                style={{ backgroundColor: i < currentIdx ? "var(--pink-accent)" : "var(--cream-dark)" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default async function PedidosPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  void session;
  const orders = getOrders().map((o) => ({
    id: o.id,
    orderNumber: o.id,
    status: o.status.toUpperCase(),
    total: o.total,
    createdAt: new Date(o.createdAt),
    items: [] as { id: string; name: string; quantity: number; price: number; imageUrl: string | null }[],
    shippingMethod: null as { name: string } | null,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-dark font-display">Mis Pedidos</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {orders.length} pedido{orders.length !== 1 ? "s" : ""} en total
        </p>
      </div>

      {orders.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-10 text-center"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-dark mb-1">Aún no tienes pedidos</p>
          <p className="text-sm text-muted-foreground mb-4">
            ¡Empieza a planear tu próxima fiesta!
          </p>
          <Link
            href="/products"
            className="inline-flex items-center px-5 py-2.5 rounded-full text-sm font-semibold text-white"
            style={{ backgroundColor: "var(--dark)" }}
          >
            Ver productos
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl p-5"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              {/* Header row */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-dark">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString("es-MX", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                    {order.shippingMethod && ` · ${order.shippingMethod.name}`}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-600"}`}
                >
                  {STATUS_LABEL[order.status] ?? order.status}
                </span>
              </div>

              {/* Items summary + total */}
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {order.items.map((i) => `${i.name} ×${i.quantity}`).join(", ")}
                  {order.items.length === 3 && "…"}
                </p>
                <p className="font-bold text-dark shrink-0 ml-2">{formatMXN(order.total)}</p>
              </div>

              {/* Progress bar */}
              <OrderProgress status={order.status} />

              {/* CTAs */}
              <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border">
                <Link
                  href={`/cuenta/pedidos/${order.id}`}
                  className="flex items-center gap-1.5 text-sm font-medium hover:underline"
                  style={{ color: "var(--pink-accent)" }}
                >
                  <Truck className="w-3.5 h-3.5" />
                  Rastrear pedido
                </Link>
                <Link
                  href={`/cuenta/pedidos/${order.id}`}
                  className="text-sm text-muted-foreground hover:text-dark transition-colors"
                >
                  Ver detalle →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
