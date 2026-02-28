import Link from "next/link";
import { getProducts } from "@/lib/mock-db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil } from "lucide-react";

const BADGE_STYLES: Record<string, string> = {
  new: "bg-blue-100 text-blue-700",
  sale: "bg-orange-100 text-orange-700",
  bestseller: "bg-purple-100 text-purple-700",
  limited: "bg-red-100 text-red-700",
};

export default function ProductsPage() {
  const { data: products } = getProducts({ limit: 100 });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
          <p className="text-sm text-gray-500 mt-1">
            {products.length} productos en el catálogo
          </p>
        </div>
        <Link
          href="/admin/products/nuevo"
          className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4" />
          Agregar Producto
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Producto</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {product.images[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.images[0].url}
                          alt={product.images[0].alt ?? product.name}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {product.name}
                      </p>
                      <p className="text-xs text-gray-400">{product.slug}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-600">
                  {product.category.name}
                </TableCell>
                <TableCell className="font-medium">
                  ${product.price.toLocaleString("es-MX")}
                </TableCell>
                <TableCell className="text-sm">
                  <span
                    className={
                      product.stockCount < 20
                        ? "text-red-600 font-medium"
                        : "text-gray-700"
                    }
                  >
                    {product.stockCount}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {(product.badges as string[]).map((badge) => (
                      <span
                        key={badge}
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                          BADGE_STYLES[badge] ?? "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {badge}
                      </span>
                    ))}
                    {product.badges.length === 0 && (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link
                      href={`/admin/products/${product.id}/editar`}
                      className="p-1.5 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors inline-flex"
                      aria-label="Editar producto"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {products.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center text-sm text-gray-400 py-8"
                >
                  No hay productos aún.{" "}
                  <Link
                    href="/admin/products/nuevo"
                    className="text-pink-500 underline"
                  >
                    Agregar el primero
                  </Link>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
