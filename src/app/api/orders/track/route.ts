import { NextRequest, NextResponse } from "next/server";
import { trackOrder } from "@/lib/mock-db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber")?.trim().toUpperCase();
  const email = searchParams.get("email")?.trim().toLowerCase();

  if (!orderNumber || !email) {
    return NextResponse.json(
      { error: "Se requiere número de pedido y correo electrónico" },
      { status: 400 }
    );
  }

  const order = trackOrder(orderNumber, email);
  if (!order) {
    return NextResponse.json(
      { error: "No encontramos tu pedido. Verifica el número y correo e intenta de nuevo." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: order });
}
