import { cookies } from "next/headers";
import { StoreSection } from "../../components/site-sections";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../lib/admin-auth";
import { readSiteContentOverrides } from "../../lib/site-content";

export const metadata = {
  title: "Store | Jeff Berlin",
  description: "Shop Jeff Berlin Bass Mastery books and educational materials."
};

export default async function StorePage() {
  const cookieStore = await cookies();
  const adminSession = readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
  );
  const siteContentOverrides = await readSiteContentOverrides();

  return (
    <main className="page-shell">
      <StoreSection
        isAdminSignedIn={Boolean(adminSession)}
        siteContentOverrides={siteContentOverrides}
      />
    </main>
  );
}
