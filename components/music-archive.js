"use client";

import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useState } from "react";

function buildAlbumSearchText(album) {
  return [
    album.title,
    album.artist,
    album.year,
    album.format,
    album.jeffRole,
    album.cardBlurb,
    album.intro,
    ...(album.snapshot || []),
    ...(album.caseStudy || []),
    ...((album.highlights || []).flatMap((item) => [item.title, item.body])),
    ...((album.trackMoments || []).flatMap((item) => [item.title, item.body]))
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export default function MusicArchive({ albums, isAdminSignedIn = false }) {
  const [query, setQuery] = useState("");
  const [eligibilityBySlug, setEligibilityBySlug] = useState(() =>
    Object.fromEntries(
      albums
        .filter((album) => album.spotifyUrl)
        .map((album) => [album.slug, album.spotifyFeaturedEligible !== false])
    )
  );
  const [savingSlug, setSavingSlug] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();

  useEffect(() => {
    setEligibilityBySlug(
      Object.fromEntries(
        albums
          .filter((album) => album.spotifyUrl)
          .map((album) => [album.slug, album.spotifyFeaturedEligible !== false])
      )
    );
  }, [albums]);

  const filteredAlbums = albums.filter((album) => {
    if (!normalizedQuery) {
      return true;
    }

    return buildAlbumSearchText(album).includes(normalizedQuery);
  });

  async function toggleFeaturedEligibility(slug) {
    const nextValue = !(eligibilityBySlug[slug] !== false);
    setSavingSlug(slug);

    startTransition(() => {
      setEligibilityBySlug((current) => ({
        ...current,
        [slug]: nextValue
      }));
    });

    try {
      const response = await fetch("/api/music/featured", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ slug, eligible: nextValue })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Update failed.");
      }
    } catch (error) {
      startTransition(() => {
        setEligibilityBySlug((current) => ({
          ...current,
          [slug]: !nextValue
        }));
      });

      window.alert(error instanceof Error ? error.message : "Update failed.");
    } finally {
      setSavingSlug("");
    }
  }

  return (
    <>
      <div className="music-search-shell">
        <label className="music-search-label" htmlFor="music-search">
          Search by album, artist, or credited musician
        </label>
        <div className="music-search-frame">
          <input
            id="music-search"
            name="music-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try Road Games, Bruford, Jeff Berlin, Holdsworth..."
            className="music-search-input"
          />
          <span className="music-search-count">
            {filteredAlbums.length} shown
          </span>
        </div>
      </div>

      <div className="album-archive-grid">
        {filteredAlbums.map((album) => (
          <article key={album.slug} className="album-archive-card">
            {isAdminSignedIn && album.spotifyUrl ? (
              <div className="album-card-admin">
                <button
                  type="button"
                  className={`album-feature-toggle${
                    eligibilityBySlug[album.slug] !== false ? " is-active" : ""
                  }`}
                  onClick={() => toggleFeaturedEligibility(album.slug)}
                  disabled={savingSlug === album.slug}
                >
                  {savingSlug === album.slug
                    ? "Saving..."
                    : eligibilityBySlug[album.slug] !== false
                      ? "Featured Album: On"
                      : "Featured Album: Off"}
                </button>
              </div>
            ) : null}
            <Link href={`/music/${album.slug}`} className="album-archive-link">
              <div className="album-archive-cover">
                {album.cover ? (
                  <img src={album.cover} alt={album.alt || album.title} />
                ) : (
                  <div className="album-placeholder">
                    <span>{album.year}</span>
                    <strong>{album.title}</strong>
                    <em>{album.artist}</em>
                  </div>
                )}
              </div>
              <div className="album-archive-copy">
                <div className="album-archive-meta">
                  <span>{album.year}</span>
                  <span>{album.artist}</span>
                  {album.spotifyUrl ? <span>Spotify</span> : null}
                </div>
                <h3>{album.title}</h3>
                <p>{album.cardBlurb}</p>
                <strong>Open the album study</strong>
              </div>
            </Link>
          </article>
        ))}
      </div>

      {!filteredAlbums.length ? (
        <div className="music-search-empty">
          <strong>No matches.</strong>
          <p>Try a different album title or artist name.</p>
        </div>
      ) : null}
    </>
  );
}
