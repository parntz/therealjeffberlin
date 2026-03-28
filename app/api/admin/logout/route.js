import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "../../../../lib/admin-auth";

export async function POST(request) {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);

  const formData = await request.formData();
  const redirectTo = String(formData.get("redirectTo") || "/");
  const safePath =
    redirectTo.startsWith("/") && !redirectTo.startsWith("//") ? redirectTo : "/";
  const redirectUrl = new URL(safePath, request.url);
  return NextResponse.redirect(redirectUrl);
}
