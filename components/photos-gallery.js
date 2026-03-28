"use client";

import { useEffect, useState } from "react";

export default function PhotosGallery({ photos, isAdminSignedIn = false }) {
  const [galleryPhotos, setGalleryPhotos] = useState(photos);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editSource, setEditSource] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [savingId, setSavingId] = useState(null);

  const lightboxPhoto = lightboxIndex === null ? null : galleryPhotos[lightboxIndex];

  useEffect(() => {
    setGalleryPhotos(photos);
  }, [photos]);

  function openLightbox(index) {
    setLightboxIndex(index);
  }

  function closeLightbox() {
    setLightboxIndex(null);
  }

  function beginEdit(photo) {
    setEditingId(photo.id);
    setEditTitle(photo.title);
    setEditSource(photo.source || "");
    setEditDescription(photo.description || photo.note || "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTitle("");
    setEditSource("");
    setEditDescription("");
  }

  function showPrevious() {
    setLightboxIndex((current) =>
      current === null ? current : (current - 1 + galleryPhotos.length) % galleryPhotos.length
    );
  }

  function showNext() {
    setLightboxIndex((current) =>
      current === null ? current : (current + 1) % galleryPhotos.length
    );
  }

  async function deletePhoto(photoId, imagePath) {
    if (!imagePath || deletingId) {
      return;
    }

    setDeletingId(photoId);

    try {
      const response = await fetch("/api/photos/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image: imagePath })
      });

      if (!response.ok) {
        throw new Error("Delete failed.");
      }

      setGalleryPhotos((current) => {
        const next = current.filter((photo) => photo.id !== photoId);

        setLightboxIndex((index) => {
          if (index === null) {
            return index;
          }

          const deletedIndex = current.findIndex((photo) => photo.id === photoId);

          if (deletedIndex === -1) {
            return index;
          }

          if (!next.length) {
            return null;
          }

          if (index === deletedIndex) {
            return Math.min(deletedIndex, next.length - 1);
          }

          if (index > deletedIndex) {
            return index - 1;
          }

          return index;
        });

        return next;
      });
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Delete failed.");
    } finally {
      setDeletingId(null);
    }
  }

  async function savePhoto(photo) {
    if (!photo.imagePath || savingId) {
      return;
    }

    setSavingId(photo.id);

    try {
      const response = await fetch("/api/photos/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          image: photo.imagePath,
          title: editTitle,
          source: editSource,
          description: editDescription
        })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Save failed.");
      }

      setGalleryPhotos((current) =>
        current.map((entry) =>
          entry.id === photo.id
            ? {
                ...entry,
                title: payload.title,
                source: payload.source,
                note: payload.description,
                description: payload.description
              }
            : entry
        )
      );
      cancelEdit();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSavingId(null);
    }
  }

  useEffect(() => {
    if (lightboxIndex === null) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeydown(event) {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    window.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [galleryPhotos.length, lightboxIndex]);

  return (
    <>
      <section className="photos-gallery-shell" aria-label="Jeff Berlin photo gallery">
        <div className="photos-thumb-rail" aria-label="Photo thumbnails">
          {galleryPhotos.map((photo, index) => (
            <article key={photo.id} className="photos-thumb">
              <button type="button" className="photos-thumb-launch" onClick={() => openLightbox(index)}>
              <div className={`photos-thumb-image${photo.image.endsWith(".png") ? " is-clean" : ""}`}>
                <img src={photo.image} alt={photo.alt} />
              </div>
              <div className="photos-thumb-copy">
                <span>{photo.source || photo.year}</span>
                <strong>{photo.title}</strong>
              </div>
              </button>
              {isAdminSignedIn ? (
                <div className="photos-admin-actions">
                  <button
                    type="button"
                    className="photos-edit-button"
                    onClick={() => beginEdit(photo)}
                    disabled={savingId === photo.id}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="photos-delete-button"
                    onClick={() => deletePhoto(photo.id, photo.imagePath)}
                    disabled={deletingId === photo.id}
                  >
                    {deletingId === photo.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              ) : null}
              {isAdminSignedIn && editingId === photo.id ? (
                <div className="photos-edit-form">
                  <label className="photos-edit-field">
                    <span>Title</span>
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(event) => setEditTitle(event.target.value)}
                    />
                  </label>
                  <label className="photos-edit-field">
                    <span>Source</span>
                    <input
                      type="text"
                      value={editSource}
                      onChange={(event) => setEditSource(event.target.value)}
                    />
                  </label>
                  <label className="photos-edit-field">
                    <span>Description</span>
                    <textarea
                      rows={4}
                      value={editDescription}
                      onChange={(event) => setEditDescription(event.target.value)}
                    />
                  </label>
                  <div className="photos-edit-actions">
                    <button
                      type="button"
                      className="photos-edit-save"
                      onClick={() => savePhoto(photo)}
                      disabled={savingId === photo.id}
                    >
                      {savingId === photo.id ? "Saving..." : "Save"}
                    </button>
                    <button
                      type="button"
                      className="photos-edit-cancel"
                      onClick={cancelEdit}
                      disabled={savingId === photo.id}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      {lightboxPhoto ? (
        <div
          className="photos-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${lightboxPhoto.title} lightbox`}
          onClick={closeLightbox}
        >
          <div className="photos-lightbox-panel" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="photos-lightbox-close"
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              Close
            </button>
            <button
              type="button"
              className="photos-lightbox-nav is-prev"
              onClick={showPrevious}
              aria-label="Previous photo"
            >
              <span aria-hidden="true">‹</span>
            </button>
            <button
              type="button"
              className="photos-lightbox-nav is-next"
              onClick={showNext}
              aria-label="Next photo"
            >
              <span aria-hidden="true">›</span>
            </button>
            <div className={`photos-lightbox-image${lightboxPhoto.image.endsWith(".png") ? " is-clean" : ""}`}>
              <img src={lightboxPhoto.image} alt={lightboxPhoto.alt} />
            </div>
            <div className="photos-lightbox-caption">
              <span>{lightboxPhoto.source || lightboxPhoto.year}</span>
              <strong>{lightboxPhoto.title}</strong>
              {lightboxPhoto.description ? (
                <p>{lightboxPhoto.description}</p>
              ) : null}
              {isAdminSignedIn ? (
                <>
                  <div className="photos-admin-actions is-lightbox">
                    <button
                      type="button"
                      className="photos-edit-button"
                      onClick={() => beginEdit(lightboxPhoto)}
                      disabled={savingId === lightboxPhoto.id}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="photos-delete-button is-lightbox"
                      onClick={() => deletePhoto(lightboxPhoto.id, lightboxPhoto.imagePath)}
                      disabled={deletingId === lightboxPhoto.id}
                    >
                      {deletingId === lightboxPhoto.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                  {editingId === lightboxPhoto.id ? (
                    <div className="photos-edit-form is-lightbox">
                      <label className="photos-edit-field">
                        <span>Title</span>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(event) => setEditTitle(event.target.value)}
                        />
                      </label>
                      <label className="photos-edit-field">
                        <span>Source</span>
                        <input
                          type="text"
                          value={editSource}
                          onChange={(event) => setEditSource(event.target.value)}
                        />
                      </label>
                      <label className="photos-edit-field">
                        <span>Description</span>
                        <textarea
                          rows={4}
                          value={editDescription}
                          onChange={(event) => setEditDescription(event.target.value)}
                        />
                      </label>
                      <div className="photos-edit-actions">
                        <button
                          type="button"
                          className="photos-edit-save"
                          onClick={() => savePhoto(lightboxPhoto)}
                          disabled={savingId === lightboxPhoto.id}
                        >
                          {savingId === lightboxPhoto.id ? "Saving..." : "Save"}
                        </button>
                        <button
                          type="button"
                          className="photos-edit-cancel"
                          onClick={cancelEdit}
                          disabled={savingId === lightboxPhoto.id}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
