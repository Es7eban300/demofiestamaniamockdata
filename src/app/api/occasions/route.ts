import { NextResponse } from "next/server";
import { getOccasions } from "@/lib/mock-db";

export async function GET() {
  const occasions = getOccasions();
  return NextResponse.json({ data: occasions });
}

export async function POST() {
  return NextResponse.json({ error: "No disponible en modo demo" }, { status: 403 });
}
