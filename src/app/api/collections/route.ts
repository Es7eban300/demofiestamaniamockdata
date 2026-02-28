import { NextResponse } from "next/server";
import { getCollections } from "@/lib/mock-db";

export async function GET() {
  const collections = getCollections();
  return NextResponse.json({ data: collections });
}
