"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface Props {
  occasionId: string;
  occasionName: string;
}

export function DeleteOccasionButton({ occasionId, occasionName }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`¿Eliminar la ocasión "${occasionName}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/occasions/${occasionId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Error al eliminar");
        return;
      }
      toast.success("Ocasión eliminada");
      router.refresh();
    } catch {
      toast.error("Error de conexión");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium disabled:opacity-50"
    >
      <Trash2 className="w-3.5 h-3.5" />
      {deleting ? "..." : "Eliminar"}
    </button>
  );
}
