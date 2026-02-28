import { NextRequest, NextResponse } from "next/server";
import { getOccasions } from "@/lib/mock-db";
import { z } from "zod";

const OccasionSchema = z.object({
  name: z.string().min(2, "Mínimo 2 caracteres"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Solo letras minúsculas, números y guiones"),
  icon: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  image: z.string().url("URL inválida").optional().or(z.literal("")),
});

export async function GET() {
  const occasions = getOccasions().map((o) => ({ ...o, _count: { products: 0 } }));
  return NextResponse.json({ data: occasions });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = OccasionSchema.parse(body);
    const occasion = {
      id: `occ-demo-${Date.now()}`,
      name: data.name,
      slug: data.slug,
      icon: data.icon ?? null,
      description: data.description ?? null,
      color: data.color ?? null,
      image: data.image ?? null,
    };
    return NextResponse.json({ data: occasion }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al crear ocasión" }, { status: 500 });
  }
}
