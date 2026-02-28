import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/mock-db";
import { redirect } from "next/navigation";
import { EditProfileForm } from "@/components/account/EditProfileForm";

export default async function PerfilPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const dbUser = getUserById(session.userId);
  const user = {
    id: session.userId,
    name: dbUser?.name ?? "Demo Usuario",
    email: dbUser?.email ?? "demo@fiestamania.com",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-dark font-display">Editar Perfil</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Actualiza tu información personal y contraseña
        </p>
      </div>

      <EditProfileForm user={user} />
    </div>
  );
}
