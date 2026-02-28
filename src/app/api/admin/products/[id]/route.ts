import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/mock-db";
import { z } from "zod";

const UpdateProductSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  shortDescription: z.string().optional(),
  price: z.number().positive().optional(),
  compareAtPrice: z.number().positive().nullable().optional(),
  categoryId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  badges: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  stockCount: z.number().int().min(0).optional(),
  isFeatured: z.boolean().optional(),
  isBestSeller: z.boolean().optional(),
  isNew: z.boolean().optional(),
  occasionIds: z.array(z.string()).optional(),
  attributes: z.array(z.object({ name: z.string(), value: z.string() })).optional(),
});

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: products } = getProducts({ limit: 200 });
  const product = products.find((p) => p.id === id);
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ data: { ...product, occasions: [], attributes: [], stockMovements: [] } });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateData = UpdateProductSchema.parse(body);

    const { data: products } = getProducts({ limit: 200 });
    const existing = products.find((p) => p.id === id);
    if (!existing) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    // Demo mode: return merged mock (no persistence)
    return NextResponse.json({ data: { ...existing, ...updateData, occasions: [], attributes: [] } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { data: products } = getProducts({ limit: 200 });
  const existing = products.find((p) => p.id === id);
  if (!existing) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
  // Demo mode: return success without persistence
  return NextResponse.json({ data: { success: true } });
}
