import { NextRequest, NextResponse } from "next/server";
import { getOccasions } from "@/lib/mock-db";
import { z } from "zod";

const UpdateOccasionSchema = z.object({
  name: z.string().min(2).optional(),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/).optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
  color: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const occasion = getOccasions().find((o) => o.id === id);
  if (!occasion) {
    return NextResponse.json({ error: "Ocasión no encontrada" }, { status: 404 });
  }
  return NextResponse.json({ data: { ...occasion, _count: { products: 0 } } });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = UpdateOccasionSchema.parse(body);
    const existing = getOccasions().find((o) => o.id === id);
    if (!existing) {
      return NextResponse.json({ error: "Ocasión no encontrada" }, { status: 404 });
    }
    // Demo mode: return merged mock object (no persistence)
    return NextResponse.json({ data: { ...existing, ...data } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al actualizar ocasión" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = getOccasions().find((o) => o.id === id);
  if (!existing) {
    return NextResponse.json({ error: "Ocasión no encontrada" }, { status: 404 });
  }
  // Demo mode: return success without persistence
  return NextResponse.json({ message: "Ocasión eliminada" });
}
