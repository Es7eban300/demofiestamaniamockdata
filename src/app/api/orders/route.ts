import { NextRequest, NextResponse } from "next/server";

export async function POST(_request: NextRequest) {
  // Demo: simulate order creation success
  const orderNumber = "ORD-" + String(Date.now()).slice(-6);
  return NextResponse.json(
    {
      data: {
        id: "order-demo-" + Date.now(),
        orderNumber,
        status: "PENDIENTE",
        paymentStatus: "PENDIENTE",
        total: 0,
        createdAt: new Date().toISOString(),
      },
    },
    { status: 201 }
  );
}

export async function GET() {
  return NextResponse.json({ error: "No disponible en modo demo" }, { status: 403 });
}
