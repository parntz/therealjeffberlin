import fs from "node:fs";
import { cookies } from "next/headers";

import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../../../lib/admin-auth";
import {
  canUseNetlifyBlobs,
  isUsedInMusicArea,
  publicPathToFilepath,
  readDeletedPhotos,
  sha256File,
  writeDeletedPhotos
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

    const { image } = await request.json();

    if (typeof image !== "string" || !image.startsWith("/")) {
      return Response.json({ error: "Invalid image path." }, { status: 400 });
    }

    const filepath = publicPathToFilepath(image);

    if (!fs.existsSync(filepath)) {
      return Response.json({ error: "File not found." }, { status: 404 });
    }

    const hash = sha256File(filepath);
    const hiddenOnly = isUsedInMusicArea(image);
    const deletedPhotos = await readDeletedPhotos();
    const alreadyTracked = deletedPhotos.some(
      (entry) => entry.image === image || entry.sha256 === hash
    );

    if (!alreadyTracked) {
      deletedPhotos.push({
        image,
        sha256: hash,
        hiddenOnly,
        deletedAt: new Date().toISOString()
      });
      await writeDeletedPhotos(deletedPhotos);
    }

    if (!hiddenOnly && !canUseNetlifyBlobs()) {
      fs.unlinkSync(filepath);
    }

    return Response.json({ ok: true, image, hiddenOnly });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Delete failed." },
      { status: 500 }
    );
  }
}
