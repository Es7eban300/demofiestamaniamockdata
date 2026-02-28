import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { getCategories } from "@/lib/mock-db";
import { DeleteCategoryButton } from "@/components/admin/DeleteCategoryButton";

export default function CategoriesPage() {
  const categories = getCategories().map((c) => ({ ...c, _count: { products: c.productCount } }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categorías</h1>
          <p className="text-sm text-gray-500 mt-1">{categories.length} categorías</p>
        </div>
        <Link
          href="/admin/categories/nuevo"
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nueva categoría
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Productos</th>
              <th className="px-5 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    {cat.color && (
                      <div className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                    )}
                    <span className="text-sm font-medium text-gray-900">{cat.name}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-mono text-gray-500">{cat.slug}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm font-mono text-gray-400">{cat.color ?? "—"}</span>
                </td>
                <td className="px-5 py-4">
                  <span className="text-sm text-gray-600">{cat._count.products}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/categories/${cat.id}/editar`}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Editar
                    </Link>
                    <DeleteCategoryButton
                      categoryId={cat.id}
                      categoryName={cat.name}
                      productCount={cat._count.products}
                    />
                  </div>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-sm text-gray-400 py-10">
                  No hay categorías. Crea la primera.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
