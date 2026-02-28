import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DEMO_USERS } from "@/lib/mock-db";
import { OrderForm } from "@/components/admin/OrderForm";

const DEMO_SHIPPING_METHODS = [
  { id: "sm-001", name: "Envío Estándar", price: 99, description: "3-5 días hábiles" },
  { id: "sm-002", name: "Envío Express", price: 199, description: "1-2 días hábiles" },
  { id: "sm-003", name: "Recolección en tienda", price: 0, description: "Gratis, mismo día" },
];

export default function NuevoPedidoPage() {
  const users = DEMO_USERS.map((u) => ({ id: u.id, name: u.name, email: u.email }));
  const shippingMethods = DEMO_SHIPPING_METHODS;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/orders" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nuevo pedido</h1>
          <p className="text-sm text-gray-500 mt-0.5">Crea un pedido manual desde el panel de administración</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <OrderForm users={users} shippingMethods={shippingMethods} />
      </div>
    </div>
  );
}
