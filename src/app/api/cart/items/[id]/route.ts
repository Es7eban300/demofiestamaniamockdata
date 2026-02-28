import { NextResponse } from "next/server";

// Demo: cart is managed client-side via Zustand (localStorage).
export async function PUT() {
  return NextResponse.json({ data: { success: true } });
}

export async function DELETE() {
  return NextResponse.json({ data: { success: true } });
}
