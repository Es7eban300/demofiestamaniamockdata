"use client";

import { logoutAction } from "@/actions/admin-auth";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button
        type="submit"
        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Cerrar sesión
      </button>
    </form>
  );
}
