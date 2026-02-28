import { NextRequest, NextResponse } from "next/server";
import { getUserByEmail } from "@/lib/mock-db";
import { createSessionToken, USER_COOKIE, COOKIE_MAX_AGE } from "@/lib/auth";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(1, "Contraseña requerida"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = LoginSchema.parse(body);

    const user = getUserByEmail(email);

    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: "Correo o contraseña incorrectos" },
        { status: 401 }
      );
    }

    const token = createSessionToken(user.id, user.role);
    const { password: _pw, ...publicUser } = user;

    const response = NextResponse.json({ data: publicUser });
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
    return NextResponse.json({ error: "Error al iniciar sesión" }, { status: 500 });
  }
}
