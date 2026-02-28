import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const UpdateVariantSchema = z.object({
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  colorName: z.string().min(1).optional(),
  stock: z.number().int().min(0).optional(),
  sku: z.string().optional(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  try {
    const { variantId } = await params;
    const body = await request.json();
    const data = UpdateVariantSchema.parse(body);

    // Demo mode: return mock updated variant (no persistence)
    return NextResponse.json({ data: { id: variantId, ...data } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al actualizar variante" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; variantId: string }> }
) {
  // Demo mode: return success without persistence
  const { variantId } = await params;
  void variantId;
  return NextResponse.json({ message: "Variante eliminada" });
}
