import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/mock-db";
import { verifySessionToken, USER_COOKIE } from "@/lib/auth";
import { z } from "zod";

function getToken(request: NextRequest) {
  return request.cookies.get(USER_COOKIE)?.value ?? null;
}

export async function GET(request: NextRequest) {
  const token = getToken(request);
  if (!token) return NextResponse.json({ data: null }, { status: 401 });

  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ data: null }, { status: 401 });

  const user = getUserById(session.userId);
  if (!user) {
    // Guest user created during registration
    return NextResponse.json({
      data: { id: session.userId, email: "demo@guest.com", name: "Invitado", role: session.role },
    });
  }

  const { password: _pw, ...publicUser } = user;
  return NextResponse.json({ data: publicUser });
}

const UpdateMeSchema = z.object({
  name: z.string().min(2).optional(),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8).optional(),
});

export async function PATCH(request: NextRequest) {
  const token = getToken(request);
  if (!token) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const session = verifySessionToken(token);
  if (!session) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  try {
    const body = await request.json();
    const data = UpdateMeSchema.parse(body);
    const user = getUserById(session.userId);
    const updated = { id: session.userId, email: user?.email ?? "", name: data.name ?? user?.name ?? "", role: session.role };
    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al actualizar perfil" }, { status: 500 });
  }
}
