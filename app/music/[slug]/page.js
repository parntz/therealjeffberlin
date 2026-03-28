import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { musicAlbums, musicAlbumsBySlug } from "../../../lib/music-data";

export function generateStaticParams() {
  return musicAlbums.map((album) => ({ slug: album.slug }));
}

export function generateMetadata({ params }) {
  const album = musicAlbumsBySlug[params.slug];

  if (!album) {
    return {
      title: "Album Not Found | Jeff Berlin"
    };
  }

  return {
    title: `${album.title} | Jeff Berlin Music`,
    description: `${album.title} (${album.year}) with Jeff Berlin on ${album.jeffRole.toLowerCase()}.`
  };
}

export default function AlbumPage({ params }) {
  const album = musicAlbumsBySlug[params.slug];

  if (!album) {
    notFound();
  }

  return (
    <main className="page-shell">
      <article className="album-study">
        <section className="album-study-hero">
          <Link href="/music" className="album-study-back">
            Back to Music
          </Link>
          <div className="album-study-grid">
            <div className="album-study-cover">
              <Image
                src={album.cover}
                alt={album.alt}
                width={500}
                height={500}
                sizes="(max-width: 900px) 85vw, 34vw"
              />
            </div>
            <div className="album-study-copy">
              <p className="eyebrow">Album Case Study</p>
              <h1>{album.title}</h1>
              <p className="album-study-dek">{album.intro}</p>
              <div className="album-study-meta">
                <span>{album.artist}</span>
                <span>{album.year}</span>
                <span>{album.format}</span>
                <span>Jeff: {album.jeffRole}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="album-study-section album-study-split">
          <div className="album-study-panel">
            <h2>Why It Matters</h2>
            <div className="album-study-prose">
              {album.caseStudy.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="album-study-panel">
            <h2>Quick Snapshot</h2>
            <ul className="album-study-list">
              {album.snapshot.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="album-study-section">
          <div className="album-detail-grid">
            {album.highlights.map((item) => (
              <article key={item.title} className="album-detail-card">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="album-study-section">
          <div className="album-study-panel">
            <h2>Listen For</h2>
            <div className="album-detail-grid album-detail-grid-compact">
              {album.trackMoments.map((item) => (
                <article key={item.title} className="album-detail-card">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="album-study-section">
          <div className="album-study-panel">
            <h2>Sources</h2>
            <div className="album-source-list">
              {album.sources.map((source) => (
                <a
                  key={source.href}
                  href={source.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {source.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </article>
    </main>
  );
}
