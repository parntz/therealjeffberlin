import { cookies } from "next/headers";
import { BioSection } from "../../components/site-sections";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../lib/admin-auth";

export const metadata = {
  title: "Bio | Jeff Berlin",
  description: "Biography and career highlights for Jeff Berlin."
};

export default async function BioPage() {
  const cookieStore = await cookies();
  const adminSession = readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
  );

  return (
    <main className="page-shell">
      <BioSection isAdminSignedIn={Boolean(adminSession)} />
    </main>
  );
}
