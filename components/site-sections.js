import Image from "next/image";
import {
  books,
  careerMoments,
  testimonials
} from "../lib/site-data";
import { musicAlbums } from "../lib/music-data";
import MusicArchive from "./music-archive";
import LessonBooker from "./lesson-booker";

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
  const orderedAlbums = [...musicAlbums].sort((a, b) => {
    const yearDifference = Number(a.year) - Number(b.year);

    if (yearDifference !== 0) {
      return yearDifference;
    }

    return a.title.localeCompare(b.title);
  });

  return (
    <section className="music-section music-archive">
      <SectionHeading
        eyebrow="Music"
        title="Album credits worth opening up, not just scrolling past."
        body="Large cover art, direct album links, and dedicated mini case studies for records Jeff Berlin helped define."
      />
      <MusicArchive albums={orderedAlbums} />
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
          body="Use the form to request a lesson date and time. Jeff will get back to you to confirm that the slot works on his end and to arrange payment before the lesson is locked in."
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
            <strong>Request first, confirm next</strong>
            <p>Choose the day and time that works best for you, then Jeff will follow up to confirm availability and arrange payment.</p>
          </article>
        </div>
      </div>
      <div>
        <LessonBooker />
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
                <a
                  href={book.paypalHref}
                  target="_blank"
                  rel="noreferrer"
                  className="store-buy-link"
                >
                  BUY NOW
                </a>
              </div>
            </article>
          ))}
      </div>
    </section>
  );
}
