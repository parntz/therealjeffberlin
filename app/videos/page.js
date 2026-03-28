import { cookies } from "next/headers";
import VideosLibrary from "../../components/videos-library";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../lib/admin-auth";
import { getSiteContentValue } from "../../lib/site-content";
import { readVideosArchive } from "../../lib/videos-archive";

export const metadata = {
  title: "Videos | Jeff Berlin",
  description:
    "Jeff Berlin videos from his official YouTube collection with searchable transcripts."
};
export const dynamic = "force-dynamic";

export default async function VideosPage() {
  const cookieStore = await cookies();
  const adminSession = readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
  );
  const data = await readVideosArchive();

  return (
    <main className="page-shell">
      <VideosLibrary
        videos={data.videos}
        channelUrl={data.channelUrl}
        fetchedAt={data.fetchedAt}
        collections={data.collections}
        isAdminSignedIn={Boolean(adminSession)}
        copy={{
          eyebrow: getSiteContentValue("videos.hero.eyebrow", "Videos"),
          title: getSiteContentValue(
            "videos.hero.title",
            "Jeff Berlin on camera, fully indexed."
          ),
          body: getSiteContentValue(
            "videos.hero.body",
            "Every current upload from Jeff Berlin's YouTube collection is listed here. Search runs across titles, descriptions, and locally saved transcripts, but the page stays focused on getting people into the videos."
          ),
          emptyTitle: getSiteContentValue(
            "videos.empty.title",
            "No videos match that search."
          ),
          emptyBody: getSiteContentValue(
            "videos.empty.body",
            "Try a broader phrase or a single keyword."
          )
        }}
      />
    </main>
  );
}
