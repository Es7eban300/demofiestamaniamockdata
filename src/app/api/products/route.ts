import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/mock-db";
import { z } from "zod";

const QuerySchema = z.object({
  category: z.string().optional(),
  occasion: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  tags: z.string().optional(),
  inStock: z.enum(["true", "false"]).optional(),
  sortBy: z.enum(["featured", "price-asc", "price-desc", "bestseller", "rating"]).optional(),
  search: z.string().optional(),
  featured: z.enum(["true", "false"]).optional(),
  bestseller: z.enum(["true", "false"]).optional(),
  isNew: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const params = QuerySchema.parse(Object.fromEntries(searchParams));

    const result = getProducts({
      category: params.category,
      occasion: params.occasion,
      priceMin: params.priceMin,
      priceMax: params.priceMax,
      tags: params.tags,
      inStock: params.inStock === "true",
      sortBy: params.sortBy,
      search: params.search,
      featured: params.featured === "true",
      bestseller: params.bestseller === "true",
      isNew: params.isNew === "true",
      page: params.page,
      limit: params.limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST() {
  return NextResponse.json({ error: "No disponible en modo demo" }, { status: 403 });
}
