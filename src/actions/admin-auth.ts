"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin";
const COOKIE_NAME = "fm-admin-session";
const COOKIE_MAX_AGE = 8 * 60 * 60; // 8 hours in seconds

export interface LoginResult {
  error?: string;
}

export async function loginAction(
  prevState: LoginResult,
  formData: FormData
): Promise<LoginResult> {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (username !== ADMIN_USER || password !== ADMIN_PASS) {
    return { error: "Credenciales incorrectas. Intenta de nuevo." };
  }

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, "1", {
    httpOnly: true,
    maxAge: COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });

  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/admin/login");
}
