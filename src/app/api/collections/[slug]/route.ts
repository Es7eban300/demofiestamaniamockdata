import { NextRequest, NextResponse } from "next/server";
import { getCollectionBySlug } from "@/lib/mock-db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) {
    return NextResponse.json({ error: "Colección no encontrada" }, { status: 404 });
  }
  return NextResponse.json({ data: collection });
}
