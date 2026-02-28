import { NextRequest, NextResponse } from "next/server";
import { getOccasionBySlug } from "@/lib/mock-db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const occasion = getOccasionBySlug(slug);
  if (!occasion) {
    return NextResponse.json({ error: "Ocasión no encontrada" }, { status: 404 });
  }
  return NextResponse.json({ data: occasion });
}
