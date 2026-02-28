import { NextResponse } from "next/server";
import { USER_COOKIE } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ data: { success: true } });
  response.cookies.set(USER_COOKIE, "", {
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
  });
  return response;
}
