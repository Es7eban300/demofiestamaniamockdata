import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getOccasions } from "@/lib/mock-db";
import { OccasionForm } from "@/components/admin/OccasionForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarOcasionPage({ params }: Props) {
  const { id } = await params;

  const occasion = getOccasions().find((o) => o.id === id);
  if (!occasion) notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/occasions" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar ocasión</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {occasion.icon && <span className="mr-1">{occasion.icon}</span>}
            {occasion.name}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <OccasionForm occasion={occasion} />
      </div>
    </div>
  );
}
