import fs from "node:fs";
import { cookies } from "next/headers";

import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../../../lib/admin-auth";
import {
  publicPathToFilepath,
  readPhotoOverrides,
  writePhotoOverrides
} from "../../../../lib/photo-library";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const session = readAdminSession(
      cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
    );

    if (!session) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { image, title, description, source } = await request.json();

    if (typeof image !== "string" || !image.startsWith("/")) {
      return Response.json({ error: "Invalid image path." }, { status: 400 });
    }

    if (typeof title !== "string" || !title.trim()) {
      return Response.json({ error: "Title is required." }, { status: 400 });
    }

    if (typeof description !== "string") {
      return Response.json({ error: "Description is required." }, { status: 400 });
    }

    if (typeof source !== "string") {
      return Response.json({ error: "Source is required." }, { status: 400 });
    }

    const filepath = publicPathToFilepath(image);

    if (!fs.existsSync(filepath)) {
      return Response.json({ error: "File not found." }, { status: 404 });
    }

    const overrides = readPhotoOverrides();
    overrides[image] = {
      title: title.trim(),
      description: description.trim(),
      source: source.trim(),
      updatedAt: new Date().toISOString()
    };
    writePhotoOverrides(overrides);

    return Response.json({
      ok: true,
      image,
      title: overrides[image].title,
      description: overrides[image].description,
      source: overrides[image].source
    });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Update failed." },
      { status: 500 }
    );
  }
}
