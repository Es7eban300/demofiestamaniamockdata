import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return NextResponse.json({ data: { id, updated: true } });
}
