import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/mock-db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const priceMin = searchParams.get("priceMin");
  const priceMax = searchParams.get("priceMax");

  const { data: products } = getProducts({
    inStock: true,
    priceMin: priceMin ? Number(priceMin) : undefined,
    priceMax: priceMax ? Number(priceMax) : undefined,
    sortBy: "rating",
    limit: 6,
  });

  return NextResponse.json({ data: products });
}
