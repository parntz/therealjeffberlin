import { cookies } from "next/headers";
import { LessonsSection, TestimonialsSection } from "../../components/site-sections";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../lib/admin-auth";
import { readSiteContentOverrides } from "../../lib/site-content";

export const metadata = {
  title: "Lessons | Jeff Berlin",
  description: "Book bass lessons and explore Jeff Berlin's teaching approach."
};

export default async function LessonsPage() {
  const cookieStore = await cookies();
  const adminSession = readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
  );
  const siteContentOverrides = await readSiteContentOverrides();

  return (
    <main className="page-shell">
      <LessonsSection
        isAdminSignedIn={Boolean(adminSession)}
        siteContentOverrides={siteContentOverrides}
      />
      <TestimonialsSection
        isAdminSignedIn={Boolean(adminSession)}
        siteContentOverrides={siteContentOverrides}
      />
    </main>
  );
}
