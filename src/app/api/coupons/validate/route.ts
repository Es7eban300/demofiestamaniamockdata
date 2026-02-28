import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const code = (body.code ?? "").toUpperCase();

  // Demo coupons
  if (code === "DEMO10") {
    return NextResponse.json({
      data: { code: "DEMO10", type: "PERCENTAGE", value: 10, valid: true },
    });
  }
  if (code === "FIESTA20") {
    return NextResponse.json({
      data: { code: "FIESTA20", type: "PERCENTAGE", value: 20, valid: true },
    });
  }

  return NextResponse.json({ error: "Cupón inválido o expirado" }, { status: 404 });
}
