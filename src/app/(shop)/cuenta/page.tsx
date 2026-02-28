import { getSession } from "@/lib/auth";
import { getUserById, getOrders } from "@/lib/mock-db";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package, User, ShoppingBag } from "lucide-react";

function formatMXN(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(n);
}

export default async function CuentaPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const dbUser = getUserById(session.userId);
  const user = {
    name: dbUser?.name ?? "Demo Usuario",
    email: dbUser?.email ?? "demo@fiestamania.com",
    createdAt: dbUser?.createdAt ?? new Date("2026-01-01"),
    _count: { orders: dbUser?._count.orders ?? 0 },
  };

  const allOrders = getOrders();
  const recentOrders = allOrders.slice(0, 5).map((o) => ({
    id: o.id,
    orderNumber: o.id,
    status: o.status.toUpperCase(),
    total: o.total,
    createdAt: new Date(o.createdAt),
    _count: { items: 2 },
  }));

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

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div
        className="rounded-2xl p-6 text-white"
        style={{ background: "linear-gradient(135deg, var(--dark) 0%, #333 100%)" }}
      >
        <p className="text-white/60 text-sm mb-1">¡Hola de nuevo!</p>
        <h1 className="font-display text-2xl font-bold">
          {user.name ?? user.email} 🎉
        </h1>
        <p className="text-white/70 text-sm mt-1">
          Miembro desde{" "}
          {new Date(user.createdAt).toLocaleDateString("es-MX", {
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-4">
        <div
          className="bg-white rounded-2xl p-4 flex items-center gap-3"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" style={{ color: "var(--pink-accent)" }} />
          </div>
          <div>
            <p className="text-2xl font-bold text-dark">{user._count.orders}</p>
            <p className="text-xs text-muted-foreground">Pedidos totales</p>
          </div>
        </div>
        <Link
          href="/cuenta/perfil"
          className="bg-white rounded-2xl p-4 flex items-center gap-3 card-hover"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
            <User className="w-5 h-5" style={{ color: "var(--teal-accent)" }} />
          </div>
          <div>
            <p className="font-semibold text-dark text-sm">Mi Perfil</p>
            <p className="text-xs text-muted-foreground">Editar datos</p>
          </div>
        </Link>
      </div>

      {/* Recent orders */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-dark flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" /> Pedidos recientes
          </h2>
          <Link
            href="/cuenta/pedidos"
            className="text-xs font-medium hover:underline"
            style={{ color: "var(--pink-accent)" }}
          >
            Ver todos
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="px-5 py-10 text-center text-muted-foreground text-sm">
            Aún no has hecho ningún pedido.{" "}
            <Link href="/products" className="underline text-dark">
              ¡Empieza a comprar!
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/cuenta/pedidos/${order.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-cream-dark/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-dark text-sm">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {order._count.items} artículo{order._count.items !== 1 ? "s" : ""} ·{" "}
                    {new Date(order.createdAt).toLocaleDateString("es-MX")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLOR[order.status] ?? "bg-gray-100 text-gray-700"}`}
                  >
                    {STATUS_LABEL[order.status] ?? order.status}
                  </span>
                  <span className="font-semibold text-dark text-sm">
                    {formatMXN(order.total)}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
