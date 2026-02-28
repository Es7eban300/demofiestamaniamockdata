import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/mock-db";
import { User, Package, Settings, Heart } from "lucide-react";
import { AccountLogoutButton } from "@/components/account/AccountLogoutButton";

const NAV = [
  { href: "/cuenta", label: "Mi Cuenta", icon: User, exact: true },
  { href: "/cuenta/pedidos", label: "Mis Pedidos", icon: Package },
  { href: "/cuenta/favoritos", label: "Mis Favoritos", icon: Heart },
  { href: "/cuenta/perfil", label: "Editar Perfil", icon: Settings },
];

export default async function CuentaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");

  const dbUser = getUserById(session.userId);
  const user = dbUser
    ? { name: dbUser.name, email: dbUser.email }
    : { name: "Demo Usuario", email: "demo@fiestamania.com" };

  return (
    <div className="container-site section-py">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside>
          <div
            className="bg-white rounded-2xl p-5 mb-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                style={{ backgroundColor: "var(--pink-accent)" }}
              >
                {(user.name ?? user.email)[0].toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-dark text-sm truncate">
                  {user.name ?? "Mi cuenta"}
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-dark hover:bg-cream-dark transition-colors"
                >
                  <item.icon className="w-4 h-4 text-muted-foreground" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-4 pt-4 border-t border-border">
              <AccountLogoutButton />
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="lg:col-span-3">{children}</main>
      </div>
    </div>
  );
}
