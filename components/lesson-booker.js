"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const SLOT_LABELS = [
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "5:00 PM"
];

function formatDay(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(date);
}

function formatFullDay(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function buildAvailableDays() {
  const days = [];
  const today = new Date();

  for (let offset = 1; days.length < 12 && offset < 30; offset += 1) {
    const date = new Date(today);
    date.setDate(today.getDate() + offset);

    const weekday = date.getDay();

    if (weekday === 0 || weekday === 6) {
      continue;
    }

    days.push({
      id: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
      label: formatDay(date),
      fullLabel: formatFullDay(date)
    });
  }

  return days;
}

export default function LessonBooker() {
  const router = useRouter();
  const days = useMemo(buildAvailableDays, []);
  const [selectedDay, setSelectedDay] = useState(days[0]?.id || "");
  const [selectedSlot, setSelectedSlot] = useState(SLOT_LABELS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    bassLevel: "",
    goals: ""
  });

  const activeDay = days.find((day) => day.id === selectedDay) || days[0];

  function updateField(event) {
    const { name, value } = event.target;
    setFormValues((current) => ({ ...current, [name]: value }));
  }

  async function submitRequest(event) {
    event.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/.netlify/functions/lesson-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...formValues,
          date: activeDay?.fullLabel || "",
          slot: selectedSlot,
          website: ""
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        setSubmitError(
          payload.error || "The request could not be sent right now. Please try again."
        );
        setIsSubmitting(false);
        return;
      }

      router.push("/lessons/success");
    } catch {
      setSubmitError("The request could not be sent right now. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="lesson-booker">
      <div className="lesson-booker-panel">
        <p className="eyebrow">Private Study</p>
        <h3>Choose a day, claim a slot, send the request.</h3>
        <p className="lesson-booker-intro">
          Pick the day and time that works best for you, then send the request.
          Jeff will follow up to confirm that the slot works for him and to
          arrange payment before the lesson is finalized.
        </p>

        <div className="lesson-day-grid">
          {days.map((day) => (
            <button
              key={day.id}
              type="button"
              className={`lesson-day-chip${day.id === selectedDay ? " is-active" : ""}`}
              onClick={() => setSelectedDay(day.id)}
            >
              {day.label}
            </button>
          ))}
        </div>

        <div className="lesson-slot-block">
          <div className="lesson-slot-header">
            <strong>{activeDay?.fullLabel}</strong>
            <span>All times shown in Central Time</span>
          </div>
          <div className="lesson-slot-grid">
            {SLOT_LABELS.map((slot) => (
              <button
                key={slot}
                type="button"
                className={`lesson-slot-chip${slot === selectedSlot ? " is-active" : ""}`}
                onClick={() => setSelectedSlot(slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>

        <form
          className="lesson-request-form"
          onSubmit={submitRequest}
        >
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
            <span>Current level</span>
            <input
              name="bassLevel"
              value={formValues.bassLevel}
              onChange={updateField}
              placeholder="Beginner, intermediate, advanced..."
              required
            />
          </label>

          <label>
            <span>What do you want to work on?</span>
            <textarea
              name="goals"
              value={formValues.goals}
              onChange={updateField}
              rows={5}
              placeholder="Reading, time, walking lines, harmony, technique..."
              required
            />
          </label>

          <label className="lesson-honeypot" aria-hidden="true">
            <span>Leave this field empty</span>
            <input name="website" tabIndex={-1} autoComplete="off" />
          </label>

          {submitError ? (
            <p className="lesson-status lesson-status-error">{submitError}</p>
          ) : null}

          <button
            type="submit"
            className="button button-primary lesson-submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending Request..." : "Send Lesson Request"}
          </button>
        </form>
      </div>
    </div>
  );
}
