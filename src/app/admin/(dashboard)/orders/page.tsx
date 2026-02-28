import Link from "next/link";
import { Plus } from "lucide-react";
import { getOrders } from "@/lib/mock-db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface SearchParams {
  status?: string;
  search?: string;
  page?: string;
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDIENTE:  { label: "Pendiente",  className: "bg-yellow-100 text-yellow-700" },
  CONFIRMADO: { label: "Confirmado", className: "bg-blue-100 text-blue-700" },
  ENVIADO:    { label: "Enviado",    className: "bg-purple-100 text-purple-700" },
  ENTREGADO:  { label: "Entregado",  className: "bg-green-100 text-green-700" },
  CANCELADO:  { label: "Cancelado",  className: "bg-red-100 text-red-700" },
};

const PAYMENT_LABELS: Record<string, { label: string; className: string }> = {
  PENDIENTE:   { label: "Pendiente",   className: "bg-yellow-100 text-yellow-700" },
  PAGADO:      { label: "Pagado",      className: "bg-green-100 text-green-700" },
  FALLIDO:     { label: "Fallido",     className: "bg-red-100 text-red-700" },
  REEMBOLSADO: { label: "Reembolsado", className: "bg-gray-100 text-gray-700" },
};

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));
  const limit = 20;

  let allOrders = getOrders();
  if (params.status && params.status !== "all") {
    allOrders = allOrders.filter((o) => o.status === params.status!.toLowerCase());
  }
  if (params.search) {
    const q = params.search.toLowerCase();
    allOrders = allOrders.filter(
      (o) => o.id.toLowerCase().includes(q) || o.email.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q)
    );
  }
  const total = allOrders.length;
  const totalPages = Math.ceil(total / limit);
  const orders = allOrders.slice((page - 1) * limit, page * limit).map((o) => ({
    id: o.id,
    orderNumber: o.id,
    user: null as { name: string; email: string } | null,
    guestName: o.customer,
    guestEmail: o.email,
    total: o.total,
    status: o.status.toUpperCase(),
    paymentStatus: "PAGADO",
    createdAt: new Date(o.createdAt),
    shippingMethod: null as { name: string } | null,
    _count: { items: 2 },
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Órdenes</h1>
          <p className="text-sm text-gray-500 mt-1">{total} órdenes en total</p>
        </div>
        <Link
          href="/admin/orders/nuevo"
          className="inline-flex items-center gap-2 bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo pedido
        </Link>
      </div>

      {/* Filters */}
      <form method="GET" className="flex items-center gap-3 flex-wrap">
        <input
          name="search"
          defaultValue={params.search}
          placeholder="Buscar por número o email..."
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-pink-500"
        />
        <select
          name="status"
          defaultValue={params.status ?? "all"}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          <option value="all">Todos los estados</option>
          <option value="PENDIENTE">Pendiente</option>
          <option value="CONFIRMADO">Confirmado</option>
          <option value="ENVIADO">Enviado</option>
          <option value="ENTREGADO">Entregado</option>
          <option value="CANCELADO">Cancelado</option>
        </select>
        <button
          type="submit"
          className="bg-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors"
        >
          Filtrar
        </button>
        {(params.search || params.status) && (
          <Link
            href="/admin/orders"
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Limpiar
          </Link>
        )}
      </form>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Artículos</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const statusInfo = STATUS_LABELS[order.status] ?? { label: order.status, className: "bg-gray-100 text-gray-700" };
              const paymentInfo = PAYMENT_LABELS[order.paymentStatus] ?? { label: order.paymentStatus, className: "bg-gray-100 text-gray-700" };
              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm font-semibold">
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {order.user?.name ?? order.guestName ?? "Sin nombre"}
                      </p>
                      <p className="text-xs text-gray-400">
                        {order.user?.email ?? order.guestEmail}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">
                    {order._count.items} art.
                  </TableCell>
                  <TableCell className="font-semibold text-sm">
                    ${order.total.toLocaleString("es-MX", { minimumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusInfo.className}`}>
                      {statusInfo.label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${paymentInfo.className}`}>
                      {paymentInfo.label}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {order.createdAt.toLocaleDateString("es-MX")}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-pink-600 hover:text-pink-800 font-medium"
                    >
                      Ver
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-gray-400 py-10">
                  No se encontraron órdenes
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-gray-500">
            Página {page} de {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <Link
                href={`/admin/orders?page=${page - 1}${params.status ? `&status=${params.status}` : ""}${params.search ? `&search=${params.search}` : ""}`}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                Anterior
              </Link>
            )}
            {page < totalPages && (
              <Link
                href={`/admin/orders?page=${page + 1}${params.status ? `&status=${params.status}` : ""}${params.search ? `&search=${params.search}` : ""}`}
                className="px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700"
              >
                Siguiente
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
