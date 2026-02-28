import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { OccasionForm } from "@/components/admin/OccasionForm";

export default function NuevaOcasionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/occasions" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Nueva ocasión</h1>
          <p className="text-sm text-gray-500 mt-0.5">Añade una nueva ocasión al catálogo</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <OccasionForm />
      </div>
    </div>
  );
}
