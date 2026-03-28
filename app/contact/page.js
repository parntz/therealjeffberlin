import { cookies } from "next/headers";

import ContactForm from "../../components/contact-form";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../lib/admin-auth";

export const metadata = {
  title: "Contact | Jeff Berlin",
  description: "Send Jeff Berlin a message about lessons, music, books, or appearances."
};

export default async function ContactPage() {
  const cookieStore = await cookies();
  const adminSession = readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
  );

  return (
    <main className="page-shell contact-page">
      <ContactForm isAdminSignedIn={Boolean(adminSession)} />
    </main>
  );
}
