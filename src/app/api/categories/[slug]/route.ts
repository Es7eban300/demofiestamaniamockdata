import { NextRequest, NextResponse } from "next/server";
import { getCategoryBySlug } from "@/lib/mock-db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) {
    return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
  }
  return NextResponse.json({ data: category });
}
