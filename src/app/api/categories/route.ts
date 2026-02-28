import { NextResponse } from "next/server";
import { getCategories } from "@/lib/mock-db";

export async function GET() {
  const categories = getCategories();
  return NextResponse.json({ data: categories });
}

export async function POST() {
  return NextResponse.json({ error: "No disponible en modo demo" }, { status: 403 });
}
