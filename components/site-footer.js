import { cookies } from "next/headers";
import SiteFooterClient from "./site-footer-client";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../lib/admin-auth";

export default async function SiteFooter() {
  const cookieStore = await cookies();
  const session = readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
  );

  return <SiteFooterClient isAdminSignedIn={Boolean(session)} />;
}
