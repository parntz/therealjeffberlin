"use client";

import { useContext, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { EditableGroupContext } from "./editable-group";

function humanizeContentId(contentId) {
  const part = contentId.split(".").pop() || contentId;
  return part
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[._-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function EditableTextClient({
  contentId,
  initialValue,
  as = "p",
  wrapperAs = "div",
  className = "",
  rows = 3,
  isAdminSignedIn = false,
  editLabel
}) {
  const [value, setValue] = useState(initialValue);
  const [draftValue, setDraftValue] = useState(initialValue);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const titleId = useId();
  const fieldDraftId = useId();
  const fieldKey = useId();
  const valueRef = useRef(value);
  valueRef.current = value;

  const groupCtx = useContext(EditableGroupContext);
  const inGroup = Boolean(groupCtx && isAdminSignedIn);

  const Tag = as;
  const Wrapper = wrapperAs;
  const Block = wrapperAs === "span" ? "span" : "div";

  const resolvedEditLabel = editLabel || humanizeContentId(contentId);

  useEffect(() => {
    setValue(initialValue);
    setDraftValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    setPortalReady(true);
  }, []);

  useEffect(() => {
    if (!inGroup || !groupCtx) {
      return undefined;
    }

    return groupCtx.registerField(fieldKey, {
      contentId,
      editLabel: resolvedEditLabel,
      rows,
      getValue: () => valueRef.current,
      setValue
    });
  }, [
    inGroup,
    groupCtx,
    fieldKey,
    contentId,
    resolvedEditLabel,
    rows,
    setValue
  ]);

  useEffect(() => {
    if (!modalOpen || inGroup) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        setDraftValue(value);
        setModalOpen(false);
      }
    }

    window.addEventListener("keydown", onKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeydown);
    };
  }, [modalOpen, inGroup, value]);

  function openModal() {
    setDraftValue(value);
    setModalOpen(true);
  }

  function closeModal() {
    setDraftValue(value);
    setModalOpen(false);
  }

  async function saveValue() {
    setSaving(true);

    try {
      const response = await fetch("/api/content/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ contentId, value: draftValue })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Save failed.");
      }

      setValue(payload.value);
      setDraftValue(payload.value);
      setModalOpen(false);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const showStandaloneOverlay = isAdminSignedIn && !inGroup;

  const lightbox =
    portalReady && modalOpen && !inGroup
      ? createPortal(
          <div
            className="content-edit-lightbox"
            role="presentation"
            onClick={closeModal}
          >
            <div
              className="content-edit-lightbox-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="content-edit-lightbox-head">
                <h2 id={titleId} className="content-edit-lightbox-title">
                  Edit site text
                </h2>
                <p className="content-edit-lightbox-id">{contentId}</p>
              </div>
              <label
                className="content-edit-lightbox-label"
                htmlFor={fieldDraftId}
              >
                {resolvedEditLabel}
              </label>
              <textarea
                id={fieldDraftId}
                className="content-edit-lightbox-textarea"
                rows={rows}
                value={draftValue}
                onChange={(event) => setDraftValue(event.target.value)}
              />
              <div className="content-edit-lightbox-actions">
                <button
                  type="button"
                  className="site-edit-button"
                  onClick={saveValue}
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save"}
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
    <>
      <Wrapper
        className={`editable-copy${wrapperAs === "span" ? " is-inline" : ""}`}
      >
        <Block
          className={
            wrapperAs === "span"
              ? "editable-copy-block is-inline"
              : "editable-copy-block"
          }
        >
          <Tag className={className}>{value}</Tag>
          {showStandaloneOverlay ? (
            <button
              type="button"
              className="editable-copy-overlay"
              onClick={openModal}
              disabled={saving}
              aria-label={`Edit ${resolvedEditLabel} (${contentId})`}
            />
          ) : null}
        </Block>
      </Wrapper>
      {lightbox}
    </>
  );
}
