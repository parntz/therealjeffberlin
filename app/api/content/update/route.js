import { cookies } from "next/headers";

import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../../../lib/admin-auth";
import {
  readSiteContentOverrides,
  writeSiteContentOverrides
} from "../../../../lib/site-content";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const session = readAdminSession(
      cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
    );

    if (!session) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { contentId, value } = await request.json();

    if (typeof contentId !== "string" || !contentId.trim()) {
      return Response.json({ error: "Content id is required." }, { status: 400 });
    }

    if (typeof value !== "string") {
      return Response.json({ error: "Value is required." }, { status: 400 });
    }

    const overrides = readSiteContentOverrides();
    overrides[contentId] = value;
    writeSiteContentOverrides(overrides);

    return Response.json({ ok: true, contentId, value });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Update failed." },
      { status: 500 }
    );
  }
}
