import Image from "next/image";
import Link from "next/link";
import {
  books,
  careerMoments,
  testimonials
} from "../lib/site-data";
import { musicAlbums } from "../lib/music-data";

export function SectionHeading({ eyebrow, title, body }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

export function BioSection() {
  return (
    <section className="bio-section section-grid">
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
            to work with Allan Holdsworth and Bruford, Berlin became one of the
            defining bass voices in jazz fusion and progressive music.
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
  );
}

export function MusicSection() {
  return (
    <section className="music-section music-archive">
      <SectionHeading
        eyebrow="Music"
        title="Album credits worth opening up, not just scrolling past."
        body="Large cover art, direct album links, and dedicated mini case studies for records Jeff Berlin helped define."
      />
      <div className="album-archive-grid">
        {musicAlbums.map((album) => (
          <article key={album.slug} className="album-archive-card">
            <Link href={`/music/${album.slug}`} className="album-archive-link">
              <div className="album-archive-cover">
                <Image
                  src={album.cover}
                  alt={album.alt}
                  width={500}
                  height={500}
                  sizes="(max-width: 900px) 80vw, 28vw"
                />
              </div>
              <div className="album-archive-copy">
                <div className="album-archive-meta">
                  <span>{album.year}</span>
                  <span>{album.artist}</span>
                </div>
                <h3>{album.title}</h3>
                <p>{album.cardBlurb}</p>
                <strong>Open the album study</strong>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export function LessonsSection() {
  return (
    <section className="lessons-section section-grid">
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
  );
}

export function TestimonialsSection() {
  return (
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
  );
}

export function StoreSection() {
  return (
    <section className="store-section">
      <SectionHeading
        eyebrow="Store"
        title="Start now, because the longer you wait, the longer bad habits stay in your hands."
        body="These books give you Jeff Berlin’s direct, structured path into reading, fretboard command, time, and real musicianship. If you want sharper playing and a stronger musical foundation, this is work worth starting today."
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
              <p className="store-unavailable">
                Ordering is currently unavailable on this site.
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
