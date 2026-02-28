import { NextRequest, NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/mock-db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("ids") ?? "";
  const ids = raw.split(",").map((s) => s.trim()).filter(Boolean);

  if (ids.length === 0) {
    return NextResponse.json({ data: [] });
  }

  const products = getProductsByIds(ids);
  return NextResponse.json({ data: products });
}
