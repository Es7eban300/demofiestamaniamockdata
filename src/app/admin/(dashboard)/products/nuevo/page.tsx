import { getCategories, getOccasions } from "@/lib/mock-db";
import { ProductForm } from "@/components/admin/ProductForm";

export default function NuevoProductoPage() {
  const categories = getCategories();
  const occasions = getOccasions();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Nuevo Producto</h1>
        <p className="text-sm text-gray-500 mt-1">
          Completa la información del producto
        </p>
      </div>
      <ProductForm categories={categories} occasions={occasions} />
    </div>
  );
}
