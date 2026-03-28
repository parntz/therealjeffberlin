"use client";

import { useState } from "react";
import EditableTextClient from "./editable-text-client";

export default function ContactForm({ isAdminSignedIn = false }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: ""
  });

  function updateField(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  async function submitRequest(event) {
    event.preventDefault();
    setSubmitError("");
    setSubmitSuccess("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/.netlify/functions/contact-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formValues)
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setSubmitError(
          payload.error || "The message could not be sent right now. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      setFormValues({
        name: "",
        email: "",
        subject: "",
        message: "",
        website: ""
      });
      setSubmitSuccess("Your message has been sent.");
    } catch {
      setSubmitError("The message could not be sent right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="contact-form-shell">
      <div className="lesson-booker-panel contact-panel">
        <EditableTextClient
          contentId="contact.page.eyebrow"
          initialValue="Contact"
          as="p"
          className="eyebrow"
          rows={2}
          isAdminSignedIn={isAdminSignedIn}
        />
        <EditableTextClient
          contentId="contact.page.title"
          initialValue="Send Jeff a message."
          as="h1"
          className="contact-page-title"
          rows={3}
          isAdminSignedIn={isAdminSignedIn}
        />
        <EditableTextClient
          contentId="contact.page.body"
          initialValue="Use the form below for questions about lessons, music, books, appearances, or general inquiries. Messages go directly to Jeff Berlin's inbox."
          as="p"
          className="lesson-booker-intro"
          rows={5}
          isAdminSignedIn={isAdminSignedIn}
        />

        <form className="lesson-request-form" onSubmit={submitRequest}>
          <div className="lesson-form-grid">
            <label>
              <span>Name</span>
              <input
                name="name"
                value={formValues.name}
                onChange={updateField}
                required
              />
            </label>
            <label>
              <span>Email</span>
              <input
                name="email"
                type="email"
                value={formValues.email}
                onChange={updateField}
                required
              />
            </label>
          </div>

          <label>
            <span>Subject</span>
            <input
              name="subject"
              value={formValues.subject}
              onChange={updateField}
              required
            />
          </label>

          <label>
            <span>Message</span>
            <textarea
              name="message"
              value={formValues.message}
              onChange={updateField}
              rows={8}
              required
            />
          </label>

          <label className="lesson-honeypot" aria-hidden="true">
            <span>Leave this field empty</span>
            <input
              name="website"
              value={formValues.website}
              onChange={updateField}
              tabIndex={-1}
              autoComplete="off"
            />
          </label>

          {submitSuccess ? (
            <p className="lesson-status lesson-status-success">{submitSuccess}</p>
          ) : null}

          {submitError ? (
            <p className="lesson-status lesson-status-error">{submitError}</p>
          ) : null}

          <button
            type="submit"
            className="button button-primary lesson-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Message..." : "Send Message"}
          </button>
        </form>
      </div>

      <div className="contact-management-panel">
        <p className="eyebrow">Management</p>
        <h2>Booking and management contact</h2>
        <p>
          For management, booking, and representation inquiries, use the direct
          contact details below.
        </p>
        <div className="contact-management-block">
          <a href="mailto:exhodosmanaging@gmail.com">exhodosmanaging@gmail.com</a>
          <a href="tel:+34616724564">+34-616724564</a>
        </div>
      </div>
    </div>
  );
}
