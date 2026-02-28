import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/mock-db";
import { z } from "zod";

const StockMovementSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().refine((n) => n !== 0, {
    message: "La cantidad no puede ser 0",
  }),
  reason: z.enum(["RESTOCK", "SALE", "RETURN", "ADJUSTMENT", "DAMAGE"]),
  note: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = StockMovementSchema.parse(body);

    const { data: products } = getProducts({ limit: 200 });
    const product = products.find((p) => p.id === data.productId);
    if (!product) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    const newStockCount = (product.stockCount ?? 0) + data.quantity;
    if (newStockCount < 0) {
      return NextResponse.json(
        { error: `Stock insuficiente. Stock actual: ${product.stockCount}, cambio solicitado: ${data.quantity}` },
        { status: 422 }
      );
    }

    // Demo mode: return mock movement (no persistence)
    const movement = {
      id: `mov-demo-${Date.now()}`,
      productId: data.productId,
      quantity: data.quantity,
      reason: data.reason,
      note: data.note ?? null,
      createdAt: new Date(),
    };
    const updatedProduct = { id: product.id, name: product.name, stockCount: newStockCount, inStock: newStockCount > 0 };

    return NextResponse.json({ data: { movement, product: updatedProduct } }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al registrar movimiento de stock" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");
  const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 50)));

  // Demo mode: no stock movements stored
  const movements: unknown[] = [];
  void productId;
  void limit;
  return NextResponse.json({ data: movements });
}
