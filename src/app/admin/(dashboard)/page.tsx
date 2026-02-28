import { Package, DollarSign, ShoppingCart, Users } from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { getAdminStats } from "@/lib/mock-db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_STYLES: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-700",
  CONFIRMADO: "bg-blue-100 text-blue-700",
  ENVIADO: "bg-indigo-100 text-indigo-700",
  ENTREGADO: "bg-green-100 text-green-700",
  CANCELADO: "bg-red-100 text-red-700",
  COMPLETADO: "bg-green-100 text-green-700",
};

const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
  COMPLETADO: "Completado",
};

export default function AdminDashboardPage() {
  const { productCount, orderCount: totalOrders, userCount, totalRevenue, recentOrders } = getAdminStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Resumen general de FiestaMania
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Productos"
          value={String(productCount)}
          icon={Package}
          trend={{ value: "+3 este mes", positive: true }}
        />
        <StatsCard
          title="Ingresos"
          value={`$${totalRevenue.toLocaleString("es-MX", {
            minimumFractionDigits: 2,
          })}`}
          icon={DollarSign}
          trend={{ value: "+12.5%", positive: true }}
        />
        <StatsCard
          title="Pedidos"
          value={String(totalOrders ?? 0)}
          icon={ShoppingCart}
          trend={{ value: "+2 hoy", positive: true }}
        />
        <StatsCard
          title="Usuarios"
          value={String(userCount)}
          icon={Users}
          trend={{ value: "+1 esta semana", positive: true }}
        />
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Últimos pedidos</h2>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs text-gray-500">
                  #{order.orderNumber}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {order.user?.name ?? order.guestName ?? "Invitado"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {order.user?.email ?? order.guestEmail ?? "—"}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="font-medium">
                  $
                  {order.total.toLocaleString("es-MX", {
                    minimumFractionDigits: 2,
                  })}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-500">
                  {order.createdAt.toLocaleDateString("es-MX")}
                </TableCell>
              </TableRow>
            ))}
            {recentOrders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-sm text-gray-400 py-8"
                >
                  No hay pedidos aún
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
