import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DEMO_USERS } from "@/lib/mock-db";
import { UserForm } from "@/components/admin/UserForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarUsuarioPage({ params }: Props) {
  const { id } = await params;

  const dbUser = DEMO_USERS.find((u) => u.id === id);
  if (!dbUser) notFound();
  const user = { id: dbUser.id, name: dbUser.name, email: dbUser.email, role: dbUser.role };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/users" className="text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar usuario</h1>
          <p className="text-sm text-gray-500 mt-0.5">{user.name ?? user.email}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <UserForm user={user} />
      </div>
    </div>
  );
}
