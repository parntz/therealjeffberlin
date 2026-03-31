import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createAdminSessionValue,
  getAdminSessionCookie,
  getLocalDevAdminEmail,
  verifyAdminCredentials
} from "../../../../lib/admin-auth";

export async function POST(request) {
  const { email = "", password = "" } = await request.json().catch(() => ({}));
  const normalizedEmail = String(email).trim();
  const normalizedPassword = String(password).trim();
  const hostname = request.nextUrl.hostname;
  const isLocalhost =
    hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
  const allowLocalBlankLogin = process.env.NODE_ENV !== "production" && isLocalhost;
  const useLocalBypass =
    allowLocalBlankLogin && !normalizedEmail && !normalizedPassword;

  if (!useLocalBypass && (!normalizedEmail || !normalizedPassword)) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  if (
    !useLocalBypass &&
    !verifyAdminCredentials(normalizedEmail, normalizedPassword)
  ) {
    return NextResponse.json(
      { error: "Incorrect email or password." },
      { status: 401 }
    );
  }

  const cookieStore = await cookies();
  const sessionCookie = getAdminSessionCookie();

  cookieStore.set(
    sessionCookie.name,
    createAdminSessionValue(
      useLocalBypass ? getLocalDevAdminEmail() : normalizedEmail
    ),
    sessionCookie.options
  );

  return NextResponse.json({ ok: true });
}
