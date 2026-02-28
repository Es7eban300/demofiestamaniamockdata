import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { DEMO_USERS } from "@/lib/mock-db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function UsersPage() {
  const users = DEMO_USERS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">
            {users.length} usuarios registrados
          </p>
        </div>
        <Link
          href="/admin/users/nuevo"
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo usuario
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Pedidos</TableHead>
              <TableHead>Total Gastado</TableHead>
              <TableHead>Registro</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => {
              const totalSpent = user.orders.reduce(
                (acc, o) => acc + o.total,
                0
              );
              return (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {user.name ?? "Sin nombre"}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.role === "ADMIN" ? "Admin" : "Cliente"}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700">
                    {user._count.orders}
                  </TableCell>
                  <TableCell className="font-medium text-sm">
                    {totalSpent > 0
                      ? `$${totalSpent.toLocaleString("es-MX", {
                          minimumFractionDigits: 2,
                        })}`
                      : "—"}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">
                    {user.createdAt.toLocaleDateString("es-MX")}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/admin/users/${user.id}/editar`}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
            {users.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-sm text-gray-400 py-8"
                >
                  No hay usuarios registrados aún
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
