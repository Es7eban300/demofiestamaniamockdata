import { NextRequest, NextResponse } from "next/server";
import { getProducts } from "@/lib/mock-db";
import { z } from "zod";

const QuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  inStock: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const { search, category, inStock, page, limit } = QuerySchema.parse(Object.fromEntries(searchParams));

    const result = getProducts({
      search,
      category,
      inStock: inStock === "true" ? true : inStock === "false" ? false : undefined,
      page,
      limit,
    });

    const data = result.data.map((p) => ({
      ...p,
      images: p.images ? [{ url: p.images[0], sortOrder: 0 }] : [],
      _count: { orderItems: 0 },
    }));

    return NextResponse.json({ data, meta: result.meta });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}
