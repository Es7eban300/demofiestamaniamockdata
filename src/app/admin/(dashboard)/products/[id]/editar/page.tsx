import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getProductBySlug, getProducts, getCategories, getOccasions } from "@/lib/mock-db";
import { ProductForm } from "@/components/admin/ProductForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarProductoPage({ params }: Props) {
  const { id } = await params;

  // In demo mode, find product by id (mock products use id field)
  const { data: allProducts } = getProducts({ limit: 200 });
  const product = allProducts.find((p) => p.id === id);
  if (!product) notFound();

  const categories = getCategories();
  const occasions = getOccasions();

  const defaultValues = {
    name: product.name,
    slug: product.slug,
    description: product.description ?? "",
    shortDescription: product.shortDescription ?? "",
    price: product.price,
    compareAtPrice: product.compareAtPrice ?? undefined,
    categoryId: product.categoryId,
    inStock: product.inStock,
    stockCount: product.stockCount,
    isFeatured: product.isFeatured,
    isBestSeller: product.isBestSeller,
    isNew: product.isNew,
    tags: product.tags.join(", "),
    badges: product.badges as string[],
    occasionIds: [] as string[],
    images: product.images.map((img) => ({
      url: img.url,
      alt: img.alt ?? "",
      isPrimary: img.isPrimary,
      sortOrder: 0,
    })),
    attributes: [] as { name: string; value: string }[],
  };

  const initialVariants: { id: string; color: string; colorName: string; stock: number; sku: string | null }[] = [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
          <p className="text-sm text-gray-500 mt-0.5">{product.name}</p>
        </div>
      </div>

      <ProductForm
        categories={categories}
        occasions={occasions}
        defaultValues={defaultValues}
        productId={product.id}
        initialVariants={initialVariants}
      />
    </div>
  );
}
