import { NextRequest, NextResponse } from "next/server";
import { getOrders } from "@/lib/mock-db";
import { z } from "zod";

const CreateOrderSchema = z.object({
  userId: z.string().optional(),
  guestName: z.string().optional(),
  guestEmail: z.string().email().optional().or(z.literal("")),
  guestPhone: z.string().optional(),
  shippingMethodId: z.string().optional(),
  shippingName: z.string().min(1, "Nombre de envío requerido"),
  shippingAddress: z.string().min(1, "Dirección requerida"),
  shippingCity: z.string().min(1, "Ciudad requerida"),
  shippingState: z.string().min(1, "Estado requerido"),
  shippingZipCode: z.string().min(1, "CP requerido"),
  shippingPhone: z.string().optional(),
  status: z.enum(["PENDIENTE", "CONFIRMADO", "ENVIADO", "ENTREGADO", "CANCELADO"]).default("PENDIENTE"),
  paymentStatus: z.enum(["PENDIENTE", "PAGADO", "FALLIDO", "REEMBOLSADO"]).default("PENDIENTE"),
  paymentMethod: z.string().optional(),
  shippingCost: z.coerce.number().min(0).default(0),
  discountAmount: z.coerce.number().min(0).default(0),
  notes: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string().optional(),
        name: z.string().min(1, "Nombre del artículo requerido"),
        price: z.coerce.number().min(0),
        quantity: z.coerce.number().min(1).int(),
        imageUrl: z.string().optional(),
      })
    )
    .min(1, "Debe incluir al menos un artículo"),
});

const QuerySchema = z.object({
  status: z.enum(["PENDIENTE", "CONFIRMADO", "ENVIADO", "ENTREGADO", "CANCELADO"]).optional(),
  paymentStatus: z.enum(["PENDIENTE", "PAGADO", "FALLIDO", "REEMBOLSADO"]).optional(),
  search: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { status, search, page, limit } = QuerySchema.parse(Object.fromEntries(searchParams));

    let orders = getOrders().map((o) => ({
      id: o.id,
      orderNumber: o.id,
      status: o.status.toUpperCase(),
      paymentStatus: "PAGADO",
      total: o.total,
      createdAt: new Date(o.createdAt),
      guestName: o.customer,
      guestEmail: o.email,
      user: null,
      shippingMethod: null,
      _count: { items: 0 },
    }));

    if (status) orders = orders.filter((o) => o.status === status);
    if (search) {
      const q = search.toLowerCase();
      orders = orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(q) ||
          (o.guestEmail ?? "").toLowerCase().includes(q) ||
          (o.guestName ?? "").toLowerCase().includes(q)
      );
    }

    const total = orders.length;
    const skip = (page - 1) * limit;
    const data = orders.slice(skip, skip + limit);

    return NextResponse.json({ data, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al obtener órdenes" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = CreateOrderSchema.parse(body);

    const year = new Date().getFullYear();
    const orderNumber = `FM-${year}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`;
    const subtotal = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const total = subtotal + data.shippingCost - data.discountAmount;

    const order = {
      id: `ord-demo-${Date.now()}`,
      orderNumber,
      status: data.status,
      paymentStatus: data.paymentStatus,
      total,
      subtotal,
      shippingCost: data.shippingCost,
      discountAmount: data.discountAmount,
      createdAt: new Date(),
    };

    return NextResponse.json({ data: order }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al crear pedido" }, { status: 500 });
  }
}
