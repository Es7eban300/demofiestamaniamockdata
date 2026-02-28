import { NextRequest, NextResponse } from "next/server";
import { getUserById } from "@/lib/mock-db";
import { z } from "zod";

const UpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).optional(),
  role: z.enum(["CUSTOMER", "ADMIN"]).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const user = getUserById(id);
  if (!user) {
    return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
  }
  return NextResponse.json({
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      addresses: [],
      _count: user._count,
      orders: [],
    },
  });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = UpdateUserSchema.parse(body);

    const user = getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Demo mode: return merged mock (no persistence)
    return NextResponse.json({
      data: {
        id: user.id,
        email: data.email ?? user.email,
        name: data.name ?? user.name,
        role: data.role ?? user.role,
        addresses: [],
        _count: user._count,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al actualizar usuario" }, { status: 500 });
  }
}
