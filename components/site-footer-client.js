"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerLinks } from "../lib/site-data";

export default function SiteFooterClient({ isAdminSignedIn }) {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();
  const isHome = pathname === "/";
  const links = (pathname === "/" ? footerLinks : [{ label: "Home", href: "/" }, ...footerLinks]).map(
    (link) =>
      link.href === "/admin"
        ? { ...link, label: isAdminSignedIn ? "Log Out" : "Admin" }
        : link
  );

  return (
    <>
      {isHome ? (
        <section className="endorsement-section">
          <div className="endorsement-strip">
            <div className="endorsement-copy">
              <span>Special Thanks</span>
              <p>
                Jeff Berlin proudly acknowledges the companies behind the rig,
                in the spirit of a classic back-cover thank-you wall.
              </p>
            </div>
            <div className="endorsement-logos" aria-label="Jeff Berlin endorsements">
              <a
                href="https://www.cortguitars.com/artist/jeff-berlin/"
                target="_blank"
                rel="noreferrer"
                className="endorsement-logo endorsement-logo-cort"
                aria-label="Cort"
              >
                <img src="/images/cort-logo-white.svg" alt="Cort logo" />
              </a>
              <a
                href="https://markbass.it/artist/jeff-berlin/"
                target="_blank"
                rel="noreferrer"
                className="endorsement-logo endorsement-logo-markbass"
                aria-label="Markbass"
              >
                <img src="/images/markbass-logo.png" alt="Markbass logo" />
              </a>
            </div>
          </div>
        </section>
      ) : null}

      <footer className="footer">
        <div className="footer-art" aria-hidden="true">
          <img src="/images/JEFF TRANSP.avif" alt="" />
        </div>
        <div className="footer-meta">
          <nav className="footer-nav" aria-label="Footer">
            {links.map((link) =>
              link.href === "/admin" && isAdminSignedIn ? (
                <form key={link.href} action="/api/admin/logout" method="post">
                  <button type="submit" className="footer-logout-button">
                    {link.label}
                  </button>
                </form>
              ) : (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              )
            )}
          </nav>
          <div className="footer-management">
            <span>Management</span>
            <a href="mailto:exhodosmanaging@gmail.com">exhodosmanaging@gmail.com</a>
            <a href="tel:+34616724564">+34-616724564</a>
          </div>
          <p className="footer-copyright">
            © {currentYear} Jeff Berlin. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
