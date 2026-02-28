import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/mock-db";
import { z } from "zod";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const raw = getOrderById(id);
  if (!raw) {
    return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
  }
  const order = {
    ...raw,
    orderNumber: raw.id,
    status: raw.status.toUpperCase(),
    paymentStatus: "PAGADO",
    createdAt: new Date(raw.createdAt),
    items: [],
    shippingMethod: null,
    coupon: null,
    user: null,
    shippingName: raw.customer,
    shippingCity: "México",
    shippingState: "CDMX",
    shippingZipCode: "00000",
    shippingCost: 0,
    discountAmount: 0,
    subtotal: raw.total,
  };
  return NextResponse.json({ data: order });
}

const UpdateOrderSchema = z.object({
  status: z.enum(["PENDIENTE", "CONFIRMADO", "ENVIADO", "ENTREGADO", "CANCELADO"]).optional(),
  paymentStatus: z.enum(["PENDIENTE", "PAGADO", "FALLIDO", "REEMBOLSADO"]).optional(),
  paymentRef: z.string().optional(),
  notes: z.string().optional(),
});

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const data = UpdateOrderSchema.parse(body);

    const raw = getOrderById(id);
    if (!raw) {
      return NextResponse.json({ error: "Orden no encontrada" }, { status: 404 });
    }

    // Demo mode: return merged object (no persistence)
    return NextResponse.json({
      data: {
        id,
        orderNumber: id,
        status: data.status ?? raw.status.toUpperCase(),
        paymentStatus: data.paymentStatus ?? "PAGADO",
        total: raw.total,
        createdAt: new Date(raw.createdAt),
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al actualizar orden" }, { status: 500 });
  }
}
