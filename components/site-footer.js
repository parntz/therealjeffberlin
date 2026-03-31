import { cookies } from "next/headers";
import SiteFooterClient from "./site-footer-client";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../lib/admin-auth";
import { musicAlbums } from "../lib/music-data";

export default async function SiteFooter() {
  const cookieStore = await cookies();
  const session = readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
  );
  const featuredPool = musicAlbums.filter((album) => album.cover);
  const featuredLinerNotes = featuredPool.length
    ? featuredPool[Math.floor(Math.random() * featuredPool.length)]
    : null;

  return (
    <SiteFooterClient
      isAdminSignedIn={Boolean(session)}
      featuredLinerNotes={featuredLinerNotes}
    />
  );
}
