"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";

interface Props {
  categoryId: string;
  categoryName: string;
  productCount: number;
}

export function DeleteCategoryButton({ categoryId, categoryName, productCount }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  if (productCount > 0) {
    return (
      <span className="text-xs text-gray-300 cursor-not-allowed" title={`Tiene ${productCount} producto(s) asociados`}>
        <Trash2 className="w-3.5 h-3.5" />
      </span>
    );
  }

  async function handleDelete() {
    if (!confirm(`¿Eliminar la categoría "${categoryName}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/categories/${categoryId}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Error al eliminar");
        return;
      }
      toast.success("Categoría eliminada");
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
