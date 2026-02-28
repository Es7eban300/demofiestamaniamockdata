import { NextRequest, NextResponse } from "next/server";
import { getCategories } from "@/lib/mock-db";

export async function GET() {
  return NextResponse.json({ data: getCategories() });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  return NextResponse.json({ data: { id: "cat-new-" + Date.now(), ...body } }, { status: 201 });
}
