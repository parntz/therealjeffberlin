import Image from "next/image";
import EditableGroup from "./editable-group";
import EditableTextClient from "./editable-text-client";
import {
  books,
  careerMoments,
  testimonials
} from "../lib/site-data";
import { musicAlbums } from "../lib/music-data";
import { mergeAlbumsWithSpotify } from "../lib/music-spotify";
import { resolveSiteContentValue } from "../lib/site-content";
import MusicArchive from "./music-archive";
import LessonBooker from "./lesson-booker";
import LessonPaymentGateway from "./lesson-payment-gateway";

function contentValue(siteContentOverrides, contentId, fallback) {
  return resolveSiteContentValue(siteContentOverrides, contentId, fallback);
}

export function SectionHeading({
  contentId,
  eyebrow,
  title,
  body,
  groupTitle,
  isAdminSignedIn = false,
  siteContentOverrides = {}
}) {
  return (
    <EditableGroup
      title={groupTitle || "Section intro"}
      isAdminSignedIn={isAdminSignedIn}
      className="section-heading"
    >
      <EditableTextClient
        contentId={`${contentId}.eyebrow`}
        initialValue={contentValue(siteContentOverrides, `${contentId}.eyebrow`, eyebrow)}
        as="p"
        className="eyebrow"
        rows={2}
        isAdminSignedIn={isAdminSignedIn}
        editLabel="Eyebrow"
      />
      <EditableTextClient
        contentId={`${contentId}.title`}
        initialValue={contentValue(siteContentOverrides, `${contentId}.title`, title)}
        as="h2"
        rows={3}
        isAdminSignedIn={isAdminSignedIn}
        editLabel="Title"
      />
      <EditableTextClient
        contentId={`${contentId}.body`}
        initialValue={contentValue(siteContentOverrides, `${contentId}.body`, body)}
        as="p"
        rows={5}
        isAdminSignedIn={isAdminSignedIn}
        editLabel="Body"
      />
    </EditableGroup>
  );
}

export function BioSection({ isAdminSignedIn = false, siteContentOverrides = {} }) {
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
          contentId="bio.section"
          eyebrow="Biography"
          title="A career built on melodic force, fearless clarity, and serious musicianship."
          body="Jeff Berlin was born in Queens, New York on January 17, 1953. He studied violin as a child, switched to bass after hearing the Beatles, and went on to study at Berklee before breaking out internationally in Bill Bruford’s band in the late 1970s."
          groupTitle="Biography — section intro"
          isAdminSignedIn={isAdminSignedIn}
          siteContentOverrides={siteContentOverrides}
        />
        <div className="bio-columns">
          <EditableGroup
            title="Biography — columns"
            isAdminSignedIn={isAdminSignedIn}
            className="bio-columns-editable"
          >
            <EditableTextClient
              contentId="bio.column.1"
              initialValue={contentValue(
                siteContentOverrides,
                "bio.column.1",
                "From sessions with Patrick Moraz, David Liebman, and Patti Austin to work with Allan Holdsworth and Bruford, Berlin became one of the defining bass voices in jazz fusion and progressive music."
              )}
              as="p"
              rows={5}
              isAdminSignedIn={isAdminSignedIn}
              editLabel="Left column"
            />
            <EditableTextClient
              contentId="bio.column.2"
              initialValue={contentValue(
                siteContentOverrides,
                "bio.column.2",
                "His sound is precise, vocal, and unapologetically melodic. His teaching is just as direct: reading, harmony, time, and musicianship before shortcuts."
              )}
              as="p"
              rows={5}
              isAdminSignedIn={isAdminSignedIn}
              editLabel="Right column"
            />
          </EditableGroup>
        </div>
        <div className="timeline">
          {careerMoments.map((moment, index) => (
            <article key={moment.year} className="timeline-card">
              <span>{moment.year}</span>
              <EditableGroup
                title={`Career timeline — ${moment.year}`}
                isAdminSignedIn={isAdminSignedIn}
                className="timeline-card-editable"
              >
                <EditableTextClient
                  contentId={`bio.timeline.${index}.title`}
                  initialValue={contentValue(
                    siteContentOverrides,
                    `bio.timeline.${index}.title`,
                    moment.title
                  )}
                  as="h3"
                  rows={2}
                  isAdminSignedIn={isAdminSignedIn}
                  editLabel="Title"
                />
                <EditableTextClient
                  contentId={`bio.timeline.${index}.body`}
                  initialValue={contentValue(
                    siteContentOverrides,
                    `bio.timeline.${index}.body`,
                    moment.body
                  )}
                  as="p"
                  rows={4}
                  isAdminSignedIn={isAdminSignedIn}
                  editLabel="Description"
                />
              </EditableGroup>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export async function MusicSection({ isAdminSignedIn = false, siteContentOverrides = {} }) {
  const orderedAlbums = [...musicAlbums].sort((a, b) => {
    const yearDifference = Number(a.year) - Number(b.year);

    if (yearDifference !== 0) {
      return yearDifference;
    }

    return a.title.localeCompare(b.title);
  });
  const spotifyAlbums = await mergeAlbumsWithSpotify(orderedAlbums);
  return (
    <section className="music-section music-archive">
      <div className="music-section-header">
        <div className="music-heading-shell">
          <SectionHeading
            contentId="music.section"
            eyebrow="Music"
            title="Albums, credits, and liner notes from across Jeff Berlin's recorded work."
            body="Large cover art, direct album links, and focused notes on solo records, collaborations, and credited appearances."
            groupTitle="Music — section intro"
            isAdminSignedIn={isAdminSignedIn}
            siteContentOverrides={siteContentOverrides}
          />
        </div>
      </div>
      <MusicArchive albums={spotifyAlbums} isAdminSignedIn={isAdminSignedIn} />
    </section>
  );
}

export function LessonsSection({ isAdminSignedIn = false, siteContentOverrides = {} }) {
  return (
    <section className="lessons-section section-grid">
      <div className="lessons-copy">
        <SectionHeading
          contentId="lessons.section"
          eyebrow="Lessons"
          title="Book Jeff for focused, high-standard bass study."
          body="Use the form to request a lesson date and time, or pay directly with PayPal at $150 per lesson. Students who want to prepay multiple lessons can set the quantity and let the site calculate the total."
          groupTitle="Lessons — section intro"
          isAdminSignedIn={isAdminSignedIn}
          siteContentOverrides={siteContentOverrides}
        />
        <EditableGroup
          title="Lessons — highlight cards"
          isAdminSignedIn={isAdminSignedIn}
          className="lesson-points"
        >
          <article>
            <EditableTextClient
              contentId="lessons.points.0.title"
              initialValue={contentValue(
                siteContentOverrides,
                "lessons.points.0.title",
                "Structured study"
              )}
              as="strong"
              rows={2}
              isAdminSignedIn={isAdminSignedIn}
              editLabel="Card 1 — title"
            />
            <EditableTextClient
              contentId="lessons.points.0.body"
              initialValue={contentValue(
                siteContentOverrides,
                "lessons.points.0.body",
                "Reading-centered development built to sharpen your ears, hands, and mind together."
              )}
              as="p"
              rows={4}
              isAdminSignedIn={isAdminSignedIn}
              editLabel="Card 1 — body"
            />
          </article>
          <article>
            <EditableTextClient
              contentId="lessons.points.1.title"
              initialValue={contentValue(
                siteContentOverrides,
                "lessons.points.1.title",
                "All levels welcome"
              )}
              as="strong"
              rows={2}
              isAdminSignedIn={isAdminSignedIn}
              editLabel="Card 2 — title"
            />
            <EditableTextClient
              contentId="lessons.points.1.body"
              initialValue={contentValue(
                siteContentOverrides,
                "lessons.points.1.body",
                "From committed beginners to experienced players trying to break through old habits."
              )}
              as="p"
              rows={4}
              isAdminSignedIn={isAdminSignedIn}
              editLabel="Card 2 — body"
            />
          </article>
          <article>
            <EditableTextClient
              contentId="lessons.points.2.title"
              initialValue={contentValue(
                siteContentOverrides,
                "lessons.points.2.title",
                "Pay one or many"
              )}
              as="strong"
              rows={2}
              isAdminSignedIn={isAdminSignedIn}
              editLabel="Card 3 — title"
            />
            <EditableTextClient
              contentId="lessons.points.2.body"
              initialValue={contentValue(
                siteContentOverrides,
                "lessons.points.2.body",
                "Use the PayPal panel to pay for a single lesson or prepay multiple lessons at $150 each."
              )}
              as="p"
              rows={4}
              isAdminSignedIn={isAdminSignedIn}
              editLabel="Card 3 — body"
            />
          </article>
        </EditableGroup>
      </div>
      <div className="lessons-actions">
        <LessonBooker
          isAdminSignedIn={isAdminSignedIn}
          copy={{
            eyebrow: contentValue(
              siteContentOverrides,
              "lessons.booker.eyebrow",
              "Private Study"
            ),
            title: contentValue(
              siteContentOverrides,
              "lessons.booker.title",
              "Choose a day, claim a slot, send the request."
            ),
            intro: contentValue(
              siteContentOverrides,
              "lessons.booker.intro",
              "Pick the day and time that works best for you, then send the request. Jeff will follow up to confirm that the slot works for him and to arrange payment before the lesson is finalized."
            )
          }}
        />
        <LessonPaymentGateway
          isAdminSignedIn={isAdminSignedIn}
          copy={{
            eyebrow: contentValue(
              siteContentOverrides,
              "lessons.payment.eyebrow",
              "Pay Online"
            ),
            title: contentValue(
              siteContentOverrides,
              "lessons.payment.title",
              "Lock in one lesson or stack a few at once."
            ),
            body: contentValue(
              siteContentOverrides,
              "lessons.payment.body",
              "Each lesson is $150. Choose the quantity and jump straight to PayPal."
            )
          }}
        />
      </div>
    </section>
  );
}

export function TestimonialsSection({ isAdminSignedIn = false, siteContentOverrides = {} }) {
  return (
    <section className="testimonials-section">
      <SectionHeading
        contentId="testimonials.section"
        eyebrow="Student Response"
        title="The books work because the musical standards are high."
        body="Jeff’s current educational catalog emphasizes sequential reading work, neck knowledge, rhythm, and practical musicianship. The student response on his official education pages is overwhelmingly consistent: measurable progress."
        groupTitle="Testimonials — section intro"
        isAdminSignedIn={isAdminSignedIn}
        siteContentOverrides={siteContentOverrides}
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

export function StoreSection({ isAdminSignedIn = false, siteContentOverrides = {} }) {
  return (
    <section className="store-section store-layout">
      <div className="store-copy">
        <SectionHeading
          contentId="store.section"
          eyebrow="Store"
          title="Start now, because the longer you wait, the longer bad habits stay in your hands."
          body="These books give you Jeff Berlin’s direct, structured path into reading, fretboard command, time, and real musicianship. If you want sharper playing and a stronger musical foundation, this is work worth starting today."
          groupTitle="Store — section intro"
          isAdminSignedIn={isAdminSignedIn}
          siteContentOverrides={siteContentOverrides}
        />
      </div>
      <div className="store-grid">
        {books.map((book) => (
          <article key={book.id} className="store-card">
            <div className="store-card-image">
              <Image
                src={book.image}
                alt={book.title}
                width={book.width}
                height={book.height}
                sizes="(max-width: 900px) 80vw, 18vw"
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
