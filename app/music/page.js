import { cookies } from "next/headers";
import { MusicSection } from "../../components/site-sections";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../lib/admin-auth";

export const metadata = {
  title: "Music | Jeff Berlin",
  description: "Albums, sessions, and musical highlights from Jeff Berlin."
};

export default async function MusicPage() {
  const cookieStore = await cookies();
  const adminSession = readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
  );

  return (
    <main className="page-shell">
      <MusicSection isAdminSignedIn={Boolean(adminSession)} />
    </main>
  );
}
