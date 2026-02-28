"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Variant {
  id: string;
  color: string;
  colorName: string;
  stock: number;
  sku: string | null;
}

interface Props {
  productId: string;
  initialVariants: Variant[];
}

export function VariantManager({ productId, initialVariants }: Props) {
  const [variants, setVariants] = useState<Variant[]>(initialVariants);
  const [adding, setAdding] = useState(false);
  const [newColor, setNewColor] = useState("#FF0000");
  const [newColorName, setNewColorName] = useState("");
  const [newStock, setNewStock] = useState(0);
  const [newSku, setNewSku] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleAdd() {
    if (!newColorName.trim()) {
      toast.error("El nombre del color es requerido");
      return;
    }
    if (!/^#[0-9A-Fa-f]{6}$/.test(newColor)) {
      toast.error("Color hex inválido (ej: #FF0000)");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/variants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          color: newColor,
          colorName: newColorName.trim(),
          stock: newStock,
          sku: newSku.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Error al agregar variante");
        return;
      }
      setVariants((prev) => [...prev, json.data]);
      setNewColor("#FF0000");
      setNewColorName("");
      setNewStock(0);
      setNewSku("");
      setAdding(false);
      toast.success("Variante agregada");
    } catch {
      toast.error("Error de conexión");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdateStock(variant: Variant, stock: number) {
    setUpdatingId(variant.id);
    try {
      const res = await fetch(`/api/admin/products/${productId}/variants/${variant.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Error al actualizar stock");
        return;
      }
      setVariants((prev) => prev.map((v) => (v.id === variant.id ? { ...v, stock } : v)));
      toast.success("Stock actualizado");
    } catch {
      toast.error("Error de conexión");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(variantId: string) {
    if (!confirm("¿Eliminar esta variante?")) return;
    setDeletingId(variantId);
    try {
      const res = await fetch(`/api/admin/products/${productId}/variants/${variantId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const json = await res.json();
        toast.error(json.error ?? "Error al eliminar");
        return;
      }
      setVariants((prev) => prev.filter((v) => v.id !== variantId));
      toast.success("Variante eliminada");
    } catch {
      toast.error("Error de conexión");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 text-sm">Variantes de color</h3>
        {!adding && (
          <Button
            type="button"
            size="sm"
            onClick={() => setAdding(true)}
            className="bg-pink-500 hover:bg-pink-600 text-white text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Agregar color
          </Button>
        )}
      </div>

      {/* Existing variants */}
      {variants.length > 0 ? (
        <div className="space-y-2">
          {variants.map((v) => (
            <div key={v.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div
                className="w-8 h-8 rounded-full border border-gray-200 shrink-0"
                style={{ backgroundColor: v.color }}
                title={v.color}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{v.colorName}</p>
                <p className="text-xs text-gray-400 font-mono">{v.color}</p>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-gray-500 shrink-0">Stock:</Label>
                <Input
                  type="number"
                  min={0}
                  defaultValue={v.stock}
                  className="w-20 h-8 text-sm"
                  onBlur={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val !== v.stock) {
                      handleUpdateStock(v, val);
                    }
                  }}
                />
                {updatingId === v.id && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(v.id)}
                disabled={deletingId === v.id}
                className="text-red-500 hover:text-red-700 disabled:opacity-50"
              >
                {deletingId === v.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400 italic">Sin variantes de color</p>
      )}

      {/* Add new variant form */}
      {adding && (
        <div className="border border-gray-200 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-gray-700">Nueva variante</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Color (hex) *</Label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-9 h-9 rounded cursor-pointer border border-gray-200"
                />
                <Input
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  placeholder="#FF0000"
                  className="font-mono text-sm"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Nombre del color *</Label>
              <Input
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
                placeholder="Rojo"
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">Stock inicial</Label>
              <Input
                type="number"
                min={0}
                value={newStock}
                onChange={(e) => setNewStock(parseInt(e.target.value, 10) || 0)}
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <Label className="text-xs">SKU (opcional)</Label>
              <Input
                value={newSku}
                onChange={(e) => setNewSku(e.target.value)}
                placeholder="PROD-001-ROJO"
                className="mt-1 text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleAdd}
              disabled={saving}
              className="bg-pink-500 hover:bg-pink-600 text-white"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Agregar"}
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => setAdding(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
