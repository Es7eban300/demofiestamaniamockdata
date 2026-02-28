import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const VariantSchema = z.object({
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color debe ser hex válido (ej: #FF0000)"),
  colorName: z.string().min(1, "Nombre de color requerido"),
  stock: z.number().int().min(0).default(0),
  sku: z.string().optional(),
});

export async function GET() {
  // Demo mode: no variants in mock data
  return NextResponse.json({ data: [] });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = VariantSchema.parse(body);

    // Demo mode: return mock variant (no persistence)
    const variant = {
      id: `variant-demo-${Date.now()}`,
      productId: id,
      color: data.color,
      colorName: data.colorName,
      stock: data.stock,
      sku: data.sku ?? null,
    };

    return NextResponse.json({ data: variant }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al crear variante" }, { status: 500 });
  }
}
