"use client";

import { useDeferredValue, useEffect, useState } from "react";
import EditableTextClient from "./editable-text-client";

function makeSearchText(video) {
  return [video.title, video.description, video.transcript?.text ?? ""]
    .join("\n")
    .toLowerCase();
}

function thumbnailAspectRatio(video) {
  if (video.customThumbnailUrl) {
    return "16 / 9";
  }

  if (video.thumbnailWidth && video.thumbnailHeight) {
    return `${video.thumbnailWidth} / ${video.thumbnailHeight}`;
  }

  if (video.mediaType === "short") {
    return "9 / 16";
  }

  return "16 / 9";
}

function thumbnailSource(video) {
  return video.customThumbnailUrl || video.thumbnailUrl;
}

export default function VideosLibrary({
  videos,
  channelUrl,
  fetchedAt,
  collections = [],
  copy,
  isAdminSignedIn = false
}) {
  const [query, setQuery] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const filteredVideos = videos.filter((video) => {
    if (!normalizedQuery) {
      return true;
    }

    return makeSearchText(video).includes(normalizedQuery);
  });
  const lightboxVideo = lightboxIndex === null ? null : filteredVideos[lightboxIndex];

  useEffect(() => {
    if (lightboxIndex === null) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeydown(event) {
      if (event.key === "Escape") {
        setLightboxIndex(null);
      }

      if (event.key === "ArrowLeft") {
        setLightboxIndex((current) =>
          current === null ? null : (current - 1 + filteredVideos.length) % filteredVideos.length
        );
      }

      if (event.key === "ArrowRight") {
        setLightboxIndex((current) =>
          current === null ? null : (current + 1) % filteredVideos.length
        );
      }
    }

    window.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [filteredVideos.length, lightboxIndex]);

  useEffect(() => {
    setLightboxIndex((current) => {
      if (current === null) {
        return null;
      }

      if (!filteredVideos.length) {
        return null;
      }

      return Math.min(current, filteredVideos.length - 1);
    });
  }, [filteredVideos]);

  function showPrevious() {
    setLightboxIndex((current) =>
      current === null ? null : (current - 1 + filteredVideos.length) % filteredVideos.length
    );
  }

  function showNext() {
    setLightboxIndex((current) =>
      current === null ? null : (current + 1) % filteredVideos.length
    );
  }

  return (
    <section className="videos-page">
      <div className="videos-shell">
        <div className="videos-hero">
          <div className="videos-hero-copy">
            <EditableTextClient
              contentId="videos.hero.eyebrow"
              initialValue={copy.eyebrow}
              as="p"
              className="eyebrow"
              rows={2}
              isAdminSignedIn={isAdminSignedIn}
            />
            <EditableTextClient
              contentId="videos.hero.title"
              initialValue={copy.title}
              as="h1"
              rows={3}
              isAdminSignedIn={isAdminSignedIn}
            />
            <EditableTextClient
              contentId="videos.hero.body"
              initialValue={copy.body}
              as="p"
              rows={5}
              isAdminSignedIn={isAdminSignedIn}
            />
          </div>
          <div className="videos-search-panel">
            <label className="videos-search-label" htmlFor="videos-search">
              Search the video archive
            </label>
            <input
              id="videos-search"
              className="videos-search-input"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try: Jaco, groove, Berklee, harmony, slap..."
            />
            <div className="videos-search-meta">
              <span>
                {filteredVideos.length} of {videos.length} videos
              </span>
              {collections.length ? (
                <span>
                  {collections.map((collection) => `${collection.label}: ${collection.count}`).join(" • ")}
                </span>
              ) : null}
              <span>Synced {new Date(fetchedAt).toLocaleDateString()}</span>
              <a href={channelUrl} target="_blank" rel="noreferrer">
                View channel
              </a>
            </div>
          </div>
        </div>

        <div className="videos-thumb-rail">
          {filteredVideos.length ? (
            filteredVideos.map((video, index) => (
              <article key={video.id} className="video-thumb">
                <button
                  type="button"
                  className="video-thumb-launch"
                  onClick={() => setLightboxIndex(index)}
                >
                  <div
                    className="video-thumb-image"
                    style={{ "--video-thumb-ratio": thumbnailAspectRatio(video) }}
                  >
                    <img src={thumbnailSource(video)} alt={video.title} loading="lazy" />
                    <span className="video-thumb-play" aria-hidden="true">
                      Play
                    </span>
                  </div>
                  <div className="video-thumb-copy">
                    <span>
                      {video.collectionLabel} · {video.publishedAt ?? "Unknown date"}
                    </span>
                    <strong>{video.title}</strong>
                    <em>{video.durationString ?? "Unknown length"}</em>
                  </div>
                </button>
              </article>
            ))
          ) : (
            <div className="video-card">
              <div className="video-card-copy">
                <div className="video-card-meta">
                  <span>No matches</span>
                </div>
                <EditableTextClient
                  contentId="videos.empty.title"
                  initialValue={copy.emptyTitle}
                  as="h2"
                  rows={2}
                  isAdminSignedIn={isAdminSignedIn}
                />
                <EditableTextClient
                  contentId="videos.empty.body"
                  initialValue={copy.emptyBody}
                  as="p"
                  rows={3}
                  isAdminSignedIn={isAdminSignedIn}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {lightboxVideo ? (
        <div
          className="videos-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${lightboxVideo.title} video player`}
          onClick={() => setLightboxIndex(null)}
        >
          <div className="videos-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="videos-lightbox-close"
              onClick={() => setLightboxIndex(null)}
              aria-label="Close video player"
            >
              Close
            </button>
            {filteredVideos.length > 1 ? (
              <>
                <button
                  type="button"
                  className="videos-lightbox-nav is-prev"
                  onClick={showPrevious}
                  aria-label="Previous video"
                >
                  <span aria-hidden="true">‹</span>
                </button>
                <button
                  type="button"
                  className="videos-lightbox-nav is-next"
                  onClick={showNext}
                  aria-label="Next video"
                >
                  <span aria-hidden="true">›</span>
                </button>
              </>
            ) : null}
            <div className="videos-lightbox-frame">
              <iframe
                src={`${lightboxVideo.embedUrl}?autoplay=1&rel=0`}
                title={lightboxVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
            <div className="video-card-copy is-lightbox">
              <div className="video-card-meta">
                <span>{lightboxVideo.collectionLabel}</span>
                <span>{lightboxVideo.publishedAt ?? "Unknown date"}</span>
                <span>{lightboxVideo.durationString ?? "Unknown length"}</span>
              </div>
              <h2>{lightboxVideo.title}</h2>
              {lightboxVideo.description ? <p>{lightboxVideo.description}</p> : null}
              <a
                href={lightboxVideo.url}
                target="_blank"
                rel="noreferrer"
                className="video-watch-link"
              >
                Watch on YouTube
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
