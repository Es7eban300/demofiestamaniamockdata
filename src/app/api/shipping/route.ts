import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    data: [
      {
        id: "ship-001",
        name: "Envío Estándar",
        description: "3-5 días hábiles",
        price: 99,
        estimatedDays: 5,
        isActive: true,
      },
      {
        id: "ship-002",
        name: "Envío Express",
        description: "1-2 días hábiles",
        price: 199,
        estimatedDays: 2,
        isActive: true,
      },
      {
        id: "ship-003",
        name: "Envío Gratis",
        description: "5-7 días hábiles (pedidos +$999)",
        price: 0,
        estimatedDays: 7,
        isActive: true,
      },
    ],
  });
}
