import Link from "next/link";
import { cookies } from "next/headers";
import AdminLoginForm from "../../components/admin-login-form";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../../lib/admin-auth";

const adminCards = [
  {
    title: "Music Report",
    body: "Open the verified Amazon physical product report for album liner notes.",
    href: "/music"
  },
  {
    title: "Photos",
    body: "Review the harvested photo gallery and delete anything you do not want to keep.",
    href: "/photos"
  },
  {
    title: "Videos",
    body: "Check the synced YouTube library and thumbnail treatment.",
    href: "/videos"
  },
  {
    title: "Store",
    body: "Review the book ads and payment flow on the store page.",
    href: "/store"
  }
];

export const metadata = {
  title: "Admin | Jeff Berlin",
  description: "Private admin access for the Jeff Berlin site."
};

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
  );

  return (
    <main className="admin-page">
      <section className="admin-shell">
        <div className="admin-header">
          <p className="eyebrow">Private Access</p>
          <h1>Admin</h1>
          <p>
            {session
              ? "Quick access to the areas you are most likely to manage."
              : "Sign in to open the admin section."}
          </p>
        </div>

        {session ? (
          <div className="admin-dashboard">
            <div className="admin-status">
              <p>Signed in as {session.email}</p>
              <form action="/api/admin/logout" method="post">
                <button type="submit" className="admin-button admin-button-secondary">
                  Sign Out
                </button>
              </form>
            </div>

            <div className="admin-grid">
              {adminCards.map((card) => (
                <article key={card.title} className="admin-card">
                  <h2>{card.title}</h2>
                  <p>{card.body}</p>
                  <Link href={card.href} className="admin-link">
                    Open
                  </Link>
                </article>
              ))}
            </div>
          </div>
        ) : (
          <AdminLoginForm />
        )}
      </section>
    </main>
  );
}
