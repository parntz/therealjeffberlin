"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useState
} from "react";
import { createPortal } from "react-dom";

export const EditableGroupContext = createContext(null);

export default function EditableGroup({
  title,
  children,
  isAdminSignedIn = false,
  className = ""
}) {
  const [fields, setFields] = useState(() => new Map());
  const [modalOpen, setModalOpen] = useState(false);
  const [drafts, setDrafts] = useState({});
  const [saving, setSaving] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const headingId = useId();
  const formBaseId = useId();

  const registerField = useCallback((fieldKey, spec) => {
    setFields((prev) => new Map(prev).set(fieldKey, spec));
    return () => {
      setFields((prev) => {
        const next = new Map(prev);
        next.delete(fieldKey);
        return next;
      });
    };
  }, []);

  const ctx = useMemo(() => {
    if (!isAdminSignedIn) {
      return null;
    }
    return { registerField };
  }, [isAdminSignedIn, registerField]);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!modalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeModal();
      }
    }

    window.addEventListener("keydown", onKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeydown);
    };
  }, [modalOpen]);

  function openModal() {
    const nextDrafts = {};
    for (const spec of fields.values()) {
      nextDrafts[spec.contentId] = spec.getValue();
    }
    setDrafts(nextDrafts);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  async function saveAll() {
    if (!fields.size) {
      return;
    }

    const fieldList = Array.from(fields.values());

    setSaving(true);

    try {
      const batch = fieldList.map((spec) => ({
        contentId: spec.contentId,
        value: drafts[spec.contentId] ?? ""
      }));

      const response = await fetch("/api/content/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ batch })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Save failed.");
      }

      const results = payload.results || [];

      for (const row of results) {
        for (const spec of fieldList) {
          if (spec.contentId === row.contentId) {
            spec.setValue(row.value);
          }
        }
      }

      setModalOpen(false);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const showOverlay = Boolean(
    isAdminSignedIn && ctx && fields.size > 0
  );

  const lightbox =
    portalReady && modalOpen && fields.size > 0
      ? createPortal(
          <div
            className="content-edit-lightbox"
            role="presentation"
            onClick={closeModal}
          >
            <div
              className="content-edit-lightbox-panel content-edit-lightbox-panel-is-group"
              role="dialog"
              aria-modal="true"
              aria-labelledby={headingId}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="content-edit-lightbox-head">
                <h2 id={headingId} className="content-edit-lightbox-title">
                  {title || "Edit grouped content"}
                </h2>
                <p className="content-edit-lightbox-hint">
                  {fields.size} field{fields.size === 1 ? "" : "s"}
                </p>
              </div>
              <div className="content-edit-lightbox-fields">
                {Array.from(fields.values()).map((spec, index) => (
                  <div
                    key={spec.contentId}
                    className="content-edit-lightbox-field"
                  >
                    <label
                      className="content-edit-lightbox-label"
                      htmlFor={`${formBaseId}-${index}`}
                    >
                      {spec.editLabel}
                    </label>
                    <textarea
                      id={`${formBaseId}-${index}`}
                      className="content-edit-lightbox-textarea"
                      rows={spec.rows}
                      value={drafts[spec.contentId] ?? ""}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [spec.contentId]: event.target.value
                        }))
                      }
                    />
                  </div>
                ))}
              </div>
              <div className="content-edit-lightbox-actions">
                <button
                  type="button"
                  className="site-edit-button"
                  onClick={saveAll}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save all"}
                </button>
                <button
                  type="button"
                  className="site-edit-button is-secondary"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <EditableGroupContext.Provider value={ctx}>
      <div className={`editable-group${className ? ` ${className}` : ""}`}>
        {children}
        {showOverlay ? (
          <button
            type="button"
            className="editable-group-overlay"
            onClick={openModal}
            disabled={saving}
            aria-label={`Edit ${title || "this section"}`}
          />
        ) : null}
      </div>
      {lightbox}
    </EditableGroupContext.Provider>
  );
}

export function useEditableGroup() {
  return useContext(EditableGroupContext);
}
