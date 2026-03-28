"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import JeffWordmark from "./jeff-wordmark";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Bio", href: "/bio" },
  { label: "Music", href: "/music" },
  { label: "Lessons", href: "/lessons" },
  { label: "Store", href: "/store" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" }
];

export default function SiteHeader() {
  const pathname = usePathname();

  if (pathname === "/") {
    return null;
  }

  return (
    <header className="site-header">
      <div className="site-header-shell">
        <Link href="/" className="site-header-logo" aria-label="Jeff Berlin home">
          <JeffWordmark className="site-header-wordmark" />
        </Link>
        <nav className="site-header-nav" aria-label="Primary">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
