import { NextRequest, NextResponse } from "next/server";
import { DEMO_USERS } from "@/lib/mock-db";
import { z } from "zod";

const QuerySchema = z.object({
  search: z.string().optional(),
  role: z.enum(["CUSTOMER", "ADMIN"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

const CreateUserSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  email: z.string().email("Correo inválido"),
  password: z.string().min(8, "Mínimo 8 caracteres"),
  role: z.enum(["CUSTOMER", "ADMIN"]).default("CUSTOMER"),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { search, role, page, limit } = QuerySchema.parse(Object.fromEntries(searchParams));

    let users = DEMO_USERS.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      _count: u._count,
    }));

    if (role) users = users.filter((u) => u.role === role);
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u) =>
          (u.name ?? "").toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q)
      );
    }

    const total = users.length;
    const skip = (page - 1) * limit;
    const data = users.slice(skip, skip + limit);

    return NextResponse.json({ data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al obtener usuarios" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = CreateUserSchema.parse(body);

    // Demo mode: return mock user (no persistence)
    const user = {
      id: `user-demo-${Date.now()}`,
      email: data.email,
      name: data.name,
      role: data.role,
    };

    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al crear usuario" }, { status: 500 });
  }
}
