import Image from "next/image";
import { cookies } from "next/headers";
import EditableTextClient from "../components/editable-text-client";
import JeffWordmark from "../components/jeff-wordmark";
import {
  ADMIN_SESSION_COOKIE,
  readAdminSession
} from "../lib/admin-auth";
import { stats } from "../lib/site-data";
import { getSiteContentValue } from "../lib/site-content";

export default async function HomePage() {
  const cookieStore = await cookies();
  const adminSession = readAdminSession(
    cookieStore.get(ADMIN_SESSION_COOKIE)?.value || ""
  );

  return (
    <main className="page-shell">
      <section className="hero-section" id="top">
        <div className="hero-media">
          <Image
            src="/Jeff_Berlin_clean.png"
            alt="Jeff Berlin onstage holding his bass in front of an arena crowd."
            fill
            priority
            sizes="100vw"
            className="hero-image"
          />
        </div>
        <div className="hero-overlay" />
        <header className="topbar">
          <nav className="topnav">
            <a href="/bio">Bio</a>
            <a href="/music">Music</a>
            <a href="/videos">Videos</a>
            <a href="/photos">Photos</a>
            <a href="/lessons">Lessons</a>
            <a href="/contact">Contact</a>
            <a href="/store">Store</a>
          </nav>
        </header>

        <div className="hero-copy">
          <EditableTextClient
            contentId="home.hero.eyebrow"
            initialValue={getSiteContentValue("home.hero.eyebrow", "Electric Bass. Zero Apology.")}
            as="p"
            className="eyebrow"
            rows={2}
            isAdminSignedIn={Boolean(adminSession)}
          />
          <JeffWordmark as="h1" />
          <EditableTextClient
            contentId="home.hero.summary"
            initialValue={getSiteContentValue(
              "home.hero.summary",
              "A fearless voice in electric bass for more than four decades: virtuoso, composer, bandleader, educator."
            )}
            as="p"
            className="hero-summary"
            rows={4}
            isAdminSignedIn={Boolean(adminSession)}
          />
          <div className="hero-actions">
            <a href="/lessons" className="button button-primary">
              Book A Lesson
            </a>
            <a href="/store" className="button button-secondary">
              Shop The Books
            </a>
          </div>
          <div className="hero-quote">
            <EditableTextClient
              contentId="home.hero.quoteLabel"
              initialValue={getSiteContentValue("home.hero.quoteLabel", "Geddy Lee on Jeff Berlin")}
              as="span"
              rows={2}
              isAdminSignedIn={Boolean(adminSession)}
            />
            <EditableTextClient
              contentId="home.hero.quote"
              initialValue={getSiteContentValue(
                "home.hero.quote",
                "“The best bass player on the planet right now. An incredible talent.”"
              )}
              as="p"
              rows={4}
              isAdminSignedIn={Boolean(adminSession)}
            />
          </div>
        </div>

        <div className="hero-stats">
          {stats.map((stat) => (
            <article key={stat.label} className="stat-card">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </article>
          ))}
        </div>
      </section>
      <section className="home-destination-strip">
        <a className="home-destination-card" href="/bio">
          <span>Biography</span>
          <strong>Read Jeff&apos;s story</strong>
        </a>
        <a className="home-destination-card" href="/music">
          <span>Music</span>
          <strong>Explore albums and eras</strong>
        </a>
        <a className="home-destination-card" href="/videos">
          <span>Videos</span>
          <strong>Search the YouTube archive</strong>
        </a>
        <a className="home-destination-card" href="/photos">
          <span>Photos</span>
          <strong>Open the photo index</strong>
        </a>
        <a className="home-destination-card" href="/lessons">
          <span>Lessons</span>
          <strong>Book study time and dig in</strong>
        </a>
        <a className="home-destination-card" href="/store">
          <span>Store</span>
          <strong>Buy the Bass Mastery books</strong>
        </a>
        <a className="home-destination-card" href="/contact">
          <span>Contact</span>
          <strong>Send Jeff a message</strong>
        </a>
      </section>
    </main>
  );
}
