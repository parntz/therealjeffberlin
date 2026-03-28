import { cookies } from "next/headers";

import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../../../lib/admin-auth";
import { musicAlbumsBySlug } from "../../../../lib/music-data";
import {
  readAlbumSpotifyLinks,
  readFeaturedAlbumSettings,
  writeFeaturedAlbumSettings
} from "../../../../lib/music-spotify";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const session = readAdminSession(
      cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
    );

    if (!session) {
      return Response.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { slug, eligible } = await request.json();

    if (typeof slug !== "string" || !slug.trim()) {
      return Response.json({ error: "Album slug is required." }, { status: 400 });
    }

    if (typeof eligible !== "boolean") {
      return Response.json(
        { error: "Eligibility flag is required." },
        { status: 400 }
      );
    }

    if (!musicAlbumsBySlug[slug]) {
      return Response.json({ error: "Album not found." }, { status: 404 });
    }

    const spotifyLinks = readAlbumSpotifyLinks();

    if (!spotifyLinks[slug]?.url) {
      return Response.json(
        { error: "That album does not have a Spotify link." },
        { status: 400 }
      );
    }

    const settings = await readFeaturedAlbumSettings();
    settings[slug] = eligible;
    await writeFeaturedAlbumSettings(settings);

    return Response.json({ ok: true, slug, eligible });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Update failed." },
      { status: 500 }
    );
  }
}
