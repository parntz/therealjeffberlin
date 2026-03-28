import Image from "next/image";
import JeffWordmark from "../components/jeff-wordmark";
import { stats } from "../lib/site-data";

export default function HomePage() {
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
            <a href="/lessons">Lessons</a>
            <a href="/store">Store</a>
          </nav>
        </header>

        <div className="hero-copy">
          <p className="eyebrow">Electric Bass. Zero Apology.</p>
          <JeffWordmark as="h1" />
          <p className="hero-summary">
            A fearless voice in electric bass for more than four decades:
            virtuoso, composer, bandleader, educator.
          </p>
          <div className="hero-actions">
            <a href="/lessons" className="button button-primary">
              Book A Lesson
            </a>
            <a href="/store" className="button button-secondary">
              Shop The Books
            </a>
          </div>
          <div className="hero-quote">
            <span>Geddy Lee on Jeff Berlin</span>
            <p>
              “The best bass player on the planet right now. An incredible
              talent.”
            </p>
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
        <a className="home-destination-card" href="/lessons">
          <span>Lessons</span>
          <strong>Book study time and dig in</strong>
        </a>
        <a className="home-destination-card" href="/store">
          <span>Store</span>
          <strong>Buy the Bass Mastery books</strong>
        </a>
      </section>
    </main>
  );
}
