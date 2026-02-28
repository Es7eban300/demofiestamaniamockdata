import { NextRequest, NextResponse } from "next/server";
import { getOrderById } from "@/lib/mock-db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) {
    return NextResponse.json({ error: "Pedido no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ data: order });
}
