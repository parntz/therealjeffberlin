import { cookies } from "next/headers";

import ContactForm from "../../components/contact-form";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../lib/admin-auth";
import {
  readSiteContentOverrides,
  resolveSiteContentValue
} from "../../lib/site-content";

export const metadata = {
  title: "Contact | Jeff Berlin",
  description: "Send Jeff Berlin a message about lessons, music, books, or appearances."
};

export default async function ContactPage() {
  const cookieStore = await cookies();
  const adminSession = readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
  );
  const siteContentOverrides = await readSiteContentOverrides();

  return (
    <main className="page-shell contact-page">
      <ContactForm
        isAdminSignedIn={Boolean(adminSession)}
        copy={{
          eyebrow: resolveSiteContentValue(
            siteContentOverrides,
            "contact.page.eyebrow",
            "Contact"
          ),
          title: resolveSiteContentValue(
            siteContentOverrides,
            "contact.page.title",
            "Send Jeff a message."
          ),
          body: resolveSiteContentValue(
            siteContentOverrides,
            "contact.page.body",
            "Use the form below for questions about lessons, music, books, appearances, or general inquiries. Messages go directly to Jeff Berlin's inbox."
          )
        }}
      />
    </main>
  );
}
