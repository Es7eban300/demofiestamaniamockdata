import { NextResponse } from "next/server";

// Demo: cart is managed client-side via Zustand (localStorage).
export async function POST() {
  return NextResponse.json({ data: { success: true } }, { status: 201 });
}
