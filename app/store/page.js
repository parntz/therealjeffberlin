import { cookies } from "next/headers";
import { StoreSection } from "../../components/site-sections";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../lib/admin-auth";

export const metadata = {
  title: "Store | Jeff Berlin",
  description: "Shop Jeff Berlin Bass Mastery books and educational materials."
};

export default async function StorePage() {
  const cookieStore = await cookies();
  const adminSession = readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
  );

  return (
    <main className="page-shell">
      <StoreSection isAdminSignedIn={Boolean(adminSession)} />
    </main>
  );
}
