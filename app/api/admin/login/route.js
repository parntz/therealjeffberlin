import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createAdminSessionValue,
  getAdminSessionCookie,
  verifyAdminCredentials
} from "../../../../lib/admin-auth";

export async function POST(request) {
  const { email = "", password = "" } = await request.json().catch(() => ({}));

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  const sessionCookie = getAdminSessionCookie();

  cookieStore.set(
    sessionCookie.name,
    createAdminSessionValue(email),
    sessionCookie.options
  );

  return NextResponse.json({ ok: true });
}
