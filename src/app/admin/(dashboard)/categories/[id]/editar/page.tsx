import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategories } from "@/lib/mock-db";
import { CategoryForm } from "@/components/admin/CategoryForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarCategoriaPage({ params }: Props) {
  const { id } = await params;

  const category = getCategories().find((c) => c.id === id);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/categories" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar categoría</h1>
          <p className="text-sm text-gray-500 mt-0.5">{category.name}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <CategoryForm category={category} />
      </div>
    </div>
  );
}
