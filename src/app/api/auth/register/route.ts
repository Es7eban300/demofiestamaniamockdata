import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, USER_COOKIE, COOKIE_MAX_AGE } from "@/lib/auth";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(2, "El nombre debe tener mínimo 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(8, "La contraseña debe tener mínimo 8 caracteres"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = RegisterSchema.parse(body);

    // Demo: always create a "new" session user (no persistence)
    const demoUserId = "user-guest-" + Date.now();
    const user = { id: demoUserId, email, name, role: "CUSTOMER" as const };

    const token = createSessionToken(user.id, user.role);
    const response = NextResponse.json({ data: user }, { status: 201 });
    response.cookies.set(USER_COOKIE, token, {
      httpOnly: true,
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al crear la cuenta" }, { status: 500 });
  }
}
