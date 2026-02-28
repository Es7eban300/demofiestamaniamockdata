import { NextRequest, NextResponse } from "next/server";
import { getBundleBySlug } from "@/lib/mock-db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const bundle = getBundleBySlug(slug);
  if (!bundle) {
    return NextResponse.json({ error: "Bundle no encontrado" }, { status: 404 });
  }
  return NextResponse.json({ data: bundle });
}
