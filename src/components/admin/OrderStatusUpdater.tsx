"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type OrderStatus = "PENDIENTE" | "CONFIRMADO" | "ENVIADO" | "ENTREGADO" | "CANCELADO";
type PaymentStatus = "PENDIENTE" | "PAGADO" | "FALLIDO" | "REEMBOLSADO";

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
  currentPaymentStatus: PaymentStatus;
}

const ORDER_STATUSES: { value: OrderStatus; label: string }[] = [
  { value: "PENDIENTE",  label: "Pendiente" },
  { value: "CONFIRMADO", label: "Confirmado" },
  { value: "ENVIADO",    label: "Enviado" },
  { value: "ENTREGADO",  label: "Entregado" },
  { value: "CANCELADO",  label: "Cancelado" },
];

const PAYMENT_STATUSES: { value: PaymentStatus; label: string }[] = [
  { value: "PENDIENTE",   label: "Pendiente" },
  { value: "PAGADO",      label: "Pagado" },
  { value: "FALLIDO",     label: "Fallido" },
  { value: "REEMBOLSADO", label: "Reembolsado" },
];

export function OrderStatusUpdater({ orderId, currentStatus, currentPaymentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus>(currentStatus);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(currentPaymentStatus);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, paymentStatus }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Error al actualizar la orden");
        return;
      }
      toast.success("Orden actualizada correctamente");
      router.refresh();
    } catch {
      toast.error("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <h3 className="font-semibold text-gray-900">Actualizar estado</h3>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Estado de orden</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1.5">Estado de pago</label>
        <select
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
      </div>
      <button
        onClick={handleSave}
        disabled={saving || (status === currentStatus && paymentStatus === currentPaymentStatus)}
        className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        Guardar cambios
      </button>
    </div>
  );
}
