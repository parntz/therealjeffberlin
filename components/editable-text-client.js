"use client";

import { useEffect, useState } from "react";

export default function EditableTextClient({
  contentId,
  initialValue,
  as = "p",
  wrapperAs = "div",
  className = "",
  rows = 3,
  isAdminSignedIn = false
}) {
  const [value, setValue] = useState(initialValue);
  const [draftValue, setDraftValue] = useState(initialValue);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const Tag = as;
  const Wrapper = wrapperAs;

  useEffect(() => {
    setValue(initialValue);
    setDraftValue(initialValue);
  }, [initialValue]);

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
      setEditing(false);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Wrapper
      className={`editable-copy${editing ? " is-editing" : ""}${wrapperAs === "span" ? " is-inline" : ""}`}
    >
      <Tag className={className}>{value}</Tag>
      {isAdminSignedIn ? (
        <div className="editable-copy-actions">
          <button
            type="button"
            className="site-edit-button"
            onClick={() => setEditing((current) => !current)}
            disabled={saving}
          >
            {editing ? "Close" : "Edit"}
          </button>
        </div>
      ) : null}
      {isAdminSignedIn && editing ? (
        <div className="editable-copy-form">
          <textarea
            rows={rows}
            value={draftValue}
            onChange={(event) => setDraftValue(event.target.value)}
          />
          <div className="editable-copy-form-actions">
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
              onClick={() => {
                setDraftValue(value);
                setEditing(false);
              }}
              disabled={saving}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : null}
    </Wrapper>
  );
}
