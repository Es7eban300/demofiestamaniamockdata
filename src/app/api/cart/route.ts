import { NextResponse } from "next/server";

// Demo: cart is managed client-side via Zustand (localStorage).
// These API routes are stubs for compatibility.

export async function GET() {
  return NextResponse.json({ data: { items: [] } });
}

export async function DELETE() {
  return NextResponse.json({ data: { success: true } });
}
