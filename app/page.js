import Image from "next/image";
import CheckoutButton from "../components/checkout-button";
import {
  albums,
  books,
  careerMoments,
  stats,
  testimonials
} from "../lib/site-data";

function SectionHeading({ eyebrow, title, body }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

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
            <a href="#bio">Bio</a>
            <a href="#music">Music</a>
            <a href="#lessons">Lessons</a>
            <a href="#store">Store</a>
          </nav>
        </header>

        <div className="hero-copy">
          <p className="eyebrow">Electric Bass. Zero Apology.</p>
          <h1>
            JEFF
            <span>BERLIN</span>
          </h1>
          <p className="hero-summary">
            A fearless voice in electric bass for more than four decades:
            virtuoso, composer, bandleader, educator.
          </p>
          <div className="hero-actions">
            <a href="#lessons" className="button button-primary">
              Book A Lesson
            </a>
            <a href="#store" className="button button-secondary">
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

      <section className="bio-section section-grid" id="bio">
        <div className="bio-visual">
          <div className="bio-photo-frame">
            <Image
              src="/images/jeff-live-2007.jpg"
              alt="Jeff Berlin performing live in 2007."
              width={462}
              height={800}
              sizes="(max-width: 900px) 80vw, 36vw"
            />
          </div>
        </div>
        <div className="bio-copy">
          <SectionHeading
            eyebrow="Biography"
            title="A career built on melodic force, fearless clarity, and serious musicianship."
            body="Jeff Berlin was born in Queens, New York on January 17, 1953. He studied violin as a child, switched to bass after hearing the Beatles, and went on to study at Berklee before breaking out internationally in Bill Bruford’s band in the late 1970s."
          />
          <div className="bio-columns">
            <p>
              From sessions with Patrick Moraz, David Liebman, and Patti Austin
              to work with Allan Holdsworth and Bruford, Berlin became one of
              the defining bass voices in jazz fusion and progressive music.
            </p>
            <p>
              His sound is precise, vocal, and unapologetically melodic. His
              teaching is just as direct: reading, harmony, time, and
              musicianship before shortcuts.
            </p>
          </div>
          <div className="timeline">
            {careerMoments.map((moment) => (
              <article key={moment.year} className="timeline-card">
                <span>{moment.year}</span>
                <h3>{moment.title}</h3>
                <p>{moment.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="music-section" id="music">
        <SectionHeading
          eyebrow="Music"
          title="Albums, sessions, and a bass language that changed the conversation."
          body="Berlin’s catalog runs from fusion landmarks to solo records and modern educational releases, always with the same signature: tone, authority, and melodic intent."
        />
        <div className="album-grid">
          {albums.map((album) => (
            <article key={album.title} className="album-card">
              <span>{album.year}</span>
              <h3>{album.title}</h3>
              <p>{album.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="lessons-section section-grid" id="lessons">
        <div className="lessons-copy">
          <SectionHeading
            eyebrow="Lessons"
            title="Book Jeff for focused, high-standard bass study."
            body="The lesson philosophy follows the same discipline Jeff is known for worldwide: reading fluency, harmonic depth, stronger time, and musical clarity that actually transfers to the bandstand."
          />
          <div className="lesson-points">
            <article>
              <strong>Structured study</strong>
              <p>Reading-centered development built to sharpen your ears, hands, and mind together.</p>
            </article>
            <article>
              <strong>All levels welcome</strong>
              <p>From committed beginners to experienced players trying to break through old habits.</p>
            </article>
            <article>
              <strong>Direct booking</strong>
              <p>Calendly is embedded below. Add Jeff’s live scheduling URL in the environment and the widget is ready.</p>
            </article>
          </div>
        </div>
        <div className="calendly-shell">
          <div className="calendly-panel">
            <iframe
              title="Book a lesson with Jeff Berlin"
              src={`${process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/your-handle/book-a-lesson"}?hide_event_type_details=1&hide_gdpr_banner=1`}
              className="calendly-frame"
            />
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <SectionHeading
          eyebrow="Student Response"
          title="The books work because the musical standards are high."
          body="Jeff’s current educational catalog emphasizes sequential reading work, neck knowledge, rhythm, and practical musicianship. The student response on his official education pages is overwhelmingly consistent: measurable progress."
        />
        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="testimonial-card">
              <p>{item.quote}</p>
              <footer>{item.name}</footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="store-section" id="store">
        <SectionHeading
          eyebrow="Store"
          title="Jeff Berlin Bass Mastery books, wired for Stripe checkout."
          body="The products below mirror Jeff’s active educational offers and route into Stripe Checkout. Add your live Stripe secret key and launch."
        />
        <div className="store-grid">
          {books.map((book) => (
            <article key={book.id} className="store-card">
              <div className="store-card-image">
                <Image
                  src={book.image}
                  alt={book.title}
                  width={book.width}
                  height={book.height}
                  sizes="(max-width: 900px) 80vw, 25vw"
                />
              </div>
              <div className="store-card-copy">
                <div className="store-card-header">
                  <span>{book.format}</span>
                  <strong>{book.priceLabel}</strong>
                </div>
                <h3>{book.title}</h3>
                <p>{book.description}</p>
                <CheckoutButton productId={book.id} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="footer-logo">
          <Image
            src="/images/logo-transparent-test.png"
            alt="Jeff Berlin logo"
            width={300}
            height={107}
          />
        </div>
        <div className="footer-copy">
          <p>Jeff Berlin Bass Mastery</p>
          <a href="tel:6466941098">646-694-1098</a>
        </div>
      </footer>
    </main>
  );
}
