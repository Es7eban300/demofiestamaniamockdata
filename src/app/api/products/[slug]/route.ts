import { NextRequest, NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/mock-db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ data: product });
}

export async function PUT() {
  return NextResponse.json({ error: "No disponible en modo demo" }, { status: 403 });
}

export async function DELETE() {
  return NextResponse.json({ error: "No disponible en modo demo" }, { status: 403 });
}
