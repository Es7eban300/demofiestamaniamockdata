import { NextResponse } from "next/server";
import { getBundles } from "@/lib/mock-db";

export async function GET() {
  const bundles = getBundles();
  return NextResponse.json({ data: bundles });
}
