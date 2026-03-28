import { cookies } from "next/headers";
import VideosLibrary from "../../components/videos-library";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../lib/admin-auth";
import {
  readSiteContentOverrides,
  resolveSiteContentValue
} from "../../lib/site-content";
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
  const [data, siteContentOverrides] = await Promise.all([
    readVideosArchive(),
    readSiteContentOverrides()
  ]);

  return (
    <main className="page-shell">
      <VideosLibrary
        videos={data.videos}
        channelUrl={data.channelUrl}
        fetchedAt={data.fetchedAt}
        collections={data.collections}
        isAdminSignedIn={Boolean(adminSession)}
        copy={{
          eyebrow: resolveSiteContentValue(
            siteContentOverrides,
            "videos.hero.eyebrow",
            "Videos"
          ),
          title: resolveSiteContentValue(
            siteContentOverrides,
            "videos.hero.title",
            "Jeff Berlin on camera, fully indexed."
          ),
          body: resolveSiteContentValue(
            siteContentOverrides,
            "videos.hero.body",
            "Every current upload from Jeff Berlin's YouTube collection is listed here. Search runs across titles, descriptions, and locally saved transcripts, but the page stays focused on getting people into the videos."
          ),
          emptyTitle: resolveSiteContentValue(
            siteContentOverrides,
            "videos.empty.title",
            "No videos match that search."
          ),
          emptyBody: resolveSiteContentValue(
            siteContentOverrides,
            "videos.empty.body",
            "Try a broader phrase or a single keyword."
          )
        }}
      />
    </main>
  );
}
