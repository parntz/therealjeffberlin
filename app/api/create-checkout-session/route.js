import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Online ordering is currently unavailable." },
    { status: 410 }
  );
}
